import * as Tone from 'tone';

export function createChordSynth(): Tone.PolySynth {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: 'triangle',
    },
    envelope: {
      attack: 0.005,
      decay: 0.4,
      sustain: 0.3,
      release: 0.8,
    },
    volume: -6,
  }).toDestination();
  synth.maxPolyphony = 32;
  return synth;
}

export function createTickSynth(): Tone.Synth {
  return new Tone.Synth({
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0.001,
      decay: 0.05,
      sustain: 0,
      release: 0.01,
    },
    volume: -8,
  }).toDestination();
}
