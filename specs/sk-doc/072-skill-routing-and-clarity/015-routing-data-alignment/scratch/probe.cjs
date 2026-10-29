#!/usr/bin/env node
// Run every probe in probes.json through the live advisor and, when a hub is named,
// the hub's compiled route. usage: probe.cjs <out.json> [id-filter-regex]
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const probes = JSON.parse(fs.readFileSync(path.join(__dirname, 'probes.json'), 'utf8'));
const out = process.argv[2];
const filter = process.argv[3] ? new RegExp(process.argv[3]) : null;

function advisor(prompt) {
  const raw = execFileSync('node', [path.join(ROOT, '.skilled/bin/skill-advisor.cjs'), 'advisor_recommend',
    '--json', JSON.stringify({ prompt, options: { topK: 3, confidenceThreshold: 0 } }), '--format', 'json'],
  { cwd: ROOT, encoding: 'utf8' });
  const j = JSON.parse(raw);
  const recs = (j.data && j.data.recommendations) || [];
  const live = execFileSync('node', [path.join(ROOT, '.skilled/bin/skill-advisor.cjs'), 'advisor_recommend',
    '--json', JSON.stringify({ prompt }), '--format', 'json'], { cwd: ROOT, encoding: 'utf8' });
  const lj = JSON.parse(live);
  const lrecs = (lj.data && lj.data.recommendations) || [];
  return {
    top1: lrecs[0] ? lrecs[0].skillId : null,
    top1Confidence: lrecs[0] ? lrecs[0].confidence : null,
    ranked: recs.map((r) => `${r.skillId}:${r.score}`),
    freshness: lj.data && lj.data.freshness,
  };
}

function route(hub, prompt) {
  const raw = execFileSync('node', [path.join(ROOT, '.skilled/bin/compiled-route.cjs'), '--hub', hub, '--prompt', prompt],
    { cwd: ROOT, encoding: 'utf8' });
  const j = JSON.parse(raw);
  return { action: j.action, targets: (j.targets || []).map((t) => t.packetId || t.workflowMode) };
}

const rows = [];
for (const p of probes) {
  if (filter && !filter.test(p.id)) continue;
  const row = { id: p.id, item: p.item, prompt: p.prompt };
  if (p.expectSkill !== undefined) {
    row.advisor = advisor(p.prompt);
    row.expectSkill = p.expectSkill;
    row.advisorPass = row.advisor.top1 === p.expectSkill;
  } else if (p.avoidSkill) {
    // An out-of-domain control passes when the new alias owner does not take the prompt.
    row.advisor = advisor(p.prompt);
    row.avoidSkill = p.avoidSkill;
    row.advisorPass = row.advisor.top1 !== p.avoidSkill;
  }
  if (p.hub) {
    row.route = route(p.hub, p.prompt);
    row.expectRoute = p.expectRoute;
    row.routePass = p.expectRoute === 'defer'
      ? row.route.action === 'defer'
      : row.route.action === 'route' && row.route.targets.join(',') === p.expectRoute;
  }
  rows.push(row);
  const a = row.advisor ? `${row.advisorPass ? 'PASS' : 'FAIL'} advisor=${row.advisor.top1}(${row.advisor.top1Confidence}) [${row.advisor.ranked.join(' ')}]` : '';
  const r = row.route ? ` ${row.routePass ? 'PASS' : 'FAIL'} route=${row.route.action}:${row.route.targets.join(',')}` : '';
  process.stdout.write(`${p.id} ${a}${r}\n`);
}
if (out) fs.writeFileSync(out, `${JSON.stringify(rows, null, 2)}\n`);
