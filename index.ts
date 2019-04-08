var _request = require('request');
var apiKey = '4970e4f266675063af77ad454f45ebd6';
const express = require("express");
const bodyParser = require("body-parser");
const app = express().use(bodyParser.json());
process.env.DEBUG = "dialogflow:debug"

app.post("/webhook", function (request, response, next) {

    var intent = request.body.queryResult.intent.displayName
    var cityName = request.body.queryResult.parameters.city
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
        if (request.body.queryResult.parameters.city == null) {
            response.send({

                fulfillmentText: `Please enter the city name`
            })
        }
        else {
            var url = `api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
            _request(url, function (err, response, body) {
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
app.listen(process.env.PORT || 8088, function(){
    console.log("server is running")
})