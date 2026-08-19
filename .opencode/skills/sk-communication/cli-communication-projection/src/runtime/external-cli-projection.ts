// ───────────────────────────────────────────────────────────────────
// MODULE: External CLI Projection Runtime
// ───────────────────────────────────────────────────────────────────

import { createExactOriginalRecord } from '../contracts/exact-original.js';
import { createExternalCliModelRecord } from '../providers/presets.js';
import { createChildProcessCliRunner, createExternalCliTransport } from '../transports/cli.js';
import { resolveCliEngineCommand } from '../transports/cli-engines.js';
import { projectMessage } from './project-message.js';

import type { FixtureProvenance, RuntimeId } from '../contracts/common.js';
import type { EventEnvelope } from '../contracts/event.js';
import type { PromptProfileRecord } from '../contracts/prompt.js';
import type { ContextSelectionInput } from '../context/selector.js';
import type { IngestEventInput, StartGenerationInput } from '../core/assembly-types.js';
import type { JudgeMode, RejectOnlyJudge } from '../fidelity/types.js';
import type { ProviderModelRecord } from '../providers/types.js';
import type { CliCommandResolver, CliRunner, SpawnImpl } from '../transports/cli.js';
import type { ProjectMessageResult } from './project-message.js';

/** Inputs for one external-cli projection of a target message. */
export interface ExternalCliProjectionInput {
  readonly engine: string;
  readonly modelId: string;
  readonly sourceText: string;
  readonly now: string;
  readonly resolveCommand?: CliCommandResolver;
  readonly spawnImpl?: SpawnImpl;
  readonly runner?: CliRunner;
  readonly timeoutMs?: number;
  readonly termsExpireAt?: string;
  readonly capabilitiesExpireAt?: string;
  readonly judge?: RejectOnlyJudge;
  readonly signal?: AbortSignal;
}

const CAPABILITY_EXPIRY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const COPY_EDITING_INSTRUCTION =
  'Rewrite only the user message in plain English. Output only the rewrite.';
const COPY_EDITING_TEMPERATURE = 0.2;

// External agents cannot claim zero data retention, so the rewrite runs under an
// egress-consented hosted-retained policy and a required meaning judge; a judge
// rejection or any failure returns the exact original.
const EXTERNAL_CLI_JUDGE_MODE: JudgeMode = 'required';

/**
 * Project one target message through a chosen external CLI engine. The engine
 * record routes as hosted-retained under an egress-consented policy, the CLI
 * transport turns the rewrite into a wire response, and projectMessage applies
 * the same assembly, privacy, fidelity, and render stages every other provider
 * uses. Any denied route, failed dispatch, or rejected rewrite returns the
 * exact original, so a mis-shaped engine output never reaches display.
 */
export async function runExternalCliProjection(
  input: ExternalCliProjectionInput,
): Promise<ProjectMessageResult> {
  const expiry = expiresAfter(input.now);
  const record = createExternalCliModelRecord({
    engine: input.engine,
    modelId: input.modelId,
    observedAt: input.now,
    termsExpireAt: input.termsExpireAt ?? expiry,
    capabilitiesExpireAt: input.capabilitiesExpireAt ?? expiry,
  });
  const runner = input.runner ?? createChildProcessCliRunner({
    resolveCommand: input.resolveCommand ?? resolveCliEngineCommand,
    ...(input.spawnImpl !== undefined ? { spawnImpl: input.spawnImpl } : {}),
    ...(input.timeoutMs !== undefined ? { timeoutMs: input.timeoutMs } : {}),
  });
  const transport = createExternalCliTransport({ runner });
  const message = buildCompletedMessage(input.engine, input.sourceText, input.now);
  return projectMessage({
    generation: message.generation,
    events: message.events,
    context: buildContext(input.now),
    prompt: buildPrompt(record),
    records: [record],
    candidateProviderIds: [record.provider.providerId],
    policy: {
      allowedPrivacyClasses: ['hosted-retained'],
      egressConsent: true,
      requiredKnownFacts: [],
    },
    judgeMode: EXTERNAL_CLI_JUDGE_MODE,
    capabilities: { atomicReplace: true, appendAfterOriginal: true, sidecar: true },
    transport,
    now: input.now,
    ...(input.judge !== undefined ? { judge: input.judge } : {}),
    ...(input.signal !== undefined ? { signal: input.signal } : {}),
  });
}

function expiresAfter(now: string): string {
  return new Date(Date.parse(now) + CAPABILITY_EXPIRY_WINDOW_MS).toISOString();
}

interface CompletedMessage {
  readonly generation: StartGenerationInput;
  readonly events: readonly IngestEventInput[];
}

/** Wrap the target text as one completed assistant message for the assembler. */
function buildCompletedMessage(
  engine: string,
  sourceText: string,
  now: string,
): CompletedMessage {
  const runtime = engineRuntime(engine);
  const key = {
    runtime,
    sessionId: 'external-cli-session',
    turnId: 'external-cli-turn',
    messageId: 'external-cli-message',
    generationId: 'external-cli-generation',
    attempt: 1,
  };
  const original = createExactOriginalRecord(
    'external-cli-original',
    new TextEncoder().encode(sourceText),
    'text/markdown; charset=utf-8',
    provenanceAt(now),
  );
  const event: EventEnvelope = {
    contractKind: 'event',
    schemaVersion: '1.0.0',
    runtime,
    runtimeVersion: 'external-cli-1',
    adapterSchemaVersion: '1.0.0',
    sessionId: key.sessionId,
    turnId: key.turnId,
    messageId: key.messageId,
    itemId: null,
    partId: 'part-0',
    toolCallId: null,
    parentId: null,
    eventId: 'external-cli-terminal-event',
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
    sourceFamily: 'external-cli-command',
    sourceVersion: '1.0.0',
    captureMethod: 'synthetic',
    sanitizationStatus: 'synthetic',
    capturedAt: now,
  };
}

/** Map an engine to its runtime identity tag for generation isolation. */
function engineRuntime(engine: string): RuntimeId {
  switch (engine) {
    case 'claude-code':
      return 'claude';
    case 'codex':
      return 'codex';
    case 'cursor':
      return 'cursor';
    case 'devin':
      return 'devin';
    case 'pi':
      return 'pi';
    default:
      return 'opencode';
  }
}

function buildContext(now: string): ContextSelectionInput {
  return {
    contextId: 'external-cli:context',
    transcript: null,
    privacy: {
      contractKind: 'privacy-decision',
      schemaVersion: '1.0.0',
      privacyClass: 'hosted-retained',
      route: 'hosted',
      egressConsent: true,
      decision: 'allow',
      reasonCode: 'allowed-by-policy',
    },
    now,
    maximumAgeMs: 600_000,
    limitCodepoints: 4_000,
    noContextFallback: 'rewrite-without-context',
  };
}

function buildPrompt(record: ProviderModelRecord): PromptProfileRecord {
  return {
    contractKind: 'prompt-profile',
    schemaVersion: '1.0.0',
    promptVersion: 'external-cli-v1',
    systemInstruction: COPY_EDITING_INSTRUCTION,
    copyEditingScope: 'assistant-message-only',
    protectedValuePolicyVersion: 'protected-spans/1.0.0',
    temperature: COPY_EDITING_TEMPERATURE,
    thinkingMode: 'disabled',
    providerControlMappings: [
      {
        providerId: record.controlProviderId,
        modelPattern: record.provider.modelId,
        control: 'temperature',
        wireField: 'temperature',
        support: 'yes',
        confidence: 'confirmed',
      },
      {
        providerId: record.controlProviderId,
        modelPattern: record.provider.modelId,
        control: 'thinking',
        wireField: 'reasoning_effort',
        support: 'yes',
        confidence: 'confirmed',
      },
    ],
    unsupportedControlBehavior: 'exact-original',
  };
}
