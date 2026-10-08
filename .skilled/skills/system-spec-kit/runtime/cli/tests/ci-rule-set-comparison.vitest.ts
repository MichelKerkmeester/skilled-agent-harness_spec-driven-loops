// ───────────────────────────────────────────────────────────────────
// MODULE: CI Rule-Set Comparison
// ───────────────────────────────────────────────────────────────────
// The changed-packet gate blocks a pull request only when it introduces a rule
// that was not already failing at the merge base. These tests execute the gate's
// own run block from the workflow against a stub validator, so each asserted
// outcome — regression, pre-existing failure, named new rules, and fail-closed
// handling of an unparseable report — is the comparison's real behavior rather
// than a reimplementation.
//
// The scheduled sweep applies the same idea to strict-pass validation: it
// compares each folder against a previously stored report. Its baseline-absent,
// pass-then-fail, and still-failing cases run through the sweep script itself,
// so the baseline comparison is exercised rather than simulated.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import yaml from 'js-yaml';
import { afterAll, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');
const WORKFLOW_PATH = path.join(WORKSPACE_ROOT, '.github', 'workflows', 'changed-packet-validation.yml');
const VALIDATION_STEP_NAME = 'Validate the packets this PR changed';
const WEEKLY_WORKFLOW_PATH = path.join(WORKSPACE_ROOT, '.github', 'workflows', 'strict-pass-freshness-report.yml');
const BASELINE_STEP_NAME = 'Fetch the previous baseline report';
const FIXTURE_PACKET = 'specs/demo/001-fixture';
const BASH = 'bash';

interface WorkflowStep {
  name?: string;
  run?: string;
}

interface WorkflowDocument {
  jobs?: Record<string, { steps?: WorkflowStep[] }>;
}

interface GateScenario {
  headReport: string;
  baseReport: string;
}

interface GateOutcome {
  exitCode: number | null;
  output: string;
}

interface BaselineScenario {
  runListOutput: string;
  report: string;
}

interface BaselineOutcome {
  root: string;
  exitCode: number | null;
  output: string;
  githubEnv: Record<string, string>;
}

interface FixtureRepo {
  root: string;
  tmpDir: string;
  binDir: string;
  baseSha: string;
  headSha: string;
}

const createdRoots: string[] = [];
let cachedRunBlock: string | null = null;

function loadRunBlock(): string {
  if (cachedRunBlock !== null) return cachedRunBlock;
  const workflow = yaml.load(fs.readFileSync(WORKFLOW_PATH, 'utf8')) as WorkflowDocument;
  const step = workflow.jobs?.['changed-packets']?.steps?.find(
    (candidate) => candidate.name === VALIDATION_STEP_NAME,
  );
  if (!step?.run) {
    throw new Error(`Workflow step "${VALIDATION_STEP_NAME}" carries no run block`);
  }
  cachedRunBlock = step.run;
  return cachedRunBlock;
}

let cachedBaselineRunBlock: string | null = null;

function loadBaselineRunBlock(): string {
  if (cachedBaselineRunBlock !== null) return cachedBaselineRunBlock;
  const workflow = yaml.load(fs.readFileSync(WEEKLY_WORKFLOW_PATH, 'utf8')) as WorkflowDocument;
  const step = workflow.jobs?.['strict-pass-freshness']?.steps?.find(
    (candidate) => candidate.name === BASELINE_STEP_NAME,
  );
  if (!step?.run) {
    throw new Error(`Workflow step "${BASELINE_STEP_NAME}" carries no run block`);
  }
  cachedBaselineRunBlock = step.run;
  return cachedBaselineRunBlock;
}

function writeFile(filePath: string, content: string, mode = 0o644): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, { mode });
}

function git(cwd: string, args: string[]): string {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr}`);
  }
  return (result.stdout ?? '').trim();
}

// The gate runs the validator twice: once against the head checkout and once
// against a materialised worktree of the merge base. The head packet path is
// repository-relative while the base one is absolute, which is how each
// invocation selects its canned report. No packet content is ever graded, and
// the gate tolerates a nonzero validator exit, so the stub always exits zero.
const STUB_VALIDATOR = `#!/usr/bin/env bash
case "\${1:-}" in
  /*) report="\${CI_STUB_BASE_REPORT:-}" ;;
  *) report="\${CI_STUB_HEAD_REPORT:-}" ;;
esac
printf '%s' "$report"
`;

// BSD paste reads standard input only when handed an explicit "-" operand; the
// gate's "paste -s -d ," form leans on GNU paste, which reads standard input by
// default. Where the host paste lacks that behavior, the shim supplies the
// operand; it formats rule names only, so the comparison itself stays untouched.
const PASTE_SHIM = `#!/usr/bin/env bash
args=("$@")
expect_delimiter=0
has_file_operand=0
for arg in "\${args[@]}"; do
  if [ "$expect_delimiter" -eq 1 ]; then
    expect_delimiter=0
    continue
  fi
  case "$arg" in
    -d) expect_delimiter=1 ;;
    -*) ;;
    *) has_file_operand=1 ;;
  esac
done
if [ "$has_file_operand" -eq 0 ]; then
  args+=("-")
fi
exec /usr/bin/paste "\${args[@]}"
`;

const PASTE_READS_STDIN =
  spawnSync(BASH, ['-c', "printf 'a\\nb\\n' | paste -s -d ,"], { encoding: 'utf8' }).status === 0;

// The comparison keeps each packet's failing set in an associative array, which
// the bash Apple ships predates. On such a host the storage is projected onto
// plain variables while the comparison command, its decision branch and its
// reported messages stay exactly as the workflow wrote them. Anchor counts are
// asserted so a workflow edit fails loudly instead of skipping the projection.
const ASSOCIATIVE_ARRAY_PROJECTION: ReadonlyArray<{ from: string; to: string; count: number }> = [
  { from: 'declare -A head_failing=()', to: 'head_failing=""', count: 1 },
  {
    from: 'head_failing["$packet"]="$rules"',
    to: 'head_failing="$rules"\n            head_failing_packet="$packet"',
    count: 1,
  },
  { from: '${head_failing[$packet]+set}', to: '${head_failing_packet+set}', count: 1 },
  { from: '"${head_failing[$packet]}"', to: '"$head_failing"', count: 2 },
];

function projectAssociativeArrays(script: string): string {
  let projected = script;
  for (const { from, to, count } of ASSOCIATIVE_ARRAY_PROJECTION) {
    const occurrences = projected.split(from).length - 1;
    if (occurrences !== count) {
      throw new Error(
        `Gate run block changed: expected ${count} occurrence(s) of "${from}", found ${occurrences}`,
      );
    }
    projected = projected.split(from).join(to);
  }
  return projected;
}

const BASH_SUPPORTS_ASSOCIATIVE_ARRAYS =
  spawnSync(BASH, ['-c', 'declare -A probe=()'], { encoding: 'utf8' }).status === 0;

function renderRunBlock(runBlock: string, fixture: FixtureRepo): string {
  return runBlock
    .replaceAll('${{ github.event_name }}', 'pull_request')
    .replaceAll('${{ github.event.pull_request.base.sha }}', fixture.baseSha)
    .replaceAll('${{ github.event.pull_request.head.sha }}', fixture.headSha)
    .replaceAll('${{ github.event.before }}', fixture.baseSha)
    .replaceAll('${{ github.sha }}', fixture.headSha);
}

function gateScriptFor(fixture: FixtureRepo): string {
  const rendered = renderRunBlock(loadRunBlock(), fixture);
  return BASH_SUPPORTS_ASSOCIATIVE_ARRAYS ? rendered : projectAssociativeArrays(rendered);
}

function createFixtureRepo(): FixtureRepo {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-rule-set-'));
  createdRoots.push(root);
  const tmpDir = path.join(root, 'gate-tmp');
  fs.mkdirSync(tmpDir, { recursive: true });
  const binDir = path.join(root, 'gate-bin');
  fs.mkdirSync(binDir, { recursive: true });

  git(root, ['init', '--quiet', '-b', 'main']);
  git(root, ['config', 'user.name', 'CI Rule-Set Test']);
  git(root, ['config', 'user.email', 'ci-rule-set-test@example.invalid']);
  git(root, ['config', 'commit.gpgsign', 'false']);
  // The global hooks path and excludes file are operator configuration; point
  // the fixture at nonexistent paths so fixture commits execute no real hooks
  // and the fixture's own tree is never filtered by a personal ignore list.
  git(root, ['config', 'core.hooksPath', path.join(root, '.git', 'disabled-hooks')]);
  git(root, ['config', 'core.excludesFile', path.join(root, '.git', 'disabled-excludes')]);

  // The run block invokes the validator by a repository-relative path, so the
  // stub has to live at that path inside the fixture rather than on PATH.
  writeFile(
    path.join(root, '.opencode', 'skills', 'system-spec-kit', 'runtime', 'cli', 'spec', 'validate.sh'),
    STUB_VALIDATOR,
    0o755,
  );
  if (!PASTE_READS_STDIN) {
    writeFile(path.join(binDir, 'paste'), PASTE_SHIM, 0o755);
  }

  const packetSpec = path.join(root, FIXTURE_PACKET, 'spec.md');
  writeFile(packetSpec, '# Fixture Packet\n');
  git(root, ['add', '-A']);
  git(root, ['commit', '--quiet', '--no-verify', '-m', 'base']);
  const baseSha = git(root, ['rev-parse', 'HEAD']);

  writeFile(packetSpec, '# Fixture Packet\n\nChanged for the head side.\n');
  git(root, ['add', '-A']);
  git(root, ['commit', '--quiet', '--no-verify', '-m', 'head']);
  const headSha = git(root, ['rev-parse', 'HEAD']);

  return { root, tmpDir, binDir, baseSha, headSha };
}

function runGate(scenario: GateScenario): GateOutcome {
  const fixture = createFixtureRepo();
  const result = spawnSync(BASH, ['-c', gateScriptFor(fixture)], {
    cwd: fixture.root,
    encoding: 'utf8',
    env: {
      ...process.env,
      TMPDIR: fixture.tmpDir,
      PATH: `${fixture.binDir}:${process.env.PATH ?? ''}`,
      CI_STUB_HEAD_REPORT: scenario.headReport,
      CI_STUB_BASE_REPORT: scenario.baseReport,
    },
  });
  return { exitCode: result.status, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

const PASSING_REPORT = JSON.stringify({
  entries: [{ rule: 'rule-general', status: 'ok' }],
  summary: { errors: 0 },
});

function failingReport(...rules: string[]): string {
  return JSON.stringify({
    entries: rules.map((rule) => ({ rule, status: 'error' })),
    summary: { errors: rules.length },
  });
}

// ───────────────────────────────────────────────────────────────────
// Weekly Sweep Fixture
// ───────────────────────────────────────────────────────────────────
// The scheduled sweep reports a folder's failure according to what the stored
// baseline knew about it, and the workflow passes --baseline only when a
// previous report could be downloaded. Each scenario drives the real script
// through that CLI surface: a fixture packet claiming completion, a stub
// validator that fails it, and a baseline written where the script's
// repository-containment check allows it.
const SWEEP_SCRIPT = path.resolve(TEST_DIR, '..', 'sweep', 'strict-pass-freshness.ts');
const TSX_LOADER = path.resolve(TEST_DIR, '..', '..', '..', 'node_modules', 'tsx', 'dist', 'loader.mjs');

function makeSweepWorkspace(): string {
  const scratchRoot = path.join(WORKSPACE_ROOT, 'scratch');
  fs.mkdirSync(scratchRoot, { recursive: true });
  const workspace = fs.mkdtempSync(path.join(scratchRoot, 'ci-rule-set-sweep-'));
  createdRoots.push(workspace);
  return workspace;
}

function createCompletionFolder(workspace: string, name: string): string {
  const folder = path.join(workspace, '.opencode', 'specs', name);
  writeFile(path.join(folder, 'implementation-summary.md'), [
    '# Implementation Summary',
    '| Field | Value |',
    '|-------|-------|',
    '| **Status** | Complete |',
  ].join('\n'));
  return folder;
}

// The sweep resolves its validator through SPECKIT_VALIDATE_SCRIPT, so the stub
// fails only the named folder and passes everything else; the classification
// under test is the sweep's, not a real rule engine's.
function createFolderValidator(workspace: string, failingFolderName: string): string {
  const validator = path.join(workspace, 'validate-fixture.sh');
  writeFile(validator, [
    '#!/usr/bin/env bash',
    'if [[ "$1" == *"/' + failingFolderName + '" ]]; then',
    '  printf \'{"passed":false,"summary":{"errors":1,"warnings":0}}\\n\'',
    '  exit 2',
    'fi',
    'printf \'{"passed":true,"summary":{"errors":0,"warnings":0}}\\n\'',
  ].join('\n'), 0o755);
  return validator;
}

function runSweep(specsRoot: string, baselinePath: string | null, validator: string) {
  const args = ['--import', TSX_LOADER, SWEEP_SCRIPT, '--roots', specsRoot];
  if (baselinePath !== null) args.push('--baseline', baselinePath);
  args.push('--format', 'json');
  return spawnSync('node', args, {
    cwd: WORKSPACE_ROOT,
    encoding: 'utf8',
    env: { ...process.env, SPECKIT_VALIDATE_SCRIPT: validator },
  });
}

// The fetch step shells out to gh twice: the run lookup returns the id of the
// newest successful run, and the download extracts the artifact under a
// per-artifact directory. The stub answers both subcommands from the
// environment, so a scenario can make the lookup empty, the download land, or
// the extracted report fail to parse.
const STUB_GH = `#!/usr/bin/env bash
case "\${1:-} \${2:-}" in
  'run list')
    printf '%s' "\${CI_STUB_RUN_LIST:-}"
    ;;
  'run download')
    dir=""
    while [ "$#" -gt 0 ]; do
      if [ "$1" = "--dir" ]; then
        dir="$2"
      fi
      shift
    done
    mkdir -p "$dir/strict-pass-freshness-report-1"
    printf '%s' "\${CI_STUB_REPORT:-}" > "$dir/strict-pass-freshness-report-1/report.json"
    ;;
esac
`;

function readGithubEnv(filePath: string): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const separator = line.indexOf('=');
    if (separator > 0) {
      entries[line.slice(0, separator)] = line.slice(separator + 1);
    }
  }
  return entries;
}

function runBaselineFetch(scenario: BaselineScenario): BaselineOutcome {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-baseline-fetch-'));
  createdRoots.push(root);
  const binDir = path.join(root, 'bin');
  const envFile = path.join(root, 'github-env');
  writeFile(path.join(binDir, 'gh'), STUB_GH, 0o755);
  writeFile(envFile, '');

  // The step reads GITHUB_REF_NAME under set -u, so the runner supplies the
  // value the workflow would have; otherwise an unbound variable, not the
  // stub, would decide the lookup.
  const result = spawnSync(BASH, ['-c', loadBaselineRunBlock()], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${binDir}:${process.env.PATH ?? ''}`,
      GITHUB_ENV: envFile,
      GITHUB_REF_NAME: 'main',
      CI_STUB_RUN_LIST: scenario.runListOutput,
      CI_STUB_REPORT: scenario.report,
    },
  });
  return {
    root,
    exitCode: result.status,
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`,
    githubEnv: readGithubEnv(envFile),
  };
}

afterAll(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('changed-packet gate rule-set comparison', () => {
  it('reports a regression when a packet passes at the base and fails at the head', () => {
    const outcome = runGate({ headReport: failingReport('rule-alpha'), baseReport: PASSING_REPORT });

    expect(outcome.output).toContain('Regression — new failing rule(s): rule-alpha');
    expect(outcome.output).toContain('BLOCKED: 1 packet(s) regressed in this PR.');
    expect(outcome.exitCode).toBe(1);
  });

  it('reports a pre-existing failure when the same rules fail at the base and the head', () => {
    const report = failingReport('rule-alpha', 'rule-shared');
    const outcome = runGate({ headReport: report, baseReport: report });

    expect(outcome.output).toContain(`pre-existing (also fails at the merge base): ${FIXTURE_PACKET}`);
    expect(outcome.output).toContain('failing rule(s): rule-alpha,rule-shared');
    expect(outcome.output).toContain('No regressions: every failing packet already failed at the merge base.');
    expect(outcome.exitCode).toBe(0);
  });

  it('names only the head rules that the base was not already failing', () => {
    const outcome = runGate({
      headReport: failingReport('rule-beta', 'rule-gamma', 'rule-shared'),
      baseReport: failingReport('rule-alpha', 'rule-shared'),
    });

    expect(outcome.output).toContain('Regression — new failing rule(s): rule-beta,rule-gamma');
    expect(outcome.output).not.toContain('rule-alpha');
    expect(outcome.exitCode).toBe(1);
  });

  it('fails closed when the head report does not parse', () => {
    const outcome = runGate({
      headReport: 'the validator exited before writing a report',
      baseReport: PASSING_REPORT,
    });

    expect(outcome.output).toContain('Validator produced no verdict for the head copy; failing closed');
    expect(outcome.exitCode).toBe(1);
  });

  it('fails closed when the base report does not parse', () => {
    const outcome = runGate({
      headReport: failingReport('rule-alpha'),
      baseReport: 'the validator exited before writing a report',
    });

    expect(outcome.output).toContain('Validator produced no verdict for the base copy; failing closed');
    expect(outcome.exitCode).toBe(1);
  });
});

describe('weekly sweep baseline comparison', () => {
  it('reports a first-run failure when no baseline was supplied', () => {
    const workspace = makeSweepWorkspace();
    const specsRoot = path.join(workspace, '.opencode', 'specs');
    const folder = createCompletionFolder(workspace, 'first-failure');

    const result = runSweep(specsRoot, null, createFolderValidator(workspace, 'first-failure'));
    const payload = JSON.parse(result.stdout);

    expect(result.status).toBe(0);
    expect(payload.firstRun).toBe(1);
    expect(payload.regressions).toBe(0);
    expect(payload.results).toEqual([
      expect.objectContaining({ folder: path.relative(WORKSPACE_ROOT, folder), status: 'first-run' }),
    ]);
  });

  it('reports a regression when a folder passed in the baseline and fails now', () => {
    const workspace = makeSweepWorkspace();
    const specsRoot = path.join(workspace, '.opencode', 'specs');
    const folder = createCompletionFolder(workspace, 'prior-pass');
    const baselinePath = path.join(workspace, 'baseline.json');
    writeFile(baselinePath, JSON.stringify({
      results: [{ folder: path.relative(WORKSPACE_ROOT, folder), status: 'pass' }],
    }));

    const result = runSweep(specsRoot, baselinePath, createFolderValidator(workspace, 'prior-pass'));
    const payload = JSON.parse(result.stdout);

    expect(result.status).toBe(1);
    expect(payload.regressions).toBe(1);
    expect(payload.firstRun).toBe(0);
    expect(payload.results).toEqual([
      expect.objectContaining({ folder: path.relative(WORKSPACE_ROOT, folder), status: 'regression' }),
    ]);
  });

  it('reports a known failure when a folder failed in the baseline and still fails', () => {
    const workspace = makeSweepWorkspace();
    const specsRoot = path.join(workspace, '.opencode', 'specs');
    const folder = createCompletionFolder(workspace, 'still-failing');
    const baselinePath = path.join(workspace, 'baseline.json');
    writeFile(baselinePath, JSON.stringify({
      results: [{ folder: path.relative(WORKSPACE_ROOT, folder), status: 'new-failure' }],
    }));

    const result = runSweep(specsRoot, baselinePath, createFolderValidator(workspace, 'still-failing'));
    const payload = JSON.parse(result.stdout);

    expect(result.status).toBe(0);
    expect(payload.knownFailures).toBe(1);
    expect(payload.regressions).toBe(0);
    expect(payload.firstRun).toBe(0);
    expect(payload.results).toEqual([
      expect.objectContaining({ folder: path.relative(WORKSPACE_ROOT, folder), status: 'known-failure' }),
    ]);
  });
});

describe('weekly sweep baseline fetch', () => {
  it('records no baseline when no previous run is found', () => {
    const outcome = runBaselineFetch({ runListOutput: '', report: '' });

    expect(outcome.exitCode).toBe(0);
    expect(outcome.output).toContain('::notice::No baseline report found');
    expect(outcome.githubEnv).not.toHaveProperty('BASELINE_REPORT');
  });

  it('points BASELINE_REPORT at the downloaded report', () => {
    const outcome = runBaselineFetch({ runListOutput: '42', report: '{"results":[]}' });
    const baselineReport = path.resolve(outcome.root, outcome.githubEnv.BASELINE_REPORT ?? '');

    expect(outcome.exitCode).toBe(0);
    expect(baselineReport).toBe(
      path.join(
        outcome.root,
        '.strict-pass-freshness',
        'baseline',
        'strict-pass-freshness-report-1',
        'report.json',
      ),
    );
    expect(fs.existsSync(baselineReport)).toBe(true);
  });

  it('records no baseline when the downloaded report does not parse', () => {
    const outcome = runBaselineFetch({ runListOutput: '42', report: '{"results":[' });

    expect(outcome.exitCode).toBe(0);
    expect(outcome.output).toContain('::notice::No baseline report found');
    expect(outcome.githubEnv).not.toHaveProperty('BASELINE_REPORT');
  });
});
