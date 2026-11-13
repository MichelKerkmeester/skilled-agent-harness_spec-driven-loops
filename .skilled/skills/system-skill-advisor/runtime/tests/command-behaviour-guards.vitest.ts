// ───────────────────────────────────────────────────────────────
// MODULE: Behaviour Runner Guard Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { G2_ROWS, childEnv, liveArmRefusal } from '../scripts/routing-accuracy/run-command-behaviour.mjs';
import { startedLabel } from '../scripts/routing-accuracy/score-command-transcripts.mjs';

describe('childEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('passes only the allowlisted environment to a turn', () => {
    vi.stubEnv('SSH_AUTH_SOCK', '/tmp/ssh-agent.sock');
    vi.stubEnv('AWS_ACCESS_KEY_ID', 'AKIAIOSFODNN7EXAMPLE');
    vi.stubEnv('NPM_TOKEN', 'npm-token');
    vi.stubEnv('GH_TOKEN', 'gh-token');
    vi.stubEnv('AI_SESSION_CHILD', '1');
    vi.stubEnv('ANTHROPIC_API_KEY', 'sk-ant-example');

    const env = childEnv('/tmp/gh-empty');

    expect(env.SSH_AUTH_SOCK).toBeUndefined();
    expect(env.AWS_ACCESS_KEY_ID).toBeUndefined();
    expect(env.NPM_TOKEN).toBeUndefined();
    expect(env.GH_TOKEN).toBeUndefined();
    expect(env.AI_SESSION_CHILD).toBeUndefined();
    expect(env.ANTHROPIC_API_KEY).toBe('sk-ant-example');
    expect(env.PATH).toBe(process.env.PATH);
    expect(env.HOME).toBe(process.env.HOME);
    expect(env.GH_CONFIG_DIR).toBe('/tmp/gh-empty');
    expect(env.GIT_TERMINAL_PROMPT).toBe('0');
    expect(env.GIT_CONFIG_KEY_0).toBe('credential.helper');
  });
});

describe('startedLabel', () => {
  it('labels a row from its own command and variant', () => {
    const label = startedLabel('g2-x-custom', [
      { id: 'g2-x-custom', command: '/speckit:plan', variant: 'typed', prompt: 'p' },
    ]);

    expect(label?.expected_command).toBe('/speckit:plan');
    expect(label?.expected_policy).toBe('start');
    expect(label?.prompt).toBe(':auto');
  });

  it('returns no label for an id no row carries', () => {
    expect(startedLabel('g2-nope')).toBeNull();
  });

  it('labels every runner row with its command and only a typed row with :auto', () => {
    for (const row of G2_ROWS) {
      const label = startedLabel(row.id);

      expect(['/deep:research', '/deep:review', '/speckit:complete']).toContain(label?.expected_command);
      expect(label?.expected_command).toBe(row.command);
      expect(label?.prompt).toBe(row.variant === 'typed' ? ':auto' : '');
    }
  });
});

describe('liveArmRefusal', () => {
  const dirs: string[] = [];

  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  it('refuses a live arm outside a marked arena', () => {
    const dir = mkdtempSync(join(tmpdir(), 'skilled-behaviour-guard-'));
    dirs.push(dir);
    const runGit = (args: string[]) => spawnSync('git', args, { cwd: dir, encoding: 'utf8' });
    expect(runGit(['init', '-q']).status).toBe(0);

    expect(liveArmRefusal(dir)?.code).toBe('arena_unprepared');

    writeFileSync(join(dir, '.git', 'skilled-behaviour-arena'), 'arena\n');
    expect(liveArmRefusal(dir)).toBeNull();

    expect(runGit(['remote', 'add', 'origin', 'https://example.invalid/x.git']).status).toBe(0);
    expect(liveArmRefusal(dir)).toEqual({ ok: false, code: 'remote_present', remotes: ['origin'] });
  });
});

describe('entry guard', () => {
  it('runs the CLI when it is launched through a symlink', () => {
    const dir = mkdtempSync(join(tmpdir(), 'skilled-behaviour-entry-'));
    try {
      const runnerLink = join(dir, 'runner.mjs');
      const scorerLink = join(dir, 'scorer.mjs');
      symlinkSync(
        fileURLToPath(new URL('../scripts/routing-accuracy/run-command-behaviour.mjs', import.meta.url)),
        runnerLink,
      );
      symlinkSync(
        fileURLToPath(new URL('../scripts/routing-accuracy/score-command-transcripts.mjs', import.meta.url)),
        scorerLink,
      );

      const listed = spawnSync(process.execPath, [runnerLink, '--list', 'g2'], { encoding: 'utf8' });
      expect(listed.status).toBe(0);
      expect(listed.stdout.split('\n')[0]).toBe('g2-deep-research-ask');

      const refused = spawnSync(process.execPath, [scorerLink], { encoding: 'utf8' });
      expect(refused.status).toBe(2);
      expect(refused.stderr).toContain('--runtime is required with --locator');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
