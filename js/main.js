import {
  uiElement,
  updateThemeIcon,
  renderCityList,
  renderError,
} from "./ui.js";

//! projede tutulan veriler
const STATE = {
  theme: localStorage.getItem("theme") || "dark",
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
};

// form gönderilince çalışan fonksiyon
const handleSearch = (city) => {
  const name = city.trim();
  console.log(name);
  if (!name) {
    renderError("Şehir ismi zorunludur");
  }
};

//! events
// sayfa içeriği yüklendiğinde
document.addEventListener("DOMContentLoaded", () => {
  renderCityList();
  handleSearch(city);
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
