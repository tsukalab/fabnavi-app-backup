import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';

import { connect } from 'react-redux';

import ReactPlayer from 'react-player'
import ChartView from '../chart/ChartView';
import Duration from '../utils/Duration';
import TagList from '../chart/TagList';

class ProjectTagging extends React.Component {

    constructor(props) {
        super(props);

        this.hasGraph = false;

        this.leftChart = ChartView;
        this.rightChart = ChartView;
        this.leftTagList = TagList;
        this.rightTagList = TagList;

        this.state = {
            url: null,
            playing: false,
            volume: 0.8,
            muted: false,
            played: 0,
            duration: 0,
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
            this.leftChart.changeCurrentTime(this.refs.player.getCurrentTime(), this.state.duration)
            this.rightChart.changeCurrentTime(this.refs.player.getCurrentTime(), this.state.duration)
        }
        this.createTag = () => {
            if (this.rightChart.getSelection() != null || this.leftChart.getSelection() != null ) {
                this.leftTagList.appendTag(this.rightChart.getSelection(), this.refs.tagNameTxt.value)
                this.rightTagList.appendTag(this.rightChart.getSelection(), this.refs.tagNameTxt.value)
            }
        }
    };

    render() {
        return (
            <div className="taggingproject">
                <style jsx>{`
                    .item{
                        margin-right: 20px;
                    }
                `}</style>
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
                            onDuration={duration => this.setState({ duration })}
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
                    </div>
                    <div>
                        <svg id="tagList_left" ref="tagList_left"></svg>
                        <svg id="tagList_right" ref="tagList_right"></svg>
                    </div>
                    <div>
                        <svg id="chart_left" ref="chart_left"></svg>
                        <svg id="chart_right" ref="chart_right"></svg>
                    </div>
                    <div>
                        <label className="item">
                            <font color="#f28c36">加速度X</font>
                        </label>
                        <label className="item">
                            <font color="#e54520">加速度Y</font>
                        </label>
                        <label className="item">
                            <font color="#629ac9">加速度Z</font>
                        </label>
                        <label className="item">
                            <font color="&quot;#cfe43f">角速度X</font>
                        </label>
                        <label className="item">
                            <font color="#CCCC00">角速度Y</font>
                        </label>
                        <label className="item">
                            <font color="#8e37ca">角速度Z</font>
                        </label>
                        <tag_form>タグ名:
                            <input type="text" name="tag_name_txt" ref="tagNameTxt" />
                        </tag_form>
                        <label>
                            <button onClick={this.createTag}>
                                作成
                            </button>
                        </label>
                    </div>
                </center>
            </div >
        );
    }

    componentWillUpdate(nextProps) {

        if (!this.hasGraph) {
            if (nextProps.project.sensor_infos[0].data.data.url.indexOf("left") >= 0) {
                this.leftTagList.init(this.refs.tagList_left);
                this.rightTagList.init(this.refs.tagList_right);
                this.leftChart.init(this.refs.chart_left, nextProps.project.sensor_infos[0].data.data.url);
                this.rightChart.init(this.refs.chart_right, nextProps.project.sensor_infos[1].data.data.url);
            } else {
                this.leftTagList.init(this.refs.tagList_left);
                this.rightTagList.init(this.refs.tagList_right);
                this.leftChart.init(this.refs.chart_left, nextProps.project.sensor_infos[1].data.data.url);
                this.rightChart.init(this.refs.chart_right, nextProps.project.sensor_infos[0].data.data.url);
            }
            this.hasGraph = true;
        }
    }
}

ProjectTagging.propTypes = {
    project: PropTypes.object,
    currentTime: PropTypes.number,
};

const mapStateToProps = (state) => (
    {
        project: state.manager.targetProject,
        currentTime: state.tagging.currentTime,
    }
);

const mapDispatchToProps = (dispatch) => (
    {

    }
);

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTagging);

