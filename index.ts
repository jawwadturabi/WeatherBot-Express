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
    console.log("context are: ", req.body.queryResult.outputContexts)
    var cityName;
    var abcContext = getContext(req.body.queryResult.outputContexts, "abc")
    console.log("return is :", abcContext)
    if (req.body.queryResult.parameters.city) {
        cityName = req.body.queryResult.parameters.city
    }
    else if (abcContext.parameters.abccity) {
        cityName = abcContext.parameters.abccity
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

async function rain(req, res) {

    console.log("context are: ", req.body.queryResult.outputContexts)
    var cityName;
    var abcContext = getContext(req.body.queryResult.outputContexts, "abc")
    if (req.body.queryResult.parameters.city) {
        cityName = req.body.queryResult.parameters.city
    }
    else if (abcContext.parameters.abccity) {
        cityName = abcContext.parameters.abccity
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
                fulfillmentText: `The rain in ${cityName} ${(weather.rain) ? "is" + weather.rain["1h"] + "mm" : " is clear"} !`

            })
            return
        }
    })
}


async function temp(req, res) {
    console.log("context are: ", req.body.queryResult.outputContexts)
    var cityName;
    var abcContext = getContext(req.body.queryResult.outputContexts, "abc")
    if (req.body.queryResult.parameters.city) {
        cityName = req.body.queryResult.parameters.city
    }
    else if (abcContext.parameters.abccity) {
        cityName = abcContext.parameters.abccity
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
                fulfillmentText: `The temperature in ${cityName} is ${weather.main.temp}°C !`

            })
            return
        }
    })
}


async function weather(req, res) {
    console.log("context are: ", req.body.queryResult.outputContexts)
    var cityName;
    var abcContext = getContext(req.body.queryResult.outputContexts, "abc")
    if (req.body.queryResult.parameters.city) {
        cityName = req.body.queryResult.parameters.city
    }
    else if (abcContext.parameters.abccity) {
        cityName = abcContext.parameters.abccity
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
                fulfillmentText: `The weather in ${cityName} is ${weather.weather.main} and ${weather.weather.description} !`

            })
            return
        }
    })
}

function getContext(outputContexts, name) {
    if (!outputContexts) {
        return
    }
    else {
        for (var i = 0; i < outputContexts.length; i++) {
            var temp = outputContexts[i].name.split("/")
            if (temp[temp.length - 1] == name) {
                return outputContexts[i]
            }

        }
    }
    console.log("context is", outputContexts)

}
app.listen(process.env.PORT || 8088, function () {
    console.log("server is running")
})