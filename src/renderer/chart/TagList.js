import * as d3 from "d3";

export default class TagList {

  constructor(svgElement) {

    // 表示サイズを設定
    this.margin = {
      top: 20,
      right: 40,
      bottom: 0,
      left: 40
    };

    this.size = {
      width: 600,
      height: 50
    };

    this.width = this.size.width - this.margin.left - this.margin.right;
    this.height = this.size.height - this.margin.top - this.margin.bottom;

    this.svg = d3.select(svgElement)
      .attr("width", this.size.width)
      .attr("height", this.size.height)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
  }

  appendTag(selection, tag) {

    this.svg.append("rect")
      .attr("x", selection[0])
      .attr("y", 25)
      .attr("width", selection[1] - selection[0])
      .attr("height", 25)
      .attr("fill", this.colorGen())

    this.svg.append("text") // 楕円を追加。以後のメソッドは、この楕円に対しての設定になる<br>
      .attr("x", selection[0])  // x座標を指定<br>
      .attr("y", 10) // y座標を指定<br>
      .text(tag)
  }

  colorGen() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
}
