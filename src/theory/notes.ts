import type { Note, NoteIndex, NaturalNote, SharpNote, FlatNote } from '../types/music';

export const NATURAL_NOTES: NaturalNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const SHARP_NOTES: SharpNote[] = ['C#', 'D#', 'F#', 'G#', 'A#'];
export const FLAT_NOTES: FlatNote[] = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'];

export const ENHARMONIC_PAIRS: [SharpNote, FlatNote][] = [
  ['C#', 'Db'],
  ['D#', 'Eb'],
  ['F#', 'Gb'],
  ['G#', 'Ab'],
  ['A#', 'Bb'],
];

export const ALL_NOTES: Note[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
];

const NOTE_TO_INDEX: Record<Note, NoteIndex> = {
  C: 0, 'C#': 1, Db: 1,
  D: 2, 'D#': 3, Eb: 3,
  E: 4,
  F: 5, 'F#': 6, Gb: 6,
  G: 7, 'G#': 8, Ab: 8,
  A: 9, 'A#': 10, Bb: 10,
  B: 11,
};

const INDEX_TO_NOTE_SHARP: Note[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
];

const INDEX_TO_NOTE_FLAT: Note[] = [
  'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',
];

export function noteToIndex(note: Note): NoteIndex {
  return NOTE_TO_INDEX[note];
}

export function indexToNote(index: number, preferFlat = false): Note {
  const i = ((index % 12) + 12) % 12 as NoteIndex;
  return preferFlat ? INDEX_TO_NOTE_FLAT[i] : INDEX_TO_NOTE_SHARP[i];
}

export function midiToNote(midi: number, preferFlat = false): { note: Note; octave: number } {
  const octave = Math.floor(midi / 12) - 1;
  return { note: indexToNote(midi % 12, preferFlat), octave };
}

export function noteToMidi(note: Note, octave: number): number {
  return (octave + 1) * 12 + noteToIndex(note);
}

export function isNatural(note: Note): note is NaturalNote {
  return NATURAL_NOTES.includes(note as NaturalNote);
}

export function isSharp(note: Note): note is SharpNote {
  return SHARP_NOTES.includes(note as SharpNote);
}

export function isFlat(note: Note): note is FlatNote {
  return FLAT_NOTES.includes(note as FlatNote);
}

export function isBlackKey(note: Note): boolean {
  return isSharp(note) || isFlat(note);
}

export function getEnharmonic(note: Note): Note {
  for (const [sharp, flat] of ENHARMONIC_PAIRS) {
    if (note === sharp) return flat;
    if (note === flat) return sharp;
  }
  return note;
}
