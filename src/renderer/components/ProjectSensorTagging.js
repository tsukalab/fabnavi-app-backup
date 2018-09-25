import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';

import { connect } from 'react-redux';

import ReactPlayer from 'react-player'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';
import ReactModal from 'react-modal';

import ChartView from './SensorGraph/ChartView';
import TagList from './SensorGraph/TagList';
import Duration from '../utils/Duration';
import api from '../utils/WebAPIUtils';
import BackButton from './BackButton';

const modalStyles = {
    content : {
        top                   : '20%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-20%',
        transform             : 'translate(-50%, -50%)'
    }
};

const debug = Debug('fabnavi:jsx:ProjectSensorTag');

class ProjectSensorTagging extends React.Component {

    constructor(props) {
        super(props);

        this.hasGraph = false;
        this.currentShowGraph = 0;

        this.leftChart = null;
        this.rightChart = null;
        this.heartrateChart = null;
        this.leftTagList = null;
        this.rightTagList = null;

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
            tags: [],
            modalIsOpen: false,
        }

        this.openModal = () => {
            this.setState({ modalIsOpen: true });
        }

        this.closeModal = () => {
            this.setState({ modalIsOpen: false });
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

            if (this.currentShowGraph == 0) {
                this.leftChart.changeCurrentTime(this.refs.player.getCurrentTime(), this.state.duration)
                this.rightChart.changeCurrentTime(this.refs.player.getCurrentTime(), this.state.duration)
            } else if (this.currentShowGraph == 1) {
                this.heartrateChart.changeCurrentTime(this.refs.player.getCurrentTime(), this.state.duration)
            }
        }
        this.createTag = () => {
            if (this.rightChart.getSelection() != null || this.leftChart.getSelection() != null) {
                this.leftTagList.appendTag(this.rightChart.getSelection(), this.refs.tagNameTxt.value)
                this.rightTagList.appendTag(this.rightChart.getSelection(), this.refs.tagNameTxt.value)
                console.log(this.rightChart.getSelection())
            }
        }

        this.onChartItemsChange = e => {
            if (e.target.checked) {
                this.rightChart.addItem(e.target.id.slice(0, 2))
            } else {
                this.rightChart.removeItem(e.target.id.slice(0, 2))
            }
        }

        this.handleSelect = index => {
            if (index == 0) {
                this.currentShowGraph = 0;
            } else if (index == 1) {
                this.currentShowGraph = 1;
            }

            this.hasGraph = false
        }

        this.addAutoTag = () => {
            this.state.tags = [{ "selection": [2 * 4.8, 8 * 4.8], "tag": "scissors" },
            { "selection": [50 * 4.8, 60 * 4.8], "tag": "scissors" },
            { "selection": [96 * 4.8, 103 * 4.8], "tag": "scissors" },
            { "selection": [130 * 4.8, 137 * 4.8], "tag": "hammer" }]

            this.state.tags.forEach(tag => {
                this.leftTagList.appendTag(tag.selection, tag.tag)
                this.rightTagList.appendTag(tag.selection, tag.tag)
            });

            this.sleep(1000)
            this.closeModal()
        }

        this.sleep = msec => {
            var d1 = new Date();
            while (true) {
              var d2 = new Date();
              if (d2 - d1 > msec) {
                break;
              }
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
                    .no-button{
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
                            url={this.props.project.content[0].figure.file.url}
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
                    <Tabs onSelect={this.handleSelect}>
                        <TabList>
                            <Tab>motion</Tab>
                            <Tab>heart</Tab>
                        </TabList>
                        <TabPanel>
                            <div>
                                <svg id="tagList_left" ref="tagList_left"></svg>
                                <svg id="tagList_right" ref="tagList_right"></svg>
                                <svg id="chart_left" ref="chart_left"></svg>
                                <svg id="chart_right" ref="chart_right"></svg>
                            </div>
                            <div>
                                <label className="item">
                                    <input id="ax_checkbox" type="checkbox" defaultChecked={this.state.ax} onChange={this.onChartItemsChange} />
                                    <font color="#f28c36">加速度X</font>
                                </label>
                                <label className="item">
                                    <input id="ay_checkbox" type="checkbox" defaultChecked={this.state.ay} onChange={this.onChartItemsChange} />
                                    <font color="#e54520">加速度Y</font>
                                </label>
                                <label className="item">
                                    <input id="az_checkbox" type="checkbox" defaultChecked={this.state.az} onChange={this.onChartItemsChange} />
                                    <font color="#629ac9">加速度Z</font>
                                </label>
                                <label className="item">
                                    <input id="gx_checkbox" type="checkbox" defaultChecked={this.state.gx} onChange={this.onChartItemsChange} />
                                    <font color="&quot;#cfe43f">角速度X</font>
                                </label>
                                <label className="item">
                                    <input id="gy_checkbox" type="checkbox" defaultChecked={this.state.gy} onChange={this.onChartItemsChange} />
                                    <font color="#CCCC00">角速度Y</font>
                                </label>
                                <label className="item">
                                    <input id="gz_checkbox" type="checkbox" defaultChecked={this.state.gz} onChange={this.onChartItemsChange} />
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
                        </TabPanel>
                        <TabPanel>
                            <div>
                                <svg id="chart_heartrate" ref="chart_heartrate"></svg>
                            </div>
                        </TabPanel>
                    </Tabs>

                </center>
                <label>
                     <button onClick={this.openModal}>
                        自動タグ付け
                    </button>
                </label>
                <BackButton />

                <ReactModal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={modalStyles}
                    contentLabel="Example Modal"
                >
                    
                    <h2>Do you want to add tags automatically?</h2>
                    <div align= "right" >
                    <button onClick={this.addAutoTag}>Yes</button>
                    <button className="no-button" onClick={this.closeModal}>No</button>
                    </div>
                </ReactModal>
            </div >
        );
    }

    componentDidMount() {
        /*const result = api.motionDetect(
            //"https://crest-multimedia-web.s3.amazonaws.com/tsuka/fabnavi5/uploads/sensor_info/data/256/2018-01-24_22_18_16_176_right.csv")
            "https://crest-multimedia-web.s3.amazonaws.com/tsuka/fabnavi5/uploads/sensor_info/data/254/2018-01-24_22_13_07_175_right.csv")
        result.then(response => {
            console.log(response.data.result)
        });*/
    }

    componentWillUpdate(nextProps) {
        if (!this.hasGraph) {
            if (this.currentShowGraph == 0) {
                
                /*if (nextProps.project.id == 435) {
                    this.state.tags = [{ "selection": [18.5, 381.5], "tag": "scissors" },
                    { "selection": [552.5, 565.5], "tag": "hammer" },
                    { "selection": [580.5, 599.5], "tag": "hammer" },
                    { "selection": [609.5, 642.5], "tag": "hammer" },
                    { "selection": [647.5, 668.5], "tag": "hammer" },
                    { "selection": [691.5, 707.55], "tag": "hammer" }]
                }*/

                this.leftTagList = new TagList(this.refs.tagList_left, this.state.tags);
                this.rightTagList = new TagList(this.refs.tagList_right, this.state.tags);

                if (nextProps.project.sensor_infos[0].data.url.indexOf("left") >= 0) {
                    this.leftChart = new ChartView(this.refs.chart_left, nextProps.project.sensor_infos[0].data.url);
                    this.rightChart = new ChartView(this.refs.chart_right, nextProps.project.sensor_infos[1].data.url);
                    this.leftChart.draw()
                    this.rightChart.draw()
                } else {
                    this.leftChart = new ChartView(this.refs.chart_left, nextProps.project.sensor_infos[1].data.url);
                    this.rightChart = new ChartView(this.refs.chart_right, nextProps.project.sensor_infos[0].data.url);
                    this.leftChart.draw()
                    this.rightChart.draw()
                }
            } else if (this.currentShowGraph == 1) {
                this.heartrateChart = new ChartView(this.refs.chart_heartrate, nextProps.project.sensor_infos[0].data.url);
                this.heartrateChart.drawHeartRate();
            }
        }

        this.hasGraph = true;
    }
}

ProjectSensorTagging.propTypes = {
    project: PropTypes.object,
};

const mapStateToProps = (state) => (
    {
        project: state.player.project,
    }
);

const mapDispatchToProps = (dispatch) => (
    {
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSensorTagging);