// ───────────────────────────────────────────────────────────────────
// MODULE: Stream-Fold Gauge Replay
// ───────────────────────────────────────────────────────────────────

import {
  AppendOnlyLedger,
  GENESIS_RECORD_HASH,
  TypedReducerRegistry,
} from '../authorized-ledger/index.js';
import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  INITIAL_STATE_REPLAY_INPUT,
  ReplayComponentRegistry,
  createReplayFingerprintVersionRegistry,
  deriveReplayFingerprint,
} from '../replay-fingerprint/index.js';
import { GaugeRegistry } from './gauge-registry.js';
import {
  StreamFoldGaugeError,
  StreamFoldGaugeErrorCodes,
} from './stream-fold-gauge-errors.js';

import type {
  LedgerHead,
  TypedReducerDefinition,
  VerifiedLedgerEvent,
} from '../authorized-ledger/index.js';
import type { EventTypeRegistry, JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  GaugeCheckpoint,
  GaugeCheckpointProvenance,
  GaugeFingerprintProjection,
  GaugeReplayInput,
  GaugeReplayOutcome,
  GaugeResultEnvelope,
} from './stream-fold-gauge-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface CheckpointValidationSuccess {
  readonly valid: true;
  readonly checkpoint: GaugeCheckpoint;
  readonly accumulator: Readonly<JsonObject>;
}

interface CheckpointValidationFailure {
  readonly valid: false;
  readonly rejectionCode: string;
  readonly sequence: number | null;
  readonly recordHash: string | null;
  readonly accumulatorHash: string | null;
}

type CheckpointValidation = CheckpointValidationSuccess | CheckpointValidationFailure;

/** Inputs for replay through the shipped ledger reader and fingerprint substrate. */
export interface GaugeLedgerReplayInput {
  readonly ledger: AppendOnlyLedger;
  readonly eventRegistry: EventTypeRegistry;
  readonly gaugeRegistry: GaugeRegistry;
  readonly gaugeId: string;
  readonly gaugeVersion: string;
  readonly runId: string;
  readonly cutoff?: LedgerHead;
  readonly checkpoint?: unknown;
}

// ───────────────────────────────────────────────────────────────────
// 2. STREAM VALIDATION
// ───────────────────────────────────────────────────────────────────

function isDigest(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
}

function streamFailure(message: string, details: Record<string, string | number | null> = {}): never {
  throw new StreamFoldGaugeError(
    StreamFoldGaugeErrorCodes.STREAM_INTEGRITY,
    'stream',
    message,
    details,
  );
}

function frameDigest(event: VerifiedLedgerEvent): string {
  const { record_hash: _recordHash, ...hashInput } = event.frame;
  return sha256Bytes(canonicalBytes(hashInput as unknown as JsonObject));
}

function validateVerifiedPrefix(
  events: readonly VerifiedLedgerEvent[],
  cutoff: LedgerHead,
  eventRegistryDigest: string,
): readonly VerifiedLedgerEvent[] {
  if (
    typeof cutoff.ledgerId !== 'string'
    || cutoff.ledgerId.trim() === ''
    || !Number.isSafeInteger(cutoff.sequence)
    || cutoff.sequence < 0
    || !isDigest(cutoff.recordHash)
    || !isDigest(eventRegistryDigest)
    || cutoff.sequence > events.length
  ) {
    return streamFailure('Gauge replay cutoff and registry identity are invalid');
  }
  const selected = events.slice(0, cutoff.sequence);
  let priorHash = GENESIS_RECORD_HASH;
  for (const [index, verified] of selected.entries()) {
    const sequence = index + 1;
    const stored = verified.event.stored.envelope;
    if (
      verified.frame.sequence !== sequence
      || verified.frame.ledger_id !== cutoff.ledgerId
      || verified.frame.prev_record_hash !== priorHash
      || verified.frame.record_hash !== frameDigest(verified)
      || verified.frame.canonical_event_hash !== verified.event.stored.digest
      || verified.event.registryDigest !== eventRegistryDigest
      || verified.frame.receipt.sequence !== sequence
      || verified.frame.receipt.ledger_id !== cutoff.ledgerId
      || verified.frame.receipt.event_id !== stored.event_id
      || verified.frame.receipt.event_type !== stored.event_type
      || verified.frame.receipt.event_version !== stored.event_version
      || verified.frame.receipt.stream_id !== stored.stream_id
      || verified.frame.receipt.stream_sequence !== stored.stream_sequence
    ) {
      return streamFailure(
        'Gauge replay requires one contiguous verified authorized-ledger prefix',
        { sequence },
      );
    }
    priorHash = verified.frame.record_hash;
  }
  const expectedHash = selected.length === 0
    ? GENESIS_RECORD_HASH
    : selected[selected.length - 1].frame.record_hash;
  if (cutoff.recordHash !== expectedHash) {
    return streamFailure(
      'Gauge replay cutoff hash does not close the selected ledger prefix',
      { sequence: cutoff.sequence },
    );
  }
  return Object.freeze(selected);
}

// ───────────────────────────────────────────────────────────────────
// 3. CHECKPOINT VALIDATION
// ───────────────────────────────────────────────────────────────────

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function rejectedCheckpoint(
  rejectionCode: string,
  candidate: unknown,
): CheckpointValidationFailure {
  const value = isObject(candidate) ? candidate : {};
  return Object.freeze({
    valid: false,
    rejectionCode,
    sequence: Number.isSafeInteger(value.lastSequence) ? value.lastSequence as number : null,
    recordHash: isDigest(value.lastRecordHash) ? value.lastRecordHash : null,
    accumulatorHash: isDigest(value.accumulatorHash) ? value.accumulatorHash : null,
  });
}

function decodeCheckpointAccumulator(candidate: GaugeCheckpoint): Readonly<JsonObject> | null {
  try {
    const bytes = Buffer.from(candidate.accumulatorBytesBase64, 'base64');
    if (
      bytes.length === 0
      || bytes.toString('base64') !== candidate.accumulatorBytesBase64
      || sha256Bytes(bytes) !== candidate.accumulatorHash
    ) return null;
    const parsed = JSON.parse(bytes.toString('utf8')) as unknown;
    if (!isObject(parsed) || Buffer.from(canonicalBytes(parsed)).toString('base64')
      !== candidate.accumulatorBytesBase64) return null;
    return JSON.parse(canonicalJson(parsed)) as JsonObject;
  } catch {
    return null;
  }
}

function validateCheckpoint(
  candidate: unknown,
  selected: readonly VerifiedLedgerEvent[],
  cutoff: LedgerHead,
  eventRegistryDigest: string,
  gaugeRegistry: GaugeRegistry,
  gaugeId: string,
  gaugeVersion: string,
): CheckpointValidation {
  if (!isObject(candidate)) return rejectedCheckpoint('malformed', candidate);
  const checkpoint = candidate as unknown as GaugeCheckpoint;
  if (
    checkpoint.checkpointSchemaVersion !== 1
    || !Number.isSafeInteger(checkpoint.lastSequence)
    || checkpoint.lastSequence < 0
    || checkpoint.lastSequence > cutoff.sequence
    || !isDigest(checkpoint.lastRecordHash)
    || !isDigest(checkpoint.eventRegistryDigest)
    || !isDigest(checkpoint.gaugeRegistryDigest)
    || !isDigest(checkpoint.reducerDigest)
    || !isDigest(checkpoint.configurationDigest)
    || !isDigest(checkpoint.accumulatorHash)
    || typeof checkpoint.accumulatorBytesBase64 !== 'string'
  ) return rejectedCheckpoint('malformed', candidate);

  const definition = gaugeRegistry.resolve(gaugeId, gaugeVersion);
  if (
    checkpoint.ledgerId !== cutoff.ledgerId
    || checkpoint.gaugeId !== gaugeId
    || checkpoint.gaugeVersion !== gaugeVersion
  ) return rejectedCheckpoint('identity-mismatch', candidate);
  if (
    checkpoint.gaugeRegistryDigest !== gaugeRegistry.digest
    || checkpoint.reducerDigest !== definition.reducerDigest
    || checkpoint.configurationDigest !== definition.configurationDigest
  ) return rejectedCheckpoint('definition-mismatch', candidate);
  if (checkpoint.eventRegistryDigest !== eventRegistryDigest) {
    return rejectedCheckpoint('event-registry-mismatch', candidate);
  }
  const expectedHash = checkpoint.lastSequence === 0
    ? GENESIS_RECORD_HASH
    : selected[checkpoint.lastSequence - 1]?.frame.record_hash;
  if (expectedHash !== checkpoint.lastRecordHash) {
    return rejectedCheckpoint('prefix-mismatch', candidate);
  }
  const accumulator = decodeCheckpointAccumulator(checkpoint);
  if (
    accumulator === null
    || !gaugeRegistry.validateAccumulator(gaugeId, gaugeVersion, accumulator)
  ) return rejectedCheckpoint('accumulator-corrupt', candidate);
  return Object.freeze({ valid: true, checkpoint, accumulator });
}

// ───────────────────────────────────────────────────────────────────
// 4. FOLD AND RESULT
// ───────────────────────────────────────────────────────────────────

function foldEvents(
  gaugeRegistry: GaugeRegistry,
  gaugeId: string,
  gaugeVersion: string,
  initialAccumulator: Readonly<JsonObject>,
  events: readonly VerifiedLedgerEvent[],
): Readonly<JsonObject> {
  let accumulator = JSON.parse(canonicalJson(initialAccumulator)) as JsonObject;
  for (const verified of events) {
    accumulator = gaugeRegistry.reduce(
      gaugeId,
      gaugeVersion,
      accumulator,
      verified.event,
      verified.frame.sequence,
    ) as JsonObject;
  }
  return accumulator;
}

function checkpointProvenance(
  validation: CheckpointValidation | null,
): GaugeCheckpointProvenance {
  if (validation === null) {
    return Object.freeze({
      status: 'not-provided',
      sequence: null,
      recordHash: null,
      accumulatorHash: null,
      rejectionCode: null,
    });
  }
  if (validation.valid) {
    return Object.freeze({
      status: 'used',
      sequence: validation.checkpoint.lastSequence,
      recordHash: validation.checkpoint.lastRecordHash,
      accumulatorHash: validation.checkpoint.accumulatorHash,
      rejectionCode: null,
    });
  }
  return Object.freeze({
    status: 'rejected',
    sequence: validation.sequence,
    recordHash: validation.recordHash,
    accumulatorHash: validation.accumulatorHash,
    rejectionCode: validation.rejectionCode,
  });
}

function createCheckpoint(
  cutoff: LedgerHead,
  eventRegistryDigest: string,
  gaugeRegistry: GaugeRegistry,
  gaugeId: string,
  gaugeVersion: string,
  accumulatorBytes: readonly number[],
  accumulatorHash: string,
): GaugeCheckpoint {
  const definition = gaugeRegistry.resolve(gaugeId, gaugeVersion);
  return Object.freeze({
    checkpointSchemaVersion: 1,
    ledgerId: cutoff.ledgerId,
    lastSequence: cutoff.sequence,
    lastRecordHash: cutoff.recordHash,
    eventRegistryDigest,
    gaugeRegistryDigest: gaugeRegistry.digest,
    gaugeId,
    gaugeVersion,
    reducerDigest: definition.reducerDigest,
    configurationDigest: definition.configurationDigest,
    accumulatorBytesBase64: Buffer.from(accumulatorBytes).toString('base64'),
    accumulatorHash,
  });
}

/** Replay one gauge from genesis or a verified disposable checkpoint. */
export function replayGauge(
  gaugeRegistry: GaugeRegistry,
  input: GaugeReplayInput,
): GaugeReplayOutcome {
  const selected = validateVerifiedPrefix(
    input.verifiedEvents,
    input.cutoff,
    input.eventRegistryDigest,
  );
  const validation = input.checkpoint === undefined
    ? null
    : validateCheckpoint(
      input.checkpoint,
      selected,
      input.cutoff,
      input.eventRegistryDigest,
      gaugeRegistry,
      input.gaugeId,
      input.gaugeVersion,
    );
  const useCheckpoint = validation?.valid === true;
  const startingAccumulator = useCheckpoint
    ? validation.accumulator
    : gaugeRegistry.initialAccumulator(input.gaugeId, input.gaugeVersion);
  const startingSequence = useCheckpoint ? validation.checkpoint.lastSequence : 0;
  const suffix = selected.slice(startingSequence);
  const first = foldEvents(
    gaugeRegistry,
    input.gaugeId,
    input.gaugeVersion,
    startingAccumulator,
    suffix,
  );
  const second = foldEvents(
    gaugeRegistry,
    input.gaugeId,
    input.gaugeVersion,
    startingAccumulator,
    suffix,
  );
  if (canonicalJson(first) !== canonicalJson(second)) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.REDUCER_NON_DETERMINISTIC,
      'reducer',
      'Repeated gauge replay produced different canonical accumulator bytes',
      { gaugeId: input.gaugeId },
    );
  }
  const output = gaugeRegistry.finalize(input.gaugeId, input.gaugeVersion, first);
  const accumulatorBytes = canonicalBytes(first);
  const outputBytes = canonicalBytes(output);
  const accumulatorHash = sha256Bytes(accumulatorBytes);
  const outputHash = sha256Bytes(outputBytes);
  const definition = gaugeRegistry.resolve(input.gaugeId, input.gaugeVersion);
  const computationMode = useCheckpoint
    ? 'incremental'
    : validation === null ? 'full' : 'full-rebuild';
  const result: GaugeResultEnvelope = Object.freeze({
    resultSchemaVersion: 1,
    ledgerId: input.cutoff.ledgerId,
    cutoffSequence: input.cutoff.sequence,
    cutoffRecordHash: input.cutoff.recordHash,
    gaugeId: input.gaugeId,
    gaugeVersion: input.gaugeVersion,
    gaugeFamily: definition.family,
    gaugeRegistryDigest: gaugeRegistry.digest,
    reducerDigest: definition.reducerDigest,
    configurationDigest: definition.configurationDigest,
    eventRegistryDigest: input.eventRegistryDigest,
    accumulatorHash,
    outputHash,
    replayFingerprintDigest: null,
    computationMode,
    sourceEventCount: selected.length,
    eventsProcessed: suffix.length,
    checkpointProvenance: checkpointProvenance(validation),
    output: output as JsonObject,
  });
  return Object.freeze({
    result,
    resultBytes: canonicalBytes(result),
    accumulator: first,
    accumulatorBytes,
    outputBytes,
    checkpoint: createCheckpoint(
      input.cutoff,
      input.eventRegistryDigest,
      gaugeRegistry,
      input.gaugeId,
      input.gaugeVersion,
      accumulatorBytes,
      accumulatorHash,
    ),
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. REPLAY FINGERPRINT BINDING
// ───────────────────────────────────────────────────────────────────

function fingerprintReducerRegistry(
  eventRegistry: EventTypeRegistry,
  gaugeRegistry: GaugeRegistry,
  gaugeId: string,
  gaugeVersion: string,
): TypedReducerRegistry<GaugeFingerprintProjection> {
  const reducerVersion = gaugeRegistry.resolve(gaugeId, gaugeVersion).reducerDigest;
  const definitions: TypedReducerDefinition<GaugeFingerprintProjection>[] =
    eventRegistry.inspect().map(({ eventType }) => ({
      eventType,
      reducerVersion,
      reduce: (state, event) => {
        const processedSequence = state.processedSequence + 1;
        return {
          accumulator: gaugeRegistry.reduce(
            gaugeId,
            gaugeVersion,
            state.accumulator,
            event,
            processedSequence,
          ) as JsonObject,
          processedSequence,
        };
      },
    }));
  return new TypedReducerRegistry(definitions);
}

async function deriveGaugeFingerprint(
  input: GaugeLedgerReplayInput,
  cutoff: LedgerHead,
): Promise<{
  readonly finalDigest: string;
  readonly accumulator: Readonly<JsonObject>;
}> {
  const definition = input.gaugeRegistry.resolve(input.gaugeId, input.gaugeVersion);
  const initialState: GaugeFingerprintProjection = {
    accumulator: input.gaugeRegistry.initialAccumulator(input.gaugeId, input.gaugeVersion) as JsonObject,
    processedSequence: 0,
  };
  const configuration = input.gaugeRegistry.configuration(input.gaugeId, input.gaugeVersion);
  const reducers = fingerprintReducerRegistry(
    input.eventRegistry,
    input.gaugeRegistry,
    input.gaugeId,
    input.gaugeVersion,
  );
  const componentRegistry = new ReplayComponentRegistry<GaugeFingerprintProjection>([{
    reducerId: input.gaugeId,
    reducerVersion: definition.reducerDigest,
    projectionSchemaVersion: definition.outputSchemaVersion,
    requiredReplayInputKeys: [INITIAL_STATE_REPLAY_INPUT, 'gauge_configuration'],
    reducerRegistry: reducers,
    replayInputSources: {
      gauge_configuration: { kind: 'content-addressed', value: configuration as JsonObject },
    },
    bindReplayInputs: (values) => {
      if (canonicalJson(values.gauge_configuration) !== canonicalJson(configuration)) {
        throw new StreamFoldGaugeError(
          StreamFoldGaugeErrorCodes.REPLAY_FINGERPRINT_MISMATCH,
          'fingerprint',
          'Replay fingerprint configuration does not match the gauge registry',
        );
      }
      return reducers;
    },
  }]);
  const derived = await deriveReplayFingerprint({
    ledger: input.ledger,
    eventRegistry: input.eventRegistry,
    versionRegistry: createReplayFingerprintVersionRegistry(),
    componentRegistry,
    runId: input.runId,
    rangeStartSequence: 1,
    rangeEndSequence: cutoff.sequence,
    replay: {
      reducerId: input.gaugeId,
      reducerVersion: definition.reducerDigest,
      projectionSchemaVersion: definition.outputSchemaVersion,
      initialState,
      replayInputDigests: {
        [INITIAL_STATE_REPLAY_INPUT]: sha256Bytes(canonicalBytes(initialState)),
        gauge_configuration: definition.configurationDigest,
      },
    },
  });
  return Object.freeze({
    finalDigest: derived.descriptor.final_digest,
    accumulator: derived.projection.state.accumulator,
  });
}

/** Read only through the authorized ledger and bind the result to a replay fingerprint. */
export async function replayGaugeFromLedger(
  input: GaugeLedgerReplayInput,
): Promise<GaugeReplayOutcome> {
  if (!(input.ledger instanceof AppendOnlyLedger)) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.INVALID_INPUT,
      'stream',
      'Gauge ledger replay accepts only the shipped authorized-ledger reader',
    );
  }
  const verifiedEvents = await input.ledger.readVerifiedEvents();
  const ledgerHead = await input.ledger.getVerifiedHead();
  const cutoff = input.cutoff ?? ledgerHead;
  if (
    cutoff.ledgerId !== ledgerHead.ledgerId
    || cutoff.sequence > ledgerHead.sequence
  ) {
    streamFailure('Gauge cutoff is outside the verified ledger head');
  }
  const outcome = replayGauge(input.gaugeRegistry, {
    verifiedEvents,
    cutoff,
    eventRegistryDigest: input.eventRegistry.digest,
    gaugeId: input.gaugeId,
    gaugeVersion: input.gaugeVersion,
    checkpoint: input.checkpoint,
  });
  if (cutoff.sequence === 0) return outcome;
  const fingerprint = await deriveGaugeFingerprint(input, cutoff);
  if (canonicalJson(fingerprint.accumulator) !== canonicalJson(outcome.accumulator)) {
    throw new StreamFoldGaugeError(
      StreamFoldGaugeErrorCodes.REPLAY_FINGERPRINT_MISMATCH,
      'fingerprint',
      'Gauge checkpoint result does not match the full replay fingerprint projection',
      { gaugeId: input.gaugeId, cutoffSequence: cutoff.sequence },
    );
  }
  const result: GaugeResultEnvelope = Object.freeze({
    ...outcome.result,
    replayFingerprintDigest: fingerprint.finalDigest,
  });
  return Object.freeze({
    ...outcome,
    result,
    resultBytes: canonicalBytes(result),
  });
}
