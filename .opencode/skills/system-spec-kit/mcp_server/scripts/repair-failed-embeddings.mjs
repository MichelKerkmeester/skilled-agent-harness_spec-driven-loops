#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Repair Failed Embeddings
// ---------------------------------------------------------------
// One-shot repair for historical memory_index rows stuck in
// embedding_status='failed'. Safe to re-run: successful rows are no
// longer selected, and status is checked again immediately before write.

import fs from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';
import { load as loadSqliteVec } from 'sqlite-vec';

import {
  generateDocumentEmbedding,
  generateEmbedding,
  getEmbeddingDimension,
  getModelName,
} from '../../shared/dist/embeddings.js';
import { resolveActiveProfileDbPath } from '../../shared/dist/embeddings/profile.js';
import { normalizeContentForEmbedding } from '../dist/lib/parsing/content-normalizer.js';
import { acquireDbInstanceLock, releaseDbInstanceLock } from '../dist/lib/search/db-instance-lock.js';

const MODULE = '[repair-failed-embeddings]';
const DEFAULT_BATCH_SIZE = 10;
const BATCH_SLEEP_MS = 1000;
const PREVIEW_LIMIT = 5;

function usage() {
  return `repair-failed-embeddings — re-embed memory_index rows with embedding_status='failed'

Usage:
  node mcp_server/scripts/repair-failed-embeddings.mjs [options]

Options:
  --dry-run           Preview rows without writing
  --batch-size N      Rows per batch; defaults to ${DEFAULT_BATCH_SIZE}
  --db-path PATH      Override the active profile database path
  --help, -h          Show this help
`;
}

function parseArgs(argv) {
  const args = {
    dryRun: false,
    batchSize: DEFAULT_BATCH_SIZE,
    dbPath: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') {
      args.dryRun = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    }
    if (arg === '--batch-size') {
      const value = Number.parseInt(argv[index + 1] ?? '', 10);
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error('--batch-size must be a positive integer');
      }
      args.batchSize = value;
      index += 1;
      continue;
    }
    if (arg === '--db-path') {
      const value = argv[index + 1];
      if (!value || value.trim().length === 0) {
        throw new Error('--db-path requires a path');
      }
      args.dbPath = path.resolve(process.cwd(), value);
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function resolveDbPath(overridePath) {
  if (overridePath) {
    return overridePath;
  }
  return resolveActiveProfileDbPath();
}

function openDatabase(dbPath) {
  // Single-writer guard: refuse to repair a database a live daemon (or
  // another maintenance run) currently owns — stop the daemon first.
  acquireDbInstanceLock(dbPath);
  const database = new Database(dbPath);
  database.pragma('busy_timeout = 10000');
  database.pragma('foreign_keys = ON');
  loadSqliteVec(database);
  return database;
}

function getFailedRows(database) {
  return database.prepare(`
    SELECT
      id,
      content_text AS content,
      file_path,
      embedding_status
    FROM memory_index
    WHERE embedding_status = 'failed'
    ORDER BY id
  `).all();
}

function readFallbackFile(filePath) {
  if (typeof filePath !== 'string' || filePath.trim().length === 0) {
    return null;
  }
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function getRowContent(row) {
  if (typeof row.content === 'string' && row.content.trim().length > 0) {
    return {
      content: row.content,
      source: 'content_text',
    };
  }

  const fallback = readFallbackFile(row.file_path);
  if (typeof fallback === 'string' && fallback.trim().length > 0) {
    return {
      content: fallback,
      source: 'file_path',
    };
  }

  return {
    content: null,
    source: 'missing',
  };
}

function toEmbeddingBuffer(embedding) {
  if (embedding instanceof Float32Array) {
    return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
  }
  if (Array.isArray(embedding)) {
    return Buffer.from(new Float32Array(embedding).buffer);
  }
  throw new Error('Embedding provider returned an unsupported vector type');
}

async function generateRepairEmbedding(content) {
  const normalized = normalizeContentForEmbedding(content);
  let embedding = await generateDocumentEmbedding(normalized);
  if (!embedding) {
    embedding = await generateEmbedding(normalized);
  }
  if (!embedding) {
    throw new Error('Embedding provider returned null');
  }
  return embedding;
}

function writeEmbedding(database, row, embedding) {
  const expectedDim = getEmbeddingDimension();
  if (embedding.length !== expectedDim) {
    throw new Error(`Embedding dimension mismatch: expected ${expectedDim}, got ${embedding.length}`);
  }

  const embeddingBuffer = toEmbeddingBuffer(embedding);
  const now = new Date().toISOString();

  return database.transaction(() => {
    const current = database.prepare(`
      SELECT embedding_status
      FROM memory_index
      WHERE id = ?
    `).get(row.id);

    if (!current) {
      return { status: 'skipped', reason: 'row disappeared before write' };
    }
    if (current.embedding_status !== 'failed') {
      return { status: 'skipped', reason: `status changed to ${current.embedding_status}` };
    }

    database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(row.id));
    database.prepare(`
      INSERT INTO vec_memories (rowid, embedding)
      VALUES (?, ?)
    `).run(BigInt(row.id), embeddingBuffer);
    database.prepare(`
      UPDATE memory_index
      SET embedding_status = 'success',
          embedding_model = ?,
          embedding_generated_at = ?,
          updated_at = ?,
          failure_reason = NULL
      WHERE id = ?
        AND embedding_status = 'failed'
    `).run(getModelName(), now, now, row.id);

    return { status: 'success' };
  })();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function logDryRun(rows, dbPath, batchSize) {
  console.log(`${MODULE} mode=dry-run`);
  console.log(`${MODULE} db_path=${dbPath}`);
  console.log(`${MODULE} vector_table=vec_memories`);
  console.log(`${MODULE} failed_count=${rows.length}`);
  console.log(`${MODULE} batch_size=${batchSize}`);
  for (const row of rows.slice(0, PREVIEW_LIMIT)) {
    const contentLength = typeof row.content === 'string' ? row.content.length : 0;
    console.log(`${MODULE} preview id=${row.id} file_path=${row.file_path} content_chars=${contentLength}`);
  }
  if (rows.length > PREVIEW_LIMIT) {
    console.log(`${MODULE} preview_remaining=${rows.length - PREVIEW_LIMIT}`);
  }
  console.log(`${MODULE} summary processed=0 succeeded=0 skipped=0 errored=0 elapsed_ms=0 dry_run=true`);
}

async function repairRows(database, rows, batchSize) {
  const startedAt = Date.now();
  const outcomes = [];
  const summary = {
    processed: 0,
    succeeded: 0,
    skipped: 0,
    errored: 0,
  };

  for (let start = 0; start < rows.length; start += batchSize) {
    const batch = rows.slice(start, start + batchSize);
    const batchNumber = Math.floor(start / batchSize) + 1;
    const totalBatches = Math.ceil(rows.length / batchSize);
    console.log(`${MODULE} batch ${batchNumber}/${totalBatches} rows=${batch.length}`);

    for (const row of batch) {
      summary.processed += 1;
      const contentResult = getRowContent(row);
      if (!contentResult.content) {
        summary.errored += 1;
        const outcome = {
          id: row.id,
          file_path: row.file_path,
          status: 'error',
          error: 'No content available from content_text or file_path',
        };
        outcomes.push(outcome);
        console.log(`${MODULE} ERROR id=${row.id} file_path=${row.file_path} error="${outcome.error}"`);
        continue;
      }

      try {
        const embedding = await generateRepairEmbedding(contentResult.content);
        const writeResult = writeEmbedding(database, row, embedding);
        if (writeResult.status === 'success') {
          summary.succeeded += 1;
          outcomes.push({
            id: row.id,
            file_path: row.file_path,
            status: 'success',
            dimensions: embedding.length,
          });
          console.log(`${MODULE} SUCCESS id=${row.id} file_path=${row.file_path} dimensions=${embedding.length} source=${contentResult.source}`);
        } else {
          summary.skipped += 1;
          outcomes.push({
            id: row.id,
            file_path: row.file_path,
            status: 'skipped',
            reason: writeResult.reason,
          });
          console.log(`${MODULE} SKIPPED id=${row.id} file_path=${row.file_path} reason="${writeResult.reason}"`);
        }
      } catch (error) {
        summary.errored += 1;
        const message = error instanceof Error ? error.message : String(error);
        outcomes.push({
          id: row.id,
          file_path: row.file_path,
          status: 'error',
          error: message,
        });
        console.log(`${MODULE} ERROR id=${row.id} file_path=${row.file_path} error="${message}"`);
      }
    }

    if (start + batchSize < rows.length) {
      await sleep(BATCH_SLEEP_MS);
    }
  }

  return {
    ...summary,
    elapsedMs: Date.now() - startedAt,
    outcomes,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dbPath = resolveDbPath(args.dbPath);
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database not found: ${dbPath}`);
  }

  const database = openDatabase(dbPath);
  try {
    const rows = getFailedRows(database);
    if (args.dryRun) {
      logDryRun(rows, dbPath, args.batchSize);
      return;
    }

    console.log(`${MODULE} mode=live`);
    console.log(`${MODULE} db_path=${dbPath}`);
    console.log(`${MODULE} vector_table=vec_memories`);
    console.log(`${MODULE} starting_failed_count=${rows.length}`);
    console.log(`${MODULE} batch_size=${args.batchSize}`);

    const result = await repairRows(database, rows, args.batchSize);
    const ending = database.prepare(`
      SELECT COUNT(*) AS count
      FROM memory_index
      WHERE embedding_status = 'failed'
    `).get();

    console.log(`${MODULE} ending_failed_count=${ending.count}`);
    console.log(
      `${MODULE} summary processed=${result.processed} succeeded=${result.succeeded} skipped=${result.skipped} errored=${result.errored} elapsed_ms=${result.elapsedMs} dry_run=false`,
    );

    if (result.errored > 0) {
      console.log(`${MODULE} errors_begin`);
      for (const outcome of result.outcomes.filter(item => item.status === 'error')) {
        console.log(`${MODULE} error id=${outcome.id} file_path=${outcome.file_path} message="${outcome.error}"`);
      }
      console.log(`${MODULE} errors_end`);
    }
  } finally {
    database.close();
    releaseDbInstanceLock(dbPath);
  }
}

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${MODULE} FATAL ${message}`);
  process.exit(1);
});
