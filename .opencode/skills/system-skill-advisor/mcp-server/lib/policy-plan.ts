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
  readonly content: () => string | undefined;
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

export type DeliveryReceiptInput = DeliveryReceipt;

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
    id: ROUTE_OPENCODE_COMPILED_ID,
    order: 8,
    content: () => undefined,
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

function hasReceiptField(receipt: Record<string, unknown>, field: string): boolean {
  return Object.prototype.hasOwnProperty.call(receipt, field) && receipt[field] !== undefined;
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
