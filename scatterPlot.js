// scatterPlot.js

let currentFilter = null;
function updateScatterPlot(artistData) {
    // Constants for the SVG size and margins
    const margin = { top: 60, right: 100, bottom: 40, left: 40 },
          width = 650 - margin.left - margin.right,
          height = 450 - margin.top - margin.bottom;

          artistData.forEach(d => {
            d.track_popularity = +d.track_popularity;
            d.combinedPopularity = +(d.track_popularity + d.duration_ms * 0.01); // Convert to number if necessary

        });
    // Clear any existing content in the SVG container
    const svgContainer = d3.select("#scatterPlot");
    svgContainer.selectAll("*").remove();

    // Append a new SVG group to the container
    const svg = svgContainer
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var tip = d3.tip().attr('class', 'd3-tip').html((EVENT,d)=> (`Name: ${d.track_name}<br>Publish Date: ${d.track_album_release_date}<br>Popularity: ${d.track_popularity}<br>Recommend grade: ${d.combinedPopularity}`) );

    const circlesGroup = svg.append("g").attr("class", "circlesGroup");
    const xAxisGroup = svg.append("g").attr("class", "xAxisGroup");
    const yAxisGroup = svg.append("g").attr("class", "yAxisGroup");
        
  
    // Set up the scales
    const x = d3.scaleTime()
                .range([0, width])
                .domain(d3.extent(fullArtistData, d => d.track_release_date))

    const y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(fullArtistData, d => d.track_popularity)]);
    

  
       

       xAxisGroup.attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
        .attr("class", "axis-text");

    yAxisGroup.call(d3.axisLeft(y))
    .selectAll("text")
        .attr("class", "axis-text");

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
                         .domain([...new Set(fullArtistData.map(d => d.playlist_genre))]);

    const sizeScale = d3.scaleLinear()
                        .range([3, 10])
                        .domain(d3.extent(artistData, d => d.combinedPopularity));

    // Bind the filtered data to the circles and update the scatter plot
    const circles = circlesGroup.selectAll("circle")
                            .data(artistData, d => d.track_name);

// Enter selection: Create new circles
const enterCircles = circles.enter().append("circle")
                        .attr("cx", d => x(d.track_release_date))
                        .attr("cy", d => y(d.track_popularity))
                        .attr("r", 0) // Start with radius 0
                        .attr("fill", d => colorScale(d.playlist_genre));

// Apply transitions to entering circles
enterCircles.transition()
            .duration(1000)
            .attr("r", d =>sizeScale(d.combinedPopularity)); // Transition to a fixed radius

// Update selection: Update existing circles
circles.attr("cx", d => x(d.track_release_date))
       .attr("cy", d => y(d.track_popularity))
       .attr("r", d => sizeScale(d.combinedPopularity))
       .attr("fill", d => colorScale(d.playlist_genre));

// Exit selection: Remove circles that are no longer needed
circles.exit().remove();

enterCircles.call(tip)
svg.selectAll('circle')
.on('mouseover', tip.show)
.on('mouseout', tip.hide)
    // Add the x-axis

    svg.append("text")
   .attr("class", "scatter-plot-title")
   .attr("x", width / 2)             
   .attr("y", 0 - (margin.top / 2))
   .attr("text-anchor", "middle")  
   .style("font-size", "26px")
   .text(`Music of ${artistData[0].track_artist}`)

   const genres = [...new Set(fullArtistData.map(d => d.playlist_genre))]; // Array of genres

legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width}, 20)`)
genres.forEach((genre, index) => {
    const legendRow = legend.append("g")
                            .attr("transform", `translate(0, ${index * 25})`)
                            .attr("class", "legend-item")
                            .attr("data-genre", genre)
                            .style("cursor", "pointer")
                            .on("click", function() {
                                const selectedGenre = d3.select(this).attr("data-genre");
                                filterScatterPlot(selectedGenre);
                                d3.selectAll(".legend-item").each(function() {
                                    const item = d3.select(this);
                                    const isCurrent = item.attr("data-genre") === filterScatterPlot.currentFilter;
                                    item.select("circle")
                                        .style("stroke", isCurrent ? "black" : "none")
                                        .style("stroke-width", isCurrent ? 2 : 0);
                                    });
                            });

    legendRow.append("circle")
             .attr("cx", 30)
             .attr("cy", 195)
             .attr("r",5)
             .attr("fill", colorScale(genre));

    legendRow.append("text")
             .attr("x", 50)
             .attr("y",200)
             .attr("text-anchor", "front")
             .style("text-transform", "capitalize")
             .style("font-size", "14px") 
             .text(genre);
            });

}


function filterScatterPlot(selectedGenre) {
    if (typeof filterScatterPlot.currentFilter === 'undefined') {
        filterScatterPlot.currentFilter = null;
    }

    if (filterScatterPlot.currentFilter === selectedGenre) {
        filterScatterPlot.currentFilter = null;
        updateScatterPlot(fullArtistData);
    } else {
        filterScatterPlot.currentFilter = selectedGenre;
        const filteredData = fullArtistData.filter(d => d.playlist_genre === selectedGenre);
        updateScatterPlot(filteredData);
    }

}
    // Make sure to expose the functions globally if this script is included in a <script> tag
    window.updateScatterPlot = updateScatterPlot;
    window.filterScatterPlot = filterScatterPlot;





