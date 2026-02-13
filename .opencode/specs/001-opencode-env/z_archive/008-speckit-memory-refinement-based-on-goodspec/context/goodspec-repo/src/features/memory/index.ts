/**
 * Goop Memory System
 * Provides persistent, searchable memory for agents
 * @module features/memory
 */

// Types
export type {
  Memory,
  MemoryInput,
  MemoryUpdate,
  MemoryType,
  MemoryConfig,
  MemoryManager,
  SearchResult,
  SearchOptions,
  MatchType,
  Visibility,
  RawEvent,
  RawEventType,
  CaptureConfig,
  InjectionConfig,
  PrivacyConfig,
  EmbeddingsConfig,
  EmbeddingProvider,
  InjectionFormat,
  MemoryRow,
  FtsSearchRow,
  VectorSearchRow,
} from "./types.js";

// Default configs
export {
  DEFAULT_MEMORY_CONFIG,
  DEFAULT_CAPTURE_CONFIG,
  DEFAULT_INJECTION_CONFIG,
  DEFAULT_PRIVACY_CONFIG,
  DEFAULT_EMBEDDINGS_CONFIG,
} from "./types.js";

// Storage
export {
  MemoryStorage,
  VectorStorage,
  EmbeddingGenerator,
  SCHEMA_VERSION,
} from "./storage/index.js";

// Client & Manager
export { MemoryClient } from "./client.js";
export { MemoryServiceManager } from "./manager.js";

// Capture & Distillation
export {
  shouldCapture,
  estimateImportance,
  sanitizeContent,
  getMemoryTypeForEvent,
  buildToolCaptureEvent,
  buildPhaseCaptureEvent,
  buildMessageCaptureEvent,
  SENSITIVE_PATTERNS,
  TOOL_IMPORTANCE,
} from "./capture.js";
export { MemoryDistiller, type DistillationResult } from "./distiller.js";

// Retrieval & Injection
export {
  MemoryRetrieval,
  DEFAULT_RETRIEVAL_CONFIG,
  type RetrievalConfig,
} from "./retrieval.js";
export { MemoryInjector } from "./injection.js";
export {
  MemoryContextBuilder,
  createMemoryContextBuilder,
  type ContextBuilderConfig,
} from "./context-builder.js";

// Privacy & Configuration
export {
  PrivacyManager,
  DEFAULT_SENSITIVE_PATTERNS,
} from "./privacy.js";
export {
  parseMemoryConfig,
  getDefaultMemoryConfig,
  mergeMemoryConfig,
  validateMemoryConfig,
  MemoryConfigSchema,
  CaptureConfigSchema,
  InjectionConfigSchema,
  PrivacyConfigSchema,
  EmbeddingsConfigSchema,
  EXAMPLE_MEMORY_CONFIG,
  MINIMAL_MEMORY_CONFIG,
  type MemoryConfigInput,
  type MemoryConfigOutput,
} from "./config.js";
