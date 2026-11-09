// ========================================
// BEEKAY AI 3.0
// BEEKAY TECH
// Powered by Vercel AI Gateway
// ========================================


// ELEMENTS
const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const statusText = document.getElementById("status");


// MEMORY
let userName = localStorage.getItem("beekay_user") || "";
let conversation = [];
let isThinking = false;


// ========================================
// DISPLAY MESSAGES
// ========================================

function addMessage(message, type) {
    const div = document.createElement("div");

    div.className = "message " + type;
    div.textContent = message;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    return div;
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
// LOCAL MEMORY
// ========================================

function getLocalReply(message) {

    const text = message.toLowerCase().trim();

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

    // ASK NAME
    if (
        text.includes("what is my name") ||
        text.includes("do you know my name")
    ) {

        return userName
            ? `Your name is ${userName}!`
            : "You haven't told me your name yet.";
    }

    // FORGET NAME
    if (text.includes("forget my name")) {

        userName = "";

        localStorage.removeItem("beekay_user");

        return "Okay! I've cleared the name stored in this browser.";
    }

    return null;
}


// ========================================
// STREAM AI RESPONSE
// ========================================

async function getAIResponse(message, botMessage) {

    conversation.push({
        role: "user",
        content: message
    });

    try {

        statusText.textContent = "BEEKAY is thinking...";

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                messages: conversation.slice(-12)
            })

        });


        if (!response.ok) {

            const errorData = await response.json().catch(() => ({}));

            throw new Error(
                errorData.error || "Unable to connect to BEEKAY AI."
            );
        }


        if (!response.body) {

            throw new Error("Streaming is not supported.");
        }


        const reader = response.body.getReader();

        const decoder = new TextDecoder();

        let buffer = "";
        let fullReply = "";
        let finished = false;


        while (!finished) {

            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, {
                stream: true
            });

            const lines = buffer.split("\n");

            buffer = lines.pop() || "";


            for (const line of lines) {

                const trimmed = line.trim();

                if (!trimmed.startsWith("data:")) continue;

                const data = trimmed.slice(5).trim();

                if (data === "[DONE]") {

                    finished = true;
                    break;

                }


                try {

                    const parsed = JSON.parse(data);

                    const content =
                        parsed.choices?.[0]?.delta?.content;

                    if (typeof content === "string") {

                        fullReply += content;

                        botMessage.textContent = fullReply;

                        chatBox.scrollTop = chatBox.scrollHeight;

                    }

                } catch (error) {

                    console.warn("Stream chunk could not be parsed.");

                }

            }

        }


        if (!fullReply.trim()) {

            throw new Error("BEEKAY could not generate a response.");
        }


        conversation.push({
            role: "assistant",
            content: fullReply
        });


        statusText.textContent = "Ready.";

        speak(fullReply);


    } catch (error) {

        console.error("BEEKAY AI Error:", error);

        botMessage.textContent =
            "Sorry, I couldn't connect to my AI brain. Please try again.";

        statusText.textContent = "Connection error.";

    }

}


// ========================================
// SEND MESSAGE
// ========================================

async function sendMessage() {

    if (isThinking) return;

    const message = input.value.trim();

    if (!message) return;


    addMessage(message, "user");

    input.value = "";

    isThinking = true;


    // LOCAL MEMORY COMMANDS
    const localReply = getLocalReply(message);

    if (localReply) {

        const botMessage = addMessage("", "bot");

        botMessage.textContent = localReply;

        conversation.push({
            role: "user",
            content: message
        });

        conversation.push({
            role: "assistant",
            content: localReply
        });

        speak(localReply);

        statusText.textContent = "Ready.";

        isThinking = false;

        return;
    }


    // AI RESPONSE
    const botMessage = addMessage("", "bot");

    try {

        await getAIResponse(message, botMessage);

    } finally {

        isThinking = false;

    }

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


    if (isThinking) return;


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
