// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────
export {
  extractContextHint,
  getConstitutionalMemories,
  clearConstitutionalCache,
  autoSurfaceMemories,
  autoSurfaceAtToolDispatch,
  autoSurfaceAtCompaction,
  MEMORY_AWARE_TOOLS,
  // Session tracking for session_health tool
  recordToolCall,
  getSessionTimestamps,
  getLastActiveSessionId,
  isSessionPrimed,
  getCodeGraphStatusSnapshot,
} from './memory-surface.js';
export { buildMutationHookFeedback } from './mutation-feedback.js';
export {
  appendAutoSurfaceHints,
  syncEnvelopeTokenCount,
  serializeEnvelopeWithTokenCount,
} from './response-hints.js';
