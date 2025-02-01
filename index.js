// import { fetchGitHubData, fetchJSON, renderProjects } from 'portfolio/global.js';

async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      console.log(response)
      const data = await response.json();
      return data;
  
  
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
  }
  
  function renderProjects(project, containerElement, headingLevel = 'h2') {
    // Your code will go here
    containerElement.innerHTML = '';
  
    for (let p in project) {
    const article = document.createElement('article');
    article.innerHTML = `
      <h2>${project[p].title}</h2>
      <img src="${project[p].image}" alt="${project[p].title}">
      <p>(${project[p].year}) ${project[p].description}</p>
  `;
  
    containerElement.appendChild(article);
  }
  }
  
  async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
  }

    const projects = await fetchJSON('./lib/projects.json');
    const latestProjects = projects.slice(0, 3);
    console.log('it worked kinda?')

    const projectsContainer = document.querySelector('.projects');
    renderProjects(latestProjects, projectsContainer, 'h2');

    const githubData = await fetchGitHubData('ivc003');
    const profileStats = document.querySelector('#profile-stats');

    if (profileStats) {
        profileStats.innerHTML = `
            <h2>&#9824 My GitHub Stats</h2>
            <dl>
                <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
                <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
                <dt>Followers:</dt><dd>${githubData.followers}</dd>
                <dt>Following:</dt><dd>${githubData.following}</dd>
            </dl>
        `;
    }
