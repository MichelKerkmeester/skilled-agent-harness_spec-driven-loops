// ───────────────────────────────────────────────────────────────────
// MODULE: Template Phrase Integration Tests
// ───────────────────────────────────────────────────────────────────

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { seededPhrases } from '../spec/template-phrase-cleanup.mjs';
import { parseFrontmatter } from '../spec/template-phrase-census.mjs';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, '../../..');
const CLI_ROOT = path.join(PACKAGE_ROOT, 'runtime', 'cli');
const CLEANUP_SCRIPT = path.join(CLI_ROOT, 'spec', 'template-phrase-cleanup.mjs');
const LINT_SCRIPT = path.join(CLI_ROOT, 'spec', 'template-phrase-lint.mjs');
const TEMP_ROOTS: string[] = [];

function copyCreateFixture(workspace: string): string {
  const fixtureCli = path.join(workspace, '.skilled', 'skills', 'system-spec-kit', 'runtime', 'cli');
  for (const directory of ['spec', 'lib', 'templates']) {
    fs.mkdirSync(path.join(fixtureCli, directory), { recursive: true });
  }
  fs.copyFileSync(path.join(CLI_ROOT, 'spec', 'create.sh'), path.join(fixtureCli, 'spec', 'create.sh'));
  for (const library of ['shell-common.sh', 'git-branch.sh', 'template-utils.sh']) {
    fs.copyFileSync(path.join(CLI_ROOT, 'lib', library), path.join(fixtureCli, 'lib', library));
  }
  fs.copyFileSync(
    path.join(CLI_ROOT, 'templates', 'inline-gate-renderer.sh'),
    path.join(fixtureCli, 'templates', 'inline-gate-renderer.sh'),
  );
  fs.cpSync(
    path.join(PACKAGE_ROOT, 'templates'),
    path.join(workspace, '.skilled', 'skills', 'system-spec-kit', 'templates'),
    { recursive: true },
  );
  return path.join(fixtureCli, 'spec', 'create.sh');
}

function readPhrases(file: string): string[] {
  const parsed = parseFrontmatter(fs.readFileSync(file, 'utf8'));
  if (!parsed.ok || !parsed.data || !Array.isArray(parsed.data.trigger_phrases)) {
    throw new Error(`${file} has no trigger phrase list`);
  }
  return parsed.data.trigger_phrases as string[];
}

function replaceTriggerBlock(content: string, rows: string[]): string {
  const pattern = /^trigger_phrases:\r?\n((?:[ \t]*-[ \t]*"[^"]*"[ \t]*\r?\n?)+)/m;
  if (!pattern.test(content)) throw new Error('fixture has no quoted trigger phrase block');
  return content.replace(pattern, `trigger_phrases:\n${rows.join('\n')}\n`);
}

afterEach(() => {
  for (const root of TEMP_ROOTS) fs.rmSync(root, { recursive: true, force: true });
  TEMP_ROOTS.length = 0;
});

describe('template phrase seeding, cleanup and lint integration', () => {
  it('seeds a packet, cleans a restored template block and blocks a newly added default', () => {
    const workspace = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'template-phrase-integration-')));
    TEMP_ROOTS.push(workspace);
    execFileSync('git', ['init', '--quiet'], { cwd: workspace, stdio: 'ignore' });
    const createScript = copyCreateFixture(workspace);
    const created = spawnSync(
      'bash',
      [
        createScript,
        '--json',
        '--skip-branch',
        '--with-lazy-addons',
        '--with-goal',
        '--short-name',
        'phrase-integration',
        'Phrase integration hardening',
      ],
      { cwd: workspace, encoding: 'utf8' },
    );
    expect(created.status, created.stderr).toBe(0);

    const specFile = path.resolve(
      workspace,
      (JSON.parse(created.stdout) as { SPEC_FILE: string }).SPEC_FILE,
    );
    const packet = path.dirname(specFile);
    const seededDocuments = [
      { filename: 'decision-record.md', kind: 'decisionRecord' },
      { filename: 'before-after.md', kind: 'beforeAfter' },
      { filename: 'timeline.md', kind: 'timeline' },
      { filename: 'roadmap.md', kind: 'roadmap' },
      { filename: 'goal.md', kind: 'goal' },
    ];
    for (const { filename, kind } of seededDocuments) {
      const file = path.join(packet, filename);
      expect(readPhrases(file)).toEqual(seededPhrases(file, kind));
    }

    const decisionFile = path.join(packet, 'decision-record.md');
    const decisionTemplate = fs.readFileSync(
      path.join(PACKAGE_ROOT, 'templates', 'addons', 'decision-record.md.tmpl'),
      'utf8',
    );
    const templateMatch = decisionTemplate.match(
      /^trigger_phrases:\r?\n((?:[ \t]*-[ \t]*"[^"]*"[ \t]*\r?\n?)+)/m,
    );
    if (!templateMatch) throw new Error('decision record template has no phrase defaults');
    fs.writeFileSync(
      decisionFile,
      replaceTriggerBlock(fs.readFileSync(decisionFile, 'utf8'), templateMatch[1].trimEnd().split(/\r?\n/)),
      'utf8',
    );

    const cleanup = spawnSync(
      process.execPath,
      [CLEANUP_SCRIPT, '--root', path.join(workspace, 'specs'), '--apply', '--json'],
      { cwd: workspace, encoding: 'utf8' },
    );
    expect(cleanup.status, cleanup.stderr).toBe(1);
    const cleanupReport = JSON.parse(cleanup.stdout) as {
      changed: number;
      changes: Array<{ beforeHash: string; afterHash: string }>;
    };
    expect(cleanupReport.changed).toBe(1);
    expect(cleanupReport.changes[0].beforeHash).not.toBe(cleanupReport.changes[0].afterHash);
    expect(readPhrases(decisionFile)).toEqual(seededPhrases(decisionFile, 'decisionRecord'));

    execFileSync('git', ['config', 'user.name', 'Template Phrase Integration'], { cwd: workspace });
    execFileSync('git', ['config', 'user.email', 'template-phrase-integration@example.invalid'], { cwd: workspace });
    execFileSync('git', ['add', '-f', '--', 'specs'], { cwd: workspace });
    execFileSync('git', ['commit', '--quiet', '-m', 'seeded baseline'], { cwd: workspace });

    const cleaned = fs.readFileSync(decisionFile, 'utf8');
    fs.writeFileSync(decisionFile, cleaned.replace('trigger_phrases:\n', 'trigger_phrases:\n  - "feature specification"\n'), 'utf8');
    execFileSync('git', ['add', '-f', '--', path.relative(workspace, decisionFile)], { cwd: workspace });
    const lint = spawnSync(process.execPath, [LINT_SCRIPT], { cwd: workspace, encoding: 'utf8' });

    expect(lint.status).toBe(1);
    expect(lint.stderr).toContain('[template-default]');
    expect(lint.stderr).toContain('feature specification');
  });
});
