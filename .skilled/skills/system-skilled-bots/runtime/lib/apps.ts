// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Bot Apps
// ───────────────────────────────────────────────────────────────────
//
// A bot names the connector servers it may reach, and each run gets a UTCP
// config holding only those. This module is the only reader of the
// checkout's config and the only writer of a run's filtered copy, so the
// checker and the runner refuse the same declaration for the same reason.
// A name the config does not hold is refused and never dropped, so a typo
// cannot widen or narrow what a run reaches. A refusal comes back as a
// result with a named reason. The copy keeps every top-level key of the
// source and filters one list, and it resolves no variable, so it holds no
// credential.

import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';

import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The checkout's UTCP config, and the name a worktree's copy takes so the project pin resolves to it. */
export const UTCP_CONFIG_NAME = '.utcp_config.json';

/** The run folder's copy, the file the child's config variable names. */
export const RUN_UTCP_CONFIG_NAME = 'utcp.json';

/** The loader key whose relative path is resolved against the source config's folder. */
const DOTENV_PATH_KEY = 'env_file_path';

/** The checkout's config as read. */
export interface UtcpSource {
  /** Absolute path of the config that was read. */
  path: string;
  /** Every top-level key of the config, as parsed. */
  config: Record<string, unknown>;
  /** The template entries that are objects, in source order. */
  templates: Array<Record<string, unknown>>;
  /** The template names, in source order. */
  names: string[];
}

/** A declaration the config can honor. */
export interface ResolvedApps {
  /** The honored server names, in the source config's order, each once. */
  honored: string[];
  /** The config the names were checked against, or null when nothing was declared and nothing was read. */
  source: UtcpSource | null;
}

/** Either the run folder's copy, built from the source, or the worktree's copy of those same bytes. */
export type UtcpWrite =
  | { runFolder: string; source: UtcpSource | null; honored: string[] }
  | { runFolder: string; worktree: string };

export interface WrittenUtcpConfig {
  /** Absolute path of the file this call wrote. */
  path: string;
  /** For a worktree write, the tree's own file before the write, or null when the tree held none. Null for the run folder write. */
  treeOriginal: string | null;
}

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Write through a sibling temp file and a rename, so a reader never sees half a file and a link is replaced, not followed. */
function writeAtomic(path: string, text: string): Result<string> {
  const temp = `${path}.${process.pid}.tmp`;
  try {
    writeFileSync(temp, text);
    renameSync(temp, path);
    return { ok: true, value: path };
  } catch (error: unknown) {
    rmSync(temp, { force: true });
    return { ok: false, reason: 'utcp-config-unwritten', detail: messageOf(error) };
  }
}

/** The source with its template list filtered and each relative dotenv path made absolute. */
function filteredConfig(source: UtcpSource | null, honored: string[]): Record<string, unknown> {
  if (source === null) return { manual_call_templates: [] };
  const keep = new Set(honored);
  const out: Record<string, unknown> = { ...source.config };
  const loaders = source.config.load_variables_from;
  if (Array.isArray(loaders)) {
    const base = dirname(source.path);
    out.load_variables_from = loaders.map((entry: unknown) => {
      if (!isPlainObject(entry)) return entry;
      const file = entry[DOTENV_PATH_KEY];
      if (typeof file !== 'string' || isAbsolute(file)) return entry;
      return { ...entry, [DOTENV_PATH_KEY]: resolve(base, file) };
    });
  }
  const seen = new Set<string>();
  out.manual_call_templates = source.templates.filter((entry) => {
    const name = entry.name;
    if (typeof name !== 'string' || !keep.has(name) || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
  return out;
}

// ───────────────────────────────────────────────────────────────────
// 3. READ, RESOLVE & WRITE
// ───────────────────────────────────────────────────────────────────

/**
 * Read the checkout's UTCP config and the server names it holds.
 *
 * @returns The config, or the refusal `utcp-config-missing` or `utcp-config-invalid`.
 */
export function readUtcpServerNames(checkoutRoot: string): Result<UtcpSource> {
  const path = resolve(checkoutRoot, UTCP_CONFIG_NAME);
  if (!existsSync(path)) return { ok: false, reason: 'utcp-config-missing', detail: path };
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error: unknown) {
    return { ok: false, reason: 'utcp-config-invalid', detail: messageOf(error) };
  }
  if (!isPlainObject(parsed)) return { ok: false, reason: 'utcp-config-invalid', detail: 'expected a JSON object' };
  const list: unknown = parsed.manual_call_templates;
  // A config with no template list holds no name, so a declared name is unknown and the config is not invalid.
  if (list !== undefined && !Array.isArray(list)) {
    return { ok: false, reason: 'utcp-config-invalid', detail: 'manual_call_templates is not a list' };
  }
  const templates = (Array.isArray(list) ? list : []).filter(isPlainObject);
  const names = templates.map((entry) => entry.name).filter((name): name is string => typeof name === 'string');
  return { ok: true, value: { path, config: parsed, templates, names } };
}

/**
 * Check a declaration against the checkout's config.
 *
 * @param declared - The parsed declaration, null when the key is absent.
 * @returns The honored names in source order, or a refusal: a config refusal, or the unknown-name refusal naming every unknown name.
 */
export function resolveApps(checkoutRoot: string, declared: string[] | null): Result<ResolvedApps> {
  // Nothing declared reads nothing, so a missing or broken config can never widen a bot that asked for no server.
  if (declared === null || declared.length === 0) return { ok: true, value: { honored: [], source: null } };
  const source = readUtcpServerNames(checkoutRoot);
  if (!source.ok) return source;
  const known = new Set(source.value.names);
  const unknown = [...new Set(declared.filter((name) => !known.has(name)))];
  if (unknown.length > 0) return { ok: false, reason: 'apps-unknown-server', detail: unknown.join(', ') };
  const wanted = new Set(declared);
  const honored = [...new Set(source.value.names.filter((name) => wanted.has(name)))];
  return { ok: true, value: { honored, source: source.value } };
}

/**
 * Write a run's filtered config. Given a source and the honored names, it writes the run
 * folder's copy. Given a worktree, it copies the run folder's bytes into the tree root,
 * which is the path the project pin names, and returns the tree's own file so the caller
 * can put it back.
 *
 * @returns The path written, or the refusal `utcp-config-unwritten`.
 */
export function writeRunUtcpConfig(input: UtcpWrite): Result<WrittenUtcpConfig> {
  const runCopy = join(input.runFolder, RUN_UTCP_CONFIG_NAME);
  if ('worktree' in input) {
    const target = join(input.worktree, UTCP_CONFIG_NAME);
    let text: string;
    let treeOriginal: string | null;
    try {
      text = readFileSync(runCopy, 'utf8');
      treeOriginal = existsSync(target) ? readFileSync(target, 'utf8') : null;
    } catch (error: unknown) {
      return { ok: false, reason: 'utcp-config-unwritten', detail: messageOf(error) };
    }
    const written = writeAtomic(target, text);
    if (!written.ok) return written;
    return { ok: true, value: { path: target, treeOriginal } };
  }
  const written = writeAtomic(runCopy, `${JSON.stringify(filteredConfig(input.source, input.honored), null, 2)}\n`);
  if (!written.ok) return written;
  return { ok: true, value: { path: runCopy, treeOriginal: null } };
}
