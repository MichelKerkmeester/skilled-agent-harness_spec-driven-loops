// ───────────────────────────────────────────────────────────────────
// MODULE: Operator Text In Workflow Shell Steps
// ───────────────────────────────────────────────────────────────────

// The research topic, review focus and review target are text an operator typed.
// A workflow shell step that interpolates that text into a quoted argument lets a
// backtick, $() or quote in it run or break the command. These cases render each
// such step the way the workflow does, run it under bash, and check that the text
// reaches the command intact while nothing in it executes.

import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ASSETS = resolve(__dirname, '..', '..', '..', '..', '..', 'commands', 'deep', 'assets');

// js-yaml is a dependency of the shared package the runtime declares, so the
// require is anchored there rather than at a package this runtime never names.
const sharedRequire = createRequire(resolve(__dirname, '..', '..', '..', '..', 'system-spec-kit', 'shared', 'package.json'));
const { load: parseYaml } = sharedRequire('js-yaml') as { load: (source: string) => unknown };

const OPERATOR_TEXT = 'it\'s a "quoted" $(touch pwned-subst) and `touch pwned-tick` ask';
const MARKERS = ['pwned-subst', 'pwned-tick'];

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

// The parsed tree is walked by key below, so it stays loosely typed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadWorkflow(file: string): any {
  return parseYaml(readFileSync(resolve(ASSETS, file), 'utf8'));
}

function render(template: string, values: Record<string, string>): string {
  return template.replace(/\{([a-z_.]+)\}/g, (whole, key: string) => values[key] ?? whole);
}

function runBash(command: string, cwd: string, env: NodeJS.ProcessEnv = process.env) {
  return spawnSync('bash', ['-c', command], { cwd, env, encoding: 'utf8' });
}

// A stand-in for node that records the argv it was given, so the test reads exactly
// what the shell handed the runner without starting a fan-out.
function argvCaptureBin(dir: string, capture: string): string {
  const binDir = join(dir, 'bin');
  mkdirSync(binDir);
  const stub = join(binDir, 'node');
  writeFileSync(stub, `#!/bin/sh\nprintf '%s\\0' "$@" > "${capture}"\n`, 'utf8');
  chmodSync(stub, 0o755);
  return binDir;
}

// The text a flag delivers: the inline value, or the content of the file its -file variant names.
function deliveredText(argv: string[], flag: string): string | undefined {
  const fileIndex = argv.indexOf(`${flag}-file`);
  if (fileIndex !== -1) return readFileSync(argv[fileIndex + 1], 'utf8');
  const inlineIndex = argv.indexOf(flag);
  return inlineIndex === -1 ? undefined : argv[inlineIndex + 1];
}

interface FanoutCase {
  readonly file: string;
  readonly flags: readonly { readonly flag: string; readonly fileName: string }[];
}

const FANOUT_CASES: readonly FanoutCase[] = [
  {
    file: 'deep-research.yaml',
    flags: [{ flag: '--research-topic', fileName: 'fanout-research-topic.txt' }],
  },
  {
    file: 'deep-review.yaml',
    flags: [
      { flag: '--review-focus', fileName: 'fanout-review-focus.txt' },
      { flag: '--review-target', fileName: 'fanout-review-target.txt' },
    ],
  },
];

describe.each(FANOUT_CASES)('$file fan-out spawn step', ({ file, flags }) => {
  it('passes operator text to the runner without the shell expanding it', () => {
    const wf = loadWorkflow(file).workflow;
    const step = wf.step_fanout_spawn;
    const command = step.sub_steps.step_fanout_spawn_cli.command as string;
    const dir = makeTempDir('operator-text-fanout-');
    const artifactDir = join(dir, 'artifacts');
    mkdirSync(artifactDir);
    // The workflow writes each text with its file tool before the step runs.
    for (const { fileName } of flags) writeFileSync(join(artifactDir, fileName), OPERATOR_TEXT, 'utf8');
    const capture = join(dir, 'argv.bin');
    const binDir = argvCaptureBin(dir, capture);

    const rendered = render(command, {
      spec_folder: 'specs/example',
      research_topic: OPERATOR_TEXT,
      review_focus: OPERATOR_TEXT,
      review_target: OPERATOR_TEXT,
      review_target_type: 'files',
      'config.fanout_json': '{}',
      artifact_dir: artifactDir,
      convergence_threshold: '0.05',
      stop_policy: 'convergence',
      convergence_mode: 'on',
      depth_mode: 'default',
    });
    const result = runBash(rendered, dir, { ...process.env, PATH: `${binDir}:${process.env.PATH ?? ''}` });

    expect(result.status, result.stderr).toBe(0);
    for (const marker of MARKERS) expect(existsSync(join(dir, marker)), marker).toBe(false);
    const argv = readFileSync(capture, 'utf8').split('\0').slice(0, -1);
    for (const { flag, fileName } of flags) {
      expect(deliveredText(argv, flag), flag).toBe(OPERATOR_TEXT);
      expect(step.instructions, fileName).toContain(`{artifact_dir}/${fileName}`);
    }
    expect(step.instructions).toContain('never through a shell');
  });
});

// The fan-out config JSON is operator input too, and a single-quoted shell argument ends at
// its first quote. Each value here pairs its quotes, so on an inline argument the payload
// between them would run rather than leave the quote unterminated.
const CONFIG_MARKERS = ['pwned-cfg-subst', 'pwned-cfg-tick'];
const HOSTILE_CONFIG = {
  executors: [{ label: "it's $(touch pwned-cfg-subst) and `touch pwned-cfg-tick` it's", kind: 'native' }],
  note: "o'clock $(touch pwned-cfg-subst) o'clock",
};
const HOSTILE_CONFIG_JSON = JSON.stringify(HOSTILE_CONFIG);

describe.each(FANOUT_CASES)('$file fan-out config JSON', ({ file, flags }) => {
  it('passes the config JSON to the runner without the shell expanding it', () => {
    const step = loadWorkflow(file).workflow.step_fanout_spawn;
    const command = step.sub_steps.step_fanout_spawn_cli.command as string;
    const dir = makeTempDir('operator-text-fanout-config-');
    const artifactDir = join(dir, 'artifacts');
    mkdirSync(artifactDir);
    // The workflow writes each text and the config with its file tool before the step runs.
    for (const { fileName } of flags) writeFileSync(join(artifactDir, fileName), 'plain text', 'utf8');
    writeFileSync(join(artifactDir, 'fanout-config.json'), HOSTILE_CONFIG_JSON, 'utf8');
    const capture = join(dir, 'argv.bin');
    const binDir = argvCaptureBin(dir, capture);

    const rendered = render(command, {
      spec_folder: 'specs/example',
      review_target_type: 'files',
      'config.fanout_json': HOSTILE_CONFIG_JSON,
      artifact_dir: artifactDir,
      convergence_threshold: '0.05',
      stop_policy: 'convergence',
      convergence_mode: 'on',
      depth_mode: 'default',
    });
    const result = runBash(rendered, dir, { ...process.env, PATH: `${binDir}:${process.env.PATH ?? ''}` });

    for (const marker of CONFIG_MARKERS) expect(existsSync(join(dir, marker)), marker).toBe(false);
    expect(result.status, result.stderr).toBe(0);
    const argv = readFileSync(capture, 'utf8').split('\0').slice(0, -1);
    const delivered = deliveredText(argv, '--fanout-config-json');
    expect(delivered).toBe(HOSTILE_CONFIG_JSON);
    expect(JSON.parse(delivered as string)).toEqual(HOSTILE_CONFIG);
    expect(step.instructions).toContain('{artifact_dir}/fanout-config.json');
  });
});

// The dry-run preview must hand the runner the same arguments a real spawn does, so the
// commands it prints are the ones a run would start. Only the input files move, to a
// temporary directory, so the preview writes nothing into the artifact directory.
describe.each(FANOUT_CASES)('$file fan-out dry-run preview step', ({ file, flags }) => {
  it('runs the spawn command from a temporary input directory with --preview', () => {
    const wf = loadWorkflow(file).workflow;
    const spawnCommand = wf.step_fanout_spawn.sub_steps.step_fanout_spawn_cli.command as string;
    const previewStep = wf.step_fanout_dry_run_preview;
    const dir = makeTempDir('operator-text-preview-');
    const artifactDir = join(dir, 'artifacts');
    const inputDir = join(dir, 'input');
    mkdirSync(artifactDir);
    mkdirSync(inputDir);
    for (const { fileName } of flags) writeFileSync(join(inputDir, fileName), OPERATOR_TEXT, 'utf8');
    writeFileSync(join(inputDir, 'fanout-config.json'), '{}', 'utf8');
    const capture = join(dir, 'argv.bin');
    const binDir = argvCaptureBin(dir, capture);
    const values = {
      spec_folder: 'specs/example',
      review_target_type: 'files',
      artifact_dir: artifactDir,
      preview_input_dir: inputDir,
      convergence_threshold: '0.05',
      stop_policy: 'convergence',
      convergence_mode: 'on',
      depth_mode: 'default',
    };
    const result = runBash(render(previewStep.command as string, values), dir, {
      ...process.env,
      PATH: `${binDir}:${process.env.PATH ?? ''}`,
    });
    expect(result.status, result.stderr).toBe(0);
    for (const marker of MARKERS) expect(existsSync(join(dir, marker)), marker).toBe(false);

    const argv = readFileSync(capture, 'utf8').split('\0').slice(0, -1);
    const expected = render(spawnCommand, values)
      .split(`${artifactDir}/fanout-`)
      .join(`${inputDir}/fanout-`)
      .replace(/\\\n\s*/gu, ' ')
      .trim()
      .split(/\s+/u)
      .slice(1)
      .map((token) => token.replace(/^"(.*)"$/u, '$1'));
    expect(argv).toEqual([...expected, '--preview']);
    for (const { flag } of flags) expect(deliveredText(argv, flag), flag).toBe(OPERATOR_TEXT);
    expect(previewStep.instructions).toContain('never through a shell');
    expect(previewStep.instructions).toContain('mktemp -d');
  });
});

const RECIPE_CASES = [
  { file: 'deep-research.yaml', textKey: 'research_topic' },
  { file: 'deep-review.yaml', textKey: 'review_target' },
] as const;

describe.each(RECIPE_CASES)('$file context-loading ripgrep recipe', ({ file, textKey }) => {
  it('searches for the operator text as one phrase without the shell expanding it', () => {
    const retrieval = loadWorkflow(file).context_loading.retrieval;
    const dir = makeTempDir('operator-text-recipe-');
    mkdirSync(join(dir, 'specs'));
    mkdirSync(join(dir, '.skilled'));
    writeFileSync(join(dir, 'specs', 'note.md'), `# Note\n\n${OPERATOR_TEXT}\n`, 'utf8');
    // The workflow writes the pattern file with its file tool before the recipe runs.
    const patternDir = makeTempDir('operator-text-pattern-');
    const patternFile = join(patternDir, 'pattern.txt');
    writeFileSync(patternFile, `${OPERATOR_TEXT}\n`, 'utf8');

    const rendered = render(retrieval.free_text_recipe as string, {
      [textKey]: OPERATOR_TEXT,
      context_pattern_file: patternFile,
    });
    const result = runBash(rendered, dir);

    expect(result.status, result.stderr).toBe(0);
    for (const marker of MARKERS) expect(existsSync(join(dir, marker)), marker).toBe(false);
    const matches = result.stdout
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as { type: string; data?: { lines?: { text?: string } } })
      .filter((event) => event.type === 'match');
    expect(matches.map((event) => event.data?.lines?.text)).toEqual([`${OPERATOR_TEXT}\n`]);
    expect(retrieval.pattern_file).toContain('never through a shell');
  });
});
