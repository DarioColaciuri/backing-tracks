import * as Tone from 'tone';
import type { Chord } from '../types/music';
import { chordToMIDI } from '../theory/chords';
import { createPreviewSynth } from './synth';

const previewSynth = createPreviewSynth();
let audioStarted = false;

async function ensureAudio(): Promise<void> {
  if (!audioStarted) {
    await Tone.start();
    audioStarted = true;
  }
}

async function getFrequencies(chord: Chord): Promise<number[]> {
  await ensureAudio();
  const midiNotes = chordToMIDI(chord, 4);
  return midiNotes.map((n) => Tone.Frequency(n, 'midi').toFrequency());
}

export async function previewChord(chord: Chord): Promise<void> {
  const freqs = await getFrequencies(chord);
  const now = Tone.now();
  previewSynth.triggerAttackRelease(freqs, 0.6, now);
}

export async function previewChordArpeggiated(chord: Chord): Promise<void> {
  const freqs = await getFrequencies(chord);
  const now = Tone.now();
  freqs.forEach((freq, i) => {
    previewSynth.triggerAttackRelease(freq, 0.4, now + i * 0.07);
  });
}
