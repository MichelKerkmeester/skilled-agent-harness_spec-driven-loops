import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const ROOT = resolve(new URL("../..", import.meta.url).pathname);
const MODEL_PROVIDER = "opencode";
const MODEL_ID = "deepseek-v4-flash-free";

function readJsonLines(value) {
	return value.split("\n").filter(Boolean).map((line) => JSON.parse(line));
}

function requestBody(request) {
	return new Promise((resolveBody, reject) => {
		const chunks = [];
		request.on("data", (chunk) => chunks.push(chunk));
		request.on("end", () => {
			try {
				resolveBody(JSON.parse(Buffer.concat(chunks).toString("utf8")));
			} catch (error) {
				reject(error);
			}
		});
		request.on("error", reject);
	});
}

function streamResponse(model) {
	const id = `fixture-${Date.now()}`;
	const created = Math.floor(Date.now() / 1000);
	const events = [
		{
			id,
			object: "chat.completion.chunk",
			created,
			model,
			choices: [{ index: 0, delta: { role: "assistant" }, finish_reason: null }],
		},
		{
			id,
			object: "chat.completion.chunk",
			created,
			model,
			choices: [{ index: 0, delta: { content: "ready" }, finish_reason: null }],
		},
		{
			id,
			object: "chat.completion.chunk",
			created,
			model,
			choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
			usage: { prompt_tokens: 12, completion_tokens: 1, total_tokens: 13 },
		},
	];
	return `${events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join("")}data: [DONE]\n\n`;
}

async function listen(server) {
	await new Promise((resolveListen, reject) => {
		server.once("error", reject);
		server.listen(0, "127.0.0.1", resolveListen);
	});
	return server.address().port;
}

function runPi({ agentDir, projectDir, observationsPath, probePath, endpoint }) {
	const args = [
		"--no-extensions",
		"-e", join(ROOT, ".pi/extensions/deep-pi/extensions/deeppi.ts"),
		"-e", join(ROOT, ".pi/extensions/pi-cache-optimizer/index.ts"),
		"-e", probePath,
		"--provider", MODEL_PROVIDER,
		"--model", MODEL_ID,
		"--api-key", "local-fixture",
		"--no-session",
		"--no-tools",
		"--offline",
		"--print",
		"Reply with the word ready.",
	];

	return new Promise((resolveRun) => {
		const child = spawn(process.env.PI_BIN ?? "pi", args, {
			cwd: projectDir,
			env: {
				...process.env,
				PI_CODING_AGENT_DIR: agentDir,
				PI_OFFLINE: "1",
				PI_TELEMETRY: "0",
				DEEP_PI_FIXTURE_OBSERVATIONS: observationsPath,
				DEEP_PI_FIXTURE_ENDPOINT: endpoint,
			},
			stdio: ["ignore", "pipe", "pipe"],
		});
		const stdout = [];
		const stderr = [];
		child.stdout.on("data", (chunk) => stdout.push(chunk));
		child.stderr.on("data", (chunk) => stderr.push(chunk));
		child.on("close", (code, signal) => resolveRun({
			code,
			signal,
			stdout: Buffer.concat(stdout).toString("utf8"),
			stderr: Buffer.concat(stderr).toString("utf8"),
		}));
	});
}

async function main() {
	const tempRoot = await mkdtemp(join(tmpdir(), "deep-pi-boundary-"));
	const agentDir = join(tempRoot, "agent");
	const projectDir = join(tempRoot, "project");
	await mkdir(agentDir, { recursive: true });
	await mkdir(projectDir, { recursive: true });

	const observationsPath = join(tempRoot, "observations.jsonl");
	const probePath = join(tempRoot, "probe.mjs");
	await writeFile(probePath, `import { appendFileSync } from "node:fs";
const output = process.env.DEEP_PI_FIXTURE_OBSERVATIONS;
function observe(value) {
  appendFileSync(output, JSON.stringify(value) + "\\n");
}
export default function (pi) {
  pi.on("session_start", (_event, ctx) => observe({
    hook: "session_start",
    provider: ctx.model?.provider ?? null,
    model: ctx.model?.id ?? null,
    cacheRetention: process.env.PI_CACHE_RETENTION ?? null,
  }));
  pi.on("before_agent_start", (event, ctx) => observe({
    hook: "before_agent_start",
    provider: ctx.model?.provider ?? null,
    model: ctx.model?.id ?? null,
    systemPromptLength: event.systemPrompt.length,
    cacheRetention: process.env.PI_CACHE_RETENTION ?? null,
  }));
}
`);

	const serverRequests = [];
	const server = createServer(async (request, response) => {
		if (request.method !== "POST" || request.url !== "/v1/chat/completions") {
			response.writeHead(404).end();
			return;
		}
		const body = await requestBody(request);
		serverRequests.push({
			remoteAddress: request.socket.remoteAddress,
			url: request.url,
			model: body.model,
			messageRoles: Array.isArray(body.messages) ? body.messages.map((message) => message.role) : [],
			systemPromptLength: typeof body.messages?.[0]?.content === "string" ? body.messages[0].content.length : null,
		});
		response.writeHead(200, {
			"content-type": "text/event-stream",
			"cache-control": "no-cache",
			connection: "keep-alive",
		});
		response.end(streamResponse(body.model));
	});

	try {
		const port = await listen(server);
		const endpoint = `http://127.0.0.1:${port}/v1`;
		await writeFile(join(agentDir, "models.json"), `${JSON.stringify({
			providers: {
				[MODEL_PROVIDER]: {
					baseUrl: endpoint,
					api: "openai-completions",
					compat: {
						supportsDeveloperRole: false,
						supportsReasoningEffort: false,
					},
					models: [{
						id: MODEL_ID,
						name: "Local DeepSeek V4 Flash Free",
						reasoning: false,
						input: ["text"],
						contextWindow: 128000,
						maxTokens: 128,
						cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
					}],
				},
			},
		}, null, 2)}\n`);

		const piResult = await runPi({ agentDir, projectDir, observationsPath, probePath, endpoint });
		const observations = await readFile(observationsPath, "utf8").then(readJsonLines).catch(() => []);
		const deepPiStatsPath = join(projectDir, ".pi/deep-pi-stats.json");
		const optimizerStatsPath = join(agentDir, "pi-cache-optimizer-stats.json");
		const fileExists = async (path) => readFile(path).then(() => true).catch(() => false);
		const deepPiStatsPresent = await fileExists(deepPiStatsPath);
		const optimizerStatsPresent = await fileExists(optimizerStatsPath);
		const loopbackOnly = serverRequests.every((request) => request.remoteAddress === "127.0.0.1" || request.remoteAddress === "::ffff:127.0.0.1");
		const optimizerActive = observations.some((entry) => entry.hook === "session_start" && entry.provider === MODEL_PROVIDER && entry.model === MODEL_ID && entry.cacheRetention === "long");
		// deep-pi's session_shutdown handler flushes stats unconditionally, for
		// every model, so the stats file's mere presence proves nothing about
		// whether deep-pi actually recorded this model — its message_end
		// recorder separately gates on provider === "deepseek" before adding to
		// any model's totals. Read the file's content and check whether any
		// session recorded a nonzero response for any model; a present-but-all
		// -zero file is the true "dormant" signal, not the file's absence.
		const deepPiRecordedResponses = deepPiStatsPresent
			? await readFile(deepPiStatsPath, "utf8")
				.then((raw) => JSON.parse(raw))
				.then((document) => Object.values(document?.sessions ?? {})
					.flatMap((session) => Object.values(session?.byModel ?? {}))
					.reduce((sum, totals) => sum + Number(totals?.responses ?? 0), 0))
				.catch(() => null)
			: 0;
		const deepPiDormant = deepPiRecordedResponses === 0;
		const report = {
			model: `${MODEL_PROVIDER}/${MODEL_ID}`,
			piExitCode: piResult.code,
			piSignal: piResult.signal,
			loopbackOnly,
			requestCount: serverRequests.length,
			serverRequests,
			observations,
			optimizerActive,
			deepPiDormant,
			deepPiStatsPresent,
			deepPiRecordedResponses,
			optimizerStatsPresent,
			piStdout: piResult.stdout.trim().slice(-2000),
			piStderr: piResult.stderr.trim().slice(-4000),
		};
		console.log(JSON.stringify(report, null, 2));
		if (piResult.code !== 0 || !loopbackOnly || serverRequests.length === 0 || !optimizerActive || !deepPiDormant) {
			throw new Error("local boundary fixture did not prove the expected live ownership signals");
		}
	} finally {
		server.close();
		await rm(tempRoot, { recursive: true, force: true });
	}
}

try {
	await main();
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}
