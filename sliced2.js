(function () {

  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      console.log("ready");

      var imageSource = "http://cdn2.justdogbreeds.com/justdogbreeds-cdn/photos/plog-content/thumbs/dog-breeds/golden-retriever/large/2955-golden-retriever-75.jpg";

      var image = new Image();
      image.src = imageSource;
      var width = image.width, height = image.height;

      var tileWidth = Math.floor(width/4);
      var tileWidth = Math.floor(width/4);
      var tileHeight = Math.floor(height/4);

      d3.select(".image").style({width: 14+width+"px"});

      var tiles = d3.select(".image").selectAll(".tile")
        .data(d3.range(16).map(function (d) {
          return { row: Math.floor(d/4), col: d%4, id: d }; }))
        .enter().append("div").classed("tile", true)
        .style({ height: tileHeight+"px", width: tileWidth+"px",
            backgroundPosition: function (d) {
              return this.style.backgroundPosition = -d.col*tileWidth+"px "+-d.row*tileHeight+"px";
          }});


      var drag = d3.behavior.drag();


      tiles.call(drag);
      tiles.style({ position: "relative" });
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

      drag.on("dragstart", function () { return this.classList.add("dragging"); });
      drag.on("dragend", function () {
        var that = this;

        tiles.tiles[0].forEach(function (tile) {
          if (tile === that) return;

          var tileRect = tile.getBoundingClientRect();
          var thisRect = that.getBoundingClientRect();

          // Collision-detection
          if ((thisRect.left < tileRect.right && thisRect.right > tileRect.left) && (thisRect.top < tileRect.bottom && thisRect.bottom > tileRect.top)) {
            tile.classList.remove("just-dropped");
          }
        });
        that.classList.remove("dragging");
        that.classList.add("just-dropped");
      });

      tiles = new _tiles.Tiles(tiles);

      _tiles.tiles = tiles;
      tiles.scrambleTiles();

    }
  }

})();
