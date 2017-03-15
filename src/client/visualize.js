'use strict';

$(document).ready(function() {
    let corr = [];
    $.ajax({
        type: 'get',
        url: '/v1/visualize',
        success: function(data) {
            //for each array in data save array from number of array + 1 to end
            for (let i = 0; i < data.size; i++) {
                //append an svg object for each sensor
                d3.select("body").append("svg").attr("width", 50).attr("height", 50)
                    .append("circle").attr("cx", 25).attr("cy", 25).attr("r", 25).style("fill", "blue");
                //only include correlation values once
                let k = i+1;
                while (k < data.size) {
                    corr.append(data[i, k]);
                    k++;
                }
            }
        },
        error: function() {
            alert('Error retrieving correlation data.');
        }
    });
});