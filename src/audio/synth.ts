import * as Tone from 'tone';

export function createChordSynth(): Tone.PolySynth {
  const filter = new Tone.Filter(1800, 'lowpass');
  const reverb = new Tone.Reverb({ decay: 2.0, wet: 0.25 });
  filter.connect(reverb);
  reverb.toDestination();

  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: 'triangle',
    },
    envelope: {
      attack: 0.003,
      decay: 0.8,
      sustain: 0.2,
      release: 1.4,
    },
    volume: -6,
  });
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
  const reverb = new Tone.Reverb({ decay: 1.0, wet: 0.2 });
  reverb.toDestination();

  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.4, sustain: 0.15, release: 0.6 },
    volume: -10,
  });
  synth.connect(reverb);
  synth.maxPolyphony = 16;
  return synth;
}
