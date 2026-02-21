// ---------------------------------------------------------------
// MODULE: Memory Save
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. DEPENDENCIES
--------------------------------------------------------------- */

// Node built-ins
import fs from 'fs';
import path from 'path';

// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';

// Internal modules
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core';
import { createFilePathValidator } from '../utils/validators';
import * as vectorIndex from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as memoryParser from '../lib/parsing/memory-parser';
import type { CausalLinks } from '../lib/parsing/memory-parser';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as bm25Index from '../lib/search/bm25-index';
import * as predictionErrorGate from '../lib/cache/cognitive/prediction-error-gate';
import * as fsrsScheduler from '../lib/cache/cognitive/fsrs-scheduler';
import * as transactionManager from '../lib/storage/transaction-manager';
import * as incrementalIndex from '../lib/storage/incremental-index';
import * as preflight from '../lib/validation/preflight';
import * as toolCache from '../lib/cache/tool-cache';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import * as retryManager from '../lib/providers/retry-manager';
import * as causalEdges from '../lib/storage/causal-edges';
import { requireDb, toErrorMessage } from '../utils';
import { needsChunking, chunkLargeFile } from '../lib/chunking/anchor-chunker';
import type { MCPResponse } from './types';
import type BetterSqlite3 from 'better-sqlite3';

import { getMemoryHashSnapshot, appendMutationLedgerSafe } from './memory-crud-utils';

// Create local path validator
const validateFilePathLocal = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);

/* ---------------------------------------------------------------
   2. TYPES
--------------------------------------------------------------- */

interface ParsedMemory {
  specFolder: string;
  filePath: string;
  title: string | null;
  triggerPhrases: string[];
  content: string;
  contentHash: string;
  contextType: string;
  importanceTier: string;
  memoryType?: string;
  memoryTypeSource?: string;
  hasCausalLinks?: boolean;
  causalLinks?: CausalLinks;
  /** Spec 126: Document structural type (spec, plan, tasks, memory, readme, etc.) */
  documentType?: string;
  qualityScore?: number;
  qualityFlags?: string[];
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface SimilarMemory {
  id: number;
  similarity: number;
  content: string;
  stability: number;
  difficulty: number;
  file_path: string;
  [key: string]: unknown;
}

interface PeDecision {
  action: string;
  similarity: number;
  existingMemoryId?: number | null;
  reason?: string;
  contradiction?: { detected: boolean; type: string | null; description: string | null; confidence: number } | null;
}

interface IndexResult extends Record<string, unknown> {
  status: string;
  id: number;
  specFolder: string;
  title: string | null;
  triggerPhrases?: string[];
  contextType?: string;
  importanceTier?: string;
  memoryType?: string;
  memoryTypeSource?: string;
  embeddingStatus?: string;
  embeddingFailureReason?: string;
  warnings?: string[];
  pe_action?: string;
  pe_reason?: string;
  superseded_id?: number;
  related_ids?: number[];
  previous_stability?: number;
  newStability?: number;
  retrievability?: number;
  causalLinks?: Record<string, unknown>;
  message?: string;
  success?: boolean;
  error?: string;
  qualityScore?: number;
  qualityFlags?: string[];
}

interface CausalLinkMapping {
  relation: typeof causalEdges.RELATION_TYPES[keyof typeof causalEdges.RELATION_TYPES];
  reverse: boolean;
}

interface CausalLinksResult {
  processed: number;
  inserted: number;
  resolved: number;
  unresolved: { type: string; reference: string }[];
  errors: { type: string; reference: string; error: string }[];
}

interface AtomicSaveParams {
  file_path: string;
  content: string;
}

interface AtomicSaveOptions {
  force?: boolean;
}

interface AtomicSaveResult {
  success: boolean;
  filePath: string;
  error?: string;
}

interface SaveArgs {
  filePath: string;
  force?: boolean;
  dryRun?: boolean;
  skipPreflight?: boolean;
  asyncEmbedding?: boolean; // T306: When true, embedding generation is deferred (non-blocking)
}

/* ---------------------------------------------------------------
   3. SQL HELPER FUNCTIONS
--------------------------------------------------------------- */

/** Escape special SQL LIKE pattern characters (% and _) for safe queries */
function escapeLikePattern(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError(`escapeLikePattern expects string, got ${typeof str}`);
  }
  return str.replace(/%/g, '\\%').replace(/_/g, '\\_');
}

/* ---------------------------------------------------------------
   4. PE GATING HELPER FUNCTIONS
--------------------------------------------------------------- */

/**
 * Calculate importance weight based on file path and document type.
 * Spec 126: Expanded from README-only to support all document types.
 *
 * Weights: constitutional -> 1.0, spec/decision-record -> 0.8, plan -> 0.7,
 * tasks/impl-summary/research -> 0.6, checklist/handover -> 0.5,
 * memory -> 0.5, project readme -> 0.4, skill readme -> 0.3, scratch -> 0.25
 */
function calculateDocumentWeight(filePath: string, documentType?: string): number {
  // If documentType is provided, use it directly
  if (documentType) {
    const DOC_TYPE_WEIGHTS: Record<string, number> = {
      spec: 0.8,
      decision_record: 0.8,
      plan: 0.7,
      tasks: 0.6,
      implementation_summary: 0.6,
      research: 0.6,
      checklist: 0.5,
      handover: 0.5,
      constitutional: 1.0,
      memory: 0.5,
      readme: 0.4,
      skill_reference: 0.35,
      skill_checklist: 0.35,
      skill_asset: 0.30,
      scratch: 0.25,
    };
    const weight = DOC_TYPE_WEIGHTS[documentType];
    if (weight !== undefined) {
      // Skill READMEs get lower weight than project READMEs
      if (documentType === 'readme') {
        const normalizedPath = filePath.replace(/\\/g, '/');
        if (normalizedPath.includes('.opencode/skill/')) return 0.3;
      }
      return weight;
    }
  }

  // Fallback: path-based heuristic (backward compatibility)
  const normalizedPath = filePath.replace(/\\/g, '/');
  const isReadme = /readme\.(md|txt)$/i.test(normalizedPath);
  const isSkillRm = normalizedPath.toLowerCase().includes('.opencode/skill/') && isReadme;
  if (normalizedPath.includes('/scratch/')) return 0.25;
  return isSkillRm ? 0.3 : (isReadme ? 0.4 : 0.5);
}

/** @deprecated Use calculateDocumentWeight() instead */
function calculateReadmeWeight(filePath: string): number {
  return calculateDocumentWeight(filePath);
}

/** Spec 126: True for structural spec documents (not memory/readme/constitutional). */
function isSpecDocumentType(documentType?: string): boolean {
  return !!documentType && documentType !== 'memory' && documentType !== 'readme' && documentType !== 'constitutional';
}

/** Find memories with similar embeddings for PE gating deduplication */
function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null } = {}): SimilarMemory[] {
  const { limit = 5, specFolder = null } = options;

  if (!embedding) {
    return [];
  }

  try {
    const results = vectorIndex.vectorSearch(embedding, {
      limit: limit,
      specFolder: specFolder,
      minSimilarity: 50,
      includeConstitutional: false
    });

    return results.map((r: Record<string, unknown>) => ({
      id: r.id as number,
      similarity: (r.similarity as number) / 100,
      content: (r.content as string) || '',
      stability: (r.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY,
      difficulty: (r.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
      file_path: r.file_path as string
    }));
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn('[PE-Gate] Vector search failed:', message);
    return [];
  }
}

/** Reinforce an existing memory's stability via FSRS scheduling instead of creating a duplicate */
function reinforceExistingMemory(memoryId: number, parsed: ParsedMemory): IndexResult {
  const database = requireDb();

  try {
    const memory = database.prepare(`
      SELECT id, stability, difficulty, last_review, review_count, title
      FROM memory_index
      WHERE id = ?
    `).get(memoryId) as Record<string, unknown> | undefined;

    if (!memory) {
      throw new Error(`Memory ${memoryId} not found for reinforcement`);
    }

    const elapsedDays = fsrsScheduler.calculateElapsedDays(memory.last_review as string | null);
    const currentStability = (memory.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY;
    const currentDifficulty = (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY;
    const retrievability = fsrsScheduler.calculateRetrievability(currentStability, elapsedDays);

    const newStability = fsrsScheduler.updateStability(
      currentStability,
      currentDifficulty,
      fsrsScheduler.GRADE_GOOD,
      retrievability
    );

    // Spec 126: Keep document-type-aware weighting on reinforcement
    const importanceWeight = calculateDocumentWeight(parsed.filePath, parsed.documentType);

    // P4-05 FIX: Check result.changes to detect no-op updates (e.g., deleted memory)
    const updateResult = database.prepare(`
      UPDATE memory_index
      SET stability = ?,
          importance_weight = ?,
          content_text = COALESCE(content_text, ?),
          last_review = datetime('now'),
          review_count = COALESCE(review_count, 0) + 1,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(newStability, importanceWeight, parsed.content, memoryId);

    if ((updateResult as { changes: number }).changes === 0) {
      throw new Error(`PE reinforcement UPDATE matched 0 rows for memory ${memoryId}`);
    }

    return {
      status: 'reinforced',
      id: memoryId,
      title: memory.title as string,
      specFolder: parsed.specFolder,
      previous_stability: currentStability,
      newStability: newStability,
      retrievability: retrievability
    };
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.error('[memory-save] PE reinforcement failed:', message);
    return { status: 'error', id: memoryId, title: '', specFolder: '', success: false, error: message };
  }
}

/** Mark a memory as superseded (deprecated) when a newer contradicting version is saved */
function markMemorySuperseded(memoryId: number): boolean {
  const database = requireDb();

  try {
    database.prepare(`
      UPDATE memory_index
      SET importance_tier = 'deprecated',
          updated_at = datetime('now')
      WHERE id = ?
    `).run(memoryId);

    console.info(`[PE-Gate] Memory ${memoryId} marked as superseded`);
    return true;
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn('[PE-Gate] Failed to mark memory as superseded:', message);
    return false;
  }
}

/** Update an existing memory's content, embedding, and metadata in-place */
function updateExistingMemory(memoryId: number, parsed: ParsedMemory, embedding: Float32Array): IndexResult {
  const database = requireDb();

  // Spec 126: Keep document-type-aware weighting and metadata on update
  const importanceWeight = calculateDocumentWeight(parsed.filePath, parsed.documentType);
  const specLevel = isSpecDocumentType(parsed.documentType)
    ? detectSpecLevelFromParsed(parsed.filePath)
    : null;

  vectorIndex.updateMemory({
    id: memoryId,
    title: parsed.title ?? undefined,
    triggerPhrases: parsed.triggerPhrases,
    importanceWeight,
    embedding: embedding,
    documentType: parsed.documentType || 'memory',
    specLevel,
    contentText: parsed.content,
    qualityScore: parsed.qualityScore,
    qualityFlags: parsed.qualityFlags,
  });

  const fileMetadata = incrementalIndex.getFileMetadata(parsed.filePath);
  const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

  database.prepare(`
    UPDATE memory_index
    SET content_hash = ?,
        context_type = ?,
        importance_tier = ?,
        importance_weight = ?,
        last_review = datetime('now'),
        review_count = COALESCE(review_count, 0) + 1,
        updated_at = datetime('now'),
        file_mtime_ms = ?,
        document_type = ?,
        spec_level = ?,
        content_text = ?,
        quality_score = ?,
        quality_flags = ?
    WHERE id = ?
  `).run(
    parsed.contentHash,
    parsed.contextType,
    parsed.importanceTier,
    importanceWeight,
    fileMtimeMs,
    parsed.documentType || 'memory',
    specLevel,
    parsed.content,
    parsed.qualityScore ?? 0,
    JSON.stringify(parsed.qualityFlags ?? []),
    memoryId
  );

  return {
    status: 'updated',
    id: memoryId,
    specFolder: parsed.specFolder,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier
  };
}

/** Log a prediction-error gating decision to the memory_conflicts table */
function logPeDecision(decision: PeDecision, contentHash: string, specFolder: string): void {
  const database = requireDb();

  try {
    const tableExists = database.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name='memory_conflicts'
    `).get();

    if (!tableExists) {
      console.warn('[PE-Gate] memory_conflicts table not yet created, skipping log');
      return;
    }

    database.prepare(`
      INSERT INTO memory_conflicts (
        new_memory_hash,
        existing_memory_id,
        similarity,
        action,
        contradiction_detected,
        reason,
        spec_folder
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      contentHash,
      decision.existingMemoryId ?? null,
      decision.similarity || 0,
      decision.action,
      decision.contradiction?.detected ? 1 : 0,
      decision.reason || '',
      specFolder
    );
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.error('[memory-save] Failed to log conflict:', message);
  }
}

/* ---------------------------------------------------------------
   5. CAUSAL LINKS PROCESSING
--------------------------------------------------------------- */

const CAUSAL_LINK_MAPPINGS: Record<string, CausalLinkMapping> = {
  caused_by: { relation: causalEdges.RELATION_TYPES.CAUSED, reverse: true },
  supersedes: { relation: causalEdges.RELATION_TYPES.SUPERSEDES, reverse: false },
  derived_from: { relation: causalEdges.RELATION_TYPES.DERIVED_FROM, reverse: false },
  blocks: { relation: causalEdges.RELATION_TYPES.ENABLED, reverse: true },
  related_to: { relation: causalEdges.RELATION_TYPES.SUPPORTS, reverse: false }
};

/** Resolve a memory reference (ID, path, or title) to a numeric memory ID */
function resolveMemoryReference(database: BetterSqlite3.Database, reference: string): number | null {
  if (!reference || typeof reference !== 'string') {
    return null;
  }

  const trimmed = reference.trim();
  if (!trimmed) {
    return null;
  }

  const numericId = parseInt(trimmed, 10);
  if (!isNaN(numericId) && numericId > 0) {
    const exists = database.prepare('SELECT id FROM memory_index WHERE id = ?').get(numericId);
    if (exists) {
      return numericId;
    }
  }

  if (trimmed.includes('session') || trimmed.match(/^\d{4}-\d{2}-\d{2}/)) {
    const bySession = database.prepare(`
      SELECT id FROM memory_index WHERE file_path LIKE ? ESCAPE '\\'
    `).get(`%${escapeLikePattern(trimmed)}%`) as Record<string, unknown> | undefined;
    if (bySession) {
      return bySession.id as number;
    }
  }

  if (trimmed.includes('specs/') || trimmed.includes('memory/')) {
    const byPath = database.prepare(`
      SELECT id FROM memory_index WHERE file_path LIKE ? ESCAPE '\\'
    `).get(`%${escapeLikePattern(trimmed)}%`) as Record<string, unknown> | undefined;
    if (byPath) {
      return byPath.id as number;
    }
  }

  const byTitleExact = database.prepare(`
    SELECT id FROM memory_index WHERE title = ?
  `).get(trimmed) as Record<string, unknown> | undefined;
  if (byTitleExact) {
    return byTitleExact.id as number;
  }

  const byTitlePartial = database.prepare(`
    SELECT id FROM memory_index WHERE title LIKE ? ESCAPE '\\'
  `).get(`%${escapeLikePattern(trimmed)}%`) as Record<string, unknown> | undefined;
  if (byTitlePartial) {
    return byTitlePartial.id as number;
  }

  return null;
}

/** Process causal link declarations from a memory file and insert edges into the graph */
function processCausalLinks(database: BetterSqlite3.Database, memoryId: number, causalLinks: CausalLinks): CausalLinksResult {
  const result: CausalLinksResult = {
    processed: 0,
    inserted: 0,
    resolved: 0,
    unresolved: [],
    errors: []
  };

  if (!causalLinks || typeof causalLinks !== 'object') {
    return result;
  }

  // Initialize causal-edges module with database connection
  causalEdges.init(database);

  const memoryIdStr = String(memoryId);

  for (const [link_type, references] of Object.entries(causalLinks)) {
    if (!Array.isArray(references) || references.length === 0) {
      continue;
    }

    const mapping = CAUSAL_LINK_MAPPINGS[link_type];
    if (!mapping) {
      console.warn(`[causal-links] Unknown link type: ${link_type}`);
      continue;
    }

    for (const reference of references) {
      result.processed++;

      const resolvedId = resolveMemoryReference(database, reference);

      if (!resolvedId) {
        result.unresolved.push({ type: link_type, reference });
        continue;
      }

      result.resolved++;

      const edgeSourceId = mapping.reverse ? String(resolvedId) : memoryIdStr;
      const edgeTargetId = mapping.reverse ? memoryIdStr : String(resolvedId);

      try {
        causalEdges.insertEdge(edgeSourceId, edgeTargetId, mapping.relation, 1.0, `Auto-extracted from ${link_type} in memory file`);
        result.inserted++;
        console.info(`[causal-links] Inserted edge: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        if (message.includes('UNIQUE constraint')) {
          console.info(`[causal-links] Edge already exists: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
        } else {
          result.errors.push({ type: link_type, reference, error: message });
          console.warn(`[causal-links] Failed to insert edge: ${message}`);
        }
      }
    }
  }

  return result;
}

/* ---------------------------------------------------------------
   6. SPEC LEVEL DETECTION (Spec 126)
--------------------------------------------------------------- */

/**
 * Detect spec documentation level for a file by checking its parent spec.md.
 * Delegates to the spec.md file in the same directory (or returns null).
 */
function detectSpecLevelFromParsed(filePath: string): number | null {
  const dir = path.dirname(filePath);
  const specMdPath = path.join(dir, 'spec.md');

  try {
    if (!fs.existsSync(specMdPath)) return null;

    // Read first 2KB for SPECKIT_LEVEL marker
    const fd = fs.openSync(specMdPath, 'r');
    let bytesRead = 0;
    const buffer = Buffer.alloc(2048);
    try {
      bytesRead = fs.readSync(fd, buffer, 0, 2048, 0);
    } finally {
      fs.closeSync(fd);
    }

    const header = buffer.toString('utf-8', 0, bytesRead);
    const levelMatch = header.match(/<!--\s*SPECKIT_LEVEL:\s*(\d\+?)\s*-->/i);
    if (levelMatch) {
      const levelStr = levelMatch[1];
      if (levelStr === '3+') return 4;
      const level = parseInt(levelStr, 10);
      if (level >= 1 && level <= 3) return level;
    }

    // Heuristic: check sibling files
    const siblings = fs.readdirSync(dir).map(f => f.toLowerCase());
    if (siblings.includes('decision-record.md')) return 3;
    if (siblings.includes('checklist.md')) return 2;
    return 1;
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------
   7. CHUNKED INDEXING FOR LARGE FILES
--------------------------------------------------------------- */

/**
 * Index a large memory file by splitting it into chunks.
 * Creates a parent record (metadata only, no embedding) and child records
 * (each with its own embedding) for each chunk.
 *
 * Parent record: embedding_status='partial', content_text=summary
 * Child records: embedding_status='success'|'pending', parent_id=parent.id
 */
async function indexChunkedMemoryFile(
  filePath: string,
  parsed: ParsedMemory,
  { force = false }: { force?: boolean } = {}
): Promise<IndexResult> {
  const database = requireDb();

  const chunkResult = chunkLargeFile(parsed.content);
  console.info(`[memory-save] Chunking ${filePath}: ${chunkResult.strategy} strategy, ${chunkResult.chunks.length} chunks`);

  // Wrap parent setup in transaction to prevent check-then-delete race condition
  const setupParent = database.transaction(() => {
    const existing = database.prepare(`
      SELECT id FROM memory_index WHERE file_path = ? AND parent_id IS NULL
    `).get(filePath) as { id: number } | undefined;

    let pid: number;

    if (existing && !force) {
      pid = existing.id;

      // Delete existing children to re-index
      database.prepare(`DELETE FROM memory_index WHERE parent_id = ?`).run(pid);

      // Update parent metadata
      const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
      const specLevel = isSpecDocumentType(parsed.documentType)
        ? detectSpecLevelFromParsed(filePath)
        : null;
      const fileMetadata = incrementalIndex.getFileMetadata(filePath);
      const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

      database.prepare(`
        UPDATE memory_index
        SET content_hash = ?,
            context_type = ?,
            importance_tier = ?,
            importance_weight = ?,
            embedding_status = 'partial',
            content_text = ?,
            updated_at = datetime('now'),
            file_mtime_ms = ?,
            document_type = ?,
            spec_level = ?,
            quality_score = ?,
            quality_flags = ?
        WHERE id = ?
      `).run(
        parsed.contentHash,
        parsed.contextType,
        parsed.importanceTier,
        importanceWeight,
        chunkResult.parentSummary,
        fileMtimeMs,
        parsed.documentType || 'memory',
        specLevel,
        parsed.qualityScore ?? 0,
        JSON.stringify(parsed.qualityFlags ?? []),
        pid
      );

      return { parentId: pid, isUpdate: true };
    } else {
      // Delete old parent+children if force re-indexing
      if (existing && force) {
        database.prepare(`DELETE FROM memory_index WHERE parent_id = ?`).run(existing.id);
        database.prepare(`DELETE FROM memory_index WHERE id = ?`).run(existing.id);
      }

      // Create parent record (no embedding)
      const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
      const specLevel = isSpecDocumentType(parsed.documentType)
        ? detectSpecLevelFromParsed(filePath)
        : null;

      pid = vectorIndex.indexMemoryDeferred({
        specFolder: parsed.specFolder,
        filePath,
        title: parsed.title,
        triggerPhrases: parsed.triggerPhrases,
        importanceWeight,
        failureReason: 'Chunked parent: embedding in children',
        documentType: parsed.documentType || 'memory',
        specLevel,
        contentText: chunkResult.parentSummary,
        qualityScore: parsed.qualityScore,
        qualityFlags: parsed.qualityFlags,
      });

      const fileMetadata = incrementalIndex.getFileMetadata(filePath);
      const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

      database.prepare(`
        UPDATE memory_index
        SET content_hash = ?,
            context_type = ?,
            importance_tier = ?,
            memory_type = ?,
            type_inference_source = ?,
            stability = ?,
            difficulty = ?,
            last_review = datetime('now'),
            review_count = 0,
            file_mtime_ms = ?,
            embedding_status = 'partial',
            quality_score = ?,
            quality_flags = ?
        WHERE id = ?
      `).run(
        parsed.contentHash,
        parsed.contextType,
        parsed.importanceTier,
        parsed.memoryType,
        parsed.memoryTypeSource,
        fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
        fileMtimeMs,
        parsed.qualityScore ?? 0,
        JSON.stringify(parsed.qualityFlags ?? []),
        pid
      );

      return { parentId: pid, isUpdate: false };
    }
  });

  const { parentId, isUpdate: existingParentUpdated } = setupParent();
  // Use existingParentUpdated below for mutation ledger (replaces `existing` variable)
  const existing = existingParentUpdated;

  // Index BM25 for parent with summary
  if (bm25Index.isBm25Enabled()) {
    try {
      const bm25 = bm25Index.getIndex();
      bm25.addDocument(String(parentId), chunkResult.parentSummary);
    } catch (bm25_err: unknown) {
      const message = toErrorMessage(bm25_err);
      console.warn(`[memory-save] BM25 indexing failed for parent: ${message}`);
    }
  }

  // Index each chunk as a child record
  let successCount = 0;
  let failedCount = 0;
  const childIds: number[] = [];
  const bm25FailedChunks: number[] = [];

  for (let i = 0; i < chunkResult.chunks.length; i++) {
    const chunk = chunkResult.chunks[i];
    const chunkTitle = `${parsed.title || 'Untitled'} [chunk ${i + 1}/${chunkResult.chunks.length}]`;

    try {
      // Generate embedding for this chunk
      let chunkEmbedding: Float32Array | null = null;
      let chunkEmbeddingStatus = 'pending';

      try {
        chunkEmbedding = await embeddings.generateDocumentEmbedding(chunk.content);
        if (chunkEmbedding) {
          chunkEmbeddingStatus = 'success';
        }
      } catch (embErr: unknown) {
        const message = toErrorMessage(embErr);
        console.warn(`[memory-save] Chunk ${i + 1} embedding failed: ${message}`);
      }

      let childId: number;
      const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);

      if (chunkEmbedding) {
        childId = vectorIndex.indexMemory({
          specFolder: parsed.specFolder,
          filePath,
          anchorId: chunk.label,
          title: chunkTitle,
          triggerPhrases: [],
          importanceWeight,
          embedding: chunkEmbedding,
          documentType: parsed.documentType || 'memory',
          contentText: chunk.content,
        });
      } else {
        childId = vectorIndex.indexMemoryDeferred({
          specFolder: parsed.specFolder,
          filePath,
          title: chunkTitle,
          triggerPhrases: [],
          importanceWeight,
          failureReason: 'Chunk embedding failed',
          documentType: parsed.documentType || 'memory',
          contentText: chunk.content,
        });
      }

      // Set parent_id, chunk_index, chunk_label on the child
      database.prepare(`
        UPDATE memory_index
        SET parent_id = ?,
            chunk_index = ?,
            chunk_label = ?,
            content_hash = ?,
            context_type = ?,
            importance_tier = ?,
            embedding_status = ?,
            stability = ?,
            difficulty = ?,
            last_review = datetime('now'),
            review_count = 0
        WHERE id = ?
      `).run(
        parentId,
        i,
        chunk.label,
        parsed.contentHash,
        parsed.contextType,
        parsed.importanceTier,
        chunkEmbeddingStatus,
        fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
        childId
      );

      childIds.push(childId);

      // BM25 index the chunk
      if (bm25Index.isBm25Enabled()) {
        try {
          const bm25 = bm25Index.getIndex();
          bm25.addDocument(String(childId), chunk.content);
        } catch (bm25_err: unknown) {
          const message = toErrorMessage(bm25_err);
          console.error(`[memory-save] BM25 indexing failed for chunk ${i + 1}: ${message}`);
          bm25FailedChunks.push(childId);
        }
      }

      successCount++;
    } catch (chunkErr: unknown) {
      failedCount++;
      const message = toErrorMessage(chunkErr);
      console.error(`[memory-save] Failed to index chunk ${i + 1}: ${message}`);
    }
  }

  // Mutation ledger
  appendMutationLedgerSafe(database, {
    mutationType: existing ? 'update' : 'create',
    reason: `memory_save: chunked indexing (${chunkResult.strategy}, ${chunkResult.chunks.length} chunks)`,
    priorHash: null,
    newHash: parsed.contentHash,
    linkedMemoryIds: [parentId, ...childIds],
    decisionMeta: {
      tool: 'memory_save',
      status: 'chunked',
      chunkStrategy: chunkResult.strategy,
      chunkCount: chunkResult.chunks.length,
      successCount,
      failedCount,
      specFolder: parsed.specFolder,
      filePath,
    },
    actor: 'mcp:memory_save',
  });

  return {
    status: existing ? 'updated' : 'indexed',
    id: parentId,
    specFolder: parsed.specFolder,
    title: parsed.title,
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    embeddingStatus: 'partial',
    message: `Chunked: ${successCount}/${chunkResult.chunks.length} chunks indexed (${chunkResult.strategy} strategy)` +
      (bm25FailedChunks.length > 0 ? ` (${bm25FailedChunks.length} BM25 failures)` : ''),
  };
}

/* ---------------------------------------------------------------
   8. INDEX MEMORY FILE
--------------------------------------------------------------- */

/** Parse, validate, and index a memory file with PE gating, FSRS scheduling, and causal links */
async function indexMemoryFile(filePath: string, { force = false, parsedOverride = null as ReturnType<typeof memoryParser.parseMemoryFile> | null, asyncEmbedding = false } = {}): Promise<IndexResult> {
  // Reuse parsed content when provided by caller to avoid a second parse.
  const parsed = parsedOverride || memoryParser.parseMemoryFile(filePath);

  const validation: ValidationResult = memoryParser.validateParsedMemory(parsed);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  if (validation.warnings && validation.warnings.length > 0) {
    console.warn(`[memory] Warning for ${path.basename(filePath)}:`);
    validation.warnings.forEach((w: string) => console.warn(`[memory]   - ${w}`));
  }

  // CHUNKING BRANCH: Large files get split into parent + child records
  if (needsChunking(parsed.content)) {
    console.info(`[memory-save] File exceeds chunking threshold (${parsed.content.length} chars), using chunked indexing`);
    return indexChunkedMemoryFile(filePath, parsed, { force });
  }

  const database = requireDb();
  const existing = database.prepare(`
    SELECT id, content_hash FROM memory_index
    WHERE file_path = ?
  `).get(filePath) as { id: number; content_hash: string } | undefined;

  if (existing && existing.content_hash === parsed.contentHash && !force) {
    return {
      status: 'unchanged',
      id: existing.id,
      specFolder: parsed.specFolder,
      title: parsed.title ?? '',
      triggerPhrases: parsed.triggerPhrases,
      contextType: parsed.contextType,
      importanceTier: parsed.importanceTier,
      warnings: validation.warnings
    };
  }

  // EMBEDDING GENERATION
  let embedding: Float32Array | null = null;
  let embeddingStatus = 'pending';
  let embeddingFailureReason: string | null = null;

  if (asyncEmbedding) {
    embeddingFailureReason = 'Deferred: async_embedding requested';
    console.info(`[memory-save] T306: Async embedding mode - deferring embedding for ${path.basename(filePath)}`);
  } else {
    try {
      embedding = await embeddings.generateDocumentEmbedding(parsed.content);
      if (embedding) {
        embeddingStatus = 'success';
      } else {
        embeddingFailureReason = 'Embedding generation returned null';
        console.warn(`[memory-save] Embedding failed for ${path.basename(filePath)}: ${embeddingFailureReason}`);
      }
    } catch (embedding_error: unknown) {
      const message = toErrorMessage(embedding_error);
      embeddingFailureReason = message;
      console.warn(`[memory-save] Embedding failed for ${path.basename(filePath)}: ${embeddingFailureReason}`);
    }
  }

  // PE GATING
  let peDecision: PeDecision = { action: 'CREATE', similarity: 0 };
  let candidates: SimilarMemory[] = [];

  if (embedding) {
    candidates = findSimilarMemories(embedding, {
      limit: 5,
      specFolder: parsed.specFolder
    });
  }

  if (candidates.length > 0) {
    peDecision = predictionErrorGate.evaluateMemory(
      parsed.contentHash,
      parsed.content,
      candidates,
      { specFolder: parsed.specFolder }
    );

    logPeDecision(peDecision, parsed.contentHash, parsed.specFolder);

    // Guard: PE actions that reference an existing memory require existingMemoryId
    if (
      (peDecision.action === predictionErrorGate.ACTION.REINFORCE ||
        peDecision.action === predictionErrorGate.ACTION.SUPERSEDE ||
        peDecision.action === predictionErrorGate.ACTION.UPDATE) &&
      peDecision.existingMemoryId == null
    ) {
      console.warn(`[Memory Save] PE decision returned ${peDecision.action} without existingMemoryId, falling through to CREATE`);
      peDecision = { action: 'CREATE', similarity: peDecision.similarity };
    }

    switch (peDecision.action) {
      case predictionErrorGate.ACTION.REINFORCE: {
        const existingId = peDecision.existingMemoryId as number;
        const priorSnapshot = getMemoryHashSnapshot(database, existingId);
        console.info(`[PE-Gate] REINFORCE: Duplicate detected (${peDecision.similarity.toFixed(1)}%)`);
        const reinforced = reinforceExistingMemory(existingId, parsed);
        reinforced.pe_action = 'REINFORCE';
        reinforced.pe_reason = peDecision.reason;
        reinforced.warnings = validation.warnings;
        reinforced.embeddingStatus = embeddingStatus;

        if (reinforced.status !== 'error') {
          appendMutationLedgerSafe(database, {
            mutationType: 'update',
            reason: 'memory_save: reinforced existing memory via prediction-error gate',
            priorHash: priorSnapshot?.content_hash ?? null,
            newHash: parsed.contentHash,
            linkedMemoryIds: [existingId],
            decisionMeta: {
              tool: 'memory_save',
              action: predictionErrorGate.ACTION.REINFORCE,
              similarity: peDecision.similarity,
              specFolder: parsed.specFolder,
              filePath,
            },
            actor: 'mcp:memory_save',
          });
        }

        return reinforced;
      }

      case predictionErrorGate.ACTION.SUPERSEDE: {
        const existingId = peDecision.existingMemoryId as number;
        console.info(`[PE-Gate] SUPERSEDE: Contradiction detected with memory ${existingId}`);
        const superseded = markMemorySuperseded(existingId);
        if (!superseded) {
          console.warn(`[PE-Gate] Failed to mark memory ${existingId} as superseded, proceeding with CREATE anyway`);
        }
        break;
      }

      case predictionErrorGate.ACTION.UPDATE: {
        const existingId = peDecision.existingMemoryId as number;
        const priorSnapshot = getMemoryHashSnapshot(database, existingId);
        console.info(`[PE-Gate] UPDATE: High similarity (${peDecision.similarity.toFixed(1)}%), updating existing`);
        if (!embedding) {
          console.warn(
            '[Memory Save] embedding unexpectedly null in UPDATE path, falling through to CREATE'
          );
          break;
        }
        const updated = updateExistingMemory(existingId, parsed, embedding);
        updated.pe_action = 'UPDATE';
        updated.pe_reason = peDecision.reason;
        updated.warnings = validation.warnings;
        updated.embeddingStatus = embeddingStatus;

        appendMutationLedgerSafe(database, {
          mutationType: 'update',
          reason: 'memory_save: updated existing memory via prediction-error gate',
          priorHash: priorSnapshot?.content_hash ?? null,
          newHash: parsed.contentHash,
          linkedMemoryIds: [existingId],
          decisionMeta: {
            tool: 'memory_save',
            action: predictionErrorGate.ACTION.UPDATE,
            similarity: peDecision.similarity,
            specFolder: parsed.specFolder,
            filePath,
          },
          actor: 'mcp:memory_save',
        });

        return updated;
      }

      case predictionErrorGate.ACTION.CREATE_LINKED: {
        console.info(`[PE-Gate] CREATE_LINKED: Related content (${peDecision.similarity.toFixed(1)}%)`);
        break;
      }

      case predictionErrorGate.ACTION.CREATE:
      default:
        if (peDecision.similarity > 0) {
          console.info(`[PE-Gate] CREATE: Low similarity (${peDecision.similarity.toFixed(1)}%)`);
        }
        break;
    }
  }

  // CREATE NEW MEMORY
  let id: number;

  // Spec 126: Detect spec level for spec documents
  const specLevel = isSpecDocumentType(parsed.documentType)
    ? detectSpecLevelFromParsed(filePath)
    : null;

  if (embedding) {
    const indexWithMetadata = database.transaction(() => {
      // Determine importance weight based on document type (Spec 126)
      const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);

      const memory_id: number = vectorIndex.indexMemory({
        specFolder: parsed.specFolder,
        filePath,
        title: parsed.title,
        triggerPhrases: parsed.triggerPhrases,
        importanceWeight,
        embedding: embedding,
        documentType: parsed.documentType || 'memory',
        specLevel,
        contentText: parsed.content,
        qualityScore: parsed.qualityScore,
        qualityFlags: parsed.qualityFlags,
      });

      const fileMetadata = incrementalIndex.getFileMetadata(filePath);
      const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

      database.prepare(`
        UPDATE memory_index
        SET content_hash = ?,
            context_type = ?,
            importance_tier = ?,
            memory_type = ?,
            type_inference_source = ?,
            stability = ?,
            difficulty = ?,
            last_review = datetime('now'),
            review_count = 0,
            file_mtime_ms = ?,
            document_type = ?,
            spec_level = ?,
            quality_score = ?,
            quality_flags = ?
        WHERE id = ?
      `).run(
        parsed.contentHash,
        parsed.contextType,
        parsed.importanceTier,
        parsed.memoryType,
        parsed.memoryTypeSource,
        fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
        fileMtimeMs,
        parsed.documentType || 'memory',
        specLevel,
        parsed.qualityScore ?? 0,
        JSON.stringify(parsed.qualityFlags ?? []),
        memory_id
      );

      if (peDecision.action === predictionErrorGate.ACTION.CREATE_LINKED && peDecision.existingMemoryId != null) {
        try {
          database.prepare(`
            UPDATE memory_index
            SET related_memories = ?
            WHERE id = ?
          `).run(JSON.stringify([peDecision.existingMemoryId]), memory_id);
        } catch (err: unknown) {
          const message = toErrorMessage(err);
          console.error('[PE-Gate] Could not store related memories:', message);
        }
      }

      if (bm25Index.isBm25Enabled()) {
        try {
          const bm25 = bm25Index.getIndex();
          bm25.addDocument(String(memory_id), parsed.content);
        } catch (bm25_err: unknown) {
          const message = toErrorMessage(bm25_err);
          console.warn(`[memory-save] BM25 indexing failed: ${message}`);
        }
      }

      return memory_id;
    });

    id = indexWithMetadata();
  } else {
    console.info(`[memory-save] Using deferred indexing for ${path.basename(filePath)}`);

    const indexDeferred = database.transaction(() => {
      // Determine importance weight based on document type (Spec 126)
      const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);

      const memory_id: number = vectorIndex.indexMemoryDeferred({
        specFolder: parsed.specFolder,
        filePath,
        title: parsed.title,
        triggerPhrases: parsed.triggerPhrases,
        importanceWeight,
        failureReason: embeddingFailureReason,
        documentType: parsed.documentType || 'memory',
        specLevel,
        contentText: parsed.content,
        qualityScore: parsed.qualityScore,
        qualityFlags: parsed.qualityFlags,
      });

      const fileMetadata = incrementalIndex.getFileMetadata(filePath);
      const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

      database.prepare(`
        UPDATE memory_index
        SET content_hash = ?,
            context_type = ?,
            importance_tier = ?,
            memory_type = ?,
            type_inference_source = ?,
            stability = ?,
            difficulty = ?,
            last_review = datetime('now'),
            review_count = 0,
            file_mtime_ms = ?,
            document_type = ?,
            spec_level = ?,
            quality_score = ?,
            quality_flags = ?
        WHERE id = ?
      `).run(
        parsed.contentHash,
        parsed.contextType,
        parsed.importanceTier,
        parsed.memoryType,
        parsed.memoryTypeSource,
        fsrsScheduler.DEFAULT_INITIAL_STABILITY,
        fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
        fileMtimeMs,
        parsed.documentType || 'memory',
        specLevel,
        parsed.qualityScore ?? 0,
        JSON.stringify(parsed.qualityFlags ?? []),
        memory_id
      );

      if (bm25Index.isBm25Enabled()) {
        try {
          const bm25 = bm25Index.getIndex();
          bm25.addDocument(String(memory_id), parsed.content);
        } catch (bm25_err: unknown) {
          const message = toErrorMessage(bm25_err);
          console.warn(`[memory-save] BM25 indexing failed (deferred path): ${message}`);
        }
      }

      return memory_id;
    });

    id = indexDeferred();
  }

  // CAUSAL LINKS PROCESSING
  let causalLinksResult: CausalLinksResult | null = null;
  if (parsed.hasCausalLinks && parsed.causalLinks) {
    try {
      causalLinksResult = processCausalLinks(database, id, parsed.causalLinks);
      if (causalLinksResult.inserted > 0) {
        console.info(`[causal-links] Processed ${causalLinksResult.inserted} causal edges for memory #${id}`);
      }
      if (causalLinksResult.unresolved.length > 0) {
        console.warn(`[causal-links] ${causalLinksResult.unresolved.length} references could not be resolved`);
      }
    } catch (causal_err: unknown) {
      const message = toErrorMessage(causal_err);
      console.warn(`[memory-save] Causal links processing failed: ${message}`);
    }
  }

  let resultStatus: string;
  if (existing) {
    resultStatus = 'updated';
  } else if (embeddingStatus !== 'success') {
    resultStatus = 'deferred';
  } else {
    resultStatus = 'indexed';
  }

  const linkedMemoryIds = [
    id,
    ...(peDecision.existingMemoryId != null ? [peDecision.existingMemoryId] : []),
  ];
  appendMutationLedgerSafe(database, {
    mutationType: existing ? 'update' : 'create',
    reason: existing
      ? 'memory_save: updated indexed memory entry'
      : 'memory_save: created new indexed memory entry',
    priorHash: existing?.content_hash ?? null,
    newHash: parsed.contentHash,
    linkedMemoryIds,
    decisionMeta: {
      tool: 'memory_save',
      status: resultStatus,
      action: peDecision.action,
      similarity: peDecision.similarity,
      specFolder: parsed.specFolder,
      filePath,
      embeddingStatus,
      qualityScore: parsed.qualityScore ?? 0,
      documentType: parsed.documentType || 'memory',
    },
    actor: 'mcp:memory_save',
  });

  const result: IndexResult = {
    status: resultStatus,
    id: id,
    specFolder: parsed.specFolder,
    title: parsed.title ?? '',
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    memoryType: parsed.memoryType,
    memoryTypeSource: parsed.memoryTypeSource,
    embeddingStatus: embeddingStatus,
    warnings: validation.warnings,
    qualityScore: parsed.qualityScore,
    qualityFlags: parsed.qualityFlags,
  };

  if (peDecision.action !== predictionErrorGate.ACTION.CREATE) {
    result.pe_action = peDecision.action;
    result.pe_reason = peDecision.reason;
  }

  if (peDecision.action === predictionErrorGate.ACTION.SUPERSEDE && peDecision.existingMemoryId != null) {
    result.superseded_id = peDecision.existingMemoryId;
  }

  if (peDecision.action === predictionErrorGate.ACTION.CREATE_LINKED && peDecision.existingMemoryId != null) {
    result.related_ids = [peDecision.existingMemoryId];
  }

  if (embeddingStatus === 'pending' && embeddingFailureReason) {
    result.embeddingFailureReason = embeddingFailureReason;
    result.message = 'Memory saved with deferred indexing - searchable via BM25/FTS5';
  }

  if (asyncEmbedding && embeddingStatus === 'pending') {
    const memoryId = id;
    const memoryContent = parsed.content;
    setImmediate(() => {
      retryManager.retryEmbedding(memoryId, memoryContent).catch((err: unknown) => {
        const message = toErrorMessage(err);
        console.warn(`[memory-save] T306: Immediate async embedding attempt failed for #${memoryId}: ${message}`);
      });
    });
  }

  if (causalLinksResult) {
    result.causalLinks = {
      processed: causalLinksResult.processed,
      inserted: causalLinksResult.inserted,
      resolved: causalLinksResult.resolved,
      unresolved_count: causalLinksResult.unresolved.length
    };
    if (causalLinksResult.errors.length > 0) {
      (result.causalLinks as Record<string, unknown>).errors = causalLinksResult.errors;
    }
  }

  return result;
}

/* ---------------------------------------------------------------
   9. MEMORY SAVE HANDLER
--------------------------------------------------------------- */

/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
async function handleMemorySave(args: SaveArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();

  const { filePath: file_path, force = false, dryRun = false, skipPreflight = false, asyncEmbedding = false } = args;

  if (!file_path || typeof file_path !== 'string') {
    throw new Error('filePath is required and must be a string');
  }

  const validatedPath: string = validateFilePathLocal(file_path);

  if (!memoryParser.isMemoryFile(validatedPath)) {
    throw new Error('File must be a .md or .txt file in: specs/**/memory/, specs/**/ (spec docs), .opencode/skill/*/constitutional/, or README.md/README.txt paths');
  }

  // PRE-FLIGHT VALIDATION
  let parsedForPreflight: ReturnType<typeof memoryParser.parseMemoryFile> | null = null;
  if (!skipPreflight) {
    parsedForPreflight = memoryParser.parseMemoryFile(validatedPath);
    const database = requireDb();

    const preflightResult = preflight.runPreflight(
      {
        content: parsedForPreflight.content,
        file_path: validatedPath,
        spec_folder: parsedForPreflight.specFolder,
        database: database,
        find_similar: findSimilarMemories as Parameters<typeof preflight.runPreflight>[0]['find_similar'],
      },
      {
        dry_run: dryRun,
        check_anchors: true,
        check_duplicates: !force,
        check_similar: false,
        check_tokens: true,
        check_size: true,
        strict_anchors: false,
      }
    );

    if (dryRun) {
      const dryRunSummary = preflightResult.dry_run_would_pass
        ? 'Pre-flight validation passed (dry-run mode)'
        : `Pre-flight validation failed: ${preflightResult.errors.length} error(s)`;

      return createMCPSuccessResponse({
        tool: 'memory_save',
        summary: dryRunSummary,
        data: {
          status: 'dry_run',
          would_pass: preflightResult.dry_run_would_pass,
          file_path: validatedPath,
          spec_folder: parsedForPreflight.specFolder,
          title: parsedForPreflight.title,
          validation: {
            errors: preflightResult.errors,
            warnings: preflightResult.warnings,
            details: preflightResult.details,
          },
          message: dryRunSummary,
        },
        hints: preflightResult.dry_run_would_pass
          ? ['Dry-run complete - no changes made']
          : ['Fix validation errors before saving', 'Use skipPreflight: true to bypass validation'],
      });
    }

    if (!preflightResult.pass) {
      const errorMessages = preflightResult.errors.map((e: string | { message: string }) =>
        typeof e === 'string' ? e : e.message
      ).join('; ');

      throw new preflight.PreflightError(
        preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID,
        `Pre-flight validation failed: ${errorMessages}`,
        {
          errors: preflightResult.errors,
          warnings: preflightResult.warnings,
          recoverable: true,
          suggestion: 'Fix the validation errors and retry, or use skipPreflight=true to bypass',
        }
      );
    }

    if (preflightResult.warnings.length > 0) {
      console.warn(`[preflight] ${validatedPath}: ${preflightResult.warnings.length} warning(s)`);
      preflightResult.warnings.forEach((w: string | { message: string }) => {
        const msg = typeof w === 'string' ? w : w.message;
        console.warn(`[preflight]   - ${msg}`);
      });
    }
  }

  const result = await indexMemoryFile(validatedPath, { force, parsedOverride: parsedForPreflight, asyncEmbedding });

  if (result.status === 'unchanged') {
    return createMCPSuccessResponse({
      tool: 'memory_save',
      summary: 'Memory already indexed with same content',
      data: {
        status: 'unchanged',
        id: result.id,
        specFolder: result.specFolder,
        title: result.title
      },
      hints: ['Use force: true to re-index anyway']
    });
  }

  triggerMatcher.clearCache();
  toolCache.invalidateOnWrite('save', { specFolder: result.specFolder, filePath: file_path });

  const response: Record<string, unknown> = {
    status: result.status,
    id: result.id,
    specFolder: result.specFolder,
    title: result.title,
    triggerPhrases: result.triggerPhrases,
    contextType: result.contextType,
    importanceTier: result.importanceTier,
    qualityScore: result.qualityScore,
    qualityFlags: result.qualityFlags,
    message: `Memory ${result.status} successfully`
  };

  if (result.pe_action) {
    response.pe_action = result.pe_action;
    response.pe_reason = result.pe_reason;
    response.message = `Memory ${result.status} (PE: ${result.pe_action})`;
  }

  if (result.superseded_id) {
    response.superseded_id = result.superseded_id;
    response.message = `${response.message} - superseded memory #${result.superseded_id}`;
  }

  if (result.related_ids) {
    response.related_ids = result.related_ids;
  }

  if (result.previous_stability !== undefined) {
    response.previous_stability = result.previous_stability;
    response.newStability = result.newStability;
    response.retrievability = result.retrievability;
  }

  if (result.warnings && result.warnings.length > 0) {
    response.warnings = result.warnings;
    response.message = `${response.message} (with ${result.warnings.length} warning(s) - anchor issues detected)`;
  }

  if (result.embeddingStatus) {
    response.embeddingStatus = result.embeddingStatus;
    if (result.embeddingStatus === 'pending') {
      response.message = `${response.message} (deferred indexing - searchable via BM25/FTS5)`;
      if (result.embeddingFailureReason) {
        response.embeddingFailureReason = result.embeddingFailureReason;
      }
    } else if (result.embeddingStatus === 'partial') {
      // Chunked indexing result
      response.message = result.message || `${response.message} (chunked indexing)`;
    }
  }

  const summary = response.message as string;
  const hints: string[] = [];
  if (result.pe_action === 'REINFORCE') {
    hints.push('Existing memory was reinforced instead of creating duplicate');
  }
  if (result.pe_action === 'SUPERSEDE') {
    hints.push(`Previous memory #${result.superseded_id} marked as deprecated`);
  }
  if (result.warnings && result.warnings.length > 0) {
    hints.push('Review anchor warnings for better searchability');
  }
  if (result.embeddingStatus === 'pending') {
    hints.push('Memory will be fully indexed when embedding provider becomes available');
    if (asyncEmbedding) {
      hints.push('Async embedding mode: immediate background attempt triggered, background retry manager as safety net');
    }
  }
  if (result.embeddingStatus === 'partial') {
    hints.push('Large file indexed via chunking: parent record + individual chunk records with embeddings');
  }
  if (result.causalLinks) {
    response.causalLinks = result.causalLinks;
    if ((result.causalLinks as Record<string, unknown>).inserted as number > 0) {
      hints.push(`Created ${(result.causalLinks as Record<string, unknown>).inserted} causal graph edge(s)`);
    }
    if ((result.causalLinks as Record<string, unknown>).unresolved_count as number > 0) {
      hints.push(`${(result.causalLinks as Record<string, unknown>).unresolved_count} causal link reference(s) could not be resolved`);
    }
  }

  if (result.embeddingStatus === 'success') {
    retryManager.processRetryQueue(2).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[memory-save] Opportunistic retry failed:', message);
    });
  }

  return createMCPSuccessResponse({
    tool: 'memory_save',
    summary,
    data: response,
    hints
  });
}

/* ---------------------------------------------------------------
   10. ATOMIC MEMORY SAVE
--------------------------------------------------------------- */

/**
 * Write content to disk and index atomically with rollback on failure.
 *
 * P4-01/P4-17 NOTE: True atomicity between file write and DB indexing is not
 * achievable here because `executeAtomicSave` requires a synchronous
 * `dbOperation` callback, while `indexMemoryFile` is async (embedding
 * generation). The current design is: (1) write file atomically, (2) index
 * asynchronously. If indexing fails, the file exists on disk but is not in
 * the DB — a partial-success state that is reported to the caller.
 */
async function atomicSaveMemory(params: AtomicSaveParams, options: AtomicSaveOptions = {}): Promise<AtomicSaveResult> {
  const { file_path, content } = params;
  const { force = false } = options;

  // Pre-index: generate the index result before the atomic write
  // so we can run the sync dbOperation inside executeAtomicSave
  let indexResult: IndexResult | null = null;
  let indexError: Error | null = null;

  // Write file and run DB operation atomically
  const result = transactionManager.executeAtomicSave(
    file_path,
    content,
    () => {
      // DB operation is a no-op during atomic write;
      // indexing happens asynchronously after the write succeeds.
    }
  );

  if (!result.success) {
    return result;
  }

  // Index the saved file (async, after atomic write succeeded)
  try {
    indexResult = await indexMemoryFile(file_path, { force });
  } catch (err: unknown) {
    indexError = err instanceof Error ? err : new Error(String(err));
  }

  if (indexError || !indexResult) {
    // File was written but indexing failed — still report partial success
    return {
      success: true,
      filePath: file_path,
      error: `File saved but indexing failed: ${indexError?.message ?? 'unknown'}`,
    };
  }

  triggerMatcher.clearCache();
  return result;
}

/** Return transaction manager metrics for atomicity monitoring */
function getAtomicityMetrics(): Record<string, unknown> {
  return transactionManager.getMetrics();
}

/* ---------------------------------------------------------------
   11. EXPORTS
--------------------------------------------------------------- */

export {
  // Primary exports
  indexMemoryFile,
  indexChunkedMemoryFile,
  handleMemorySave,
  atomicSaveMemory,
  getAtomicityMetrics,

  // PE gating helper functions
  calculateDocumentWeight,
  calculateReadmeWeight,
  findSimilarMemories,
  reinforceExistingMemory,
  markMemorySuperseded,
  updateExistingMemory,
  logPeDecision,

  // SQL helper functions
  escapeLikePattern,

  // Causal links helper functions
  processCausalLinks,
  resolveMemoryReference,
  CAUSAL_LINK_MAPPINGS,
};

// Backward-compatible aliases (snake_case)
const index_memory_file = indexMemoryFile;
const handle_memory_save = handleMemorySave;
const atomic_save_memory = atomicSaveMemory;
const get_atomicity_metrics = getAtomicityMetrics;
const calculate_document_weight = calculateDocumentWeight;
const calculate_readme_weight = calculateReadmeWeight;
const find_similar_memories = findSimilarMemories;
const reinforce_existing_memory = reinforceExistingMemory;
const mark_memory_superseded = markMemorySuperseded;
const update_existing_memory = updateExistingMemory;
const log_pe_decision = logPeDecision;
const process_causal_links = processCausalLinks;
const resolve_memory_reference = resolveMemoryReference;

export {
  index_memory_file,
  handle_memory_save,
  atomic_save_memory,
  get_atomicity_metrics,
  calculate_document_weight,
  calculate_readme_weight,
  find_similar_memories,
  reinforce_existing_memory,
  mark_memory_superseded,
  update_existing_memory,
  log_pe_decision,
  process_causal_links,
  resolve_memory_reference,
};
