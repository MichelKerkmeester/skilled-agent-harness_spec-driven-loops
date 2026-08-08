// ───────────────────────────────────────────────────────────────────
// MODULE: DeepPi Telemetry
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { DEEPPI_MODEL_IDS } from './eligibility.js';

import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';
import type { DeepPiModelId } from './eligibility.js';
import type { PrefixChurnReason } from './stability.js';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Token-cost fields reported by a provider response. */
export interface UsageCost {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  total: number;
}

/** Per-token pricing used to calculate cache savings. */
export interface ModelCost {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

/** Token usage and provider-reported cost for one response. */
export interface PiUsage {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  totalTokens: number;
  cost: UsageCost;
}

/** Model identity and pricing required for telemetry accounting. */
export interface PricedModel {
  provider: string;
  id: DeepPiModelId;
  cost: ModelCost;
}

/** Accumulated token and cost totals for one DeepPi model. */
export interface ModelTotals {
  responses: number;
  hitTokens: number;
  missTokens: number;
  cacheWriteTokens: number;
  actualInputCost: number;
  noCacheCounterfactualSavings: number;
}

/** Mutable telemetry counters and per-model totals. */
export interface TelemetryState {
  byModel: Record<DeepPiModelId, ModelTotals>;
  usageUnavailable: boolean;
  costMathErrors: number;
}

/** Input data used to assemble a versioned DeepPi report. */
export interface ReportInput {
  eligible: boolean;
  modelId: DeepPiModelId | null;
  telemetry: TelemetryState;
  latestChurn: PrefixChurnReason[];
  loopsGuarded: number;
  loopsAborted: number;
  editAttempts: number;
  editMismatches: number;
  editSuccesses: number;
  errorsEnhanced: number;
  prunedThinking: number;
  preservedThinking: number;
  transformErrors: number;
  usageUnavailable: boolean;
  costMathErrors: number;
}

/** Runtime counters rendered when they carry a nonzero value. */
export interface DeepPiReportCounters {
  loopsGuarded: number;
  loopsAborted: number;
  editAttempts: number;
  editMismatches: number;
  editSuccesses: number;
  errorsEnhanced: number;
  prunedThinking: number;
  preservedThinking: number;
  transformErrors: number;
  usageUnavailable: boolean;
  costMathErrors: number;
}

/** Versioned report data consumed by both the JSON snapshot and renderer. */
export interface DeepPiReport {
  schemaVersion: typeof DEEP_PI_REPORT_SCHEMA_VERSION;
  eligible: boolean;
  modelId: DeepPiModelId | null;
  totals: ModelTotals | null;
  latestChurn: PrefixChurnReason[];
  counters: DeepPiReportCounters;
}

type ProviderStopReason =
  | 'pending'
  | 'stop'
  | 'length'
  | 'toolUse'
  | 'error'
  | 'aborted'
  | 'deferred';

interface ProviderMessage {
  provider?: unknown;
  model?: unknown;
  stopReason?: ProviderStopReason;
  usage?: PiUsage;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Current report schema version shared by JSON output and text rendering. */
export const DEEP_PI_REPORT_SCHEMA_VERSION = 1 as const;
const MODEL_IDS: readonly DeepPiModelId[] = [...DEEPPI_MODEL_IDS];

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function emptyTotals(): ModelTotals {
  return {
    responses: 0,
    hitTokens: 0,
    missTokens: 0,
    cacheWriteTokens: 0,
    actualInputCost: 0,
    noCacheCounterfactualSavings: 0,
  };
}

function emptyByModel(): Record<DeepPiModelId, ModelTotals> {
  // The exported model-id tuple supplies every key before the record is returned.
  const byModel = {} as Record<DeepPiModelId, ModelTotals>;
  for (const modelId of MODEL_IDS) byModel[modelId] = emptyTotals();
  return byModel;
}

function allFiniteNonNegative(values: readonly unknown[]): boolean {
  return values.every((value) => typeof value === 'number' && Number.isFinite(value) && value >= 0);
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Create empty telemetry state for the supported DeepPi models. */
export function createTelemetryState(): TelemetryState {
  return {
    byModel: emptyByModel(),
    usageUnavailable: false,
    costMathErrors: 0,
  };
}

/**
 * Record provider usage and update cache-cost totals.
 *
 * @param state - Mutable telemetry state.
 * @param model - DeepPi model pricing, or null when unavailable.
 * @param usage - Provider-reported usage and cost values.
 * @returns Whether the usage was accepted into the totals.
 */
export function recordUsage(
  state: TelemetryState,
  model: PricedModel | null,
  usage: PiUsage,
): boolean {
  if (!model) {
    state.usageUnavailable = true;
    return false;
  }
  if (
    !model.cost ||
    !usage.cost ||
    !allFiniteNonNegative([
      usage.input,
      usage.output,
      usage.cacheRead,
      usage.cacheWrite,
      usage.totalTokens,
      usage.cost.input,
      usage.cost.output,
      usage.cost.cacheRead,
      usage.cost.cacheWrite,
      usage.cost.total,
      model.cost.input,
      model.cost.output,
      model.cost.cacheRead,
      model.cost.cacheWrite,
    ])
  ) {
    state.costMathErrors++;
    return false;
  }
  if (usage.input + usage.cacheRead + usage.cacheWrite === 0) {
    state.usageUnavailable = true;
    return false;
  }
  const totals = state.byModel[model.id];
  totals.responses++;
  totals.hitTokens += usage.cacheRead;
  totals.missTokens += usage.input;
  totals.cacheWriteTokens += usage.cacheWrite;
  totals.actualInputCost += usage.cost.input + usage.cost.cacheRead + usage.cost.cacheWrite;
  totals.noCacheCounterfactualSavings += (usage.cacheRead / 1_000_000) *
    (model.cost.input - model.cost.cacheRead);
  return true;
}

/** Calculate the cache-hit ratio, or null when no input tokens were recorded. */
export function cacheHitRate(totals: ModelTotals): number | null {
  const input = totals.hitTokens + totals.missTokens;
  return input === 0 ? null : totals.hitTokens / input;
}

/** Render the compact cache-rate footer for one model. */
export function footerText(state: TelemetryState, modelId: DeepPiModelId): string {
  const rate = cacheHitRate(state.byModel[modelId]);
  return rate === null ? 'DeepPi · warming' : `DeepPi · ${Math.round(rate * 100)}% cache`;
}

/** Build the versioned report data object without presentation formatting. */
export function buildDeepPiReport(input: ReportInput): DeepPiReport {
  const totals = input.eligible && input.modelId
    ? { ...input.telemetry.byModel[input.modelId] }
    : null;
  return {
    schemaVersion: DEEP_PI_REPORT_SCHEMA_VERSION,
    eligible: input.eligible,
    modelId: input.modelId,
    totals,
    latestChurn: [...input.latestChurn],
    counters: {
      loopsGuarded: input.loopsGuarded,
      loopsAborted: input.loopsAborted,
      editAttempts: input.editAttempts,
      editMismatches: input.editMismatches,
      editSuccesses: input.editSuccesses,
      errorsEnhanced: input.errorsEnhanced,
      prunedThinking: input.prunedThinking,
      preservedThinking: input.preservedThinking,
      transformErrors: input.transformErrors,
      usageUnavailable: input.usageUnavailable,
      costMathErrors: input.costMathErrors,
    },
  };
}

/** Render the current human-readable report text from a report data object. */
export function renderDeepPiReport(report: DeepPiReport): string {
  if (!report.eligible || !report.modelId || !report.totals) {
    return 'DeepPi is dormant for the active model.';
  }
  const totals = report.totals;
  const rate = cacheHitRate(totals);
  const churn = report.latestChurn.length === 0 ? 'none' : report.latestChurn.join(', ');
  const counters = report.counters;
  return [
    `Model:              ${report.modelId}`,
    `Responses:          ${totals.responses}`,
    `Cache read:         ${totals.hitTokens.toLocaleString()} tokens`,
    `Uncached input:     ${totals.missTokens.toLocaleString()} tokens`,
    `Cache hit rate:     ${rate === null ? 'unavailable' : `${(rate * 100).toFixed(1)}%`}`,
    `Actual input cost:  $${totals.actualInputCost.toFixed(4)}`,
    `No-cache counterfactual savings:  $${totals.noCacheCounterfactualSavings.toFixed(4)}`,
    ...(totals.cacheWriteTokens > 0
      ? [`Cache write:         ${totals.cacheWriteTokens.toLocaleString()} tokens`]
      : []),
    ...(counters.errorsEnhanced > 0 ? [`Errors enhanced:     ${counters.errorsEnhanced}`] : []),
    ...(counters.prunedThinking > 0 ? [`Pruned thinking:     ${counters.prunedThinking}`] : []),
    ...(counters.preservedThinking > 0
      ? [`Preserved thinking:  ${counters.preservedThinking}`]
      : []),
    ...(counters.transformErrors > 0 ? [`Transform errors:    ${counters.transformErrors}`] : []),
    ...(counters.usageUnavailable ? [`Usage unavailable:  ${counters.usageUnavailable}`] : []),
    ...(counters.costMathErrors > 0 ? [`Cost math errors:   ${counters.costMathErrors}`] : []),
    `Prefix churn:       ${churn}`,
    `Loops guarded:      ${counters.loopsGuarded}`,
    `Loops aborted:      ${counters.loopsAborted}`,
    `Edit attempts:      ${counters.editAttempts}`,
    `Edit mismatches:    ${counters.editMismatches}`,
    `Edit successes:     ${counters.editSuccesses}`,
  ].join('\n');
}

/**
 * Preserve the pre-layering formatter API for existing extension callers.
 *
 * @param input - Report inputs used to assemble and render the report.
 * @returns Human-readable report text.
 */
export function formatDeepPiReport(input: ReportInput): string {
  return renderDeepPiReport(buildDeepPiReport(input));
}

/** Reset all telemetry totals and availability counters. */
export function resetTelemetry(state: TelemetryState): void {
  state.byModel = emptyByModel();
  state.usageUnavailable = false;
  state.costMathErrors = 0;
}

/**
 * Register message-end telemetry collection for direct DeepSeek models.
 *
 * @param pi - Extension API used to register the message hook.
 * @param state - Mutable telemetry state updated by each accepted response.
 * @param onUpdate - Callback invoked after usage processing.
 */
export function registerTelemetryHooks(
  pi: ExtensionAPI,
  state: TelemetryState,
  onUpdate: (ctx: ExtensionContext) => void,
): void {
  pi.on('message_end', async (event, ctx: ExtensionContext) => {
    if (!ctx.model) return;
    // Telemetry is for direct DeepSeek API usage only: a model id that
    // looks like a DeepPi id from another provider (e.g. openrouter
    // "deepseek-v4-pro") is a different product and must not be recorded.
    if (ctx.model.provider !== 'deepseek') return;
    if (!(ctx.model.id in state.byModel)) return;
    // The SDK message union is broader than the provider fields used here;
    // the handler narrows those fields below.
    const message = event.message as unknown as ProviderMessage | undefined;
    if (message?.provider !== ctx.model.provider) return;
    if (message?.model !== ctx.model.id) return;
    if (
      message?.stopReason !== undefined &&
      message.stopReason !== 'stop' &&
      message.stopReason !== 'length' &&
      message.stopReason !== 'toolUse'
    ) return;
    if (!message.usage) return;
    // Provider and model-id guards select a supported DeepPi model;
    // recordUsage validates its numeric pricing fields.
    const model = ctx.model as unknown as PricedModel;
    recordUsage(
      state,
      model,
      message.usage,
    );
    onUpdate(ctx);
  });
}
