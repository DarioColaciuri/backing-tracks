import * as Tone from 'tone';
import type { Measure, TimeSignature } from '../types/music';
import { getBeatsForBlock } from '../utils/music';
import { chordToMIDI } from '../theory/chords';
import { createChordSynth, createTickSynth } from './synth';

export interface TimelineEntry {
  blockId: string;
  measureIndex: number;
  startBeat: number;
  endBeat: number;
  frequencies: number[];
}

export type PositionCallback = (measureIndex: number, beatFraction: number) => void;

interface PlaybackPosition {
  measureIndex: number;
  beatFraction: number;
}

export class PlaybackEngine {
  private synth = createChordSynth();
  private tickSynth = createTickSynth();
  private loop: Tone.Loop | null = null;
  private metronomeEventId: number | null = null;
  private activeFrequencies: number[] = [];
  private lastBlockId: string | null = null;
  private timeline: TimelineEntry[] = [];
  private totalBeats = 0;
  private onPositionChange: PositionCallback | null = null;
  private audioStarted = false;
  private currentPosition: PlaybackPosition = { measureIndex: 0, beatFraction: 0 };
  private playbackBeatsPerMeasure = 4;
  private playbackBeatUnit = 4;
  private isPlaying = false;

  async ensureAudio(): Promise<void> {
    if (!this.audioStarted) {
      await Tone.start();
      this.audioStarted = true;
    }
  }

  getPosition(): PlaybackPosition {
    return this.currentPosition;
  }

  buildTimeline(measures: Measure[], timeSignature: TimeSignature): void {
    this.timeline = [];
    let beatCursor = 0;

    for (const measure of measures) {
      for (const block of measure.blocks) {
        const beats = getBeatsForBlock(block, timeSignature);
        const midiNotes = chordToMIDI(block.chord, 4);
        const frequencies = midiNotes.map((n) =>
          Tone.Frequency(n, 'midi').toFrequency(),
        );
        this.timeline.push({
          blockId: block.id,
          measureIndex: measure.index,
          startBeat: beatCursor,
          endBeat: beatCursor + beats,
          frequencies,
        });
        beatCursor += beats;
      }
    }

    this.totalBeats = Math.max(beatCursor, 1);
  }

  play(
    measures: Measure[],
    timeSignature: TimeSignature,
    tempo: number,
    metronomeEnabled: boolean,
    onPositionChange: PositionCallback,
  ): void {
    this.stop();

    this.buildTimeline(measures, timeSignature);
    this.onPositionChange = onPositionChange;
    this.playbackBeatsPerMeasure = timeSignature.beatsPerMeasure;
    this.playbackBeatUnit = timeSignature.beatUnit;
    this.isPlaying = true;

    Tone.Transport.bpm.value = tempo;
    (Tone.Transport as any).timeSignature = [timeSignature.beatsPerMeasure, timeSignature.beatUnit];
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = `${this.totalBeats / timeSignature.beatsPerMeasure}m`;

    this.lastBlockId = null;
    this.activeFrequencies = [];
    this.currentPosition = { measureIndex: 0, beatFraction: 0 };

    this.loop = new Tone.Loop((time) => {
      const ticks = (Tone.Transport as any).ticks as number;
      const ppq = (Tone.Transport as any).PPQ || 192;
      const currentBeat = ticks / ppq;

      const wrappedBeat = this.totalBeats > 0
        ? ((currentBeat % this.totalBeats) + this.totalBeats) % this.totalBeats
        : 0;

      const entry = this.timeline.find(
        (e) => wrappedBeat >= e.startBeat && wrappedBeat < e.endBeat,
      );

      if (entry) {
        if (entry.blockId !== this.lastBlockId) {
          if (this.activeFrequencies.length > 0) {
            this.synth.triggerRelease(this.activeFrequencies, time);
          }

          this.synth.triggerAttack(entry.frequencies, time);
          this.activeFrequencies = entry.frequencies;
          this.lastBlockId = entry.blockId;
        }

        const beatInMeasure = wrappedBeat % timeSignature.beatsPerMeasure;
        this.currentPosition = {
          measureIndex: entry.measureIndex,
          beatFraction: beatInMeasure / timeSignature.beatsPerMeasure,
        };
        this.onPositionChange?.(entry.measureIndex, beatInMeasure / timeSignature.beatsPerMeasure);
      } else {
        if (this.activeFrequencies.length > 0) {
          this.synth.triggerRelease(this.activeFrequencies, time);
          this.activeFrequencies = [];
          this.lastBlockId = null;
        }
      }
    }, '16n').start(0);

    this.scheduleMetronome(timeSignature.beatsPerMeasure, timeSignature.beatUnit, metronomeEnabled);

    Tone.Transport.start('+0.1');
  }

  stop(): void {
    this.loop?.stop();
    this.loop?.dispose();
    this.loop = null;

    this.clearMetronome();

    if (this.activeFrequencies.length > 0) {
      this.synth.triggerRelease(this.activeFrequencies);
      this.activeFrequencies = [];
    }

    Tone.Transport.stop();
    Tone.Transport.cancel();
    this.lastBlockId = null;
    this.timeline = [];
    this.totalBeats = 0;
    this.currentPosition = { measureIndex: 0, beatFraction: 0 };
    this.isPlaying = false;
  }

  pause(): void {
    Tone.Transport.pause();
  }

  setTempo(tempo: number): void {
    Tone.Transport.bpm.value = tempo;
  }

  setMetronomeEnabled(enabled: boolean): void {
    if (!this.isPlaying) return;
    this.tickSynth.volume.value = enabled ? -8 : -Infinity;
  }

  private scheduleMetronome(beatsPerMeasure: number, beatUnit: number, audible: boolean): void {
    this.tickSynth.volume.value = audible ? -8 : -Infinity;

    this.metronomeEventId = Tone.Transport.scheduleRepeat((time) => {
      const pos = Tone.Transport.position as string;
      const parts = pos.split(':').map(Number);
      const quarters = parts[1] ?? 0;
      const beatIndex = ((quarters % beatsPerMeasure) + beatsPerMeasure) % beatsPerMeasure;

      if (beatIndex === 0) {
        this.tickSynth.triggerAttackRelease(880, 0.04, time);
      } else {
        this.tickSynth.triggerAttackRelease(660, 0.04, time);
      }
    }, `${beatUnit}n`, 0);
  }

  private clearMetronome(): void {
    if (this.metronomeEventId !== null) {
      Tone.Transport.clear(this.metronomeEventId);
      this.metronomeEventId = null;
    }
  }

  dispose(): void {
    this.stop();
    this.synth.dispose();
    this.tickSynth.dispose();
  }
}

export const playbackEngine = new PlaybackEngine();
