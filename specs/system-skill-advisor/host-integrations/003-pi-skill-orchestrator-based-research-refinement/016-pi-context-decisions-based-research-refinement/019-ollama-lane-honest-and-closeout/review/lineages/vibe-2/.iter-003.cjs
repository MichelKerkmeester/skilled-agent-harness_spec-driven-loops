// Iteration 3 record + non-anchored strategy prose. Run: node .iter-003.cjs <artifactDir>
// The reducer owns the ANCHOR blocks (dimensions, counts, exhausted approaches, next focus),
// so this script only appends to the prose sections outside those anchors.
const fs = require('fs');
const path = require('path');

const L = process.argv[2];
const p = path.join(L, 'deep-review-strategy.md');
let s = fs.readFileSync(p, 'utf8');

function appendAfter(anchor, addition) {
  if (!s.includes(anchor)) throw new Error(`strategy anchor missing: ${anchor.slice(0, 60)}`);
  s = s.replace(anchor, anchor + addition);
}

appendAfter(
  '- Counting the corpus on disk before accepting a published row count: 196 rows confirmed one claim and exposed the 193 in the same section (iteration 2).',
  '\n- Reading the adapter error constructors before judging a logging concern: it proved the base URL is embedded verbatim and bounded the finding (iteration 3).',
);

appendAfter(
  '- The doctor route failing on a zero lane weight: the asset forbids it (iteration 2, evidence: doctor-skill-advisor-embedder.yaml:149).',
  '\n- The child environment allowlist leaking secrets: it is a closed allowlist with no credential-shaped key (iteration 3, evidence: system-skill-advisor-launcher.cjs:120-200).\n- Unbounded in-flight requests after the 750 ms deadline: the adapter aborts its own fetch (iteration 3, evidence: shared/embeddings/adapters/ollama.ts:142-145).\n- A race on the module-level prompt embedding: the set, run and clear share one microtask (iteration 3, evidence: semantic-shadow.ts:236-252).',
);

if (s.includes('| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |')) {
  s = s.replace(
    '| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |',
    '| `skill_agent` | overlay | pending | - | Queued for iteration 4. |',
  );
}

appendAfter(
  '| .skilled/bin/system-skill-advisor-launcher.cjs | D1 | 2 | 0 P0, 0 P1, 1 P2 | partial |',
  '\n| runtime/lib/scorer/lanes/semantic-shadow.ts | D1, D2 | 1, 3 | 0 P0, 1 P1, 4 P2 | partial |',
);

fs.writeFileSync(p, s);

const rec = {
  type: 'iteration',
  iteration: 3,
  mode: 'review',
  target_agent: 'deep-review',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=review target_agent=deep-review',
  run: 'fanout-vibe-2-1795172940208-84a42n',
  status: 'complete',
  focus: 'Frontier node F-1-002: security',
  frontierNodeId: 'F-1-002',
  dimensions: ['security'],
  filesReviewed: [
    '.skilled/bin/system-skill-advisor-launcher.cjs:120',
    '.skilled/bin/system-skill-advisor-launcher.cjs:326',
    '.skilled/bin/system-skill-advisor-launcher.cjs:184',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:245',
    '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:236',
    '.skilled/skills/system-skill-advisor/runtime/lib/embedders/adapters/ollama.ts:1',
    '.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:66',
    '.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:142',
    '.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:592',
    '.github/workflows/skill-advisor-stress.yml:49',
    '.env.example:409',
  ],
  findingsCount: 1,
  findingsSummary: { P0: 0, P1: 0, P2: 1 },
  findingsNew: ['R3-P2-001'],
  findingDetails: [
    {
      id: 'R3-P2-001',
      severity: 'P2',
      title: 'The lane logs the adapter raw error message, which embeds the configured base URL verbatim',
      file: '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:245',
      dimension: 'security',
      findingClass: 'security',
      scopeProof: 'Logging call in the declared target; reach is the production branch plus an operator-set OLLAMA_BASE_URL the launcher forwards.',
      affectedSurfaceHints: ['daemon stdout', 'launcher-captured log file', 'OLLAMA_BASE_URL operator configuration', 'support bundles'],
    },
  ],
  traceabilityChecks: {
    results: [
      {
        protocolId: 'spec_code',
        status: 'partial',
        gateClass: 'hard',
        applicable: true,
        evidence: [
          '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:245',
          '.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:66',
        ],
        summary: 'The lane log line carries the base URL the adapter embeds in its error message.',
      },
      {
        protocolId: 'checklist_evidence',
        status: 'notApplicable',
        gateClass: 'hard',
        applicable: false,
        evidence: [],
        summary: 'Files target with no checklist to reconcile.',
      },
    ],
  },
  newFindingsRatio: 1.0,
  noveltyJustification: 'One new finding: the credential-bearing base URL reaches the log through the raw adapter message. Weighted new 1 over weighted total 1.',
  sessionId: 'fanout-vibe-2-1795172940208-84a42n',
  generation: 1,
  lineageMode: 'new',
  timestamp: new Date().toISOString(),
  durationMs: 0,
  reviewDepthSchemaVersion: 2,
  reviewDepthApplicability: {
    scopeClass: 'complex',
    enforcement: 'strict',
    reason: 'Trust boundary across a launcher child environment, a network adapter and a logging sink.',
    evidenceRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:245'],
  },
  targetSelection: {
    selectedTargets: [
      '.skilled/bin/system-skill-advisor-launcher.cjs',
      '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts',
      '.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts',
      '.github/workflows/skill-advisor-stress.yml',
      '.env.example',
    ],
    selectionReason: 'Frontier node F-1-002 scope plus the launcher and adapter surfaces the OLLAMA_* passthrough touches.',
    discoveryMethods: ['direct_read', 'exact_search', 'frontier_scope'],
    omittedHighRiskTargets: [],
    graphStatus: 'unavailable',
    semanticSearchStatus: 'unavailable',
    evidenceRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:245'],
  },
  searchCoverage: {
    requiredBugClasses: ['secret_exposure', 'resource_exhaustion', 'race_condition', 'env_leak'],
    covered: ['secret_exposure'],
    ruledOut: ['resource_exhaustion', 'race_condition', 'env_leak'],
    deferred: [],
    blocked: [],
    graphCoverageMode: 'graphless_fallback',
  },
  searchLedger: [
    {
      id: 'SL-010',
      dimension: 'security',
      targetRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts'],
      bugClass: 'secret_exposure',
      hypothesis: 'The lane logs the adapter error message, which embeds OLLAMA_BASE_URL.',
      searchActions: [
        { method: 'direct_read', queryOrPath: 'semantic-shadow.ts:245', result: 'console.warn interpolates error.message', evidenceRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:245'] },
        { method: 'direct_read', queryOrPath: 'shared/embeddings/adapters/ollama.ts:63-77', result: 'message is Ollama backend unreachable at baseUrl', evidenceRefs: ['.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:66'] },
      ],
      disposition: 'finding',
      rationale: 'Confirmed by the error constructor and the log line.',
      linkedFindingId: 'R3-P2-001',
    },
    {
      id: 'SL-011',
      dimension: 'security',
      targetRefs: ['.skilled/bin/system-skill-advisor-launcher.cjs'],
      bugClass: 'env_leak',
      hypothesis: 'The child environment allowlist forwards secrets.',
      searchActions: [
        { method: 'exact_search', queryOrPath: 'key|token|secret|password|auth|credential over lines 120-200', result: 'only comments about routing flags', evidenceRefs: ['.skilled/bin/system-skill-advisor-launcher.cjs:120'] },
      ],
      disposition: 'ruled_out',
      rationale: 'Closed allowlist with no credential-shaped key.',
      ruledOutReason: 'No secret key appears in the allowlist.',
    },
    {
      id: 'SL-012',
      dimension: 'security',
      targetRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts'],
      bugClass: 'resource_exhaustion',
      hypothesis: 'The 750 ms deadline leaves unbounded pending requests.',
      searchActions: [
        { method: 'direct_read', queryOrPath: 'shared/embeddings/adapters/ollama.ts:142-145', result: 'fetchWithTimeout aborts via AbortController', evidenceRefs: ['.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:142'] },
      ],
      disposition: 'ruled_out',
      rationale: 'The adapter bounds and aborts its own request.',
      ruledOutReason: 'AbortController signal passed to fetch.',
    },
    {
      id: 'SL-013',
      dimension: 'security',
      targetRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts'],
      bugClass: 'race_condition',
      hypothesis: 'Concurrent recommend calls race on the module-level prompt embedding.',
      searchActions: [
        { method: 'direct_read', queryOrPath: 'semantic-shadow.ts:236-252', result: 'set, synchronous run and finally clear share one microtask', evidenceRefs: ['.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:236'] },
      ],
      disposition: 'ruled_out',
      rationale: 'No await between set and clear.',
      ruledOutReason: 'The window is synchronous.',
    },
  ],
  graphEvents: [
    { type: 'node', id: 'FILE-launcher', kind: 'FILE', label: 'system-skill-advisor-launcher.cjs' },
    { type: 'node', id: 'FINDING-R3-P2-001', kind: 'FINDING', label: 'Base URL reaches the log' },
    { type: 'edge', id: 'E5', source: 'FINDING-R3-P2-001', target: 'FILE-semantic-shadow', relation: 'IN_FILE' },
  ],
};

fs.writeFileSync(path.join(L, '.iter-003-event.json'), JSON.stringify(rec));
console.log('strategy+record ok');
