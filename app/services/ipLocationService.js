'use strict';

app.factory('ipLocationService', ['$http', function ($http) {


        const url = '//ip-api.com/json';


        return {
            getLocation: function () {
                return $http.get(url)
                    .then(function(response) {
                        return response;
                    });
            }
        };

}]);


