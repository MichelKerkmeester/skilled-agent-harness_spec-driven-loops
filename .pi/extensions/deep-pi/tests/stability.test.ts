import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { describe, expect, it } from "vitest";
import deepPi from "../extensions/deeppi.js";
import {
	createStabilityState,
	freezeSessionTimestamps,
	registerStabilityHooks,
	stabilizeMessages,
	type TimestampState,
} from "../extensions/deeppi/stability.js";

describe("stabilizeMessages", () => {
	it("prunes thinking from a plain assistant turn without mutating input", () => {
		const input = [{
			role: "assistant",
			content: [
				{ type: "thinking", thinking: "private" },
				{ type: "text", text: "answer" },
			],
		}];
		const result = stabilizeMessages(input);
		expect(result.messages[0]).toEqual({
			role: "assistant",
			content: [{ type: "text", text: "answer" }],
		});
		expect(result.prunedThinking).toBe(1);
		expect(input[0].content).toHaveLength(2);
	});

	it("preserves thinking and signatures on a Pi toolCall turn", () => {
		const input = [{
			role: "assistant",
			content: [
				{
					type: "thinking",
					thinking: "need the file",
					thinkingSignature: "reasoning_content",
				},
				{ type: "toolCall", id: "call-1", name: "read", arguments: { path: "a.ts" } },
			],
		}];
		const result = stabilizeMessages(input);
		expect(result.messages).toEqual(input);
		expect(result.preservedThinking).toBe(1);
	});
});

describe("freezeSessionTimestamps", () => {
	it("freezes recognized generated lines but preserves user-authored dates", () => {
		const state: TimestampState = { frozenLines: new Map() };
		const first = freezeSessionTimestamps(
			"Current date and time is: 2026-08-04 10:00\nShip on 2026-08-08.",
			state,
		);
		const second = freezeSessionTimestamps(
			"Current date and time is: 2026-08-04 10:01\nShip on 2026-08-08.",
			state,
		);
		expect(second).toBe(first);
		expect(second).toContain("Ship on 2026-08-08.");
	});
});

import {
	capturePrefixShape,
	classifyPrefixChurn,
	sortProviderTools,
	type PrefixChurnReason,
	type PrefixShape,
} from "../extensions/deeppi/stability.js";
import { FakePi, fakeContext } from "./fake-pi.js";

it("sorts OpenAI tool schemas deterministically without changing members", () => {
	const payload: Record<string, unknown> = {
		tools: [
			{ type: "function", function: { name: "write" } },
			{ type: "function", function: { name: "read" } },
		],
	};
	expect(sortProviderTools(payload)).toBe(true);
	expect((payload.tools as Array<{ function: { name: string } }>).map((tool) => tool.function.name))
		.toEqual(["read", "write"]);
});

it("treats appended conversation messages as stable growth", () => {
	const previous = capturePrefixShape("deepseek-v4-pro", {
		messages: [
			{ role: "system", content: "stable" },
			{ role: "user", content: "one" },
		],
		tools: [{ type: "function", function: { name: "read" } }],
	});
	const current = capturePrefixShape("deepseek-v4-pro", {
		messages: [
			{ role: "system", content: "stable" },
			{ role: "user", content: "one" },
			{ role: "assistant", content: "answer" },
			{ role: "user", content: "two" },
		],
		tools: [{ type: "function", function: { name: "read" } }],
	});
	expect(classifyPrefixChurn(previous, current)).toEqual([]);
});

const churnCases: Array<[PrefixChurnReason, Partial<PrefixShape>]> = [
	["model", { modelId: "deepseek-v4-flash" }],
	["system-prompt", { systemDigest: "changed" }],
	["tool-schema", { toolsDigest: "changed" }],
	["conversation-history", { messageDigests: ["changed"] }],
];

it.each(churnCases)("classifies %s churn", (reason, change) => {
	const base = capturePrefixShape("deepseek-v4-pro", {
		messages: [{ role: "system", content: "stable" }, { role: "user", content: "one" }],
		tools: [{ type: "function", function: { name: "read" } }],
	});
	expect(classifyPrefixChurn(base, { ...base, ...change })).toContain(reason);
});

it("returns pruned messages through Pi's context result contract", async () => {
	type Hook = (event: any, ctx: any) => Promise<any> | any;
	const hooks = new Map<string, Hook>();
	const pi = {
		on(type: string, hook: Hook) { hooks.set(type, hook); },
	} as unknown as ExtensionAPI;
	const state = createStabilityState();
	registerStabilityHooks(pi, state, () => true);
	const messages = [{
		role: "assistant",
		content: [
			{ type: "thinking", thinking: "private" },
			{ type: "text", text: "answer" },
		],
	}];
	const event = structuredClone({ messages });
	const result = await hooks.get("context")!(event, {
		model: { provider: "deepseek", id: "deepseek-v4-pro" },
	});
	const nextMessages = result?.messages ?? messages;
	expect(nextMessages[0].content).toEqual([{ type: "text", text: "answer" }]);
});

it("does not freeze generic user-authored Date lines", () => {
	const state: TimestampState = { frozenLines: new Map() };
	freezeSessionTimestamps("Date: release-candidate-1", state);
	expect(freezeSessionTimestamps("Date: release-candidate-2", state))
		.toBe("Date: release-candidate-2");
});

it("surfaces and resets stability transform errors at session boundaries", async () => {
	const fake = new FakePi();
	deepPi(fake.asExtensionAPI());
	const ctx = fakeContext({
		provider: "deepseek",
		id: "deepseek-v4-pro",
		cost: { input: 1.74, output: 3.48, cacheRead: 0.145, cacheWrite: 0 },
	});
	await fake.emit("session_start", {}, ctx);
	await fake.emit("before_agent_start", { systemPrompt: null }, ctx);
	await fake.commands.get("deeppi")!.handler("", ctx);
	expect(ctx.notifications.at(-1)).toContain("Transform errors:    1");
	await fake.emit("session_start", {}, ctx);
	await fake.commands.get("deeppi")!.handler("", ctx);
	expect(ctx.notifications.at(-1)).not.toContain("Transform errors:");
});
