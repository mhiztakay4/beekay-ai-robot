export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const apiKey = process.env.AI_GATEWAY_API_KEY;
    const model = process.env.AI_MODEL;

    if (!apiKey || !model) {
        return res.status(503).json({
            error: "BEEKAY AI is not connected to an AI model yet."
        });
    }

    try {
        const { messages } = req.body || {};

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: "Please send a message."
            });
        }

        const safeMessages = messages
            .filter(m =>
                m &&
                ["user", "assistant"].includes(m.role) &&
                typeof m.content === "string"
            )
            .slice(-12)
            .map(m => ({
                role: m.role,
                content: m.content.slice(0, 2000)
            }));

        const response = await fetch(
            "https://ai-gateway.vercel.sh/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: "system",
                            content: "You are BEEKAY AI, a friendly, helpful digital assistant created as a BEEKAY TECH project. Speak naturally, clearly and respectfully."
                        },
                        ...safeMessages
                    ],
                    max_tokens: 500
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(502).json({
                error: "The AI service could not complete the request."
            });
        }

        const reply = data.choices?.[0]?.message?.content;

        return res.status(200).json({
            reply: reply || "I couldn't generate a response."
        });

    } catch (error) {
        return res.status(500).json({
            error: "Something went wrong. Please try again."
        });
    }
}
