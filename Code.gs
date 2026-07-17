/**
 * EM Spectrum Explorer - Google Apps Script Version
 * Science 9 - Electromagnetic Spectrum Lesson Aid
 * ENHANCED AI TUTOR - LARGE FONT - ACCESSIBILITY MODE
 * NO API KEY REQUIRED
 */

const MAX_STUDENTS = 60;
const MAX_SCORES_PER_STUDENT = 20;

function getScoreStore() {
  return PropertiesService.getScriptProperties();
}

function saveStudentScore(studentName, score, correct, total, difficulty) {
  try {
    const props = getScoreStore();
    const key = 'scores_' + studentName.trim().toLowerCase();
    const existing = props.getProperty(key);
    
    let scores = [];
    if (existing) {
      scores = JSON.parse(existing);
    }
    
    scores.push({
      name: studentName.trim(),
      score: score,
      correct: correct,
      total: total,
      difficulty: difficulty,
      date: new Date().toISOString(),
      timestamp: Date.now()
    });
    
    if (scores.length > MAX_SCORES_PER_STUDENT) {
      scores = scores.slice(-MAX_SCORES_PER_STUDENT);
    }
    
    props.setProperty(key, JSON.stringify(scores));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function getAllStudents() {
  try {
    const props = getScoreStore();
    const keys = props.getKeys();
    const studentKeys = keys.filter(k => k.startsWith('scores_'));
    const students = [];
    
    studentKeys.forEach(key => {
      const data = props.getProperty(key);
      if (data) {
        try {
          const scores = JSON.parse(data);
          if (scores.length > 0) {
            const latest = scores[scores.length - 1];
            students.push({
              name: latest.name,
              bestScore: Math.max(...scores.map(s => s.score)),
              totalAttempts: scores.length,
              latestScore: latest.score,
              latestCorrect: latest.correct,
              latestTotal: latest.total,
              latestDate: latest.date
            });
          }
        } catch(e) {}
      }
    });
    
    students.sort((a, b) => b.bestScore - a.bestScore);
    const limitedStudents = students.slice(0, MAX_STUDENTS);
    
    return { 
      success: true, 
      students: limitedStudents,
      total: students.length,
      displayed: limitedStudents.length,
      maxDisplayed: MAX_STUDENTS
    };
  } catch (error) {
    return { success: false, error: error.toString(), students: [] };
  }
}

function getStudentsPage(page = 0, pageSize = 15) {
  try {
    const result = getAllStudents();
    if (!result.success) return result;
    
    const students = result.students;
    const total = students.length;
    const start = page * pageSize;
    const end = Math.min(start + pageSize, total);
    const pageStudents = students.slice(start, end);
    
    return {
      success: true,
      students: pageStudents,
      total: total,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(total / pageSize),
      displayed: pageStudents.length,
      maxDisplayed: MAX_STUDENTS
    };
  } catch (error) {
    return { success: false, error: error.toString(), students: [] };
  }
}

function deleteStudentScores(studentName) {
  try {
    const props = getScoreStore();
    const key = 'scores_' + studentName.trim().toLowerCase();
    
    if (props.getProperty(key)) {
      props.deleteProperty(key);
      return { success: true, message: 'Scores for "' + studentName.trim() + '" have been deleted.' };
    } else {
      return { success: false, message: 'Student "' + studentName.trim() + '" not found.' };
    }
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function deleteAllStudentScores() {
  try {
    const props = getScoreStore();
    const keys = props.getKeys();
    const studentKeys = keys.filter(k => k.startsWith('scores_'));
    const count = studentKeys.length;
    studentKeys.forEach(key => props.deleteProperty(key));
    return { success: true, message: 'Deleted ' + count + ' student records.' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('EM Spectrum Explorer — Science 9')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ============================================================
// ENHANCED AI TUTOR
// ============================================================

function sendTutorMessage(userMessage, history) {
  try {
    const msg = userMessage.toLowerCase().trim();
    let response = generateSmartResponse(msg, history);
    return { success: true, response: response };
  } catch (error) {
    return {
      success: true,
      response: "Sorry, I didn't understand your question. Could you rephrase it? Try asking: 'What are radio waves?' or 'Compare gamma rays and radio waves.'"
    };
  }
}

function generateSmartResponse(msg, history) {
  const lowerMsg = msg.toLowerCase();
  
  if (lowerMsg.includes('radio') && !lowerMsg.includes('microwave') && !lowerMsg.includes('micro')) {
    return "📻 RADIO WAVES\n\n" +
           "What are they? Radio waves are the longest wavelength and lowest frequency waves in the entire EM spectrum.\n\n" +
           "🔹 Wavelength: 10 cm to several kilometers (very long!)\n" +
           "🔹 Frequency: 3 kHz to 300 MHz (very low!)\n" +
           "🔹 Energy: Lowest energy among all EM waves\n\n" +
           "Where are they used?\n" +
           "📻 AM/FM Radio — for music and news broadcasts\n" +
           "📺 TV Signals — for watching television\n" +
           "📱 Cellphones — for calls and texts\n" +
           "📡 Communication — for satellite and military communication\n\n" +
           "Fun Fact: The first radio broadcast was in 1906 by Reginald Fessenden!";
  }
  
  if (lowerMsg.includes('microwave') || (lowerMsg.includes('micro') && !lowerMsg.includes('microscope'))) {
    return "📡 MICROWAVES\n\n" +
           "What are they? Microwaves have shorter wavelengths and higher frequencies than radio waves.\n\n" +
           "🔹 Wavelength: 1 mm to 10 cm\n" +
           "🔹 Frequency: 300 MHz to 300 GHz\n" +
           "🔹 Energy: Higher than radio waves\n\n" +
           "Where are they used?\n" +
           "🍕 Microwave Ovens — for heating food quickly\n" +
           "📶 WiFi — for wireless internet at home\n" +
           "📡 Radar — for detecting planes, ships, and weather\n" +
           "🛰️ Satellites — for TV and GPS communication\n\n" +
           "Fun Fact: Microwaves are used in radar to detect the speed of cars!";
  }
  
  if (lowerMsg.includes('infrared') || lowerMsg.includes('ir') || (lowerMsg.includes('heat') && !lowerMsg.includes('heat wave'))) {
    return "🔥 INFRARED (IR)\n\n" +
           "What are they? Infrared waves are felt as heat and have higher frequency than microwaves.\n\n" +
           "🔹 Wavelength: 700 nm to 1 mm\n" +
           "🔹 Frequency: 300 GHz to 430 THz\n" +
           "🔹 Energy: Higher than microwaves\n\n" +
           "Where are they used?\n" +
           "📟 Remote Controls — for TVs and air conditioners\n" +
           "🌡️ Thermal Cameras — to see heat in the dark\n" +
           "🌙 Night Vision Goggles — for seeing in darkness\n" +
           "🔥 Heat Sensors — for detecting fire and body heat\n\n" +
           "Fun Fact: Infrared cameras can see heat signatures even in complete darkness!";
  }
  
  if (lowerMsg.includes('visible') || lowerMsg.includes('light') && !lowerMsg.includes('microwave') && !lowerMsg.includes('ultraviolet') && !lowerMsg.includes('gamma')) {
    return "🌈 VISIBLE LIGHT\n\n" +
           "What are they? Visible light is the only part of the EM spectrum that the human eye can see!\n\n" +
           "🔹 Wavelength: 400 nm to 700 nm\n" +
           "🔹 Frequency: 430 THz to 750 THz\n" +
           "🔹 Colors: ROYGBIV (Red, Orange, Yellow, Green, Blue, Indigo, Violet)\n\n" +
           "Where are they used?\n" +
           "📷 Photography — for taking pictures and videos\n" +
           "🌈 Rainbows — natural displays of all colors\n" +
           "🔦 Lighting — for homes, streets, and cars\n" +
           "👁️ Human Vision — helps us see the world around us\n\n" +
           "Fun Fact: The human eye can see about 10 million different colors!";
  }
  
  if (lowerMsg.includes('ultraviolet') || lowerMsg.includes('uv')) {
    return "☀️ ULTRAVIOLET (UV)\n\n" +
           "What are they? UV rays have higher energy than visible light and can damage skin if overexposed.\n\n" +
           "🔹 Wavelength: 10 nm to 400 nm\n" +
           "🔹 Frequency: 750 THz to 30 PHz\n" +
           "🔹 Energy: Higher than visible light\n\n" +
           "Where are they used?\n" +
           "☀️ Sunlight — natural UV from the sun (causes tanning)\n" +
           "🧴 Sunscreen — protects skin from UV damage\n" +
           "🦠 Sterilization — kills bacteria and viruses\n" +
           "💡 Blacklights — for checking security marks\n\n" +
           "Fun Fact: UV rays from the sun help our bodies produce Vitamin D!\n\n" +
           "⚠️ WARNING: Too much UV can cause skin damage and sunburn. Always wear sunscreen!";
  }
  
  if (lowerMsg.includes('x-ray') || lowerMsg.includes('xray') || lowerMsg.includes('x ray')) {
    return "🦴 X-RAYS\n\n" +
           "What are they? X-rays have very high frequency and can penetrate soft body tissue.\n\n" +
           "🔹 Wavelength: 0.01 nm to 10 nm\n" +
           "🔹 Frequency: 30 PHz to 30 EHz\n" +
           "🔹 Energy: Very high! Can pass through soft tissue\n\n" +
           "Where are they used?\n" +
           "🦴 Medical X-rays — for seeing broken bones\n" +
           "🏥 Healthcare — for checking lungs and teeth\n" +
           "🛄 Airport Security — for scanning luggage\n" +
           "🦷 Dental X-rays — for checking teeth health\n\n" +
           "Fun Fact: X-rays were discovered accidentally by Wilhelm Roentgen in 1895!";
  }
  
  if (lowerMsg.includes('gamma') || lowerMsg.includes('gama')) {
    return "☢️ GAMMA RAYS\n\n" +
           "What are they? Gamma rays have the shortest wavelength, highest frequency, and most energy in the entire EM spectrum!\n\n" +
           "🔹 Wavelength: Less than 0.01 nm (extremely short!)\n" +
           "🔹 Frequency: Greater than 30 EHz (extremely high!)\n" +
           "🔹 Energy: The HIGHEST of all EM waves\n\n" +
           "Where are they used?\n" +
           "☢️ Nuclear Reactions — produced in stars and explosions\n" +
           "⭐ Outer Space — from supernovas and black holes\n" +
           "💉 Cancer Treatment — for killing cancer cells\n" +
           "⚛️ Research — for studying atomic structures\n\n" +
           "Fun Fact: Gamma rays are the most energetic waves in the entire universe!\n\n" +
           "⚠️ WARNING: Gamma rays are very dangerous and can damage cells. They are carefully controlled in medical use.";
  }
  
  if (lowerMsg.includes('frequency') || lowerMsg.includes('freq')) {
    return "⚡ FREQUENCY\n\n" +
           "What is Frequency?\n" +
           "Frequency is the number of wave cycles that pass a point every second. It is measured in Hertz (Hz).\n\n" +
           "🔹 High Frequency = More waves per second = Higher energy\n" +
           "🔹 Low Frequency = Fewer waves per second = Lower energy\n\n" +
           "Examples:\n" +
           "📻 Radio waves: 3 kHz to 300 MHz (lowest frequency)\n" +
           "☢️ Gamma rays: >30 EHz (highest frequency)\n\n" +
           "📊 Remember: Frequency and Wavelength are OPPOSITE!\n" +
           "   • When frequency goes UP, wavelength goes DOWN\n" +
           "   • When frequency goes DOWN, wavelength goes UP\n\n" +
           "🎯 Key Rule: Energy is directly related to frequency!\n" +
           "   Higher frequency = Higher energy";
  }
  
  if (lowerMsg.includes('wavelength') || lowerMsg.includes('wave length')) {
    return "📏 WAVELENGTH\n\n" +
           "What is Wavelength?\n" +
           "Wavelength is the distance between two consecutive wave peaks (or troughs). It is measured in meters (m).\n\n" +
           "🔹 Long Wavelength = Low frequency = Low energy\n" +
           "🔹 Short Wavelength = High frequency = High energy\n\n" +
           "Examples:\n" +
           "📻 Radio waves: 10 cm to several km (longest)\n" +
           "☢️ Gamma rays: Less than 0.01 nm (shortest)\n\n" +
           "📊 Remember: Wavelength and Frequency are OPPOSITE!\n" +
           "   • When wavelength goes UP, frequency goes DOWN\n" +
           "   • When wavelength goes DOWN, frequency goes UP\n\n" +
           "🎯 Key Formula: c = λ × f\n" +
           "   where c = 3 × 10⁸ m/s (speed of light)";
  }
  
  if (lowerMsg.includes('compare') || lowerMsg.includes('order') || lowerMsg.includes('arrange') || lowerMsg.includes('difference') || lowerMsg.includes('similar')) {
    return "📊 COMPARING EM WAVES\n\n" +
           "Order from LOWEST to HIGHEST Frequency:\n" +
           "1️⃣ Radio Waves (lowest frequency, longest wavelength)\n" +
           "2️⃣ Microwaves\n" +
           "3️⃣ Infrared\n" +
           "4️⃣ Visible Light\n" +
           "5️⃣ Ultraviolet (UV)\n" +
           "6️⃣ X-rays\n" +
           "7️⃣ Gamma Rays (highest frequency, shortest wavelength)\n\n" +
           "📊 Order from LOWEST to HIGHEST Energy:\n" +
           "Same as frequency order! Radio = lowest, Gamma = highest\n\n" +
           "🔑 Key Differences:\n" +
           "• Radio waves have the LOWEST energy and are used for broadcasting\n" +
           "• Gamma rays have the HIGHEST energy and are used for cancer treatment\n" +
           "• Visible light is the ONLY one we can see!\n" +
           "• UV can damage skin, but helps make Vitamin D\n" +
           "• X-rays can see through soft tissue but not bones\n\n" +
           "🌟 All EM waves travel at the SAME SPEED (c = 3×10⁸ m/s) in a vacuum!";
  }
  
  if (lowerMsg.includes('use') || lowerMsg.includes('application') || lowerMsg.includes('purpose') || lowerMsg.includes('used for') || lowerMsg.includes('what are')) {
    return "🔧 USES OF EM WAVES\n\n" +
           "📻 Radio Waves:\n" +
           "   • AM/FM Radio broadcasting\n" +
           "   • TV signals and communication\n" +
           "   • Cellphones and Bluetooth\n\n" +
           "📡 Microwaves:\n" +
           "   • Microwave ovens for cooking\n" +
           "   • WiFi and Bluetooth internet\n" +
           "   • Radar for planes and ships\n\n" +
           "🔥 Infrared:\n" +
           "   • Remote controls for TVs and AC\n" +
           "   • Thermal cameras for night vision\n" +
           "   • Heat sensors for fire detection\n\n" +
           "🌈 Visible Light:\n" +
           "   • Photography and videos\n" +
           "   • Fiber optics for internet\n" +
           "   • Lighting homes and streets\n\n" +
           "☀️ Ultraviolet:\n" +
           "   • Sterilization of medical equipment\n" +
           "   • Blacklights for security marks\n" +
           "   • Helps make Vitamin D in skin\n\n" +
           "🦴 X-rays:\n" +
           "   • Medical imaging for broken bones\n" +
           "   • Dental check-ups for teeth\n" +
           "   • Airport security scanning\n\n" +
           "☢️ Gamma Rays:\n" +
           "   • Cancer treatment (radiotherapy)\n" +
           "   • Nuclear research and medicine\n" +
           "   • Sterilizing medical equipment";
  }
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey') || lowerMsg.includes('good morning') || lowerMsg.includes('good afternoon') || lowerMsg.includes('good evening') || lowerMsg.includes('how are you')) {
    return "👋 Hello there!\n\n" +
           "I'm your EM Spectrum Tutor! I'm here to help you learn about the Electromagnetic Spectrum.\n\n" +
           "Here's what you can ask me:\n" +
           "📻 'What are radio waves?'\n" +
           "☢️ 'What are gamma rays?'\n" +
           "📊 'Compare radio and gamma waves'\n" +
           "🔧 'What are the uses of X-rays?'\n" +
           "⚡ 'What is frequency?'\n\n" +
           "What would you like to learn about? 🤔";
  }
  
  if (lowerMsg.includes('help') || lowerMsg.includes('what can you') || lowerMsg.includes('how to use') || lowerMsg.includes('instructions')) {
    return "💡 HOW TO USE THE AI TUTOR\n\n" +
           "Ask me anything about the Electromagnetic Spectrum!\n\n" +
           "✨ What I can help you with:\n" +
           "1️⃣ Explaining each type of EM wave (Radio, Microwave, IR, Visible, UV, X-ray, Gamma)\n" +
           "2️⃣ Understanding wavelength and frequency\n" +
           "3️⃣ Comparing different waves\n" +
           "4️⃣ Learning about real-world uses\n" +
           "5️⃣ Understanding energy and speed of light\n\n" +
           "🔍 Try asking me:\n" +
           "• 'What are radio waves?'\n" +
           "• 'Compare gamma rays and radio waves'\n" +
           "• 'What is frequency?'\n" +
           "• 'What are the uses of X-rays?'\n\n" +
           "Just type your question and I'll help you! 😊";
  }
  
  if (lowerMsg.includes('easy') || lowerMsg.includes('simple') || lowerMsg.includes('explain simply') || lowerMsg.includes('basic')) {
    return "📖 SIMPLE EXPLANATION\n\n" +
           "The Electromagnetic Spectrum is a list of all the different types of waves.\n\n" +
           "Think of it like a RULER:\n" +
           "📏 One side has LONG waves (Radio waves)\n" +
           "📏 The other side has SHORT waves (Gamma rays)\n\n" +
           "🔑 Important things to know:\n" +
           "• All these waves travel at the SAME speed (light speed!)\n" +
           "• Long waves have LOW energy\n" +
           "• Short waves have HIGH energy\n" +
           "• Visible light is the ONLY one we can see\n\n" +
           "🌟 Remember this order:\n" +
           "Radio → Micro → IR → Visible → UV → X-ray → Gamma\n\n" +
           "The further right you go, the more energy the wave has!";
  }
  
  return "💡 I'm your EM Spectrum Tutor! I can help you learn about:\n\n" +
         "📻 Radio Waves — AM/FM radio, TV, cellphones\n" +
         "📡 Microwaves — ovens, WiFi, radar\n" +
         "🔥 Infrared — remotes, thermal cameras\n" +
         "🌈 Visible Light — photography, rainbows\n" +
         "☀️ Ultraviolet — sunburn, sterilization\n" +
         "🦴 X-rays — medical imaging, security\n" +
         "☢️ Gamma Rays — cancer treatment, nuclear\n\n" +
         "What would you like to know? Just type your question! 😊";
}

// ============================================================
// QUIZ GENERATION - WITH ACCESSIBILITY MODE
// ============================================================

function generateQuiz(questionCount = 10, difficulty = 'medium', accessibility = false) {
  try {
    const questionBanks = {
      easy: [
        { 
          question: "Which has the LONGEST wavelength?", 
          options: ["Radio waves", "Gamma rays", "Ultraviolet", "X-rays"], 
          correctIndex: 0, 
          explanation: "Radio waves have the longest wavelength." 
        },
        { 
          question: "Which is used in microwave ovens?", 
          options: ["Radio waves", "Microwaves", "Infrared", "Ultraviolet"], 
          correctIndex: 1, 
          explanation: "Microwaves are used in microwave ovens." 
        },
        { 
          question: "Which part of the EM spectrum is visible to the human eye?", 
          options: ["Infrared", "Ultraviolet", "Visible light", "X-rays"], 
          correctIndex: 2, 
          explanation: "Visible light is the only part we can see." 
        },
        { 
          question: "What is the speed of all EM waves in a vacuum?", 
          options: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "It varies"], 
          correctIndex: 0, 
          explanation: "All EM waves travel at 3×10⁸ m/s." 
        },
        { 
          question: "Which EM wave is used in remote controls?", 
          options: ["Radio waves", "Microwaves", "Infrared", "Visible light"], 
          correctIndex: 2, 
          explanation: "Infrared is used in remote controls." 
        },
        { 
          question: "Which is used in medical X-rays?", 
          options: ["Ultraviolet", "Visible light", "X-rays", "Gamma rays"], 
          correctIndex: 2, 
          explanation: "X-rays are used in medical imaging." 
        },
        { 
          question: "Which has the HIGHEST frequency?", 
          options: ["Visible light", "Microwaves", "Gamma rays", "Infrared"], 
          correctIndex: 2, 
          explanation: "Gamma rays have the highest frequency." 
        },
        { 
          question: "What does 'ROYGBIV' represent?", 
          options: ["Colors of visible light", "Types of waves", "Planets", "Units"], 
          correctIndex: 0, 
          explanation: "ROYGBIV = Red, Orange, Yellow, Green, Blue, Indigo, Violet." 
        }
      ],
      medium: [
        { 
          question: "What is the relationship between wavelength and frequency?", 
          options: ["Directly proportional", "Inversely proportional", "No relationship", "They are equal"], 
          correctIndex: 1, 
          explanation: "They are inversely proportional — when one increases, the other decreases." 
        },
        { 
          question: "Which is TRUE when comparing radio and gamma rays?", 
          options: ["Gamma rays have lower frequency", "Radio waves have longer wavelength", "They have the same frequency", "Radio waves have higher energy"], 
          correctIndex: 1, 
          explanation: "Radio waves have longer wavelength and lower frequency." 
        },
        { 
          question: "Correct order from lowest to highest frequency?", 
          options: ["Gamma→X-ray→UV→Visible→IR→Micro→Radio", "Radio→Micro→IR→Visible→UV→X-ray→Gamma", "Visible→UV→X-ray→Gamma→Radio→Micro→IR", "Micro→Radio→IR→Visible→UV→X-ray→Gamma"], 
          correctIndex: 1, 
          explanation: "Radio → Microwave → Infrared → Visible → UV → X-ray → Gamma." 
        },
        { 
          question: "Why does excessive UV exposure damage skin?", 
          options: ["UV has low frequency", "UV has high energy", "UV has long wavelength", "UV is slow"], 
          correctIndex: 1, 
          explanation: "UV has high energy that can damage skin cells." 
        },
        { 
          question: "Which is used in cancer treatment?", 
          options: ["X-rays", "Gamma rays", "Ultraviolet", "Infrared"], 
          correctIndex: 1, 
          explanation: "Gamma rays are used in cancer treatment." 
        },
        { 
          question: "Which has higher frequency — infrared or ultraviolet?", 
          options: ["Infrared", "Ultraviolet", "They're equal", "Cannot be determined"], 
          correctIndex: 1, 
          explanation: "Ultraviolet has higher frequency than infrared." 
        },
        { 
          question: "Which EM wave has the HIGHEST energy?", 
          options: ["Radio waves", "Infrared", "Gamma rays", "Visible light"], 
          correctIndex: 2, 
          explanation: "Gamma rays have the highest energy." 
        },
        { 
          question: "Which EM wave is used in WiFi?", 
          options: ["Radio waves", "Microwaves", "Infrared", "X-rays"], 
          correctIndex: 1, 
          explanation: "Microwaves are used in WiFi." 
        }
      ],
      hard: [
        { 
          question: "What is the frequency range of visible light?", 
          options: ["300 GHz - 430 THz", "430 THz - 750 THz", "750 THz - 30 PHz", "30 PHz - 30 EHz"], 
          correctIndex: 1, 
          explanation: "Visible light ranges from 430 THz to 750 THz." 
        },
        { 
          question: "What does 'c' represent in c = λ × f?", 
          options: ["Speed of sound", "Speed of light", "Speed of the wave", "A constant"], 
          correctIndex: 1, 
          explanation: "c = speed of light = 3×10⁸ m/s." 
        },
        { 
          question: "Which EM wave has the SHORTEST wavelength?", 
          options: ["Radio waves", "Infrared", "Gamma rays", "Ultraviolet"], 
          correctIndex: 2, 
          explanation: "Gamma rays have the shortest wavelength." 
        },
        { 
          question: "What is the relationship between energy and frequency?", 
          options: ["Directly proportional", "Inversely proportional", "No relationship", "They are equal"], 
          correctIndex: 0, 
          explanation: "Energy is directly proportional to frequency." 
        },
        { 
          question: "Why can X-rays penetrate soft tissue but not bones?", 
          options: ["Bones are denser", "X-rays have low energy", "Soft tissue is thicker", "Bones reflect X-rays"], 
          correctIndex: 0, 
          explanation: "Bones are denser and absorb more X-rays." 
        },
        { 
          question: "What is the wavelength of microwaves?", 
          options: ["1 mm to 10 cm", "400 nm to 700 nm", "10 cm to several km", "0.01 nm to 10 nm"], 
          correctIndex: 0, 
          explanation: "Microwaves: 1 mm to 10 cm." 
        },
        { 
          question: "Which EM wave is produced by nuclear reactions?", 
          options: ["Radio waves", "Gamma rays", "Ultraviolet", "X-rays"], 
          correctIndex: 1, 
          explanation: "Gamma rays are produced by nuclear reactions." 
        },
        { 
          question: "What is the wavelength of ultraviolet light?", 
          options: ["700 nm to 1 mm", "10 nm to 400 nm", "400 nm to 700 nm", "0.01 nm to 10 nm"], 
          correctIndex: 1, 
          explanation: "Ultraviolet: 10 nm to 400 nm." 
        }
      ]
    };

    const accessibilityBank = [
      { 
        question: "Which wave is the LONGEST?", 
        options: ["Radio waves", "Gamma rays", "X-rays"], 
        correctIndex: 0, 
        explanation: "Radio waves are the longest." 
      },
      { 
        question: "What do we use to cook food quickly?", 
        options: ["Radio waves", "Microwaves", "X-rays"], 
        correctIndex: 1, 
        explanation: "Microwaves cook food." 
      },
      { 
        question: "Which waves can we SEE?", 
        options: ["Infrared", "Visible light", "X-rays"], 
        correctIndex: 1, 
        explanation: "We can see visible light." 
      },
      { 
        question: "How fast do EM waves travel?", 
        options: ["3×10⁸ m/s", "3×10⁶ m/s", "Very slow"], 
        correctIndex: 0, 
        explanation: "EM waves travel at the speed of light." 
      },
      { 
        question: "What do we use for TV remotes?", 
        options: ["Radio waves", "Infrared", "X-rays"], 
        correctIndex: 1, 
        explanation: "Remote controls use infrared." 
      },
      { 
        question: "What do we use to see broken bones?", 
        options: ["X-rays", "Gamma rays", "UV rays"], 
        correctIndex: 0, 
        explanation: "X-rays help us see broken bones." 
      },
      { 
        question: "Which wave has the MOST energy?", 
        options: ["Radio waves", "Gamma rays", "Visible light"], 
        correctIndex: 1, 
        explanation: "Gamma rays have the most energy." 
      },
      { 
        question: "What colors are in visible light?", 
        options: ["ROYGBIV", "ABCDEF", "123456"], 
        correctIndex: 0, 
        explanation: "ROYGBIV = Red, Orange, Yellow, Green, Blue, Indigo, Violet." 
      },
      { 
        question: "What happens to frequency when wavelength gets shorter?", 
        options: ["Frequency increases", "Frequency decreases", "Frequency stays the same"], 
        correctIndex: 0, 
        explanation: "When wavelength is shorter, frequency is higher." 
      },
      { 
        question: "What do we use to treat cancer?", 
        options: ["X-rays", "Gamma rays", "UV rays"], 
        correctIndex: 1, 
        explanation: "Gamma rays are used in cancer treatment." 
      },
      { 
        question: "Which wave can damage our skin?", 
        options: ["Radio waves", "UV rays", "Visible light"], 
        correctIndex: 1, 
        explanation: "UV rays from the sun can damage skin." 
      },
      { 
        question: "What is the order of EM waves from low to high frequency?", 
        options: ["Radio→Micro→IR→Visible→UV→X-ray→Gamma", "Gamma→X-ray→UV→Visible→IR→Micro→Radio", "Visible→UV→X-ray→Gamma→Radio→Micro→IR"], 
        correctIndex: 0, 
        explanation: "Radio → Microwave → IR → Visible → UV → X-ray → Gamma." 
      }
    ];

    let bank = [];
    let pointsMultiplier = 1;
    let questionCountAdjusted = questionCount;
    let isAccessibility = accessibility;
    
    if (accessibility) {
      bank = accessibilityBank;
      pointsMultiplier = 1.2;
      questionCountAdjusted = Math.min(questionCount, bank.length);
    } else {
      if (difficulty === 'easy') {
        bank = questionBanks.easy;
        pointsMultiplier = 1;
      } else if (difficulty === 'medium') {
        bank = questionBanks.medium;
        pointsMultiplier = 1.5;
      } else if (difficulty === 'hard') {
        bank = questionBanks.hard;
        pointsMultiplier = 2;
      } else {
        bank = [...questionBanks.easy, ...questionBanks.medium, ...questionBanks.hard];
        pointsMultiplier = 1.5;
      }
    }
    
    const shuffled = shuffleArray([...bank]);
    const selected = shuffled.slice(0, Math.min(questionCountAdjusted, shuffled.length));
    
    return { 
      success: true, 
      quiz: selected,
      difficulty: accessibility ? 'accessibility' : difficulty,
      pointsMultiplier: pointsMultiplier,
      totalQuestions: selected.length,
      accessibility: accessibility
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}