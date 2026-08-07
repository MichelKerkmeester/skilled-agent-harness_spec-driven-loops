import type { ExtensionAPI, ExtensionCommandContext, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { isDeepPiModel, withEditLinesActive } from "./deeppi/eligibility.js";
import { createStabilityState, registerStabilityHooks } from "./deeppi/stability.js";
import { createTelemetryState, footerText, formatDeepPiReport, registerTelemetryHooks, resetTelemetry } from "./deeppi/telemetry.js";
import { createStormBreakerState, registerStormBreaker, resetStormBreaker } from "./deeppi/stormbreaker.js";
import { registerHashlines } from "./deeppi/hashlines.js";
import { matchesModelPattern } from "./deeppi/utils.js";

export default function deepPi(pi: ExtensionAPI): void {
	const stability = createStabilityState();
	const telemetry = createTelemetryState();
	const storm = createStormBreakerState();
	const hashlines = registerHashlines(pi, isDeepPiModel);
	const warnedModelIds = new Set<string>();

	function warnOnUnrecognizedModel(ctx: ExtensionContext): void {
		const model = ctx.model;
		if (
			model?.provider === "deepseek" &&
			!isDeepPiModel(model) &&
			matchesModelPattern(model, ["deepseek-v"]) &&
			!warnedModelIds.has(model.id)
		) {
			warnedModelIds.add(model.id);
			ctx.ui?.notify?.(
				`deep-pi doesn't recognize model "${model.id}" - it may need updating for new DeepSeek releases.`,
				"warning",
			);
		}
	}

	function syncModel(ctx: ExtensionContext): void {
		const model = isDeepPiModel(ctx.model) ? ctx.model : undefined;
		const current = pi.getActiveTools();
		const active = withEditLinesActive(current, model !== undefined);
		if (active.join("\0") !== current.join("\0")) pi.setActiveTools(active);
		if (ctx.hasUI) {
			ctx.ui.setStatus("deeppi", model ? footerText(telemetry, model.id) : undefined);
		}
	}

	registerStabilityHooks(pi, stability, isDeepPiModel);
	registerStormBreaker(pi, storm, isDeepPiModel);
	registerTelemetryHooks(pi, telemetry, (ctx) => syncModel(ctx));

	pi.on("session_start", async (_event, ctx) => {
		resetTelemetry(telemetry);
		resetStormBreaker(storm);
		warnedModelIds.clear();
		stability.previousShape = null;
		stability.latestChurn = [];
		stability.frozenLines.clear();
		stability.transformErrors = 0;
		stability.prunedThinking = 0;
		stability.preservedThinking = 0;
		warnOnUnrecognizedModel(ctx);
		syncModel(ctx);
	});
	pi.on("model_select", async (_event, ctx) => {
		warnOnUnrecognizedModel(ctx);
		syncModel(ctx);
	});

	pi.registerCommand("deeppi", {
		description: "Show direct DeepSeek cache economics and retry statistics",
		handler: async (_args: string, ctx: ExtensionCommandContext) => {
			telemetry.latestChurn = stability.latestChurn;
			ctx.ui.notify(formatDeepPiReport({
				eligible: isDeepPiModel(ctx.model),
				modelId: isDeepPiModel(ctx.model) ? ctx.model.id : null,
				telemetry,
				transformErrors: stability.transformErrors,
				usageUnavailable: telemetry.usageUnavailable,
				costMathErrors: telemetry.costMathErrors,
				loopsGuarded: storm.guardsInjected,
				loopsAborted: storm.loopsAborted,
				editAttempts: hashlines.editCalls,
				editMismatches: hashlines.hashMismatches,
				editSuccesses: hashlines.editSuccesses,
			}), "info");
		},
	});
}
