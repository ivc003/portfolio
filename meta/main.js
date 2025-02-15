let data = [];

async function loadData() {
  data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line), // or just +row.line
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));

  processCommits();
  console.log(commits);
  displayStats();
  createScatterplot()
}

let commits = d3.groups(data, (d) => d.commit);

function processCommits() {
  commits = d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        url: 'https://github.com/vis-society/lab-7/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
        configurable: false, //  Prevents changing the property attributes
        writable: true, // Allows modifying the 'lines' value
        enumerable: true // Includes 'lines' in property enumeration
      });

      return ret;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
});

function displayStats() {
  // Process commits first
  processCommits();

  // Create the dl element
  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  // Add total LOC
  dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>:');
  dl.append('dd').text(data.length);

  // Add total commits
  dl.append('dt').text('Total commits:');
  dl.append('dd').text(commits.length);

  // Add more stats as needed...
  const num_files = d3.group(data, d => d.file).size
  dl.append('dt').html('Total Files:');
  dl.append('dd').text(num_files);

  const workByPeriod = d3.rollups(
    data,
    (v) => v.length,
    (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
  );
  const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
  dl.append('dt').text('Most Work Done:');
  dl.append('dd').text(maxPeriod);

  const workByDay = d3.rollups(
    data,
    (v) => v.length,
    (d) => new Date(d.datetime).getDay());

  const maxDay = d3.greatest(workByDay, (d) => d[1])?.[0];
  
  const days_week = {0:'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
    4: 'Thursday', 5: 'Friday', 6:'Saturday'};

  dl.append('dt').text('Favorite Day to Work:');
  dl.append('dd').text(days_week[maxDay]);

}


function createScatterplot() {
  const width = 1000;
  const height = 600;

  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([0, width])
    .nice();

  const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

  const margin = { top: 10, right: 10, bottom: 30, left: 20 };
  const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };
  
  // Update scales with new ranges
  xScale.range([usableArea.left, usableArea.right]);
  yScale.range([usableArea.bottom, usableArea.top]);

const gridlines = svg
  .append('g')
  .attr('class', 'gridlines')
  .attr('transform', `translate(${usableArea.left}, 0)`);

// Create gridlines as an axis with no labels and full-width ticks
gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width))
              .selectAll('.tick line') // Select all gridline ticks
              .attr('stroke', 'lightgray') // Change the gridline color to a lighter shade
              .attr('stroke-opacity', 0.5);

  // Create the axes
const xAxis = d3.axisBottom(xScale);

const yAxis = d3
  .axisLeft(yScale)
  .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');

// Add X axis
svg
  .append('g')
  .attr('transform', `translate(0, ${usableArea.bottom})`)
  .call(xAxis);

// Add Y axis
svg
  .append('g')
  .attr('transform', `translate(${usableArea.left}, 0)`)
  .call(yAxis);

const dots = svg.append('g').attr('class', 'dots');

dots
  .selectAll('circle')
  .data(commits)
  .join('circle')
  .attr('cx', (d) => xScale(d.datetime))
  .attr('cy', (d) => yScale(d.hourFrac))
  .attr('r', 5)
  .attr('fill', 'steelblue')
  .on('mouseenter', (event, commit) => {
    updateTooltipContent(commit);  // Update tooltip content when hovering over a dot
  })
  .on('mouseleave', () => {
    updateTooltipContent({});  // Clear the tooltip when leaving the dot
  });
}

function updateTooltipContent(commit) {
  const link = document.getElementById('commit-link');
  const date = document.getElementById('commit-date');
  const time = document.getElementById('commit-time');
  const author = document.getElementById('commit-author');
  const linesEdited = document.getElementById('commit-lines-edited');

  // Clear content if commit is empty
  if (Object.keys(commit).length === 0) {
    link.href = '';
    link.textContent = '';
    date.textContent = '';
    time.textContent = '';
    author.textContent = '';
    linesEdited.textContent = '';
    return;
  }

  // Update tooltip content
  link.href = commit.url;
  link.textContent = commit.id;
  date.textContent = commit.datetime?.toLocaleString('en', { dateStyle: 'full' });
  time.textContent = commit.datetime?.toLocaleTimeString('en', { timeStyle: 'short' });
  author.textContent = commit.author || 'Unknown Author';
  linesEdited.textContent = commit.linesEdited || 'N/A';
}

function updateTooltipVisibility(isVisible) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.hidden = !isVisible;
}

function updateTooltipPosition(event) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.style.left = `${event.clientX}px`;
  tooltip.style.top = `${event.clientY}px`;
}
