'use strict';

// Builds one iteration's event record and delta stream from a payload file.
// Keeping the payload as JSON avoids shell quoting damage to finding text.

const fs = require('node:fs');
const path = require('node:path');

const [runDirectory, payloadPath] = process.argv.slice(2);
if (!runDirectory || !payloadPath) {
  throw new Error('usage: write-iteration.cjs <run-directory> <payload-json>');
}

const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
const config = JSON.parse(
  fs.readFileSync(path.join(runDirectory, 'deep-research-config.json'), 'utf8'),
);
const sessionId = config.lineage.sessionId;
const iteration = payload.iteration;
const pad = String(iteration).padStart(3, '0');

const record = {
  type: 'iteration',
  iteration,
  run: iteration,
  runId: sessionId,
  sessionId,
  lineageId: sessionId,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  status: payload.status,
  focus: payload.focus,
  findingsCount: payload.findings.length,
  newInfoRatio: payload.newInfoRatio,
  noveltyJustification: payload.noveltyJustification,
  keyQuestions: payload.keyQuestions,
  answeredQuestions: payload.answeredQuestions,
  ruledOut: payload.ruledOut,
  focusTrack: payload.focusTrack,
  edgeCase: payload.edgeCase,
  toolsUsed: payload.toolsUsed,
  sourcesQueried: payload.sourcesQueried,
  timestamp: new Date().toISOString(),
  durationMs: payload.durationMs ?? 0,
  graphEvents: payload.graphEvents ?? [],
};

const lines = [JSON.stringify(record)];
payload.findings.forEach((finding, index) => {
  lines.push(JSON.stringify({
    type: 'finding',
    id: `f-iter${pad}-${String(index + 1).padStart(3, '0')}`,
    label: finding.label,
    iteration,
    sources: finding.sources,
  }));
});
for (const ruled of payload.ruledOutDetailed ?? []) {
  lines.push(JSON.stringify({ type: 'ruled_out', direction: ruled.direction, reason: ruled.reason, iteration }));
}

fs.writeFileSync(
  path.join(runDirectory, 'prompts', `iteration-${iteration}-event.json`),
  JSON.stringify(record),
);
fs.writeFileSync(
  path.join(runDirectory, 'deltas', `iter-${pad}.jsonl`),
  `${lines.join('\n')}\n`,
);
process.stdout.write(`iteration ${iteration}: ${payload.findings.length} findings, ${lines.length} delta rows\n`);
