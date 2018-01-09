import * as c3 from "c3";
import 'c3/c3.css';
import * as d3 from "d3";

const ChartView = function () {

    var chart;
    var data;

    function init(svgElement, sensor_data_url) {
	
        var ax_dataSet =['ax'];
        var ay_dataSet =['ay'];
        var az_dataSet =['az'];
        var gx_dataSet =['gx'];
        var gy_dataSet =['gy'];
        var gz_dataSet =['gz'];

        d3.text(sensor_data_url, function (error, text) {
            data = d3.csvParseRows(text, function (d) {
              return { date: d[0], ax: +d[1], ay: +d[2], az: +d[3], gx: +d[4], gy: +d[5], gz: +d[6] };
        });
 
		for( var i = 0 ; i < data.length; i++){ 
			ax_dataSet.push(data[i].ax);
		}

            c3.generate({
                bindto: svgElement,
                size: {
                    width: 650,
                    height: 300
                },
                padding: {
                    top: 20,
                    right: 40,
                    bottom: 20,
                    left: 40
                },
                data: {
                    columns: [
                        ax_dataSet
                    ]
                },
                axis: {
                    x: {
                        show: false
                    },
                    y: {
                        show: false
                    }
                },
                tooltip: {
                    show: false
                },
                zoom: {
                    enabled: true
                },
                grid: {
                    x: {
                        lines: [
                            { value: 1, class: 'play-time-bar' },
                        ]
                    }
                },
                subchart: {
                    show: true,
                    axis: {
                        x: {
                            show: false
                        },
                        y: {
                            show: false
                        }
                    },
                }
            })
        });
    };

    return {
        init: init,
    };
}();

module.exports = ChartView;