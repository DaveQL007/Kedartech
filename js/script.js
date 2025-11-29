// --- CONFIGURATION ---
const API_KEY = ""; // PASTE YOUR GEMINI API KEY HERE
const SYSTEM_PROMPT = `
You are the AI assistant for KedarTechHub, a premium data analytics tutoring service run by David Ndukwe.
Tone: Professional, encouraging.
Context:
- David is a PMP Certified Data Analyst (3+ yrs exp).
- Pricing: Excel (#100k), SQL (#150k), Python (#200k), Power BI (#150k), Bundle (#500k).
- Services: 1-on-1 tutoring, portfolio building.
Goals: Answer curriculum questions, explain value, encourage booking. Keep responses under 3 sentences.
`;

// --- UI LOGIC ---

// Mobile Menu
function toggleMenu() {
    document.querySelector('#nav-menu ul').classList.toggle('open');
}

// Booking Form Steps
function nextStep(step) {
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');
}

function prevStep(step) {
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');
}

function handleBooking(e) {
    e.preventDefault();
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.getElementById('successStep').classList.add('active');
}

function resetForm() {
    document.getElementById('bookingForm').reset();
    nextStep(1);
}

// --- AI CHATBOT LOGIC ---

let isChatOpen = false;
let voiceEnabled = false;

function toggleChat() {
    const window = document.getElementById('chat-window');
    isChatOpen = !isChatOpen;
    window.classList.toggle('hidden', !isChatOpen);
}

function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    const btn = document.getElementById('voiceBtn');
    btn.innerHTML = voiceEnabled ? '<i data-lucide="volume-2"></i>' : '<i data-lucide="volume-x"></i>';
    lucide.createIcons();
}

function addMessage(text, isBot) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `msg ${isBot ? 'bot' : 'user'}`;
    div.innerHTML = `<div class="bubble">${text}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

async function callGemini(text, systemPrompt = SYSTEM_PROMPT) {
    if (!API_KEY) return "Please configure the API Key in script.js";
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
    const payload = {
        contents: [{ parts: [{ text: text }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking right now.";
    } catch (e) {
        return "Network error. Please try again.";
    }
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, false);
    input.value = '';

    // Show typing
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing';
    typingDiv.className = 'msg bot';
    typingDiv.innerHTML = '<div class="bubble">...</div>';
    document.getElementById('chat-messages').appendChild(typingDiv);

    // Call AI
    const response = await callGemini(text);
    
    // Remove typing and add response
    document.getElementById('typing').remove();
    addMessage(response, true);

    if (voiceEnabled) speak(response);
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

function startDictation() {
    if (!window.webkitSpeechRecognition) return alert("Not supported in this browser");
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    const btn = document.querySelector('.mic-btn');
    
    recognition.onstart = () => btn.classList.add('listening');
    recognition.onend = () => btn.classList.remove('listening');
    
    recognition.onresult = (e) => {
        document.getElementById('userInput').value = e.results[0][0].transcript;
    };
    recognition.start();
}

// --- AI CAREER PLANNER ---

function openAIPlanner() {
    document.getElementById('planner-modal').classList.remove('hidden');
}

function closeAIPlanner() {
    document.getElementById('planner-modal').classList.add('hidden');
}

async function generateRoadmap() {
    const role = document.getElementById('currentRole').value;
    if (!role) return;

    const btn = document.querySelector('#planner-form button');
    const originalText = btn.innerText;
    btn.innerText = "Generating...";
    btn.disabled = true;

    const prompt = `I am a ${role}. Generate a 4-month transition plan to Data Analyst using KedarTechHub curriculum (Excel, SQL, PowerBI, Python). Highlight transferable skills. Format as clean text with emojis.`;
    
    const plan = await callGemini(prompt, "You are a career coach.");
    
    document.getElementById('planner-form').classList.add('hidden');
    document.getElementById('planner-result').classList.remove('hidden');
    document.getElementById('roadmap-text').innerText = plan;
    
    btn.innerText = originalText;
    btn.disabled = false;
}

function resetPlanner() {
    document.getElementById('planner-result').classList.add('hidden');
    document.getElementById('planner-form').classList.remove('hidden');
    document.getElementById('currentRole').value = '';
}
