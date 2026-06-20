import { useStore } from '../../state/store';
import { Button } from '../common/Button';
import styles from './MeasureListHeader.module.css';

export function MeasureListHeader() {
  const addMeasure = useStore((s) => s.addMeasure);
  const removeEmptyMeasures = useStore((s) => s.removeEmptyMeasures);
  const hasEmptyMeasures = useStore((s) =>
    s.measures.some((m) => m.blocks.length === 0),
  );

  return (
    <div className={styles.header}>
      <span className={styles.title}>Timeline</span>
      <div className={styles.actions}>
        <Button variant="ghost" size="sm" onClick={addMeasure}>
          + Add Measure
        </Button>
        {hasEmptyMeasures && (
          <Button variant="ghost" size="sm" onClick={removeEmptyMeasures}>
            Clear Empty
          </Button>
        )}
      </div>
    </div>
  );
}
