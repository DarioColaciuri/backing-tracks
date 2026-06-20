import { useStore } from '../../state/store';
import { CHORD_TYPE_LABELS } from '../../theory/chords';
import { CHORD_TYPES } from '../../types/music';
import type { ChordType } from '../../types/music';
import styles from './ChordTypeGrid.module.css';

export function ChordTypeGrid() {
  const selectedChordType = useStore((s) => s.selectedChordType);
  const selectChordType = useStore((s) => s.selectChordType);

  return (
    <div className={styles.grid}>
      {CHORD_TYPES.map((type: ChordType) => (
        <button
          key={type}
          className={`${styles.chip} ${selectedChordType === type ? styles.selected : ''}`}
          onClick={() => selectChordType(selectedChordType === type ? null : type)}
        >
          {CHORD_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
