#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Populate Edge Vectors
// ---------------------------------------------------------------
// Batch maintenance pass that fills edge_vector_embeddings from causal_edges
// fact_text using the daemon's active embedder. This is the producer half of the
// semantic-edge layer: without it the consumer (findSemanticEdges) has nothing
// to read, so every edge-vector flag is reachable-but-empty.
//
// Why a standalone batch pass and not an inline save-time hook: embedding every
// edge costs one model call per distinct fact_text. Doing that on the save hot
// path would tax every write for a recall lane that is gated OFF by default.
// Running it as an explicit, re-runnable maintenance command keeps the hot path
// clean and lets the operator choose when to pay the cost. Gated behind
// SPECKIT_SEMANTIC_EDGE_LAYER so it never runs unless the layer is enabled.
//
// Safe to re-run: ready rows are skipped, and the embedder is called once per
// DISTINCT fact_text (the live graph is ~93% boilerplate `supports` edges that
// share a handful of templates, so distinct-text dedup collapses ~20k edges into
// far fewer model calls). Operates on whatever --db-path points at; point it at a
// /tmp copy to leave the live DB untouched.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';
import { load as loadSqliteVec } from 'sqlite-vec';

import {
  generateDocumentEmbedding,
  generateEmbedding,
  getEmbeddingDimension,
  getModelName,
  getEmbeddingProfileAsync,
} from '../../../shared/dist/embeddings.js';
import { resolveActiveProfileDbPath } from '../../../shared/dist/embeddings/profile.js';
import { isSemanticEdgeLayerEnabled } from '../../dist/lib/search/search-flags.js';
import {
  ensureEdgeVectorStoreSchema,
  upsertEdgeVector,
  markEdgeVectorFailed,
} from '../../dist/lib/storage/edge-vector-store.js';
import { acquireDbInstanceLock, releaseDbInstanceLock } from '../../dist/lib/search/db-instance-lock.js';

const MODULE = '[populate-edge-vectors]';
const DEFAULT_PROFILE_KEY = 'default';
const PREVIEW_LIMIT = 5;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function usage() {
  return `populate-edge-vectors — fill edge_vector_embeddings from causal_edges fact_text

Usage:
  SPECKIT_SEMANTIC_EDGE_LAYER=true node mcp_server/scripts/maintenance/populate-edge-vectors.mjs [options]

Options:
  --db-path PATH      Database to populate (point at a /tmp copy for a dry live DB)
  --limit N           Cap the number of edges processed (default: all)
  --dry-run           Report what would be embedded without writing
  --help, -h          Show this help
`;
}

function parseArgs(argv) {
  const args = { dbPath: null, limit: null, dryRun: false };
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
    if (arg === '--db-path') {
      const value = argv[index + 1];
      if (!value || value.trim().length === 0) {
        throw new Error('--db-path requires a path');
      }
      args.dbPath = path.resolve(process.cwd(), value);
      index += 1;
      continue;
    }
    if (arg === '--limit') {
      const value = Number.parseInt(argv[index + 1] ?? '', 10);
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error('--limit must be a positive integer');
      }
      args.limit = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function resolveDbPath(overridePath) {
  return overridePath ?? resolveActiveProfileDbPath();
}

function openDatabase(dbPath) {
  // Single-writer guard: refuse to populate a database a live daemon (or another
  // maintenance run) currently owns — stop the daemon first, or run on a copy.
  acquireDbInstanceLock(dbPath);
  const database = new Database(dbPath);
  database.pragma('busy_timeout = 10000');
  database.pragma('foreign_keys = ON');
  loadSqliteVec(database);
  return database;
}

function getEmbeddableEdges(database, limit) {
  const limitClause = limit ? 'LIMIT ?' : '';
  const params = limit ? [limit] : [];
  return database.prepare(`
    SELECT ce.id AS id, ce.fact_text AS factText
    FROM causal_edges ce
    WHERE ce.fact_text IS NOT NULL
      AND TRIM(CAST(ce.fact_text AS text)) != ''
      AND NOT EXISTS (
        SELECT 1 FROM edge_vector_embeddings ev
        WHERE ev.edge_id = ce.id AND ev.embedding_status = 'ready'
      )
    ORDER BY ce.id ASC
    ${limitClause}
  `).all(...params);
}

async function embedText(text) {
  let embedding = await generateDocumentEmbedding(text);
  if (!embedding) {
    embedding = await generateEmbedding(text);
  }
  if (!embedding) {
    throw new Error('Embedding provider returned null');
  }
  const expectedDim = getEmbeddingDimension();
  if (embedding.length !== expectedDim) {
    throw new Error(`Embedding dimension mismatch: expected ${expectedDim}, got ${embedding.length}`);
  }
  return embedding;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!isSemanticEdgeLayerEnabled()) {
    console.log(`${MODULE} SPECKIT_SEMANTIC_EDGE_LAYER is off; nothing to do. Set it to true to populate edge vectors.`);
    return;
  }

  const dbPath = resolveDbPath(args.dbPath);
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database not found: ${dbPath}`);
  }

  const profile = await getEmbeddingProfileAsync().catch(() => null);
  const profileKey = profile?.slug ?? DEFAULT_PROFILE_KEY;
  const modelId = getModelName();

  const database = openDatabase(dbPath);
  try {
    ensureEdgeVectorStoreSchema(database);
    const edges = getEmbeddableEdges(database, args.limit);

    console.log(`${MODULE} mode=${args.dryRun ? 'dry-run' : 'live'}`);
    console.log(`${MODULE} db_path=${dbPath}`);
    console.log(`${MODULE} model_id=${modelId} profile_key=${profileKey}`);
    console.log(`${MODULE} pending_edges=${edges.length}`);

    // Distinct-text dedup: the live graph is dominated by templated fact_text, so
    // embedding each DISTINCT string once turns ~20k edge calls into a few model
    // calls and a fanned-out upsert.
    const distinctTexts = new Set(edges.map((row) => String(row.factText).trim()));
    console.log(`${MODULE} distinct_fact_texts=${distinctTexts.size}`);

    if (args.dryRun) {
      let shown = 0;
      for (const text of distinctTexts) {
        if (shown >= PREVIEW_LIMIT) break;
        console.log(`${MODULE} preview text="${text.slice(0, 80)}"`);
        shown += 1;
      }
      console.log(`${MODULE} summary embedded=0 upserted=0 failed=0 dry_run=true`);
      return;
    }

    const startedAt = Date.now();
    const vectorByText = new Map();
    let embedded = 0;
    let embedFailures = 0;
    for (const text of distinctTexts) {
      try {
        vectorByText.set(text, await embedText(text));
        embedded += 1;
      } catch (error) {
        embedFailures += 1;
        const message = error instanceof Error ? error.message : String(error);
        console.log(`${MODULE} EMBED_FAIL text="${text.slice(0, 60)}" error="${message}"`);
      }
    }

    let upserted = 0;
    let upsertFailures = 0;
    for (const row of edges) {
      const key = String(row.factText).trim();
      const embedding = vectorByText.get(key);
      if (!embedding) {
        upsertFailures += 1;
        markEdgeVectorFailed(database, row.id, 'no embedding for fact_text', { modelId, profileKey });
        continue;
      }
      try {
        upsertEdgeVector(database, {
          edgeId: row.id,
          embedding,
          factText: key,
          modelId,
          profileKey,
        });
        upserted += 1;
      } catch (error) {
        upsertFailures += 1;
        const message = error instanceof Error ? error.message : String(error);
        markEdgeVectorFailed(database, row.id, message, { modelId, profileKey });
        console.log(`${MODULE} UPSERT_FAIL id=${row.id} error="${message}"`);
      }
    }

    const ready = database.prepare(
      "SELECT COUNT(*) AS n FROM edge_vector_embeddings WHERE embedding_status = 'ready'",
    ).get().n;

    console.log(
      `${MODULE} summary embedded=${embedded} embed_failures=${embedFailures} ` +
      `upserted=${upserted} upsert_failures=${upsertFailures} ready_total=${ready} ` +
      `elapsed_ms=${Date.now() - startedAt} dry_run=false`,
    );
  } finally {
    database.close();
    releaseDbInstanceLock(dbPath);
  }
}

const invokedDirectly = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`${MODULE} FATAL ${message}`);
    process.exit(1);
  });
}
