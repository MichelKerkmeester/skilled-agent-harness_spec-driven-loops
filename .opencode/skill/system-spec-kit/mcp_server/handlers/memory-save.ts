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
import { LIB_DIR, SHARED_DIR, ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core';
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
import { createMCPSuccessResponse } from '../lib/response/envelope';
import * as retryManager from '../lib/providers/retry-manager';
import * as causalEdges from '../lib/storage/causal-edges';
import { requireDb, toErrorMessage } from '../utils';
import type { MCPResponse, DatabaseExtended as Database } from './types';
import type BetterSqlite3 from 'better-sqlite3';

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

// FileMetadata: uses incrementalIndex.FileMetadata (has .mtime, not .mtimeMs)

interface AtomicSaveParams {
  file_path: string;
  content: string;
}

interface AtomicSaveOptions {
  force?: boolean;
  // P4-09 FIX: Removed rollback_on_failure and create_pending_on_failure
  // which were declared but never read by any code path.
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
  // P4-08 FIX: Throw on non-string input instead of silently returning it,
  // which would cause downstream SQL errors or logic bugs.
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

    console.error(`[PE-Gate] Memory ${memoryId} marked as superseded`);
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
        content_text = ?
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
      console.error('[PE-Gate] memory_conflicts table not yet created, skipping log');
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
        console.error(`[causal-links] Inserted edge: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        if (message.includes('UNIQUE constraint')) {
          console.error(`[causal-links] Edge already exists: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
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
   5b. SPEC LEVEL DETECTION (Spec 126)
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
   6. INDEX MEMORY FILE
--------------------------------------------------------------- */

/** Parse, validate, and index a memory file with PE gating, FSRS scheduling, and causal links */
// T306: Added asyncEmbedding option to support non-blocking embedding generation
async function indexMemoryFile(filePath: string, { force = false, parsedOverride = null as ReturnType<typeof memoryParser.parseMemoryFile> | null, asyncEmbedding = false } = {}): Promise<IndexResult> {
  // P4-04 FIX: Accept pre-parsed result to avoid double-parsing when caller
  // (e.g., handleMemorySave) has already parsed the file for preflight.
  const parsed = parsedOverride || memoryParser.parseMemoryFile(filePath);

  const validation: ValidationResult = memoryParser.validateParsedMemory(parsed);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  if (validation.warnings && validation.warnings.length > 0) {
    console.warn(`[memory] Warning for ${path.basename(filePath)}:`);
    validation.warnings.forEach((w: string) => console.warn(`[memory]   - ${w}`));
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

  // T306: When asyncEmbedding is true, skip synchronous embedding generation entirely.
  // The memory is saved with embedding_status='pending' and an immediate background
  // attempt is triggered after save (fire-and-forget, non-blocking).
  if (asyncEmbedding) {
    embeddingFailureReason = 'Deferred: async_embedding requested';
    console.error(`[memory-save] T306: Async embedding mode - deferring embedding for ${path.basename(filePath)}`);
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
        console.error(`[PE-Gate] REINFORCE: Duplicate detected (${peDecision.similarity.toFixed(1)}%)`);
        const reinforced = reinforceExistingMemory(existingId, parsed);
        reinforced.pe_action = 'REINFORCE';
        reinforced.pe_reason = peDecision.reason;
        reinforced.warnings = validation.warnings;
        reinforced.embeddingStatus = embeddingStatus;
        return reinforced;
      }

      case predictionErrorGate.ACTION.SUPERSEDE: {
        const existingId = peDecision.existingMemoryId as number;
        console.error(`[PE-Gate] SUPERSEDE: Contradiction detected with memory ${existingId}`);
        // P4-03 FIX: Check return value of markMemorySuperseded instead of ignoring it
        const superseded = markMemorySuperseded(existingId);
        if (!superseded) {
          console.warn(`[PE-Gate] Failed to mark memory ${existingId} as superseded, proceeding with CREATE anyway`);
        }
        break;
      }

      case predictionErrorGate.ACTION.UPDATE: {
        const existingId = peDecision.existingMemoryId as number;
        console.error(`[PE-Gate] UPDATE: High similarity (${peDecision.similarity.toFixed(1)}%), updating existing`);
        // T048: Guard embedding null in UPDATE path (prevents non-null assertion)
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
        return updated;
      }

      case predictionErrorGate.ACTION.CREATE_LINKED: {
        console.error(`[PE-Gate] CREATE_LINKED: Related content (${peDecision.similarity.toFixed(1)}%)`);
        break;
      }

      case predictionErrorGate.ACTION.CREATE:
      default:
        if (peDecision.similarity > 0) {
          console.error(`[PE-Gate] CREATE: Low similarity (${peDecision.similarity.toFixed(1)}%)`);
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
            spec_level = ?
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

      // P4-07 FIX: BM25 indexing moved inside transaction so it only runs
      // if the DB transaction succeeds (prevents BM25/DB inconsistency).
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
    console.error(`[memory-save] Using deferred indexing for ${path.basename(filePath)}`);

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
            spec_level = ?
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
        memory_id
      );

      // P4-07 FIX: BM25 indexing inside deferred transaction too
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
        console.error(`[causal-links] Processed ${causalLinksResult.inserted} causal edges for memory #${id}`);
      }
      if (causalLinksResult.unresolved.length > 0) {
        console.error(`[causal-links] ${causalLinksResult.unresolved.length} references could not be resolved`);
      }
    } catch (causal_err: unknown) {
      const message = toErrorMessage(causal_err);
      console.warn(`[memory-save] Causal links processing failed: ${message}`);
    }
  }

  // P4-06 FIX: Distinguish deferred indexing from true 'indexed' status.
  // When embedding is null (deferred path), report 'deferred' instead of 'indexed'.
  let resultStatus: string;
  if (existing) {
    resultStatus = 'updated';
  } else if (embeddingStatus !== 'success') {
    resultStatus = 'deferred';
  } else {
    resultStatus = 'indexed';
  }

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
    warnings: validation.warnings
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

  // T306: When async embedding was requested, trigger an immediate non-blocking
  // embedding attempt via setImmediate. This fires after the current response is
  // returned, so concurrent saves are not blocked. The existing background retry
  // manager (5-min interval) serves as a safety net if this attempt fails.
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
   7. MEMORY SAVE HANDLER
--------------------------------------------------------------- */

/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
async function handleMemorySave(args: SaveArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();

  // T306: Extract asyncEmbedding option (default false for backward compatibility)
  const { filePath: file_path, force = false, dryRun = false, skipPreflight = false, asyncEmbedding = false } = args;

  if (!file_path || typeof file_path !== 'string') {
    throw new Error('filePath is required and must be a string');
  }

  const validatedPath: string = validateFilePathLocal(file_path);

  if (!memoryParser.isMemoryFile(validatedPath)) {
    throw new Error('File must be a .md or .txt file in: specs/**/memory/, specs/**/ (spec docs), .opencode/skill/*/constitutional/, or README.md/README.txt paths');
  }

  // PRE-FLIGHT VALIDATION
  // P4-04 FIX: Hoist parsed result so it can be reused by indexMemoryFile,
  // avoiding a redundant second parse of the same file.
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
      console.error(`[preflight] ${validatedPath}: ${preflightResult.warnings.length} warning(s)`);
      preflightResult.warnings.forEach((w: string | { message: string }) => {
        const msg = typeof w === 'string' ? w : w.message;
        console.error(`[preflight]   - ${msg}`);
      });
    }
  }

  // T306: Pass asyncEmbedding to indexMemoryFile for non-blocking embedding generation
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
    // T306: Differentiate hint for explicit async embedding vs provider failure
    if (asyncEmbedding) {
      hints.push('Async embedding mode: immediate background attempt triggered, background retry manager as safety net');
    }
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

  // T306: Opportunistic retry — when a sync embedding succeeds, piggyback on the
  // success to process other pending embeddings in the queue (fire-and-forget).
  // This complements the immediate retry triggered by asyncEmbedding in indexMemoryFile.
  if (result.embeddingStatus === 'success') {
    retryManager.processRetryQueue(2).catch((err: Error) => {
      console.warn('[memory-save] Opportunistic retry failed:', err.message);
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
   8. ATOMIC MEMORY SAVE
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
   9. EXPORTS
--------------------------------------------------------------- */

export {
  // Primary exports
  indexMemoryFile,
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
