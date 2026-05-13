// ---------------------------------------------------------------
// MODULE: Migrate Embeddings To llama-cpp
// ---------------------------------------------------------------
// Re-embeds an existing hf-local Memory MCP sqlite store into the
// llama-cpp provider profile while preserving memory metadata.

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

import Database from 'better-sqlite3';
import { load as loadSqliteVec } from 'sqlite-vec';

import { LlamaCppProvider } from '../shared/embeddings/providers/llama-cpp.js';

interface Args {
  source?: string;
  target?: string;
}

export type MigrationStatus = 'completed' | 'no-op' | 'failed';

export interface RunMigrationOptions {
  source?: string;
  target?: string;
  validationSampleSize?: number;
  logger?: (msg: string) => void;
}

interface CountRow {
  count: number;
}

interface SourceMemoryRow {
  id: number;
  content_text: string | null;
  embedding_model: string | null;
}

interface SummaryRow {
  memory_id: number;
  summary_text: string;
}

export interface MigrationResults {
  status: MigrationStatus;
  source: string;
  target: string;
  source_rows: number;
  target_rows: number;
  migrated_rows: number;
  skipped_rows: number;
  pruned_target_only_rows: number;
  summary_rows: number;
  validation_sample_size: number;
  mismatches: number;
  wall_clock_seconds: number;
  started_at: string;
  completed_at: string;
  reason?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILL_DIR = path.basename(__dirname) === 'dist'
  ? path.resolve(__dirname, '..', '..')
  : path.resolve(__dirname, '..');
const DATABASE_DIR = path.join(SKILL_DIR, 'mcp_server', 'database');
const LLAMA_MODEL = 'unsloth/embeddinggemma-300m-GGUF';
const MIGRATION_MAX_TEXT_LENGTH = 700;
const DEFAULT_MODEL_PATH = path.join(
  os.homedir(),
  '.cache',
  'huggingface',
  'gguf',
  'embeddinggemma-300m',
  'embeddinggemma-300M-Q8_0.gguf',
);

function parseArgs(): Args {
  const args: Args = {};
  const argv = process.argv.slice(2);
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--source') {
      args.source = argv[index + 1];
      index += 1;
    } else if (arg.startsWith('--source=')) {
      args.source = arg.slice('--source='.length);
    } else if (arg === '--target') {
      args.target = argv[index + 1];
      index += 1;
    } else if (arg.startsWith('--target=')) {
      args.target = arg.slice('--target='.length);
    } else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: tsx migrate-embeddings-to-llama-cpp.ts [--source <sqlite>] [--target <sqlite>]`);
      process.exit(0);
    }
  }
  return args;
}

function resolvePath(input: string | undefined): string | undefined {
  if (!input) {
    return undefined;
  }
  if (input.startsWith('~/')) {
    return path.join(os.homedir(), input.slice(2));
  }
  return path.resolve(process.cwd(), input);
}

function detectSourceStore(): string {
  const candidates = fs.readdirSync(DATABASE_DIR)
    .filter((filename) => filename.startsWith('context-index__hf-local__') && filename.endsWith('.sqlite'))
    .map((filename) => {
      const fullPath = path.join(DATABASE_DIR, filename);
      const stat = fs.statSync(fullPath);
      return { fullPath, size: stat.size, mtimeMs: stat.mtimeMs };
    })
    .sort((left, right) => (right.size - left.size) || (right.mtimeMs - left.mtimeMs));

  if (candidates.length === 0) {
    throw new Error(`No hf-local context-index sqlite files found in ${DATABASE_DIR}`);
  }
  return candidates[0].fullPath;
}

function defaultTargetStore(): string {
  const provider = new LlamaCppProvider({
    model: LLAMA_MODEL,
    modelPath: process.env.LLAMA_CPP_EMBEDDINGS_MODEL_PATH || DEFAULT_MODEL_PATH,
    dim: 768,
    maxTextLength: MIGRATION_MAX_TEXT_LENGTH,
    timeout: 60000,
  });
  return path.join(DATABASE_DIR, `context-index__${provider.getProfile().slug}.sqlite`);
}

function openDatabase(dbPath: string, readonly = false): Database.Database {
  const db = new Database(dbPath, {
    readonly,
    fileMustExist: readonly,
  });
  loadSqliteVec(db);
  return db;
}

function countRows(db: Database.Database, table: string): number {
  return (db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get() as CountRow).count;
}

function vectorBuffer(vector: Float32Array): Buffer {
  return Buffer.from(vector.buffer, vector.byteOffset, vector.byteLength);
}

function vectorFromBuffer(buffer: Buffer): Float32Array {
  return new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Float32Array.BYTES_PER_ELEMENT);
}

function maxAbsDiff(left: Float32Array, right: Float32Array): number {
  const length = Math.min(left.length, right.length);
  let max = 0;
  for (let index = 0; index < length; index += 1) {
    max = Math.max(max, Math.abs(left[index] - right[index]));
  }
  return max;
}

function ensureTargetInitialized(sourcePath: string, targetPath: string): void {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  if (!fs.existsSync(targetPath) || fs.statSync(targetPath).size === 0) {
    fs.copyFileSync(sourcePath, targetPath);
  }
}

function getMigratableRows(sourceDb: Database.Database): SourceMemoryRow[] {
  return sourceDb.prepare(`
    SELECT id, content_text, embedding_model
    FROM memory_index
    WHERE COALESCE(content_text, '') != ''
      AND COALESCE(is_archived, 0) = 0
    ORDER BY id
  `).all() as SourceMemoryRow[];
}

function pruneTargetOnlyRows(targetDb: Database.Database, sourceRows: SourceMemoryRow[]): number {
  const sourceIds = new Set(sourceRows.map((row) => row.id));
  const targetIds = targetDb.prepare('SELECT id FROM memory_index').all() as Array<{ id: number }>;
  const extras = targetIds.map((row) => row.id).filter((id) => !sourceIds.has(id));
  if (extras.length === 0) {
    return 0;
  }

  const deleteVec = targetDb.prepare('DELETE FROM vec_memories WHERE rowid = ?');
  const deleteMemory = targetDb.prepare('DELETE FROM memory_index WHERE id = ?');
  const prune = targetDb.transaction(() => {
    for (const id of extras) {
      deleteVec.run(BigInt(id));
      deleteMemory.run(id);
    }
  });
  prune();
  return extras.length;
}

function targetHasAllSourceRows(targetDb: Database.Database, sourceRows: SourceMemoryRow[]): boolean {
  const vecExists = targetDb.prepare('SELECT 1 FROM vec_memories WHERE rowid = ? LIMIT 1');
  const targetModel = targetDb.prepare('SELECT embedding_model FROM memory_index WHERE id = ?');

  for (const row of sourceRows) {
    const existingModel = targetModel.get(row.id) as { embedding_model: string | null } | undefined;
    const hasVector = Boolean(vecExists.get(BigInt(row.id)));
    if (existingModel?.embedding_model !== LLAMA_MODEL || !hasVector) {
      return false;
    }
  }

  return true;
}

export async function runMigration(opts: RunMigrationOptions = {}): Promise<MigrationResults> {
  const logger = opts.logger ?? console.log;
  let sourcePath = '';
  let targetPath = '';
  const startedAt = new Date();
  const started = performance.now();

  try {
    sourcePath = resolvePath(opts.source) || detectSourceStore();
    targetPath = resolvePath(opts.target) || defaultTargetStore();
    const validationSampleSize = opts.validationSampleSize ?? 10;

    const sourceDb = openDatabase(sourcePath, true);
    let targetDb: Database.Database | null = null;

    try {
      const sourceRows = countRows(sourceDb, 'memory_index');
      const rows = getMigratableRows(sourceDb);

      if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 0) {
        targetDb = openDatabase(targetPath);
        const targetRows = countRows(targetDb, 'memory_index');
        if (targetRows >= sourceRows && targetHasAllSourceRows(targetDb, rows)) {
          const completedAt = new Date();
          return {
            status: 'no-op',
            source: sourcePath,
            target: targetPath,
            source_rows: sourceRows,
            target_rows: targetRows,
            migrated_rows: 0,
            skipped_rows: rows.length,
            pruned_target_only_rows: 0,
            summary_rows: 0,
            validation_sample_size: 0,
            mismatches: 0,
            wall_clock_seconds: Number(((performance.now() - started) / 1000).toFixed(3)),
            started_at: startedAt.toISOString(),
            completed_at: completedAt.toISOString(),
            reason: 'target already has all source rows',
          };
        }
        targetDb.close();
        targetDb = null;
      }

      ensureTargetInitialized(sourcePath, targetPath);

      const provider = new LlamaCppProvider({
        model: LLAMA_MODEL,
        modelPath: process.env.LLAMA_CPP_EMBEDDINGS_MODEL_PATH || DEFAULT_MODEL_PATH,
        dim: 768,
        maxTextLength: MIGRATION_MAX_TEXT_LENGTH,
        timeout: 60000,
      });

      targetDb = openDatabase(targetPath);

      const prunedTargetOnlyRows = pruneTargetOnlyRows(targetDb, rows);
      const summaries = sourceDb.prepare(`
        SELECT memory_id, summary_text
        FROM memory_summaries
        WHERE COALESCE(summary_text, '') != ''
        ORDER BY memory_id
      `).all() as SummaryRow[];
      const summaryByMemoryId = new Map(summaries.map((row) => [row.memory_id, row.summary_text]));

      const vecExists = targetDb.prepare('SELECT 1 FROM vec_memories WHERE rowid = ? LIMIT 1');
      const targetModel = targetDb.prepare('SELECT embedding_model FROM memory_index WHERE id = ?');
      const deleteVec = targetDb.prepare('DELETE FROM vec_memories WHERE rowid = ?');
      const insertVec = targetDb.prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)');
      const updateMemory = targetDb.prepare(`
        UPDATE memory_index
        SET embedding_model = ?,
            embedding_generated_at = ?,
            embedding_status = 'success',
            failure_reason = NULL
        WHERE id = ?
      `);
      const updateSummary = targetDb.prepare(`
        UPDATE memory_summaries
        SET summary_embedding = ?,
            updated_at = ?
        WHERE memory_id = ?
      `);

      let migratedRows = 0;
      let skippedRows = 0;
      let summaryRows = 0;

      for (const row of rows) {
        const existingModel = targetModel.get(row.id) as { embedding_model: string | null } | undefined;
        const rowId = BigInt(row.id);
        const hasVector = Boolean(vecExists.get(rowId));
        if (existingModel?.embedding_model === LLAMA_MODEL && hasVector) {
          skippedRows += 1;
          continue;
        }

        const content = row.content_text?.trim();
        if (!content) {
          continue;
        }

        const embedding = await provider.embedDocument(content);
        if (!embedding) {
          throw new Error(`llama-cpp returned null embedding for memory id ${row.id}`);
        }

        const now = new Date().toISOString();
        const summaryText = summaryByMemoryId.get(row.id);
        let summaryEmbedding: Float32Array | null = null;
        if (summaryText) {
          summaryEmbedding = await provider.embedDocument(summaryText);
          if (!summaryEmbedding) {
            throw new Error(`llama-cpp returned null summary embedding for memory id ${row.id}`);
          }
        }

        const writeRow = targetDb.transaction(() => {
          deleteVec.run(rowId);
          insertVec.run(rowId, vectorBuffer(embedding));
          updateMemory.run(LLAMA_MODEL, now, row.id);
          if (summaryEmbedding) {
            updateSummary.run(vectorBuffer(summaryEmbedding), now, row.id);
          }
        });
        writeRow();
        migratedRows += 1;
        if (summaryEmbedding) {
          summaryRows += 1;
        }

        if (migratedRows % 100 === 0) {
          logger(`Migrated ${migratedRows}/${rows.length} rows`);
        }
      }

      targetDb.prepare(`
        DELETE FROM vec_memories
        WHERE rowid NOT IN (SELECT id FROM memory_index)
      `).run();

      const sampleRows = targetDb.prepare(`
        SELECT id, content_text
        FROM memory_index
        WHERE embedding_model = ?
          AND COALESCE(content_text, '') != ''
        ORDER BY RANDOM()
        LIMIT ?
      `).all(LLAMA_MODEL, validationSampleSize) as Array<{ id: number; content_text: string }>;

      let mismatches = 0;
      const fetchVec = targetDb.prepare('SELECT embedding FROM vec_memories WHERE rowid = ?');
      for (const row of sampleRows) {
        const expected = await provider.embedDocument(row.content_text);
        const stored = fetchVec.get(BigInt(row.id)) as { embedding: Buffer } | undefined;
        if (!expected || !stored) {
          mismatches += 1;
          continue;
        }
        const actual = vectorFromBuffer(stored.embedding);
        if (actual.length !== expected.length || maxAbsDiff(actual, expected) > 1e-6) {
          mismatches += 1;
        }
      }

      const completedAt = new Date();
      const results: MigrationResults = {
        status: mismatches > 0 ? 'failed' : 'completed',
        source: sourcePath,
        target: targetPath,
        source_rows: sourceRows,
        target_rows: countRows(targetDb, 'memory_index'),
        migrated_rows: migratedRows,
        skipped_rows: skippedRows,
        pruned_target_only_rows: prunedTargetOnlyRows,
        summary_rows: summaryRows,
        validation_sample_size: sampleRows.length,
        mismatches,
        wall_clock_seconds: Number(((performance.now() - started) / 1000).toFixed(3)),
        started_at: startedAt.toISOString(),
        completed_at: completedAt.toISOString(),
        reason: mismatches > 0 ? `validation mismatches: ${mismatches}` : undefined,
      };

      return results;
    } finally {
      sourceDb.close();
      targetDb?.close();
    }
  } catch (error: unknown) {
    const completedAt = new Date();
    return {
      status: 'failed',
      source: sourcePath,
      target: targetPath,
      source_rows: 0,
      target_rows: 0,
      migrated_rows: 0,
      skipped_rows: 0,
      pruned_target_only_rows: 0,
      summary_rows: 0,
      validation_sample_size: 0,
      mismatches: 0,
      wall_clock_seconds: Number(((performance.now() - started) / 1000).toFixed(3)),
      started_at: startedAt.toISOString(),
      completed_at: completedAt.toISOString(),
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const args = parseArgs();
  runMigration({
    source: args.source,
    target: args.target,
  })
    .then((results) => {
      console.log(JSON.stringify(results, null, 2));
      if (results.status === 'failed' || results.mismatches > 0) {
        process.exitCode = 1;
      }
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.stack || error.message : String(error));
      process.exitCode = 1;
    });
}
