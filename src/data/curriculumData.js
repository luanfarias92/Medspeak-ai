export const SPECIALTIES = [
  { id: "cardiology", name: "Cardiologia", samplePrompt: "I've been feeling a tight pressure in my chest since this morning, especially when I walk up the stairs." },
  { id: "pediatrics", name: "Pediatria", samplePrompt: "My tummy hurts right around my belly button and I don't want to eat my dinner." },
  { id: "emergency", name: "Pronto-Socorro / Emergência", samplePrompt: "I twisted my ankle badly running for the bus and now it's swelling fast." },
  { id: "internal", name: "Clínica Médica", samplePrompt: "I've had a low-grade fever, night sweats, and a dry cough for ten days." },
  { id: "travel", name: "Viagens & Congressos", samplePrompt: "Hi! Could I get an iced oat latte to go, and is there a quiet spot near the convention center?" }
];

export const DAILY_PLANS = [
  {
    id: "day-1",
    dayNumber: 1,
    focusType: "Clínica & Anamnese",
    isLightFocus: false,
    title: "Dor Torácica & Escala de Sintomas",
    durationMinutes: 18,
    levelTag: "A2 → B1",
    vocabulary: [
      {
        term: "sharp vs. dull pain",
        translation: "dor aguda/pontada vs. dor surda/pressão",
        example: "Is the pain sharp like a knife or more of a dull ache?"
      },
      {
        term: "shortness of breath (dyspnea)",
        translation: "falta de ar",
        example: "Do you get short of breath when lying flat?"
      },
      {
        term: "radiating discomfort",
        translation: "desconforto irradiado",
        example: "Does the pressure radiate to your left jaw or arm?"
      }
    ],
    video: {
      title: "Asking About Chest Pain with Empathy",
      durationLabel: "04:30",
      subtitles: [
        { time: "00:05", en: "Before ordering tests, clarify how the discomfort started and what makes it worse.", pt: "Antes de pedir exames, esclareça como o desconforto começou e o que o piora." },
        { time: "01:40", en: "Ask: 'On a scale from one to ten, how intense is the pressure right now?'", pt: "Pergunte: 'Em uma escala de um a dez, quão intensa está a pressão agora?'" },
        { time: "03:10", en: "Reassure the patient calmly while checking red-flag symptoms.", pt: "Acalme o paciente com tranquilidade enquanto avalia sinais de alerta." }
      ]
    },
    voiceScenarioPrompt: "Act as an adult patient experiencing chest pressure after exertion. Answer the doctor's questions naturally and concisely."
  },
  {
    id: "day-2",
    dayNumber: 2,
    focusType: "Modo Leve • Viagem & Cotidiano",
    isLightFocus: true,
    title: "Café, Restrições Alimentares & Pausa no Congresso",
    durationMinutes: 15,
    levelTag: "A2 → B1",
    vocabulary: [
      {
        term: "lactose-free / dairy-free",
        translation: "sem lactose / sem laticínios",
        example: "Could you make that oat milk instead, as I'm dairy-free?"
      },
      {
        term: "a quick bite",
        translation: "um lanche rápido",
        example: "I have twenty minutes before my session—do you have a quick bite?"
      },
      {
        term: "out of curiosity",
        translation: "por curiosidade",
        example: "Just out of curiosity, which city are you visiting from?"
      }
    ],
    video: {
      title: "Relaxing Between Conference Sessions Abroad",
      durationLabel: "03:50",
      subtitles: [
        { time: "00:10", en: "Keep everyday travel conversations friendly, natural, and unhurried.", pt: "Mantenha conversas cotidianas de viagem amigáveis, naturais e sem pressa." },
        { time: "01:55", en: "Say 'I'm all set, thank you' when you don't need anything else at the table.", pt: "Diga 'I'm all set, thank you' quando não precisar de mais nada à mesa." },
        { time: "03:05", en: "Use light follow-up questions to connect with fellow attendees.", pt: "Use perguntas leves de acompanhamento para conversar com outros participantes." }
      ]
    },
    voiceScenarioPrompt: "Act as a friendly barista or fellow conference attendee chatting casually near a coffee shop."
  },
  {
    id: "day-3",
    dayNumber: 3,
    focusType: "Pediatria (Voz Infantil)",
    isLightFocus: false,
    title: "Comunicação com Crianças & Pais no Consultório",
    durationMinutes: 19,
    levelTag: "B1",
    vocabulary: [
      {
        term: "tummy ache",
        translation: "dor de barriga (linguagem infantil)",
        example: "Does your tummy hurt more when you jump or sit still?"
      },
      {
        term: "it feels funny",
        translation: "está estranho / diferente (relato infantil)",
        example: "Show me where your ear feels funny using one finger."
      },
      {
        term: "step by step",
        translation: "passo a passo",
        example: "I'll check your throat step by step so it won't surprise you."
      }
    ],
    video: {
      title: "Building Trust with Young Patients",
      durationLabel: "04:45",
      subtitles: [
        { time: "00:12", en: "Children rarely use anatomical terms—translate medical questions into simple imagery.", pt: "Crianças raramente usam termos anatômicos—traduza perguntas em imagens simples." },
        { time: "02:05", en: "Explain what you are going to do before touching a sensitive area.", pt: "Explique o que vai fazer antes de tocar uma área sensível." },
        { time: "03:40", en: "Confirm the dosing instructions clearly with the parent before discharge.", pt: "Confirme as instruções de dose com clareza junto aos pais antes da alta." }
      ]
    },
    voiceScenarioPrompt: "Act as an 8-year-old child with a mild tummy ache and sore throat. Use simple, authentic child phrasing."
  },
  {
    id: "day-4",
    dayNumber: 4,
    focusType: "Modo Leve • Cultura, Hotel & Imprevistos",
    isLightFocus: true,
    title: "Hotel, Bagagem & Passeio Sem Estresse",
    durationMinutes: 16,
    levelTag: "B1",
    vocabulary: [
      {
        term: "late check-out",
        translation: "saída tardia do hotel",
        example: "Would it be possible to request a late check-out until noon?"
      },
      {
        term: "walking distance",
        translation: "a uma curta caminhada",
        example: "Is the museum within walking distance from here?"
      },
      {
        term: "no rush at all",
        translation: "sem pressa nenhuma",
        example: "Take your time checking the reservation—no rush at all."
      }
    ],
    video: {
      title: "Smooth Hotel & City Navigation in English",
      durationLabel: "04:00",
      subtitles: [
        { time: "00:08", en: "Polite requests in English often start with 'Would it be possible to...' or 'Could I check if...'.", pt: "Pedidos educados em inglês costumam começar com 'Would it be possible to...' ou 'Could I check if...'." },
        { time: "01:45", en: "Clarify directions simply by repeating key landmarks.", pt: "Esclareça direções de forma simples repetindo pontos de referência." },
        { time: "03:15", en: "Keep your tone warm and relaxed when traveling for leisure or congresses.", pt: "Mantenha o tom caloroso e tranquilo ao viajar a lazer ou para congressos." }
      ]
    },
    voiceScenarioPrompt: "Act as a helpful hotel front-desk host assisting a traveler with check-in, directions, and dinner tips."
  }
];

export const ADAPTIVE_POOL = [
  {
    focusType: "Ciência & Artigos",
    isLightFocus: false,
    title: "Interpretação Crítica de Desfechos & Viés em Estudos",
    durationMinutes: 18,
    levelTag: "B1 → B2",
    vocabulary: [
      {
        term: "confounding variable",
        translation: "variável de confusão",
        example: "Age acted as a confounding variable in the preliminary analysis."
      },
      {
        term: "adverse event rate",
        translation: "taxa de eventos adversos",
        example: "The adverse event rate remained comparable across both groups."
      },
      {
        term: "key takeaway",
        translation: "principal conclusão prática",
        example: "The key takeaway is early intervention within the first two hours."
      }
    ],
    video: {
      title: "Reading Methods & Limitations Like a Clinician",
      durationLabel: "04:20",
      subtitles: [
        { time: "00:10", en: "Scan the study design and sample size before trusting bold headlines.", pt: "Analise o desenho do estudo e o tamanho da amostra antes de confiar em manchetes." },
        { time: "02:00", en: "Notice hedging words like 'suggests', 'may', or 'is associated with'.", pt: "Observe palavras de cautela como 'suggests', 'may' ou 'is associated with'." },
        { time: "03:30", en: "Summarize findings concisely for rounds or international discussions.", pt: "Resuma os achados de forma concisa para visitas clínicas ou discussões internacionais." }
      ]
    },
    voiceScenarioPrompt: "Act as a medical colleague discussing a clinical paper's findings and limitations in an informal journal club."
  },
  {
    focusType: "Modo Leve • Gastronomia & Conversa Casual",
    isLightFocus: true,
    title: "Pedindo Pratos Típicos & Fazendo Amizade à Mesa",
    durationMinutes: 15,
    levelTag: "B1 → B2",
    vocabulary: [
      {
        term: "comfort food",
        translation: "comida afetiva / reconfortante",
        example: "After a long week, a warm soup is real comfort food."
      },
      {
        term: "on the side",
        translation: "servido à parte",
        example: "Could you put the dressing on the side, please?"
      },
      {
        term: "what brings you to...",
        translation: "o que traz você a...",
        example: "What brings you to town this week?"
      }
    ],
    video: {
      title: "Natural Small Talk Over Dinner",
      durationLabel: "03:45",
      subtitles: [
        { time: "00:09", en: "Light conversation helps you switch off from clinical stress.", pt: "Conversas leves ajudam você a desligar do estresse clínico." },
        { time: "01:35", en: "Ask open, easy questions about hobbies, music, or favorite trips.", pt: "Faça perguntas abertas e simples sobre hobbies, música ou viagens favoritas." },
        { time: "02:55", en: "Practice natural reactions like 'That sounds great!' or 'No way!'", pt: "Pratique reações naturais como 'That sounds great!' ou 'No way!'." }
      ]
    },
    voiceScenarioPrompt: "Act as a friendly dinner companion talking about food, travel, and hobbies in a relaxed tone."
  }
];
