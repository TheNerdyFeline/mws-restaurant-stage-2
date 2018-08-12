// import idb from 'idb';
let idb = require('./idb');

let restaurants,
  neighborhoods,
  cuisines,db;
let map;
let markers = [];
let dbUrl = "http://localhost:1337/restaurants/";

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchRestaurants();
  // fetchNeighborhoods();
  // fetchCuisines();
});

// fetch restaurants from server using fetch
fetchRestaurants = () => {
  fetch(dbUrl).then(resp => resp.json()).catch(e => console.log(e)).then((resp) => {
    db = idb.open('rest-db', 1, function(upgradeDb) {
      let restDb = upgradeDb.createObjectStore('restaurant');
      restDb.put(resp);
    });
  });
}

/**
 * Fetch all neighborhoods and set their HTML.
 */
// fetchNeighborhoods = (response) => {
//   fetchRestaurants(restaurants) => {
//     let neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
//     let uniqueNeighbors = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
//     // self.neighborhoods = neighborhoods;
//     fillNeighborhoodsHTML(uniqueNeighbors);
//     }
//   });
// }

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

