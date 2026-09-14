// Lineage-internal dashboard generator: reads state log + registry + strategy, writes deep-research-dashboard.md.
// Writes ONLY inside the lineage directory.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const stateLog = join(root, 'deep-research-state.jsonl');
const registry = JSON.parse(readFileSync(join(root, 'findings-registry.json'), 'utf8'));
const strategy = readFileSync(join(root, 'deep-research-strategy.md'), 'utf8');

// The projected state log drops focus/findingsCount; enrich from the deltas, which carry the
// full iteration records.
const deltaDir = join(root, 'deltas');
const deltaIters = new Map();
for (const name of readdirSync(deltaDir).filter((n) => /^iter-\d+\.jsonl$/.test(n))) {
  for (const line of readFileSync(join(deltaDir, name), 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)) {
    const rec = JSON.parse(line);
    if (rec.type === 'iteration') deltaIters.set(Number(rec.iteration), rec);
  }
}

const records = existsSync(stateLog)
  ? readFileSync(stateLog, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((l) => JSON.parse(l))
  : [];
const iterations = records.filter((r) => r.type === 'iteration').map((r) => ({ ...r, ...(deltaIters.get(Number(r.iteration)) ?? {}) }));

const rows = iterations.map((r) => `| ${r.iteration} | ${String(r.focus ?? '').slice(0, 48)} | ${r.newInfoRatio} | ${r.status} |`);
const ratios = iterations.map((r) => r.newInfoRatio);
const trend = ratios.slice(-3).join(' -> ');
const answered = registry.resolvedQuestions ?? [];
const open = registry.openQuestions ?? [];
const deadEnds = (registry.ruledOutDirections ?? []).map((r) => `- ${r.approach} (iteration ${r.iteration})`).join('\n');
const nextFocus = (strategy.match(/## 11\. NEXT FOCUS\n\n([\s\S]*?)(?=\n## 12\.)/) || [])[1]?.trim() ?? 'none';

const out = `# Deep Research Dashboard — lineage deepseek

Lineage: \`deepseek\` (cli-devin / deepseek-v4-flash-max) · Spec: 071-cli-hermes-creation/001-deep-research
Session: \`fanout-deepseek-1789402663119-cvvtf8\` · Stop policy: max-iterations (10)

## Iteration Table

| run | focus | newInfoRatio | status |
|-----|-------|--------------|--------|
${rows.join('\n')}

## Question Status

${answered.length}/${answered.length + open.length} answered.

Answered: ${answered.map((q) => q.id).join(', ') || 'none'}.
Remaining: ${open.map((q) => q.id).join(', ') || 'none'}.

## Convergence Trend

Last 3 newInfoRatio values: ${trend}.
Threshold: 0.05 (telemetry only under max-iterations policy).

## Dead Ends

${deadEnds || 'None.'}

## Blocked Stops

None.

## Graph Convergence

No graph events persisted (iteration records carried no graphEvents).

## Next Focus

${nextFocus}
`;
writeFileSync(join(root, 'deep-research-dashboard.md'), out, 'utf8');
console.log(`dashboard updated: ${iterations.length} iterations`);
