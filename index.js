import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import e from "express";
import e from "express";

const app = express();
app.set(`view engine`, `ejs`);
app.use(bodyParser.urlencoded( { extended: true }));
app.use(express.static(`public`));

const port = 3000;
const apiKey = "fc673c04860971d33aac02bb4dcb211c";

app.get(`/`, (req, res) => {
    res.render(`index`);
});

app.post(`/getWeather`, async (req, res) => {

    let cityName = req.body.cityName;
    let lat;
    let lon;

    try {
        const cityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},GB&limit=1&appid=${apiKey}`;
        const response = await axios.get(cityUrl);
        lat = response.data[0].lat;
        lon = response.data[0].lon;


    } catch (e) {
        console.log(e);
        res.render(`error`, { error: e });
    }

    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
        const response = await axios.get(weatherUrl);
        let data = response.data;
        const weatherDescription = data.weather[0].description;
        const currentTemperatureInK = data.main.temp;
        const currentTemperatureInC = (currentTemperatureInK - 273.15).toFixed(2);

        const weather = {
            name: cityName,
            temp: currentTemperatureInC,
            description: weatherDescription
        };
        res.render(`weather`, weather);

    } catch (e) {
        console.log(e);
        res.render(`error`, { error: e });
    }

});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

