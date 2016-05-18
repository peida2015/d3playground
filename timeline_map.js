;(function () {
  document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
      var firstStateDate = new Date(dates[0][1]);
      var lastStateDate = new Date(dates[49][1]);

      var admDates = {};
      dates.forEach(function (state) {
        admDates[state[0]] = new Date(state[1]);
      })
console.log("loaded JS");
      var margins = { top:30, bottom: 20, left: 40, right: 40 }
      var width = 960;
      var height = 560;

      var svg = d3.select('body').append("svg").attr("class", "svg")
          .attr("width", width + margins.left + margins.right)
          .attr("height", height + margins.top + margins.bottom);

// ------------------------Draw the timeline

      // Create an d3.time.scale object and specify the x and y range.
      var timeline = d3.time.scale()
        .domain([firstStateDate, lastStateDate])
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
        .extent([firstStateDate, firstStateDate])
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
    // Map Title
  svg.append("text").attr("class", "map-title")
    .text("States Joining the Union")
    .attr("transform", function (d) {
      return "translate("+(width/2 - this.getComputedTextLength()/2 + margins.left)+","+margins.top+")";
    });

    // Legends
  var legend = svg.append('g').attr('class','legend')
    .attr("transform", "translate("+margins.left+","+(height/2-30)+")");

  legend.append("rect")
    .attr("class", "legend unjoined")
    .attr('width', 15)
    .attr("height", 15)

  legend.append("text").attr('class', 'legend-label')
    .text("Not Joined")
    .attr('x', 18)
    .attr('y', 13);

  legend.append("rect")
    .attr("class", "legend joined")
    .attr('width', 15)
    .attr("height", 15)
    .attr('y', 20);

  legend.append("text").attr('class', 'legend-label')
    .text("Joined")
    .attr('x', 18)
    .attr('y', 33);

  var stateCount = legend.append("text").attr('class', 'legend-count')
    .text('0 states joined')
    .attr('x', 0)
    .attr('y', -40)

  var yearIndicator = legend.append("text").attr('class', 'year-indicator')
    .text('1787')
    .attr('x', 0)
    .attr('y', (height/2-5));

  d3.json("usa.json", function (error, us) {
    if (error) return console.error(error);
    // Convert topojson back to GeoJSON format for display
    var states = topojson.feature(us, us.objects.states);

    // Map Projection
    var projection = d3.geo.albersUsa().scale(1000).translate([width/2+margins.left+margins.right, height/2]);

    // Path generator
    var path = d3.geo.path().projection(projection);


    // Draw state boundaries by selecting the two features (states) a, b on two sides of the boundary are different.
    svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function (a, b) {
        return a !== b;
      })).attr("d", path).attr("class", "state-boundary");

    // Labeled state abbrev. in class name so they can be styled with CSS.
    svg.selectAll('.states')
    .data(states.features)
    .enter().append("path")
    .attr("class", function (d) { return "state "+d.id; })
    .attr("d", path);

    // Draw coast lines by selecting the two features on the side of the boundary are the same.
    svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function (a, b) {
        return a === b;
      })).attr("d", path).attr("class", "coast-line");

    // Set point radius to 2 for smaller dot on the map for cities
    path.pointRadius(2);

    // State labels
    svg.selectAll('.state-label')
      .data(states.features).enter()
      .append("text")
      .attr("class", function (d) { return "state-label " + d.id })
      .attr("transform", function (d) {
        if (d.id === "PR") return;
        return "translate(" + path.centroid(d).join(", ") + ")";
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
        .call(brush.extent([0, firstStateDate]))
      // Transition to take handle back to origin.
        .transition().duration(1000)
        .call(brush.event)
        .call(brush.extent([0, firstStateDate]));

      // Brush event callback function:
      function brushed () {
        var value = brush.extent()[0];
        var numberJoined = 0;

        if (d3.event.sourceEvent) {
          value = timeline.invert(d3.mouse(this)[0]);
        }
      // After transition, extent attempts to return to zero, not first date of state admission.  This is a hacky fix.
        if (typeof(value) === 'number'){
          value = firstStateDate;
        }

        // Make the timeline brushedLine bar appear behind slider handle.
        brushedLine.attr('width', function () {
          return timeline(value) < 12 ? timeline(value) : timeline(value) - 12;
        })
        handle.attr("cx", timeline(value));

        svg.selectAll(".state").each(function (d) {
          if (admDates[d.properties.name] < value) {
            this.classList.add("joined");
            numberJoined++;
          } else {
            this.classList.remove("joined");
          }
        });

        yearIndicator.text(value.getFullYear()).attr('x', timeline(value)+20);
        stateCount.text(numberJoined+" states joined");
      }
    }
  }
})();
