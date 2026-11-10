#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Review Rule Sources Fixture Runner
// ───────────────────────────────────────────────────────────────────
'use strict';

// Copies each fixture repository into a throwaway git repository, runs the quality
// runner's --explain on its source file the way the review mode's resolver step does,
// and prints the per-file facts the review reads plus the Rule sources line it would
// write. Absolute paths are folded to <repo> and <hub> so the saved output is stable.
// Usage: node show-explain.cjs [fixture...]   (default: every folder under fixtures/)

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const HUB = path.resolve(__dirname, '..', '..', '..', '..', '..', '.skilled', 'skills', 'sk-code');
const RUNNER = path.join(HUB, 'sk-code-quality', 'scripts', 'quality-gate.cjs');
const FIXTURES = path.join(__dirname, 'fixtures');

function ruleSourcesLine(explained) {
  const groups = { sources: [], overrides: [], refused: [], ignored: [], conflicts: [] };
  const disabled = (explained.config.hygiene || {}).disabled || [];
  for (const entry of explained.files) {
    for (const id of disabled) groups.overrides.push(`${id} none from ${explained.config.path}`);
    for (const checklist of entry.checklists) {
      groups.sources.push(checklist.file);
      const overrides = checklist.overrides || {};
      if (overrides.refused) {
        groups.refused.push(checklist.file);
        continue;
      }
      for (const row of overrides.rows || []) groups.overrides.push(`${row.id} ${row.action} from ${checklist.file}`);
    }
  }
  const join = (values) => (values.length ? [...new Set(values)].join('; ') : 'none');
  return `Rule sources: ${[...new Set(groups.sources)].join(', ') || 'none'}. Overrides: ${join(groups.overrides)}. `
    + `Refused: ${join(groups.refused)}. Ignored: ${join(groups.ignored)}. Conflicts: ${join(groups.conflicts)}`;
}

function runFixture(name) {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), `review-fixture-${name}-`));
  try {
    fs.cpSync(path.join(FIXTURES, name), repo, { recursive: true });
    spawnSync('git', ['-c', 'core.fsmonitor=false', 'init', '-q', repo]);
    const run = spawnSync(process.execPath, [RUNNER, '--explain', 'src/report.ts'], { cwd: repo, encoding: 'utf8' });
    const real = fs.realpathSync(repo);
    const text = run.stdout.split(real).join('<repo>').split(repo).join('<repo>').split(HUB).join('<hub>');
    const explained = JSON.parse(text);
    const facts = explained.files.map((entry) => ({
      file: entry.file,
      surfaces: entry.surfaces,
      surface_skills: entry.surface_skills,
      checklists: entry.checklists.map((c) => ({ file: c.file, source: c.source, sources: c.sources, overrides: c.overrides })),
    }));
    return { fixture: name, exit: run.status, hygiene_disabled: (explained.config.hygiene || {}).disabled, files: facts, rule_sources: ruleSourcesLine(explained) };
  } finally {
    fs.rmSync(repo, { recursive: true, force: true });
  }
}

const names = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(FIXTURES).sort();
for (const name of names) {
  const result = runFixture(name);
  fs.writeFileSync(path.join(__dirname, `explain-${name}.json`), `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${name}: --explain exit ${result.exit}\n  ${result.rule_sources}\n`);
}
