;(function () {
  document.onreadystatechange = function() {
    if (document.readyState == "complete") {
      function iframeResize(e = null) {
        var frame = document.querySelector('iframe');

        frame.src = e === null ? './pic_scrambler.html' : e.target.dataset.url;

        frame.onload = function () {
            frame.contentDocument.body.clientHeight < 480 ? frame.height = 510 : frame.height = frame.contentDocument.body.clientHeight+40;
        }
      };

      var toggleMenu = function (e) {
        if (e.target !== e.currentTarget) {
          var tabs = e.currentTarget.children;
          for (var i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove("current");
          }
          e.target.classList.add('current');
          iframeResize(e);
        }

      };

      var tabs = document.querySelector('.tabs-holder')
      tabs.addEventListener('click', toggleMenu, true);
      // initial resizing
      iframeResize();
    }
  }
})();
