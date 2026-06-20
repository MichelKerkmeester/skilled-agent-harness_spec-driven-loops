#!/usr/bin/env node

// Derives a small edge-recall golden set from the live causal graph and writes it
// next to the edge-recall driver. Each golden item is an open causal edge whose
// source and target are both real, titled memory rows: the source title becomes the
// query and the target memory id is the edge-neighbor we expect the graph edge path
// to recall. The set is intentionally tiny and stable (highest-strength, lowest-id
// first) so the same live database always yields the same golden items between runs.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DB_PATH = path.resolve(
  process.env.MEMORY_DB_PATH
    ?? path.join(HERE, '..', '..', 'database', 'context-index.sqlite'),
);
const GOLDEN_PATH = path.join(HERE, 'edge-recall-golden.json');
const GOLDEN_SIZE = Number.parseInt(process.env.SPECKIT_EDGE_RECALL_GOLDEN_SIZE ?? '12', 10);

// A title makes a usable query only when it carries enough lexical signal to
// FTS-match its own row; very short titles collapse the metric into noise.
const MIN_TITLE_LENGTH = 12;
const MIN_EDGE_STRENGTH = 0.5;

export function deriveEdgeRecallGolden(dbPath, size) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.prepare(`
      SELECT ce.source_id AS sourceId,
             ce.target_id AS targetId,
             ce.relation  AS relation,
             ce.strength  AS strength,
             ms.title     AS sourceTitle
      FROM causal_edges ce
      JOIN memory_index ms ON ms.id = CAST(ce.source_id AS INTEGER)
      JOIN memory_index mt ON mt.id = CAST(ce.target_id AS INTEGER)
      WHERE ce.invalid_at IS NULL
        AND ce.strength >= ?
        AND ms.title IS NOT NULL
        AND length(ms.title) >= ?
        AND CAST(ce.source_id AS INTEGER) <> CAST(ce.target_id AS INTEGER)
      ORDER BY ce.strength DESC, ce.id ASC
    `).all(MIN_EDGE_STRENGTH, MIN_TITLE_LENGTH);

    // One golden item per distinct source query so a single high-degree hub cannot
    // dominate the metric, and so the query set stays deduplicated.
    const seenQueries = new Set();
    const items = [];
    for (const row of rows) {
      const query = String(row.sourceTitle).trim();
      if (seenQueries.has(query)) continue;
      seenQueries.add(query);
      items.push({
        id: `edge-${row.sourceId}-${row.targetId}`,
        query,
        sourceMemoryId: Number.parseInt(row.sourceId, 10),
        expectedTargetMemoryId: Number.parseInt(row.targetId, 10),
        relation: row.relation,
        strength: row.strength,
      });
      if (items.length >= size) break;
    }
    return items;
  } finally {
    db.close();
  }
}

function main() {
  if (!Number.isInteger(GOLDEN_SIZE) || GOLDEN_SIZE <= 0) {
    throw new Error(`Invalid golden size: ${GOLDEN_SIZE}`);
  }
  const items = deriveEdgeRecallGolden(SOURCE_DB_PATH, GOLDEN_SIZE);
  if (items.length === 0) {
    throw new Error('Derived an empty edge-recall golden set; the live graph has no usable open edges.');
  }
  const payload = {
    generatedAt: new Date().toISOString(),
    sourceDbPath: SOURCE_DB_PATH,
    note: 'Derived from live open causal edges. Query = source memory title; expectedTargetMemoryId is the edge neighbor the graph edge path should recall.',
    items,
  };
  fs.writeFileSync(GOLDEN_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${items.length} edge-recall golden items to ${GOLDEN_PATH}`);
}

const invokedDirectly = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main();
}
