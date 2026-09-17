// ───────────────────────────────────────────────────────────────────
// MODULE: Event Envelope Errors
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export const EventEnvelopeErrorCodes = {
  ENVELOPE_PARSE_FAILED: 'ENVELOPE_PARSE_FAILED',
  ENVELOPE_UNSUPPORTED_VERSION: 'ENVELOPE_UNSUPPORTED_VERSION',
  ENVELOPE_MISSING_FIELD: 'ENVELOPE_MISSING_FIELD',
  ENVELOPE_UNKNOWN_FIELD: 'ENVELOPE_UNKNOWN_FIELD',
  ENVELOPE_INVALID_FIELD: 'ENVELOPE_INVALID_FIELD',
  PAYLOAD_MISSING_FIELD: 'PAYLOAD_MISSING_FIELD',
  PAYLOAD_UNKNOWN_FIELD: 'PAYLOAD_UNKNOWN_FIELD',
  PAYLOAD_VALIDATION_FAILED: 'PAYLOAD_VALIDATION_FAILED',
  INPUT_LIMIT_EXCEEDED: 'INPUT_LIMIT_EXCEEDED',
  INVALID_UNICODE: 'INVALID_UNICODE',
  CANONICAL_SERIALIZATION_FAILED: 'CANONICAL_SERIALIZATION_FAILED',
  REGISTRY_UNKNOWN_EVENT_TYPE: 'REGISTRY_UNKNOWN_EVENT_TYPE',
  REGISTRY_DUPLICATE_EVENT_TYPE: 'REGISTRY_DUPLICATE_EVENT_TYPE',
  REGISTRY_ALIAS_FORBIDDEN: 'REGISTRY_ALIAS_FORBIDDEN',
  REGISTRY_INVALID_VERSION: 'REGISTRY_INVALID_VERSION',
  REGISTRY_DUPLICATE_VERSION: 'REGISTRY_DUPLICATE_VERSION',
  REGISTRY_DUPLICATE_UPCASTER: 'REGISTRY_DUPLICATE_UPCASTER',
  REGISTRY_UPCASTER_CYCLE: 'REGISTRY_UPCASTER_CYCLE',
  REGISTRY_UPCASTER_NON_ADJACENT: 'REGISTRY_UPCASTER_NON_ADJACENT',
  REGISTRY_UPCASTER_GAP: 'REGISTRY_UPCASTER_GAP',
  REGISTRY_INCOMPLETE_DEFINITION: 'REGISTRY_INCOMPLETE_DEFINITION',
  REGISTRY_IMPURE_UPCASTER: 'REGISTRY_IMPURE_UPCASTER',
  REGISTRY_UPCASTER_MUTATES_INPUT: 'REGISTRY_UPCASTER_MUTATES_INPUT',
  REGISTRY_UPCASTER_NON_DETERMINISTIC: 'REGISTRY_UPCASTER_NON_DETERMINISTIC',
  REGISTRY_UPCASTER_PROBE_FAILED: 'REGISTRY_UPCASTER_PROBE_FAILED',
  WRITE_VERSION_NOT_CURRENT: 'WRITE_VERSION_NOT_CURRENT',
  READ_FUTURE_EVENT_VERSION: 'READ_FUTURE_EVENT_VERSION',
  READ_UNSUPPORTED_EVENT_VERSION: 'READ_UNSUPPORTED_EVENT_VERSION',
  UPCAST_EXECUTION_FAILED: 'UPCAST_EXECUTION_FAILED',
  UPCAST_NON_DETERMINISTIC: 'UPCAST_NON_DETERMINISTIC',
  UPCAST_INVALID_OUTPUT: 'UPCAST_INVALID_OUTPUT',
  UPCAST_IDENTITY_MUTATION: 'UPCAST_IDENTITY_MUTATION',
  UPCAST_LOSSY_CONVERSION: 'UPCAST_LOSSY_CONVERSION',
  UPCAST_AMBIGUOUS_DEFAULT: 'UPCAST_AMBIGUOUS_DEFAULT',
} as const;

/** Stable machine-readable vocabulary for fail-closed envelope errors. */
export type EventEnvelopeErrorCode =
  typeof EventEnvelopeErrorCodes[keyof typeof EventEnvelopeErrorCodes];

/** Boundary phase that rejected an envelope operation. */
export type EventEnvelopeErrorPhase =
  | 'parse'
  | 'validation'
  | 'registration'
  | 'write'
  | 'read'
  | 'upcast'
  | 'serialization';

/** Bounded scalar metadata permitted on a typed error. */
export type EventEnvelopeErrorDetail = string | number | boolean | null;

// ───────────────────────────────────────────────────────────────────
// 2. ERROR CLASSES
// ───────────────────────────────────────────────────────────────────

/** Base typed failure shared by every envelope boundary phase. */
export class EventEnvelopeError extends Error {
  public readonly code: EventEnvelopeErrorCode;
  public readonly phase: EventEnvelopeErrorPhase;
  public readonly details: Readonly<Record<string, EventEnvelopeErrorDetail>>;

  public constructor(
    name: string,
    code: EventEnvelopeErrorCode,
    phase: EventEnvelopeErrorPhase,
    message: string,
    details: Readonly<Record<string, EventEnvelopeErrorDetail>> = {},
  ) {
    super(message);
    this.name = name;
    this.code = code;
    this.phase = phase;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Failure raised while validating outer or payload data. */
export class EnvelopeValidationError extends EventEnvelopeError {
  public constructor(
    code: EventEnvelopeErrorCode,
    message: string,
    details: Readonly<Record<string, EventEnvelopeErrorDetail>> = {},
  ) {
    super('EnvelopeValidationError', code, 'validation', message, details);
  }
}

/** Failure raised while constructing or resolving the registry. */
export class RegistryValidationError extends EventEnvelopeError {
  public constructor(
    code: EventEnvelopeErrorCode,
    message: string,
    details: Readonly<Record<string, EventEnvelopeErrorDetail>> = {},
  ) {
    super('RegistryValidationError', code, 'registration', message, details);
  }
}

/** Failure raised before a canonical event can reach append authorization. */
export class EventWriteError extends EventEnvelopeError {
  public constructor(
    code: EventEnvelopeErrorCode,
    message: string,
    details: Readonly<Record<string, EventEnvelopeErrorDetail>> = {},
  ) {
    super('EventWriteError', code, 'write', message, details);
  }
}

/** Failure raised before a stored event can reach consumers. */
export class EventReadError extends EventEnvelopeError {
  public constructor(
    code: EventEnvelopeErrorCode,
    message: string,
    details: Readonly<Record<string, EventEnvelopeErrorDetail>> = {},
  ) {
    super('EventReadError', code, 'read', message, details);
  }
}

/** Failure raised while applying or validating an adjacent upcast hop. */
export class EventUpcastError extends EventEnvelopeError {
  public constructor(
    code: EventEnvelopeErrorCode,
    message: string,
    details: Readonly<Record<string, EventEnvelopeErrorDetail>> = {},
  ) {
    super('EventUpcastError', code, 'upcast', message, details);
  }
}
