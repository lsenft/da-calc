'use strict';

app.factory('browserLocationService', ['geolocation', function (geolocation) {

    return {
        getLocation: function () {
            return geolocation.getLocation().then(function (data) {
                return {
                    lat: data.coords.latitude,
                    lng: data.coords.longitude,
                    elevation: data.coords.altitude
                };
            });
        }
    };
}]);