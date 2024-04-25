export interface Cue 
    {
        id: string,
        name: string,
        time: number,
    }

    export interface MergedCue {
        song: Cue[],
        doesStop: boolean,
        songLength: number
    }