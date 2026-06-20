import type { ChordType, Chord, NoteIndex } from '../types/music';
import { noteToIndex } from './notes';

export const CHORD_INTERVALS: Record<ChordType, number[]> = {
  major:  [0, 4, 7],
  minor:  [0, 3, 7],
  '5':   [0, 7],
  sus2:   [0, 2, 7],
  sus4:   [0, 5, 7],
  '7':   [0, 4, 7, 10],
  maj7:   [0, 4, 7, 11],
  m7:     [0, 3, 7, 10],
  mMaj7:  [0, 3, 7, 11],
  dim:    [0, 3, 6],
  dim7:   [0, 3, 6, 9],
  aug:    [0, 4, 8],
  add9:   [0, 4, 7, 14],
  '6':   [0, 4, 7, 9],
  m6:     [0, 3, 7, 9],
  '9':   [0, 4, 7, 10, 14],
  m9:     [0, 3, 7, 10, 14],
  '11':  [0, 4, 7, 10, 14, 17],
  '13':  [0, 4, 7, 10, 14, 17, 21],
};

export const CHORD_TYPE_LABELS: Record<ChordType, string> = {
  major:  'Major',
  minor:  'Minor',
  '5':   '5',
  sus2:   'sus2',
  sus4:   'sus4',
  '7':   '7',
  maj7:   'maj7',
  m7:     'm7',
  mMaj7:  'mMaj7',
  dim:    'dim',
  dim7:   'dim7',
  aug:    'aug',
  add9:   'add9',
  '6':   '6',
  m6:     'm6',
  '9':   '9',
  m9:     'm9',
  '11':  '11',
  '13':  '13',
};

export function chordToMIDI(chord: Chord, baseOctave = 3): number[] {
  const rootIndex = noteToIndex(chord.root);
  const intervals = CHORD_INTERVALS[chord.type];
  const rootMIDI = (baseOctave + 1) * 12 + rootIndex;

  return intervals.map((interval) => rootMIDI + interval);
}

export function chordToMIDIVoiced(chord: Chord, baseOctave = 3): number[] {
  const rootIndex = noteToIndex(chord.root);
  const intervals = CHORD_INTERVALS[chord.type];
  const rootMIDI = (baseOctave + 1) * 12 + rootIndex;

  return intervals.map((interval) => {
    const rawMIDI = rootMIDI + interval;
    if (interval >= 12) return rawMIDI - 12;
    return rawMIDI;
  });
}
