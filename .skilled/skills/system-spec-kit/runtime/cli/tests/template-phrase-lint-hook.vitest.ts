// ───────────────────────────────────────────────────────────────────
// MODULE: Template Phrase Lint Hook Tests
// ───────────────────────────────────────────────────────────────────

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, '../../..');
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '../../..');
const CLI_ROOT = path.join(PACKAGE_ROOT, 'runtime', 'cli');
const HOOK_SOURCE = path.join(REPO_ROOT, '.skilled', 'scripts', 'git-hooks', 'pre-commit');
const TEMP_ROOTS: string[] = [];

type HookHarness = { root: string; markdownFile: string; lintFile: string; hookFile: string };

function git(root: string, args: string[]): void {
  execFileSync('git', args, { cwd: root, stdio: 'ignore' });
}

function createHarness(existingPhrase = 'existing safe phrase'): HookHarness {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'template-phrase-hook-'));
  TEMP_ROOTS.push(root);
  execFileSync('git', ['init', '--quiet'], { cwd: root, stdio: 'ignore' });
  git(root, ['config', 'user.name', 'Template Phrase Test']);
  git(root, ['config', 'user.email', 'template-phrase-test@example.invalid']);

  const skillRoot = path.join(root, '.skilled', 'skills', 'system-spec-kit');
  const cliRoot = path.join(skillRoot, 'runtime', 'cli');
  const specRoot = path.join(cliRoot, 'spec');
  const libraryRoot = path.join(cliRoot, 'retrieval', 'lib');
  const hookDirectory = path.join(root, '.skilled', 'scripts', 'git-hooks');
  const hookLibrary = path.join(hookDirectory, 'lib');
  fs.mkdirSync(specRoot, { recursive: true });
  fs.mkdirSync(libraryRoot, { recursive: true });
  fs.mkdirSync(hookLibrary, { recursive: true });
  fs.mkdirSync(path.join(root, '.git', 'hooks-disabled'), { recursive: true });
  fs.copyFileSync(path.join(PACKAGE_ROOT, 'SKILL.md'), path.join(skillRoot, 'SKILL.md'));
  fs.symlinkSync(path.join(PACKAGE_ROOT, 'node_modules'), path.join(skillRoot, 'node_modules'), 'dir');
  fs.copyFileSync(HOOK_SOURCE, path.join(hookDirectory, 'pre-commit'));
  for (const name of ['gate-config.sh', 'gates.tsv']) {
    fs.copyFileSync(
      path.join(REPO_ROOT, '.skilled', 'scripts', 'git-hooks', 'lib', name),
      path.join(hookLibrary, name),
    );
  }

  for (const name of ['template-phrase-lint.mjs', 'template-phrase-census.mjs']) {
    fs.copyFileSync(path.join(CLI_ROOT, 'spec', name), path.join(specRoot, name));
  }
  for (const name of ['phrase-judge.mjs', 'normalize.mjs']) {
    fs.copyFileSync(path.join(CLI_ROOT, 'retrieval', 'lib', name), path.join(libraryRoot, name));
  }

  const markdownFile = path.join(root, 'docs', 'phrases.md');
  fs.mkdirSync(path.dirname(markdownFile), { recursive: true });
  fs.writeFileSync(
    markdownFile,
    `---\ntrigger_phrases:\n  - "${existingPhrase}"\n---\n\n# Phrase fixture\n`,
    'utf8',
  );
  git(root, ['add', 'docs/phrases.md']);
  git(root, ['config', 'core.hooksPath', path.join(root, '.git', 'hooks-disabled')]);
  execFileSync('git', ['commit', '--quiet', '-m', 'baseline'], { cwd: root, stdio: 'ignore' });

  const hookDirectoryInGit = path.join(root, '.git', 'hooks');
  const hookFile = path.join(hookDirectoryInGit, 'pre-commit');
  fs.symlinkSync(path.relative(hookDirectoryInGit, path.join(hookDirectory, 'pre-commit')), hookFile);
  git(root, ['config', 'core.hooksPath', hookDirectoryInGit]);

  return {
    root,
    markdownFile,
    lintFile: path.join(specRoot, 'template-phrase-lint.mjs'),
    hookFile: path.join(hookDirectory, 'pre-commit'),
  };
}

function stagePhrase(harness: HookHarness, phrase: string): void {
  const content = fs.readFileSync(harness.markdownFile, 'utf8');
  const updated = content.replace(
    '  - "existing safe phrase"\n',
    `  - "existing safe phrase"\n  - ${JSON.stringify(phrase)}\n`,
  );
  fs.writeFileSync(harness.markdownFile, updated, 'utf8');
  git(harness.root, ['add', 'docs/phrases.md']);
}

function runHook(harness: HookHarness, additions: Record<string, string> = {}) {
  return spawnSync('bash', [harness.hookFile], {
    cwd: harness.root,
    encoding: 'utf8',
    env: {
      ...process.env,
      SPECKIT_SKIP_COMMENT_HYGIENE: '1',
      SPECKIT_SKIP_MIRROR_PARITY: '1',
      SPECKIT_SKIP_CARD_SYNC: '1',
      SPECKIT_SKIP_MCP_MUTATION_CLASS: '1',
      SPECKIT_SKIP_ROUTE_REMINT: '1',
      SPECKIT_SKIP_SPEC_REMINT: '1',
      ...additions,
    },
  });
}

afterEach(() => {
  for (const root of TEMP_ROOTS) fs.rmSync(root, { recursive: true, force: true });
  TEMP_ROOTS.length = 0;
});

describe('pre-commit template phrase lint', () => {
  it.each([
    ['feature specification', 'template-default'],
    ['context', 'editor-fallback'],
  ])('blocks a newly added %s phrase', (phrase, negativeClass) => {
    const harness = createHarness();
    stagePhrase(harness, phrase);

    const result = runHook(harness);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(`[${negativeClass}]`);
    expect(result.stderr).toContain('BLOCKED [gate:template-phrase-lint]');
  });

  it('warns on a newly added single-token phrase without blocking', () => {
    const harness = createHarness();
    stagePhrase(harness, 'neurology');

    const result = runHook(harness);

    expect(result.status).toBe(0);
    expect(result.stderr).toContain('WARNING [gate:template-phrase-lint]');
    expect(result.stderr).toContain('[single-token]');
    expect(result.stderr).not.toContain('BLOCKED [gate:template-phrase-lint]');
  });

  it('does not re-grade a negative phrase already in HEAD', () => {
    const harness = createHarness('feature specification');
    const content = fs.readFileSync(harness.markdownFile, 'utf8');
    fs.writeFileSync(harness.markdownFile, content.replace('# Phrase fixture', '# Updated fixture'), 'utf8');
    git(harness.root, ['add', 'docs/phrases.md']);

    const result = runHook(harness);

    expect(result.status).toBe(0);
    expect(result.stderr).not.toContain('template-default');
  });

  it('skips the entire phrase gate when bypassed', () => {
    const harness = createHarness();
    stagePhrase(harness, 'feature specification');
    fs.unlinkSync(harness.lintFile);

    const result = runHook(harness, { SPECKIT_SKIP_PHRASE_LINT: '1' });

    expect(result.status).toBe(0);
    expect(result.stderr).not.toContain('linter is missing');
    expect(result.stderr).not.toContain('template-phrase-lint');
  });

  it('honours the persistent registry switch for the phrase gate', () => {
    const harness = createHarness();
    stagePhrase(harness, 'feature specification');
    git(harness.root, ['config', 'speckit.hooks.templatePhraseLint', 'off']);

    const result = runHook(harness);

    expect(result.status).toBe(0);
    expect(result.stderr).toContain('the templatePhraseLint gate is off');
    expect(result.stderr).not.toContain('template-phrase-lint');
  });
});
