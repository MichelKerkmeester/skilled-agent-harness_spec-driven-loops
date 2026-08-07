import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { describe, expect, it } from "vitest";
import {
	cacheHitRate,
	createTelemetryState,
	footerText,
	formatDeepPiReport,
	recordUsage,
	registerTelemetryHooks,
	resetTelemetry,
	type PricedModel,
} from "../extensions/deeppi/telemetry.js";

const pro = {
	provider: "deepseek",
	id: "deepseek-v4-pro" as const,
	cost: { input: 1.74, output: 3.48, cacheRead: 0.145, cacheWrite: 0 },
};

it("records normalized Pi usage and model-aware savings", () => {
	const state = createTelemetryState();
	recordUsage(state, pro, {
		input: 20_000,
		output: 1_000,
		cacheRead: 80_000,
		cacheWrite: 0,
		totalTokens: 101_000,
		cost: { input: 0.0348, output: 0.00348, cacheRead: 0.0116, cacheWrite: 0, total: 0.04988 },
	});
	const totals = state.byModel["deepseek-v4-pro"];
	expect(totals.responses).toBe(1);
	expect(totals.hitTokens).toBe(80_000);
	expect(totals.missTokens).toBe(20_000);
	expect(cacheHitRate(totals)).toBe(0.8);
	expect(totals.actualInputCost).toBeCloseTo(0.0464);
	expect(totals.estimatedSavings).toBeCloseTo(0.1276);
	expect(footerText(state, "deepseek-v4-pro")).toBe("DeepPi · 80% cache");
});

it("omits rates and savings when usage or matching pricing is unavailable", () => {
	const state = createTelemetryState();
	expect(footerText(state, "deepseek-v4-flash")).toBe("DeepPi · warming");
	recordUsage(state, null, {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		totalTokens: 0,
		cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
	});
	expect(state.usageUnavailable).toBe(true);
});

it("renders measured economics and runtime counters", () => {
	const state = createTelemetryState();
	recordUsage(state, pro, {
		input: 20_000,
		output: 1_000,
		cacheRead: 80_000,
		cacheWrite: 0,
		totalTokens: 101_000,
		cost: { input: 0.0348, output: 0.00348, cacheRead: 0.0116, cacheWrite: 0, total: 0.04988 },
	});
	state.latestChurn = ["tool-schema"];
	const report = formatDeepPiReport({
		eligible: true,
		modelId: "deepseek-v4-pro",
		telemetry: state,
		loopsGuarded: 2,
		loopsAborted: 1,
		editAttempts: 5,
		editMismatches: 1,
		editSuccesses: 4,
		transformErrors: 0,
		usageUnavailable: false,
		costMathErrors: 0,
	});
	expect(report).toContain("Model:              deepseek-v4-pro");
	expect(report).toContain("Cache hit rate:     80.0%");
	expect(report).toContain("Prefix churn:       tool-schema");
	expect(report).toContain("Loops guarded:      2");
});

it("surfaces unavailable usage and clears it on reset", () => {
	const state = createTelemetryState();
	recordUsage(state, null, {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		totalTokens: 0,
		cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
	});
	const report = formatDeepPiReport({
		eligible: true,
		modelId: "deepseek-v4-flash",
		telemetry: state,
		loopsGuarded: 0,
		loopsAborted: 0,
		editAttempts: 0,
		editMismatches: 0,
		editSuccesses: 0,
		transformErrors: 0,
		usageUnavailable: state.usageUnavailable,
		costMathErrors: 0,
	});
	expect(report).toContain("Usage unavailable:  true");
	resetTelemetry(state);
	expect(state.usageUnavailable).toBe(false);
});

it("surfaces cost-math errors in the report and clears them on reset", () => {
	const state = createTelemetryState();
	const modelWithoutCost = { provider: "deepseek", id: "deepseek-v4-flash" } as unknown as PricedModel;
	recordUsage(state, modelWithoutCost, {
		input: 100,
		output: 10,
		cacheRead: 50,
		cacheWrite: 0,
		totalTokens: 160,
		cost: { input: 0.1, output: 0.01, cacheRead: 0.01, cacheWrite: 0, total: 0.12 },
	});
	expect(state.costMathErrors).toBe(1);
	const report = formatDeepPiReport({
		eligible: true,
		modelId: "deepseek-v4-flash",
		telemetry: state,
		loopsGuarded: 0,
		loopsAborted: 0,
		editAttempts: 0,
		editMismatches: 0,
		editSuccesses: 0,
		transformErrors: 0,
		usageUnavailable: false,
		costMathErrors: state.costMathErrors,
	});
	expect(report).toContain("Cost math errors:   1");
	resetTelemetry(state);
	expect(state.costMathErrors).toBe(0);
});

it("rejects usage with missing model pricing before changing totals", () => {
	const state = createTelemetryState();
	const totals = state.byModel["deepseek-v4-flash"];
	const before = {
		responses: totals.responses,
		hitTokens: totals.hitTokens,
		missTokens: totals.missTokens,
		actualInputCost: totals.actualInputCost,
	};
	const modelWithoutCost = {
		provider: "deepseek",
		id: "deepseek-v4-flash",
	} as unknown as PricedModel;
	expect(recordUsage(state, modelWithoutCost, {
		input: 100,
		output: 10,
		cacheRead: 50,
		cacheWrite: 0,
		totalTokens: 160,
		cost: { input: 0.1, output: 0.01, cacheRead: 0.01, cacheWrite: 0, total: 0.12 },
	})).toBe(false);
	expect(state.costMathErrors).toBe(1);
	expect(state.byModel["deepseek-v4-flash"]).toBe(totals);
	expect({
		responses: totals.responses,
		hitTokens: totals.hitTokens,
		missTokens: totals.missTokens,
		actualInputCost: totals.actualInputCost,
	}).toEqual(before);
});

it("rejects usage with missing usage.cost before changing totals", () => {
	const state = createTelemetryState();
	const totals = state.byModel["deepseek-v4-pro"];
	const before = {
		responses: totals.responses,
		hitTokens: totals.hitTokens,
		missTokens: totals.missTokens,
		actualInputCost: totals.actualInputCost,
	};
	expect(recordUsage(state, pro, {
		input: 100,
		output: 10,
		cacheRead: 50,
		cacheWrite: 0,
		totalTokens: 160,
		cost: undefined as unknown as { input: number; output: number; cacheRead: number; cacheWrite: number; total: number },
	})).toBe(false);
	expect(state.costMathErrors).toBe(1);
	expect(state.byModel["deepseek-v4-pro"]).toBe(totals);
	expect({
		responses: totals.responses,
		hitTokens: totals.hitTokens,
		missTokens: totals.missTokens,
		actualInputCost: totals.actualInputCost,
	}).toEqual(before);
});

it("ignores supported-looking model IDs from unsupported providers", async () => {
	type Hook = (event: any, ctx: any) => Promise<any> | any;
	const hooks = new Map<string, Hook>();
	const pi = {
		on(type: string, hook: Hook) { hooks.set(type, hook); },
	} as unknown as ExtensionAPI;
	const state = createTelemetryState();
	registerTelemetryHooks(pi, state, () => {});
	await hooks.get("message_end")!({
		message: {
			role: "assistant",
			provider: "openrouter",
			model: "deepseek-v4-pro",
			usage: {
				input: 10,
				output: 1,
				cacheRead: 20,
				cacheWrite: 0,
				totalTokens: 31,
				cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
			},
		},
	}, {
		model: { provider: "openrouter", id: "deepseek-v4-pro", cost: pro.cost },
	});
	expect(state.byModel["deepseek-v4-pro"].responses).toBe(0);
});
