// ───────────────────────────────────────────────────────────────
// MODULE: Command Policy Derivation
// ───────────────────────────────────────────────────────────────

// Pins the policy ladder and the closed key vocabularies that feed it. The ladder
// is the only place an ask becomes a run, so each rung is asserted on its own: a
// reordered branch would quietly promote a mutating command past the operator. The
// real-tree tests read the repository once and assert the inventory agrees with
// itself, which is the property a stale generated projection would break.
//
// A standalone skill declares its commands without a hub, so nothing but the
// deriver's activation rule keeps them reachable. That rule lives in the main
// path rather than an exported helper, so one case stages the folder layout the
// deriver resolves from its own location and runs the real generator over it.

import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const RUNTIME_ROOT = join(import.meta.dirname, '..');
// The deriver loads its YAML parser from the workspace's shared module folder,
// which a staged copy no longer sits under.
const SHARED_MODULES = join(RUNTIME_ROOT, '..', '..', '..', 'node_modules');

const bridges = require('../scripts/command-bridges/derive-command-bridges.cjs') as {
  commandTreeNames(commandsRoot?: string): string[];
  validateRiskKeys(record: Record<string, unknown>, label: string, requireTarget?: boolean): void;
  derivePolicy(record: RiskRecord): string;
  doctorLeadPhrases(
    item: { mutating: string; lead_phrases: string[] },
    label: string,
    triggerPhrases: string[],
  ): string[];
  metadataRiskRecords(skillsRoot?: string): Array<{ command: string }>;
  identityViolations(input: {
    treeCommands: string[];
    metadataCommands: string[];
    doctorCommands: string[];
  }): string[];
  commandPolicies(
    skillsRoot?: string,
    routesPath?: string,
  ): Array<{ command: string; route: string | null; policy: string }>;
};

interface RiskRecord {
  mutating: string;
  ask_first?: string[];
  write_scope?: string;
  gate3_location?: string;
  doctor?: boolean;
}

const POLICY_VALUES = ['run', 'start', 'ask'];

let fixtureRoot = '';
let commandsRoot = '';
let skillsRoot = '';

// Fixtures live in a temp tree so a partially written one can never be picked up by
// the repository's own inventory scan.
function createFixtureRoot(): string {
  return mkdtempSync(join(tmpdir(), 'command-policy-derivation-'));
}

function writeFile(path: string, body = '# command\n'): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, body);
}

interface GeneratedBridge {
  readonly command: string;
  readonly standalone: boolean;
  readonly runtime: {
    readonly typescript: { readonly enabled: boolean };
    readonly python: { readonly enabled: boolean };
  };
}

interface StagedDeriverRepo {
  readonly script: string;
  readonly output: string;
}

// The deriver resolves every source and output path from its own location, so a
// copy six levels below a temp root reads the fixture tree rather than the
// repository, and nothing outside that tree is written.
function stageDeriverRepo(root: string): StagedDeriverRepo {
  const runtime = join(root, '.skilled', 'skills', 'system-skill-advisor', 'runtime');
  const bridges = join(runtime, 'scripts', 'command-bridges');
  const staged = {
    script: join(bridges, 'derive-command-bridges.cjs'),
    output: join(bridges, 'command-bridges.generated.json'),
  };

  mkdirSync(bridges, { recursive: true });
  mkdirSync(join(runtime, 'lib', 'scorer'), { recursive: true });
  copyFileSync(join(RUNTIME_ROOT, 'scripts', 'command-bridges', 'derive-command-bridges.cjs'), staged.script);
  copyFileSync(
    join(RUNTIME_ROOT, 'lib', 'scorer', 'projection.ts'),
    join(runtime, 'lib', 'scorer', 'projection.ts'),
  );
  copyFileSync(
    join(RUNTIME_ROOT, 'scripts', 'skill_advisor.py'),
    join(runtime, 'scripts', 'skill_advisor.py'),
  );
  copyFileSync(
    join(RUNTIME_ROOT, 'lib', 'command-attach.ts'),
    join(runtime, 'lib', 'command-attach.ts'),
  );
  writeFileSync(join(bridges, 'scoring-compatibility.json'), JSON.stringify({
    schemaVersion: 1,
    typescript: [],
    python: [],
    pythonOwnerNormalization: {},
  }));
  writeFile(join(bridges, 'command-bridges.generated.json'), '{}\n');
  writeFile(join(root, '.skilled', 'commands', 'gamma', 'one.md'));
  writeFile(
    join(root, '.skilled', 'commands', 'doctor', '_routes.yaml'),
    'routes: []\nmcp_subroutes: []\nstandalone: []\n',
  );
  return staged;
}

beforeAll(() => {
  fixtureRoot = createFixtureRoot();

  commandsRoot = join(fixtureRoot, 'commands');
  // Only alpha/one.md names a command: a README and a .contract.md describe one
  // instead of being one, a local- file belongs to a single checkout, a nested
  // asset is not a router, a local- group is skipped whole, and a file directly in
  // the root names no group at all.
  writeFile(join(commandsRoot, 'alpha', 'one.md'));
  writeFile(join(commandsRoot, 'alpha', 'README.md'));
  writeFile(join(commandsRoot, 'alpha', 'one.contract.md'));
  writeFile(join(commandsRoot, 'alpha', 'local-mine.md'));
  writeFile(join(commandsRoot, 'alpha', 'assets', 'deep.md'));
  writeFile(join(commandsRoot, 'local-group', 'x.md'));
  writeFile(join(commandsRoot, 'top.md'));

  skillsRoot = join(fixtureRoot, 'skills');
  writeFile(
    join(skillsRoot, 'beta', 'command-metadata.json'),
    JSON.stringify([{ command: '/a:one', ownerMode: 'beta' }]),
  );
});

afterAll(() => {
  if (fixtureRoot) rmSync(fixtureRoot, { recursive: true, force: true });
});

describe('command policy derivation', () => {
  it('derives the policy from the risk keys in a fixed order', () => {
    const rows: Array<[string, RiskRecord, string]> = [
      ['an ask-first reason wins over everything', { mutating: 'mutates', ask_first: ['spend'] }, 'ask'],
      ['an ask-first reason applies to a read-only route too', { mutating: 'read-only', ask_first: ['settings'] }, 'ask'],
      ['a mutating doctor route asks', { mutating: 'mutates', doctor: true }, 'ask'],
      ['a read-only route runs', { mutating: 'read-only' }, 'run'],
      ['an add-only route confined to the spec folder runs', { mutating: 'add-only', write_scope: 'spec-folder' }, 'run'],
      ['an add-only route elsewhere is an ordinary task', { mutating: 'add-only' }, 'start'],
      ['a mutating route is an ordinary task', { mutating: 'mutates' }, 'start'],
    ];

    for (const [label, record, expected] of rows) {
      expect(bridges.derivePolicy(record), label).toBe(expected);
    }
  });

  it('rejects a lead phrase with no state word on a route that runs unprompted', () => {
    expect(() => bridges.doctorLeadPhrases(
      { mutating: 'read-only', lead_phrases: ['disable the gate'] },
      'fixture read-only route',
      ['disable the gate'],
    )).toThrow(/needs a state or health word/);
  });

  it('accepts the same lead phrase on a mutating route, whose policy asks first', () => {
    expect(bridges.doctorLeadPhrases(
      { mutating: 'mutates', lead_phrases: ['disable the gate'] },
      'fixture mutates route',
      ['disable the gate'],
    )).toEqual(['disable the gate']);
  });

  it('rejects a missing class and unknown values', () => {
    expect(() => bridges.validateRiskKeys({}, 'no-class')).toThrow(/no-class/);
    expect(() => bridges.validateRiskKeys({ mutating: 'safe' }, 'bad-class')).toThrow(/bad-class/);
    expect(() => bridges.validateRiskKeys({ mutating: 'mutates', ask_first: ['money'] }, 'bad-reason')).toThrow(
      /bad-reason/,
    );
    expect(() => bridges.validateRiskKeys({ mutating: 'add-only', write_scope: 'anywhere' }, 'bad-scope')).toThrow(
      /bad-scope/,
    );
    // A reachable command has to say where its writes land, so the target is
    // required even when the class alone would otherwise validate.
    expect(() => bridges.validateRiskKeys({ mutating: 'mutates' }, 'bad-target', true)).toThrow(/bad-target/);

    expect(() => bridges.validateRiskKeys(
      { mutating: 'mutates', gate3_location: 'x', ask_first: ['spend'] },
      'good-record',
      true,
    )).not.toThrow();
  });

  it('reads commands two levels deep and skips documents and private files', () => {
    expect(bridges.commandTreeNames(commandsRoot)).toEqual(['/alpha:one']);
  });

  it('names a command file with no declaration and a declaration with no file', () => {
    const violations = bridges.identityViolations({
      treeCommands: ['/a:one', '/a:two'],
      metadataCommands: ['/a:one', '/a:gone'],
      doctorCommands: [],
    });

    expect(violations).toHaveLength(2);
    expect(violations.some(
      (line) => line.includes('/a:two') && line.includes('no command-metadata.json entry'),
    )).toBe(true);
    expect(violations.some(
      (line) => line.includes('/a:gone') && line.includes('has no command file'),
    )).toBe(true);

    expect(bridges.identityViolations({
      treeCommands: ['/a:one'],
      metadataCommands: ['/a:one'],
      doctorCommands: [],
    })).toEqual([]);
  });

  it('fails a metadata entry that states no class', () => {
    expect(() => bridges.metadataRiskRecords(skillsRoot)).toThrow(/\/a:one/);
  });

  it('activates a standalone metadata command with no compatibility row in both runtimes', () => {
    const root = createFixtureRoot();
    try {
      const staged = stageDeriverRepo(root);
      writeFile(
        join(root, '.skilled', 'skills', 'gamma', 'command-metadata.json'),
        JSON.stringify([{
          command: '/gamma:one',
          ownerMode: 'gamma',
          description: 'Run the fixture command',
          mutating: 'read-only',
          gate3_location: 'nothing outside the fixture',
          userIntent: { ownedSignals: ['run the fixture', 'fixture command'] },
        }]),
      );

      execFileSync(process.execPath, [staged.script], {
        cwd: root,
        encoding: 'utf8',
        env: { ...process.env, NODE_PATH: SHARED_MODULES },
      });

      const generated = JSON.parse(readFileSync(staged.output, 'utf8')) as {
        readonly entries: readonly GeneratedBridge[];
      };
      const entry = generated.entries.find((row) => row.command === '/gamma:one');

      expect(entry, 'the fixture command is derived').toBeDefined();
      expect(entry?.standalone).toBe(true);
      expect(entry?.runtime.typescript.enabled).toBe(true);
      expect(entry?.runtime.python.enabled).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('emits a policy for every command file in the repository', () => {
    const policies = bridges.commandPolicies();
    const policyCommands = [...new Set(policies.map((record) => record.command))].sort();
    const treeCommands = [...new Set(bridges.commandTreeNames())].sort();

    expect(policyCommands).toEqual(treeCommands);
    expect(policies.length).toBeGreaterThan(0);
    for (const record of policies) {
      expect(POLICY_VALUES).toContain(record.policy);
    }
  });
});
