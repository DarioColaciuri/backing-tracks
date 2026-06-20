import { describe, it, expect } from 'vitest';
import {
  noteToIndex,
  indexToNote,
  noteToMidi,
  midiToNote,
  isNatural,
  isSharp,
  isFlat,
  isBlackKey,
  getEnharmonic,
  ALL_NOTES,
  ENHARMONIC_PAIRS,
} from '../notes';

describe('noteToIndex', () => {
  it('converts C to 0', () => expect(noteToIndex('C')).toBe(0));
  it('converts C# to 1', () => expect(noteToIndex('C#')).toBe(1));
  it('converts Db to 1', () => expect(noteToIndex('Db')).toBe(1));
  it('converts B to 11', () => expect(noteToIndex('B')).toBe(11));

  it('all natural notes map correctly', () => {
    expect(noteToIndex('C')).toBe(0);
    expect(noteToIndex('D')).toBe(2);
    expect(noteToIndex('E')).toBe(4);
    expect(noteToIndex('F')).toBe(5);
    expect(noteToIndex('G')).toBe(7);
    expect(noteToIndex('A')).toBe(9);
    expect(noteToIndex('B')).toBe(11);
  });

  it('all sharp/flat pairs map to same index', () => {
    for (const [sharp, flat] of ENHARMONIC_PAIRS) {
      expect(noteToIndex(sharp)).toBe(noteToIndex(flat));
    }
  });
});

describe('indexToNote', () => {
  it('converts 0 to C (sharp default)', () => expect(indexToNote(0)).toBe('C'));
  it('converts 1 to C# by default', () => expect(indexToNote(1)).toBe('C#'));
  it('converts 1 to Db when preferFlat', () => expect(indexToNote(1, true)).toBe('Db'));
  it('converts 6 to F# by default', () => expect(indexToNote(6)).toBe('F#'));
  it('converts 6 to Gb when preferFlat', () => expect(indexToNote(6, true)).toBe('Gb'));
});

describe('midiToNote / noteToMidi', () => {
  it('MIDI 60 is C4', () => {
    const result = midiToNote(60);
    expect(result.note).toBe('C');
    expect(result.octave).toBe(4);
  });

  it('MIDI 61 is C#4', () => {
    expect(midiToNote(61).note).toBe('C#');
    expect(midiToNote(61).octave).toBe(4);
  });

  it('roundtrips: note + octave -> MIDI -> note + octave', () => {
    for (const note of ALL_NOTES) {
      const midi = noteToMidi(note, 4);
      const result = midiToNote(midi);
      expect(result.octave).toBe(4);
    }
  });
});

describe('isNatural / isSharp / isFlat / isBlackKey', () => {
  it('C is natural', () => expect(isNatural('C')).toBe(true));
  it('C# is not natural', () => expect(isNatural('C#')).toBe(false));
  it('C# is sharp', () => expect(isSharp('C#')).toBe(true));
  it('Db is flat', () => expect(isFlat('Db')).toBe(true));
  it('Db is not sharp', () => expect(isSharp('Db')).toBe(false));
  it('C# is black key', () => expect(isBlackKey('C#')).toBe(true));
  it('Db is black key', () => expect(isBlackKey('Db')).toBe(true));
  it('C is not black key', () => expect(isBlackKey('C')).toBe(false));
});

describe('getEnharmonic', () => {
  it('C# -> Db', () => expect(getEnharmonic('C#')).toBe('Db'));
  it('Db -> C#', () => expect(getEnharmonic('Db')).toBe('C#'));
  it('F# -> Gb', () => expect(getEnharmonic('F#')).toBe('Gb'));
  it('natural notes return themselves', () => expect(getEnharmonic('C')).toBe('C'));
});
