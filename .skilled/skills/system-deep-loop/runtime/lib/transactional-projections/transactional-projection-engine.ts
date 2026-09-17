// ──────────────────────────────────
// MODULE: Transactional Projection Engine
// ──────────────────────────────────

import { GENESIS_RECORD_HASH } from '../authorized-ledger/index.js';
import { canonicalBytes, canonicalJson, sha256Bytes } from '../event-envelope/index.js';
import {
  LocksAndFencingError,
  LocksAndFencingErrorCodes,
} from '../locks-and-fencing/index.js';
import {
  GaugeRegistry,
  StreamFoldGaugeError,
  StreamFoldGaugeErrorCodes,
} from '../stream-fold-gauges/index.js';
import {
  TransactionalProjectionError,
  TransactionalProjectionErrorCodes,
} from './transactional-projection-errors.js';

import type { LedgerRecordFrame, VerifiedLedgerEvent } from '../authorized-ledger/index.js';
import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type { ReplayIdentity } from '../locks-and-fencing/index.js';
import type {
  RegisteredProjectionBundle,
  RegisteredProjectionView,
} from './projection-bundle-registry.js';
import type { ProjectionBundleRegistry } from './projection-bundle-registry.js';
import type { TransactionalProjectionStore } from './transactional-projection-store.js';
import type {
  ApplyProjectionEventInput,
  ProjectionApplyReceipt,
  ProjectionFaultInjection,
  ProjectionGaugeMaterialization,
  ProjectionGeneration,
  ProjectionReplayProvenance,
  ProjectionResumeDecision,
  ProjectionSnapshot,
  ProjectionStoreRead,
  ProjectionStoreState,
  ProjectionViewMaterialization,
  ProjectionWatermark,
  PublishProjectionGenerationInput,
  RollbackProjectionGenerationInput,
  StageProjectionRebuildInput,
} from './transactional-projection-types.js';

const HASH_PATTERN = /^[a-f0-9]{64}$/u;

type OpenGeneration = Pick<ProjectionGeneration,
  | 'generationSchemaVersion'
  | 'generationId'
  | 'ledgerId'
  | 'bundleId'
  | 'bundleVersion'
  | 'projectionSchemaVersion'
  | 'bundleDigest'
  | 'reducerDigest'
  | 'configurationDigest'
  | 'eventRegistryDigest'
  | 'watermark'
  | 'replayProvenance'
  | 'views'
  | 'gauges'
  | 'receipts'>;

export interface TransactionalProjectionEngineOptions {
  readonly store: TransactionalProjectionStore;
  readonly bundleRegistry: ProjectionBundleRegistry;
  readonly gaugeRegistry: GaugeRegistry;
  readonly bundleId: string;
  readonly bundleVersion: string;
  readonly eventRegistryDigest: string;
  readonly retainedPublishedGenerations?: number;
}

function cloneJson<T extends JsonValue>(value: T): T {
  return JSON.parse(canonicalJson(value)) as T;
}

function deepFreeze<T>(value: T): Readonly<T> {
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

function frozenJson<T extends JsonValue>(value: T): Readonly<T> {
  return deepFreeze(cloneJson(value));
}

function hashJson(value: JsonValue): string {
  return sha256Bytes(canonicalBytes(value));
}

function finalizeView(
  view: RegisteredProjectionView,
  state: Readonly<JsonObject>,
  sequence: number,
): JsonObject {
  try {
    const output = cloneJson(view.finalize(frozenJson(state)));
    const repeatedOutput = cloneJson(view.finalize(frozenJson(state)));
    if (canonicalJson(output) !== canonicalJson(repeatedOutput)) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.REDUCER_FAILURE,
        'reducer',
        'Projection finalizer produced unstable canonical output',
        { viewId: view.viewId, sequence },
      );
    }
    if (!view.validateOutput(output)) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.CONSTRAINT_VIOLATION,
        'reducer',
        'Projection output failed its registered validator',
        { viewId: view.viewId, sequence },
      );
    }
    return output;
  } catch (error: unknown) {
    if (error instanceof TransactionalProjectionError) throw error;
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.REDUCER_FAILURE,
      'reducer',
      'Projection finalizer failed or produced non-canonical output',
      { viewId: view.viewId, sequence },
    );
  }
}

function asRecord<T>(object: JsonObject, key: string): T | null {
  const value = object[key];
  return value && typeof value === 'object' && !Array.isArray(value) ? value as T : null;
}

function replayProvenance(identity: ReplayIdentity): ProjectionReplayProvenance {
  return frozenJson({ ...identity }) as ProjectionReplayProvenance;
}

function sameReplayIdentity(
  left: ReplayIdentity | ProjectionReplayProvenance | null,
  right: ReplayIdentity | ProjectionReplayProvenance | null,
): boolean {
  return canonicalJson(left as JsonValue) === canonicalJson(right as JsonValue);
}

function assertReplayIdentity(
  identity: ReplayIdentity,
  ledgerId: string,
  sequence: number,
): void {
  if (
    !Number.isSafeInteger(identity.fingerprintVersion)
    || identity.fingerprintVersion < 1
    || identity.ledgerId !== ledgerId
    || !identity.runId
    || identity.rangeStartSequence !== 1
    || identity.rangeEndSequence !== sequence
    || !HASH_PATTERN.test(identity.finalDigest)
  ) {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.WATERMARK_INVALID,
      'watermark',
      'Replay identity does not verify the exact ledger prefix being committed',
      { ledgerId, sequence },
    );
  }
}

function verifiedFrame(event: VerifiedLedgerEvent, ledgerId: string, registryDigest: string): void {
  const { frame } = event;
  const { record_hash: ignoredRecordHash, ...recordCore } = frame;
  void ignoredRecordHash;
  let decoded: Buffer;
  try {
    decoded = Buffer.from(frame.canonical_event_bytes, 'base64');
  } catch {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.LEDGER_CORRUPTION,
      'ledger',
      'Ledger frame event bytes are not valid base64',
      { sequence: frame.sequence },
    );
  }
  const envelope = event.event.stored.envelope;
  const byteMatch = Buffer.from(event.event.stored.bytes).equals(decoded);
  if (
    frame.frame_version !== 1
    || frame.ledger_id !== ledgerId
    || event.event.registryDigest !== registryDigest
    || frame.record_hash !== hashJson(recordCore as unknown as JsonObject)
    || frame.canonical_event_hash !== sha256Bytes(decoded)
    || frame.canonical_event_hash !== event.event.stored.digest
    || decoded.toString('base64') !== frame.canonical_event_bytes
    || !byteMatch
    || frame.receipt.ledger_id !== ledgerId
    || frame.receipt.sequence !== frame.sequence
    || frame.receipt.event_id !== envelope.event_id
    || frame.receipt.event_type !== envelope.event_type
    || frame.receipt.event_version !== event.event.storedVersion
    || frame.receipt.stream_id !== envelope.stream_id
    || frame.receipt.stream_sequence !== envelope.stream_sequence
    || frame.authorization_ref.authority_epoch !== envelope.authority_epoch
  ) {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.LEDGER_CORRUPTION,
      'ledger',
      'Projection input is not an internally consistent verified ledger event',
      { sequence: frame.sequence },
    );
  }
}

function assertClosedPrefix(
  events: readonly VerifiedLedgerEvent[],
  ledgerId: string,
  registryDigest: string,
  cutoffSequence: number,
  cutoffRecordHash: string,
): void {
  if (events.length !== cutoffSequence) {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.SEQUENCE_GAP,
      'ledger',
      'A rebuild requires the complete ledger prefix from genesis through the cutoff',
      { actualLength: events.length, cutoffSequence },
    );
  }
  let priorHash = GENESIS_RECORD_HASH;
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index]!;
    verifiedFrame(event, ledgerId, registryDigest);
    if (event.frame.sequence !== index + 1 || event.frame.prev_record_hash !== priorHash) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.LEDGER_CORRUPTION,
        'ledger',
        'Ledger prefix order or hash continuity is invalid',
        { sequence: event.frame.sequence },
      );
    }
    priorHash = event.frame.record_hash;
  }
  if (priorHash !== cutoffRecordHash || (cutoffSequence === 0 && cutoffRecordHash !== GENESIS_RECORD_HASH)) {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.LEDGER_CORRUPTION,
      'ledger',
      'Rebuild cutoff does not match the verified ledger prefix head',
      { cutoffSequence },
    );
  }
}

function expectedWatermarkEquals(left: ProjectionWatermark, right: ProjectionWatermark): boolean {
  return canonicalJson(left) === canonicalJson(right);
}

function inputDigest(
  generation: ProjectionGeneration,
  event: VerifiedLedgerEvent,
): string {
  return hashJson({
    generationId: generation.generationId,
    bundleId: generation.bundleId,
    bundleVersion: generation.bundleVersion,
    bundleDigest: generation.bundleDigest,
    reducerDigest: generation.reducerDigest,
    configurationDigest: generation.configurationDigest,
    eventRegistryDigest: generation.eventRegistryDigest,
    sequence: event.frame.sequence,
    recordHash: event.frame.record_hash,
    canonicalEventHash: event.frame.canonical_event_hash,
    canonicalEventBytes: event.frame.canonical_event_bytes,
    effectiveEventVersion: event.event.effectiveVersion,
  });
}

function generationContentForHash(generation: OpenGeneration): JsonObject {
  const views: JsonObject = {};
  for (const [id, raw] of Object.entries(generation.views)) {
    const { generationId, ...materialization } = raw as unknown as ProjectionViewMaterialization;
    void generationId;
    views[id] = materialization as unknown as JsonObject;
  }
  const gauges: JsonObject = {};
  for (const [id, raw] of Object.entries(generation.gauges)) {
    const { generationId, ...materialization } = raw as unknown as ProjectionGaugeMaterialization;
    void generationId;
    gauges[id] = materialization as unknown as JsonObject;
  }
  const {
    generationId,
    receiptId,
    ...watermark
  } = generation.watermark;
  void generationId;
  void receiptId;
  return {
    ledgerId: generation.ledgerId,
    bundleId: generation.bundleId,
    bundleVersion: generation.bundleVersion,
    projectionSchemaVersion: generation.projectionSchemaVersion,
    bundleDigest: generation.bundleDigest,
    reducerDigest: generation.reducerDigest,
    configurationDigest: generation.configurationDigest,
    eventRegistryDigest: generation.eventRegistryDigest,
    watermark: watermark as unknown as JsonObject,
    views,
    gauges,
  };
}

function closeGeneration(
  generation: OpenGeneration,
): ProjectionGeneration {
  return frozenJson({
    ...generation,
    canonicalProjectionHash: hashJson(generationContentForHash(generation)),
  }) as ProjectionGeneration;
}

function materializationHashes(materializations: JsonObject, field: 'outputHash'): JsonObject {
  const hashes: JsonObject = {};
  for (const [id, raw] of Object.entries(materializations)) {
    hashes[id] = (raw as Record<string, JsonValue>)[field] as string;
  }
  return hashes;
}

function emptyGeneration(
  generationId: string,
  ledgerId: string,
  bundle: RegisteredProjectionBundle,
  gaugeRegistry: GaugeRegistry,
  eventRegistryDigest: string,
): ProjectionGeneration {
  const views: JsonObject = {};
  const gauges: JsonObject = {};
  for (const unitId of bundle.dependencyOrder) {
    const view = bundle.views.get(unitId);
    if (view) {
      const state = cloneJson(view.initialState);
      const output = finalizeView(view, state, 0);
      views[unitId] = {
        materializationSchemaVersion: 1,
        generationId,
        viewId: view.viewId,
        viewVersion: view.viewVersion,
        outputSchemaVersion: view.outputSchemaVersion,
        reducerDigest: view.reducerDigest,
        configurationDigest: view.configurationDigest,
        cutoffSequence: 0,
        cutoffRecordHash: GENESIS_RECORD_HASH,
        state,
        stateHash: hashJson(state),
        output,
        outputHash: hashJson(output),
      };
      continue;
    }
    const binding = bundle.gaugeBindings.get(unitId)!;
    const contract = gaugeRegistry.resolve(binding.gaugeId, binding.gaugeVersion);
    const accumulator = cloneJson(gaugeRegistry.initialAccumulator(binding.gaugeId, binding.gaugeVersion));
    const output = cloneJson(gaugeRegistry.finalize(binding.gaugeId, binding.gaugeVersion, accumulator));
    gauges[unitId] = {
      materializationSchemaVersion: 1,
      generationId,
      gaugeId: binding.gaugeId,
      gaugeVersion: binding.gaugeVersion,
      gaugeRegistryDigest: gaugeRegistry.digest,
      reducerDigest: contract.reducerDigest,
      configurationDigest: contract.configurationDigest,
      cutoffSequence: 0,
      cutoffRecordHash: GENESIS_RECORD_HASH,
      accumulator,
      accumulatorHash: hashJson(accumulator),
      output,
      outputHash: hashJson(output),
    };
  }
  const watermark: ProjectionWatermark = {
    watermarkSchemaVersion: 1,
    ledgerId,
    generationId,
    bundleId: bundle.manifest.bundleId,
    bundleVersion: bundle.manifest.bundleVersion,
    bundleDigest: bundle.manifest.bundleDigest,
    reducerDigest: bundle.manifest.reducerDigest,
    configurationDigest: bundle.manifest.configurationDigest,
    eventRegistryDigest,
    sequence: 0,
    recordHash: GENESIS_RECORD_HASH,
    eventHash: null,
    receiptId: null,
    replayFingerprintDigest: null,
  };
  return closeGeneration({
    generationSchemaVersion: 1,
    generationId,
    ledgerId,
    bundleId: bundle.manifest.bundleId,
    bundleVersion: bundle.manifest.bundleVersion,
    projectionSchemaVersion: bundle.manifest.projectionSchemaVersion,
    bundleDigest: bundle.manifest.bundleDigest,
    reducerDigest: bundle.manifest.reducerDigest,
    configurationDigest: bundle.manifest.configurationDigest,
    eventRegistryDigest,
    watermark,
    replayProvenance: null,
    views,
    gauges,
    receipts: {},
  });
}

function prepareEvent(
  prior: ProjectionGeneration,
  event: VerifiedLedgerEvent,
  replayIdentity: ReplayIdentity,
  bundle: RegisteredProjectionBundle,
  gaugeRegistry: GaugeRegistry,
  fault: ProjectionFaultInjection | undefined,
): { readonly generation: ProjectionGeneration; readonly receipt: ProjectionApplyReceipt } {
  const sequence = event.frame.sequence;
  const views = cloneJson(prior.views);
  const gauges = cloneJson(prior.gauges);
  const dependencyOutputs: Record<string, Readonly<JsonObject>> = {};
  for (const unitId of bundle.dependencyOrder) {
    const view = bundle.views.get(unitId);
    if (view) {
      const previous = asRecord<ProjectionViewMaterialization>(views, unitId)!;
      const contract = view.acceptedEvents.find(
        (entry) => entry.eventType === event.event.effective.envelope.event_type,
      );
      let state = cloneJson(previous.state);
      if (!contract && view.unknownEventPolicy === 'reject') {
        throw new TransactionalProjectionError(
          TransactionalProjectionErrorCodes.UNSUPPORTED_EVENT,
          'reducer',
          'Projection view rejected an event outside its contract',
          { viewId: unitId, sequence },
        );
      }
      if (contract && !contract.effectiveVersions.includes(event.event.effectiveVersion)) {
        throw new TransactionalProjectionError(
          TransactionalProjectionErrorCodes.UNSUPPORTED_EVENT_VERSION,
          'reducer',
          'Projection view rejected an unsupported effective event version',
          { viewId: unitId, sequence },
        );
      }
      if (contract) {
        try {
          const context = frozenJson({ ledgerSequence: sequence, dependencyOutputs }) as unknown as {
            ledgerSequence: number;
            dependencyOutputs: Readonly<Record<string, Readonly<JsonObject>>>;
          };
          const first = view.reduce(frozenJson(state), event.event, context);
          const second = view.reduce(frozenJson(state), event.event, context);
          if (canonicalJson(first) !== canonicalJson(second) || !view.validateState(first)) {
            throw new Error('unstable or invalid state');
          }
          state = cloneJson(first);
        } catch (error: unknown) {
          if (error instanceof TransactionalProjectionError) throw error;
          throw new TransactionalProjectionError(
            TransactionalProjectionErrorCodes.REDUCER_FAILURE,
            'reducer',
            'Projection reducer failed or produced unstable state',
            { viewId: unitId, sequence },
          );
        }
      }
      const output = finalizeView(view, state, sequence);
      const materialization: ProjectionViewMaterialization = {
        ...previous,
        cutoffSequence: sequence,
        cutoffRecordHash: event.frame.record_hash,
        state,
        stateHash: hashJson(state),
        output,
        outputHash: hashJson(output),
      };
      views[unitId] = materialization;
      dependencyOutputs[unitId] = output;
      fault?.afterViewPrepared?.(unitId);
      continue;
    }
    const binding = bundle.gaugeBindings.get(unitId)!;
    const previous = asRecord<ProjectionGaugeMaterialization>(gauges, unitId)!;
    try {
      const accumulator = cloneJson(gaugeRegistry.reduce(
        binding.gaugeId,
        binding.gaugeVersion,
        previous.accumulator,
        event.event,
        sequence,
      ));
      const output = cloneJson(gaugeRegistry.finalize(
        binding.gaugeId,
        binding.gaugeVersion,
        accumulator,
      ));
      gauges[unitId] = {
        ...previous,
        cutoffSequence: sequence,
        cutoffRecordHash: event.frame.record_hash,
        accumulator,
        accumulatorHash: hashJson(accumulator),
        output,
        outputHash: hashJson(output),
      } as ProjectionGaugeMaterialization;
      dependencyOutputs[unitId] = output;
      fault?.afterGaugePrepared?.(unitId);
    } catch (error: unknown) {
      if (error instanceof StreamFoldGaugeError) {
        const code = error.code === StreamFoldGaugeErrorCodes.UNSUPPORTED_EVENT_VERSION
          ? TransactionalProjectionErrorCodes.UNSUPPORTED_EVENT_VERSION
          : error.code === StreamFoldGaugeErrorCodes.UNSUPPORTED_EVENT
            ? TransactionalProjectionErrorCodes.UNSUPPORTED_EVENT
            : TransactionalProjectionErrorCodes.REDUCER_FAILURE;
        throw new TransactionalProjectionError(
          code,
          'reducer',
          'Frozen gauge reducer rejected the verified event under its exact contract',
          { gaugeId: unitId, sequence },
        );
      }
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.REDUCER_FAILURE,
        'reducer',
        'Frozen gauge reducer rejected the verified event',
        { gaugeId: unitId, sequence },
      );
    }
  }
  const digest = inputDigest(prior, event);
  const receiptCore = {
    receiptSchemaVersion: 1 as const,
    inputDigest: digest,
    ledgerId: prior.ledgerId,
    generationId: prior.generationId,
    bundleId: prior.bundleId,
    bundleVersion: prior.bundleVersion,
    bundleDigest: prior.bundleDigest,
    reducerDigest: prior.reducerDigest,
    configurationDigest: prior.configurationDigest,
    eventRegistryDigest: prior.eventRegistryDigest,
    sequence,
    recordHash: event.frame.record_hash,
    canonicalEventHash: event.frame.canonical_event_hash,
    eventType: event.event.effective.envelope.event_type,
    eventVersion: event.event.effectiveVersion,
    priorSequence: prior.watermark.sequence,
    priorRecordHash: prior.watermark.recordHash,
    viewHashes: materializationHashes(views, 'outputHash'),
    gaugeHashes: materializationHashes(gauges, 'outputHash'),
    replayFingerprintDigest: replayIdentity.finalDigest,
  };
  const receipt: ProjectionApplyReceipt = frozenJson({
    ...receiptCore,
    receiptId: hashJson(receiptCore),
  }) as ProjectionApplyReceipt;
  fault?.afterReceiptPrepared?.();
  const watermark: ProjectionWatermark = frozenJson({
    ...prior.watermark,
    sequence,
    recordHash: event.frame.record_hash,
    eventHash: event.frame.canonical_event_hash,
    receiptId: receipt.receiptId,
    replayFingerprintDigest: replayIdentity.finalDigest,
  }) as ProjectionWatermark;
  fault?.afterWatermarkPrepared?.();
  const receipts = cloneJson(prior.receipts);
  receipts[String(sequence)] = receipt;
  return Object.freeze({
    receipt,
    generation: closeGeneration({
      ...prior,
      watermark,
      replayProvenance: replayProvenance(replayIdentity),
      views,
      gauges,
      receipts,
    }),
  });
}

function nextStoreState(
  current: ProjectionStoreState,
  generations: JsonObject,
  overrides: Partial<ProjectionStoreState> = {},
): ProjectionStoreState {
  return frozenJson({ ...current, ...overrides, generations }) as ProjectionStoreState;
}

function projectionErrorFromStore(error: unknown): never {
  if (error instanceof TransactionalProjectionError) throw error;
  if (error instanceof LocksAndFencingError) {
    const writerCodes = new Set<string>([
      LocksAndFencingErrorCodes.LEASE_LOST,
      LocksAndFencingErrorCodes.STALE_FENCE,
      LocksAndFencingErrorCodes.TOKEN_ROLLBACK,
    ]);
    throw new TransactionalProjectionError(
      writerCodes.has(error.code)
        ? TransactionalProjectionErrorCodes.WRITER_CONFLICT
        : TransactionalProjectionErrorCodes.WATERMARK_MISMATCH,
      'transaction',
      'Fenced projection commit was rejected before mutation',
      { causeCode: error.code },
    );
  }
  throw error;
}

/** Applies verified ledger events into one atomic, fenced projection bundle. */
export class TransactionalProjectionEngine {
  public readonly store: TransactionalProjectionStore;
  readonly #bundle: RegisteredProjectionBundle;
  readonly #gauges: GaugeRegistry;
  readonly #registryDigest: string;
  readonly #retention: number;

  public constructor(options: TransactionalProjectionEngineOptions) {
    if (!HASH_PATTERN.test(options.eventRegistryDigest)) {
      throw new TypeError('eventRegistryDigest must be a SHA-256 digest');
    }
    this.store = options.store;
    this.#bundle = options.bundleRegistry.resolve(options.bundleId, options.bundleVersion);
    this.#gauges = options.gaugeRegistry;
    this.#registryDigest = options.eventRegistryDigest;
    this.#retention = options.retainedPublishedGenerations ?? 2;
    if (!Number.isSafeInteger(this.#retention) || this.#retention < 1) {
      throw new TypeError('retainedPublishedGenerations must be a positive safe integer');
    }
  }

  public async applyEvent(input: ApplyProjectionEventInput): Promise<ProjectionApplyReceipt> {
    verifiedFrame(input.event, input.expectedWatermark.ledgerId, this.#registryDigest);
    assertReplayIdentity(input.replayIdentity, input.expectedWatermark.ledgerId, input.event.frame.sequence);
    const read = this.store.read();
    const generation = this.#generation(read, input.generationId);
    this.#validateGeneration(generation);
    const digest = inputDigest(generation, input.event);
    const priorReceipt = asRecord<ProjectionApplyReceipt>(
      generation.receipts,
      String(input.event.frame.sequence),
    );
    if (priorReceipt) {
      if (
        priorReceipt.inputDigest === digest
        && priorReceipt.canonicalEventHash === input.event.frame.canonical_event_hash
        && priorReceipt.bundleVersion === generation.bundleVersion
      ) return priorReceipt;
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.IDEMPOTENCY_CONFLICT,
        'transaction',
        'Sequence identity is already bound to different projection input bytes or versions',
        { sequence: input.event.frame.sequence },
      );
    }
    if (!expectedWatermarkEquals(generation.watermark, input.expectedWatermark)) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.WATERMARK_MISMATCH,
        'watermark',
        'Expected watermark does not match the committed generation head',
        { sequence: input.event.frame.sequence },
      );
    }
    if (
      input.event.frame.sequence !== generation.watermark.sequence + 1
      || input.event.frame.prev_record_hash !== generation.watermark.recordHash
    ) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.SEQUENCE_GAP,
        'ledger',
        'Live projection commits require the exact next ledger event',
        { sequence: input.event.frame.sequence },
      );
    }
    const prepared = prepareEvent(
      generation,
      input.event,
      input.replayIdentity,
      this.#bundle,
      this.#gauges,
      input.faultInjection,
    );
    const generations = cloneJson(read.state.generations);
    generations[input.generationId] = prepared.generation;
    input.faultInjection?.beforeCommit?.();
    try {
      await this.store.replace(
        input.lease,
        read.stateVersion,
        nextStoreState(read.state, generations),
        input.replayIdentity,
      );
    } catch (error: unknown) {
      projectionErrorFromStore(error);
    }
    input.faultInjection?.afterCommit?.();
    return prepared.receipt;
  }

  public async stageRebuild(input: StageProjectionRebuildInput): Promise<ProjectionGeneration> {
    const read = this.store.read();
    if (Object.hasOwn(read.state.generations, input.generationId)) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.GENERATION_CONFLICT,
        'generation',
        'Rebuild target must be a fresh isolated generation',
        { generationId: input.generationId },
      );
    }
    assertClosedPrefix(
      input.verifiedEvents,
      read.state.ledgerId,
      this.#registryDigest,
      input.cutoffSequence,
      input.cutoffRecordHash,
    );
    if (input.cutoffSequence > 0) {
      if (!input.replayIdentity) {
        throw new TransactionalProjectionError(
          TransactionalProjectionErrorCodes.WATERMARK_INVALID,
          'watermark',
          'Non-empty rebuilds require verified replay provenance',
        );
      }
      assertReplayIdentity(input.replayIdentity, read.state.ledgerId, input.cutoffSequence);
    } else if (input.replayIdentity !== null) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.WATERMARK_INVALID,
        'watermark',
        'Genesis rebuilds cannot claim a non-empty replay range',
      );
    }
    let generation = emptyGeneration(
      input.generationId,
      read.state.ledgerId,
      this.#bundle,
      this.#gauges,
      this.#registryDigest,
    );
    for (const event of input.verifiedEvents) {
      generation = prepareEvent(
        generation,
        event,
        input.replayIdentity!,
        this.#bundle,
        this.#gauges,
        input.faultInjection,
      ).generation;
    }
    this.#validateGeneration(generation);
    const generations = cloneJson(read.state.generations);
    generations[input.generationId] = generation;
    const stagedGenerationIds = [...read.state.stagedGenerationIds, input.generationId];
    input.faultInjection?.beforeCommit?.();
    try {
      await this.store.replace(
        input.lease,
        read.stateVersion,
        nextStoreState(read.state, generations, { stagedGenerationIds }),
        read.replayIdentity,
      );
    } catch (error: unknown) {
      projectionErrorFromStore(error);
    }
    input.faultInjection?.afterCommit?.();
    return generation;
  }

  public async publishGeneration(input: PublishProjectionGenerationInput): Promise<ProjectionSnapshot> {
    const read = this.store.read();
    if (read.state.activeGenerationId !== input.expectedActiveGenerationId) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.GENERATION_CONFLICT,
        'generation',
        'Active generation pointer changed before publication',
        { generationId: input.generationId },
      );
    }
    if (!read.state.stagedGenerationIds.includes(input.generationId)) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.GENERATION_INVALID,
        'generation',
        'Only a complete staged generation can be published',
        { generationId: input.generationId },
      );
    }
    const generation = this.#generation(read, input.generationId);
    this.#validateGeneration(generation);
    const publicationOrder = [
      ...read.state.publicationOrder.filter((id) => id !== input.generationId),
      input.generationId,
    ].slice(-this.#retention);
    const keep = new Set([...publicationOrder, ...read.state.stagedGenerationIds.filter(
      (id) => id !== input.generationId,
    )]);
    const generations = cloneJson(read.state.generations);
    for (const id of Object.keys(generations)) if (!keep.has(id)) delete generations[id];
    const next = nextStoreState(read.state, generations, {
      activeGenerationId: input.generationId,
      previousGenerationId: read.state.activeGenerationId,
      publicationOrder,
      stagedGenerationIds: read.state.stagedGenerationIds.filter((id) => id !== input.generationId),
    });
    input.faultInjection?.beforeCommit?.();
    try {
      await this.store.replace(
        input.lease,
        read.stateVersion,
        next,
        generation.replayProvenance,
      );
    } catch (error: unknown) {
      projectionErrorFromStore(error);
    }
    input.faultInjection?.afterCommit?.();
    return this.readSnapshot();
  }

  public async rollbackGeneration(input: RollbackProjectionGenerationInput): Promise<ProjectionSnapshot> {
    const read = this.store.read();
    if (
      read.state.activeGenerationId !== input.expectedActiveGenerationId
      || read.state.previousGenerationId !== input.generationId
      || !read.state.publicationOrder.includes(input.generationId)
    ) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.GENERATION_CONFLICT,
        'generation',
        'Rollback requires the exact retained predecessor and active pointer',
        { generationId: input.generationId },
      );
    }
    const target = this.#generation(read, input.generationId);
    this.#validateGeneration(target);
    const publicationOrder = [
      ...read.state.publicationOrder.filter((id) => id !== input.generationId),
      input.generationId,
    ];
    const next = nextStoreState(read.state, cloneJson(read.state.generations), {
      activeGenerationId: input.generationId,
      previousGenerationId: read.state.activeGenerationId,
      publicationOrder,
    });
    input.faultInjection?.beforeCommit?.();
    try {
      await this.store.replace(
        input.lease,
        read.stateVersion,
        next,
        target.replayProvenance,
      );
    } catch (error: unknown) {
      projectionErrorFromStore(error);
    }
    input.faultInjection?.afterCommit?.();
    return this.readSnapshot();
  }

  public readSnapshot(generationId?: string): ProjectionSnapshot {
    const read = this.store.read();
    const selected = generationId ?? read.state.activeGenerationId;
    if (!selected) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.GENERATION_INVALID,
        'snapshot',
        'No published projection generation is available',
      );
    }
    const generation = this.#generation(read, selected);
    this.#validateGeneration(generation);
    const currentReceipt = generation.watermark.receiptId
      ? asRecord<ProjectionApplyReceipt>(generation.receipts, String(generation.watermark.sequence))
      : null;
    return frozenJson({
      snapshotSchemaVersion: 1,
      generationId: generation.generationId,
      ledgerId: generation.ledgerId,
      bundleId: generation.bundleId,
      bundleVersion: generation.bundleVersion,
      bundleDigest: generation.bundleDigest,
      reducerDigest: generation.reducerDigest,
      configurationDigest: generation.configurationDigest,
      eventRegistryDigest: generation.eventRegistryDigest,
      cutoffSequence: generation.watermark.sequence,
      cutoffRecordHash: generation.watermark.recordHash,
      applyReceipt: currentReceipt,
      replayProvenance: generation.replayProvenance,
      views: generation.views,
      gauges: generation.gauges,
      canonicalProjectionHash: generation.canonicalProjectionHash,
    }) as ProjectionSnapshot;
  }

  /** Return the validated committed head callers must compare-and-swap against. */
  public readWatermark(generationId?: string): ProjectionWatermark {
    const read = this.store.read();
    const selected = generationId ?? read.state.activeGenerationId;
    if (!selected) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.GENERATION_INVALID,
        'watermark',
        'No projection generation is available for watermark comparison',
      );
    }
    const generation = this.#generation(read, selected);
    this.#validateGeneration(generation);
    return frozenJson(generation.watermark) as ProjectionWatermark;
  }

  public planResume(
    verifiedEvents: readonly VerifiedLedgerEvent[],
    verifiedReplayIdentity: ReplayIdentity | null,
  ): ProjectionResumeDecision {
    try {
      const read = this.store.read();
      if (!read.state.activeGenerationId) return { mode: 'rebuild', reasonCode: 'NO_ACTIVE_GENERATION' };
      const generation = this.#generation(read, read.state.activeGenerationId);
      this.#validateGeneration(generation);
      const sequence = generation.watermark.sequence;
      const prefix = verifiedEvents.slice(0, sequence);
      assertClosedPrefix(
        prefix,
        generation.ledgerId,
        this.#registryDigest,
        sequence,
        generation.watermark.recordHash,
      );
      if (
        sequence === 0
        && (verifiedReplayIdentity !== null || read.replayIdentity !== null)
      ) return { mode: 'rebuild', reasonCode: 'REPLAY_PROVENANCE_MISMATCH' };
      if (
        sequence > 0
        && (!verifiedReplayIdentity
          || !sameReplayIdentity(verifiedReplayIdentity, generation.replayProvenance)
          || !sameReplayIdentity(verifiedReplayIdentity, read.replayIdentity))
      ) return { mode: 'rebuild', reasonCode: 'REPLAY_PROVENANCE_MISMATCH' };
      if (verifiedEvents.length > 0 && verifiedEvents[0]!.frame.ledger_id !== generation.ledgerId) {
        return { mode: 'rebuild', reasonCode: 'LEDGER_ID_MISMATCH' };
      }
      return Object.freeze({
        mode: 'resume',
        generationId: generation.generationId,
        nextSequence: sequence + 1,
        watermark: generation.watermark,
      });
    } catch (error: unknown) {
      return Object.freeze({
        mode: 'rebuild',
        reasonCode: error instanceof TransactionalProjectionError ? error.code : 'STORE_CORRUPTION',
      });
    }
  }

  #generation(read: ProjectionStoreRead, generationId: string): ProjectionGeneration {
    const generation = asRecord<ProjectionGeneration>(read.state.generations, generationId);
    if (!generation) {
      throw new TransactionalProjectionError(
        TransactionalProjectionErrorCodes.GENERATION_INVALID,
        'generation',
        'Projection generation is not present in the atomic store',
        { generationId },
      );
    }
    return generation;
  }

  #validateGeneration(generation: ProjectionGeneration): void {
    const manifest = this.#bundle.manifest;
    if (
      generation.generationSchemaVersion !== 1
      || generation.bundleId !== manifest.bundleId
      || generation.bundleVersion !== manifest.bundleVersion
      || generation.projectionSchemaVersion !== manifest.projectionSchemaVersion
      || generation.bundleDigest !== manifest.bundleDigest
      || generation.reducerDigest !== manifest.reducerDigest
      || generation.configurationDigest !== manifest.configurationDigest
      || generation.eventRegistryDigest !== this.#registryDigest
      || generation.watermark.ledgerId !== generation.ledgerId
      || generation.watermark.generationId !== generation.generationId
      || generation.watermark.bundleId !== generation.bundleId
      || generation.watermark.bundleVersion !== generation.bundleVersion
      || generation.watermark.bundleDigest !== generation.bundleDigest
      || generation.watermark.reducerDigest !== generation.reducerDigest
      || generation.watermark.configurationDigest !== generation.configurationDigest
      || generation.watermark.eventRegistryDigest !== generation.eventRegistryDigest
    ) this.#invalidGeneration(generation, 'Generation metadata does not match the registered bundle');
    const validateMember = (raw: JsonValue, id: string, kind: 'view' | 'gauge'): void => {
      if (!raw || Array.isArray(raw) || typeof raw !== 'object') this.#invalidGeneration(generation, 'Materialization is malformed');
      const member = raw as Record<string, JsonValue>;
      if (
        member.generationId !== generation.generationId
        || member.cutoffSequence !== generation.watermark.sequence
        || member.cutoffRecordHash !== generation.watermark.recordHash
        || member.outputHash !== hashJson(member.output as JsonObject)
        || (kind === 'view' && member.stateHash !== hashJson(member.state as JsonObject))
        || (kind === 'gauge' && member.accumulatorHash !== hashJson(member.accumulator as JsonObject))
      ) this.#mixedGeneration(generation, id);
      if (kind === 'view') {
        const view = this.#bundle.views.get(id);
        if (
          !view
          || member.viewVersion !== view.viewVersion
          || member.reducerDigest !== view.reducerDigest
          || member.configurationDigest !== view.configurationDigest
          || !view.validateState(member.state as JsonObject)
          || !view.validateOutput(member.output as JsonObject)
        ) this.#invalidGeneration(generation, 'View materialization does not match its registry contract');
      } else {
        const binding = this.#bundle.gaugeBindings.get(id);
        const contract = binding && this.#gauges.resolve(binding.gaugeId, binding.gaugeVersion);
        if (
          !binding
          || !contract
          || member.gaugeVersion !== binding.gaugeVersion
          || member.gaugeRegistryDigest !== this.#gauges.digest
          || member.reducerDigest !== contract.reducerDigest
          || member.configurationDigest !== contract.configurationDigest
          || !this.#gauges.validateAccumulator(binding.gaugeId, binding.gaugeVersion, member.accumulator as JsonObject)
          || canonicalJson(member.output as JsonObject) !== canonicalJson(
            this.#gauges.finalize(binding.gaugeId, binding.gaugeVersion, member.accumulator as JsonObject),
          )
        ) this.#invalidGeneration(generation, 'Gauge materialization does not match the frozen registry contract');
      }
    };
    for (const id of this.#bundle.views.keys()) validateMember(generation.views[id]!, id, 'view');
    for (const id of this.#bundle.gaugeBindings.keys()) validateMember(generation.gauges[id]!, id, 'gauge');
    const receiptKeys = Object.keys(generation.receipts).sort((left, right) => Number(left) - Number(right));
    if (receiptKeys.length !== generation.watermark.sequence) {
      this.#invalidGeneration(generation, 'Receipt cardinality does not match the committed watermark');
    }
    let priorRecordHash = GENESIS_RECORD_HASH;
    for (let sequence = 1; sequence <= receiptKeys.length; sequence += 1) {
      if (receiptKeys[sequence - 1] !== String(sequence)) {
        this.#invalidGeneration(generation, 'Receipt sequence is not contiguous from genesis');
      }
      const receipt = asRecord<ProjectionApplyReceipt>(generation.receipts, String(sequence));
      if (!receipt) this.#invalidGeneration(generation, 'Receipt row is malformed');
      const { receiptId, ...receiptCore } = receipt;
      if (
        receipt.receiptSchemaVersion !== 1
        || receipt.receiptId !== hashJson(receiptCore)
        || receipt.ledgerId !== generation.ledgerId
        || receipt.generationId !== generation.generationId
        || receipt.bundleId !== generation.bundleId
        || receipt.bundleVersion !== generation.bundleVersion
        || receipt.bundleDigest !== generation.bundleDigest
        || receipt.reducerDigest !== generation.reducerDigest
        || receipt.configurationDigest !== generation.configurationDigest
        || receipt.eventRegistryDigest !== generation.eventRegistryDigest
        || receipt.sequence !== sequence
        || receipt.priorSequence !== sequence - 1
        || receipt.priorRecordHash !== priorRecordHash
        || !HASH_PATTERN.test(receipt.inputDigest)
        || !HASH_PATTERN.test(receipt.recordHash)
        || !HASH_PATTERN.test(receipt.canonicalEventHash)
      ) this.#invalidGeneration(generation, 'Apply receipt does not verify against its generation and prior head');
      priorRecordHash = receipt.recordHash;
    }
    const lastReceipt = receiptKeys.length > 0
      ? asRecord<ProjectionApplyReceipt>(generation.receipts, String(receiptKeys.length))
      : null;
    if (
      generation.watermark.sequence === 0
        ? generation.watermark.receiptId !== null || generation.watermark.eventHash !== null
        : !lastReceipt
          || generation.watermark.receiptId !== lastReceipt.receiptId
          || generation.watermark.eventHash !== lastReceipt.canonicalEventHash
          || generation.watermark.recordHash !== lastReceipt.recordHash
          || canonicalJson(lastReceipt.viewHashes) !== canonicalJson(materializationHashes(generation.views, 'outputHash'))
          || canonicalJson(lastReceipt.gaugeHashes) !== canonicalJson(materializationHashes(generation.gauges, 'outputHash'))
    ) this.#invalidGeneration(generation, 'Watermark is not bound to the final verified apply receipt');
    if (
      Object.keys(generation.views).length !== this.#bundle.views.size
      || Object.keys(generation.gauges).length !== this.#bundle.gaugeBindings.size
      || generation.canonicalProjectionHash !== hashJson(generationContentForHash(generation))
    ) this.#invalidGeneration(generation, 'Generation membership or canonical content hash is invalid');
    if (generation.watermark.sequence === 0) {
      if (generation.watermark.recordHash !== GENESIS_RECORD_HASH || generation.replayProvenance !== null) {
        this.#invalidGeneration(generation, 'Genesis watermark carries non-genesis provenance');
      }
    } else if (
      !generation.replayProvenance
      || generation.replayProvenance.ledgerId !== generation.ledgerId
      || generation.replayProvenance.rangeStartSequence !== 1
      || generation.replayProvenance.rangeEndSequence !== generation.watermark.sequence
      || generation.replayProvenance.finalDigest !== generation.watermark.replayFingerprintDigest
    ) this.#invalidGeneration(generation, 'Watermark lacks exact replay provenance');
  }

  #mixedGeneration(generation: ProjectionGeneration, unitId: string): never {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.MIXED_CUTOFF,
      'snapshot',
      'Projection snapshot contains mixed generation or cutoff materializations',
      { generationId: generation.generationId, unitId },
    );
  }

  #invalidGeneration(generation: ProjectionGeneration, message: string): never {
    throw new TransactionalProjectionError(
      TransactionalProjectionErrorCodes.GENERATION_INVALID,
      'generation',
      message,
      { generationId: generation.generationId },
    );
  }
}
