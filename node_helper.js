/* Magic Mirror
    * Module: MMM-Gas
    *
    * By Cowboysdude
    * 
    */
const NodeHelper = require('node_helper');	
const rp = require('request-promise');
const cheerio = require('cheerio');
const options = {
  uri: `https://www.autoblog.com/14845-gas-prices/`,
  transform: function (body) {
    return cheerio.load(body);
  }
}; 
 
module.exports = NodeHelper.create({
	  
    start: function() {
    	console.log("Starting module: " + this.name);
    },
    
    getGAS: function(url) {
		var self=this;
    rp(options)
     .then(($) => {
	  let gasset = [];
        
	  $('.stations-list').each(function(i, elem) {
	   gasset[i] = {}
	   gasset[i]['name']= $('.name').children('a').text(),
	   gasset[i]['ppg']= $('.ppg').children('a').text(),
	   gasset[i]['dist']= $('.dist').children('a').text(),
	   gasset.push({name: gasset[i]['name'], ppg: gasset[i]['ppg'], dist: gasset[i]['dist']});
	   // console.log(gasset[i]);
		});
		
       console.log(gasset);
	   self.sendSocketNotification("GAS_RESULT", gasset);
      })
     .catch((err) => {
    console.log(err);
  });
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
