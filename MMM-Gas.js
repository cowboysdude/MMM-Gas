/* Magic Mirror
 * Module: MMM-Gas
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("MMM-Gas",{

	defaults: {
		updateInterval: 24 * 60 * 1000,
		zip: "14904"
	},

	getStyles: function() {
		return [ "MMM-Gas.css" ]
	},

	
    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.loaded = true;
        this.url = "https://www.autoblog.com/"+this.config.zip+"-gas-prices/";
		this.getGAS();
		
    },

    scheduleCarousel: function() {
        console.log("Scheduling items");
            this.updateDom(this.config.animationSpeed);
        
    },

    getDom: function() {

       
    },

    processGAS: function(data) {
        this.today = data.Today;
        this.gas = data;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getGAS();
        }, this.config.updateInterval);

        this.getGAS(this.config.initialLoadDelay);
    },

    getGAS: function() {
        this.sendSocketNotification('GET_GAS');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GAS_RESULT") {
            this.processGAS(payload);
            this.updateDom();
        }
    }

});