(function($) {
  'use strict';

  $.fn.mjTabs = function(opts) {

    var opt = $.extend({
      mjItems:'.mj-tabs-items',

      //定位点
      mjPosition:'.mj-tabs-position',

      //上下切换
      mjUpdown:'.mj-tabs-updown',

      //导航内容
      navTips:[],

      //切换类型 fade 渐变(默认) slide 位移
      effect:'fade',

      //视图分布 在 slide 下才可以使用 默认 false
      view: false,

      //开启自动播放 禁止播放是 0 这个参数也是自动播放时间
      autoPlay:0,

      //设置样式控制宽度高度
      style:{}
    }, opts);

    var _this = this;
    var cur = 0;
    var timer = null;
    var itemsLength = _this.find(opt.mjItems).length;
    var itemsLengths = itemsLength - 1;

    //添加定位点
    _this.each(function() {
      var $t = $(this);

      //设置宽度高度 定位点
      $t.css(opt.style);
      $(this).find(opt.mjItems).each(function(index) {
        var nText = opt.navTips[index];
        $t.find(opt.mjPosition).append(
          '<a href="javascript:;" class="pager pager-' + index + '"><span>' + nText + '</span></a>'
        );
        $t.find('.pager').eq(0).addClass('cur');
      });
    });

    var _thisWidth = $(_this).width();
    var _thisHeight = $(_this).height();

    // 自动播放
    function mjAutoMove(index) {
      clearInterval(timer);
      timer = setInterval(function() {
        cur = cur === index ? 0 : cur + 1;
        mjTabsMove(cur);
      }, opt.autoPlay);
      return false;
    }

    // 开启自动播放
    if (opt.autoPlay) {
      mjAutoMove(itemsLengths);

      //鼠标移出 tab 区域开启定时器
      _this.mouseleave(function() {
        mjAutoMove(itemsLengths);
      });
    }

    //定位点点击
    _this.find('.pager').click(function() {

      if ($(this).hasClass('cur')) return false;
      clearInterval(timer);
      cur = $(this).index();
      mjTabsMove(cur);
    });

    //上一张 下一张
    _this.find(opt.mjUpdown).click(function() {
      if (_this.find(opt.mjItems).is(':animated')) {
        return false;
      }

      //清除自定播放
      clearInterval(timer);

      // 判断点击 "prev" or "next"
      var type = $(this).attr('data-attr');
      var itemsLengthsView = opt.view ? itemsLengths - opt.view : itemsLengths;
      switch (type){
        case 'next':
          cur = cur === itemsLengthsView ? 0 : cur + 1;
          break;
        case 'prev':
          cur = cur === 0 ? itemsLengthsView : cur - 1;
          break;
      }
      mjTabsMove(cur);
    });

    // 设置运动效果 布局
    switch (opt.effect){
      case 'fade':
        _this.find(opt.mjItems).hide().css({
          position:'absolute',
          opacity:0
        }).eq(0).show().css({
          opacity:1,
          zIndex:10
        });
        break;
      case 'slide':
        _this.find('ul').css({width:_thisWidth * itemsLength});

        // 判断是否有 视图拆分
        _thisWidth = opt.view ? _thisWidth / opt.view : _thisWidth;
        _this.find(opt.mjItems).show().css({
          position:'relative',
          width:_thisWidth,
          height:_thisHeight
        });
        break;
    }

    // 运动
    function mjTabsMove(index) {
      if (_this.find(opt.mjItems).is(':animated')) {
        return false;
      }
      switch (opt.effect){
        case 'fade':
          _this.find(opt.mjItems)
            .css('z-index', 0)
            .removeClass('mj-tabs-active')
            .eq(index)
            .show()
            .addClass('mj-tabs-active')
            .css('z-index', 10)
            .animate({
              opacity:1
            }, opt.mjSpeed, function() {
              _this.find(opt.mjItems).eq(index).siblings().hide().css({opacity:0});
            });
          break;
        case 'slide':
          _this.find('ul').animate({
            left:-_thisWidth * index
          });
          break;
      }

      //选择定位点当前位置
      _this.find('.pager').removeClass('cur').eq(index).addClass('cur');
    }
  };

})(jQuery);

