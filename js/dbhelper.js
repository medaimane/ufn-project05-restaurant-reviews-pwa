class DatabaseHelper {

  static get databaseURL() {
    const BASE_URL = 'http://localhost';
    const PORT = 3000;
    const restaurantsJSON = 'data/restaurants.json';

    return `${BASE_URL}:${PORT}/${restaurantsJSON}`;
  }

  static restaurantURLWithIdAsParams({id}) {
    return (`./restaurant.html?id=${id}`);
  }

  static restaurantImageUrl({photograph}) {
    return (`/img/${photograph}`);
  }

  static fetchAllRestaurants(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', DatabaseHelper.databaseURL);
    xhr.onload = () => {
      if (xhr.status !== 200) {
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
        return;
      }

      const json = JSON.parse(xhr.responseText);
      const restaurants = json.restaurants;
      callback(null, restaurants);
    };
    xhr.send();
  }

  static fetchRestaurantById(id, callback) {
    DatabaseHelper.fetchAllRestaurants((error, restaurants) => {
      if (DatabaseHelper.isError(error, callback)) {
        return;
      }

      const restaurant = restaurants.find(r => r.id === Number(id));
      restaurant ? callback(null, restaurant) : callback('Restaurant does not exist', null);
    });
  }

  static fetchRestaurantByCuisine(cuisine, callback) {
    DatabaseHelper.fetchAllRestaurants((error, restaurants) => {
      if (DatabaseHelper.isError(error, callback)) {
        return;
      }

      const results = restaurants.filter(r => r.cuisine_type === cuisine);
      callback(null, results);
    });
  }

  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    DatabaseHelper.fetchAllRestaurants((error, restaurants) => {
      if (DatabaseHelper.isError(error, callback)) {
        return;
      }

      // Filter restaurants by neighborhood
      const results = restaurants.filter(r => r.neighborhood === neighborhood);
      callback(null, results);
    });
  }

  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    DatabaseHelper.fetchAllRestaurants((error, restaurants) => {
      if (DatabaseHelper.isError(error, callback)) {
        return;
      }

      // Filter restaurants by cuisine type and neighborhood
      let result = [];
      if (cuisine !== 'all') {
        result = restaurants.filter(r => r.cuisine_type === cuisine);
      }
      if (neighborhood !== 'all') {
        result = restaurants.filter(r => r.neighborhood === neighborhood);
      }
      callback(null, result);
    });
  }

  static fetchAllNeighborhoods(callback) {
    DatabaseHelper.fetchAllRestaurants((error, restaurants) => {
      if (DatabaseHelper.isError(error, callback)) {
        return;
      }

      const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
      const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) === i);
      callback(null, uniqueNeighborhoods);
    });
  }

  static fetchAllCuisines(callback) {
    DatabaseHelper.fetchAllRestaurants((error, restaurants) => {
      if (DatabaseHelper.isError(error, callback)) {
        return;
      }

      const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
      const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) === i);
      callback(null, uniqueCuisines);
    });
  }

  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker([
      restaurant.latlng.lat,
      restaurant.latlng.lng
    ], {
      title: restaurant.name,
      alt: restaurant.name,
      url: DatabaseHelper.restaurantURLWithIdAsParams(restaurant)
    });
    marker.addTo(map);
    return marker;
  }

  static isError = (error, callback) => {
    if (error) {
      callback(error, null);
      return true;
    }
    return false;
  }
}

