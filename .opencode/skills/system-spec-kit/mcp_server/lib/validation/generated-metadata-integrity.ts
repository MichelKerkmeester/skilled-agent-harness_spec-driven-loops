// ───────────────────────────────────────────────────────────────────
// MODULE: Generated Metadata Integrity
// ───────────────────────────────────────────────────────────────────
// First-class validator for the two generated JSON files a spec folder carries:
// description.json and graph-metadata.json. It runs the shared Zod schemas plus the
// canonical path-prefix and status-enum invariants, so the generated contract is a real
// completion gate rather than a shallow shell-shape warning. Severity resolution is left
// to the caller so the same check backs both the report-mode rollout and the enforced run.

import fs from 'node:fs';
import path from 'node:path';

import { graphMetadataSchema } from '../graph/graph-metadata-schema.js';
import { perFolderDescriptionSchema } from '../description/description-schema.js';
import { computeSourceFingerprintForFolder, parseCompletionPct, hasOpenTaskItems } from '../graph/graph-metadata-parser.js';
import { isGeneratorHardeningEnabled, isStatusCompletionConsistencyGateEnabled } from '../config/capability-flags.js';

export const GENERATED_METADATA_INTEGRITY_RULE = 'GENERATED_METADATA_INTEGRITY' as const;

/** Violation code for a derived.status:'complete' folder whose completion evidence disagrees. */
export const STATUS_COMPLETE_EVIDENCE_MISMATCH_CODE = 'STATUS_COMPLETE_EVIDENCE_MISMATCH' as const;

export type GeneratedMetadataFile = 'graph-metadata.json' | 'description.json';

export interface GeneratedMetadataViolation {
  file: GeneratedMetadataFile;
  code: string;
  message: string;
}

export interface GeneratedMetadataIntegrityReport {
  rule: typeof GENERATED_METADATA_INTEGRITY_RULE;
  /** Whether any generated file was present to validate. */
  checked: boolean;
  violations: GeneratedMetadataViolation[];
}

export interface ResolvedIntegrityStatus {
  rule: typeof GENERATED_METADATA_INTEGRITY_RULE;
  status: 'pass' | 'error' | 'info';
  message: string;
  details: string[];
}

/**
 * Whether a stored spec-folder identity is in the canonical specs-root-relative shape.
 *
 * The generated files store a specs-root-relative folder (the same shape graph metadata
 * keeps in spec_folder). A value that carries the specs-root prefix, is absolute, or walks
 * parents has drifted out of that shape and breaks identity joins.
 */
function isCanonicalSpecFolderValue(value: string): boolean {
  const normalized = value.replace(/\\/g, '/').trim();
  if (!normalized) {
    return false;
  }
  if (normalized.startsWith('/')) {
    return false;
  }
  if (normalized.startsWith('./') || normalized.startsWith('../')) {
    return false;
  }
  if (normalized.split('/').includes('..')) {
    return false;
  }
  if (/^(\.opencode\/)?specs\//.test(normalized)) {
    return false;
  }
  return true;
}

function readJsonFile(filePath: string): { ok: true; value: unknown } | { ok: false; reason: 'unreadable' | 'unparseable' } {
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return { ok: false, reason: 'unreadable' };
  }
  try {
    return { ok: true, value: JSON.parse(raw) as unknown };
  } catch {
    return { ok: false, reason: 'unparseable' };
  }
}

function validateGraphMetadataFile(filePath: string, violations: GeneratedMetadataViolation[]): void {
  const read = readJsonFile(filePath);
  if (!read.ok) {
    violations.push({
      file: 'graph-metadata.json',
      code: read.reason === 'unreadable' ? 'FILE_UNREADABLE' : 'FILE_UNPARSEABLE',
      message: `graph-metadata.json could not be ${read.reason === 'unreadable' ? 'read' : 'parsed as JSON'}`,
    });
    return;
  }

  const parsed = read.value as Record<string, unknown> | null;
  const result = graphMetadataSchema.safeParse(parsed);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const location = issue.path.length > 0 ? issue.path.join('.') : 'root';
      const code = location === 'derived.status' ? 'STATUS_NOT_IN_ENUM' : 'SCHEMA_INVALID';
      violations.push({ file: 'graph-metadata.json', code, message: `${location}: ${issue.message}` });
    }
  }

  const specFolderValue = parsed && typeof parsed.spec_folder === 'string' ? parsed.spec_folder : null;
  if (specFolderValue && !isCanonicalSpecFolderValue(specFolderValue)) {
    violations.push({
      file: 'graph-metadata.json',
      code: 'SPEC_FOLDER_PREFIXED',
      message: `spec_folder must be specs-root-relative, got '${specFolderValue}'`,
    });
  }

  assertSourceFingerprint(filePath, parsed, violations);
  assertStatusCompletionConsistency(filePath, parsed, violations);
}

/**
 * Assert the stored source_fingerprint matches a re-derive of the current source docs.
 *
 * Runs only when the hardening rollout is active or the field is already present, so the
 * default world (flag off, no field) sees no new violation and an un-migrated file's strict
 * output is unchanged. A missing field on an active rollout, or a stored value that diverges
 * from a re-derive over the current docs, surfaces as a violation the grandfather mode keeps
 * non-blocking until a scoped migration graduates the rule.
 */
function assertSourceFingerprint(
  filePath: string,
  parsed: Record<string, unknown> | null,
  violations: GeneratedMetadataViolation[],
): void {
  const derived = parsed && typeof parsed.derived === 'object' && parsed.derived
    ? (parsed.derived as Record<string, unknown>)
    : null;
  const rawStored = derived ? derived.source_fingerprint : undefined;
  const storedFingerprint = typeof rawStored === 'string' && rawStored.length > 0 ? rawStored : null;

  if (!isGeneratorHardeningEnabled() && !storedFingerprint) {
    return;
  }

  let expected: string | null = null;
  try {
    expected = computeSourceFingerprintForFolder(path.dirname(filePath));
  } catch {
    expected = null;
  }

  if (!storedFingerprint) {
    violations.push({
      file: 'graph-metadata.json',
      code: 'SOURCE_FINGERPRINT_MISSING',
      message: 'source_fingerprint is absent while the generator-hardening rollout expects a persisted fingerprint',
    });
    return;
  }

  if (expected && storedFingerprint !== expected) {
    violations.push({
      file: 'graph-metadata.json',
      code: 'SOURCE_FINGERPRINT_MISMATCH',
      message: 'source_fingerprint does not match a re-derive of the current source docs, the stored derived fields may be stale',
    });
  }
}

/**
 * Cross-check a stored `derived.status: complete` against the folder's own completion
 * evidence (completion_pct, open tasks.md items).
 *
 * Catches the class of defect a deriveStatus bug produced repo-wide: a folder marked
 * complete purely because implementation-summary.md exists, regardless of its content.
 * Report-mode by default (gated on SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE) so the
 * known pre-existing backlog of already-mislabeled folders does not immediately fail
 * every other session's strict validation the moment this check ships.
 */
function assertStatusCompletionConsistency(
  filePath: string,
  parsed: Record<string, unknown> | null,
  violations: GeneratedMetadataViolation[],
): void {
  const derived = parsed && typeof parsed.derived === 'object' && parsed.derived
    ? (parsed.derived as Record<string, unknown>)
    : null;
  const status = derived && typeof derived.status === 'string' ? derived.status : null;
  if (status !== 'complete') {
    return;
  }

  const folder = path.dirname(filePath);
  const implementationSummaryPath = path.join(folder, 'implementation-summary.md');
  let implementationSummaryContent: string;
  try {
    implementationSummaryContent = fs.readFileSync(implementationSummaryPath, 'utf-8');
  } catch {
    // Lean phase parents legitimately have no implementation-summary.md; deriveStatus's
    // own !implementationSummaryDoc branch handles that case separately and is not what
    // this check targets.
    return;
  }

  const completionPct = parseCompletionPct(implementationSummaryContent);
  const tasksPath = path.join(folder, 'tasks.md');
  let tasksContent: string | null = null;
  try {
    tasksContent = fs.readFileSync(tasksPath, 'utf-8');
  } catch {
    tasksContent = null;
  }
  const openTasks = tasksContent !== null && hasOpenTaskItems(tasksContent);

  const disagreements: string[] = [];
  if (completionPct === null) {
    disagreements.push('completion_pct is absent or unparseable in implementation-summary.md');
  } else if (completionPct < 100) {
    disagreements.push(`completion_pct is ${completionPct}, below 100`);
  }
  if (openTasks) {
    disagreements.push('tasks.md has unchecked task items');
  }

  if (disagreements.length === 0) {
    return;
  }

  violations.push({
    file: 'graph-metadata.json',
    code: STATUS_COMPLETE_EVIDENCE_MISMATCH_CODE,
    message: `derived.status is 'complete' but ${disagreements.join('; ')}`,
  });
}

function validateDescriptionFile(filePath: string, violations: GeneratedMetadataViolation[]): void {
  const read = readJsonFile(filePath);
  if (!read.ok) {
    violations.push({
      file: 'description.json',
      code: read.reason === 'unreadable' ? 'FILE_UNREADABLE' : 'FILE_UNPARSEABLE',
      message: `description.json could not be ${read.reason === 'unreadable' ? 'read' : 'parsed as JSON'}`,
    });
    return;
  }

  const parsed = read.value as Record<string, unknown> | null;
  const result = perFolderDescriptionSchema.safeParse(parsed);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const location = issue.path.length > 0 ? issue.path.join('.') : 'root';
      violations.push({ file: 'description.json', code: 'SCHEMA_INVALID', message: `${location}: ${issue.message}` });
    }
  }

  const specFolderValue = parsed && typeof parsed.specFolder === 'string' ? parsed.specFolder : null;
  if (specFolderValue && !isCanonicalSpecFolderValue(specFolderValue)) {
    violations.push({
      file: 'description.json',
      code: 'SPEC_FOLDER_PREFIXED',
      message: `specFolder must be specs-root-relative, got '${specFolderValue}'`,
    });
  }
}

/**
 * Validate the generated JSON files in a spec folder against the shared contract.
 *
 * Returns checked=false when the folder carries neither generated file, so authored-only
 * folders are not flagged. When at least one file is present both are expected: a present
 * file is validated, and a missing counterpart is reported so a half-written pair fails
 * closed rather than passing as clean.
 *
 * @param folderPath - Absolute or relative path to the spec folder
 * @returns The integrity report with any contract violations
 */
export function checkGeneratedMetadataIntegrity(folderPath: string): GeneratedMetadataIntegrityReport {
  const folder = path.resolve(folderPath);
  const graphPath = path.join(folder, 'graph-metadata.json');
  const descriptionPath = path.join(folder, 'description.json');
  const graphExists = fs.existsSync(graphPath);
  const descriptionExists = fs.existsSync(descriptionPath);

  if (!graphExists && !descriptionExists) {
    return { rule: GENERATED_METADATA_INTEGRITY_RULE, checked: false, violations: [] };
  }

  const violations: GeneratedMetadataViolation[] = [];

  if (graphExists) {
    validateGraphMetadataFile(graphPath, violations);
  } else {
    violations.push({
      file: 'graph-metadata.json',
      code: 'FILE_MISSING',
      message: 'graph-metadata.json is missing while description.json is present',
    });
  }

  if (descriptionExists) {
    validateDescriptionFile(descriptionPath, violations);
  } else {
    violations.push({
      file: 'description.json',
      code: 'FILE_MISSING',
      message: 'description.json is missing while graph-metadata.json is present',
    });
  }

  return { rule: GENERATED_METADATA_INTEGRITY_RULE, checked: true, violations };
}

/**
 * Resolve an integrity report into a single validation status given the rollout mode.
 *
 * Under grandfather report mode the violations resolve to a non-blocking `info` so a
 * legacy folder reports but does not fail strict during the migration window. With the
 * grandfather flag off they resolve to `error` so the contract is enforced.
 *
 * @param report - The integrity report to resolve
 * @param opts - Whether grandfather report mode is active
 * @returns The resolved rule status, message and detail lines
 */
export function resolveGeneratedMetadataIntegrity(
  report: GeneratedMetadataIntegrityReport,
  opts: { grandfather: boolean; statusCompletionConsistencyEnforced?: boolean },
): ResolvedIntegrityStatus {
  if (!report.checked) {
    return {
      rule: GENERATED_METADATA_INTEGRITY_RULE,
      status: 'pass',
      message: 'No generated metadata present to validate',
      details: [],
    };
  }
  if (report.violations.length === 0) {
    return {
      rule: GENERATED_METADATA_INTEGRITY_RULE,
      status: 'pass',
      message: 'Generated metadata passed schema, status-enum and path-prefix invariants',
      details: [],
    };
  }

  // STATUS_COMPLETE_EVIDENCE_MISMATCH has its own independent rollout gate rather than
  // following the blanket grandfather flag: a repo-wide backlog of already-mislabeled
  // folders means this specific check must stay non-blocking until explicitly enforced,
  // even while the overall grandfather flag has already graduated the other checks.
  const statusCompletionConsistencyEnforced = opts.statusCompletionConsistencyEnforced ?? false;
  const isBlockingViolation = (violation: GeneratedMetadataViolation): boolean => {
    if (violation.code === STATUS_COMPLETE_EVIDENCE_MISMATCH_CODE) {
      return statusCompletionConsistencyEnforced;
    }
    return !opts.grandfather;
  };

  const details = report.violations.map((violation) => `${violation.file}: ${violation.code}: ${violation.message}`);
  const anyBlocking = report.violations.some(isBlockingViolation);
  const mode = opts.grandfather ? 'grandfather report mode' : 'enforced';
  return {
    rule: GENERATED_METADATA_INTEGRITY_RULE,
    status: anyBlocking ? 'error' : 'info',
    message: `Generated metadata integrity found ${report.violations.length} violation(s) (${mode})`,
    details,
  };
}
