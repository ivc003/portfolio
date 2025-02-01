import { fetchGitHubData, fetchJSON, renderProjects } from '../../portfolio/global.js';

async function loadData() {
    const projects = await fetchJSON('../lib/projects.json');
    const latestProjects = projects.slice(0, 3);

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
}

loadData();
