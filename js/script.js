'use strict';

const url =
  'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo';

let allPersons = [];

let filteredPersons = [];

const userDiv = document.querySelector('#user');
const dataDiv = document.querySelector('#data');

window.addEventListener('load', () => {
  resetResults();
  loadPersons();
  const inputBusca = document.querySelector('#busca');
  inputBusca.addEventListener('keydown', filtrar);
  const bntPesquisar = document.querySelector('#btnPesquisar');
  bntPesquisar.addEventListener('click', filtrar);
});

function resetResults() {
  userDiv.innerHTML = '<h4>Nenhum usuário filtrado.</h4>';
  dataDiv.innerHTML = '<h4>Nada a ser exibido.</h4>';
}

async function filtrar(event) {
  var key = event.which || event.keyCode;
  if (key === 13 || event.target.id === 'btnPesquisar') {
    var input = document.querySelector('#busca');

    filteredPersons = await allPersons
      .filter((res) => {
        return res.name.includes(input.value);
      })
      .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

    resetResults();
    if (input.value === '' || filteredPersons.length === 0) {
      return;
    }

    await populateUsers(filteredPersons);
    await populateStats(filteredPersons);
  }
}

async function populateUsers(users) {
  userDiv.innerHTML = '';
  var list = document.createElement('ul');

  var h4 = document.createElement('h4');
  h4.innerHTML = `${users.length} usuários encontrados`;
  userDiv.appendChild(h4);

  users.forEach((user) => {
    var item = document.createElement('li');
    var div = document.createElement('div');
    div.id = 'divContainer';
    var img = `<img src="${user.picture}" />`;
    var nameAge = `<span>${user.name}, ${user.age} anos</span>`;

    div.innerHTML = img + nameAge;
    item.appendChild(div);

    userDiv.appendChild(item);
  });
}

async function populateStats(users) {
  dataDiv.innerHTML = '';

  var masc = users.reduce((accumulator, currentItem) => {
    if (currentItem.gender == 'male') {
      accumulator++;
    }
    return accumulator;
  }, 0);
  var fem = users.reduce((accumulator, currentItem) => {
    if (currentItem.gender == 'female') {
      accumulator++;
    }
    return accumulator;
  }, 0);
  var sumAge = users.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.age;
  }, 0);
  var avgAge = sumAge / users.length;

  var list = document.createElement('ul');
  var h4 = document.createElement('h4');
  h4.innerHTML = `Estatísticas`;

  var list = document.createElement('ul');
  var item1 = document.createElement('li');
  var item2 = document.createElement('li');
  var item3 = document.createElement('li');
  var item4 = document.createElement('li');
  var statsMasc = document.createElement('span');
  statsMasc.innerHTML = `Sexo Masculino: <b>${masc}</b> `;
  var statsFem = document.createElement('span');
  statsFem.innerHTML = `Sexo Feminino: <b>${fem}</b> `;
  var statsSumAge = document.createElement('span');
  statsSumAge.innerHTML = `Soma das idades: <b>${sumAge}</b> anos`;
  var statsAvgAge = document.createElement('span');
  statsAvgAge.innerHTML = `Média das idades: <b>${avgAge
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</b> anos`;

  item1.appendChild(statsMasc);
  item2.appendChild(statsFem);
  item3.appendChild(statsSumAge);
  item4.appendChild(statsAvgAge);

  list.appendChild(item1);
  list.appendChild(item2);
  list.appendChild(item3);
  list.appendChild(item4);

  dataDiv.appendChild(h4);
  dataDiv.appendChild(list);
}

async function loadPersons() {
  const res = await fetch(url);
  const json = await res.json();

  makePersonArray(json.results);
}

function makePersonArray(json) {
  allPersons = json.map((person) => {
    const { gender, name, dob, picture } = person;

    return {
      gender: gender,
      name: name.first + ' ' + name.last,
      age: dob.age,
      picture: picture.thumbnail,
    };
  });
}
