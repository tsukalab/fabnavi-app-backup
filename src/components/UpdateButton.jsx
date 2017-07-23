import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Debug from 'debug';

const debug = Debug('fabnavi:jsx:UpdateButton');

class UpdateButton extends Component {

    constructor(props) {
        super(props);
        this.onClick = () => {
            api.getAllProjects();
        }
    }

    render() {
        return (
            <div>
                <style jsx>{`
                    img {
                        width: 50%;
                    }
                `}</style>
                <div>
                    {this.props.canUpdatePage ?
                        <a onClick={this.onClick}>
                            <img src="./images/update.png" />
                        </a> :
                        <img src="./images/no-update.png" />
                    }
                </div>
            </div>
        )
    }
}

UpdateButton.propTypes = {
    canUpdatePage: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        canUpdatePage: state.manager.canUpdatePage
    };
}

export default connect(mapStateToProps)(UpdateButton);