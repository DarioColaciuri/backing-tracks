import type { StoreState } from './store';
import { chordToSymbol } from '../theory/symbols';
import type { Chord } from '../types/music';

export const selectCurrentChordSymbol = (state: StoreState): string | null => {
  const { selectedRoot, selectedChordType } = state;
  if (!selectedRoot || !selectedChordType) return null;
  return chordToSymbol({ root: selectedRoot, type: selectedChordType });
};

export const selectCurrentChord = (state: StoreState): Chord | null => {
  const { selectedRoot, selectedChordType } = state;
  if (!selectedRoot || !selectedChordType) return null;
  return { root: selectedRoot, type: selectedChordType };
};

export const selectIsPlaying = (state: StoreState): boolean =>
  state.transportState === 'playing';

export const selectHasMeasures = (state: StoreState): boolean =>
  state.measures.length > 0;

export const selectCanAddChord = (state: StoreState): boolean =>
  state.selectedRoot !== null && state.selectedChordType !== null;
