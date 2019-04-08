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
    console.log("context are: ",req.body.queryResult.outputContexts)
    var cityName;
    if (req.body.queryResult.parameters.city) {
        cityName = req.body.queryResult.parameters.city
    }
    else if (req.body.queryResult.outputContexts[1].parameters.city) {
        cityName = req.body.queryResult.outputContexts[1].parameters.city
    }
    else {
        res.send({
            fulfillmentText: `Please enter the city name`
        })
        return
    }
    var session = req.body.session
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
    await rq(url, function (err, _res, body) {
        let weather = JSON.parse(body);
        console.log("weather is: ", weather)
        if (err) {
            console.log('error is:', err);
            res.send({
                fulfillmentText: `error while calling api`
            })
        } else {
            res.send({
                outputContexts: [
                    {
                        "name": `${session}/contexts/abc`,
                        "lifespanCount": 5,
                        "parameters": {
                            "abccity": cityName
                        }
                    }
                ],
                fulfillmentText: `The humidity in ${cityName} is ${weather.main.humidity}% !`

            })
            return
        }
    })
}

function rain(req, res) {
    res.send({

        fulfillmentText: `Hello! I am your Weather Assistant`
    })
}

function temp(req, res) {
    var cityN_ame = req.body.queryResult.parameters.city
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityN_ame}&units=metric&appid=${apiKey}`
    if (!req.body.queryResult.parameters.city) {
        res.send({

            fulfillmentText: `Please enter the city name`
        })

    }
    else {

        rp.get(url, function (err, _res, body) {
            let weather = JSON.parse(body);
            if (err) {
                console.log('error:', err);
            } else {
                res.send({
                    fulfillmentText: `The temperature in ${cityN_ame} is ${weather.main.temp}°C !`
                })
            }
        }
        )
    }
}

function weather(req, res) {
    var city_Name = req.body.queryResult.outputcontext.parameters.city
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${city_Name}&units=metric&appid=${apiKey}`
    rp.get(url, function (err, _res, body) {
        let weather = JSON.parse(body);
        if (err) {
            console.log('error:', err);
            res.send({
                fulfillmentText: `error while calling api`
            })
        } else {
            res.send({
                fulfillmentText: `Weather is ${weather}`
            })
            console.log(body.weather)
        }
    })
    return
}

app.listen(process.env.PORT || 8088, function () {
    console.log("server is running")
})
var a =
{
    "outputContexts": [
        {
            "name": "projects/weather-bot-c8880/agent/sessions/619c2437-5e4b-13bc-a595-4c735d2d8a6c/context/memory",
            "lifespanCount": 5,
            "parameters": {
                "city": "Hyderabad"
            }
        }
    ],
    "fulfillmentText": "The humidity in Hyderabad is 60% !"
}