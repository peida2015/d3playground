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

      // Create an d3.time.scale object and specify the x and y range.
      var timeline = d3.time.scale()
        .domain([admDates[0][1],admDates[49][1]])
        .range([0, width-margins.left-margins.right]);

      var xAxis = d3.svg.axis().scale(timeline).ticks(10).tickSize(3).tickPadding(8);

      // Draw the axis by calling axis() on selected svg group element "g" (where the axis is to be drawn)
      var axisDrawn = svg.append('g')
        .attr("class", "x axis")
        .attr("transform", "translate("+(margins.left+margins.right)+","+ (height-margins.bottom)+")")
        .call(xAxis);

      // Draw a rounded rectangle around the axis styled as gray stroke (with CSS)
      d3.select(".axis")
        .append("rect")
        .attr("width", width-margins.left-margins.right)
        .attr("height", 10)
        .attr('x', 0)
        .attr('y', -5)
        .attr("rx", 5)
        .attr('ry', 5)
        .attr("class", "halo");

      // Append text elements to display labels on the axis ticks
      axisDrawn.selectAll("text")
        .attr("transform", "rotate(90)")
        .attr('x', 30)
        .attr('y', -0)
        .attr('class', 'year-label');

      var brush = d3.svg.brush()
        .x(timeline)
        .extent([0, 0])
        .on("brush", brushed);

      var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate("+(margins.left+margins.right)+","+0+")")
        .call(brush);

      var handle = slider.append("circle")
        .attr("class", "handle")
        .attr("transform", "translate("+0+","+ (height-margins.bottom)+")")
        .attr('r', 10);

      var brushedLine = svg.append("rect").attr('class', "slider")
        .attr("transform", "translate("+(margins.left+margins.right)+","+(height-margins.bottom)+")")
        .attr("width", 0)
        .attr("height", 3)

      // Brush event callback function:
      function brushed () {
        var value = brush.extent()[0];

        if (d3.event.sourceEvent) {
          value = timeline.invert(d3.mouse(this)[0]);
          // brush.extent[0, value];
        }

        brushedLine.attr('width', timeline(value)-12);
        handle.attr("cx", timeline(value));
      }

    }
  }
})();
