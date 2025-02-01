import { fetchJSON, renderProjects } from 'portfolio/global.js';

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
