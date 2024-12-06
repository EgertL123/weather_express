const express = require('express')
const path = require('path')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')))

const key = '80e689237748f150f57c360028cbbe21' // API key
let city = 'Tartu'

const getWeatherData = (city) => {
    return new Promise((resolve, reject) => {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}` 
        fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            let description = data.weather[0].description
            let city = data.name
            let temp = Math.round(parseFloat(data.main.temp)-273.15) 
            const result = {
                description: description,
                city: city,
                temp: temp
            } 
            resolve(result)
        })
        .catch(error => {
            reject(error)
        })
    })
} 

app.all('/', (req, res) => {
    let city
    if(req.method == 'GET'){
        city = 'Tartu'
    } else if (req.method == 'POST'){
        city = req.body.cityname
    }
    getWeatherData(city)
    .then((data) => {
        res.render('index', data)
    })
})

app.listen(3002)