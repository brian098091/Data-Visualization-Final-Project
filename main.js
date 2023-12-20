// main.js

let fullArtistData = null
d3.csv('cleaned.csv').then(data => {
    // Process the data (parse dates, calculate additional fields, etc.)
    data.forEach(d => {
        d.track_release_date = new Date(d.track_album_release_date);
        d.combinedPopularity = d.track_popularity + d.duration_ms * 0.01;
    });

    createScatterPlot(  "energy_danceability_scatter_plot", data,
                        "danceability", "energy", "playlist_genre",
                        "danceability", "energy", "playlist_genre",
                        margin = { left:90, right:90, top:60, bottom:90},
                        2,
                        updateBarChart,updateBarChart);
    const density_attr_names = ["loudness", "liveness", "acousticness", "valence", "tempo", "duration_ms"];
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
        createDensityPlot(name, data, name, margin = { left:60, right:10, top:20, bottom:20})
    })

    // Create the initial bar chart
    createBarChart(data);

    // Define a function to handle bar click (artist selection)
    window.handleBarClick = artistName => {
        console.log(artistName)
        // Filter data for the selected artist
        const artistData = data.filter(d => d.track_artist === artistName);

        // Update the scatter plot with the filtered data
        fullArtistData = artistData;
        updateScatterPlot(artistData);
    };
});

function updateBarChart(brushedData) {
    // Clear the existing bar chart
    d3.select('#barChart').selectAll('*').remove();

    // Draw the bar chart with the brushed data
    createBarChart(brushedData);
}
