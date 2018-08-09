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
        request("https://www.autoblog.com/" + this.config.zip + "-gas-prices/", (error, response, body) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(body);

                const gasset = [];

                $('.stations-list tbody tr').each(function(i, elem) {
                    const href = decodeURI($(elem).find('.name a').attr('href')).split('=');
                    const address = href[href.length - 1];
					const link = decodeURI($(elem).find('.name a').attr('href'));

                    const gaslist = {
                        name: $(elem).find('td .name').text().replace(/\$.*/, ""),
                        ppg: $(elem).find('.ppg').text().replace(/[\n\t\r]/g, ""),
                        dist: $(elem).find('.dist').text().replace(/[\n\t\r]/g, ""),
                        address,
						link
                    };
                    
                    gasset.push(gaslist);
					
                });

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