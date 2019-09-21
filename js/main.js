let newMap;
const mapBoxAccessToken = 'pk.eyJ1IjoibWVkYWltYW5lIiwiYSI6ImNrMDlwenVvdjBhZHMzbG1kN3JmcHFrcG8ifQ.7ZIgW9YoZ4nJ5tmSbEW6IQ';

const onPageLoaded = () => {
  initMap();
  fetchAllNeighborhoods();
  fetchAllCuisines();
};

document.addEventListener('DOMContentLoaded', onPageLoaded);

const initMap = () => {
  createMap();
  setupTileLayer();
  updateRestaurants();
};

const createMap = () => {
  newMap = L.map('map', {
    center: [40.722216, -73.987501],
    zoom: 12,
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

const updateRestaurants = () => {
  const selectedCuisine = getSelectedCuisine();
  const selectedNeighborhood = getSelectedNeighborhood();
  DatabaseHelper.fetchRestaurantByCuisineAndNeighborhood(
      selectedCuisine,
      selectedNeighborhood,
      (error, restaurants) => {
        if(DatabaseHelper.isError(error, console.error)) {
          return;
        }
        resetRestaurants(restaurants);
        fillRestaurantsHTML(restaurants);
      },
  );
};

const getSelectedCuisine = () => {
  const cSelect = document.getElementById('cuisines-select');
  const cIndex = cSelect.selectedIndex ? cSelect.selectedIndex : 0;
  return cSelect[cIndex].value;
};

const getSelectedNeighborhood = () => {
  const nSelect = document.getElementById('neighborhoods-select');
  const nIndex = nSelect.selectedIndex ? nSelect.selectedIndex : 0;
  return nSelect[nIndex].value;
};

const resetRestaurants = restaurants => {
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
};

const fillRestaurantsHTML = restaurants => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addRestaurantsMarkersToMap(restaurants);
};

const addRestaurantsMarkersToMap = restaurants => {
  restaurants.forEach(restaurant => {
    const marker = DatabaseHelper.mapMarkerForRestaurant(restaurant, newMap);
    marker.on("click", () => window.location.href = marker.options.url);
    self.markers.push(marker);
  });
};

const createRestaurantHTML = restaurant => {
  const li = document.createElement('li');
  const image = createRestaurantImage(restaurant);
  const name = createRestaurantName(restaurant);
  const neighborhood = createRestaurantParagraph(restaurant.neighborhood);
  const address = createRestaurantParagraph(restaurant.address);
  const moreInfo = createRestaurantMoreInfoLink(restaurant);
  li.append(image);
  li.append(name);
  li.append(neighborhood);
  li.append(address);
  li.append(moreInfo);
  return li;
};

const createRestaurantImage = restaurant => {
  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.alt = `${restaurant.name} restaurant`;
  image.src = DatabaseHelper.restaurantImageUrl(restaurant);
  return image;
};

const createRestaurantName = restaurant => {
  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  return name;
};

const createRestaurantParagraph = content => {
  const p = document.createElement('p');
  p.innerHTML = content;
  return p;
};

const createRestaurantMoreInfoLink = restaurant => {
  const alink = document.createElement('a');
  alink.innerHTML = 'View Details';
  alink.href = DatabaseHelper.restaurantURLWithIdAsParams(restaurant);
  return alink;
};

const fetchAllNeighborhoods = () => {
  DatabaseHelper.fetchAllNeighborhoods((error, neighborhoods) => {
    if(DatabaseHelper.isError(error, console.error)) {
      return;
    }
    fillNeighborhoodsHTML(neighborhoods);
  });
};

const fillNeighborhoodsHTML = neighborhoods => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

const fetchAllCuisines = () => {
  DatabaseHelper.fetchAllCuisines((error, cuisines) => {
    if(DatabaseHelper.isError(error, console.error)) {
      return;
    }
    fillCuisinesHTML(cuisines);
  });
};

const fillCuisinesHTML = cuisines => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

