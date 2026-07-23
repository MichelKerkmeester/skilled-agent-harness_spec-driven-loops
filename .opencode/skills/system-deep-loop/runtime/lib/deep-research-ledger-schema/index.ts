// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Ledger Schema Public API
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_RESEARCH_EVENT_VERSION,
  DEEP_RESEARCH_MODE_PAYLOAD_FIELDS,
  DEEP_RESEARCH_SHARED_ENVELOPE_FIELDS,
  createDeepResearchEventRegistry,
  createDeepResearchLedgerPayload,
  deepResearchEventDefinitions,
  deepResearchPayloadDigest,
  isDeepResearchEventStem,
  prepareDeepResearchEvent,
} from './deep-research-ledger-schema.js';
export {
  DeepResearchEventStems,
  DeepResearchWireEventTypes,
} from './deep-research-ledger-types.js';
export {
  decideDeepResearchCompatibility,
  upcastLegacyDeepResearchRecord,
} from './legacy-compatibility.js';

export type * from './deep-research-ledger-schema.js';
export type * from './deep-research-ledger-types.js';
