const global = {
    currentPage: window.location.pathname,
}

async function displayPopular(endpoint) {
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
                <small class="text-muted">Release: ${release}</small>
            </p>
        </div>
        `;

        document.querySelector(`#popular-${targetMedia ? 'shows' : 'movies'}`).appendChild(div)
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
            displayPopular('movie/popular');
        break;
        case '/shows.html':
            displayPopular('tv/popular');
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