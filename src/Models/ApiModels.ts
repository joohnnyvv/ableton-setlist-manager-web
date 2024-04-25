export interface Cue 
    {
        id: string,
        name: string,
        time: number,
    }

    export interface AdditionalInfo {
        tempo: string;
    }

    export interface MergedCue {
        song: Cue[],
        doesStop: boolean,
        additionalInfo?:AdditionalInfo,
        songLengthInBars: number,
        songLengthInSec?: number
    }