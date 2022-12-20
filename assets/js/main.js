'use strict'



function tabs(tabs, tabsHeader, tabsContent, activeClass) {
    const tabsElem = document.querySelector(tabs);
    const tabsHeaderElems = document.querySelectorAll(tabsHeader);
    const tabsContentElems = document.querySelectorAll(tabsContent);
    
    const removeTabs = () => {
        tabsHeaderElems.forEach(elem => {
            elem.classList.remove(activeClass);
        });
        tabsContentElems.forEach(elem => {
            elem.classList.remove(activeClass);
        });
    }
    
    const addTabs = (index = 0) => {
        tabsHeaderElems[index].classList.add(activeClass);
        tabsContentElems[index].classList.add(activeClass);
    }
    
    removeTabs();
    addTabs();
    
    tabsElem.addEventListener('click', e => {
        const {target} = e;
        tabsHeaderElems.forEach((elem, index) => {
            if(elem === target) {
                removeTabs();
                addTabs(index);
            }
        })
    })
    
    
}

tabs('.section-1', '.switch__btn', '.tabs__content-item', 'active');

function getCurrentLocation() {
    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(location => {
            resolve(location.coords)
        })
    })
}

//вывод даты:

const date = document.querySelector('.section__date');
const newDate = new Date();

function getDate() {
    const currDate = `${newDate.getDate() < 10  ? '0' + newDate.getDate() : newDate.getDate()}.${newDate.getMonth() + 1 < 10 ? '0' + newDate.getMonth() + 1 : newDate.getMonth() + 1}.${newDate.getFullYear()}`
    date.textContent = currDate;
}

const month = ['Jan', 'Febr', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const dayDate = document.querySelectorAll('.day__date');
const dayWeek = document.querySelectorAll('.day__title');



// default:
const stateImg = document.querySelector('.state__img');
const stateText = document.querySelector('.state__text')
const currTemp = document.querySelector('.temperature')
const tempFeel = document.querySelector('.temp__feel')
const sunrise = document.querySelector('.sunrise')
const sunset = document.querySelector('.sunset')
const duration = document.querySelector('.duration')

// определения дня недели:

function getDayOfWeek() {
    let day = ''
    let weekDay = []
    switch(newDate.getDay()){
        case 0: day = 6;break;
        case 1: day = 0;break;
        case 2: day = 1;break;
        case 3: day = 2;break;
        case 4: day = 3;break;
        case 5: day = 4;break;
        case 6: day = 5;break;
    }
    
    for(let i = day; i < day + 5; i++){
        if(i < 7){
            weekDay.push(i)
        }else if(i === 7){
            weekDay.push(0)
        }else if(i === 8){
            weekDay.push(1)
        }else if(i === 9){
            weekDay.push(2)
        }
    }
    for(let i = 0; i < dayWeek.length; i++){
        if(i === 0){
            dayWeek[0].textContent = 'Today';
        }
        if(i > 0){
            dayWeek[i].textContent = dayOfWeek[weekDay[i]];
        }  
    }
}
getDayOfWeek()

// определяем день месяца

function getMonthDay() {
    const currMonth = newDate.getMonth()
    const monthNum = month[currMonth]
    let data = []
    for(let i = newDate.getDate() ; i < newDate.getDate() + 5; i++){
        data.push(i)
    }
    for(let i = 0; i < dayDate.length; i++){
        dayDate[i].textContent = `${monthNum} ${data[i]}`
    }
}
getMonthDay();


const time = document.querySelectorAll('#weatherTime');

function timeInstall(hour) {
    let hours = hour;
    let day12 = 13;
    let day24 = 25;
    let current = '';
    for(let i = 0; i < time.length; i++) {
        hours++;
        if(hours === day12) {
            time[i].textContent === `12pm`;
        }else if((hours - day12) === 12) {
            time[i].textContent === `12am`
        }else if(hours > day12 && hours < day24){
            current = `${hours - day12}`
            time[i].textContent = `${current}pm`
        }else if(hours > day24) {
            current = `${hours - day24}`
            time[i].textContent = `${current}am`
        }else if(hours < day12){
            time[i].textContent = `${hours}pm`
        }
    }
}

// API:
const api = '52a1a8eb28ef49f05ec260c4d39dfe47';
async function fetchAPI(lat, lon) {
    const data = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely, hourly, daily&appid=${api}`);
    const json1 = await data.json();
    
    const weatherDescr = json1.daily[0].weather[0].main;
    console.log(weatherDescr);
    console.log(json1);
    
    //восход
    const sunrise = json1.current.sunrise;
    const currSunrise = (new Date(sunrise*1000).toLocaleTimeString()).substring(1,5);
    const rise = document.querySelector('#sunrise');
    rise.textContent = `${currSunrise} AM`;
    
    //закат
    const sunset = json1.current.sunset;
    const currSunset = (new Date(sunset*1000).toLocaleTimeString()).substring(0,5);
    const set = document.querySelector('#sunset');
    set.textContent = `${currSunset} PM`;
    
    //время дня
    const sunriseTime = new Date(sunrise * 1000);
    const sunsetTime = new Date(sunset * 1000);
    const duration = `${sunsetTime.getHours() - sunriseTime.getHours()}:${sunsetTime.getMinutes() - sunriseTime.getMinutes() < 10 ? '0' + (sunsetTime.getMinutes() - sunriseTime.getMinutes()) : sunsetTime.getMinutes() - sunriseTime.getMinutes()}`
    const dur = document.querySelector('#duration');
    dur.textContent = `${duration} hr`
    
    //погода сейчас (в температурах)
    const tempsOfWeather = Math.round(json1.current.temp);
    const curDeg = document.querySelector('.temperature');
    curDeg.textContent = `${tempsOfWeather - 273}°C`;
    
    //как чувствуется погода
    const feelsLike = Math.round(json1.current.feels_like);
    const feelDeg = document.querySelector('.temp__feel');
    feelDeg.textContent = `Feels like ${feelsLike - 273}°C`;
    
    //фото погоды
    const weatherImg = json1.current.weather[0].main;
    const stateImg = document.querySelector('.state__img');
    stateImg.src = `./assets/icons/${weatherImg}.png`;
    
    //текстовое описание погоды
    const stateText = document.querySelector('.state__text');
    stateText.textContent = `${weatherImg}`;
    
    const date = json1.current.dt;
    const hour = new Date(date * 1000).getHours();
    timeInstall(hour);
}

fetchAPI(41.2646, 69.2163);


const weatherState = document.querySelectorAll('#weatherState');
const weatherTemp = document.querySelectorAll('#weatherTemp');
const weatherFeel = document.querySelectorAll('#weatherFeel');
const weatherSpeed = document.querySelectorAll('#weatherSpeed');
const weatherImg = document.querySelectorAll('#weatherImg');

async function getToday(lat, lon) {
    const data = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely, hourly, daily&appid=${api}`);
    const json1 = await data.json();
    let wthrState = '';
    let temp = '';
    let feel = '';
    let speed = '';
    let img = '';
    
    for(let i = 0; i < weatherState.length; i++) {
        wthrState = json1.hourly[i].weather[0].main;
        weatherState[i].textContent = wthrState;
        temp = Math.round(json1.hourly[i].temp) - 273;
        weatherTemp[i].textContent = `${temp}°C`;
        feel = Math.round(json1.hourly[i].feels_like) - 273;
        weatherFeel[i].textContent = `${feel}°C`;
        speed = json1.hourly[i].wind_speed;
        weatherSpeed[i].textContent = `${speed}km/h`;
        img = (json1.hourly[i].weather[0].main).toLowerCase();
        weatherImg[i].src = `./assets/icons/${img}.png`
    }
}
getToday(41.2646, 69.2163);


const dayImg = document.querySelectorAll('.day__temp-img');
const dayTemp = document.querySelectorAll('.day__temp-digits');
const dayDescr = document.querySelectorAll('.day__temp-descr');

async function getDaily(lat, lon) {
    const data = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely, hourly, daily&appid=${api}`);
    const json1 = await data.json();
    
    let img = '';
    let temp = '';
    let descr = '';
    
    for(let i = 0; i < dayDescr.length; i++) {
        img = json1.daily[i].weather[0].main;
        dayImg[i].src = `./assets/icons/${img}.png`;
        temp = Math.round(json1.daily[i].temp.max) - 273;
        dayTemp[i].textContent = `${temp}°C`;
        descr = json1.daily[i].weather[0].main;
        dayDescr[i].textContent = descr;
    }
}
getDaily(41.2646, 69.2163);

// Полная характеристика 5 дней

function getLocationInString(lat, lon) {
    const currLat = lat
    const currLon = lon
    dayClick(currLat, currLon)
}

const daysImg = document.querySelectorAll('#days__img');
const daysDescr = document.querySelectorAll('#days__descr')
const daysTemp = document.querySelectorAll('#days__temp')
const daysFeel = document.querySelectorAll('#days__feel')
const daysSpeed = document.querySelectorAll('#days__speed')


async function getDailyForecast(lat, lon, index) {
    const data = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely, hourly, daily&appid=${api}`);
    const json1 = await data.json();

    let img = '';
    let descr = '';
    let temp = '';
    let feel = '';
    let speed = '';
    let dayWeather = '';
    const timeOfDay = ['Mor', 'Day', 'Eve', 'Night'];

    for(let i = 0; i < daysDescr.length ; i++){
        dayWeather = timeOfDay[i]
        if(dayWeather === 'Mor'){
            temp = `${Math.round(json1.daily[index].temp.morn) - 273}°C`
            feel = `${Math.round(json1.daily[index].feels_like.morn) - 273}°C`
        } 
        if(dayWeather === 'Day'){
            temp = `${Math.round(json1.daily[index].temp.day) - 273}°C`
            feel = `${Math.round(json1.daily[index].feels_like.day) - 273}°C`
        }
        if(dayWeather === 'Eve'){
            temp = `${Math.round(json1.daily[index].temp.eve) - 273}°C`
            feel = `${Math.round(json1.daily[index].feels_like.eve) - 273}°C`
        }
        if(dayWeather === 'Night'){
            temp = `${Math.round(json1.daily[index].temp.night) - 273}°C`
            feel = `${Math.round(json1.daily[index].feels_like.night) - 273}°C`
        }
        descr = json1.daily[index].weather[0].main
        img = descr.toLowerCase()
        speed = `${json1.daily[index].wind_speed}km/h`
        
        
        daysImg[i].src = `./assets/img/${img}.png`
        daysDescr[i].textContent = descr
        daysTemp[i].textContent = temp
        daysFeel[i].textContent = feel
        daysSpeed[i].textContent = speed
    }

}
getDailyForecast(41.2646, 69.2163, 0)
getLocationInString(41.2646, 69.2163)
function clearDays() {
    dayBlock.forEach(item => {
        item.classList.remove('weather-active')
    })
}

function dayClick(lat, lon){
    dayBlock.forEach((item, index) => {
        if(!index) {
            clearDays()
            getWeatherForDay(lat, lon, 0)
            item.classList.add('weather-active')
        }
        if(index > -1){
            item.addEventListener('click', () => {
                clearDays()
                getDailyForecast(lat, lon, index)
                item.classList.add('weather-active')
            })
        }
    })
}
dayClick(41.2646, 69.2163)

//Поиск по городу

async function citySearch(place) {
    let url = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${api}`)

    const jsno = await url.json()
    const lat = jsno.coord.lat
    const lon = jsno.coord.lon
    fetchWeather(lat, lon)
    getWeatherHours(lat, lon)
    getWetherDays(lat, lon)
    dayClick(lat, lon)
}

const place = document.querySelector('#input');

place.addEventListener('change', () => {
    citySearch(place.value)
})

// Выводим ошибку

const switchBtn = document.querySelectorAll('.switch__btn')

const day = document.querySelectorAll('#forError')
const text = document.querySelectorAll('#text')
const error = document.querySelector('#error')

function error1() {
    text[0].textContent = `${place.value} could not be found`
    text[1].textContent = 'Please enter a different location'
    
    error.classList.add('error-active');
    day.forEach(item => {
        item.classList.add('non-active')
    })
    switchBtn.forEach(elem => {
        elem.disabled = true;
        elem.classList.remove('active');
    })
}

