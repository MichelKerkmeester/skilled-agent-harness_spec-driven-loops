#!/usr/bin/env node
// Regenerates the auto-generated dashboard from raw JSONL state + findings registry.
// Owned by the detached lineage executor; writes only inside the lineage dir.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const dir = path.join(__dirname, '..');
const jsonlPath = path.join(dir, 'deep-research-state.jsonl');
const registryPath = path.join(dir, 'findings-registry.json');
const strategyPath = path.join(dir, 'deep-research-strategy.md');
const dashPath = path.join(dir, 'deep-research-dashboard.md');

const lines = fs.readFileSync(jsonlPath, 'utf8').split('\n').filter(Boolean);
const config = JSON.parse(lines[0]);
const iterations = lines.slice(1).map(l => JSON.parse(l)).filter(r => r.type === 'iteration');
const events = lines.slice(1).map(l => JSON.parse(l)).filter(r => r.type === 'event');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const strategy = fs.readFileSync(strategyPath, 'utf8');
const nextFocus = (strategy.match(/## 11\. NEXT FOCUS\n([\s\S]*?)(?=\n---|\n## )/) || [null, 'n/a'])[1].trim().split('\n')[0] || 'n/a';

const ratios = iterations.map(i => i.newInfoRatio);
const last3 = ratios.slice(-3);
const trend = last3.length < 2 ? 'n/a' : (last3[last3.length - 1] >= last3[last3.length - 2] ? 'ascending' : 'descending');
const stuck = iterations.filter(i => i.status === 'stuck').length;
const answered = registry.resolvedQuestions.length;
const total = registry.openQuestions.length + answered;

let rows = iterations.map(i => `| ${i.run} | ${(i.focus || '').replace(/\|/g, '/').slice(0, 60)} | ${i.newInfoRatio} | ${i.findingsCount || 0} | ${i.status} |`).join('\n');
if (!rows) rows = '| - | (init) | - | - | pending |';

const deadEnds = [];
for (const it of iterations) {
  for (const r of (it.ruledOut || [])) deadEnds.push(`- ${r.approach}: ${r.reason} (iteration ${it.run})`);
}

const eventsSummary = events.map(e => `- ${e.event} @ run ${e.run ?? '-'}${e.stopReason ? ' (' + e.stopReason + ')' : ''}`).join('\n') || '- none';

const md = `# Deep Research Dashboard - Session Overview

Auto-generated from state + registry. Regenerated after every iteration. Never manually edited.

## 2. STATUS
- Topic: Pi remote experience parity (8 axes, exceed Claude Code + Claude mobile)
- Started: ${config.createdAt}
- Status: ${iterations.length >= config.maxIterations ? 'COMPLETE' : 'ITERATING'}
- Iteration: ${iterations.length} of ${config.maxIterations}
- Session ID: ${config.sessionId}
- Parent Session: ${config.lineage ? (config.lineage.parentSessionId || 'none') : 'none'}
- Lifecycle Mode: ${config.lineage ? config.lineage.lineageMode : 'new'}
- Generation: ${config.lineage ? config.lineage.generation : 1}
- Stop policy: ${config.stopPolicy || 'max-iterations'} (threshold ${config.convergenceThreshold} telemetry-only)

## 3. PROGRESS

| # | Focus | Ratio | Findings | Status |
|---|-------|-------|----------|--------|
${rows}

- iterationsCompleted: ${iterations.length}
- keyFindings: ${registry.keyFindings.length}
- openQuestions: ${registry.openQuestions.length}
- resolvedQuestions: ${answered}

## 4. QUESTIONS
- Answered: ${answered}/${total}
${registry.resolvedQuestions.map(q => `- [x] ${q.id}: ${q.text.slice(0, 100)} (${q.answeredAt ? 'iteration ' + q.answeredAt : 'resolved'})`).join('\n') || '- none'}
${registry.openQuestions.map(q => `- [ ] ${q.id}: ${q.text.slice(0, 100)}`).join('\n') || ''}

## 5. TREND
- Last 3 ratios: ${last3.length ? last3.join(' -> ') : 'n/a'} (${trend})
- Stuck count: ${stuck}
- Guard violations: ${events.filter(e => e.event === 'guard_violation').length}
- convergenceScore: ${registry.metrics.convergenceScore || 0}
- coverageBySources: ${registry.metrics.coverageBySources || 0}

## 6. DEAD ENDS
${deadEnds.join('\n') || '- none yet'}

## 7. NEXT FOCUS
${nextFocus}

## 8. ACTIVE RISKS
- 20-iteration hard cap; convergence before cap is telemetry only (operator directive).
${eventsSummary}
`;
fs.writeFileSync(dashPath, md);
console.log(`dashboard refreshed: ${iterations.length} iterations, ${answered}/${total} questions answered`);
