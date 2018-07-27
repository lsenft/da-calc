'use strict';

angular.module('myApp.calc', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/calc', {
            templateUrl: 'calc/calc.html',
            controller: 'CalcCtrl'
        });
    }])

    .controller('CalcCtrl', ['$scope', 'ipLocation', function ($scope, ipLocation, logger) {
        $scope.dac = {
            elevation: 0,
            air_temperature: 0,
            barometric_pressure: 0,
            barometric_humidity: 0,
            density_altitude: 'n/a',
            relative_density: 'n/a'
        };

        $scope.calculate = function() {
            $scope.dac.density_altitude = $scope.dac.elevation + $scope.dac.air_temperature;
        };

        ipLocation.getLocation()
            .then(function(data) {
                $scope.location = {
                    lat: data.lat,
                    lng: data.lon,
                    city: data.city,
                    zip: data.zip
                };
                return data;
            });
    }]);