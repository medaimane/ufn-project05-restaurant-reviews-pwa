let newMap;
const mapBoxAccessToken = 'pk.eyJ1IjoibWVkYWltYW5lIiwiYSI6ImNrMDlwenVvdjBhZHMzbG1kN3JmcHFrcG8ifQ.7ZIgW9YoZ4nJ5tmSbEW6IQ';

const onPageLoaded = () => initMap();

document.addEventListener('DOMContentLoaded', onPageLoaded);

const initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (DatabaseHelper.isError(error, console.error)) {
      return;
    }

    createMapByRestaurantPosition(restaurant);
    setupTileLayer();
    fillBreadcrumb(restaurant);
    DatabaseHelper.mapMarkerForRestaurant(restaurant, newMap);
  });
};

const createMapByRestaurantPosition = ({latlng: {lat, lng}}) => {
  newMap = L.map('map', {
    center: [lat, lng],
    zoom: 16,
    scrollWheelZoom: false,
  });
};

const setupTileLayer = () => {
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: mapBoxAccessToken,
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets',
  }).addTo(newMap);
};

const fillBreadcrumb = ({name}) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = createBreadcrumbItem(name);
  breadcrumb.appendChild(li);
};

const createBreadcrumbItem = name => {
  const li = document.createElement('li');
  li.innerHTML = name;
  return li;
};

const fetchRestaurantFromURL = callback => {
  const id = getRestaurantId(callback);
  DatabaseHelper.fetchRestaurantById(id, (error, restaurant) => {
    if (DatabaseHelper.isError(error, console.error)) return;
    fillRestaurantHTML(restaurant);
    callback(null, restaurant);
  });
};

const getRestaurantId = callback => {
  const id = getParameterByName('id');
  return id ? id : callback('No restaurant id in URL', null);
};

const fillRestaurantHTML = restaurant => {
  fillRestaurantName(restaurant);
  fillRestaurantAddress(restaurant);
  fillRestaurantImage(restaurant);
  fillRestaurantCuisine(restaurant);
  fillRestaurantHoursHTML(restaurant);
  fillAllReviewsHTML(restaurant);
};

const fillRestaurantName = ({name}) => {
  const nameHTML = document.getElementById('restaurant-name');
  nameHTML.innerHTML = name;
};

const fillRestaurantAddress = ({address}) => {
  const addressHTML = document.getElementById('restaurant-address');
  addressHTML.innerHTML = address;
};

const fillRestaurantImage = (restaurant) => {
  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.alt = 'TODO';
  image.src = DatabaseHelper.restaurantImageUrl(restaurant);
};

const fillRestaurantCuisine = ({cuisine_type}) => {
  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = cuisine_type;
};

const fillRestaurantHoursHTML = ({operating_hours}) => {
  if (!operating_hours) {
    return;
  }
  const hours = document.getElementById('restaurant-hours');
  const fragment = document.createDocumentFragment();
  for (const key in operating_hours) {
    if (operating_hours.hasOwnProperty(key)) {
      const row = createOperatingHoursRow(key, operating_hours[key]);
      fragment.appendChild(row);
    }
  }
  hours.appendChild(fragment);
};

const createOperatingHoursRow = (key, value) => {
  const row = document.createElement('tr');
  const day = createOperatingHoursDay(key);
  row.appendChild(day);

  const time = createOperatingHoursTime(value);
  row.appendChild(time);
  return row;
};

const createOperatingHoursDay = key  => {
  const day = document.createElement('td');
  day.innerHTML = key;
  return day;
};

const createOperatingHoursTime = value => {
  const time = document.createElement('td');
  time.innerHTML = value;
  return time;
};

const fillAllReviewsHTML = ({reviews}) => {
  const container = document.getElementById('reviews-container');
  const title = createReviewsTitle();
  container.appendChild(title);
  if (!reviews) {
    const noReviews = createNoReviewsYetParagraph();
    container.appendChild(noReviews);
    return;
  }
  const ul = createListOfReviews(reviews);
  container.appendChild(ul);
};

const createReviewsTitle = () => {
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  return title;
};

const createNoReviewsYetParagraph = () => {
  const noReviews = document.createElement('p');
  noReviews.innerHTML = 'No reviews yet!';
  return noReviews;
};

const createListOfReviews = reviews => {
  const ul = document.getElementById('reviews-list');
  const fragment = document.createDocumentFragment();
  reviews.forEach(review => fragment.appendChild(createReviewHTML(review)));
  ul.appendChild(fragment);
  return ul;
};

const createReviewHTML = review => {
  const li = document.createElement('li');
  const name = createReviewName(review);
  const date = createReviewDate(review);
  const rating = createReviewRating(review);
  const comments = createReviewComments(review);
  li.appendChild(name);
  li.appendChild(date);
  li.appendChild(rating);
  li.appendChild(comments);
  return li;
};

const createReviewName = ({name}) => {
  const nameHTML = document.createElement('p');
  nameHTML.innerHTML = name;
  return nameHTML;
};

const createReviewDate = ({date}) => {
  const dateHTML = document.createElement('p');
  dateHTML.innerHTML = date;
  return dateHTML;
};

const createReviewRating = ({rating}) => {
  const ratingHTML = document.createElement('p');
  ratingHTML.innerHTML = `Rating: ${rating}`;
  return ratingHTML;
};

const createReviewComments = ({comments}) => {
  const commentsHTML = document.createElement('p');
  commentsHTML.innerHTML = comments;
  return commentsHTML;
};

const getParameterByName = paramName => {
  const url = window.location.href;
  paramName = paramName.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${paramName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);

  if (!results) return;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
