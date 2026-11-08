// ========================================
// BEEKAY AI 2.0
// BEEKAY TECH
// ========================================


// ELEMENTS
const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const statusText = document.getElementById("status");


// MEMORY
let userName = localStorage.getItem("beekay_user") || "";
let conversation = [];


// ========================================
// DISPLAY MESSAGES
// ========================================

function addMessage(message, type) {
    const div = document.createElement("div");

    div.className = "message " + type;
    div.textContent = message;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}


// ========================================
// VOICE RESPONSE
// ========================================

function speak(message) {

    if (!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(message);

    speech.lang = "en-US";
    speech.rate = 0.95;
    speech.pitch = 1.05;

    speechSynthesis.speak(speech);
}


// ========================================
// HELPER FUNCTIONS
// ========================================

function randomReply(replies) {
    return replies[Math.floor(Math.random() * replies.length)];
}


// ========================================
// BEEKAY AI BRAIN
// ========================================

function getReply(message) {

    const text = message.toLowerCase().trim();


    // EMPTY MESSAGE
    if (!text) {
        return "I'm listening. What would you like to say?";
    }


    // GREETINGS
    if (/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/.test(text)) {

        return userName
            ? `Hey ${userName}! It's good to talk to you again.`
            : "Hey! I'm BEEKAY, your personal AI assistant. What should I call you?";
    }


    // REMEMBER NAME
    if (
        text.startsWith("my name is") ||
        text.startsWith("call me")
    ) {

        const name = message.replace(
            /^(my name is|call me)\s*/i,
            ""
        ).trim();

        if (name) {

            userName = name;

            localStorage.setItem("beekay_user", userName);

            return `Nice to meet you, ${userName}! I'll remember that.`;
        }
    }


    // ASK USER NAME
    if (
        text.includes("what is my name") ||
        text.includes("do you know my name")
    ) {

        return userName
            ? `Your name is ${userName}!`
            : "You haven't told me your name yet.";
    }


    // CHANGE NAME
    if (text.includes("forget my name")) {

        userName = "";

        localStorage.removeItem("beekay_user");

        return "Okay! I've cleared the name stored in this browser.";
    }


    // ASSISTANT IDENTITY
    if (
        text.includes("your name") ||
        text.includes("who are you")
    ) {

        return "I'm BEEKAY AI, your personal digital assistant, built under BEEKAY TECH.";
    }


    // CREATOR
    if (
        text.includes("who created you") ||
        text.includes("who made you") ||
        text.includes("your creator")
    ) {

        return "I was created as a BEEKAY TECH project. My creator is building me step by step!";
    }


    // HOW ARE YOU
    if (
        text.includes("how are you") ||
        text.includes("how are things")
    ) {

        return randomReply([
            "I'm doing great! Thanks for checking on me. How are you?",
            "I'm functioning perfectly and ready to chat!",
            "I'm good! What are we talking about today?"
        ]);
    }


    // WEATHER
    if (
        text.includes("weather") ||
        text.includes("temperature") ||
        text.includes("forecast")
    ) {

        return "I'd love to tell you the weather, but I don't have live weather access yet. That's a feature we can add later!";
    }


    // TIME
    if (
        text.includes("time") ||
        text.includes("what time is it")
    ) {

        return "It's currently " +
            new Date().toLocaleTimeString();
    }


    // DATE
    if (
        text.includes("date") ||
        text.includes("what day") ||
        text.includes("today")
    ) {

        return "Today is " +
            new Date().toLocaleDateString();
    }


    // JOKES
    if (
        text.includes("joke") ||
        text.includes("make me laugh") ||
        text.includes("funny")
    ) {

        const jokes = [

            "Why did the robot go on holiday? It needed to recharge!",

            "What is a robot's favourite snack? Microchips!",

            "Why was the computer cold? It left its Windows open!",

            "Why did the phone go to school? To improve its reception!",

            "What do you call a robot that takes the long way around? R2-Detour!",

            "Why did the computer visit the doctor? It had a virus!"

        ];

        return randomReply(jokes);
    }


    // FAVOURITE SNACK
    if (
        text.includes("favourite snack") ||
        text.includes("favorite snack") ||
        text.includes("what do you eat")
    ) {

        return "I don't eat real food, but microchips would definitely be my favourite snack!";
    }


    // MUSIC
    if (
        text.includes("music") ||
        text.includes("song")
    ) {

        return "I enjoy the idea of music! What kind of music do you like?";
    }


    // THANK YOU
    if (
        text.includes("thank") ||
        text.includes("thanks")
    ) {

        return randomReply([
            "You're welcome! That's what I'm here for.",
            "Anytime! Happy to help.",
            "You're welcome! What else is on your mind?"
        ]);
    }


    // GOODBYE
    if (
        text.includes("bye") ||
        text.includes("goodbye") ||
        text.includes("see you later")
    ) {

        return "See you later! Have a wonderful day.";
    }


    // CAPABILITIES
    if (
        text.includes("what can you do") ||
        text.includes("your features")
    ) {

        return "I can chat with you, remember your name, tell jokes, check the date and time, and speak my replies. More features are coming!";
    }


    // HOW OLD ARE YOU
    if (text.includes("how old are you")) {

        return "I'm a digital assistant, so I don't have a human age. I'm growing through development!";
    }


    // LOVE
    if (text.includes("love you")) {

        return "That's very kind of you! I'm happy to be your digital assistant.";
    }


    // HELP
    if (
        text.includes("help") ||
        text.includes("assist me")
    ) {

        return "Of course! Tell me what you need help with, and I'll do my best.";
    }


    // WHAT ARE YOU DOING
    if (
        text.includes("what are you doing") ||
        text.includes("are you busy")
    ) {

        return "I'm right here, ready to chat with you!";
    }


    // COMPLIMENTS
    if (
        text.includes("you are smart") ||
        text.includes("you are intelligent")
    ) {

        return "Thank you! My creator is working hard to make me smarter.";
    }


    // DEFAULT RESPONSE
    return randomReply([

        "That's interesting! Tell me more.",

        "I want to understand you better. Can you explain that?",

        "Hmm, that's something new for me. Say a little more.",

        "I'm listening. What happened next?",

        "Interesting! Let's talk more about that."

    ]);
}


// ========================================
// SEND MESSAGE
// ========================================

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


// ========================================
// ENTER KEY SUPPORT
// ========================================

input.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {

        sendMessage();

    }

});


// ========================================
// VOICE RECOGNITION
// ========================================

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


// ========================================
// WELCOME
// ========================================

window.addEventListener("load", function() {

    statusText.textContent = "Ready.";

});
