import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";

export async function gitHubClient(installationId: number): Promise<Octokit> {
	const octokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: Number(process.env.GITHUB_APP_ID),
			privateKey: process.env.GITHUB_PRIVATE_KEY!,
			installationId,
		},
	});

	return octokit;
}

export async function commentPR(octokit: Octokit, owner: string, repo: string, pullNumber: number, mensagem: string) {
	await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
		owner,
		repo,
		issue_number: pullNumber,
		body: mensagem,
	});
}
