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

export const GENERATED_METADATA_INTEGRITY_RULE = 'GENERATED_METADATA_INTEGRITY' as const;

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
  opts: { grandfather: boolean },
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

  const details = report.violations.map((violation) => `${violation.file}: ${violation.code}: ${violation.message}`);
  const mode = opts.grandfather ? 'grandfather report mode' : 'enforced';
  return {
    rule: GENERATED_METADATA_INTEGRITY_RULE,
    status: opts.grandfather ? 'info' : 'error',
    message: `Generated metadata integrity found ${report.violations.length} violation(s) (${mode})`,
    details,
  };
}
