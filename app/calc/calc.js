'use strict';

angular.module('myApp.calc', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/calc', {
            templateUrl: 'calc/calc.html',
            controller: 'CalcCtrl'
        });
    }])

    .controller('CalcCtrl', ['$scope', 'ipLocation', 'elevation', 'weather', function ($scope, ipLocation, elevation, weather) {
        $scope.dac = {
            elevation: 0,
            air_temperature: 0,
            barometric_pressure: 0,
            relative_humidity: 0,
            density_altitude: 'n/a',
            relative_density: 'n/a'
        };

        $scope.calculate = function () {
            $scope.dac.density_altitude = $scope.dac.elevation + $scope.dac.air_temperature;
        };

        ipLocation.getLocation()
            .then(function (data) {
                $scope.location = {
                    lat: data.lat,
                    lng: data.lon,
                    city: data.city,
                    zip: data.zip
                };
                return data;
            }).then(function () {
                elevation.getElevation($scope.location.lat, $scope.location.lng).then(function (data) {
                    $scope.dac.elevation = data.results[0].elevation;
                    return data;
            });
        }).then(function () {
            weather.getWeather($scope.location.lat, $scope.location.lng).then(function (data) {
                console.log( data);

                $scope.dac.air_temperature = data.main.temp;
                $scope.dac.barometric_pressure = data.main.pressure;
                $scope.dac.relative_humidity = data.main.humidity;
                return data;
            });
        });


    }]);


