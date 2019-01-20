# Line chart with example #

`Line.js` contains the reusable source code for creating a line chart for data read in from a json file.  

Follow the example in `demo.js`.  The `settings` define the callbacks needed to provide `line.js` with the data in the format it is expecting. In this example, we read the json file `data/un_worldpop.json`.  

The most important thing is to format the input json file in `filterData` so that an object is returned with the appropriate structure. This object has _n_ elements, where _n_ is the number of lines to plot. In this example, `un_worldpop.json` has data for _n_ = 7 lines ("world", "moredev", "lessdev", "lessdev_nochina", "highincome",  middleincome", and "lowincome").  

Each element _n_ contains an `id` corresponding to the name of the line, and a `data` array of _m_ objects containing the (x, y) data for the _nth_ line, where _m_ is the number of points to plot. In this example, (x, y) correspond to (year, pop) and there are _m_ = 65 years. So `filterData` returns the following object:  


```
Object {  
​
	0: {  
	​​
	   data: [   
	   		0: Object { year: 1950, pop: 2525149.312 }  
	   		1: Object { year: 1951, pop: 2571867.515 }  
	   		...
	   		64: Object { year: 2015, pop: 7349472.099 }  

	   ]  
	   id: "world"  
	​​
	​}  
	1: {  
		​​data: [   
		   		0: Object { year: 1950, pop: 812988.79 }  
		   		1: Object { year: 1951, pop: 822320.464 }  
		   		...  
		   		64: Object { year: 2015, pop: 1251351.086 }  

		   ]  
		   id: "moredev"  
		​​
	}  
	...
	6: {
		​​data: [ 
		   		0: Object { year: 1950, pop: 130103.438 }  
		   		1: Object { year: 1951, pop: 132018.216 }  
		   		...
		   		64: Object { year: 2015, pop: 638734.914 }  

		   ]  
		   id: "lowincome"  
		​​
	}  
}
```

Callbacks are then defined in the `x`, `y` and `z` parts of `settings` that extract data from the object returned by `filterData`.  

Settings `x` handles everything related to the x-axis data, and `y`, handles the y-values of the data. The `z` mostly handles things related to line labels for setting classes and ids, but it also has a `getDataPoints` call back which is used in `line.js` to flatten the data into one long array to calculate, for example, the extents of domains and ranges.