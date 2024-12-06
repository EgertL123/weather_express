const express = require('express')
const path = require('path')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const key = '80e689237748f150f57c360028cbbe21' // API key
let city = 'Tartu'

const getWeatherData = (city) => {
    return new Promise((resolve, reject) => {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}` 
        fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('City Not found!');
            }
            return response.json();
        })
        .then((data) => {
            let description = data.weather[0].description
            let city = data.name
            let temp = Math.round(parseFloat(data.main.temp)-273.15) 
            const result = {
                description: description,
                city: city,
                temp: temp,
                error: null
            } 
            resolve(result)
        })
        .catch(error => {
            reject(error)
        })
    })
} 

app.get('/', (req, res) => {
    getWeatherData(city)
        .then((data) => {
            res.render('index', data)
        })
        .catch(() => {
            res.render('index', { error: 'Problem with getting data, try again...' })
        })
})

app.post('/', (req, res) => {
    let city = req.body.cityname.trim()

    if (city.length === 0 ) {
        return res.render('index', {
            error: 'Please provide a city name!',
        } )
    } 
    getWeatherData(city)
        .then((data) => {
            res.render('index', data)
        })
        .catch(() => {
            res.render('index', { error: 'Problem with getting data, try again...' })
        })
})

app.listen(3002)