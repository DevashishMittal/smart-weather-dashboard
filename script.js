// =========================
// GLOBAL CHART
// =========================

let myChart = null;

// =========================
// MAIN WEATHER FUNCTION
// =========================

async function getWeather(){

let city =
document
.getElementById("cityInput")
.value
.trim();

if(city === ""){

alert("Please enter city");

return;

}

// Loader Show

document
.getElementById("loader")
.classList.remove("d-none");

// API KEY

const apiKey =
"08e70d0da4c9958dad8d34d1718c5686";

try{

// Fetch Forecast Data

const response =
await fetch(

`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`

);

const data =
await response.json();

// Loader Hide

document
.getElementById("loader")
.classList.add("d-none");

// Error Handling

if(data.cod != "200"){

alert("City not found");

return;

}

// Daily Forecast

const daily =
data.list.filter(item =>

item.dt_txt.includes("12:00:00")

);

// Show UI

showCurrentWeather(
data.list[0],
data.city
);

showForecast(daily);

showChart(daily);

saveSearch(city);

}
catch(error){

console.log(error);

alert("Error fetching weather");

// Loader Hide

document
.getElementById("loader")
.classList.add("d-none");

}

}

// =========================
// CURRENT WEATHER
// =========================

function showCurrentWeather(day, cityData){

const box =
document.getElementById("weatherBox");

// Weather Type

let weatherMain =
day.weather[0].main;

// Dynamic Color

let weatherColor = "#ffffff";

if(weatherMain == "Clear"){
weatherColor = "#FFD93D";
}

if(weatherMain == "Clouds"){
weatherColor = "#D6E4F0";
}

if(weatherMain == "Rain"){
weatherColor = "#4FC3F7";
}

if(weatherMain == "Thunderstorm"){
weatherColor = "#FF6B6B";
}

// Sunrise

const sunrise =
new Date(cityData.sunrise * 1000)
.toLocaleTimeString(
'en-IN',
{
hour:'numeric',
minute:'numeric'
}
);

// Sunset

const sunset =
new Date(cityData.sunset * 1000)
.toLocaleTimeString(
'en-IN',
{
hour:'numeric',
minute:'numeric'
}
);

box.innerHTML = `

<div class="current-weather">

<h2>

${cityData.name}

</h2>

<p>

${new Date().toLocaleString(
'en-IN',
{
weekday:'long',
day:'numeric',
month:'long',
year:'numeric',
hour:'numeric',
minute:'numeric'
}
)}

</p>

<img
width="120"
src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
>

<h1>

${Math.round(day.main.temp)}°C

</h1>

<h4 style="color:${weatherColor}">

${day.weather[0].main}

</h4>

<p>

${day.weather[0].description}

</p>

<div class="row mt-4">

<div class="col-4">

<h6>Humidity</h6>

<p>${day.main.humidity}%</p>

</div>

<div class="col-4">

<h6>Wind</h6>

<p>${day.wind.speed} m/s</p>

</div>

<div class="col-4">

<h6>Feels Like</h6>

<p>${Math.round(day.main.feels_like)}°C</p>

</div>

</div>

<div class="row mt-3">

<div class="col-6">

<h6>Sunrise</h6>

<p>${sunrise}</p>

</div>

<div class="col-6">

<h6>Sunset</h6>

<p>${sunset}</p>

</div>

</div>

<div class="row mt-3">

<div class="col-4">

<h6>Pressure</h6>

<p>${day.main.pressure} hPa</p>

</div>

<div class="col-4">

<h6>Visibility</h6>

<p>${day.visibility / 1000} km</p>

</div>

<div class="col-4">

<h6>Clouds</h6>

<p>${day.clouds.all}%</p>

</div>

</div>

</div>

`;

}

// =========================
// FORECAST CARDS
// =========================

function showForecast(days){

const row =
document.getElementById("forecastRow");

row.innerHTML = "";

days.forEach(day => {

row.innerHTML += `

<div class="col-6 col-md-4">

<div class="forecast-box text-center">

<h5>

${new Date(day.dt * 1000)
.toLocaleDateString(
'en-GB',
{
weekday:'short',
day:'numeric'
}
)}

</h5>

<img
width="80"
src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
>

<h2>

${Math.round(day.main.temp)}°C

</h2>

<p>

${day.weather[0].description}

</p>

</div>

</div>

`;

});

}

// =========================
// TEMPERATURE CHART
// =========================

function showChart(days){

const ctx =
document.getElementById("weatherChart")
.getContext("2d");

// Labels

const labels =
days.map(d =>

new Date(d.dt * 1000)
.toLocaleDateString(
'en-GB',
{
weekday:'short'
}
)

);

// Temps

const temps =
days.map(d => d.main.temp);

// Destroy Old Chart

if(myChart){

myChart.destroy();

}

// Create Chart

myChart = new Chart(ctx,{

type:'line',

data:{

labels:labels,

datasets:[{

label:'Temperature °C',

data:temps,

borderColor:'#00d2ff',

backgroundColor:
'rgba(0,210,255,0.2)',

borderWidth:4,

fill:true,

tension:0.4,

pointBackgroundColor:'#ffffff',

pointRadius:5

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

labels:{

color:'white',

font:{
size:16
}

}

}

},

scales:{

x:{

ticks:{
color:'white'
},

grid:{
color:'rgba(255,255,255,0.08)'
}

},

y:{

ticks:{
color:'white'
},

grid:{
color:'rgba(255,255,255,0.08)'
}

}

}

}

});

}

// =========================
// GEOLOCATION WEATHER
// =========================

function getLocationWeather(){

navigator.geolocation
.getCurrentPosition(

async(position)=>{

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;

const apiKey =
"08e70d0da4c9958dad8d34d1718c5686";

// Current Weather

const response =
await fetch(

`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

);

const data =
await response.json();

// Set City

document
.getElementById("cityInput")
.value = data.name;

// Fetch Full Forecast

getWeather();

}

);

}

// =========================
// SEARCH HISTORY
// =========================

function saveSearch(city){

let history =

JSON.parse(
localStorage.getItem("weatherHistory")
) || [];

if(!history.includes(city)){

history.push(city);

localStorage.setItem(

"weatherHistory",

JSON.stringify(history)

);

}

}

// =========================
// ENTER KEY SEARCH
// =========================

document
.getElementById("cityInput")
.addEventListener("keypress", function(e){

if(e.key === "Enter"){

getWeather();

}

});

// =========================
// AUTO LOAD
// =========================

window.onload = () => {

document
.getElementById("cityInput")
.value = "Jhansi";

getWeather();

};