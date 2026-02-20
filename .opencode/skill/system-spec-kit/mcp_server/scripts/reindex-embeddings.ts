#!/usr/bin/env node
// ---------------------------------------------------------------
// SCRIPTS: REINDEX EMBEDDINGS
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. MODULE SETUP
--------------------------------------------------------------- */

import path from 'path';
import * as vectorIndex from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as checkpointsLib from '../lib/storage/checkpoints';
import * as accessTracker from '../lib/storage/access-tracker';
import * as hybridSearch from '../lib/search/hybrid-search';
import { init as init_db_state, setEmbeddingModelReady, DEFAULT_BASE_PATH } from '../core';
import { handleMemoryIndexScan, setEmbeddingModelReady as set_handler_embedding_ready } from '../handlers';
import { createUnifiedGraphSearchFn } from '../lib/search/graph-search-fn';
import { isGraphUnifiedEnabled } from '../lib/search/graph-flags';

/* ---------------------------------------------------------------
   2. TYPES
--------------------------------------------------------------- */

import type { EmbeddingProfile } from '../../shared/types';
import type { MCPResponse } from '../../shared/types';

interface ScanData {
  status: string;
  scanned: number;
  indexed: number;
  updated: number;
  unchanged: number;
  failed: number;
  constitutional?: {
    found: number;
    indexed: number;
    alreadyIndexed: number;
  };
  files?: { status: string; file: string; isConstitutional?: boolean }[];
}

/* ---------------------------------------------------------------
   3. REINDEX FUNCTION
--------------------------------------------------------------- */

async function reindex(): Promise<void> {
  console.log('='.repeat(60));
  console.log('MEMORY DATABASE REINDEX');
  console.log('='.repeat(60));
  console.log('');

  console.log('[1/5] Initializing database...');
  vectorIndex.initializeDb();

  console.log('[2/5] Initializing db-state module...');
  init_db_state({ vectorIndex, checkpoints: checkpointsLib, accessTracker, hybridSearch });

  console.log('[3/5] Warming up embedding model...');
  try {
    const start = Date.now();
    await embeddings.generateEmbedding('warmup test');
    const elapsed = Date.now() - start;
    setEmbeddingModelReady(true);
    if (set_handler_embedding_ready) set_handler_embedding_ready(true);
    console.log(`    Embedding model ready (${elapsed}ms)`);

    const profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
    console.log(`    Provider: ${profile?.provider}, Model: ${profile?.model}, Dim: ${profile?.dim}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('ERROR: Embedding warmup failed:', message);
    process.exit(1);
  }

  console.log('[4/5] Initializing search modules...');
  const database = vectorIndex.getDb();
  if (!database) {
    console.error('ERROR: Database not initialized after initializeDb(). Cannot proceed.');
    process.exit(1);
  }
  checkpointsLib.init(database);  accessTracker.init(database);
  const skillRoot = path.resolve(DEFAULT_BASE_PATH, '..', 'skill');
  hybridSearch.init(
    database,
    vectorIndex.vectorSearch,
    isGraphUnifiedEnabled() ? createUnifiedGraphSearchFn(database, skillRoot) : undefined
  );

  console.log('[5/5] Force reindexing all memory files...');
  console.log('');

  const result: MCPResponse = await handleMemoryIndexScan({
    force: true,
    includeConstitutional: true
  });

  if (result.content && result.content[0]) {
    const data: ScanData = JSON.parse(result.content[0].text);

    console.log('-'.repeat(60));
    console.log('REINDEX COMPLETE');
    console.log('-'.repeat(60));
    console.log(`Status:     ${data.status}`);
    console.log(`Scanned:    ${data.scanned} files`);
    console.log(`Indexed:    ${data.indexed} (new embeddings generated)`);
    console.log(`Updated:    ${data.updated}`);
    console.log(`Unchanged:  ${data.unchanged}`);
    console.log(`Failed:     ${data.failed}`);

    if (data.constitutional) {
      console.log('');
      console.log('Constitutional memories:');
      console.log(`  Found:     ${data.constitutional.found}`);
      console.log(`  Indexed:   ${data.constitutional.indexed}`);
      console.log(`  Already:   ${data.constitutional.alreadyIndexed}`);
    }

    if (data.files && data.files.length > 0) {
      console.log('');
      console.log('Changed files:');
      for (const f of data.files.slice(0, 15)) {
        console.log(`  [${f.status}] ${f.file}${f.isConstitutional ? ' (constitutional)' : ''}`);
      }
      if (data.files.length > 15) {
        console.log(`  ... and ${data.files.length - 15} more`);
      }
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('STATUS=OK');
  }

  vectorIndex.closeDb();
}

/* ---------------------------------------------------------------
   4. ENTRY POINT
--------------------------------------------------------------- */

reindex().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : '';
  console.error('FATAL:', message);
  if (stack) console.error(stack);
  process.exit(1);
});
