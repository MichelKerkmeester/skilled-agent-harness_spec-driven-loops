#!/usr/bin/env node
'use strict';
// Builds the per-iteration delta and the single-record gateway payload from the
// iteration narrative, so the finding text, the keyFindings entries and the delta
// rows can never drift apart. Writes only inside the lineage directory.
const fs = require('node:fs');
const path = require('node:path');

const [lineage, iterationArg, configPath] = process.argv.slice(2);
const iteration = Number(iterationArg);
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const pad = (n) => String(n).padStart(3, '0');
const narrativePath = path.join(lineage, 'iterations', `iteration-${pad(iteration)}.md`);
const lines = fs.readFileSync(narrativePath, 'utf8').split(/\r?\n/);

function section(name) {
  const start = lines.findIndex((line) => new RegExp(`^##\\s+${name}\\s*$`).test(line.trim()));
  if (start < 0) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i].trim())) break;
    out.push(lines[i]);
  }
  return out;
}

const findings = section('Findings')
  .map((line) => line.match(/^\d+\.\s+(.+)$/))
  .filter(Boolean)
  .map((match) => match[1].trim());

const sessionId = 'fanout-pi-max-1794087510790-zecq2g';
const stamp = new Date().toISOString();
const findingId = (index) => `f-iter${pad(iteration)}-${String(index + 1).padStart(3, '0')}`;

const record = {
  type: 'iteration',
  iteration,
  run: iteration,
  runId: sessionId,
  sessionId,
  lineageId: sessionId,
  generation: 1,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  newInfoRatio: config.newInfoRatio,
  status: config.status,
  focus: config.focus,
  findingsCount: findings.length,
  noveltyJustification: config.noveltyJustification,
  keyQuestions: config.keyQuestions || [],
  answeredQuestions: config.answeredQuestions || [],
  keyFindings: findings.map((text, index) => ({ id: findingId(index), text })),
  ruledOut: config.ruledOut || [],
  edgeCase: config.edgeCase || 'none',
  focusTrack: config.focusTrack,
  toolsUsed: config.toolsUsed || ['Read', 'Bash', 'Grep'],
  sourcesQueried: config.sourcesQueried || [],
  timestamp: stamp,
  durationMs: config.durationMs || 0,
};

fs.writeFileSync(path.join(lineage, 'prompts', `iteration-${pad(iteration)}-record.json`), JSON.stringify(record), 'utf8');

const deltaLines = [JSON.stringify(record)];
findings.forEach((text, index) => {
  deltaLines.push(JSON.stringify({
    type: 'finding',
    id: findingId(index),
    severity: config.severity || 'P1',
    label: text,
    iteration,
    sources: config.findingSources && config.findingSources[index]
      ? config.findingSources[index]
      : (config.findingSources && config.findingSources.default) || [],
  }));
});
fs.writeFileSync(path.join(lineage, 'deltas', `iter-${pad(iteration)}.jsonl`), `${deltaLines.join('\n')}\n`, 'utf8');
process.stdout.write(`iteration=${iteration} findings=${findings.length}\n`);
