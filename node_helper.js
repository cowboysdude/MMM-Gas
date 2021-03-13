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


    getUrl: function() {

        var url = null;

        if (this.config.typeGas === "regular") {
            url = "https://www.autoblog.com/" + this.config.zip + "-gas-prices/"
        } else {
            url = "https://www.autoblog.com/" + this.config.zip + "-gas-prices/" + this.config.typeGas
        }
        return url;
    },

    getGAS: function(url) {
        request({
            url: this.getUrl(),
            //url: "https://www.autoblog.com/14904-gas-prices/",
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.86 Safari/537.36'
            }
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(body);
                var gasset = [];
                $('.shop').each(function(i, elem) {
                    const gaslist = {
                        name: $(elem).find('.name h4').text(),
                        dist: $(elem).find('ul .dist').text().replace(/[\n\t\r]/g, ""),
                        address: $(elem).find('.name address').text(),
                        ppg: $(elem).find('li .slab.price .price').text(),
                        //updated: $(elem).find('li .time').text(),
                    };
                    gasset.push(gaslist);
                });
                console.log(gasset);
                if (this.config.sortBy == 'price') {
                    gasset.sort((a, b) => eval(a.ppg.slice(1)) - eval(b.ppg.slice(1)));
                }
                //console.log(gasset); 
                this.sendSocketNotification("GAS_RESULT", gasset);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'CONFIG') {
            this.config = payload;
        } else if (notification === 'GET_GAS') {
            this.getGAS(payload);
        }
    }
});
