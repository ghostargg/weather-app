const searchButton = document.querySelector('.search-button');
const selectField = document.querySelector('.town-select');
const weatherInfoSection = document.querySelector('.weather-info');

const getWeatherInfo = async (townName) => {
  const response = await fetch(`https://danepubliczne.imgw.pl/api/data/synop/station/${townName}`)
  const data = await response.json();

  return data;
}

const reset = (elementClassName) => {
  const element = document.querySelector(`.${elementClassName}`)

  if (element) {
    weatherInfoSection.removeChild(element);
  }
}

const displayError = () => {
  reset('weather-table');
  reset('error-message');

  const errorMessage = document.createElement('p');
  errorMessage.classList.add('error-message');
  errorMessage.textContent = 'Proszę wybrać miasto';

  weatherInfoSection.append(errorMessage);
  selectField.classList.add('error');
}

selectField.addEventListener('change', () => {
  const selectedTown = selectField.value;

  if (!selectedTown) {
    displayError();
  } else {
    selectField.classList.remove('error')
    reset('error-message');
  }
})

searchButton.addEventListener('click', async (event) => {
  event.preventDefault();
  
  const selectedTown = selectField.value;
  let weatherData;

  if (selectedTown) {
    weatherData = await getWeatherInfo(selectedTown);

    localStorage.setItem('last-search', JSON.stringify({
      ...weatherData, 
      value: selectField.value 
    }));

  } else {
    displayError();
    return;
  }

  renderTable(weatherData);
})

const renderTable = (town) => {
  reset('weather-table');

   const townInfoToDisplay = [
    town.data_pomiaru,
    town.temperatura,
    town.suma_opadu,
    town.cisnienie,
  ]

  const table = document.createElement('table');
  table.classList.add('weather-table')

  const thead = document.createElement('thead')
  const theadRow = document.createElement('tr');
  const headers = ['Data pomiaru', 'Temperatura', 'Suma opadów', 'Ciśnienie']

  headers.forEach(header => {
    const th = document.createElement('th');
    th.classList.add('weather-table__th')
    th.textContent = header;
    theadRow.appendChild(th)
  })

  thead.appendChild(theadRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  const tbodyRow = document.createElement('tr');

  townInfoToDisplay.forEach(value => {
    const td = document.createElement('td');
    td.classList.add('weather-table__td');

    td.textContent = value;

    tbodyRow.appendChild(td);
  })

  tbody.appendChild(tbodyRow)
  table.appendChild(tbody);
  
  weatherInfoSection.appendChild(table);
}

const data = JSON.parse(localStorage.getItem('last-search'));

if (data) {
  selectField.value = data.value;
  renderTable(data);
}