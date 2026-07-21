// ───────────────────────────────────────────────────────────────────
// MODULE: Dual Read and Dark Mirror Adapters
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, canonicalJson } from '../event-envelope/index.js';
import { hashReplayFingerprintBytes } from '../replay-fingerprint/index.js';
import {
  CompatibilityError,
  CompatibilityErrorCodes,
  boundedErrorCode,
  isCompatibilityResolutionFailure,
} from './compatibility-errors.js';

import type {
  AuthorityState,
  DarkLedgerAdapter,
  LegacyDarkBoundaryId,
  TransitionAuthorizationRequest,
} from '../authorized-ledger/index.js';
import type { EventWritePreflight } from '../event-envelope/index.js';
import type {
  ComparisonToken,
  DarkReadModel,
  LegacyReadModel,
  ReconciliationEvidence,
} from './compatibility-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

interface CapturedDarkRead {
  readonly status: 'valid' | 'missing' | 'invalid' | 'failed';
  readonly model: DarkReadModel | null;
  readonly errorCode: string | null;
}

export interface DualReadAdapterOptions<T> {
  readonly readLegacy: () => T | Promise<T>;
  readonly normalizeLegacy: (
    value: T,
    token: Readonly<ComparisonToken>,
  ) => LegacyReadModel | Promise<LegacyReadModel>;
  readonly readDark: (
    token: Readonly<ComparisonToken>,
  ) => DarkReadModel | null | Promise<DarkReadModel | null>;
  readonly isDualReadEnabled?: () => boolean;
  readonly observe?: (evidence: Readonly<ReconciliationEvidence>) => void;
  readonly evidenceCapacity?: number;
}

type LegacyAuthorityState = Extract<
  AuthorityState,
  'legacy_authoritative' | 'shadowing' | 'cutover_ready'
>;

/** Proof supplied only after the unchanged legacy writer has accepted a transition. */
export interface AcceptedLegacyTransition<T> {
  readonly result: T;
  readonly authorityState: LegacyAuthorityState;
  readonly authorityEpoch: number;
}

/** Narrow view of the authorized dark-ledger adapter with no legacy writer capability. */
export type DarkMirrorRecorder = Pick<DarkLedgerAdapter, 'recordAfterLegacy'>;

export interface DarkMirrorOptions {
  readonly isEnabled?: () => boolean;
  readonly observeFailure?: (errorCode: string) => void;
}

// ───────────────────────────────────────────────────────────────────
// 2. COMPARISON HELPERS
// ───────────────────────────────────────────────────────────────────

const COMPARISON_TOKEN_FIELDS = Object.freeze([
  'authorityEpoch',
  'correlationId',
  'darkHeadHash',
  'darkHeadSequence',
  'darkLedgerId',
  'legacyRecordId',
  'legacySequence',
  'mode',
  'runId',
  'streamId',
  'tokenVersion',
]);
const STABLE_TOKEN_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,255}$/;
const HASH_PATTERN = /^[a-f0-9]{64}$/;
const ZERO_DIGEST = '0'.repeat(64);

function requireTokenId(value: unknown, field: string): string {
  if (typeof value !== 'string' || !STABLE_TOKEN_ID_PATTERN.test(value)) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.COMPARISON_TOKEN_INVALID,
      'Comparison token identifier is invalid',
      { field },
    );
  }
  return value;
}

function requireNonNegativeInteger(value: unknown, field: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.COMPARISON_TOKEN_INVALID,
      'Comparison token sequence must be a non-negative safe integer',
      { field },
    );
  }
  return value as number;
}

/** Validate and freeze a closed comparison token before either shadow model is trusted. */
export function validateComparisonToken(input: ComparisonToken): ComparisonToken {
  const fields = Object.keys(input).sort();
  if (canonicalJson(fields) !== canonicalJson(COMPARISON_TOKEN_FIELDS)) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.COMPARISON_TOKEN_INVALID,
      'Comparison token does not match the closed shape',
      { fieldCount: fields.length },
    );
  }
  if (input.tokenVersion !== 1) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.COMPARISON_TOKEN_INVALID,
      'Comparison token version is unsupported',
      { tokenVersion: input.tokenVersion },
    );
  }
  if (!Number.isSafeInteger(input.authorityEpoch) || input.authorityEpoch <= 0) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.COMPARISON_TOKEN_INVALID,
      'Comparison token authority epoch must be positive',
      { field: 'authorityEpoch' },
    );
  }
  if (!HASH_PATTERN.test(input.darkHeadHash)) {
    throw new CompatibilityError(
      CompatibilityErrorCodes.COMPARISON_TOKEN_INVALID,
      'Comparison token dark head hash is invalid',
      { field: 'darkHeadHash' },
    );
  }
  return Object.freeze({
    tokenVersion: 1,
    mode: requireTokenId(input.mode, 'mode'),
    runId: requireTokenId(input.runId, 'runId'),
    streamId: requireTokenId(input.streamId, 'streamId'),
    authorityEpoch: input.authorityEpoch,
    correlationId: requireTokenId(input.correlationId, 'correlationId'),
    legacyRecordId: requireTokenId(input.legacyRecordId, 'legacyRecordId'),
    legacySequence: requireNonNegativeInteger(input.legacySequence, 'legacySequence'),
    darkLedgerId: requireTokenId(input.darkLedgerId, 'darkLedgerId'),
    darkHeadSequence: requireNonNegativeInteger(input.darkHeadSequence, 'darkHeadSequence'),
    darkHeadHash: input.darkHeadHash,
  });
}

function replayFingerprint(value: unknown): string {
  return hashReplayFingerprintBytes(Uint8Array.from(canonicalBytes(value)));
}

function evidence(
  outcome: ReconciliationEvidence['outcome'],
  tokenDigest: string,
  overrides: Partial<ReconciliationEvidence> = {},
): ReconciliationEvidence {
  return Object.freeze({
    outcome,
    parityEligible: outcome === 'parity',
    tokenDigest,
    legacyFingerprint: null,
    darkFingerprint: null,
    legacyErrorCode: null,
    darkErrorCode: null,
    ...overrides,
  });
}

/** Reconcile two fully current read models without returning or mutating either model. */
export function reconcileReadModels(
  tokenInput: ComparisonToken,
  legacy: LegacyReadModel,
  dark: DarkReadModel,
): ReconciliationEvidence {
  const token = validateComparisonToken(tokenInput);
  const tokenDigest = replayFingerprint(token);
  if (
    legacy.recordId !== token.legacyRecordId
    || legacy.sequence !== token.legacySequence
    || dark.ledgerId !== token.darkLedgerId
    || dark.verifiedHeadSequence !== token.darkHeadSequence
    || dark.verifiedHeadHash !== token.darkHeadHash
  ) {
    return evidence('not_comparable', tokenDigest);
  }
  if (dark.comparisonSequence < legacy.comparisonSequence) {
    return evidence('dark_lagging', tokenDigest);
  }
  if (dark.comparisonSequence !== legacy.comparisonSequence) {
    return evidence('not_comparable', tokenDigest);
  }

  const legacyFingerprint = replayFingerprint(legacy.model);
  const darkFingerprint = replayFingerprint(dark.model);
  const outcome = legacyFingerprint === darkFingerprint ? 'parity' : 'divergence';
  return evidence(outcome, tokenDigest, { legacyFingerprint, darkFingerprint });
}

// ───────────────────────────────────────────────────────────────────
// 3. DUAL-READ ADAPTER
// ───────────────────────────────────────────────────────────────────

/** Read both stores for evidence while preserving the exact operational legacy contract. */
export class DualReadAdapter<T> {
  readonly #options: DualReadAdapterOptions<T>;
  readonly #evidenceCapacity: number;
  readonly #evidence: ReconciliationEvidence[] = [];

  public constructor(options: DualReadAdapterOptions<T>) {
    this.#options = options;
    this.#evidenceCapacity = options.evidenceCapacity ?? 256;
    if (
      typeof options.readLegacy !== 'function'
      || typeof options.normalizeLegacy !== 'function'
      || typeof options.readDark !== 'function'
      || !Number.isSafeInteger(this.#evidenceCapacity)
      || this.#evidenceCapacity < 1
    ) {
      throw new TypeError('Dual-read adapter requires readers and a positive evidence capacity');
    }
  }

  /** Return or throw exactly as the legacy reader does; shadow evidence cannot replace it. */
  public async read(tokenInput: ComparisonToken): Promise<T> {
    let legacyValue: T;
    try {
      legacyValue = await this.#options.readLegacy();
    } catch (legacyError: unknown) {
      await this.#observeLegacyFailure(tokenInput, legacyError);
      throw legacyError;
    }

    if (!this.#isEnabled()) return legacyValue;

    let token: ComparisonToken;
    try {
      token = validateComparisonToken(tokenInput);
    } catch (error: unknown) {
      this.#record(evidence('legacy_compatibility_failure', ZERO_DIGEST, {
        legacyErrorCode: boundedErrorCode(error),
      }));
      return legacyValue;
    }

    const darkPromise = this.#captureDark(token);
    let legacyModel: LegacyReadModel;
    try {
      legacyModel = await this.#options.normalizeLegacy(legacyValue, token);
    } catch (error: unknown) {
      const dark = await darkPromise;
      this.#record(evidence('legacy_compatibility_failure', replayFingerprint(token), {
        legacyErrorCode: boundedErrorCode(error),
        darkErrorCode: dark.errorCode,
      }));
      return legacyValue;
    }

    try {
      replayFingerprint(legacyModel.model);
    } catch (error: unknown) {
      const dark = await darkPromise;
      this.#record(evidence('legacy_compatibility_failure', replayFingerprint(token), {
        legacyErrorCode: boundedErrorCode(error),
        darkErrorCode: dark.errorCode,
      }));
      return legacyValue;
    }

    const dark = await darkPromise;
    if (dark.status !== 'valid' || dark.model === null) {
      this.#record(evidence(
        dark.status === 'missing'
          ? 'dark_missing'
          : dark.status === 'invalid'
            ? 'dark_invalid'
            : 'dark_failure',
        replayFingerprint(token),
        { darkErrorCode: dark.errorCode },
      ));
      return legacyValue;
    }

    try {
      this.#record(reconcileReadModels(token, legacyModel, dark.model));
    } catch (error: unknown) {
      this.#record(evidence('dark_invalid', replayFingerprint(token), {
        darkErrorCode: boundedErrorCode(error),
      }));
    }
    return legacyValue;
  }

  /** Return copies so evidence cannot become an authority-selection channel. */
  public readEvidence(): readonly ReconciliationEvidence[] {
    return Object.freeze(this.#evidence.map((entry) => Object.freeze({ ...entry })));
  }

  async #observeLegacyFailure(tokenInput: ComparisonToken, legacyError: unknown): Promise<void> {
    if (!this.#isEnabled()) return;
    let token: ComparisonToken;
    try {
      token = validateComparisonToken(tokenInput);
    } catch {
      this.#record(evidence('legacy_failure_dark_failure', ZERO_DIGEST, {
        legacyErrorCode: boundedErrorCode(legacyError),
        darkErrorCode: CompatibilityErrorCodes.COMPARISON_TOKEN_INVALID,
      }));
      return;
    }
    const dark = await this.#captureDark(token);
    this.#record(evidence(
      dark.status === 'valid'
        ? 'legacy_failure_dark_success'
        : 'legacy_failure_dark_failure',
      replayFingerprint(token),
      {
        legacyErrorCode: boundedErrorCode(legacyError),
        darkErrorCode: dark.errorCode,
        darkFingerprint: dark.model ? replayFingerprint(dark.model.model) : null,
      },
    ));
  }

  async #captureDark(token: ComparisonToken): Promise<CapturedDarkRead> {
    try {
      const model = await this.#options.readDark(token);
      if (model === null) {
        return Object.freeze({ status: 'missing', model: null, errorCode: null });
      }
      return Object.freeze({ status: 'valid', model, errorCode: null });
    } catch (error: unknown) {
      return Object.freeze({
        status: isCompatibilityResolutionFailure(error) ? 'invalid' : 'failed',
        model: null,
        errorCode: boundedErrorCode(error),
      });
    }
  }

  #record(entry: ReconciliationEvidence): void {
    this.#evidence.push(entry);
    if (this.#evidence.length > this.#evidenceCapacity) this.#evidence.shift();
    try {
      this.#options.observe?.(entry);
    } catch {
      // Retained bounded evidence keeps observer failure outside operational control flow.
    }
  }

  #isEnabled(): boolean {
    try {
      return this.#options.isDualReadEnabled?.() ?? true;
    } catch {
      return false;
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. DARK-ONLY WRITE ADAPTER
// ───────────────────────────────────────────────────────────────────

const LEGACY_AUTHORITY_STATES = new Set<AuthorityState>([
  'legacy_authoritative',
  'shadowing',
  'cutover_ready',
]);

function mirrorPreconditionsHold<T>(
  accepted: AcceptedLegacyTransition<T>,
  event: EventWritePreflight,
  request: TransitionAuthorizationRequest,
): boolean {
  return LEGACY_AUTHORITY_STATES.has(accepted.authorityState)
    && Number.isSafeInteger(accepted.authorityEpoch)
    && accepted.authorityEpoch > 0
    && event.identity.authorityEpoch === accepted.authorityEpoch
    && request.authorityEpoch === accepted.authorityEpoch
    && request.event.canonicalDigest === event.canonicalDigest
    && request.event.registryDigest === event.registryDigest;
}

/** Mirror one accepted legacy transition without exposing legacy write access. */
export async function mirrorAcceptedLegacyTransition<T>(
  accepted: AcceptedLegacyTransition<T>,
  recorder: DarkMirrorRecorder,
  boundaryId: LegacyDarkBoundaryId,
  event: EventWritePreflight,
  request: TransitionAuthorizationRequest,
  options: DarkMirrorOptions = {},
): Promise<T> {
  let isEnabled: boolean;
  try {
    isEnabled = options.isEnabled?.() ?? true;
  } catch {
    try {
      options.observeFailure?.('DARK_MIRROR_GATE_FAILED');
    } catch {
      // Observer isolation preserves the already accepted legacy result.
    }
    return accepted.result;
  }
  if (!isEnabled) return accepted.result;
  if (!mirrorPreconditionsHold(accepted, event, request)) {
    try {
      options.observeFailure?.('DARK_MIRROR_PRECONDITION_FAILED');
    } catch {
      // Observer isolation preserves the already accepted legacy result.
    }
    return accepted.result;
  }
  try {
    await recorder.recordAfterLegacy(boundaryId, accepted.result, event, request);
  } catch (error: unknown) {
    try {
      options.observeFailure?.(boundedErrorCode(error));
    } catch {
      // Observer isolation preserves the already accepted legacy result.
    }
  }
  return accepted.result;
}
