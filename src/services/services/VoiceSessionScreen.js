// src/screens/VoiceSessionScreen.js

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import * as voiceEngine from '../services/voiceEngine';
import {
  createDailySession,
  advanceSessionBlock,
  appendTranscriptEntry,
} from '../services/dailySessionService';
import {
  CLINICAL_SCENARIOS,
  buildVoiceSystemPrompt,
  buildCoachingFeedbackPrompt,
} from '../services/medicalPrompts';

export default function VoiceSessionScreen({ specialty = 'General Medicine' }) {
  const [session, setSession] = useState(() => createDailySession(specialty));
  const [selectedScenario, setSelectedScenario] = useState(CLINICAL_SCENARIOS[0]);
  const [isListening, setIsListening] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(session.targetMinutes * 60);
  const [feedbackPromptPreview, setFeedbackPromptPreview] = useState('');

  const timerRef = useRef(null);

  useEffect(() => {
    if (session.status !== 'in_progress') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setSession((current) => ({ ...current, status: 'completed' }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session.status]);

  const currentBlock = session.blocks[session.currentBlockIndex] || session.blocks[0];

  const handleStartOrToggleSession = async () => {
    const systemPrompt = buildVoiceSystemPrompt(selectedScenario, currentBlock.title);

    if (session.status === 'ready' || session.status === 'paused') {
      setSession((prev) => ({ ...prev, status: 'in_progress' }));

      if (typeof voiceEngine.startVoiceSession === 'function') {
        await voiceEngine.startVoiceSession({ systemPrompt, scenario: selectedScenario });
      } else if (typeof voiceEngine.initVoiceEngine === 'function') {
        await voiceEngine.initVoiceEngine({ systemPrompt });
      }
      setIsListening(true);
    } else if (session.status === 'in_progress') {
      setSession((prev) => ({ ...prev, status: 'paused' }));
      if (typeof voiceEngine.stopVoiceSession === 'function') {
        await voiceEngine.stopVoiceSession();
      }
      setIsListening(false);
    }
  };

  const handleSimulateDoctorTurn = () => {
    const sampleLine =
      'Hi Arthur, I see you are having chest pain. How long has it lasted, and does it spread to your arm or jaw?';

    setSession((prev) =>
      appendTranscriptEntry(
        { ...prev, status: 'in_progress' },
        { speaker: 'doctor', text: sampleLine }
      )
    );
  };

  const handleNextBlock = () => {
    setSession((prev) => advanceSessionBlock(prev));
  };

  const handleGenerateFeedbackPrompt = () => {
    const promptText = buildCoachingFeedbackPrompt(session.transcript);
    setFeedbackPromptPreview(promptText);
  };

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>MedSpeak AI — 20-Min Voice Drill</Text>
        <Text style={styles.subtitle}>
          Case: {selectedScenario.patientName} ({selectedScenario.specialty})
        </Text>

        <View style={styles.card}>
          <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
          <Text style={styles.blockTitle}>
            Stage {session.currentBlockIndex + 1}/{session.blocks.length}: {currentBlock.title}
          </Text>
          <Text style={styles.blockObjective}>{currentBlock.objective}</Text>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleStartOrToggleSession}>
            <Text style={styles.btnText}>
              {session.status === 'in_progress' ? 'Pause Voice' : 'Start Active Voice'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleNextBlock}>
            <Text style={styles.btnText}>Next Stage</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.outlineBtn} onPress={handleSimulateDoctorTurn}>
          <Text style={styles.outlineBtnText}>Add Sample Doctor Utterance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineBtn} onPress={handleGenerateFeedbackPrompt}>
          <Text style={styles.outlineBtnText}>Build Coach Feedback Prompt</Text>
        </TouchableOpacity>

        <Text style={styles.statusText}>
          Status: {session.status} | Mic Active: {isListening ? 'Yes' : 'No'}
        </Text>

        <View style={styles.transcriptBox}>
          <Text style={styles.sectionLabel}>Transcript ({session.transcript.length})</Text>
          {session.transcript.length === 0 ? (
            <Text style={styles.mutedText}>No turns recorded yet.</Text>
          ) : (
            session.transcript.map((item) => (
              <Text key={item.id} style={styles.transcriptLine}>
                <Text style={styles.bold}>{item.speaker}: </Text>
                {item.text}
              </Text>
            ))
          )}
        </View>

        {feedbackPromptPreview ? (
          <View style={styles.transcriptBox}>
            <Text style={styles.sectionLabel}>Coaching Prompt Ready</Text>
            <Text style={styles.mutedText}>{feedbackPromptPreview}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220' },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: '#94A3B8' },
  card: {
    backgroundColor: '#131C31',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  timer: { fontSize: 32, fontWeight: '800', color: '#38BDF8' },
  blockTitle: { fontSize: 16, fontWeight: '600', color: '#F8FAFC', marginTop: 6 },
  blockObjective: { fontSize: 13, color: '#CBD5E1', marginTop: 4 },
  row: { flexDirection: 'row', gap: 10 },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#0284C7',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryBtn: {
    backgroundColor: '#334155',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: '#38BDF8',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#FFFFFF', fontWeight: '600' },
  outlineBtnText: { color: '#38BDF8', fontWeight: '600' },
  statusText: { color: '#94A3B8', fontSize: 13 },
  transcriptBox: {
    backgroundColor: '#131C31',
    padding: 14,
    borderRadius: 12,
    gap: 6,
  },
  sectionLabel: { color: '#F8FAFC', fontWeight: '700', fontSize: 15 },
  mutedText: { color: '#94A3B8', fontSize: 13 },
  transcriptLine: { color: '#E2E8F0', fontSize: 14 },
  bold: { fontWeight: '700', color: '#38BDF8' },
});
