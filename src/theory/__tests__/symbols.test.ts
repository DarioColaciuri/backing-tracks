import { describe, it, expect } from 'vitest';
import { chordToSymbol } from '../symbols';
import type { Chord } from '../../types/music';

describe('chordToSymbol', () => {
  it('C major = C', () => {
    expect(chordToSymbol({ root: 'C', type: 'major' })).toBe('C');
  });

  it('C minor = Cm', () => {
    expect(chordToSymbol({ root: 'C', type: 'minor' })).toBe('Cm');
  });

  it('Cmaj7', () => {
    expect(chordToSymbol({ root: 'C', type: 'maj7' })).toBe('Cmaj7');
  });

  it('F#m', () => {
    expect(chordToSymbol({ root: 'F#', type: 'minor' })).toBe('F#m');
  });

  it('Bb7', () => {
    expect(chordToSymbol({ root: 'Bb', type: '7' })).toBe('Bb7');
  });

  it('Ebmaj7', () => {
    expect(chordToSymbol({ root: 'Eb', type: 'maj7' })).toBe('Ebmaj7');
  });

  it('C#dim', () => {
    expect(chordToSymbol({ root: 'C#', type: 'dim' })).toBe('C#dim');
  });

  it('Gsus4', () => {
    expect(chordToSymbol({ root: 'G', type: 'sus4' })).toBe('Gsus4');
  });

  it('minor with flat notation', () => {
    expect(chordToSymbol({ root: 'C#', type: 'minor' }, true)).toBe('Dbm');
  });

  it('C5 (power chord)', () => {
    expect(chordToSymbol({ root: 'C', type: '5' })).toBe('C5');
  });

  it('C13', () => {
    expect(chordToSymbol({ root: 'C', type: '13' })).toBe('C13');
  });

  it('all chord types produce valid non-empty strings', () => {
    const types = [
      'major', 'minor', '5', 'sus2', 'sus4',
      '7', 'maj7', 'm7', 'mMaj7', 'dim', 'dim7', 'aug',
      'add9', '6', 'm6', '9', 'm9', '11', '13',
    ] as const;
    for (const type of types) {
      const symbol = chordToSymbol({ root: 'C', type });
      expect(symbol).toBeTruthy();
      expect(symbol.length).toBeGreaterThan(0);
    }
  });
});
