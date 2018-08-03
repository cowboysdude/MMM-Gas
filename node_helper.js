/* Magic Mirror
    * Module: MMM-Gas
    *
    * By Cowboysdude
    * 
    */
const NodeHelper = require('node_helper');	
let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs'); 
 
module.exports = NodeHelper.create({
	  
    start: function() {
    	console.log("Starting module: " + this.name);
    },
    
    getGAS: function(url) {
axios.get('https://www.autoblog.com/14845-gas-prices/')
    .then((response) => {
        if(response.status === 200) {
			console.log("Working");
            const html = response.data;
            const $ = cheerio.load(html);
		//console.log(html);	
            let gasList = [];
            $('stations-list').each(function(i, elem) {
				console.log("Gas Prices");
                devtoList[i] = {
                    station: $(this).find('name').text().trim(),
              
                }  
console.log(station);
				console.log("last test");	
            });
    }
}, (error) => console.log(err) );
	},
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_GAS') {
                this.getGAS(payload);
            }
		if(notification === 'CONFIG'){
			this.config = payload;
		}	
         }  
    });