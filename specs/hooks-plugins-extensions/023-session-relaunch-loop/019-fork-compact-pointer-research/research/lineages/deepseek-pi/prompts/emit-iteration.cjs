// ───────────────────────────────────────────────────────────────────
// MODULE: lineage iteration emitter
// ───────────────────────────────────────────────────────────────────
// Writes one iteration's delta stream and the single-record event file the
// append gateway parses. Both artifacts carry the same record, so the ledger
// row and the reducer's delta view can never disagree about an iteration.
// ───────────────────────────────────────────────────────────────────

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RUN_ID = 'fanout-deepseek-pi-1792608380069-rdh5rh';

function main() {
  const [specPath] = process.argv.slice(2);
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const iteration = Number(spec.iteration);
  const findings = Array.isArray(spec.findings) ? spec.findings : [];
  const ruledOut = Array.isArray(spec.ruledOut) ? spec.ruledOut : [];

  const record = {
    type: 'iteration',
    iteration,
    runId: RUN_ID,
    sessionId: RUN_ID,
    lineageId: RUN_ID,
    mode: 'research',
    target_agent: 'deep-research',
    agent_definition_loaded: true,
    resolved_route: 'Resolved route: mode=research target_agent=deep-research',
    newInfoRatio: Number(spec.newInfoRatio),
    status: spec.status,
    focus: spec.focus,
    findingsCount: findings.length,
    keyFindings: findings.map((entry) => entry.label),
    answeredQuestions: spec.answeredQuestions || [],
    timestamp: spec.timestamp,
  };
  if (ruledOut.length > 0) record.ruledOut = ruledOut.map((entry) => entry.direction);

  const lines = [JSON.stringify(record)];
  for (const entry of findings) {
    lines.push(JSON.stringify({
      type: 'finding',
      id: entry.id,
      label: entry.label,
      iteration,
      sources: entry.sources,
    }));
  }
  for (const entry of ruledOut) {
    lines.push(JSON.stringify({
      type: 'ruled_out',
      direction: entry.direction,
      reason: entry.reason,
      iteration,
    }));
  }

  const pad = String(iteration).padStart(3, '0');
  const outDir = spec.outDir;
  fs.writeFileSync(path.join(outDir, 'deltas', `iter-${pad}.jsonl`), `${lines.join('\n')}\n`);
  fs.writeFileSync(path.join(outDir, 'prompts', 'events', `iter-${pad}.json`), JSON.stringify(record));
  process.stdout.write(`iteration ${iteration}: ${lines.length} delta rows, ${findings.length} findings\n`);
}

main();
