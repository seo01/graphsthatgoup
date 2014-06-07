//The runderGraph function should be the only function called from this module

//TODO: ideally we'd pass in a reference the animateOut function, along with obj
var animateOut = null;

  function renderGraph(xValues,yValues,series,colors,chartType,obj)
  {
    $(obj).empty();

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 500 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    var y = d3.scale.linear()
      .range([height, 0]);

    //For Lines
    var x = d3.time.scale()
      .range([0, width]);

    //For Bars
    var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);
    var x1 = d3.scale.ordinal();

    var xAxis = d3.svg.axis();

    //For Line or area
    if(chartType == "LINE")
    {
      scale = xAxis.scale(x)
        .orient("bottom")
        .tickSize(0);
      if(xValues.tickformat)
        scale.tickFormat(d3.time.format(xValues.tickformat));
      if(!xValues.showticks)
        scale.tickValues([]);
    }
    else
    {
    //The Bars
      scale = xAxis.scale(x0)
        .orient("bottom")
        .tickSize(0);
      if(xValues.tickformat)
        scale.tickFormat(d3.time.format(xValues.tickformat));
      if(!xValues.showticks)
        scale.tickValues([]);
    }
    var yAxis = d3.svg.axis()
      .scale(y)
      .tickFormat("")
      .orient("left")
      .tickValues([])
      .tickSize(1);

    multiData = transformMultiDataForD3(xValues.ticks,yValues,series);

    x.domain(d3.extent(xValues.ticks));
    y.domain([0, 1]);

    x0.domain(xValues.ticks);
    x1.domain(series).rangeRoundBands([0, x0.rangeBand()]);
  
    //Create render functions
    var area = d3.svg.area()
      .x(function(d) { return x(d.xv); })
      .y0(height)
      .y1(function(d) { return y(d.yv); });

    var area0 = d3.svg.area()
      .x(function(d) { return x(d.xv); })
      .y0(height)
      .y1(function(d) { return y(0); });
  
    var line = d3.svg.line()
      .x(function(d) { return x(d.xv); })
      .y(function(d) { return y(d.yv); });

    var line0 = d3.svg.line()
      .x(function(d) { return x(d.xv); })
      .y(function(d) { return y(0); });

    //Create the SVG
    var svg = d3.select(obj).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Get random color
    var color = d3.scale.ordinal()
      .range(colors);

    //Render the data sets
    if(chartType == "LINE")
    {
      //if there is only one and this is a line chart
      if(multiData.length ==1)
      {
        var data = multiData[0];
        svg.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area0)
          .attr("fill",color(series[i]))
          .transition()
          .duration(1000)
          .attr("d", area);

        animateOut = function (){
          svg.selectAll(".area")
            .transition()
            .duration(1000)
            .attr("d", area0);
        }
      }
      else
      {
        for(var i = 0; i < multiData.length; i++)
        {
          var data = multiData[i];
          svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line0)
            .attr("stroke",color(series[i]))
            .transition()
            .duration(1000)
            .attr("d", line);
        }
        animateOut = function (){
          svg.selectAll(".line")
            .transition()
            .duration(1000)
            .attr("d", line0);
        }
      }
    }
    else{
      var flatData = flattenMultiData(multiData);

      var state = svg.selectAll(".state")
        .data(flatData)
      .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x0(d.xv) + ",0)"; });

      state.selectAll("rect")
        .data(function(d) { return [d]; })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.series); })
        .attr("y", function(d) { return height; })
        .attr("height", function(d) { return 0; })
        .style("fill", function(d) { return color(d.series); })
        .transition()
        .duration(1000)
        .attr("height", function(d) { return height - y(d.yv); })
        .attr("y", function(d) { return y(d.yv); });

      animateOut = function (){
        state.selectAll("rect")
          .transition()
          .duration(1000)
          .attr("y", function(d) { return height; })
          .attr("height", function(d) { return 0; });
      }
    }

    //Add the Axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    //Label the Y axis or add a legend
    if(series.length == 1)
    {
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "y label")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(series[0]);
    }
    else
    {
      var legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
        .attr("x", 6)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

      legend.append("text")
        .attr("x", 27)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) { return d; });
    }
    //label the x axis
    if(xValues.title)
    {
      svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width-3)
        .attr("y", height + 15)
        .text(xValues.title);
    }
  }

function transformMultiDataForD3(xValues,yValues,series)
{

  var multiData = [];
  for (var i = 0; i < yValues.length; i ++)
  {
    var data = [];
    for (var j = 0; j < xValues.length; j++) {
       data.push({xv:xValues[j],yv:yValues[i][j],series:series[i]});
    }
    multiData.push(data);
  }
  return multiData;
}

function flattenMultiData(multiData)
{
  var data = [];
  for (var i = 0; i < multiData.length; i++)
  {
    Array.prototype.push.apply(data,multiData[i])
  }
  return data;
}