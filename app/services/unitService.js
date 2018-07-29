'use strict';

app.factory('unitService', [function () {

    return {
        kelvinToCelsius: function(kelvin) {
            if (kelvin < (0)) {
                return 'below absolute zero (0 K)';
            } else {
                return (kelvin - 273.15);
            }
        },
        kelvinToFahrenheit: function(kelvin) {
            if (kelvin < (0)) {
                return 'below absolute zero (0 K)';
            } else {
                return (kelvin * 9 / 5) - 459.67;
            }
        },
        metersToFeet: function(meters) {
            if (meters < (0)) {
                return 'input cannot be less than zero';
            } else {
                return (meters/0.3048);
            }
        },
        feetToMeters: function(feet) {
            if (feet < (0)) {
                return 'input cannot be less than zero';
            } else {
                return (feet * 0.3048);
            }
        },
        hpaToInchesHg: function(hpa) {
            const mb_per_in = 33.86389;
            return hpa / mb_per_in;

        }
    };
}]);