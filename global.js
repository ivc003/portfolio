console.log('IT’S ALIVE!!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

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

    if (title!== 'Home' && !url.startsWith('http')) {
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


// const navLinks = $$("nav a");
// console.log(navLinks);
// console.log([1, 2, 3, 4].find(n => n > 2));
// console.log(location.host);

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
//   );

// currentLink?.classList.add('current');

// console.log(currentLink);