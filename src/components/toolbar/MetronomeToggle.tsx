import { useStore } from '../../state/store';
import { playbackEngine } from '../../audio/engine';
import styles from './MetronomeToggle.module.css';

export function MetronomeToggle() {
  const metronomeEnabled = useStore((s) => s.metronomeEnabled);
  const toggleMetronome = useStore((s) => s.toggleMetronome);

  const handleToggle = () => {
    toggleMetronome();
    playbackEngine.setMetronomeEnabled(useStore.getState().metronomeEnabled);
  };

  return (
    <button
      className={`${styles.btn} ${metronomeEnabled ? styles.active : ''}`}
      onClick={handleToggle}
      title="Metronome"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <path d="M4 12l4-4h8l4 4" />
        <rect x="6" y="12" width="12" height="8" rx="1" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="8" y1="22" x2="16" y2="22" />
      </svg>
      <span className={styles.label}>Metronome</span>
    </button>
  );
}
