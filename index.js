   // var xmlhttp = new XMLHttpRequest();
const COINDESK_ENDPOINT = "https://api.coindesk.com/v1/bpi/currentprice.json";
const COINDESK_ENDPOINT_HISTORICAL = "https://api.coindesk.com/v1/bpi/historical/close.json";

function getDataFromApi(callback){
  const settings = {
    url: COINDESK_ENDPOINT,
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}


function renderResult(result) {
  const results = `
  <div class="row">
    <div class="col-4">
      <h3>${result.bpi.USD.code}</h3>
      <p>${result.bpi.USD.symbol}<span>${result.bpi.USD.rate}</span</p>

    </div>
    <div class="col-4">
      <h3>${result.bpi.GBP.code}</h3>
      <p>${result.bpi.GBP.symbol}<span>${result.bpi.GBP.rate}</span</p>
    </div>
    <div class="col-4">
      <h3>${result.bpi.EUR.code}</h3>
      <p>${result.bpi.EUR.symbol}<span>${result.bpi.EUR.rate}</span</p>
</div>`
     $('.result').html(results);
}



function watchSubmit(){
  getDataFromApi(renderResult);
}

$(watchSubmit);


function getHistoricalDataFromApi(callback){
  const settingsHistorical = {
    url: COINDESK_ENDPOINT_HISTORICAL,
    data: {
      start: '2018-05-30',
      end: '2018-06-03'
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settingsHistorical);
}

function renderResultHistorical(result) {
      for (let key in result.bpi) {
    if (result.bpi.hasOwnProperty(key)) {
      $(".result-historical").append(`<li>${key} at ${result.bpi[key]}<li>`);
    }
  }
   
}

function watchSubmitHistorical(){
  getHistoricalDataFromApi(renderResultHistorical);
}

$(watchSubmitHistorical);



















    