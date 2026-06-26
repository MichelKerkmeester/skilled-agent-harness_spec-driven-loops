// ───────────────────────────────────────────────────────────────
// MODULE: Skill Metadata Sanitizer
// ───────────────────────────────────────────────────────────────

import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';

type JsonRecord = Record<string, unknown>;

export const SKILL_METADATA_SANITIZER_VERSION = 'skill-metadata-boundary:v1';

const MAX_METADATA_VALUE_LENGTH = 512;
const CONTROL_CHAR_PATTERN = /[\u0000-\u001F\u007F]/u;
const INSTRUCTION_SHAPED_PATTERN = /\b(ignore|disregard|override|forget)\b.{0,48}\b(instructions?|rules?|policy|policies|system|developer)\b|\b(system|developer)\s+(prompt|message|instructions?)\b|\b(prompt injection|jailbreak|do not obey|reveal secrets?)\b/i;

function workspaceRootForSource(sourcePath: string): string {
  const resolved = resolve(sourcePath);
  const marker = `${sep}.opencode${sep}skills${sep}`;
  const index = resolved.indexOf(marker);
  if (index >= 0) return resolved.slice(0, index);
  return dirname(dirname(sourcePath));
}

function isInside(candidate: string, root: string): boolean {
  const rel = relative(root, candidate);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

function hasTraversal(value: string): boolean {
  return value.split(/[\\/]+/u).some((segment) => segment === '..');
}

function sanitizeScalar(value: string, sourcePath: string, pathLike: boolean): string | null {
  const trimmed = value.replace(/\s+/gu, ' ').trim();
  if (!trimmed || trimmed.length > MAX_METADATA_VALUE_LENGTH) return null;
  if (CONTROL_CHAR_PATTERN.test(trimmed)) return null;
  if (INSTRUCTION_SHAPED_PATTERN.test(trimmed)) return null;
  if (hasTraversal(trimmed)) return null;

  if (pathLike) {
    const root = workspaceRootForSource(sourcePath);
    const candidate = isAbsolute(trimmed) ? resolve(trimmed) : resolve(dirname(sourcePath), trimmed);
    if (!isInside(candidate, root)) return null;
  }

  return trimmed;
}

export function sanitizeMetadataStringArray(value: readonly string[], sourcePath: string, options: { pathLike?: boolean } = {}): string[] {
  const output: string[] = [];
  for (const entry of value) {
    const sanitized = sanitizeScalar(entry, sourcePath, options.pathLike === true);
    if (sanitized && !output.includes(sanitized)) output.push(sanitized);
  }
  return output;
}

export function sanitizeDerivedMetadata(value: JsonRecord | null, sourcePath: string): JsonRecord | null {
  if (value === null) return null;
  const sanitized: JsonRecord = { ...value };
  for (const key of ['trigger_phrases', 'key_topics', 'entities']) {
    const raw = value[key];
    if (Array.isArray(raw)) {
      sanitized[key] = sanitizeMetadataStringArray(
        raw.filter((entry): entry is string => typeof entry === 'string'),
        sourcePath,
      );
    }
  }
  if (Array.isArray(value.source_docs)) {
    sanitized.source_docs = sanitizeMetadataStringArray(
      value.source_docs.filter((entry): entry is string => typeof entry === 'string'),
      sourcePath,
      { pathLike: true },
    );
  }
  if (Array.isArray(value.key_files)) {
    sanitized.key_files = sanitizeMetadataStringArray(
      value.key_files.filter((entry): entry is string => typeof entry === 'string'),
      sourcePath,
      { pathLike: true },
    );
  }
  return sanitized;
}
