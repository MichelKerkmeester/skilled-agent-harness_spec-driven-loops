// ───────────────────────────────────────────────────────────────────
// MODULE: Observed Classification Manifest
// ───────────────────────────────────────────────────────────────────
//
// Composition seam between the three modules that observe restart state
// and produce a classification manifest. Nothing here re-derives facts,
// re-classifies evidence, or re-builds a manifest; it wires one
// observation of the run's restart facts to a per-row evidence
// derivation and hands the result to the manifest builder.

import { observeRestartFacts } from './restart-facts-reader.js';
import type { ObserveRestartFactsOptions } from './restart-facts-reader.js';
import { deriveRestartClassificationEvidence } from '../inflight-state-classification/restart-classification-evidence.js';
import { createClassificationManifest } from '../inflight-state-classification/inflight-state-classifier.js';
import type { BuiltClassificationManifest } from '../inflight-state-classification/inflight-state-types.js';

/** Census-resolved row metadata paired with the identity and census bytes for one manifest build. */
export interface BuildObservedClassificationManifestInput {
  readonly observation: ObserveRestartFactsOptions;
  readonly rows: readonly {
    readonly rowId: string;
    readonly lifecycle: string;
    readonly mutability: string;
  }[];
  readonly classificationId: string;
  readonly classifiedAt: string;
  readonly classifierBuildId: string;
  readonly censusBytes: Uint8Array;
}

/**
 * Observe the run's restart facts once, derive one evidence record per
 * requested row from that single observation, and build the classification
 * manifest over them.
 *
 * The restart facts are a property of the run, not of any individual row,
 * so they are observed exactly once and shared across every row. A per-row
 * observation would be both wasteful and capable of returning different
 * facts for different rows in the same manifest, which would make the
 * manifest internally inconsistent.
 *
 * A RestartObservationError from observeRestartFacts is allowed to
 * propagate unchanged. It must not be caught and substituted with empty
 * facts: an absent producer is a refusal, and reporting it as idle would
 * feed the derivation a vacuous clean bill of health for a run whose
 * effects were never recorded at all.
 */
export async function buildObservedClassificationManifest(
  input: BuildObservedClassificationManifestInput,
): Promise<BuiltClassificationManifest> {
  const restart = await observeRestartFacts(input.observation);

  const evidence = input.rows.map((row) => deriveRestartClassificationEvidence({
    rowId: row.rowId,
    lifecycle: row.lifecycle,
    mutability: row.mutability,
    restart,
  }));

  return createClassificationManifest({
    classificationId: input.classificationId,
    classifiedAt: input.classifiedAt,
    classifierBuildId: input.classifierBuildId,
    censusBytes: input.censusBytes,
    evidence,
  });
}
