'use strict';

/* * * * * *
* Description: Retrieves the endpoint for the current price of Bitcoin
* Inputs: callback function
* Returns: API from Coindesk with current prices
* * * * * */
const getPriceFromApi = (callback) => {
// First endpoint for prices
  const COINDESK_PRICE_ENDPOINT = "https://api.coindesk.com/v1/bpi/currentprice.json";
// Query object
  const settings = {
    url: COINDESK_PRICE_ENDPOINT,
    dataType: 'json',
    type: 'GET',
  };
// promise to check for any errors
  let promise = $.ajax(settings);
    promise.then(
      function(responseBody) {
        renderPriceResult(responseBody);
      },
      function (error) {
        console.error("Error with coindesk historical data:", error);
      }
    );
};

/* * * * * *
* Description: Retrieves the endpoint for the historical price of Bitcoin
* Inputs: callback function, type, numOfDays
* Returns: Historical data of Bitcoin through Coindesk
* * * * * */
const getHistoricalDataFromApi = (callback, type, numOfDays) =>{
  const COINDESK_ENDPOINT_HISTORICAL = "https://api.coindesk.com/v1/bpi/historical/close.json";
  const currentDate = moment().format('YYYY-MM-DD');
  const days = moment().subtract('days', numOfDays);
  const dateFormat = days.format('YYYY-MM-DD');
  const setHistorical = function(){
    return {
      url: COINDESK_ENDPOINT_HISTORICAL,
      // information in data will be changed in other functions
      data: {
        currency: type,
        start: dateFormat,
        end: currentDate
      },
      dataType: 'json',
      type: 'GET',
      success: callback
    }
  };

    let promise = $.ajax(setHistorical(type, numOfDays));
    promise.then(
      function(responseBody) {
        chart(responseBody);
      },
      function (error) {
        console.error("Error with coindesk:", error);
      }
    );
};

/* * * * * *
* Description: Creates a chart of the data pulled from getHistoricalDataFromApi
* Inputs: result
* Returns: A detailed chart with Price on the y axis and dates on the x axis
* * * * * */
const chart = (result) =>{
  let ctx = document.getElementById("myChart").getContext('2d');
  const x = [];
  const y = [];
  for (let key in result.bpi) {
    if (result.bpi.hasOwnProperty(key)) {
      x.push(key);
      y.push(result.bpi[key]);
    }
  };
  let myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: x,
      datasets: [{
        label: 'Price of Bitcoin',
        data: y,
        borderColor: '#1a252f',
      }]
    }
  });
};

/* * * * * *
* Description: Targets active bootstrap class on button prcies
* Inputs: Currency, data, that 
* Returns: Different active buttons based on which was clicked and the corresponding chart data.
*/
const assignDayButtonClick = (currency, data, that) => {
  $('.btn').removeClass('active');
  $(that).addClass('active');
  getHistoricalDataFromApi(chart, currency, data);
}

/* * * * * *
* Description: Controls data-days attribute on button clicks
* Inputs: currency 
* Returns: different chart layout based on which button is clicked using this
* * * * * */
const assignClicks = (currency) =>{
  $('.daysButton').each(function(){
    const data = $(this).data("days");
    $(this).click(function(){
      assignDayButtonClick(currency, data, this);
    });
  });
};

/* * * * * *
* Description: Loads the default chart when the page loads
* Inputs: Currency
* Returns: Default chart which is USD for the past 5 days
*/
const loadDefaultChart = (currency) =>{
  let defaultNum = 5;
  getHistoricalDataFromApi(chart, currency, defaultNum);
  $('#myChart, .group').show();
  $('.defaultButton').addClass('active');

}

/* * * * * *
* Description: layout for clickable divs of USD, Pound, and Euro
* Inputs: result argument to pull specific data from json
* Returns: default chart and clicks for prices which load default of 5 days
* * * * * */
const renderPriceResult = (result) =>{
  $('#USD-rate').html(`${result.bpi.USD.rate}`);
  $('#GBP-rate').html(`${result.bpi.GBP.rate}`);
  $('#EUR-rate').html(`${result.bpi.EUR.rate}`);
};

/* * * * * *
* Description: Loads what happens when each div is clicked
* Inputs: None
* Returns: AssignClicks and loadDefaultChart functions loaded on button click
* * * * * */
$(document).ready(() => {
  $('.dollar').click(function(){
    assignClicks('USD');
    loadDefaultChart('USD');
    $('.btn').removeClass('active');
    $('.defaultButton').addClass('active');
  });
  
  $('.pound').click(function(){
    assignClicks('GBP');
    loadDefaultChart('GBP');
    $('.btn').removeClass('active');
    $('.defaultButton').addClass('active');
  });
  
  $('.euro').click(function(){
    assignClicks('EUR');
    loadDefaultChart('EUR');
    $('.btn').removeClass('active');
    $('.defaultButton').addClass('active');
  });
});

/* * * * * *
* Description: Takes the data from the Api and returns it as html
* Inputs: none
* Returns: renderPriceResult as html with the correct json data
* * * * * */
const watchSubmit = () =>{
  getPriceFromApi(renderPriceResult);
}

//initializes the watchSubmit function
watchSubmit();

//calls watchSubmit every minute to update the current prices
window.setInterval(watchSubmit, 60000);