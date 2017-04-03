'use strict';

$(document).ready(function() {
    $.ajax({
        type: 'get',
        url: '/v1/visualize',
        success: function(data) {
            console.log(data);
            let corrMatrix = data,
                nodes = [],
                links = [];

            corrMatrix.forEach(function(cArray, sNum) {
                let curID = "sensor_" + sNum;
                nodes.push({
                    "id": curID,
                    "group": sNum
                });
                cArray.forEach(function(corr, tNum) {
                    if (Math.abs(corr) >= 0.4 && tNum != sNum) {
                        links.push({
                            "source": curID,
                            "target": "sensor_" + tNum,
                            "value": corr
                        });
                    }
                });
            });
            let graph = {
                "nodes": nodes,
                "links": links
            };
            console.log(graph);

            let svg = d3.select("svg");
            let width = svg.attr("width"),
                height = svg.attr("height");

            let color = d3.scaleOrdinal(d3.schemeCategory20);

            let simulation = d3.forceSimulation()
                    .force("link", d3.forceLink().distance(300).id(function(d) { return d.id; }))
                    .force("charge", d3.forceManyBody())
                    .force("center", d3.forceCenter(width / 2, height / 2));

            let link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .style("opacity", function(d) { return Math.sqrt(d.value); })
                .style("stroke", function(d) {
                    if (d.value > 0) {
                        return "#8B0000";
                    } else {
                        return "#008000"
                    }
                })
                .style("stroke-width", "3px");

            link.append("title").text(function(d) {return d.value});

            let node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("r", 8)
                .attr("fill", "gray")
                .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

            node.append("title").text(function(d) { return d.id; });

            simulation.nodes(graph.nodes).on("tick", ticked);

            simulation.force("link").links(graph.links);

            function ticked() {
                link
                        .attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });

                node
                        .attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });
            }

            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
        },
        error: function() {
            alert('Error retrieving correlation data.');
        }
    });
});