'use strict';

const api_Key = 'V0QQCWOkdIH95184QTyeQczqRwRDeFYcfITsaxaQ';
const searchURL = 'https://api.nps.gov/api/v1/parks';
function formatQueryParams(params){
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  //if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){

    let addressJson = {};
    for (let j = 0; j < responseJson.data[i].addresses.length ; j++){
      if(responseJson.data[i].addresses[j].type == "Physical"){
        addressJson = responseJson.data[i].addresses[j];
      }
    }
    $('#results-list').append(
      `<li>
      <h3><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h3>
      <p>${responseJson.data[i].description}</p>
      <p><b>Physical Address:</b>
      <br>
      ${addressJson.line1}
      <b>
      ${addressJson.city} ,
      ${addressJson.stateCode} ${addressJson.postalCode}
      </p>
      </li>`
    )};
  //display the results section
  $('#results').removeClass('hidden');
};
    
function getParkInfo(query, maxResults=10){
  const params = {
    stateCode: query,
    limit: maxResults,
    fields: 'addresses',
    start: '0',
    apiKey: api_Key

  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if(response.ok){
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('#js-form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParkInfo(searchTerm, maxResults);
  });
}

$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
});