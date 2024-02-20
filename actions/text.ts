import { bot } from "../config/index.ts";
import { Context } from "../deps.ts";

const openaiUrl = "https://api.openai.com/v1/chat/completions";
const openaiApiKey = Deno.env.get("OPEN_API_KEY"); // Replace with your actual OpenAI API key
console.log({ openaiApiKey });
// OpenAI API function
async function getOpenAIResponse(
    userInput: string
): Promise<string | undefined> {
    const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
    });

    const data = {
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: userInput },
        ],
    };

    const response = await fetch(openaiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    });

    if (response.ok) {
        const result = await response.json();
        return result.choices[0].message.content;
    } else {
        console.error("Error:", response.status, response.statusText);
        return undefined;
    }
}

// GrammY bot command
bot.on("message:text", async (ctx: Context) => {
    const userInput = ctx.message?.text || "";
    const openaiResponse = await getOpenAIResponse(userInput);

    if (openaiResponse) {
        await ctx.reply(openaiResponse, {
            reply_to_message_id: ctx.message?.message_id,
        });
    } else {
        await ctx.reply(
            "Sorry, an error occurred while processing your request."
        );
    }
});
