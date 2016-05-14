;(function () {
  document.onreadystatechange = function() {
    if (document.readyState == "complete") {
      var toggleMenu = function (e) {
        var frame = document.querySelector('iframe');
        frame.src = e.target.dataset.url;

        setTimeout(function () {
          if (frame.contentDocument.readyState ==='complete') {
            frame.contentDocument.body.scrollHeight < 480 ? frame.height = 510 : frame.height = frame.contentDocument.body.scrollHeight+30;
          }
        }, 250)

        if (e.target !== e.currentTarget) {
          var tabs = e.currentTarget.children;
          for (var i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove("current");
          }
          e.target.classList.add('current');
        }
      };

      var tabs = document.querySelector('.tabs-holder')
      tabs.addEventListener('click', toggleMenu, true);

    }
  }
})();
