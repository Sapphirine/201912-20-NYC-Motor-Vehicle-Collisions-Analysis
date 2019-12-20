function dashboard(id, fData) {
    // Define the color to change if your mouse move on the bar
    var barColor = '#67cc63';

    // Choose color for each word:
    function segColor(c) {
        cmap = {year2014: "#4753CC", year2015: "#828499", year2016: "#73C9FF", year2017: "#CC6E47", year2018: '#FFD4B3'};
        return cmap[c];
    }

    // compute total for each state.
    fData.forEach(function (d) {
        d.total = d.count.year2014+d.count.year2015+d.count.year2016+d.count.year2017+d.count.year2018; /* TO FINISH */
    });
    // function to handle histogram.
    function histoGram(fD) {
        var hG = {}, hGDim = {t: 60, r: 30, b: 30, l: 0};
        hGDim.w = 900 - hGDim.l - hGDim.r;
        hGDim.h = 500 - hGDim.t - hGDim.b;

        //create svg for histogram.
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
            .domain(fD.map(function (d) {
                return d[0];
            }));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // Create function for y-axis map.
        var y = d3.scale.linear().range([hGDim.h, 0])
            .domain([0, d3.max(fD, function (d) {
                return d[1];
            })]);

        // Create bars for histogram to contain rectangles and count labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
            .append("g").attr("class", "bar");

        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) {return x(d[0]);})
            .attr("y", function(d) {return y(d[1])})
            .attr("width", x.rangeBand())
            .attr("height", function (d) {
                return hGDim.h - y(d[1]);
            })
            .attr('fill', barColor)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        //Create the frequency labels ABOVfE the rectangles.
        bars.append("text").text(function (d) {
            return d3.format(",")(d[1]);
        })
            .attr("x", function (d) {
                return /* TO FINISH */x(d[0]) + x.rangeBand() / 2;
            })
            .attr("y", function(d) {return y(d[1])-5}/* TO FINISH */)
            .attr("font-size", "11px")
            .attr("text-anchor", "middle");

        function mouseover(d) {  // utility function to be called on mouseover.
            // filter for selected state.
            var st = fData.filter(function (s) {
                    return s.Time == d[0];
                })[0],
                nD = d3.keys(st.count).map(function (s) {
                    return {type: s, count: st.count[s]};
                });

            // call update functions of pie-chart and legend.
            // pC.update(nD);
            leg.update(nD);
        }

        function mouseout(d) {    // utility function to be called on mouseout.
            // reset the pie-chart and legend.
            // pC.update(tF);
            leg.update(tF);
        }

        // create function to update the bars. This will be used by pie-chart.
        hG.update = function (nD, color) {
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function (d) {
                return d[1];
            })]);

            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);

            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", /* TO FINISH */function(d) {return y(d[1])})
                .attr("height", function (d) {
                    return hGDim.h - y(d[1]);
                })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function (d) {
                    return d3.format(",")(d[1])
                })
                .attr("y", function (d) {
                    return y(d[1]) - 5;
                });
        };
        return hG;
    }

    // function to handle pieChart.
//    function pieChart(pD) {
//        var pC = {}, pieDim = {w: 300, h: 300};
//        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
//
//        // create svg for pie chart.
//        var piesvg = d3.select(id).append("svg")
//            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
//            .attr("transform", "translate(" + pieDim.w / 2 + "," + pieDim.h / 2 + ")");
//
//        // create function to draw the arcs of the pie slices.
//        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);
//
//        // create a function to compute the pie slice angles.
//        var pie = d3.layout.pie().sort(null).value(function (d) {
//            return d.count;
//        });
//
//        // Draw the pie slices.
//        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
//            .each(function (d) {
//                this._current = d;
//            })
//            .style("fill", function (d) {
//                return segColor(d.data.type);
//            })
//            .on("mouseover", mouseover).on("mouseout", mouseout);
//
//        // create function to update pie-chart. This will be used by histogram.
//        pC.update = function (nD) {
//            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
//                .attrTween("d", arcTween);
//        };
//
//        // Utility function to be called on mouseover a pie slice.
//        function mouseover(d) {
//            // call the update function of histogram with new data.
//            hG.update(fData.map(function (v) {
//                return [v.Time, v.count[d.data.type]];
//            }), segColor(d.data.type));
//        }
//
//        //Utility function to be called on mouseout a pie slice.
//        function mouseout(d) {
//            // call the update function of histogram with all data.
//            hG.update(fData.map(function (v) {
//                return [v.Time, v.total];
//            }), barColor);
//        }
//
//        // Animating the pie-slice requiring a custom function which specifies
//        // how the intermediate paths should be drawn.
//        function arcTween(a) {
//            var i = d3.interpolate(this._current, a);
//            this._current = i(0);
//            return function (t) {
//                return arc(i(t));
//            };
//        }
//
//        return pC;
//    }

//     function to handle legend.
    function legend(lD) {
        var leg = {};

        // create table for legend.
        var legend = d3.select(id).append("table").attr('class', 'legend');

        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '20').attr("height", '20').append("rect")
            .attr("width", '20').attr("height", '20')
            .attr("fill", function (d) {
                return segColor(d.type);
            })
            .on("mouseover", mouseover)                  //modified
            .on("mouseout", mouseout);

        // create the second column for each segment.
        tr.append("td").text(function (d) {
            return d.type;
        });

        // create the third column for each segment.
//        tr.append("td").attr("class", 'legendFreq')
//            .text(function (d) {
//                return d3.format(",")(d.count);
//            });
//
//        // create the fourth column for each segment.
//        tr.append("td").attr("class", 'legendPerc')
//            .text(function (d) {
//                return getLegend(d, lD);
//            });

        // Utility function to be used to update the legend.
        leg.update = function (nD) {
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(function (d) {
                return d3.format(",")(d.count);
            });

            // update the percentage column.
            l.select(".legendPerc").text(function (d) {
                return getLegend(d, nD);
            });
        };

        function mouseover(d) {
            // call the update function of histogram with new data.
            hG.update(fData.map(function (v) {
                return [v.Time, v.count[d.type]];
            }), segColor(d.type));
        }

        //Utility function to be called on mouseout a pie slice.
        function mouseout(d) {
            // call the update function of histogram with all data.
            hG.update(fData.map(function (v) {
                return [v.Time, v.total];
            }), barColor);
        }


        function getLegend(d, aD) { // Utility function to compute percentage.
            return d3.format("%")(d.count / d3.sum(aD.map(function (v) {
                return v.count;
            })));
        }

        return leg;
    }









    function pieColor(c) {
        piemap = {a: "#bc45f7", b: "#4753CC", c: "#28de83", d: "#45fc28", e: '#adff8c', f: '#d7ff80', g:'#edf035', h:'#f5c425', i:'#ff6600', j:'#f24a30'};
        return piemap[c];
    }

    function piechart(){
        var width = 1000
            height = 600
            margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
        var svg = d3.select(id)
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + (width-400) / 2 + "," + height / 2 + ")");

// Create dummy data
        var data = {a: 26702, b: 16095, c:4726, d:4525, e:2940, f:2627, g:2138, h:2042, i:2024, j:1821}
        //var data = {'Driver Inattention/Distraction'}

// set the color scale
//        var color = d3.scaleOrdinal()
//                        .domain(data)
//                        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

// Compute the position of each group on the pie:
        var pie = d3.layout.pie()
                .value(function(d) {return d.value; })
        var data_ready = pie(d3.entries(data))
        var arc = d3.svg.arc().innerRadius(0).outerRadius(radius)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg.selectAll('path')
          .data(data_ready)
          .enter()
          .append('path')
          .attr('d', arc)
          .attr("fill", function (d) {
                return pieColor(d.data.key);
            })
//          .attr('fill', function(d){ return(color(d.data.key)) })
          .attr("stroke", "black")
          .style("stroke-width", "2px")
          .style("opacity", 0.7)

        svg
        .selectAll('mySlices')
          .data(data_ready)
          .enter()
          .append('text')
          .text(function(d){return d.data.key;})
          .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")";  })
          .style("text-anchor", "middle")
          .style("font-size", 17)

        svg.append("circle").attr("cx",350).attr("cy",-150).attr("r", 6).style("fill", "#bc45f7")
        svg.append("circle").attr("cx",350).attr("cy",-120).attr("r", 6).style("fill", "#4753CC")
        svg.append("circle").attr("cx",350).attr("cy", -90).attr("r", 6).style("fill", "#28de83")
        svg.append("circle").attr("cx",350).attr("cy",-60).attr("r", 6).style("fill", "#45fc28")
        svg.append("circle").attr("cx",350).attr("cy",-30).attr("r", 6).style("fill", "#adff8c")
        svg.append("circle").attr("cx",350).attr("cy",0).attr("r", 6).style("fill", "#d7ff80")
        svg.append("circle").attr("cx",350).attr("cy",30).attr("r", 6).style("fill", "#edf035")
        svg.append("circle").attr("cx",350).attr("cy", 60).attr("r", 6).style("fill", "#f5c425")
        svg.append("circle").attr("cx",350).attr("cy",90).attr("r", 6).style("fill", "#ff6600")
        svg.append("circle").attr("cx",350).attr("cy",120).attr("r", 6).style("fill", "#f24a30")
        svg.append("text").attr("x", 370).attr("y", -150).text("a: Driver Inattention/Distraction").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 370).attr("y", -120).text("b: Failure to Yield Right-of-Way").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 370).attr("y", -90).text("c: Following Too Closely").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 370).attr("y", -60).text("d: Traffic Control Disregarded").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 370).attr("y", -30).text("e: Backing Unsafely").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 370).attr("y", 0).text("f: Fatigued/Drowsy").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 370).attr("y", 30).text("g: Turning Improperly").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 370).attr("y", 60).text("h: Alcohol Involvement").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 370).attr("y", 90).text("i: Pedestrian/Bicyclist Error/Confusion").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", 370).attr("y", 120).text("j:Unsafe Speed").style("font-size", "15px").attr("alignment-baseline","middle")


     }
















    // calculate total count by segment for all state.
    var tF = ['year2014', 'year2015', 'year2016', 'year2017', 'year2018'].map(function (d) {
        return {
            type: d, count: d3.sum(fData.map(function (t) {
                return t.count[d]/* TO FINISH */;
            }))
        };
    });

    // calculate total count by state for all segment.
    var sF = fData.map(function (d) {
        return [d.Time, d.total];
    });

    var hG = histoGram(sF), // create the histogram.

//        pC = pieChart(tF), // create the pie-chart.
        leg = legend(tF),
        p = piechart();  // create the legend.

}


    function doublebar(id) {
        var margin = {top: 10, right: 30, bottom: 30, left: 250},
            width = 900 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(id)
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        // get the data
        d3.csv("https://raw.githubusercontent.com/ChaoxunGu/C/master/threecount.csv", function(data) {
          // X axis: scale and draw:
            console.log(data);
            var x = d3.scaleLinear()
              .domain([-1,24])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
              .range([0, width]);
            svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

            console.log(x)
          // set the parameters for the histogram
            var histogram = d3.histogram()
              .value(function(d) { return +d.value; })   // I need to give the vector of value
              .domain(x.domain())  // then the domain of the graphic
              .thresholds(x.ticks(40)); // then the numbers of bins

          // And apply twice this function to data to get the bins.
          var bins1 = histogram(data.filter( function(d){  return d.type === "Harlem"} ));
          var bins2 = histogram(data.filter( function(d){return d.type === "HHP"} ));
          var bins3 = histogram(data.filter( function(d){return d.type === "Ave3"} ));

          // Y axis: scale and draw:
          var y = d3.scaleLinear()
              .range([height, 0]);
              y.domain([0, d3.max(bins2, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
          svg.append("g")
              .call(d3.axisLeft(y));

          // append the bars for series 1
          svg.selectAll("rect")
              .data(bins1)
              .enter()
              .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", "#000000")
                .style("opacity", 0.7)

          // append the bars for series 2
          svg.selectAll("rect2")
              .data(bins2)
              .enter()
              .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", "#f5c425")
                .style("opacity", 0.6)

          svg.selectAll("rect3")
              .data(bins3)
              .enter()
              .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", "#28de83")
                .style("opacity", 0.4)

          // Handmade legend
          svg.append("circle").attr("cx",50).attr("cy",20).attr("r", 6).style("fill", "#000000")
          svg.append("circle").attr("cx",50).attr("cy",50).attr("r", 6).style("fill", "#f5c425")
          svg.append("circle").attr("cx",50).attr("cy",80).attr("r", 6).style("fill", "#28de83")
          svg.append("text").attr("x", 70).attr("y", 20).text("Harlem River Driveway").style("font-size", "15px").attr("alignment-baseline","middle")
          svg.append("text").attr("x", 70).attr("y", 50).text("Henry Hudson Parkway").style("font-size", "15px").attr("alignment-baseline","middle")
          svg.append("text").attr("x", 70).attr("y", 80).text("Avenue 3").style("font-size", "15px").attr("alignment-baseline","middle")

        });



}
