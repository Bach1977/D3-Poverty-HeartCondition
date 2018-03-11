var svgWidth = 1200;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
  
d3.csv("dataheart.csv", function(err, dataheart) {
 console.log(dataheart)
  if (err) throw err;

  dataheart.forEach(function(data) {
    data.poverty = +data.poverty;
    data.heartcondition = +data.heartcondition;
  });


  // Create scale functions
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([0, d3.max(dataheart, function(data) {
    return +data.poverty;
  })]);
  yLinearScale.domain([0, d3.max(dataheart, function(data) {
    return +data.heartcondition * 1.2;
  })]);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -50])
    .html(function(data) {
      var Name = data.state;
      var poverty = +data.poverty;
      var heartcondition = +data.heartcondition;
      return (Name + "<br> Poverty: " + poverty + "<br> Heart Condition: " + heartcondition);
    });

  chart.call(toolTip);

  chart.selectAll("circle")
    .data(dataheart)
    .enter().append("circle")
      .attr("cx", function(data, index) {
        console.log(data.poverty);
        return xLinearScale(data.poverty);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(data.heartcondition);
      })
      .attr("r", "10")
      .attr("fill", "green")

   

      .on("mouseover", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);


  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("HeartCondition in the US");

// Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("Poverty (%)");



});


