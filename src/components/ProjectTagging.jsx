import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';

import { connect } from 'react-redux';

import ReactPlayer from 'react-player'
import ChartView from '../chart/ChartView';

class ProjectTagging extends React.Component {

    constructor(props) {
        super(props);

        this.hasGraph = false;

        this.state = {
            url: null,
            playing: false,
            volume: 0.8,
            muted: false,
            played: 0,
        }

        this.playPause = () => {
            this.setState({ playing: !this.state.playing })
        }
        this.onPlay = () => {
            this.setState({ playing: true })
        }
        this.onPause = () => {
            this.setState({ playing: false })
        }
        this.setVolume = e => {
            this.setState({ volume: parseFloat(e.target.value) })
        }
        this.toggleMuted = () => {
            this.setState({ muted: !this.state.muted })
        }
        this.onSeekChange = e => {
            this.setState({ played: parseFloat(e.target.value) })
            this.refs.player.seekTo(parseFloat(e.target.value))
        }
        this.onProgress = state => {
            this.setState(state)
        }
    };

    render() {
        return (
            <div className="taggingproject">
                <center>
                    {this.props.project !== null ?
                        <ReactPlayer
                            ref={"player"}
                            className='react-player'
                            width='50%'
                            height='50%'
                            url={this.props.project.content[0].figure.file.file.url}
                            playing={this.state.playing}
                            volume={this.state.volume}
                            muted={this.state.muted}
                            onReady={() => console.log('onReady')}
                            onStart={() => console.log('onStart')}
                            onPlay={this.onPlay}
                            onPause={this.onPause}
                            onBuffer={() => console.log('onBuffer')}
                            onSeek={e => console.log('onSeek', e)}
                            onEnded={() => console.log('End')}
                            onError={e => console.log('onError', e)}
                            onProgress={this.onProgress}
                        />
                        :
                        null
                    }
                    <div>
                        <button onClick={this.playPause}>{this.state.playing ? 'Pause' : 'Play'}</button>
                        <input
                            type='range' min={0} max={1} step='any'
                            value={this.state.played}
                            onChange={this.onSeekChange}
                        />
                        <input type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.setVolume} />
                        <input type='checkbox' checked={this.state.muted} onChange={this.toggleMuted} /> Muted
                    </div>
                    <div>
                        <svg id="chart_left" ref="chart_left"></svg>
                        <svg id="chart_right" ref="chart_right"></svg>
                    </div>
                </center>
            </div>
        );
    }

    componentWillUpdate(nextProps) {

        if (!this.hasGraph) {
            if (nextProps.project.sensor_infos[0].data.data.url.indexOf("left") >= 0) {
                ChartView.init(this.refs.chart_left, nextProps.project.sensor_infos[0].data.data.url);
                ChartView.init(this.refs.chart_right, nextProps.project.sensor_infos[1].data.data.url);
            } else {
                ChartView.init(this.refs.chart_left, nextProps.project.sensor_infos[1].data.data.url);
                ChartView.init(this.refs.chart_right, nextProps.project.sensor_infos[0].data.data.url);
            }
            this.hasGraph = true;
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

