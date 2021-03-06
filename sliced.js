(function () {

  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      console.log("ready");

      var imageSource = "http://cdn2.justdogbreeds.com/justdogbreeds-cdn/photos/plog-content/thumbs/dog-breeds/golden-retriever/large/2955-golden-retriever-75.jpg";

      var image = new Image();
      image.src = imageSource;
      var width = image.width, height = image.height;

      var drag = d3.behavior.drag().origin(function (d) {
        return {x: this.offsetLeft, y:this.offsetTop };
      });
      var tileWidth = Math.floor(width/10);
      var tileHeight = Math.floor(height/10);

      var row = d3.select('.image')
      .selectAll(".row")
      .data(d3.range(10).map(function (d) {return d; }))
      .enter().append("div").classed("row", true)
      .style({ height: tileHeight+"px" } );

      var tile = row.selectAll(".tile")
        .data(d3.range(10).map(function (d) { return d; }))
        .enter().append("div").classed("tile", true)
        .style({ height: tileHeight+"px", width: tileWidth+"px",
            backgroundPosition: function (col, i, row) {
              return this.style.backgroundPosition = -col*tileWidth+"px "+-row*tileHeight+"px";
          }});

      tile.call(drag);
      tile.style({ position: "relative" });
      drag.on("drag", function (d) {

        if (this.style.left === "") {
          this.style.left = d3.event.dx+"px";
        } else {
          this.style.left = parseInt(this.style.left)+ d3.event.dx +"px";
        }

        if (this.style.top === "") {
          this.style.top = d3.event.dy+"px";
        } else {
          this.style.top = parseInt(this.style.top)+ d3.event.dy +"px";
        }
      });

    }
  }
})();
