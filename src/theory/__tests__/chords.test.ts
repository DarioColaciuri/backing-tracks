import { describe, it, expect } from 'vitest';
import { chordToMIDI, chordToMIDIVoiced, CHORD_INTERVALS, CHORD_TYPE_LABELS } from '../chords';
import { CHORD_TYPES, type ChordType } from '../../types/music';

describe('CHORD_INTERVALS', () => {
  it('major triad = root, major 3rd, perfect 5th', () => {
    expect(CHORD_INTERVALS.major).toEqual([0, 4, 7]);
  });

  it('minor triad = root, minor 3rd, perfect 5th', () => {
    expect(CHORD_INTERVALS.minor).toEqual([0, 3, 7]);
  });

  it('maj7 = root, 3, 5, 7', () => {
    expect(CHORD_INTERVALS.maj7).toEqual([0, 4, 7, 11]);
  });

  it('7 = root, 3, 5, b7', () => {
    expect(CHORD_INTERVALS['7']).toEqual([0, 4, 7, 10]);
  });

  it('dim = root, b3, b5', () => {
    expect(CHORD_INTERVALS.dim).toEqual([0, 3, 6]);
  });

  it('dim7 = root, b3, b5, bb7', () => {
    expect(CHORD_INTERVALS.dim7).toEqual([0, 3, 6, 9]);
  });

  it('aug = root, 3, #5', () => {
    expect(CHORD_INTERVALS.aug).toEqual([0, 4, 8]);
  });

  it('9 chord spans correct intervals including 9th', () => {
    expect(CHORD_INTERVALS['9']).toEqual([0, 4, 7, 10, 14]);
  });

  it('all chord types have at least root note', () => {
    for (const type of CHORD_TYPES) {
      expect(CHORD_INTERVALS[type][0]).toBe(0);
    }
  });

  it('every chord type has a label', () => {
    for (const type of CHORD_TYPES) {
      expect(CHORD_TYPE_LABELS[type]).toBeDefined();
      expect(typeof CHORD_TYPE_LABELS[type]).toBe('string');
    }
  });
});

describe('chordToMIDI', () => {
  it('C major at octave 3 = C3, E3, G3', () => {
    const notes = chordToMIDI({ root: 'C', type: 'major' }, 3);
    expect(notes).toEqual([48, 52, 55]); // C3=48, E3=52, G3=55
  });

  it('Cm = C3, Eb3, G3', () => {
    const notes = chordToMIDI({ root: 'C', type: 'minor' }, 3);
    expect(notes).toEqual([48, 51, 55]); // C3=48, Eb3=51, G3=55
  });

  it('Cmaj7 = C3, E3, G3, B3', () => {
    const notes = chordToMIDI({ root: 'C', type: 'maj7' }, 3);
    expect(notes).toEqual([48, 52, 55, 59]); // C3, E3, G3, B3
  });

  it('Em = E3, G3, B3', () => {
    const notes = chordToMIDI({ root: 'E', type: 'minor' }, 3);
    expect(notes).toEqual([52, 55, 59]); // E3=52, G3=55, B3=59
  });

  it('Dm7 = D3, F3, A3, C4', () => {
    const notes = chordToMIDI({ root: 'D', type: 'm7' }, 3);
    expect(notes).toEqual([50, 53, 57, 60]); // D3=50, F3=53, A3=57, C4=60
  });

  it('C9 extensions span octave: C3, E3, G3, Bb3, D4', () => {
    const notes = chordToMIDI({ root: 'C', type: '9' }, 3);
    expect(notes).toEqual([48, 52, 55, 58, 62]); // C3, E3, G3, Bb3=58, D4=62
  });
});

describe('chordToMIDIVoiced', () => {
  it('C major voiced within octave', () => {
    const notes = chordToMIDIVoiced({ root: 'C', type: 'major' }, 3);
    expect(notes).toEqual([48, 52, 55]);
  });

  it('C9 voiced: extensions folded down', () => {
    const notes = chordToMIDIVoiced({ root: 'C', type: '9' }, 3);
    expect(notes).toEqual([48, 52, 55, 58, 50]); // 9th (14) folded: 48+14-12=50 (D3)
  });
});
