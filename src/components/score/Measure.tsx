import { useDroppable } from '@dnd-kit/react';
import type { Measure as MeasureType } from '../../types/music';
import { ChordBlockItem } from './ChordBlock';
import { BeatIndicator } from './BeatIndicator';
import { useStore } from '../../state/store';
import { findBestFit, getTotalBeatsInMeasure } from '../../utils/music';
import styles from './Measure.module.css';

interface MeasureProps {
  measure: MeasureType;
}

export function Measure({ measure }: MeasureProps) {
  const timeSignature = useStore((s) => s.timeSignature);
  const currentMeasureIndex = useStore((s) => s.currentMeasureIndex);
  const currentBeatFraction = useStore((s) => s.currentBeatFraction);
  const transportState = useStore((s) => s.transportState);
  const removeMeasure = useStore((s) => s.removeMeasure);

  const used = getTotalBeatsInMeasure(measure.blocks, timeSignature);
  const remaining = timeSignature.beatsPerMeasure - used;
  const isFull = findBestFit(remaining, timeSignature) === null;

  const { ref, isDropTarget } = useDroppable({
    id: measure.id,
    data: { type: 'measure', measureId: measure.id },
    disabled: isFull,
  });

  const isPlaying = transportState === 'playing';
  const isActive = isPlaying && currentMeasureIndex === measure.index;

  return (
    <div
      ref={ref}
      className={`${styles.measure} ${isDropTarget ? styles.over : ''} ${isActive ? styles.active : ''} ${isFull ? styles.full : ''}`}
      data-measure="true"
      data-measure-index={measure.index}
    >
      <button
        className={styles.deleteBtn}
        onClick={(e) => {
          e.stopPropagation();
          removeMeasure(measure.id);
        }}
        title="Delete measure"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </svg>
      </button>
      <div className={styles.measureNumber}>{measure.index + 1}</div>
      <div className={styles.content}>
        <BeatIndicator blocks={measure.blocks} timeSignature={timeSignature} />
        <div className={styles.blocks}>
          {measure.blocks.length === 0 ? (
            <div className={styles.dropHint}>Drop here</div>
          ) : (
            measure.blocks.map((block, index) => (
              <ChordBlockItem
                key={block.id}
                block={block}
                index={index}
                measureId={measure.id}
              />
            ))
          )}
        </div>
        {isActive && (
          <div
            className={styles.playhead}
            style={{ left: `${currentBeatFraction * 100}%` }}
          />
        )}
      </div>
    </div>
  );
}
