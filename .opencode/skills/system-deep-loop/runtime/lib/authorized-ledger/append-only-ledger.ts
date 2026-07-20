// ───────────────────────────────────────────────────────────────────
// MODULE: Authorized Append-Only Ledger
// ───────────────────────────────────────────────────────────────────

import {
  canonicalBytes,
  canonicalJson,
  prepareEventWrite,
  readEvent,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  AuthorizedLedgerError,
  AuthorizedLedgerErrorCodes,
} from './authorized-ledger-errors.js';
import { AuthorizationVerdicts, GENESIS_RECORD_HASH } from './authorized-ledger-types.js';
import { ImmutableFrameStore } from './immutable-frame-store.js';
import {
  authorizationDecisionDigest,
  readAuthorizationAudit,
} from './transition-authorization-gateway.js';

import type {
  AuthorizationDecisionRecord,
  AuthorizationReference,
  AuthorizedLedgerOptions,
  DurableAppendReceipt,
  GatewayAllowProof,
  LedgerHead,
  LedgerRecordFrame,
  VerifiedLedgerEvent,
} from './authorized-ledger-types.js';
import type { EventTypeRegistry, EventWritePreflight } from '../event-envelope/index.js';
import type { StoredFrameFile, StoredRecoveryEvidence } from './immutable-frame-store.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface LedgerScanResult {
  readonly head: LedgerHead;
  readonly events: readonly VerifiedLedgerEvent[];
  readonly tornTail: StoredFrameFile | null;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const LEDGER_FRAME_VERSION = 1;
const ALLOW_PROOF_VERSION = 1;
const DEFAULT_AUDIT_LEDGER_ID = 'authorization-audit';
const FRAME_FIELDS = new Set([
  'frame_version',
  'ledger_id',
  'sequence',
  'prev_record_hash',
  'canonical_event_hash',
  'authorization_ref',
  'receipt',
  'canonical_event_bytes',
  'record_hash',
]);
const AUTHORIZATION_REFERENCE_FIELDS = new Set([
  'audit_ledger_id',
  'audit_sequence',
  'audit_record_hash',
  'decision_id',
  'decision_digest',
  'request_digest',
  'policy_digest',
  'authority_epoch',
]);
const RECEIPT_FIELDS = new Set([
  'ledger_id',
  'sequence',
  'event_id',
  'event_type',
  'event_version',
  'stream_id',
  'stream_sequence',
  'committed_at',
]);
const HASH_PATTERN = /^[a-f0-9]{64}$/;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function hasExactFields(value: Record<string, unknown>, fields: ReadonlySet<string>): boolean {
  const keys = Object.keys(value);
  return keys.length === fields.size && keys.every((key) => fields.has(key));
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

function isHash(value: unknown): value is string {
  return typeof value === 'string' && HASH_PATTERN.test(value);
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === 'string'
    && value.endsWith('Z')
    && !Number.isNaN(new Date(value).getTime());
}

function withoutRecordHash(frame: LedgerRecordFrame): Omit<LedgerRecordFrame, 'record_hash'> {
  const { record_hash: ignored, ...hashInput } = frame;
  void ignored;
  return hashInput;
}

function calculateRecordHash(frame: LedgerRecordFrame): string {
  return sha256Bytes(canonicalBytes(withoutRecordHash(frame)));
}

function decodeCanonicalEventBytes(encoded: string): Buffer {
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length === 0 || bytes.toString('base64') !== encoded) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.FRAME_MALFORMED,
      'integrity',
      'Domain frame contains malformed canonical event bytes',
    );
  }
  return bytes;
}

function parseFrame(stored: StoredFrameFile): LedgerRecordFrame {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stored.bytes.subarray(0, -1).toString('utf8'));
  } catch {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.FRAME_MALFORMED,
      'integrity',
      'Domain ledger frame is not valid JSON',
      { sequence: stored.sequence },
    );
  }
  if (!isRecord(parsed) || !hasExactFields(parsed, FRAME_FIELDS)) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.FRAME_MALFORMED,
      'integrity',
      'Domain ledger frame does not match the closed record shape',
      { sequence: stored.sequence },
    );
  }
  if (
    !isRecord(parsed.authorization_ref)
    || !hasExactFields(parsed.authorization_ref, AUTHORIZATION_REFERENCE_FIELDS)
    || !isRecord(parsed.receipt)
    || !hasExactFields(parsed.receipt, RECEIPT_FIELDS)
  ) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.FRAME_MALFORMED,
      'integrity',
      'Domain ledger frame contains malformed authorization or receipt fields',
      { sequence: stored.sequence },
    );
  }
  return parsed as unknown as LedgerRecordFrame;
}

function validateFrameScalars(frame: LedgerRecordFrame): void {
  if (
    frame.frame_version !== LEDGER_FRAME_VERSION
    || typeof frame.ledger_id !== 'string'
    || !isPositiveInteger(frame.sequence)
    || !isHash(frame.prev_record_hash)
    || !isHash(frame.canonical_event_hash)
    || !isHash(frame.record_hash)
    || typeof frame.canonical_event_bytes !== 'string'
    || !isPositiveInteger(frame.authorization_ref.audit_sequence)
    || !isHash(frame.authorization_ref.audit_record_hash)
    || !isHash(frame.authorization_ref.decision_digest)
    || !isHash(frame.authorization_ref.request_digest)
    || !isHash(frame.authorization_ref.policy_digest)
    || !isPositiveInteger(frame.authorization_ref.authority_epoch)
    || !isIsoTimestamp(frame.receipt.committed_at)
  ) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.FRAME_MALFORMED,
      'integrity',
      'Domain ledger frame contains invalid scalar fields',
      { sequence: frame.sequence },
    );
  }
}

function durableReceipt(frame: LedgerRecordFrame): DurableAppendReceipt {
  return Object.freeze({
    ...frame.receipt,
    canonicalEventHash: frame.canonical_event_hash,
    recordHash: frame.record_hash,
    authorizationRef: frame.authorization_ref,
  });
}

function assertEventPreflight(
  event: EventWritePreflight,
  registry: EventTypeRegistry,
): EventWritePreflight {
  let prepared: EventWritePreflight;
  try {
    prepared = prepareEventWrite(event?.envelope, registry);
  } catch (error: unknown) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.INPUT_INVALID,
      'input',
      'Domain append requires a validated current-version envelope',
      { cause: error instanceof Error ? error.message : String(error) },
    );
  }
  if (
    event.registryDigest !== prepared.registryDigest
    || event.canonicalDigest !== prepared.canonicalDigest
    || canonicalJson(event.canonicalBytes) !== canonicalJson(prepared.canonicalBytes)
  ) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.INPUT_INVALID,
      'input',
      'Domain append preflight does not match canonical envelope bytes',
      { eventId: prepared.identity.eventId },
    );
  }
  return prepared;
}

function authorizationReference(proof: GatewayAllowProof): AuthorizationReference {
  return Object.freeze({
    audit_ledger_id: proof.auditReceipt.auditLedgerId,
    audit_sequence: proof.auditReceipt.sequence,
    audit_record_hash: proof.auditReceipt.recordHash,
    decision_id: proof.decision.decision_id,
    decision_digest: proof.decision.decision_digest,
    request_digest: proof.decision.request_digest,
    policy_digest: proof.decision.policy_digest,
    authority_epoch: proof.decision.authority_epoch,
  });
}

function assertRecoveryLink(
  recovery: StoredRecoveryEvidence,
  head: LedgerHead,
  sequence: number,
): void {
  if (
    recovery.record.sequence !== sequence
    || recovery.record.prior_sequence !== head.sequence
    || recovery.record.prior_record_hash !== head.recordHash
  ) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.FRAME_HASH_MISMATCH,
      'integrity',
      'Torn-tail recovery is not linked to the verified domain head',
      { sequence },
    );
  }
}

function assertStoredDecisionLink(
  frame: LedgerRecordFrame,
  decision: AuthorizationDecisionRecord,
): void {
  const eventBytes = decodeCanonicalEventBytes(frame.canonical_event_bytes);
  const committedAt = new Date(frame.receipt.committed_at).getTime();
  if (
    decision.decision !== AuthorizationVerdicts.ALLOW
    || decision.decision_id !== frame.authorization_ref.decision_id
    || decision.decision_digest !== frame.authorization_ref.decision_digest
    || authorizationDecisionDigest(decision) !== decision.decision_digest
    || decision.request_digest !== frame.authorization_ref.request_digest
    || decision.policy_digest !== frame.authorization_ref.policy_digest
    || decision.domain_ledger_id !== frame.receipt.ledger_id
    || decision.authority_epoch !== frame.authorization_ref.authority_epoch
    || decision.requested_event_id !== frame.receipt.event_id
    || decision.requested_event_type !== frame.receipt.event_type
    || decision.requested_event_version !== frame.receipt.event_version
    || decision.requested_event_digest !== sha256Bytes(eventBytes)
    || decision.prior_head_sequence !== frame.sequence - 1
    || decision.prior_head_hash !== frame.prev_record_hash
    || new Date(decision.decided_at).getTime() > committedAt
    || new Date(decision.expires_at).getTime() < committedAt
  ) {
    throw new AuthorizedLedgerError(
      AuthorizedLedgerErrorCodes.AUTHORIZATION_INVALID,
      'authorization',
      'Domain frame does not carry one exact earlier durable allow decision',
      { sequence: frame.sequence, decisionId: decision.decision_id },
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. LEDGER
// ───────────────────────────────────────────────────────────────────

/** Typed immutable writer with no proof-free domain append operation. */
export class AppendOnlyLedger {
  public readonly ledgerId: string;
  public readonly registryDigest: string;
  readonly #options: AuthorizedLedgerOptions;
  readonly #registry: EventTypeRegistry;
  readonly #store: ImmutableFrameStore;
  readonly #auditLedgerId: string;
  readonly #now: () => Date;

  public constructor(
    options: AuthorizedLedgerOptions,
    registry: EventTypeRegistry,
  ) {
    this.#options = options;
    this.#registry = registry;
    this.#store = new ImmutableFrameStore(options);
    this.ledgerId = options.ledgerId;
    this.registryDigest = registry.digest;
    this.#auditLedgerId = options.auditLedgerId ?? DEFAULT_AUDIT_LEDGER_ID;
    this.#now = options.now ?? (() => new Date());
    if (this.ledgerId === this.#auditLedgerId) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.INPUT_INVALID,
        'input',
        'Domain and authorization-audit ledgers require distinct identities',
        { ledgerId: this.ledgerId },
      );
    }
  }

  /** Return the fully verified current head without exposing unchecked records. */
  public async getVerifiedHead(): Promise<LedgerHead> {
    return this.#store.withExclusiveLock(async () => (await this.#scanUnlocked(false)).head);
  }

  /** Return all events only after framing, chain, envelope, and allow linkage pass. */
  public async readVerifiedEvents(): Promise<readonly VerifiedLedgerEvent[]> {
    return this.#store.withExclusiveLock(async () => (await this.#scanUnlocked(false)).events);
  }

  /** Append exactly one event after revalidating its durable single-use allow under lock. */
  public async appendAuthorized(
    event: EventWritePreflight,
    proof: GatewayAllowProof,
  ): Promise<DurableAppendReceipt> {
    const prepared = assertEventPreflight(event, this.#registry);
    if (!proof || proof.proofVersion !== ALLOW_PROOF_VERSION || !proof.decision || !proof.auditReceipt) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.AUTHORIZATION_REQUIRED,
        'authorization',
        'Domain append requires an exact durable gateway allow proof',
        { eventId: prepared.identity.eventId },
      );
    }

    return this.#store.withExclusiveLock(async () => {
      const scan = await this.#scanUnlocked(false);
      const existing = scan.events.find(
        (verified) => verified.event.stored.envelope.event_id === prepared.identity.eventId,
      );
      if (existing) {
        if (existing.event.stored.digest !== prepared.canonicalDigest) {
          throw new AuthorizedLedgerError(
            AuthorizedLedgerErrorCodes.EVENT_ID_CONFLICT,
            'authorization',
            'Event identity is already bound to different canonical bytes',
            { eventId: prepared.identity.eventId, sequence: existing.frame.sequence },
          );
        }
        if (
          existing.frame.authorization_ref.decision_id !== proof.decision.decision_id
          || existing.frame.authorization_ref.decision_digest !== proof.decision.decision_digest
        ) {
          throw new AuthorizedLedgerError(
            AuthorizedLedgerErrorCodes.AUTHORIZATION_ALREADY_USED,
            'authorization',
            'Exact event retry must reuse its original authorization decision',
            { eventId: prepared.identity.eventId },
          );
        }
        await this.#verifyProof(
          prepared,
          proof,
          Object.freeze({
            ledgerId: this.ledgerId,
            sequence: existing.frame.sequence - 1,
            recordHash: existing.frame.prev_record_hash,
          }),
          true,
        );
        return durableReceipt(existing.frame);
      }

      await this.#verifyProof(prepared, proof, scan.head, false);
      if (scan.events.some(
        (verified) => verified.frame.authorization_ref.decision_id === proof.decision.decision_id,
      )) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.AUTHORIZATION_ALREADY_USED,
          'authorization',
          'Gateway allow proof has already committed another domain frame',
          { decisionId: proof.decision.decision_id },
        );
      }
      this.#options.faultInjection?.beforeDomainCommit?.();

      const sequence = scan.head.sequence + 1;
      const committedAt = this.#now().toISOString();
      const receipt = Object.freeze({
        ledger_id: this.ledgerId,
        sequence,
        event_id: prepared.identity.eventId,
        event_type: prepared.identity.eventType,
        event_version: prepared.identity.eventVersion,
        stream_id: prepared.identity.streamId,
        stream_sequence: prepared.identity.streamSequence,
        committed_at: committedAt,
      });
      const hashInput: Omit<LedgerRecordFrame, 'record_hash'> = {
        frame_version: LEDGER_FRAME_VERSION,
        ledger_id: this.ledgerId,
        sequence,
        prev_record_hash: scan.head.recordHash,
        canonical_event_hash: prepared.canonicalDigest,
        authorization_ref: authorizationReference(proof),
        receipt,
        canonical_event_bytes: Buffer.from(prepared.canonicalBytes).toString('base64'),
      };
      const frame: LedgerRecordFrame = Object.freeze({
        ...hashInput,
        record_hash: sha256Bytes(canonicalBytes(hashInput)),
      });
      this.#store.commitFrameUnlocked(
        sequence,
        canonicalBytes(frame),
        this.#options.faultInjection?.afterFrameFsyncBeforeCommit,
      );
      return durableReceipt(frame);
    });
  }

  /** Preserve a torn final candidate and leave the verified committed prefix untouched. */
  public async recoverTornTail(): Promise<LedgerHead> {
    return this.#store.withExclusiveLock(async () => {
      const scan = await this.#scanUnlocked(true);
      if (!scan.tornTail) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.RECOVERY_NOT_ALLOWED,
          'integrity',
          'Ledger has no torn final frame candidate to recover',
          { ledgerId: this.ledgerId },
        );
      }
      this.#store.quarantineTornTailUnlocked(
        scan.tornTail,
        scan.head,
        this.#now().toISOString(),
      );
      return (await this.#scanUnlocked(false)).head;
    });
  }

  async #scanUnlocked(allowTornFinal: boolean): Promise<LedgerScanResult> {
    const audit = await readAuthorizationAudit(
      this.#options.rootDirectory,
      this.#auditLedgerId,
    );
    const auditBySequence = new Map(audit.entries.map((entry) => [entry.receipt.sequence, entry]));
    const frames = this.#store.readFrameFilesUnlocked();
    const recoveries = this.#store.readRecoveryEvidenceUnlocked();
    const consumedRecoveries = new Set<number>();
    const events: VerifiedLedgerEvent[] = [];
    let head: LedgerHead = Object.freeze({
      ledgerId: this.ledgerId,
      sequence: 0,
      recordHash: GENESIS_RECORD_HASH,
    });
    let tornTail: StoredFrameFile | null = null;

    for (const [index, stored] of frames.entries()) {
      const recovery = recoveries.get(stored.sequence);
      if (recovery) {
        assertRecoveryLink(recovery, head, stored.sequence);
        consumedRecoveries.add(stored.sequence);
      }
      if (!stored.isTerminated) {
        if (allowTornFinal && index === frames.length - 1 && stored.sequence === head.sequence + 1) {
          tornTail = stored;
          break;
        }
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.TORN_TAIL,
          'integrity',
          'Domain ledger ends with a torn immutable frame candidate',
          { sequence: stored.sequence },
        );
      }
      if (stored.sequence !== head.sequence + 1) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.FRAME_SEQUENCE_MISMATCH,
          'integrity',
          'Domain ledger sequence is not contiguous',
          { expected: head.sequence + 1, actual: stored.sequence },
        );
      }
      const frame = parseFrame(stored);
      validateFrameScalars(frame);
      if (
        frame.ledger_id !== this.ledgerId
        || frame.sequence !== stored.sequence
        || frame.prev_record_hash !== head.recordHash
        || frame.record_hash !== calculateRecordHash(frame)
      ) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.FRAME_HASH_MISMATCH,
          'integrity',
          'Domain frame identity or record hash chain is invalid',
          { sequence: stored.sequence },
        );
      }
      const event = readEvent(decodeCanonicalEventBytes(frame.canonical_event_bytes), this.#registry);
      if (
        event.stored.digest !== frame.canonical_event_hash
        || event.stored.envelope.event_id !== frame.receipt.event_id
        || event.stored.envelope.event_type !== frame.receipt.event_type
        || event.stored.envelope.event_version !== frame.receipt.event_version
        || event.stored.envelope.stream_id !== frame.receipt.stream_id
        || event.stored.envelope.stream_sequence !== frame.receipt.stream_sequence
        || frame.receipt.ledger_id !== this.ledgerId
        || frame.receipt.sequence !== frame.sequence
      ) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.FRAME_EVENT_HASH_MISMATCH,
          'integrity',
          'Domain frame receipt or canonical event digest is invalid',
          { sequence: stored.sequence },
        );
      }
      const auditEntry = auditBySequence.get(frame.authorization_ref.audit_sequence);
      if (
        !auditEntry
        || auditEntry.receipt.auditLedgerId !== frame.authorization_ref.audit_ledger_id
        || auditEntry.receipt.recordHash !== frame.authorization_ref.audit_record_hash
      ) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.AUTHORIZATION_INVALID,
          'authorization',
          'Domain frame references missing or mismatched durable audit evidence',
          { sequence: stored.sequence },
        );
      }
      assertStoredDecisionLink(frame, auditEntry.decision);
      events.push(Object.freeze({ frame, event }));
      head = Object.freeze({
        ledgerId: this.ledgerId,
        sequence: frame.sequence,
        recordHash: frame.record_hash,
      });
    }

    for (const [sequence, recovery] of recoveries) {
      if (consumedRecoveries.has(sequence)) continue;
      assertRecoveryLink(recovery, head, sequence);
      if (sequence !== head.sequence + 1) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.FRAME_SEQUENCE_MISMATCH,
          'integrity',
          'Domain recovery evidence creates a sequence gap',
          { sequence },
        );
      }
    }
    return Object.freeze({ head, events: Object.freeze(events), tornTail });
  }

  async #verifyProof(
    event: EventWritePreflight,
    proof: GatewayAllowProof,
    head: LedgerHead,
    isIdempotentRetry: boolean,
  ): Promise<void> {
    const audit = await readAuthorizationAudit(
      this.#options.rootDirectory,
      this.#auditLedgerId,
    );
    const entry = audit.entries.find(
      (candidate) => candidate.receipt.sequence === proof.auditReceipt.sequence,
    );
    const decision = proof.decision;
    if (
      !entry
      || proof.auditReceipt.auditLedgerId !== this.#auditLedgerId
      || proof.auditReceipt.recordHash !== entry.receipt.recordHash
      || proof.auditReceipt.canonicalEventHash !== entry.receipt.canonicalEventHash
      || entry.decision.decision_id !== decision.decision_id
      || canonicalJson(entry.decision) !== canonicalJson(decision)
      || decision.decision !== AuthorizationVerdicts.ALLOW
      || authorizationDecisionDigest(decision) !== decision.decision_digest
      || decision.requested_event_id !== event.identity.eventId
      || decision.requested_event_type !== event.identity.eventType
      || decision.requested_event_version !== event.identity.eventVersion
      || decision.requested_event_digest !== event.canonicalDigest
      || decision.domain_ledger_id !== this.ledgerId
      || decision.event_registry_digest !== this.registryDigest
      || decision.stream_id !== event.identity.streamId
      || decision.authority_epoch !== event.identity.authorityEpoch
      || decision.prior_head_sequence !== head.sequence
      || decision.prior_head_hash !== head.recordHash
    ) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.AUTHORIZATION_INVALID,
        'authorization',
        'Gateway allow proof does not match the exact event and prior head',
        { eventId: event.identity.eventId, decisionId: decision.decision_id },
      );
    }
    if (!isIdempotentRetry && this.#now().getTime() > new Date(decision.expires_at).getTime()) {
      throw new AuthorizedLedgerError(
        AuthorizedLedgerErrorCodes.AUTHORIZATION_STALE,
        'authorization',
        'Gateway allow proof expired before domain append',
        { eventId: event.identity.eventId, decisionId: decision.decision_id },
      );
    }
    if (!isIdempotentRetry) {
      let authority;
      try {
        authority = await this.#options.authorityProvider(decision.mode);
      } catch {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.AUTHORIZATION_STALE,
          'authorization',
          'Authority state could not be rechecked under the domain writer lock',
          { decisionId: decision.decision_id },
        );
      }
      if (authority.epoch !== decision.authority_epoch || authority.state !== decision.authority_state) {
        throw new AuthorizedLedgerError(
          AuthorizedLedgerErrorCodes.AUTHORIZATION_STALE,
          'authorization',
          'Authority state or epoch changed after gateway evaluation',
          { decisionId: decision.decision_id, authorityEpoch: authority.epoch },
        );
      }
    }
  }

}
