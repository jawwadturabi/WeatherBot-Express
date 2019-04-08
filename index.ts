'use strict';
var request = require('request');
var apiKey = '4970e4f266675063af77ad454f45ebd6';
const express = require("express");
const bodyParser = require("body-parser");
const app = express().use(bodyParser.json());


app.post("/webhook", function (request, response, next) {

    var intent = request.body.queryResult.intent.displayName
    var cityName = request.body.queryResult.parmeters.city
    switch (intent) {
        case 'Default Welcome Intent':

            welcome(request, response)

            break
        case 'Humidity':

            humidity(request, response)

            break
        case 'rain':

            rain(request, response)

            break
        case 'Temperature':

            temp(request, response)

            break
        case 'weather':

            weather(request, response)

            break
    }
    function welcome(req, res) {
        response.send({

            fulfillmentText: `Hello! I am your Weather Assistant`
        })
    }

    function humidity(req, res) {
        if (request.body.queryResult.parmeters.city == null) {
            response.send({

                fulfillmentText: `Please enter the city name`
            })
        }
        else {
            var url = `api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`

            request(url, function (err, response, body) {
                if (err) {
                    console.log('error:', err);
                } else {
                    response.send({
                        fulfillmentText: `The humidity in ${cityName} is ${body.weather.main.humidity} !`
                    })
                    console.log(body.weather)
                }
            })
        }
    }

    function rain(req, res) {
        response.send({

            fulfillmentText: `Hello! I am your Weather Assistant`
        })
    }

    function temp(req, res) {
        var url = `api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`

        request(url, function (err, response, body) {
            if (err) {
                console.log('error:', err);
            } else {
                response.send({
                    fulfillmentText: `The temperature in ${cityName} is ${body.weather.main.temp} !`
                })
                console.log(body.weather)
            }
        }
        )
    }

    function weather(req, res) {
        var url = `api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
        request(url, function (err, response, body) {
            if (err) {
                console.log('error:', err);
            } else {
                response.send({
                    fulfillmentText: `Weather is ${body.weather}`
                })
                console.log(body.weather)
            }
        })

    }

})



var a =
{
    "coord":
        { "lon": 145.77, "lat": -16.92 },
    "weather": [{ "id": 803, "main": "Clouds", "description": "broken clouds", "icon": "04n" }],
    "base": "cmc stations",
    "main": { "temp": 293.25, "pressure": 1019, "humidity": 83, "temp_min": 289.82, "temp_max": 295.37 },
    "wind": { "speed": 5.1, "deg": 150 },
    "clouds": { "all": 75 },
    "rain": { "3h": 3 },
    "dt": 1435658272,
    "sys": { "type": 1, "id": 8166, "message": 0.0166, "country": "AU", "sunrise": 1435610796, "sunset": 1435650870 },
    "id": 2172797,
    "name": "Cairns",
    "cod": 200
}