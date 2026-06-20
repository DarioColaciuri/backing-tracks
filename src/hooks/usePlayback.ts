import { useCallback } from 'react';
import { useStore } from '../state/store';
import { playbackEngine } from '../audio/engine';

export function usePlayback() {
  const {
    transportState,
    setTransportState,
    measures,
    timeSignature,
    tempo,
    metronomeEnabled,
    setPlaybackPosition,
  } = useStore();

  const play = useCallback(async () => {
    if (measures.length === 0) return;

    await playbackEngine.ensureAudio();

    playbackEngine.play(measures, timeSignature, tempo, metronomeEnabled, (measureIndex, beatFraction) => {
      setPlaybackPosition(measureIndex, beatFraction);
    });

    setTransportState('playing');
  }, [measures, timeSignature, tempo, metronomeEnabled, setPlaybackPosition, setTransportState]);

  const pause = useCallback(() => {
    playbackEngine.pause();
    setTransportState('paused');
  }, [setTransportState]);

  const stop = useCallback(() => {
    playbackEngine.stop();
    setTransportState('stopped');
    setPlaybackPosition(0, 0);
  }, [setTransportState, setPlaybackPosition]);

  const togglePlay = useCallback(async () => {
    if (transportState === 'playing') {
      pause();
    } else {
      await play();
    }
  }, [transportState, play, pause]);

  return { play, pause, stop, togglePlay, transportState };
}
