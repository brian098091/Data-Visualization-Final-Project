// barChart.js

// import * as d3 from 'd3';

function createBarChart(data) {
    const margin = { top: 100, right: 80, bottom: 50, left: 150 },
          width = 800 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // Aggregate data for top five artists
    let artistCounts = d3.rollups(data, v => v.length, d => d.track_artist)
                         .sort((a, b) => b[1] - a[1])
                         .slice(0, 5);

    const svg = d3.select("#barChart")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                  const y = d3.scaleBand()
                  .range([0, height])
                  .padding(0.1)
                  .domain(artistCounts.map(d => d[0])); // Artist names


                  /* Initialize tooltip */
                  var tip = d3.tip().attr('class', 'd3-tip').html((EVENT,d)=> (`Artist: ${d[0]}<br>Num of songs reco:${d[1]}`));

                  
                  
  
      const x = d3.scaleLinear()
                  .range([0, width])
                  .domain([0, d3.max(artistCounts, d => d[1])]); // Song counts
  
      // Drawing the bars
      const rects = svg.selectAll(".bar")
       .data(artistCounts)
       .enter().append("rect")
       .attr("class", "bar")
       .attr("y", d => y(d[0])) // Position on y-axis
       .attr("height", y.bandwidth()) // Height of the bar
       .attr("x", 0) // Starts at x = 0
       .attr("width", 0) // Initial width of 0
       .attr("fill", "steelblue")
       .on("click", (event, d) => {
           window.handleBarClick(d[0]);
       });

    // Apply the transition
    rects.transition()
         .duration(1000) // Transition duration of 1000ms
         .attr("width", d => x(d[1])); 

         rects.call(tip)
         svg.selectAll('rect')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
  
      // Add the y-axis
      svg.append("g")
         .call(d3.axisLeft(y))
         .selectAll("text")
        .attr("class", "axis-text");
  
      // Add the x-axis
      svg.append("g")
         .attr("transform", `translate(0, ${height})`)
         .call(d3.axisBottom(x))
         .selectAll("text")
        .attr("class", "axis-text");
    
    svg.append("text")
         .attr("x", (width / 2))             
         .attr("y", 0 - (margin.top / 2))
         .attr("text-anchor", "middle")  
         .style("font-size", "36px") 
         .style("text-decoration", "underline")  
         .text("Top 5 Artists for You");
}
