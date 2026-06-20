import { TempoControl } from './TempoControl';
import { TimeSignatureControl } from './TimeSignatureControl';
import { MetronomeToggle } from './MetronomeToggle';
import { TransportControls } from './TransportControls';
import styles from './Toolbar.module.css';

export function Toolbar() {
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <TempoControl />
        <div className={styles.divider} />
        <TimeSignatureControl />
        <div className={styles.divider} />
        <MetronomeToggle />
      </div>
      <div className={styles.center}>
        <TransportControls />
      </div>
      <div className={styles.right} />
    </div>
  );
}
