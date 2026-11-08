const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const statusText = document.getElementById("status");

let userName = localStorage.getItem("beekay_user") || "";
let conversation = [];

function addMessage(message, type) {
const div = document.createElement("div");
div.className = "message " + type;
div.textContent = message;

chatBox.appendChild(div);
chatBox.scrollTop = chatBox.scrollHeight;

}

function speak(message) {
if (!("speechSynthesis" in window)) return;

speechSynthesis.cancel();

const speech = new SpeechSynthesisUtterance(message);
speech.lang = "en-US";
speech.rate = 0.95;
speech.pitch = 1.05;

speechSynthesis.speak(speech);

}

function getReply(message) {
const text = message.toLowerCase().trim();

if (text.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return userName
        ? `Hey ${userName}! Good to hear from you. What's happening?`
        : "Hey! I'm BEEKAY, your personal AI assistant. What should I call you?";
}

if (text.includes("my name is")) {
    userName = message.split(/my name is/i)[1].trim();
    localStorage.setItem("beekay_user", userName);
    return `Nice to meet you, ${userName}! I'll remember your name on this device.`;
}

if (text.includes("your name")) {
    return "I'm BEEKAY AI, your personal digital assistant!";
}

if (text.includes("who created you") || text.includes("who made you")) {
    return "I was created as a BEEKAY TECH project. My creator is building me step by step!";
}

if (text.includes("how are you")) {
    return "I'm doing great! All systems are running. How are things with you?";
}

if (text.includes("time")) {
    return `The current time is ${new Date().toLocaleTimeString()}.`;
}

if (text.includes("date") || text.includes("today")) {
    return `Today is ${new Date().toDateString()}.`;
}

if (text.includes("joke")) {
    const jokes = [
        "Why did the computer go to the doctor? Because it had a virus!",
        "Why was the JavaScript developer sad? Because he didn't know how to null his feelings!",
        "Why do robots never get tired? They recharge!",
        "What is a robot's favourite snack? Microchips!"
    ];

    return jokes[Math.floor(Math.random() * jokes.length)];
}

if (text.includes("thank")) {
    return "You're welcome! That's what I'm here for.";
}

if (text.includes("bye") || text.includes("goodbye")) {
    return "See you later! I'll be right here when you need me.";
}

if (text.includes("what can you do")) {
    return "I can chat, tell jokes, remember your name, tell you the date and time, and assist with basic questions. I'm still growing!";
}

if (text.includes("love you")) {
    return "That's very kind of you! I'm happy to be your assistant.";
}

return "That's interesting! I'm still learning how to handle more conversations. Can you ask me another way?";

}

function sendMessage() {
const message = input.value.trim();

if (!message) return;

addMessage(message, "user");

conversation.push({
    role: "user",
    content: message
});

input.value = "";
statusText.textContent = "Thinking...";

const reply = getReply(message);

setTimeout(() => {
    addMessage(reply, "bot");

    conversation.push({
        role: "assistant",
        content: reply
    });

    speak(reply);

    statusText.textContent = "Ready to assist you";
}, 600);

}

input.addEventListener("keypress", function(event) {
if (event.key === "Enter") {
sendMessage();
}
});

function startListening() {
const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Voice recognition is not supported in this browser.");
    return;
}

const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.continuous = false;
recognition.interimResults = false;

statusText.textContent = "Listening...";

recognition.onresult = function(event) {
    input.value = event.results[0][0].transcript;
    sendMessage();
};

recognition.onerror = function() {
    statusText.textContent = "Microphone error";
};

recognition.onend = function() {
    if (statusText.textContent === "Listening...") {
        statusText.textContent = "Ready to assist you";
    }
};

recognition.start();

        }
