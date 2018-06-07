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
    <div class="col-4 clickable hello">
      <h3>${result.bpi.USD.code}</h3>
      <p>${result.bpi.USD.symbol}<span>${result.bpi.USD.rate}</span</p>
    </div>
    <div class="col-4 clickable hello2">
      <h3>${result.bpi.GBP.code}</h3>
      <p>${result.bpi.GBP.symbol}<span>${result.bpi.GBP.rate}</span</p>
    </div>
    <div class="col-4 clickable hello3">
      <h3>${result.bpi.EUR.code}</h3>
      <p>${result.bpi.EUR.symbol}<span>${result.bpi.EUR.rate}</span</p>
    </div>
</div>`
    $('.js-result').html(results);
    $(".hello").click(function(){
    $(".result-historical-USD").toggle();
})
            $(".hello2").click(function(){
    $(".result-historical-GBP").toggle();
  })
        $(".hello3").click(function(){
    $(".result-historical-EUR").toggle();
  })
}

//the function that will call the API and lay it out in html
function watchSubmit(){
  getDataFromApi(renderResult);
}

$(watchSubmit)
//callback function in intervals updates prices every minute
window.setInterval("$(watchSubmit)", 60000);
//for historical data which will be translated into a chart


function getHistoricalDataFromApi(callback){
const currentDate = moment().format('YYYY-MM-DD');
const sevenDays = moment().subtract('days', 7);
const seven = sevenDays.format('YYYY-MM-DD');
const price = "";
/*
if (//div clicked is USD){
  price = "USD";
} else if (//div clicked is EUR){
  price = "EUR";
} else if (//div clicked is GBP){
  price = "GBP";
}
*/
  const settingsHistorical = {
    url: COINDESK_ENDPOINT_HISTORICAL,
    data: {
     // currency: price,
      start: seven,
      end: currentDate
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };

let promise = $.ajax(settingsHistorical);
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


//setTimeout in mili call function use promises .then() -- DONE

// remove div then redraw for 7/10 or whatever amount of days
//use moment to format date -- DONE
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





















    