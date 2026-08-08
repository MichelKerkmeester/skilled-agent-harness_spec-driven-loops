// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ opencode-message-identity — stable transform identity and dedup state   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import {
  hashPolicyBlock as hashCanonicalPolicyBlock,
  POLICY_BLOCK_IDS,
} from '../../skills/system-skill-advisor/mcp-server/dist/mcp-server/lib/policy-plan.js';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const OPENCODE_TRANSFORM_DEDUP_ENV = 'MK_OPENCODE_TRANSFORM_DEDUP';
const UNKNOWN_TRANSFORM_NAME = 'unknown-transform';
const UNKNOWN_SESSION_ID = '__global__';
const IDENTITY_SEPARATOR = '\u001f';
const DEDUP_RECEIPT_SHADOW_ID = 'shadow.opencode-transform-dedup.v1';
const MAX_IDENTITY_PART_LENGTH = 256;
const MAX_DELIVERY_KEY_PART_LENGTH = 512;
const MAX_TRANSFORM_DEDUP_IDENTITIES = 256;

// ─────────────────────────────────────────────────────────────────────────────
// 3. IDENTITY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function firstDefined(values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function normalizeIdentityPart(value) {
  if (typeof value === 'string') {
    const normalized = value.trim();
    if (!normalized || normalized === UNKNOWN_SESSION_ID) return null;
    if (normalized.includes(IDENTITY_SEPARATOR)) return null;
    if (normalized.length > MAX_IDENTITY_PART_LENGTH) return null;
    return normalized;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return null;
}

function normalizeOrdinal(value) {
  if (Number.isInteger(value) && value >= 0) return value;
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
    const parsed = Number(value.trim());
    return Number.isSafeInteger(parsed) ? parsed : null;
  }
  return null;
}

function sessionValueFrom(input) {
  if (!isRecord(input)) return null;
  const properties = isRecord(input.properties) ? input.properties : {};
  const info = isRecord(properties.info) ? properties.info : {};
  const session = isRecord(input.session) ? input.session : {};
  const nestedPropertiesSession = isRecord(properties.session) ? properties.session : {};
  return firstDefined([
    input.sessionID,
    input.sessionId,
    session.id,
    session.sessionID,
    session.sessionId,
    properties.sessionID,
    properties.sessionId,
    nestedPropertiesSession.id,
    info.sessionID,
    info.sessionId,
  ]);
}

function messageValueFrom(input) {
  if (!isRecord(input)) return null;
  const properties = isRecord(input.properties) ? input.properties : {};
  const info = isRecord(properties.info) ? properties.info : {};
  const message = isRecord(input.message) ? input.message : {};
  const turn = isRecord(input.turn) ? input.turn : {};
  const nestedPropertiesMessage = isRecord(properties.message) ? properties.message : {};
  const nestedPropertiesTurn = isRecord(properties.turn) ? properties.turn : {};
  return firstDefined([
    input.messageID,
    input.messageId,
    input.turnID,
    input.turnId,
    message.id,
    message.messageID,
    message.messageId,
    turn.id,
    turn.turnID,
    turn.turnId,
    properties.messageID,
    properties.messageId,
    properties.turnID,
    properties.turnId,
    nestedPropertiesMessage.id,
    nestedPropertiesTurn.id,
    info.messageID,
    info.messageId,
    info.turnID,
    info.turnId,
    info.id,
    input.id,
  ]);
}

function ordinalValueFrom(input, ordinalOverride) {
  if (ordinalOverride !== undefined) return ordinalOverride;
  if (!isRecord(input)) return null;
  const properties = isRecord(input.properties) ? input.properties : {};
  const message = isRecord(input.message) ? input.message : {};
  const turn = isRecord(input.turn) ? input.turn : {};
  const transformCall = isRecord(input.transformCall) ? input.transformCall : {};
  const transform = isRecord(input.transform) ? input.transform : {};
  const nestedPropertiesTransformCall = isRecord(properties.transformCall)
    ? properties.transformCall
    : {};
  return firstDefined([
    input.transformCallOrdinal,
    input.transform_call_ordinal,
    input.transformOrdinal,
    input.transform_ordinal,
    input.callOrdinal,
    input.call_ordinal,
    input.ordinal,
    transformCall.ordinal,
    transformCall.callOrdinal,
    transform.ordinal,
    transform.callOrdinal,
    properties.transformCallOrdinal,
    properties.transform_call_ordinal,
    properties.transformOrdinal,
    properties.transform_ordinal,
    properties.callOrdinal,
    properties.call_ordinal,
    properties.ordinal,
    nestedPropertiesTransformCall.ordinal,
    message.transformCallOrdinal,
    turn.transformCallOrdinal,
    message.ordinal,
    turn.ordinal,
  ]);
}

function identityKey(identity) {
  return [identity.sessionId, identity.messageId, identity.transformCallOrdinal]
    .join(IDENTITY_SEPARATOR);
}

function normalizedIdentity(identity) {
  if (!isRecord(identity)) return null;
  const sessionId = normalizeIdentityPart(identity.sessionId);
  const messageId = normalizeIdentityPart(identity.messageId);
  const transformCallOrdinal = normalizeOrdinal(identity.transformCallOrdinal);
  if (!sessionId || !messageId || transformCallOrdinal === null) return null;
  return {
    sessionId,
    messageId,
    transformCallOrdinal,
    key: identityKey({ sessionId, messageId, transformCallOrdinal }),
  };
}

/** Resolve a stable OpenCode message identity without reading prompt content. */
export function resolveMessageIdentity(input = {}, ordinalOverride) {
  const sessionId = normalizeIdentityPart(sessionValueFrom(input));
  const messageId = normalizeIdentityPart(messageValueFrom(input));
  const transformCallOrdinal = normalizeOrdinal(ordinalValueFrom(input, ordinalOverride));
  if (!sessionId || !messageId || transformCallOrdinal === null) return null;
  const identity = { sessionId, messageId, transformCallOrdinal };
  return Object.freeze({ ...identity, key: identityKey(identity) });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DEDUP STATE
// ─────────────────────────────────────────────────────────────────────────────

/** Create isolated state for deterministic tests or an explicitly bounded owner. */
export function createTransformDedupState() {
  return {
    delivered: new Set(),
    reserved: new Set(),
    identities: new Map(),
    receipts: new Map(),
  };
}

const SHARED_TRANSFORM_DEDUP_STATE = createTransformDedupState();

/** Return the process-local state shared by the OpenCode transform plugins. */
export function getSharedTransformDedupState() {
  return SHARED_TRANSFORM_DEDUP_STATE;
}

function stateIsUsable(state) {
  return isRecord(state)
    && state.delivered instanceof Set
    && state.reserved instanceof Set
    && state.identities instanceof Map
    && state.receipts instanceof Map;
}

function evictOldestTransformIdentity(state) {
  const oldestKey = state.identities.keys().next().value;
  if (typeof oldestKey !== 'string') return;
  state.identities.delete(oldestKey);
  state.receipts.delete(oldestKey);
  for (const delivery of [...state.delivered]) {
    if (delivery.startsWith(`${oldestKey}${IDENTITY_SEPARATOR}`)) state.delivered.delete(delivery);
  }
  for (const reserved of [...state.reserved]) {
    if (reserved.startsWith(`${oldestKey}${IDENTITY_SEPARATOR}`)) state.reserved.delete(reserved);
  }
}

function boundTransformDedupMaps(state) {
  while (state.identities.size >= MAX_TRANSFORM_DEDUP_IDENTITIES) {
    evictOldestTransformIdentity(state);
  }
}

function safeDeliveryKeyPart(value) {
  if (typeof value !== 'string' || !value) return null;
  if (value.includes(IDENTITY_SEPARATOR)) return null;
  if (value.length > MAX_DELIVERY_KEY_PART_LENGTH) return null;
  return value;
}

function deliveryKey(identity, blockId, contentHash) {
  const safeBlockId = safeDeliveryKeyPart(blockId);
  const safeContentHash = safeDeliveryKeyPart(contentHash);
  if (!safeBlockId || !safeContentHash) return null;
  return [identity.key, safeBlockId, safeContentHash].join(IDENTITY_SEPARATOR);
}

function receiptFor(state, identity) {
  let receipt = state.receipts.get(identity.key);
  if (!receipt) {
    boundTransformDedupMaps(state);
    receipt = {
      shadowId: DEDUP_RECEIPT_SHADOW_ID,
      transformMessageIdentity: identity.key,
      identity: {
        sessionId: identity.sessionId,
        messageId: identity.messageId,
        transformCallOrdinal: identity.transformCallOrdinal,
      },
      transforms: [],
    };
    state.receipts.set(identity.key, receipt);
    state.identities.set(identity.key, identity);
  }
  return receipt;
}

function reserveDeliveryKey(state, key) {
  if (state.delivered.has(key)) return 'duplicate';
  if (state.reserved.has(key)) return 'contended';
  state.reserved.add(key);
  return 'reserved';
}

function checkArguments(identity, blockId, contentHash, state) {
  const normalized = normalizedIdentity(identity);
  if (!normalized
    || typeof blockId !== 'string'
    || !blockId
    || typeof contentHash !== 'string'
    || !contentHash) {
    return null;
  }
  if (!stateIsUsable(state)) return null;
  return { identity: normalized, blockId, contentHash };
}

function checkOptions(transformOrOptions, stateOverride) {
  if (isRecord(transformOrOptions)) {
    return {
      transform: typeof transformOrOptions.transform === 'string'
        ? transformOrOptions.transform
        : UNKNOWN_TRANSFORM_NAME,
      state: transformOrOptions.state ?? SHARED_TRANSFORM_DEDUP_STATE,
    };
  }
  return {
    transform: typeof transformOrOptions === 'string'
      ? transformOrOptions
      : UNKNOWN_TRANSFORM_NAME,
    state: stateOverride ?? SHARED_TRANSFORM_DEDUP_STATE,
  };
}

/** Peek whether a block delivery would be a duplicate without registering it. */
export function isTransformDuplicate(
  identity,
  blockId,
  contentHash,
  transformOrOptions,
  stateOverride,
) {
  const options = checkOptions(transformOrOptions, stateOverride);
  const args = checkArguments(identity, blockId, contentHash, options.state);
  if (!args) return false;
  const key = deliveryKey(args.identity, args.blockId, args.contentHash);
  if (!key) return false;
  return options.state.delivered.has(key) || options.state.reserved.has(key);
}

/** Release a reserved delivery key when the host did not push output. */
export function releaseTransformReservation(
  identity,
  blockId,
  contentHash,
  stateOverride,
) {
  const options = checkOptions(undefined, stateOverride);
  const args = checkArguments(identity, blockId, contentHash, options.state);
  if (!args) return;
  const key = deliveryKey(args.identity, args.blockId, args.contentHash);
  if (!key) return;
  options.state.reserved.delete(key);
}

/** Register one block delivery after the host confirms output was pushed. */
export function commitTransformDelivery(
  identity,
  blockId,
  contentHash,
  transformOrOptions,
  stateOverride,
) {
  const options = checkOptions(transformOrOptions, stateOverride);
  const args = checkArguments(identity, blockId, contentHash, options.state);
  if (!args) return false;
  const key = deliveryKey(args.identity, args.blockId, args.contentHash);
  if (!key) return false;
  options.state.reserved.delete(key);
  const duplicate = options.state.delivered.has(key);
  if (!duplicate) options.state.delivered.add(key);

  const receipt = receiptFor(options.state, args.identity);
  receipt.transforms.push({
    transform: options.transform,
    blockId: args.blockId,
    contentHash: args.contentHash,
    outcome: duplicate ? 'suppressed_duplicate' : 'delivered',
  });
  return duplicate;
}

/** Check and register one block delivery, returning true only for duplicates. */
export function checkAndRegisterDelivery(
  identity,
  blockId,
  contentHash,
  transformOrOptions,
  stateOverride,
) {
  const duplicate = isTransformDuplicate(identity, blockId, contentHash, transformOrOptions, stateOverride);
  if (!duplicate) {
    commitTransformDelivery(identity, blockId, contentHash, transformOrOptions, stateOverride);
  }
  return duplicate;
}

/** Record a contribution decision without registering delivery until the host commits. */
export function recordTransformContribution({
  identity,
  blockId,
  contentHash,
  transform,
  state = SHARED_TRANSFORM_DEDUP_STATE,
}) {
  const args = checkArguments(identity, blockId, contentHash, state);
  if (!args) {
    return {
      shouldDeliver: true,
      duplicate: false,
      contended: false,
      receipt: null,
    };
  }
  const key = deliveryKey(args.identity, args.blockId, args.contentHash);
  if (!key) {
    return {
      shouldDeliver: true,
      duplicate: false,
      contended: false,
      receipt: null,
    };
  }
  const reservation = reserveDeliveryKey(state, key);
  return {
    shouldDeliver: reservation === 'reserved',
    duplicate: reservation === 'duplicate',
    contended: reservation === 'contended',
    receipt: getMultiTransformReceipt(identity, state),
  };
}

/** Return a detached multi-transform receipt for one resolved identity. */
export function getMultiTransformReceipt(identity, state = SHARED_TRANSFORM_DEDUP_STATE) {
  const normalized = normalizedIdentity(identity);
  if (!normalized || !stateIsUsable(state)) return null;
  const receipt = state.receipts.get(normalized.key);
  if (!receipt) return null;
  return {
    shadowId: receipt.shadowId,
    transformMessageIdentity: receipt.transformMessageIdentity,
    identity: { ...receipt.identity },
    transforms: receipt.transforms.map((entry) => ({ ...entry })),
  };
}

/** Hash one contribution with the canonical policy planner's block algorithm. */
export function hashPolicyBlockContent(blockId, content, order = 0) {
  if (typeof blockId !== 'string' || !blockId || typeof content !== 'string') return null;
  if (!Number.isInteger(order) || order < 0) return null;
  try {
    return hashCanonicalPolicyBlock({ id: blockId, content, order }, order);
  } catch {
    return null;
  }
}

/** Clear all in-process transform state at an OpenCode lifecycle boundary. */
export function clearTransformDedupState(state = SHARED_TRANSFORM_DEDUP_STATE) {
  if (!stateIsUsable(state)) return;
  state.delivered.clear();
  state.reserved.clear();
  state.identities.clear();
  state.receipts.clear();
}

/** Clear only the identities belonging to one confirmed session. */
export function clearTransformDedupSession(sessionId, state = SHARED_TRANSFORM_DEDUP_STATE) {
  const normalizedSessionId = normalizeIdentityPart(sessionId);
  if (!normalizedSessionId || !stateIsUsable(state)) return;
  const identityKeys = [...state.identities.entries()]
    .filter(([, identity]) => identity.sessionId === normalizedSessionId)
    .map(([key]) => key);
  for (const key of identityKeys) {
    state.identities.delete(key);
    state.receipts.delete(key);
    for (const delivery of [...state.delivered]) {
      if (delivery.startsWith(`${key}${IDENTITY_SEPARATOR}`)) state.delivered.delete(delivery);
    }
    for (const reserved of [...state.reserved]) {
      if (reserved.startsWith(`${key}${IDENTITY_SEPARATOR}`)) state.reserved.delete(reserved);
    }
  }
}

export { POLICY_BLOCK_IDS };
