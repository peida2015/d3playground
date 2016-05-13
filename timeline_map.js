;(function () {
  document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
      var admDates = dates.map(function (state) {
        return [state[0], new Date(state[1])];
      })
console.log("loaded JS");
      var margins = { top:30, bottom: 20, left: 40, right: 40 }
      var width = 960;
      var height = 760;

      var svg = d3.select('body').append("svg")
          .attr("width", width + margins.left + margins.right)
          .attr("height", height + margins.top + margins.bottom);

// ------------------------Draw the timeline

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
        .extent([admDates[0][1], admDates[0][1]])
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

//  ---------------Make initial map

  d3.json("usa.json", function (error, us) {
    if (error) return console.error(error);
    // Convert topojson back to GeoJSON format for display
    var states = topojson.feature(us, us.objects.states);

    // Map Projection
    var projection = d3.geo.albersUsa().scale(1100).translate([width/2+margins.left+margins.right, height/2]);

    // Path generator
    var path = d3.geo.path().projection(projection);


    // Draw state boundaries by selecting the two features (states) a, b on two sides of the boundary are different.

    svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function (a, b) {
        return a !== b;
      })).attr("d", path).attr("class", "state-boundary");

    // Draw coast lines by selecting the two features on the side of the boundary are the same.
    svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function (a, b) {
        return a === b;
      })).attr("d", path).attr("class", "coast-line");

    // Set point radius to 2 for smaller dot on the map for cities
    path.pointRadius(2);

    // Label populated places with dots on the maps
    // svg.append("path")
    //   .datum(topojson.feature(us, us.objects.places))
    //   .attr("d", path)
    //   .attr("class", "place");

    // Append lables on the populated places
    // svg.selectAll(".place-label")
    //   .data(topojson.feature(us, us.objects.places).features)
    //   .enter().append("text")
    //   .attr("class", "place-label")
    //   .attr("transform", function (d) {
    //   // Get it to project on the correct position on the map
    //     return "translate(" + projection(d.geometry.coordinates)+")"
    //   })
    //   // adjust vertical position of the label
    //   .attr("dy", ".35em")
    //   // Get the name of the city and label
    //   .text(function (d) { return d.properties.name; });
    //
    // // Label cities to the right of SF (-122.41 W) right-aligned
    // svg.selectAll(".place-label")
    //   .attr("x", function (d) {
    //     return d.geometry.coordinates[0] > -122.41 ? 6 : -6; })
    //   .attr("text-anchor", function (d) {
    //     return d.geometry.coordinates[0] > -122.41 ? "start" : "end" ; });

    // State labels
    svg.selectAll('.state-label')
      .data(states.features).enter()
      .append("text")
      .attr("class", function (d) { return "state-label " + d.id })
      .attr("transform", function (d) {
        return "translate(" + path.centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .attr("x", 2)
      .text(function (d) { return d.id; });

    })


      // ------------------------------Intro transition
      slider
        .call(brush.event)
        .call(brush.extent([0, new Date('1850')]))
        .transition()
        .duration(700)
        .call(brush.event)
        .call(brush.extent([0, admDates[0][1]]))
      // Transition to take handle back to origin.
        .transition().duration(1000)
        .call(brush.event)
        .call(brush.extent([0, admDates[0][1]]))

      // Brush event callback function:
      function brushed () {
        var value = brush.extent()[0];

        if (d3.event.sourceEvent) {
          value = timeline.invert(d3.mouse(this)[0]);
        }
      // After transition, extent attempts to return to zero, not first date of state admission.  This is a hacky fix.
        if (typeof(value) === 'number'){
          value = admDates[0][1];
        }
        brushedLine.attr('width', timeline(value)-12);
        handle.attr("cx", timeline(value));

        // Labeled state abbrev. in class name so they can be styled with CSS.
        // svg.selectAll('.states')
        // .data(states.features)
        // .enter().append("path")
        // .attr("class", function (d) { return "state "+d.id; })
        // .attr("d", path);
      }
    }
  }
})();
