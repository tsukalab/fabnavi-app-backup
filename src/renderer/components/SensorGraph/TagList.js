import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';
import { connect } from 'react-redux';
import * as d3 from "d3";


const debug = Debug('fabnavi:jsx:TagList');

class TagList extends React.Component {

  constructor(props) {
    super(props);
    // 表示サイズを設定
    this.margin = {
      top: 20,
      right: 40,
      bottom: 0,
      left: 40
    };

    this.size = {
      width: 650,
      height: 50
    };

    this.width = this.size.width - this.margin.left - this.margin.right;
    this.height = this.size.height - this.margin.top - this.margin.bottom;

    this.state = {
      svg: null,
      tags: [],
    }
  }

  onRef = (ref) => {
    this.setState({
      svg:
        d3.select(ref)
          .attr("width", this.size.width)
          .attr("height", this.size.height)
          .append("g")
          .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
    })
  }

  renderTags(tags) {
    d3.selectAll("rect").remove()
    d3.selectAll("text").remove()

    this.state.tags = tags

    console.log(tags);

    tags.forEach(tag => {
      this.appendTag(tag.selection, tag.tag)
    });
  }

  appendTag(selection, tag) {

    this.state.svg.append("rect")
      .on("click", (d) => {
        d3.selectAll("rect").remove()
        d3.selectAll("text").remove()
      })
      .attr("x", selection[0])
      .attr("y", 25)
      .attr("width", selection[1] - selection[0])
      .attr("height", 25)
      .attr("fill", this.colorGen(tag))


    var textsize = 13

    if (tag == "hammer") {
      //textsize = 8
    }

    this.state.svg.append("text") // 楕円を追加。以後のメソッドは、この楕円に対しての設定になる<br>
      .attr("x", selection[0])  // x座標を指定<br>
      .attr("y", 10) // y座標を指定<br>
      .attr("font-size", textsize)
      .text(tag)
  }

  colorGen(tag) {

    if (tag == "hammer") {
      return "#F6A336"
    } else if (tag == "scissors") {
      return "#008000"
    }


    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  render() {
    return (
      <div><svg ref={this.onRef}></svg></div>
    );
  }
}

TagList.propTypes = {
  tagList: PropTypes.array,
};

export default connect(
  null,
  null,
  null,
  { withRef: true }
)(TagList);