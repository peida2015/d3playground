;(function () {
  document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
      // debugger
      var admDates = dates.map(function (state) {
        return [state[0], new Date(state[1])];
      })

      var margins = { top:30, bottom: 20, left: 20, right: 20 }
      var width = 800;
      var height = 600;
      var svg = d3.select('body').append("svg")
          .attr("width", width + margins.left + margins.right)
          .attr("height", height + margins.top + margins.bottom);


      var timeline = d3.time.scale()
      // .domain(admDates.map(function (state) { return state[1]; }))
      // .range(admDates.map(function (state) { return state[0]; }));
      .domain([admDates[0][1],admDates[49][1]])
      .range([0, width-margins.left-margins.right]);

      var xAxis = d3.svg.axis().scale(timeline).ticks(35).tickSize(3).tickPadding(8);
      svg.append('g')
        .attr("class", "x-axis")
        .attr("transform", "translate("+(margins.left+margins.right)+","+ (height-margins.bottom)+")")
        .call(xAxis)
      .selectAll("text")
        .attr("transform", "rotate(90)")
        .attr('x', 20)
        .attr('y', -10)
        .attr('class', 'year-label')
      // debugger
    }
  }
})();
