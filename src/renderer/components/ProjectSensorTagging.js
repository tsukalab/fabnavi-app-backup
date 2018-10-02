import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';

import { connect } from 'react-redux';

import ReactPlayer from 'react-player'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';
import ReactModal from 'react-modal';

import { SaveButton } from '../stylesheets/application/ProjectEditForm';

import { updateProject } from '../actions/manager';
import SensorGraph from './SensorGraph/SensorGraph';
import TagList from './SensorGraph/TagList';
import Duration from '../utils/Duration';
import api from '../utils/WebAPIUtils';

const modalStyles = {
    content: {
        top: '20%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-20%',
        transform: 'translate(-50%, -50%)'
    }
};

const debug = Debug('fabnavi:jsx:ProjectSensorTagging');

class ProjectSensorTagging extends React.Component {

    constructor(props) {
        super(props);

        this.currentShowGraph = 0;

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
            brushedRange: null,
            currentMovie: 0,
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

            if (this.currentShowGraph == 0) {
                this.leftChart.getWrappedInstance().moveTimeBar(this.refs.player.getCurrentTime(), this.state.duration)
                this.rightChart.getWrappedInstance().moveTimeBar(this.refs.player.getCurrentTime(), this.state.duration)
            } else if (this.currentShowGraph == 1) {
                this.heartrateChart.moveTimeBar(this.refs.player.getCurrentTime(), this.state.duration)
            }
        }

        this.onDuration = duration => {
            this.setState({ duration })
            const chapters = this.props.project.content[0].figure.chapters;
            var tags = [];
            chapters.forEach((chapter, i) => {
                var tag = {
                    "id": chapter.id,
                    "tag": chapter.name,
                    "selection": [chapter.start_sec * 570 / duration, chapter.end_sec * 570 / duration],
                    "tags_num": i
                }
                tags.push(tag);
            });
            this.setState({
                tags: tags
            });

            this.leftTagList.getWrappedInstance().renderTags(tags)
            this.rightTagList.getWrappedInstance().renderTags(tags)
        }

        this.onChartItemsChange = e => {
            if (e.target.checked) {
                this.leftChart.getWrappedInstance().addItem(e.target.id.slice(0, 2))
                this.rightChart.getWrappedInstance().addItem(e.target.id.slice(0, 2))
            } else {
                this.leftChart.getWrappedInstance().removeItem(e.target.id.slice(0, 2))
                this.rightChart.getWrappedInstance().removeItem(e.target.id.slice(0, 2))
            }
        }

        this.handleSelect = index => {
            if (index == 0) {
                this.currentShowGraph = 0;
            } else if (index == 1) {
                this.currentShowGraph = 1;
            }
        }

        this.addAutoTag = () => {
            this.state.tags = [{ "selection": [2 * 4.8, 8 * 4.8], "tag": "scissors" },
            { "selection": [50 * 4.8, 60 * 4.8], "tag": "scissors" },
            { "selection": [96 * 4.8, 103 * 4.8], "tag": "scissors" },
            { "selection": [130 * 4.8, 137 * 4.8], "tag": "hammer" }]

            this.state.tags.forEach(tag => {
                this.leftTagList.getWrappedInstance().appendTag(tag.selection, tag.tag)
                this.rightTagList.getWrappedInstance().appendTag(tag.selection, tag.tag)
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

        this.onSubmit = e => {
            e.preventDefault();
            const figures = this.state.figures.map(figure => {
                const captions = figure.captions.filter(caption => caption.text && !!caption.text.trim())
                const chapters = figure.chapters.filter(chapter => chapter.name && !!chapter.name.trim())
                figure.captions = captions;
                figure.chapters = chapters;
                return figure;
            })
            this.props.updateProject(
                Object.assign({}, this.props.project, {
                    name: this.props.project.name,
                    description: this.props.project.description,
                    private: this.props.project.private,
                    figures: figures
                })
            );
        };
    };

    changeCurrentTime = (tapTime) => {
        const seconds = (tapTime / this.state.duration);
        if (tapTime != -1) {
            this.setState({ played: parseFloat(tapTime) })
            this.refs.player.seekTo(parseFloat(tapTime))
        }
    }

    setBrushedRange = (brushedRange) => {
        this.setState({ brushedRange: brushedRange })
        console.log(brushedRange)
    }

    createTag = () => {
        var tags_id = this.getRandom();

        this.setState({
            figures: this.state.figures.map((figure, i) => {
                if (i !== this.state.currentMovie) return figure;
                figure.chapters.push({
                    id: null,
                    start_sec: this.state.brushedRange[0] / 570 * this.state.duration,
                    end_sec: this.state.brushedRange[1] / 570 * this.state.duration,
                    name: this.refs.tagNameTxt.value,
                    _destroy: false
                });
                figure.captions.push({
                    id: null,
                    start_sec: this.state.brushedRange[0] / 570 * this.state.duration,
                    end_sec: this.state.brushedRange[1] / 570 * this.state.duration,
                    text: this.refs.tagNameTxt.value,
                    _destroy: false
                });
                return figure;
            })
        });

        this.state.tags.push({
            id: tags_id,
            tag: this.refs.tagNameTxt.value,
            selection: [this.state.brushedRange[0], this.state.brushedRange[1]],
            tags_num: this.state.figures[this.state.currentMovie].chapters.length - 1,
        })

        this.leftTagList.getWrappedInstance().setState({ tags: this.state.tags })
        this.rightTagList.getWrappedInstance().setState({ tags: this.state.tags })
        this.leftTagList.getWrappedInstance().appendTag(this.state.brushedRange, this.refs.tagNameTxt.value, tags_id)
        this.rightTagList.getWrappedInstance().appendTag(this.state.brushedRange, this.refs.tagNameTxt.value, tags_id)
    }

    removeTag = (id) => {

        const removeChapterId = this.state.tags.filter(tag => tag.id === id)[0].tags_num;

        const figures = this.state.figures.map((figure, i) => {
            if (i !== this.state.currentMovie) return figure;
            const chapters = figure.chapters.map((chapter, i) => {
                if (i === removeChapterId) chapter._destroy = true;
                return chapter;
            });
            const captions = figure.captions.map((caption, i) => {
                if (i === removeChapterId && caption.id === null) caption._destroy = true;
                return caption;
            });
            figure.chapters = chapters;
            figure.captions = captions;
            return figure;
        });

        const tags = this.state.tags.filter(tag => tag.tags_id !== id);

        this.setState({
            figures: figures,
            tags: tags,
        })

        this.leftTagList.getWrappedInstance().setState({ tags: this.state.tags })
        this.rightTagList.getWrappedInstance().setState({ tags: this.state.tags })
    }

    getRandom() {
        var random = 0;
        var hasNumber = true;
        while (hasNumber) {
            random = Math.floor(Math.random() * (65000 + 1));
            var filterTag = this.state.tags.filter(tag => tag.tags_id === random);
            var filterCaption = this.state.figures[0].captions.filter(caption => caption.id === random);
            if (filterTag.length <= 0 && filterCaption <= 0) hasNumber = false;
        }
        return random;
    }

    renderHeartRate(props) {
        return (
            <SensorGraph
                data='heartrate'
                changeCurrentTime={this.changeCurrentTime}
                setBrushedRange={this.setBrushedRange}
                ref={instance => { this.heartrateChart = instance; }} />
        );
    }

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
                    .parent{
                        display: flex;
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
                            onDuration={this.onDuration}
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
                </center>

                <div>
                    <Tabs onSelect={this.handleSelect} forceRenderTabPanel={true}>
                        <TabList>
                            <Tab>motion</Tab>
                            <Tab>heart</Tab>
                        </TabList>
                        <TabPanel>
                            <center>
                                <div className={"parent"}>
                                    <TagList
                                        tagList={this.tags}
                                        removeTag={this.removeTag}
                                        ref={instance => { this.leftTagList = instance; }} />
                                    <TagList
                                        tagList={this.tags}
                                        removeTag={this.removeTag}
                                        ref={instance => { this.rightTagList = instance; }} />
                                </div>
                                <div className={"parent"}>
                                    <SensorGraph
                                        data='left'
                                        changeCurrentTime={this.changeCurrentTime}
                                        setBrushedRange={this.setBrushedRange}
                                        ref={instance => { this.leftChart = instance; }} />
                                    <SensorGraph
                                        data='right'
                                        changeCurrentTime={this.changeCurrentTime}
                                        setBrushedRange={this.setBrushedRange}
                                        ref={instance => { this.rightChart = instance; }} />
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
                                    <label>
                                        タグ名:
                                <input type="text" name="tag_name_txt" ref="tagNameTxt" />
                                    </label>
                                    <label>
                                        <button onClick={this.createTag}> 作成 </button>
                                    </label>
                                </div>
                            </center>
                        </TabPanel>
                        <TabPanel>
                            <SensorGraph
                                data='heartrate'
                                changeCurrentTime={this.changeCurrentTime}
                                setBrushedRange={this.setBrushedRange}
                                ref={instance => { this.heartrateChart = instance; }} />
                        </TabPanel>
                    </Tabs>
                </div>
                <label>
                    <button onClick={this.openModal}>
                        自動タグ付け
                    </button>
                </label>
                <SaveButton type="submit" onClick={this.onSubmit}>save</SaveButton>

                <ReactModal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={modalStyles}
                    contentLabel="Example Modal"
                >

                    <h2>Do you want to add tags automatically?</h2>
                    <div align="right" >
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

    componentWillReceiveProps(props) {
        if (props.project !== null) {
            this.setState({
                figures: props.project.content.map(content => content.figure),
            });
        }
    }

    componentWillUpdate(nextProps) {
        //     if (this.currentShowGraph == 0) {

        //         /*if (nextProps.project.id == 435) {
        //             this.state.tags = [{ "selection": [18.5, 381.5], "tag": "scissors" },
        //             { "selection": [552.5, 565.5], "tag": "hammer" },
        //             { "selection": [580.5, 599.5], "tag": "hammer" },
        //             { "selection": [609.5, 642.5], "tag": "hammer" },
        //             { "selection": [647.5, 668.5], "tag": "hammer" },
        //             { "selection": [691.5, 707.55], "tag": "hammer" }]
        //         }*/

        //         this.leftTagList = new TagList(this.refs.tagList_left, this.state.tags);
        //         this.rightTagList = new TagList(this.refs.tagList_right, this.state.tags);

        //         if (nextProps.project.sensor_infos[0].data.url.indexOf("left") >= 0) {
        //             this.leftChart = new ChartView(this.refs.chart_left, nextProps.project.sensor_infos[0].data.url);
        //             this.rightChart = new ChartView(this.refs.chart_right, nextProps.project.sensor_infos[1].data.url);
        //             this.leftChart.draw()
        //             this.rightChart.draw()
        //         } else {
        //             this.leftChart = new ChartView(this.refs.chart_left, nextProps.project.sensor_infos[1].data.url);
        //             this.rightChart = new ChartView(this.refs.chart_right, nextProps.project.sensor_infos[0].data.url);
        //             this.leftChart.draw()
        //             this.rightChart.draw()
        //         }
        //     } else if (this.currentShowGraph == 1) {
        //         this.heartrateChart = new ChartView(this.refs.chart_heartrate, nextProps.project.sensor_infos[0].data.url);
        //         this.heartrateChart.drawHeartRate();
        //     }
    }
}

ProjectSensorTagging.propTypes = {
    project: PropTypes.object,
    updateProject: PropTypes.func
};

const mapStateToProps = (state) => (
    {
        project: state.player.project,
    }
);

export const mapDispatchToProps = dispatch => ({
    updateProject: project => dispatch(updateProject(project))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSensorTagging);