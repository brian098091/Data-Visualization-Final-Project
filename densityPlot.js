function createDensityPlot( svg_id, 
    data,
    attr_name,
    margin = {left:100, right:50, top:50, bottom:100 }
    ) {

    const getstyle = window.getComputedStyle(document.getElementById(svg_id))
    const width_string = getstyle.width
    const height_string = getstyle.height
    const TOTAL_WIDTH = parseInt(width_string);
    const TOTAL_HEIGHT = parseInt(height_string);
    const height = TOTAL_HEIGHT - margin.top - margin.bottom;
    const width = TOTAL_WIDTH - margin.left - margin.right;

    data.forEach(d => d[attr_name] = Number(d[attr_name]))
    const xScale = d3.scaleLinear()
                .domain( d3.extent( data.map(d=>d[attr_name]) ) )
                .range([0, width]);

    const kde = kernelDensityEstimator(kernelEpanechnikov(7), xScale.ticks(40))
    const density = kde( data.map(d=>d[attr_name]) )
    
    const yScale = d3.scaleLinear()
        .domain(d3.extent(density.map(d=>d[1])))
        .range([height, 0])

    const all = d3.select("#" + svg_id)

    const g = all.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        // .on("mouseover", function() { console.log("Hi") } )
    
    g.append("path")
        .attr("class", "mypath")
        .datum(density)
        .attr("fill", "none") //#69b3a2
        .attr("opacity", ".8")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
                .x( d => xScale(d[0]) )
                .y( d => yScale(d[1]) )
        )
    
    all.append("text")
        .text(attr_name)
        .attr("x", margin.left+width/2)
        .attr("text-anchor", "middle")
        .attr("y", margin.top-5)
    
    all.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top+height})`)
        .call(d3.axisBottom(xScale).ticks(width/50))
    
    const y_label_g = all.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
    y_label_g.append("g")
        .call(
            d3.axisLeft(yScale)
                .ticks(height/10)
                .tickFormat(d => Math.round(d*10000)/10000)
            )
    y_label_g.append("text")
        .text("density")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("alignment-baseline", "hanging")
        .attr("y", -margin.left+3)

}


// Function to compute density
function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
    };
}
function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}
  