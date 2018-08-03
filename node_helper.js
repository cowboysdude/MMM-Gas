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
	// this is what I get back........close but can't quite figure out how to send them back as single sets
	// ie name: name, ppg: price, dist: distance as seperate objects
	    // here is my return
	   console.log(gasset);  
	    //[ { name: '1. Kwik Fill #372. Express Mart #3533. Byrne Dairy #664. Express Mart #3225. Sues Pine Valley Busymart6. Speedway #7749 (discount Available)7. Express Mart #3708. Byrne Dairy #19. Dandy Mini Mart #6310. 7-eleven #35122',
    //ppg: '$3.099$2.959$2.949$2.959$3.349$3.159$2.959$2.949$2.959$3.099',
    //dist: '1.68 miles2.09 miles2.23 miles2.49 miles2.76 miles2.92 miles3.09 miles3.31 miles4.25 miles4.36 miles' },
      
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
