'use strict';

angular.module('myApp.calc', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/calc', {
    templateUrl: 'calc/calc.html',
    controller: 'CalcCtrl'
  });
}])

.controller('CalcCtrl', [function() {

}]);