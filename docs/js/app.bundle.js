"use strict";let app=angular.module("myApp",["ngRoute","ngSanitize","geolocation","myApp.calc","myApp.about","myApp.version"]);app.config(["$locationProvider","$routeProvider",function(e,t){e.hashPrefix("!"),t.otherwise({redirectTo:"/calc"})}]),app.factory("browserLocationService",["geolocation","$q","ipLocationService","elevationService",function(e,t,n,r){return{getLocation:function(){return e.getLocation().then(function(e){return{lat:e.coords.latitude,lng:e.coords.longitude,elevation:e.coords.altitude}},function(e){let a={},o=n.getLocation().then(function(e){a.lat=e.lat,a.lng=e.lng});return t.all([o]).then(function(){return r.getElevation(a.lat,a.lng)}).then(function(e){return a.elevation=e,a})})}}}]),app.factory("ipLocationService",["$http",function(e){return{getLocation:function(){return e.get("https://extreme-ip-lookup.com/json/").then(function(e){return{lat:e.data.lat,lng:e.data.lon,zip:e.data.zip,location_name:e.data.city+", "+e.data.region}})}}}]),app.factory("weatherService",["$http",function(e){return{getWeather:function(t,n){const r="https://api.openweathermap.org/data/2.5/weather?lat="+t+"&lon="+n+"&APPID=133cb745ed32ad0dbf2284df34a28987";return e.get(r).then(function(e){return{air_temperature:e.data.main.temp,barometric_pressure:e.data.main.pressure,relative_humidity:e.data.main.humidity,location_name:e.data.name}})}}}]),app.factory("elevationService",["$http",function(e){return{getElevation:function(t,n){const r="https://api.open-elevation.com/api/v1/lookup?locations="+t+","+n;return e.get(r).then(function(e){return e.data.results[0].elevation})}}}]),app.factory("calculationService",[function(){return{calculate:function(e){let t,n,r,a,o;t=1*e.elevation,n=1*e.barometric_pressure,o=1.8*(a=(r=1*e.air_temperature)-273.15)+32;let i=1*e.relative_humidity,l=function(e){let t,n=.99999683+e*(e*(78736169e-12+e*(e*(4.3884187e-9+e*(e*(2.1874425e-13+e*(e*(1.1112018e-17+-3.0994571e-20*e)-1.7892321e-15))-2.9883885e-11))-6.1117958e-7))-.0090826951);return t=6.1078/Math.pow(n,8)}(a)*i/100,c=function(e){let t=6369e3;return t*e/(t+e)}(t),u=(p=n,s=c,Math.pow(Math.pow(p,.190263)-8417286e-11*s,1/.190263));var p,s;let d=function(e,t,n){let r=n+273.15;return 100*t/(461.4964*r)+100*(e-t)/(287.0531*r)}(u,l,a),v=d/1.225*100,f=u*(1/33.86389),m=function(e){let t=6369e3;return t*e/(t-e)}(function(e){let t=8.31432,n=28.9644,r=1e3*e,a=.23496924566952423*Math.log(288.15*t*r/(101325*n));return-288.15/6.5*(Math.exp(a)-1)*1e3}(d))*(1/.3048);if(m>36090||m<-15e3){let e='<div class="alert alert-danger">\n  <strong>Error</strong> '+("Out of range for Troposhere Algorithm: Altitude ="+m+" feet\nPlease check your input values.")+"\n</div>";return void $("#messages").append(e)}let g=145442.16*(1-Math.pow(17.326*f/(o+459.67),.235))/100*100;return{relative_density:v,density_altitude:g}}}}]),angular.module("myApp.calc",["ngRoute"]).config(["$routeProvider",function(e){e.when("/calc",{templateUrl:"views/calc.html",controller:"CalcCtrl"})}]).controller("CalcCtrl",["$scope","$q","browserLocationService","weatherService","calculationService",function(e,t,n,r,a){e.weather={air_temperature:0,barometric_pressure:0,relative_humidity:0,location_name:"&nbsp;"},e.dac={density_altitude:"n/a",relative_density:"n/a"},e.location={lat:0,lng:0,elevation:0};let o=n.getLocation().then(function(t){e.location=t}),i=t.all([o]).then(function(){return r.getWeather(e.location.lat,e.location.lng).then(function(t){e.weather=t})});t.all([o,i]).then(function(){let t={elevation:e.location.elevation,barometric_pressure:e.weather.barometric_pressure,air_temperature:e.weather.air_temperature,relative_humidity:e.weather.relative_humidity};e.dac=a.calculate(t)}).catch(function(e){let t='<div class="alert alert-danger">\n  <strong>Error:</strong> '+e.message+"\n</div>";$("#messages").append(t)}).finally(function(){$("#loading, #loading-overlay").hide()})}]),angular.module("myApp.about",["ngRoute"]).config(["$routeProvider",function(e){e.when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"})}]).controller("AboutCtrl",[function(){}]),angular.module("myApp.version",["myApp.version.interpolate-filter","myApp.version.version-directive"]).value("version","0.1"),angular.module("myApp.version.version-directive",[]).directive("appVersion",["version",function(e){return function(t,n,r){n.text(e)}}]),angular.module("myApp.version.interpolate-filter",[]).filter("interpolate",["version",function(e){return function(t){return String(t).replace(/\%VERSION\%/gm,e)}}]);