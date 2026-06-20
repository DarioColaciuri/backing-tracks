import * as Tone from 'tone';

export function createChordSynth(): Tone.PolySynth {
  const filter = new Tone.Filter(2500, 'lowpass');
  const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 });
  filter.connect(reverb);
  reverb.toDestination();

  const synth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3,
    modulationIndex: 12,
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0.001,
      decay: 1.8,
      sustain: 0.02,
      release: 2.2,
    },
    modulation: {
      type: 'sine',
    },
    modulationEnvelope: {
      attack: 0.001,
      decay: 0.6,
      sustain: 0,
      release: 0.3,
    },
    volume: -5,
  } as any);
  synth.connect(filter);
  synth.maxPolyphony = 32;
  return synth;
}

export function createTickSynth(): Tone.Synth {
  return new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.01 },
    volume: -8,
  }).toDestination();
}

export function createPreviewSynth(): Tone.PolySynth {
  const synth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3,
    modulationIndex: 8,
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.002,
      decay: 0.6,
      sustain: 0.01,
      release: 0.8,
    },
    modulation: { type: 'sine' },
    modulationEnvelope: {
      attack: 0.001,
      decay: 0.3,
      sustain: 0,
      release: 0.2,
    },
    volume: -10,
  } as any);
  synth.maxPolyphony = 16;
  synth.toDestination();
  return synth;
}
