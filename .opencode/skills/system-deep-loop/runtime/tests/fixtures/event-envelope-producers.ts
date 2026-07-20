// ───────────────────────────────────────────────────────────────────
// MODULE: Event Envelope Producer Fixtures
// ───────────────────────────────────────────────────────────────────

import type { JsonObject } from '../../lib/event-envelope/index.js';

export interface ProducerFamilyFixture {
  readonly family: string;
  readonly eventType: string;
  readonly payload: Readonly<JsonObject>;
}

export const PRODUCER_FAMILY_FIXTURES: readonly ProducerFamilyFixture[] = Object.freeze([
  Object.freeze({
    family: 'observability',
    eventType: 'deep-loop.observability.event-recorded',
    payload: Object.freeze({
      schema_version: '1.0',
      event_id: 'fixture-observation',
      producer: 'fixture',
      stream: 'research',
      subject: 'fixture-a',
      event: 'completed',
      status: 'ok',
      observed_at_iso: '2026-01-01T00:00:00.000Z',
      payload: { event: 'completed', label: 'fixture-a' },
    }),
  }),
  Object.freeze({
    family: 'council-round-state',
    eventType: 'deep-loop.council.round-started',
    payload: Object.freeze({
      schema_version: '1.0',
      event_id: 'fixture-round-event',
      written_at_iso: '2026-01-01T00:00:00.000Z',
      type: 'round_started',
      round_id: 'round-001',
      topic_id: 'topic-fixture',
    }),
  }),
  Object.freeze({
    family: 'executor-audit',
    eventType: 'deep-loop.executor.dispatch-failed',
    payload: Object.freeze({
      type: 'event',
      event: 'dispatch_failure',
      reason: 'timeout',
      iteration: 1,
      detail: 'fixture timeout',
      timestamp: '2026-01-01T00:00:00.000Z',
    }),
  }),
  Object.freeze({
    family: 'fan-out-status',
    eventType: 'deep-loop.fanout.lineage-started',
    payload: Object.freeze({
      event: 'started',
      label: 'fixture-a',
      index: 0,
      attempt: 1,
      at: '2026-01-01T00:00:00.000Z',
    }),
  }),
  Object.freeze({
    family: 'iteration-state',
    eventType: 'deep-loop.iteration.run-completed',
    payload: Object.freeze({
      type: 'iteration',
      run: 1,
      status: 'complete',
      focus: 'fixture focus',
      findingsCount: 1,
      newInfoRatio: 1,
      timestamp: '2026-01-01T00:00:00.000Z',
    }),
  }),
]);
