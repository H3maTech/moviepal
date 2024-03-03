const global = {
    currentPage: window.location.pathname,
}

async function displayPopular(endpoint = 'movie/popular') {
    const { results } = await fetchAPIData(endpoint);
    const targetMedia = endpoint.toLowerCase().includes('tv');

    results.forEach(media => {
        const title = targetMedia
        ? media.name
        : media.title;

        const release = targetMedia
        ? media.first_air_date
        : media.release_date;

        const imgSrc = media.poster_path
        ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
        : `images/no-image.jpg`

        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=${media.id}">
            <img
            src="${imgSrc}"
            class="card-img-top"
            alt="${title}"/>
        </a>
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">
                <small class="text-muted">Release: ${release || 'Unknown'}</small>
            </p>
        </div>
        `;

        document.querySelector(`#popular-${targetMedia ? 'shows' : 'movies'}`).appendChild(div)
    })
}

async function displayMovieDetails() {
    const movieId = window.location.search.split('=')[1];
    const movie = await fetchAPIData(`movie/${movieId}`);
    const div = document.createElement('div');

    // Overlay for background image
    displayBackgroundImage('movie', movie.backdrop_path);

    const imgSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : `images/no-image.jpg`

    div.innerHTML = `
    <div class="details-top">
    <div>
      <img
        src="${imgSrc}"
        class="card-img-top"
        alt="${movie.title}"
      />
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)}
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
        ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${movie.production_companies.map(company => ` ${company.name}`)}</div>
  </div>
    `;

    document.querySelector('#movie-details').appendChild(div);
}

function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';

    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv)
    } else {
        document.querySelector('#show-details').appendChild(overlayDiv)
    }
}

async function fetchAPIData(endpoint) {
    // I know if it's a production application I probably shouldn't do this, what I most likely do I would have my backend server that I make the request to, and that's where I store this key so that other people couldn't get it, and then make my request to movie DB from the server
    const API_KEY = '0e5203973a9ff55d0009613f8b0ed9a1';
    const API_URL = 'https://api.themoviedb.org/3/';

    showSpinner()

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    hideSpinner()

    return await response.json();
}

function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link')
    links.forEach(link => {
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active')
        }
    });
}

function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
}

function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displayPopular('movie/popular');
        break;
        case '/shows.html':
            displayPopular('tv/popular');
        break;
        case '/movie-details.html':
            displayMovieDetails();
        break;
        case '/search.html':
            console.log('Search');
        break;
        case '/tv-details.html':
            console.log('TV Details');
        break;
    }

    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);