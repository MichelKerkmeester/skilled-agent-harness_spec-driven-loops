#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

const SIMILARITY = 1;
const THRESHOLD = 1;

function usage() {
  return [
    'Usage: node scripts/migrations/collapse-duplicate-content-rows.mjs --db <sqlite-db> [--base <workspace>] [--apply --checkpoint-id <id>]',
    'Default is dry-run count-only. Apply mode requires a checkpoint id recorded before mutation.',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { apply: false, base: process.cwd(), checkpointId: null, db: null };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    else if (arg === '--db') args.db = argv[++i] ?? null;
    else if (arg === '--base') args.base = argv[++i] ?? args.base;
    else if (arg === '--checkpoint-id') args.checkpointId = argv[++i] ?? null;
    else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.db) throw new Error('Missing --db');
  if (args.apply && !args.checkpointId) throw new Error('Apply mode requires --checkpoint-id');
  return args;
}

function logicalKey(row) {
  const specFolder = String(row.spec_folder || '').replace(/^system-spec-kit\//, 'system-speckit/');
  const pathKey = String(row.canonical_file_path || row.file_path || '')
    .replaceAll(`${path.sep}system-spec-kit${path.sep}`, `${path.sep}system-speckit${path.sep}`)
    .replaceAll('/system-spec-kit/', '/system-speckit/');
  const anchor = row.anchor_id || '_';
  const scope = [row.tenant_id, row.user_id, row.agent_id, row.session_id].map((value) => value || '_').join('|');
  return `${specFolder}::${scope}::${pathKey}::${anchor}`;
}

function winnerScore(row, basePath) {
  const currentPrefix = typeof row.spec_folder === 'string' && row.spec_folder.startsWith('system-speckit/') ? 1 : 0;
  const candidatePath = row.canonical_file_path || row.file_path;
  let mtime = 0;
  if (candidatePath) {
    const resolved = path.resolve(basePath, candidatePath);
    const relative = path.relative(basePath, resolved);
    if ((relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) && fs.existsSync(resolved)) {
      mtime = fs.statSync(resolved).mtimeMs;
    }
  }
  return [currentPrefix, mtime, row.id];
}

function compareWinner(a, b, basePath) {
  const scoreA = winnerScore(a, basePath);
  const scoreB = winnerScore(b, basePath);
  for (let i = 0; i < scoreA.length; i++) {
    if (scoreA[i] !== scoreB[i]) return scoreB[i] - scoreA[i];
  }
  return 0;
}

const args = parseArgs(process.argv);
const db = new Database(args.db);
try {
  const basePath = path.resolve(args.base);
  const rows = db.prepare(`
    SELECT id, spec_folder, file_path, canonical_file_path, anchor_id, content_hash,
           tenant_id, user_id, agent_id, session_id
    FROM memory_index
    WHERE COALESCE(importance_tier, '') != 'deprecated'
      AND content_hash IS NOT NULL
      AND content_hash != ''
  `).all();
  const groups = new Map();
  for (const row of rows) {
    const key = logicalKey(row);
    const group = groups.get(key) || [];
    group.push(row);
    groups.set(key, group);
  }
  const duplicateGroups = [...groups.values()].filter((group) => group.length > 1);
  const losers = [];
  let crossPrefixGroups = 0;
  for (const group of duplicateGroups) {
    const sorted = [...group].sort((a, b) => compareWinner(a, b, basePath));
    const winner = sorted[0];
    const prefixes = new Set(group.map((row) => String(row.spec_folder).split('/')[0]));
    if (prefixes.size > 1) crossPrefixGroups++;
    for (const loser of sorted.slice(1)) {
      losers.push({ id: loser.id, winnerId: winner.id, hint: JSON.stringify({ id: winner.id, similarity: SIMILARITY, threshold: THRESHOLD }) });
    }
  }
  const result = {
    script: 'collapse-duplicate-content-rows',
    mode: args.apply ? 'apply' : 'dry-run',
    scanned: rows.length,
    duplicateGroups: duplicateGroups.length,
    crossPrefixGroups,
    losers: losers.length,
    checkpointId: args.checkpointId,
    deprecated: 0,
  };
  if (args.apply) {
    const tx = db.transaction((items) => {
      const stmt = db.prepare(`
        UPDATE memory_index
        SET importance_tier = 'deprecated', near_duplicate_of = ?, updated_at = datetime('now')
        WHERE id = ?
      `);
      let deprecated = 0;
      for (const item of items) deprecated += stmt.run(item.hint, item.id).changes;
      return deprecated;
    });
    result.deprecated = tx(losers);
  }
  console.log(JSON.stringify(result, null, 2));
} finally {
  db.close();
}
