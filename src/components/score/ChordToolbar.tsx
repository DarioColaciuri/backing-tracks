import { useStore } from '../../state/store';
import type { Duration } from '../../types/music';
import { chordToSymbol } from '../../theory/symbols';
import { getBeatsForBlock } from '../../utils/music';
import { NoteIcon } from './NoteIcon';
import styles from './ChordToolbar.module.css';

const DURATIONS: Duration[] = ['whole', 'half', 'quarter', 'eighth'];

export function ChordToolbar() {
  const selectedBlockId = useStore((s) => s.selectedBlockId);
  const selectedBlockMeasureId = useStore((s) => s.selectedBlockMeasureId);
  const measures = useStore((s) => s.measures);
  const timeSignature = useStore((s) => s.timeSignature);
  const changeChordBlockDuration = useStore((s) => s.changeChordBlockDuration);
  const toggleChordBlockDotted = useStore((s) => s.toggleChordBlockDotted);
  const toggleChordBlockTriplet = useStore((s) => s.toggleChordBlockTriplet);
  const duplicateChordBlock = useStore((s) => s.duplicateChordBlock);
  const removeChordBlock = useStore((s) => s.removeChordBlock);
  const selectBlock = useStore((s) => s.selectBlock);

  if (!selectedBlockId || !selectedBlockMeasureId) return null;

  const measure = measures.find((m) => m.id === selectedBlockMeasureId);
  if (!measure) return null;

  const block = measure.blocks.find((b) => b.id === selectedBlockId);
  if (!block) return null;

  const symbol = chordToSymbol(block.chord);

  const otherBeats = measure.blocks
    .filter((b) => b.id !== selectedBlockId)
    .reduce((sum, b) => sum + getBeatsForBlock(b, timeSignature), 0);

  const canFit = (duration: Duration) =>
    otherBeats + getBeatsForBlock({ duration, dotted: block.dotted, triplet: block.triplet }, timeSignature)
    <= timeSignature.beatsPerMeasure + 0.001;

  const canToggleDotted = () => {
    const newDotted = !block.dotted;
    return otherBeats + getBeatsForBlock({ ...block, dotted: newDotted }, timeSignature)
      <= timeSignature.beatsPerMeasure + 0.001;
  };

  const canToggleTriplet = () => {
    const newTriplet = !block.triplet;
    return otherBeats + getBeatsForBlock({ ...block, triplet: newTriplet }, timeSignature)
      <= timeSignature.beatsPerMeasure + 0.001;
  };

  const handleChangeDuration = (duration: Duration) => {
    if (!canFit(duration)) return;
    changeChordBlockDuration(selectedBlockMeasureId, selectedBlockId, duration);
  };

  const handleDuplicate = () => {
    duplicateChordBlock(selectedBlockMeasureId, selectedBlockId);
  };

  const handleDelete = () => {
    removeChordBlock(selectedBlockMeasureId, selectedBlockId);
    selectBlock(null, null);
  };

  return (
    <div className={styles.toolbar}>
      <span className={styles.symbol}>{symbol}</span>
      <div className={styles.divider} />
      <span className={styles.label}>Duration</span>
      <div className={styles.durations}>
        {DURATIONS.map((d) => {
          const fits = canFit(d);
          const isActive = block.duration === d;
          return (
            <button
              key={d}
              className={`${styles.durBtn} ${isActive ? styles.durActive : ''} ${!fits ? styles.durDisabled : ''}`}
              onClick={() => handleChangeDuration(d)}
              disabled={!fits}
              title={!fits ? 'Not enough space' : d}
            >
              <NoteIcon duration={d} size={16} />
            </button>
          );
        })}
      </div>
      <div className={styles.divider} />
      <button
        className={`${styles.modBtn} ${block.dotted ? styles.modActive : ''} ${!canToggleDotted() && !block.dotted ? styles.modDisabled : ''}`}
        onClick={() => toggleChordBlockDotted(selectedBlockMeasureId, selectedBlockId)}
        disabled={!canToggleDotted() && !block.dotted}
        title={block.dotted ? 'Remove dot' : 'Dotted'}
      >
        <span className={styles.modIcon}>&#x2022;</span>
        <span className={styles.modLabel}>Dotted</span>
      </button>
      <button
        className={`${styles.modBtn} ${block.triplet ? styles.modActive : ''} ${!canToggleTriplet() && !block.triplet ? styles.modDisabled : ''}`}
        onClick={() => toggleChordBlockTriplet(selectedBlockMeasureId, selectedBlockId)}
        disabled={!canToggleTriplet() && !block.triplet}
        title={block.triplet ? 'Remove triplet' : 'Triplet'}
      >
        <span className={styles.modIcon}>3</span>
        <span className={styles.modLabel}>Triplet</span>
      </button>
      <div className={styles.divider} />
      <button className={styles.actionBtn} onClick={handleDuplicate} title="Duplicate">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="8" y="8" width="12" height="12" rx="1" />
          <path d="M16 8V6a1 1 0 00-1-1H6a1 1 0 00-1 1v9a1 1 0 001 1h2" />
        </svg>
        <span>Duplicate</span>
      </button>
      <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={handleDelete} title="Delete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </svg>
        <span>Delete</span>
      </button>
    </div>
  );
}
