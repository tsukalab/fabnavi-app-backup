import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';

import { connect } from 'react-redux';

import Player from './Player';
import ChartView from'../chart/ChartView';

class ProjectTagging extends React.Component {

    constructor(props) {
        super(props);
    };

        render() {
            return (
                <div className="taggingproject">
                    <center>
                    <Player />
                    <svg id="chart_left" ref="chart_left"></svg>
                    <svg id="chart_right" ref="chart_right"></svg>
                    </center>
                </div>
            );
        }

        componentWillUpdate(nextProps){
            if(nextProps.project.sensor_infos[0].data.data.url.indexOf("left") >= 0){
                ChartView.init(this.refs.chart_left, nextProps.project.sensor_infos[0].data.data.url);
                ChartView.init(this.refs.chart_right, nextProps.project.sensor_infos[1].data.data.url);
            }else {
                ChartView.init(this.refs.chart_left, nextProps.project.sensor_infos[1].data.data.url);
                ChartView.init(this.refs.chart_right, nextProps.project.sensor_infos[0].data.data.url);
            }
        }
}

ProjectTagging.propTypes = {
    project: PropTypes.object,
};

const mapStateToProps = (state) => (
    {
        project: state.manager.targetProject  
    }
);

const mapDispatchToProps = (dispatch) => (
    {
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTagging);