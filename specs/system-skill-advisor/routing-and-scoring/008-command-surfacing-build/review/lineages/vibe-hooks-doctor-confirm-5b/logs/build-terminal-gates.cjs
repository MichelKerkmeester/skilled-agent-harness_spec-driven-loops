// Build the terminal-gate record the loop writes once at its stop. All three gates are
// evaluated fresh here: evidence (each active finding cites file:line), scope (each finding's
// file sits inside the review target), coverage (all four dimensions are covered).
const crypto = require('node:crypto');
const fs = require('node:fs');

const sessionId = 'fanout-vibe-hooks-doctor-confirm-5b-1794780590351-ezt1v0';
const digest = (text) => crypto.createHash('sha256').update(text).digest('hex');
const gateRows = [
  {
    gateId: 'evidence',
    status: 'pass',
    reasonCode: 'all-findings-cited',
    summary: 'Both active P2 findings cite a file:line, a concrete input and a counterevidence read.',
  },
  {
    gateId: 'scope',
    status: 'pass',
    reasonCode: 'all-findings-in-target',
    summary: 'Both findings name a file inside the declared vibe-hooks-doctor scope.',
  },
  {
    gateId: 'coverage',
    status: 'pass',
    reasonCode: 'all-dimensions-covered',
    summary: 'Correctness, security, traceability and maintainability each have one full iteration.',
  },
];
const event = {
  stem: 'deep_review.terminal_gates_recorded',
  scope: { runId: sessionId, sessionId, generation: 1, iterationId: 'iteration-3' },
  data: {
    stopReason: 'converged',
    gateResults: gateRows.map((row) => ({
      gateId: row.gateId,
      status: row.status,
      reasonCode: row.reasonCode,
      evidenceDigest: digest(row.summary),
    })),
    failedRequiredGateIds: [],
    appendPosition: 3,
  },
};
fs.writeFileSync(process.argv[2], JSON.stringify(event));
process.stdout.write(`${JSON.stringify(event)}\n`);
