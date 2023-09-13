const margin = {top: 45, right: 30, bottom: 50, left: 80};
const width = 600; // Total width of the SVG parent
const height = 600; // Total height of the SVG parent
const padding = 1; // Vertical space between the bars of the histogram
const barsColor = 'steelblue';

// Load data here
d3.csv('data/pay_by_gender_tennis.csv').then(data => {
  console.log(data);
  createHistogram(data);
})
.catch(error => {
  console.error(error);
});


// Create Histogram
const createHistogram = () => {
  
};

// Create Split Violin Plot
const createViolin = () => {
  
};
