const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const VOICE_PROFILES = {
  woman: {
    label: "Mulher",
    geminiVoice: "Aoede",
    pitch: 1.06,
    rateBoost: 1.0,
    styleNote: "warm, empathetic adult woman speaker with natural breathing and calm pacing"
  },
  man: {
    label: "Homem",
    geminiVoice: "Orus",
    pitch: 0.92,
    rateBoost: 0.98,
    styleNote: "clear, grounded adult man speaker with natural conversational cadence"
  },
  child: {
    label: "Criança",
    geminiVoice: "Leda",
    pitch: 1.28,
    rateBoost: 0.94,
    styleNote: "authentic young child (around 8 years old) speaking naturally in simple everyday English"
  }
};

function pcm16ToWavBlob(base64Pcm, sampleRate = 24000) {
  const binary = atob(base64Pcm);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = bytes.length;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);

  new Uint8Array(buffer, 44).set(bytes);
  return new Blob([buffer], { type: "audio/wav" });
}

function splitNaturalChunks(text) {
  return text
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function speakNatural(text, { profile = "woman", speed = 1.0, onStart, onEnd } = {}) {
  const cleanText = (text || "").trim();
  if (!cleanText) return;

  const cfg = VOICE_PROFILES[profile] || VOICE_PROFILES.woman;
  onStart?.();

  if (GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Speak naturally as a ${cfg.styleNote}. Do not sound robotic or monotonous. Say: "${cleanText}"`
                  }
                ]
              }
            ],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: cfg.geminiVoice
                  }
                }
              }
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const inlineData =
          data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData;
        if (inlineData?.data) {
          const wavBlob = pcm16ToWavBlob(inlineData.data, 24000);
          const url = URL.createObjectURL(wavBlob);
          const audio = new Audio(url);
          audio.playbackRate = Math.min(1.4, Math.max(0.7, speed * cfg.rateBoost));
          audio.onended = () => {
            URL.revokeObjectURL(url);
            onEnd?.();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            onEnd?.();
          };
          await audio.play();
          return;
        }
      }
    } catch {
      // Fallback para Web Speech API
    }
  }

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
    const enVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));

    const preferredVoice =
      enVoices.find((v) => {
        const n = v.name.toLowerCase();
        if (profile === "woman") return n.includes("samantha") || n.includes("victoria") || n.includes("aria") || n.includes("female");
        if (profile === "man") return n.includes("daniel") || n.includes("alex") || n.includes("guy") || n.includes("male");
        return n.includes("junior") || n.includes("nicky") || n.includes("child");
      }) || enVoices[0] || null;

    const chunks = splitNaturalChunks(cleanText);
    for (let i = 0; i < chunks.length; i++) {
      await new Promise((resolve) => {
        const utter = new SpeechSynthesisUtterance(chunks[i]);
        utter.lang = "en-US";
        if (preferredVoice) utter.voice = preferredVoice;
        utter.pitch = cfg.pitch;
        utter.rate = Math.min(1.4, Math.max(0.7, speed * cfg.rateBoost));
        utter.onend = () => {
          const pauseMs = i < chunks.length - 1 ? 150 : 0;
          setTimeout(resolve, pauseMs);
        };
        utter.onerror = resolve;
        window.speechSynthesis.speak(utter);
      });
    }
  }

  onEnd?.();
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export async function startUniversalRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  });

  const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : MediaRecorder.isTypeSupported("audio/mp4")
    ? "audio/mp4"
    : "";

  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const chunks = [];

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  recorder.start();

  return {
    stop: () =>
      new Promise((resolve) => {
        recorder.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
          resolve(blob);
        };
        recorder.stop();
      })
  };
}

export async function transcribeAudioBlob(blob) {
  if (!GEMINI_API_KEY || !blob || blob.size === 0) {
    return "";
  }
  try {
    const base64Audio = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = String(reader.result || "");
        resolve(res.split(",")[1] || "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: blob.type || "audio/webm",
                    data: base64Audio
                  }
                },
                {
                  text: "Transcribe accurately what the speaker said in English. Return only the transcription text."
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) return "";
    const json = await response.json();
    return (json?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
  } catch {
    return "";
  }
}

export async function generateAIResponse({ prompt, systemInstruction }) {
  if (!GEMINI_API_KEY) {
    return null;
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return (data?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
  } catch {
    return null;
  }
}
