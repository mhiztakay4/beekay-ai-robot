const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const statusText = document.getElementById("status");

function addMessage(message, type) {
    const div = document.createElement("div");
    div.className = "message " + type;
    div.textContent = message;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function speak(message) {
    if ("speechSynthesis" in window) {
        speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(message);
        speech.lang = "en-US";

        speechSynthesis.speak(speech);
    }
}

function sendMessage() {
    const message = input.value.trim();

    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    statusText.textContent = "Thinking...";

    let reply;

    const text = message.toLowerCase();

    if (text.includes("hello") || text.includes("hi")) {
        reply = "Hello! Welcome. I'm BEEKAY AI.";
    } else if (text.includes("your name")) {
        reply = "My name is BEEKAY AI ROBOT.";
    } else if (text.includes("how are you")) {
        reply = "I'm functioning perfectly. How can I help?";
    } else if (text.includes("time")) {
        reply = "The time is " + new Date().toLocaleTimeString();
    } else {
        reply = "That's interesting! My AI brain is still under development.";
    }

    setTimeout(() => {
        addMessage(reply, "bot");
        speak(reply);
        statusText.textContent = "Ready to assist you";
    }, 700);
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
    recognition.start();

    statusText.textContent = "Listening...";

    recognition.onresult = function(event) {
        input.value = event.results[0][0].transcript;
        sendMessage();
    };

    recognition.onerror = function() {
        statusText.textContent = "Voice recognition error";
    };

    recognition.onend = function() {
        statusText.textContent = "Ready to assist you";
    };
}
