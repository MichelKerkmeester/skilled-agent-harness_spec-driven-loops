// ---------------------------------------------------------------
// MODULE: Types
// ---------------------------------------------------------------

import type { HfLocalDtype } from './embeddings/providers/hf-local.js';
// Single source of truth for cross-workspace types.
// Used across shared/, runtime/, and scripts/.
// ---------------------------------------------------------------
// 1. EMBEDDING TYPES
// ---------------------------------------------------------------

/** Embedding profile descriptor (provider + model + dimension) */
export interface EmbeddingProfileData {
  provider: string;
  model: string;
  dim: number;
  dtype?: string | null;
  baseUrl?: string | null;
  slug?: string;
}

/**
 * Canonical embedding profile — minimal shape used across handlers.
 * Prefer this over re-declaring { provider, model, dim } locally.
 */
export interface EmbeddingProfile {
  provider: string;
  model: string;
  dim: number;
  dtype?: string | null;
}

/**
 * Extended embedding profile with database path resolution.
 * Used by handlers that need to resolve DB paths from profile info.
 */
export interface EmbeddingProfileExtended extends EmbeddingProfile {
  getDatabasePath: (basePath: string) => string | null;
}

/** Interface for all embedding providers (HfLocal, OpenAI, Voyage) */
export interface IEmbeddingProvider {
  generateEmbedding(text: string): Promise<Float32Array | null>;
  embedDocument(text: string): Promise<Float32Array | null>;
  embedQuery(text: string): Promise<Float32Array | null>;
  embedBatch?(texts: ReadonlyArray<string>, inputType: 'document' | 'query'): Promise<(Float32Array | null)[]>;
  warmup(): Promise<boolean>;
  dispose?(): Promise<void>;
  getMetadata(): ProviderMetadata;
  getProfile(): EmbeddingProfileData | { provider: string; model: string; dim: number; dtype?: string | null; baseUrl?: string | null; slug: string };
  healthCheck(): Promise<boolean>;
  getProviderName(): string;
}

/** Provider metadata returned by getMetadata() */
export type EmbeddingProfileDtype = HfLocalDtype | 'cloud';

export interface ProviderMetadata {
  provider: string;
  model: string;
  dim: number;
  dtype?: EmbeddingProfileDtype | null;
  healthy: boolean;
  serverState?: string | null;
  device?: string | null;
  loaded?: boolean;
  loadTimeMs?: number | null;
  loadStartedAt?: string | null;
  loadProgressAt?: string | null;
  inferenceP50Ms?: number | null;
  inferenceP95Ms?: number | null;
  lastInferenceMs?: number | null;
  queueDepth?: number | null;
  baseUrl?: string;
  requestCount?: number;
  totalTokens?: number;
}

/** Usage statistics for API-based providers (OpenAI, Voyage) */
export interface UsageStats {
  requestCount: number;
  totalTokens: number;
  estimatedCost: number;
}

/** Provider info returned by getProviderInfo() without creating the provider */
export interface ProviderInfo {
  provider: string;
  reason: string;
  config: Record<string, string>;
}

/** Resolution result from resolveProvider() */
export interface ProviderResolution {
  name: string;
  reason: string;
}

/** Options for createEmbeddingsProvider() */
export interface CreateProviderOptions {
  provider?: string;
  model?: string;
  dim?: number;
  dtype?: HfLocalDtype;
  apiKey?: string;
  warmup?: boolean;
  baseUrl?: string;
  maxTextLength?: number;
  timeout?: number;
}

/** API key validation result */
export interface ApiKeyValidationResult {
  valid: boolean;
  provider: string;
  reason?: string;
  error?: string;
  errorCode?: string;
  httpStatus?: number;
  warning?: string;
  actions?: string[];
  networkError?: boolean;
}

/** Embedding cache statistics */
export interface EmbeddingCacheStats {
  size: number;
  maxSize: number;
}

/** Lazy loading statistics for diagnostics */
export interface LazyLoadingStats {
  isInitialized: boolean;
  isInitializing: boolean;
  eagerWarmupEnabled: boolean;
  initStartTime: number | null;
  initCompleteTime: number | null;
  initDurationMs: number | null;
  firstEmbeddingTime: number | null;
  timeToFirstEmbeddingMs: number | null;
}

/** Batch embedding options */
export interface BatchEmbeddingOptions {
  delayMs?: number;
  verbose?: boolean;
}

/** Model dimensions lookup for API providers */
export type ModelDimensions = Record<string, number>;

// ---------------------------------------------------------------
// 2. RETRY / ERROR CLASSIFICATION TYPES
// ---------------------------------------------------------------

/** Configuration for retry with exponential backoff */
export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  exponentialBase: number;
}

/** Error classification result */
export interface ErrorClassification {
  type: 'transient' | 'permanent' | 'unknown';
  reason: string;
  shouldRetry: boolean;
}

/** Options for retryWithBackoff() */
export interface RetryOptions {
  operationName?: string;
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  exponentialBase?: number;
  onRetry?: ((attempt: number, error: Error, delay: number) => void | Promise<void>) | null;
  shouldRetry?: ((error: Error, attempt: number, classification: ErrorClassification) => boolean) | null;
}

/** Attempt log entry for retry diagnostics */
export interface RetryAttemptLogEntry {
  attempt: number;
  success: boolean;
  isRetry: boolean;
  errorType?: string;
  errorMessage?: string;
  classificationReason?: string;
  timestamp: string;
}

// ---------------------------------------------------------------
// 3. FOLDER SCORING TYPES
// ---------------------------------------------------------------

/** Archive pattern with multiplier for folder scoring */
export interface ArchivePattern {
  pattern: RegExp;
  multiplier: number;
  type: string;
}

/** Composite folder score with component breakdowns */
export interface FolderScore {
  folder: string;
  simplified: string;
  count: number;
  /** Composite folder relevance score (0-1), weighted combination of component scores. */
  score: number;
  /** How recently the folder was active (0-1). Higher = more recent activity. */
  recencyScore: number;
  /** Based on highest importance tier in folder (0-1). Maps tier rank to normalized weight. */
  importanceScore: number;
  /** Memory count and activity level (0-1). Reflects folder density and engagement. */
  activityScore: number;
  /** User validation feedback ratio (0-1). Proportion of positive validations. */
  validationScore: number;
  lastActivity: string;
  isArchived: boolean;
  topTier: string;
  [key: string]: unknown;
}

/** Options for computeFolderScores() */
export interface FolderScoreOptions {
  excludePatterns?: string[];
  includeArchived?: boolean;
  limit?: number;
}

/** Score weights for folder composite scoring */
export interface ScoreWeights {
  recency: number;
  importance: number;
  activity: number;
  validation: number;
}

/** Tier weights mapping tier names to numeric weights */
export type TierWeights = Record<string, number>;

/** Ranking mode for folder results */
export type RankingMode = 'score' | 'recency' | 'activity' | 'importance';

// ---------------------------------------------------------------
// 4. CHUNKING TYPES
// ---------------------------------------------------------------

/** Priority patterns for semantic chunking */
export interface PriorityPatterns {
  high: RegExp;
  medium: RegExp;
}

/** Priority buckets for section classification */
export interface PriorityBuckets {
  critical: string[];
  high: string[];
  medium: string[];
  low: string[];
}

// ---------------------------------------------------------------
// 5. TRIGGER EXTRACTOR TYPES
// ---------------------------------------------------------------

/** Trigger extractor configuration */
export interface TriggerConfig {
  MIN_PHRASE_COUNT: number;
  MAX_PHRASE_COUNT: number;
  MIN_WORD_LENGTH: number;
  MIN_UNIGRAM_LENGTH: number;
  MIN_CONTENT_LENGTH: number;
  MIN_FREQUENCY: number;
  LENGTH_BONUS: {
    UNIGRAM: number;
    BIGRAM: number;
    TRIGRAM: number;
    QUADGRAM: number;
  };
  PRIORITY_BONUS: {
    PROBLEM_TERM: number;
    TECHNICAL_TERM: number;
    DECISION_TERM: number;
    ACTION_TERM: number;
    COMPOUND_NOUN: number;
  };
}

/** Individual trigger phrase with score and type */
export interface TriggerPhrase {
  phrase: string;
  score: number;
  type?: string;
  count?: number;
}

/** N-gram count result */
export interface NgramCount {
  phrase: string;
  count: number;
}

/** Scored n-gram with optional count */
export interface ScoredNgram {
  phrase: string;
  score: number;
  count?: number;
}

/** Extraction statistics from trigger phrase extraction */
export interface ExtractionStats {
  inputLength: number;
  cleanedLength: number;
  tokenCount: number;
  filteredTokenCount: number;
  phraseCount: number;
  extractionTimeMs: number;
}

/** Breakdown of extracted phrase types */
export interface ExtractionBreakdown {
  problemTerms: number;
  technicalTerms: number;
  decisionTerms: number;
  actionTerms: number;
  compoundNouns: number;
  samples: {
    problem: string[];
    technical: string[];
    decision: string[];
    action: string[];
    compound: string[];
  };
}

/** Full extraction result with stats and breakdown */
export interface ExtractionResult {
  phrases: string[];
  stats: ExtractionStats;
  breakdown: ExtractionBreakdown;
}

// ---------------------------------------------------------------
// 6. PATH SECURITY TYPES
// ---------------------------------------------------------------

// Path security functions use primitive types (string, string[], null).
// No custom types needed beyond the function signatures themselves.

// ---------------------------------------------------------------
// 7. PROFILE SLUG TYPES
// ---------------------------------------------------------------

/** Parsed profile slug components */
export interface ParsedProfileSlug {
  provider: string;
  model: string;
  dim: number;
  dtype?: string | null;
}

/** Profile JSON representation */
export interface ProfileJson {
  provider: string;
  model: string;
  dim: number;
  dtype: string | null;
  baseUrl: string | null;
  slug: string;
}

// ---------------------------------------------------------------
// 8. TASK PREFIX TYPES
// ---------------------------------------------------------------

/** Task prefix constants for embedding task types */
export interface TaskPrefixMap {
  DOCUMENT: string;
  QUERY: string;
  CLUSTERING: string;
  CLASSIFICATION: string;
}

/** Task type for getTaskPrefix() */
export type TaskType = 'document' | 'query' | 'clustering' | 'classification';
