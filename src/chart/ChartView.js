import *as c3 from 'c3';
import 'c3/c3.css';
import *as d3 from 'd3';

const ChartView = function () {

    let chart;
    let data;

    function init(svgElement, sensor_data_url) {

        const ax_dataSet = ['ax'];
        const ay_dataSet = ['ay'];
        const az_dataSet = ['az'];
        const gx_dataSet = ['gx'];
        const gy_dataSet = ['gy'];
        const gz_dataSet = ['gz'];

        d3.text(sensor_data_url, function (error, text) {
            data = d3.csvParseRows(text, function (d) {
                return { date: d[0], ax: +d[1], ay: +d[2], az: +d[3], gx: +d[4], gy: +d[5], gz: +d[6] };
            });

            for( let i = 0; i < data.length; i++) {
                ax_dataSet.push(data[i].ax);
                ay_dataSet.push(data[i].ay);
                az_dataSet.push(data[i].az);
                gx_dataSet.push(data[i].gx);
                gy_dataSet.push(data[i].gy);
                gz_dataSet.push(data[i].gz);
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
                        ax_dataSet,
                        ay_dataSet,
                        az_dataSet,
                        gx_dataSet,
                        gy_dataSet,
                        gz_dataSet
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
    }

    return {
        init: init,
    };
}();

module.exports = ChartView;