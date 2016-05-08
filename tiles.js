; (function () {
  if (window._tiles === undefined) {
    window._tiles = {};
  }

  var tiles = _tiles.Tiles = function (tiles) {
    this.tiles = tiles;
  }

  tiles.prototype = {
    scrambleTiles: function () {
      d3.shuffle(this.tiles[0]);

      this.tiles.each(function () {
        var tile = this;
        d3.select(".image").append(function () {
          return tile;
        });
      });
    },

    unscrambleTiles: function () {
      this.tiles[0].sort(function (a,b) {
        return a.__data__.id - b.__data__.id
      }).forEach(function (el) {
        return d3.select(".image").append(function () {
          return el;
        });
      })
      this.slowlyReturnToShape();
    },

    slowlyUnscramble: function () {
      var collection = this.tiles;

      // Return to rectangular shape first (2s)
      this.slowlyReturnToShape();

      // Delay 2s to let slowlyReturnToShape() finish first
      collection.transition().tween("sort", function (d,i) {
        var itpl = d3.interpolateRound(d.id-5, d.id);
        return function (t) {

          if (d.id === i) { return; }

          this.parentNode.insertBefore(this, collection.filter(function (datum2, i) {
            var val = itpl(t);

            if (val === d.id) { d.inOrder = true; }
            return datum2.id === val+1;
          }).node());
        }
      }).ease("elastic")
      .delay(2000)
      .duration(3000);
    },

    slowlyReturnToShape: function () {
      // if it takes 20s to slowlyUnscramble, slowlyReturnToShape needs a 20s delay
      this.tiles.transition().style({
              top: 0+"px",
              left: 0+"px"
            })
            .duration(2000)
      // .delay(20000);
    },

    returnToShape: function () {
      this.tiles.style({ top: "", left: ""});
    },

    removeBorder: function () {
      this.tiles.style({ border: "0px" });
    }
  }
})();
