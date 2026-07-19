#!/usr/bin/env node
import Database from 'better-sqlite3';

const MIGRATION_VERSION = 'retrofix-frontmatter-only-tiers-v1';
const VALID_TIERS = new Set(['constitutional', 'critical', 'important', 'normal', 'temporary', 'archived', 'deprecated']);
const DEFAULT_TIER_BY_DOCUMENT_TYPE = new Map([
  ['spec', 'important'],
  ['plan', 'important'],
  ['decision_record', 'important'],
  ['decision-record', 'important'],
  ['constitutional', 'constitutional'],
  ['tasks', 'normal'],
  ['implementation_summary', 'normal'],
  ['implementation-summary', 'normal'],
  ['handover', 'normal'],
  ['memory', 'normal'],
]);

function usage() {
  return [
    'Usage: node scripts/migrations/retrofix-frontmatter-only-tiers.mjs --db <sqlite-db> [--apply|--rollback --baseline-count <n> --checkpoint-name <name>]',
    'Default is dry-run count-only. Apply recomputes critical/important rows from frontmatter; rollback restores prior tiers from audit rows.',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { apply: false, rollback: false, baselineCount: null, checkpointName: null, db: null };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    else if (arg === '--rollback') args.rollback = true;
    else if (arg === '--db') args.db = argv[++i] ?? null;
    else if (arg === '--baseline-count') args.baselineCount = Number.parseInt(argv[++i] ?? '', 10);
    else if (arg === '--checkpoint-name') args.checkpointName = argv[++i] ?? null;
    else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.db) throw new Error('Missing --db');
  if (args.apply && args.rollback) throw new Error('Choose only one of --apply or --rollback');
  if ((args.apply || args.rollback) && (!Number.isInteger(args.baselineCount) || args.baselineCount < 0)) {
    throw new Error('Apply and rollback modes require --baseline-count <n>');
  }
  if ((args.apply || args.rollback) && (!args.checkpointName || args.checkpointName.trim().length === 0)) {
    throw new Error('Apply and rollback modes require --checkpoint-name <name>');
  }
  return args;
}

function normalizeTier(value) {
  if (typeof value !== 'string') return null;
  const tier = value.trim().toLowerCase();
  return VALID_TIERS.has(tier) ? tier : null;
}

function defaultTierForDocumentType(documentType) {
  if (typeof documentType !== 'string') return 'normal';
  const normalized = documentType.trim().toLowerCase().replace(/[\s_]+/g, '_');
  return DEFAULT_TIER_BY_DOCUMENT_TYPE.get(normalized) ?? 'normal';
}

function stripHtmlComments(content) {
  return content.replace(/<!--[\s\S]*?-->/g, '');
}

function splitFrontmatter(content) {
  const cleaned = stripHtmlComments(content ?? '');
  if (!cleaned.startsWith('---')) {
    return { frontmatter: '', body: cleaned };
  }
  const end = cleaned.indexOf('\n---', 3);
  if (end < 0) {
    return { frontmatter: '', body: cleaned };
  }
  return {
    frontmatter: cleaned.slice(3, end),
    body: cleaned.slice(end + 4),
  };
}

function frontmatterTier(content) {
  const { frontmatter } = splitFrontmatter(content);
  const yamlMatch = frontmatter.match(/(?:importance_tier|importanceTier):\s*["']?(\w+)["']?/i);
  if (yamlMatch) return normalizeTier(yamlMatch[1]);
  if (frontmatter.includes('[CRITICAL]') || /importance:\s*critical/i.test(frontmatter)) return 'critical';
  if (frontmatter.includes('[IMPORTANT]') || /importance:\s*important/i.test(frontmatter)) return 'important';
  return null;
}

function hasBodyTierMarker(content) {
  const { body } = splitFrontmatter(content);
  return body.includes('[CRITICAL]') || body.includes('[IMPORTANT]');
}

function ensureAuditTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_tier_migration_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      prior_tier TEXT,
      new_tier TEXT NOT NULL,
      reason TEXT NOT NULL,
      migration_version TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(memory_id, migration_version)
    )
  `);
}

function loadRows(db) {
  return db.prepare(`
    SELECT id, importance_tier, document_type, content_text
    FROM memory_index
    WHERE lower(coalesce(importance_tier, '')) IN ('critical', 'important')
      AND (
        instr(coalesce(content_text, ''), '[CRITICAL]') > 0
        OR instr(coalesce(content_text, ''), '[IMPORTANT]') > 0
      )
  `).all();
}

function eligibleRows(db) {
  return loadRows(db)
    .map((row) => {
      const currentTier = normalizeTier(row.importance_tier);
      const declaredTier = frontmatterTier(row.content_text ?? '');
      const newTier = declaredTier ?? defaultTierForDocumentType(row.document_type);
      return { ...row, currentTier, declaredTier, newTier };
    })
    .filter((row) => row.currentTier && row.currentTier !== row.declaredTier && row.currentTier !== row.newTier && hasBodyTierMarker(row.content_text ?? ''));
}

function countRollbackRows(db) {
  const row = db.prepare(`
    SELECT COUNT(*) AS auditRows
    FROM memory_tier_migration_audit
    WHERE migration_version = ?
  `).get(MIGRATION_VERSION);
  return row?.auditRows ?? 0;
}

const args = parseArgs(process.argv);
const db = new Database(args.db);
try {
  const rows = eligibleRows(db);
  const result = {
    script: 'retrofix-frontmatter-only-tiers',
    mode: args.rollback ? 'rollback' : (args.apply ? 'apply' : 'dry-run'),
    migrationVersion: MIGRATION_VERSION,
    checkpointName: args.checkpointName,
    candidateRows: loadRows(db).length,
    eligibleRows: rows.length,
    criticalRows: rows.filter((row) => row.currentTier === 'critical').length,
    importantRows: rows.filter((row) => row.currentTier === 'important').length,
    audited: 0,
    updated: 0,
    restored: 0,
  };

  if (args.rollback) {
    ensureAuditTable(db);
    const auditRows = countRollbackRows(db);
    result.rollbackAuditRows = auditRows;
    if (auditRows !== args.baselineCount) {
      throw new Error(`Refusing rollback: auditRows ${auditRows} does not match baseline ${args.baselineCount}`);
    }
    const restore = db.transaction(() => db.prepare(`
      UPDATE memory_index
      SET importance_tier = COALESCE((
            SELECT prior_tier
            FROM memory_tier_migration_audit audit
            WHERE audit.memory_id = memory_index.id
              AND audit.migration_version = ?
          ), 'normal'),
          updated_at = datetime('now')
      WHERE id IN (
        SELECT memory_id
        FROM memory_tier_migration_audit
        WHERE migration_version = ?
      )
    `).run(MIGRATION_VERSION, MIGRATION_VERSION).changes);
    result.restored = restore();
  } else if (args.apply) {
    if (rows.length !== args.baselineCount) {
      throw new Error(`Refusing apply: eligibleRows ${rows.length} does not match baseline ${args.baselineCount}`);
    }
    ensureAuditTable(db);
    const auditStmt = db.prepare(`
      INSERT OR IGNORE INTO memory_tier_migration_audit (memory_id, prior_tier, new_tier, reason, migration_version)
      VALUES (?, ?, ?, ?, ?)
    `);
    const updateStmt = db.prepare(`
      UPDATE memory_index
      SET importance_tier = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    const apply = db.transaction(() => {
      let audited = 0;
      let updated = 0;
      for (const row of rows) {
        audited += auditStmt.run(
          row.id,
          row.currentTier,
          row.newTier,
          `frontmatter-only tier recompute; checkpoint=${args.checkpointName}`,
          MIGRATION_VERSION,
        ).changes;
        updated += updateStmt.run(row.newTier, row.id).changes;
      }
      return { audited, updated };
    });
    const applied = apply();
    result.audited = applied.audited;
    result.updated = applied.updated;
  }

  console.log(JSON.stringify(result, null, 2));
} finally {
  db.close();
}
