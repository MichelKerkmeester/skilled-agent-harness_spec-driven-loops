// ───────────────────────────────────────────────────────────────────
// MODULE: Documentation Facts Drift
// ───────────────────────────────────────────────────────────────────
//
// Proves the facts check compares the scanned docs against the repository
// facts they describe: the executor-kind count, named files that must exist,
// and the routing flags against the workflow flag surface table. Each case
// builds a fixture root and spawns the real script with --facts, so the tested
// surface is the CLI the operator runs. The live-tree case records the state
// the later documentation fixes must reach.

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
// tests/unit -> runtime -> skill root -> repository root.
const SKILL = resolve(here, '..', '..', '..');
const REPO = resolve(here, '..', '..', '..', '..', '..', '..');
const SCRIPT = join(SKILL, 'runtime', 'scripts', 'check-documentation-drift.cjs');

const EXECUTOR_CONFIG_REL = '.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts';

const SPAWN_TIMEOUT_MS = 120_000;

const THREE_KIND_CONFIG = [
  'export const EXECUTOR_KINDS = [',
  "  'native',",
  "  'cli-codex',",
  "  'cli-pi',",
  '] as const;',
  '',
].join('\n');

type SpawnResult = {
  status: number | null;
  stdout: string;
  stderr: string;
};

type FactsPayload = {
  errors: string[];
};

// Spawn with an argv array, so a flag reaches the process as data rather than
// shell syntax.
function spawnScript(args: string[], env: NodeJS.ProcessEnv = process.env): SpawnResult {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: REPO,
    encoding: 'utf8',
    timeout: SPAWN_TIMEOUT_MS,
    env,
  });
  return {
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

function runFacts(root: string): SpawnResult {
  return spawnScript(['--facts', `--facts-root=${root}`], { ...process.env });
}

function runFactsOnLiveTree(): SpawnResult {
  return spawnScript(['--facts'], { ...process.env });
}

function factsErrors(result: SpawnResult): string[] {
  const payload = JSON.parse(result.stdout.trim()) as FactsPayload;
  return payload.errors;
}

function writeFixture(root: string, files: Record<string, string>): void {
  for (const [relative, content] of Object.entries(files)) {
    const absolute = join(root, ...relative.split('/'));
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, content, 'utf8');
  }
}

function withFixture(files: Record<string, string>, run: (root: string) => void): void {
  const root = mkdtempSync(join(tmpdir(), 'doc-facts-'));
  try {
    writeFixture(root, { [EXECUTOR_CONFIG_REL]: THREE_KIND_CONFIG, ...files });
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe('check-documentation-drift.cjs --facts', () => {
  it('reports a wrong executor-kind count and names the doc and line', () => {
    withFixture(
      {
        '.skilled/skills/system-deep-loop/deep-research/kinds.md':
          'Intro\n\nfour executor kinds are supported.\n',
      },
      (root) => {
        const result = runFacts(root);
        expect(result.status).toBe(1);
        expect(factsErrors(result)).toContain(
          'facts: .skilled/skills/system-deep-loop/deep-research/kinds.md:3: '
            + 'states four executor kinds, EXECUTOR_KINDS lists 3',
        );
      },
    );
  });

  it('accepts a matching executor-kind count', () => {
    withFixture(
      {
        '.skilled/skills/system-deep-loop/deep-research/kinds.md':
          'Intro\n\nthree executor kinds are supported.\n',
      },
      (root) => {
        const result = runFacts(root);
        expect(result.status).toBe(0);
        expect(factsErrors(result)).toEqual([]);
      },
    );
  });

  it('reports a named file that does not exist and names the token', () => {
    withFixture(
      {
        '.skilled/skills/system-deep-loop/deep-research/missing.md':
          'Run scripts/missing-thing.cjs now.\n',
      },
      (root) => {
        const result = runFacts(root);
        expect(result.status).toBe(1);
        expect(factsErrors(result)).toContain(
          'facts: .skilled/skills/system-deep-loop/deep-research/missing.md:1: '
            + 'names scripts/missing-thing.cjs, which does not exist',
        );
      },
    );
  });

  it('accepts a named file that exists', () => {
    withFixture(
      {
        '.skilled/skills/system-deep-loop/deep-research/scripts/present.cjs': '// present\n',
        '.skilled/skills/system-deep-loop/deep-research/present.md':
          'Uses scripts/present.cjs.\n',
      },
      (root) => {
        const result = runFacts(root);
        expect(result.status).toBe(0);
        expect(factsErrors(result)).toEqual([]);
      },
    );
  });

  it('reports only the missing member of a brace list', () => {
    withFixture(
      {
        '.skilled/skills/system-deep-loop/deep-research/scripts/present.cjs': '// present\n',
        '.skilled/skills/system-deep-loop/deep-research/brace.md':
          'Uses scripts/{present,missing}.cjs.\n',
      },
      (root) => {
        const result = runFacts(root);
        expect(result.status).toBe(1);
        const errors = factsErrors(result);
        expect(errors).toEqual([
          'facts: .skilled/skills/system-deep-loop/deep-research/brace.md:1: '
            + 'names scripts/missing.cjs, which does not exist',
        ]);
      },
    );
  });

  it('reports routing flags that differ from the workflow flag surface table', () => {
    const research = [
      '# Research',
      '',
      '## Mode Routing',
      '',
      '1. Run `--alpha` for the alpha route.',
      '',
      '## Workflow Flag Surface',
      '',
      '| Flag | Meaning |',
      '| --- | --- |',
      '| `--alpha` | Alpha route. |',
      '| `--beta` | Beta route. |',
      '',
    ].join('\n');
    withFixture(
      { '.skilled/commands/deep/research.md': research },
      (root) => {
        const result = runFacts(root);
        expect(result.status).toBe(1);
        const errors = factsErrors(result);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain('facts: .skilled/commands/deep/research.md:3: ');
        expect(errors[0]).toContain('routing step flags differ from the Workflow Flag Surface table');
        expect(errors[0]).toContain('only in routing []');
        expect(errors[0]).toContain('only in table ["--beta"]');
      },
    );
  });

  it('accepts a routing list that holds no flag', () => {
    const research = [
      '# Research',
      '',
      '## Mode Routing',
      '',
      '1. Ask the operator to choose a route.',
      '',
      '## Workflow Flag Surface',
      '',
      '| Flag | Meaning |',
      '| --- | --- |',
      '| `--alpha` | Alpha route. |',
      '',
    ].join('\n');
    withFixture(
      { '.skilled/commands/deep/research.md': research },
      (root) => {
        const result = runFacts(root);
        expect(result.status).toBe(0);
        expect(factsErrors(result)).toEqual([]);
      },
    );
  });

  it('skips files under an excluded changelog segment', () => {
    withFixture(
      {
        '.skilled/skills/system-deep-loop/deep-research/changelog/old.md':
          'nine executor kinds used scripts/missing.cjs.\n',
      },
      (root) => {
        const result = runFacts(root);
        expect(result.status).toBe(0);
        expect(factsErrors(result)).toEqual([]);
      },
    );
  });

  it('exits 2 when EXECUTOR_KINDS cannot be parsed', () => {
    withFixture(
      {
        [EXECUTOR_CONFIG_REL]: 'export const SOMETHING_ELSE = [];\n',
      },
      (root) => {
        const result = runFacts(root);
        expect(result.status).toBe(2);
        expect(result.stderr).toContain('cannot parse EXECUTOR_KINDS');
      },
    );
  });

  it('rejects an unknown flag with exit 2', () => {
    const result = spawnScript(['--bogus-xyz']);
    expect(result.status).toBe(2);
    expect(`${result.stderr}\n${result.stdout}`).toContain('--bogus-xyz');
  });

  // Deliberately red until the scanned docs match the facts they describe.
  it('live tree has no facts errors', () => {
    const result = runFactsOnLiveTree();
    expect(factsErrors(result)).toEqual([]);
    expect(result.status).toBe(0);
  });
});
