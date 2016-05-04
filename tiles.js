; (function () {
  if (window._tiles === undefined) {
    window._tiles = {};
  }

  var tiles = _tiles.Tiles = function (tiles) {
    this.tiles = tiles;
  }

  tiles.prototype = {
    scrambleTiles: function () {
      d3.shuffle(this.tiles[0]).forEach(function (el) {
        return d3.select(".image").append(function () {
          return el;
        });
      });
    },

    unscrambleTiles: function () {
      this.tiles[0].sort(function (a,b) {
        return a.__data__.id > b.__data__.id
      }).forEach(function (el) {
        return d3.select(".image").append(function () {
          return el;
        });
      })
    },
  }
})();
