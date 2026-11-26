import { readFileSync, writeFileSync } from 'node:fs';

const L = 'specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2';
const D = 'specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers';
const ts = readFileSync(`${L}/state-events/iter-007-ts.txt`, 'utf8').trim();

const record = {
  type: 'iteration',
  iteration: 7,
  run: 7,
  mode: 'review',
  target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  status: 'complete',
  focus: 'traceability',
  dimensions: ['traceability'],
  filesReviewed: [
    `${D}/acceptance-criteria.md:49`,
    `${D}/spec.md:199`,
    `${D}/tasks.md:226`,
    `${D}/decision-record.md:33`,
    `${D}/decision-record.md:412`,
    `${D}/decision-record.md:508`,
    '.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1',
    '.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2579',
  ],
  findingsCount: 0,
  findingsSummary: { P0: 0, P1: 0, P2: 0 },
  findingsNew: { P0: 0, P1: 0, P2: 0 },
  findingDetails: [],
  traceabilityChecks: {
    summary: { required: 2, executed: 2, pass: 0, partial: 2, fail: 0, blocked: 0, notApplicable: 0, gatingFailures: 0 },
    results: [
      { protocolId: 'spec_code', status: 'partial', gateClass: 'hard', applicable: true, evidence: [`${D}/scratch/probes/results-after.json:1`, '.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:81', `${D}/decision-record.md:33`], summary: 'executed over REQ-001..REQ-046: forty-four hold, REQ-012 and REQ-031 do not' },
      { protocolId: 'checklist_evidence', status: 'partial', gateClass: 'hard', applicable: true, evidence: [`${D}/acceptance-criteria.md:66`, `${D}/acceptance-criteria.md:95`, `${D}/acceptance-criteria.md:101`], summary: 'executed over all 54 rows: thirty-eight hold, sixteen do not (seven anchor drift, nine stale counts or overstated coverage)' },
      { protocolId: 'skill_agent', status: 'notApplicable', gateClass: 'advisory', applicable: false, evidence: [], summary: 'the target claims no skill-owned agent definition' },
      { protocolId: 'agent_cross_runtime', status: 'notApplicable', gateClass: 'advisory', applicable: false, evidence: [], summary: 'no agent definition is claimed by the requirements' },
      { protocolId: 'feature_catalog_code', status: 'notApplicable', gateClass: 'advisory', applicable: false, evidence: [], summary: 'no feature-catalog entry is claimed' },
      { protocolId: 'playbook_capability', status: 'notApplicable', gateClass: 'advisory', applicable: false, evidence: [], summary: 'no playbook capability is claimed' },
    ],
  },
  newFindingsRatio: 0.0,
  noveltyJustification: 'No new findings: the final pass re-read the same cells and confirmed the counts recorded earlier in the run, correcting the cell count from fourteen to sixteen without raising a new finding. The ratio is 0.0 by contract because nothing new was found.',
  sessionId: 'fanout-deepseek-max-2-1795544069299-46zw3s',
  generation: 6,
  lineageMode: 'new',
  timestamp: ts,
  durationMs: 300000,
  graphEvents: [
    { type: 'node', id: 'evidence:traceability-final', kind: 'EVIDENCE', label: 'core protocols executed over the full requirement and acceptance tables' },
    { type: 'node', id: 'dimension:traceability', kind: 'DIMENSION', label: 'traceability' },
    { type: 'edge', id: 'evidence:traceability-final->dimension:traceability', source: 'evidence:traceability-final', target: 'dimension:traceability', relation: 'EVIDENCE_FOR' },
  ],
};

writeFileSync(`${L}/state-events/iter-007-record.json`, `${JSON.stringify(record)}\n`);
const delta = [JSON.stringify(record)];
delta.push(JSON.stringify({ type: 'classification', detail: 'Final pass: both core protocols executed over the complete tables; sixteen acceptance cells and two requirement texts fail, everything else holds.', iteration: 7 }));
delta.push(JSON.stringify({ type: 'traceability_check', protocolId: 'spec_code', status: 'partial', iteration: 7, evidence: 'spec.md:199; results-after.json:1; deep-loop-offer-cases.vitest.ts:81; decision-record.md:33' }));
delta.push(JSON.stringify({ type: 'traceability_check', protocolId: 'checklist_evidence', status: 'partial', iteration: 7, evidence: 'acceptance-criteria.md:66,95,101' }));
delta.push(JSON.stringify({ type: 'ruled_out', direction: 'A behaviour defect behind the documentation findings', reason: 'every failing cell was cross-checked against the code it describes and the code holds in each case', iteration: 7 }));
writeFileSync(`${L}/deltas/iter-007.jsonl`, `${delta.join('\n')}\n`);
console.log('built iteration 7', ts);
