import * as d3 from "d3";

const ChartView = function(){

// 表示サイズを設定
var margin = {
  top   : 40,
  right : 40,
  bottom: 20,
  left  : 40
};

var size = {
  width : 700,
  height: 225
};

var width = size.width - margin.left - margin.right;
var height = size.height - margin.top - margin.bottom;

var data =[];
var beginTime;

var x = d3.scaleTime()
  .range([0, width]);

var y = d3.scaleLinear()
  .range([height, 0]);

var xAxis = d3.axisBottom()
  .scale(x)
  .tickFormat(d3.timeFormat("%H%M%S%L"));

var yAxis = d3.axisLeft()
  .scale(y)
  
var svg;
var svg_list = [];
var svg2 = [];
var line = [];
var playTimeBar;
var playLine;

var color_list = ["#f28c36", "#dc5462","#629ac9","#cfe43f","#f8ea2d","#8e37ca"]

var s;

function init( svgElement, sensor_data_url ){

d3.text(sensor_data_url, function(error, text) { 
    data = d3.csvParseRows(text, function(d) {
        return { date: d[0], ax: +d[1], ay: +d[2], az: +d[3], gx: +d[4], gy: +d[5], gz: +d[6] };
    });

var parseDate = d3.timeParse("%H%M%S%L");

// zoomビヘイビアの設定
var zoom = d3.zoom()
  .scaleExtent([0.1, 10])
  .on("zoom", function(){
  });

// SVG、縦横軸などの設定
svg = d3.select(svgElement)
  .attr("width", size.width)
  .attr("height", size.height)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(zoom);

var rect = svg.append("rect")
  .attr("width", size.width)
  .attr("height", size.height)
  .style("fill", "none")
  .style("pointer-events", "all");

var i = 0;

for(i = 0; i < 6; i++){
   line[i] = d3.line()
  .x(function(d){ return x(d.date); })
  .y(function(d){ 
 
     switch(i){
       case 0: 
         return y(d.ax / 3);
       break;
    
       case 1:
         return y(d.ay/ 3);
       break;

       case 2:
         return y(d.az/ 3);
       break;
  
       case 3:
         return y(d.gx/ 3);
       break;

       case 4:
         return y(d.gy/ 3);
       break;

       case 5:
         return y(d.gz/ 3);
       break;
     }
 })
}


   playLine = d3.line()
    .x(function(d){ return d[0]; })
    .y(function(d){ return d[1]; })

// 描画
data.forEach(function(d){
  d.date = parseDate(d.date);
  d.ax = +d.ax;
  d.ay = +d.ay;
  d.az = +d.az;
  d.gx = +d.gx;
  d.gy = +d.gy;
  d.gz = +d.gz;
});

x.domain(d3.extent(data, function(d){ return d.date; }));
y.domain([-5,5]);

for(i = 0; i < 6; i++){
svg_list[i] = svg.append("path")
  .datum(data)
  .attr("class", "line")
  .attr("stroke", color_list[i])
  .attr("d", line[i])
  .attr("fill", "none");
}

playTimeBar = svg.append("path")
    .attr("d", playLine([[0,0], [0,height]])) 
    .attr("stroke", "#A9A9A9") 
    .attr("stroke-width", "2px")
    .attr("fill", "none") 

var brush = d3.brushX()
    .extent([[0,0], [width,height]])
    .on("brush end", function(){
       brushed(brush,x);
});

svg.append("g") //brushグループを作成
        .attr("class", "x brush")
        .call(brush)
        .selectAll(".brush rect")
        .attr("y", -6)
        .attr("height", height + 7);
 

for(i = 0; i < 6; i++){ 
svg.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("r", "3px")
           .attr("cx", line[i].x())
           .attr("cy", line[i].y())
           .attr("fill", "rgba(0,0,0,0)")
           .on("click", function(d){
              
           })
}
});

function brushed(brush,x) {
  if(d3.event.selection != null){
    if(d3.event.sourceEvent.type == "mouseup"){
       s = d3.event.selection || x.range();
       console.log(s.map(x.invert, x)[0].toLocaleString() + ":" + s.map(x.invert, x)[0].getMilliseconds());
       console.log(s.map(x.invert, x)[1].toLocaleString() + ":" + s.map(x.invert, x)[1].getMilliseconds());
     }
  }else {
    s = null;
}
}
}

function getSelection(){
return s;
}

function changeCurrentTime(currentTime,duringTime){
  var x = currentTime * (width / duringTime);
  playTimeBar.transition()
       .attr("d", playLine([[x,0], [x,height]]));
}

 function addItem(item){
}
 
 function removeItem(item){

  switch(item){
    case "ax":
      svg_list[0].remove();
      svg_list[0] = null;
    break;

    case "ay":
      svg_list[1].remove();
      svg_list[1] = null;
    break;

    case "az":
      svg_list[2].remove();
      svg_list[2] = null;
    break;

    case "gx":
      svg_list[3].remove();
      svg_list[3] = null;
    break;

    case "gy":
      svg_list[4].remove();
      svg_list[4] = null;
    break;

    case "gz":
      svg_list[5].remove();
      svg_list[5] = null;
    break;
  }
}

return {
  init : init,
  changeCurrentTime : changeCurrentTime,
};
}();

module.exports = ChartView;
