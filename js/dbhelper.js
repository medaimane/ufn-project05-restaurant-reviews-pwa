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
      if (xhr.status === 200) {
        const json = JSON.parse(xhr.responseText);
        const restaurants = json.restaurants;
        callback(null, restaurants);
      } else {
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  }

  static fetchRestaurantById(id, callback) {
    DatabaseHelper.fetchAllRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id === id);
        restaurant ? callback(null, restaurant) : callback('Restaurant does not exist', null);
      }
    });
  }

  static fetchRestaurantByCuisine(cuisine, callback) {
    DatabaseHelper.fetchAllRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
        return;
      }

      // Filter restaurants by cuisine type
      const results = restaurants.filter(r => r.cuisine_type === cuisine);
      callback(null, results);
    });
  }

  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    DatabaseHelper.fetchAllRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
        return;
      }

      // Filter restaurants by neighborhood
      const results = restaurants.filter(r => r.neighborhood === neighborhood);
      callback(null, results);
    });
  }

  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    DatabaseHelper.fetchAllRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
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
      if (error) {
        callback(error, null);
        return;
      }

      const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
      const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) === i);
      callback(null, uniqueNeighborhoods);
    });
  }

  static fetchAllCuisines(callback) {
    DatabaseHelper.fetchAllRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
        return;
      }

      const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
      const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) === i);
      callback(null, uniqueCuisines);
    });
  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
        url: DatabaseHelper.restaurantURLWithIdAsParams(restaurant.id)
      });
      marker.addTo(newMap);
    return marker;
  }

  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DatabaseHelper.restaurantURLWithIdAsParams(restaurant),
      map: map,
      animation: google.maps.Animation.DROP},
    );
    return marker;
  } */

}

