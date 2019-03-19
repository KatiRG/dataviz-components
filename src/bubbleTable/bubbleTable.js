(function(extend) {
var defaults = {
  margin: {
    top: 30,
    right: 0,
    bottom: 0,
    left: 60
  },
  aspectRatio: 16 / 9,
  x: {
    getDomain: function(flatData) {
      if (!this.x.type || this.x.type === "ordinal") {
        return d3.set(flatData, this.x.getValue.bind(this)).values();
      }
      return d3.extent(flatData, this.x.getValue.bind(this));
    },
    getRange: function(d, domain) {
      if (!this.x.type || this.x.type === "ordinal") {
        var arr = [];
        for (var x = 0; x < domain.length; x++) {
          arr.push(x * this.innerWidth / domain.length);
        }
        return arr;
      }
      return [0, this.innerWidth];
    },
    getDeltaX: function(flatData) {
      if (!this.x.type || this.x.type === "ordinal") {
        var thisList = d3.set(flatData, this.x.getValue.bind(this)).values();
        return thisList[1];
      }
    }
  },
  z: {
    getDomain: function(data) {
      return [0, data.length];
    },
    getRange: function() {
      return [0, this.innerHeight];
    },
    getValue: function(d, i) {
      return i;
    }
  },
  r: {
    getDomain: function(flatData) {
      return [
        d3.min(flatData, this.r.getValue.bind(this)),
        d3.max(flatData, this.r.getValue.bind(this))
      ];
    },
    getRange: function(flatData) {
      var min = d3.min(flatData, this.r.getValue.bind(this));
      var maxRadius = d3.min([this.x.delta, this.z.delta]) / 2 * .95;
      var range = [min === 0 ? 0 : maxRadius * .2, maxRadius];
      if (this.r.inverselyProportional === true) {
        return range.reverse();
      }
      return range;
    }
  },
  width: 990
};

this.bubbleTable = function(svg, settings, data) {
  var mergedSettings = extend(true, {}, defaults, settings);
  var outerWidth = mergedSettings.width;
  var outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio);
  var innerWidth = mergedSettings.innerWidth = outerWidth - mergedSettings.margin.left - mergedSettings.margin.right;
  var chartInner = svg.select("g.margin-offset");
  var dataLayer = chartInner.select(".data");
  var xAxisObj = chartInner.select(".x.axis");

  mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom;

  var formatNumber = d3.format(".2s");
  var format = function(d) {
    return formatNumber(d);
  };
  var shiftColTextX = 30;

  var draw = function() {
    var sett = this.settings;
    var filteredData = (sett.filterData && typeof sett.filterData === "function") ?
      sett.filterData.call(sett, data) : data;
    // var flatData = [].concat(...filteredData.map(function(d) {
    //   return sett.z.getDataPoints.call(sett, d);
    // }));
    var _ref;
    var flatData = (_ref = []).concat.apply(_ref, filteredData.map(function (d) {
      return sett.z.getDataPoints.call(sett, d);
    }));
    var xScale = (function() {
      switch (sett.x.type) {
      case "linear":
        return d3.scaleLinear();
      case "time":
        return d3.scavarime();
      default:
        return d3.scaleOrdinal();
      }
    })();

    var xDomain = sett.x.getDomain.call(sett, flatData);

    // Mapping for x-coord of table based on year
    x = rtnObj.x = xScale
        .domain(xDomain)
        .range(sett.x.getRange.call(sett, flatData, xDomain));

    // Mapping for z-coord of table based on id
    z = rtnObj.z = d3.scaleLinear()
        .domain(sett.z.getDomain.call(sett, filteredData))
        .range(sett.z.getRange.call(sett, filteredData));

    // Mapping for circle radius based on value
    r = rtnObj.r = d3.scaleSqrt().domain(sett.r.getDomain.call(sett, flatData));

    var deltaX = sett.x.delta = x(sett.x.getDeltaX.call(sett, flatData));
    var deltaZ = sett.z.delta = z(1); // because z is always a row number

    r.range(sett.r.getRange.call(sett, flatData));

    var bubbvarext = (sett.r.getText ? sett.r.getText : sett.r.getValue).bind(sett);

    if (dataLayer.empty()) {
      dataLayer = chartInner.append("g")
          .attr("class", "data");
    }

    var bubbleGroups = dataLayer.selectAll(".bubble-group")
        .data(filteredData, sett.z.getId.bind(sett));

    bubbleGroups
        .enter()
        .append("g")
        .attr("id", sett.z.getId.bind(sett))
        .attr("class", sett.z.getId.bind(sett))
        .attr("transform", function() {
          var zVal = z(sett.z.getValue.apply(this, arguments)) + deltaZ / 2;
          return "translate(0, " + zVal + ")";
        })
        .each(function() { // d is each z
          var group = d3.select(this);

          var bubbles = group.selectAll(".bubble")
              .data(sett.z.getDataPoints.apply(this, arguments));

          // Create bubble g node and attach data
          var newBubbles = bubbles
              .enter()
              .append("g")
              .attr("class", "bubble")
              .attr("transform", function() { // d is each point
                var xVal = x(sett.x.getValue.apply(this, arguments)) + deltaX / 2;
                return "translate(" + xVal + ", 0)";
              });

          // Append circles to bubble g node
          newBubbles
              .append("circle")
              .attr("r", function() {
                var rVal = r(sett.r.getValue.apply(sett, arguments));
                return rVal;
              });

          // Append bubble text to bubble g node
          newBubbles
              .append("text")
              .attr("dx", function() {
                return 0 + shiftColTextX;
              })
              .attr("dy", function() {
                return 0;
              })
              .attr("class", "bubble-text")
              .text(function(d) {
                return format(bubbvarext(d));
              })
              .attr("dominant-baseline", "central");

          // Label rows by z.id
          group
              .append("text")
              .attr("dx", function() {
                return -1*mergedSettings.margin.left;
              })
              .attr("dy", 0)
              .attr("class", "bubble-row-text")
              .text(function() {
                return sett.z.getText.apply(this, arguments);
              })
              .attr("dominant-baseline", "central");
        });

    // Add col labels
    if (xAxisObj.empty()) {
      xAxisObj = chartInner.append("g")
          .attr("transform", "translate(" + (shiftColTextX + deltaX / 2) + ", 0)")
          .attr("class", "bubble-col");

      xAxisObj
          .attr("x", innerWidth)
          .attr("dy", "-0.5em")
          .attr("text-anchor", "end")
          .text(sett.x.label);
    } else {
      xAxisObj.select("text").text(settings.x.label);
    }
    xAxisObj.call(
        d3.axisTop(x)
            .tickSizeOuter(0)
    );


    bubbleGroups
        .exit()
        .remove();
  };
  var clear = function() {
    dataLayer.remove();
  };

  var x;
  var z;
  var r;

  var rtnObj = {
    settings: mergedSettings,
    clear: clear,
    svg: svg
  };

  svg
      .attr("viewBox", "0 0 " + outerWidth + " " + outerHeight)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("role", "img")
      .attr("rank-label", mergedSettings.altText);

  if (chartInner.empty()) {
    chartInner = svg.append("g")
        .attr("class", "margin-offset")
        .attr("transform", "translate(" + mergedSettings.margin.left + "," + mergedSettings.margin.top + ")");
  }

  var process = function() {
    draw.apply(rtnObj);
    d3.stcExt.addIEShim(svg, outerHeight, outerWidth);
  };

  if (data === undefined) {
    d3.json(mergedSettings.url, function(error, xhr) {
      data = xhr;
      process();
    });
  } else {
    process();
  }

  return rtnObj;
};

})(jQuery.extend, jQuery);
