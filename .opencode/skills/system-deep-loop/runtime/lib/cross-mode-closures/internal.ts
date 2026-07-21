// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Closure Internal Helpers
// ───────────────────────────────────────────────────────────────────

import { canonicalJson } from '../event-envelope/index.js';
import {
  CrossModeClosureError,
  CrossModeClosureErrorCodes,
} from './errors.js';

import type { JsonObject, JsonValue } from '../event-envelope/index.js';
import type {
  ClosureServicePorts,
  CrossModeClosureContext,
  ModeDataPolicyOverride,
} from './types.js';

const SAFETY_BYPASS_FIELDS = Object.freeze([
  'skipAuthorization',
  'skipBudgetAdmission',
  'skipFencing',
  'skipReceiptOrdering',
  'skipSealing',
] as const);
const SAFETY_BYPASS_FIELD_SET: ReadonlySet<string> = new Set(SAFETY_BYPASS_FIELDS);
const CONTEXT_SERVICE_PORTS = new WeakMap<
  CrossModeClosureContext,
  Readonly<ClosureServicePorts>
>();

function containsSafetyBypassField(value: unknown): boolean {
  const pending: unknown[] = [value];
  const visited = new WeakSet<object>();
  while (pending.length > 0) {
    const current = pending.pop();
    if (current === null || typeof current !== 'object' || visited.has(current)) continue;
    visited.add(current);
    if (Array.isArray(current)) {
      pending.push(...current);
      continue;
    }
    for (const [key, nested] of Object.entries(current)) {
      if (SAFETY_BYPASS_FIELD_SET.has(key)) return true;
      pending.push(nested);
    }
  }
  return false;
}

/** Bind validated service ports without exposing them on the public context. */
export function bindClosureServicePorts(
  context: CrossModeClosureContext,
  services: Readonly<ClosureServicePorts>,
): void {
  CONTEXT_SERVICE_PORTS.set(context, services);
}

/** Resolve the service ports available only to closure-owned implementations. */
export function getClosureServicePorts(
  context: CrossModeClosureContext,
): Readonly<ClosureServicePorts> {
  const services = CONTEXT_SERVICE_PORTS.get(context);
  if (!services) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.INVALID_CONTEXT,
      'Closure context is not bound to validated service ports',
    );
  }
  return services;
}

export function requireIdentity(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.INVALID_CONTEXT,
      `${field} must be a non-empty string`,
      { field },
    );
  }
  return value;
}

export function cloneFrozenJson<T extends JsonValue>(value: T): Readonly<T> {
  const cloned = JSON.parse(canonicalJson(value)) as T;
  const freeze = (entry: JsonValue): void => {
    if (entry !== null && typeof entry === 'object') {
      Object.values(entry).forEach(freeze);
      Object.freeze(entry);
    }
  };
  freeze(cloned);
  return cloned;
}

export function assertExactKeys(
  value: unknown,
  expectedKeys: readonly string[],
  errorCode = CrossModeClosureErrorCodes.INVALID_OVERRIDE,
): asserts value is Record<string, unknown> {
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    throw new CrossModeClosureError(errorCode, 'Value must be a closed object');
  }
  const actual = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  if (canonicalJson(actual) !== canonicalJson(expected)) {
    throw new CrossModeClosureError(
      errorCode,
      'Closed contract contains missing or unauthorized fields',
      { actual, expected },
    );
  }
}

export async function applyDeterministicOverride<TInput, TOutput>(
  override: ModeDataPolicyOverride<TInput, TOutput>,
  input: Readonly<TInput>,
): Promise<Readonly<TOutput>> {
  const frozenInput = cloneFrozenJson(
    input as unknown as JsonValue,
  ) as Readonly<TInput>;
  const first = await override.apply(frozenInput);
  const second = await override.apply(frozenInput);
  for (const output of [first, second]) {
    if (containsSafetyBypassField(output)) {
      throw new CrossModeClosureError(
        CrossModeClosureErrorCodes.INVALID_OVERRIDE,
        'Mode override requested a reserved safety-port bypass',
        { policyOwner: override.policyOwner },
      );
    }
  }
  if (
    canonicalJson(first as unknown as JsonValue)
    !== canonicalJson(second as unknown as JsonValue)
  ) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.NON_DETERMINISTIC_OVERRIDE,
      'Mode data or policy override produced unstable canonical output',
      { policyOwner: override.policyOwner },
    );
  }
  return cloneFrozenJson(first as unknown as JsonValue) as Readonly<TOutput>;
}

export function assertContextLifecycleFact(
  context: CrossModeClosureContext,
  fact: Readonly<CrossModeClosureContext['lifecycleEvent']>,
): void {
  if (
    fact.canonicalDigest !== context.lifecycleEvent.canonicalDigest
    || fact.identity.eventId !== context.lifecycleEvent.identity.eventId
  ) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.AUTHORIZED_FACT_REQUIRED,
      'Closure fact must be the lifecycle event bound into the immutable context',
    );
  }
}

export async function verifySealedInputs(
  context: CrossModeClosureContext,
): Promise<readonly string[]> {
  const services = getClosureServicePorts(context);
  const verifiedDigests: string[] = [];
  try {
    for (const reference of context.sealedReferences) {
      const verified = await services.sealedArtifacts.readVerified(
        reference,
        reference.artifact_kind,
      );
      verifiedDigests.push(verified.reference.qualified_digest);
    }
  } catch (error: unknown) {
    throw new CrossModeClosureError(
      CrossModeClosureErrorCodes.SEALED_REFERENCE_REJECTED,
      'A closure cannot consume an unverified sealed reference',
      { cause: error instanceof Error ? error.message : String(error) },
    );
  }
  return Object.freeze(verifiedDigests);
}

export function eventIdentity(context: CrossModeClosureContext): JsonObject {
  return {
    event_id: context.lifecycleEvent.identity.eventId,
    event_digest: context.lifecycleEvent.canonicalDigest,
    interface_version: context.interfaceVersion,
    continuity_identity: context.continuityIdentity,
  };
}
