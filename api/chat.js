export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const apiKey = process.env.AI_GATEWAY_API_KEY;
    const model = process.env.AI_MODEL;

if (!apiKey) {
    return res.status(503).json({
        error: "AI_GATEWAY_API_KEY is missing."
    });
}

if (!model) {
    return res.status(503).json({
        error: "AI_MODEL is missing."
    });
}

    try {
        const { messages } = req.body || {};

        if (!Array.isArray(messages) || !messages.length) {
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
                            content: "You are BEEKAY AI, a friendly, helpful digital assistant created by BEEKAY TECH. Speak naturally, clearly and respectfully."
                        },
                        ...safeMessages
                    ],
                    stream: true,
                    max_tokens: 500
                })
            }
        );

        if (!response.ok || !response.body) {
            return res.status(502).json({
                error: "The AI service could not complete the request."
            });
        }

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("Connection", "keep-alive");

        const reader = response.body.getReader();

        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            res.write(value);
        }

        return res.end();

    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({
                error: "Something went wrong."
            });
        }

        return res.end();
    }
}
