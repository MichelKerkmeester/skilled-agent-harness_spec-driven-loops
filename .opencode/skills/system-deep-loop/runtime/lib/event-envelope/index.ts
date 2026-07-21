// ───────────────────────────────────────────────────────────────────
// MODULE: Event Envelope Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  MAX_CANONICAL_BYTES,
  MAX_JSON_DEPTH,
  MAX_JSON_NODES,
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from './canonical-json.js';
export {
  EventEnvelopeError,
  EnvelopeValidationError,
  RegistryValidationError,
  EventReadError,
  EventUpcastError,
  EventWriteError,
  EventEnvelopeErrorCodes,
} from './event-envelope-errors.js';
export {
  CURRENT_ENVELOPE_VERSION,
  EVENT_ENVELOPE_FIELDS,
  EVENT_TYPE_NAMESPACE_GRAMMAR,
  EVENT_TYPE_NAMESPACE_PATTERN,
  validateEventEnvelope,
  validateEventTypeNamespace,
} from './event-envelope.js';
export { EventTypeRegistry } from './event-type-registry.js';
export { prepareEventWrite, readEvent } from './event-envelope-boundary.js';

export type { CanonicalBytes, JsonObject, JsonPrimitive, JsonValue } from './canonical-json.js';
export type { EventEnvelopeErrorCode, EventEnvelopeErrorPhase } from './event-envelope-errors.js';
export type { EventEnvelope, EventProducer } from './event-envelope.js';
export type {
  EventTypeDefinition,
  EventUpcasterDefinition,
  EventVersionDefinition,
  IntroducedFieldProvenance,
  PayloadContract,
  RegistryInspectionEntry,
  UpcastOutcome,
} from './event-type-registry.js';
export type {
  CanonicalEventArtifact,
  EventAppendIdentity,
  EventReadResult,
  EventWritePreflight,
  StoredEventBytes,
  UpcastHopTrace,
} from './event-envelope-boundary.js';
