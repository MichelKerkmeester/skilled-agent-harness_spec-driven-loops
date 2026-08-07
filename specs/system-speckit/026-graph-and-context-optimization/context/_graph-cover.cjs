#!/usr/bin/env node
// Populate the deep-loop coverage-graph (loop_type=context) for an iteration:
// idempotently upsert the 19 frontier SLICE nodes, then add FILE nodes +
// COVERED_BY edges for the anchors covered this iteration (drives sliceCoverage).
// Usage: node _graph-cover.cjs <run-dir> <session-id> <covered-csv>
'use strict';
const { spawnSync } = require('child_process');

const [, , runDir, sessionId, coveredCsv] = process.argv;
if (!runDir || !sessionId) { process.stderr.write('Usage: _graph-cover.cjs <run> <sid> <covered-csv>\n'); process.exit(2); }

// 19 frontier anchors (matches deep-context-strategy.md). band: docs|code.
const ANCHORS = [
  { i: 1,  band: 'docs', path: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md', label: 'root program map' },
  { i: 2,  band: 'docs', path: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/context-index.md', label: 'migration bridge' },
  { i: 3,  band: 'docs', path: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline', label: '001 research subtree' },
  { i: 4,  band: 'docs', path: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/spec.md', label: '002 spec-kit internals' },
  { i: 5,  band: 'docs', path: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/spec.md', label: '003 memory+causal' },
  { i: 6,  band: 'docs', path: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/spec.md', label: '004 code-graph' },
  { i: 7,  band: 'docs', path: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/spec.md', label: '005 deferred uplift' },
  { i: 8,  band: 'docs', path: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/spec.md', label: '006 operator tooling' },
  { i: 9,  band: 'docs', path: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/spec.md', label: '007 daemon reliability' },
  { i: 10, band: 'docs', path: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-defect-fixes/spec.md', label: '008 runtime defects' },
  { i: 11, band: 'docs', path: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/spec.md', label: '000 release+cleanup' },
  { i: 12, band: 'code', path: '.opencode/skills/system-code-graph/mcp_server', label: 'code-graph MCP server' },
  { i: 13, band: 'code', path: '.opencode/skills/system-spec-kit/mcp_server/lib/memory', label: 'memory continuity runtime' },
  { i: 14, band: 'code', path: '.opencode/skills/system-spec-kit/mcp_server/lib/embedders', label: 'embedder runtime' },
  { i: 15, band: 'code', path: '.opencode/skills/deep-loop-runtime/scripts', label: 'deep-loop runtime scripts' },
  { i: 16, band: 'code', path: '.opencode/bin', label: 'daemon launchers + IPC bridge' },
  { i: 17, band: 'code', path: '.codex/hooks.json', label: 'runtime hook parity' },
  { i: 18, band: 'code', path: '.opencode/commands/doctor', label: 'doctor command surface' },
  { i: 19, band: 'code', path: '.opencode/skills/system-skill-advisor', label: 'skill-advisor system' },
];

const covered = new Set((coveredCsv || '').split(',').map((s) => parseInt(s.trim(), 10)).filter(Number.isInteger));

const nodes = ANCHORS.map((a) => ({ id: `slice:${a.i}`, kind: 'SLICE', name: `${a.label} [${a.band}]` }));
const edges = [];
for (const a of ANCHORS) {
  if (!covered.has(a.i)) continue;
  nodes.push({ id: `file:${a.i}`, kind: 'FILE', name: a.path });
  edges.push({ id: `cov:${a.i}`, source: `slice:${a.i}`, target: `file:${a.i}`, relation: 'COVERED_BY' });
}

const args = [
  '.opencode/skills/deep-loop-runtime/scripts/upsert.cjs',
  '--spec-folder', runDir, '--loop-type', 'context', '--session-id', sessionId,
  '--nodes', JSON.stringify(nodes), '--edges', JSON.stringify(edges),
];
const r = spawnSync('node', args, { encoding: 'utf8' });
process.stdout.write((r.stdout || '').replace(/\x1b\[[0-9;]*m/g, ''));
if (r.status !== 0) { process.stderr.write(r.stderr || ''); process.exit(r.status || 1); }
const totalSlices = ANCHORS.length;
process.stdout.write(`\nsliceCoverage = ${covered.size}/${totalSlices} = ${(covered.size / totalSlices).toFixed(3)}\n`);
