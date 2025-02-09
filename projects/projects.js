import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

function updateProjectCount() {
    console.log('it worked?')
    // Select the <h1> element with class 'projects-title'
    const titleElement = document.querySelector('.projects-title');
    
    // Select all the <li> elements within the #projects-list
    const projects = document.querySelectorAll('article');
    
    // Update the text content of the title element with the project count
    titleElement.textContent = `${projects.length} Projects`;
}

// Call the function when the page loads
updateProjectCount();


// Variable to track the selected index of the pie chart slice
let selectedIndex = -1;

// Select the SVG element where the pie chart will be rendered
let svg = d3.select('svg');

// Function to render the pie chart
function renderPieChart(projectsGiven) {
  // Clear previous SVG content (remove old pie chart slices)
  svg.selectAll('path').remove(); 
  
  // Re-calculate rolled data (group projects by year)
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  // Re-calculate data for the pie chart
  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  // Slice generator for the pie chart
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);

  // Arc generator for drawing the slices
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

  // Color scale for the chart slices
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  // Render the arcs (pie slices)
  arcData.forEach((arc, i) => {
    svg.append('path')
      .attr('d', arcGenerator(arc))
      .attr('fill', colors(i)) // Use the color scale for filling
      .on('click', () => {
        // Toggle selection (deselect if clicked again)
        selectedIndex = selectedIndex === i ? -1 : i;

        // Update pie slices with the 'selected' class for the selected index
        svg.selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        // Update legend items with the 'selected' class
        d3.select('.legend').selectAll('li')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        // Filter projects and re-render them based on selected year
        if (selectedIndex === -1) {
          renderProjects(projects, projectsContainer, 'h2'); // Show all projects
        } else {
          // Filter projects by year (based on selected pie slice)
          let selectedYear = data[selectedIndex].label;
          let filteredProjects = projects.filter(project => project.year === selectedYear);
          renderProjects(filteredProjects, projectsContainer, 'h2');
        }
      });
  });

  // Render the legend
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();  // Clear previous legend items
  data.forEach((d, i) => {
    legend.append('li')
      .attr('style', `--color:${colors(i)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        // Toggle selection on legend item click
        selectedIndex = selectedIndex === i ? -1 : i;

        // Update the pie chart slices with the 'selected' class
        svg.selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        // Update the legend items with the 'selected' class
        legend.selectAll('li')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        // Filter projects and re-render them based on selected year
        if (selectedIndex === -1) {
          renderProjects(projects, projectsContainer, 'h2'); // Show all projects
        } else {
          // Filter projects by year (based on selected legend item)
          let selectedYear = data[selectedIndex].label;
          let filteredProjects = projects.filter(project => project.year === selectedYear);
          renderProjects(filteredProjects, projectsContainer, 'h2');
        }
      });
  });
}

// Call this function to render the initial pie chart and legend
renderPieChart(projects);

// Add event listener for search input (use `input` for real-time search)
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  // Get the search query from the input
  let query = event.target.value;

  // Filter projects based on the query
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects); // Update the pie chart based on filtered projects
});


