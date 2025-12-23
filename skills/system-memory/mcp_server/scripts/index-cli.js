#!/usr/bin/env node

/**
 * Memory Index CLI - Command-line tool for indexing memory files
 *
 * Scans workspace for memory files and indexes them into the semantic
 * memory database. Supports dry-run, force re-index, and cleanup modes.
 *
 * Usage:
 *   node index-cli.js --workspace /path/to/project
 *   node index-cli.js --dry-run
 *   node index-cli.js --force --folder 005-memory
 *   node index-cli.js --cleanup
 *
 * @module scripts/index-cli
 * @version 1.0.0
 */

'use strict';

const path = require('path');
const fs = require('fs');

// Add lib to module path
const LIB_DIR = path.join(__dirname, '..', 'lib');

const memoryParser = require(path.join(LIB_DIR, 'memory-parser.js'));
const vectorIndex = require(path.join(LIB_DIR, 'vector-index.js'));
const embeddings = require(path.join(LIB_DIR, 'embeddings.js'));

// ───────────────────────────────────────────────────────────────
// CLI ARGUMENT PARSING
// ───────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    workspace: process.cwd(),
    dryRun: false,
    force: false,
    folder: null,
    cleanup: false,
    verbose: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '-w':
      case '--workspace':
        options.workspace = args[++i];
        break;
      case '-d':
      case '--dry-run':
        options.dryRun = true;
        break;
      case '-f':
      case '--force':
        options.force = true;
        break;
      case '--folder':
        options.folder = args[++i];
        break;
      case '-c':
      case '--cleanup':
        options.cleanup = true;
        break;
      case '-v':
      case '--verbose':
        options.verbose = true;
        break;
      case '-h':
      case '--help':
        options.help = true;
        break;
      default:
        if (!arg.startsWith('-')) {
          options.workspace = arg;
        }
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Memory Index CLI - Index memory files into semantic memory database

Usage:
  node index-cli.js [options] [workspace]

Options:
  -w, --workspace <path>  Target workspace (default: current directory)
  -d, --dry-run           Show what would be indexed without making changes
  -f, --force             Force re-index all files (ignore content hash)
  --folder <name>         Only process specific spec folder (e.g., "005-memory")
  -c, --cleanup           Remove orphaned entries (files that no longer exist)
  -v, --verbose           Show detailed output
  -h, --help              Show this help message

Examples:
  node index-cli.js                           # Index current workspace
  node index-cli.js /path/to/project          # Index specific workspace
  node index-cli.js --dry-run                 # Preview without indexing
  node index-cli.js --force --folder 005-memory  # Re-index specific folder
  node index-cli.js --cleanup                 # Remove orphaned entries
`);
}

// ───────────────────────────────────────────────────────────────
// INDEXING LOGIC
// ───────────────────────────────────────────────────────────────

async function indexFile(filePath, options) {
  const { dryRun, force, verbose } = options;

  try {
    // Parse the memory file
    const parsed = memoryParser.parseMemoryFile(filePath);

    // Validate
    const validation = memoryParser.validateParsedMemory(parsed);
    if (!validation.valid) {
      console.error(`  ⚠ Validation failed: ${validation.errors.join(', ')}`);
      return { status: 'skipped', reason: 'validation_failed' };
    }

    // Check if already indexed with same content hash
    const db = vectorIndex.getDb();
    const existing = db.prepare(`
      SELECT id, content_hash FROM memory_index
      WHERE file_path = ?
    `).get(filePath);

    if (existing && existing.content_hash === parsed.contentHash && !force) {
      if (verbose) {
        console.log(`  ○ Unchanged: ${path.basename(filePath)}`);
      }
      return { status: 'unchanged', id: existing.id };
    }

    if (dryRun) {
      const action = existing ? 'update' : 'add';
      console.log(`  [DRY-RUN] Would ${action}: ${parsed.specFolder}/${path.basename(filePath)}`);
      return { status: 'dry_run', action };
    }

    // Generate embedding
    if (verbose) {
      console.log(`  ⋯ Generating embedding for ${path.basename(filePath)}...`);
    }

    const embedding = await embeddings.generateDocumentEmbedding(parsed.content);
    if (!embedding) {
      console.error(`  ✗ Failed to generate embedding for ${path.basename(filePath)}`);
      return { status: 'failed', reason: 'embedding_failed' };
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
    console.log(`  ✓ ${action}: ${parsed.specFolder}/${path.basename(filePath)}`);

    return { status: 'indexed', id, action: existing ? 'update' : 'add' };

  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return { status: 'error', reason: error.message };
  }
}

async function runIndexing(options) {
  const { workspace, folder, cleanup, dryRun, verbose } = options;

  console.log(`\n📚 Memory Index CLI`);
  console.log(`   Workspace: ${workspace}`);
  if (folder) console.log(`   Folder filter: ${folder}`);
  if (dryRun) console.log(`   Mode: DRY RUN`);
  console.log('');

  // Initialize database
  vectorIndex.initializeDb();

  // Handle cleanup mode
  if (cleanup) {
    console.log('🧹 Cleaning up orphaned entries...\n');

    if (dryRun) {
      const report = vectorIndex.verifyIntegrityWithPaths(workspace);
      console.log(`   Would remove ${report.orphanedCount} orphaned entries`);
      if (verbose && report.orphanedEntries.length > 0) {
        for (const entry of report.orphanedEntries) {
          console.log(`   - ${entry.specFolder}: ${path.basename(entry.filePath)}`);
        }
      }
    } else {
      const result = vectorIndex.cleanupOrphans(workspace);
      console.log(`   Removed ${result.removed} orphaned entries`);
      console.log(`   Database: ${result.before} → ${result.after} entries`);
    }

    return;
  }

  // Find memory files
  console.log('🔍 Scanning for memory files...\n');

  const files = memoryParser.findMemoryFiles(workspace, { specFolder: folder });

  if (files.length === 0) {
    console.log('   No memory files found.');
    return;
  }

  console.log(`   Found ${files.length} memory files\n`);
  console.log('📝 Processing files...\n');

  // Process each file
  const stats = {
    indexed: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    failed: 0
  };

  for (const filePath of files) {
    const result = await indexFile(filePath, options);

    switch (result.status) {
      case 'indexed':
        if (result.action === 'update') stats.updated++;
        else stats.indexed++;
        break;
      case 'unchanged':
        stats.unchanged++;
        break;
      case 'skipped':
      case 'dry_run':
        stats.skipped++;
        break;
      case 'failed':
      case 'error':
        stats.failed++;
        break;
    }
  }

  // Print summary
  console.log('\n📊 Summary:');
  console.log(`   New:       ${stats.indexed}`);
  console.log(`   Updated:   ${stats.updated}`);
  console.log(`   Unchanged: ${stats.unchanged}`);
  console.log(`   Skipped:   ${stats.skipped}`);
  console.log(`   Failed:    ${stats.failed}`);
  console.log('');

  // Print database stats
  const dbStats = vectorIndex.getStats();
  console.log('💾 Database:');
  console.log(`   Total memories: ${dbStats.total}`);
  console.log(`   Indexed:        ${dbStats.success}`);
  console.log(`   Pending:        ${dbStats.pending}`);
  console.log(`   Failed:         ${dbStats.failed}`);
  console.log('');
}

// ───────────────────────────────────────────────────────────────
// MAIN
// ───────────────────────────────────────────────────────────────

async function main() {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  // Validate workspace
  if (!fs.existsSync(options.workspace)) {
    console.error(`Error: Workspace not found: ${options.workspace}`);
    process.exit(1);
  }

  try {
    await runIndexing(options);
    vectorIndex.closeDb();
    process.exit(0);
  } catch (error) {
    console.error(`Fatal error: ${error.message}`);
    vectorIndex.closeDb();
    process.exit(1);
  }
}

main();
