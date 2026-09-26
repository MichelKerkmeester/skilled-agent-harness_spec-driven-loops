import assert from "node:assert/strict";
import { test } from "node:test";
import { candidates, type Message, prune, recentConversation } from "../src/context.ts";
import { assistant, exchange } from "./fixtures.ts";

const discarded = (messages: Message[]) =>
	new Map(candidates(messages, 0).map((unit) => [unit.key, 0]));

test("removes a complete exchange without changing the transcript", () => {
	const messages = exchange();
	const original = structuredClone(messages);
	assert.deepEqual(prune(messages, discarded(messages), 0.8, 0), []);
	assert.deepEqual(messages, original);
	assert.deepEqual(prune(messages, new Map(), 0.8, 0), messages);
});

test("threshold is exclusive, including its boundaries", () => {
	const messages = exchange();
	const key = candidates(messages, 0)[0].key;
	for (const [score, length] of [
		[0, 0],
		[0.8, 0],
		[0.81, 2],
		[1, 2],
	]) {
		assert.equal(prune(messages, new Map([[key, score]]), 0.8, 0).length, length);
	}
});

test("active buffer restores even previously hidden calls", () => {
	const messages = [...exchange("read", "old"), ...exchange("read", "new")];
	assert.deepEqual(prune(messages, discarded(messages), 0.8, 1), messages.slice(2));
	assert.deepEqual(candidates(messages, 5), []);
});

test("todo, incomplete, ambiguous, image, and dynamic-tool exchanges stay intact", () => {
	const image = exchange();
	if (image[1].role === "toolResult")
		image[1].content = [{ type: "image", data: "private", mimeType: "image/png" }];
	const dynamic = exchange();
	if (dynamic[1].role === "toolResult") dynamic[1].addedToolNames = ["new_tool"];
	const pair = exchange();
	const cases = [
		exchange("todo"),
		pair.slice(0, 1),
		[...pair, pair[1]],
		[...pair, pair[0]],
		image,
		dynamic,
	];
	for (const messages of cases) {
		assert.deepEqual(candidates(messages, 0), []);
		assert.deepEqual(prune(messages, discarded(messages), 1, 0), messages);
	}
});

test("keeps assistant reasoning while any sibling call survives", () => {
	const messages = exchange();
	if (messages[0].role === "assistant")
		messages[0].content.unshift({ type: "text", text: "Reason" });
	const units = candidates(messages, 0);
	const reasoning = units.find((unit) => unit.block === undefined);
	assert.ok(reasoning);
	assert.deepEqual(prune(messages, new Map([[reasoning.key, 0]]), 0.8, 0), messages);
	assert.deepEqual(prune(messages, discarded(messages), 0.8, 0), []);
});

test("user requirements, summaries, extension messages, and opaque thinking stay intact", () => {
	const messages: Message[] = [
		{ role: "user", content: "Keep this requirement", timestamp: 0 },
		{ role: "compactionSummary", summary: "Keep summary", tokensBefore: 10, timestamp: 0 },
		{
			role: "custom",
			customType: "example",
			content: "Keep extension",
			display: true,
			timestamp: 0,
		},
		assistant([{ type: "thinking", thinking: "", thinkingSignature: "opaque", redacted: true }]),
	];
	assert.deepEqual(candidates(messages, 0), []);
	assert.deepEqual(prune(messages, new Map(), 1, 0), messages);
});

test("shell history is eligible unless excluded from model context", () => {
	const message: Message = {
		role: "bashExecution",
		command: "pwd",
		output: "/example",
		exitCode: 0,
		cancelled: false,
		truncated: false,
		timestamp: 0,
	};
	assert.equal(candidates([message], 0).length, 1);
	assert.equal(candidates([{ ...message, excludeFromContext: true }], 0).length, 0);
});

test("cache keys are stable but change when tool output changes", () => {
	const messages = exchange();
	const key = candidates(messages, 0)[0].key;
	assert.equal(candidates(structuredClone(messages), 0)[0].key, key);
	if (messages[1].role === "toolResult") messages[1].content = [{ type: "text", text: "Changed" }];
	assert.notEqual(candidates(messages, 0)[0].key, key);
});

test("recent evidence includes the latest request but excludes image data and tool details", () => {
	const messages: Message[] = [
		{
			role: "user",
			content: [
				{ type: "text", text: "Current task" },
				{ type: "image", data: "IMAGE_SECRET", mimeType: "image/png" },
			],
			timestamp: 0,
		},
		...exchange(),
	];
	if (messages[2].role === "toolResult") messages[2].details = { secret: "DETAIL_SECRET" };
	const evidence = recentConversation(messages);
	assert.match(evidence, /Current task/);
	assert.doesNotMatch(evidence, /IMAGE_SECRET|DETAIL_SECRET/);
	assert.doesNotMatch(candidates(messages, 0)[0].text, /DETAIL_SECRET/);
});
