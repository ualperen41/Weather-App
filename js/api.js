const API_KEY = "40e7ee4a6de50f10ca31c0283e5c0132";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// şehir ismine göre hava durumu verisini alır
export const getWeatherData = async (city, units = "metric") => {
  // istek atılacak url'i hazırla
  const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=${units}&lang=tr`;

  // api a istek at
  const res = await fetch(url);

  // responsu js formatına çevir json ===> js
  const data = await res.json();
  console.log(data);
  //datayı döndür
  return data;
};

// koordinatlara göre havadurumu verisini alır
// koordinatlara göre havadurumu verisini alır
export const getWeatherByCoords = async (lat, lon, units = "metric") => {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;

  const res = await fetch(url);

  return res.json();
};

// parametre olarak gelen ülke için bayrak urli oluşturan fonksiyon
export const getFlagUrl = (countryCode) =>
  `https://flagcdn.com/108x81/${countryCode.toLowerCase()}.png`;
