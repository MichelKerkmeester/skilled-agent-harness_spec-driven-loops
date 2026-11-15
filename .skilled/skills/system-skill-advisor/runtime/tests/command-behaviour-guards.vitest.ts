// ───────────────────────────────────────────────────────────────
// MODULE: Behaviour Runner Guard Tests
// ───────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { G2_ROWS, armFor, assertFreshRun, assertFreshRowsUnique, childEnv, freshRowsFrom, lineFixture, liveArmRefusal, offerLineFields, restorePointer } from '../scripts/routing-accuracy/run-command-behaviour.mjs';
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

  it('switches the advisor off and on by arm', () => {
    vi.stubEnv('SPECKIT_SKILL_ADVISOR_HOOK_DISABLED', '1');
    vi.stubEnv('MK_SKILL_ADVISOR_PLUGIN_DISABLED', '1');
    vi.stubEnv('MK_HOOKS_DISABLED', '1');

    const on = childEnv('/tmp/gh-empty', 'on');
    expect(on.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED).toBeUndefined();
    expect(on.MK_SKILL_ADVISOR_PLUGIN_DISABLED).toBeUndefined();
    expect(on.MK_HOOKS_DISABLED).toBeUndefined();
    expect(on.SYSTEM_SKILL_ADVISOR_HOOK_DISABLED).toBeUndefined();

    const off = childEnv('/tmp/gh-empty', 'off');
    expect(off.SYSTEM_SKILL_ADVISOR_HOOK_DISABLED).toBe('1');
    expect(off.SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED).toBe('1');
    expect(off.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED).toBeUndefined();
    expect(off.MK_SKILL_ADVISOR_PLUGIN_DISABLED).toBeUndefined();
    expect(off.MK_HOOKS_DISABLED).toBeUndefined();

    expect(childEnv('/tmp/gh-empty', 'pre')).toEqual(childEnv('/tmp/gh-empty'));
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

describe('armFor', () => {
  it('runs a started-command row picked by id under arm g2', () => {
    expect(armFor({ arm: null, set: null }, ['g2-deep-review-ask'])).toBe('g2');
  });

  it('runs a whole started-command selection under arm g2', () => {
    expect(armFor({ arm: null, set: 'g2' }, G2_ROWS.map((row) => row.id))).toBe('g2');
  });

  it('keeps an explicit arm over the rows it runs', () => {
    expect(armFor({ arm: 'post', set: null }, ['g2-deep-review-ask'])).toBe('post');
  });

  it('runs a selection with no started-command row under the default arm', () => {
    expect(armFor({ arm: null, set: null }, ['cmd-x'])).toBe('pre');
    expect(armFor({ arm: null, set: null }, [])).toBe('pre');
  });

  it('refuses a selection that mixes a started-command row with another row', () => {
    let refusal: { code?: string } | null = null;
    try {
      armFor({ arm: null, set: null }, ['g2-deep-review-ask', 'cmd-x']);
    } catch (error) {
      refusal = error as { code?: string };
    }

    expect(refusal?.code).toBe('mixed_row_arms');
  });
});

describe('lineFixture', () => {
  it('keeps the fixture a run line recorded', () => {
    expect(lineFixture({ fixture: '/custom/fixture' }, '/runs/arm/g2-fixture')).toBe('/custom/fixture');
  });

  it('falls back to the arm folder for a line that records no fixture', () => {
    expect(lineFixture({}, '/runs/arm/g2-fixture')).toBe('/runs/arm/g2-fixture');
    expect(lineFixture({ fixture: '' }, '/runs/arm/g2-fixture')).toBe('/runs/arm/g2-fixture');
  });
});

describe('offerLineFields', () => {
  it('copies the offered command, its policy and where it sat', () => {
    expect(
      offerLineFields({
        offeredCommand: '/create:readme',
        offeredPolicy: 'start',
        offeredAs: 'partner',
        offerError: null,
      }),
    ).toEqual({ offeredCommand: '/create:readme', offeredPolicy: 'start', offeredAs: 'partner' });
  });

  it('writes null where the replay found no offer', () => {
    expect(
      offerLineFields({ offeredCommand: null, offeredPolicy: null, offerError: 'no_head' }),
    ).toEqual({ offeredCommand: null, offeredPolicy: null, offeredAs: null });
  });
});

describe('freshRowsFrom', () => {
  const freshLine = (index: number, overrides: Record<string, unknown> = {}) => JSON.stringify({
    id: `fresh-fit-${String(index).padStart(2, '0')}`,
    row_type: 'plain',
    split: 'fresh',
    prompt: `made up request ${index}`,
    ...overrides,
  });
  const freshText = (count: number) =>
    Array.from({ length: count }, (_, offset) => freshLine(offset + 1)).join('\n');
  const refusalOf = (text: string) => {
    try {
      freshRowsFrom(text);
      return null;
    } catch (error) {
      return error as { code?: string; message?: string };
    }
  };

  it('reads 36 fresh rows from their text', () => {
    const rows = freshRowsFrom(freshText(36));

    expect(rows).toHaveLength(36);
    expect(rows[0].id).toBe('fresh-fit-01');
    expect(rows[35].id).toBe('fresh-fit-36');
  });

  it('refuses a set of 35 rows', () => {
    expect(refusalOf(freshText(35))?.code).toBe('set_short');
  });

  it('refuses a holdout row by its id', () => {
    const refusal = refusalOf(`${freshText(35)}\n${freshLine(36, { split: 'holdout' })}`);

    expect(refusal?.code).toBe('holdout_row');
    expect(refusal?.message).toContain('fresh-fit-36');
  });

  it('refuses a row whose split is not fresh', () => {
    const refusal = refusalOf(`${freshText(35)}\n${freshLine(36, { split: 'tune' })}`);

    expect(refusal?.code).toBe('fresh_split');
    expect(refusal?.message).toContain('fresh-fit-36');
  });

  it('refuses a row whose id is not a fresh id', () => {
    const refusal = refusalOf(`${freshText(35)}\n${freshLine(36, { id: 'made-up-01' })}`);

    expect(refusal?.code).toBe('fresh_id');
    expect(refusal?.message).toContain('made-up-01');
  });
});

describe('assertFreshRowsUnique', () => {
  const refusalOf = (call: () => void) => {
    try {
      call();
      return null;
    } catch (error) {
      return error as { code?: string; message?: string };
    }
  };

  it('refuses a fresh row that repeats another row', () => {
    const otherRows = [{ id: 'made-up-92', prompt: 'draft the release notes' }];
    const repeated = refusalOf(() =>
      assertFreshRowsUnique([{ id: 'fresh-fit-91', prompt: 'Draft  the Release notes' }], otherRows),
    );

    expect(repeated?.code).toBe('repeated_row');
    expect(repeated?.message).toBe('fresh row fresh-fit-91 repeats row made-up-92');

    const doubled = refusalOf(() =>
      assertFreshRowsUnique(
        [
          { id: 'fresh-fit-91', prompt: 'draft the release notes' },
          { id: 'fresh-fit-92', prompt: 'Draft the   release notes' },
        ],
        [],
      ),
    );

    expect(doubled?.code).toBe('repeated_row');
    expect(doubled?.message).toContain('fresh-fit-91');
    expect(doubled?.message).toContain('fresh-fit-92');

    expect(
      refusalOf(() =>
        assertFreshRowsUnique([{ id: 'fresh-fit-91', prompt: 'rename the other function' }], otherRows),
      ),
    ).toBeNull();
  });
});

describe('assertFreshRun', () => {
  const refusalOf = (options: { arm: string; run: number | null }, rowIds: string[]) => {
    try {
      assertFreshRun(options, rowIds);
      return null;
    } catch (error) {
      return error as { code?: string; message?: string };
    }
  };

  it('refuses a fresh row outside the off and on arms', () => {
    expect(refusalOf({ arm: 'pre', run: 1 }, ['fresh-fit-01'])?.code).toBe('fresh_arm');
  });

  it('refuses a fresh row without a run number', () => {
    expect(refusalOf({ arm: 'on', run: null }, ['fresh-fit-01'])?.code).toBe('fresh_run');
  });

  it('accepts a fresh row under an arm and a run number', () => {
    expect(refusalOf({ arm: 'on', run: 2 }, ['fresh-fit-01'])).toBeNull();
  });

  it('accepts a corpus row with neither an arm nor a run number', () => {
    expect(refusalOf({ arm: 'pre', run: null }, ['cmd-create-readme-plain-tune-01'])).toBeNull();
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

describe('restorePointer', () => {
  const dirs: string[] = [];

  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  const arenaDir = () => {
    const dir = mkdtempSync(join(tmpdir(), 'skilled-behaviour-pointer-'));
    dirs.push(dir);
    return dir;
  };

  it('writes back a pointer a turn edited', () => {
    const dir = arenaDir();
    writeFileSync(join(dir, 'CLAUDE.md'), 'rewritten rules\n');

    expect(restorePointer(dir, '@AGENTS.md\n')).toBe(true);
    expect(readFileSync(join(dir, 'CLAUDE.md'), 'utf8')).toBe('@AGENTS.md\n');
  });

  it('writes back a pointer a turn deleted', () => {
    const dir = arenaDir();

    expect(restorePointer(dir, '@AGENTS.md\n')).toBe(true);
    expect(readFileSync(join(dir, 'CLAUDE.md'), 'utf8')).toBe('@AGENTS.md\n');
  });

  it('leaves an unchanged pointer or an absent one alone', () => {
    const unchanged = arenaDir();
    writeFileSync(join(unchanged, 'CLAUDE.md'), '@AGENTS.md\n');

    expect(restorePointer(unchanged, '@AGENTS.md\n')).toBe(false);
    expect(readFileSync(join(unchanged, 'CLAUDE.md'), 'utf8')).toBe('@AGENTS.md\n');

    const absent = arenaDir();
    expect(restorePointer(absent, null)).toBe(false);
    expect(readdirSync(absent)).toEqual([]);
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

  it('accepts the off and on arms', () => {
    const runnerPath = fileURLToPath(
      new URL('../scripts/routing-accuracy/run-command-behaviour.mjs', import.meta.url),
    );
    const off = spawnSync(process.execPath, [runnerPath, '--print-argv', 'claude', '--arm', 'off'], {
      encoding: 'utf8',
    });
    const on = spawnSync(process.execPath, [runnerPath, '--print-argv', 'claude', '--arm', 'on'], {
      encoding: 'utf8',
    });

    expect(off.status).toBe(0);
    expect(on.status).toBe(0);
  });

  it('reads a run number', () => {
    const runnerPath = fileURLToPath(
      new URL('../scripts/routing-accuracy/run-command-behaviour.mjs', import.meta.url),
    );
    const accepted = spawnSync(process.execPath, [runnerPath, '--print-argv', 'claude', '--run', '2'], {
      encoding: 'utf8',
    });
    const refused = spawnSync(process.execPath, [runnerPath, '--print-argv', 'claude', '--run', '0'], {
      encoding: 'utf8',
    });

    expect(accepted.status).toBe(0);
    expect(refused.status).toBe(2);
    expect(refused.stderr).toContain('--run: a whole number from 1 is required');
  });

  it('names Vibe as not measured rather than unknown', () => {
    const runnerPath = fileURLToPath(
      new URL('../scripts/routing-accuracy/run-command-behaviour.mjs', import.meta.url),
    );
    const refused = spawnSync(process.execPath, [runnerPath, '--print-argv', 'vibe'], {
      encoding: 'utf8',
    });

    expect(refused.status).toBe(2);
    expect(refused.stderr).toContain('runtime vibe is not measured: ');
    expect(refused.stderr).not.toContain('unknown runtime');
  });
});

describe('arena builder', () => {
  const builderPath = fileURLToPath(
    new URL('../scripts/routing-accuracy/prepare-behaviour-arena.mjs', import.meta.url),
  );

  const makeSource = (root: string, files: Record<string, string>) => {
    const source = join(root, 'source');
    mkdirSync(source);
    const gitRun = (args: string[]) => spawnSync('git', args, { cwd: source, encoding: 'utf8' });
    expect(gitRun(['init', '-q']).status).toBe(0);
    for (const [name, text] of Object.entries(files)) writeFileSync(join(source, name), text);
    expect(gitRun(['add', '.']).status).toBe(0);
    const committed = gitRun([
      '-c',
      'user.name=t',
      '-c',
      'user.email=t@example.invalid',
      '-c',
      'core.hooksPath=/dev/null',
      'commit',
      '-qm',
      'init',
    ]);
    expect(committed.status).toBe(0);
    return source;
  };

  const build = (source: string, arena: string) =>
    spawnSync(process.execPath, [builderPath, '--source', source, '--dest', arena], { encoding: 'utf8' });

  it('leaves a CLAUDE.md pointer git status does not list', () => {
    const root = mkdtempSync(join(tmpdir(), 'skilled-behaviour-arena-'));
    try {
      const source = makeSource(root, { 'AGENTS.md': '# rules\n' });
      const arena = join(root, 'arena');

      const built = build(source, arena);

      expect(built.status).toBe(0);
      expect(readFileSync(join(arena, 'CLAUDE.md'), 'utf8')).toBe('@AGENTS.md\n');
      const status = spawnSync('git', ['-C', arena, 'status', '--porcelain'], { encoding: 'utf8' });
      expect(status.stdout).toBe('');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('keeps a CLAUDE.md the source already commits', () => {
    const root = mkdtempSync(join(tmpdir(), 'skilled-behaviour-arena-'));
    try {
      const source = makeSource(root, { 'AGENTS.md': '# rules\n', 'CLAUDE.md': 'keep me' });
      const arena = join(root, 'arena');

      const built = build(source, arena);

      expect(built.status).toBe(0);
      expect(readFileSync(join(arena, 'CLAUDE.md'), 'utf8')).toBe('keep me');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
