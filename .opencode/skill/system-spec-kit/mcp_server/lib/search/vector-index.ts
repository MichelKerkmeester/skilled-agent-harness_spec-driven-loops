// ---------------------------------------------------------------
// MODULE: Vector Index
// SQLite + sqlite-vec vector store with FTS5, caching, and
// schema migration support.
// ---------------------------------------------------------------

// Node stdlib
import * as path from 'path';
import * as os from 'os';

// External packages
import Database from 'better-sqlite3';

// Internal modules
import { validateFilePath } from '../utils/path-security';

/* -----------------------------------------------------------
   1. TYPES
----------------------------------------------------------------*/

interface MemoryIndexRow {
  id: number;
  spec_folder: string;
  file_path: string;
  anchor_id: string | null;
  title: string | null;
  trigger_phrases: string | null;
  triggerPhrases?: string | string[];
  importance_weight: number;
  created_at: string;
  updated_at: string;
  embedding_model: string | null;
  embedding_generated_at: string | null;
  embedding_status: string;
  retry_count: number;
  last_retry_at: string | null;
  failure_reason: string | null;
  importance_tier: string;
  access_count: number;
  last_accessed: number;
  confidence: number;
  validation_count: number;
  is_pinned: number;
  stability: number;
  difficulty: number;
  last_review: string | null;
  review_count: number;
  content_hash: string | null;
  related_memories: string | null;
  document_type?: string;
  spec_level?: number | null;
  isConstitutional?: boolean;
  similarity?: number;
  keywordScore?: number;
  [key: string]: unknown;
}

interface IndexMemoryParams {
  specFolder: string;
  filePath: string;
  anchorId?: string | null;
  title?: string | null;
  triggerPhrases?: string[];
  importanceWeight?: number;
  embedding: Float32Array | number[];
  documentType?: string;
  specLevel?: number | null;
  contentText?: string | null;
}

interface UpdateMemoryParams {
  id: number;
  title?: string;
  triggerPhrases?: string[];
  importanceWeight?: number;
  importanceTier?: string;
  embedding?: Float32Array | number[];
  documentType?: string;
  specLevel?: number | null;
  contentText?: string | null;
}

interface VectorSearchOptions {
  limit?: number;
  specFolder?: string | null;
  minSimilarity?: number;
  useDecay?: boolean;
  tier?: string | null;
  contextType?: string | null;
  includeConstitutional?: boolean;
  includeArchived?: boolean;
}

interface EnrichedResult {
  rank: number;
  similarity: number;
  title: string;
  specFolder: string;
  filePath: string;
  date: string | null;
  tags: string[];
  snippet: string;
  id: number;
  importanceWeight: number;
  searchMethod: string;
  isConstitutional: boolean;
}

interface CleanupCandidate {
  id: number;
  specFolder: string;
  filePath: string;
  title: string;
  createdAt: string;
  lastAccessedAt: number;
  accessCount: number;
  confidence: number;
  ageString: string;
  lastAccessString: string;
  reasons: string[];
}

interface IntegrityReport {
  totalMemories: number;
  totalVectors: number;
  orphanedVectors: number;
  missingVectors: number;
  orphanedFiles: Array<{ id: number; file_path: string; reason: string }>;
  isConsistent: boolean;
  cleaned?: { vectors: number };
}

interface DimensionValidation {
  valid: boolean;
  stored: number | null;
  current: number | null;
  warning?: string;
  reason?: string;
}

/* -----------------------------------------------------------
   1. CONFIGURATION
----------------------------------------------------------------*/

const EMBEDDING_DIM = 768;

function getEmbeddingDim(): number {
  return jsVectorIndex.getEmbeddingDim();
}

async function getConfirmedEmbeddingDimension(timeoutMs: number = 5000): Promise<number> {
  return jsVectorIndex.getConfirmedEmbeddingDimension(timeoutMs);
}

function validateEmbeddingDimension(): DimensionValidation {
  return jsVectorIndex.validateEmbeddingDimension();
}

// P1-05 FIX: Unified env var precedence — SPEC_KIT_DB_DIR (canonical) > MEMORY_DB_DIR (legacy)
const DEFAULT_DB_DIR: string = process.env.SPEC_KIT_DB_DIR || process.env.MEMORY_DB_DIR || path.resolve(__dirname, '../../database');
const DEFAULT_DB_PATH: string = process.env.MEMORY_DB_PATH || path.join(DEFAULT_DB_DIR, 'context-index.sqlite');

/* -----------------------------------------------------------
   2. SECURITY HELPERS
----------------------------------------------------------------*/

// P1-06 FIX: Unified allowed paths — includes specs, .opencode, homedir/.claude, cwd, and env overrides
const ALLOWED_BASE_PATHS: string[] = [
  path.join(process.cwd(), 'specs'),
  path.join(process.cwd(), '.opencode'),
  path.join(os.homedir(), '.claude'),
  process.cwd(),
  ...(process.env.MEMORY_ALLOWED_PATHS ? process.env.MEMORY_ALLOWED_PATHS.split(':') : []),
].filter(Boolean).map(p => path.resolve(p));

function validateFilePathLocal(filePath: string): string | null {
  return validateFilePath(filePath, ALLOWED_BASE_PATHS);
}

/* -----------------------------------------------------------
   3-4. DATABASE SINGLETON, PREPARED STATEMENTS, CONSTITUTIONAL CACHE
   All managed by vector-index-impl.js — facade delegates directly.
----------------------------------------------------------------*/

function clearConstitutionalCache(specFolder?: string | null): void {
  jsVectorIndex.clearConstitutionalCache(specFolder);
}

/* -----------------------------------------------------------
   5-6. SCHEMA & DB INIT (delegated to JS - too large to inline)
   These functions call through to the .js versions via require.
   The schema creation, migration, and initialization logic remain
   in vector-index.js; this .ts file wraps and re-exports them.
----------------------------------------------------------------*/

// For the massive schema/migration functions, we delegate to the JS
// implementation to avoid duplicating 1000+ lines of SQL DDL.
import * as jsVectorIndex from './vector-index-impl';

function initializeDb(customPath?: string | null): Database.Database {
  return jsVectorIndex.initializeDb(customPath);
}

/* -----------------------------------------------------------
   7. CORE OPERATIONS (thin typed wrappers)
----------------------------------------------------------------*/

function indexMemory(params: IndexMemoryParams): number {
  return jsVectorIndex.indexMemory(params);
}

function indexMemoryDeferred(params: Omit<IndexMemoryParams, 'embedding'> & { failureReason?: string | null }): number {
  return jsVectorIndex.indexMemoryDeferred(params);
}

function updateMemory(params: UpdateMemoryParams): number {
  return jsVectorIndex.updateMemory(params);
}

function deleteMemory(id: number): boolean {
  return jsVectorIndex.deleteMemory(id);
}

function deleteMemoryByPath(specFolder: string, filePath: string, anchorId?: string | null): boolean {
  return jsVectorIndex.deleteMemoryByPath(specFolder, filePath, anchorId);
}

function getMemory(id: number): MemoryIndexRow | null {
  return jsVectorIndex.getMemory(id);
}

function getMemoriesByFolder(specFolder: string): MemoryIndexRow[] {
  return jsVectorIndex.getMemoriesByFolder(specFolder);
}

function getMemoryCount(): number {
  return jsVectorIndex.getMemoryCount();
}

function getStatusCounts(): Record<string, number> {
  return jsVectorIndex.getStatusCounts();
}

function getStats(): { total: number; pending: number; success: number; failed: number; retry: number } {
  return jsVectorIndex.getStats();
}

/* -----------------------------------------------------------
   8. SEARCH (thin typed wrappers)
----------------------------------------------------------------*/

function vectorSearch(queryEmbedding: Float32Array | number[], options: VectorSearchOptions = {}): MemoryIndexRow[] {
  return jsVectorIndex.vectorSearch(queryEmbedding, options);
}

function getConstitutionalMemoriesPublic(options: { specFolder?: string | null; maxTokens?: number } = {}): MemoryIndexRow[] {
  return jsVectorIndex.getConstitutionalMemories(options);
}

function multiConceptSearch(conceptEmbeddings: Array<Float32Array | number[]>, options: { limit?: number; specFolder?: string | null; minSimilarity?: number; includeArchived?: boolean } = {}): MemoryIndexRow[] {
  return jsVectorIndex.multiConceptSearch(conceptEmbeddings, options);
}

function isVectorSearchAvailable(): boolean {
  return jsVectorIndex.isVectorSearchAvailable();
}

async function vectorSearchEnriched(query: string, limit: number = 20, options: { specFolder?: string | null; minSimilarity?: number } = {}): Promise<EnrichedResult[]> {
  return jsVectorIndex.vectorSearchEnriched(query, limit, options);
}

async function multiConceptSearchEnriched(concepts: Array<string | Float32Array | number[]>, limit: number = 20, options: { specFolder?: string | null; minSimilarity?: number } = {}): Promise<EnrichedResult[]> {
  return jsVectorIndex.multiConceptSearchEnriched(concepts, limit, options);
}

function keywordSearch(query: string, options: { limit?: number; specFolder?: string | null } = {}): MemoryIndexRow[] {
  return jsVectorIndex.keywordSearch(query, options);
}

async function multiConceptKeywordSearch(concepts: string[], limit: number = 20, options: { specFolder?: string | null } = {}): Promise<EnrichedResult[]> {
  return jsVectorIndex.multiConceptKeywordSearch(concepts, limit, options) as unknown as Promise<EnrichedResult[]>;
}

async function cachedSearch(query: string, limit: number = 20, options: Record<string, unknown> = {}): Promise<EnrichedResult[]> {
  return jsVectorIndex.cachedSearch(query, limit, options);
}

function clearSearchCache(specFolder: string | null = null): number {
  return jsVectorIndex.clearSearchCache(specFolder);
}

function applySmartRanking(results: EnrichedResult[]): EnrichedResult[] {
  return jsVectorIndex.applySmartRanking(results);
}

function applyDiversity(results: EnrichedResult[], diversityFactor: number = 0.3): EnrichedResult[] {
  return jsVectorIndex.applyDiversity(results, diversityFactor);
}

function learnFromSelection(searchQuery: string, selectedMemoryId: number): boolean {
  return jsVectorIndex.learnFromSelection(searchQuery, selectedMemoryId);
}

async function enhancedSearch(query: string, limit: number = 20, options: Record<string, unknown> = {}): Promise<EnrichedResult[]> {
  return jsVectorIndex.enhancedSearch(query, limit, options);
}

/* -----------------------------------------------------------
   9. RELATED & USAGE
----------------------------------------------------------------*/

async function linkRelatedOnSave(newMemoryId: number, content: string): Promise<void> {
  return jsVectorIndex.linkRelatedOnSave(newMemoryId, content);
}

function getRelatedMemories(memoryId: number): MemoryIndexRow[] {
  return jsVectorIndex.getRelatedMemories(memoryId);
}

function recordAccess(memoryId: number): boolean {
  return jsVectorIndex.recordAccess(memoryId);
}

function getUsageStats(options: { sortBy?: string; order?: string; limit?: number } = {}): Array<Record<string, unknown>> {
  return jsVectorIndex.getUsageStats(options);
}

function updateEmbeddingStatus(id: number, status: string): boolean {
  return jsVectorIndex.updateEmbeddingStatus(id, status);
}

function updateConfidence(memoryId: number, confidence: number): boolean {
  return jsVectorIndex.updateConfidence(memoryId, confidence);
}

/* -----------------------------------------------------------
   10. CLEANUP & UTILITIES
----------------------------------------------------------------*/

function findCleanupCandidates(options: { maxAgeDays?: number; maxAccessCount?: number; maxConfidence?: number; limit?: number } = {}): CleanupCandidate[] {
  return jsVectorIndex.findCleanupCandidates(options);
}

function deleteMemories(memoryIds: number[]): { deleted: number; failed: number } {
  return jsVectorIndex.deleteMemories(memoryIds);
}

function getMemoryPreview(memoryId: number, maxLines: number = 50): Record<string, unknown> | null {
  return jsVectorIndex.getMemoryPreview(memoryId, maxLines);
}

function extractTitle(content: string, filename?: string): string {
  return jsVectorIndex.extractTitle(content, filename);
}

function extractSnippet(content: string, maxLength: number = 200): string {
  return jsVectorIndex.extractSnippet(content, maxLength);
}

function extractTags(content: string): string[] {
  return jsVectorIndex.extractTags(content) as string[];
}

function extractDate(content: string, filePath?: string): string | null {
  return jsVectorIndex.extractDate(content, filePath);
}

async function generateQueryEmbedding(query: string): Promise<Float32Array | null> {
  return jsVectorIndex.generateQueryEmbedding(query);
}

function parseQuotedTerms(query: string): string[] {
  return jsVectorIndex.parseQuotedTerms(query);
}

function getCacheKey(query: string, limit: number, options: Record<string, unknown>): string {
  return jsVectorIndex.getCacheKey(query, limit, options);
}

function closeDb(): void {
  jsVectorIndex.closeDb();
}

function getDbPath(): string {
  return jsVectorIndex.getDbPath();
}

function getDb(): Database.Database | null {
  return jsVectorIndex.getDb();
}

function verifyIntegrity(options: { autoClean?: boolean } = {}): IntegrityReport {
  return jsVectorIndex.verifyIntegrity(options);
}

const SQLiteVectorStore: {
  new(options?: { dbPath?: string }): {
    search(embedding: Float32Array, topK: number, options?: Record<string, unknown>): Promise<MemoryIndexRow[]>;
    upsert(id: string, embedding: Float32Array, metadata: Record<string, unknown>): Promise<number>;
    delete(id: number): Promise<boolean>;
    get(id: number): Promise<MemoryIndexRow | null>;
    getStats(): Promise<{ total: number; pending: number; success: number; failed: number; retry: number }>;
    isAvailable(): boolean;
    getEmbeddingDimension(): number;
    close(): Promise<void>;
    deleteByPath(specFolder: string, filePath: string, anchorId?: string | null): Promise<boolean>;
    getByFolder(specFolder: string): Promise<MemoryIndexRow[]>;
    searchEnriched(embedding: Float32Array, options?: Record<string, unknown>): Promise<EnrichedResult[]>;
    enhancedSearch(embedding: Float32Array, options?: Record<string, unknown>): Promise<EnrichedResult[]>;
    getConstitutionalMemories(options?: Record<string, unknown>): Promise<MemoryIndexRow[]>;
    verifyIntegrity(options?: Record<string, unknown>): Promise<IntegrityReport>;
  };
} = jsVectorIndex.SQLiteVectorStore;

/* -----------------------------------------------------------
   11. EXPORTS
----------------------------------------------------------------*/

export {
  // Initialization
  initializeDb,
  closeDb,
  getDb,
  getDbPath,

  // Core operations
  indexMemory,
  indexMemoryDeferred,
  updateMemory,
  deleteMemory,
  deleteMemoryByPath,

  // Queries
  getMemory,
  getMemoriesByFolder,
  getMemoryCount,
  getStatusCounts,
  getStats,
  verifyIntegrity,

  // Search - Basic
  vectorSearch,
  getConstitutionalMemoriesPublic as getConstitutionalMemories,
  clearConstitutionalCache,
  multiConceptSearch,
  isVectorSearchAvailable,

  // Search - Enriched
  vectorSearchEnriched,
  multiConceptSearchEnriched,
  keywordSearch,
  multiConceptKeywordSearch,

  // Search - Cached
  cachedSearch,
  clearSearchCache,

  // Smart Ranking & Diversity
  applySmartRanking,
  applyDiversity,
  learnFromSelection,
  enhancedSearch,

  // Related Memories
  linkRelatedOnSave,
  getRelatedMemories,

  // Usage Tracking
  recordAccess,
  getUsageStats,
  updateConfidence,

  // Embedding Status
  updateEmbeddingStatus,

  // Cleanup
  findCleanupCandidates,
  deleteMemories,
  getMemoryPreview,

  // Content Extraction
  extractTitle,
  extractSnippet,
  extractTags,
  extractDate,

  // Query Utilities
  generateQueryEmbedding,
  parseQuotedTerms,

  // Security
  validateFilePathLocal as validateFilePath,

  // Embedding Dimension
  getConfirmedEmbeddingDimension,
  getEmbeddingDim,
  validateEmbeddingDimension,

  // Cache Utilities
  getCacheKey,

  // Constants
  EMBEDDING_DIM,
  DEFAULT_DB_PATH,

  // Protocol Abstractions
  SQLiteVectorStore,
};

export type {
  MemoryIndexRow,
  IndexMemoryParams,
  UpdateMemoryParams,
  VectorSearchOptions,
  EnrichedResult,
  CleanupCandidate,
  IntegrityReport,
  DimensionValidation,
};
