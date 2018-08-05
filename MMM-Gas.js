/* Magic Mirror
 * Module: MMM-Gas
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("MMM-Gas",{

    defaults: {
        updateInterval: 24 * 60 * 1000,
        showAddress: true,
        zip: "14904"
    },

    getStyles: function() {
        return [ "MMM-Gas.css" ]
    },

    
    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.loaded = false;
        this.sendSocketNotification('CONFIG', this.config);
        this.getGAS();
    },

    scheduleCarousel: function() {
        console.log("Scheduling items");
        this.updateDom(this.config.animationSpeed);
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        if(!this.loaded) {
            wrapper.innerHTML = this.translate("LOADING");
            return wrapper;
        }

        var table = document.createElement("table");
        table.classList.add("small");

        var thead = document.createElement("thead");
        var headerRow = document.createElement("tr");

        var nameHeader = document.createElement("th");
        nameHeader.innerHTML = "Name";
        headerRow.appendChild(nameHeader);

        var ppgHeader = document.createElement("th");
        ppgHeader.innerHTML = "PPG";
        headerRow.appendChild(ppgHeader);

        var distHeader = document.createElement("th");
        distHeader.innerHTML = "Distance";
        headerRow.appendChild(distHeader);

        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = document.createElement("tbody");

        for(var i = 0; i < this.gas.length; i++) {
            var row = document.createElement("tr");

            var name = document.createElement("td");
            name.innerHTML = this.gas[i].name;
            row.appendChild(name);

            var ppg = document.createElement("td");
            ppg.innerHTML = this.gas[i].ppg;
            row.appendChild(ppg);

            var dist = document.createElement("td");
            dist.innerHTML = this.gas[i].dist;
            row.appendChild(dist);

            tbody.appendChild(row);

            if (this.config.showAddress) {
                var addressRow = document.createElement("tr");
                addressRow.classList.add("xsmall");

                var address = document.createElement("td");
                address.setAttribute("colspan", 3);
                address.innerHTML = this.gas[i].address;
                addressRow.appendChild(address);

                tbody.appendChild(addressRow);
            }
        }

        table.appendChild(tbody);
        wrapper.appendChild(table);

        return wrapper;
    },

    processGAS: function(data) {
        this.gas = data;
        this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getGAS();
        }, this.config.updateInterval);

        this.getGAS();
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
