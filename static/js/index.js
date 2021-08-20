/**
 * Title: Mi Visible Watcher
 * Author: Sivan
 * Date: 2015-07-24 12:07
 * Description: 检查版块在视窗里的能见度，并执行相应回调。
 */

// 目前只支持 $(window) 的滚动事件，后期增加任意 DOM（如 <div>）的滚动事件支持及横向滚动支持。
//

(function($) {
  function visibleWatcher(opt) {
    //var isWindow;
    var $sections = $(this);
    var curIndex = -1;
    var sectionPosArr = [];
    var defaults, options;

    function getCurrentSection() {
      var index = -1;
      var pos = $(document).scrollTop();

      for (var i = 0, len = sectionPosArr.length; i < len; i += 1) {
        if (pos + options.viewport.height() > sectionPosArr[i]) {
          index += 1;
        } else {
          break;
        }
      }

      return index;
    }

    function refresh() {
      var viewIndex = getCurrentSection();

      if (curIndex !== viewIndex) {
        curIndex = viewIndex;

        $sections.filter(function(i) {
          return i <= curIndex && !$(this).hasClass(options.visibleClass);
        }).addClass(options.visibleClass).trigger('visible.visibleWatcher');

        options.onVisible($sections.eq(curIndex), curIndex);
      }
    }

    function init() {
      //if (isWindow) { console.log($elm.length); }

      // 为各版块计算位置
      $sections.each(function() {
        var offsetValue = $(this).attr('data-offset') ? Number($(this).attr('data-offset')) : options.offset;
        var visibleOffset = offsetValue % 1 === 0 ? offsetValue : offsetValue * options.viewport.height();

        sectionPosArr.push($(this).offset().top + visibleOffset);
      });

      refresh();
      options.onLoad();
    }

    // 合并选项
    defaults = {
      viewport: $(window), // 视窗位置
      visibleClass: 'is-visible', // 版块可见时增加的 class
      offset: 300, // 默认偏移量，单位是 px，如果传入 0.5 则转化为 50% viewport 高度
      onLoad: $.noop,
      onVisible: $.noop
    };
    options = $.extend({}, defaults, opt);

    // 容器是否是 window
    //isWindow = options.viewport.is($(window)) ? true : false;

    init();
    options.viewport.on({
      'scroll.visibleWatcher': refresh,
      'resize.visibleWatcher': init
    });
  }

  $.fn.visibleWatcher = function(opt) {
    visibleWatcher.call(this, opt);
    return this;
  };
})(jQuery);


jQuery(function($) {

  var $wrap = $('#J_sectionItems'); //最外层js选择器
  var $sections = $('.section-items', $wrap);
  var preloadLength = 1;

  // 懒加载
  $sections.visibleWatcher({
    visibleClass:'mj-active',   //可见区域添加的class
    onVisible: function(elm, index) {
      $sections.filter(function(i) {

        return i <= index + preloadLength;
      }).addClass('preload').find('img, video').each(function() {
        var _this = $(this);
        if (!_this.hasClass('is-preload')) {
          _this.attr('src', _this.data('src')).addClass('is-preload');
        }
      });
    }
  });

  // 轮播图 1
  $('#Js_tabs').mjTabs({
    autoPlay: 4000,
    navTips: ['火锅', '蒸煮', '汤锅', '炒菜', '煎炸']
  });

  // 轮播图 2
  $('#Js_tabs_imgs').mjTabs({
    autoPlay: 4000
  });

  $(window).scroll(function() {
    if ($('.cooker-13').hasClass('mj-active')) {
      $('.items-3-v0')[0].play();
    }
  });

  // 轮播图 3
  var $videoList = $('#Js_videoList');
  var $videoListItems = $videoList.find('.video-items');
  var $videoListPos = $videoList.find('.video-position');

  // 循环定位点
  $videoListPos.html('');
  $videoListItems.each(function(k) {
    if (k) {
      $videoListPos.append('<a class="pager"></a>');
    } else {
      $videoListPos.append('<a class="pager pager-active"></a>');
    }
  });

  // 点击定位点
  $videoListPos.find('.pager').click(function() {
    var _this = $(this);
    var _index = _this.index();
    var $itemsIndex = $videoListItems.eq(_index);
    var $itemsLastVideo = $('.items-3-v');
    if (_this.hasClass('pager-active')) {
      return;
    } else {
      _this.addClass('pager-active').siblings().removeClass('pager-active');
      $itemsIndex.addClass('video-items-active').siblings().removeClass('video-items-active');
      $itemsIndex.find('video')[0].play();
      if (_index === 2) {
        $('.items-3-v1')[0].addEventListener('ended', function() {
          $itemsLastVideo.addClass('v-active');
        });
      } else {
        $itemsLastVideo.removeClass('v-active');
      }
    }
  });

});
