// ───────────────────────────────────────────────────────────────
// MODULE: description.json merge-preserving repair helper
// ───────────────────────────────────────────────────────────────

import { mergeDescription, type DescriptionMergeResult } from './description-merge.js';
import {
  pickCanonicalDescriptionFields,
  type DescriptionCanonicalFields,
} from './description-schema.js';

/** Inputs for a merge-preserving description.json repair: the on-disk partial plus fresh canonical overrides. */
export type MergePreserveInput<T extends Record<string, unknown>> = {
  partial: Record<string, unknown>;
  canonicalOverrides: T & DescriptionCanonicalFields;
};

export type MergePreserveResult<T extends Record<string, unknown>> =
  DescriptionMergeResult<T>;

/** Repair a description.json by re-deriving canonical fields while preserving authored keys the partial already carries. */
export function mergePreserveRepair<T extends Record<string, unknown>>(
  input: MergePreserveInput<T>,
): MergePreserveResult<T> {
  return mergeDescription(
    input.partial,
    pickCanonicalDescriptionFields(input.canonicalOverrides),
    input.canonicalOverrides,
  );
}
