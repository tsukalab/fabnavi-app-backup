import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';

import { connect } from 'react-redux';

const debug = Debug('fabnavi:jsx:ProjectSensorTag');

class ProjectSensorTag extends React.Component {

    constructor(props) {
        super(props);
    };

    render() {
        return (
            <div>ProjectSensorTag</div>
        );
    }
}

ProjectSensorTag.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSensorTag);