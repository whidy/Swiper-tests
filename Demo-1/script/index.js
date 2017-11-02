// var currentIndex;
// var currentSlider;
var sitePath, contentPath = '';
var SITE_LOCATION = document.location;
if (SITE_LOCATION.pathname.indexOf('ybj-open') == 1) {
  contentPath = '/ybj-open';
} else {
  contentPath = '';
}
var policyNo = qUrl('policyNo');
$('[name=policyNo]').val(policyNo);

function qUrl(key) {
  var uri = window.location.search;
  var re = new RegExp("" + key + "=([^&?]*)", "ig");
  return ((uri.match(re)) ? (uri.match(re)[0].substr(key.length + 1)) : null);
}

$('.pop-close').on('click', function () {
  $('.poplayer, .popcontent').hide();
})
$('#Jpop').on('click', function () {
  $('.poplayer, .popcontent').show();
})

$('.swiper-arrow').on('click', function () {
  mySwiper.slideNext();
})

// 图片加载完成后再执行swiper
function loader(items, thingToDo, allDone) {
  if (!items) {
    return;
  }

  if ("undefined" === items.length) {
    items = [items];
  }

  var count = items.length;

  var thingToDoCompleted = function (items, i) {
    count--;
    if (0 == count) {
      allDone(items);
    }
  };

  for (var i = 0; i < items.length; i++) {
    thingToDo(items, i, thingToDoCompleted);
  }
}

function loadImage(items, i, onComplete) {
  var onLoad = function (e) {
    e.target.removeEventListener("load", onLoad);
    onComplete(items, i);
  }
  var img = new Image();
  img.addEventListener("load", onLoad, false);
  img.src = items[i];
}

var items = [];
$.each($('img'), function (indexInArray, valueOfElement) {
  items.push($(this).attr('src'));
});

loader(items, loadImage, function () {
  // console.log("done");
  $('#loading').remove();

  var $tempDiv = $('<div class="page" />');
  $('body').append($tempDiv);
  $.each($('.swiper-slide'), function (indexInArray, valueOfElement) {
    var $this = $(this);
    $tempDiv.html($this.html());
    // console.log($tempDiv.height());
    $this.attr('realheight', $tempDiv.height());
    $tempDiv.html('');
  });
  var mySwiper = new Swiper('.swiper-container', {
    direction: 'vertical',
    on: {
      init: function () {
        var $currentSlide = $('.swiper-slide').eq(this.activeIndex);
        var contentHeight = parseInt($currentSlide.attr('realheight'));
        if (contentHeight < this.height) {
          $currentSlide.find('.page').height(this.height);
        }
      }
    }
    // initialSlide: 2,

  });
  mySwiper.on('slideChangeTransitionStart', function () {
    // console.log(this.touches.diff);
    // var touchMoveDistance = this.touches.diff;

    // console.log('startIndex' + this.activeIndex);
    var $currentSlide = $('.swiper-slide').eq(mySwiper.activeIndex);
    // console.log($('.swiper-slide-' + (mySwiper.activeIndex + 1)));
    var contentHeight = parseInt($currentSlide.attr('realheight'));
    if (contentHeight < mySwiper.height) {
      $currentSlide.find('.page').height(mySwiper.height);
    }
    if (contentHeight > mySwiper.height) {
      $currentSlide.animate({
        scrollTop: 0
      }, 500);
      $currentSlide.unbind('scroll');
      $currentSlide.css('overflow', 'auto');

      mySwiper.allowTouchMove = false;
      console.log(contentHeight, mySwiper.height)

      $currentSlide.bind('scroll', function () {
        var $this = $(this);
        // console.log($this.scrollTop() - (contentHeight - mySwiper.height));
        if ($this.scrollTop() - (contentHeight - mySwiper.height) > -3) {
          //到达该屏底部检测
          // console.log('到达该屏底部');
          // mySwiper.allowTouchMove = true;
          // var myElement = document.getElementById('Jswiper');
          setTimeout(function () {
            mySwiper.allowTouchMove = true;
          }, 300);

        }
        if ($this.scrollTop() == 0) {
          //到达该屏顶部检测
          // console.log('到达该屏顶部');
          // mySwiper.allowTouchMove = true;
          setTimeout(function () {
            mySwiper.allowTouchMove = true;
          }, 300);
        }
      })
    }
  })
  mySwiper.on('slideChangeTransitionEnd', function () {
    // console.log('endIndex' + this.activeIndex)

    if (this.activeIndex == (mySwiper.$wrapperEl[0].children.length - 1)) {
      $('.swiper-arrow').hide();
      mySwiper.allowTouchMove = false;
    } else {
      $('.swiper-arrow').show();
      // mySwiper.allowTouchMove = true;
    }

    if (this.activeIndex == 4) {
      if (policyNo == null || policyNo.length == 0) {
        return false;
      }
      if ($('[name=focusFamily]:checked').length == 0 && $('[name=securitySelect]:checked').length == 0) {
        return false;
      }
      $.ajax({
        type: "POST",
        url: contentPath + '/updateUserInfo',
        data: $('#form').serialize(),
        success: function (data) {
          console.log(data);
        },
        error: function () {
          console.log('error')
        }
      });
    }

  })


  // mySwiper.on('touchMove ', function() {
  //   console.log(this.touches.diff);
  // })
});
