window.addEventListener('load', function () {
  'use strict';

  var CUR_ZI = 'zoom-in';
  var CUR_ZO = 'zoom-out';

  var imgContainers = document.querySelectorAll('[data-zoom]');

  imgContainers.forEach(function (imgContainer) {
    var img = imgContainer.querySelector('img');
    var config = imgContainer.dataset;

    if (img) {
      img.style.cursor = CUR_ZI;
      imgContainer.style.overflow = 'hidden';

      img.addEventListener('mousemove', function (e) {
        var x = e.layerX;
        var y = e.layerY;
        var w = img.offsetWidth;
        var h = img.offsetHeight;
        var originX = x / w * 100;
        var originY = y / h * 100;

        img.style.transformOrigin = originX + '% ' + originY + '%';
      });

      imgContainer.addEventListener('click', function () {
        var maxValue = parseInt(config.zoomMax || 1) + 1;
        var currValue = parseInt(config.zoomValue || 1);
        var nextValue = currValue + 1;

        if (nextValue > maxValue) {
          img.style.transform = 'scale(1)';
          img.style.cursor = CUR_ZI;
          imgContainer.setAttribute('data-zoom-value', '1');
        } else {
          img.style.transform = 'scale(' + nextValue + ')';
          imgContainer.setAttribute('data-zoom-value', nextValue);

          if (nextValue === maxValue) {
            img.style.cursor = CUR_ZO;
          }
        }
      });
    }
  });
});