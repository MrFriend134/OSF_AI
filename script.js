// REEMPLAZA ESTO CON TU API KEY
const API_KEY = 'AIzaSyArPJnOwzeDJme45H5Kf56ObUPI4LWx_5E'; 
// URL corregida para Gemini 1.5 Flash (más estable)
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function callOSFAI(prompt) {
    // Instrucción para detectar idioma y generar código extenso
    const systemPrompt = "You are OSF AI. Always detect the user language: if they speak Spanish, reply in Spanish; if they speak English, reply in English. You are an expert developer capable of writing thousands of lines of code. Use markdown for code blocks.";

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ 
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }] 
            }],
            generationConfig: {
                maxOutputTokens: 8192, // Capacidad para códigos largos
                temperature: 0.2
            }
        })
    });

    if (!response.ok) throw new Error(`Server Error: ${response.status}`);
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function displayMessage(text, type) {
    const div = document.createElement('div');
    div.className = `message ${type}-message`;
    
    // Formatear código
    let htmlContent = text.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    div.innerHTML = htmlContent.replace(/\n/g, '<br>');
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener('click', async () => {
    const msg = userInput.value.trim();
    if (!msg) return;

    displayMessage(msg, 'user');
    userInput.value = '';

    const loading = document.createElement('div');
    loading.className = 'message bot-message';
    loading.innerText = 'OSF AI is thinking... / OSF AI está pensando...';
    chatBox.appendChild(loading);

    try {
        const aiReply = await callOSFAI(msg);
        chatBox.removeChild(loading);
        displayMessage(aiReply, 'bot');
    } catch (err) {
        loading.innerText = `Error: ${err.message}. Check your API Key.`;
    }
});