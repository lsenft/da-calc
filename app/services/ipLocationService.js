'use strict';

app.factory('ipLocationService', ['$http', function ($http) {

        const api_key = 'bc94d4c7a65731049143bda2b564f31b';
        const url = 'https://api.ipstack.com/check?access_key=' + api_key;


        return {
            getLocation: function () {
                return $http.get(url)
                    .then(function(response) {
                        return response;
                    });
            }
        };

}]);


