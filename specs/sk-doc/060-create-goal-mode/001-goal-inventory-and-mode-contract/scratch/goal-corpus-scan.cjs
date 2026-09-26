#!/usr/bin/env node
// Read-only scan of every packet goal outside z_archive. Runs `goal.cjs packet`
// once per packet and classifies the defects the validator does not check.
// Usage: node goal-corpus-scan.cjs <repo-root>  (writes JSON to stdout)
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(process.argv[2] || '.');
const goalCli = path.join(root, '.skilled/hooks/goal/bin/goal.cjs');
const CHILD_DIR = /^[0-9]{3}-[a-z0-9][a-z0-9-]*$/;

function findGoals(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'z_archive' || entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findGoals(full, out);
    else if (entry.name === 'goal.md') out.push(full);
  }
  return out;
}

function anchorBody(text, id) {
  const m = text.match(new RegExp(`<!-- ANCHOR:${id} -->([\\s\\S]*?)<!-- /ANCHOR:${id} -->`));
  return m ? m[1] : null;
}

function phaseChildren(folder) {
  return fs.readdirSync(folder, { withFileTypes: true })
    .filter((e) => e.isDirectory() && CHILD_DIR.test(e.name))
    .filter((e) => ['spec.md', 'description.json'].some((f) => fs.existsSync(path.join(folder, e.name, f))))
    .map((e) => e.name)
    .sort();
}

const goals = findGoals(path.join(root, 'specs'), []).sort();
const rows = goals.map((goalPath) => {
  const folder = path.dirname(goalPath);
  const rel = path.relative(root, folder);
  const run = spawnSync('node', [goalCli, 'packet', rel, '--workspace', root], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const field = (k) => ((run.stdout || '').match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1] || null;
  const text = fs.readFileSync(goalPath, 'utf8');
  const isChild = fs.existsSync(path.join(path.dirname(folder), 'spec.md'));
  const objective = (text.match(/^\*\*Objective:\*\*\s*(.*)$/m) || [])[1] || '';
  const completion = anchorBody(text, 'completion') || '';
  const criteria = completion.split('\n').filter((l) => /^- \[[ xX]\] /.test(l)).map((l) => l.replace(/^- \[[ xX]\] /, ''));
  const binding = anchorBody(text, 'binding');
  const bindingRows = binding ? binding.split('\n').filter((l) => /^\|/.test(l)).slice(2) : [];
  const exactRow = (l) => /^\|[^|]*\|\s*`[0-9]{3}-[a-z0-9-]+\/goal\.md`\s*\|\s*$/.test(l);
  const bindingStyle = !binding ? 'none' : (bindingRows.length && bindingRows.every(exactRow) ? 'per-child-rows' : 'range-glob-or-prose');
  const bound = binding ? [...binding.matchAll(/`([0-9]{3}-[a-z0-9-]+)\/goal\.md`/g)].map((m) => m[1]) : [];
  const children = phaseChildren(folder);
  const childrenWithGoal = children.filter((c) => fs.existsSync(path.join(folder, c, 'goal.md')));
  const childrenWithoutGoal = children.filter((c) => !childrenWithGoal.includes(c));
  const unbound = bindingStyle === 'per-child-rows' ? childrenWithGoal.filter((c) => !bound.includes(c)) : [];
  const placeholders = [];
  if (/^\[.*\]$/.test(objective.trim()) || /\[One sentence/.test(objective)) placeholders.push('objective');
  if (/\| D1 \| \[The decision/.test(text)) placeholders.push('decisions');
  if (criteria.some((c) => /^\[.*\]$/.test(c.trim()))) placeholders.push('criteria');
  return {
    packet: rel,
    role: isChild ? 'phase-child' : (children.length ? 'phase-parent' : 'top-level'),
    command: `node .skilled/hooks/goal/bin/goal.cjs packet ${rel} --workspace <repo-root>`,
    exit: run.status,
    status: field('STATUS'),
    durableChars: Number(field('packet_durable_chars')),
    budget: field('packet_budget'),
    criteriaCount: criteria.length,
    criteriaOutOfRange: criteria.length < 3 || criteria.length > 7,
    placeholders,
    hasBinding: Boolean(binding),
    childrenOnDisk: children.length,
    bindingStyle,
    childrenWithoutGoal,
    unboundChildren: unbound,
    parentWithoutBinding: !isChild && children.length > 0 && !binding,
  };
});

const count = (fn) => rows.filter(fn).length;
const summary = {
  denominator: rows.length,
  command: "find specs -name goal.md -not -path '*/z_archive/*'",
  exitZero: count((r) => r.exit === 0),
  roles: { topLevel: count((r) => r.role === 'top-level'), phaseParent: count((r) => r.role === 'phase-parent'), phaseChild: count((r) => r.role === 'phase-child') },
  overBudget: count((r) => r.budget === 'over'),
  placeholderAny: count((r) => r.placeholders.length),
  placeholderObjective: count((r) => r.placeholders.includes('objective')),
  criteriaOutOfRange: count((r) => r.criteriaOutOfRange),
  parentsWithUnboundChildren: count((r) => r.unboundChildren.length),
  parentsWithoutBinding: count((r) => r.parentWithoutBinding),
  bindingStyles: { perChildRows: count((r) => r.bindingStyle === 'per-child-rows'), rangeGlobOrProse: count((r) => r.bindingStyle === 'range-glob-or-prose') },
  parentsWithGoallessChildren: count((r) => r.hasBinding && r.childrenWithoutGoal.length),
};
process.stdout.write(JSON.stringify({ summary, rows }, null, 2) + '\n');
