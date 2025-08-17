import { cities } from "./constants.js";

const uiElement = {
  themeBtn: document.querySelector(".theme-btn"),
  dataList: document.querySelector("#city-list"),
  searchForm: document.querySelector("#search-form"),
  searchInput: document.querySelector("#city-input"),
  errorContainer: document.querySelector("#error-message"),
};

const updateThemeIcon = (theme) => {
  const icon = uiElement.themeBtn.querySelector("i");
  icon.className = theme === "light" ? "bi bi-moon-fill" : "bi bi-sun-fill";
};

// dataList içerisine sehirleri basıcak fonk.
const renderCityList = () => {
  cities.forEach((city) => {
    const opt = document.createElement("option");
    opt.value = city;
    uiElement.dataList.appendChild(opt);
  });
};

// hata mesajını ekrana bas
const renderError = (message) => {
  uiElement.errorContainer.textContent = message;
  uiElement.errorContainer.classList.add("show");
};

// hata mesajını kaldır
const clearError = () => {
  uiElement.errorContainer.textContent = "";
  uiElement.errorContainer.classList.remove("show");
};

// değişken/fonksiyonları diğer dosyalarda kullanmak için export ediyoruz
export { uiElement, updateThemeIcon, renderCityList, renderError, clearError };
