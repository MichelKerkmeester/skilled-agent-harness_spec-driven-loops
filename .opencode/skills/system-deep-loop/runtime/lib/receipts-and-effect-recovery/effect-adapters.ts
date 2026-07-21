// ───────────────────────────────────────────────────────────────────
// MODULE: Replay-Safe Effect Adapters
// ───────────────────────────────────────────────────────────────────

import {
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  realpathSync,
  renameSync,
} from 'node:fs';
import {
  dirname,
  isAbsolute,
  relative,
  resolve,
} from 'node:path';

import { writeTextAtomic } from '../deep-loop/atomic-state.js';
import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  ReceiptEffectError,
  ReceiptEffectErrorCodes,
} from './errors.js';

import type { JsonObject } from '../event-envelope/index.js';
import type {
  EffectAdapter,
  EffectAdapterDescriptor,
  EffectIntentPayload,
  EffectObservation,
  EffectReconciliationObservation,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. FUNCTIONAL ADAPTER OPTIONS
// ───────────────────────────────────────────────────────────────────

export interface IdempotentApiAdapterOptions<TRequest> {
  readonly adapterId: string;
  readonly adapterVersion: string;
  readonly supportsProviderIdempotency: boolean;
  readonly supportsStatusQuery: boolean;
  readonly mutate: (
    request: TRequest,
    idempotencyKey: string,
    intent: Readonly<EffectIntentPayload>,
  ) => Promise<EffectObservation>;
  readonly query: (
    request: TRequest,
    idempotencyKey: string,
    intent: Readonly<EffectIntentPayload>,
  ) => Promise<EffectReconciliationObservation>;
}

export interface SubprocessAdapterOptions<TRequest> {
  readonly adapterId: string;
  readonly adapterVersion: string;
  readonly hasDurableOutcomeQuery: boolean;
  readonly dispatch: (
    request: TRequest,
    logicalInvocationId: string,
    intent: Readonly<EffectIntentPayload>,
  ) => Promise<EffectObservation>;
  readonly queryOutcome: (
    request: TRequest,
    logicalInvocationId: string,
    intent: Readonly<EffectIntentPayload>,
  ) => Promise<EffectReconciliationObservation>;
}

export interface AtomicFileEffectRequest {
  readonly relativePath: string;
  readonly content: string;
  readonly expectedPriorDigest: string | null;
}

export interface AtomicFileAdapterOptions {
  readonly rootDirectory: string;
  readonly adapterId?: string;
  readonly adapterVersion?: string;
  readonly now?: () => Date;
}

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function descriptor(input: Readonly<EffectAdapterDescriptor>): EffectAdapterDescriptor {
  return Object.freeze({ ...input });
}

function digestBuffer(content: Uint8Array): string {
  return sha256Bytes(content);
}

function currentFileDigest(path: string): string | null {
  return existsSync(path) ? digestBuffer(readFileSync(path)) : null;
}

function ensureInside(rootDirectory: string, candidate: string): void {
  const pathFromRoot = relative(rootDirectory, candidate);
  if (pathFromRoot === '' || pathFromRoot.startsWith('..') || isAbsolute(pathFromRoot)) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.INVALID_INPUT,
      'input',
      'File effect target must remain below its adapter root',
    );
  }
}

function targetPathFor(rootDirectory: string, relativePath: string): string {
  if (
    relativePath.trim() === ''
    || relativePath.includes('\0')
    || isAbsolute(relativePath)
  ) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.INVALID_INPUT,
      'input',
      'File effect requires a bounded relative target path',
    );
  }
  const target = resolve(rootDirectory, relativePath);
  ensureInside(rootDirectory, target);
  mkdirSync(dirname(target), { recursive: true, mode: 0o700 });
  const physicalRoot = realpathSync(rootDirectory);
  const physicalParent = realpathSync(dirname(target));
  const parentFromRoot = relative(physicalRoot, physicalParent);
  if (parentFromRoot.startsWith('..') || isAbsolute(parentFromRoot)) {
    throw new ReceiptEffectError(
      ReceiptEffectErrorCodes.INVALID_INPUT,
      'input',
      'File effect target resolves through a path outside its adapter root',
    );
  }
  return target;
}

function fsyncDirectory(path: string): void {
  let fileDescriptor: number | undefined;
  try {
    fileDescriptor = openSync(path, 'r');
    fsyncSync(fileDescriptor);
  } finally {
    if (fileDescriptor !== undefined) closeSync(fileDescriptor);
  }
}

function fileObservation(
  intent: Readonly<EffectIntentPayload>,
  content: string,
  observedAt: string,
): EffectObservation {
  const contentBytes = Buffer.from(content, 'utf8');
  const contentDigest = digestBuffer(contentBytes);
  return Object.freeze({
    durability: 'verified',
    external_receipt_digest: sha256Bytes(canonicalBytes({
      idempotency_key: intent.idempotency_key,
      target_identity: intent.target_identity,
      content_digest: contentDigest,
    })),
    postcondition_digest: contentDigest,
    output_digest: contentDigest,
    observed_at: observedAt,
    safe_result_metadata: Object.freeze({
      target_identity: intent.target_identity,
      byte_length: contentBytes.byteLength,
    }),
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. SUBPROCESS AND API ADAPTERS
// ───────────────────────────────────────────────────────────────────

/** Wrap a logical subprocess dispatch whose recovery query never depends on PID state. */
export function createSubprocessEffectAdapter<TRequest>(
  options: SubprocessAdapterOptions<TRequest>,
): EffectAdapter<TRequest> {
  const adapterDescriptor = descriptor({
    adapter_id: options.adapterId,
    adapter_version: options.adapterVersion,
    effect_type: 'subprocess',
    replay_safe: options.hasDurableOutcomeQuery,
    idempotency_mode: 'postcondition',
    reconciliation: options.hasDurableOutcomeQuery ? 'conclusive' : 'none',
  });
  return Object.freeze({
    descriptor: adapterDescriptor,
    execute(intent: Readonly<EffectIntentPayload>, request: TRequest): Promise<EffectObservation> {
      return options.dispatch(request, intent.logical_effect_id, intent);
    },
    reconcile(
      intent: Readonly<EffectIntentPayload>,
      request: TRequest,
    ): Promise<EffectReconciliationObservation> {
      return options.queryOutcome(request, intent.logical_effect_id, intent);
    },
  });
}

/** Wrap an API mutation only when provider idempotency and status lookup are explicit. */
export function createIdempotentApiEffectAdapter<TRequest>(
  options: IdempotentApiAdapterOptions<TRequest>,
): EffectAdapter<TRequest> {
  const isReplaySafe = options.supportsProviderIdempotency && options.supportsStatusQuery;
  const adapterDescriptor = descriptor({
    adapter_id: options.adapterId,
    adapter_version: options.adapterVersion,
    effect_type: 'api',
    replay_safe: isReplaySafe,
    idempotency_mode: 'target-key',
    reconciliation: options.supportsStatusQuery ? 'conclusive' : 'none',
  });
  return Object.freeze({
    descriptor: adapterDescriptor,
    execute(
      intent: Readonly<EffectIntentPayload>,
      request: TRequest,
      idempotencyKey: string,
    ): Promise<EffectObservation> {
      return options.mutate(request, idempotencyKey, intent);
    },
    reconcile(
      intent: Readonly<EffectIntentPayload>,
      request: TRequest,
    ): Promise<EffectReconciliationObservation> {
      return options.query(request, intent.idempotency_key, intent);
    },
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. ATOMIC FILE ADAPTER
// ───────────────────────────────────────────────────────────────────

/** Derive a bounded ledger identity without persisting the local path. */
export function atomicFileTargetIdentity(relativePath: string): string {
  return `file:v1:${sha256Bytes(canonicalBytes({ relative_path: relativePath }))}`;
}

/** Publish through a stable staging identity, fsync, atomic rename, and read-back proof. */
export function createAtomicFileEffectAdapter(
  options: AtomicFileAdapterOptions,
): EffectAdapter<AtomicFileEffectRequest> {
  mkdirSync(options.rootDirectory, { recursive: true, mode: 0o700 });
  const rootDirectory = realpathSync(options.rootDirectory);
  const now = options.now ?? (() => new Date());
  const adapterDescriptor = descriptor({
    adapter_id: options.adapterId ?? 'deep-loop-atomic-file',
    adapter_version: options.adapterVersion ?? '1',
    effect_type: 'file',
    replay_safe: true,
    idempotency_mode: 'postcondition',
    reconciliation: 'conclusive',
  });

  return Object.freeze({
    descriptor: adapterDescriptor,
    async execute(
      intent: Readonly<EffectIntentPayload>,
      request: AtomicFileEffectRequest,
    ): Promise<EffectObservation> {
      const target = targetPathFor(rootDirectory, request.relativePath);
      const targetIdentity = atomicFileTargetIdentity(request.relativePath);
      if (intent.target_identity !== targetIdentity) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.EFFECT_CONFLICT,
          'effect',
          'File request target does not match the durable target identity',
          { effectId: intent.effect_id },
        );
      }
      const desiredDigest = digestBuffer(Buffer.from(request.content, 'utf8'));
      if (desiredDigest !== intent.expected_postcondition_digest) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.EFFECT_CONFLICT,
          'effect',
          'File content does not match the durable expected postcondition',
          { effectId: intent.effect_id },
        );
      }
      const priorDigest = currentFileDigest(target);
      if (priorDigest === desiredDigest) {
        return fileObservation(intent, request.content, now().toISOString());
      }
      if (priorDigest !== request.expectedPriorDigest) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.EFFECT_CONFLICT,
          'effect',
          'File target changed since the durable intent was created',
          { effectId: intent.effect_id },
        );
      }

      const stagingDirectory = resolve(rootDirectory, '.effect-staging');
      mkdirSync(stagingDirectory, { recursive: true, mode: 0o700 });
      const stagingPath = resolve(
        stagingDirectory,
        sha256Bytes(canonicalBytes(intent.idempotency_key)),
      );
      ensureInside(rootDirectory, stagingPath);
      writeTextAtomic(stagingPath, request.content);
      renameSync(stagingPath, target);
      fsyncDirectory(dirname(target));
      if (currentFileDigest(target) !== desiredDigest) {
        throw new ReceiptEffectError(
          ReceiptEffectErrorCodes.OUTCOME_UNVERIFIED,
          'effect',
          'Atomic file publication failed read-back verification',
          { effectId: intent.effect_id },
        );
      }
      return fileObservation(intent, request.content, now().toISOString());
    },
    async reconcile(
      intent: Readonly<EffectIntentPayload>,
      request: AtomicFileEffectRequest,
    ): Promise<EffectReconciliationObservation> {
      try {
        const target = targetPathFor(rootDirectory, request.relativePath);
        if (intent.target_identity !== atomicFileTargetIdentity(request.relativePath)) {
          return Object.freeze({
            verdict: 'conflict',
            reason_code: 'target_identity_mismatch',
            evidence_digest: sha256Bytes(canonicalBytes({ target_identity_mismatch: true })),
            observed_at: now().toISOString(),
            observation: null,
          });
        }
        const currentDigest = currentFileDigest(target);
        if (currentDigest === intent.expected_postcondition_digest) {
          const observation = fileObservation(intent, request.content, now().toISOString());
          return Object.freeze({
            verdict: 'applied',
            reason_code: 'content_digest_matches',
            evidence_digest: observation.postcondition_digest,
            observed_at: observation.observed_at,
            observation,
          });
        }
        if (currentDigest === request.expectedPriorDigest) {
          return Object.freeze({
            verdict: 'not_applied',
            reason_code: 'prior_state_unchanged',
            evidence_digest: sha256Bytes(canonicalBytes({ prior_digest: currentDigest })),
            observed_at: now().toISOString(),
            observation: null,
          });
        }
        return Object.freeze({
          verdict: 'conflict',
          reason_code: 'unexpected_target_digest',
          evidence_digest: sha256Bytes(canonicalBytes({ current_digest: currentDigest })),
          observed_at: now().toISOString(),
          observation: null,
        });
      } catch {
        return Object.freeze({
          verdict: 'in_doubt',
          reason_code: 'file_reconciliation_unavailable',
          evidence_digest: sha256Bytes(canonicalBytes({ available: false })),
          observed_at: now().toISOString(),
          observation: null,
        });
      }
    },
  });
}

/** Digest a key-free adapter manifest for candidate evidence. */
export function effectAdapterManifestDigest(
  adapters: readonly EffectAdapter<unknown>[],
): string {
  const manifest: JsonObject[] = adapters
    .map((adapter) => adapter.descriptor)
    .sort((left, right) => left.adapter_id.localeCompare(right.adapter_id));
  return sha256Bytes(canonicalBytes(manifest));
}
