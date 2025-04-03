// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
      let metadata=data.metadata
      console.log(metadata)
      
    // Filter the metadata for the object with the desired sample number
    function filterSample(i){
      return i.id==sample;
    }
      let filteredData=metadata.filter(filterSample);
      console.log(filteredData);
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel=d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let i in filteredData[0]){
      panel.append('div').text(`${i}:${filteredData[0][i]}`)}

    })

  }

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
      let samples=data.samples;
      console.log(samples);
    // Filter the samples for the object with the desired sample number
      function filterSample(i){
        return i.id==sample;
      }
      let filteredSample=samples.filter(filterSample)
    // Get the otu_ids, otu_labels, and sample_values
      let otu_ids=filteredSample[0].otu_ids
      let otu_labels=filteredSample[0].otu_labels
      let sample_values=filteredSample[0].sample_values
    // Build a Bubble Chart
      let trace1={
        x : otu_ids,
        y: sample_values,
        mode: 'markers',
        text:otu_labels,
        marker:{
        size:sample_values,
        color:otu_ids
      }
      }
      let d=[trace1];
      let layout={
        title:"Bacteria Cultures per Sample",
        xaxis:{'title':'OTU ID'},
        yaxis:{'title':'Number of Bacteria'},
        responsive : true
      };
      Plotly.newPlot('bubble',d,layout);
    // Render the Bubble Chart


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
      let s=filteredSample[0]
      let tuples = s.sample_values.map((x,index)=>[x,'OTU '+s.otu_ids[index],s.otu_labels[index]])
      console.log(tuples)
      let sorted=tuples.sort(function(a,b){b[0]-a[0]})
      let sliced = sorted.slice(0,10)
      sliced.reverse()
    
      let trace2={
        x:sliced.map(x=>x[0]),
        y:sliced.map(x=>x[1]),
        type:'bar',
        orientation:'h',
        text:sliced.map(x=>x[2])
      }
    let layout2={
      title:"Top 10 Bacteria Cultures Found",
      xaxis:"Number of Bacteria"

    }
    // Don't forget to slice and reverse the input data appropriately


    // Render the Bar Chart
      Plotly.newPlot('bar',[trace2])
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown=d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for(let i=0;i<names.length;i++){
        dropdown.append('option').text(names[i]);
    }


    // Get the first sample from the list
    let firstSample=names[0]

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();