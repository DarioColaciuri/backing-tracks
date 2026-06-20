import { useDraggable } from '@dnd-kit/react';
import { useStore } from '../../state/store';
import { selectCurrentChordSymbol } from '../../state/selectors';
import styles from './ChordChip.module.css';

export function ChordChip() {
  const chordSymbol = useStore(selectCurrentChordSymbol);
  const selectedRoot = useStore((s) => s.selectedRoot);
  const selectedChordType = useStore((s) => s.selectedChordType);

  const chord = selectedRoot && selectedChordType
    ? { root: selectedRoot, type: selectedChordType }
    : null;

  const { ref } = useDraggable({
    id: 'chord-palette',
    data: chord ? { type: 'chord-block' as const, chord } : undefined,
    disabled: !chord,
  });

  if (!chordSymbol) return null;

  return (
    <div ref={ref} className={styles.chip}>
      <div className={styles.symbol}>{chordSymbol}</div>
      <span className={styles.hint}>Drag to timeline</span>
    </div>
  );
}
