// ───────────────────────────────────────────────────────────────────
// MODULE: Projection Runtime Entrypoint
// ───────────────────────────────────────────────────────────────────

import { isProjectionEnabled } from '../config/enablement.js';
import { decodeExactOriginal } from '../contracts/exact-original.js';
import { MessageAssembler } from '../core/assembler.js';
import { selectBoundedContext } from '../context/selector.js';
import { evaluateOfferVerdict } from '../evaluation/offer.js';
import { deepFreeze } from '../fidelity/freeze.js';
import { protectMarkdown } from '../fidelity/protected-spans.js';
import { createRejectOnlyMeaningJudge } from '../fidelity/reject-only-judge.js';
import { validateProjectionCandidate } from '../fidelity/validator.js';
import { selectPrivacyRoute } from '../privacy/router.js';
import { executeProviderRoute } from '../providers/executor.js';
import { decideRender } from '../render/decision.js';
import { createDefaultProviderTransport } from '../transports/http.js';
import { consultPreProjectionGate } from './gate.js';

import type { ExactOriginalRecord } from '../contracts/exact-original.js';
import type { PromptProfileRecord } from '../contracts/prompt.js';
import type { ContextSelectionInput } from '../context/selector.js';
import type { DoctorInput } from '../doctor/types.js';
import type { ReleaseGateDecision } from '../evaluation/gate.js';
import type { OfferReasonCode } from '../evaluation/offer.js';
import type { DatedReleaseEvidence } from '../release/evidence.js';
import type {
  AssemblyReasonCode,
  IngestEventInput,
  StartGenerationInput,
} from '../core/assembly-types.js';
import type {
  FidelityReasonCode,
  JudgeMode,
  RejectOnlyJudge,
} from '../fidelity/types.js';
import type {
  PrivacyRoutePolicy,
  PrivacyRoutingReasonCode,
} from '../privacy/types.js';
import type {
  ProviderCredentialStatus,
  ProviderExecutionReasonCode,
  ProviderModelRecord,
  ProviderTransport,
} from '../providers/types.js';
import type {
  RenderCapabilities,
  RenderMode,
  RenderReasonCode,
} from '../render/types.js';
import type { GateReasonCode } from './gate.js';

/** Complete immutable input to one projection of a raw agent message. */
export interface ProjectMessageInput {
  readonly generation: StartGenerationInput;
  readonly events: readonly IngestEventInput[];
  readonly context: ContextSelectionInput;
  readonly prompt: PromptProfileRecord;
  readonly records: readonly ProviderModelRecord[];
  readonly candidateProviderIds: readonly string[];
  readonly policy: PrivacyRoutePolicy;
  readonly judgeMode: JudgeMode;
  readonly capabilities: RenderCapabilities;
  readonly preferredModes?: readonly RenderMode[];
  readonly transport?: ProviderTransport;
  readonly credentialStatus?: ProviderCredentialStatus;
  readonly judge?: RejectOnlyJudge;
  readonly gate?: DoctorInput;
  readonly evaluation?: DatedReleaseEvidence<ReleaseGateDecision>;
  readonly now: string;
  readonly signal?: AbortSignal;
}

/** Content-free reason attached to every exact-original terminal. */
export type ProjectMessageFallbackReason =
  | 'context-unavailable'
  | 'incomplete-assembly'
  | 'projection-disabled'
  | Exclude<AssemblyReasonCode, 'completed'>
  | Exclude<FidelityReasonCode, 'accepted'>
  | Exclude<PrivacyRoutingReasonCode, 'allowed-by-policy'>
  | Exclude<ProviderExecutionReasonCode, 'none'>
  | Exclude<RenderReasonCode, 'projection-accepted'>
  | GateReasonCode
  | OfferReasonCode;

/** Validated display projection with the mode the render decision selected. */
export interface ProjectedMessage {
  readonly status: 'projection';
  readonly text: string;
  readonly mode: Exclude<RenderMode, 'exact-original-only'>;
}

/** Exact stored bytes returned verbatim after any non-accept terminal. */
export interface OriginalMessage {
  readonly status: 'exact-original';
  readonly text: string;
  readonly reasonCode: ProjectMessageFallbackReason;
}

/** Terminal outcome: a validated projection or the byte-exact original. */
export type ProjectMessageResult = ProjectedMessage | OriginalMessage;

/**
 * Run the frozen stage order for one raw agent message and return a validated
 * projection or the exact original. Every non-accept terminal, from the
 * enablement gate through the render decision, returns the original bytes
 * untouched, and no hosted call ever precedes privacy routing.
 */
export async function projectMessage(
  input: ProjectMessageInput,
): Promise<ProjectMessageResult> {
  const originalText = decodeOriginalText(input.generation.exactOriginal);

  if (!isProjectionEnabled()) {
    return originalMessage(originalText, 'projection-disabled');
  }
  if (input.signal?.aborted === true) {
    return originalMessage(originalText, 'cancelled');
  }

  if (input.gate !== undefined) {
    const gate = await consultPreProjectionGate(input.gate);
    if (gate.status === 'exact-original') {
      return originalMessage(originalText, gate.reasonCode);
    }
  }

  if (input.evaluation !== undefined) {
    const offer = evaluateOfferVerdict(input.evaluation, input.now);
    if (offer.status === 'exact-original') {
      return originalMessage(originalText, offer.reasonCode);
    }
  }

  const assembly = assembleMessage(input.generation, input.events);
  if (assembly.status === 'exact-original') {
    return originalMessage(originalText, assembly.reasonCode);
  }

  const contextResult = selectBoundedContext(input.context);
  if (
    !contextResult.success
    || (
      contextResult.value.record.outcome === 'absent'
      && contextResult.value.record.noContextFallback === 'exact-original'
    )
  ) {
    return originalMessage(originalText, 'context-unavailable');
  }

  const protection = protectMarkdown({
    sourceText: assembly.text,
    exactOriginal: assembly.exactOriginal,
  });
  if (protection.status !== 'protected') {
    return originalMessage(
      originalText,
      protection.status === 'exact-original'
        ? fidelityFallback(protection.reasonCode)
        : 'invalid-input',
    );
  }
  const document = protection.document;

  const route = selectPrivacyRoute({
    records: input.records,
    candidateProviderIds: input.candidateProviderIds,
    policy: input.policy,
    now: input.now,
  });
  if (route.status === 'denied') {
    return originalMessage(originalText, route.reasonCode);
  }

  const transport = input.transport ?? createDefaultProviderTransport();
  const credentialStatus = input.credentialStatus ?? defaultCredentialStatus;
  const execution = await executeProviderRoute({
    route,
    prompt: input.prompt,
    document,
    transport,
    credentialStatus,
    now: input.now,
    ...(input.signal !== undefined ? { signal: input.signal } : {}),
  });
  if (execution.status !== 'candidate') {
    return originalMessage(originalText, execution.reasonCode);
  }

  const judge = input.judgeMode === 'required'
    ? input.judge ?? createRejectOnlyMeaningJudge()
    : undefined;
  const validation = await validateProjectionCandidate({
    protection: document,
    candidateText: execution.candidateText,
    providerTerminal: execution.providerTerminal,
    allPartsComplete: true,
    currentSourceSha256: document.sourceSha256,
    judgeMode: input.judgeMode,
    ...(input.signal !== undefined ? { signal: input.signal } : {}),
  }, judge);
  if (validation.status !== 'accepted') {
    return originalMessage(originalText, validation.reasonCode);
  }

  const render = decideRender({
    validation,
    currentSourceSha256: document.sourceSha256,
    sourceTerminal: 'completed',
    allPartsComplete: true,
    capabilities: input.capabilities,
    ...(input.preferredModes !== undefined ? { preferredModes: input.preferredModes } : {}),
  });
  if (render.status !== 'projection') {
    return originalMessage(originalText, render.reasonCode);
  }
  return deepFreeze({
    status: 'projection',
    text: render.projectionText,
    mode: render.mode,
  });
}

type AssembleOutcome =
  | {
    readonly status: 'completed';
    readonly text: string;
    readonly exactOriginal: ExactOriginalRecord;
  }
  | {
    readonly status: 'exact-original';
    readonly reasonCode: ProjectMessageFallbackReason;
  };

function assembleMessage(
  generation: StartGenerationInput,
  events: readonly IngestEventInput[],
): AssembleOutcome {
  const assembler = new MessageAssembler();
  const started = assembler.startGeneration(generation);
  if (started.status !== 'started') {
    if (started.status === 'rejected') {
      return { status: 'exact-original', reasonCode: 'invalid-input' };
    }
    if (started.status === 'ignored-terminal') {
      return { status: 'exact-original', reasonCode: assemblyFallback(started.reasonCode) };
    }
    return { status: 'exact-original', reasonCode: started.result.reasonCode };
  }
  for (const eventInput of events) {
    const ingested = assembler.ingestEvent(eventInput);
    if (ingested.status === 'rejected') {
      return { status: 'exact-original', reasonCode: 'invalid-input' };
    }
    if (ingested.status === 'ignored-terminal') {
      return { status: 'exact-original', reasonCode: assemblyFallback(ingested.reasonCode) };
    }
    if (ingested.status === 'terminal') {
      const result = ingested.result;
      return result.status === 'completed'
        ? { status: 'completed', text: result.text, exactOriginal: result.exactOriginal }
        : { status: 'exact-original', reasonCode: result.reasonCode };
    }
  }
  return { status: 'exact-original', reasonCode: 'incomplete-assembly' };
}

const defaultCredentialStatus: ProviderCredentialStatus = async (reference) =>
  reference.startsWith('none:') ? 'available' : 'missing';

function assemblyFallback(reasonCode: AssemblyReasonCode): Exclude<AssemblyReasonCode, 'completed'> {
  return reasonCode === 'completed' ? 'invalid-input' : reasonCode;
}

function fidelityFallback(reasonCode: FidelityReasonCode): Exclude<FidelityReasonCode, 'accepted'> {
  return reasonCode === 'accepted' ? 'invalid-input' : reasonCode;
}

function decodeOriginalText(record: ExactOriginalRecord): string {
  const bytes = decodeExactOriginal(record);
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder('utf-8').decode(bytes);
  }
}

function originalMessage(
  text: string,
  reasonCode: ProjectMessageFallbackReason,
): OriginalMessage {
  return deepFreeze({ status: 'exact-original', text, reasonCode });
}
