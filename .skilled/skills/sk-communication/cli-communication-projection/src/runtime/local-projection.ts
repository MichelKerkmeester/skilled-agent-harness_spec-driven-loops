// ───────────────────────────────────────────────────────────────────
// MODULE: Local Provider Projection Runtime
// ───────────────────────────────────────────────────────────────────

import { RuntimeIds } from '../contracts/common.js';
import { createExactOriginalRecord } from '../contracts/exact-original.js';
import { projectMessage } from './project-message.js';

import type { LocalProjectionConfig } from '../config/local-provider.js';
import type { FixtureProvenance } from '../contracts/common.js';
import type { EventEnvelope } from '../contracts/event.js';
import type { IngestEventInput, StartGenerationInput } from '../core/assembly-types.js';
import type { RejectOnlyJudge } from '../fidelity/types.js';
import type { ProjectMessageResult } from './project-message.js';

/** Inputs for one local-provider projection of a target message. */
export interface LocalProjectionInput {
  readonly config: LocalProjectionConfig;
  readonly sourceText: string;
  readonly now: string;
  readonly judge?: RejectOnlyJudge;
  readonly signal?: AbortSignal;
}

/**
 * Project one target message through the configured local provider. Unlike the
 * wrapper, which captures a live CLI stream and projects it, this takes a static
 * piece of target text and runs it through the same projectMessage tail as the
 * external-cli and hosted paths, sourcing the provider record, prompt, policy,
 * transport, judge mode, and capabilities from the shipped local provider config.
 * Any disabled gate, denied route, provider failure, or rejected rewrite returns
 * the exact original, so a mis-shaped local response never reaches display.
 */
export async function runLocalProjection(
  input: LocalProjectionInput,
): Promise<ProjectMessageResult> {
  const message = buildCompletedMessage(input.sourceText, input.now);
  return projectMessage({
    generation: message.generation,
    events: message.events,
    context: input.config.context,
    prompt: input.config.prompt,
    records: input.config.records,
    candidateProviderIds: input.config.candidateProviderIds,
    policy: input.config.policy,
    judgeMode: input.config.judgeMode,
    capabilities: input.config.capabilities,
    transport: input.config.transport,
    now: input.now,
    ...(input.judge !== undefined ? { judge: input.judge } : {}),
    ...(input.signal !== undefined ? { signal: input.signal } : {}),
  });
}

interface CompletedMessage {
  readonly generation: StartGenerationInput;
  readonly events: readonly IngestEventInput[];
}

/** Wrap the target text as one completed assistant message for the assembler. */
function buildCompletedMessage(sourceText: string, now: string): CompletedMessage {
  const runtime = RuntimeIds.OPENCODE;
  const key = {
    runtime,
    sessionId: 'local-provider-session',
    turnId: 'local-provider-turn',
    messageId: 'local-provider-message',
    generationId: 'local-provider-generation',
    attempt: 1,
  };
  const original = createExactOriginalRecord(
    'local-provider-original',
    new TextEncoder().encode(sourceText),
    'text/markdown; charset=utf-8',
    provenanceAt(now),
  );
  const event: EventEnvelope = {
    contractKind: 'event',
    schemaVersion: '1.0.0',
    runtime,
    runtimeVersion: 'local-provider-1',
    adapterSchemaVersion: '1.0.0',
    sessionId: key.sessionId,
    turnId: key.turnId,
    messageId: key.messageId,
    itemId: null,
    partId: 'part-0',
    toolCallId: null,
    parentId: null,
    eventId: 'local-provider-terminal-event',
    kind: 'assistant-message',
    phase: 'final',
    sourceTimestamp: null,
    order: { sourceSequence: 0, arrivalIndex: 0, assemblyIndex: null },
    canonicalPayloadRef: original.originalId,
    payload: { textOriginalId: original.originalId },
    extensions: {},
    terminalStatus: 'completed',
    capabilityConfidence: 'confirmed',
  };
  return {
    generation: { key, exactOriginal: original, startedAtMs: 0 },
    events: [{ key, event, original, observedAtMs: 1 }],
  };
}

function provenanceAt(now: string): FixtureProvenance {
  return {
    sourceFamily: 'local-provider-command',
    sourceVersion: '1.0.0',
    captureMethod: 'synthetic',
    sanitizationStatus: 'synthetic',
    capturedAt: now,
  };
}
