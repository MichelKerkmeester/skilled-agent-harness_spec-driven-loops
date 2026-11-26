import { readFileSync, writeFileSync } from 'node:fs';

const L = 'specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2';
const D = 'specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers';
const ts = readFileSync(`${L}/state-events/iter-004-ts.txt`, 'utf8').trim();

const record = {
  type: 'iteration',
  iteration: 4,
  run: 4,
  mode: 'review',
  target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  status: 'complete',
  focus: 'security',
  dimensions: ['security'],
  filesReviewed: [
    '.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1537',
    '.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:382',
    '.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1503',
    '.skilled/skills/system-skill-advisor/runtime/lib/render.ts:250',
    '.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:1',
    '.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts:152',
    `${D}/spec.md:240`,
    `${D}/acceptance-criteria.md:92`,
  ],
  findingsCount: 0,
  findingsSummary: { P0: 0, P1: 0, P2: 0 },
  findingsNew: { P0: 0, P1: 0, P2: 0 },
  findingDetails: [],
  traceabilityChecks: {
    summary: { required: 2, executed: 2, pass: 1, partial: 1, fail: 0, blocked: 0, notApplicable: 0, gatingFailures: 0 },
    results: [
      { protocolId: 'spec_code', status: 'partial', gateClass: 'hard', applicable: true, evidence: ['.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489', '.skilled/skills/system-skill-advisor/runtime/lib/render.ts:250'], summary: 'REQ-028 and REQ-038 hold; no other requirement mapped this iteration' },
      { protocolId: 'checklist_evidence', status: 'partial', gateClass: 'hard', applicable: true, evidence: [`${D}/acceptance-criteria.md:92`], summary: 'AC-035 and AC-047 re-read against the tree and both hold' },
    ],
  },
  newFindingsRatio: 0.0,
  noveltyJustification: 'No new findings: the security slice exercised four boundaries and every one failed closed. The ratio is 0.0 by contract because the iteration found nothing; the absence is supported by the probe output recorded in the narrative, not by skipping the slice.',
  sessionId: 'fanout-deepseek-max-2-1795544069299-46zw3s',
  generation: 6,
  lineageMode: 'new',
  timestamp: ts,
  durationMs: 300000,
  graphEvents: [
    { type: 'node', id: 'dimension:security', kind: 'DIMENSION', label: 'security' },
    { type: 'node', id: 'evidence:security-probe', kind: 'EVIDENCE', label: 'seven malformed routes, three hostile command strings, four long prompts' },
    { type: 'edge', id: 'evidence:security-probe->dimension:security', source: 'evidence:security-probe', target: 'dimension:security', relation: 'EVIDENCE_FOR' },
  ],
};

writeFileSync(`${L}/state-events/iter-004-record.json`, `${JSON.stringify(record)}\n`);
const delta = [JSON.stringify(record)];
delta.push(JSON.stringify({ type: 'classification', detail: 'Security slice clean: malformed compiled routes, prototype-named skill ids, hostile supplied command strings, argv exposure and long-prompt cost all fail closed or are absent.', iteration: 4 }));
delta.push(JSON.stringify({ type: 'traceability_check', protocolId: 'spec_code', status: 'partial', iteration: 4, evidence: 'skill-advisor-cli.ts:1489; render.ts:250' }));
delta.push(JSON.stringify({ type: 'ruled_out', direction: 'Prototype pollution through a compiled route', reason: 'own-key lookups on the route and both command tables; six malformed shapes returned no command', iteration: 4 }));
delta.push(JSON.stringify({ type: 'ruled_out', direction: 'Command injection through a degraded row supplied string', reason: 'three hostile strings dropped; only a tracked command owned by the row skill prints', iteration: 4 }));
delta.push(JSON.stringify({ type: 'ruled_out', direction: 'ReDoS through the loop-ask grammar', reason: 'worst measured 6.3 ms on a 38,000-character prompt; every prefix read bounded at 400 characters', iteration: 4 }));
writeFileSync(`${L}/deltas/iter-004.jsonl`, `${delta.join('\n')}\n`);
console.log('built iteration 4', ts);
