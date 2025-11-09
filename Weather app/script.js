const apiKey = "'6c5da88e8emsha0f18d3dc0d6c24p103778jsn19d08d92b8a0";
const apiHost = "weather-by-api-ninjas.p.rapidapi.com";

document.getElementById("searchBtn").addEventListener("click", getWeather);
document.getElementById("cityDropdown").addEventListener("change", (e) => {
  if (e.target.value) {
    document.getElementById("city").value = e.target.value;
    getWeather();
  }
});

async function getWeather() {
  const city = document.getElementById("city").value.trim();
  const weatherCard = document.getElementById("weatherCard");
  const errorMsg = document.getElementById("error");

  if (!city) return alert("Please enter or select a city!");

  const url = `https://${apiHost}/v1/weather?city=${encodeURIComponent(city)}`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    // Check if data is valid
    if (!data.temp && data.temp !== 0) {
      throw new Error("Invalid city or missing data");
    }

    // Fill weather data
    document.getElementById("cityName").textContent = city.toUpperCase();
    document.getElementById("temp").textContent = `${data.temp}°C`;
    document.getElementById("feels_like").textContent = `${data.feels_like}°C`;
    document.getElementById("humidity").textContent = `${data.humidity}%`;
    document.getElementById("wind_speed").textContent = `${data.wind_speed} km/h`;

    const condition = getCondition(data.cloud_pct);
    document.getElementById("condition").textContent = condition.text;
    document.getElementById("weatherIcon").textContent = condition.icon;

    document.body.style.background = condition.bg;

    weatherCard.classList.remove("hidden");
    errorMsg.classList.add("hidden");
  } catch (err) {
    console.error("Error fetching weather:", err);
    weatherCard.classList.add("hidden");
    errorMsg.classList.remove("hidden");
  }
}

function getCondition(cloud_pct) {
  if (cloud_pct < 20)
    return { text: "☀️ Clear Sky", icon: "☀️", bg: "linear-gradient(to right, #ffb347, #ffcc33)" };
  if (cloud_pct < 50)
    return { text: "🌤️ Partly Cloudy", icon: "🌤️", bg: "linear-gradient(to right, #6dd5fa, #2980b9)" };
  if (cloud_pct < 80)
    return { text: "☁️ Mostly Cloudy", icon: "☁️", bg: "linear-gradient(to right, #bdc3c7, #2c3e50)" };
  return { text: "🌧️ Overcast / Rainy", icon: "🌧️", bg: "linear-gradient(to right, #00c6fb, #005bea)" };
}
