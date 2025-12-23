#!/usr/bin/env node

/**
 * Memory File Watcher - Auto-index memory files on change
 *
 * Watches specs directory for memory file changes and automatically
 * indexes them into the semantic memory database.
 *
 * Usage:
 *   node file-watcher.js [workspace-path]
 *   node file-watcher.js /path/to/project
 *
 * Or via npm:
 *   npm run watch -- /path/to/project
 *
 * @module file-watcher
 * @version 1.0.0
 */

'use strict';

const path = require('path');
const fs = require('fs');

// Add lib to module path
const LIB_DIR = path.join(__dirname, 'lib');

const memoryParser = require(path.join(LIB_DIR, 'memory-parser.js'));
const vectorIndex = require(path.join(LIB_DIR, 'vector-index.js'));
const embeddings = require(path.join(LIB_DIR, 'embeddings.js'));

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

const DEBOUNCE_MS = 500;
const WATCH_PATTERN = 'specs/**/memory/**/*.md';

// Track pending operations to debounce rapid changes
const pendingOperations = new Map();

// ───────────────────────────────────────────────────────────────
// FILE INDEXING
// ───────────────────────────────────────────────────────────────

/**
 * Index a single memory file
 * @param {string} filePath - Absolute path to file
 */
async function indexFile(filePath) {
  try {
    console.log(`[watcher] Indexing: ${path.relative(process.cwd(), filePath)}`);

    // Parse the memory file
    const parsed = memoryParser.parseMemoryFile(filePath);

    // Validate
    const validation = memoryParser.validateParsedMemory(parsed);
    if (!validation.valid) {
      console.warn(`[watcher] Validation failed for ${path.basename(filePath)}: ${validation.errors.join(', ')}`);
      return;
    }

    // Check if content changed (using hash)
    const db = vectorIndex.getDb();
    const existing = db.prepare(`
      SELECT id, content_hash FROM memory_index
      WHERE file_path = ?
    `).get(filePath);

    if (existing && existing.content_hash === parsed.contentHash) {
      console.log(`[watcher] Unchanged: ${path.basename(filePath)}`);
      return;
    }

    // Generate embedding
    const embedding = await embeddings.generateDocumentEmbedding(parsed.content);
    if (!embedding) {
      console.error(`[watcher] Failed to generate embedding for ${path.basename(filePath)}`);
      return;
    }

    // Index the memory
    const id = vectorIndex.indexMemory({
      specFolder: parsed.specFolder,
      filePath: filePath,
      title: parsed.title,
      triggerPhrases: parsed.triggerPhrases,
      importanceWeight: 0.5,
      embedding: embedding
    });

    // Update additional metadata
    db.prepare(`
      UPDATE memory_index
      SET content_hash = ?,
          context_type = ?,
          importance_tier = ?
      WHERE id = ?
    `).run(parsed.contentHash, parsed.contextType, parsed.importanceTier, id);

    const action = existing ? 'Updated' : 'Indexed';
    console.log(`[watcher] ${action}: ${parsed.specFolder}/${path.basename(filePath)} (ID: ${id})`);

  } catch (error) {
    console.error(`[watcher] Error indexing ${path.basename(filePath)}: ${error.message}`);
  }
}

/**
 * Remove a memory file from index
 * @param {string} filePath - Absolute path to deleted file
 */
function removeFile(filePath) {
  try {
    const db = vectorIndex.getDb();
    const existing = db.prepare(`
      SELECT id, spec_folder FROM memory_index
      WHERE file_path = ?
    `).get(filePath);

    if (existing) {
      vectorIndex.deleteMemory(existing.id);
      console.log(`[watcher] Removed: ${existing.spec_folder}/${path.basename(filePath)} (ID: ${existing.id})`);
    }
  } catch (error) {
    console.error(`[watcher] Error removing ${path.basename(filePath)}: ${error.message}`);
  }
}

/**
 * Debounced file change handler
 * @param {string} eventType - 'add', 'change', or 'unlink'
 * @param {string} filePath - Absolute path to file
 */
function handleFileChange(eventType, filePath) {
  // Cancel any pending operation for this file
  if (pendingOperations.has(filePath)) {
    clearTimeout(pendingOperations.get(filePath));
  }

  // Schedule new operation
  const timeoutId = setTimeout(async () => {
    pendingOperations.delete(filePath);

    if (eventType === 'unlink') {
      removeFile(filePath);
    } else {
      await indexFile(filePath);
    }
  }, DEBOUNCE_MS);

  pendingOperations.set(filePath, timeoutId);
}

// ───────────────────────────────────────────────────────────────
// WATCH SETUP (using chokidar or fallback)
// ───────────────────────────────────────────────────────────────

/**
 * Start watching with chokidar (if available) or native fs.watch
 * @param {string} workspacePath - Root directory to watch
 */
async function startWatching(workspacePath) {
  const specsDir = path.join(workspacePath, 'specs');

  if (!fs.existsSync(specsDir)) {
    console.error(`[watcher] Specs directory not found: ${specsDir}`);
    process.exit(1);
  }

  // Try to use chokidar
  let chokidar;
  try {
    chokidar = require('chokidar');
  } catch (err) {
    console.warn('[watcher] chokidar not installed, using native fs.watch (less reliable)');
    console.warn('[watcher] Install chokidar for better watching: npm install chokidar');
    return startNativeWatch(workspacePath);
  }

  console.log(`[watcher] Starting file watcher...`);
  console.log(`[watcher] Watching: ${specsDir}/**/memory/**/*.md`);
  console.log(`[watcher] Debounce: ${DEBOUNCE_MS}ms`);
  console.log('');

  const watcher = chokidar.watch(path.join(specsDir, '**/memory/**/*.md'), {
    persistent: true,
    ignoreInitial: false, // Index existing files on startup
    followSymlinks: false,
    usePolling: false,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100
    }
  });

  watcher
    .on('add', filePath => {
      if (memoryParser.isMemoryFile(filePath)) {
        handleFileChange('add', filePath);
      }
    })
    .on('change', filePath => {
      if (memoryParser.isMemoryFile(filePath)) {
        handleFileChange('change', filePath);
      }
    })
    .on('unlink', filePath => {
      if (memoryParser.isMemoryFile(filePath)) {
        handleFileChange('unlink', filePath);
      }
    })
    .on('error', error => {
      console.error(`[watcher] Error: ${error.message}`);
    })
    .on('ready', () => {
      console.log('[watcher] Initial scan complete. Watching for changes...\n');
    });

  return watcher;
}

/**
 * Fallback: Native fs.watch (less reliable but no dependencies)
 * @param {string} workspacePath - Root directory to watch
 */
function startNativeWatch(workspacePath) {
  const specsDir = path.join(workspacePath, 'specs');

  console.log(`[watcher] Starting native file watcher...`);
  console.log(`[watcher] Watching: ${specsDir}`);
  console.log(`[watcher] Note: Native watcher may miss some events`);
  console.log('');

  // Recursive watch with native fs.watch
  function watchDir(dir) {
    let watcher;
    try {
      watcher = fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (!filename) return;

        const fullPath = path.join(dir, filename);

        // Check if it's a memory file
        if (memoryParser.isMemoryFile(fullPath)) {
          // Check if file exists (to determine add/change vs unlink)
          if (fs.existsSync(fullPath)) {
            handleFileChange('change', fullPath);
          } else {
            handleFileChange('unlink', fullPath);
          }
        }
      });

      watcher.on('error', error => {
        console.error(`[watcher] Native watch error: ${error.message}`);
      });
    } catch (err) {
      console.error(`[watcher] Failed to watch ${dir}: ${err.message}`);
    }

    return watcher;
  }

  // Do initial scan
  console.log('[watcher] Running initial scan...');
  const files = memoryParser.findMemoryFiles(workspacePath);
  console.log(`[watcher] Found ${files.length} existing memory files`);

  for (const filePath of files) {
    handleFileChange('add', filePath);
  }

  return watchDir(specsDir);
}

// ───────────────────────────────────────────────────────────────
// GRACEFUL SHUTDOWN
// ───────────────────────────────────────────────────────────────

let shuttingDown = false;

function shutdown(watcher) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log('\n[watcher] Shutting down...');

  // Clear pending operations
  for (const timeoutId of pendingOperations.values()) {
    clearTimeout(timeoutId);
  }
  pendingOperations.clear();

  // Close watcher
  if (watcher && watcher.close) {
    watcher.close();
  }

  // Close database
  vectorIndex.closeDb();

  console.log('[watcher] Shutdown complete');
  process.exit(0);
}

// ───────────────────────────────────────────────────────────────
// MAIN
// ───────────────────────────────────────────────────────────────

async function main() {
  const workspacePath = process.argv[2] || process.cwd();

  console.log('');
  console.log('📁 Memory File Watcher');
  console.log(`   Workspace: ${workspacePath}`);
  console.log('');

  // Initialize database
  vectorIndex.initializeDb();

  // Pre-warm embedding model
  console.log('[watcher] Pre-warming embedding model...');
  await embeddings.preWarmModel();
  console.log('');

  // Start watching
  const watcher = await startWatching(workspacePath);

  // Handle shutdown signals
  process.on('SIGTERM', () => shutdown(watcher));
  process.on('SIGINT', () => shutdown(watcher));
}

main().catch(error => {
  console.error(`[watcher] Fatal error: ${error.message}`);
  vectorIndex.closeDb();
  process.exit(1);
});
