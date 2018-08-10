/* Magic Mirror
 * Module: MMM-Gas
 *
 * 
 * Cowboysdude
 */
Module.register("MMM-Gas", {

    defaults: {
        updateInterval: 12 * 60 * 60 * 1000,
        zip: "14904",
        items: "10"
    },

    getStyles: function() {
        return ["MMM-Gas.css"]
    },
	getScripts: function(){
		return ["moment.js"]
	},

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);
        this.loaded = true;
        this.getGAS();
        this.gas = {};
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");

        var info = this.info;
        var today = new Date();
        var date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();

        var top = document.createElement("div");

        var weatherTable = document.createElement("table");
        weatherTable.classList.add("table");

        var xFCRow = document.createElement("tr");
        var xjumpy = document.createElement("th");
        xjumpy.setAttribute("style", "text-align:center");
        xjumpy.classList.add("xsmall");
        xjumpy.innerHTML = "Station";
        xFCRow.appendChild(xjumpy);
        weatherTable.appendChild(xFCRow);

        var ajumpy = document.createElement("th");
        ajumpy.setAttribute("style", "text-align:center");
        ajumpy.classList.add("xsmall");
        ajumpy.innerHTML = "Price";
        xFCRow.appendChild(ajumpy);
        weatherTable.appendChild(xFCRow);



        var bjumpy = document.createElement("th");
        bjumpy.setAttribute("style", "text-align:center");
        bjumpy.classList.add("xsmall");
        bjumpy.innerHTML = "Distance";
        xFCRow.appendChild(bjumpy);
        weatherTable.appendChild(xFCRow);


        var gas = this.gas;


        for (i = 0; i < this.gas.length; i++) {
            var gas = this.gas[i];

            var name = gas.name.replace(/\#.*/, '');
            var store = name.replace(/\(.*/, '');
            var storeslist = store.replace(/^[^.]+\./, "");
            var ans = store.replace(/\Convenience.*/, 'Conv.');
            var ppg = gas.ppg.slice(1, 5);
            var dist = gas.dist;


            var TDrow = document.createElement("tr");
            TDrow.classList.add("xsmall", "bright");

            var td2 = document.createElement("td");
            td2.classList.add("align", "CellWithComment","yellow");
            td2.innerHTML = storeslist + "<span class='CellComment'><u><font color=#F0F8FF><b>" + storeslist + "</font></b></u><BR><BR>" + gas.address + "</span>";
            TDrow.appendChild(td2);
            weatherTable.appendChild(TDrow);

            var td3 = document.createElement("td");
            td3.innerHTML = "$" + ppg;
            TDrow.appendChild(td3);
            weatherTable.appendChild(TDrow);

            var td5 = document.createElement("td");
            td5.innerHTML = dist;
            TDrow.appendChild(td5);
            weatherTable.appendChild(TDrow);

            top.appendChild(weatherTable);
            wrapper.appendChild(top);
			}
			
            var doutput = moment().format("M.D.YYYY");
            var tinput = document.lastModified;
            var toutput = (moment(tinput.substring(10, 16), 'HH:mm').format('h:mm a'));
		    var x = this.config.updateInterval;
		    var y = moment.utc(x).format('mm');
        
		var mod = document.createElement("div");
        mod.classList.add("xxsmall","green");
		mod.setAttribute('style','text-align: center;');
        mod.innerHTML = "<font color=yellow>[</font>Updated: " +  doutput + " @ "+  toutput+"<font color=yellow>]</font>";
        wrapper.appendChild(mod);
			
       
        return wrapper;

    },

    processGAS: function(data) {
        this.today = data.Today;
        this.gas = data;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getGAS();
			console.log("Updating Gas Prices");
        }, this.config.updateInterval);

        this.getGAS(this.config.initialLoadDelay);
    },

    getGAS: function() {
        this.sendSocketNotification('GET_GAS');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GAS_RESULT") {
            this.processGAS(payload);
        }
        this.updateDom();
    }

});
