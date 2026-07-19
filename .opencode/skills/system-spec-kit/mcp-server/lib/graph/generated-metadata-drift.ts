// ───────────────────────────────────────────────────────────────
// MODULE: Generated Metadata Drift Gate
// ───────────────────────────────────────────────────────────────
// Re-derives one spec folder and compares the two stored synopsis fields against a fresh
// derivation, so a description.json or graph-metadata.json that fell out of sync with the docs
// it summarizes is provable rather than silently stale. The gate reads and reports only: it
// never writes the folder, so it cannot churn the very files it exists to keep clean. Severity
// resolution is left to the caller so the same check backs both the grandfather report rollout
// and the enforced run. It pairs with source_doc_hashes, a cheap freshness key so a strict run
// can skip the re-derive on a folder whose source docs are unchanged.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import {
  derivePacketSynopsis,
  type SynopsisField,
} from '../description/packet-synopsis.js';

export const GENERATED_METADATA_DRIFT_RULE = 'GENERATED_METADATA_DRIFT' as const;

// The packet docs whose content the synopsis can read. spec.md is the one the precedence
// derives from; the rest round out an honest freshness key so any source edit moves a hash.
// Conservative by design: a hash change that is not a synopsis change only triggers a re-derive,
// it never hides one.
const SYNOPSIS_SOURCE_DOCS = [
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'decision-record.md',
  'implementation-summary.md',
  path.join('research', 'research.md'),
  'research.md',
  'handover.md',
  'resource-map.md',
] as const;

export interface DriftedSynopsisField {
  field: SynopsisField;
  stored: string;
  fresh: string;
}

export interface GeneratedMetadataDriftReport {
  rule: typeof GENERATED_METADATA_DRIFT_RULE;
  /** Whether a generated field plus a readable spec.md were present to compare. */
  checked: boolean;
  driftedFields: DriftedSynopsisField[];
  /** Whether the persisted source_doc_hashes differ from the current source docs. */
  hashDrift: boolean;
  /** True when the folder predates the hash key, so it is reported as ungraded not in-sync. */
  ungraded: boolean;
  readErrors: string[];
}

export interface ResolvedDriftStatus {
  rule: typeof GENERATED_METADATA_DRIFT_RULE;
  status: 'pass' | 'error' | 'info';
  message: string;
  details: string[];
}

/**
 * Hash the source docs the synopsis derives from, keyed by their packet-relative path.
 *
 * A doc edit changes its hash, giving the drift gate a cheap freshness key it can compare
 * before paying for a re-derive. Only present docs are hashed, so an absent doc carries no key
 * rather than a hash of empty content.
 *
 * @param folderPath - Absolute or relative path to the spec folder
 * @returns A map of relative doc path to sha256 hex digest for each present source doc
 */
export function computeSourceDocHashes(folderPath: string): Record<string, string> {
  const folder = path.resolve(folderPath);
  const hashes: Record<string, string> = {};
  for (const relativePath of SYNOPSIS_SOURCE_DOCS) {
    const docPath = path.join(folder, relativePath);
    let content: string;
    try {
      content = fs.readFileSync(docPath, 'utf-8');
    } catch {
      continue;
    }
    hashes[relativePath.replace(/\\/g, '/')] = crypto.createHash('sha256').update(content).digest('hex');
  }
  return hashes;
}

function readJsonObject(filePath: string): { ok: true; value: Record<string, unknown> } | { ok: false; reason: 'missing' | 'unreadable' | 'unparseable' } {
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch (error: unknown) {
    const code = typeof error === 'object' && error && 'code' in error
      ? String((error as NodeJS.ErrnoException).code)
      : null;
    return { ok: false, reason: code === 'ENOENT' ? 'missing' : 'unreadable' };
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ok: false, reason: 'unparseable' };
    }
    return { ok: true, value: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, reason: 'unparseable' };
  }
}

function readStoredCausalSummary(graph: Record<string, unknown>): string | null {
  const derived = graph.derived;
  if (!derived || typeof derived !== 'object') {
    return null;
  }
  const value = (derived as Record<string, unknown>).causal_summary;
  return typeof value === 'string' ? value : null;
}

function readStoredSourceDocHashes(graph: Record<string, unknown>): Record<string, string> | null {
  const derived = graph.derived;
  if (!derived || typeof derived !== 'object') {
    return null;
  }
  const value = (derived as Record<string, unknown>).source_doc_hashes;
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, string>;
}

function hashMapsEqual(a: Record<string, string>, b: Record<string, string>): boolean {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.every((key, index) => key === bKeys[index] && a[key] === b[key]);
}

/**
 * Re-derive a spec folder and report whether its stored synopsis fields drifted from the docs.
 *
 * Reads spec.md fresh, derives both fields through the shared extractor, and compares them with
 * the stored description and causal_summary. When the persisted source_doc_hashes match the
 * current docs the re-derive is skipped and no drift is reported, the cheap freshness key. A
 * folder with no spec.md reports an empty derivation rather than scoring a missing synopsis as
 * drift, and an unreadable doc is reported as a read error rather than treated as in-sync. The
 * gate never writes the folder.
 *
 * @param folderPath - Absolute or relative path to the spec folder
 * @returns The drift report with any drifted fields and the hash-freshness verdict
 */
export function checkGeneratedMetadataDrift(folderPath: string): GeneratedMetadataDriftReport {
  const folder = path.resolve(folderPath);
  const specPath = path.join(folder, 'spec.md');
  const graphPath = path.join(folder, 'graph-metadata.json');
  const descriptionPath = path.join(folder, 'description.json');

  const empty: GeneratedMetadataDriftReport = {
    rule: GENERATED_METADATA_DRIFT_RULE,
    checked: false,
    driftedFields: [],
    hashDrift: false,
    ungraded: false,
    readErrors: [],
  };

  const graphRead = readJsonObject(graphPath);
  const descriptionRead = readJsonObject(descriptionPath);
  const graph = graphRead.ok ? graphRead.value : null;
  const description = descriptionRead.ok ? descriptionRead.value : null;

  // Nothing stored to compare against: an authored-only folder is not scored as drift.
  if (!graph && !description) {
    return empty;
  }

  const readErrors: string[] = [];
  if (!graphRead.ok && graphRead.reason !== 'missing') {
    readErrors.push(`graph-metadata.json could not be ${graphRead.reason === 'unreadable' ? 'read' : 'parsed as JSON'}`);
  }
  if (!descriptionRead.ok && descriptionRead.reason !== 'missing') {
    readErrors.push(`description.json could not be ${descriptionRead.reason === 'unreadable' ? 'read' : 'parsed as JSON'}`);
  }

  let specContent: string;
  try {
    specContent = fs.readFileSync(specPath, 'utf-8');
  } catch (error: unknown) {
    const code = typeof error === 'object' && error && 'code' in error
      ? String((error as NodeJS.ErrnoException).code)
      : null;
    if (code === 'ENOENT') {
      // No source doc to derive from: report an empty derivation, not drift.
      return { ...empty, readErrors };
    }
    return {
      ...empty,
      checked: true,
      readErrors: [...readErrors, `spec.md could not be read: ${error instanceof Error ? error.message : String(error)}`],
    };
  }

  const currentHashes = computeSourceDocHashes(folder);
  const storedHashes = graph ? readStoredSourceDocHashes(graph) : null;
  const ungraded = storedHashes === null;
  const hashDrift = storedHashes !== null && !hashMapsEqual(storedHashes, currentHashes);

  // Cheap freshness key: when the persisted hashes match the current docs nothing changed,
  // so the re-derive is skipped and no field drift is possible.
  if (storedHashes !== null && !hashDrift) {
    return {
      rule: GENERATED_METADATA_DRIFT_RULE,
      checked: true,
      driftedFields: [],
      hashDrift: false,
      ungraded: false,
      readErrors,
    };
  }

  const driftedFields: DriftedSynopsisField[] = [];

  const storedDescription = description && typeof description.description === 'string'
    ? description.description
    : null;
  if (storedDescription !== null) {
    const fresh = derivePacketSynopsis(specContent, 'description');
    if (fresh !== storedDescription) {
      driftedFields.push({ field: 'description', stored: storedDescription, fresh });
    }
  }

  const storedCausalSummary = graph ? readStoredCausalSummary(graph) : null;
  if (storedCausalSummary !== null) {
    const fresh = derivePacketSynopsis(specContent, 'causal_summary');
    if (fresh !== storedCausalSummary) {
      driftedFields.push({ field: 'causal_summary', stored: storedCausalSummary, fresh });
    }
  }

  return {
    rule: GENERATED_METADATA_DRIFT_RULE,
    checked: true,
    driftedFields,
    hashDrift,
    ungraded,
    readErrors,
  };
}

/**
 * Resolve a drift report into a single validation status given the rollout mode.
 *
 * Under grandfather report mode any drift resolves to a non-blocking `info`, so a legacy folder
 * reports but does not fail strict during the migration window. With grandfather off it resolves
 * to `error` so the gate is enforced. A clean or unchecked folder always passes.
 *
 * @param report - The drift report to resolve
 * @param opts - Whether grandfather report mode is active
 * @returns The resolved rule status, message and detail lines
 */
export function resolveGeneratedMetadataDrift(
  report: GeneratedMetadataDriftReport,
  opts: { grandfather: boolean },
): ResolvedDriftStatus {
  if (!report.checked) {
    return {
      rule: GENERATED_METADATA_DRIFT_RULE,
      status: 'pass',
      message: 'No generated metadata and source doc pair present to compare',
      details: [],
    };
  }

  const hasFindings = report.driftedFields.length > 0 || report.readErrors.length > 0;
  if (!hasFindings) {
    const note = report.ungraded ? ' (ungraded, no source_doc_hashes yet)' : '';
    return {
      rule: GENERATED_METADATA_DRIFT_RULE,
      status: 'pass',
      message: `Generated synopsis fields match the current docs${note}`,
      details: [],
    };
  }

  const details = [
    ...report.driftedFields.map(
      (drift) => `${drift.field}: stored '${drift.stored}' drifted from fresh '${drift.fresh}'`,
    ),
    ...report.readErrors,
  ];
  const mode = opts.grandfather ? 'grandfather report mode' : 'enforced';
  return {
    rule: GENERATED_METADATA_DRIFT_RULE,
    status: opts.grandfather ? 'info' : 'error',
    message: `Generated metadata drift found ${report.driftedFields.length} drifted field(s) (${mode})`,
    details,
  };
}
