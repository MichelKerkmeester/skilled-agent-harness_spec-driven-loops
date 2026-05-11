'use strict';

const NODE_KINDS = {
  SESSION: 'SESSION',
  ROUND: 'ROUND',
  SEAT: 'SEAT',
  CLAIM: 'CLAIM',
  EVIDENCE: 'EVIDENCE',
  DISAGREEMENT: 'DISAGREEMENT',
  DECISION: 'DECISION',
  RECOMMENDATION: 'RECOMMENDATION',
};

function node(id, kind, options = {}) {
  return {
    id,
    kind,
    name: options.name ?? id,
    ...(options.roundId ? { roundId: options.roundId } : {}),
    ...(options.artifactPath ? { artifactPath: options.artifactPath } : {}),
    ...(options.metadata ? { metadata: options.metadata } : {}),
  };
}

function edge(id, from, to, kind, options = {}) {
  return {
    id,
    from,
    to,
    kind,
    ...(options.weight ? { weight: options.weight } : {}),
    ...(options.artifactPath ? { artifactPath: options.artifactPath } : {}),
    ...(options.metadata ? { metadata: options.metadata } : {}),
  };
}

function baseNodes(scenarioId, rounds = 3, seatIds = ['seatA', 'seatB', 'seatC']) {
  const nodes = [
    node('session', NODE_KINDS.SESSION, {
      name: `${scenarioId} council session`,
      artifactPath: 'ai-council/ai-council-state.jsonl',
    }),
  ];
  for (let index = 1; index <= rounds; index += 1) {
    nodes.push(node(`round-${index}`, NODE_KINDS.ROUND, { name: `Round ${index}`, roundId: `round-${index}` }));
  }
  for (const seatId of seatIds) {
    nodes.push(node(seatId, NODE_KINDS.SEAT, { name: seatName(seatId) }));
  }
  return nodes;
}

function seatName(seatId) {
  const suffix = seatId.replace(/^seat/, '');
  return `Seat ${suffix}`;
}

function deliberationFiles(scenarioId, count, contentFactory) {
  const files = {};
  for (let index = 1; index <= count; index += 1) {
    files[`ai-council/deliberations/${scenarioId.toLowerCase()}-deliberation-${String(index).padStart(2, '0')}.md`] =
      contentFactory(index);
  }
  return files;
}

function critiqueFiles(scenarioId, count, contentFactory) {
  const files = {};
  for (let index = 1; index <= count; index += 1) {
    files[`ai-council/critiques/${scenarioId.toLowerCase()}-critique-${String(index).padStart(2, '0')}.md`] =
      contentFactory(index);
  }
  return files;
}

function buildDac027() {
  const claims = Array.from({ length: 12 }, (_, index) =>
    node(`c${index + 1}`, NODE_KINDS.CLAIM, {
      name: `Round claim ${index + 1}`,
      roundId: `round-${Math.min(3, Math.floor(index / 4) + 1)}`,
    }));
  const disagreements = [
    node('d1', NODE_KINDS.DISAGREEMENT, { name: 'Critical unresolved architecture dissent', metadata: { severity: 'critical' } }),
    node('d2', NODE_KINDS.DISAGREEMENT, { name: 'Resolved deployment disagreement', metadata: { severity: 'medium' } }),
    node('d3', NODE_KINDS.DISAGREEMENT, { name: 'Critical unresolved security dissent', metadata: { severity: 'critical' } }),
    node('d4', NODE_KINDS.DISAGREEMENT, { name: 'Resolved rollout disagreement', metadata: { severity: 'medium' } }),
  ];
  const artifactTree = {
    ...deliberationFiles('DAC-027', 9, (index) =>
      `# DAC-027 deliberation ${index}\n\nDISAGREEMENT scan: d1 unresolved critical, d2 resolved, d3 unresolved critical, d4 resolved.\n`),
    ...critiqueFiles('DAC-027', 3, (index) =>
      `# DAC-027 critique ${index}\n\nDISAGREEMENT ledger confirms d1 and d3 remain unresolved critical items.\n`),
  };
  return scenario('DAC-027', {
    graphSeed: {
      nodes: [...baseNodes('DAC-027'), ...claims, ...disagreements],
      edges: [
        edge('resolve-d2', 'c11', 'd2', 'RESOLVES'),
        edge('resolve-d4', 'c12', 'd4', 'RESOLVES'),
      ],
    },
    artifactTree,
    baselineExpectedAnswer: ['d1', 'd3'],
    graphExpectedAnswer: ['d1', 'd3'],
    baselineMinFileReads: 12,
  });
}

function buildDac028() {
  const claims = Array.from({ length: 6 }, (_, index) =>
    node(`c${index + 1}`, NODE_KINDS.CLAIM, { name: `Plan B supporting claim ${index + 1}` }));
  const evidence = ['e1', 'e2', 'e3'].map((id, index) =>
    node(id, NODE_KINDS.EVIDENCE, { name: `Plan B evidence ${index + 1}` }));
  const artifactTree = {
    'ai-council/council-report.md': '# Council report\n\nPlan B / decB selected because e1, e2, e3 support the decision.\n',
    ...deliberationFiles('DAC-028', 9, (index) =>
      `# DAC-028 deliberation ${index}\n\nPlan B decB provenance cites e1 e2 e3 and Seat B.\n`),
    ...critiqueFiles('DAC-028', 3, (index) =>
      `# DAC-028 critique ${index}\n\nPlan B decB audit trail remains supported by evidence nodes e1, e2, e3.\n`),
  };
  return scenario('DAC-028', {
    graphSeed: {
      nodes: [
        ...baseNodes('DAC-028'),
        ...claims,
        ...evidence,
        node('decB', NODE_KINDS.DECISION, { name: 'Plan B chosen', metadata: { confidence: 0.84 } }),
        node('rec1', NODE_KINDS.RECOMMENDATION, { name: 'Recommend Plan B', metadata: { confidence: 0.86 } }),
      ],
      edges: [
        edge('e1-supports-decB', 'e1', 'decB', 'SUPPORTS'),
        edge('e2-supports-decB', 'e2', 'decB', 'SUPPORTS'),
        edge('e3-supports-decB', 'e3', 'decB', 'SUPPORTS'),
        edge('seatB-proposes-decB', 'seatB', 'decB', 'PROPOSES'),
        edge('seatB-supports-decB', 'seatB', 'decB', 'SUPPORTS'),
        edge('decB-recommends-rec1', 'decB', 'rec1', 'RECOMMENDS'),
      ],
    },
    artifactTree,
    baselineExpectedAnswer: { decisionId: 'decB', evidenceIds: ['e1', 'e2', 'e3'], seatId: 'seatB' },
    graphExpectedAnswer: { decisionId: 'decB', evidenceIds: ['e1', 'e2', 'e3'], seatId: 'seatB' },
    baselineMinFileReads: 12,
  });
}

function buildDac029() {
  return scenario('DAC-029', {
    graphSeed: {
      nodes: [
        ...baseNodes('DAC-029'),
        node('decX', NODE_KINDS.DECISION, { name: 'Plan X decision', metadata: { confidence: 0.82 } }),
        node('c1', NODE_KINDS.CLAIM, { name: 'Seat A endorses Plan X' }),
        node('c2', NODE_KINDS.CLAIM, { name: 'Seat B endorses Plan X' }),
        node('d1', NODE_KINDS.DISAGREEMENT, { name: 'Seat C critical security dissent', metadata: { severity: 'critical' } }),
      ],
      edges: [
        edge('seatA-agrees-decX', 'seatA', 'decX', 'AGREES_WITH'),
        edge('seatB-agrees-decX', 'seatB', 'decX', 'AGREES_WITH'),
        edge('c1-supports-decX', 'c1', 'decX', 'SUPPORTS'),
        edge('c2-supports-decX', 'c2', 'decX', 'SUPPORTS'),
        edge('d1-contradicts-decX', 'd1', 'decX', 'CONTRADICTS'),
      ],
    },
    artifactTree: {
      'ai-council/deliberations/dac-029-seat-tally.md':
        '# Seat tally\n\nSeat A endorses Plan X / decX. Seat B endorses Plan X / decX. Seat C records critical dissent d1.\n',
    },
    baselineExpectedAnswer: { wouldConverge: true, endorsements: 2 },
    graphExpectedAnswer: { decision: 'STOP_BLOCKED', criticalBlockerIds: ['d1'] },
    baselineMinFileReads: 1,
  });
}

function buildDac030() {
  const artifactTree = {
    'ai-council/council-report.md': '# Council report\n\nconvergence: false\nmax_rounds reached with blockers d1, d2, c5.\n',
    ...critiqueFiles('DAC-030', 6, (index) =>
      `# DAC-030 critique ${index}\n\ncritical disagreement d1, medium disagreement d2, and low evidence claim c5 remain blockers.\n`),
  };
  return scenario('DAC-030', {
    graphSeed: {
      nodes: [
        ...baseNodes('DAC-030', 4),
        node('decY', NODE_KINDS.DECISION, { name: 'Stalled decision', metadata: { confidence: 0.73 } }),
        node('c1', NODE_KINDS.CLAIM, { name: 'Security claim' }),
        node('c5', NODE_KINDS.CLAIM, { name: 'Low evidence tiebreaker claim' }),
        node('e1', NODE_KINDS.EVIDENCE, { name: 'Only evidence for c5' }),
        node('d1', NODE_KINDS.DISAGREEMENT, { name: 'Critical security disagreement', metadata: { severity: 'critical' } }),
        node('d2', NODE_KINDS.DISAGREEMENT, { name: 'Medium UX disagreement', metadata: { severity: 'medium' } }),
      ],
      edges: [
        edge('d1-contradicts-decY', 'd1', 'decY', 'CONTRADICTS'),
        edge('d2-contradicts-decY', 'd2', 'decY', 'CONTRADICTS'),
        edge('c1-supports-decY', 'c1', 'decY', 'SUPPORTS'),
        edge('e1-evidence-for-c5', 'e1', 'c5', 'EVIDENCE_FOR'),
      ],
    },
    artifactTree,
    baselineExpectedAnswer: { rankedBlockerIds: ['d1', 'd2', 'c5'], ranked: false },
    graphExpectedAnswer: { criticalIds: ['d1'], rankedBlockerIds: ['d1', 'd2', 'c5'] },
    baselineMinFileReads: 6,
  });
}

function buildDac031() {
  const hotSources = ['seatA', 'seatB', 'seatC', 'e1', 'e2', 'e3', 'decB'];
  const edges = [
    ...hotSources.map((sourceId, index) => edge(`hot-c1-${index + 1}`, sourceId, 'c1', index < 5 ? 'SUPPORTS' : 'CONTRADICTS')),
    ...hotSources.map((sourceId, index) => edge(`hot-decA-${index + 1}`, sourceId, 'decA', index < 4 ? 'SUPPORTS' : 'EVIDENCE_FOR')),
    ...hotSources.slice(0, 4).map((sourceId, index) => edge(`hot-c2-${index + 1}`, sourceId, 'c2', index < 3 ? 'SUPPORTS' : 'CONTRADICTS')),
  ];
  return scenario('DAC-031', {
    graphSeed: {
      nodes: [
        ...baseNodes('DAC-031', 4),
        ...['c1', 'c2', 'c3', 'c4', 'c5'].map((id) => node(id, NODE_KINDS.CLAIM, { name: `Claim ${id}` })),
        node('decA', NODE_KINDS.DECISION, { name: 'Decision A', metadata: { confidence: 0.79 } }),
        node('decB', NODE_KINDS.DECISION, { name: 'Decision B', metadata: { confidence: 0.71 } }),
        ...['e1', 'e2', 'e3'].map((id) => node(id, NODE_KINDS.EVIDENCE, { name: `Evidence ${id}` })),
      ],
      edges,
    },
    artifactTree: deliberationFiles('DAC-031', 8, (index) =>
      `# DAC-031 deliberation ${index}\n\nCross references: c1 c1 decA decA c2 ${index % 2 === 0 ? 'decB' : 'c3'}.\n`),
    baselineExpectedAnswer: ['c1', 'decA', 'c2'],
    graphExpectedAnswer: ['c1', 'decA', 'c2'],
    baselineMinFileReads: 8,
  });
}

function buildDac032() {
  const stateEvents = [
    { event: 'round_started', roundId: 'round-1', sessionId: 'dac-032-run-01' },
    { event: 'round_complete', roundId: 'round-1', sessionId: 'dac-032-run-01' },
    { event: 'round_started', roundId: 'round-2', sessionId: 'dac-032-run-01' },
    { event: 'round_complete', roundId: 'round-2', sessionId: 'dac-032-run-01' },
    { event: 'round_started', roundId: 'round-3', sessionId: 'dac-032-run-01' },
  ];
  return scenario('DAC-032', {
    graphSeed: {
      nodes: [
        node('session', NODE_KINDS.SESSION, { name: 'DAC-032 interrupted session' }),
        node('round-1', NODE_KINDS.ROUND, { name: 'Round 1', roundId: 'round-1' }),
        node('round-2', NODE_KINDS.ROUND, { name: 'Round 2', roundId: 'round-2' }),
        node('round-3', NODE_KINDS.ROUND, { name: 'Round 3 partial', roundId: 'round-3' }),
        ...['A', 'B', 'C'].map((seat) => node(`round-1-seat-${seat}`, NODE_KINDS.SEAT, { name: `Round 1 Seat ${seat}`, roundId: 'round-1' })),
        ...['A', 'B', 'C'].map((seat) => node(`round-2-seat-${seat}`, NODE_KINDS.SEAT, { name: `Round 2 Seat ${seat}`, roundId: 'round-2' })),
        node('round-3-seat-A', NODE_KINDS.SEAT, { name: 'Round 3 Seat A partial', roundId: 'round-3' }),
        node('c1', NODE_KINDS.CLAIM, { name: 'Round 1 claim', roundId: 'round-1' }),
        node('c2', NODE_KINDS.CLAIM, { name: 'Round 2 claim', roundId: 'round-2' }),
        node('dec1', NODE_KINDS.DECISION, { name: 'Round 1 decision', roundId: 'round-1', metadata: { confidence: 0.72 } }),
        node('dec2', NODE_KINDS.DECISION, { name: 'Round 2 decision', roundId: 'round-2', metadata: { confidence: 0.74 } }),
      ],
      edges: [
        edge('c1-supports-dec1', 'c1', 'dec1', 'SUPPORTS'),
        edge('c2-supports-dec2', 'c2', 'dec2', 'SUPPORTS'),
      ],
    },
    artifactTree: {
      'ai-council/ai-council-state.jsonl': `${stateEvents.map((event) => JSON.stringify(event)).join('\n')}\n`,
    },
    baselineExpectedAnswer: {
      startedRounds: 3,
      completedRounds: 2,
      councilComplete: false,
      interruptedRound: 'round-3',
    },
    graphExpectedAnswer: {
      recoveryMode: 'derived_replay',
      namespace: { specFolder: 'sandbox/dac-032', sessionId: 'dac-032-run-01' },
      counts: { rounds: 3, seats: 7, decisions: 2 },
      incomplete: true,
      ready: false,
    },
    baselineMinFileReads: 1,
  });
}

function scenario(scenarioId, partial) {
  const number = scenarioId.slice(4).toLowerCase();
  return {
    scenarioId,
    specFolder: `sandbox/dac-${number}`,
    sessionId: `dac-${number}-run-01`,
    ...partial,
  };
}

const BUILDERS = {
  'DAC-027': buildDac027,
  'DAC-028': buildDac028,
  'DAC-029': buildDac029,
  'DAC-030': buildDac030,
  'DAC-031': buildDac031,
  'DAC-032': buildDac032,
};

function getScenarioData(scenarioId) {
  const normalized = String(scenarioId).toUpperCase();
  const builder = BUILDERS[normalized];
  if (!builder) {
    throw new Error(`Unknown council value scenario: ${scenarioId}`);
  }
  return builder();
}

function listScenarioIds() {
  return Object.keys(BUILDERS);
}

module.exports = {
  getScenarioData,
  listScenarioIds,
};
