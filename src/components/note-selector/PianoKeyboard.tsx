import { useStore } from '../../state/store';
import { NATURAL_NOTES, isBlackKey, ENHARMONIC_PAIRS } from '../../theory/notes';
import type { Note, NaturalNote, SharpNote, FlatNote } from '../../types/music';
import styles from './PianoKeyboard.module.css';

interface KeyDef {
  note: Note;
  type: 'white' | 'black';
  label: string;
  enharmonic?: string;
}

const OCTAVE_KEYS: KeyDef[] = [
  { note: 'C', type: 'white', label: 'C' },
  { note: 'C#', type: 'black', label: 'C#', enharmonic: 'Db' },
  { note: 'D', type: 'white', label: 'D' },
  { note: 'D#', type: 'black', label: 'D#', enharmonic: 'Eb' },
  { note: 'E', type: 'white', label: 'E' },
  { note: 'F', type: 'white', label: 'F' },
  { note: 'F#', type: 'black', label: 'F#', enharmonic: 'Gb' },
  { note: 'G', type: 'white', label: 'G' },
  { note: 'G#', type: 'black', label: 'G#', enharmonic: 'Ab' },
  { note: 'A', type: 'white', label: 'A' },
  { note: 'A#', type: 'black', label: 'A#', enharmonic: 'Bb' },
  { note: 'B', type: 'white', label: 'B' },
];

interface NoteOption {
  note: Note;
  label: string;
  type: 'white' | 'black';
}

export function PianoKeyboard() {
  const selectedRoot = useStore((s) => s.selectedRoot);
  const selectRoot = useStore((s) => s.selectRoot);

  const handleKeyClick = (option: NoteOption) => {
    selectRoot(selectedRoot === option.note ? null : option.note);
  };

  const whiteKeys = OCTAVE_KEYS.filter((k) => k.type === 'white');
  const blackKeys = OCTAVE_KEYS.filter((k) => k.type === 'black');

  return (
    <div className={styles.keyboard}>
      <div className={styles.whiteKeys}>
        {whiteKeys.map((key) => {
          const isSelected = selectedRoot === key.note;
          return (
            <button
              key={key.note}
              className={`${styles.whiteKey} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleKeyClick({ note: key.note, label: key.label, type: 'white' })}
            >
              <span className={styles.keyLabel}>{key.label}</span>
            </button>
          );
        })}
      </div>
      <div className={styles.blackKeys}>
        {blackKeys.map((key) => {
          const isSelected = selectedRoot === key.note || selectedRoot === key.enharmonic;
          const leftPos = getBlackKeyLeft(key.note as SharpNote);
          return (
            <div
              key={key.note}
              className={styles.blackKeyContainer}
              style={{ left: `${leftPos}%` }}
            >
              <div className={`${styles.blackKey} ${isSelected ? styles.selected : ''}`}>
                <button
                  className={`${styles.enharmonicBtn} ${styles.sharp} ${selectedRoot === key.note ? styles.activeLabel : ''}`}
                  onClick={() => handleKeyClick({ note: key.note, label: key.label!, type: 'black' })}
                >
                  {key.label}
                </button>
                <button
                  className={`${styles.enharmonicBtn} ${styles.flat} ${selectedRoot === key.enharmonic ? styles.activeLabel : ''}`}
                  onClick={() => handleKeyClick({ note: key.enharmonic as Note, label: key.enharmonic!, type: 'black' })}
                >
                  {key.enharmonic}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const BLACK_KEY_POSITIONS: Record<SharpNote, number> = {
  'C#': 12,
  'D#': 26,
  'F#': 54,
  'G#': 68,
  'A#': 82,
};

function getBlackKeyLeft(note: SharpNote): number {
  return BLACK_KEY_POSITIONS[note];
}
