'use strict';

app.factory('weatherService', ['$http', function ($http) {
    const api_key = '133cb745ed32ad0dbf2284df34a28987';

    return {
        getWeather: function (lat, lng) {
            const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&APPID=' + api_key;

            return $http.get(url)
                .then(function (response) {
                    return {
                        air_temperature: response.data.main.temp,
                        barometric_pressure: response.data.main.pressure,
                        relative_humidity: response.data.main.humidity
                    };
                });
        }
    };
}]);