// ───────────────────────────────────────────────────────────────────
// MODULE: Shadow Policy Planner
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

import {
  DIRECTIVES_LABEL,
  GOVERNOR_DIRECTIVE,
  HYGIENE_DIRECTIVE,
  TERMINAL_PROOF_DIRECTIVE,
} from './render.js';

const requireOwnerModule = createRequire(import.meta.url);

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export interface PolicyBlockInput {
  readonly id: string;
  readonly content: string;
  readonly order?: number;
}

export interface PolicyBlockContentContext {
  readonly compiledRouteTargets?: readonly string[];
}

export interface PolicyPlanInput {
  readonly blocks: readonly PolicyBlockInput[];
  readonly prompt?: string;
  readonly sessionId?: string;
}

export interface PolicyBlock extends PolicyBlockInput {
  readonly order: number;
  readonly contentHash: string;
}

export interface PolicyPlan {
  readonly blocks: readonly PolicyBlock[];
  readonly policySetHash: string;
  readonly hashInputSerialization: string;
}

export interface PolicyBlockDefinition {
  readonly id: string;
  readonly order: number;
  readonly content: (context?: PolicyBlockContentContext) => string | undefined;
}

export type HostReceiptStatus = 'configured' | 'observed' | 'unobserved' | 'unknown';

export interface DeliveryReceipt {
  readonly shadowId: string;
  readonly plannedHash: string;
  readonly emittedHash: string | null;
  readonly byteCount: number;
  readonly lifecycleEpoch: number;
  readonly transformMessageIdentity: string | null;
  readonly hostReceiptStatus: HostReceiptStatus;
}

export type DeliveryReceiptMatch = Pick<DeliveryReceipt, 'plannedHash' | 'lifecycleEpoch'>;
export type DeliveryStateReceipt = DeliveryReceipt | DeliveryReceiptMatch | HostReceiptStatus;
export type DeliveryReceiptInput = DeliveryReceipt;

export type DeliveryStateName = 'UNSEEN' | 'DELIVERED' | 'SUPPRESSED_SAME';

export type DeliveryLifecycleEvent = 'startup' | 'resume' | 'compact';

export type DeliveryEpochReason =
  | DeliveryLifecycleEvent
  | 'scope-change'
  | 'policy-set-change'
  | 'goal-change';

export interface DeliveryStateSignals {
  readonly sessionId?: unknown;
  readonly sessionIdentity?: unknown;
  readonly sessionIdentityConfirmed?: boolean;
  readonly sessionIdentityAmbiguous?: boolean;
  readonly lifecycleEvent?: unknown;
  readonly scopeChanged?: boolean;
  readonly policySetChanged?: boolean;
  readonly goalChanged?: boolean;
}

export interface DeliveryStateRequest extends DeliveryStateSignals {
  readonly blockId: string;
  readonly contentHash: string;
  readonly deliveryConfirmed?: boolean;
  readonly receipt?: DeliveryStateReceipt;
}

export interface DeliveryStateSnapshot {
  readonly state: DeliveryStateName;
  readonly blockId: string;
  readonly contentHash: string;
  readonly epoch: number;
  readonly sessionKnown: boolean;
  readonly routeOnlyEligible: boolean;
}

export interface DeliveryEpochSnapshot {
  readonly epoch: number;
  readonly sessionKnown: boolean;
  readonly advanced: boolean;
  readonly reasons: readonly DeliveryEpochReason[];
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const POLICY_COMMENT_HYGIENE_ID = 'policy.comment-hygiene.v1';
export const ROUTE_ADVISOR_ID = 'route.advisor.v1';
export const GATE_SPEC_FOLDER_QUESTION_ID = 'gate.spec-folder-question.v1';
export const RUNTIME_PI_DISPATCH_ID = 'runtime.pi-dispatch.v1';

export const POLICY_GOVERNOR_ID = 'policy.governor.v1';
export const POLICY_PROOF_OVER_APPEARANCE_ID = 'policy.proof-over-appearance.v1';
export const LIFECYCLE_SESSION_START_ID = 'lifecycle.session-start.v1';
export const RUNTIME_OPENCODE_CONTINUITY_ID = 'runtime.opencode-continuity.v1';
export const ROUTE_OPENCODE_COMPILED_ID = 'route.opencode-compiled.v1';
export const RUNTIME_OPENCODE_COMPILED_ROUTE_ID = 'runtime.opencode-compiled-route.v1';

export const POLICY_BLOCK_IDS = Object.freeze({
  COMMENT_HYGIENE: POLICY_COMMENT_HYGIENE_ID,
  ADVISOR_ROUTE: ROUTE_ADVISOR_ID,
  SPEC_FOLDER_QUESTION: GATE_SPEC_FOLDER_QUESTION_ID,
  PI_DISPATCH: RUNTIME_PI_DISPATCH_ID,
  GOVERNOR: POLICY_GOVERNOR_ID,
  PROOF_OVER_APPEARANCE: POLICY_PROOF_OVER_APPEARANCE_ID,
  SESSION_START: LIFECYCLE_SESSION_START_ID,
  OPENCODE_CONTINUITY: RUNTIME_OPENCODE_CONTINUITY_ID,
  OPENCODE_COMPILED_ROUTE: ROUTE_OPENCODE_COMPILED_ID,
  RUNTIME_OPENCODE_COMPILED_ROUTE: RUNTIME_OPENCODE_COMPILED_ROUTE_ID,
} as const);

export const POLICY_HASH_FIELDS = Object.freeze([
  'id',
  'content',
  'order',
] as const);

export const DELIVERY_RECEIPT_FIELDS = Object.freeze([
  'shadowId',
  'plannedHash',
  'emittedHash',
  'byteCount',
  'lifecycleEpoch',
  'transformMessageIdentity',
  'hostReceiptStatus',
] as const);

const SHADOW_RENDER_ID = 'shadow.render.advisor.v1';
const HASH_ALGORITHM = 'sha256';

function currentGateQuestion(): string | undefined {
  try {
    const owner = requireOwnerModule(
      '../../../system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs',
    ) as { GATE_3_QUESTION?: unknown };
    return typeof owner.GATE_3_QUESTION === 'string' ? owner.GATE_3_QUESTION : undefined;
  } catch {
    return undefined;
  }
}

export const POLICY_BLOCK_REGISTRY: readonly PolicyBlockDefinition[] = Object.freeze([
  {
    id: ROUTE_ADVISOR_ID,
    order: 0,
    content: () => undefined,
  },
  {
    id: POLICY_COMMENT_HYGIENE_ID,
    order: 1,
    content: () => HYGIENE_DIRECTIVE,
  },
  {
    id: POLICY_GOVERNOR_ID,
    order: 2,
    content: () => GOVERNOR_DIRECTIVE,
  },
  {
    id: POLICY_PROOF_OVER_APPEARANCE_ID,
    order: 3,
    content: () => TERMINAL_PROOF_DIRECTIVE,
  },
  {
    id: GATE_SPEC_FOLDER_QUESTION_ID,
    order: 4,
    content: currentGateQuestion,
  },
  {
    id: RUNTIME_PI_DISPATCH_ID,
    order: 5,
    content: () => undefined,
  },
  {
    id: LIFECYCLE_SESSION_START_ID,
    order: 6,
    content: () => undefined,
  },
  {
    id: RUNTIME_OPENCODE_CONTINUITY_ID,
    order: 7,
    content: () => undefined,
  },
  {
    id: RUNTIME_OPENCODE_COMPILED_ROUTE_ID,
    order: 8,
    content: (context?: PolicyBlockContentContext) => {
      const targets = context?.compiledRouteTargets;
      if (!Array.isArray(targets) || targets.some((target) => typeof target !== 'string')) {
        return undefined;
      }
      return serializeCompiledRouteTargetList(targets);
    },
  },
]);

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function hashSerializedInput(serializedInput: string): string {
  return createHash(HASH_ALGORITHM).update(serializedInput, 'utf8').digest('hex');
}

function normalizeBlocks(blocks: readonly PolicyBlockInput[]): readonly PolicyBlockInput[] {
  const normalizedBlocks = blocks.map((block, index) => {
    if (typeof block.id !== 'string' || block.id.length === 0) {
      throw new TypeError('Policy block id must be a non-empty string');
    }
    if (typeof block.content !== 'string') {
      throw new TypeError('Policy block content must be a string');
    }
    const order = block.order ?? index;
    if (!Number.isInteger(order) || order < 0) {
      throw new TypeError('Policy block order must be a non-negative integer');
    }
    return { id: block.id, content: block.content, order };
  });
  return [...normalizedBlocks].sort((left, right) => (
    (left.order ?? 0) - (right.order ?? 0)
  ));
}

function hashableBlock(block: PolicyBlockInput, index: number): PolicyBlockInput & { order: number } {
  const order = block.order ?? index;
  return {
    id: block.id,
    content: block.content,
    order,
  };
}

function normalizedCompiledRouteTargets(targets: readonly string[]): readonly string[] {
  if (!Array.isArray(targets) || targets.some((target) => typeof target !== 'string')) {
    throw new TypeError('Compiled-route targets must be an array of strings');
  }
  return [...targets].sort();
}

/** Serialize the complete compiled-route target membership in canonical order. */
export function serializeCompiledRouteTargetList(targets: readonly string[]): string {
  return JSON.stringify(normalizedCompiledRouteTargets(targets));
}

function hasReceiptField(receipt: Record<string, unknown>, field: string): boolean {
  return Object.prototype.hasOwnProperty.call(receipt, field) && receipt[field] !== undefined;
}

const UNKNOWN_SESSION_MARKER = /^(?:unknown|unresolved|ambiguous)(?:$|[-_:])/i;

function normalizedSessionId(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim();
  if (!normalized
    || normalized === '__global__'
    || normalized === '<unknown>'
    || UNKNOWN_SESSION_MARKER.test(normalized)) {
    return null;
  }
  return normalized;
}

/** Resolve a session key only when the runtime supplied a trustworthy identity. */
export function resolveConfirmedSessionId(signals: DeliveryStateSignals): string | null {
  if (signals.sessionIdentityAmbiguous === true || signals.sessionIdentityConfirmed === false) {
    return null;
  }

  if (signals.sessionIdentity !== undefined) {
    if (typeof signals.sessionIdentity !== 'object'
      || signals.sessionIdentity === null
      || Array.isArray(signals.sessionIdentity)) {
      return null;
    }
    const identity = signals.sessionIdentity as Record<string, unknown>;
    if (identity.ambiguous === true
      || (identity.confirmed !== true && identity.status !== 'confirmed')) {
      return null;
    }
    return normalizedSessionId(
      identity.sessionId ?? identity.sessionID ?? identity.id,
    );
  }

  return normalizedSessionId(signals.sessionId);
}

function normalizedLifecycleEvent(value: unknown): DeliveryLifecycleEvent | null {
  if (value === 'startup' || value === 'resume' || value === 'compact') {
    return value;
  }
  return null;
}

/** Return the epoch-changing signals present in one runtime event. */
export function deliveryEpochReasons(
  signals: DeliveryStateSignals,
): readonly DeliveryEpochReason[] {
  const reasons: DeliveryEpochReason[] = [];
  const lifecycleEvent = normalizedLifecycleEvent(signals.lifecycleEvent);
  if (lifecycleEvent) {
    reasons.push(lifecycleEvent);
  }
  if (signals.scopeChanged === true) {
    reasons.push('scope-change');
  }
  if (signals.policySetChanged === true) {
    reasons.push('policy-set-change');
  }
  if (signals.goalChanged === true) {
    reasons.push('goal-change');
  }
  return Object.freeze([...new Set(reasons)]);
}

function receiptConfirmsDelivery(
  receipt: DeliveryStateReceipt | undefined,
): boolean {
  if (receipt === 'configured' || receipt === 'observed') {
    return true;
  }
  if (!receipt || typeof receipt !== 'object') {
    return false;
  }
  return 'hostReceiptStatus' in receipt
    && (receipt.hostReceiptStatus === 'configured' || receipt.hostReceiptStatus === 'observed');
}

function receiptMatchesDelivery(
  receipt: DeliveryStateReceipt | undefined,
  contentHash: string,
  epoch: number,
): boolean {
  if (!receipt || typeof receipt !== 'object') {
    return false;
  }
  return receipt.plannedHash === contentHash && receipt.lifecycleEpoch === epoch;
}

interface StoredDeliveryState {
  readonly state: DeliveryStateName;
  readonly contentHash: string;
  readonly epoch: number;
}

interface SessionDeliveryState {
  epoch: number;
  readonly blocks: Map<string, StoredDeliveryState>;
}

function validBlockRequest(input: DeliveryStateRequest): boolean {
  return typeof input.blockId === 'string'
    && input.blockId.length > 0
    && typeof input.contentHash === 'string'
    && input.contentHash.length > 0;
}

function snapshot(
  input: DeliveryStateRequest,
  state: DeliveryStateName,
  epoch: number,
  sessionKnown: boolean,
): DeliveryStateSnapshot {
  return Object.freeze({
    state,
    blockId: input.blockId,
    contentHash: input.contentHash,
    epoch,
    sessionKnown,
    routeOnlyEligible: sessionKnown && state === 'SUPPRESSED_SAME',
  });
}

/**
 * Track confirmed policy-block delivery inside a session-scoped lifecycle epoch.
 *
 * Unknown identities never acquire a map key, which keeps their decisions
 * independent from every confirmed session.
 */
export class DeliveryStateMachine {
  private readonly sessions = new Map<string, SessionDeliveryState>();

  private sessionFor(signals: DeliveryStateSignals, create = true): SessionDeliveryState | null {
    const sessionId = resolveConfirmedSessionId(signals);
    if (!sessionId) {
      return null;
    }
    const existing = this.sessions.get(sessionId);
    if (existing || !create) {
      return existing ?? null;
    }
    const created: SessionDeliveryState = { epoch: 0, blocks: new Map() };
    this.sessions.set(sessionId, created);
    return created;
  }

  /** Apply all epoch-changing signals exactly once for the current event. */
  public advanceForSignals(signals: DeliveryStateSignals = {}): DeliveryEpochSnapshot {
    const reasons = deliveryEpochReasons(signals);
    const session = this.sessionFor(signals);
    if (!session) {
      return Object.freeze({ epoch: 0, sessionKnown: false, advanced: false, reasons });
    }
    if (reasons.length === 0) {
      return Object.freeze({
        epoch: session.epoch,
        sessionKnown: true,
        advanced: false,
        reasons,
      });
    }
    session.epoch += 1;
    session.blocks.clear();
    return Object.freeze({
      epoch: session.epoch,
      sessionKnown: true,
      advanced: true,
      reasons,
    });
  }

  /** Return the current epoch without creating state for an unknown identity. */
  public currentEpoch(signals: DeliveryStateSignals = {}): number {
    return this.sessionFor(signals, false)?.epoch ?? 0;
  }

  /** Return the current block snapshot without creating or changing state. */
  public peek(input: DeliveryStateRequest): DeliveryStateSnapshot {
    const session = this.sessionFor(input, false);
    if (!session || !validBlockRequest(input)) {
      return snapshot(input, 'UNSEEN', session?.epoch ?? 0, Boolean(session));
    }

    const existing = session.blocks.get(input.blockId);
    if (!existing || existing.epoch !== session.epoch || existing.contentHash !== input.contentHash) {
      return snapshot(input, 'UNSEEN', session.epoch, true);
    }

    return snapshot(input, existing.state, session.epoch, true);
  }

  /** Resolve one block's suppression decision and advance its delivery state. */
  public decideSuppression(input: DeliveryStateRequest): DeliveryStateSnapshot {
    const epochSnapshot = this.advanceForSignals(input);
    const session = this.sessionFor(input);
    if (!session || !validBlockRequest(input)) {
      return snapshot(input, 'UNSEEN', epochSnapshot.epoch, false);
    }

    const existing = session.blocks.get(input.blockId);
    if (!existing || existing.epoch !== session.epoch || existing.contentHash !== input.contentHash) {
      session.blocks.set(input.blockId, {
        state: 'UNSEEN',
        contentHash: input.contentHash,
        epoch: session.epoch,
      });
      return snapshot(input, 'UNSEEN', session.epoch, true);
    }

    if (existing.state === 'DELIVERED') {
      session.blocks.set(input.blockId, {
        ...existing,
        state: 'SUPPRESSED_SAME',
      });
      return snapshot(input, 'SUPPRESSED_SAME', session.epoch, true);
    }

    return snapshot(input, existing.state, session.epoch, true);
  }

  /** Record a full delivery only after an explicit or receipt-backed confirmation. */
  public recordDelivery(input: DeliveryStateRequest): DeliveryStateSnapshot {
    const epochSnapshot = this.advanceForSignals(input);
    const session = this.sessionFor(input);
    if (!session || !validBlockRequest(input)) {
      return snapshot(input, 'UNSEEN', epochSnapshot.epoch, false);
    }

    const confirmed = input.deliveryConfirmed === true || receiptConfirmsDelivery(input.receipt);
    const receiptMatches = receiptMatchesDelivery(input.receipt, input.contentHash, session.epoch);
    if (!confirmed || !receiptMatches) {
      const existing = session.blocks.get(input.blockId);
      return snapshot(
        input,
        existing?.contentHash === input.contentHash ? existing.state : 'UNSEEN',
        session.epoch,
        true,
      );
    }

    session.blocks.set(input.blockId, {
      state: 'DELIVERED',
      contentHash: input.contentHash,
      epoch: session.epoch,
    });
    return snapshot(input, 'DELIVERED', session.epoch, true);
  }

  /** Confirm a full delivery with a caller-owned host receipt or probe. */
  public confirmDelivery(input: DeliveryStateRequest): DeliveryStateSnapshot {
    return this.recordDelivery({ ...input, deliveryConfirmed: true });
  }

  /** Mark one block dirty so the next decision requires full delivery. */
  public markDirty(input: DeliveryStateRequest): DeliveryStateSnapshot {
    const epochSnapshot = this.advanceForSignals(input);
    const session = this.sessionFor(input);
    if (!session || !validBlockRequest(input)) {
      return snapshot(input, 'UNSEEN', epochSnapshot.epoch, false);
    }
    session.blocks.set(input.blockId, {
      state: 'UNSEEN',
      contentHash: input.contentHash,
      epoch: session.epoch,
    });
    return snapshot(input, 'UNSEEN', session.epoch, true);
  }

  /** Advance one confirmed session epoch and clear every block in it. */
  public advanceEpoch(signals: DeliveryStateSignals = {}): DeliveryEpochSnapshot {
    const session = this.sessionFor(signals);
    const reasons = deliveryEpochReasons(signals);
    if (!session) {
      return Object.freeze({ epoch: 0, sessionKnown: false, advanced: false, reasons });
    }
    session.epoch += 1;
    session.blocks.clear();
    return Object.freeze({
      epoch: session.epoch,
      sessionKnown: true,
      advanced: true,
      reasons,
    });
  }

  /** Remove all state for one confirmed session. */
  public clearSession(signals: DeliveryStateSignals): void {
    const sessionId = resolveConfirmedSessionId(signals);
    if (sessionId) {
      this.sessions.delete(sessionId);
    }
  }

  /** Clear the in-process shadow state between isolated evaluations. */
  public clear(): void {
    this.sessions.clear();
  }
}

export const SHADOW_DELIVERY_STATE_MACHINE = new DeliveryStateMachine();

/** Evaluate one block using the process-local shadow delivery state. */
export function evaluateDeliveryState(
  input: DeliveryStateRequest,
  machine: DeliveryStateMachine = SHADOW_DELIVERY_STATE_MACHINE,
): DeliveryStateSnapshot {
  return machine.decideSuppression(input);
}

/** Confirm one full block delivery using the process-local shadow state. */
export function confirmDeliveryState(
  input: DeliveryStateRequest,
  machine: DeliveryStateMachine = SHADOW_DELIVERY_STATE_MACHINE,
): DeliveryStateSnapshot {
  return machine.confirmDelivery(input);
}

/** Advance the process-local shadow epoch for a lifecycle or semantic change. */
export function advanceDeliveryEpoch(
  signals: DeliveryStateSignals,
  machine: DeliveryStateMachine = SHADOW_DELIVERY_STATE_MACHINE,
): DeliveryEpochSnapshot {
  return machine.advanceEpoch(signals);
}

/** Reset the process-local shadow state without affecting emitted content. */
export function resetShadowDeliveryState(): void {
  SHADOW_DELIVERY_STATE_MACHINE.clear();
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Serialize only the allow-listed block identity, content, and order fields. */
export function serializePolicyHashInput(input: PolicyPlanInput): string {
  const blocks = normalizeBlocks(input.blocks).map(hashableBlock);
  return JSON.stringify(blocks);
}

/** Hash one block using its canonical identity, content, and delivery order. */
export function hashPolicyBlock(block: PolicyBlockInput, index = 0): string {
  return hashSerializedInput(JSON.stringify(hashableBlock(block, index)));
}

/** Build the registered compiled-route block from the complete target list. */
export function buildCompiledRoutePolicyBlock(targets: readonly string[]): PolicyBlockInput {
  const definition = POLICY_BLOCK_REGISTRY.find((candidate) => (
    candidate.id === RUNTIME_OPENCODE_COMPILED_ROUTE_ID
  ));
  const content = definition?.content({ compiledRouteTargets: targets });
  if (!definition || typeof content !== 'string') {
    throw new Error('Compiled-route policy block is not registered');
  }
  return {
    id: definition.id,
    content,
    order: definition.order,
  };
}

/** Hash the registered compiled-route block using every target, before rendering bounds apply. */
export function hashCompiledRouteTargets(targets: readonly string[]): string {
  return hashPolicyBlock(buildCompiledRoutePolicyBlock(targets));
}

/** Build a one-block plan whose content hash reflects the complete target list. */
export function buildCompiledRoutePolicyPlan(targets: readonly string[]): PolicyPlan {
  return buildPolicyPlan({ blocks: [buildCompiledRoutePolicyBlock(targets)] });
}

/** Hash the ordered block sequence for one planned delivery. */
export function hashPolicySet(blocks: readonly PolicyBlockInput[]): string {
  return hashSerializedInput(serializePolicyHashInput({ blocks }));
}

/** Build per-block hashes and the ordered policy-set hash without retaining raw request data. */
export function buildPolicyPlan(input: PolicyPlanInput): PolicyPlan {
  const normalizedBlocks = normalizeBlocks(input.blocks);
  const hashInputSerialization = serializePolicyHashInput({ blocks: normalizedBlocks });
  const blocks = normalizedBlocks.map((block, index) => ({
    ...block,
    order: block.order ?? index,
    contentHash: hashPolicyBlock(block, index),
  }));
  return Object.freeze({
    blocks: Object.freeze(blocks),
    policySetHash: hashSerializedInput(hashInputSerialization),
    hashInputSerialization,
  });
}

/** Check that a value contains exactly the required receipt fields with valid values. */
export function isDeliveryReceipt(value: unknown): value is DeliveryReceipt {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const receipt = value as Record<string, unknown>;
  if (!DELIVERY_RECEIPT_FIELDS.every((field) => hasReceiptField(receipt, field))) {
    return false;
  }
  return typeof receipt.shadowId === 'string'
    && receipt.shadowId.length > 0
    && typeof receipt.plannedHash === 'string'
    && (typeof receipt.emittedHash === 'string' || receipt.emittedHash === null)
    && typeof receipt.byteCount === 'number'
    && Number.isInteger(receipt.byteCount)
    && receipt.byteCount >= 0
    && typeof receipt.lifecycleEpoch === 'number'
    && Number.isInteger(receipt.lifecycleEpoch)
    && receipt.lifecycleEpoch >= 0
    && (typeof receipt.transformMessageIdentity === 'string' || receipt.transformMessageIdentity === null)
    && (receipt.hostReceiptStatus === 'configured'
      || receipt.hostReceiptStatus === 'observed'
      || receipt.hostReceiptStatus === 'unobserved'
      || receipt.hostReceiptStatus === 'unknown');
}

/** Validate and freeze the seven-field delivery receipt record. */
export function buildDeliveryReceipt(input: DeliveryReceiptInput): DeliveryReceipt {
  const receipt = {
    shadowId: input.shadowId,
    plannedHash: input.plannedHash,
    emittedHash: input.emittedHash,
    byteCount: input.byteCount,
    lifecycleEpoch: input.lifecycleEpoch,
    transformMessageIdentity: input.transformMessageIdentity,
    hostReceiptStatus: input.hostReceiptStatus,
  };
  if (!isDeliveryReceipt(receipt)) {
    throw new TypeError('Delivery receipt is missing a required field or has an invalid value');
  }
  return Object.freeze(receipt);
}

/** Return the current advisor blocks from the renderer's emitted text. */
export function buildAdvisorRenderPlan(rendered: string | null): PolicyPlan {
  if (rendered === null) {
    return buildPolicyPlan({ blocks: [] });
  }

  const directiveLabel = DIRECTIVES_LABEL.startsWith('\n')
    ? DIRECTIVES_LABEL.slice(1)
    : DIRECTIVES_LABEL;
  const directiveIndex = rendered.indexOf(directiveLabel);
  const routeContent = directiveIndex === -1
    ? rendered
    : rendered.slice(0, Math.max(0, directiveIndex));
  const blocks: PolicyBlockInput[] = [];
  if (routeContent.length > 0 && !routeContent.startsWith(directiveLabel)) {
    blocks.push({ id: ROUTE_ADVISOR_ID, content: routeContent, order: 0 });
  }
  if (rendered.includes(HYGIENE_DIRECTIVE)) {
    blocks.push({ id: POLICY_COMMENT_HYGIENE_ID, content: HYGIENE_DIRECTIVE, order: 1 });
  }
  if (rendered.includes(GOVERNOR_DIRECTIVE)) {
    blocks.push({ id: POLICY_GOVERNOR_ID, content: GOVERNOR_DIRECTIVE, order: 2 });
  }
  if (rendered.includes(TERMINAL_PROOF_DIRECTIVE)) {
    blocks.push({ id: POLICY_PROOF_OVER_APPEARANCE_ID, content: TERMINAL_PROOF_DIRECTIVE, order: 3 });
  }
  return buildPolicyPlan({ blocks });
}

/** Observe a renderer result without writing to or replacing its emitted value. */
export function observeRenderedAdvisorPolicy(rendered: string | null): void {
  try {
    const plan = buildAdvisorRenderPlan(rendered);
    buildDeliveryReceipt({
      shadowId: SHADOW_RENDER_ID,
      plannedHash: plan.policySetHash,
      emittedHash: rendered === null ? null : plan.policySetHash,
      byteCount: rendered === null ? 0 : Buffer.byteLength(rendered, 'utf8'),
      lifecycleEpoch: 0,
      transformMessageIdentity: null,
      hostReceiptStatus: 'unobserved',
    });
  } catch {
    // Shadow measurement is fail-open so an observer cannot affect delivery.
  }
}
