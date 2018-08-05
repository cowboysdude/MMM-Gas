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

    getGAS: function(url) {
        var self = this;
        request("https://www.autoblog.com/" + this.config.zip + "-gas-prices/", function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body);

                let gasset = [];

                $('.stations-list tr').each(function(i, elem) {
                    gaslist = {
                        name: $(elem).find('td .name').text().replace(/\$.*/, ''),
                        ppg: $(elem).find('.ppg').text().replace(/[\n\t\r]/g, ""),
                        dist: $(elem).find('.dist').text().replace(/[\n\t\r]/g, "")
                    };
                   
                    gasset.push(gaslist);

                });
                
                self.sendSocketNotification("GAS_RESULT", gasset);
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
