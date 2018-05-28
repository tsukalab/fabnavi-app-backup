import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';

import { connect } from 'react-redux';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';

const debug = Debug('fabnavi:jsx:Chart.js');

class Chart extends React.Component {

    constructor(props) {

    };

    render() {
        return(
            <div>Chart</div>
        )
    };
}

Chart.propTypes = {
    project: PropTypes.object,
    currentTime: PropTypes.number
};

const mapStateToProps = (state) => (
    {
        project: state.player.project,
        currentTime: state.player.currentTime
    }
);

const mapDispatchToProps = (dispatch) => (
    {
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
