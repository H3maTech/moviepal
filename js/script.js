const global = {
    currentPage: window.location.pathname,
}

async function fetchAPIData(endpoint) {
    // I know if it's a production application I probably shouldn't do this, what I most likely do I would have my backend server that I make the request to, and that's where I store this key so that other people couldn't get it, and then make my request to movie DB from the server
    const API_KEY = '0e5203973a9ff55d0009613f8b0ed9a1';
    const API_URL = 'https://api.themoviedb.org/3/';
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

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
            console.log('Shows');
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