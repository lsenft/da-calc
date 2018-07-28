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
        'ipLocationService',
        'elevationService',
        'weatherService',
        'calculationService',
        function ($scope, ipLocationService, elevationService, weatherService, calculationService) {
        $scope.elevation = 0;
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





            ipLocationService.getLocation()
                .then(function (response) {

                    $('#progress-bar').html('Loading location...');


                    $scope.location = response;


                    $('#progress-bar').css({'width': '25%'});

                    return response;
                }).then(function () {
                    $('#progress-bar').html('Loading elevation...');

                    elevationService.getElevation($scope.location.lat, $scope.location.lng).then(function (data) {
                        $scope.elevation = data;
                        $('#progress-bar').css({'width': '50%'});
                    return data;
                });
            }).then(function () {
                if (!$scope.location) {
                    return;
                }

                $('#progress-bar').html('Loading weather...');


                weatherService.getWeather($scope.location.lat, $scope.location.lng).then(function (data) {
                    $scope.weather = data;

                    $('#progress-bar').css({'width': '75%'});
                    return data;
                });
            }).then(function () {
                $('#progress-bar').html('Calculating...');
                $('#progress-bar').css({'width': '75%'});

                $scope.dac = calculationService.calculate({
                    elevation: $scope.elevation,
                    barometric_pressure: $scope.weather.barometric_pressure,
                    air_temperature: $scope.weather.air_temperature,
                    relative_humidity: $scope.weather.relative_humidity
                });

                $('#progress-bar').css({'width': '100%'});
                $('#loading, #loading-overlay').hide();
            }).catch(function(e){

                var msg = "<div class=\"alert alert-danger\">\n" +
                    "  <strong>Error " +  e.status + "</strong> " +  e.statusText +"\n" +
                    "</div>";
                $('#messages').append(msg);

            })
                .finally(function() {
                    $('#progress-bar').css({'width': '100%'});
                    $('#loading, #loading-overlay').hide();
                });

    }]);


