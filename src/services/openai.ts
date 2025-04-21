import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateFeedbackPR(diffs: string): Promise<string> {
	const completion = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{ role: "system", content: process.env.OPENAI_API_PROMPT as string },
			{ role: "user", content: `Alterações: ${diffs}` },
		],
	});

	return completion.choices[0]?.message.content || "Nenhum comentário gerado";
}
