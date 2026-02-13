/**
 * Memory System Type Definitions
 * @module features/memory/types
 */

// ============================================================================
// Memory Types
// ============================================================================

/**
 * Types of memories that can be stored
 */
export type MemoryType =
  | "observation" // Distilled facts from tool usage
  | "decision" // Explicit decisions with reasoning
  | "session_summary" // End-of-session summaries
  | "user_prompt" // Sanitized user intents
  | "note" // Quick manual notes
  | "todo"; // Durable tasks

/**
 * Visibility levels for memories
 */
export type Visibility = "public" | "private";

/**
 * A stored memory entry
 */
export interface Memory {
  id: number;
  type: MemoryType;
  title: string;
  content: string;
  facts: string[]; // Atomic pieces of knowledge
  concepts: string[]; // Tags for semantic grouping
  sourceFiles: string[]; // Related file paths
  importance: number; // 1-10 scale
  visibility: Visibility;
  phase?: string; // Goop workflow phase
  sessionId?: string;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  accessedAt: number; // Unix timestamp
  accessCount: number;
}

/**
 * Input for creating a new memory
 */
export interface MemoryInput {
  type: MemoryType;
  title: string;
  content: string;
  facts?: string[];
  concepts?: string[];
  sourceFiles?: string[];
  importance?: number;
  visibility?: Visibility;
  phase?: string;
  sessionId?: string;
}

/**
 * Input for updating an existing memory
 */
export interface MemoryUpdate {
  title?: string;
  content?: string;
  facts?: string[];
  concepts?: string[];
  sourceFiles?: string[];
  importance?: number;
  visibility?: Visibility;
}

// ============================================================================
// Search Types
// ============================================================================

/**
 * Match type for search results
 */
export type MatchType = "fts" | "vector" | "hybrid";

/**
 * A search result with relevance information
 */
export interface SearchResult {
  memory: Memory;
  score: number;
  matchType: MatchType;
  highlighted?: string;
}

/**
 * Options for searching memories
 */
export interface SearchOptions {
  query: string;
  limit?: number;
  types?: MemoryType[];
  concepts?: string[];
  minImportance?: number;
  includePrivate?: boolean;
  phase?: string;
  hybridWeight?: {
    fts: number;
    vector: number;
  };
}

// ============================================================================
// Event Types (for auto-capture)
// ============================================================================

/**
 * Types of events that can be captured
 */
export type RawEventType =
  | "tool_use"
  | "user_message"
  | "assistant_message"
  | "phase_change";

/**
 * A raw event for distillation into a memory
 */
export interface RawEvent {
  type: RawEventType;
  timestamp: number;
  sessionId: string;
  data: Record<string, unknown>;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Embedding provider options
 */
export type EmbeddingProvider = "local" | "openai" | "ollama";

/**
 * Format for memory injection into prompts
 */
export type InjectionFormat = "timeline" | "bullets" | "structured";

/**
 * Configuration for auto-capture behavior
 */
export interface CaptureConfig {
  enabled: boolean;
  captureToolUse: boolean;
  captureMessages: boolean;
  capturePhaseChanges: boolean;
  skipTools: string[];
  minImportanceThreshold: number;
}

/**
 * Configuration for memory injection into prompts
 */
export interface InjectionConfig {
  enabled: boolean;
  budgetTokens: number;
  format: InjectionFormat;
  priorityTypes: MemoryType[];
}

/**
 * Configuration for privacy controls
 */
export interface PrivacyConfig {
  enabled: boolean;
  stripPatterns: RegExp[];
  privateTagEnabled: boolean;
  retentionDays: number;
  maxMemories: number;
}

/**
 * Configuration for embedding generation
 */
export interface EmbeddingsConfig {
  provider: EmbeddingProvider;
  model?: string;
  dimensions: number;
  apiKey?: string; // For OpenAI
  baseUrl?: string; // For Ollama
}

/**
 * Complete memory system configuration
 */
export interface MemoryConfig {
  enabled: boolean;
  workerPort: number;
  capture: CaptureConfig;
  injection: InjectionConfig;
  privacy: PrivacyConfig;
  embeddings: EmbeddingsConfig;
}

// ============================================================================
// Default Configurations
// ============================================================================

export const DEFAULT_CAPTURE_CONFIG: CaptureConfig = {
  enabled: true,
  captureToolUse: true,
  captureMessages: false, // Too noisy by default
  capturePhaseChanges: true,
  skipTools: ["Read", "Glob", "Grep", "Bash"], // Read-only or too verbose
  minImportanceThreshold: 4,
};

export const DEFAULT_INJECTION_CONFIG: InjectionConfig = {
  enabled: true,
  budgetTokens: 800,
  format: "timeline",
  priorityTypes: ["decision", "observation", "todo"],
};

export const DEFAULT_PRIVACY_CONFIG: PrivacyConfig = {
  enabled: true,
  stripPatterns: [
    /api[_-]?key\s*[:=]\s*["']?[\w-]+["']?/gi,
    /password\s*[:=]\s*["']?[^"'\s]+["']?/gi,
    /token\s*[:=]\s*["']?[\w.-]+["']?/gi,
    /secret\s*[:=]\s*["']?[\w.-]+["']?/gi,
    /bearer\s+[\w.-]+/gi,
  ],
  privateTagEnabled: true,
  retentionDays: 90,
  maxMemories: 10000,
};

export const DEFAULT_EMBEDDINGS_CONFIG: EmbeddingsConfig = {
  provider: "local",
  model: "Xenova/all-MiniLM-L6-v2",
  dimensions: 384,
};

export const DEFAULT_MEMORY_CONFIG: MemoryConfig = {
  enabled: true,
  workerPort: 37777,
  capture: DEFAULT_CAPTURE_CONFIG,
  injection: DEFAULT_INJECTION_CONFIG,
  privacy: DEFAULT_PRIVACY_CONFIG,
  embeddings: DEFAULT_EMBEDDINGS_CONFIG,
};

// ============================================================================
// Manager Interface
// ============================================================================

/**
 * Interface for memory management operations
 * Implemented by both direct storage and HTTP client
 */
export interface MemoryManager {
  save(input: MemoryInput): Promise<Memory>;
  search(options: SearchOptions): Promise<SearchResult[]>;
  getById(id: number): Promise<Memory | null>;
  getRecent(limit: number, types?: MemoryType[]): Promise<Memory[]>;
  update(id: number, updates: MemoryUpdate): Promise<Memory | null>;
  delete(id: number): Promise<boolean>;
  distill?(event: RawEvent): Promise<Memory | null>;
}

// ============================================================================
// Database Row Types (for SQLite)
// ============================================================================

/**
 * Raw row from the memories table
 */
export interface MemoryRow {
  id: number;
  type: string;
  title: string;
  content: string;
  facts: string; // JSON array
  concepts: string; // JSON array
  source_files: string; // JSON array
  importance: number;
  visibility: string;
  phase: string | null;
  session_id: string | null;
  created_at: number;
  updated_at: number;
  accessed_at: number;
  access_count: number;
}

/**
 * Row from FTS5 search results
 */
export interface FtsSearchRow extends MemoryRow {
  rank: number;
  highlighted_title?: string;
  highlighted_content?: string;
}

/**
 * Row from vector search results
 */
export interface VectorSearchRow {
  memory_id: number;
  distance: number;
}
