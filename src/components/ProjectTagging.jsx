import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';

import { connect } from 'react-redux';

class ProjectTagging extends React.Component {

    constructor(props) {
        super(props);
    };

        render() {
            return (
                <div>ProjectTagging</div>
            );
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