import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import { isLeafResultPayload } from '../result-envelopes/index.js';
import { planOutstandingDispositions } from './disposition.js';
import { evaluateSufficiency } from './sufficiency.js';
import {
  CONDITIONAL_FANIN_DECISION_VERSION,
} from './types.js';

import type {
  AwaitPredicateResult,
  FanInClassification,
  FanInDecisionView,
  FanInPrimaryTrigger,
  FinalizedFanInDecision,
  FrozenReducerInput,
  LateResultSalvageRecord,
} from './types.js';
import type { LeafResultPayload } from '../result-envelopes/index.js';

const TRIGGER_PRECEDENCE: readonly FanInPrimaryTrigger[] = Object.freeze([
  'fail-closed-anomaly',
  'budget-floor',
  'sufficiency',
  'all-eligible-terminal',
]);

function classificationFor(trigger: FanInPrimaryTrigger): FanInClassification {
  switch (trigger) {
    case 'fail-closed-anomaly':
      return 'incomplete-anomaly';
    case 'budget-floor':
      return 'incomplete-budget-constrained';
    case 'sufficiency':
      return 'sufficient';
    case 'all-eligible-terminal':
      return 'all-eligible-terminal';
  }
}

export function evaluateAwaitPredicate(view: FanInDecisionView): AwaitPredicateResult {
  const sufficiency = evaluateSufficiency(view.acceptedResults, view.policy);
  const eligibleOutstanding = view.outstandingBranches.filter((branch) => (
    branch.partialFailureEligible && branch.executionState !== 'terminal'
  ));
  const anomaly = view.anomalyCodes.length > 0
    || view.budget.outcome === 'anomaly'
    || (eligibleOutstanding.length > 0 && view.budget.outcome === 'not-applicable');
  const triggered = TRIGGER_PRECEDENCE.filter((trigger) => {
    switch (trigger) {
      case 'fail-closed-anomaly':
        return anomaly;
      case 'budget-floor':
        return view.budget.outcome === 'budget-constrained';
      case 'sufficiency':
        return sufficiency.sufficient;
      case 'all-eligible-terminal':
        return eligibleOutstanding.length === 0;
    }
  });
  const primary = triggered[0] ?? null;
  return Object.freeze({
    shouldAwait: primary === null,
    triggered: Object.freeze(triggered),
    primary,
    classification: primary === null ? null : classificationFor(primary),
    sufficiency,
  });
}

export function reducerInputDigest(inputs: readonly FrozenReducerInput[]): string {
  return sha256Bytes(canonicalBytes({
    reducer_binding_version: 1,
    inputs: inputs.map((input) => ({
      result_envelope_id: input.resultEnvelopeId,
      result_digest: input.resultDigest,
    })),
  }));
}

function decisionIdentity(view: FanInDecisionView, supersedesDecisionId: string | null): string {
  return `fanin-decision:${sha256Bytes(canonicalBytes({
    run_id: view.runId,
    wave_id: view.waveId,
    cut: view.cut,
    policy_digest: view.policyDigest,
    replay_fingerprint: view.replayFingerprint,
    supersedes_decision_id: supersedesDecisionId,
  }))}`;
}

export function finalizeFanInDecisionCandidate(
  view: FanInDecisionView,
  supersedesDecisionId: string | null = null,
): FinalizedFanInDecision {
  const predicate = evaluateAwaitPredicate(view);
  if (
    predicate.shouldAwait
    || predicate.primary === null
    || predicate.classification === null
  ) {
    throw new TypeError('Cannot finalize a fan-in decision while its await predicate is true');
  }

  const included = view.acceptedResults.filter((result) => result.partialFailureEligible);
  const excluded = view.acceptedResults.filter((result) => !result.partialFailureEligible);
  const reducerInputs = included.map((result): FrozenReducerInput => Object.freeze({
    resultEnvelopeId: result.envelope.result_envelope_id,
    resultDigest: result.envelope.result_digest,
  }));
  const decisionId = decisionIdentity(view, supersedesDecisionId);
  const dispositions = planOutstandingDispositions(decisionId, view.outstandingBranches);
  const body = {
    decisionVersion: CONDITIONAL_FANIN_DECISION_VERSION,
    decisionId,
    supersedesDecisionId,
    runId: view.runId,
    waveId: view.waveId,
    replayFingerprint: view.replayFingerprint,
    policyDigest: view.policyDigest,
    cut: view.cut,
    classification: predicate.classification,
    triggered: predicate.triggered,
    primary: predicate.primary,
    includedResultEnvelopeIds: included.map(
      (result) => result.envelope.result_envelope_id,
    ),
    excludedResultEnvelopeIds: excluded.map(
      (result) => result.envelope.result_envelope_id,
    ),
    outstandingBranchIds: view.outstandingBranches.map(
      (branch) => branch.branch.registration.logical_branch_id,
    ),
    budgetSnapshot: view.budget.after,
    budgetEvidence: view.budget,
    sufficiency: predicate.sufficiency,
    dispositions,
    reducerInputs,
    reducerInputDigest: reducerInputDigest(reducerInputs),
  } as const;
  return Object.freeze({
    ...body,
    decisionDigest: sha256Bytes(canonicalBytes(body)),
  });
}

export function recordLateResultForSalvage(
  decision: FinalizedFanInDecision,
  envelope: LeafResultPayload,
  ledgerSequence: number,
): LateResultSalvageRecord {
  if (!isLeafResultPayload(envelope)) throw new TypeError('Late result envelope is invalid');
  if (ledgerSequence <= decision.cut.sequence) {
    throw new RangeError('Late result must be recorded after the finalized decision cut');
  }
  if (decision.includedResultEnvelopeIds.includes(envelope.result_envelope_id)) {
    throw new TypeError('A late result cannot already be included in the frozen decision');
  }
  const body = {
    decisionId: decision.decisionId,
    resultEnvelopeId: envelope.result_envelope_id,
    resultDigest: envelope.result_digest,
    ledgerSequence,
    authoritativeForDecision: false as const,
  };
  return Object.freeze({
    ...body,
    salvageDigest: sha256Bytes(canonicalBytes(body)),
  });
}
