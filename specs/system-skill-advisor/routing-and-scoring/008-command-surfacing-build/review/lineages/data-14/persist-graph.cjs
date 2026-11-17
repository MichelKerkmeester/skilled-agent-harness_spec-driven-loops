#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const n = process.argv[2];
if (!n) throw new Error('usage: persist-graph.cjs <iteration>');
const base = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14';
const record = JSON.parse(fs.readFileSync(path.join(base, `iter-${n}.record.json`), 'utf8'));
const events = record.graphEvents || [];
const nodes = events.filter((e) => e.type === 'node').map(({ id, kind, label }) => ({ id, kind, label }));
const edges = events.filter((e) => e.type === 'edge').map(({ id, source, target, relation }) => ({ id, source, target, relation }));
const out = execFileSync('node', [
  '.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs',
  '--spec-folder', 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build',
  '--loop-type', 'review',
  '--session-id', record.sessionId,
  '--nodes', JSON.stringify(nodes),
  '--edges', JSON.stringify(edges),
], { encoding: 'utf8' });
const parsed = JSON.parse(out);
console.log(JSON.stringify({ insertedNodes: parsed.data?.insertedNodes, insertedEdges: parsed.data?.insertedEdges, rejectedEdges: parsed.data?.rejectedEdges }));
