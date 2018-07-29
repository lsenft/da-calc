'use strict';

app.factory('ipLocationService', ['$http', function ($http) {

    const url = 'https://extreme-ip-lookup.com/json/';


    return {
        getLocation: function () {
            return $http.get(url)
                .then(function (response) {
                    return {
                        lat: response.data.lat,
                        lng: response.data.lon,
                        zip: response.data.zip,
                        location_name: response.data.city + ', ' + response.data.region
                    };
                });
        }
    };

}]);


