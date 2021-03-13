/* Magic Mirror
 * Module: MMM-Gas
 *
 *
 * Cowboysdude
 */
Module.register("MMM-Gas", {

    defaults: {
        updateInterval: 60 * 1000,
        zip: "14904",
        items: 10,
        typeGas: "regular", //premium, mid-grade, diesel, or blank for regular
        sortBy: "distance", //distance, price
        distance: true
    },

    getStyles: function() {
        if (this.config.distance != false) {
            return ["MMM-Gas.css"]
        } else {
            return ["MMM-Gas1.css"]
        }
    },
    getScripts: function() {
        return ["moment.js"]
    },

    // Define start sequence.
    start: function() {
        this.sendSocketNotification('CONFIG', this.config);
        Log.info("Starting module: " + this.name);
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


        if (this.config.distance != false) {
            var bjumpy = document.createElement("th");
            bjumpy.setAttribute("style", "text-align:center");
            bjumpy.classList.add("xsmall");
            bjumpy.innerHTML = "Distance";
            xFCRow.appendChild(bjumpy);
            weatherTable.appendChild(xFCRow);
        }

        var gas = this.gas;


        for (i = 0; i < Math.min(this.gas.length, this.config.items); i++) {
            var gas = this.gas[i];

            var name = gas.name.replace(/\#.*/, '');
            var store = name.replace(/\(.*/, '');
            var storeslist = store.replace(/^[^.]+\./, "");
            var ans = store.replace(/\Convenience.*/, 'Conv.');
            var ppg = gas.ppg.slice(1, 5);
            var dist = gas.dist;
            var up = gas.updated;

            var TDrow = document.createElement("tr");
            TDrow.classList.add("xsmall", "bright");

            var td2 = document.createElement("td");
            td2.classList.add("align", "CellWithComment", "yellow");
            td2.innerHTML = storeslist + "<span class='CellComment'><u><font color=#F0F8FF><b>" + storeslist + "</font></b></u><BR><BR>" + gas.address + "</span>";
            TDrow.appendChild(td2);
            weatherTable.appendChild(TDrow);

            var td3 = document.createElement("td");
            td3.innerHTML = "$" + ppg;
            TDrow.appendChild(td3);
            weatherTable.appendChild(TDrow);

            if (this.config.distance != false) {
                var td5 = document.createElement("td");
                td5.innerHTML = dist;
                TDrow.appendChild(td5);
                weatherTable.appendChild(TDrow);
            }

            top.appendChild(weatherTable);
            wrapper.appendChild(top);
        }

        return wrapper;

    },

    processGAS: function(data) {
        this.today = data.Today;
        this.gas = data;
        this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getGAS();
            console.log("Getting Gas Prices");
        }, this.config.updateInterval);
        this.getGAS();
    },

    getGAS: function() {
        console.log("GO get it!");
        console.log(this.url);
        this.sendSocketNotification('GET_GAS');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GAS_RESULT") {
            console.log("RESULTS");
            this.processGAS(payload);
        }
        this.updateDom();
    }

});
