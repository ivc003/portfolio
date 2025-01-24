console.log('IT’S ALIVE!!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact'},
    { url: 'resume/', title: 'Resume'},
    { url: 'https://github.com/ivc003', title: 'Profile'}
  ];

let nav = document.createElement('nav');
nav.classList.add('menu');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    const ARE_WE_HOME = document.documentElement.classList.contains('home');

    if (!ARE_WE_HOME && !url.startsWith('http')) {
        url = '../' + url;
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


// const navLinks = $$("nav a");
// console.log(navLinks);
// console.log([1, 2, 3, 4].find(n => n > 2));
// console.log(location.host);

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
//   );

// currentLink?.classList.add('current');

// console.log(currentLink);