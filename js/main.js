import { getWeatherData, getWeatherByCoords, getFlagUrl } from "./api.js";
import {
  uiElement,
  updateThemeIcon,
  renderCityList,
  renderError,
  clearError,
  setLoader,
  renderWeatherData,
  renderRecentChips,
  updateUnitToggle,
} from "./ui.js";

//! projede tutulan veriler
const STATE = {
  theme: localStorage.getItem("theme") || "dark",
  recent: JSON.parse(localStorage.getItem("recent") || "[]"),
  units: localStorage.getItem("units") || "metric",
};

// ! proje yüklendiği anda yapılacaklar

// body elmentine eriş
const body = document.body;

// body'e tema değerini attribure olarak ekle
body.setAttribute("data-theme", STATE.theme);

// sayfa ilk yüklendiğinde doğru ikonun ekrana gelmesini sağla
updateThemeIcon(STATE.theme);

//! fonksiyonlar
// mevcut değerleri local storage'a kaydet
const persist = () => {
  localStorage.setItem("theme", STATE.theme);
  localStorage.setItem("recent", JSON.stringify(STATE.recent));
  localStorage.setItem("units", STATE.units);
};

// son aratılanlara ekleme yapan fonksiyon
const pushRecent = (city) => {
  // son aratılanı diziye ekle
  // dizide aynı şehir isminden max 1 tane olmalı
  // yeni elemanın dizinin en başına eklemeli
  // en son aratılan 6 şehirli sınırla
  const updated = [
    city,
    ...STATE.recent.filter((c) => c.toLowerCase() !== city.toLowerCase()),
  ].slice(0, 6);
  // state nesnesini güncelle
  STATE.recent = updated;
  // son aratılanları ekrana bas
  renderRecentChips(STATE.recent, (city) => {
    uiElement.searchInput.value = city;
    handleSearch(city);
  });
  //  son güncellemeleri localStorage a kaydet
  persist();
};

// form gönderilince çalışan fonksiyon
const handleSearch = async (city) => {
  const name = city.trim();

  if (!name) {
    renderError("Şehir ismi zorunludur");
    return;
  }

  // önceden hata varsa temizle
  clearError();

  // ekrana loader bas
  setLoader(true);

  try {
    //api dan hava durumu verileri al
    const data = await getWeatherData(city, STATE.units);
    if (data.cod === "404") {
      return renderError("Şehir bulunamadı");
    }

    // bayrak için url oluştur
    const flagUrl = getFlagUrl(data.sys.country);

    // son aratılanları güncelle
    pushRecent(name);

    // ekrana hava durumu verisini bas
    renderWeatherData(data, flagUrl, STATE.units);
  } catch (error) {
    // api'dan hata geldiyse ekrana bas
    renderError(error.message || "Şehir bulunamadı");
  } finally {
    // api'dan cevap gelince loader'ı ekrandan kaldır
    setLoader(false);
  }
};

// kullanıcının konumuna göre ara
const handleGeoSearch = () => {
  window.navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      // ekrana loader bas
      setLoader(true);

      // api a hava durumu için istek at
      const data = await getWeatherByCoords(latitude, longitude, STATE.units);

      // loader gizle
      setLoader(false);

      const flagUrl = getFlagUrl(data.sys.country);
      renderWeatherData(data, flagUrl, STATE.units);
      pushRecent(data.name);
    },
    () => {
      renderError("Konum bilgisi bulunamadı");
    }
  );
};

//! events
// sayfa içeriği yüklendiğinde
document.addEventListener("DOMContentLoaded", () => {
  // kullanıcı konumuna göre arat
  handleGeoSearch();
  renderCityList();
  renderRecentChips(STATE.recent, (city) => {
    uiElement.searchInput.value = city;
    handleSearch(city);
  });
});

// form gönderildiğinde
uiElement.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = uiElement.searchInput.value;

  handleSearch(city);
});

// tema butonuna tıklanma olayını izle
uiElement.themeBtn.addEventListener("click", () => {
  // Erişilen tema değerinin tersini al
  STATE.theme = STATE.theme === "light" ? "dark" : "light";

  // tema değerini body e attribute oalrak ekle
  body.setAttribute("data-theme", STATE.theme);

  persist();

  // iconu güncelle

  updateThemeIcon(STATE.theme);
});

// konum butonuna tıklanma olayını izle
uiElement.locateBtn.addEventListener("click", handleGeoSearch);

// birim alanına tıklanma olayını izle
uiElement.unitToggle.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const nextUnits = btn.value;
    persist();

    // aynu birim seçildiyse fonksiyonu durdur
    if (STATE.units === nextUnits) return;

    // seçili birimi tutuğumuz değişkeni güncelle
    STATE.units = nextUnits;

    // local storage a son güncellemeleri kaydet
    persist();

    // arayüzü güncelle
    updateUnitToggle(nextUnits);

    // son yapılan aramayı seçilen birime göre tekrarla
    handleSearch(STATE.recent[0]);
  });
});
