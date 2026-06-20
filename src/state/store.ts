import { create } from 'zustand';
import type { AppState, Measure, ChordBlock, TimeSignature, TransportState, Note, ChordType, Duration } from '../types/music';
import { generateId } from '../utils/id';
import { getBeatsForBlock } from '../utils/music';

interface Actions {
  setTempo: (bpm: number) => void;
  setTimeSignature: (ts: TimeSignature) => void;
  toggleMetronome: () => void;
  setTransportState: (state: TransportState) => void;

  addMeasure: () => void;
  removeMeasure: (measureId: string) => void;
  removeEmptyMeasures: () => void;

  addChordBlock: (measureId: string, block: ChordBlock) => void;
  removeChordBlock: (measureId: string, blockId: string) => void;
  duplicateChordBlock: (measureId: string, blockId: string) => void;
  moveChordBlock: (
    sourceMeasureId: string,
    targetMeasureId: string,
    blockId: string,
    targetIndex: number,
  ) => void;
  changeChordBlockDuration: (
    measureId: string,
    blockId: string,
    duration: Duration,
  ) => void;

  toggleChordBlockDotted: (measureId: string, blockId: string) => void;
  toggleChordBlockTriplet: (measureId: string, blockId: string) => void;

  selectRoot: (note: Note | null) => void;
  selectChordType: (type: ChordType | null) => void;

  selectBlock: (measureId: string | null, blockId: string | null) => void;

  setPlaybackPosition: (measureIndex: number, beatFraction: number) => void;

  toJSON: () => string;
  fromJSON: (json: string) => void;
}

export type StoreState = AppState & Actions;

export const useStore = create<StoreState>()((set, get) => ({
  tempo: 120,
  timeSignature: { beatsPerMeasure: 4, beatUnit: 4 },
  transportState: 'stopped',
  metronomeEnabled: true,

  currentMeasureIndex: 0,
  currentBeatFraction: 0,

  measures: [
    { id: generateId(), index: 0, blocks: [] },
    { id: generateId(), index: 1, blocks: [] },
    { id: generateId(), index: 2, blocks: [] },
    { id: generateId(), index: 3, blocks: [] },
  ],

  selectedRoot: null,
  selectedChordType: null,

  selectedBlockId: null,
  selectedBlockMeasureId: null,

  setTempo: (bpm) => set({ tempo: Math.max(20, Math.min(300, bpm)) }),

  setTimeSignature: (ts) => set({ timeSignature: ts }),

  toggleMetronome: () => set((s) => ({ metronomeEnabled: !s.metronomeEnabled })),

  setTransportState: (state) => set({ transportState: state }),

  addMeasure: () => {
    const { measures } = get();
    const newMeasure: Measure = {
      id: generateId(),
      index: measures.length,
      blocks: [],
    };
    set({ measures: [...measures, newMeasure] });
  },

  removeMeasure: (measureId) => {
    const { measures } = get();
    const filtered = measures
      .filter((m) => m.id !== measureId)
      .map((m, i) => ({ ...m, index: i }));
    set({ measures: filtered });
  },

  removeEmptyMeasures: () => {
    const { measures } = get();
    const filtered = measures
      .filter((m) => m.blocks.length > 0)
      .map((m, i) => ({ ...m, index: i }));
    set({ measures: filtered });
  },

  addChordBlock: (measureId, block) => {
    const { measures } = get();
    set({
      measures: measures.map((m) =>
        m.id === measureId ? { ...m, blocks: [...m.blocks, block] } : m,
      ),
    });
  },

  removeChordBlock: (measureId, blockId) => {
    const { measures } = get();
    set({
      measures: measures.map((m) =>
        m.id === measureId
          ? { ...m, blocks: m.blocks.filter((b) => b.id !== blockId) }
          : m,
      ),
    });
  },

  duplicateChordBlock: (measureId, blockId) => {
    const { measures } = get();
    set({
      measures: measures.map((m) => {
        if (m.id !== measureId) return m;
        const idx = m.blocks.findIndex((b) => b.id === blockId);
        if (idx === -1) return m;
        const original = m.blocks[idx];
        const copy: ChordBlock = { ...original, id: generateId(), chord: { ...original.chord } };
        const newBlocks = [...m.blocks];
        newBlocks.splice(idx + 1, 0, copy);
        return { ...m, blocks: newBlocks };
      }),
    });
  },

  moveChordBlock: (sourceMeasureId, targetMeasureId, blockId, targetIndex) => {
    const { measures } = get();
    let movingBlock: ChordBlock | null = null;

    const updated = measures.map((m) => {
      if (m.id === sourceMeasureId) {
        const idx = m.blocks.findIndex((b) => b.id === blockId);
        if (idx !== -1) {
          movingBlock = m.blocks[idx];
          return { ...m, blocks: m.blocks.filter((b) => b.id !== blockId) };
        }
      }
      return m;
    });

    if (!movingBlock) return;

    set({
      measures: updated.map((m) => {
        if (m.id === targetMeasureId) {
          const newBlocks = [...m.blocks];
          const clampedIndex = Math.min(targetIndex, newBlocks.length);
          newBlocks.splice(clampedIndex, 0, movingBlock!);
          return { ...m, blocks: newBlocks };
        }
        return m;
      }),
    });
  },

  changeChordBlockDuration: (measureId, blockId, duration) => {
    const { measures, timeSignature } = get();
    const measure = measures.find((m) => m.id === measureId);
    if (!measure) return;

    const block = measure.blocks.find((b) => b.id === blockId);
    if (!block) return;

    const otherBeats = measure.blocks
      .filter((b) => b.id !== blockId)
      .reduce((sum, b) => sum + getBeatsForBlock(b, timeSignature), 0);

    const newBeats = getBeatsForBlock({ duration, dotted: block.dotted, triplet: block.triplet }, timeSignature);

    if (otherBeats + newBeats > timeSignature.beatsPerMeasure + 0.001) return;

    set({
      measures: measures.map((m) =>
        m.id === measureId
          ? {
              ...m,
              blocks: m.blocks.map((b) =>
                b.id === blockId ? { ...b, duration } : b,
              ),
            }
          : m,
      ),
    });
  },

  toggleChordBlockDotted: (measureId, blockId) => {
    const { measures, timeSignature } = get();
    const measure = measures.find((m) => m.id === measureId);
    if (!measure) return;

    const block = measure.blocks.find((b) => b.id === blockId);
    if (!block) return;

    const newDotted = !block.dotted;

    const otherBeats = measure.blocks
      .filter((b) => b.id !== blockId)
      .reduce((sum, b) => sum + getBeatsForBlock(b, timeSignature), 0);

    const newBeats = getBeatsForBlock({ ...block, dotted: newDotted }, timeSignature);
    if (otherBeats + newBeats > timeSignature.beatsPerMeasure + 0.001) return;

    set({
      measures: measures.map((m) =>
        m.id === measureId
          ? {
              ...m,
              blocks: m.blocks.map((b) =>
                b.id === blockId ? { ...b, dotted: newDotted } : b,
              ),
            }
          : m,
      ),
    });
  },

  toggleChordBlockTriplet: (measureId, blockId) => {
    const { measures, timeSignature } = get();
    const measure = measures.find((m) => m.id === measureId);
    if (!measure) return;

    const block = measure.blocks.find((b) => b.id === blockId);
    if (!block) return;

    const newTriplet = !block.triplet;

    const otherBeats = measure.blocks
      .filter((b) => b.id !== blockId)
      .reduce((sum, b) => sum + getBeatsForBlock(b, timeSignature), 0);

    const newBeats = getBeatsForBlock({ ...block, triplet: newTriplet }, timeSignature);
    if (otherBeats + newBeats > timeSignature.beatsPerMeasure + 0.001) return;

    set({
      measures: measures.map((m) =>
        m.id === measureId
          ? {
              ...m,
              blocks: m.blocks.map((b) =>
                b.id === blockId ? { ...b, triplet: newTriplet } : b,
              ),
            }
          : m,
      ),
    });
  },

  selectRoot: (note) => set({ selectedRoot: note }),

  selectChordType: (type) => set({ selectedChordType: type }),

  selectBlock: (measureId, blockId) =>
    set({ selectedBlockMeasureId: measureId, selectedBlockId: blockId }),

  setPlaybackPosition: (measureIndex, beatFraction) =>
    set({ currentMeasureIndex: measureIndex, currentBeatFraction: beatFraction }),

  toJSON: () => {
    const { measures, tempo, timeSignature, metronomeEnabled } = get();
    return JSON.stringify({ measures, tempo, timeSignature, metronomeEnabled });
  },

  fromJSON: (json) => {
    const data = JSON.parse(json);
    set({
      measures: data.measures ?? [],
      tempo: data.tempo ?? 120,
      timeSignature: data.timeSignature ?? { beatsPerMeasure: 4, beatUnit: 4 },
      metronomeEnabled: data.metronomeEnabled ?? true,
      transportState: 'stopped',
      currentMeasureIndex: 0,
      currentBeatFraction: 0,
    });
  },
}));
