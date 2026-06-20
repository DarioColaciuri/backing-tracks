import { useStore } from '../../state/store';
import type { TimeSignature } from '../../types/music';
import { Select } from '../common/Select';

const TIME_SIGNATURES: { value: string; label: string; ts: TimeSignature }[] = [
  { value: '4/4', label: '4/4', ts: { beatsPerMeasure: 4, beatUnit: 4 } },
  { value: '3/4', label: '3/4', ts: { beatsPerMeasure: 3, beatUnit: 4 } },
  { value: '6/8', label: '6/8', ts: { beatsPerMeasure: 6, beatUnit: 8 } },
  { value: '2/4', label: '2/4', ts: { beatsPerMeasure: 2, beatUnit: 4 } },
  { value: '5/4', label: '5/4', ts: { beatsPerMeasure: 5, beatUnit: 4 } },
  { value: '7/8', label: '7/8', ts: { beatsPerMeasure: 7, beatUnit: 8 } },
];

function tsToString(ts: TimeSignature): string {
  return `${ts.beatsPerMeasure}/${ts.beatUnit}`;
}

export function TimeSignatureControl() {
  const timeSignature = useStore((s) => s.timeSignature);
  const setTimeSignature = useStore((s) => s.setTimeSignature);

  const currentValue = tsToString(timeSignature);

  return (
    <Select
      options={TIME_SIGNATURES.map((t) => ({ value: t.value, label: t.label }))}
      value={TIME_SIGNATURES.find((t) => t.value === currentValue)?.value ?? '4/4'}
      onChange={(value) => {
        const ts = TIME_SIGNATURES.find((t) => t.value === value)?.ts;
        if (ts) setTimeSignature(ts);
      }}
      disabled
    />
  );
}
