#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Lane Residue Sweep
// ───────────────────────────────────────────────────────────────────
// Answers one question with an exit code: is anything left of the skill
// advisor's retired semantic lane (the Ollama and HuggingFace embedding route,
// its vector tables and its model server), in the tracked repository or on this
// machine?
//
//   repo     Lists every tracked file outside specs/ that names the lane: by
//            content under two vocabularies, by a lane word in its path, or as
//            a symlink into an embeddings folder. The trigger index generator's
//            four outputs are read by structure instead, because they always
//            hold spec packet history.
//   machine  Reports what the lane left on this machine (checks M1 to M8):
//            compiled output, installed model modules, vector objects in the
//            advisor database and its backup copies, the model-server process
//            and socket dir, the model cache inside each package folder, the
//            pulled Ollama model, lane keys in dotenv files, and M1 to M3 again
//            for every linked worktree. `askFirst` lists the question apply
//            would ask, so a caller without a terminal can ask it instead.
//   apply    Runs the machine checks, deletes what this checkout owns without
//            asking, asks before touching the shared Ollama model (on a
//            terminal, or through this run's --shared-model answer), then
//            re-runs the checks and exits on that second result.
//
// Decisions that are load-bearing, each because the naive version lies:
//
// 1. Two vocabularies. The identifier pattern alone misses files that describe
//    the lane only in prose ("vector refresh", "five-lane"), so both run.
// 2. A separate symlink pass. git grep never matches the target text of a
//    tracked symlink, so a link into the embeddings package passes a pure
//    content search.
// 3. Exact-path allowlist rows. A folder or glob row would also hide a remnant
//    that lands in that folder later, so the loader refuses both. The index
//    outputs get no row: a whole-file row would hide a lane phrase that points
//    at a live doc, so their entries are judged one by one.
// 4. Apply deletes and never copies. Every deleted path is a resolved root plus
//    a fixed name, refused when it is a symlink or resolves outside that root.
// 5. The shared-model answer is never remembered. It comes from the terminal or
//    from --shared-model on this run's own command line, because storing it
//    would write new lane state onto the machine this cleanup exists to clear.
// 6. A checkout that still holds a lane source gets no change from apply: its
//    own code still uses the database tables, model server and model cache.
// 7. A model server is a node process whose first script argument is the
//    server script. A shell or pager whose command line merely names the
//    script is neither listed nor signalled.
//
// This file, its allowlist and its test are the one place the vocabulary is
// meant to survive, and each is exempted by its own allowlist row.
//
// Usage:
//   node sweep-lane-residue.mjs repo [--root <path>] [--allowlist <path>] [--json]
//   node sweep-lane-residue.mjs machine [--root <path>] [--db-dir <path>]
//        [--ollama-host <url>] [--socket-dir <path>] [--json]
//   node sweep-lane-residue.mjs apply [--root <path>] [--db-dir <path>]
//        [--ollama-host <url>] [--socket-dir <path>] [--shared-model delete|keep] [--json]
//
// Exit codes: 0 = nothing left, 1 = remnants remain, 2 = invocation error, or,
// in machine and apply mode, a check that could not run while nothing was found.
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { stableStringify } from './lib/artifact.mjs';
import { compareCodeUnits } from './lib/normalize.mjs';
import { isMainModule } from '../lib/esm-entry.mjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

export const DEFAULT_ALLOWLIST_PATH = path.resolve(SCRIPT_DIR, 'fixtures', 'lane-residue-allowlist.json');

/**
 * Report schema; bump when a consumer would have to change to read it. Version
 * 2 dropped the hub cache root from the machine context and added `askFirst`
 * to the machine and apply reports and `index` to the repo report.
 */
export const SCHEMA_VERSION = 2;

/** Exit codes. */
export const EXIT_CLEAN = 0;
export const EXIT_LIVE_HITS = 1;
export const EXIT_ERROR = 2;

export const MODES = Object.freeze(['repo', 'machine', 'apply']);

/** Finding states. A check that could not run is never reported as absent. */
export const FOUND = 'found';
export const ABSENT = 'absent';
export const NOT_CHECKED = 'not_checked';

/**
 * Identifier vocabulary: names the lane's code and config carry, and
 * `hf-embed`, the stem of the model server's socket folder and of every file
 * it writes there. Each term is a literal with no regular-expression
 * metacharacter, so the joined alternation reads the same to git's extended
 * regex and to JavaScript.
 */
export const IDENTIFIER_TERMS = Object.freeze([
  'ollama',
  'hf-embed',
  'semantic_shadow',
  'nomic-embed',
  'vec_768',
  'vec_cmd_',
  'vec_metadata',
  'EMBED_REFRESH',
  'EXACT_SEMANTIC_RERANK',
  'DISABLE_BUILTIN_SEMANTIC',
  'shared/embeddings',
  'hf-model-server',
  'model-server-supervision',
  'EMBEDDINGS_PROVIDER',
  'embedder',
]);

/**
 * Prose vocabulary: how docs describe the lane without naming its code. The
 * spaced names of the model server and its two helper modules are here because
 * a description or trigger phrase spells them with spaces, which the hyphenated
 * identifiers never match. A bare "model server" is left out on purpose: the
 * cleanup's own docs name the server they remove.
 */
export const PROSE_TERMS = Object.freeze([
  'semantic lane',
  'meaning match',
  'vector coverage',
  'vector refresh',
  'five-lane',
  '5-lane',
  'five lanes',
  'semanticHealth',
  'embeddingText',
  'HF_EMBED',
  'hf-local',
  '@huggingface/transformers',
  'sqlite-vec',
  'hf model server',
  'hf embed server',
  'local embedding server',
  'model server supervision',
  'sidecar env allowlist',
]);

export const IDENTIFIER_PATTERN = IDENTIFIER_TERMS.join('|');
export const PROSE_PATTERN = PROSE_TERMS.join('|');

/** Words that mark a lane file by its path alone. */
export const PATH_TERMS = Object.freeze(['embedders', 'semantic-shadow', 'model-server', '.embeddings-cache', 'five-lane']);

/** A tracked symlink whose target holds this word points into the embeddings package. */
export const SYMLINK_TARGET_TERM = 'embeddings';

/** Historical packets name the lane thousands of times and are a record, not a live surface. */
export const EXCLUDED_PATHSPEC = ':!specs';
const SPECS_PREFIX = 'specs/';

/**
 * The trigger index generator's four outputs. The generator reads every doc,
 * specs/ included, so these files always carry lane words from packet history.
 * Each lane entry is live only when it points outside specs/ and at no
 * allowlisted file.
 */
export const INDEX_OUTPUTS = Object.freeze({
  diagnostics: '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json',
  index: '.skilled/skills/system-spec-kit/runtime/data/trigger-index.json',
  manifest: '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json',
  variants: '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json',
});
const INDEX_GENERATOR = '.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs';

const GIT_SYMLINK_MODE = '120000';
const SPAWN_MAX_BUFFER = 256 * 1024 * 1024;

/** Live files printed in the human summary; `--json` always lists every one. */
const HUMAN_LIST_LIMIT = 50;
/** Items printed per machine finding in the human summary. */
const HUMAN_ITEM_LIMIT = 20;

const ADVISOR_RUNTIME_SEGMENTS = Object.freeze(['.skilled', 'skills', 'system-skill-advisor', 'runtime']);
const SPEC_KIT_SEGMENTS = Object.freeze(['.skilled', 'skills', 'system-spec-kit']);
const MODEL_SERVER_SCRIPT_SEGMENTS = Object.freeze(['.skilled', 'bin', 'hf-model-server.cjs']);
const MODEL_SERVER_SCRIPT_NAME = 'hf-model-server.cjs';

/**
 * The value-free dotenv reader, resolved from this script's own checkout so a
 * fixture root without hooks can still be checked. A hook refuses any direct
 * read of a dotenv file, and this command returns key names only.
 */
const ENV_SECRET_CLI = path.resolve(SCRIPT_DIR, '..', '..', '..', '..', '..', 'hooks', 'env-secret-guard', 'cli', 'env-secret.cjs');
const DOTENV_FILES = Object.freeze(['.env', '.env.local']);

/**
 * The launcher's IPC bridge, whose folder derivation decides where a launcher
 * pinned to its own advisor database put its model server. Calling it, rather
 * than restating it, keeps this check looking where the launcher wrote.
 */
const IPC_BRIDGE_MODULE = path.resolve(SCRIPT_DIR, '..', '..', '..', '..', '..', 'bin', 'lib', 'launcher-ipc-bridge.cjs');
const ADVISOR_SERVICE_NAME = 'system-skill-advisor';
const requireCjs = createRequire(import.meta.url);

/**
 * Compiled lane output the build leaves behind after its sources are gone.
 * `directory` marks the two whole folders apply may delete recursively.
 */
const COMPILED_LANE_PATHS = Object.freeze([
  Object.freeze({ base: 'advisorRuntime', directory: false, segments: Object.freeze(['dist', 'runtime', 'lib', 'scorer', 'lanes', 'semantic-shadow.js']) }),
  Object.freeze({ base: 'advisorRuntime', directory: false, segments: Object.freeze(['dist', 'runtime', 'lib', 'scorer', 'lanes', 'semantic-shadow.js.map']) }),
  Object.freeze({ base: 'advisorRuntime', directory: true, segments: Object.freeze(['dist', 'runtime', 'lib', 'embedders']) }),
  Object.freeze({ base: 'specKit', directory: true, segments: Object.freeze(['shared', 'dist', 'embeddings']) }),
]);

/** Build trees scanned by content, because a compiled file can outlive its source. */
const COMPILED_SCAN_ROOTS = Object.freeze([
  Object.freeze({ base: 'advisorRuntime', segments: Object.freeze(['dist']) }),
  Object.freeze({ base: 'specKit', segments: Object.freeze(['shared', 'dist']) }),
]);

const MODEL_MODULE_PATHS = Object.freeze([
  Object.freeze({ base: 'advisorRuntime', segments: Object.freeze(['node_modules', '@huggingface']) }),
  Object.freeze({ base: 'advisorRuntime', segments: Object.freeze(['node_modules', 'onnxruntime-node']) }),
  Object.freeze({ base: 'specKit', segments: Object.freeze(['node_modules', '@huggingface']) }),
  Object.freeze({ base: 'specKit', segments: Object.freeze(['node_modules', 'onnxruntime-node']) }),
]);

/**
 * The model folder the lane's model library downloaded into. The library's
 * default cache is a `.cache` folder inside its own package, and no lane code
 * moved it, so the copy sits under each package that installed the library,
 * never in the shared HuggingFace hub cache.
 */
const MODEL_CACHE_SEGMENTS = Object.freeze(['node_modules', '@huggingface', 'transformers', '.cache', 'nomic-ai', 'nomic-embed-text-v1.5']);
const MODEL_CACHE_BASES = Object.freeze(['advisorRuntime', 'specKit']);

/**
 * Sources whose presence means the checkout still runs the lane. Apply changes
 * nothing in such a checkout, because its code still uses the compiled output,
 * the database tables, the model server and the model cache.
 */
const LANE_SOURCE_PATHS = Object.freeze([
  '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts',
  '.skilled/skills/system-skill-advisor/runtime/lib/embedders',
  '.skilled/skills/system-spec-kit/shared/embeddings',
  '.skilled/bin/hf-model-server.cjs',
]);

const DB_FILENAME = 'skill-graph.sqlite';
const DB_COMPANION_SUFFIXES = Object.freeze(['', '-wal', '-shm', '-journal']);
/** Backup copies the rebuild route keeps and the runtime's quarantined copies. */
const DB_COPY_PATTERN = /^skill-graph\.sqlite(?:\..*)?\.(?:bak|corrupt(?:-wal|-shm)?)$/;
const SHARD_DIR_NAME = 'vectors';
const SHARD_PATTERN = /^context-vectors__.+\.sqlite(?:-wal|-shm)?$/;
const DB_NAME_PATTERN = /^vec_|embedding/i;
const DB_COLUMN_PATTERN = /^embedding/i;
const DB_BYTE_MARKER = 'nomic-embed';

export const DEFAULT_SOCKET_DIR = '/tmp/system-hf-embed';
const MODEL_SERVER_SOCKET_FILE = 'hf-embed.sock';
/**
 * The only names the model server and its supervisor write into the socket
 * directory. Apply deletes these by name and never the directory's other
 * contents, because the directory can be pointed anywhere.
 */
const MODEL_SERVER_DIR_FILES = Object.freeze([MODEL_SERVER_SOCKET_FILE, 'hf-embed.pid', 'hf-embed-respawn.lock', 'hf-embed-giveup.json']);
export const DEFAULT_OLLAMA_HOST = 'http://127.0.0.1:11434';
const OLLAMA_DEFAULT_PORT = '11434';
const OLLAMA_TAGS_TIMEOUT_MS = 1500;
const OLLAMA_DELETE_TIMEOUT_MS = 10000;
export const OLLAMA_MODEL = 'nomic-embed-text:v1.5';
const OLLAMA_MANIFEST_SEGMENTS = Object.freeze(['manifests', 'registry.ollama.ai', 'library', 'nomic-embed-text', 'v1.5']);

/** The only answers --shared-model takes, each binding one apply run. */
export const SHARED_MODEL_ANSWERS = Object.freeze(['delete', 'keep']);

/**
 * Dotenv keys only the lane read. Generic provider credentials such as an
 * OpenAI or Voyage API key are left out on purpose: other tools use them.
 */
export const LANE_ENV_KEYS = Object.freeze([
  'EMBEDDING_DIM',
  'EMBEDDINGS_PROVIDER',
  'MEMORY_DB_PATH',
  'OLLAMA_BASE_URL',
  'OLLAMA_EMBEDDINGS_MODEL',
  'OLLAMA_REQUEST_TIMEOUT_MS',
  'OPENAI_EMBEDDINGS_MODEL',
  'SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC',
  'SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK',
  'SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED',
  'SYSTEM_SKILL_ADVISOR_EMBED_REFRESH',
  'VOYAGE_EMBEDDINGS_MODEL',
]);
export const LANE_ENV_KEY_PREFIXES = Object.freeze(['HF_EMBED_', 'HF_EMBEDDINGS_', 'SPECKIT_CASCADE_', 'SPECKIT_HF_']);

const PROCESS_STOP_TIMEOUT_MS = 3000;
const PROCESS_POLL_MS = 100;

const USAGE = [
  'usage: sweep-lane-residue.mjs repo [--root <path>] [--allowlist <path>] [--json]',
  '       sweep-lane-residue.mjs machine [--root <path>] [--db-dir <path>] [--ollama-host <url>]',
  '                                      [--socket-dir <path>] [--json]',
  '       sweep-lane-residue.mjs apply [--root <path>] [--db-dir <path>] [--ollama-host <url>]',
  '                                    [--socket-dir <path>] [--shared-model delete|keep] [--json]',
].join('\n');

/** Value flags, the modes that read each one, and the values a closed flag takes. */
const VALUE_FLAGS = Object.freeze({
  '--allowlist': Object.freeze({ key: 'allowlistPath', modes: Object.freeze(['repo']) }),
  '--db-dir': Object.freeze({ key: 'dbDir', modes: Object.freeze(['machine', 'apply']) }),
  '--ollama-host': Object.freeze({ key: 'ollamaHost', modes: Object.freeze(['machine', 'apply']) }),
  '--root': Object.freeze({ key: 'root', modes: MODES }),
  '--shared-model': Object.freeze({ key: 'sharedModel', modes: Object.freeze(['apply']), values: SHARED_MODEL_ANSWERS }),
  '--socket-dir': Object.freeze({ key: 'socketDir', modes: Object.freeze(['machine', 'apply']) }),
});

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * @param {string} value Literal text.
 * @returns {string} Regular-expression-safe rendering.
 */
export function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * One stateless matcher per term. Attributing with the combined alternation
 * would report only the leftmost term on a line that names several.
 */
const IDENTIFIER_MATCHERS = Object.freeze(IDENTIFIER_TERMS.map((term) => ({ regex: new RegExp(escapeRegExp(term), 'i'), term })));
const PROSE_MATCHERS = Object.freeze(PROSE_TERMS.map((term) => ({ regex: new RegExp(escapeRegExp(term), 'i'), term })));
const IDENTIFIER_REGEX = new RegExp(IDENTIFIER_TERMS.map(escapeRegExp).join('|'), 'i');
/** Either vocabulary, the test a string in an index output has to pass to count as a lane entry. */
const LANE_TERM_REGEX = new RegExp([...IDENTIFIER_TERMS, ...PROSE_TERMS].map(escapeRegExp).join('|'), 'i');

/**
 * @param {string} text Content to attribute.
 * @param {'identifier' | 'prose'} vocabulary Which term list to test.
 * @returns {string[]} Every term of that vocabulary the text names, in declaration order.
 */
export function attributeTerms(text, vocabulary) {
  const matchers = vocabulary === 'prose' ? PROSE_MATCHERS : IDENTIFIER_MATCHERS;
  return matchers.filter((matcher) => matcher.regex.test(text)).map((matcher) => matcher.term);
}

/**
 * @param {string | undefined} value Environment value.
 * @returns {string | undefined} The value, or undefined when unset or blank.
 */
function nonEmpty(value) {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

/**
 * @param {string} filePath Any path.
 * @returns {fs.Stats | null} Link-level stats, or null when nothing is there.
 * @throws {Error} When the path exists but cannot be inspected.
 */
function lstatOrNull(filePath) {
  try {
    return fs.lstatSync(filePath);
  } catch (error) {
    if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') return null;
    throw error;
  }
}

/**
 * @param {string} filePath Any path.
 * @returns {boolean} Whether the path itself is a symlink.
 */
function isSymlink(filePath) {
  try {
    return fs.lstatSync(filePath).isSymbolicLink();
  } catch {
    return false;
  }
}

/**
 * @param {string} filePath Any path.
 * @returns {string} The canonical path, or the absolute path when it cannot be resolved.
 */
function realpathOrSelf(filePath) {
  try {
    return fs.realpathSync(filePath);
  } catch {
    return path.resolve(filePath);
  }
}

/**
 * @param {string} output NUL-separated git output.
 * @returns {string[]} Non-empty fields.
 */
function splitNul(output) {
  return output.split('\0').filter((field) => field !== '');
}

/**
 * @param {unknown} error Anything thrown.
 * @returns {string} A one-line message.
 */
function messageOf(error) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * @param {string} root Directory git runs in.
 * @param {string[]} args Git arguments.
 * @returns {import('node:child_process').SpawnSyncReturns<string>} The finished run.
 * @throws {Error} When git cannot be started at all.
 */
function runGit(root, args) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: SPAWN_MAX_BUFFER });
  if (result.error) throw new Error(`git could not run: ${result.error.message}`);
  return result;
}

// ───────────────────────────────────────────────────────────────────
// 3. ALLOWLIST
// ───────────────────────────────────────────────────────────────────

/**
 * Reads the exemption set. A malformed file throws rather than degrading to an
 * empty allowlist, because a silently dropped row reads as new residue and a
 * silently widened row reads as a clean repository.
 *
 * @param {string} allowlistPath Absolute or cwd-relative path.
 * @returns {Array<{ path: string, reason: string }>} Exact-path rows.
 * @throws {Error} On unreadable JSON, a missing field, a folder row, a glob row or a duplicate.
 */
export function loadAllowlist(allowlistPath) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
  } catch (error) {
    throw new Error(`allowlist is not readable JSON: ${allowlistPath}: ${messageOf(error)}`);
  }

  const entries = parsed?.entries;
  if (!Array.isArray(entries)) throw new Error(`allowlist has no entries array: ${allowlistPath}`);

  const seen = new Set();
  return entries.map((entry, index) => {
    const rowPath = entry?.path;
    const reason = entry?.reason;
    if (typeof rowPath !== 'string' || rowPath.trim() === '') {
      throw new Error(`allowlist entry ${index} has no path: ${allowlistPath}`);
    }
    if (typeof reason !== 'string' || reason.trim() === '') {
      throw new Error(`allowlist entry ${index} (${rowPath}) has no reason: ${allowlistPath}`);
    }
    if (rowPath.endsWith('/')) {
      throw new Error(`allowlist entry ${index} (${rowPath}) names a folder; rows must be exact file paths: ${allowlistPath}`);
    }
    if (rowPath.includes('*') || rowPath.includes('?')) {
      throw new Error(`allowlist entry ${index} (${rowPath}) holds a glob character; rows must be exact file paths: ${allowlistPath}`);
    }
    if (seen.has(rowPath)) throw new Error(`allowlist entry ${index} (${rowPath}) is a duplicate: ${allowlistPath}`);
    seen.add(rowPath);
    return Object.freeze({ path: rowPath, reason });
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. REPO MODE
// ───────────────────────────────────────────────────────────────────

/**
 * Repo mode reads the whole tracked tree, so it refuses any root other than
 * the top of a work tree: a subdirectory would silently scan a fraction of it.
 *
 * @param {string} root Candidate root.
 * @returns {string} The absolute root.
 * @throws {Error} When git is missing or the root is not a work tree top.
 */
export function resolveRepoRoot(root) {
  const resolved = path.resolve(root);
  const result = runGit(resolved, ['rev-parse', '--show-toplevel']);
  if (result.status !== 0) {
    throw new Error(`not a git work tree: ${resolved}${result.stderr.trim() ? ` (${result.stderr.trim()})` : ''}`);
  }
  const toplevel = result.stdout.trim();
  if (realpathOrSelf(toplevel) !== realpathOrSelf(resolved)) {
    throw new Error(`--root must be the top of the work tree (${toplevel}), not ${resolved}`);
  }
  return resolved;
}

/**
 * @param {string} root Work tree top.
 * @param {string} pattern Extended regular expression.
 * @returns {string[]} Tracked paths outside specs/ whose working-tree content matches.
 * @throws {Error} When git grep fails for any reason other than finding nothing.
 */
function grepTrackedFiles(root, pattern) {
  const result = runGit(root, ['grep', '-l', '-z', '-i', '-E', '-e', pattern, '--', '.', EXCLUDED_PATHSPEC]);
  // git grep exits 1 for "no match", which is a clean answer, not a failure.
  if (result.status === 1) return [];
  if (result.status !== 0) {
    throw new Error(`git grep failed (exit ${result.status}): ${result.stderr.trim()}`);
  }
  return splitNul(result.stdout);
}

/**
 * @param {string} root Work tree top.
 * @returns {Array<{ mode: string, path: string }>} Tracked entries outside specs/.
 * @throws {Error} When git ls-files fails.
 */
function listTrackedEntries(root) {
  const result = runGit(root, ['ls-files', '-s', '-z', '--', '.', EXCLUDED_PATHSPEC]);
  if (result.status !== 0) {
    throw new Error(`git ls-files failed (exit ${result.status}): ${result.stderr.trim()}`);
  }
  const entries = new Map();
  for (const record of splitNul(result.stdout)) {
    const tab = record.indexOf('\t');
    if (tab < 0) continue;
    const relativePath = record.slice(tab + 1);
    entries.set(relativePath, { mode: record.split(' ')[0], path: relativePath });
  }
  return [...entries.values()];
}

/**
 * @param {string} root Work tree top.
 * @param {string} relativePath Tracked path.
 * @returns {string} The file's bytes as latin1 text, or '' when it is not a readable regular file.
 */
function readTrackedText(root, relativePath) {
  try {
    const absolute = path.join(root, relativePath);
    if (!fs.lstatSync(absolute).isFile()) return '';
    return fs.readFileSync(absolute, 'latin1');
  } catch {
    return '';
  }
}

/**
 * Reads each tracked index output that is present in the working tree. An
 * output that cannot be read as JSON fails the scan rather than falling back to
 * text, because a text scan of it always matches and a skipped file hides
 * whatever it holds.
 *
 * @param {string} root Work tree top.
 * @param {Set<string>} trackedPaths Tracked paths outside specs/.
 * @returns {Record<string, any>} Parsed outputs by INDEX_OUTPUTS key.
 * @throws {Error} When a tracked output is not a regular file or not readable JSON.
 */
function readIndexOutputs(root, trackedPaths) {
  const outputs = {};
  for (const [key, relativePath] of Object.entries(INDEX_OUTPUTS)) {
    if (!trackedPaths.has(relativePath)) continue;
    const absolute = path.join(root, relativePath);
    const stat = lstatOrNull(absolute);
    if (!stat) continue;
    if (!stat.isFile()) throw new Error(`${relativePath} is not a regular file, so its lane entries cannot be read`);
    try {
      outputs[key] = JSON.parse(fs.readFileSync(absolute, 'utf8'));
    } catch (error) {
      throw new Error(`${relativePath} is not readable JSON, so its lane entries cannot be checked: ${messageOf(error)}`);
    }
  }
  return outputs;
}

/**
 * Judges the index outputs entry by entry. A lane path in the index, every
 * target of a phrase whose key or any of its recorded spellings names the
 * lane, and every lane string in the corpus manifest and the generation
 * diagnostics is live only when the path it stands for lies outside specs/ and
 * is no allowlist row. A string that sits in a record with a `path` field, such
 * as a diagnostics reason quoting a phrase, stands for that record's path;
 * any other string stands for itself.
 *
 * The index and its variants are left out of the text scan, so every container
 * walked here must have the generator's shape. A renamed, missing or retyped
 * one throws instead of reading as empty, which would pass a lane phrase unseen.
 *
 * @param {Record<string, any>} outputs Parsed outputs by INDEX_OUTPUTS key.
 * @param {Set<string>} allowlistedPaths Exact allowlisted paths.
 * @returns {{ counts: Record<string, number>, entries: Record<string, Array<Record<string, string>>> }} Live entries per output.
 * @throws {Error} When the index or its phrase variants do not have the generator's shape.
 */
export function checkIndexOutputs(outputs, allowlistedPaths) {
  const entries = { diagnostics: [], index: [], manifest: [], variants: [] };
  const counts = { lanePaths: 0, lanePhrases: 0, laneStrings: 0, outside: 0 };
  const isOutside = (target) => !target.startsWith(SPECS_PREFIX) && !allowlistedPaths.has(target);
  const isMap = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
  const record = (key, entry) => {
    entries[key].push(entry);
    counts.outside += 1;
  };

  const index = outputs.index;
  if (index !== undefined) {
    if (!isMap(index) || !Array.isArray(index.paths) || !isMap(index.phrases)) {
      throw new Error(`${INDEX_OUTPUTS.index} has no paths array or phrases map`);
    }
    for (const target of index.paths) {
      if (typeof target !== 'string') throw new Error(`${INDEX_OUTPUTS.index} holds a path that is not a string`);
      if (!LANE_TERM_REGEX.test(target)) continue;
      counts.lanePaths += 1;
      if (isOutside(target)) record('index', { kind: 'path', path: target });
    }

    // Absent only when the variants output is not tracked, and then the text
    // scan reads it instead.
    let variants = {};
    if (outputs.variants !== undefined) {
      if (!isMap(outputs.variants) || !isMap(outputs.variants.variants)) {
        throw new Error(`${INDEX_OUTPUTS.variants} has no variants map`);
      }
      variants = outputs.variants.variants;
    }
    for (const [phrase, ids] of Object.entries(index.phrases)) {
      if (!Array.isArray(ids)) throw new Error(`${INDEX_OUTPUTS.index} maps "${phrase}" to something other than a list of path ids`);
      const spellings = Object.hasOwn(variants, phrase) ? variants[phrase] : [];
      if (!Array.isArray(spellings) || spellings.some((value) => typeof value !== 'string')) {
        throw new Error(`${INDEX_OUTPUTS.variants} records spellings of "${phrase}" that are not a list of strings`);
      }
      const keyNamesLane = LANE_TERM_REGEX.test(phrase);
      const spelling = keyNamesLane ? undefined : spellings.find((value) => LANE_TERM_REGEX.test(value));
      if (!keyNamesLane && spelling === undefined) continue;
      counts.lanePhrases += 1;
      for (const id of ids) {
        const target = index.paths[id];
        if (typeof target !== 'string') throw new Error(`${INDEX_OUTPUTS.index} maps "${phrase}" to path id ${id}, which it does not hold`);
        if (!isOutside(target)) continue;
        if (keyNamesLane) record('index', { kind: 'phrase', path: target, phrase });
        else record('variants', { kind: 'phrase', path: target, phrase, spelling });
      }
    }
  }

  for (const key of ['manifest', 'diagnostics']) {
    if (outputs[key] === undefined) continue;
    const visit = (node, owner) => {
      if (typeof node === 'string') {
        if (!LANE_TERM_REGEX.test(node)) return;
        counts.laneStrings += 1;
        const target = owner ?? node;
        if (isOutside(target)) record(key, target === node ? { kind: 'string', path: target } : { kind: 'string', path: target, text: node });
        return;
      }
      if (Array.isArray(node)) {
        for (const value of node) visit(value, owner);
        return;
      }
      if (node === null || typeof node !== 'object') return;
      const ownPath = typeof node.path === 'string' ? node.path : owner;
      for (const [field, value] of Object.entries(node)) {
        visit(field, ownPath);
        visit(value, ownPath);
      }
    };
    visit(outputs[key], undefined);
  }

  return { counts, entries };
}

/**
 * Lists every tracked lane remnant outside specs/ and splits it into live and
 * allowlisted files. The index outputs are judged by checkIndexOutputs instead
 * of by their text, and an allowlist row naming one of them hides nothing.
 *
 * @param {{ allowlistPath?: string, root?: string }} [options] Scan options.
 * @returns {Record<string, any>} Report.
 * @throws {Error} When git is missing, the root is wrong, git fails, the allowlist is malformed, or an index output cannot be read.
 */
export function scanRepo(options = {}) {
  const root = resolveRepoRoot(options.root ?? process.cwd());
  const allowlistPath = path.resolve(options.allowlistPath ?? DEFAULT_ALLOWLIST_PATH);
  const allowlist = loadAllowlist(allowlistPath);
  const allowlistedPaths = new Set(allowlist.map((row) => row.path));

  /** @type {Map<string, { identifier: string[], index: Array<Record<string, string>>, path: string[], prose: string[], symlink: string | null }>} */
  const hits = new Map();
  const hitFor = (relativePath) => {
    if (!hits.has(relativePath)) hits.set(relativePath, { identifier: [], index: [], path: [], prose: [], symlink: null });
    return hits.get(relativePath);
  };

  const trackedEntries = listTrackedEntries(root);
  const outputs = readIndexOutputs(root, new Set(trackedEntries.map((entry) => entry.path)));
  // The phrase variants only mean something through the index, so they are
  // read by structure only when the index is read too.
  const structuralPaths = new Set(Object.keys(outputs)
    .filter((key) => key !== 'variants' || outputs.index !== undefined)
    .map((key) => INDEX_OUTPUTS[key]));
  const indexCheck = checkIndexOutputs(outputs, allowlistedPaths);

  const identifierFiles = grepTrackedFiles(root, IDENTIFIER_PATTERN).filter((relativePath) => !structuralPaths.has(relativePath));
  const proseFiles = grepTrackedFiles(root, PROSE_PATTERN).filter((relativePath) => !structuralPaths.has(relativePath));
  for (const relativePath of identifierFiles) {
    const terms = attributeTerms(readTrackedText(root, relativePath), 'identifier');
    hitFor(relativePath).identifier = terms.length > 0 ? terms : ['unattributed'];
  }
  for (const relativePath of proseFiles) {
    const terms = attributeTerms(readTrackedText(root, relativePath), 'prose');
    hitFor(relativePath).prose = terms.length > 0 ? terms : ['unattributed'];
  }
  for (const [key, list] of Object.entries(indexCheck.entries)) {
    if (list.length > 0) hitFor(INDEX_OUTPUTS[key]).index = list;
  }

  let pathHits = 0;
  let symlinkHits = 0;
  for (const entry of trackedEntries) {
    const lowerPath = entry.path.toLowerCase();
    const pathWords = PATH_TERMS.filter((word) => lowerPath.includes(word));
    const isLink = entry.mode === GIT_SYMLINK_MODE;
    if (pathWords.length === 0 && !isLink) continue;

    // A tracked path deleted from the working tree is already gone at the next
    // commit, the same answer git grep gives for its content.
    const absolute = path.join(root, entry.path);
    const stat = lstatOrNull(absolute);
    if (!stat) continue;

    if (pathWords.length > 0) {
      hitFor(entry.path).path = pathWords;
      pathHits += 1;
    }

    if (isLink && stat.isSymbolicLink()) {
      const target = fs.readlinkSync(absolute);
      if (target.toLowerCase().includes(SYMLINK_TARGET_TERM)) {
        hitFor(entry.path).symlink = target;
        symlinkHits += 1;
      }
    }
  }

  const rowsByPath = new Map(allowlist.map((row) => [row.path, row]));
  const matchedRows = new Set();
  const live = [];
  const allowlisted = [];
  for (const relativePath of [...hits.keys()].sort(compareCodeUnits)) {
    const hit = hits.get(relativePath);
    const matched = compactMatch(hit);
    // A row naming an index output would hide every later lane entry in it, so
    // an entry judged live stays live whatever the allowlist says.
    const row = hit.index.length > 0 ? undefined : rowsByPath.get(relativePath);
    if (row) {
      matchedRows.add(row.path);
      allowlisted.push({ matched, path: relativePath, reason: row.reason });
    } else {
      live.push({ matched, path: relativePath });
    }
  }

  return {
    allowlistPath,
    counts: {
      allowlistRows: allowlist.length,
      allowlistRowsMatched: matchedRows.size,
      allowlisted: allowlisted.length,
      files: hits.size,
      identifier: identifierFiles.length,
      live: live.length,
      path: pathHits,
      prose: proseFiles.length,
      symlink: symlinkHits,
    },
    allowlisted,
    index: {
      ...indexCheck.counts,
      generator: INDEX_GENERATOR,
      outputsRead: [...structuralPaths].sort(compareCodeUnits),
    },
    live,
    mode: 'repo',
    patterns: {
      identifier: IDENTIFIER_PATTERN,
      pathTerms: [...PATH_TERMS],
      prose: PROSE_PATTERN,
      symlinkTargetTerm: SYMLINK_TARGET_TERM,
    },
    root,
    schemaVersion: SCHEMA_VERSION,
    unusedAllowlistRows: allowlist.filter((row) => !matchedRows.has(row.path)).map((row) => row.path),
  };
}

/**
 * @param {{ identifier: string[], index: Array<Record<string, string>>, path: string[], prose: string[], symlink: string | null }} hit Raw hit.
 * @returns {Record<string, any>} Only the groups that matched.
 */
function compactMatch(hit) {
  const matched = {};
  if (hit.identifier.length > 0) matched.identifier = hit.identifier;
  if (hit.index.length > 0) matched.index = hit.index;
  if (hit.prose.length > 0) matched.prose = hit.prose;
  if (hit.path.length > 0) matched.path = hit.path;
  if (hit.symlink !== null) matched.symlink = hit.symlink;
  return matched;
}

// ───────────────────────────────────────────────────────────────────
// 5. MACHINE MODE
// ───────────────────────────────────────────────────────────────────

/**
 * @param {string} value Host as the user wrote it: a URL, `host:port` or a bare host.
 * @returns {string} An origin such as `http://127.0.0.1:11434`.
 * @throws {Error} When the value cannot form a URL.
 */
export function normalizeOllamaHost(value) {
  const raw = String(value).trim();
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `http://${raw}`;
  let url;
  try {
    url = new URL(withScheme);
  } catch {
    throw new Error(`not a usable Ollama host: ${raw}`);
  }
  // A bind-all address is how the server listens, not where a client connects.
  if (url.hostname === '0.0.0.0') url.hostname = '127.0.0.1';
  if (url.port === '' && url.protocol === 'http:') url.port = OLLAMA_DEFAULT_PORT;
  return url.origin;
}

/**
 * @param {string} root Checkout root.
 * @returns {string[]} The lane sources still present under the root. A path
 *   that cannot be inspected counts as present, so the guard fails closed.
 */
export function findLaneSources(root) {
  return LANE_SOURCE_PATHS.filter((relativePath) => {
    try {
      return lstatOrNull(path.join(root, ...relativePath.split('/'))) !== null;
    } catch {
      return true;
    }
  });
}

/**
 * @param {string} root Checkout root.
 * @returns {{ advisorRuntime: string, root: string, specKit: string }} The two package roots under it.
 */
function checkoutPaths(root) {
  return {
    advisorRuntime: path.join(root, ...ADVISOR_RUNTIME_SEGMENTS),
    root,
    specKit: path.join(root, ...SPEC_KIT_SEGMENTS),
  };
}

/**
 * Resolves every location the machine checks read. Environment values are
 * read from the passed object, never captured at load, so a caller can point
 * the whole run at fixtures. The root must be the top of a work tree, as in
 * repo mode: every build and database path is built from it, so a
 * subdirectory would check, and in apply mode delete, under the wrong tree.
 *
 * @param {Record<string, any>} [options] CLI options.
 * @param {Record<string, string | undefined>} [env] Environment.
 * @returns {Record<string, string | null>} Resolved locations.
 * @throws {Error} When git is missing or the root is not a work tree top.
 */
export function resolveMachineContext(options = {}, env = process.env) {
  const checkout = checkoutPaths(resolveRepoRoot(options.root ?? process.cwd()));
  const home = nonEmpty(env.HOME) ?? os.homedir();
  const socketDir = path.resolve(options.socketDir ?? DEFAULT_SOCKET_DIR);
  const serverDirs = resolveModelServerDirs(socketDir, env);
  return {
    ...checkout,
    dbDir: path.resolve(options.dbDir ?? nonEmpty(env.SYSTEM_SKILL_ADVISOR_DB_DIR) ?? path.join(checkout.advisorRuntime, 'database')),
    laneSources: findLaneSources(checkout.root),
    modelServerDirNotes: serverDirs.notes,
    modelServerDirs: serverDirs.dirs,
    modelServerScript: path.join(checkout.root, ...MODEL_SERVER_SCRIPT_SEGMENTS),
    ollamaHost: normalizeOllamaHost(options.ollamaHost ?? nonEmpty(env.OLLAMA_HOST) ?? nonEmpty(env.OLLAMA_BASE_URL) ?? DEFAULT_OLLAMA_HOST),
    ollamaModelsDir: path.resolve(nonEmpty(env.OLLAMA_MODELS) ?? path.join(home, '.ollama', 'models')),
    socketDir,
  };
}

/**
 * @param {string} pathValue Any path.
 * @returns {string} The canonical path, or the resolved path when it does not exist yet.
 * @throws {Error} When the path exists but cannot be resolved, as the launcher's own canonicalizer does.
 */
function canonicalizePath(pathValue) {
  const resolved = path.resolve(pathValue);
  try {
    return fs.realpathSync.native(resolved);
  } catch (error) {
    if (error?.code === 'ENOENT') return resolved;
    throw error;
  }
}

/**
 * @param {string | undefined} value A model server address.
 * @returns {string | null} The Unix socket path it names, or null for a TCP or HTTP address.
 */
function unixSocketPathOf(value) {
  if (!value) return null;
  const raw = value.trim();
  if (/^(?:tcp|https?):\/\//.test(raw)) return null;
  return path.resolve(raw.startsWith('unix://') ? raw.slice('unix://'.length) : raw);
}

/**
 * Every folder the model server could have written its socket, pid file,
 * respawn lock and give-up marker into, resolved the way the server and the
 * launcher resolve them: the default or `--socket-dir` folder, the shared IPC
 * folder, the folder of an explicit socket address, and the folder a launcher
 * pinned to its own advisor database derives through the IPC bridge. Only the
 * first is the model server's own; the others are shared with other services.
 * An explicit socket address also names its own file, which can carry any
 * name, so that one name is probed beside the fixed ones.
 *
 * @param {string} socketDir The default or `--socket-dir` folder.
 * @param {Record<string, string | undefined>} env Environment.
 * @returns {{ dirs: Array<{ files: string[], path: string, source: string }>, notes: string[] }} Folders, first source wins, with the extra file names each must probe, and why one could not be derived.
 */
export function resolveModelServerDirs(socketDir, env) {
  const candidates = [{ files: [], path: socketDir, source: 'socket-dir' }];
  const notes = [];

  const ipcSocketDir = nonEmpty(env.SPECKIT_IPC_SOCKET_DIR);
  if (ipcSocketDir && !ipcSocketDir.startsWith('tcp://')) {
    candidates.push({ files: [], path: path.resolve(ipcSocketDir), source: 'SPECKIT_IPC_SOCKET_DIR' });
  }

  const serverUrl = nonEmpty(env.HF_EMBED_SERVER_URL);
  const socketPath = unixSocketPathOf(serverUrl);
  if (socketPath) candidates.push({ files: [path.basename(socketPath)], path: path.dirname(socketPath), source: 'HF_EMBED_SERVER_URL' });

  // The launcher pins only when no explicit address is set and the IPC folder
  // is not a TCP address; the same conditions apply here.
  const overrideDbDir = nonEmpty(env.SYSTEM_SKILL_ADVISOR_DB_DIR);
  if (overrideDbDir && !serverUrl && !(ipcSocketDir ?? '').startsWith('tcp://')) {
    try {
      const bridge = requireCjs(IPC_BRIDGE_MODULE);
      const pinned = bridge.resolveIpcSocketDir(ADVISOR_SERVICE_NAME, { dbDir: canonicalizePath(overrideDbDir), env });
      if (typeof pinned === 'string' && !pinned.startsWith('tcp://')) {
        candidates.push({ files: [], path: path.resolve(pinned), source: 'SYSTEM_SKILL_ADVISOR_DB_DIR' });
      }
    } catch (error) {
      notes.push(`the model server folder a launcher pins to ${overrideDbDir} could not be derived: ${messageOf(error)}`);
    }
  }

  // Two sources can name one folder; the first keeps its source and gains the
  // later ones' file names, so a custom socket name is never dropped.
  const byPath = new Map();
  for (const candidate of candidates) {
    const kept = byPath.get(candidate.path);
    if (!kept) {
      byPath.set(candidate.path, { ...candidate, files: [...candidate.files] });
      continue;
    }
    for (const name of candidate.files) if (!kept.files.includes(name)) kept.files.push(name);
  }
  return { dirs: [...byPath.values()], notes };
}

/**
 * @param {string} id Check id.
 * @param {string} name What the check looks for.
 * @param {string} status One of FOUND, ABSENT, NOT_CHECKED.
 * @param {Array<Record<string, any>>} [items] What was found.
 * @param {string[]} [notes] Why a part could not run, or what was read.
 * @returns {Record<string, any>} Finding.
 */
function finding(id, name, status, items = [], notes = []) {
  return { id, items, name, notes, reportOnly: false, status };
}

/**
 * @param {Array<Record<string, any>>} items What was found.
 * @param {boolean} incomplete Whether any part of the check could not run.
 * @returns {string} The finding status: found wins, then not checked.
 */
function statusOf(items, incomplete) {
  if (items.length > 0) return FOUND;
  return incomplete ? NOT_CHECKED : ABSENT;
}

/**
 * Walks a build tree without following symlinks.
 *
 * @param {string} dir Root of the walk.
 * @param {(filePath: string) => void} onFile File sink.
 * @param {Set<string>} skipDirs Directories reported whole instead of file by file.
 * @returns {boolean} False when part of the tree could not be read.
 */
function walkFiles(dir, onFile, skipDirs) {
  let complete = true;
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (error) {
      if (current === dir && (error?.code === 'ENOENT' || error?.code === 'ENOTDIR')) return true;
      complete = false;
      continue;
    }
    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!skipDirs.has(entryPath)) stack.push(entryPath);
      } else if (entry.isFile()) {
        onFile(entryPath);
      }
    }
  }
  return complete;
}

/**
 * M1: compiled lane output in either build tree.
 *
 * @param {{ advisorRuntime: string, root: string, specKit: string }} checkout Checkout paths.
 * @returns {Record<string, any>} Finding.
 */
export function checkCompiledOutput(checkout) {
  const items = [];
  let incomplete = false;
  const skipDirs = new Set();

  for (const lanePath of COMPILED_LANE_PATHS) {
    const absolute = path.join(checkout[lanePath.base], ...lanePath.segments);
    try {
      const stat = lstatOrNull(absolute);
      if (!stat) continue;
      if (stat.isDirectory()) skipDirs.add(absolute);
      items.push({ detail: 'compiled lane output', path: absolute });
    } catch {
      incomplete = true;
    }
  }

  for (const scanRoot of COMPILED_SCAN_ROOTS) {
    const dir = path.join(checkout[scanRoot.base], ...scanRoot.segments);
    const complete = walkFiles(dir, (filePath) => {
      if (items.some((item) => item.path === filePath)) return;
      let text;
      try {
        text = fs.readFileSync(filePath, 'latin1');
      } catch {
        incomplete = true;
        return;
      }
      if (IDENTIFIER_REGEX.test(text)) {
        items.push({ detail: `compiled file names ${attributeTerms(text, 'identifier').join(', ')}`, path: filePath });
      }
    }, skipDirs);
    if (!complete) incomplete = true;
  }

  return finding('M1', 'compiled lane output', statusOf(items, incomplete), items);
}

/**
 * M2: installed model modules, which outlive the dependency until a reinstall.
 *
 * @param {{ advisorRuntime: string, root: string, specKit: string }} checkout Checkout paths.
 * @returns {Record<string, any>} Finding.
 */
export function checkModelModules(checkout) {
  const items = [];
  let incomplete = false;
  for (const modulePath of MODEL_MODULE_PATHS) {
    const absolute = path.join(checkout[modulePath.base], ...modulePath.segments);
    try {
      if (lstatOrNull(absolute)) items.push({ detail: 'installed model module', path: absolute });
    } catch {
      incomplete = true;
    }
  }
  return finding('M2', 'installed model modules', statusOf(items, incomplete), items);
}

/**
 * Looks for vector objects in one SQLite file: lane table and index names, the
 * embedding columns on skill_nodes, and the model name anywhere in its bytes,
 * which also covers rows a schema query cannot see.
 *
 * A read-only open of a database in WAL mode still writes its -wal and -shm
 * files beside it. A copy has no writer and no companions of its own, so it is
 * opened immutable, which reads the one file and writes nothing.
 *
 * @param {string} filePath SQLite file.
 * @param {{ DatabaseSync: any } | null} sqlite The loaded node:sqlite module.
 * @param {{ immutable?: boolean }} [options] Open a file no process writes without touching its folder.
 * @returns {{ complete: boolean, detail: string[] }} What it holds and whether every probe ran.
 */
export function inspectSqliteFile(filePath, sqlite, { immutable = false } = {}) {
  const detail = [];
  let complete = true;

  if (sqlite) {
    try {
      let target = filePath;
      if (immutable) {
        target = pathToFileURL(filePath);
        target.searchParams.set('immutable', '1');
      }
      const db = new sqlite.DatabaseSync(target, { readOnly: true });
      try {
        for (const row of db.prepare('SELECT type, name FROM sqlite_master WHERE name IS NOT NULL').all()) {
          if (DB_NAME_PATTERN.test(String(row.name))) detail.push(`${row.type} ${row.name}`);
        }
        for (const column of db.prepare("SELECT name FROM pragma_table_info('skill_nodes')").all()) {
          if (DB_COLUMN_PATTERN.test(String(column.name))) detail.push(`column skill_nodes.${column.name}`);
        }
      } finally {
        db.close();
      }
    } catch {
      complete = false;
    }
  } else {
    complete = false;
  }

  try {
    if (fs.readFileSync(filePath).includes(DB_BYTE_MARKER)) detail.push(`bytes name ${DB_BYTE_MARKER}`);
  } catch {
    complete = false;
  }

  return { complete, detail };
}

/**
 * M3: vector objects in the advisor databases, the backup and quarantine
 * copies that hold one or cannot be opened, and vector shards.
 *
 * @param {string} dbDir Advisor database directory.
 * @param {{ DatabaseSync: any } | null} sqlite The loaded node:sqlite module.
 * @returns {Record<string, any>} Finding.
 */
export function checkDatabases(dbDir, sqlite) {
  const items = [];
  const notes = [];
  let incomplete = false;

  let entries;
  try {
    entries = fs.readdirSync(dbDir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return finding('M3', 'advisor database vector objects and copies', ABSENT, [], [`${dbDir} does not exist`]);
    return finding('M3', 'advisor database vector objects and copies', NOT_CHECKED, [], [`${dbDir}: ${messageOf(error)}`]);
  }

  for (const entry of entries.sort((a, b) => compareCodeUnits(a.name, b.name))) {
    const absolute = path.join(dbDir, entry.name);
    if (DB_COPY_PATTERN.test(entry.name)) {
      // A rebuild after the removal copies a database with no lane object, and
      // that copy stays. A copy that holds one, or that cannot be opened to
      // tell, such as a quarantined corrupt file, goes.
      if (!entry.isFile()) {
        items.push({ detail: 'backup or quarantine copy of the advisor database', kind: 'copy', path: absolute });
        continue;
      }
      const inspected = inspectSqliteFile(absolute, sqlite, { immutable: true });
      if (inspected.detail.length > 0) {
        items.push({ detail: `copy of the advisor database holding ${inspected.detail.join(', ')}`, kind: 'copy', path: absolute });
      } else if (!inspected.complete) {
        items.push({ detail: 'copy of the advisor database that could not be opened to look for vector objects', kind: 'copy', path: absolute });
      }
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.sqlite')) continue;
    const inspected = inspectSqliteFile(absolute, sqlite);
    if (inspected.detail.length > 0) {
      items.push({
        detail: inspected.detail.join(', '),
        kind: entry.name === DB_FILENAME ? 'database' : 'other-database',
        path: absolute,
      });
    } else if (!inspected.complete) {
      incomplete = true;
      notes.push(`${absolute} could not be read`);
    }
  }

  const shardDir = path.join(dbDir, SHARD_DIR_NAME);
  try {
    for (const name of fs.readdirSync(shardDir).sort(compareCodeUnits)) {
      if (SHARD_PATTERN.test(name)) items.push({ detail: 'vector shard', kind: 'shard', path: path.join(shardDir, name) });
    }
  } catch (error) {
    if (error?.code !== 'ENOENT' && error?.code !== 'ENOTDIR') {
      incomplete = true;
      notes.push(`${shardDir}: ${messageOf(error)}`);
    }
  }

  return finding('M3', 'advisor database vector objects and copies', statusOf(items, incomplete), items, notes);
}

/**
 * @returns {Array<{ command: string, pid: number }> | null} Every other process, or null when ps cannot run.
 */
export function listProcesses() {
  const result = spawnSync('ps', ['-axo', 'pid=,command='], { encoding: 'utf8', maxBuffer: SPAWN_MAX_BUFFER });
  if (result.error || result.status !== 0) return null;
  const processes = [];
  for (const line of result.stdout.split('\n')) {
    const match = /^\s*(\d+)\s+(.*)$/.exec(line);
    if (!match) continue;
    const pid = Number(match[1]);
    if (pid === process.pid) continue;
    processes.push({ command: match[2].trim(), pid });
  }
  return processes;
}

/**
 * The supervisor started the server as `node <script>`, so the script is the
 * first argument after node's own leading options. A command line read any
 * other way names no script.
 *
 * @param {string} command Process command line.
 * @returns {string | null} The script node runs, or null when this is not node or no script can be read.
 */
export function nodeScriptOf(command) {
  const words = command.trim().split(/\s+/);
  if (path.basename(words[0] ?? '') !== 'node') return null;
  return words.slice(1).find((word) => !word.startsWith('-')) ?? null;
}

/**
 * Whether a process is any checkout's model server. A shell, pager or editor
 * whose command line merely names the script is not one, and neither is node
 * running another script that takes the server's path as an argument.
 *
 * @param {string} command Process command line.
 * @returns {boolean} Whether node runs a model server script as its first script argument.
 */
export function runsModelServer(command) {
  const script = nodeScriptOf(command);
  return script !== null && path.basename(script) === MODEL_SERVER_SCRIPT_NAME;
}

/**
 * Ownership: node runs this checkout's server script. The folders are compared
 * through their real paths, because the script itself is deleted by the update
 * while a server started before it keeps running from that path, and a server
 * may have been started through a linked folder. A relative script path names
 * no folder this process can resolve, so it is never owned. A server started
 * from another checkout belongs to that checkout's sessions.
 *
 * @param {string} command Process command line.
 * @param {string} modelServerScript This checkout's model server script.
 * @returns {boolean} Whether node is running this checkout's script.
 */
export function isOwnedModelServer(command, modelServerScript) {
  if (!runsModelServer(command)) return false;
  const script = nodeScriptOf(command);
  if (!path.isAbsolute(script)) return false;
  return realpathOrSelf(path.dirname(script)) === realpathOrSelf(path.dirname(modelServerScript));
}

/**
 * M4: a running model server, the fixed files it writes in every folder it
 * could have used, and the socket file an explicit address names. The
 * `--socket-dir` folder itself counts only while it is
 * empty or still holds one of those files; a folder left with only other
 * files is someone else's and is not residue.
 *
 * @param {Record<string, any>} ctx Machine context.
 * @param {Array<{ command: string, pid: number }> | null} processes Process list, or null when it could not be read.
 * @returns {Record<string, any>} Finding, with `processListRead` for apply mode.
 */
export function checkModelServer(ctx, processes) {
  const items = [];
  const notes = [];
  let incomplete = false;

  if (processes === null) {
    incomplete = true;
    notes.push('ps could not run, so the process list was not read');
  } else {
    for (const proc of processes.filter((candidate) => runsModelServer(candidate.command))) {
      items.push({
        command: proc.command,
        detail: 'model server process',
        kind: 'process',
        owned: isOwnedModelServer(proc.command, ctx.modelServerScript),
        pid: proc.pid,
      });
    }
  }

  for (const dir of ctx.modelServerDirs) {
    let serverFiles = 0;
    for (const name of new Set([...MODEL_SERVER_DIR_FILES, ...(dir.files ?? [])])) {
      const candidate = path.join(dir.path, name);
      try {
        if (!lstatOrNull(candidate)) continue;
        items.push({ detail: `model server file (${dir.source})`, dir: dir.path, kind: 'server-file', path: candidate });
        serverFiles += 1;
      } catch (error) {
        incomplete = true;
        notes.push(`${candidate}: ${messageOf(error)}`);
      }
    }
    if (dir.path !== ctx.socketDir) continue;
    try {
      const stat = lstatOrNull(dir.path);
      if (stat?.isDirectory() && (serverFiles > 0 || fs.readdirSync(dir.path).length === 0)) {
        items.push({ detail: 'model server socket directory', kind: 'socket-dir', path: dir.path });
      }
    } catch (error) {
      incomplete = true;
      notes.push(`${dir.path}: ${messageOf(error)}`);
    }
  }
  for (const note of ctx.modelServerDirNotes) {
    incomplete = true;
    notes.push(note);
  }

  return {
    ...finding('M4', 'model server process and socket directory', statusOf(items, incomplete), items, notes),
    processListRead: processes !== null,
  };
}

/**
 * A running `ollama serve` is reported and never stopped: the route never
 * recorded the pid it started, so the process cannot be attributed to it.
 *
 * @param {Array<{ command: string, pid: number }> | null} processes Process list.
 * @returns {Record<string, any>} Report-only finding.
 */
export function checkOllamaServe(processes) {
  if (processes === null) {
    return { ...finding('info', 'running ollama serve', NOT_CHECKED, [], ['ps could not run']), reportOnly: true };
  }
  const items = processes
    .filter((proc) => {
      const words = proc.command.split(/\s+/);
      return path.basename(words[0] ?? '') === 'ollama' && (words.includes('serve') || words.includes('runner'));
    })
    .map((proc) => ({ command: proc.command, detail: 'ollama server process', pid: proc.pid }));
  return { ...finding('info', 'running ollama serve', items.length > 0 ? FOUND : ABSENT, items), reportOnly: true };
}

/**
 * M5: the lane model's folder in the model cache inside each package that
 * installed the model library. This checkout owns these copies, so apply
 * deletes them without asking.
 *
 * @param {{ advisorRuntime: string, root: string, specKit: string }} checkout Checkout paths.
 * @returns {Record<string, any>} Finding.
 */
export function checkModelCache(checkout) {
  const items = [];
  const notes = [];
  let incomplete = false;
  for (const base of MODEL_CACHE_BASES) {
    const folder = path.join(checkout[base], ...MODEL_CACHE_SEGMENTS);
    try {
      if (lstatOrNull(folder)) items.push({ base, detail: 'lane model in the package model cache', path: folder });
    } catch (error) {
      incomplete = true;
      notes.push(`${folder}: ${messageOf(error)}`);
    }
  }
  return finding('M5', 'lane model in the package model cache', statusOf(items, incomplete), items, notes);
}

/**
 * @param {string} host Ollama origin.
 * @returns {Promise<{ models: Array<Record<string, any>>, ok: true } | { ok: false, reason: string }>} The tag list.
 */
async function fetchOllamaTags(host) {
  try {
    const response = await fetch(new URL('/api/tags', host), { signal: AbortSignal.timeout(OLLAMA_TAGS_TIMEOUT_MS) });
    if (!response.ok) return { ok: false, reason: `HTTP ${response.status}` };
    const body = await response.json();
    return { models: Array.isArray(body?.models) ? body.models : [], ok: true };
  } catch (error) {
    return { ok: false, reason: messageOf(error) };
  }
}

/**
 * M6: the pulled model, asked of the server first and read from the model
 * store's manifest when no server answers.
 *
 * @param {Record<string, string>} ctx Machine context.
 * @returns {Promise<Record<string, any>>} Finding.
 */
export async function checkOllamaModel(ctx) {
  const name = 'pulled Ollama model';
  const tags = await fetchOllamaTags(ctx.ollamaHost);
  if (tags.ok) {
    const pulled = tags.models.some((model) => model?.name === OLLAMA_MODEL || model?.model === OLLAMA_MODEL);
    const items = pulled ? [{ detail: `listed by ${ctx.ollamaHost}`, model: OLLAMA_MODEL, source: 'api' }] : [];
    return finding('M6', name, pulled ? FOUND : ABSENT, items, [`${ctx.ollamaHost}/api/tags answered`]);
  }

  const manifest = path.join(ctx.ollamaModelsDir, ...OLLAMA_MANIFEST_SEGMENTS);
  const notes = [`${ctx.ollamaHost} did not answer (${tags.reason}); read the model store instead`];
  try {
    const items = lstatOrNull(manifest) ? [{ detail: 'manifest in the model store', model: OLLAMA_MODEL, path: manifest, source: 'manifest' }] : [];
    return finding('M6', name, items.length > 0 ? FOUND : ABSENT, items, notes);
  } catch (error) {
    return finding('M6', name, NOT_CHECKED, [], [...notes, `${manifest}: ${messageOf(error)}`]);
  }
}

/**
 * The one question apply asks, worded once so a terminal run and a caller that
 * asks on the tool's behalf show the same words.
 *
 * @param {string} host Ollama origin.
 * @returns {string} The question.
 */
export function sharedModelQuestion(host) {
  return `Delete the Ollama model ${OLLAMA_MODEL} from ${host}? Nothing records who pulled it.`;
}

/**
 * The questions apply would ask on this machine: the shared model, only when a
 * running server lists it, because only then can apply act on an answer, and
 * never in a checkout that still holds a lane source, where apply changes
 * nothing.
 *
 * @param {Record<string, any>} ctx Machine context.
 * @param {Array<Record<string, any>>} findings Findings.
 * @returns {Array<{ check: string, question: string }>} Questions in the order apply asks them.
 */
function askFirstOf(ctx, findings) {
  if (ctx.laneSources.length > 0) return [];
  const model = findings.find((entry) => entry.id === 'M6')?.items[0];
  return model?.source === 'api' ? [{ check: 'M6', question: sharedModelQuestion(ctx.ollamaHost) }] : [];
}

/**
 * @param {string} key Dotenv key name.
 * @returns {boolean} Whether only the lane read it.
 */
export function isLaneEnvKey(key) {
  return LANE_ENV_KEYS.includes(key) || LANE_ENV_KEY_PREFIXES.some((prefix) => key.startsWith(prefix));
}

/**
 * M7: lane keys among the key names of the checkout's dotenv files. Values are
 * never read: the key list comes from the value-free dotenv CLI.
 *
 * @param {Record<string, string>} ctx Machine context.
 * @returns {Record<string, any>} Finding.
 */
export function checkDotenv(ctx) {
  const items = [];
  const notes = [];
  let incomplete = false;

  for (const name of DOTENV_FILES) {
    const absolute = path.join(ctx.root, name);
    try {
      if (!lstatOrNull(absolute)) continue;
    } catch (error) {
      incomplete = true;
      notes.push(`${absolute}: ${messageOf(error)}`);
      continue;
    }

    const run = spawnSync(process.execPath, [ENV_SECRET_CLI, 'keys', name], { cwd: ctx.root, encoding: 'utf8' });
    let result = null;
    try {
      result = JSON.parse(run.stdout);
    } catch {
      result = null;
    }
    if (run.error || !result?.ok || !Array.isArray(result.keys)) {
      incomplete = true;
      notes.push(`${absolute}: key names could not be listed (${result?.error ?? run.error?.message ?? (run.stderr.trim() || 'no output')})`);
      continue;
    }
    for (const key of result.keys.filter(isLaneEnvKey)) {
      items.push({ detail: 'lane key in a dotenv file', key, path: absolute });
    }
  }

  return finding('M7', 'lane keys in dotenv files', statusOf(items, incomplete), items, notes);
}

/**
 * M8: M1 to M3 for every other linked worktree. Each worktree has its own
 * build output and its own default database directory.
 *
 * @param {Record<string, string>} ctx Machine context.
 * @param {{ DatabaseSync: any } | null} sqlite The loaded node:sqlite module.
 * @returns {Record<string, any>} Finding.
 */
export function checkWorktrees(ctx, sqlite) {
  const name = 'linked worktrees (M1 to M3)';
  let result;
  try {
    result = runGit(ctx.root, ['worktree', 'list', '--porcelain']);
  } catch (error) {
    return finding('M8', name, NOT_CHECKED, [], [messageOf(error)]);
  }
  if (result.status !== 0) {
    return finding('M8', name, NOT_CHECKED, [], [`git worktree list failed: ${result.stderr.trim()}`]);
  }

  const items = [];
  const notes = [];
  let incomplete = false;
  const ownRoot = realpathOrSelf(ctx.root);
  const worktrees = result.stdout.split('\n').filter((line) => line.startsWith('worktree ')).map((line) => line.slice('worktree '.length));

  for (const worktree of worktrees) {
    if (realpathOrSelf(worktree) === ownRoot) continue;
    if (!fs.existsSync(worktree)) {
      notes.push(`${worktree} is listed but missing; skipped`);
      continue;
    }
    const checkout = checkoutPaths(worktree);
    const subFindings = [
      checkCompiledOutput(checkout),
      checkModelModules(checkout),
      checkDatabases(path.join(checkout.advisorRuntime, 'database'), sqlite),
    ];
    for (const sub of subFindings) {
      for (const item of sub.items) items.push({ ...item, check: sub.id, worktree });
      if (sub.status === NOT_CHECKED) {
        incomplete = true;
        notes.push(`${worktree}: ${sub.id} could not run (${sub.notes.join('; ')})`);
      }
    }
  }

  notes.unshift(`${worktrees.length} worktree(s) listed, this checkout excluded`);
  return finding('M8', name, statusOf(items, incomplete), items, notes);
}

/**
 * @returns {Promise<{ DatabaseSync: any } | null>} node:sqlite, or null when this Node lacks it.
 */
async function loadSqlite() {
  try {
    return await import('node:sqlite');
  } catch {
    return null;
  }
}

/**
 * @param {Array<Record<string, any>>} findings Findings.
 * @returns {number} 1 when anything was found, else 2 when a check could not run, else 0.
 */
export function machineExitCode(findings) {
  const gating = findings.filter((entry) => !entry.reportOnly);
  if (gating.some((entry) => entry.status === FOUND)) return EXIT_LIVE_HITS;
  if (gating.some((entry) => entry.status === NOT_CHECKED)) return EXIT_ERROR;
  return EXIT_CLEAN;
}

/**
 * Runs checks M1 to M8. Nothing is deleted or changed, and dotenv files are read
 * through the value-free CLI. Databases open read-only, but a read-only open of
 * a database in WAL mode may leave SQLite's -wal and -shm files beside it, here
 * and in each linked worktree M8 reads; only backup copies open immutable.
 *
 * @param {Record<string, any>} [options] CLI options.
 * @param {Record<string, string | undefined>} [env] Environment.
 * @param {{ processes?: Array<{ command: string, pid: number }> | null }} [io] A process list to use instead of reading ps; null means ps could not run.
 * @returns {Promise<Record<string, any>>} Report.
 */
export async function runMachineChecks(options = {}, env = process.env, io = {}) {
  const ctx = resolveMachineContext(options, env);
  const sqlite = await loadSqlite();
  const processes = io.processes !== undefined ? io.processes : listProcesses();
  const checkout = checkoutPaths(ctx.root);

  const findings = [
    checkCompiledOutput(checkout),
    checkModelModules(checkout),
    checkDatabases(ctx.dbDir, sqlite),
    checkModelServer(ctx, processes),
    checkModelCache(checkout),
    await checkOllamaModel(ctx),
    checkDotenv(ctx),
    checkWorktrees(ctx, sqlite),
    checkOllamaServe(processes),
  ];

  return {
    askFirst: askFirstOf(ctx, findings),
    context: ctx,
    exitCode: machineExitCode(findings),
    findings,
    mode: 'machine',
    schemaVersion: SCHEMA_VERSION,
  };
}

// ───────────────────────────────────────────────────────────────────
// 6. APPLY MODE
// ───────────────────────────────────────────────────────────────────

/**
 * Resolves a deletion target from a root and fixed names. The target is
 * refused when it is a symlink itself or when its real parent leaves the
 * root's real path, so a planted link can never redirect a delete.
 *
 * @param {string} rootDir Root the target must stay inside.
 * @param {string[]} segments Fixed path segments under the root.
 * @returns {{ status: 'absent' } | { reason: string, status: 'refused' } | { isDirectory: boolean, status: 'ok', target: string }} Resolution.
 */
export function resolveContainedTarget(rootDir, segments) {
  if (segments.length === 0 || segments.some((segment) => segment === '' || segment === '.' || segment === '..' || segment.includes('/'))) {
    return { reason: 'not a fixed name under its root', status: 'refused' };
  }

  const candidate = path.join(rootDir, ...segments);
  let stat;
  try {
    stat = lstatOrNull(candidate);
  } catch (error) {
    return { reason: messageOf(error), status: 'refused' };
  }
  if (!stat) return { status: 'absent' };
  if (stat.isSymbolicLink()) return { reason: 'is a symlink; a delete would act on whatever it points at', status: 'refused' };

  let rootReal;
  let parentReal;
  try {
    rootReal = fs.realpathSync(rootDir);
    parentReal = fs.realpathSync(path.dirname(candidate));
  } catch (error) {
    return { reason: messageOf(error), status: 'refused' };
  }
  const target = path.join(parentReal, path.basename(candidate));
  const relative = path.relative(rootReal, target);
  if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) {
    return { reason: `resolves outside ${rootReal}`, status: 'refused' };
  }
  return { isDirectory: stat.isDirectory(), status: 'ok', target };
}

/**
 * Deletes one contained target and records what happened. Never copies. A
 * directory is deleted, recursively, only when the caller says the fixed name
 * is a folder; anywhere else a directory under that name is not ours and stays.
 *
 * @param {string} rootDir Root the target must stay inside.
 * @param {string[]} segments Fixed path segments under the root.
 * @param {Array<Record<string, any>>} actions Action log.
 * @param {{ allowDirectory?: boolean }} [options] Whether the fixed name is a folder.
 * @returns {boolean} Whether the target is gone afterwards.
 */
function deleteContained(rootDir, segments, actions, { allowDirectory = false } = {}) {
  const resolved = resolveContainedTarget(rootDir, segments);
  const shown = path.join(rootDir, ...segments);
  if (resolved.status === 'absent') return true;
  if (resolved.status === 'refused') {
    actions.push({ action: 'refused', reason: resolved.reason, target: shown });
    return false;
  }
  if (resolved.isDirectory && !allowDirectory) {
    actions.push({ action: 'kept', reason: 'a directory where a file was expected', target: shown });
    return false;
  }
  try {
    fs.rmSync(resolved.target, { force: false, recursive: resolved.isDirectory });
    actions.push({ action: 'deleted', target: shown });
    return true;
  } catch (error) {
    actions.push({ action: 'failed', reason: messageOf(error), target: shown });
    return false;
  }
}

/**
 * @param {number} pid Process id.
 * @returns {boolean} Whether the process still exists.
 */
function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error?.code === 'EPERM';
  }
}

/**
 * @param {number} pid Process id.
 * @returns {Promise<boolean>} Whether the process exited after SIGTERM.
 */
async function stopProcess(pid) {
  try {
    process.kill(pid, 'SIGTERM');
  } catch (error) {
    return error?.code === 'ESRCH';
  }
  const deadline = Date.now() + PROCESS_STOP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (!isAlive(pid)) return true;
    await new Promise((resolve) => setTimeout(resolve, PROCESS_POLL_MS));
  }
  return !isAlive(pid);
}

/**
 * Removes a directory only when it is empty. A non-empty one is kept and
 * reported: it holds something this cleanup did not put there.
 *
 * @param {string} dir Directory to remove.
 * @param {Array<Record<string, any>>} actions Action log.
 * @returns {void}
 */
function removeEmptyDir(dir, actions) {
  let stat;
  try {
    stat = lstatOrNull(dir);
  } catch (error) {
    actions.push({ action: 'failed', reason: messageOf(error), target: dir });
    return;
  }
  if (!stat) return;
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    actions.push({ action: 'refused', reason: 'not a plain directory', target: dir });
    return;
  }
  try {
    fs.rmdirSync(dir);
    actions.push({ action: 'deleted', target: dir });
  } catch (error) {
    if (error?.code === 'ENOTEMPTY' || error?.code === 'EEXIST') {
      actions.push({ action: 'kept', reason: 'holds files the model server does not write', target: dir });
    } else {
      actions.push({ action: 'failed', reason: messageOf(error), target: dir });
    }
  }
}

/**
 * Asks one yes-or-no question on the terminal. Only an explicit yes counts.
 * Closing the input (Ctrl+D) counts as no: a pending question neither
 * resolves nor fails on its own then, so the close event settles it, and a
 * late rejection is swallowed so the action log still prints.
 *
 * @param {string} question Question text.
 * @param {NodeJS.ReadableStream} [input] Answer source.
 * @param {NodeJS.WritableStream} [output] Where the question is written.
 * @returns {Promise<boolean>} Whether the answer was yes.
 */
export async function confirmOnTerminal(question, input = process.stdin, output = process.stderr) {
  const prompt = readline.createInterface({ input, output });
  const closed = new Promise((resolve) => prompt.once('close', () => resolve(null)));
  try {
    const answer = await Promise.race([prompt.question(`${question} [y/N] `).catch(() => null), closed]);
    return typeof answer === 'string' && /^y(?:es)?$/i.test(answer.trim());
  } finally {
    prompt.close();
  }
}

/**
 * @param {string} host Ollama origin.
 * @returns {Promise<{ ok: boolean, reason?: string }>} Whether the server removed the model.
 */
async function deleteOllamaModel(host) {
  try {
    const response = await fetch(new URL('/api/delete', host), {
      body: JSON.stringify({ model: OLLAMA_MODEL }),
      headers: { 'content-type': 'application/json' },
      method: 'DELETE',
      signal: AbortSignal.timeout(OLLAMA_DELETE_TIMEOUT_MS),
    });
    return response.ok ? { ok: true } : { ok: false, reason: `HTTP ${response.status}` };
  } catch (error) {
    return { ok: false, reason: messageOf(error) };
  }
}

/**
 * Runs the machine checks, deletes the leftovers this checkout owns, asks
 * before touching the shared model, reports what only the user can remove,
 * then runs the checks again. Other worktrees are reported and nothing in them
 * is deleted, because each may belong to a live session; the checks' read-only
 * opens may still leave SQLite's -wal and -shm files beside their databases.
 * In a checkout that still holds a lane source nothing is deleted, stopped or
 * asked.
 *
 * @param {Record<string, any>} [options] CLI options; `sharedModel` is this run's answer about the shared model.
 * @param {Record<string, string | undefined>} [env] Environment.
 * @param {{ confirm?: (question: string) => Promise<boolean>, interactive?: boolean, processes?: Array<{ command: string, pid: number }> | null }} [io] Terminal access, defaulting to stdin, and an optional process list.
 * @returns {Promise<Record<string, any>>} Report with the before and after checks.
 * @throws {Error} When `sharedModel` is neither delete nor keep.
 */
export async function runApply(options = {}, env = process.env, io = {}) {
  const sharedModel = options.sharedModel;
  if (sharedModel !== undefined && !SHARED_MODEL_ANSWERS.includes(sharedModel)) {
    throw new Error(`--shared-model takes ${SHARED_MODEL_ANSWERS.join(' or ')}, not ${sharedModel}`);
  }
  const interactive = io.interactive ?? Boolean(process.stdin.isTTY);
  const confirm = io.confirm ?? confirmOnTerminal;
  const checkIo = { processes: io.processes };
  const ctx = resolveMachineContext(options, env);
  const before = await runMachineChecks(options, env, checkIo);
  const byId = new Map(before.findings.map((entry) => [entry.id, entry]));
  const actions = [];

  if (ctx.laneSources.length > 0) {
    keepForLaneSource(ctx, byId, actions);
  } else {
    await cleanOwnedLeftovers(ctx, byId, actions, { confirm, interactive, sharedModel });
  }
  reportUserLeftovers(byId, actions);

  const after = await runMachineChecks(options, env, checkIo);
  return {
    actions,
    after,
    askFirst: before.askFirst,
    before,
    exitCode: after.exitCode,
    interactive,
    mode: 'apply',
    schemaVersion: SCHEMA_VERSION,
  };
}

/**
 * Records every item apply would act on as kept, naming the lane source that
 * still uses it. Deleting any of it would break the code that still runs.
 *
 * @param {Record<string, any>} ctx Machine context.
 * @param {Map<string, Record<string, any>>} byId Findings by check id.
 * @param {Array<Record<string, any>>} actions Action log.
 * @returns {void}
 */
function keepForLaneSource(ctx, byId, actions) {
  const reason = `this checkout still holds the lane source ${ctx.laneSources.join(', ')}; update it, then run apply again`;
  for (const id of ['M1', 'M3', 'M4', 'M5']) {
    for (const item of byId.get(id).items) {
      actions.push({ action: 'kept', reason, target: item.kind === 'process' ? `pid ${item.pid}` : item.path });
    }
  }
  const model = byId.get('M6').items[0];
  if (model) actions.push({ action: 'kept', reason, target: model.path ?? `${OLLAMA_MODEL} on ${ctx.ollamaHost}` });
}

/**
 * Deletes what this checkout owns and acts on the shared model as this run's
 * answer says.
 *
 * @param {Record<string, any>} ctx Machine context.
 * @param {Map<string, Record<string, any>>} byId Findings by check id.
 * @param {Array<Record<string, any>>} actions Action log.
 * @param {{ confirm: (question: string) => Promise<boolean>, interactive: boolean, sharedModel?: string }} answer How the shared-model question is answered.
 * @returns {Promise<void>}
 */
async function cleanOwnedLeftovers(ctx, byId, actions, { confirm, interactive, sharedModel }) {
  // M1: the fixed compiled paths are deleted; any other compiled file that
  // still names the lane needs a rebuild after its source is removed.
  const fixedCompiled = new Set();
  for (const lanePath of COMPILED_LANE_PATHS) {
    fixedCompiled.add(path.join(ctx[lanePath.base], ...lanePath.segments));
    deleteContained(ctx[lanePath.base], [...lanePath.segments], actions, { allowDirectory: lanePath.directory });
  }
  for (const item of byId.get('M1').items.filter((entry) => !fixedCompiled.has(entry.path))) {
    actions.push({ action: 'reported', reason: 'rebuild the package once the lane source is gone', target: item.path });
  }

  // M3: the database is derived state, so it is discarded with its WAL,
  // shared-memory and rollback journal files and rebuilt by the next scan.
  for (const item of byId.get('M3').items) {
    const name = path.basename(item.path);
    if (item.kind === 'database') {
      for (const suffix of DB_COMPANION_SUFFIXES) deleteContained(ctx.dbDir, [`${DB_FILENAME}${suffix}`], actions);
    } else if (item.kind === 'copy') {
      deleteContained(ctx.dbDir, [name], actions);
    } else if (item.kind === 'shard') {
      deleteContained(ctx.dbDir, [SHARD_DIR_NAME, name], actions);
    } else {
      actions.push({ action: 'reported', reason: 'not a file name this cleanup owns', target: item.path });
    }
  }

  // M4: only node running this checkout's script is stopped. The server's
  // files go only once nothing is left that could be using them, and only by
  // the fixed names it writes: every folder involved can be pointed anywhere
  // or is shared, so only the `--socket-dir` folder is ever removed, and only
  // when that leaves it empty.
  const m4 = byId.get('M4');
  let keepReason = m4.processListRead ? null : 'the process list could not be read, so a model server may still use it';
  for (const server of m4.items.filter((item) => item.kind === 'process')) {
    if (!server.owned) {
      keepReason ??= 'a process this checkout did not start may still use them';
      actions.push({ action: 'reported', reason: 'not node running this checkout\'s model server script, so it is not signalled', target: `pid ${server.pid}` });
      continue;
    }
    if (await stopProcess(server.pid)) {
      actions.push({ action: 'stopped', target: `pid ${server.pid}` });
    } else {
      keepReason ??= 'a model server did not stop and may still use it';
      actions.push({ action: 'failed', reason: 'did not exit after SIGTERM', target: `pid ${server.pid}` });
    }
  }
  const serverFiles = m4.items.filter((item) => item.kind !== 'process');
  if (keepReason) {
    for (const item of serverFiles) actions.push({ action: 'kept', reason: keepReason, target: item.path });
  } else {
    // A linked directory would carry even a fixed-name delete somewhere else;
    // the model server refuses a linked socket directory for the same reason.
    const deleteServerFile = (dir, name, target) => {
      if (isSymlink(dir)) actions.push({ action: 'refused', reason: 'its directory is a symlink', target });
      else deleteContained(dir, [name], actions);
    };
    for (const item of serverFiles.filter((entry) => entry.kind === 'server-file')) {
      deleteServerFile(item.dir, path.basename(item.path), item.path);
    }
    if (serverFiles.some((entry) => entry.kind === 'socket-dir')) removeEmptyDir(ctx.socketDir, actions);
  }

  // M5: the package's own copy of the lane model, owned like the database.
  for (const item of byId.get('M5').items) {
    deleteContained(ctx[item.base], [...MODEL_CACHE_SEGMENTS], actions, { allowDirectory: true });
  }

  // M6: the shared model. This run's answer comes from --shared-model or the
  // terminal, and nothing is remembered for the next run.
  const model = byId.get('M6').items[0];
  if (model) {
    const target = `${OLLAMA_MODEL} on ${ctx.ollamaHost}`;
    if (model.source !== 'api') {
      actions.push({ action: 'reported', reason: `the server did not answer; start it and rerun, or run "ollama rm ${OLLAMA_MODEL}"`, target: model.path });
    } else if (sharedModel === 'keep') {
      actions.push({ action: 'kept', reason: 'answered keep for this run', target });
    } else if (sharedModel === 'delete' || (interactive && await confirm(sharedModelQuestion(ctx.ollamaHost)))) {
      const removed = await deleteOllamaModel(ctx.ollamaHost);
      actions.push(removed.ok ? { action: 'deleted', target } : { action: 'failed', reason: removed.reason, target });
    } else if (!interactive) {
      actions.push({ action: 'kept', reason: 'no terminal to ask and no --shared-model answer; nothing records who pulled this model', target });
    } else {
      actions.push({ action: 'kept', reason: 'answered no', target });
    }
  }
}

/**
 * Reports what only the user can remove: module folders a reinstall clears,
 * dotenv keys, other worktrees and a running Ollama server.
 *
 * @param {Map<string, Record<string, any>>} byId Findings by check id.
 * @param {Array<Record<string, any>>} actions Action log.
 * @returns {void}
 */
function reportUserLeftovers(byId, actions) {
  for (const item of byId.get('M2').items) {
    actions.push({ action: 'reported', reason: 'reinstall dependencies once the lockfile drops the dependency', target: item.path });
  }
  for (const item of byId.get('M7').items) {
    actions.push({ action: 'reported', reason: `remove ${item.key} by hand; values are never read here`, target: item.path });
  }
  for (const item of byId.get('M8').items) {
    actions.push({ action: 'reported', reason: `run apply inside ${item.worktree}`, target: item.path });
  }
  for (const item of byId.get('info').items) {
    actions.push({ action: 'reported', reason: 'the route never recorded the pid it started, so it is left running', target: `pid ${item.pid}` });
  }
}

// ───────────────────────────────────────────────────────────────────
// 7. OUTPUT
// ───────────────────────────────────────────────────────────────────

/** Index entries printed per output in the human summary; `--json` lists every one. */
const HUMAN_INDEX_ENTRY_LIMIT = 3;

/**
 * @param {Record<string, string>} entry Live index entry.
 * @returns {string} One-line rendering.
 */
function formatIndexEntry(entry) {
  if (entry.kind === 'phrase') return `phrase "${entry.phrase}"${entry.spelling ? ` (spelled "${entry.spelling}")` : ''} -> ${entry.path}`;
  if (entry.text) return `"${entry.text}" in the record of ${entry.path}`;
  return entry.path;
}

/**
 * @param {Record<string, any>} matched Matched groups.
 * @returns {string} One-line rendering.
 */
function formatMatched(matched) {
  const parts = [];
  if (matched.identifier) parts.push(`identifier: ${matched.identifier.join(', ')}`);
  if (matched.prose) parts.push(`prose: ${matched.prose.join(', ')}`);
  if (matched.path) parts.push(`path: ${matched.path.join(', ')}`);
  if (matched.symlink) parts.push(`symlink -> ${matched.symlink}`);
  if (matched.index) {
    const shown = matched.index.slice(0, HUMAN_INDEX_ENTRY_LIMIT).map(formatIndexEntry);
    const more = matched.index.length - shown.length;
    parts.push(`index: ${shown.join(', ')}${more > 0 ? `, ${more} more` : ''}`);
  }
  return parts.join('; ');
}

/**
 * @param {Record<string, any>} report Repo report.
 * @returns {string} Human-readable summary.
 */
export function formatRepoSummary(report) {
  const { counts, index } = report;
  const lines = [
    'mode        : repo',
    `root        : ${report.root}`,
    `allowlist   : ${report.allowlistPath} (${counts.allowlistRows} row(s), ${counts.allowlistRowsMatched} matched)`,
    `files       : ${counts.files} (identifier ${counts.identifier}, prose ${counts.prose}, path ${counts.path}, symlink ${counts.symlink})`,
    `index       : ${index.outputsRead.length} output(s) read by structure: ${index.lanePaths} lane path(s), ${index.lanePhrases} lane phrase(s), ${index.laneStrings} lane string(s), ${index.outside} outside specs/ and the allowlist`,
    `allowlisted : ${counts.allowlisted}`,
    `live        : ${counts.live}`,
  ];

  if (report.live.length > 0) {
    const shown = report.live.slice(0, HUMAN_LIST_LIMIT);
    lines.push('', `live files (${shown.length} of ${report.live.length}):`);
    for (const entry of shown) lines.push(`  ${entry.path}  [${formatMatched(entry.matched)}]`);
    if (report.live.length > shown.length) lines.push(`  ... ${report.live.length - shown.length} more; --json lists every file`);
  }
  if (index.outside > 0) {
    lines.push('', `An index entry is live when it points outside specs/ at a file with no allowlist row. Remove the lane words from that file, or regenerate the index if it was deleted: node ${index.generator}`);
  }
  if (report.unusedAllowlistRows.length > 0) {
    lines.push('', 'allowlist rows that matched nothing:');
    for (const rowPath of report.unusedAllowlistRows) lines.push(`  ${rowPath}`);
  }

  return `${lines.join('\n')}\n`;
}

/**
 * @param {Record<string, any>} item Finding item.
 * @returns {string} One-line rendering.
 */
function formatItem(item) {
  const where = item.worktree ? `[${item.check} in ${item.worktree}] ` : '';
  if (item.pid !== undefined) return `${where}pid ${item.pid}${item.owned === false ? ' (another checkout)' : ''}: ${item.command}`;
  if (item.key) return `${where}${item.path}: ${item.key}`;
  if (item.model && !item.path) return `${where}${item.model} (${item.detail})`;
  return `${where}${item.path ?? item.model}  (${item.detail})`;
}

/**
 * @param {Record<string, any>} report Machine report.
 * @returns {string[]} Human-readable lines.
 */
function machineLines(report) {
  const { context } = report;
  const lines = [
    `root        : ${context.root}`,
    `db dir      : ${context.dbDir}`,
    `ollama      : ${context.ollamaHost} (store ${context.ollamaModelsDir})`,
    `socket dir  : ${context.socketDir}`,
    ...context.modelServerDirs.filter((dir) => dir.path !== context.socketDir).map((dir) => `server dir  : ${dir.path} (${dir.source}; shared, fixed file names only)`),
    ...context.laneSources.map((source) => `lane source : ${source} (apply changes nothing while it exists)`),
    '',
  ];
  for (const entry of report.findings) {
    const label = entry.reportOnly ? `${entry.name} (report only)` : entry.name;
    lines.push(`${entry.id.padEnd(4)} ${label.padEnd(48)} ${entry.status}`);
    const shown = entry.items.slice(0, HUMAN_ITEM_LIMIT);
    for (const item of shown) lines.push(`       ${formatItem(item)}`);
    if (entry.items.length > shown.length) lines.push(`       ... ${entry.items.length - shown.length} more; --json lists every item`);
    for (const note of entry.notes) lines.push(`       note: ${note}`);
  }
  if (report.askFirst.length > 0) lines.push('', ...report.askFirst.map((entry) => `ask first   : ${entry.question}`));
  return lines;
}

/**
 * @param {number} code Exit code.
 * @returns {string} What the code means.
 */
function exitMeaning(code) {
  if (code === EXIT_LIVE_HITS) return 'remnants remain';
  if (code === EXIT_ERROR) return 'a check could not run';
  return 'nothing left';
}

/**
 * @param {Record<string, any>} report Machine report.
 * @returns {string} Human-readable summary.
 */
export function formatMachineSummary(report) {
  return `${['mode        : machine', ...machineLines(report), '', `result      : exit ${report.exitCode} (${exitMeaning(report.exitCode)})`].join('\n')}\n`;
}

/**
 * @param {Record<string, any>} report Apply report.
 * @returns {string} Human-readable summary.
 */
export function formatApplySummary(report) {
  const lines = [
    'mode        : apply',
    `terminal    : ${report.interactive ? 'yes' : 'no'} (a --shared-model answer, when given, replaces the question for this run; with neither, the shared model is kept)`,
    '',
    'actions:',
  ];
  if (report.actions.length === 0) lines.push('  none');
  for (const entry of report.actions) {
    lines.push(`  ${entry.action.padEnd(9)} ${entry.target}${entry.reason ? `  (${entry.reason})` : ''}`);
  }
  lines.push('', 'after cleanup:', ...machineLines(report.after), '', `result      : exit ${report.exitCode} (${exitMeaning(report.exitCode)})`);
  return `${lines.join('\n')}\n`;
}

// ───────────────────────────────────────────────────────────────────
// 8. CLI
// ───────────────────────────────────────────────────────────────────

/**
 * @param {string[]} argv Arguments after the script name.
 * @returns {Record<string, any>} Parsed options with `mode` set.
 * @throws {Error} On a missing or unknown mode, an unknown flag, a missing or unaccepted value or a flag the mode does not read.
 */
export function parseArgs(argv) {
  const args = { json: false, mode: undefined };
  const seenFlags = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') {
      args.json = true;
      continue;
    }
    if (Object.hasOwn(VALUE_FLAGS, arg)) {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('--')) throw new Error(`${arg} requires a value`);
      const accepted = VALUE_FLAGS[arg].values;
      if (accepted && !accepted.includes(value)) throw new Error(`${arg} takes ${accepted.join(' or ')}, not ${value}`);
      args[VALUE_FLAGS[arg].key] = value;
      seenFlags.push(arg);
      i += 1;
      continue;
    }
    if (arg.startsWith('-')) throw new Error(`unknown argument: ${arg}`);
    if (args.mode !== undefined) throw new Error(`unexpected argument: ${arg}`);
    if (!MODES.includes(arg)) throw new Error(`unknown mode: ${arg} (expected ${MODES.join(', ')})`);
    args.mode = arg;
  }

  if (args.mode === undefined) throw new Error(`a mode is required (${MODES.join(', ')})`);
  for (const flag of seenFlags) {
    if (!VALUE_FLAGS[flag].modes.includes(args.mode)) throw new Error(`${flag} does not apply to ${args.mode} mode`);
  }
  return args;
}

/**
 * @param {string[]} argv Arguments after the script name.
 * @returns {Promise<number>} Process exit code.
 */
export async function main(argv) {
  let args;
  try {
    args = parseArgs(argv);
  } catch (error) {
    process.stderr.write(`${messageOf(error)}\n${USAGE}\n`);
    return EXIT_ERROR;
  }

  try {
    if (args.mode === 'repo') {
      const report = scanRepo(args);
      process.stdout.write(args.json ? `${stableStringify(report)}\n` : formatRepoSummary(report));
      return report.counts.live > 0 ? EXIT_LIVE_HITS : EXIT_CLEAN;
    }
    if (args.mode === 'machine') {
      const report = await runMachineChecks(args);
      process.stdout.write(args.json ? `${stableStringify(report)}\n` : formatMachineSummary(report));
      return report.exitCode;
    }
    const report = await runApply(args);
    process.stdout.write(args.json ? `${stableStringify(report)}\n` : formatApplySummary(report));
    return report.exitCode;
  } catch (error) {
    process.stderr.write(`${messageOf(error)}\n`);
    return EXIT_ERROR;
  }
}

if (isMainModule(import.meta.url)) {
  main(process.argv.slice(2)).then(
    (code) => { process.exitCode = code; },
    (error) => {
      process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
      process.exitCode = EXIT_ERROR;
    },
  );
}
