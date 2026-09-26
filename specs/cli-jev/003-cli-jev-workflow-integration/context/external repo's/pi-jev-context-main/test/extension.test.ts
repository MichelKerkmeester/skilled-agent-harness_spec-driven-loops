import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { candidates } from "../src/context.ts";
import { exchange } from "./fixtures.ts";

const agentDir = mkdtempSync(join(tmpdir(), "pi-jev-test-"));
const previous = process.env.PI_CODING_AGENT_DIR;
process.env.PI_CODING_AGENT_DIR = agentDir;
const { default: jevContext } = await import("../src/index.ts");
after(() => {
	if (previous === undefined) delete process.env.PI_CODING_AGENT_DIR;
	else process.env.PI_CODING_AGENT_DIR = previous;
	rmSync(agentDir, { recursive: true, force: true });
});

// Only the host surface used by this extension. No real credentials or network.
function harness() {
	type Handler = (event: never, ctx: never) => unknown;
	const events = new Map<string, Handler>();
	const commands = new Map<string, { handler: Handler }>();
	const entries: { type: string; customType: string; data: unknown }[] = [];
	const notices: string[] = [];
	const providers: unknown[] = [];
	jevContext({
		on: (name: string, handler: Handler) => events.set(name, handler),
		registerCommand: (name: string, command: { handler: Handler }) => commands.set(name, command),
		registerProvider: (provider: unknown) => providers.push(provider),
		appendEntry: (customType: string, data: unknown) =>
			entries.push({ type: "custom", customType, data }),
	} as unknown as ExtensionAPI);
	const ctx = {
		hasUI: true,
		ui: { setStatus() {}, notify: (text: string) => notices.push(text) },
		isIdle: () => false,
		hasPendingMessages: () => false,
		modelRegistry: { getProviderAuth: async () => ({ auth: { apiKey: "test-key" } }) },
		sessionManager: { getBranch: () => entries },
	};
	return {
		entries,
		notices,
		providers,
		emit: async (name: string, event: unknown = {}) =>
			events.get(name)?.(event as never, ctx as never),
		command: async (name: string, args: string) =>
			commands.get(name)?.handler(args as never, ctx as never),
	};
}

test("disabled by default, validates commands, and registers TypeSafe auth", async (t) => {
	const fetch = t.mock.method(globalThis, "fetch", async () => {
		throw new Error("Unexpected request");
	});
	const host = harness();
	await host.emit("session_start");
	assert.equal(host.providers.length, 1);
	assert.equal(await host.emit("context", { messages: exchange() }), undefined);
	await host.command("jev", "threshold 2");
	assert.equal(host.entries.length, 0);
	await host.command("jev", "status");
	assert.match(host.notices.at(-1) ?? "", /Jev off/);
	assert.equal(fetch.mock.callCount(), 0);
});

test("complete scans persist, errors pause judging, off restores unfiltered history", async (t) => {
	const fetch = t.mock.method(globalThis, "fetch", async () =>
		Response.json({ answers: { keep_0: { type: "noul", noul: 0.1 } } }),
	);
	const host = harness();
	await host.emit("session_start");
	await host.command("jev", "buffer 0");
	await host.command("jev", "on");
	const messages = exchange();
	assert.deepEqual(await host.emit("context", { messages }), { messages: [] });
	assert.equal(fetch.mock.callCount(), 1);
	await host.emit("session_tree");
	assert.deepEqual(await host.emit("context", { messages }), { messages: [] });
	assert.equal(fetch.mock.callCount(), 1, "branch restoration reuses cached judgments");
	await host.command("jev", "cache off");
	const count = host.entries.length;
	t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 500 }));
	assert.deepEqual(await host.emit("context", { messages }), { messages: [] });
	assert.equal(host.entries.length, count, "failed scan must not persist decisions");
	assert.match(host.notices.at(-1) ?? "", /Jev paused/);
	await host.command("jev", "off");
	assert.equal(await host.emit("context", { messages }), undefined);
});

test("input cancellation prevents an in-flight scan from saving judgments", async (t) => {
	let started!: () => void;
	const ready = new Promise<void>((resolve) => {
		started = resolve;
	});
	t.mock.method(
		globalThis,
		"fetch",
		(_url: string, options: RequestInit) =>
			new Promise((_resolve, reject) => {
				options.signal?.addEventListener("abort", () => reject(options.signal?.reason), {
					once: true,
				});
				started();
			}),
	);
	const host = harness();
	await host.emit("session_start");
	await host.command("jev", "buffer 0");
	await host.command("jev", "on");
	const before = host.entries.length;
	const messages = exchange();
	const pending = host.emit("context", { messages });
	await ready;
	await host.emit("input");
	assert.deepEqual(await pending, { messages });
	assert.equal(host.entries.length, before);
});

test("switching branches discards judgments from the previous branch", async () => {
	const host = harness();
	const messages = exchange();
	host.entries.push({
		type: "custom",
		customType: "jev-context",
		data: {
			version: 1,
			settings: { enabled: true, buffer: 0 },
			model: "jev-latest",
			judgments: [[candidates(messages, 0)[0].key, 0]],
		},
	});
	await host.emit("session_start");
	assert.deepEqual(await host.emit("context", { messages }), { messages: [] });
	host.entries.length = 0;
	await host.emit("session_tree");
	assert.equal(await host.emit("context", { messages }), undefined);
});
