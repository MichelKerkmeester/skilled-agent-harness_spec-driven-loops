// ───────────────────────────────────────────────────────────────────
// MODULE: Payload Gate
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import {
  DEFAULT_SERVICE_TIER,
  SUPPORTED_PROVIDERS,
  type FastModeConfig,
  type FastTarget,
  type ModelRef,
} from "./types";

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SUPPORTED_PROVIDER_SET = new Set<string>(SUPPORTED_PROVIDERS);

// ───────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Check whether a value is a non-null object record. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Convert an unknown model value into a provider/model reference. */
export function toModelRef(model: unknown): ModelRef | undefined {
  if (!isRecord(model)) return undefined;

  const { provider, id } = model;
  if (typeof provider !== "string" || typeof id !== "string") return undefined;
  if (!provider || !id) return undefined;

  return { provider, id };
}

/** Check whether a provider is supported by Fast Mode. */
export function isSupportedProvider(provider: string): boolean {
  return SUPPORTED_PROVIDER_SET.has(provider);
}

/** Find the configured target matching the active model. */
export function findMatchingTarget(
  model: ModelRef | undefined,
  targets: FastTarget[],
): FastTarget | undefined {
  if (!model || !isSupportedProvider(model.provider)) return undefined;

  return targets.find(
    (target) =>
      target.provider === model.provider &&
      target.model === model.id &&
      isSupportedProvider(target.provider),
  );
}

/** Add the selected service tier to a provider request payload. */
export function applyFastModePayload(
  payload: unknown,
  serviceTier: string,
): unknown | undefined {
  if (!isRecord(payload)) return undefined;

  return {
    ...payload,
    service_tier: serviceTier || DEFAULT_SERVICE_TIER,
  };
}

/** Apply Fast Mode to a compatible provider request payload when eligible.
 *
 * @param config - Current Fast Mode configuration.
 * @param model - Active model reference, if available.
 * @param payload - Provider request payload to evaluate.
 * @returns The updated payload when eligible, otherwise `undefined`.
 */
export function getFastModePayload(
  config: FastModeConfig,
  model: ModelRef | undefined,
  payload: unknown,
): unknown | undefined {
  if (!config.enabled) return undefined;

  const target = findMatchingTarget(model, config.targets);
  if (!target) return undefined;

  if (!isRecord(payload)) return undefined;
  const payloadServiceTier = payload.service_tier;
  if (
    payloadServiceTier !== undefined &&
    payloadServiceTier !== null &&
    (typeof payloadServiceTier !== "string" ||
      payloadServiceTier.trim() !== "")
  ) {
    return undefined;
  }
  if (payload.model !== undefined && payload.model !== target.model) {
    return undefined;
  }

  return applyFastModePayload(
    payload,
    target.serviceTier ?? DEFAULT_SERVICE_TIER,
  );
}
