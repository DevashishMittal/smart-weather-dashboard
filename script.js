// =========================
// GLOBALS
// =========================

let myChart = null;

const apiKey =
"08e70d0da4c9958dad8d34d1718c5686";

// =========================
// LIVE CLOCK
// =========================

setInterval(()=>{

document.getElementById("liveClock")
.innerHTML =

"🕒 " +

new Date().toLocaleTimeString(
'en-IN',
{
hour:'numeric',
minute:'numeric',
second:'numeric'
}
);

},1000);

// =========================
// MAIN WEATHER
// =========================

async function getWeather(){

let city =
document
.getElementById("cityInput")
.value
.trim();

if(city === ""){

alert("Enter city name");

return;

}

showLoader(true);

try{

const response =
await fetch(

`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`

);

const data =
await response.json();

showLoader(false);

if(data.cod != "200"){

alert("City not found");

return;

}

const current =
data.list[0];

const daily =
data.list.filter(item =>

item.dt_txt.includes("12:00:00")

);

showCurrentWeather(
current,
data.city
);

showForecast(daily);

showChart(daily);

showAlert(current);

showAISuggestion(current);

changeBackground(current);

getAQI(
data.city.coord.lat,
data.city.coord.lon
);

saveSearch(city);

loadHistory();

}
catch(error){

console.log(error);

showLoader(false);

alert("Weather fetch failed");

}

}

// =========================
// LOADER
// =========================

function showLoader(status){

const loader =
document.getElementById("loader");

if(status){

loader.classList.remove("d-none");

}
else{

loader.classList.add("d-none");

}

}

// =========================
// CURRENT WEATHER
// =========================

function showCurrentWeather(day, cityData){

const box =
document.getElementById("weatherBox");

const sunrise =
new Date(cityData.sunrise * 1000)
.toLocaleTimeString(
'en-IN',
{
hour:'numeric',
minute:'numeric'
}
);

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

<h2>${cityData.name}</h2>

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
src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
>

<h1>
${Math.round(day.main.temp)}°C
</h1>

<h4>
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
// FORECAST
// =========================

function showForecast(days){

const row =
document.getElementById("forecastRow");

row.innerHTML = "";

days.forEach(day => {

row.innerHTML += `

<div class="col-6 col-md-4">

<div class="forecast-box">

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
// CHART
// =========================

function showChart(days){

const ctx =
document.getElementById("weatherChart")
.getContext("2d");

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

const temps =
days.map(d => d.main.temp);

if(myChart){

myChart.destroy();

}

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

fill:true,

tension:0.4,

borderWidth:4

}]

},

options:{

responsive:true,

maintainAspectRatio:false

}

});

}

// =========================
// ALERTS
// =========================

function showAlert(day){

const box =
document.getElementById("alertBox");

let msg = "";

if(day.main.temp > 40){

msg =
"🔥 Heatwave Alert";

}
else if(day.weather[0].main === "Rain"){

msg =
"🌧 Rain Expected";

}
else if(day.weather[0].main === "Thunderstorm"){

msg =
"⛈ Thunderstorm Warning";

}
else{

msg =
"✅ Weather Normal";

}

box.style.display = "block";

box.innerHTML = msg;

}

// =========================
// AI SUGGESTION
// =========================

function showAISuggestion(day){

const aiBox =
document.getElementById("aiBox");

let text = "";

if(day.main.temp > 38){

text =
"🥤 Drink more water and avoid afternoon heat.";

}
else if(day.weather[0].main === "Rain"){

text =
"☔ Carry umbrella before going outside.";

}
else if(day.weather[0].main === "Clear"){

text =
"🌤 Great weather for outdoor activities.";

}
else{

text =
"😊 Comfortable weather today.";

}

aiBox.innerHTML = `

<div class="alert alert-info">

${text}

</div>

`;

}

// =========================
// AQI
// =========================

async function getAQI(lat, lon){

try{

const response =
await fetch(

`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`

);

const data =
await response.json();

const aqi =
data.list[0].main.aqi;

let text = "";

if(aqi === 1) text = "Good 😊";
if(aqi === 2) text = "Fair 🙂";
if(aqi === 3) text = "Moderate 😐";
if(aqi === 4) text = "Poor 😷";
if(aqi === 5) text = "Very Poor ☠";

document.getElementById("aqi")
.innerText = text;

}
catch(error){

console.log(error);

}

}

// =========================
// BACKGROUND
// =========================

function changeBackground(day){

document.body.classList.remove(
"clear-bg",
"rain-bg",
"cloud-bg"
);

const weather =
day.weather[0].main;

if(weather === "Clear"){

document.body.classList.add("clear-bg");

}

if(weather === "Rain"){

document.body.classList.add("rain-bg");

}

if(weather === "Clouds"){

document.body.classList.add("cloud-bg");

}

}

// =========================
// HISTORY
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

function loadHistory(){

const box =
document.getElementById("historyBox");

let history =

JSON.parse(
localStorage.getItem("weatherHistory")
) || [];

box.innerHTML = "";

history.reverse().slice(0,5)
.forEach(city => {

box.innerHTML += `

<button
class="btn btn-outline-light history-btn"
onclick="searchHistory('${city}')"
>

${city}

</button>

`;

});

}

function searchHistory(city){

document.getElementById("cityInput")
.value = city;

getWeather();

}

// =========================
// GEOLOCATION
// =========================

function getLocationWeather(){

const locationBtn =
document.querySelector(".btn-success");

locationBtn.innerHTML = "⏳";

if(!navigator.geolocation){

alert("Geolocation not supported");

locationBtn.innerHTML = "📍";

return;

}

navigator.geolocation.getCurrentPosition(

async(position)=>{

try{

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;

const response =
await fetch(

`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

);

const data =
await response.json();

document.getElementById("cityInput")
.value = data.name;

locationBtn.innerHTML = "📍";

getWeather();

}
catch(error){

console.log(error);

alert("Unable to fetch location weather");

locationBtn.innerHTML = "📍";

}

},

(error)=>{

locationBtn.innerHTML = "📍";

if(error.code === 1){

alert("Location permission denied");

}

else if(error.code === 2){

alert("Location unavailable");

}

else if(error.code === 3){

alert("Location request timeout");

}

else{

alert("GPS error");

}

},

{

enableHighAccuracy:true,

timeout:10000,

maximumAge:0

}

);

}
// =========================
// THEME
// =========================

function toggleTheme(){

document.body.classList.toggle(
"light-mode"
);

}

// =========================
// ENTER KEY
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

window.onload = ()=>{

document.getElementById("cityInput")
.value = "Jhansi";

loadHistory();

getWeather();

};