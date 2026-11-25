import React, { useEffect, useRef, useState } from 'react';

const DAILY_MINUTES = 20;

const SESSION_BLOCKS = [
  {
    id: 'warmup',
    title: 'Clinical Warm-Up',
    minutes: 4,
    objective: 'Practice core medical terms and pronunciation in English.',
  },
  {
    id: 'roleplay',
    title: 'Active Voice Patient Case',
    minutes: 12,
    objective: 'Conduct a real-time spoken clinical interview with AI.',
  },
  {
    id: 'feedback',
    title: 'Pronunciation & Phrasing Coach',
    minutes: 4,
    objective: 'Review natural phrasing, clarity, and key takeaways.',
  },
];

const CLINICAL_CASES = [
  {
    id: 'chest-pain',
    specialty: 'Emergency Medicine',
    patient: 'Arthur Pendelton, 58',
    complaint: 'Chest pressure radiating to left arm for 45 minutes',
    prompt:
      'You are a 58-year-old patient in the ER speaking English with chest pressure radiating to the left arm for 45 minutes. Answer naturally in 1-3 short sentences per turn.',
  },
  {
    id: 'pediatric-fever',
    specialty: 'Pediatrics',
    patient: 'Leo (Mother: Maya Lin), 4',
    complaint: 'Fever up to 39.2°C for 2 days and lower appetite',
    prompt:
      'You are a mother speaking English to a doctor about your 4-year-old son Leo, who has had a fever for 2 days. Respond naturally in 1-3 short sentences per turn.',
  },
];

export default function App() {
  const [selectedCase, setSelectedCase] = useState(CLINICAL_CASES[0]);
  const [blockIndex, setBlockIndex] = useState(0);
  const [status, setStatus] = useState('ready');
  const [secondsLeft, setSecondsLeft] = useState(DAILY_MINUTES * 60);
  const [transcript, setTranscript] = useState([]);
  const timerRef = useRef(null);

  const currentBlock = SESSION_BLOCKS[blockIndex] || SESSION_BLOCKS[0];

  useEffect(() => {
    if (status !== 'running') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setStatus('completed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const handleToggleVoiceSession = () => {
    if (status === 'ready' || status === 'paused') {
      setStatus('running');
    } else if (status === 'running') {
      setStatus('paused');
    }
  };

  const handleNextBlock = () => {
    if (blockIndex < SESSION_BLOCKS.length - 1) {
      setBlockIndex((prev) => prev + 1);
    } else {
      setStatus('completed');
    }
  };

  const handleAddSampleTurn = () => {
    setTranscript((prev) => [
      ...prev,
      {
        id: Date.now(),
        speaker: 'Doctor',
        text: 'How long have you felt this pressure, and does it radiate to your arm or jaw?',
      },
    ]);
  };

  const formatClock = (total) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>MedSpeak AI</h1>
      <p>Daily 20-Minute Medical English Voice Training</p>

      <section style={{ marginBottom: 16 }}>
        <label htmlFor="case-select">
          <strong>Clinical Case: </strong>
        </label>
        <select
          id="case-select"
          value={selectedCase.id}
          onChange={(e) => {
            const found = CLINICAL_CASES.find((c) => c.id === e.target.value);
            if (found) setSelectedCase(found);
          }}
        >
          {CLINICAL_CASES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.specialty} — {item.patient}
            </option>
          ))}
        </select>
        <p><small>Chief complaint: {selectedCase.complaint}</small></p>
      </section>

      <section style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8, marginBottom: 16 }}>
        <div style={{ fontSize: 32, fontWeight: 'bold' }}>{formatClock(secondsLeft)}</div>
        <div>
          <strong>
            Stage {blockIndex + 1}/{SESSION_BLOCKS.length}: {currentBlock.title}
          </strong>
        </div>
        <p>{currentBlock.objective}</p>
        <p><small>Session status: {status}</small></p>
      </section>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button type="button" onClick={handleToggleVoiceSession}>
          {status === 'running' ? 'Pause Voice' : 'Start Active Voice'}
        </button>
        <button type="button" onClick={handleNextBlock}>
          Next Stage
        </button>
        <button type="button" onClick={handleAddSampleTurn}>
          Add Sample Turn
        </button>
      </div>

      <section>
        <h2>Session Transcript ({transcript.length})</h2>
        {transcript.length === 0 ? (
          <p>No speech turns recorded yet.</p>
        ) : (
          <ul>
            {transcript.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.speaker}:</strong> {entry.text}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
