import { useSortable } from '@dnd-kit/react/sortable';
import type { ChordBlock } from '../../types/music';
import { chordToSymbol } from '../../theory/symbols';
import { getDurationFraction } from '../../utils/music';
import { useStore } from '../../state/store';
import { previewChordArpeggiated } from '../../audio/preview';
import { NoteIcon } from './NoteIcon';
import styles from './ChordBlock.module.css';

interface ChordBlockItemProps {
  block: ChordBlock;
  index: number;
  measureId: string;
}

export function ChordBlockItem({ block, index, measureId }: ChordBlockItemProps) {
  const selectBlock = useStore((s) => s.selectBlock);
  const selectedBlockId = useStore((s) => s.selectedBlockId);

  const { ref } = useSortable({
    id: block.id,
    index,
    group: measureId,
  });

  const symbol = chordToSymbol(block.chord);
  const fraction = getDurationFraction(block);
  const isSelected = selectedBlockId === block.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectBlock(measureId, block.id);
    previewChordArpeggiated(block.chord);
  };

  let suffix = '';
  if (block.dotted) suffix += '\xB7';
  if (block.triplet) suffix += '\xB3';

  return (
    <div
      ref={ref}
      className={`${styles.block} ${isSelected ? styles.selected : ''}`}
      style={{ flex: `0 0 calc(${fraction * 100}% - 3px)` }}
      onClick={handleClick}
    >
      <div className={styles.content}>
        <div className={styles.topRow}>
          <span className={styles.symbol}>{symbol}</span>
          {suffix && <span className={styles.suffix}>{suffix}</span>}
        </div>
        <NoteIcon duration={block.duration} size={12} dotted={block.dotted} triplet={block.triplet} />
      </div>
    </div>
  );
}
