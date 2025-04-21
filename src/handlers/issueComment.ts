import { webhooks } from "../github/webhook";
import { gitHubClient, commentPR } from "../services/github";
import { generateFeedbackPR } from "../services/openai";

webhooks.on("issue_comment.created", async ({ payload }) => {
	const comment = payload.comment.body;
	const isPR = !!payload.issue.pull_request;

	if (!isPR || !comment.trim().toLowerCase().startsWith("/review")) return;

	const owner = payload.repository.owner.login;
	const repo = payload.repository.name;
	const pullNumber = payload.issue.number;
	const installationId = payload.installation?.id;

	if (!installationId) return;

	const octokit = await gitHubClient(installationId);

	const arquivos = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}/files", {
		owner,
		repo,
		pull_number: pullNumber,
	});

	const diffs = arquivos.data.map((f) => `Arquivo: ${f.filename}\n${f.patch}`).join("\n\n");

	const mensagem = await generateFeedbackPR(diffs);

	await commentPR(octokit, owner, repo, pullNumber, mensagem);

	console.log("💬 comentário criado");
});
