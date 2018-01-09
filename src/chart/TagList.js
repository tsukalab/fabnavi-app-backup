import * as d3 from "d3";

const TagList = function(){

// 表示サイズを設定
var margin = {
  top   : 20,
  right : 40,
  bottom: 0,
  left  : 40
};

var size = {
  width : 600,
  height: 50
};

var width = size.width - margin.left - margin.right;
var height = size.height - margin.top - margin.bottom;

var svg;

function init( svgElement ){

svg = d3.select(svgElement)
  .attr("width", size.width)
  .attr("height", size.height)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
}

function appendTag( selection, tag ){
    
 svg.append("rect")
.attr("x",selection[0])
.attr("y",25)
.attr("width",selection[1] - selection[0])
.attr("height",25)
.attr("fill", colorGen())

svg.append("text") // 楕円を追加。以後のメソッドは、この楕円に対しての設定になる<br>
    .attr("x", selection[0])  // x座標を指定<br>
    .attr("y", 10) // y座標を指定<br>
    .text(tag)
}

function colorGen(){
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

return {
 init:init,
 appendTag:appendTag,
};
}();

module.exports = TagList;