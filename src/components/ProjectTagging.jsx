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
            ax: true,
            ay: true,
            az: true,
            gx: true,
            gy: true,
            gz: true,
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

            var tapTime = this.rightChart.getTapCurrentTime(this.state.duration)
            console.log(tapTime)
            if (tapTime != -1) {
                this.setState({ played: parseFloat(tapTime) })
                this.refs.player.seekTo(parseFloat(tapTime))
            }
            this.leftChart.changeCurrentTime(this.refs.player.getCurrentTime(), this.state.duration)
            this.rightChart.changeCurrentTime(this.refs.player.getCurrentTime(), this.state.duration)
        }
        this.createTag = () => {
            if (this.rightChart.getSelection() != null || this.leftChart.getSelection() != null) {
                this.leftTagList.appendTag(this.rightChart.getSelection(), this.refs.tagNameTxt.value)
                this.rightTagList.appendTag(this.rightChart.getSelection(), this.refs.tagNameTxt.value)
            }
        }

        this.onChartItemsChange = e => {
            if(e.target.checked){
                this.rightChart.addItem(e.target.id.slice( 0, 2 ))
              } else {
                this.rightChart.removeItem(e.target.id.slice( 0, 2 ))
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

                    .input-range[type="range"] {
                        -webkit-appearance: none;
                        appearance: none;
                        background-color: #c7c7c7;
                        height: 2px;
                        width: 400px;
                        margin-left: 20px;
                    }
                    .play-button {
                        width: 50px;
                        height: 30px;
                    }
                    .input-range::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            cursor: pointer;
                            position: relative;
                            border: none;
                            width: 12px;
                            height: 12px;
                            display: block;
                            background-color: #262626;
                            border-radius: 50%;
                            -webkit-border-radius: 50%;
                          }

                    .elapsed-time{
                        margin-left: 20px;
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
                        <button className="play-button" onClick={this.playPause}>{this.state.playing ? 'Pause' : 'Play'}</button>
                        <input className="input-range"
                            type='range' min={0} max={1} step='any'
                            value={this.state.played}
                            onChange={this.onSeekChange}
                        />
                        <Duration className="elapsed-time"
                            seconds={this.state.duration * this.state.played}
                        />
                        <label>/</label>
                        <Duration seconds={this.state.duration} />
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
                            <input id="ax_checkbox" type="checkbox" defaultChecked={this.state.ax} onChange={this.onChartItemsChange}/>
                            <font color="#f28c36">加速度X</font>
                        </label>
                        <label className="item">
                            <input id="ay_checkbox" type="checkbox" defaultChecked={this.state.ay} onChange={this.onChartItemsChange}/>
                            <font color="#e54520">加速度Y</font>
                        </label>
                        <label className="item">
                            <input id="az_checkbox" type="checkbox" defaultChecked={this.state.az} onChange={this.onChartItemsChange}/>
                            <font color="#629ac9">加速度Z</font>
                        </label>
                        <label className="item">
                            <input id="gx_checkbox" type="checkbox" defaultChecked={this.state.gx} onChange={this.onChartItemsChange}/>
                            <font color="&quot;#cfe43f">角速度X</font>
                        </label>
                        <label className="item">
                            <input id="gy_checkbox" type="checkbox" defaultChecked={this.state.gy} onChange={this.onChartItemsChange}/>
                            <font color="#CCCC00">角速度Y</font>
                        </label>
                        <label className="item">
                            <input id="gz_checkbox" type="checkbox" defaultChecked={this.state.gz} onChange={this.onChartItemsChange}/>
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
};

const mapStateToProps = (state) => (
    {
        project: state.manager.targetProject,
    }
);

const mapDispatchToProps = (dispatch) => (
    {

    }
);

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTagging);

