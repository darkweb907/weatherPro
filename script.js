let base = "http://api.weatherapi.com/v1";
let ApiKey = "aaac0838429046e38af83018250810";

// --- Fetch current weather ---
const FetchWeather = async (city) => {
  try {
    let response = await fetch(`${base}/current.json?key=${ApiKey}&q=${city}`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
  } finally {
    console.log("Fetch attempt finished");
  }
};

// --- Fetch forecast data ---
const Forecasting = async (city) => {
  try {
    let response = await fetch(`${base}/forecast.json?key=${ApiKey}&q=${city}&days=7`);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast:", error);
  } finally {
    console.log("Forecast fetch finished");
  }
};

// --- Display current weather ---
const mainWeather = async (city) => {
  let currentCity = await FetchWeather(city);
  const weatherCont = document.getElementById("weather-cont");
  const date = new Date(currentCity.location.localtime);
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  weatherCont.innerHTML = `
    <div class="cont-1-txt">
      <h1>${currentCity.location.name}</h1>
      <p>${formatted}</p>
    </div>

    <div class="cont-1-num">
      <div class="big-sun-img">
        <img src=${currentCity.current.condition.icon} alt="">
      </div>

      <div class="the-figure">
        <em><h1>${currentCity.current.temp_c}&deg;</h1></em>
      </div>
    </div>
  `;
};


// --- Display other weather info ---
const otherWeather = async (city) => {
  const otherCont = document.getElementById("other-cont");
  let currentCity = await FetchWeather(city);

  otherCont.innerHTML = `
    <div class="cont-2-box-1"><p>Feels Like</p><h2>${currentCity.current.feelslike_c}&deg;</h2></div>
    <div class="cont-2-box-1"><p>Humidity</p><h2>${currentCity.current.humidity}%</h2></div>
    <div class="cont-2-box-1"><p>Wind</p><h2>${currentCity.current.wind_kph} km/h</h2></div>
    <div class="cont-2-box-1"><p>Precipitation</p><h2>${currentCity.current.precip_mm} mm</h2></div>
  `;
};


// --- Forecast section ---
const forecastWeather = async (city) => {
  const forecastCont = document.getElementById("forecast-cont");
  const optionSelect = document.getElementById("Select-day");
  const hourCont = document.getElementById("hour-cont");

  const forecast = await Forecasting(city);

  // 🧹 Clear old data before showing new city’s forecast
  forecastCont.innerHTML = "";
  optionSelect.innerHTML = "<option>Select Day</option>";
  hourCont.innerHTML = "";

  forecast.forecast.forecastday.forEach((day) => {
    const date = new Date(day.date);
    const dayNameShort = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayNameLong = date.toLocaleDateString("en-US", { weekday: "long" });

    // Add daily forecast boxes
    forecastCont.innerHTML += `
      <div class="cont3-box-1">
        <div class="box-1-txt-1"><p>${dayNameShort}</p></div>
        <div class="box-1-cloud"><img src=${day.day.condition.icon} alt=""></div>
        <div class="box-1-txt-2">
          <div class="right-txt"><p>${day.day.maxtemp_c}&deg;</p></div>
          <div class="left-txt"><p>${day.day.mintemp_c}&deg;</p></div>        
        </div>
      </div>
    `;

    // Add to select dropdown
    optionSelect.innerHTML += `<option value="${dayNameLong}">${dayNameLong}</option>`;
  });

  // 🕒 Function to show 8-hour forecast for a selected day
  const displayHourlyForecast = (selectedDay) => {
    hourCont.innerHTML = ""; // clear existing hours

    const selected = forecast.forecast.forecastday.find((d) => {
      const dayName = new Date(d.date).toLocaleDateString("en-US", { weekday: "long" });
      return dayName === selectedDay;
    });

    if (!selected) return;

    selected.hour.slice(0, 8).forEach((hr) => {
      const time = new Date(hr.time);
      const timeName = time.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });

      hourCont.innerHTML += `
        <div class="sec-box">
          <div class="time-txt">
            <img src=${hr.condition.icon} alt="">
            <p>${timeName}</p>
          </div>
          <div class="weather-txt">
            <p>${hr.temp_c}&deg;</p>
          </div>
        </div>
      `;
    });
  };

  // 🌞 Show today's forecast initially
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  displayHourlyForecast(today);

  // 🎯 Update when user selects another day
  optionSelect.addEventListener("change", (e) => {
    displayHourlyForecast(e.target.value);
  });
};

//search for weather in other cities

const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", async () => {
    const city = searchInput.value;
    const weatherdata = await Forecasting(city);
    if (weatherdata) {
        mainWeather(city);
        otherWeather(city);
        forecastWeather(city);
    } else {
        alert("City not found. Please try again.");
    }
});


window.onload = function() {
    mainWeather("Lagos");
    otherWeather("Lagos");
    forecastWeather("Lagos");
}

