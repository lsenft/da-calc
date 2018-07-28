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

        const in_per_mb = (1 / 33.86389);
        const mb_per_in = 33.86389;
        const m_per_ft = 0.304800;
        const ft_per_m = (1 / 0.304800);

        // Ported from Java
        // https://github.com/pkck28/International-Standard-Atmosphere
        $scope.calculate = function () {

            // define variables to be used in inputs
            var z, zm, altset, altsetmb, tk, tc, tf, tdpf, tdpc;


            // Process the input values

            // geometric elevation, meters
            zm = 1.0 * $scope.dac.elevation;



                // altimeter/Barometric Pressure setting, in-hPa
                altsetmb = 1.0 * $scope.dac.barometric_pressure;



                // Air temperature, deg F
                tk = 1.0 * $scope.dac.air_temperature;
                tc = tk - 273.15;
                tf = ((9/5)*tc)+32;





            let rh = 1.0 * $scope.dac.relative_humidity;			// relative humidity, %


// Calculate the vapor pressures (mb) given the ambient temperature (c) and relative humidity (c)

            let esmb = calcVaporPressure_wobus(tc);
            let emb = esmb * rh / 100;


// Calculate geopotential altitude H (m) from geometric altitude (m) Z

            var hm = calcH(zm);


// Calculate the absolute pressure given the altimeter setting(mb) and geopotential elevation(meters)

            var actpressmb = calcAs2Press(altsetmb, hm);


// Calculate the air density (kg/m3) from absolute pressure (mb) vapor pressure (mb) and temp (c)

            var density = calcDensity(actpressmb, emb, tc);
            var relden = 100 * (density / 1.225);


// Calculate the geopotential altitude (m) in ISA with that same density (kg/m3)

            var densaltm = calcAltitude(density);

// Calculate geometric altitude Z (m) from geopotential altitude (m) H

            var densaltzm = calcZ(densaltm);


// Convert Units for output

            var actpress = actpressmb * in_per_mb;
            var densaltz = densaltzm * ft_per_m;

            if (densaltz > 36090 || densaltz < -15000) {
                alert("Out of range for Troposhere Algorithm: Altitude =" + roundNum(densaltz, 0) + " feet\nPlease check your input values.");
                return;
            }


// calculate estimated awos density altitude

            var nws = 145442.16 * (1 - Math.pow(((17.326 * actpress) / (tf + 459.67)), 0.235));
            var awos = roundNum(nws / 100) * 100;


// Print the results
            var outForm = {};
            outForm.densaltz = roundNum(densaltz, 0);
            outForm.densaltzm = roundNum(densaltzm, 0);

            outForm.actpress = roundNum(actpress, 3);
            outForm.actpressmb = roundNum(actpressmb, 2);

            outForm.density_m = roundNum(density, 3);
            outForm.density_e = roundNum(density * 0.062428, 4);

            $scope.dac.relative_density = roundNum(relden, 2);

            $scope.dac.density_altitude = awos;

            outForm.awosm = roundNum((awos * m_per_ft), 0);

            console.log(outForm);
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
                $scope.dac.air_temperature = data.main.temp;
                $scope.dac.barometric_pressure = data.main.pressure;
                $scope.dac.relative_humidity = data.main.humidity;
                return data;
            });
        });

        //  Rounding function by Jason Moon
        function roundNum(Num, Places) {
            if (Places > 0) {
                if ((Num.toString().length - Num.toString().lastIndexOf('.')) > (Places + 1)) {
                    var Rounder = Math.pow(10, Places);
                    return Math.round(Num * Rounder) / Rounder;
                }
                else {
                    return Num;
                }
            }
            else {
                return Math.round(Num);
            }
        }

        function calcVaporPressure_wobus(t)
// Calculate the saturation vapor pressure given the temperature(celsius)
// Polynomial from Herman Wobus
        {
            var eso = 6.1078;
            var es;
            var c0 = 0.99999683;
            var c1 = -0.90826951E-02;
            var c2 = 0.78736169E-04;
            var c3 = -0.61117958E-06;
            var c4 = 0.43884187E-08;
            var c5 = -0.29883885E-10;
            var c6 = 0.21874425E-12;
            var c7 = -0.17892321E-14;
            var c8 = 0.11112018E-16;
            var c9 = -0.30994571E-19;

            var pol = c0 + t * (c1 + t * (c2 + t * (c3 + t * (c4 + t * (c5 + t * (c6 + t * (c7 + t * (c8 + t * (c9)))))))));

            es = eso / Math.pow(pol, 8);

            return (es);
        }


        function calcAbsPress(pressure, altitude)
// Calculate absolute air pressure given the barometric pressure(mb) and altitude(meters)
        {
            var k1 = 0.190284;
            var k2 = 8.4288 * Math.pow(10, -5);
            var p1 = Math.pow(pressure, k1);
            var p2 = altitude * k2;
            var p3 = 0.3 + Math.pow((p1 - p2), (1 / k1));
            return (p3);
        }


        function calcDensity(abspressmb, e, tc)
//  Calculate the air density in kg/m3
        {
            var Rv = 461.4964;
            var Rd = 287.0531;

            var tk = tc + 273.15;
            var pv = e * 100;
            var pd = (abspressmb - e) * 100;
            var d = (pv / (Rv * tk)) + (pd / (Rd * tk));
            return (d);
        }


        function calcAltitude(d)
// Calculate the ISA altitude (meters) for a given density (kg/m3)
        {
            var g = 9.80665;
            var Po = 101325;
            var To = 288.15;
            var L = 6.5;
            var R = 8.314320;
            var M = 28.9644;

            var D = d * 1000;

            var p2 = ((L * R) / (g * M - L * R)) * Math.log((R * To * D) / (M * Po));

            var H = -(To / L) * (Math.exp(p2) - 1);

            var h = H * 1000;

            return (h);
        }


        function calcZ(h)
// Calculate the Z altitude (meters), given the H altitide (meters)
        {
            var r = 6369E3;

            return ((r * h) / (r - h));

        }


        function calcH(z)
// Calculate the H altitude (meters), given the Z altitide (meters)
        {
            var r = 6369E3;

            return ((r * z) / (r + z));

        }


        function calcAs2Press(As, h)
// Calculate the actual pressure (mb)from the altimeter setting (mb) and geopotential altitude (m)
        {
            var k1 = 0.190263;
            var k2 = 8.417286E-5;

            var p = Math.pow((Math.pow(As, k1) - (k2 * h)), (1 / k1));

            return (p);
        }


    }]);


