function createDensityPlot( svg_id, 
    data,
    attr_name,
    margin = {left:100, right:50, top:50, bottom:100 },
    on_preference_set
    ) {

    const getstyle = window.getComputedStyle(document.getElementById(svg_id))
    const width_string = getstyle.width
    const height_string = getstyle.height
    const TOTAL_WIDTH = parseInt(width_string);
    const TOTAL_HEIGHT = parseInt(height_string);
    const height = TOTAL_HEIGHT - margin.top - margin.bottom;
    const width = TOTAL_WIDTH - margin.left - margin.right;

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


    const rect = g.append("rect")
    rect.attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "grey")
        .attr("opacity", 0.1)
        .on("click", (event, attr) => {
            const [x, y] = d3.pointer(event);
            const xVal = xScale.invert( x );
            g.selectAll("#preference").remove();
            const rect = g.append("rect")
            rect.attr("id", "preference")
                .attr("x", x)
                .attr("y", 0)
                .attr("width", 3)
                .attr("height", height)
                .attr("fill", "red")
                .on("click", (event, attr) => {
                    preferences[attr] = null;
                    g.selectAll("#preference").remove();
                })
            preferences[attr] = xVal;
            on_preference_set(filteredData);
        })
    
    if ( preferences[attr_name] != null ) {
        g.append("rect")
            .attr("id", "preference")
            .attr("x", xScale(preferences[attr_name]))
            .attr("y", 0)
            .attr("width", 3)
            .attr("height", height)
            .attr("fill", "red")
            .on("click", (event, attr) => {
                preferences[attr] = null;
                g.selectAll("#preference").remove();
            })
    }
    
    all.append("text")
        .text(attr_name)
        .attr("x", margin.left+width/2)
        .attr("text-anchor", "middle")
        .attr("y", margin.top-5)
    
    xaxis = d3.axisBottom(xScale)
        .ticks(width/50)
    if ( attr_name === "duration_ms") {
        xaxis.tickFormat((d, i) => convertMsToTime(d))
    }
    all.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top+height})`)
        .call(xaxis);
    
    const y_label_g = all.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
    y_label_g.append("g")
        .call(
            d3.axisLeft(yScale)
                .ticks(height/12)
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
  




function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function convertMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    // 👇️ If you don't want to roll hours over, e.g. 24 to 00
    // 👇️ comment (or remove) the line below
    // commenting next line gets you `24:00:00` instead of `00:00:00`
    // or `36:15:31` instead of `12:15:31`, etc.
    hours = hours % 24;

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}