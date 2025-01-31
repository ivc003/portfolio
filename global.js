// Checking that it's alive
console.log('IT’S ALIVE!!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Remove in the future portfolio/ for live server
let pages = [
    { url: 'portfolio/', title: 'Home' },
    { url: 'portfolio/projects/', title: 'Projects' },
    { url: 'portfolio/contact/', title: 'Contact'},
    { url: 'portfolio/resume/', title: 'Resume'},
    { url: 'https://github.com/ivc003', title: 'Profile'}
  ];


let nav = document.createElement('nav');
nav.classList.add('menu');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    const ARE_WE_HOME = document.documentElement.classList.contains('home');

    if (!url.startsWith('http')) {
        url = '../../' + url;
      }

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
      }

      if (a.host !== location.host && a.pathname === location.pathname) {
        a.target.add('_blank');
      }

    nav.append(a);
  }

document.body.insertAdjacentHTML(
    'afterbegin',
    `
        <label class="color-scheme">
            Theme:
            <select id="theme-selector">
                <option value="auto">Automatic</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </label>`
    );

const select = document.querySelector('#theme-selector');
const savedColorScheme = localStorage.getItem('colorScheme');
console.log('Current color scheme:', savedColorScheme);

if (savedColorScheme) {
    // If a saved color scheme exists
    document.documentElement.style.setProperty('color-scheme', savedColorScheme);
    select.value = 'auto'; // Set the dropdown to match the saved value
  } else {
    // If no saved color scheme, set it to 'auto'
    select.value = 'auto';
  }

select.addEventListener('input', function (event) {
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.setItem('colorScheme', event.target.value);

    console.log('New color scheme:', event.target.value);
});

export async function fetchJSON(url) {
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

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  // Your code will go here
  containerElement.innerHTML = '';

  const article = document.createElement('article');
  article.innerHTML = `
    <h2>${project.title}</h2>
    <img src="${project.image}" alt="${project.title}">
    <p>${project.description}</p>
`;
  containerElement.appendChild(article);
}
