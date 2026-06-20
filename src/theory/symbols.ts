import type { Chord, Note } from '../types/music';
import { getEnharmonic } from './notes';

export function chordToSymbol(chord: Chord, preferFlat = false): string {
  let root = chord.root;
  if (preferFlat && root.includes('#')) {
    root = getEnharmonic(root) as Note;
  }
  return root + chordTypeSuffix(chord.type);
}

function chordTypeSuffix(type: string): string {
  switch (type) {
    case 'major': return '';
    case 'minor': return 'm';
    default: return type;
  }
}
