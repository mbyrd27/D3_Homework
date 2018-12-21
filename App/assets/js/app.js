// Set SVG Specs
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG for scatter plot
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {
    // Cast Poverty and Healthcare rates to Numbers
    censusData.forEach(function(data) {
        // console.log(cdata.abbr);
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    // Scale Functions
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(censusData, d => d.poverty)])
      .range([0, width]);
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.healthcare) + 2])
      .range([height, 0]);

    // Axis Functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Place Axes on the scatterplot
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    
    chartGroup.append("g")
      .call(leftAxis);

    //Create Scatterplot Circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "lightblue")
      .attr("opacity", ".75")

      var labelsGroup = chartGroup.selectAll("text")
      .data(censusData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d.poverty) - 7.5)
      .attr("y", d => yLinearScale(d.healthcare) + 5)
      .attr("fill", "red")
      .attr("font-size", "10px")
      .text(d => d.abbr)
     
    // Labels for Axes
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

});