import type { Duration, TimeSignature, ChordBlock } from '../types/music';

export const DURATION_BEAT_FRACTIONS: Record<Duration, number> = {
  whole: 1,
  half: 0.5,
  quarter: 0.25,
  eighth: 0.125,
};

export function getBeatsForBlock(block: { duration: Duration; dotted: boolean; triplet: boolean }, timeSignature: TimeSignature): number {
  let beats = DURATION_BEAT_FRACTIONS[block.duration] * timeSignature.beatsPerMeasure;
  if (block.dotted) beats *= 1.5;
  if (block.triplet) beats *= 2 / 3;
  return beats;
}

export function getDurationFraction(block: { duration: Duration; dotted: boolean; triplet: boolean }): number {
  let fraction = DURATION_BEAT_FRACTIONS[block.duration];
  if (block.dotted) fraction *= 1.5;
  if (block.triplet) fraction *= 2 / 3;
  return fraction;
}

export function getTotalBeatsInMeasure(blocks: { duration: Duration; dotted: boolean; triplet: boolean }[], timeSignature: TimeSignature): number {
  return blocks.reduce((sum, b) => sum + getBeatsForBlock(b, timeSignature), 0);
}

export function canFitDuration(
  blocks: { duration: Duration; dotted: boolean; triplet: boolean }[],
  newDuration: Duration,
  timeSignature: TimeSignature,
  dotted = false,
  triplet = false,
): boolean {
  const used = getTotalBeatsInMeasure(blocks, timeSignature);
  const needed = getBeatsForBlock({ duration: newDuration, dotted, triplet }, timeSignature);
  return used + needed <= timeSignature.beatsPerMeasure + 0.001;
}

const DURATIONS: Duration[] = ['whole', 'half', 'quarter', 'eighth'];

export function findBestFit(
  remainingBeats: number,
  timeSignature: TimeSignature,
): { duration: Duration; dotted: boolean; triplet: boolean } | null {
  if (remainingBeats <= 0) return null;

  const combos: { duration: Duration; dotted: boolean; triplet: boolean; beats: number }[] = [];

  for (const duration of DURATIONS) {
    for (const dotted of [false, true]) {
      for (const triplet of [false, true]) {
        const beats = getBeatsForBlock({ duration, dotted, triplet }, timeSignature);
        combos.push({ duration, dotted, triplet, beats });
      }
    }
  }

  combos.sort((a, b) => {
    if (b.beats !== a.beats) return b.beats - a.beats;
    if (a.dotted !== b.dotted) return a.dotted ? 1 : -1;
    if (a.triplet !== b.triplet) return a.triplet ? 1 : -1;
    return 0;
  });

  for (const combo of combos) {
    if (combo.beats <= remainingBeats + 0.001) {
      return { duration: combo.duration, dotted: combo.dotted, triplet: combo.triplet };
    }
  }

  return null;
}
