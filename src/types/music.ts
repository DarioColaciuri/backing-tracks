export type NaturalNote = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type SharpNote = 'C#' | 'D#' | 'F#' | 'G#' | 'A#';
export type FlatNote = 'Db' | 'Eb' | 'Gb' | 'Ab' | 'Bb';
export type Note = NaturalNote | SharpNote | FlatNote;

export type NoteIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export const CHORD_TYPES = [
  'major', 'minor', '5', 'sus2', 'sus4',
  '7', 'maj7', 'm7', 'mMaj7', 'dim', 'dim7', 'aug',
  'add9', '6', 'm6', '9', 'm9', '11', '13',
] as const;

export type ChordType = typeof CHORD_TYPES[number];

export interface Chord {
  root: Note;
  type: ChordType;
}

export type Duration = 'whole' | 'half' | 'quarter' | 'eighth';

export interface ChordBlock {
  id: string;
  chord: Chord;
  duration: Duration;
  dotted: boolean;
  triplet: boolean;
}

export interface Measure {
  id: string;
  index: number;
  blocks: ChordBlock[];
}

export interface TimeSignature {
  beatsPerMeasure: number;
  beatUnit: number;
}

export type TransportState = 'stopped' | 'playing' | 'paused';

export interface AppState {
  tempo: number;
  timeSignature: TimeSignature;
  transportState: TransportState;
  metronomeEnabled: boolean;

  currentMeasureIndex: number;
  currentBeatFraction: number;

  measures: Measure[];

  selectedRoot: Note | null;
  selectedChordType: ChordType | null;

  selectedBlockId: string | null;
  selectedBlockMeasureId: string | null;
}
