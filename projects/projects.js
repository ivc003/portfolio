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


let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let data = [
    { value: 1, label: 'apples' },
    { value: 2, label: 'oranges' },
    { value: 3, label: 'mangos' },
    { value: 4, label: 'pears' },
    { value: 5, label: 'limes' },
    { value: 5, label: 'cherries' },
  ];

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));


let colors = d3.scaleOrdinal(d3.schemeTableau10);
arcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
})

