'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngRoute',
    'ngSanitize',
    'myApp.calc',
    'myApp.about',
    'myApp.version'
]);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/calc'});
}]).factory('elevation', elevation)
    .factory('weather', weather);

elevation.$inject = ['$http'];

function elevation($http) {
    return {
        getElevation: getElevation
    };
    function getElevation(lat, lng) {
    const url = 'https://api.open-elevation.com/api/v1/lookup?locations=' + lat + ',' + lng;

    return $http.get(url)
        .then(getElevationComplete)
        .catch(getElevationFailed);
        function getElevationComplete(response) {
            return response.data;
        }

        function getElevationFailed(error) {
            var err_msg  = 'XHR Failed for ' + url + '.' + error.data;

            var msg = "<div class=\"alert alert-danger\">\n" +
                "  <strong>Error</strong> " + err_msg +"\n" +
                "</div>";
            $('#messages').append(msg);
        }
    }
}

weather.$inject = ['$http'];

function weather($http) {
    return {
        getWeather: getWeather
    };
    function getWeather(lat, lng) {
        const api_key = '133cb745ed32ad0dbf2284df34a28987';
        const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&APPID=' + api_key;

        return $http.get(url)
            .then(getWeatherComplete)
            .catch(getWeatherFailed);



        function getWeatherComplete(response) {
            return response.data;
        }

        function getWeatherFailed(error) {
            var err_msg  = 'XHR Failed for ' + url + '.' + error.data;
            var msg = "<div class=\"alert alert-danger\">\n" +
                "  <strong>Error</strong> " + err_msg +"\n" +
                "</div>";
            $('#messages').append(msg);
        }
    }
}

