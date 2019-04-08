var rq = require('request');
var apiKey = '4970e4f266675063af77ad454f45ebd6';
const express = require("express");
const bodyParser = require("body-parser");
const app = express().use(bodyParser.json());
var rp = require('request-promise');
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

})
function welcome(req, res) {
    res.send({

        fulfillmentText: `Hello! I am your Weather Assistant`,

    })
    return
}

async function humidity(req, res) {
    var cityName = req.body.queryResult.parameters.city
    console.log("city is", cityName)
    if (!req.body.queryResult.parameters.city) {
        res.send({

            fulfillmentText: `Please enter the city name`
        })

    }
    else {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
        await rq(url, function (err, res, body) {
            let weather = JSON.parse(body);
            console.log("weather is: ", weather)
            if (err) {
                console.log('error is:', err);
                res.send({
                    fulfillmentText: `error while calling api`
                })
            } else {
                res.send({
                    fulfillmentText: `The humidity in ${cityName} is ${weather.main.humidity} !`
                })
                console.log(body.weather)
            }
        })
    }
    return
}

function rain(req, res) {
    res.send({

        fulfillmentText: `Hello! I am your Weather Assistant`
    })
}

function temp(req, res) {
    var cityName = req.body.queryResult.parameters.city
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
    if (!req.body.queryResult.parameters.city) {
        res.send({

            fulfillmentText: `Please enter the city name`
        })

    }
    else {
        rp.get(url, function (err, _res, body) {
            if (err) {
                console.log('error:', err);
            } else {
                res.send({
                    fulfillmentText: `The temperature in ${cityName} is ${body.main.temp} !`
                })
                console.log(body.weather)
            }
        }
        )
    }
}

function weather(req, res) {
    var cityName = req.body.queryResult.parameters.city
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
    rp.get(url, function (err, res, body) {
        if (err) {
            console.log('error:', err);
            res.send({
                fulfillmentText: `error while calling api`
            })
        } else {
            res.send({
                fulfillmentText: `Weather is ${body.weather}`
            })
            console.log(body.weather)
        }
    })
    return
}

app.listen(process.env.PORT || 8088, function () {
    console.log("server is running")
})