# MMM-GAS

**THIS MODULE WILL ONLY WORK IN THE USA.  It was made specifically for this.**
There is a module for overseas called MMM-Fuel :)

It's located here:
https://github.com/fewieden/MMM-Fuel

## Examples

![](Captureme.PNG) 

## Your terminal installation instructions

* `git clone https://github.com/cowboysdude/MMM-Gas` into the `~/MagicMirror/modules` directory.`

**Go to MagicMirror/modules/MMM-Gas and run NPM INSTALL**

## Config.js entry and options
       {
        module: 'MMM-Gas',
        position: 'top_left',
        config: { 
		zip : "14904",
		typeGas: "mid-grade", //can be "mid-grade", "premium", or "diesel".  Leave blank for regular gas prices
		sortBy: "price",	//can be "distance" or "price"
		items: 10	//number of gas stations to display
	     }
       },

**NO api key needed, just your zipcode!!**

Here's a link to a video to show the address via mouseover effect

 
[![Address via mouseover](https://i9.ytimg.com/vi/D8mITcVncps/default.jpg?sqp=CISPrtsF&rs=AOn4CLBJNhPf5b6N6L0e_MgPnhXeiB8t_g)](https://www.youtube.com/watch?v=D8mITcVncps)


