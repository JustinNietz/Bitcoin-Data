'use strict';

/* * * * * *
* Description: Retrieves the endpoint for the current price of Bitcoin
* Inputs: Requires an html layout to be passed as an argument
* Returns: Data from the Api if there are no errors
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
* Inputs: Requires a layout for the data, arguments to be passed in to change the currency type and number of days of historical data displayed
* Returns: Data from the Api if there are no errors
* * * * * */
const getHistoricalDataFromApi = (callback, type, numOfDays) =>{
  const COINDESK_ENDPOINT_HISTORICAL = "https://api.coindesk.com/v1/bpi/historical/close.json";
  const currentDate = moment().format('YYYY-MM-DD');
  const days = moment().subtract('days', numOfDays);
  const dateFormat = days.format('YYYY-MM-DD');
  const setHistorical = function(){
    return {
      url: COINDESK_ENDPOINT_HISTORICAL,
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
* Description: Creates a chart of the data for a certain number of days
* Inputs: argument which pulls information needed out of the json data
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
        label: 'Price of Bitcoins',
        data: y,
        borderColor: '#1a252f',
      }]
    }
  });
};

/* * * * * *
* Description: Targets button clicks
* Inputs: Currency, data, that 
* Returns: Different active buttons based on which was clicked and the corresponding chart data.
*/
const assignDayButtonClick = (currency, data, that) => {
  $('.btn').removeClass('active');
  $(that).addClass('active');
  getHistoricalDataFromApi(chart, currency, data);
}

/* * * * * *
* Description: Contols how many days past the chart shows through the data-days attribute on each button
* Inputs: currency which changes based on what button is clicked
* Returns: different chart layout and active button based on which button is clicked
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

$(document).ready(() => {
  $('.dollar').click(function(){
    assignClicks('USD');
    loadDefaultChart('USD');
  });
  
  $('.pound').click(function(){
    assignClicks('GBP');
    loadDefaultChart('GBP');
  });
  
  $('.euro').click(function(){
    assignClicks('EUR');
    loadDefaultChart('EUR');
  });

  assignClicks('USD');
  loadDefaultChart('USD');
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