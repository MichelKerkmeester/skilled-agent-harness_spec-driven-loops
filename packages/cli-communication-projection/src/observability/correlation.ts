// ───────────────────────────────────────────────────────────────────
// MODULE: Rotating Keyed Lifecycle Correlation
// ───────────────────────────────────────────────────────────────────

import { createHmac } from 'node:crypto';

import { RuntimeIds } from '../contracts/common.js';
import { isRecord } from '../contracts/validator-utils.js';

import type { RuntimeId } from '../contracts/common.js';

/** Content-free lifecycle coordinates accepted for correlation. */
export interface CorrelationCoordinates {
  readonly runtime: RuntimeId;
  readonly sessionId: string;
  readonly turnId: string;
  readonly messageId: string;
  readonly generationId: string;
  readonly attempt: number;
}

/** Deterministic key-rotation inputs supplied by the caller. */
export interface CorrelationRotationOptions {
  readonly secretKey: string | Uint8Array;
  readonly epochMs: number;
  readonly windowDurationMs: number;
  readonly nowMs: number;
}

/** A keyed digest created from content-free coordinates. */
export interface CreatedCorrelationDigest {
  readonly status: 'created';
  readonly correlationDigest: string;
  readonly keyRotationId: string;
}

/** Closed rejection that never reflects input data. */
export interface RejectedCorrelationDigest {
  readonly status: 'rejected';
  readonly reasonCode: 'invalid-correlation-input' | 'invalid-rotation-options';
}

/** Result of creating one window-scoped correlation digest. */
export type CorrelationDigestResult = CreatedCorrelationDigest | RejectedCorrelationDigest;

/** Result of checking the observable unlinkability condition across rotations. */
export interface CorrelationUnlinkabilityResult {
  readonly unlinkable: boolean;
  readonly reasonCode: 'same-rotation' | 'digest-reused' | 'rotation-and-digest-differ';
}

const COORDINATE_KEYS = [
  'runtime',
  'sessionId',
  'turnId',
  'messageId',
  'generationId',
  'attempt',
] as const;
const ROTATION_KEYS = ['secretKey', 'epochMs', 'windowDurationMs', 'nowMs'] as const;
const SAFE_IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,191}$/;
const MINIMUM_KEY_BYTES = 16;

/** Create an HMAC digest using a different derived secret for every time window. */
export function createRotatingCorrelationDigest(
  input: unknown,
  options: unknown,
): CorrelationDigestResult {
  if (!isCorrelationCoordinates(input)) {
    return Object.freeze({
      status: 'rejected',
      reasonCode: 'invalid-correlation-input',
    });
  }
  if (!isRotationOptions(options)) {
    return Object.freeze({
      status: 'rejected',
      reasonCode: 'invalid-rotation-options',
    });
  }

  const windowIndex = Math.floor(
    (options.nowMs - options.epochMs) / options.windowDurationMs,
  );
  const keyRotationId = `hmac-sha256:${createHmac('sha256', options.secretKey)
    .update(`correlation-rotation:${options.epochMs}:${windowIndex}`)
    .digest('hex')}`;
  const windowKey = createHmac('sha256', options.secretKey)
    .update(`correlation-key:${options.epochMs}:${windowIndex}`)
    .digest();
  const correlationDigest = createHmac('sha256', windowKey)
    .update(serializeCoordinates(input))
    .digest('hex');

  return Object.freeze({
    status: 'created',
    correlationDigest: `hmac-sha256:${correlationDigest}`,
    keyRotationId,
  });
}

/** Check that two digests expose neither a shared rotation nor a reused digest. */
export function verifyCorrelationRotationUnlinkability(
  first: CreatedCorrelationDigest,
  second: CreatedCorrelationDigest,
): CorrelationUnlinkabilityResult {
  if (first.keyRotationId === second.keyRotationId) {
    return Object.freeze({ unlinkable: false, reasonCode: 'same-rotation' });
  }
  if (first.correlationDigest === second.correlationDigest) {
    return Object.freeze({ unlinkable: false, reasonCode: 'digest-reused' });
  }
  return Object.freeze({
    unlinkable: true,
    reasonCode: 'rotation-and-digest-differ',
  });
}

function isCorrelationCoordinates(input: unknown): input is CorrelationCoordinates {
  if (!isRecord(input) || hasUnknownKeys(input, COORDINATE_KEYS)) {
    return false;
  }
  return (Object.values(RuntimeIds) as readonly unknown[]).includes(input.runtime)
    && isSafeIdentifier(input.sessionId)
    && isSafeIdentifier(input.turnId)
    && isSafeIdentifier(input.messageId)
    && isSafeIdentifier(input.generationId)
    && Number.isSafeInteger(input.attempt)
    && typeof input.attempt === 'number'
    && input.attempt >= 0;
}

function isRotationOptions(input: unknown): input is CorrelationRotationOptions {
  if (!isRecord(input) || hasUnknownKeys(input, ROTATION_KEYS)) {
    return false;
  }
  const keyLength = typeof input.secretKey === 'string'
    ? new TextEncoder().encode(input.secretKey).byteLength
    : input.secretKey instanceof Uint8Array
      ? input.secretKey.byteLength
      : 0;
  return keyLength >= MINIMUM_KEY_BYTES
    && isNonNegativeSafeInteger(input.epochMs)
    && isNonNegativeSafeInteger(input.nowMs)
    && isPositiveSafeInteger(input.windowDurationMs)
    && input.nowMs >= input.epochMs;
}

function hasUnknownKeys(
  input: Record<string, unknown>,
  allowed: readonly string[],
): boolean {
  return Object.keys(input).some((key) => !allowed.includes(key));
}

function isSafeIdentifier(value: unknown): value is string {
  return typeof value === 'string' && SAFE_IDENTIFIER_PATTERN.test(value);
}

function isNonNegativeSafeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

function serializeCoordinates(input: CorrelationCoordinates): string {
  return [
    input.runtime,
    input.sessionId,
    input.turnId,
    input.messageId,
    input.generationId,
    String(input.attempt),
  ].map((value) => `${new TextEncoder().encode(value).byteLength}:${value}`).join('|');
}
