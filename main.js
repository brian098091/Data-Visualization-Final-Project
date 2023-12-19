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
                        1
                        )
    
    createDensityPlot("loudness", data, "loudness", margin = { left:60, right:10, top:20, bottom:20})
    createDensityPlot("liveness", data, "liveness", margin = { left:60, right:10, top:20, bottom:20})
    createDensityPlot("acousticness", data, "acousticness", margin = { left:60, right:10, top:20, bottom:20})
    createDensityPlot("valence", data, "valence", margin = { left:60, right:10, top:20, bottom:20})
    createDensityPlot("tempo", data, "tempo", margin = { left:60, right:10, top:20, bottom:20})
    createDensityPlot("duration_ms", data, "duration_ms", margin = { left:60, right:10, top:20, bottom:20})

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
