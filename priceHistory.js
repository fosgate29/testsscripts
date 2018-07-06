const axios = require("axios");

const Medianizer = artifacts.require('Medianizer');
const request = require("request");

const fs   = require('fs');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/${process.env.INFURA}'));

const historyFile = './scripts/historyPriceFeed.csv';

/*
truffle exec scripts/gatherGasUsed.js -f transactions.csv
*/
module.exports = async (callback) => {

  console.log('Start...');

  const medianizerAddress = '0x729D19f657BD0614b4985Cf1D82531c67569197B';
  const medianizer = await Medianizer.at(medianizerAddress);
  
  async function getHistory(){

    let makerDAO_priceFeed = await medianizer.read();
    makerDAO_priceFeed = await web3.toBigNumber(makerDAO_priceFeed);
    makerDAO_priceFeed = makerDAO_priceFeed.div(1000000000000000000);   

    let balanc3_averagePrice = 0;
    var url = "https://exchanges.balanc3.net/prices?from=ETH&to=USD";

    const response = await axios.get(url);

    balanc3_averagePrice = response.data[4].averagePrice; // Print the json response
    /*await request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            balanc3_averagePrice = body[4].averagePrice; // Print the json response
            return '';
        }
    })*/

    //console.log('makerDAO_priceFeed = '+makerDAO_priceFeed);

    var now = new Date();

    console.log(now+';'+balanc3_averagePrice+';'+makerDAO_priceFeed);

    fs.appendFile(historyFile, now+';'+balanc3_averagePrice+';'+makerDAO_priceFeed+'\n', function (err) {
      if (err) throw err;
    });

    setTimeout(getHistory, 300000);
  }

  getHistory();

  //console.log('Finished');

  callback();

};




