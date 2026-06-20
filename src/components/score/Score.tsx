import { useCallback } from 'react';
import { useStore } from '../../state/store';
import { Measure } from './Measure';
import { MeasureListHeader } from './MeasureListHeader';
import { ChordToolbar } from './ChordToolbar';
import styles from './Score.module.css';

const STAFF_LINES = [0, 1, 2, 3, 4];

export function Score() {
  const measures = useStore((s) => s.measures);
  const selectBlock = useStore((s) => s.selectBlock);
  const selectedBlockId = useStore((s) => s.selectedBlockId);

  const handleScoreClick = useCallback(() => {
    if (selectedBlockId) {
      selectBlock(null, null);
    }
  }, [selectedBlockId, selectBlock]);

  const rows: typeof measures[] = [];
  for (let i = 0; i < measures.length; i += 4) {
    rows.push(measures.slice(i, i + 4));
  }

  return (
    <div className={styles.container}>
      <MeasureListHeader />
      <ChordToolbar />
      <div className={styles.score} onClick={handleScoreClick}>
        {measures.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Add a measure to start building your chord progression</p>
          </div>
        ) : (
          rows.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.rowWrapper}>
              <div className={styles.rowNumber}>{rowIndex * 4 + 1}</div>
              <div className={styles.row}>
                <div className={styles.staffLines}>
                  {STAFF_LINES.map((i) => (
                    <div
                      key={i}
                      className={styles.staffLine}
                      style={{ top: `${14 + i * 13}px` }}
                    />
                  ))}
                </div>
                <div className={styles.measures}>
                  {row.map((measure) => (
                    <Measure key={measure.id} measure={measure} />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
