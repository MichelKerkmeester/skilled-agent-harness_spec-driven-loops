// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi before_provider_request Benchmark
// ───────────────────────────────────────────────────────────────────

import { createHash } from "node:crypto";

const CONVERSATION_LENGTHS = [10, 50, 200, 800];
const WARMUP_ROUNDS = 50;
const MEASURED_ROUNDS = 500;
const OPERATIONS = ["clone", "digest", "clone+digest"];
let sink = 0;

function makeTools() {
	return Array.from({ length: 24 }, (_, index) => ({
		type: "function",
		function: {
			name: `tool_${String(index).padStart(2, "0")}`,
			description: "A realistic tool schema used for prefix-shape hashing.",
			parameters: {
				type: "object",
				properties: {
					path: { type: "string", description: "Repository-relative path." },
					content: { type: "string", description: "Optional replacement content." },
				},
				required: ["path"],
			},
		},
	}));
}

function makePayload(conversationLength) {
	const messages = [{
		role: "system",
		content: "You are a coding agent. Preserve repository invariants and report verification evidence.",
	}];
	for (let index = 0; index < conversationLength; index++) {
		messages.push({
			role: "user",
			content: `Inspect module ${index} and make the smallest safe change. Context token ${index % 17}.`,
		});
		messages.push({
			role: "assistant",
			content: [
				{ type: "text", text: `I inspected module ${index} and found a bounded change.` },
				...(index % 8 === 0
					? [{ type: "toolCall", id: `call_${index}`, name: "read", arguments: { path: `src/module-${index}.ts` } }]
					: []),
			],
		});
		if (index % 8 === 0) {
			messages.push({
				role: "toolResult",
				toolCallId: `call_${index}`,
				content: [{ type: "text", text: `module-${index}.ts contains the expected implementation boundary.` }],
			});
		}
	}
	return { model: "deepseek-v4-pro", messages, tools: makeTools() };
}

function digest(value) {
	return createHash("sha256").update(JSON.stringify(value) ?? "undefined").digest("hex");
}

function digestPrefixShape(payload) {
	const messages = Array.isArray(payload.messages) ? payload.messages : [];
	const system = messages.find((value) => value.role === "system" || value.role === "developer");
	const conversation = messages.filter((value) => value.role !== "system" && value.role !== "developer");
	const systemDigest = digest(system ?? null);
	const toolsDigest = digest(Array.isArray(payload.tools) ? payload.tools : []);
	const messageDigests = conversation.map((message) => digest(message));
	return { systemDigest, toolsDigest, messageDigests };
}

function consume(value) {
	if (typeof value === "string") sink ^= value.charCodeAt(0) ?? 0;
	else if (value && typeof value === "object") sink ^= value.messages?.length ?? value.messageDigests?.length ?? 0;
}

function measure(operation, payload) {
	for (let round = 0; round < WARMUP_ROUNDS; round++) {
		if (operation === "clone") consume(structuredClone(payload));
		else if (operation === "digest") consume(digestPrefixShape(payload));
		else {
			const cloned = structuredClone(payload);
			consume(digestPrefixShape(cloned));
		}
	}
	globalThis.gc?.();
	const start = process.hrtime.bigint();
	for (let round = 0; round < MEASURED_ROUNDS; round++) {
		if (operation === "clone") consume(structuredClone(payload));
		else if (operation === "digest") consume(digestPrefixShape(payload));
		else {
			const cloned = structuredClone(payload);
			consume(digestPrefixShape(cloned));
		}
	}
	const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;
	return {
		elapsedMs: Number(elapsedMs.toFixed(3)),
		msPerOperation: Number((elapsedMs / MEASURED_ROUNDS).toFixed(6)),
	};
}

function shuffle(values) {
	let seed = 0x9e3779b9;
	const result = [...values];
	for (let index = result.length - 1; index > 0; index--) {
		seed = (seed * 1664525 + 1013904223) >>> 0;
		const swapIndex = seed % (index + 1);
		[result[index], result[swapIndex]] = [result[swapIndex], result[index]];
	}
	return result;
}

const cases = shuffle(CONVERSATION_LENGTHS.flatMap((conversationLength) =>
	OPERATIONS.map((operation) => ({ conversationLength, operation }))));
const results = [];
for (const { conversationLength, operation } of cases) {
	const payload = makePayload(conversationLength);
	const measurement = measure(operation, payload);
	results.push({ conversationLength, operation, ...measurement });
}

console.log(JSON.stringify({
	node: process.version,
	warmupRounds: WARMUP_ROUNDS,
	measuredRounds: MEASURED_ROUNDS,
	messageCount: "conversationLength user/assistant turns plus periodic tool results",
	results,
	sink,
}, null, 2));
