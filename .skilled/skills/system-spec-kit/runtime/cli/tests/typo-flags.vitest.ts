// Proves that the argv-parsing CLI surfaces in this suite reject a misspelled
// option instead of silently ignoring it. A flag that falls through parsing
// turns a gate into a vacuous pass, or lets a live path run when the caller
// asked for a dry one, so each case drives the real script (or its exported
// parser) and checks both the exit status and a combined stdout+stderr mention
// of the offending token. Fixtures live in per-case temp directories and are
// removed afterwards; no case writes inside the repository.

import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = import.meta.dirname;
const CLI = path.resolve(TEST_DIR, '..');
const DIST = path.join(CLI, 'dist');
const SKILL_ROOT = path.resolve(TEST_DIR, '..', '..', '..');
const SHARED = path.join(SKILL_ROOT, 'shared');
const REPO = path.resolve(SKILL_ROOT, '..', '..', '..');
const TSX_LOADER = path.join(SKILL_ROOT, 'node_modules', 'tsx', 'dist', 'loader.mjs');

const SPAWN_TIMEOUT_MS = 120_000;
const SLOW_TIMEOUT_MS = 300_000;

interface RunOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
}

interface RunResult {
  status: number | null;
  output: string;
}

function run(command: string, args: string[], options: RunOptions = {}): RunResult {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? REPO,
    encoding: 'utf8',
    timeout: options.timeout ?? SPAWN_TIMEOUT_MS,
    env: { ...process.env, ...options.env },
  });
  return {
    status: result.status,
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`,
  };
}

function runNode(scriptPath: string, args: string[], options: RunOptions = {}): RunResult {
  return run(process.execPath, [scriptPath, ...args], options);
}

function runTsx(scriptPath: string, args: string[], options: RunOptions = {}): RunResult {
  return run(process.execPath, ['--import', TSX_LOADER, scriptPath, ...args], options);
}

function withTempDir<T>(fn: (dir: string) => T): T {
  const dir = mkdtempSync(path.join(tmpdir(), 'typo-flags-'));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function listTree(dir: string): string[] {
  return [...readdirSync(dir, { recursive: true })].sort();
}

describe('typo-proof CLI flag handling', () => {
  it('generate-context.js parseArguments rejects a misspelled --session-id', async () => {
    const modulePath = path.join(DIST, 'continuity', 'generate-context.js');
    const module = (await import(pathToFileURL(modulePath).href)) as {
      parseArguments: (argv: string[]) => Promise<unknown>;
    };

    await expect(
      module.parseArguments(['--json', '{"specFolder":"x"}', 'specs/x', '--sesion-id', 'abc']),
    ).rejects.toThrow('--sesion-id');
  });

  it('generate-description.js rejects a misspelled --description', () => {
    withTempDir((tmp) => {
      const folder = path.join(tmp, '999-x');
      mkdirSync(folder, { recursive: true });
      writeFileSync(path.join(folder, 'spec.md'), '# 999-x\n', 'utf8');

      const result = runNode(path.join(DIST, 'spec-folder', 'generate-description.js'), [
        folder,
        tmp,
        '--descriptoin',
        'CUSTOM',
      ]);

      expect(result.status).toBe(1);
      expect(result.output).toContain('--descriptoin');
    });
  });

  it('env-reader-table.mjs rejects a misspelled --check', () => {
    const result = runNode(path.join(SHARED, 'scripts', 'env-reader-table.mjs'), ['--chek']);

    expect(result.status).toBe(2);
    expect(result.output).toContain('--chek');
  });

  it('smart-router-measurement.js rejects a misspelled --no-record-telemetry', {
    timeout: SLOW_TIMEOUT_MS,
  }, () => {
    withTempDir((tmp) => {
      const result = runNode(
        path.join(DIST, 'observability', 'smart-router-measurement.js'),
        ['--workspace-root', tmp, '--no-record-telemety'],
        { timeout: SLOW_TIMEOUT_MS },
      );

      expect(result.status).toBe(2);
      expect(result.output).toContain('--no-record-telemety');
    });
  });

  it('generate-command-routers.cjs rejects a misspelled flag', () => {
    const result = runNode(path.join(CLI, 'codex', 'generate-command-routers.cjs'), ['--bogus-xyz']);

    expect(result.status).toBe(2);
    expect(result.output).toContain('--bogus-xyz');
  });

  it('generate-command-routers.cjs accepts its documented --check flag', () => {
    const result = runNode(path.join(CLI, 'codex', 'generate-command-routers.cjs'), ['--check']);

    expect(result.status).toBe(0);
    expect(result.output).toContain('command-router drift check');
  });

  it('generate-command-routers.cjs rejects --check together with --write', () => {
    const result = runNode(path.join(CLI, 'codex', 'generate-command-routers.cjs'), ['--check', '--write']);

    expect(result.status).toBe(2);
  });

  it('dist-freshness.cjs exits 1 when check detects an unknown package', () => {
    const result = runNode(path.join(CLI, 'lib', 'dist-freshness.cjs'), [
      'check',
      '--package',
      'not-a-real-package',
    ]);

    expect(result.status).toBe(1);
  });

  it('dist-freshness.cjs keeps exit 64 and names a misspelled flag in check-all', () => {
    const result = runNode(path.join(CLI, 'lib', 'dist-freshness.cjs'), ['check-all', '--bogus-xyz']);

    expect(result.status).toBe(64);
    expect(result.output).toContain('--bogus-xyz');
  });

  it('check-markdown-links.cjs rejects a misspelled flag', () => {
    const result = runNode(path.join(CLI, 'check-markdown-links.cjs'), ['--bogus-xyz']);

    expect(result.status).toBe(2);
    expect(result.output).toContain('--bogus-xyz');
  });

  it('smart-router-analyze.js rejects a misspelled flag and leaves its workspace untouched', {
    timeout: SLOW_TIMEOUT_MS,
  }, () => {
    withTempDir((tmp) => {
      const before = listTree(tmp);
      const result = runNode(
        path.join(DIST, 'observability', 'smart-router-analyze.js'),
        ['--workspace-root', tmp, '--bogus-xyz'],
        { timeout: SLOW_TIMEOUT_MS },
      );
      const after = listTree(tmp);

      expect(result.status).toBe(2);
      expect(result.output).toContain('--bogus-xyz');
      expect(after).toEqual(before);
    });
  });

  it('process-sweep.js rejects a misspelled flag after the plan subcommand', () => {
    const result = runNode(path.join(DIST, 'ops', 'process-sweep.js'), ['plan', '--bogus-xyz']);

    expect(result.status).toBe(2);
    expect(result.output).toContain('--bogus-xyz');
  });

  it('process-memory-harness.js rejects a misspelled flag after the snapshot subcommand', () => {
    const result = runNode(path.join(DIST, 'ops', 'process-memory-harness.js'), [
      'snapshot',
      '--bogus-xyz',
    ]);

    expect(result.status).toBe(2);
    expect(result.output).toContain('--bogus-xyz');
  });

  it('is-phase-parent.js exits 2 when the check command is missing its folder', () => {
    const result = runNode(path.join(DIST, 'spec', 'is-phase-parent.js'), ['check']);

    expect(result.status).toBe(2);
  });

  it('is-phase-parent.js exits 2 and names an unknown command', () => {
    withTempDir((tmp) => {
      const result = runNode(path.join(DIST, 'spec', 'is-phase-parent.js'), ['bogus-command', tmp]);

      expect(result.status).toBe(2);
      expect(result.output).toContain('bogus-command');
    });
  });

  it('check-frontmatter-values-helper.cjs exits 2 and names an unreadable input', () => {
    withTempDir((tmp) => {
      const missing = path.join(tmp, 'missing.md');
      const result = runNode(path.join(CLI, 'rules', 'check-frontmatter-values-helper.cjs'), [missing]);

      expect(result.status).toBe(2);
      expect(result.output).toContain('missing.md');
    });
  });

  it('check-source-tags-helper.mjs rejects a misspelled flag', () => {
    withTempDir((tmp) => {
      const result = runNode(path.join(CLI, 'rules', 'check-source-tags-helper.mjs'), [
        tmp,
        '--bogus-xyz',
      ]);

      expect(result.status).toBe(2);
      expect(result.output).toContain('--bogus-xyz');
    });
  });

  it('check-native-modules.sh exits 1 when the version marker is missing', () => {
    withTempDir((tmp) => {
      const copy = path.join(tmp, 'a', 'b', 'c', 'check-native-modules.sh');
      mkdirSync(path.dirname(copy), { recursive: true });
      copyFileSync(path.join(CLI, 'setup', 'check-native-modules.sh'), copy);

      const result = run('bash', [copy]);

      expect(result.status).toBe(1);
      expect(result.output).toContain('[FAIL]');
    });
  });

  it('check-graph-metadata-child-drift.sh warns when the child scanner crashes', () => {
    withTempDir((tmp) => {
      const parent = path.join(tmp, '900-drift-parent');
      mkdirSync(path.join(parent, '001-child'), { recursive: true });
      writeFileSync(path.join(parent, '001-child', 'spec.md'), '# Child\n', 'utf8');
      writeFileSync(
        path.join(parent, 'graph-metadata.json'),
        JSON.stringify(
          {
            schema_version: 1,
            packet_id: 'test/900-drift-parent',
            spec_folder: 'test/900-drift-parent',
            parent_id: null,
            children_ids: [],
            manual: { depends_on: [], supersedes: [], related_to: [] },
            derived: { trigger_phrases: [], key_files: [], source_docs: [] },
          },
          null,
          2,
        ),
        'utf8',
      );

      const scanner = path.join(tmp, 'throw.mjs');
      writeFileSync(scanner, "export function listDerivedChildNames() { throw new Error('scanner crashed'); }\n", 'utf8');
      const rule = path.join(CLI, 'rules', 'check-graph-metadata-child-drift.sh');

      const result = run(
        'bash',
        ['-c', 'set +u; source "$RULE"; run_check "$FOLDER" 3; echo "STATUS=$RULE_STATUS"'],
        {
          env: {
            RULE: rule,
            FOLDER: parent,
            SPECKIT_CHILD_SCANNER: scanner,
            SPECKIT_CHILD_DRIFT_ENFORCE: 'true',
          },
        },
      );

      expect(result.output).toContain('STATUS=warn');
    });
  });

  it('inline-gate-renderer.sh rejects a misspelled flag', () => {
    withTempDir((tmp) => {
      const template = path.join(tmp, 'in.tmpl');
      writeFileSync(template, 'hello\n', 'utf8');

      const result = run('bash', [
        path.join(CLI, 'templates', 'inline-gate-renderer.sh'),
        '--level',
        '2',
        template,
        '--bogus-xyz',
      ]);

      expect(result.status).toBe(2);
      expect(result.output).toContain('--bogus-xyz');
    });
  });

  it('inline-gate-renderer.sh JavaScript fallback rejects a misspelled flag', () => {
    withTempDir((tmp) => {
      const template = path.join(tmp, 'in.tmpl');
      writeFileSync(template, 'hello\n', 'utf8');

      const copy = path.join(tmp, 'x', 'inline-gate-renderer.sh');
      mkdirSync(path.dirname(copy), { recursive: true });
      copyFileSync(path.join(CLI, 'templates', 'inline-gate-renderer.sh'), copy);

      const result = run('bash', [copy, '--level', '2', template, '--bogus-xyz']);

      expect(result.status).toBe(2);
      expect(result.output).toContain('--bogus-xyz');
    });
  });

  it('unactioned-recorded-failure-audit.mjs exits 2 and names a missing input', () => {
    withTempDir((tmp) => {
      const missing = path.join(tmp, 'does-not-exist.md');
      const result = runNode(path.join(CLI, 'validation', 'unactioned-recorded-failure-audit.mjs'), [
        missing,
      ]);

      expect(result.status).toBe(2);
      expect(result.output).toContain('does-not-exist.md');
    });
  });

  it('unactioned-recorded-failure-audit.mjs rejects a misspelled flag', () => {
    const result = runNode(path.join(CLI, 'validation', 'unactioned-recorded-failure-audit.mjs'), [
      '--bogus-xyz',
    ]);

    expect(result.status).toBe(2);
    expect(result.output).toContain('--bogus-xyz');
  });

  it('ephemeral-pointer-audit.mjs rejects a misspelled flag', { timeout: SLOW_TIMEOUT_MS }, () => {
    const result = runNode(
      path.join(CLI, 'validation', 'ephemeral-pointer-audit.mjs'),
      ['--bogus-xyz'],
      { timeout: SLOW_TIMEOUT_MS },
    );

    expect(result.status).toBe(2);
    expect(result.output).toContain('--bogus-xyz');
  });

  it('ephemeral-pointer-audit.mjs exits 2 and names a missing target', { timeout: SLOW_TIMEOUT_MS }, () => {
    withTempDir((tmp) => {
      const missing = path.join(tmp, 'does-not-exist');
      const result = runNode(
        path.join(CLI, 'validation', 'ephemeral-pointer-audit.mjs'),
        [missing],
        { timeout: SLOW_TIMEOUT_MS },
      );

      expect(result.status).toBe(2);
      expect(result.output).toContain('does-not-exist');
    });
  });

  it('validate-command-tree-parity.sh keeps exit 64 when a required side is missing', () => {
    withTempDir((tmp) => {
      const result = run('bash', [path.join(CLI, 'validate-command-tree-parity.sh'), '--left', tmp]);

      expect(result.status).toBe(64);
      expect(result.output).toContain('--right');
    });
  });

  it('template-phrase-lint.mjs answers --help with usage instead of a scan', () => {
    const result = runNode(path.join(CLI, 'spec', 'template-phrase-lint.mjs'), ['--help']);

    expect(result.status).toBe(0);
    expect(result.output).toContain('Usage');
    expect(result.output).not.toContain('checked');
  });

  it('template-phrase-lint.mjs rejects a misspelled flag', () => {
    const result = runNode(path.join(CLI, 'spec', 'template-phrase-lint.mjs'), ['--bogus-xyz']);

    expect(result.status).toBe(2);
    expect(result.output).toContain('--bogus-xyz');
  });

  it('strict-pass-freshness.ts rejects a --roots value shaped like a flag', () => {
    const result = runTsx(path.join(CLI, 'sweep', 'strict-pass-freshness.ts'), [
      '--roots',
      '--baseline=base.json',
    ]);

    expect(result.status).toBe(2);
    expect(result.output).toContain('--roots');
  });

  it('repo-era.mjs answers --help with usage instead of a JSON report', () => {
    const result = runNode(path.join(CLI, 'spec', 'repo-era.mjs'), ['--help']);

    expect(result.status).toBe(0);
    expect(result.output).toContain('Usage');
    expect(result.output.trimStart().startsWith('{')).toBe(false);
  });

  it('repo-era.mjs rejects a misspelled flag', () => {
    const result = runNode(path.join(CLI, 'spec', 'repo-era.mjs'), ['--bogus-xyz']);

    expect(result.status).toBe(2);
    expect(result.output).toContain('--bogus-xyz');
  });

  it('evidence-marker-audit.ts rejects a misspelled flag alongside --folder=...', () => {
    withTempDir((tmp) => {
      const result = runTsx(path.join(CLI, 'validation', 'evidence-marker-audit.ts'), [
        `--folder=${tmp}`,
        '--bogus-xyz',
      ]);

      expect(result.status).toBe(2);
      expect(result.output).toContain('--bogus-xyz');
    });
  });

  it('evidence-marker-audit.ts accepts the space form of --folder', () => {
    withTempDir((tmp) => {
      // Spawn directly rather than through run(): the report is JSON on stdout, and
      // run() merges stderr into output, so parsing needs the raw stdout stream.
      const result = spawnSync(
        process.execPath,
        [
          '--import',
          TSX_LOADER,
          path.join(CLI, 'validation', 'evidence-marker-audit.ts'),
          '--folder',
          tmp,
          '--json',
        ],
        {
          cwd: REPO,
          encoding: 'utf8',
          timeout: SPAWN_TIMEOUT_MS,
          env: { ...process.env },
        },
      );

      expect(result.status).toBe(0);
      const payload = JSON.parse(result.stdout) as { folders?: Array<{ folder?: string }> };
      expect(payload.folders?.[0]?.folder).toBe(tmp);
    });
  });

  it('create.sh --help lists the --path option', () => {
    const result = run('bash', [path.join(CLI, 'spec', 'create.sh'), '--help']);

    expect(result.output).toContain('--path');
  });
});
