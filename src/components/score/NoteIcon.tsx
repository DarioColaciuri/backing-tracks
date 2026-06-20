import type { Duration } from '../../types/music';

interface NoteIconProps {
  duration: Duration;
  size?: number;
  dotted?: boolean;
  triplet?: boolean;
}

export function NoteIcon({ duration, size = 14, dotted, triplet }: NoteIconProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1, lineHeight: 0 }}>
      {duration === 'whole' && <WholeNote width={size} />}
      {duration === 'half' && <HalfNote width={size} />}
      {duration === 'quarter' && <QuarterNote width={size} />}
      {duration === 'eighth' && <EighthNote width={size} />}
      {dotted && <span style={{ fontSize: size * 0.7, fontWeight: 700, color: 'currentColor', lineHeight: 1, marginTop: -2 }}>&#x2022;</span>}
      {triplet && <span style={{ fontSize: size * 0.6, fontWeight: 700, color: 'currentColor', lineHeight: 1 }}>3</span>}
    </span>
  );
}

function WholeNote({ width }: { width: number }) {
  const h = width * 0.8;
  return (
    <svg width={width} height={h} viewBox="0 0 16 12">
      <ellipse cx="8" cy="6" rx="5.5" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5"
        transform="rotate(-20, 8, 6)" />
    </svg>
  );
}

function HalfNote({ width }: { width: number }) {
  const h = width * 1.6;
  return (
    <svg width={width} height={h} viewBox="0 0 14 24">
      <ellipse cx="4.5" cy="17" rx="5" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.5"
        transform="rotate(-20, 4.5, 17)" />
      <line x1="8.5" y1="17" x2="8.5" y2="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function QuarterNote({ width }: { width: number }) {
  const h = width * 1.6;
  return (
    <svg width={width} height={h} viewBox="0 0 14 24">
      <ellipse cx="4.5" cy="17" rx="5" ry="3.5" fill="currentColor" stroke="currentColor" strokeWidth="0.5"
        transform="rotate(-20, 4.5, 17)" />
      <line x1="8.5" y1="17" x2="8.5" y2="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EighthNote({ width }: { width: number }) {
  const h = width * 1.6;
  return (
    <svg width={width} height={h} viewBox="0 0 18 26">
      <ellipse cx="5" cy="18" rx="5" ry="3.5" fill="currentColor" stroke="currentColor" strokeWidth="0.5"
        transform="rotate(-20, 5, 18)" />
      <line x1="9" y1="18" x2="9" y2="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 3 Q16 0 14 8 Q12 3 9 5" fill="currentColor" stroke="currentColor" strokeWidth="0.3" />
    </svg>
  );
}
