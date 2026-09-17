// ───────────────────────────────────────────────────────────────────
// MODULE: Description Merge
// ───────────────────────────────────────────────────────────────────

import {
  DESCRIPTION_KNOWN_AUTHORED_OPTIONAL_KEYS,
  DESCRIPTION_TRACKING_KEYS,
  isDescriptionReservedKey,
  type DescriptionCanonicalFields,
} from './description-schema.js';

/** Outcome of merging a description.json payload: the merged object plus which keys came from where. */
export type DescriptionMergeResult<TIncoming extends Record<string, unknown>> = {
  merged: TIncoming & Record<string, unknown>;
  overriddenKeys: string[];
  preservedKeys: string[];
};

function copyIfPresent(
  source: Record<string, unknown> | null | undefined,
  target: Record<string, unknown>,
  keys: readonly string[],
  bucket: string[],
): void {
  if (!source) return;

  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
    target[key] = source[key];
    bucket.push(key);
  }
}

function copyUnknownPassthrough(
  source: Record<string, unknown> | null | undefined,
  target: Record<string, unknown>,
  bucket: string[],
): void {
  if (!source) return;

  for (const [key, value] of Object.entries(source)) {
    if (isDescriptionReservedKey(key)) continue;
    target[key] = value;
    bucket.push(key);
  }
}

/**
 * Merge an existing description.json with freshly derived canonical fields and
 * an incoming payload, preserving authored keys the incoming payload omits.
 *
 * @param existing - The description.json currently on disk, or null when absent
 * @param canonical - Freshly derived canonical fields that always win
 * @param incoming - The tracking and authored fields the caller wants to apply
 * @returns The merged object plus which keys were preserved versus overridden
 */
export function mergeDescription<TIncoming extends Record<string, unknown>>(
  existing: Record<string, unknown> | null | undefined,
  canonical: DescriptionCanonicalFields,
  incoming: TIncoming,
): DescriptionMergeResult<TIncoming> {
  const merged: Record<string, unknown> = {};
  const preservedKeys: string[] = [];
  const overriddenKeys: string[] = [];

  copyIfPresent(
    existing,
    merged,
    DESCRIPTION_KNOWN_AUTHORED_OPTIONAL_KEYS,
    preservedKeys,
  );
  copyUnknownPassthrough(existing, merged, preservedKeys);

  for (const [key, value] of Object.entries(canonical)) {
    merged[key] = value;
    overriddenKeys.push(key);
  }

  copyIfPresent(incoming, merged, DESCRIPTION_TRACKING_KEYS, overriddenKeys);
  copyIfPresent(
    incoming,
    merged,
    DESCRIPTION_KNOWN_AUTHORED_OPTIONAL_KEYS,
    overriddenKeys,
  );
  copyUnknownPassthrough(incoming, merged, overriddenKeys);

  return {
    merged: merged as TIncoming & Record<string, unknown>,
    overriddenKeys,
    preservedKeys,
  };
}
