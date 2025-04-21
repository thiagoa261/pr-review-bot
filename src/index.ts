import express from "express";
import dotenv from "dotenv";
import { webhooks } from "./github/webhook";
import "./handlers/issueComment";

dotenv.config();

const app = express();

app.use(
	express.json({
		verify: (req: any, _, buf) => {
			req.rawBody = buf.toString();
		},
	}),
);

app.post("/webhooks/github", async (req: any, res) => {
	try {
		await webhooks.verifyAndReceive({
			id: req.headers["x-github-delivery"] as string,
			name: req.headers["x-github-event"] as string,
			signature: req.headers["x-hub-signature-256"] as string,
			payload: req.rawBody,
		});

		res.status(200).send("Evento processado com sucesso");

		//
	} catch (err) {
		console.error("❌ Erro ao processar webhook:", err);
		res.status(400).send("Webhook inválido");
	}
});

app.listen(process.env.PORT, () => {
	console.log(`Servidor ouvindo na porta ${process.env.PORT}`);
});
