// ───────────────────────────────────────────────────────────────────
// MODULE: Types
// ───────────────────────────────────────────────────────────────────

// Single source of truth for cross-workspace types.
// Used across shared/, runtime/, and runtime/cli/.
// ───────────────────────────────────────────────────────────────────
// 1. FOLDER SCORING TYPES
// ───────────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────────
// 2. TRIGGER EXTRACTOR TYPES
// ───────────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────────
// 3. PATH SECURITY TYPES
// ───────────────────────────────────────────────────────────────────

// Path security functions use primitive types (string, string[], null).
// No custom types needed beyond the function signatures themselves.
