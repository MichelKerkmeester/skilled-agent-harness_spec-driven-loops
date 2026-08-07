import type { DeepPiModelId } from "./eligibility.js";
import type { PrefixChurnReason } from "./stability.js";

export interface PiUsage {
	input: number;
	output: number;
	cacheRead: number;
	cacheWrite: number;
	totalTokens: number;
	cost: { input: number; output: number; cacheRead: number; cacheWrite: number; total: number };
}

export interface PricedModel {
	provider: string;
	id: DeepPiModelId;
	cost: { input: number; output: number; cacheRead: number; cacheWrite: number };
}

export interface ModelTotals {
	responses: number;
	hitTokens: number;
	missTokens: number;
	actualInputCost: number;
	estimatedSavings: number;
}

export interface TelemetryState {
	byModel: Record<DeepPiModelId, ModelTotals>;
	usageUnavailable: boolean;
	costMathErrors: number;
	latestChurn: PrefixChurnReason[];
}

function emptyTotals(): ModelTotals {
	return { responses: 0, hitTokens: 0, missTokens: 0, actualInputCost: 0, estimatedSavings: 0 };
}

export function createTelemetryState(): TelemetryState {
	return {
		byModel: { "deepseek-v4-flash": emptyTotals(), "deepseek-v4-pro": emptyTotals() },
		usageUnavailable: false,
		costMathErrors: 0,
		latestChurn: [],
	};
}

export function recordUsage(
	state: TelemetryState,
	model: PricedModel | null,
	usage: PiUsage,
): boolean {
	if (!model || usage.input + usage.cacheRead === 0) {
		state.usageUnavailable = true;
		return false;
	}
	if (!model.cost || !usage.cost) {
		state.costMathErrors++;
		return false;
	}
	const totals = state.byModel[model.id];
	totals.responses++;
	totals.hitTokens += usage.cacheRead;
	totals.missTokens += usage.input;
	totals.actualInputCost += usage.cost.input + usage.cost.cacheRead;
	totals.estimatedSavings +=
		(usage.cacheRead / 1_000_000) * (model.cost.input - model.cost.cacheRead);
	return true;
}

export function cacheHitRate(totals: ModelTotals): number | null {
	const input = totals.hitTokens + totals.missTokens;
	return input === 0 ? null : totals.hitTokens / input;
}

export function footerText(state: TelemetryState, modelId: DeepPiModelId): string {
	const rate = cacheHitRate(state.byModel[modelId]);
	return rate === null ? "DeepPi · warming" : `DeepPi · ${Math.round(rate * 100)}% cache`;
}

export interface ReportInput {
	eligible: boolean;
	modelId: DeepPiModelId | null;
	telemetry: TelemetryState;
	loopsGuarded: number;
	loopsAborted: number;
	editAttempts: number;
	editMismatches: number;
	editSuccesses: number;
	transformErrors: number;
	usageUnavailable: boolean;
	costMathErrors: number;
}

export function formatDeepPiReport(input: ReportInput): string {
	if (!input.eligible || !input.modelId) return "DeepPi is dormant for the active model.";
	const totals = input.telemetry.byModel[input.modelId];
	const rate = cacheHitRate(totals);
	const churn = input.telemetry.latestChurn.length === 0
		? "none"
		: input.telemetry.latestChurn.join(", ");
	return [
		`Model:              ${input.modelId}`,
		`Responses:          ${totals.responses}`,
		`Cache read:         ${totals.hitTokens.toLocaleString()} tokens`,
		`Uncached input:     ${totals.missTokens.toLocaleString()} tokens`,
		`Cache hit rate:     ${rate === null ? "unavailable" : `${(rate * 100).toFixed(1)}%`}`,
		`Actual input cost:  $${totals.actualInputCost.toFixed(4)}`,
		`Estimated savings:  $${totals.estimatedSavings.toFixed(4)}`,
		...(input.transformErrors > 0 ? [`Transform errors:    ${input.transformErrors}`] : []),
		...(input.usageUnavailable ? [`Usage unavailable:  ${input.usageUnavailable}`] : []),
		...(input.costMathErrors > 0 ? [`Cost math errors:   ${input.costMathErrors}`] : []),
		`Prefix churn:       ${churn}`,
		`Loops guarded:      ${input.loopsGuarded}`,
		`Loops aborted:      ${input.loopsAborted}`,
		`Edit attempts:      ${input.editAttempts}`,
		`Edit mismatches:    ${input.editMismatches}`,
		`Edit successes:     ${input.editSuccesses}`,
	].join("\n");
}

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

export function resetTelemetry(state: TelemetryState): void {
	state.byModel = { "deepseek-v4-flash": emptyTotals(), "deepseek-v4-pro": emptyTotals() };
	state.usageUnavailable = false;
	state.costMathErrors = 0;
	state.latestChurn = [];
}

export function registerTelemetryHooks(
	pi: ExtensionAPI,
	state: TelemetryState,
	onUpdate: (ctx: ExtensionContext) => void,
): void {
	pi.on("message_end", async (event, ctx: ExtensionContext) => {
		if (!ctx.model) return;
		// Telemetry is for direct DeepSeek API usage only: a model id that
		// looks like a DeepPi id from another provider (e.g. openrouter
		// "deepseek-v4-pro") is a different product and must not be recorded.
		if (ctx.model.provider !== "deepseek") return;
		if (!(ctx.model.id in state.byModel)) return;
		const message = event.message as unknown as {
			provider?: unknown;
			model?: unknown;
			usage?: {
				input: number;
				output: number;
				cacheRead: number;
				cacheWrite: number;
				totalTokens: number;
				cost: {
					input: number;
					output: number;
					cacheRead: number;
					cacheWrite: number;
					total: number;
				};
			};
		} | undefined;
		if (message?.provider !== ctx.model.provider) return;
		if (message?.model !== ctx.model.id) return;
		const model = message as {
			usage?: {
				input: number;
				output: number;
				cacheRead: number;
				cacheWrite: number;
				totalTokens: number;
				cost: {
					input: number;
					output: number;
					cacheRead: number;
					cacheWrite: number;
					total: number;
				};
			};
		};
		if (!model.usage) return;
		recordUsage(
			state,
			{ provider: ctx.model.provider, id: ctx.model.id as never, cost: (ctx.model as { cost?: unknown }).cost as never },
			model.usage,
		);
		onUpdate(ctx);
	});
}
