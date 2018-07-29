'use strict';

app.factory('browserLocationService',
    [
        'geolocation',
        '$q',
        'ipLocationService',
        'elevationService',
        function (geolocation, $q, ipLocationService, elevationService) {

            return {
                getLocation: function () {
                    return geolocation.getLocation().then(
                        function (data) {
                            return {
                                lat: data.coords.latitude,
                                lng: data.coords.longitude,
                                elevation: data.coords.altitude
                            };
                        },
                        function (err) {
                            let data = {};

                            let ipRequest = ipLocationService.getLocation().then(function (response) {
                                data.lat = response.lat;
                                data.lng = response.lng;
                            });

                            return $q.all([ipRequest]).then(function () {
                                return elevationService.getElevation(data.lat, data.lng);
                            }).then(function (responses) {
                                data.elevation = responses;
                                return data;
                            });
                        }
                    );
                }
            };
        }
    ]
);