(function () {

  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      console.log("ready");

      var imageSource = "http://cdn2.justdogbreeds.com/justdogbreeds-cdn/photos/plog-content/thumbs/dog-breeds/golden-retriever/large/2955-golden-retriever-75.jpg";

      var image = new Image();
      image.src = imageSource;
      var width = image.width, height = image.height;

      var tileWidth = Math.floor(width/10);
      var tileHeight = Math.floor(height/10);

      d3.select(".image").style({width: width+"px"});

      var tile = d3.select(".image").selectAll(".tile")
        .data(d3.range(100).map(function (d) {
          return { row: Math.floor(d/10), col: d%10, id: d }; }))
        .enter().append("div").classed("tile", true)
        .style({ height: tileHeight+"px", width: tileWidth+"px",
            backgroundPosition: function (d) {
              return this.style.backgroundPosition = -d.col*tileWidth+"px "+-d.row*tileHeight+"px";
          }});

      var drag = d3.behavior.drag().origin(function (d) {
        return {x: this.offsetLeft, y:this.offsetTop };
      });

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
      // debugger

      function scrambleTiles (tiles) {
        tiles.remove();
        d3.shuffle(tiles[0]).forEach(function (el) {
          return d3.select(".image").append(function () {
            return el;
          });
        });
      }
      scrambleTiles(tile);
    }
  }
})();
