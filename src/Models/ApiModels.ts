export interface Cue 
    {
        id: string,
        name: string,
        time: number,
    }

    export interface PartCue extends Cue {
        length: number
    }

    export interface AdditionalInfo {
        tempo: string;
    }

    export interface MergedCue {
        song: Cue[],
        songPartsCues: PartCue[],
        doesStop: boolean,
        additionalInfo?:AdditionalInfo,
        songLengthInBars: number,
        songLengthInSec?: number
    }

    export interface LoopReqBody {
        loopStart: number,
        loopLength: number
    }