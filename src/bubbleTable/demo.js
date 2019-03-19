/* globals bubbleTable */
var table = d3.select(".table.data")
    .append("svg")
    .attr("id", "demo");

i18n.load(["i18n"], function() {
  var settings = {
    url: "data/totalCommodities.json",
    aspectRatio: 19 / 5,
    filterData: function(data) {
      var obj = {};
      var yearList;
      var lastYearArray = [];

      data.map(function(d) {
        var key = Object.keys(d)[0];
        if (!yearList) {
          yearList = Object.keys(d[key]);
        }
        var lastYear = yearList[yearList.length - 1];

        // set key once
        if (!obj[key]) {
          obj[key] = [];
        }

        // Store lastYear value for each commodity for sorting later
        lastYearArray.push({
          key: key,
          lastYearValue: d[key][lastYear].All
        });

      // push year-value pairs for each year into obj
        for (var idx = 0; idx < yearList.length; idx++) {
          obj[key].push({
            year: Object.keys(d[key])[idx],
            value: Object.values(d[key])[idx].All
          });
        }
      });

      // Sort by value in last year (descending order)
      lastYearArray.sort(function(a, b) {
        return a.lastYearValue < b.lastYearValue;
      });

      // Define array of ordered commodities
      var orderedComm = lastYearArray.map(function(item) {return item.key;});

      // Define mapping between old order and new order (to be used in final obj return)
      var count = 0;
      var mapping = [];
      Object.keys(obj).map(function(k) {
        var thisComm = orderedComm[count];
        // mapping.push({[k]: thisComm}); // ES6
        var storageObj = {};
        storageObj[k] = thisComm;
        mapping.push(storageObj);
        count++;
      });

      // Re-arrange obj so that each element object has an id and
      // a dataPoints array containing the year-value pairs created above.
      // Note that object is ordered according to sorted commodity list.
      var match;
      return Object.keys(obj).map(function(k) {
        mapping.map(function(d) {
          if (Object.keys(d)[0] === k) {
            match = Object.values(d)[0];
            return match;
          }
        });
        return {
          id: match,
          dataPoints: obj[match]
        };
      });
    },
    x: {
      getValue: function(d) {
        return d.year;
      },
      getText: function(d) {
        return d.year;
      }
    },
    r: {
      inverselyProportional: false, // if true, bubble size decreases with value
      getValue: function(d) {
        return d.value;
      }
    },
    z: { // Object { id: "total", dataPoints: (21) […] }
      getId: function(d) {
        return d.id;
      },
      getText: function(d) {
        return i18next.t(d.id, {ns: "bubbleTable"});
      },
      getDataPoints: function(d) {
        return d.dataPoints;
      },
    },
    width: 800
  };

  bubbleTable(table, settings);
});
