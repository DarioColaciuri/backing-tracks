import { usePlayback } from '../../hooks/usePlayback';
import styles from './TransportControls.module.css';

export function TransportControls() {
  const { togglePlay, stop, transportState } = usePlayback();
  const isPlaying = transportState === 'playing';

  return (
    <div className={styles.container}>
      <button
        className={`${styles.btn} ${styles.stop}`}
        onClick={stop}
        title="Stop"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="1" />
        </svg>
      </button>
      <button
        className={`${styles.btn} ${styles.play} ${isPlaying ? styles.playing : ''}`}
        onClick={togglePlay}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="3" width="4" height="18" rx="1" />
            <rect x="15" y="3" width="4" height="18" rx="1" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 3l15 9-15 9V3z" />
          </svg>
        )}
      </button>
    </div>
  );
}
