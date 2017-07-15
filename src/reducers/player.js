import { handleActions } from 'redux-actions';
import Debug from 'debug';

const debug = Debug('fabnavi:reducer:player');

const PlayerModes = [
    'play', 'calibrateCenter', 'calibrateScale'
];

const initialState = {
    mode: 'play',
    contentType: 'photo',
    page: 0,
    project: null,
    currentTime: 0,
    isPlaying: false,
    config: {
        x: 0,
        y: 0,
        w: 1000,
        h: 1000
    }
}

export default handleActions({
    PLAYER_CHANGE_PAGE: (action, state) => {
        return Object.assign({}, state, {
            page: action.page,
        });
    },
    RECEIVE_PROJECT: (action, state) => {
        debug('Receive project: ', action);
        return Object.assign({}, state, {
            project: action.targetProject,
        });
    },
    UPDATE_CALIBRATION: (state, action) => {
        return Object.assign({}, state, {
            config: action.config
        });
    },
    PLAYER_EXIT: (action, state) => {
        debug('player exit, nothing to do');
        return initialState;
    },
    PLAYER_CHANGE_MODE: (state, action) => {
        return Object.assign({}, state, {
            mode: nextMode(state)
        });
    },
    TOGGLE_PLAYING: (state, action) => {
        if(state.contentType === 'movie') {
            return Object.assign({}, state, {
                isPlaying: !state.isPlaying
            });
        }
        return state;
    }
}, initialState);

function nextMode(state) {
    let index = PlayerModes.indexOf(state.mode) + 1;
    if(index >= PlayerModes.length) {
        index = 0;
    }
    return PlayerModes[index];
}