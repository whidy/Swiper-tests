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

var mySwiper = new Swiper('.swiper-container', {
  direction: 'vertical'
});

var startScroll, touchStart, touchCurrent;
mySwiper.slides.on('touchstart', function (e) {
  startScroll = this.scrollTop;
  touchStart = e.targetTouches[0].pageY;
}, true);
mySwiper.slides.on('touchmove', function (e) {
  touchCurrent = e.targetTouches[0].pageY;
  var touchesDiff = touchCurrent - touchStart;
  var slide = this;
  var onlyScrolling =
    (slide.scrollHeight > slide.offsetHeight) &&
    (
      (touchesDiff < 0 && startScroll === 0) ||
      (touchesDiff > 0 && startScroll === (slide.scrollHeight - slide.offsetHeight)) ||
      (startScroll > 0 && startScroll < (slide.scrollHeight - slide.offsetHeight))
    );
  if (onlyScrolling) {
    e.stopPropagation();
  }
}, true);
mySwiper.on('slideChangeTransitionEnd', function () {
  if (this.activeIndex == (mySwiper.$wrapperEl[0].children.length - 1)) {
    $('.swiper-arrow').hide();
  } else {
    $('.swiper-arrow').show();
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
$('.swiper-arrow').on('click', function () {
  mySwiper.slideNext();
})

$('.pop-close').on('click', function () {
  $('.poplayer, .popcontent').hide();
})
$('#Jpop').on('click', function () {
  $('.poplayer, .popcontent').show();
})