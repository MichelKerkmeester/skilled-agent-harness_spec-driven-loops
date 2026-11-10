#!/usr/bin/env node
// Rebuild findings-registry.json from the lineage's delta files so the registry
// always mirrors the deltas (findings, corrections, resolved questions) instead
// of a hand-maintained summary. Writes only inside the lineage directory.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const dir = __dirname ? path.resolve(__dirname, '..') : process.cwd();
const deltaDir = path.join(dir, 'deltas');
const outPath = path.join(dir, 'findings-registry.json');

const files = fs
  .readdirSync(deltaDir)
  .filter((name) => /^iter-\d{3}\.jsonl$/.test(name))
  .sort();

const findings = [];
const corrections = [];
const resolvedQuestions = [];
let lastIteration = 0;

for (const file of files) {
  const lines = fs
    .readFileSync(path.join(deltaDir, file), 'utf8')
    .split('\n')
    .filter((line) => line.trim().length > 0);

  let ring = 'unknown';
  for (const line of lines) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch (error) {
      throw new Error(`${file}: invalid JSON line: ${error.message}`);
    }
    if (entry.type === 'iteration') {
      ring = entry.ring || ring;
      lastIteration = Math.max(lastIteration, entry.iteration || 0);
      continue;
    }
    if (entry.type === 'finding') {
      findings.push({
        id: entry.id,
        iteration: entry.iteration,
        ring,
        severity: entry.severity,
        class: entry.class,
        text: entry.label || entry.text,
        detail: entry.detail,
        sources: entry.sources || [],
        status: entry.status || 'confirmed-by-read',
        observedCommand: entry.observedCommand,
        crossRing: entry.crossRing,
        settlingAction: entry.settlingAction,
      });
    } else if (entry.type === 'correction') {
      corrections.push({
        id: entry.id,
        iteration: entry.iteration,
        corrects: entry.corrects,
        severity: entry.severity,
        text: entry.text || entry.label,
        detail: entry.detail,
        sources: entry.sources || [],
        status: entry.status || 'confirmed-by-read',
      });
    } else if (entry.type === 'resolved-question') {
      resolvedQuestions.push({
        id: entry.id,
        iteration: entry.iteration,
        question: entry.question,
        answer: entry.answer,
        status: entry.status,
      });
    }
  }
}

const registry = {
  sessionId: 'fanout-deepseek-1789192823658-autusz',
  lineageLabel: 'deepseek',
  updatedAt: new Date().toISOString(),
  lastIteration,
  counts: {
    findings: findings.length,
    corrections: corrections.length,
    resolvedQuestions: resolvedQuestions.length,
  },
  findings,
  corrections,
  resolvedQuestions,
};

fs.writeFileSync(outPath, `${JSON.stringify(registry, null, 2)}\n`, { mode: 0o600 });
console.log(
  `registry rebuilt: ${findings.length} findings, ${corrections.length} corrections, ` +
    `${resolvedQuestions.length} resolved questions, lastIteration=${lastIteration}`,
);
