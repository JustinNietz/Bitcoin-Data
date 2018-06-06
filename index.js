'use strict';
// Enpoints for Coindesk
const COINDESK_ENDPOINT = "https://api.coindesk.com/v1/bpi/currentprice.json";
const COINDESK_ENDPOINT_HISTORICAL = "https://api.coindesk.com/v1/bpi/historical/close.json";

//To pull data for the price of Bitcoin in three different currencies
function getDataFromApi(callback){
  const settings = {
    url: COINDESK_ENDPOINT,
    dataType: 'json',
    type: 'GET',
  };

let promise = $.ajax(settings);
promise.then(
    function (responseBody) {
      renderResult(responseBody);
    },
    function (error) {
      console.error("Error with coindesk:", error);
    }
  );
}

//The format for prices in html
function renderResult(result) {
  const results = `
  <div class="row">
    <div class="col-4 clickable">
      <h3>${result.bpi.USD.code}</h3>
      <p>${result.bpi.USD.symbol}<span>${result.bpi.USD.rate}</span</p>

    </div>
    <div class="col-4 clickable">
      <h3>${result.bpi.GBP.code}</h3>
      <p>${result.bpi.GBP.symbol}<span>${result.bpi.GBP.rate}</span</p>
    </div>
    <div class="col-4 clickable">
      <h3>${result.bpi.EUR.code}</h3>
      <p>${result.bpi.EUR.symbol}<span>${result.bpi.EUR.rate}</span</p>
    </div>
</div>`
     $('.js-result').html(results);
}


//the function that will call the API and lay it out in html
function watchSubmit(){
  getDataFromApi(renderResult);
}

//callback function
$(watchSubmit);

//for historical data which will be translated into a chart
function getHistoricalDataFromApi(callback){
const currentDate = moment().format('YYYY-MM-DD');
const sevenDays = moment().subtract('days', 7);
const seven = sevenDays.format('YYYY-MM-DD');

  const settingsHistoricalUSD = {
    url: COINDESK_ENDPOINT_HISTORICAL,
    data: {
      start: seven,
      end: currentDate
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };

let promise = $.ajax(settingsHistoricalUSD);
promise.then(
    function (responseBody) {
      renderResult(responseBody);
    },
    function (error) {
      console.error("Error with coindesk historical:", error);
    }
  );
}
//$.getJSON({URL}).then((response) => {//Do Something})


//setTimeout in mili call function use promises .then()

// remove div then redraw for 7/10 or whatever amount of days
//use moment to format date
//use chart.js for date and money on x and y 
function renderResultHistorical(result) {
      for (let key in result.bpi) {
    if (result.bpi.hasOwnProperty(key)) {
      $(".result-historical-USD").append(`<li>${key} at ${result.bpi[key]}</li>`);
    }
  }
   
}


function watchSubmitHistorical(){
  getHistoricalDataFromApi(renderResultHistorical);
}

$(watchSubmitHistorical);





















    