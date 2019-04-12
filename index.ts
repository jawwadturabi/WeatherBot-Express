var rq = require('request');
var apiKey = '4970e4f266675063af77ad454f45ebd6';
const express = require("express");
const bodyParser = require("body-parser");
const app = express().use(bodyParser.json());
process.env.DEBUG = "dialogflow:debug"

app.post("/webhook", function (request, response, next) {

    var intent = request.body.queryResult.intent.displayName
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
        case 'wind':

            wind(request, response)

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
        console.log("not available")
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
                fulfillmentText: `The humidity in ${cityName} is ${weather.main.humidity}% !`,
                "fulfillmentMessages": [
                    {
                        "card": {
                            "title": "Weather Update",
                            "subtitle": `The humidity in ${cityName} is ${weather.main.humidity}% `,
                            "imageUri": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwFfMsIQfjNUeY2QlP7bh9rT2HpXWwHQkRm_pv73oC7AePtidMkA"
                        }
                    }
                ]
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
                // fulfillmentText: `${(weather.rain) ? `The rain is not expected in ${cityName}` :"Rain is" + weather.rain["1h"] + "mm" } !`,
                "fulfillmentMessages": [
                    {
                        "card": {
                            "title": "Weather Update",
                            "subtitle": (!(weather.rain)) ? "The rain is not expected in " + cityName : "The rainfall in Last 3 hours is " + weather.rain["3h"] + "mm",
                            "imageUri": "http://weather.smh.com.au/styles/icons/fairfax/large/possible_shower.png?1480640737"
                        },
                    }
                ]
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
                fulfillmentText: `The temperature in ${cityName} is ${weather.main.temp}°C !`,
                "fulfillmentMessages": [
                    {
                        "card": {
                            "title": "Weather Update",
                            "subtitle": `The temperature in ${cityName} is ${weather.main.temp}°C !`,
                            "imageUri": "http://weather.smh.com.au/styles/icons/fairfax/large/mostly_sunny.png?1480640735"
                        }
                    }
                ]
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
                fulfillmentText: `The weather in ${cityName} is ${weather.weather[0].main} and ${weather.weather[0].description} !`,
                "fulfillmentMessages": [
                    {
                        "card": {
                            "title": "Weather Update",
                            "subtitle": `The weather in ${cityName} is ${weather.weather[0].main} and ${weather.weather[0].description}`,
                            "imageUri": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuqgV7ULWjc32FYJQqOIyrWA-W8NP8qzkjiBkQnD4uVNdsRXziYw"
                        }
                    }
                ]
            })
            return
        }
    })
}


async function wind(req, res) {
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
                fulfillmentText: `The wind speed in ${cityName} is ${weather.wind.speed}m/s and the direction is ${weather.wind.deg}degrees !`,
                "fulfillmentMessages": [
                    {
                        "card": {
                            "title": "Weather Update",
                            "subtitle": `The wind speed in ${cityName} is ${weather.wind.speed}m/s and the direction is ${weather.wind.deg}degrees !`,
                            "imageUri": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpItHWtCzBe7XloA1s2uD66uY3iMRNlvNFO5Y66_Pn6VWMc94O"
                        }
                    }
                ]
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