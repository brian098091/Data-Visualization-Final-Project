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
