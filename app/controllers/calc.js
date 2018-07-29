'use strict';

angular.module('myApp.calc', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/calc', {
            templateUrl: 'views/calc.html',
            controller: 'CalcCtrl'
        });
    }])
    .controller('CalcCtrl', [
        '$scope',
        '$q',
        'browserLocationService',
        'weatherService',
        'calculationService',
        function ($scope, $q, browserLocationService,  weatherService, calculationService) {
            $scope.weather = {
                air_temperature: 0,
                barometric_pressure: 0,
                relative_humidity: 0,
                location_name: '&nbsp;'
            };

            $scope.dac = {
                density_altitude: 'n/a',
                relative_density: 'n/a'
            };
            $scope.location = {lat: 0, lng: 0, elevation: 0};

            let locationRequest = browserLocationService.getLocation().then(function (responses) {
                $scope.location = responses;
            });

            let weatherRequest = $q.all([locationRequest]).then(function(){
                return weatherService.getWeather($scope.location.lat, $scope.location.lng).then(function (response) {
                    $scope.weather = response;
                });
            });


            $q.all([locationRequest, weatherRequest]).then(function() {
                    let options = {
                        elevation: $scope.location.elevation,
                        barometric_pressure: $scope.weather.barometric_pressure,
                        air_temperature: $scope.weather.air_temperature,
                        relative_humidity: $scope.weather.relative_humidity
                    };
                    $scope.dac = calculationService.calculate(options);
                })
                .catch(function (e) {
                let msg = "<div class=\"alert alert-danger\">\n" +
                    "  <strong>Error:</strong> " + e.message + "\n" +
                    "</div>";
                $('#messages').append(msg);

            })['finally'](function () {
                $('#loading, #loading-overlay').hide();
            });
        }
]
    );


