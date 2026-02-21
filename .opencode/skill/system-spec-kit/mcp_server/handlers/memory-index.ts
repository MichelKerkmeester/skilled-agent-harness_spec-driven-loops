// ---------------------------------------------------------------
// MODULE: Memory Index
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

/* ---------------------------------------------------------------
   1. CORE AND UTILS IMPORTS
--------------------------------------------------------------- */

import { getLastScanTime, setLastScanTime, checkDatabaseUpdated } from '../core';
import { INDEX_SCAN_COOLDOWN, DEFAULT_BASE_PATH, BATCH_SIZE } from '../core/config';
import { processBatches, requireDb, toErrorMessage, type RetryErrorResult } from '../utils';

/* ---------------------------------------------------------------
   2. LIB MODULE IMPORTS
--------------------------------------------------------------- */

import * as memoryParser from '../lib/parsing/memory-parser';
import * as embeddings from '../lib/providers/embeddings';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as incrementalIndex from '../lib/storage/incremental-index';

// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';

// Shared handler types
import type { MCPResponse, EmbeddingProfile } from './types';

/* ---------------------------------------------------------------
   3. SPEC DOCUMENT DISCOVERY (Spec 126)
--------------------------------------------------------------- */

/** Well-known spec folder document filenames */
const SPEC_DOCUMENT_FILENAMES = new Set([
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'decision-record.md',
  'implementation-summary.md',
  'research.md',
  'handover.md',
]);

/** Directories to exclude from spec document discovery */
const SPEC_DOC_EXCLUDE_DIRS = new Set(['z_archive', 'scratch', 'memory', 'node_modules']);

/** README filename matcher for markdown and plain text docs. */
const README_FILE_PATTERN = /^readme\.(md|txt)$/i;

/**
 * Discover spec folder documents (.opencode/specs/ directory tree).
 * Finds spec.md, plan.md, tasks.md, checklist.md, decision-record.md,
 * implementation-summary.md, research.md, handover.md.
 *
 * Excludes z_archive/, scratch/, memory/, and hidden directories.
 */
function findSpecDocuments(workspacePath: string, options: { specFolder?: string | null } = {}): string[] {
  // Feature flag: allow opt-out
  if (process.env.SPECKIT_INDEX_SPEC_DOCS === 'false') {
    return [];
  }

  const results: string[] = [];

  function walkSpecsDir(specsRoot: string, dir: string): void {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          // Skip excluded directories and hidden dirs
          if (SPEC_DOC_EXCLUDE_DIRS.has(entry.name) || entry.name.startsWith('.')) {
            continue;
          }
          walkSpecsDir(specsRoot, path.join(dir, entry.name));
        } else if (entry.isFile() && SPEC_DOCUMENT_FILENAMES.has(entry.name.toLowerCase())) {
          const fullPath = path.join(dir, entry.name);

          // If specFolder filter is provided, check it matches
          if (options.specFolder) {
            const normalizedSpecFolder = options.specFolder.replace(/\\/g, '/').replace(/\/+$/, '');
            const relativePath = path.relative(specsRoot, fullPath).replace(/\\/g, '/');
            if (
              relativePath !== normalizedSpecFolder &&
              !relativePath.startsWith(`${normalizedSpecFolder}/`)
            ) {
              continue;
            }
          }

          results.push(fullPath);
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  // Check both possible specs locations
  const specsRoots = [
    path.join(workspacePath, '.opencode', 'specs'),
    path.join(workspacePath, 'specs'),
  ];

  for (const specsRoot of specsRoots) {
    if (!fs.existsSync(specsRoot)) continue;

    walkSpecsDir(specsRoot, specsRoot);
  }

  return results;
}

/**
 * Detect the spec documentation level from a spec.md file.
 * Reads first 2KB looking for <!-- SPECKIT_LEVEL: N --> marker.
 * Falls back to document completeness heuristic if marker not found.
 */
function detectSpecLevel(specPath: string): number | null {
  try {
    // Read first 2KB for the level marker
    const fd = fs.openSync(specPath, 'r');
    let bytesRead = 0;
    const buffer = Buffer.alloc(2048);
    try {
      bytesRead = fs.readSync(fd, buffer, 0, 2048, 0);
    } finally {
      fs.closeSync(fd);
    }

    const header = buffer.toString('utf-8', 0, bytesRead);

    // Look for SPECKIT_LEVEL marker
    const levelMatch = header.match(/<!--\s*SPECKIT_LEVEL:\s*(\d\+?)\s*-->/i);
    if (levelMatch) {
      const levelStr = levelMatch[1];
      if (levelStr === '3+') return 4;
      const level = parseInt(levelStr, 10);
      if (level >= 1 && level <= 3) return level;
    }

    // Heuristic fallback: check sibling files
    const dir = path.dirname(specPath);
    try {
      const siblings = fs.readdirSync(dir).map(f => f.toLowerCase());
      const hasDecisionRecord = siblings.includes('decision-record.md');
      const hasChecklist = siblings.includes('checklist.md');

      if (hasDecisionRecord) return 3;
      if (hasChecklist) return 2;
      return 1;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------
   4. TYPES
--------------------------------------------------------------- */

interface IndexResult {
  status: string;
  id?: number;
  specFolder?: string;
  title?: string | null;
  error?: string;
  errorDetail?: string;
  [key: string]: unknown;
}

/** Type guard: distinguishes IndexResult from RetryErrorResult via the 'status' property */
function isIndexResult(result: IndexResult | RetryErrorResult): result is IndexResult {
  return 'status' in result;
}

interface ScanResults {
  scanned: number;
  indexed: number;
  updated: number;
  unchanged: number;
  failed: number;
  skipped_mtime: number;
  skipped_hash: number;
  mtimeUpdates: number;
  files: { file: string; filePath?: string; status?: string; specFolder?: string; id?: number; isConstitutional?: boolean; error?: string; errorDetail?: string }[];
  constitutional: {
    found: number;
    indexed: number;
    alreadyIndexed: number;
  };
  incremental: {
    enabled: boolean;
    fast_path_skips: number;
    hash_checks: number;
  };
}

interface CategorizedFiles {
  toIndex: string[];
  toUpdate: string[];
  toSkip: string[];
  toDelete: string[];
}

interface ScanArgs {
  specFolder?: string | null;
  force?: boolean;
  includeConstitutional?: boolean;
  includeSpecDocs?: boolean;
  incremental?: boolean;
}

/* ---------------------------------------------------------------
   5. SHARED INDEXING LOGIC
--------------------------------------------------------------- */

import { indexMemoryFile } from './memory-save';

/** Index a single memory file, delegating to the shared indexMemoryFile logic */
async function indexSingleFile(filePath: string, force: boolean = false): Promise<IndexResult> {
  return indexMemoryFile(filePath, { force });
}

/* ---------------------------------------------------------------
   6. CONSTITUTIONAL FILE DISCOVERY
--------------------------------------------------------------- */

/** Discover constitutional memory files from skill constitutional directories */
function findConstitutionalFiles(workspacePath: string): string[] {
  const results: string[] = [];
  const skillDir = path.join(workspacePath, '.opencode', 'skill');

  if (!fs.existsSync(skillDir)) return results;

  try {
    const skillEntries = fs.readdirSync(skillDir, { withFileTypes: true });
    for (const entry of skillEntries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const constitutionalDir = path.join(skillDir, entry.name, 'constitutional');
      if (!fs.existsSync(constitutionalDir)) continue;
      try {
        const files = fs.readdirSync(constitutionalDir, { withFileTypes: true });
        for (const file of files) {
          if (file.isFile() && file.name.endsWith('.md')) {
            if (README_FILE_PATTERN.test(file.name)) continue;
            results.push(path.join(constitutionalDir, file.name));
          }
        }
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        console.warn(`Warning: Could not read constitutional dir ${constitutionalDir}:`, message);
      }
    }
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn(`Warning: Could not read skill directory:`, message);
  }
  return results;
}

/* ---------------------------------------------------------------
   7. MEMORY INDEX SCAN HANDLER
--------------------------------------------------------------- */

/** Handle memory_index_scan tool - scans and indexes memory files with incremental support */
async function handleMemoryIndexScan(args: ScanArgs): Promise<MCPResponse> {
  const {
    specFolder: spec_folder = null,
    force = false,
    includeConstitutional: include_constitutional = true,
    includeSpecDocs: include_spec_docs = true,
    incremental = true
  } = args;

  // Pre-flight dimension check
  try {
    const profile: EmbeddingProfile | null = embeddings.getEmbeddingProfile();
    if (profile) {
      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
    }
  } catch (dimCheckError: unknown) {
    const message = toErrorMessage(dimCheckError);
    console.warn('[memory_index_scan] Could not verify embedding dimension:', message);
  }

  await checkDatabaseUpdated();

  // L15: Rate limiting check
  const now = Date.now();
  const lastScanTime = await getLastScanTime();
  if (now - lastScanTime < INDEX_SCAN_COOLDOWN) {
    const waitTime = Math.ceil((INDEX_SCAN_COOLDOWN - (now - lastScanTime)) / 1000);
    return createMCPErrorResponse({
      tool: 'memory_index_scan',
      error: 'Rate limited',
      code: 'E429',
      details: { waitSeconds: waitTime },
      recovery: {
        hint: `Please wait ${waitTime} seconds before scanning again`,
        actions: ['Wait for cooldown period', 'Consider using incremental=true for faster subsequent scans'],
        severity: 'warning'
      }
    });
  }

  const workspacePath: string = DEFAULT_BASE_PATH;

  const specFiles: string[] = memoryParser.findMemoryFiles(workspacePath, { specFolder: spec_folder });
  const constitutionalFiles: string[] = include_constitutional ? findConstitutionalFiles(workspacePath) : [];
  const specDocFiles: string[] = include_spec_docs ? findSpecDocuments(workspacePath, { specFolder: spec_folder }) : [];
  const files = [...specFiles, ...constitutionalFiles, ...specDocFiles];

  if (files.length === 0) {
    await setLastScanTime(now);
    return createMCPSuccessResponse({
      tool: 'memory_index_scan',
      summary: 'No memory files found',
      data: {
        status: 'complete',
        scanned: 0,
        indexed: 0,
        updated: 0,
        unchanged: 0,
        failed: 0
      },
      hints: [
        'Memory files should be in specs/**/memory/ directories',
        'Constitutional files go in .opencode/skill/*/constitutional/'
      ]
    });
  }

  const constitutionalSet = new Set(constitutionalFiles);

  const results: ScanResults = {
    scanned: files.length,
    indexed: 0,
    updated: 0,
    unchanged: 0,
    failed: 0,
    skipped_mtime: 0,
    skipped_hash: 0,
    mtimeUpdates: 0,
    files: [],
    constitutional: {
      found: constitutionalFiles.length,
      indexed: 0,
      alreadyIndexed: 0
    },
    incremental: {
      enabled: incremental && !force,
      fast_path_skips: 0,
      hash_checks: 0
    }
  };

  let filesToIndex: string[] = files;

  if (incremental && !force) {
    const startCategorize = Date.now();
    const categorized: CategorizedFiles = incrementalIndex.categorizeFilesForIndexing(files);

    filesToIndex = [...categorized.toIndex, ...categorized.toUpdate];

    results.unchanged = categorized.toSkip.length;
    results.skipped_mtime = categorized.toSkip.length;
    results.skipped_hash = 0;
    results.incremental.fast_path_skips = categorized.toSkip.length;
    results.incremental.hash_checks = categorized.toUpdate.length;

    for (const unchangedPath of categorized.toSkip) {
      if (constitutionalSet.has(unchangedPath)) {
        results.constitutional.alreadyIndexed++;
      }
    }

    const categorizeTime = Date.now() - startCategorize;
    console.error(`[memory-index-scan] Incremental mode: ${filesToIndex.length}/${files.length} files need indexing (categorized in ${categorizeTime}ms)`);
    console.error(`[memory-index-scan] Fast-path skips: ${results.incremental.fast_path_skips}, Hash checks: ${results.incremental.hash_checks}`);
  }

  // T106/P0-09: Track successfully indexed files for post-indexing mtime update.
  // SAFETY INVARIANT: mtime markers are updated ONLY after indexing succeeds.
  // Failed files keep their old mtime so shouldReindex() returns 'modified'
  // or 'new' on the next scan, ensuring automatic retry. Moving this update
  // before indexing would cause silent data loss — a failed file would be
  // marked "already indexed" and permanently skipped.
  const successfullyIndexedFiles: string[] = [];

  if (filesToIndex.length > 0) {
    const batchResults = await processBatches(filesToIndex, async (filePath: string) => {
      return await indexSingleFile(filePath, force);
    });

    for (let i = 0; i < batchResults.length; i++) {
      const result = batchResults[i];
      const filePath = filesToIndex[i];
      const isConstitutional = constitutionalSet.has(filePath);

      if (result.error) {
        results.failed++;
        results.files.push({
          file: path.basename(filePath),
          filePath,
          status: 'failed',
          error: result.error,
          errorDetail: result.errorDetail
        });
      } else if (isIndexResult(result)) {
        if (result.status === 'indexed') {
          results.indexed++;
          successfullyIndexedFiles.push(filePath);
        } else if (result.status === 'updated') {
          results.updated++;
          successfullyIndexedFiles.push(filePath);
        } else if (result.status === 'unchanged') {
          results.unchanged++;
          successfullyIndexedFiles.push(filePath);
        } else if (result.status === 'reinforced') {
          results.updated++;
          successfullyIndexedFiles.push(filePath);
        }

        if (isConstitutional) {
          if (result.status === 'indexed') {
            results.constitutional.indexed++;
          } else if (result.status === 'unchanged') {
            results.constitutional.alreadyIndexed++;
          }
        }

        if (result.status !== 'unchanged') {
          results.files.push({
            file: path.basename(filePath),
            filePath,
            specFolder: result.specFolder,
            status: result.status,
            id: result.id,
            isConstitutional
          });
        }
      }
    }
  }

  // T106/P0-09: Update mtimes ONLY for successfully indexed files (not before indexing).
  // Failed files keep their old mtime so they are retried on next scan.
  // This is the ONLY place where scan-triggered mtime updates occur.
  // See also: indexMemoryFile() sets file_mtime_ms within its DB transaction,
  // which rolls back atomically on failure — a complementary safety mechanism.
  if (successfullyIndexedFiles.length > 0) {
    const mtimeUpdateResult = incrementalIndex.batchUpdateMtimes(successfullyIndexedFiles);
    results.mtimeUpdates = mtimeUpdateResult.updated;
  }

  // Spec 126: Create causal chains between spec folder documents.
  // Includes deferred indexing outcomes and incremental single-file updates.
  if (include_spec_docs) {
    try {
      // Determine which spec folders had spec document changes in this scan.
      // We use parsed document type (not basename) to avoid false positives
      // from memory/plan.md or similar filenames.
      const affectedSpecFolders = new Set<string>();
      for (const fileResult of results.files) {
        if (!fileResult.specFolder || fileResult.status === 'failed') {
          continue;
        }

        if (!fileResult.filePath) {
          continue;
        }

        const docType = memoryParser.extractDocumentType(fileResult.filePath);
        if (
          docType !== 'memory' &&
          docType !== 'constitutional'
        ) {
          affectedSpecFolders.add(fileResult.specFolder);
        }
      }

      if (affectedSpecFolders.size > 0) {
        const database = requireDb();
        const { createSpecDocumentChain, init: initCausalEdges } = await import('../lib/storage/causal-edges');
        initCausalEdges(database);

        // Build full per-folder document map from DB (not just this scan's files).
        const selectDocIds = database.prepare(`
          SELECT document_type, MAX(id) AS id
          FROM memory_index
          WHERE spec_folder = ?
            AND document_type IN ('spec', 'plan', 'tasks', 'checklist', 'decision_record', 'implementation_summary', 'research', 'handover')
          GROUP BY document_type
        `);

        let chainsCreated = 0;
        let foldersProcessed = 0;

        for (const folder of affectedSpecFolders) {
          const rows = selectDocIds.all(folder) as Array<{ document_type: string; id: number }>;
          const docIds: Record<string, number> = {};

          for (const row of rows) {
            if (row.document_type && typeof row.id === 'number') {
              docIds[row.document_type] = row.id;
            }
          }

          if (Object.keys(docIds).length >= 2) {
            const chainResult = createSpecDocumentChain(docIds);
            chainsCreated += chainResult.inserted;
            foldersProcessed++;
          }
        }

        if (chainsCreated > 0) {
          console.error(`[memory-index-scan] Spec 126: Created ${chainsCreated} causal chain edges across ${foldersProcessed} spec folders`);
        }
      }
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      console.warn('[memory-index-scan] Spec 126: Causal chain creation failed:', message);
    }
  }

  if (results.indexed > 0 || results.updated > 0) {
    triggerMatcher.clearCache();
  }

  const summary = `Scan complete: ${results.indexed} indexed, ${results.updated} updated, ${results.unchanged} unchanged, ${results.failed} failed`;

  const hints: string[] = [];
  if (results.failed > 0) {
    hints.push(`${results.failed} files failed to index - check file format`);
  }
  if (results.incremental.enabled && results.incremental.fast_path_skips > 0) {
    hints.push(`Incremental mode saved time: ${results.incremental.fast_path_skips} files skipped via mtime check`);
  }
  if (results.indexed + results.updated === 0 && results.unchanged > 0) {
    hints.push('All files already up-to-date. Use force: true to re-index');
  }

  await setLastScanTime(now);

  return createMCPSuccessResponse({
    tool: 'memory_index_scan',
    summary,
    data: {
      status: 'complete',
      batchSize: BATCH_SIZE,
      ...results,
      ...(process.env.SPECKIT_DEBUG_INDEX_SCAN === 'true'
        ? {
            _debug_fileCounts: {
              specFiles: specFiles.length,
              constitutionalFiles: constitutionalFiles.length,
              specDocFiles: specDocFiles.length,
              totalFiles: files.length,
              includeSpecDocs: include_spec_docs,
              workspacePath,
            },
          }
        : {})
    },
    hints
  });
}

/* ---------------------------------------------------------------
   9. EXPORTS
--------------------------------------------------------------- */

export {
  handleMemoryIndexScan,
  indexSingleFile,
  findConstitutionalFiles,
  findSpecDocuments,
  detectSpecLevel,
};

// Backward-compatible aliases (snake_case)
const handle_memory_index_scan = handleMemoryIndexScan;
const index_single_file = indexSingleFile;
const find_constitutional_files = findConstitutionalFiles;
const find_spec_documents = findSpecDocuments;
const detect_spec_level = detectSpecLevel;

export {
  handle_memory_index_scan,
  index_single_file,
  find_constitutional_files,
  find_spec_documents,
  detect_spec_level,
};
