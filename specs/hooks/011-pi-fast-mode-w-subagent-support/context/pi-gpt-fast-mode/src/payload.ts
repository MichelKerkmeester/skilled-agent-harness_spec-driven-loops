// Pure helpers for matching models and mutating provider payloads.

import { DEFAULT_TIER, type FastConfig, type ModelRef } from "./types.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/** Normalize an unknown model object into a `{ provider, id }` ref. */
export function toModelRef(model: unknown): ModelRef | undefined {
  if (!isRecord(model)) return undefined;
  const { provider, id } = model;
  if (typeof provider !== "string" || typeof id !== "string") return undefined;
  if (!provider || !id) return undefined;
  return { provider, id };
}

/** Build the canonical `provider/model` key for a model ref. */
export function modelKey(model: ModelRef): string {
  return `${model.provider}/${model.id}`;
}

/** Whether the given model is in the configured supported list. */
export function isSupportedModel(
  model: ModelRef | undefined,
  config: FastConfig,
): boolean {
  if (!model) return false;
  return config.models.includes(modelKey(model));
}

/**
 * Inject `service_tier` into a provider payload.
 * Returns the original payload untouched when it is not a plain object.
 */
export function injectServiceTier(
  payload: unknown,
  serviceTier: string,
): unknown {
  if (!isRecord(payload)) return payload;
  return { ...payload, service_tier: serviceTier || DEFAULT_TIER };
}
