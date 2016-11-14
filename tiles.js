"use strict";
(function () {
  if (window._tiles === undefined) {
    window._tiles = {};
  }

  var tiles = _tiles.Tiles = function (tiles, tileWidth, tileHeight) {
    this.tiles = tiles;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.displayMode = 1; /* 1 for TopLeft; 2 for DOMOrder */
    var that = this;

    // private
    var moveToSpot = function (tile, idx, moveDuration) {
      if (moveDuration === undefined) { moveDuration = 0; }
      d3.select(this)
      .transition().style({
        top: (Math.floor(idx/15)-tile.row)*(that.tileHeight+1)+"px",
        left: (idx%15-tile.col)*(that.tileWidth+1)+"px"
      })
      .duration(moveDuration);
    };

    // public but not in prototype
    this.scrambleTiles = function () {
      d3.shuffle(this.tiles[0]);
      if (this.displayMode === 1) {
        this.tiles.each(moveToSpot);
      } else {
        this.tiles.each(function () {
          var tile = this;
          d3.select(".image").append(function () {
            return tile;
          });
        });
      };
    };

    this.quickSortUnscramble = function (left, right, moveDuration) {
      if (moveDuration === undefined) { moveDuration = 0; }
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
          moveToSpot.call(b, b.__data__, leftIdx, moveDuration);
          moveToSpot.call(a, a.__data__, rightIdx, moveDuration);

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

      var loop = setInterval(partition, moveDuration);

      // recursiveCall on the left portion and then the right portion.
      var recursiveCall = function () {
        setTimeout(function () {
          that.quickSortUnscramble(left+1, endIdx, moveDuration);
          that.quickSortUnscramble(stIdx, left-1, moveDuration);
          setTimeout(function () {
            pivot.classed('pivot', false);
          }, 0);
        }, 0);
      };

    };

    this.DOMOrderToTopLeft = function () {
      // move tiles to the right spots before removal to preserve the current position
      this.tiles.each(moveToSpot);

      // Remove tiles in DOM and append ordered tiles
      this.tiles.remove();
      var sorted = this.tiles[0].slice(0).sort(function (a,b) {
        return a.__data__.id - b.__data__.id;
      });

      sorted.forEach(function (tile, idx) {
        return d3.select('.image').append(function () {
          return tile;
        });
      });

      this.displayMode = 1;
    };

    this.TopLeftToDOMOrder = function () {
      this.tiles.remove();
      this.tiles.each(function (tile,idx){
        var that = this;
        return d3.select('.image').append(function () {
          return that;
        });
      });
      this.zeroTopLeft();

      this.displayMode = 2;
    };

    this.unscrambleTiles = function () {
      // Sort d3 array;
      var sorted = this.tiles[0].sort(function (a, b) {
        return a.__data__.id - b.__data__.id;
      });

      if (this.displayMode === 1) {
        this.tiles.each(moveToSpot);
      } else {
        // Put tiles in DOM in order
        sorted.forEach(function (el) {
          return d3.select(".image").append(function () {
            return el;
          });
        });
        this.zeroTopLeft(); /* zero top and left values */
      }
    };
  };

  tiles.prototype = {

    slowlyUnscramble: function () {
        if (this.displayMode === 1) {
          this.TopLeftToDOMOrder();
        };

        var collection = this.tiles;

        // Return to rectangular shape first (2s)
        this.slowlyZeroTopLeft();

        // Delay 2s to let slowlyZeroTopLeft() finish first
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
      if (this.displayMode === 1) {
        this.TopLeftToDOMOrder();
      };
      // Implementation of the "Grab and Append" method
      var collection = this.tiles;

      // Return to rectangular shape first (2s)
      this.slowlyZeroTopLeft();

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
      // Delay 2s to let slowlyZeroTopLeft() finish first
      .delay(2000)
      .duration(5000);
    },

    linearlyUnscramble: function () {
      if (this.displayMode === 1) {
        this.TopLeftToDOMOrder();
      };
      // This doesn't work, just here to show the difference.
      var collection = this.tiles;

      // Return to rectangular shape first (2s)
      this.slowlyZeroTopLeft();

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
      // Delay 2s to let slowlyZeroTopLeft() finish first
      .delay(2000)
      .duration(5000);
    },

    slowlyZeroTopLeft: function () {
      // if it takes 20s to slowlyUnscramble, slowlyZeroTopLeft needs a 20s delay
      this.tiles.transition().style({
              top: 0+"px",
              left: 0+"px"
            })
            .duration(200)
      // .delay(20000);
    },

    zeroTopLeft: function () {
      this.tiles.style({ top: "", left: ""});
    },

    removeBorder: function () {
      this.tiles.style({ border: "0px" });
    },

    initiateQuicksort: function (moveDuration) {
      if (this.displayMode === 2) {
        this.DOMOrderToTopLeft();
        that.quickSortUnscramble(undefined, undefined, moveDuration);
      } else {
        this.quickSortUnscramble(undefined, undefined, moveDuration);
      };
    }

  }
})();
