// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Open Design Capability-Gated Live Transport                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { assertOfflineContractGate } from './offline-gate.mjs';
import {
  digestMetadata,
  validateReceiptForLive,
} from './grounding-receipt.mjs';
import {
  OPEN_DESIGN_RETURN_EVIDENCE_VERSION,
  reconcileTransportReturn,
  validateModeEvidence,
  validateModeProposal,
  validateReturnEvidence,
} from './return-reconciliation.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. LIVE CONTRACT
// ─────────────────────────────────────────────────────────────────────────────

const RUN_REQUIRED_TOOLS = Object.freeze(['start_run', 'get_run', 'get_artifact']);
const LIVE_STATUSES = new Set(['awaiting_input', 'completed', 'failed', 'cancelled']);
const AGENTS = new Set(['claude', 'opencode', 'gemini']);
const HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;
const IDENTIFIER_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,255}$/;
const CONTINUATION_ACTION = 'use-recommended-defaults';

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function deepFreeze(value, seen = new Set()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return Object.freeze(value);
}

function cloneModeOwnedInputs(input) {
  try {
    return deepFreeze({
      receipt: structuredClone(input.receipt),
      proposal: structuredClone(input.proposal),
      modeEvidence: structuredClone(input.modeEvidence ?? []),
      transformedBrief: input.transformedBrief === undefined
        ? undefined
        : structuredClone(input.transformedBrief),
      runOptions: input.runOptions === undefined ? undefined : structuredClone(input.runOptions),
      mutationAuthorization: input.mutationAuthorization === undefined
        ? undefined
        : structuredClone(input.mutationAuthorization),
      continuation: input.continuation === undefined
        ? undefined
        : structuredClone(input.continuation),
    });
  } catch (error) {
    throw new TypeError(`Live mode inputs must be cloneable metadata: ${error.message}`);
  }
}

function extractToolNames(toolList) {
  const tools = Array.isArray(toolList) ? toolList : toolList?.tools;
  if (!Array.isArray(tools)) return [];
  return [...new Set(tools
    .map((tool) => (typeof tool === 'string' ? tool : tool?.name))
    .filter((tool) => typeof tool === 'string' && IDENTIFIER_PATTERN.test(tool)))]
    .sort();
}

function normalizeStatus(rawStatus, operationKind) {
  if (operationKind === 'design-bearing-read') return 'read_complete';
  return LIVE_STATUSES.has(rawStatus) ? rawStatus : 'failed';
}

function artifactCandidates(rawResult) {
  if (Array.isArray(rawResult?.artifacts)) return rawResult.artifacts;
  if (Array.isArray(rawResult?.files)) return rawResult.files;
  if (isPlainObject(rawResult)
    && (Object.hasOwn(rawResult, 'content')
      || Object.hasOwn(rawResult, 'path')
      || Object.hasOwn(rawResult, 'name'))) {
    return [rawResult];
  }
  return [];
}

function normalizeArtifacts(rawResult, receipt, status) {
  if (status === 'awaiting_input') return [];
  const artifacts = artifactCandidates(rawResult).map((candidate, index) => {
    if (typeof candidate === 'string') {
      return { path: candidate, hash: digestMetadata({ path: candidate, index }) };
    }
    const path = candidate?.path ?? candidate?.name ?? `artifact-${index}`;
    let hash;
    if (Object.hasOwn(candidate ?? {}, 'content')) {
      hash = digestMetadata(candidate.content);
    } else if (typeof candidate?.hash === 'string' && HASH_PATTERN.test(candidate.hash)) {
      hash = candidate.hash;
    } else {
      hash = digestMetadata({ path, index });
    }
    return { path, hash };
  });
  if (artifacts.length === 0 && receipt.operation.kind === 'design-bearing-read') {
    artifacts.push({
      path: receipt.target.resourceId ?? receipt.operation.tool,
      hash: digestMetadata(rawResult),
    });
  }
  return artifacts;
}

function summarizeLivePayload(rawResult, receipt, toolSurfaceEvidence) {
  if (!isPlainObject(rawResult)) {
    throw new TypeError('Open Design live client returned a non-object response.');
  }
  const status = normalizeStatus(rawResult.status, receipt.operation.kind);
  const evidence = {
    schemaVersion: OPEN_DESIGN_RETURN_EVIDENCE_VERSION,
    status,
    projectId: rawResult.projectId ?? rawResult.project?.id ?? receipt.target.projectId,
    conversationId: rawResult.conversationId ?? rawResult.conversation?.id ?? null,
    runId: rawResult.runId ?? rawResult.run?.id ?? rawResult.id ?? null,
    entryFile: status === 'awaiting_input' ? null : (rawResult.entryFile ?? null),
    previewUrl: status === 'awaiting_input' ? null : (rawResult.previewUrl ?? null),
    artifacts: normalizeArtifacts(rawResult, receipt, status),
    observedAt: new Date().toISOString(),
    toolSurfaceEvidence,
  };
  const validation = validateReturnEvidence(evidence);
  if (!validation.valid) {
    throw new TypeError(`Open Design return metadata is invalid: ${validation.errors.join(', ')}`);
  }
  return deepFreeze(evidence);
}

function summarizeContinuationPayload(rawResult, expectedRunId) {
  if (!isPlainObject(rawResult)) {
    throw new TypeError('Open Design continuation returned a non-object response.');
  }
  const runId = rawResult.runId ?? rawResult.run?.id ?? rawResult.id ?? expectedRunId;
  if (runId !== expectedRunId) {
    throw new TypeError('Open Design continuation returned a different run identifier.');
  }
  return Object.freeze({ runId: expectedRunId, acknowledgementDigest: digestMetadata(rawResult) });
}

function validateSharedSnapshot(snapshot, offlineGate, client) {
  assertOfflineContractGate(offlineGate);
  const receiptValidation = validateReceiptForLive(snapshot.receipt);
  const proposalValidation = validateModeProposal(snapshot.proposal);
  const modeEvidenceValidation = validateModeEvidence(snapshot.modeEvidence);
  const errors = [
    ...receiptValidation.errors,
    ...proposalValidation.errors,
    ...modeEvidenceValidation.errors,
  ];
  if (errors.length) {
    throw new TypeError(`Live mode input validation failed: ${errors.join(', ')}`);
  }
  if (snapshot.proposal.pairedMode !== snapshot.receipt.pairedMode) {
    throw new TypeError('Proposal paired mode must match the grounding receipt.');
  }
  if (snapshot.proposal.targetProjectId !== snapshot.receipt.target.projectId) {
    throw new TypeError('Proposal target must match the grounding receipt target.');
  }
  if (digestMetadata(snapshot.proposal) !== snapshot.receipt.influence.proposalDigest) {
    throw new TypeError('Proposal snapshot does not match the grounding receipt digest.');
  }
  if (!client || typeof client.listTools !== 'function' || typeof client.callTool !== 'function') {
    throw new TypeError('Live client must provide listTools() and callTool().');
  }
}

function validateRunSnapshot(snapshot, client) {
  const authorization = snapshot.mutationAuthorization;
  if (!isPlainObject(authorization)
    || authorization.confirmed !== true
    || authorization.targetProjectId !== snapshot.receipt.target.projectId
    || authorization.rollback !== 'manual-open-design-cleanup'
    || Reflect.ownKeys(authorization).length !== 3) {
    throw new Error('Live generation requires external confirmation, an exact target, and rollback.');
  }
  if (!isPlainObject(snapshot.runOptions)
    || Reflect.ownKeys(snapshot.runOptions).length !== 2
    || !AGENTS.has(snapshot.runOptions.agent)
    || typeof snapshot.runOptions.model !== 'string'
    || !IDENTIFIER_PATTERN.test(snapshot.runOptions.model)) {
    throw new TypeError('Live generation requires a supported agent and an explicit model identifier.');
  }
  if (digestMetadata(snapshot.transformedBrief) !== snapshot.receipt.influence.briefDigest) {
    throw new Error('Live transformed brief does not match the grounding receipt digest.');
  }
  if (snapshot.continuation !== undefined) {
    if (!isPlainObject(snapshot.continuation)
      || Reflect.ownKeys(snapshot.continuation).length !== 3
      || snapshot.continuation.confirmed !== true
      || snapshot.continuation.action !== CONTINUATION_ACTION
      || !Number.isInteger(snapshot.continuation.maxPollAttempts)
      || snapshot.continuation.maxPollAttempts < 1
      || snapshot.continuation.maxPollAttempts > 10) {
      throw new TypeError('Live continuation requires confirmation, a closed action, and bounded polling.');
    }
    if (typeof client.continueRun !== 'function') {
      throw new TypeError('Live continuation requires a continueRun() adapter method.');
    }
  }
}

function toolSurfaceEvidence(capability, requiredTools) {
  return deepFreeze({
    observedAt: capability.observedAt,
    toolsListHash: capability.toolsListHash,
    requiredTools: [...requiredTools],
  });
}

function transportResult(snapshot, returnEvidence, capability) {
  const reconciliation = reconcileTransportReturn({
    proposal: snapshot.proposal,
    returnEvidence,
    modeEvidence: snapshot.modeEvidence,
  });
  return deepFreeze({
    receiptId: snapshot.receipt.receiptId,
    returnEvidence: reconciliation.returnEvidence,
    reconciliation,
    capability: {
      observedAt: capability.observedAt,
      toolsListHash: capability.toolsListHash,
    },
  });
}

async function fetchCompletedArtifact(client, snapshot, evidence, surfaceEvidence) {
  const rawArtifact = await client.callTool('get_artifact', {
    project: snapshot.receipt.target.projectId,
    runId: evidence.runId,
    path: evidence.entryFile,
  });
  if (!isPlainObject(rawArtifact)) {
    throw new TypeError('Open Design artifact fetch returned a non-object response.');
  }
  const completedEvidence = {
    ...structuredClone(evidence),
    artifacts: normalizeArtifacts(rawArtifact, snapshot.receipt, 'completed'),
  };
  const validation = validateReturnEvidence(completedEvidence);
  if (!validation.valid) {
    throw new TypeError(`Open Design artifact metadata is invalid: ${validation.errors.join(', ')}`);
  }
  return deepFreeze(completedEvidence);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CAPABILITY CHECK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verify the daemon-backed live tool surface without assuming a fixed endpoint.
 *
 * @param {Object} client - Adapter exposing listTools().
 * @param {string[]} requiredTools - Tools required by the operation.
 * @returns {Promise<Object>} Metadata-only capability result.
 */
export async function checkLiveCapability(client, requiredTools) {
  if (!client || typeof client.listTools !== 'function') {
    return { available: false, reason: 'client-list-tools-missing' };
  }
  try {
    const toolNames = extractToolNames(await client.listTools());
    const missingTools = requiredTools.filter((tool) => !toolNames.includes(tool));
    if (missingTools.length) {
      return {
        available: false,
        reason: `required-tools-missing:${missingTools.join(',')}`,
      };
    }
    return {
      available: true,
      observedAt: new Date().toISOString(),
      toolsListHash: digestMetadata(toolNames),
    };
  } catch {
    return {
      available: false,
      reason: 'daemon-unavailable',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. LIVE READ AND RUN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Execute a design-bearing read after the offline and live capability gates.
 *
 * @param {Object} input - Live read inputs.
 * @returns {Promise<Readonly<Object>>} Metadata-only return and reconciliation.
 */
export async function executeLiveRead(input) {
  const snapshot = cloneModeOwnedInputs(input);
  validateSharedSnapshot(snapshot, input.offlineGate, input.client);
  if (snapshot.receipt.operation.kind !== 'design-bearing-read') {
    throw new TypeError('executeLiveRead requires a design-bearing-read receipt.');
  }
  const requiredTools = Object.freeze([snapshot.receipt.operation.tool]);
  const capability = await checkLiveCapability(input.client, requiredTools);
  if (!capability.available) {
    throw new Error(`Open Design live capability unavailable: ${capability.reason}`);
  }
  const toolArguments = { project: snapshot.receipt.target.projectId };
  if (snapshot.receipt.target.resourceId !== null) {
    toolArguments.path = snapshot.receipt.target.resourceId;
  }
  const rawResult = await input.client.callTool(snapshot.receipt.operation.tool, toolArguments);
  const evidence = summarizeLivePayload(
    rawResult,
    snapshot.receipt,
    toolSurfaceEvidence(capability, requiredTools),
  );
  return transportResult(snapshot, evidence, capability);
}

/**
 * Run generation, optionally continue an awaiting turn, poll, and fetch output.
 *
 * @param {Object} input - Live run inputs.
 * @returns {Promise<Readonly<Object>>} Metadata-only return and reconciliation.
 */
export async function executeLiveRun(input) {
  const snapshot = cloneModeOwnedInputs(input);
  validateSharedSnapshot(snapshot, input.offlineGate, input.client);
  if (snapshot.receipt.operation.kind !== 'generation-run') {
    throw new TypeError('executeLiveRun requires a generation-run receipt.');
  }
  validateRunSnapshot(snapshot, input.client);

  const capability = await checkLiveCapability(input.client, RUN_REQUIRED_TOOLS);
  if (!capability.available) {
    throw new Error(`Open Design live capability unavailable: ${capability.reason}`);
  }
  const surfaceEvidence = toolSurfaceEvidence(capability, RUN_REQUIRED_TOOLS);
  const rawStart = await input.client.callTool('start_run', {
    project: snapshot.receipt.target.projectId,
    prompt: snapshot.transformedBrief,
    agent: snapshot.runOptions.agent,
    model: snapshot.runOptions.model,
  });
  let evidence = summarizeLivePayload(rawStart, snapshot.receipt, surfaceEvidence);

  if (evidence.status === 'awaiting_input' && snapshot.continuation !== undefined) {
    const rawContinuation = await input.client.continueRun({
      project: snapshot.receipt.target.projectId,
      runId: evidence.runId,
      action: snapshot.continuation.action,
    });
    summarizeContinuationPayload(rawContinuation, evidence.runId);

    for (let attempt = 0; attempt < snapshot.continuation.maxPollAttempts; attempt += 1) {
      const rawPoll = await input.client.callTool('get_run', { runId: evidence.runId });
      evidence = summarizeLivePayload(rawPoll, snapshot.receipt, surfaceEvidence);
      if (evidence.status !== 'awaiting_input') break;
    }
  }

  if (evidence.status === 'completed') {
    evidence = await fetchCompletedArtifact(input.client, snapshot, evidence, surfaceEvidence);
  }
  return transportResult(snapshot, evidence, capability);
}
