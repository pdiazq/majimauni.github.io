function drawGraphic() {

    // Set margins and graphic canvas 
    var margin = {
            top: 10,
           // right: 120,
           right: 120,
            bottom: 50,
            left: 100
        },
        width = 680 - margin.left - margin.right,
        height = 280 - margin.top - margin.bottom;

    // Parse and formate time 
    var parseDate = d3.time.format("%Y").parse,
        formatYear = d3.time.format("%Y");

    var y0 = d3.scale.ordinal()
        .rangeRoundBands([height / 1, 0]);

    var y1 = d3.scale.linear();

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .05, 2);

    // Set x axis 
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(formatYear);

    var nest = d3.nest()
        .key(function(d) {
            return d.group;
        });

    var stack = d3.layout.stack()
        .values(function(d) {
            return d.values;
        })
        .x(function(d) {
            return d.date;
        })
        .y(function(d) {
            return d.value;
        })
        .out(function(d, y0) {
            d.valueOffset = y0;
        });

    var svg = d3.select("#graphic").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "graphic_svg")
        .call(responsivefy)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var color = d3.scale.ordinal().range(["#6498a4", "#105A77", "#e59793", "#942e48"]);

    // Load data 
    d3.csv("ordenamiento.csv", function(error, data) {
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.value = +d.value;
        });

        d3.selectAll("input").on("change", change);

        var timeout = setTimeout(function() {
            d3.select("input[value=\"stacked\"]").property("checked", true).each(change);
        }, 2000);

        function change() {
            clearTimeout(timeout);
            var svg = d3.select("svg");
            svg.selectAll(".group").remove();
            if (this.value === "multiples") {
                createData(true);
                transitionMultiples();
            } else {
                createData(false);
                transitionStacked();
            }
        }

        function transitionMultiples() {
            var t = svg.transition().duration(750),
                g = t.selectAll(".group").attr("transform", function(d) {
                    return "translate(0," + y0(d.key) + ")";
                });
            g.selectAll("rect").attr("y", function(d) {
                return y1(d.value);
            });
            g.select(".group-label").attr("y", function(d) {
                return y1(d.values[0].value / 2);
            })
            d3.selectAll(".number").style("display", "block")
            d3.selectAll(".numbers").style("display", "none")
        }

        function transitionStacked() {
            var t = svg.transition().duration(750),
                g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
            g.selectAll("rect").attr("y", function(d) {
                return y1(d.value + d.valueOffset);
            });
            g.select(".group-label").attr("y", function(d) {
                return y1(d.values[0].value / 2 + d.values[0].valueOffset);
            })
            d3.selectAll(".numbers").style("display", "block")
            d3.selectAll(".number").style("display", "none")

        }

        function createData(showLabels) {
            var dataByGroup = nest.entries(data);

            stack(dataByGroup);
            x.domain(dataByGroup[0].values.map(function(d) {
                return d.date;
            }));
            y0.domain(dataByGroup.map(function(d) {
                return d.key;
            }));
            y1.domain([0, d3.max(data, function(d) {
                return d.value;
            })]).range([y0.rangeBand(), 0]);

            var group = svg.selectAll(".group")
                .data(dataByGroup)
                .enter()
                .append("g")
                .attr("class", "group")
                .attr("transform", function(d) {
                    return "translate(0," + y0(d.key) + ")";
                });

            if (showLabels) {
                group.append("text")
                    .attr("class", "group-label")
                    .attr("x", 40)
                    .attr("y", function(d) {
                        return y1(d.values[0].value / 2);
                    })
                    .attr("dy", ".35em")
                    .text(function(d) {
                        return d.key;
                    });
            }

            group.selectAll("rect")
                .data(function(d) {
                    return d.values;
                })
                .enter()
                .append("rect")
                .style("fill", function(d) {
                    return color(d.group);
                })
                .attr("x", function(d) {
                    return x(d.date);
                })
                .attr("y", function(d) {
                    return y1(d.value);
                })
                .attr("width", x.rangeBand())
                .attr("height", function(d) {
                    return y0.rangeBand() - y1(d.value);
                });

            // Hand coded numbers 
            svg.append("text")
                .attr("x", 59)
                .attr("y", 182)
                .text("32702000")
                .attr("class", "numbers")

            svg.append("text")
                .attr("x", 94)
                .attr("y", 172)
                .text("28439000")
                .attr("class", "numbers")

            svg.append("text")
                .attr("x", 120)
                .attr("y", 182)
                .text("32335000")
                .attr("class", "numbers")

            svg.append("text")
                .attr("x", 149)
                .attr("y", 172)
                .text("34950000")
                .attr("class", "numbers")

            svg.append("text")
                .attr("x", 178)
                .attr("y", 182)
                .text("33663000")
                .attr("class", "numbers")

            svg.append("text")
                .attr("x", 206)
                .attr("y", 190)
                .text("34625000")
                .attr("class", "numbers")

            svg.append("text")
                .attr("x", 206)
                .attr("y", 250)
                .text("Año")
                .attr("class", "numbers")    

            svg.append("text")
                .attr("x", 230)
                .attr("y", 182)
                .text("36080000")
                .attr("class", "numbers")

            svg.append("text")
                .attr("x", 258)
                .attr("y", 172)
                .text("43779000")
                .attr("class", "numbers")

            svg.append("text")
                .attr("x", 285)
                .attr("y", 165)
                .text("46681000")
                .attr("class", "numbers")

            svg.append("text")
                .attr("x", 314)
                .attr("y", 172)
                .text("45065000")
                .attr("class", "numbers")

            svg.append("text")
                .attr("x", 343)
                .attr("y", 166)
                .text("47306161")
                .attr("class", "numbers")

            svg.append("text")
                .attr("x", 370)
                .attr("y", 183)
                .text("45422")
                .attr("class", "numbers")

            svg.append("text")
                .attr("x", 400)
                .attr("y", 190)
                .text(" Cantidad en Toneladas")
                .attr("class", "numbers")

            // different categories
            svg.append("text")
                .attr("x", 63)
                .attr("y", 215)
                .text("")
                .attr("class", "number first")

            svg.append("text")
                .attr("x", 63)
                .attr("y", 155)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 63)
                .attr("y", 91)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 63)
                .attr("y", 47)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 91)
                .attr("y", 215)
                .text("")
                .attr("class", "number first")

            svg.append("text")
                .attr("x", 91)
                .attr("y", 157)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 91)
                .attr("y", 91)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 92)
                .attr("y", 50)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 117)
                .attr("y", 215)
                .text("")
                .attr("class", "number first")

            svg.append("text")
                .attr("x", 118)
                .attr("y", 160)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 117)
                .attr("y", 91)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 118)
                .attr("y", 50)
                .text("")
                .attr("class", "number")



            svg.append("text")
                .attr("x", 142)
                .attr("y", 215)
                .text("")
                .attr("class", "number first")

            svg.append("text")
                .attr("x", 146)
                .attr("y", 161)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 144)
                .attr("y", 88)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 146)
                .attr("y", 50)
                .text("")
                .attr("class", "number")



            svg.append("text")
                .attr("x", 171)
                .attr("y", 215)
                .text("")
                .attr("class", "number first")

            svg.append("text")
                .attr("x", 174)
                .attr("y", 161)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 171)
                .attr("y", 88)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 174)
                .attr("y", 50)
                .text("")
                .attr("class", "number")



            svg.append("text")
                .attr("x", 196)
                .attr("y", 215)
                .text("")
                .attr("class", "number first")

            svg.append("text")
                .attr("x", 200)
                .attr("y", 158)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 198)
                .attr("y", 83)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 200)
                .attr("y", 49)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 223)
                .attr("y", 215)
                .text("")
                .attr("class", "number first")

            svg.append("text")
                .attr("x", 227)
                .attr("y", 161)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 225)
                .attr("y", 88)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 227)
                .attr("y", 49)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 252)
                .attr("y", 215)
                .text("")
                .attr("class", "number first")

            svg.append("text")
                .attr("x", 254)
                .attr("y", 161)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 252)
                .attr("y", 88)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 252)
                .attr("y", 49)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 278)
                .attr("y", 215)
                .text("")
                .attr("class", "number first")

            svg.append("text")
                .attr("x", 280)
                .attr("y", 161)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 278)
                .attr("y", 86)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 281)
                .attr("y", 49)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 307)
                .attr("y", 215)
                .text("")
                .attr("class", "number first")

            svg.append("text")
                .attr("x", 309)
                .attr("y", 161)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 307)
                .attr("y", 86)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 309)
                .attr("y", 50)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 331)
                .attr("y", 215)
                .text("")
                .attr("class", "number first")

            svg.append("text")
                .attr("x", 335)
                .attr("y", 161)
                .text("")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 410)
                .attr("y", 88)
                .text("10.013.210 Ton")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 410)
                .attr("y", 108)
                .text("37.605.421 Ton")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 410)
                .attr("y", 128)
                .text("18.173.488 Ton")
                .attr("class", "number first")

            svg.append("text")
                .attr("x", 410)
                .attr("y", 178)
                .text("19.973.104 Ton")
                .attr("class", "number ")

            svg.append("text")
                .attr("x", 410)
                .attr("y", 198)
                .text("66.071.458 Ton")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 410)
                .attr("y", 22)
                .text("2.718.000 Ton")
                .attr("class", "number")

            svg.append("text")
                .attr("x", 410)
                .attr("y", 215)
                .text("210.514.033 Ton.")
                .attr("class", "number first")

            svg.append("text")
                .attr("x", 410)
                .attr("y", 155)
                .text("24.059.999 Ton")
                .attr("class", "number ")

            svg.append("text")
                .attr("x", 410)
                .attr("y", 68)
                .text("23.164.000 Ton")
                .attr("class", "number ")

            svg.append("text")
                .attr("x", 410)
                .attr("y", 49)
                .text("3.377.944 Ton.")
                .attr("class", "number ")


            group.filter(function(d, i) {
                    return !i;
                }).append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + y0.rangeBand() + ")")
                .call(xAxis);
        }

    });

    d3.select("svg")
        .append("text")
        .attr("x", (width) - (width / 8))
        .attr("y", height * 1.18)
        .text("Data source: Datos.gov.co")
        .style({
            "font-size": "6px",
            "font-family": "Helvetica",
            "font-weight": "300",
            "opacity": "0.8",
        });


    function responsivefy(svg) {
        var container = d3.select(svg.node().parentNode),
            width = parseInt(svg.style("width")),
            height = parseInt(svg.style("height")),
            aspect = width / height;

        svg.attr("viewBox", "0 0 " + width + " " + height)
            .attr("perserveAspectRatio", "xMinYMid")
            .call(resize);

        d3.select(window).on("resize." + container.attr("#graphic"), resize);

        function resize() {
            var targetWidth = parseInt(container.style("width"));
            svg.attr("width", targetWidth);
            svg.attr("height", Math.round(targetWidth / aspect));
        }
    }

};

drawGraphic();
