# Bubble Table with example #

![image](https://user-images.githubusercontent.com/1254764/54773252-8f91d480-4bdf-11e9-82f3-afe830416e02.png)

`bubbleTable.js` contains the source code for creating a bubble table for data read in from a json file.

The bubbleTable columns are labelled by year, rows are labelled by item id. The bubble radius is proportional to the square root of the value (`d3.scaleSqrt()`), and the value is displayed next to each bubble.

Follow the example in `demo.js`.  The `settings` define the callbacks needed to provide `bubbleTable.js` with the data in the format it is expecting. In this example, we read the json file `data/totalCommodities.json` which contains the tonnage shipped by rail across Canada for 5 commodities (total tonnage from all origins and for all destinations). Data source: Statistics Canada [Table 23-10-0062-01](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=2310006201).

The input json file is formatted in `settings.filterData` to have the structure expected by `bubbleTable.js`: an Array of objects, one for each item in the input json file, containing 2 elements: an `id`, set to the item name, and a `dataPoints` array of a set of objects each containing `year` and `value` pairs.

Data returned by `settings.filterData` for this example:

```
[
​
	{
		​​id: "ores",
	  dataPoints: [
	   		{ year: "2010", value: 36324704 }
	   		{ year: "2011", value: 40588184 }
	   		...
	   		{ year: "2016", value:  38204591 }
	   ]
	​}

	...
	{
		​​id: "woodpulp",
	  dataPoints: [
	   		{ year: "2010", value: 8454737 }
	   		{ year: "2011", value: 8727345 }
	   		...
	   		{ year: "2016", value: 8157909 }
	   ]
	}
]
```
