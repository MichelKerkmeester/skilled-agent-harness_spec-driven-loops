// ───────────────────────────────────────────────────────────────────
// MODULE: Validation Exit Honesty
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const here = path.dirname(fileURLToPath(import.meta.url));
const runtimeRoot = path.resolve(here, '..');
const cliRoot = path.join(runtimeRoot, 'cli');
const validateScript = path.join(cliRoot, 'spec', 'validate.sh');
const placeholderScript = path.join(cliRoot, 'spec', 'check-placeholders.sh');
const sourceTagsRule = path.join(cliRoot, 'rules', 'check-source-tags.sh');
const roots: string[] = [];
// The probe reads only the stale-build message, so it validates an empty folder.
// The shared temp folder can hold tens of thousands of leftover entries, and
// validating it at import time held the whole lane open for minutes.
const probeRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-exit-honesty-probe-'));
const validateProbe = spawnSync('bash', [validateScript, probeRoot], { encoding: 'utf8' });
fs.rmSync(probeRoot, { recursive: true, force: true });
const compiledValidationIsFresh = !validateProbe.stderr.includes('compiled validation orchestrator is stale');

function packet(files: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-exit-honesty-'));
  roots.push(root);
  for (const [name, content] of Object.entries(files)) {
    const target = path.join(root, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
  }
  return root;
}

function validate(folder: string, env: Record<string, string>, ...args: string[]) {
  return spawnSync('bash', [validateScript, folder, ...args], {
    cwd: os.tmpdir(),
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

afterEach(() => {
  for (const root of roots) fs.rmSync(root, { recursive: true, force: true });
  roots.length = 0;
});

describe('validation exit honesty', () => {
  it.skipIf(!compiledValidationIsFresh)('prints an info marker when contamination has no routing payload', () => {
    const folder = packet({ 'spec.md': '# Draft fixture\n' });
    const result = validate(folder, { SPECKIT_RULES: 'CROSS_ANCHOR_CONTAMINATION' }, '--verbose');

    expect(result.stdout, `exit=${result.status} stderr=${result.stderr}`).toContain('i CROSS_ANCHOR_CONTAMINATION: No routing payload supplied; contamination check skipped');
  });

  it.skipIf(!compiledValidationIsFresh)('fails strict validation when SOURCE_TAGS cannot read a repository', () => {
    const folder = packet({
      'spec.md': '# Fixture\n\n| **Created** | 2026-11-08 |\n',
    });
    const result = validate(folder, {
      SPECKIT_RULES: 'SOURCE_TAGS',
      SPECKIT_SOURCE_TAG_CUTOFF: '2026-01-01',
    }, '--strict');

    expect(result.stdout, `exit=${result.status} stderr=${result.stderr}`).toContain('RESULT: FAILED');
  });

  it('marks SOURCE_TAGS execution failures as errors only in strict mode', () => {
    const folder = packet({ 'spec.md': '# Fixture\n\n| **Created** | 2026-11-08 |\n' });
    const run = (strict: boolean) => spawnSync('bash', ['-c', [
      `source "${sourceTagsRule}"`,
      `STRICT_MODE=${strict ? 'true' : 'false'}`,
      `run_check "${folder}" 2`,
      'printf "%s\\n" "$RULE_STATUS"',
    ].join('; ')], { encoding: 'utf8', env: { ...process.env, SPECKIT_SOURCE_TAG_CUTOFF: '2026-01-01' } });

    expect(run(false).stdout.trim()).toBe('warn');
    expect(run(true).stdout.trim()).toBe('error');
  });

  it('matches the placeholder rule verdict for Draft and non-Draft packets', () => {
    const makePlaceholderPacket = (status: string) => packet({
      'spec.md': [
        '<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->',
        '',
        `| **Status** | ${status} |`,
        '',
        'Owner: [YOUR_VALUE_HERE: owner name]',
        '',
      ].join('\n'),
    });
    const run = (folder: string) => spawnSync('bash', [placeholderScript, folder, '--json'], { encoding: 'utf8' });

    const draft = run(makePlaceholderPacket('Draft'));
    const complete = run(makePlaceholderPacket('Complete'));
    const verbose = spawnSync('bash', [placeholderScript, makePlaceholderPacket('Complete'), '--verbose'], { encoding: 'utf8' });
    expect(draft.status).toBe(0);
    expect(JSON.parse(draft.stdout).status).toBe('WARN');
    expect(complete.status).toBe(1);
    expect(JSON.parse(complete.stdout).status).toBe('FAIL');
    expect(verbose.stdout).toContain('spec.md:5');
  });

  it('fails a non-Draft packet when its only v2.4 token is in handover.md', () => {
    const folder = packet({
      'spec.md': ['# Fixture', '', '| **Status** | Complete |'].join('\n') + '\n',
      'handover.md': [
        '<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->',
        '',
        'Owner: [YOUR_VALUE_HERE: owner name]',
      ].join('\n') + '\n',
    });
    const result = spawnSync('bash', [placeholderScript, folder, '--json'], { encoding: 'utf8' });

    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout)).toMatchObject({ status: 'FAIL', placeholders: 1, warnings: 0 });
  });

  it('warns and exits zero for a Draft packet with a v2.4 spec token', () => {
    const folder = packet({
      'spec.md': [
        '<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->',
        '',
        '| **Status** | Draft |',
        '',
        'Owner: [YOUR_VALUE_HERE: owner name]',
      ].join('\n') + '\n',
    });
    const result = spawnSync('bash', [placeholderScript, folder, '--verbose'], { encoding: 'utf8' });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('WARN');
    expect(result.stdout).toContain('warn ');
    expect(result.stdout).toContain('spec.md:5');
  });
});
