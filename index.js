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
}

   let promise = $.ajax(setHistorical(type, numOfDays));
    promise.then(
      function(responseBody) {
        watchSubmitHistorical(responseBody);
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

var ctx = document.getElementById("myChart").getContext('2d');
const x = [];
const y = [];
for (let key in result.bpi) {
    if (result.bpi.hasOwnProperty(key)) {
      x.push(key); 
      y.push(result.bpi[key]);
    }
  }
   var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: x,
        datasets: [{
            label: 'Price of Bitcoins',
            data: y,
            borderColor: 'Red',
            backgroundColor: false
        }]
    },

    options: {
    }
});

}

/* * * * * *
* Description: function that controls all clickable features of the web app. getHistoricalDataFromApi have separate arguments for each button clicked
* Inputs: None
* Returns: clickable divs that open charts for each currency
* * * * * */
const watchSubmitHistorical = () =>{
//5 Days in the past is the default chart
  let defaultNum = 5;
  $('.dollar').click(function(){
    getHistoricalDataFromApi(chart,'USD', defaultNum);
    $('#myChart, .buttonHide, .buttonFive, .buttonFifteen, .buttonThirty').show();

    $('.buttonFive').click(function(){
      getHistoricalDataFromApi(chart, 'USD', defaultNum);
    })
    $('.buttonFifteen').click(function(){
      getHistoricalDataFromApi(chart,'USD', 15);
    })
    $('.buttonThirty').click(function(){
      getHistoricalDataFromApi(chart,'USD', 30);
    })
  });
   
  $('.pound').click(function(){
    getHistoricalDataFromApi(chart, 'GBP', defaultNum)
    $('#myChart, .buttonHide, .buttonFive, .buttonFifteen, .buttonThirty').show();
    
    $('.buttonFive').click(function(){
      getHistoricalDataFromApi(chart, 'GBP', defaultNum);
    })
    $('.buttonFifteen').click(function(){
      getHistoricalDataFromApi(chart,'GBP', 15);
    })
    $('.buttonThirty').click(function(){
      getHistoricalDataFromApi(chart,'GBP', 30);
    })
  });
   
  $('.euro').click(function(){
    getHistoricalDataFromApi(chart, 'EUR', defaultNum)
    $('#myChart, .buttonHide, .buttonFive, .buttonFifteen, .buttonThirty').show();

    $('.buttonFive').click(function(){
      getHistoricalDataFromApi(chart, 'EUR', defaultNum);
    })
    $('.buttonFifteen').click(function(){
      getHistoricalDataFromApi(chart,'EUR', 15);
    })
    $('.buttonThirty').click(function(){
      getHistoricalDataFromApi(chart,'EUR', 30);
    })
  });

  $('.buttonHide').click(function(){
    $('#myChart, .buttonHide, .buttonFive .buttonFifteen, .buttonThirty').hide();
  })

};

/* * * * * *
* Description: HTML layout for prices of USD, Pound, and Euro
* Inputs: result argument to pull specific data from json
* Returns: HTML for prices
* * * * * */
const renderPriceResult = (result) =>{
  const results = `
  <div class="row">
    <div class="col-4 clickable dollar">
      <h3>${result.bpi.USD.code}</h3>
      <p>${result.bpi.USD.symbol}<span>${result.bpi.USD.rate}</span</p>
    </div>
    <div class="col-4 clickable pound">
      <h3>${result.bpi.GBP.code}</h3>
      <p>${result.bpi.GBP.symbol}<span>${result.bpi.GBP.rate}</span</p>
    </div>
    <div class="col-4 clickable euro">
      <h3>${result.bpi.EUR.code}</h3>
      <p>${result.bpi.EUR.symbol}<span>${result.bpi.EUR.rate}</span</p>
    </div>
  </div>`
    $('.js-result').html(results);
    //Call to click function when HTML loads
    watchSubmitHistorical();
};

/* * * * * *
* Description: Takes the data from the Api and returns it as html
* Inputs: none
* Returns: renderPriceResult as html with the correct json data
* * * * * */
const watchSubmit = ()=>{
  getPriceFromApi(renderPriceResult);
}

//initializes the watchSubmit function 
watchSubmit();
//calls watchSubmit every minute to update the current prices
window.setInterval(watchSubmit, 6000);











    