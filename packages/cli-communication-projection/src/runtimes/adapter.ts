// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Adapter Contract and Conformance
// ───────────────────────────────────────────────────────────────────

import { validateEventEnvelope } from '../contracts/validate-event.js';

import type { RuntimeId } from '../contracts/common.js';
import type { EventKind, EventPhase, TerminalStatus } from '../contracts/event.js';
import type { GenerationKey } from '../core/assembly-types.js';
import type {
  RuntimeAdapterInput,
  RuntimeAdapterReasonCode,
  RuntimeAdapterResult,
  RuntimeCapabilityRecord,
  RuntimePresentationInput,
  RuntimePresentationResult,
} from './types.js';

const UNKNOWN_TELEMETRY_PATH_ID = 'unknown-path';

/** Runtime-neutral boundary implemented by every vendor adapter. */
export interface RuntimeAdapter<TRuntimeEvent> {
  readonly adapterVersion: 'runtime-adapter/1.0.0';
  readonly runtime: RuntimeId;
  readonly capabilities: readonly RuntimeCapabilityRecord[];
  adapt(input: RuntimeAdapterInput<TRuntimeEvent>): RuntimeAdapterResult;
  present(input: RuntimePresentationInput): RuntimePresentationResult;
}

/** One expected mapping exercised by the reusable conformance harness. */
export interface RuntimeConformanceCase<TRuntimeEvent> {
  readonly input: RuntimeAdapterInput<TRuntimeEvent>;
  readonly expectedKind: EventKind;
  readonly expectedPhase: EventPhase;
  readonly expectedTerminalStatus: TerminalStatus;
  readonly expectedReasonCode: RuntimeAdapterReasonCode;
  readonly expectedExtensionNamespace?: string;
}

/** Complete input for one adapter conformance pass. */
export interface RuntimeConformanceInput<TRuntimeEvent> {
  readonly adapter: RuntimeAdapter<TRuntimeEvent>;
  readonly cases: readonly RuntimeConformanceCase<TRuntimeEvent>[];
}

/** Content-free summary returned after every conformance assertion passes. */
export interface RuntimeConformanceReport {
  readonly adapterVersion: 'runtime-adapter/1.0.0';
  readonly runtime: RuntimeId;
  readonly casesChecked: number;
  readonly emittedEvents: number;
  readonly extensionEvents: number;
  readonly cancellationEvents: number;
  readonly canonicalWrites: 0;
}

/** Keep envelope-controlled path content outside terminal telemetry. */
export function sanitizeRuntimeTelemetryPathId(
  pathId: string,
  capabilities: readonly RuntimeCapabilityRecord[],
): string {
  return capabilities.some((record) => record.pathId === pathId)
    ? pathId
    : UNKNOWN_TELEMETRY_PATH_ID;
}

/** Derive the generation identity consumed by the shared message assembler. */
export function mapRuntimeGeneration<TRuntimeEvent>(
  input: RuntimeAdapterInput<TRuntimeEvent>,
): GenerationKey {
  const envelope = input.envelope;
  return Object.freeze({
    runtime: envelope.runtime,
    sessionId: envelope.sessionId,
    turnId: envelope.turnId,
    messageId: envelope.messageId,
    generationId: envelope.generationId,
    attempt: envelope.attempt,
  });
}

/** Assert shared contracts, lifecycle mapping, extension retention, and immutability. */
export function assertRuntimeAdapterConformance<TRuntimeEvent>(
  input: RuntimeConformanceInput<TRuntimeEvent>,
): RuntimeConformanceReport {
  let emittedEvents = 0;
  let extensionEvents = 0;
  let cancellationEvents = 0;

  for (const fixture of input.cases) {
    const before = snapshotCanonical(fixture.input);
    const result = input.adapter.adapt(fixture.input);
    const after = snapshotCanonical(fixture.input);
    assertCondition(before === after, 'Adapter mutated canonical runtime state.');
    assertCondition(result.reasonCode === fixture.expectedReasonCode, 'Reason mapping differed.');
    assertGeneration(result.generation, mapRuntimeGeneration(fixture.input));

    const event = result.event;
    assertCondition(event !== null, 'Conformance fixtures must emit a shared event.');
    if (event === null) {
      continue;
    }
    const validation = validateEventEnvelope(event);
    assertCondition(validation.success, 'Adapter emitted an invalid event envelope.');
    assertCondition(event.runtime === input.adapter.runtime, 'Runtime identity differed.');
    assertCondition(event.kind === fixture.expectedKind, 'Event kind differed.');
    assertCondition(event.phase === fixture.expectedPhase, 'Lifecycle phase differed.');
    assertCondition(
      event.terminalStatus === fixture.expectedTerminalStatus,
      'Terminal status differed.',
    );
    assertCondition(
      event.canonicalPayloadRef === fixture.input.canonical.exactOriginal.originalId,
      'Canonical payload reference differed.',
    );
    emittedEvents += 1;

    if (fixture.expectedExtensionNamespace !== undefined) {
      assertCondition(
        Object.hasOwn(event.extensions, fixture.expectedExtensionNamespace),
        'Namespaced extension was not preserved.',
      );
      extensionEvents += 1;
    }
    if (fixture.expectedTerminalStatus === 'cancelled') {
      assertCondition(result.status === 'exact-original', 'Cancellation replaced the original.');
      assertCondition(result.reasonCode === 'cancelled', 'Cancellation reason differed.');
      cancellationEvents += 1;
    }
  }

  return Object.freeze({
    adapterVersion: input.adapter.adapterVersion,
    runtime: input.adapter.runtime,
    casesChecked: input.cases.length,
    emittedEvents,
    extensionEvents,
    cancellationEvents,
    canonicalWrites: 0,
  });
}

function snapshotCanonical<TRuntimeEvent>(
  input: RuntimeAdapterInput<TRuntimeEvent>,
): string {
  return JSON.stringify(input.canonical);
}

function assertGeneration(actual: GenerationKey, expected: GenerationKey): void {
  assertCondition(
    JSON.stringify(actual) === JSON.stringify(expected),
    'Generation mapping differed.',
  );
}

function assertCondition(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
