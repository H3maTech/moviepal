const global = {
    currentPage: window.location.pathname,
}

async function displayPopularMovies() {
    const { results } = await fetchAPIData('movie/popular');

    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
           ${
            movie.poster_path ?
            `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"/>` :
            `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"/>`
           }
        </a>
        <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
                <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
        </div>
        `;

        document.querySelector('#popular-movies').appendChild(div)
    })
}

async function displayPopularShows() {
    const { results } = await fetchAPIData('tv/popular');

    results.forEach(show => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=${show.id}">
           ${
            show.poster_path ?
            `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"/>` :
            `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"/>`
           }
        </a>
        <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
                <small class="text-muted">Release: ${show.first_air_date}</small>
            </p>
        </div>
        `;

        document.querySelector('#popular-shows').appendChild(div)
    })
}

function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
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

function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMovies();
        break;
        case '/shows.html':
            displayPopularShows();
        break;
        case '/movie-details.html':
            console.log('Movie Details');
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