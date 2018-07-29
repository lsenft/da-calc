'use strict';

app.factory('calculationService', [function () {

    const in_per_mb = (1 / 33.86389);
    const mb_per_in = 33.86389;
    const m_per_ft = 0.304800;
    const ft_per_m = (1 / 0.304800);


    function calcVaporPressure_wobus(t)
// Calculate the saturation vapor pressure given the temperature(celsius)
// Polynomial from Herman Wobus
    {
        let eso = 6.1078;
        let es;
        let c0 = 0.99999683;
        let c1 = -0.90826951E-02;
        let c2 = 0.78736169E-04;
        let c3 = -0.61117958E-06;
        let c4 = 0.43884187E-08;
        let c5 = -0.29883885E-10;
        let c6 = 0.21874425E-12;
        let c7 = -0.17892321E-14;
        let c8 = 0.11112018E-16;
        let c9 = -0.30994571E-19;

        let pol = c0 + t * (c1 + t * (c2 + t * (c3 + t * (c4 + t * (c5 + t * (c6 + t * (c7 + t * (c8 + t * (c9)))))))));

        es = eso / Math.pow(pol, 8);

        return (es);
    }


    function calcAbsPress(pressure, altitude)
// Calculate absolute air pressure given the barometric pressure(mb) and altitude(meters)
    {
        let k1 = 0.190284;
        let k2 = 8.4288 * Math.pow(10, -5);
        let p1 = Math.pow(pressure, k1);
        let p2 = altitude * k2;
        let p3 = 0.3 + Math.pow((p1 - p2), (1 / k1));
        return (p3);
    }


    function calcDensity(abspressmb, e, tc)
//  Calculate the air density in kg/m3
    {
        let Rv = 461.4964;
        let Rd = 287.0531;

        let tk = tc + 273.15;
        let pv = e * 100;
        let pd = (abspressmb - e) * 100;
        let d = (pv / (Rv * tk)) + (pd / (Rd * tk));
        return (d);
    }


    function calcAltitude(d)
// Calculate the ISA altitude (meters) for a given density (kg/m3)
    {
        let g = 9.80665;
        let Po = 101325;
        let To = 288.15;
        let L = 6.5;
        let R = 8.314320;
        let M = 28.9644;

        let D = d * 1000;

        let p2 = ((L * R) / (g * M - L * R)) * Math.log((R * To * D) / (M * Po));

        let H = -(To / L) * (Math.exp(p2) - 1);

        let h = H * 1000;

        return (h);
    }

    // Calculate the Z altitude (meters), given the H altitide (meters)
    function calcZ(h) {
        let r = 6369E3;

        return ((r * h) / (r - h));

    }


    function calcH(z)
// Calculate the H altitude (meters), given the Z altitide (meters)
    {
        let r = 6369E3;

        return ((r * z) / (r + z));

    }


    function calcAs2Press(As, h)
// Calculate the actual pressure (mb)from the altimeter setting (mb) and geopotential altitude (m)
    {
        let k1 = 0.190263;
        let k2 = 8.417286E-5;

        let p = Math.pow((Math.pow(As, k1) - (k2 * h)), (1 / k1));

        return (p);
    }

    return {
        calculate: function (data) {
            // define variables to be used in inputs
            let z, zm, altset, altsetmb, tk, tc, tf, tdpf, tdpc;


            // Process the input values

            // geometric elevation, meters
            zm = 1.0 * data.elevation;


            // altimeter/Barometric Pressure setting, in-hPa
            altsetmb = 1.0 * data.barometric_pressure;


            // Air temperature, deg F
            tk = 1.0 * data.air_temperature;
            tc = tk - 273.15;
            tf = ((9 / 5) * tc) + 32;


            let rh = 1.0 * data.relative_humidity;			// relative humidity, %


            // Calculate the vapor pressures (mb) given the ambient temperature (c) and relative humidity (c)
            let esmb = calcVaporPressure_wobus(tc);
            let emb = esmb * rh / 100;

            // Calculate geopotential altitude H (m) from geometric altitude (m) Z
            let hm = calcH(zm);


            // Calculate the absolute pressure given the altimeter setting(mb) and geopotential elevation(meters)
            let actpressmb = calcAs2Press(altsetmb, hm);


            // Calculate the air density (kg/m3) from absolute pressure (mb) vapor pressure (mb) and temp (c)
            let density = calcDensity(actpressmb, emb, tc);
            let relden = 100 * (density / 1.225);


            // Calculate the geopotential altitude (m) in ISA with that same density (kg/m3)
            let densaltm = calcAltitude(density);

            // Calculate geometric altitude Z (m) from geopotential altitude (m) H
            let densaltzm = calcZ(densaltm);


            // Convert Units for output
            let actpress = actpressmb * in_per_mb;
            let densaltz = densaltzm * ft_per_m;

            if (densaltz > 36090 || densaltz < -15000) {
                let err_msg = "Out of range for Troposhere Algorithm: Altitude =" + densaltz + " feet\nPlease check your input values.";
                let msg = "<div class=\"alert alert-danger\">\n" +
                    "  <strong>Error</strong> " + err_msg + "\n" +
                    "</div>";
                $('#messages').append(msg);
                return;
            }


            // calculate estimated awos density altitude
            let nws = 145442.16 * (1 - Math.pow(((17.326 * actpress) / (tf + 459.67)), 0.235));
            let awos = (nws / 100) * 100;
            let density_e = density * 0.062428;
            let awosm = awos * m_per_ft;

            return {
                relative_density: relden,
                density_altitude: awos
            };
        }
    };
}]);