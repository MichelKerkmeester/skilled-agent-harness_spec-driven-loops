// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Extension Entry Point
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { isDeepPiModel, withEditLinesActive } from './deeppi/eligibility.js';
import { createStabilityState, registerStabilityHooks } from './deeppi/stability.js';
import {
  buildDeepPiReport,
  createTelemetryState,
  footerText,
  renderDeepPiReport,
  registerTelemetryHooks,
  resetTelemetry,
} from './deeppi/telemetry.js';
import {
  createStormBreakerState,
  registerStormBreaker,
  resetStormBreaker,
} from './deeppi/stormbreaker.js';
import { registerHashlines } from './deeppi/hashlines.js';
import {
  reportSnapshotPath,
  statsPath,
  updateStatsForSession,
  writeJsonSnapshot,
} from './deeppi/stats.js';
import { matchesModelPattern } from './deeppi/utils.js';

import type {
  ExtensionAPI,
  ExtensionCommandContext,
  ExtensionContext,
} from '@earendil-works/pi-coding-agent';

// ───────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * Register DeepPi's model-aware hooks, editing tool, and `/deeppi` command.
 *
 * @remarks
 * The registered callbacks share the instance-local state created by this
 * function, so lifecycle resets and reports observe the same counters.
 *
 * @param pi - Pi extension API used to register DeepPi hooks and commands.
 * @returns Nothing; registration occurs as a side effect.
 */
export default function deepPi(pi: ExtensionAPI): void {
  // Keep mutable state in this closure so hooks and `/deeppi` read one live
  // counter set for this extension instance.
  const stability = createStabilityState();
  const telemetry = createTelemetryState();
  const stormBreaker = createStormBreakerState();
  const hashlineStats = registerHashlines(pi, isDeepPiModel);

  // Warn once per model within a session; session_start clears this set.
  const warnedModelIds = new Set<string>();

  function warnOnUnrecognizedModel(context: ExtensionContext): void {
    const model = context.model;
    if (
      model?.provider === 'deepseek' &&
      !isDeepPiModel(model) &&
      matchesModelPattern(model, ['deepseek-v']) &&
      !warnedModelIds.has(model.id)
    ) {
      warnedModelIds.add(model.id);
      context.ui?.notify?.(
        `deep-pi doesn't recognize model "${model.id}" - ` +
          'it may need updating for new DeepSeek releases.',
        'warning',
      );
    }
  }

  // Keep tool availability and the status footer aligned with model eligibility.
  function syncModel(context: ExtensionContext): void {
    const model = isDeepPiModel(context.model) ? context.model : undefined;
    const current = pi.getActiveTools();
    const active = withEditLinesActive(current, model !== undefined);
    if (active.join('\0') !== current.join('\0')) pi.setActiveTools(active);
    if (context.hasUI) {
      context.ui.setStatus('deeppi', model ? footerText(telemetry, model.id) : undefined);
    }
  }

  // Snapshot live state so command output and the JSON report agree.
  function buildReport(context: ExtensionContext) {
    const model = isDeepPiModel(context.model) ? context.model : undefined;
    return buildDeepPiReport({
      eligible: model !== undefined,
      modelId: model?.id ?? null,
      telemetry,
      latestChurn: stability.latestChurn,
      transformErrors: stability.transformErrors,
      usageUnavailable: telemetry.usageUnavailable,
      costMathErrors: telemetry.costMathErrors,
      loopsGuarded: stormBreaker.guardsInjected,
      loopsAborted: stormBreaker.loopsAborted,
      editAttempts: hashlineStats.editCalls,
      editMismatches: hashlineStats.hashMismatches,
      editSuccesses: hashlineStats.editSuccesses,
      errorsEnhanced: stormBreaker.errorsEnhanced,
      prunedThinking: stability.prunedThinking,
      preservedThinking: stability.preservedThinking,
    });
  }

  // Persist the session's current model counters at lifecycle and command boundaries.
  async function flushStats(context: ExtensionContext): Promise<void> {
    await updateStatsForSession(
      statsPath(context.cwd),
      context.sessionManager.getSessionId(),
      telemetry.byModel,
    );
  }

  // Normalize thrown values so UI and headless paths report useful text.
  function errorText(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  // These hooks close over the instance-local state above; lifecycle handlers
  // below reset that same state at session boundaries.
  registerStabilityHooks(pi, stability, isDeepPiModel);
  registerStormBreaker(pi, stormBreaker, isDeepPiModel);
  registerTelemetryHooks(pi, telemetry, (context) => syncModel(context));

  pi.on('session_start', async (_event, context) => {
    // Reset session-scoped state before status and report consumers see the new session.
    resetTelemetry(telemetry);
    resetStormBreaker(stormBreaker);
    warnedModelIds.clear();
    stability.previousShape = null;
    stability.latestChurn = [];
    stability.frozenLines.clear();
    stability.transformErrors = 0;
    stability.prunedThinking = 0;
    stability.preservedThinking = 0;
    warnOnUnrecognizedModel(context);
    syncModel(context);
  });
  pi.on('model_select', async (_event, context) => {
    // Model changes can happen without a new session, so refresh eligibility and
    // status immediately.
    warnOnUnrecognizedModel(context);
    syncModel(context);
  });
  pi.on('session_shutdown', async (_event, context) => {
    try {
      await flushStats(context);
    } catch (error: unknown) {
      // Interactive sessions can show the warning; headless callers must receive the rejection.
      if (context.hasUI) context.ui.notify(errorText(error), 'warning');
      else throw error;
    }
  });

  pi.registerCommand('deeppi', {
    description: 'Show direct DeepSeek cache economics and retry statistics',
    handler: async (_args: string, context: ExtensionCommandContext) => {
      const report = buildReport(context);
      await writeJsonSnapshot(reportSnapshotPath(context.cwd), report);
      try {
        await flushStats(context);
      } catch (error: unknown) {
        // Interactive sessions can show the warning; headless callers must receive the rejection.
        if (context.hasUI) context.ui.notify(errorText(error), 'warning');
        else throw error;
      }
      if (context.hasUI) context.ui.notify(renderDeepPiReport(report), 'info');
    },
  });
}
