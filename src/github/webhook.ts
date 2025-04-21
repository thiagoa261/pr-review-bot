import { Webhooks } from "@octokit/webhooks";

export const webhooks = new Webhooks({
	secret: process.env.GITHUB_WEBHOOK_SECRET!,
});
