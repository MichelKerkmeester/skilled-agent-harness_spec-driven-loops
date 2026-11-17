// ───────────────────────────────────────────────────────────────
// Scratch only: enrich command embedding text and re-embed a DB copy.
// Writes only under the lineage scratch folder. Reads tracked files.
// ───────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

function findRepoRoot(start) {
  let current = resolve(start);
  for (let depth = 0; depth < 20; depth += 1) {
    if (existsSync(join(current, '.skilled')) && existsSync(join(current, 'AGENTS.md'))) return current;
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  throw new Error('repo root not found');
}

const REPO = findRepoRoot(HERE);
const requireFromRuntime = createRequire(join(REPO, '.skilled/skills/system-skill-advisor/runtime/package.json'));
const Database = requireFromRuntime('better-sqlite3');

const BRIDGES = join(REPO, '.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json');
const META_DIR = join(HERE, 'metadata');
const DB_SOURCE = join(HERE, 'db-before', 'skill-graph.sqlite');
const DB_AFTER_DIR = join(HERE, 'db-after');
const DB_AFTER = join(DB_AFTER_DIR, 'skill-graph.sqlite');
const EMBED_URL = 'http://127.0.0.1:11434/api/embed';
const EMBED_MODEL = 'nomic-embed-text:v1.5';
const MODEL_ID = 'nomic-embed-text-v1.5';
const DOC_PREFIX = 'search_document: ';

const SIGNALS = {
  '/doctor:install': [
    'walk me through putting this toolkit into my own project repository',
    'put this toolkit into my own project repository',
    'use this toolkit in my own project',
    'install this toolkit into another repository',
    'onboard this project repository',
  ],
  '/doctor:setup': [
    'list every check this project has',
    'tell me what to fix where it fails',
    'which checks fail and what to fix',
    'run every check in this project',
    'show me every check and the fix',
  ],
  '/doctor:speckit': [
    'spec search never finds anything',
    'search does not find terms we know are indexed',
    'spec search is broken even for indexed terms',
    'our spec lookup finds nothing',
    'indexed terms are not found by spec search',
  ],
  '/doctor:update': [
    'is there a newer release of the toolkit',
    'what changed in the newer release',
    'are we on the latest release and what changed',
    'check whether a newer version exists and what changed',
  ],
  '/speckit:search': [
    'look through our spec notes for anything mentioning',
    'search our spec notes for a topic',
    'find spec notes that mention a term',
    'which spec notes mention rate limiting',
  ],
  '/create:skill-parent': [
    'hub skill that holds several nested workflow variants',
    'nested workflow variants under one identity',
    'a skill hub with nested mode packets',
    'one identity for several workflow variants',
  ],
};

const clean = (part) => part
  .replace(/\/?[a-z-]+:[a-z-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/[.\s]+$/, '');

function compose(base, added) {
  const cleaned = added.map(clean).filter(Boolean);
  return [base.replace(/[.\s]+$/, ''), ...cleaned].join('. ');
}

async function embed(text) {
  const response = await fetch(EMBED_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model: EMBED_MODEL, input: [`${DOC_PREFIX}${text}`] }),
  });
  if (!response.ok) throw new Error(`embed failed HTTP ${response.status}`);
  const payload = await response.json();
  const vector = payload?.embeddings?.[0];
  if (!Array.isArray(vector) || vector.length !== 768) throw new Error('embedding shape wrong');
  return vector;
}

function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    na += a[index] * a[index];
    nb += b[index] * b[index];
  }
  return dot / Math.sqrt(na * nb);
}

mkdirSync(META_DIR, { recursive: true });
mkdirSync(DB_AFTER_DIR, { recursive: true });

const bridges = JSON.parse(readFileSync(BRIDGES, 'utf8'));
const entries = new Map(bridges.entries.map((entry) => [entry.command, entry]));
const enriched = {};

for (const [command, added] of Object.entries(SIGNALS)) {
  const entry = entries.get(command);
  if (!entry) throw new Error(`bridge entry missing for ${command}`);
  // A command with no TypeScript bridge has no embeddingText in the projection
  // (nothing embeds it today); its intended text is the description plus the
  // authored signals, the same parts the deriver composes for an active row.
  const before = typeof entry.embeddingText === 'string' && entry.embeddingText.trim()
    ? entry.embeddingText
    : [entry.description, ...(entry.ownedSignals ?? [])].filter((part) => typeof part === 'string' && part.trim()).join('. ');
  enriched[command] = {
    source: entry.source,
    typescriptEnabled: entry.runtime?.typescript?.enabled === true,
    typescriptId: entry.runtime?.typescript?.id ?? null,
    added,
    before,
    after: compose(before, added),
  };
}

// Scratch copies of the two JSON metadata files the lane names. The four doctor
// commands are declared in _routes.yaml rather than command-metadata.json, so their
// scratch copy is a command-metadata-shaped sidecar that keeps the same fields.
const skDocPath = join(REPO, '.skilled/skills/sk-doc/command-metadata.json');
const skDoc = JSON.parse(readFileSync(skDocPath, 'utf8'));
for (const entry of skDoc) {
  if (entry.command === '/create:skill-parent') {
    entry.userIntent.ownedSignals = [...entry.userIntent.ownedSignals, ...SIGNALS[entry.command]];
  }
}
writeFileSync(join(META_DIR, 'sk-doc.command-metadata.json'), `${JSON.stringify(skDoc, null, 2)}\n`);

const specKitPath = join(REPO, '.skilled/skills/system-spec-kit/command-metadata.json');
const specKit = JSON.parse(readFileSync(specKitPath, 'utf8'));
for (const entry of specKit) {
  if (entry.command === '/speckit:search') {
    entry.userIntent.ownedSignals = [...entry.userIntent.ownedSignals, ...SIGNALS[entry.command]];
  }
}
writeFileSync(join(META_DIR, 'system-spec-kit.command-metadata.json'), `${JSON.stringify(specKit, null, 2)}\n`);

const doctorSidecar = {
  note: 'Scratch command-metadata-shaped copy. The tracked source is .skilled/commands/doctor/_routes.yaml, which has no command-metadata.json.',
  source: '.skilled/commands/doctor/_routes.yaml',
  commands: Object.fromEntries(Object.entries(SIGNALS)
    .filter(([command]) => command.startsWith('/doctor:'))
    .map(([command, added]) => [command, {
      command,
      source: '.skilled/commands/doctor/_routes.yaml',
      added_intent_signals: added,
      composed_embedding_text: enriched[command].after,
    }])),
};
writeFileSync(join(META_DIR, 'doctor-command-metadata.json'), `${JSON.stringify(doctorSidecar, null, 2)}\n`);
writeFileSync(join(META_DIR, 'enriched-embedding-text.json'), `${JSON.stringify(enriched, null, 2)}\n`);

// A byte copy of the .backup snapshot is safe: it has no WAL sidecar.
copyFileSync(DB_SOURCE, DB_AFTER);
const database = new Database(DB_AFTER);

const embedReport = {};
for (const [command, record] of Object.entries(enriched)) {
  const typescriptId = record.typescriptId;
  const existing = typescriptId
    ? database.prepare('SELECT command_id, length(embedding) AS bytes FROM vec_cmd_768 WHERE command_id = ?').get(typescriptId)
    : undefined;
  if (!existing) {
    embedReport[command] = { commandId: typescriptId, skipped: 'no command vector row (no TypeScript bridge or no stored row)' };
    continue;
  }
  if (command === '/doctor:install') {
    const storedRow = database.prepare('SELECT embedding FROM vec_cmd_768 WHERE command_id = ?').get(typescriptId);
    const stored = new Float32Array(storedRow.embedding.buffer.slice(storedRow.embedding.byteOffset, storedRow.embedding.byteOffset + storedRow.embedding.byteLength));
    const reproduced = await embed(record.before);
    embedReport.embedderParity = {
      command,
      cosineAgainstStoredVector: Number(cosine(stored, reproduced).toFixed(6)),
      prefix: DOC_PREFIX,
      model: EMBED_MODEL,
    };
  }
  const vector = await embed(record.after);
  const hash = createHash('sha256').update(record.after).digest('hex');
  database.prepare(`
    INSERT INTO vec_cmd_768 (command_id, embedding, model_id, content_hash, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT(command_id) DO UPDATE SET
      embedding = excluded.embedding,
      model_id = excluded.model_id,
      content_hash = excluded.content_hash,
      updated_at = datetime('now')
  `).run(typescriptId, Buffer.from(new Float32Array(vector).buffer), MODEL_ID, hash);
  const check = database.prepare('SELECT length(embedding) AS bytes, model_id, content_hash FROM vec_cmd_768 WHERE command_id = ?').get(typescriptId);
  embedReport[command] = {
    commandId: typescriptId,
    bytes: check.bytes,
    modelId: check.model_id,
    contentHashMatches: check.content_hash === hash,
  };
}

database.close();
writeFileSync(join(META_DIR, 'reembed-report.json'), `${JSON.stringify(embedReport, null, 2)}\n`);
console.log(JSON.stringify({ enrichedTexts: Object.keys(enriched).length, embedReport }, null, 2));
