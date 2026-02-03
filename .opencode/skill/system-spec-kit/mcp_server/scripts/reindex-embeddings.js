#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// SCRIPTS: REINDEX EMBEDDINGS
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. MODULE SETUP
────────────────────────────────────────────────────────────────*/

const MCP_DIR = path.resolve(__dirname, '..');
const LIB_DIR = path.join(MCP_DIR, 'lib');

const vectorIndex = require(path.join(LIB_DIR, 'search', 'vector-index.js'));
const embeddings = require(path.join(LIB_DIR, 'providers', 'embeddings.js'));
const checkpointsLib = require(path.join(LIB_DIR, 'storage', 'checkpoints.js'));
const accessTracker = require(path.join(LIB_DIR, 'storage', 'access-tracker.js'));
const hybridSearch = require(path.join(LIB_DIR, 'search', 'hybrid-search.js'));
const { init: init_db_state, set_embedding_model_ready } = require(path.join(MCP_DIR, 'core'));
const { handle_memory_index_scan, set_embedding_model_ready: set_handler_embedding_ready } = require(path.join(MCP_DIR, 'handlers'));
const { DEFAULT_BASE_PATH } = require(path.join(MCP_DIR, 'core', 'config'));

/* ─────────────────────────────────────────────────────────────
   2. REINDEX FUNCTION
────────────────────────────────────────────────────────────────*/

async function reindex() {
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
    set_embedding_model_ready(true);
    if (set_handler_embedding_ready) set_handler_embedding_ready(true);
    console.log(`    Embedding model ready (${elapsed}ms)`);

    const profile = embeddings.getEmbeddingProfile();
    console.log(`    Provider: ${profile.provider}, Model: ${profile.model}, Dim: ${profile.dim}`);
  } catch (err) {
    console.error('ERROR: Embedding warmup failed:', err.message);
    process.exit(1);
  }

  console.log('[4/5] Initializing search modules...');
  const database = vectorIndex.getDb();
  checkpointsLib.init(database);
  accessTracker.init(database);
  hybridSearch.init(database, vectorIndex.vectorSearch);

  console.log('[5/5] Force reindexing all memory files...');
  console.log('');

  const result = await handle_memory_index_scan({
    force: true,
    includeConstitutional: true
  });

  if (result.content && result.content[0]) {
    const data = JSON.parse(result.content[0].text);

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

/* ─────────────────────────────────────────────────────────────
   3. ENTRY POINT
────────────────────────────────────────────────────────────────*/

reindex().catch(err => {
  console.error('FATAL:', err.message);
  console.error(err.stack);
  process.exit(1);
});
