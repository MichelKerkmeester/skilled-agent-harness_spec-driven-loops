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
import { processBatches, toErrorMessage, type RetryErrorResult } from '../utils';

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
   3. TYPES
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
  files: { file: string; status?: string; specFolder?: string; id?: number; isConstitutional?: boolean; error?: string; errorDetail?: string }[];
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
  includeReadmes?: boolean;
  incremental?: boolean;
}

/* ---------------------------------------------------------------
   4. SHARED INDEXING LOGIC
--------------------------------------------------------------- */

import { indexMemoryFile } from './memory-save';

/** Index a single memory file, delegating to the shared indexMemoryFile logic */
async function indexSingleFile(filePath: string, force: boolean = false): Promise<IndexResult> {
  return indexMemoryFile(filePath, { force });
}

/* ---------------------------------------------------------------
   5. CONSTITUTIONAL FILE DISCOVERY
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
            if (file.name.toLowerCase() === 'readme.md') continue;
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

/**
 * Find README.md files in skill directories for indexing.
 * Discovers READMEs recursively under .opencode/skill/ directories.
 * Per ADR-003: Separate discovery path from constitutional files.
 */
function findSkillReadmes(workspacePath: string): string[] {
  const results: string[] = [];
  const skillDir = path.join(workspacePath, '.opencode', 'skill');

  if (!fs.existsSync(skillDir)) {
    return results;
  }

  // Recursive function to find README.md files
  function walkDir(dir: string): void {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          // Skip node_modules and hidden directories (except .opencode itself)
          if (entry.name === 'node_modules' || (entry.name.startsWith('.') && entry.name !== '.opencode')) {
            continue;
          }
          walkDir(fullPath);
        } else if (entry.isFile() && entry.name.toLowerCase() === 'readme.md') {
          results.push(fullPath);
        }
      }
    } catch (err) {
      // Skip directories we can't read
    }
  }

  walkDir(skillDir);
  return results;
}

/* ---------------------------------------------------------------
   6. MEMORY INDEX SCAN HANDLER
--------------------------------------------------------------- */

/** Handle memory_index_scan tool - scans and indexes memory files with incremental support */
async function handleMemoryIndexScan(args: ScanArgs): Promise<MCPResponse> {
  const {
    specFolder: spec_folder = null,
    force = false,
    includeConstitutional: include_constitutional = true,
    includeReadmes: include_readmes = true,
    incremental = true
  } = args;

  // Pre-flight dimension check
  try {
    const profile: EmbeddingProfile | null = embeddings.getEmbeddingProfile();
    if (profile) {
      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
    }
  } catch (dim_check_error: unknown) {
    const message = toErrorMessage(dim_check_error);
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
  await setLastScanTime(now);

  const workspacePath: string = DEFAULT_BASE_PATH;

  const specFiles: string[] = memoryParser.findMemoryFiles(workspacePath, { specFolder: spec_folder });
  const constitutionalFiles: string[] = include_constitutional ? findConstitutionalFiles(workspacePath) : [];
  const readmeFiles: string[] = include_readmes ? findSkillReadmes(workspacePath) : [];
  const files = [...specFiles, ...constitutionalFiles, ...readmeFiles];

  if (files.length === 0) {
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

  console.error(`[memory-index-scan] Processing ${files.length} files in batches of ${BATCH_SIZE}`);

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
      const is_constitutional = constitutionalSet.has(filePath);

      if (result.error) {
        results.failed++;
        results.files.push({
          file: path.basename(filePath),
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

        if (is_constitutional) {
          if (result.status === 'indexed') {
            results.constitutional.indexed++;
          } else if (result.status === 'unchanged') {
            results.constitutional.alreadyIndexed++;
          }
        }

        if (result.status !== 'unchanged') {
          results.files.push({
            file: path.basename(filePath),
            specFolder: result.specFolder,
            status: result.status,
            id: result.id,
            isConstitutional: is_constitutional
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

  return createMCPSuccessResponse({
    tool: 'memory_index_scan',
    summary,
    data: {
      status: 'complete',
      batchSize: BATCH_SIZE,
      ...results
    },
    hints
  });
}

/* ---------------------------------------------------------------
   7. EXPORTS
--------------------------------------------------------------- */

export {
  handleMemoryIndexScan,
  indexSingleFile,
  findConstitutionalFiles,
};

// Backward-compatible aliases (snake_case)
const handle_memory_index_scan = handleMemoryIndexScan;
const index_single_file = indexSingleFile;
const find_constitutional_files = findConstitutionalFiles;

export {
  handle_memory_index_scan,
  index_single_file,
  find_constitutional_files,
};

