'use strict';

let RED = "#8B0000",
    GREEN = "#008000";

$(document).ready(function() {
    let corrMatrix;

    $.ajax({
        type: 'get',
        url: '/v1/visualize',
        success: function(data) {
            corrMatrix = data;

            //TODO:: Should be able to update SVG on slide rather than change - need to not regenerate each time
            $('#slider').slider({
                min: 0.0,
                max: 1.0,
                step: 0.01,
                change: function(event, ui) {
                    if (!corrMatrix) {
                        //can this happen?
                    } else {
                        visualize(corrMatrix, ui.value);
                    }
                },
                slide: function(event, ui) {
                    let threshold = ui.value.toFixed(2);
                    $('#threshVal').text(threshold);

                    $('#corrTable tbody tr').each(function(row) {
                        $('td', this).each(function(col) {
                            let corr = parseFloat($(this).attr('data-val'));
                            if (row > col) {
                                let color = Math.abs(corr) > threshold
                                    ? corr < 0 ? shadeColor2(RED, corr, threshold) : shadeColor2(GREEN, corr, threshold)
                                    : "#FFF";
                                $(this).css('background-color', color);
                            } else {
                                if (Math.abs(corr) <= threshold) {
                                    $(this).css('color', '#999');
                                } else {
                                    $(this).css('color', 'black');
                                }
                            }
                        })
                    })
                }
            });

            let threshold = $('#slider').slider('value');
            $('#threshVal').text(threshold.toFixed(2));

            visualize(corrMatrix, threshold);
            makeTable(corrMatrix, threshold);

            $('#corrTable td').hover(function() {
                let cell = $(this),
                    row = cell.attr('row'),
                    col = cell.attr('col');
                cell.addClass('highlight');
                $('#corrTable td[row="' + col + '"][col="' + row + '"]').addClass('highlight');
                $('svg .links line[]').addClass('highlight');

            }, function() {
                $('#corrTable').find('.highlight').removeClass('highlight');
            });
        },
        error: function() {
            alert('Error retrieving correlation data.');
        }
    });



});

function visualize(corrMatrix, threshold) {
    let nodes = [],
        links = [];

    corrMatrix.forEach(function(cArray, sNum) {
        let curID = "sensor_" + sNum;
        nodes.push({
            "id": curID,
            "group": sNum
        });
        cArray.forEach(function(corr, tNum) {
            if (tNum < sNum && Math.abs(corr) > threshold) {
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
    d3.selectAll('svg > *').remove();
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
        .attr('s', function(d) { return d.source})
        .attr('t', function(d) { return d.target})
        .style("stroke", function(d) {
            return d.value < 0 ? shadeColor2(RED, d.value, threshold) : shadeColor2(GREEN, d.value, threshold);
        })
        .style("stroke-width", function(d) {
            return Math.exp(2 * Math.abs(d.value));
        });

    link.append("title").text(function(d) {return d.value.toFixed(3)});

    //TODO:: Remove nodes with no links
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
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
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
}

function makeTable(corrMatrix, threshold) {
    corrMatrix.forEach(function(cArray, sNum) {
        $('#corrTable thead tr').append('<th>' + sNum + '</th>');
        $('#corrTable tbody').append('<tr id="s'+ sNum + '"></tr>');

        let trow = $('tr#s' + sNum);
        trow.append('<th scope="row">' + sNum + '</th>');
        cArray.forEach(function(corr, tNum) {
            if (tNum > sNum) {
                let data = Math.abs(corr) > threshold ? corr.toFixed(3) : "";
                trow.append('<td row="' + sNum + '" col="' + tNum + '" data-val=' + corr + '>' + data + '</td>');
            } else if (tNum < sNum) {
                let color = Math.abs(corr) > threshold
                    ? corr < 0 ? shadeColor2(RED, corr, threshold) : shadeColor2(GREEN, corr, threshold)
                    : "#FFF";
                trow.append('<td row="' + sNum + '" col="' + tNum + '" data-val=' + corr + ' bgcolor="' + color + '"></td>');
            } else {
                trow.append('<td><span style="visibility: hidden">' + corr.toFixed(3) + '</span></td>');
            }
        });
    });
}

function shadeColor2(color, corr, threshold) {
    let tr = (1 - Math.abs(corr)) / (1 - threshold),
        f = parseInt(color.slice(1),16),
        t = tr < 0 ? 0 : 255,
        p = tr < 0 ? tr * -1 : tr,
        R = f >> 16,
        G = f >> 8 & 0x00FF,
        B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000
        + (Math.round((t - G) * p) + G) * 0x100
        + (Math.round((t - B) * p) + B))
            .toString(16).slice(1);
}