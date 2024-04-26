export const API_URL = 'http://localhost:';
export const REST_PORT = '3001';
export const WS_PORT = '8080';

export const REST_ENDPOINTS = {
    GET_CUES: '/cues',
    START_PLAYING: '/start-playing',
    STOP_PLAYING: '/stop-playing',
    SET_SELECTED_SONG: '/send-cue',
    UPDATE_CUES: '/update-cues',
    SET_LOOP_AREA: '/set-loop-area',
    SET_IS_LOOPED: '/set-is-looped',
    SET_SELECTED_SONG_INDEX: '/set-selected-song-index'
}

export const WS_TYPES = {
    IS_PLAYING: 'is_playing',
    CURRENT_TIME: 'song_time',
    SELECTED_SONG_INDEX: 'selected_song_index',
    TEMPO: 'tempo',
    IS_LOOPED: 'is_looped',
    CUES_UPDATED: 'cues_updated'
}