import { isLeafResultPayload } from '../result-envelopes/index.js';
import { reducerInputDigest } from './decision.js';

import type { LeafResultPayload } from '../result-envelopes/index.js';
import type {
  FinalizedFanInDecision,
  FrozenReducerInput,
} from './types.js';

export interface DecisionBoundReductionInput {
  readonly decisionId: string;
  readonly reducerInputDigest: string;
  readonly orderedEnvelopes: readonly LeafResultPayload[];
}

export function bindReductionToDecision(
  decision: FinalizedFanInDecision,
  orderedEnvelopes: readonly LeafResultPayload[],
): DecisionBoundReductionInput {
  if (orderedEnvelopes.length !== decision.reducerInputs.length) {
    throw new TypeError('Reducer input count differs from the finalized decision');
  }
  const reconstructed: FrozenReducerInput[] = [];
  for (let index = 0; index < orderedEnvelopes.length; index += 1) {
    const envelope = orderedEnvelopes[index];
    const frozen = decision.reducerInputs[index];
    if (!isLeafResultPayload(envelope)) {
      throw new TypeError('Reducer input contains an invalid result envelope');
    }
    if (
      envelope.result_envelope_id !== frozen.resultEnvelopeId
      || envelope.result_digest !== frozen.resultDigest
    ) {
      throw new TypeError('Reducer input identity, order, or digest differs from the decision');
    }
    reconstructed.push(Object.freeze({
      resultEnvelopeId: envelope.result_envelope_id,
      resultDigest: envelope.result_digest,
    }));
  }
  const digest = reducerInputDigest(reconstructed);
  if (digest !== decision.reducerInputDigest) {
    throw new TypeError('Reducer input digest differs from the finalized decision');
  }
  return Object.freeze({
    decisionId: decision.decisionId,
    reducerInputDigest: digest,
    orderedEnvelopes: Object.freeze([...orderedEnvelopes]),
  });
}
