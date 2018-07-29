'use strict';

app.factory('elevationService', ['$http', function ($http) {

    return {
        getElevation: function (lat, lng) {

            const url = 'https://api.open-elevation.com/api/v1/lookup?locations=' + lat + ',' + lng;

            return $http.get(url)
                .then(function (response) {
                    return response.data.results[0].elevation;
                });
        }
    };
}]);