'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.calc',
    'myApp.about',
    'myApp.version'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/calc'});
}]).factory('ipLocation', ipLocation).factory('elevation', elevation);

ipLocation.$inject = ['$http'];

function ipLocation($http) {
    return {
        getLocation: getLocation
    };

    function getLocation() {
        const url = 'http://ip-api.com/json';

        return $http.get(url)
            .then(getLocationComplete)
            .catch(getLocationFailed);

        function getLocationComplete(response) {
            return response.data;
        }

        function getLocationFailed(error) {
            console.log('XHR Failed for ' + url + '.' + error.data);
        }
    }
}

elevation.$inject = ['$http'];

function elevation($http) {
    return {
        getElevation: getElevation
    };
    function getElevation(lat, lng) {
    const url = 'https://api.open-elevation.com/api/v1/lookup?locations=' + lat + ',' +lng;

    return $http.get(url)
        .then(getElevationComplete)
        .catch(getElevationFailed);



        function getElevationComplete(response) {
            return response.data;
        }

        function getElevationFailed(error) {
            console.log('XHR Failed for ' + url + '.' + error.data);
        }
    }
}