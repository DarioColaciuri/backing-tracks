import { useStore } from '../../state/store';
import { selectCurrentChordSymbol, selectCanAddChord } from '../../state/selectors';
import { ChordChip } from './ChordChip';
import styles from './ChordPalette.module.css';

export function ChordPalette() {
  const selectedRoot = useStore((s) => s.selectedRoot);
  const selectedChordType = useStore((s) => s.selectedChordType);
  const chordSymbol = useStore(selectCurrentChordSymbol);
  const canAddChord = useStore(selectCanAddChord);

  return (
    <div className={styles.palette}>
      <div className={styles.header}>
        <span className={styles.title}>Chord Builder</span>
      </div>
      <div className={styles.body}>
        <div className={styles.info}>
          <span className={styles.label}>Root:</span>
          <span className={styles.value}>{selectedRoot ?? '—'}</span>
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Type:</span>
          <span className={styles.value}>
            {selectedChordType ?? '—'}
          </span>
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Chord:</span>
          <span className={`${styles.value} ${styles.symbol}`}>
            {chordSymbol ?? '—'}
          </span>
        </div>
        {canAddChord && <ChordChip />}
      </div>
    </div>
  );
}
