import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

type Command = 'deep/ai-council' | 'deep/review' | 'deep/research';

type ManifestRow = {
  command: Command;
  mode: 'fallback' | 'fix';
  argsSha256: string;
  legacyBodySha256: string;
  compiledContractSha256: string;
  renderedSha256: string;
};

const renderer = require('../../scripts/render-command-contract.cjs') as {
  COMMANDS: Record<Command, { legacyBodyPath: string; compiledContractPath: string }>;
  WORKSPACE_ROOT: string;
  buildInvocationPrefix: (argsText: string) => Buffer;
  compareFallback: (command: Command) => { equal: boolean; renderedLength: number; legacyBodyLength: number };
  renderCommandContract: (
    command: Command,
    options?: { argsText?: string; manifestPath?: string; writeManifest?: boolean },
  ) => { command: Command; mode: 'fallback' | 'fix'; output: Buffer; body: Buffer; prefix: Buffer; manifestRow: ManifestRow };
  resolveMode: (command: Command) => 'fallback' | 'fix';
  sha256: (input: string | Buffer) => string;
};

const commands = ['deep/ai-council', 'deep/review', 'deep/research'] as const;
const tempDirs: string[] = [];

function workspacePath(sourcePath: string): string {
  return resolve(renderer.WORKSPACE_ROOT, sourcePath);
}

function legacyBody(command: Command): Buffer {
  return readFileSync(workspacePath(renderer.COMMANDS[command].legacyBodyPath));
}

function compiledContract(command: Command): Buffer {
  return readFileSync(workspacePath(renderer.COMMANDS[command].compiledContractPath));
}

function tempManifestPath(): string {
  const dir = mkdtempSync(join(tmpdir(), 'render-command-contract-'));
  tempDirs.push(dir);
  return join(dir, 'manifest.jsonl');
}

function withInjectionMode<T>(mode: string | undefined, run: () => T): T {
  const previous = process.env['SPECKIT_COMMAND_INJECTION_MODE'];
  if (mode === undefined) {
    delete process.env['SPECKIT_COMMAND_INJECTION_MODE'];
  } else {
    process.env['SPECKIT_COMMAND_INJECTION_MODE'] = mode;
  }
  try {
    return run();
  } finally {
    if (previous === undefined) {
      delete process.env['SPECKIT_COMMAND_INJECTION_MODE'];
    } else {
      process.env['SPECKIT_COMMAND_INJECTION_MODE'] = previous;
    }
  }
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('render-command-contract', () => {
  it.each(commands)('keeps the fallback BODY byte-identical to the legacy body for %s', (command) => {
    const result = withInjectionMode(`${command}:fallback`, () => renderer.renderCommandContract(command, {
      argsText: 'sample args',
      manifestPath: tempManifestPath(),
    }));

    expect(result.mode).toBe('fallback');
    // The static body is the byte-identical invariant target; the message prefix is additive.
    expect(Buffer.compare(result.body, legacyBody(command))).toBe(0);
    expect(Buffer.compare(result.output, Buffer.concat([result.prefix, result.body]))).toBe(0);
    expect(renderer.compareFallback(command)).toMatchObject({
      equal: true,
      renderedLength: legacyBody(command).length,
      legacyBodyLength: legacyBody(command).length,
    });
  });

  it.each(commands)('renders fix BODY as compiled contract followed by legacy body for %s', (command) => {
    const result = withInjectionMode(`${command}:fix`, () => renderer.renderCommandContract(command, {
      argsText: 'sample args',
      manifestPath: tempManifestPath(),
    }));
    const contract = compiledContract(command);
    const body = legacyBody(command);

    expect(result.mode).toBe('fix');
    expect(Buffer.compare(result.body.subarray(0, contract.length), contract)).toBe(0);
    expect(result.body.includes(body)).toBe(true);
    expect(Buffer.compare(result.output, Buffer.concat([result.prefix, result.body]))).toBe(0);
  });

  it.each(commands)('surfaces the invocation message to the model for %s', (command) => {
    const marker = 'ZZTARGET_MARKER_9 :auto --spec-folder=/tmp/x';
    const withArgs = withInjectionMode(undefined, () => renderer.renderCommandContract(command, {
      argsText: marker,
      manifestPath: tempManifestPath(),
    }));
    const text = withArgs.output.toString('utf8');
    expect(text).toContain('ARGS_PRESENT=true');
    expect(text).toContain(marker);
    expect(text).toContain('do NOT ask the setup question');
    // The message prefix precedes the command body (model reads the bound setup first).
    expect(withArgs.output.indexOf(Buffer.from('ARGS_PRESENT=true'))).toBeLessThan(withArgs.output.indexOf(withArgs.body));

    const noArgs = withInjectionMode(undefined, () => renderer.renderCommandContract(command, {
      argsText: '',
      manifestPath: tempManifestPath(),
    }));
    expect(noArgs.output.toString('utf8')).toContain('ARGS_PRESENT=false');
    // The body is unaffected by whether a message was supplied.
    expect(Buffer.compare(noArgs.body, withArgs.body)).toBe(0);
  });

  it.each(commands)('appends a manifest row with render hashes for %s', (command) => {
    const argsText = 'target :auto --max-iterations=2';
    const manifestPath = tempManifestPath();
    const result = withInjectionMode(`${command}:fallback`, () => renderer.renderCommandContract(command, {
      argsText,
      manifestPath,
    }));
    const rows = readFileSync(manifestPath, 'utf8').trimEnd().split('\n').map((line) => JSON.parse(line) as ManifestRow);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({
      command,
      mode: 'fallback',
      argsSha256: renderer.sha256(Buffer.from(argsText, 'utf8')),
      legacyBodySha256: renderer.sha256(legacyBody(command)),
      compiledContractSha256: renderer.sha256(compiledContract(command)),
      renderedSha256: renderer.sha256(result.output),
    });
  });

  it('resolves the default rollout mode through the shared resolver', () => {
    const result = withInjectionMode(undefined, () => renderer.renderCommandContract('deep/review', {
      manifestPath: tempManifestPath(),
    }));

    expect(renderer.resolveMode('deep/review')).toBe('fallback');
    expect(result.mode).toBe('fallback');
  });

  it.each(commands)('exposes a zero-diff compare CLI for %s', (command) => {
    const scriptPath = workspacePath('.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs');
    const result = spawnSync(process.execPath, [scriptPath, '--command', command, '--compare'], {
      cwd: renderer.WORKSPACE_ROOT,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toBe(`COMPARE OK command=${command} bytes=${legacyBody(command).length}\n`);
  });
});

// ── Fan-out call-site contract ──────────────────────────────────────────────
//
// The fan-out spawn step shells out to the shared runner, and the runner reads
// every convergence knob from CLI flags alone: the fan-out config schema rejects
// a stop-policy key, so a policy placed there would be dropped silently. A call
// site that omits a flag therefore pins that knob to the runner default and the
// operator's configured value never reaches a lineage.
const FANOUT_CALL_SITES = [
  { command: 'deep/review', variant: 'auto', yaml: '.opencode/commands/deep/assets/deep-review-auto.yaml' },
  { command: 'deep/review', variant: 'confirm', yaml: '.opencode/commands/deep/assets/deep-review-confirm.yaml' },
  { command: 'deep/research', variant: 'auto', yaml: '.opencode/commands/deep/assets/deep-research-auto.yaml' },
  { command: 'deep/research', variant: 'confirm', yaml: '.opencode/commands/deep/assets/deep-research-confirm.yaml' },
] as const;

const FANOUT_FLAGS = [
  ['--convergence-threshold', '{convergence_threshold}'],
  ['--stop-policy', '{stop_policy}'],
  ['--convergence-mode', '{convergence_mode}'],
] as const;

function fanoutSpawnStep(yamlPath: string): string {
  const text = readFileSync(workspacePath(yamlPath), 'utf8');
  const marker = '  step_fanout_spawn:';
  const start = text.indexOf(`\n${marker}`);
  if (start === -1) throw new Error(`${yamlPath}: step_fanout_spawn not found`);
  const step = text.slice(start + 1);
  const next = step.slice(marker.length).search(/\n  [A-Za-z_]/);
  return next === -1 ? step : step.slice(0, marker.length + next + 1);
}

// Collapse the shell line continuations so the call reads as the single command
// the runner receives.
function renderFanoutCommand(step: string): string {
  const lines = step.split('\n');
  const start = lines.findIndex((line) => line.trim().startsWith('node ') && line.includes('fanout-run.cjs'));
  if (start === -1) throw new Error('fan-out spawn step contains no fanout-run.cjs call');
  const rendered: string[] = [];
  for (let index = start; index < lines.length; index += 1) {
    const line = lines[index].trim();
    rendered.push(line.endsWith('\\') ? line.slice(0, -1).trim() : line);
    if (!line.endsWith('\\')) break;
  }
  return rendered.join(' ');
}

describe('fan-out call-site contract', () => {
  it.each(FANOUT_CALL_SITES)('$command $variant passes every convergence flag to the runner', ({ yaml }) => {
    const rendered = renderFanoutCommand(fanoutSpawnStep(yaml));

    expect(rendered).toContain('fanout-run.cjs');
    for (const [flag, placeholder] of FANOUT_FLAGS) {
      expect(rendered).toContain(`${flag} ${placeholder}`);
    }
  });

  it.each(FANOUT_CALL_SITES)('$command $variant spawns lineages only through the runner', ({ yaml }) => {
    const step = fanoutSpawnStep(yaml);

    expect(step).toContain('fanout-run.cjs');
    // The leaf agent is an iteration executor. A fan-out step that dispatches it
    // hands one lineage the whole loop, so every lineage would run the phase
    // machine the runner owns, without the runner's pool or stop checks.
    expect(step).not.toMatch(/\bfor_each\s*:/);
    expect(step).not.toMatch(/\bagent\s*:\s*deep-(?:review|research)\b/);
  });
});

// ── Confirm-variant parity contract ─────────────────────────────────────────
//
// Each loop ships two command contracts: an unattended `auto` variant and an
// interactive `confirm` variant. They are edited independently, so one can drop
// a step the other still runs and nothing renders both to notice. A confirm
// variant may legitimately omit an auto step when the interactive surface does
// the same work at an operator gate, but the omission has to be declared in
// that contract's `confirm_parity` census with the reason. These guards pin the
// census and the record-shape bindings so the pair cannot drift silently again.
const PARITY_PAIRS = [
  {
    command: 'deep/review',
    auto: '.opencode/commands/deep/assets/deep-review-auto.yaml',
    confirm: '.opencode/commands/deep/assets/deep-review-confirm.yaml',
    gatewaySteps: ['step_evaluate_results', 'step_post_iteration_claim_adjudication', 'step_convergence_report'],
    configBindings: ['stopPolicy: "{stop_policy}"'],
    recordBindings: ['"emit":{resource_map_emit}'],
  },
  {
    command: 'deep/research',
    auto: '.opencode/commands/deep/assets/deep-research-auto.yaml',
    confirm: '.opencode/commands/deep/assets/deep-research-confirm.yaml',
    gatewaySteps: ['step_convergence_report'],
    configBindings: ['lineage.sessionId: "{session_id_init}"'],
    recordBindings: ['"emit":{resource_map_emit}', '"lineage":{"sessionId":"{session_id_init}"'],
  },
] as const;

const STEP_KEY_RE = /^\s*-?\s*(step_[a-z0-9_]+):/gm;

function readContract(yamlPath: string): string {
  return readFileSync(workspacePath(yamlPath), 'utf8');
}

// The census names steps that are intentionally absent, so its entries are not
// workflow steps and must be stripped before the step-key census.
function stepKeys(source: string): Set<string> {
  const census = censusBlock(source);
  const body = census === null ? source : source.replace(census, '');
  return new Set([...body.matchAll(STEP_KEY_RE)].map((match) => match[1]));
}

// The census lives in a column-0 block so a following top-level key bounds it.
function censusBlock(source: string): string | null {
  const start = source.indexOf('\nconfirm_parity:');
  if (start === -1) return null;
  const tail = source.slice(start + 1);
  const end = tail.search(/\n\S/);
  return end === -1 ? tail : tail.slice(0, end);
}

function censusBlockOrThrow(source: string): string {
  const block = censusBlock(source);
  if (block === null) throw new Error('confirm contract has no confirm_parity census');
  return block;
}

function censusSection(block: string, section: string): string {
  const start = block.indexOf(`\n  ${section}:`);
  if (start === -1) throw new Error(`confirm_parity has no ${section} section`);
  const tail = block.slice(start + 1);
  const end = tail.slice(section.length + 3).search(/\n {2}\S/);
  return end === -1 ? tail : tail.slice(0, section.length + 3 + end + 1);
}

function censusOmissions(block: string): Map<string, string> {
  const entries = new Map<string, string>();
  for (const line of censusSection(block, 'omitted_steps').split('\n')) {
    const match = /^ {4}(step_[a-z0-9_]+):\s*(.+?)\s*$/.exec(line);
    if (match) entries.set(match[1], match[2]);
  }
  return entries;
}

function stepBlock(source: string, key: string, indent = 6): string | null {
  const marker = `${' '.repeat(indent)}${key}:`;
  const start = source.indexOf(`\n${marker}`);
  if (start === -1) return null;
  const tail = source.slice(start + 1);
  const end = tail.slice(marker.length).search(new RegExp(`\\n {${indent}}[A-Za-z_]`));
  return end === -1 ? tail : tail.slice(0, marker.length + end + 1);
}

describe('confirm-variant parity contract', () => {
  it.each(PARITY_PAIRS)('$command: every auto step is present in the confirm contract or declared in its census', (pair) => {
    const autoSteps = stepKeys(readContract(pair.auto));
    const confirmSteps = stepKeys(readContract(pair.confirm));
    const omissions = censusOmissions(censusBlockOrThrow(readContract(pair.confirm)));

    for (const step of autoSteps) {
      if (confirmSteps.has(step)) continue;
      expect(
        omissions.has(step),
        `${pair.confirm}: ${step} is absent from the confirm contract and is not declared in confirm_parity.omitted_steps`,
      ).toBe(true);
    }
  });

  it.each(PARITY_PAIRS)('$command: the census names only auto steps the confirm contract truly omits', (pair) => {
    const autoSteps = stepKeys(readContract(pair.auto));
    const confirmSteps = stepKeys(readContract(pair.confirm));
    const omissions = censusOmissions(censusBlockOrThrow(readContract(pair.confirm)));

    expect(omissions.size).toBeGreaterThan(0);
    for (const [step, reason] of omissions) {
      expect(autoSteps.has(step), `${pair.confirm}: census names ${step}, which its auto twin does not define`).toBe(true);
      expect(confirmSteps.has(step), `${pair.confirm}: census names ${step}, which the confirm contract also defines`).toBe(false);
      expect(
        reason.replace(/^["']|["']$/g, '').length,
        `${pair.confirm}: census entry ${step} must state why the interactive surface differs`,
      ).toBeGreaterThan(30);
    }
  });

  it.each(PARITY_PAIRS)('$command: both variants bind the same config and line-one record placeholders', (pair) => {
    const auto = readContract(pair.auto);
    const confirm = readContract(pair.confirm);
    const autoConfig = stepBlock(auto, 'step_create_config', 6) ?? '';
    const confirmConfig = stepBlock(confirm, 'step_create_config', 6) ?? '';
    const autoRecord = stepBlock(auto, 'step_create_state_log', 6) ?? '';
    const confirmRecord = stepBlock(confirm, 'step_create_state_log', 6) ?? '';

    for (const binding of pair.configBindings) {
      expect(autoConfig, `${pair.auto}: config is missing ${binding}`).toContain(binding);
      expect(confirmConfig, `${pair.confirm}: config is missing ${binding}`).toContain(binding);
    }
    for (const fragment of pair.recordBindings) {
      expect(autoRecord, `${pair.auto}: line-one config record is missing ${fragment}`).toContain(fragment);
      expect(confirmRecord, `${pair.confirm}: line-one config record is missing ${fragment}`).toContain(fragment);
    }
    for (const record of [autoRecord, confirmRecord]) {
      expect(record).not.toContain('"emit":true');
    }
  });

  it.each(PARITY_PAIRS)('$command: both variants wire the same state-record steps through the append gateway', (pair) => {
    const auto = readContract(pair.auto);
    const confirm = readContract(pair.confirm);

    for (const step of pair.gatewaySteps) {
      const autoStep = stepBlock(auto, step);
      const confirmStep = stepBlock(confirm, step);
      expect(autoStep, `${pair.auto}: ${step} not found`).not.toBeNull();
      expect(confirmStep, `${pair.confirm}: ${step} not found`).not.toBeNull();
      // A canonical record written beside the state log is dropped by the next
      // projection refresh, so both variants must stage it through the gateway.
      expect(autoStep ?? '', `${pair.auto}: ${step} must stage its record through the gateway`).toContain('append-mode-event.cjs');
      expect(confirmStep ?? '', `${pair.confirm}: ${step} must stage its record through the gateway`).toContain('append-mode-event.cjs');
    }
  });
});
