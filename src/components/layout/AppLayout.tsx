import { DragDropProvider } from '@dnd-kit/react';
import { useStore } from '../../state/store';
import { generateId } from '../../utils/id';
import { canFitDuration, findBestFit, getTotalBeatsInMeasure } from '../../utils/music';
import type { ChordBlock } from '../../types/music';
import { Toolbar } from '../toolbar/Toolbar';
import { PianoKeyboard } from '../note-selector/PianoKeyboard';
import { ChordTypeGrid } from '../chord-selector/ChordTypeGrid';
import { ChordPalette } from '../chord-palette/ChordPalette';
import { Score } from '../score/Score';
import styles from './AppLayout.module.css';

export function AppLayout() {
  const addChordBlock = useStore((s) => s.addChordBlock);
  const moveChordBlock = useStore((s) => s.moveChordBlock);
  const measures = useStore((s) => s.measures);
  const timeSignature = useStore((s) => s.timeSignature);
  const selectBlock = useStore((s) => s.selectBlock);

  const handleDragEnd = (event: any) => {
    if (event.canceled) return;
    selectBlock(null, null);

    const op = event.operation;
    if (!op) return;

    const source = op.source;
    const target = op.target;
    if (!source || !target) return;

    if (source.id === 'chord-palette') {
      const chord = source.data?.chord;
      if (!chord) return;
      const targetMeasureId = target.data?.measureId ?? target.id;
      if (!targetMeasureId) return;

      const targetMeasure = measures.find((m) => m.id === targetMeasureId);
      if (!targetMeasure) return;

      const used = getTotalBeatsInMeasure(targetMeasure.blocks, timeSignature);
      const remaining = timeSignature.beatsPerMeasure - used;
      const fit = findBestFit(remaining, timeSignature);
      if (!fit) return;

      const block: ChordBlock = {
        id: generateId(),
        chord: { root: chord.root, type: chord.type },
        duration: fit.duration,
        dotted: fit.dotted,
        triplet: fit.triplet,
      };
      addChordBlock(targetMeasureId, block);
      return;
    }

    const sourceGroup = source.group;
    if (sourceGroup) {
      const blockId = source.id as string;
      const sourceMeasureId = sourceGroup as string;

      const targetGroup = target.group;
      const targetSortableIndex = target.sortable?.index;
      const targetDataMeasureId = target.data?.measureId;

      let targetMeasureId: string;
      let targetMeasure = measures.find((m) => m.id === targetGroup);
      if (targetMeasure) {
        targetMeasureId = targetGroup as string;
      } else if (targetDataMeasureId) {
        targetMeasureId = targetDataMeasureId as string;
        targetMeasure = measures.find((m) => m.id === targetDataMeasureId);
      } else {
        targetMeasureId = target.id;
        targetMeasure = measures.find((m) => m.id === target.id);
      }

      if (!targetMeasureId || sourceMeasureId === targetMeasureId) {
        if (targetGroup) {
          moveChordBlock(sourceMeasureId, sourceMeasureId, blockId, targetSortableIndex ?? 0);
        }
        return;
      }

      const sourceMeasure = measures.find((m) => m.id === sourceMeasureId);
      const movingBlock = sourceMeasure?.blocks.find((b) => b.id === blockId);
        if (movingBlock && targetMeasure) {
        if (!canFitDuration(targetMeasure.blocks, movingBlock.duration, timeSignature, movingBlock.dotted, movingBlock.triplet)) return;
      }

      const targetIndex = targetMeasure?.blocks.length ?? 0;
      moveChordBlock(sourceMeasureId, targetMeasureId, blockId, targetIndex);
    }
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className={styles.layout}>
        <Toolbar />
        <div className={styles.body}>
          <div className={styles.sidebar}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Note Selector</div>
              <PianoKeyboard />
            </div>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Chord Type</div>
              <ChordTypeGrid />
            </div>
            <ChordPalette />
          </div>
          <div className={styles.main}>
            <Score />
          </div>
        </div>
      </div>
    </DragDropProvider>
  );
}
