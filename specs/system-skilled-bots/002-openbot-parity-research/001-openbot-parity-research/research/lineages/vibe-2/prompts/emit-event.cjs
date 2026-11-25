// Builds prompts/iter-NNN-event.json (the single canonical iteration record) from a spec file.
// Usage: node prompts/emit-event.cjs <artifactDir> <iteration> <specJsonPath>
const fs = require('node:fs');
const path = require('node:path');

const [art, iterArg, specPath] = process.argv.slice(2);
const iteration = Number(iterArg);
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const focus = fs.readFileSync(path.join(art, 'frontier-focus.txt'), 'utf8').trim();
const sessionId = 'fanout-vibe-2-1795547239490-2piovn';

const rec = {
  type: 'iteration',
  iteration,
  runId: sessionId,
  sessionId,
  lineageId: sessionId,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  run: iteration,
  status: spec.status,
  focus,
  findingsCount: spec.findingsCount,
  newInfoRatio: spec.newInfoRatio,
  noveltyJustification: spec.noveltyJustification,
  keyQuestions: spec.keyQuestions,
  answeredQuestions: spec.answeredQuestions,
  ruledOut: spec.ruledOut || [],
  focusTrack: spec.focusTrack || 'apps-and-computer',
  edgeCase: spec.edgeCase || 'none',
  toolsUsed: spec.toolsUsed || ['Read', 'Grep', 'Bash'],
  sourcesQueried: spec.sourcesQueried || [],
  graphEvents: spec.graphEvents || [],
};
const out = path.join(art, `prompts/iter-${String(iteration).padStart(3, '0')}-event.json`);
fs.writeFileSync(out, JSON.stringify(rec));
console.log(`wrote ${out}`);
