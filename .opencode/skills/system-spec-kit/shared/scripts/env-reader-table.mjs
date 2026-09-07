#!/usr/bin/env node
// Derives the README's configuration table from the code: every process.env
// read under shared/ (tests and dist excluded), grouped by the row it belongs
// to, with the reader files listed per variable. `--check` compares the table
// the README carries against the derived one and exits 1 on any drift, so the
// README can claim the table is generated and a test can hold it to that.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SHARED_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const README = join(SHARED_ROOT, 'README.md');
const TABLE_HEADER = '| Group | Variable | Read by |';

// Editorial grouping only; readers come from the scan.
const GROUPS = [
  ['Provider selection', ['EMBEDDINGS_PROVIDER', 'EMBEDDING_DIM']],
  ['Ollama', ['OLLAMA_EMBEDDINGS_MODEL', 'OLLAMA_BASE_URL', 'OLLAMA_REQUEST_TIMEOUT_MS']],
  ['Local HF model server', ['HF_EMBEDDINGS_MODEL', 'HF_EMBEDDINGS_DTYPE', 'HF_EMBED_AUTH_TOKEN', 'HF_EMBED_SERVER_READY_TIMEOUT_MS', 'SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS', 'SPECKIT_HF_READY_LATCH_TTL_MS', 'HF_EMBEDDINGS_PREFIX_QUERY', 'HF_EMBEDDINGS_PREFIX_DOCUMENT']],
  ['OpenAI', ['OPENAI_API_KEY', 'OPENAI_EMBEDDINGS_MODEL', 'OPENAI_BASE_URL']],
  ['Voyage', ['VOYAGE_API_KEY', 'VOYAGE_EMBEDDINGS_MODEL', 'VOYAGE_BASE_URL']],
  ['Cascade probes', ['SPECKIT_CASCADE_PROBE_TIMEOUT_MS', 'SPECKIT_CASCADE_LOCK_STALE_MS', 'SPECKIT_CASCADE_SLEEP_MS']],
  ['Database directory', ['SPEC_KIT_DB_DIR', 'SPECKIT_DB_DIR', 'MEMORY_DB_PATH']],
  ['IPC', ['SPECKIT_IPC_SOCKET_DIR', 'SPECKIT_MAX_SECONDARY_CLIENTS']],
  ['Rank fusion', ['SPECKIT_RRF', 'SPECKIT_RRF_K', 'SPECKIT_SCORE_NORMALIZATION', 'SPECKIT_CALIBRATED_OVERLAP_BONUS', 'SPECKIT_RETRIEVAL_PROFILE_WEIGHTS']],
];

function sourceFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'dist' || entry === 'node_modules' || entry === 'scripts') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.(ts|mjs|cjs)$/u.test(entry) && !/\.test\./u.test(entry) && !entry.endsWith('.d.ts')) out.push(full);
  }
  return out;
}

export function scanEnvReaders(root = SHARED_ROOT) {
  const readers = new Map();
  const pattern = /(?:process\.env|\benv)(?:\.([A-Z][A-Z0-9_]+)|\[\s*['"]([A-Z][A-Z0-9_]+)['"]\s*\])/gu;
  for (const file of sourceFiles(root)) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(pattern)) {
      const name = match[1] ?? match[2];
      if (!readers.has(name)) readers.set(name, new Set());
      readers.get(name).add(relative(root, file));
    }
  }
  return readers;
}

export function renderTable(readers) {
  const lines = [TABLE_HEADER, '| --- | --- | --- |'];
  const grouped = new Set();
  for (const [group, names] of GROUPS) {
    for (const name of names) {
      grouped.add(name);
      const files = [...(readers.get(name) ?? [])].sort();
      if (files.length === 0) continue;
      lines.push(`| ${group} | \`${name}\` | ${files.map((f) => `\`${f}\``).join(', ')} |`);
    }
  }
  const rest = [...readers.keys()].filter((name) => !grouped.has(name)).sort();
  for (const name of rest) {
    const files = [...readers.get(name)].sort();
    lines.push(`| Other | \`${name}\` | ${files.map((f) => `\`${f}\``).join(', ')} |`);
  }
  return lines.join('\n');
}

export function extractReadmeTable(readme) {
  const start = readme.indexOf(TABLE_HEADER);
  if (start < 0) return null;
  const end = readme.indexOf('\n\n', start);
  return readme.slice(start, end < 0 ? undefined : end);
}

export function checkReadme(readme = readFileSync(README, 'utf8'), readers = scanEnvReaders()) {
  const expected = renderTable(readers);
  const actual = extractReadmeTable(readme);
  return { ok: actual === expected, expected, actual };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const mode = process.argv[2] ?? '--print';
  const readers = scanEnvReaders();
  if (mode === '--check') {
    const result = checkReadme(readFileSync(README, 'utf8'), readers);
    if (!result.ok) {
      console.error('README configuration table drifted from the code. Expected:\n' + result.expected);
      process.exit(1);
    }
    console.log('README configuration table matches the code.');
  } else if (mode === '--write') {
    const readme = readFileSync(README, 'utf8');
    const current = extractReadmeTable(readme);
    if (current === null) throw new Error('README has no configuration table to replace');
    writeFileSync(README, readme.replace(current, renderTable(readers)));
    console.log('README configuration table rewritten.');
  } else {
    console.log(renderTable(readers));
  }
}
