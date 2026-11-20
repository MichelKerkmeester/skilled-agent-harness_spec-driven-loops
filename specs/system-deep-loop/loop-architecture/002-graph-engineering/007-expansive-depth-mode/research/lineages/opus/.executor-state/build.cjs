// Lineage-local helper: turns a compact iteration spec module into spec-NNN.json,
// adding graph events (FINDING and SOURCE nodes, CITES edges, ANSWERS edges to answered nodes).
const fs = require('fs');
const path = require('path');

const [modPath, L] = process.argv.slice(2);
const mod = require(path.resolve(modPath));
const nodes = new Map();
for (const line of fs.readFileSync(path.join(L, 'frontier-nodes.jsonl'), 'utf8').split('\n').filter(Boolean)) {
  const row = JSON.parse(line);
  if (row.question) nodes.set(row.nodeId, row.question);
}
const focus = fs.readFileSync(path.join(L, 'frontier-focus.txt'), 'utf8').trim();
const n = mod.iteration;
const NNN = String(n).padStart(3, '0');
const graphEvents = [];
const sourceIds = new Map();
mod.findings.forEach((finding, index) => {
  const fid = `opus-i${NNN}-f${index + 1}`;
  graphEvents.push({ type: 'node', id: fid, kind: 'FINDING', label: finding.label.slice(0, 120) });
  for (const source of finding.sources) {
    if (!sourceIds.has(source)) {
      const sid = `opus-src-${Buffer.from(source).toString('base64url').slice(-24)}`;
      sourceIds.set(source, sid);
      const node = { type: 'node', id: sid, kind: 'SOURCE', label: source.slice(-120) };
      if (!/^https?:/.test(source)) node.path = source;
      graphEvents.push(node);
    }
    graphEvents.push({ type: 'edge', id: `${fid}-cites-${sourceIds.get(source)}`, source: fid, target: sourceIds.get(source), relation: 'CITES' });
  }
  for (const nodeId of mod.answeredNodes || []) {
    graphEvents.push({ type: 'edge', id: `${fid}-answers-${nodeId}`, source: fid, target: `frontier-${nodeId}`, relation: 'ANSWERS' });
  }
});
const spec = {
  iteration: n,
  status: mod.status || 'complete',
  focus,
  newInfoRatio: mod.newInfoRatio,
  noveltyJustification: mod.noveltyJustification,
  keyQuestions: (mod.keyNodes || []).map((id) => nodes.get(id)),
  answeredQuestions: (mod.answeredNodes || []).map((id) => nodes.get(id)),
  ruledOut: mod.ruledOut || [],
  focusTrack: mod.focusTrack,
  edgeCase: mod.edgeCase || 'none',
  toolsUsed: mod.toolsUsed,
  sourcesQueried: mod.sourcesQueried,
  graphEvents,
  findings: mod.findings,
  proposals: mod.proposals || [],
};
if (spec.keyQuestions.some((q) => !q) || spec.answeredQuestions.some((q) => !q)) throw new Error('unknown node id');
fs.writeFileSync(path.join(L, '.executor-state', `spec-${NNN}.json`), JSON.stringify(spec, null, 1));
console.log(JSON.stringify({ spec: `spec-${NNN}.json`, findings: spec.findings.length, graphEvents: graphEvents.length, answered: spec.answeredQuestions.length }));
