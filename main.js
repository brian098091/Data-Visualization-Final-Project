// main.js

let fullArtistData = null
let filteredData = null
const preferences = {}
const density_attr_names = ["loudness", "liveness", "acousticness", "valence", "tempo", "duration_ms"];
const normal = {}

density_attr_names.forEach(d => preferences[d] = null)
let fulldata;
function set_preference(attr, val) {
    console.log(preferences)
}
d3.csv('cleaned.csv').then(data => {
    // fulldata = data;
    filteredData = data;
    density_attr_names.forEach( attr => {
        data.forEach(d => d[attr] = Number(d[attr]))
        normal[attr] = d3.max(data.map(d => d[attr])) - d3.min(data.map(d => d[attr]));
        // console.log(attr, d3.max(data.map(d => d[attr])), d3.min(data.map(d => d[attr])))
    });
    // console.log(normal);
    // Process the data (parse dates, calculate additional fields, etc.)
    data.forEach( d => {
        d.track_release_date = new Date(d.track_album_release_date);
        d.combinedPopularity = 50;
    });

    createScatterPlot(  "energy_danceability_scatter_plot", data,
                        "danceability", "energy", "playlist_genre",
                        "danceability", "energy", "playlist_genre",
                        margin = { left:90, right:90, top:60, bottom:90},
                        2,
                        updateAllChart,updateAllChart);


    
    const windowG = d3.select("body")
                    .append("g")
                    .attr("id", "densityG")
    
    windowG.selectAll("svg")
        .data(density_attr_names)
        .enter()
            .append("svg")
            .attr("id", d=>d)
            .attr("class", "density_plot")
    
    density_attr_names.forEach( name => {
        createDensityPlot(name, data, name, margin = { left:60, right:10, top:20, bottom:20}, updateAllChart)
    })

    // Create the initial bar chart
    createBarChart(data);

    // Define a function to handle bar click (artist selection)
    window.handleBarClick = artistName => {
        console.log(artistName)
        // Filter data for the selected artist
        const artistData = filteredData.filter(d => d.track_artist === artistName);

        // Update the scatter plot with the filtered data
        fullArtistData = artistData;
        updateScatterPlot(artistData);
    };
});

function updateAllChart(rerrrfilteredData) { // and density plot
    // Clear the existing bar chart
    d3.select("#scatterPlot").selectAll("*").remove();
    filteredData = rerrrfilteredData;
                
    filteredData.forEach(d => {
        d.track_popularity = +d.track_popularity;
        const rates = [];
        Object.keys(preferences).forEach( key => {
            if ( preferences[key] != null ) {
                const rate = 1 - ( Math.abs(preferences[key]-d[key]) / normal[key])
                rates.push(rate * rate);
            } else {
                rates.push(0.5);
            }
        })
        // console.log(d['track_name'], rates);
        d.combinedPopularity =  Math.round( d3.mean(rates) * 100 );

    });

    filteredData.filter(d=>d.combinedPopularity>=50);
    d3.select('#barChart').selectAll('*').remove();

    // Draw the bar chart with the brushed data
    createBarChart(filteredData);

    d3.selectAll("#densityG .density_plot").remove();
    const windowG = d3.select("body")
                    .append("g")
                    .attr("id", "densityG")
    windowG.selectAll("svg")
        .data(density_attr_names)
        .enter()
            .append("svg")
            .attr("id", d=>d)
            .attr("class", "density_plot")
    density_attr_names.forEach( name => {
        createDensityPlot(name, filteredData, name, margin = { left:60, right:10, top:20, bottom:20}, updateAllChart)
    })
}
