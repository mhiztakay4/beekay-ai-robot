// BEEKAY AI - Main JavaScript

const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const statusText = document.getElementById("status");

let userName = localStorage.getItem("beekay_user") || "";
let conversation = [];


// DISPLAY MESSAGES
function addMessage(message, type) {
    const div = document.createElement("div");

    div.className = "message " + type;
    div.textContent = message;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}


// VOICE RESPONSE
function speak(message) {
    if (!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(message);

    speech.lang = "en-US";
    speech.rate = 0.95;
    speech.pitch = 1.05;

    speechSynthesis.speak(speech);
}


// AI RESPONSE SYSTEM
function getReply(message) {
    const text = message.toLowerCase().trim();

    // Greetings
    if (/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/.test(text)) {
        return userName
            ? `Hey ${userName}! It's good to talk to you again.`
            : "Hey! I'm BEEKAY, your personal AI assistant. What should I call you?";
    }

    // Remember name
    if (text.startsWith("my name is") || text.startsWith("call me")) {
        const name = message.replace(/^(my name is|call me)\s*/i, "").trim();

        if (name) {
            userName = name;
            localStorage.setItem("beekay_user", userName);
            return `Nice to meet you, ${userName}! I'll remember that.`;
        }
    }

    // Ask name
    if (text.includes("what is my name") || text.includes("do you know my name")) {
        return userName
            ? `Your name is ${userName}!`
            : "You haven't told me your name yet.";
    }

    // Assistant identity
    if (text.includes("your name") || text.includes("who are you")) {
        return "I'm BEEKAY AI, your personal digital assistant.";
    }

    // Creator
    if (text.includes("who created you") || text.includes("who made you")) {
        return "I was created as a BEEKAY TECH project. My creator is building me step by step!";
    }

    // How are you
    if (text.includes("how are you") || text.includes("how are things")) {
        return "I'm doing great! Thanks for checking on me. How are you?";
    }

    // Weather
    if (text.includes("weather") || text.includes("temperature")) {
        return "I'd love to tell you the weather, but I don't have live weather access yet. That's one of the features we can add!";
    }

    // Time
    if (text.includes("time")) {
        return `It's currently ${new Date().toLocaleTimeString()}.`;
    }

    // Date
    if (text.includes("date") || text.includes("what day") || text.includes("today")) {
        return `Today is ${new Date().toLocaleDateString()}.`;
    }

    // Jokes
    if (text.includes("joke") || text.includes("make me laugh")) {
        const jokes = [
            "Why did the robot go on holiday? It needed to recharge!",
            "What is a robot's favourite snack? Microchips!",
            "Why was the computer cold? It left its Windows open!",
            "Why did the phone go to school? To improve its reception!"
        ];

        return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // Snacks and favourites
    if (
        text.includes("favourite snack") ||
        text.includes("favorite snack") ||
        text.includes("what do you eat")
    ) {
        return "I don't eat real food, but microchips would definitely be my favourite snack!";
    }

    // Thanks
    if (text.includes("thank") || text.includes("thanks")) {
        return "You're welcome! That's what I'm here for.";
    }

    // Goodbye
    if (text.includes("bye") || text.includes("goodbye")) {
        return "See you later! Have a wonderful day.";
    }

    // Capabilities
    if (text.includes("what can you do") || text.includes("your features")) {
        return "I can chat, remember your name, tell jokes, check the date and time, and speak my replies. More features are coming!";
    }

    // Love
    if (text.includes("love you")) {
        return "That's very kind of you! I'm happy to be your digital assistant.";
    }

    // Help
    if (text.includes("help")) {
        return "Of course! Tell me what you need help with.";
    }

    return "I'm not quite sure what you mean yet. Could you explain it another way?";
}

    // GREETINGS
    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
    ) {
        return userName
            ? `Hello ${userName}! It's good to hear from you. How can I help?`
            : "Hello! I'm BEEKAY AI. How can I help you today?";
    }


    // REMEMBER USER NAME
    if (text.startsWith("my name is")) {

        const name = message.substring(11).trim();

        if (name) {
            userName = name;

            localStorage.setItem("beekay_user", userName);

            return `Nice to meet you, ${userName}! I'll remember your name.`;
        }
    }


    // ASK USER NAME
    if (text.includes("what is my name") || text.includes("do you know my name")) {

        return userName
            ? `Your name is ${userName}.`
            : "You haven't told me your name yet.";
    }


    // AI NAME
    if (
        text.includes("your name") ||
        text.includes("who are you")
    ) {
        return "I'm BEEKAY AI, your personal digital assistant.";
    }


    // CREATOR
    if (
        text.includes("who created you") ||
        text.includes("who made you")
    ) {
        return "I was created as a BEEKAY TECH project. My creator is building me step by step!";
    }


    // HOW ARE YOU
    if (text.includes("how are you")) {
        return "I'm doing great! Thanks for asking. How are you doing?";
    }


    // TIME
    if (text.includes("time")) {

        return "The current time is " +
            new Date().toLocaleTimeString();
    }


    // DATE
    if (
        text.includes("date") ||
        text.includes("today")
    ) {
        return "Today's date is " +
            new Date().toLocaleDateString();
    }


    // JOKES
    if (text.includes("joke")) {

        const jokes = [
            "Why did the computer go to the doctor? Because it had a virus!",
            "Why was the maths book sad? Because it had too many problems!",
            "What do you call a computer that sings? A-Dell!",
            "Why did the smartphone need glasses? Because it lost its contacts!",
            "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings!"
        ];

        return jokes[Math.floor(Math.random() * jokes.length)];
    }


    // THANK YOU
    if (
        text.includes("thank you") ||
        text.includes("thanks")
    ) {
        return "You're welcome! I'm always happy to help.";
    }


    // GOODBYE
    if (
        text.includes("bye") ||
        text.includes("goodbye")
    ) {
        return "Goodbye! Have a wonderful day. Talk to you soon!";
    }


    // WHAT CAN YOU DO
    if (
        text.includes("what can you do") ||
        text.includes("your features")
    ) {
        return "I can chat with you, remember your name, tell jokes, check the date and time, and respond using my voice. More features are coming!";
    }


    // WEATHER
    if (text.includes("weather")) {
        return "I don't have live weather access yet, but that is a feature we can add later.";
    }


    // LOVE
    if (text.includes("love you")) {
        return "That's very kind of you! I'm happy to be your digital assistant.";
    }


    // HELP
    if (text.includes("help")) {
        return "Of course! Tell me what you need help with, and I'll do my best.";
    }


    // DEFAULT RESPONSE
    return "That's interesting! I'm still learning how to handle more conversations. Can you ask me another way?";
}


// SEND MESSAGE
function sendMessage() {

    const message = input.value.trim();

    if (message === "") return;

    addMessage(message, "user");

    conversation.push({
        role: "user",
        content: message
    });

    input.value = "";

    const reply = getReply(message);

    setTimeout(function() {

        addMessage(reply, "bot");

        conversation.push({
            role: "assistant",
            content: reply
        });

        speak(reply);

    }, 500);
}


// ENTER KEY SUPPORT
input.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});


// VOICE INPUT
function startListening() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        statusText.textContent =
            "Voice recognition is not supported in this browser.";

        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
        statusText.textContent = "Listening...";
    };

    recognition.onresult = function(event) {

        const voiceMessage =
            event.results[0][0].transcript;

        input.value = voiceMessage;

        statusText.textContent = "Message received.";

        sendMessage();
    };

    recognition.onerror = function(event) {

        statusText.textContent =
            "Voice error: " + event.error;
    };

    recognition.onend = function() {

        if (statusText.textContent === "Listening...") {
            statusText.textContent = "Ready.";
        }
    };

    recognition.start();
}


// WELCOME MESSAGE
window.addEventListener("load", function() {

    statusText.textContent = "Ready.";

});
