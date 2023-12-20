function createScatterPlot( svg_name, 
                            data,
                            x_attr_name, y_attr_name, color_attr_name,
                            x_axis_label, y_axis_label, color_attr_label,
                            margin = {left:100, right:50, top:50, bottom:100 },
                            mark_size = 1) {

    const getstyle = window.getComputedStyle(document.getElementById(svg_name))
    const width_string = getstyle.width
    const height_string = getstyle.height
    const TOTAL_WIDTH = parseInt(width_string);
    const TOTAL_HEIGHT = parseInt(height_string);
    const height = TOTAL_HEIGHT - margin.top - margin.bottom;
    const width = TOTAL_WIDTH - margin.left - margin.right;

    let labelSize = 15;
    const color_attr_set = new Set( data.map(d => d[color_attr_name]) );
    // const color_attr_cats = Array.from(color_attr_set.values());
    const color_attr_cats = ['pop', 'rap', 'rock', 'latin', 'r&b', 'edm']

    let xScale = d3.scaleLinear()
        .domain( d3.extent( data.map(d => d[x_attr_name]) ) )
        .range([0, width]);
    
    let yScale = d3.scaleLinear()
        .domain( d3.extent( data.map(d => d[y_attr_name]) ) )
        .range([height, 0]);
    
    let colorScale;
    if ( color_attr_name != undefined ) {
        colorScale = d3.scaleOrdinal() 
            .domain( color_attr_cats )
            .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]);
    } else {
        colorScale = a => "black"
    }

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Draw
    const all = d3.select("#" + svg_name)

    const g = all.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    const plot = g.selectAll("#mark").data(data);
    const plot_enter = plot.enter()
    const plot_exit = plot.exit()
    
    plot_enter.append("circle")
        .attr("cx", d => xScale(d[x_attr_name]))
        .attr("cy", d => yScale(d[y_attr_name]))
        .attr("r", mark_size/2)
        .attr("id", "mark")
        .style("fill", d => colorScale(d[color_attr_name]))
    plot_exit.remove();
    
    // Draw x axis
    const x_label_g = all.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top+height})`)
        .attr("id", "x_axis")
    x_label_g.append("g")
        .call(xAxis);
    x_label_g.append("text")
        .text(x_axis_label)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "hanging")
        .attr("x", width/2)
        .attr("y", margin.bottom/2)
    
    // Y Axis
    const y_label_g = all.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("id", "y_axis")
    y_label_g.append("g")
        .call(yAxis);
    y_label_g.append("text")
        .text(y_axis_label)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y", -margin.left/2)
    
    // Brush
    const brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on("end", event => {
            const selected = event.selection
            console.log(selected);
        })
    g.call(brush);

    // Color Labels
    const colorLabelScale = d3.scalePoint()
        .domain( data.map(d=>d[color_attr_name]) )
        .range( [height/2, height] )

    const color_label_g = all.append("g")
        .attr("id", "color_axis")
        .attr("transform", `translate(${margin.left+width}, ${margin.top})`)
    
    let color_legent_text_size = 12
    let color_label_cx = margin.right/4
    let color_label_r = 10

    color_label_g.selectAll("dot")
        .data(color_attr_cats)
        .enter()
            .append("circle")
            .attr("cx", color_label_cx)
            .attr("cy", d => colorLabelScale(d))
            .attr("r",color_label_r)
            .style("fill", d => colorScale(d))
            .attr("test", d=>d)
            .on("mouseover", function() {
                d3.select(this).attr("stroke", "black")
                const genre = d3.select(this).attr("test");
                const res = d3.select("svg g").selectAll("circle")
                res.data(data)
                    .attr("opacity", d => d[color_attr_name] === genre ? 1:0.25)
                    .attr("r", d => d[color_attr_name] === genre ? 1:0.5)
            })
            .on("mouseleave", function() {
                d3.select(this).attr("stroke", "none")
                const genre = d3.select(this).attr("test");
                const res = d3.select("svg g").selectAll("circle")
                res.data(data)
                    .attr("opacity", 1)
                    .attr("r", 0.5)
            })

    color_label_g.selectAll("legend")
        .data(color_attr_cats)
        .enter()
            .append("text")
            .text(d => d)
            .attr("x", color_label_cx + color_label_r + 10)
            .attr("y", d => colorLabelScale(d))
            .attr("text-anchor", "start")
            .attr("alignment-baseline", "middle")
            .attr("font-size", color_legent_text_size)
}