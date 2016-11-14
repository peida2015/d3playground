"use strict";
(function () {
  if (window._tiles === undefined) {
    window._tiles = {};
  }

  var tiles = _tiles.Tiles = function (tiles, tileWidth, tileHeight) {
    this.tiles = tiles;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    var that = this;

    // private
    var moveToSpot = function (tile, idx) {
      d3.select(this)
      .transition().style({
        top: (Math.floor(idx/15)-tile.row)*(that.tileHeight+1)+"px",
        left: (idx%15-tile.col)*(that.tileWidth+1)+"px"
      })
      .duration(0);
    };

    // public but not in prototype
    this.scrambleTiles = function () {
      d3.shuffle(this.tiles[0]);

      var that = this;
      this.tiles.each(moveToSpot);
    };

    this.quickSortUnscramble = function (left, right) {
      if (left === undefined) { var left = 0; }
      if (right === undefined) { var right = this.tiles[0].length-1; }
      if (right - left <= 0) { return; }

      var stIdx = left, endIdx = right;

      var that = this;

      // use the first tile as the pivot and assign it ".pivot"
      var pivot = d3.select(that.tiles[0][left]);
      pivot.classed("pivot", true);

      // left is the current index of pivot, which should tightly follow left.
      var pivotId = pivot.datum().id;

      var partition = function () {
        var nextTile = that.tiles[0][left+1];
        var leftId = nextTile.__data__.id;

        var swap = function (leftIdx, rightIdx){
          var a = that.tiles[0][leftIdx];
          var b = that.tiles[0][rightIdx];

          // swap the displayed position by changing top and left values in style properties
          moveToSpot.call(b, b.__data__, leftIdx);
          moveToSpot.call(a, a.__data__, rightIdx);

          // swap within d3 array of nodes
          that.tiles[0][leftIdx] = b;
          that.tiles[0][rightIdx] = a;
        };

        if (leftId < pivotId) {
          swap(left, left+1);

          left++;
        } else {
          swap(left+1, right);

          if (right > left) { right--; };
        };

        if (right <= left) {
          clearInterval(loop);
          // recursiveCall only after the last swap of the partition function has finished.
          recursiveCall();
        };
      };

      var loop = setInterval(partition, 0);

      // recursiveCall on the left portion and then the right portion.
      var recursiveCall = function () {
        setTimeout(function () {
          that.quickSortUnscramble(left+1, endIdx);
          that.quickSortUnscramble(stIdx, left-1);
          setTimeout(function () {
            pivot.classed('pivot', false);
          }, 0);
        }, 0);
      };

    };
  };

  tiles.prototype = {
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
         .duration(3500);
    },

    slowlyUnscramble2: function () {
      // Implementation of the "Grab and Append" method
      var collection = this.tiles;

      // Return to rectangular shape first (2s)
      this.slowlyReturnToShape();

      var counter = 0;
      collection.transition().tween("sort", function (d,i) {
        var itpl = d3.interpolateRound(1E-6, collection[0].length);

        return function (t) {
          if (d.id === counter && d.id <= itpl(t)) {
            counter++;
            var that = this;
            d3.select(".image").append(function () {
              return that;
            });
          }
          };
      }).ease("cub-in")
      // Delay 2s to let slowlyReturnToShape() finish first
      .delay(2000)
      .duration(5000);
    },

    linearlyUnscramble: function () {
      // This doesn't work, just here to show the difference.
      var collection = this.tiles;

      // Return to rectangular shape first (2s)
      this.slowlyReturnToShape();

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
      }).ease("linear")
      // Delay 2s to let slowlyReturnToShape() finish first
      .delay(2000)
      .duration(5000);
    },

    slowlyReturnToShape: function () {
      // if it takes 20s to slowlyUnscramble, slowlyReturnToShape needs a 20s delay
      this.tiles.transition().style({
              top: 0+"px",
              left: 0+"px"
            })
            .duration(200)
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
