// ───────────────────────────────────────────────────────────────────
// MODULE: Sandboxed Rollback Authority Store
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import {
  closeSync,
  existsSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
} from 'node:path';

import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  RollbackDrillError,
  createCutoverStateReconstruction,
} from './rollback-drill-contract.js';
import {
  InflightDispositionActions,
  InflightDispositions,
  RollbackDrillReasonCodes,
} from './rollback-drill-types.js';

import type { AuthoritySnapshot, AuthorityState } from '../authorized-ledger/index.js';
import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  AuthorityTransitionEvidence,
  ProtectedPathDeclaration,
  RollbackLaneState,
  RollbackStateReconstruction,
} from './rollback-drill-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SANDBOX_PREFIX = 'deep-loop-rollback-drill-';
const AUTHORITY_FILE = 'authority.json';
const AUTHORITY_LOCK = 'authority.lock';
/** Stable file name used for durable restoration readback inside one sandbox. */
export const ROLLBACK_STATE_FILE = 'rollback-state.json';

const SHA256_PATTERN = /^[a-f0-9]{64}$/u;

export interface DrillAuthorityRecord extends JsonObject {
  readonly mode: string;
  readonly state: AuthorityState;
  readonly epoch: number;
  readonly owner: string;
  readonly admissionsFrozen: boolean;
  readonly legacyFenced: boolean;
  readonly spineFenced: boolean;
  readonly revision: number;
}

interface AuthorityCasInput {
  readonly expectedState: AuthorityState;
  readonly expectedEpoch: number;
  readonly nextState: AuthorityState;
  readonly nextOwner: string;
  readonly at: string;
}

const LEGAL_DRILL_EDGES = new Set<string>([
  'cutover_ready\u0000new_authoritative_reversible',
  'new_authoritative_reversible\u0000rollback_pending',
  'rollback_pending\u0000legacy_authoritative',
]);

// ───────────────────────────────────────────────────────────────────
// 2. PATH AND DIGEST HELPERS
// ───────────────────────────────────────────────────────────────────

function isContained(root: string, candidate: string): boolean {
  const pathFromRoot = relative(root, candidate);
  return pathFromRoot !== ''
    && !pathFromRoot.startsWith('..')
    && !isAbsolute(pathFromRoot);
}

function pathsOverlap(left: string, right: string): boolean {
  return left === right || isContained(left, right) || isContained(right, left);
}

function digestPathInto(hash: ReturnType<typeof createHash>, path: string, label: string): void {
  const status = lstatSync(path);
  hash.update(label);
  hash.update('\0');
  if (status.isSymbolicLink()) {
    hash.update('symlink\0');
    hash.update(readlinkSync(path));
    hash.update('\0');
    return;
  }
  if (status.isDirectory()) {
    hash.update('directory\0');
    const entries = readdirSync(path, { withFileTypes: true })
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));
    for (const entry of entries) {
      digestPathInto(hash, join(path, entry), `${label}/${entry}`);
    }
    return;
  }
  if (!status.isFile()) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.ISOLATION_INVALID,
      'Protected and evidence paths must contain only files, directories, or symlinks',
      { label },
    );
  }
  hash.update('file\0');
  hash.update(readFileSync(path));
  hash.update('\0');
}

/** Produce a stable tree digest without following symlink targets. */
export function digestFilesystemTree(path: string): string {
  if (!existsSync(path)) {
    return sha256Bytes(canonicalBytes({ missing: true }));
  }
  const hash = createHash('sha256');
  digestPathInto(hash, path, '.');
  return hash.digest('hex');
}

/** Bind declared protected identifiers to their bytes without retaining host paths. */
export function digestProtectedPaths(
  paths: readonly ProtectedPathDeclaration[],
): string {
  const entries = [...paths]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((entry) => ({ id: entry.id, digest: digestFilesystemTree(entry.path) }));
  return sha256Bytes(canonicalBytes(entries));
}

/** Resolve and reject every sandbox that could alias protected or non-temporary state. */
export function assertHermeticSandbox(
  sandboxRoot: string,
  protectedPaths: readonly ProtectedPathDeclaration[],
): string {
  if (!existsSync(sandboxRoot) || lstatSync(sandboxRoot).isSymbolicLink()) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.ISOLATION_INVALID,
      'Rollback sandbox must be an existing non-symlink directory',
    );
  }
  const physicalSandbox = realpathSync(sandboxRoot);
  const physicalTemporaryRoot = realpathSync(tmpdir());
  if (
    !lstatSync(physicalSandbox).isDirectory()
    || !isContained(physicalTemporaryRoot, physicalSandbox)
    || !basename(physicalSandbox).startsWith(SANDBOX_PREFIX)
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.ISOLATION_INVALID,
      'Rollback sandbox must use the dedicated prefix beneath the system temporary root',
    );
  }
  const protectedIds = new Set<string>();
  for (const declaration of protectedPaths) {
    if (
      declaration.id.trim() === ''
      || protectedIds.has(declaration.id)
      || !existsSync(declaration.path)
    ) {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.ISOLATION_INVALID,
        'Protected path declarations require unique identifiers and existing targets',
      );
    }
    protectedIds.add(declaration.id);
    const protectedPath = realpathSync(declaration.path);
    if (pathsOverlap(physicalSandbox, protectedPath)) {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.ISOLATION_INVALID,
        'Rollback sandbox cannot overlap a protected authority or runtime path',
        { protectedId: declaration.id },
      );
    }
  }
  return physicalSandbox;
}

function writeCanonicalAtomic(path: string, value: JsonValue): void {
  const bytes = Buffer.from(canonicalBytes(value));
  const temporaryPath = `${path}.tmp`;
  let descriptor: number | undefined;
  try {
    descriptor = openSync(temporaryPath, 'wx', 0o600);
    writeFileSync(descriptor, bytes);
    fsyncSync(descriptor);
    closeSync(descriptor);
    descriptor = undefined;
    renameSync(temporaryPath, path);
    const directoryDescriptor = openSync(dirname(path), 'r');
    try {
      fsyncSync(directoryDescriptor);
    } finally {
      closeSync(directoryDescriptor);
    }
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
    if (existsSync(temporaryPath)) unlinkSync(temporaryPath);
  }
}

function parseAuthority(path: string): DrillAuthorityRecord {
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as DrillAuthorityRecord;
  if (
    typeof parsed.mode !== 'string'
    || typeof parsed.state !== 'string'
    || !Number.isSafeInteger(parsed.epoch)
    || parsed.epoch <= 0
    || typeof parsed.owner !== 'string'
    || typeof parsed.admissionsFrozen !== 'boolean'
    || typeof parsed.legacyFenced !== 'boolean'
    || typeof parsed.spineFenced !== 'boolean'
    || !Number.isSafeInteger(parsed.revision)
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
      'Sandbox authority record is malformed',
    );
  }
  return Object.freeze({ ...parsed });
}

function parseReconstruction(path: string): RollbackStateReconstruction {
  const decoded = JSON.parse(readFileSync(path, 'utf8')) as unknown;
  if (decoded === null || Array.isArray(decoded) || typeof decoded !== 'object') {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.STATE_INTEGRITY_FAILED,
      'Persisted rollback state must be a canonical object',
    );
  }
  const parsed = decoded as RollbackStateReconstruction;
  const countKeys = Object.values(InflightDispositions).sort();
  const appliedCountKeys = countKeys.filter((key) => key !== InflightDispositions.BLOCK);
  const actualCountKeys = parsed.dispositionCounts === null
    || Array.isArray(parsed.dispositionCounts)
    || typeof parsed.dispositionCounts !== 'object'
    ? []
    : Object.keys(parsed.dispositionCounts).sort();
  if (
    Object.keys(parsed).sort().join(',')
      !== 'appliedDispositions,dispositionCounts,state'
    || parsed.state === null
    || Array.isArray(parsed.state)
    || typeof parsed.state !== 'object'
    || !Array.isArray(parsed.state.facts)
    || parsed.state.facts.some((fact) => typeof fact !== 'string')
    || parsed.state.artifacts === null
    || Array.isArray(parsed.state.artifacts)
    || typeof parsed.state.artifacts !== 'object'
    || Object.values(parsed.state.artifacts).some((value) => typeof value !== 'string')
    || !Number.isSafeInteger(parsed.state.completedSteps)
    || parsed.state.completedSteps < 0
    || !Array.isArray(parsed.appliedDispositions)
    || actualCountKeys.length !== countKeys.length
    || actualCountKeys.some((key, index) => key !== countKeys[index])
    || countKeys.some((key) => {
      const count = parsed.dispositionCounts[key as keyof typeof parsed.dispositionCounts];
      return !Number.isSafeInteger(count) || count < 0;
    })
  ) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.STATE_INTEGRITY_FAILED,
      'Persisted rollback state is malformed or lacks disposition evidence',
    );
  }
  const observedCounts = {
    UPCAST: 0,
    PIN: 0,
    FORK: 0,
    MIGRATE: 0,
    BLOCK: 0,
  };
  for (const application of parsed.appliedDispositions) {
    if (
      application === null
      || Array.isArray(application)
      || typeof application !== 'object'
      || Object.keys(application).sort().join(',')
        !== 'action,disposition,restoredStateDigest,rowId,sourceStateDigest'
      || typeof application.rowId !== 'string'
      || application.rowId.length === 0
      || !(appliedCountKeys as readonly string[]).includes(
        String(application.disposition),
      )
      || application.action !== InflightDispositionActions[application.disposition]
      || !SHA256_PATTERN.test(application.sourceStateDigest)
      || !SHA256_PATTERN.test(application.restoredStateDigest)
    ) {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.STATE_INTEGRITY_FAILED,
        'Persisted rollback state contains an invalid disposition application',
      );
    }
    observedCounts[application.disposition] += 1;
  }
  if (new Set(parsed.appliedDispositions.map((entry) => entry.rowId)).size
    !== parsed.appliedDispositions.length) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.STATE_INTEGRITY_FAILED,
      'Persisted rollback state applies a disposition row more than once',
    );
  }
  if (countKeys.some((key) => (
    observedCounts[key as keyof typeof observedCounts]
      !== parsed.dispositionCounts[key as keyof typeof parsed.dispositionCounts]
  ))) {
    throw new RollbackDrillError(
      RollbackDrillReasonCodes.STATE_INTEGRITY_FAILED,
      'Persisted disposition counts do not match applied reconstruction rows',
    );
  }
  return Object.freeze({
    state: Object.freeze({
      facts: Object.freeze([...parsed.state.facts]) as unknown as string[],
      artifacts: Object.freeze({ ...parsed.state.artifacts }),
      completedSteps: parsed.state.completedSteps,
    }),
    appliedDispositions: Object.freeze(
      parsed.appliedDispositions.map((entry) => Object.freeze({ ...entry })),
    ) as unknown as RollbackStateReconstruction['appliedDispositions'],
    dispositionCounts: Object.freeze({ ...parsed.dispositionCounts }),
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. AUTHORITY STORE
// ───────────────────────────────────────────────────────────────────

/** On-disk exact-state-and-epoch CAS store restricted to one drill-owned root. */
export class SandboxedAuthorityStore {
  readonly #root: string;
  readonly #path: string;
  readonly #statePath: string;
  readonly #lockPath: string;
  readonly #legacyWriterId: string;
  readonly #spineWriterId: string;
  readonly #transitions: AuthorityTransitionEvidence[] = [];

  public constructor(
    root: string,
    mode: string,
    startingEpoch: number,
    legacyWriterId: string,
    spineWriterId: string,
  ) {
    mkdirSync(root, { recursive: true, mode: 0o700 });
    this.#root = realpathSync(root);
    this.#path = resolve(this.#root, AUTHORITY_FILE);
    this.#statePath = resolve(this.#root, ROLLBACK_STATE_FILE);
    this.#lockPath = resolve(this.#root, AUTHORITY_LOCK);
    this.#legacyWriterId = legacyWriterId;
    this.#spineWriterId = spineWriterId;
    if (
      !isContained(this.#root, this.#path)
      || !isContained(this.#root, this.#statePath)
      || !isContained(this.#root, this.#lockPath)
    ) {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.ISOLATION_INVALID,
        'Authority store paths escaped the drill-owned root',
      );
    }
    if (existsSync(this.#path)) {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
        'Authority store refuses to overwrite an existing drill record',
      );
    }
    writeCanonicalAtomic(this.#path, {
      mode,
      state: 'cutover_ready',
      epoch: startingEpoch,
      owner: legacyWriterId,
      admissionsFrozen: false,
      legacyFenced: false,
      spineFenced: true,
      revision: 1,
    });
  }

  /** Return the exact snapshot consumed by the authorization gateway. */
  public snapshot(): DrillAuthorityRecord {
    return parseAuthority(this.#path);
  }

  /** Return the authority subset expected by the shipped gateway. */
  public authoritySnapshot(): AuthoritySnapshot {
    const record = this.snapshot();
    return Object.freeze({ state: record.state, epoch: record.epoch });
  }

  /** Persist the actual cutover state before rollback reconciliation begins. */
  public writeCutoverState(
    writerId: string,
    authorityEpoch: number,
    state: Readonly<RollbackLaneState>,
  ): RollbackStateReconstruction {
    return this.#withLock(() => {
      const current = this.snapshot();
      if (
        current.state !== 'new_authoritative_reversible'
        || current.owner !== writerId
        || current.epoch !== authorityEpoch
        || current.admissionsFrozen
        || current.spineFenced
      ) {
        throw new RollbackDrillError(
          RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
          'Cutover state writes require the active isolated spine authority',
        );
      }
      const reconstruction = createCutoverStateReconstruction(state);
      writeCanonicalAtomic(this.#statePath, reconstruction);
      return parseReconstruction(this.#statePath);
    });
  }

  /** Replace cutover state with one fully disposition-applied legacy reconstruction. */
  public restoreLegacyState(
    expectedEpoch: number,
    reconstruction: Readonly<RollbackStateReconstruction>,
  ): RollbackStateReconstruction {
    return this.#withLock(() => {
      const current = this.snapshot();
      if (
        current.state !== 'legacy_authoritative'
        || current.epoch !== expectedEpoch
        || current.owner !== this.#legacyWriterId
        || !current.admissionsFrozen
        || current.legacyFenced
        || !current.spineFenced
      ) {
        throw new RollbackDrillError(
          RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
          'State restoration requires fenced spine state and restored legacy authority',
        );
      }
      const validated = JSON.parse(
        Buffer.from(canonicalBytes(reconstruction)).toString('utf8'),
      ) as RollbackStateReconstruction;
      writeCanonicalAtomic(this.#statePath, validated);
      return parseReconstruction(this.#statePath);
    });
  }

  /** Read the exact persisted state that integrity verification must trust. */
  public readPersistedState(): RollbackStateReconstruction {
    if (!existsSync(this.#statePath)) {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.STATE_INTEGRITY_FAILED,
        'Rollback state was not durably persisted',
      );
    }
    return parseReconstruction(this.#statePath);
  }

  /** Read the durable bytes so byte-integrity checks do not compare reserialized values. */
  public readPersistedStateBytes(): Uint8Array {
    if (!existsSync(this.#statePath)) {
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.STATE_INTEGRITY_FAILED,
        'Rollback state was not durably persisted',
      );
    }
    return Uint8Array.from(readFileSync(this.#statePath));
  }

  /** Freeze admission before the rollback state transition without advancing the epoch. */
  public freezeAdmissions(): DrillAuthorityRecord {
    return this.#withLock(() => {
      const current = this.snapshot();
      if (
        current.state !== 'new_authoritative_reversible'
        || current.owner !== this.#spineWriterId
      ) {
        throw new RollbackDrillError(
          RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
          'Admission freeze requires the reversible spine authority state',
        );
      }
      const next = Object.freeze({
        ...current,
        admissionsFrozen: true,
        revision: current.revision + 1,
      });
      writeCanonicalAtomic(this.#path, next);
      return next;
    });
  }

  /** Execute one legal test-lane authority edge with exact state and epoch matching. */
  public compareAndSwap(input: AuthorityCasInput): DrillAuthorityRecord {
    return this.#withLock(() => {
      const current = this.snapshot();
      const edge = `${input.expectedState}\u0000${input.nextState}`;
      if (
        current.state !== input.expectedState
        || current.epoch !== input.expectedEpoch
        || !LEGAL_DRILL_EDGES.has(edge)
        || (
          input.nextState === 'rollback_pending'
          && !current.admissionsFrozen
        )
      ) {
        throw new RollbackDrillError(
          RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
          'Authority compare-and-swap lost its expected state, epoch, or legal edge',
          {
            expectedState: input.expectedState,
            expectedEpoch: input.expectedEpoch,
            actualState: current.state,
            actualEpoch: current.epoch,
          },
        );
      }
      const nextEpoch = current.epoch + 1;
      const isRollbackPending = input.nextState === 'rollback_pending';
      const isLegacyRestored = input.nextState === 'legacy_authoritative';
      const next: DrillAuthorityRecord = Object.freeze({
        ...current,
        state: input.nextState,
        epoch: nextEpoch,
        owner: input.nextOwner,
        admissionsFrozen: isRollbackPending || isLegacyRestored,
        legacyFenced: !isLegacyRestored,
        spineFenced: input.nextState !== 'new_authoritative_reversible',
        revision: current.revision + 1,
      });
      writeCanonicalAtomic(this.#path, next);
      this.#transitions.push(Object.freeze({
        fromState: current.state,
        fromEpoch: current.epoch,
        toState: next.state,
        toEpoch: next.epoch,
        owner: next.owner,
        at: input.at,
      }));
      return next;
    });
  }

  /** Resume only the restored legacy writer after it observes the new epoch. */
  public resumeLegacyAdmissions(expectedEpoch: number): DrillAuthorityRecord {
    return this.#withLock(() => {
      const current = this.snapshot();
      if (
        current.state !== 'legacy_authoritative'
        || current.epoch !== expectedEpoch
        || current.owner !== this.#legacyWriterId
        || !current.admissionsFrozen
      ) {
        throw new RollbackDrillError(
          RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
          'Legacy admissions require the restored state and exact new epoch',
        );
      }
      const next = Object.freeze({
        ...current,
        admissionsFrozen: false,
        legacyFenced: false,
        spineFenced: true,
        revision: current.revision + 1,
      });
      writeCanonicalAtomic(this.#path, next);
      return next;
    });
  }

  /** Deny every stale, fenced, frozen, or non-owner writer token. */
  public canWrite(writerId: string, authorityEpoch: number): boolean {
    const current = this.snapshot();
    if (
      current.admissionsFrozen
      || current.epoch !== authorityEpoch
      || current.owner !== writerId
    ) {
      return false;
    }
    if (writerId === this.#legacyWriterId) return !current.legacyFenced;
    if (writerId === this.#spineWriterId) return !current.spineFenced;
    return false;
  }

  /** Return immutable transition copies for certificate evidence. */
  public transitions(): readonly AuthorityTransitionEvidence[] {
    return Object.freeze(this.#transitions.map((entry) => Object.freeze({ ...entry })));
  }

  #withLock<T>(operation: () => T): T {
    let descriptor: number | undefined;
    try {
      descriptor = openSync(this.#lockPath, 'wx', 0o600);
      return operation();
    } catch (error: unknown) {
      if (error instanceof RollbackDrillError) throw error;
      throw new RollbackDrillError(
        RollbackDrillReasonCodes.AUTHORITY_TRANSITION_FAILED,
        'Sandbox authority store could not acquire or commit its CAS lock',
      );
    } finally {
      if (descriptor !== undefined) closeSync(descriptor);
      if (existsSync(this.#lockPath)) unlinkSync(this.#lockPath);
    }
  }
}
