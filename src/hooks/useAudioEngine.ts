import { useRef, useState, useCallback, useEffect } from 'react';

export interface EQBandConfig {
  frequency: number;
  label: string;
  gain: number;
}

const DEFAULT_BANDS: EQBandConfig[] = [
  { frequency: 60, label: '60Hz', gain: 0 },
  { frequency: 170, label: '170Hz', gain: 0 },
  { frequency: 310, label: '310Hz', gain: 0 },
  { frequency: 600, label: '600Hz', gain: 0 },
  { frequency: 1000, label: '1KHz', gain: 0 },
  { frequency: 3000, label: '3KHz', gain: 0 },
  { frequency: 6000, label: '6KHz', gain: 0 },
  { frequency: 12000, label: '12KHz', gain: 0 },
  { frequency: 14000, label: '14KHz', gain: 0 },
  { frequency: 16000, label: '16KHz', gain: 0 },
];

export function useAudioEngine() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const [bands, setBands] = useState<EQBandConfig[]>(DEFAULT_BANDS);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analyserData, setAnalyserData] = useState<Uint8Array>(new Uint8Array(0));
  const recordingIntervalRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const initAudioContext = useCallback((audioElement: HTMLAudioElement) => {
    if (audioContextRef.current) return;

    const ctx = new AudioContext();
    audioContextRef.current = ctx;
    audioElementRef.current = audioElement;

    const source = ctx.createMediaElementSource(audioElement);
    sourceRef.current = source;

    // Create analyser
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    // Create EQ filters
    const filters: BiquadFilterNode[] = DEFAULT_BANDS.map((band, i) => {
      const filter = ctx.createBiquadFilter();
      if (i === 0) {
        filter.type = 'lowshelf';
      } else if (i === DEFAULT_BANDS.length - 1) {
        filter.type = 'highshelf';
      } else {
        filter.type = 'peaking';
      }
      filter.frequency.value = band.frequency;
      filter.Q.value = 1;
      filter.gain.value = band.gain;
      return filter;
    });

    filtersRef.current = filters;

    // Connect: source -> filters -> analyser -> destination
    let lastNode: AudioNode = source;
    filters.forEach((filter) => {
      lastNode.connect(filter);
      lastNode = filter;
    });
    lastNode.connect(analyser);
    analyser.connect(ctx.destination);

    // Start visualization loop
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const updateVisualizer = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        setAnalyserData(new Uint8Array(dataArray));
      }
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };
    updateVisualizer();
  }, []);

  const setBandGain = useCallback((index: number, gain: number) => {
    if (filtersRef.current[index]) {
      filtersRef.current[index].gain.value = gain;
      setBands((prev) => {
        const newBands = [...prev];
        newBands[index] = { ...newBands[index], gain };
        return newBands;
      });
    }
  }, []);

  const resetEQ = useCallback(() => {
    filtersRef.current.forEach((filter) => {
      filter.gain.value = 0;
    });
    setBands(DEFAULT_BANDS);
  }, []);

  const startRecording = useCallback(() => {
    if (!audioContextRef.current || !audioElementRef.current) return;

    const dest = audioContextRef.current.createMediaStreamDestination();
    if (analyserRef.current) {
      analyserRef.current.connect(dest);
    }

    const stream = dest.stream;
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm',
    });

    recordedChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `radio-recording-${new Date().toISOString().slice(0, 19)}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };

    mediaRecorder.start(1000);
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setRecordingTime(0);

    recordingIntervalRef.current = window.setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setRecordingTime(0);
  }, []);

  const resumeContext = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    bands,
    isRecording,
    recordingTime,
    analyserData,
    initAudioContext,
    setBandGain,
    resetEQ,
    startRecording,
    stopRecording,
    resumeContext,
  };
}
