// ───────────────────────────────────────────────────────────────
// MODULE: DB Shard Migration
// ───────────────────────────────────────────────────────────────

import * as fs from 'fs';
import * as path from 'path';

import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';

import type { EmbeddingProfile } from '@spec-kit/shared/embeddings/profile';

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────

const SHARD_EXACT_TABLES = new Set(['vec_memories', 'embedding_cache']);
const CANONICAL_SKIP_PREFIXES = ['vec_memories'];

// ───────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────

function quoteSqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function quoteIdent(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function listUserTables(db: Database.Database, schema = 'main'): string[] {
  const tableRows = db.prepare(`
    SELECT name
    FROM ${quoteIdent(schema)}.sqlite_master
    WHERE type IN ('table', 'view')
      AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all() as Array<{ name: string }>;
  return tableRows.map((row) => row.name);
}

function isShardTable(tableName: string): boolean {
  return SHARD_EXACT_TABLES.has(tableName)
    || tableName.startsWith('vec_')
    || CANONICAL_SKIP_PREFIXES.some((prefix) => tableName.startsWith(`${prefix}_`));
}

function copyTable(db: Database.Database, fromSchema: string, toSchema: string, tableName: string): void {
  const source = `${quoteIdent(fromSchema)}.${quoteIdent(tableName)}`;
  const target = `${quoteIdent(toSchema)}.${quoteIdent(tableName)}`;
  db.exec(`DROP TABLE IF EXISTS ${target}`);
  db.exec(`CREATE TABLE ${target} AS SELECT * FROM ${source}`);
}

function getTableColumns(db: Database.Database, schema: string, tableName: string): Set<string> {
  const columns = db.prepare(`PRAGMA ${quoteIdent(schema)}.table_info(${quoteIdent(tableName)})`).all() as Array<{ name: string }>;
  return new Set(columns.map((column) => column.name));
}

function copyShardPayloadTable(
  db: Database.Database,
  tableName: string,
  profile: EmbeddingProfile,
): void {
  if (tableName.startsWith('vec_memories_')) {
    return;
  }
  if (tableName === 'vec_memories') {
    db.exec('DROP TABLE IF EXISTS shard.vec_memories');
    db.exec(`
      CREATE VIRTUAL TABLE shard.vec_memories USING vec0(
        embedding FLOAT[${profile.dim}]
      )
    `);
    const rows = db.prepare('SELECT rowid, embedding FROM legacy.vec_memories').all() as Array<{ rowid: number; embedding: Buffer }>;
    const insert = db.prepare('INSERT INTO shard.vec_memories(rowid, embedding) VALUES (?, ?)');
    for (const row of rows) {
      insert.run(BigInt(row.rowid), row.embedding);
    }
    return;
  }
  if (tableName === 'embedding_cache') {
    const columns = getTableColumns(db, 'legacy', 'embedding_cache');
    const profileKeyExpr = columns.has('profile_key') ? "COALESCE(profile_key, '')" : "''";
    const inputKindExpr = columns.has('input_kind') ? "COALESCE(input_kind, 'document')" : "'document'";
    db.exec('DROP TABLE IF EXISTS shard.embedding_cache');
    db.exec(`
      CREATE TABLE shard.embedding_cache (
        content_hash TEXT NOT NULL,
        profile_key TEXT NOT NULL DEFAULT '',
        input_kind TEXT NOT NULL DEFAULT 'document' CHECK (input_kind IN ('document', 'query')),
        model_id TEXT NOT NULL,
        embedding BLOB NOT NULL,
        dimensions INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
        PRIMARY KEY (content_hash, profile_key, input_kind, model_id, dimensions)
      )
    `);
    db.exec(`
      INSERT OR REPLACE INTO shard.embedding_cache (
        content_hash, profile_key, input_kind, model_id, embedding, dimensions, created_at, last_used_at
      )
      SELECT
        content_hash,
        ${profileKeyExpr},
        ${inputKindExpr},
        model_id,
        embedding,
        dimensions,
        created_at,
        last_used_at
      FROM legacy.embedding_cache
    `);
    return;
  }
  copyTable(db, 'legacy', 'shard', tableName);
}

function dropCanonicalShardPayloadTables(db: Database.Database): void {
  const tables = listUserTables(db, 'main');
  for (const tableName of tables) {
    if (!isShardTable(tableName) || tableName === 'vec_metadata') {
      continue;
    }
    try {
      db.exec(`DROP TABLE IF EXISTS main.${quoteIdent(tableName)}`);
    } catch (_error: unknown) {
      // Best-effort canonical slimming; shard copy above is authoritative.
    }
  }
}

function moveWalCompanions(sourcePath: string, backupPath: string): void {
  for (const suffix of ['-wal', '-shm']) {
    const sourceCompanion = `${sourcePath}${suffix}`;
    if (!fs.existsSync(sourceCompanion)) {
      continue;
    }
    fs.renameSync(sourceCompanion, `${backupPath}${suffix}`);
  }
}

function legacyHasVectorTables(legacyPath: string): boolean {
  if (!fs.existsSync(legacyPath)) {
    return false;
  }

  const legacy = new Database(legacyPath, { readonly: true, fileMustExist: true });
  try {
    const row = legacy.prepare(`
      SELECT 1 AS found
      FROM sqlite_master
      WHERE type IN ('table', 'view')
        AND (name = 'vec_memories' OR name LIKE 'vec\\_%' ESCAPE '\\')
      LIMIT 1
    `).get() as { found?: number } | undefined;
    return row?.found === 1;
  } finally {
    legacy.close();
  }
}

function readShardMetadata(shardPath: string): Record<string, string> | null {
  if (!fs.existsSync(shardPath)) {
    return null;
  }

  const shard = new Database(shardPath, { readonly: true, fileMustExist: true });
  try {
    const hasMetadata = shard.prepare(`
      SELECT 1 AS found
      FROM sqlite_master
      WHERE type='table' AND name='vec_metadata'
      LIMIT 1
    `).get() as { found?: number } | undefined;
    if (hasMetadata?.found !== 1) {
      return null;
    }
    const rows = shard.prepare('SELECT key, value FROM vec_metadata').all() as Array<{ key: string; value: string }>;
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  } finally {
    shard.close();
  }
}

function verifyExistingShard(profile: EmbeddingProfile, shardPath: string): void {
  const metadata = readShardMetadata(shardPath);
  if (!metadata) {
    return;
  }
  const mismatches = [
    ['provider', profile.provider],
    ['model', profile.model],
    ['dim', String(profile.dim)],
  ].filter(([key, expected]) => metadata[key] && metadata[key] !== expected);

  if (mismatches.length > 0) {
    const detail = mismatches.map(([key, expected]) => `${key}: expected ${expected}, got ${metadata[key]}`).join('; ');
    throw new Error(`Vector shard metadata mismatch for ${shardPath}: ${detail}`);
  }
}

// ───────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function migrateLegacySingleDbToShardSync(
  legacyPath: string,
  canonicalPath: string,
  shardPath: string,
  profile: EmbeddingProfile,
): void {
  if (!legacyHasVectorTables(legacyPath)) {
    return;
  }

  if (fs.existsSync(canonicalPath) && fs.existsSync(shardPath)) {
    verifyExistingShard(profile, shardPath);
    console.error(`[db-shard-migration] canonical and shard already exist for ${profile.slug}; skipping migration`);
    return;
  }

  fs.mkdirSync(path.dirname(canonicalPath), { recursive: true, mode: 0o700 });
  fs.mkdirSync(path.dirname(shardPath), { recursive: true, mode: 0o700 });

  console.error(`[db-shard-migration] migrating legacy profile DB: ${legacyPath}`);
  if (!fs.existsSync(canonicalPath)) {
    fs.copyFileSync(legacyPath, canonicalPath);
    for (const suffix of ['-wal', '-shm']) {
      if (fs.existsSync(`${legacyPath}${suffix}`)) {
        fs.copyFileSync(`${legacyPath}${suffix}`, `${canonicalPath}${suffix}`);
      }
    }
  }

  const canonical = new Database(canonicalPath);
  try {
    canonical.pragma('journal_mode = WAL');
    canonical.pragma('busy_timeout = 10000');
    sqliteVec.load(canonical);
    canonical.exec(`ATTACH DATABASE ${quoteSqlString(legacyPath)} AS legacy`);
    canonical.exec(`ATTACH DATABASE ${quoteSqlString(shardPath)} AS shard`);
    canonical.exec('PRAGMA shard.journal_mode = WAL');

    const legacyTables = listUserTables(canonical, 'legacy');
    for (const tableName of legacyTables) {
      if (tableName === 'vec_metadata') {
        continue;
      }
      if (isShardTable(tableName)) {
        copyShardPayloadTable(canonical, tableName, profile);
      }
    }

    canonical.exec(`
      DROP TABLE IF EXISTS shard.vec_metadata;
      CREATE TABLE shard.vec_metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
      INSERT OR REPLACE INTO shard.vec_metadata (key, value) VALUES
        ('provider', ${quoteSqlString(profile.provider)}),
        ('model', ${quoteSqlString(profile.model)}),
        ('dim', ${quoteSqlString(String(profile.dim))}),
        ('embedding_dim', ${quoteSqlString(String(profile.dim))});
    `);
    dropCanonicalShardPayloadTables(canonical);

    canonical.exec('DETACH DATABASE shard');
    canonical.exec('DETACH DATABASE legacy');
    canonical.exec('VACUUM');
  } finally {
    canonical.close();
  }

  const shard = new Database(shardPath);
  try {
    shard.pragma('journal_mode = WAL');
    shard.exec('VACUUM');
  } finally {
    shard.close();
  }

  const migrationDir = path.join(path.dirname(canonicalPath), 'migrations');
  fs.mkdirSync(migrationDir, { recursive: true, mode: 0o700 });
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const backupPath = path.join(migrationDir, `legacy_${profile.slug}_${timestamp}.sqlite.bak`);
  fs.renameSync(legacyPath, backupPath);
  moveWalCompanions(legacyPath, backupPath);
  console.error(`[db-shard-migration] legacy DB moved to rollback backup: ${backupPath}`);
}

export async function migrateLegacySingleDbToShard(
  legacyPath: string,
  canonicalPath: string,
  shardPath: string,
  profile: EmbeddingProfile,
): Promise<void> {
  migrateLegacySingleDbToShardSync(legacyPath, canonicalPath, shardPath, profile);
}
