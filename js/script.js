const global = {
    currentPage: window.location.pathname,
    search: {
      term: '',
      type: '',
      page: 1,
      totalPages: 1,
      totalResults: 0,
    },
    api: {
      apiKey: '0e5203973a9ff55d0009613f8b0ed9a1',
      apiUrl: 'https://api.themoviedb.org/3/',
    }
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
        <a href="${targetMedia ? 'tv' : 'movie'}-details.html?id=${media.id}">
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

async function displayShowDetails() {
    const showId = window.location.search.split('=')[1];
    const show = await fetchAPIData(`tv/${showId}`);
    const div = document.createElement('div');

    console.log(show);

    // Overlay for background image
    displayBackgroundImage('tv', show.backdrop_path);

    const imgSrc = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : `images/no-image.jpg`

    div.innerHTML = `
    <div class="details-top">
    <div>
      <img
        src="${imgSrc}"
        class="card-img-top"
        alt="${show.name}"
      />
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)}
      </p>
      <p class="text-muted">Release Date: ${show.release_date}</p>
      <p>
        ${show.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${show.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
      <li><span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name} minutes</li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${show.production_companies.map(company => ` ${company.name}`)}</div>
  </div>
    `;

    document.querySelector('#show-details').appendChild(div);
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

    document.querySelector(`#${type === 'movie' ? 'movie' : 'show'}-details`).appendChild(overlayDiv)
}

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    // TODO: make request and display result
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert('No results found', 'success');
      return;
    }

    displaySearchResults(results);
    document.querySelector('#search-term').value = '';

  } else {
    showAlert('Please enter a search term');
  }
}

function displaySearchResults(results) {
  const type = !global.search.type;
  console.log(type);

  results.forEach(media => {
  const title = type
    ? media.name
    : media.title;

    const release = type
    ? media.first_air_date
    : media.release_date;

    const imgSrc = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : `images/no-image.jpg`

    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <a href="${type ? 'tv' : 'movie'}-details.html?id=${media.id}">
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

    document.querySelector('#search-results-heading').innerHTML = `
      <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `
    document.querySelector(`#search-results`).appendChild(div)
  })

  displayPagination();
}

function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `

  document.querySelector('#pagination').appendChild(div);
}

async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');
  results.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
      </h4>
    `

    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  })
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    breakpoints: {
      500: {
        slidesPerView: 2
      },
      700: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      },
    }
  })
}

async function fetchAPIData(endpoint) {
    // I know if it's a production application I probably shouldn't do this, what I most likely do I would have my backend server that I make the request to, and that's where I store this key so that other people couldn't get it, and then make my request to movie DB from the server
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    showSpinner()

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    hideSpinner()

    return await response.json();
}

async function searchAPIData() {
  showSpinner()

  const response = await fetch(`${global.api.apiUrl}search/${global.search.type}?api_key=${global.api.apiKey}&language=en-US&query=${global.search.term}`);

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

function showAlert(message, className = 'error') {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}

function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displaySlider();
            displayPopular('movie/popular');
        break;
        case '/shows.html':
            displayPopular('tv/popular');
        break;
        case '/movie-details.html':
            displayMovieDetails();
        break;
        case '/search.html':
            search();
        break;
        case '/tv-details.html':
            displayShowDetails();
        break;
    }

    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);