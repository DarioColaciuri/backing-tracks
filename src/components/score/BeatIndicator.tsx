import type { ChordBlock, TimeSignature } from '../../types/music';
import styles from './BeatIndicator.module.css';

interface BeatIndicatorProps {
  blocks: ChordBlock[];
  timeSignature: TimeSignature;
}

export function BeatIndicator({ blocks, timeSignature }: BeatIndicatorProps) {
  const beats = timeSignature.beatsPerMeasure;
  const lines: number[] = [];

  for (let i = 1; i < beats; i++) {
    lines.push((i / beats) * 100);
  }

  return (
    <div className={styles.indicator}>
      {lines.map((pos, i) => (
        <div
          key={i}
          className={`${styles.line} ${i === 0 ? styles.downbeat : ''}`}
          style={{ left: `${pos}%` }}
        />
      ))}
    </div>
  );
}
