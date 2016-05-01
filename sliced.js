(function () {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      console.log("ready");
      var drag = d3.behavior.drag();
      var selection = d3.select(".image").data([{ x: 0, y: 0 }]);

      selection.call(drag);
      // selection.attr("cx", 0).attr("cy", 0);

      selection.style({ position: "absolute" });
      // drag.origin();

      drag.on("drag", function () {
        // var pos = $('.image').position();
        // debugger
        selection.style({
          top: function (d) {
            d.y += d3.event.dy;
            return d.y+"px";
          },
          left: function (d) {
            d.x += d3.event.dx;
            return d.x+"px";
          }
        });
      }).bind(selection);
      // debugger
    }
  }
})();
