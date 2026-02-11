// ---------------------------------------------------------------
// MODULE: Handler Types
// ---------------------------------------------------------------
// Re-exports canonical types from shared/ for handler convenience.
// Previously declared duplicates locally — now imports from the
// single source of truth.
// ---------------------------------------------------------------

// Re-export canonical types from shared
export type {
  Database,
  DatabaseExtended,
  EmbeddingProfile,
  EmbeddingProfileExtended,
  MCPResponse,
} from '../../shared/types';

/** Intent classification result from the intent classifier */
export interface IntentClassification {
  intent: string;
  confidence: number;
  fallback?: boolean;
  reason?: string;
}
