const consoleBox=document.getElementById("consoleBox")

function log(msg){
console.log(msg)
consoleBox.innerHTML+=msg+"<br>"
}

function getWeatherText(code){

const map={
0:"Clear Sky",
1:"Mainly Clear",
2:"Partly Cloudy",
3:"Overcast",
45:"Fog",
48:"Rime Fog",
51:"Light Drizzle",
53:"Moderate Drizzle",
55:"Dense Drizzle",
61:"Light Rain",
63:"Moderate Rain",
65:"Heavy Rain",
71:"Snow",
80:"Rain Showers"
}

return map[code] || "Unknown"

}


function eventLoopDemo(){

log("Sync Start")

setTimeout(()=>{
log("setTimeout (Macrotask)")
},0)

Promise.resolve().then(()=>{
log("Promise.then (Microtask)")
})

log("Sync End")

}

eventLoopDemo()



async function searchWeather(){

consoleBox.innerHTML=""

log("Sync Start")
log("[ASYNC] Start fetching")

const city=document.getElementById("cityInput").value

try{

const geoRes=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)

const geoData=await geoRes.json()

if(!geoData.results){
throw new Error("City not found")
}

const {latitude,longitude,name,country}=geoData.results[0]

const weatherRes=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`)

const weatherData=await weatherRes.json()

const weather=weatherData.current_weather


document.getElementById("city").innerText=name+", "+country
document.getElementById("temp").innerText=weather.temperature+" °C"
document.getElementById("weather").innerText=getWeatherText(weather.weathercode)
document.getElementById("humidity").innerText=weatherData.hourly.relativehumidity_2m[0]+" %"
document.getElementById("wind").innerText=weather.windspeed+" m/s"

saveHistory(name)

log("[ASYNC] Data received")

}

catch(err){

document.getElementById("error").innerText=err.message

}

Promise.resolve().then(()=>{
log("Promise.then (Microtask)")
})

setTimeout(()=>{
log("setTimeout (Macrotask)")
},0)

log("Sync End")

}



function saveHistory(city){

let cities=JSON.parse(localStorage.getItem("cities")) || []

if(!cities.includes(city)){
cities.push(city)
localStorage.setItem("cities",JSON.stringify(cities))
}

loadHistory()

}

function loadHistory(){

const history=document.getElementById("history")

history.innerHTML=""

let cities=JSON.parse(localStorage.getItem("cities")) || []

cities.forEach(c=>{

const btn=document.createElement("button")

btn.innerText=c

btn.onclick=()=>{
document.getElementById("cityInput").value=c
searchWeather()
}

history.appendChild(btn)

})

}

loadHistory()