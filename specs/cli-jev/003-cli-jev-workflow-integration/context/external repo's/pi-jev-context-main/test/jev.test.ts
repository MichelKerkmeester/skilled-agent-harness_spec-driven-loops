import assert from "node:assert/strict";
import { test } from "node:test";
import type { Candidate } from "../src/context.ts";
import { judge } from "../src/jev.ts";

const unit = (text: string, key = "candidate"): Candidate => ({ key, text, message: 0 });
const signal = () => new AbortController().signal;

test("splits without loss, bounds requests, and retains the maximum fragment score", async (t) => {
	const text = '🧪 quoted "code"\n'.repeat(3000);
	const fragments: string[] = [];
	let calls = 0;
	t.mock.method(globalThis, "fetch", async (url: string, options: RequestInit) => {
		assert.equal(url, "https://api.typesafe.ai/v1/systemone");
		assert.equal(options.redirect, "error");
		assert.equal(new Headers(options.headers).get("Authorization"), "Bearer test-key");
		const body = String(options.body);
		assert.ok(Buffer.byteLength(body) <= 28000);
		const payload = JSON.parse(body);
		assert.equal(payload.model, "jev-latest");
		assert.ok(Object.keys(payload.questions).length <= 12);
		fragments.push(...payload.state.candidates.map((item: { text: string }) => item.text));
		calls++;
		return Response.json({
			answers: Object.fromEntries(
				Object.keys(payload.questions).map((key) => [
					key,
					{ type: "noul", noul: calls === 1 ? 0.95 : 0.1 },
				]),
			),
		});
	});
	const scores = await judge([unit(text)], "Latest task", "jev-latest", "test-key", signal());
	assert.equal(fragments.join(""), text);
	assert.ok(calls > 1);
	assert.equal(scores.get("candidate"), 0.95);
});

test("rejects invalid or missing probabilities", async (t) => {
	for (const answer of [
		undefined,
		{ type: "noul", noul: -0.1 },
		{ type: "noul", noul: 1.1 },
		{ type: "noul", noul: "0.9" },
		{ type: "bool", noul: 0.9 },
	]) {
		t.mock.method(globalThis, "fetch", async () => Response.json({ answers: { keep_0: answer } }));
		await assert.rejects(
			judge([unit("text")], "task", "jev-latest", "test-key", signal()),
			/Invalid TypeSafe/,
		);
		t.mock.restoreAll();
	}
});

test("HTTP failures do not expose the response body", async (t) => {
	t.mock.method(globalThis, "fetch", async () => new Response("PRIVATE_INPUT", { status: 429 }));
	await assert.rejects(
		judge([unit("text")], "task", "jev-latest", "test-key", signal()),
		(error: Error) => {
			assert.match(error.message, /HTTP 429/);
			assert.doesNotMatch(error.message, /PRIVATE_INPUT/);
			return true;
		},
	);
});

test("already cancelled scans and empty candidate lists make no requests", async (t) => {
	const fetch = t.mock.method(globalThis, "fetch", async () => {
		throw new Error("Unexpected request");
	});
	assert.equal((await judge([], "task", "jev-latest", "test-key", signal())).size, 0);
	await assert.rejects(
		judge([unit("text")], "task", "jev-latest", "test-key", AbortSignal.abort()),
	);
	assert.equal(fetch.mock.callCount(), 0);
});
