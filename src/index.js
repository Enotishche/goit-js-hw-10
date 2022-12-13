import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries }  from "./fetchCountries";
const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector("#search-box");
const countryListEl = document.querySelector(".country-list");
const countryInfoEl = document.querySelector(".country-info");

inputEl.addEventListener("input", debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    cleaneResult();
    const searchQuery = event.target.value.trim();
    if (searchQuery === "") {
        return;
    }
    fetchCountries(searchQuery)
        .then((country) => {
            alertManyCountry(country);
            insertContent(country);
        })
        .catch((er) => {
            if (er.code === 404) {
                Notiflix.Notify.failure('Oops, there is no country with that name');
                return;
            }
            
        });
}

const insertContent = (country) => {
    if (country.length < 10 & country.length > 1) {
        const result = makeContentForListCountry(country);
        countryListEl.innerHTML = result;
    }
    else if (country.length === 1) {
        const result = makeContentForOneCountry(country);
        countryInfoEl.innerHTML = result;
    }
}

const alertManyCountry = (country) => {
    if (country.length > 10) {
        return Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
    }
}
const createListCountry = ({ flags, name }) => `<li class="country-item">
        <img src="${flags.svg}" alt="flag" width="70px" height="50px">
        <p class="country-name">${name.official}</p>
      </li>`;

const createOneCountry = ({name, capital, population, flags, languages}) => `
<ul class="country-list">
  <li class="country-info_item name"><img class="image-item" src="${flags.svg}" alt="flag" width="120px" >${name.official}</li>
  <li class="country-info_item">Capital: ${capital}</li>
  <li class="country-info_item">Population: </span>${population}</li>
  <li class="country-info_item">Languages: </span>${Object.values(languages)}</li>
</ul>`;

const makeContentForListCountry = (country) => country?.reduce((acc, country) => acc + createListCountry(country), "");

const makeContentForOneCountry = (country) => country?.reduce((acc, country) => acc + createOneCountry(country), "");

function cleaneResult() {
    countryInfoEl.innerHTML = "";
    countryListEl.innerHTML = "";
}