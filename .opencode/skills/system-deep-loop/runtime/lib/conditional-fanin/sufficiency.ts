import type {
  AcceptedResultAtCut,
  ConditionalFanInPolicy,
  ProvenanceGroupEvidence,
  SufficiencyEvidence,
} from './types.js';

export function evaluateSufficiency(
  acceptedResults: readonly AcceptedResultAtCut[],
  policy: ConditionalFanInPolicy,
): SufficiencyEvidence {
  const eligible = acceptedResults.filter((result) => result.partialFailureEligible);
  const grouped = new Map<string, AcceptedResultAtCut[]>();
  for (const result of eligible) {
    const group = grouped.get(result.provenanceGroupId) ?? [];
    group.push(result);
    grouped.set(result.provenanceGroupId, group);
  }

  const groups: ProvenanceGroupEvidence[] = [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([provenanceGroupId, results]) => {
      const agreementKeys = [...new Set(results.map((result) => result.agreementKey))].sort();
      return Object.freeze({
        provenanceGroupId,
        coherentAgreementKey: agreementKeys.length === 1 ? agreementKeys[0] : null,
        acceptedEnvelopeIds: results
          .map((result) => result.envelope.result_envelope_id)
          .sort(),
      });
    });

  const supportByAgreement = new Map<string, number>();
  for (const group of groups) {
    if (group.coherentAgreementKey !== null) {
      supportByAgreement.set(
        group.coherentAgreementKey,
        (supportByAgreement.get(group.coherentAgreementKey) ?? 0) + 1,
      );
    }
  }
  const ranked = [...supportByAgreement.entries()]
    .sort(([leftKey, leftCount], [rightKey, rightCount]) => (
      rightCount - leftCount || leftKey.localeCompare(rightKey)
    ));
  const winningAgreementKey = ranked[0]?.[0] ?? null;
  const supportingProvenanceGroups = ranked[0]?.[1] ?? 0;
  const distinctProvenanceGroups = groups.length;
  const supportBasisPoints = distinctProvenanceGroups === 0
    ? 0
    : Math.floor((supportingProvenanceGroups * 10_000) / distinctProvenanceGroups);
  const countSatisfied = eligible.length >= policy.minimumAcceptedCount;
  const diversitySatisfied = distinctProvenanceGroups >= policy.minimumProvenanceGroups;
  const supportSatisfied = supportBasisPoints >= policy.minimumSupportBasisPoints;

  return Object.freeze({
    acceptedEligibleCount: eligible.length,
    distinctProvenanceGroups,
    winningAgreementKey,
    supportingProvenanceGroups,
    supportBasisPoints,
    countSatisfied,
    diversitySatisfied,
    supportSatisfied,
    sufficient: countSatisfied && diversitySatisfied && supportSatisfied,
    groups: Object.freeze(groups),
  });
}
