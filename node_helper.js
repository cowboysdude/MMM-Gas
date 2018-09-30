/* Magic Mirror
 * Module: MMM-Gas
 *
 * By Cowboysdude
 * 
 */
const NodeHelper = require('node_helper');
const cheerio = require('cheerio');
const request = require('request');

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting module: " + this.name);
    },

     getGAS: function() {
        request("https://www.autoblog.com/" + this.config.zip + "-gas-prices/" + this.config.typeGas, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(body);
                const gasset = [];
                $('.shop').each(function(i, elem) {
                    const gaslist = {
                        name: $(elem).find('.name h4').text(),
                        ppg: $(elem).find('.price').text().match(/^\$(([1-9]\d*)?\d)(\.\d{2})/g)[0],
                        dist: $(elem).find('.dist').text().replace(/[\n\t\r]/g, ""),
                        address: $(elem).find('.name address').text(),
                        updated: $(elem).find('.time').text(),
                    };
                    gasset.push(gaslist);
                });
                if(this.config.sortBy == 'price') {
                    gasset.sort((a,b) => eval(a.ppg.slice(1)) - eval(b.ppg.slice(1)) );
                }
                this.sendSocketNotification("GAS_RESULT", gasset);
            }
        });
    },
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_GAS') {
			this.getGAS(payload);
			
        }
        if (notification === 'CONFIG') {
            this.config = payload;
        }
    }
});
