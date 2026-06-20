import { useStore } from '../../state/store';
import styles from './TempoControl.module.css';

export function TempoControl() {
  const tempo = useStore((s) => s.tempo);
  const setTempo = useStore((s) => s.setTempo);

  return (
    <div className={styles.container}>
      <label className={styles.label}>BPM</label>
      <div className={styles.controls}>
        <button className={styles.stepBtn} onClick={() => setTempo(tempo - 1)} disabled={tempo <= 20}>
          -
        </button>
        <input
          className={styles.input}
          type="number"
          value={tempo}
          min={20}
          max={300}
          onChange={(e) => setTempo(Number(e.target.value))}
        />
        <button className={styles.stepBtn} onClick={() => setTempo(tempo + 1)} disabled={tempo >= 300}>
          +
        </button>
      </div>
    </div>
  );
}
