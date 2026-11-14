// ───────────────────────────────────────────────────────────────────
// MODULE: Render Command Contract Tests
// ───────────────────────────────────────────────────────────────────

import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
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
  MANIFEST_PATH: string;
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

  it('keeps the default manifest beside the compiled contracts it indexes', () => {
    const manifestFolder = dirname(renderer.MANIFEST_PATH);
    const manifestDirectory = workspacePath(manifestFolder);

    // A default render creates the manifest folder, so a stale path would
    // recreate the vacated tree instead of indexing the moved contracts.
    expect(existsSync(manifestDirectory), `${manifestFolder} does not exist`).toBe(true);
    for (const command of commands) {
      expect(dirname(renderer.COMMANDS[command].compiledContractPath)).toBe(manifestFolder);
    }
  });

  it('resolves the default rollout mode through the shared resolver', () => {
    const result = withInjectionMode(undefined, () => renderer.renderCommandContract('deep/review', {
      manifestPath: tempManifestPath(),
    }));

    expect(renderer.resolveMode('deep/review')).toBe('fallback');
    expect(result.mode).toBe('fallback');
  });

  it.each(commands)('exposes a zero-diff compare CLI for %s', (command) => {
    const scriptPath = workspacePath('.skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs');
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
  { command: 'deep/review', yaml: '.skilled/commands/deep/assets/deep-review.yaml' },
  { command: 'deep/research', yaml: '.skilled/commands/deep/assets/deep-research.yaml' },
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
  it.each(FANOUT_CALL_SITES)('$command passes every convergence flag to the runner', ({ yaml }) => {
    const rendered = renderFanoutCommand(fanoutSpawnStep(yaml));

    expect(rendered).toContain('fanout-run.cjs');
    for (const [flag, placeholder] of FANOUT_FLAGS) {
      expect(rendered).toContain(`${flag} ${placeholder}`);
    }
  });

  it.each(FANOUT_CALL_SITES)('$command spawns lineages only through the runner', ({ yaml }) => {
    const step = fanoutSpawnStep(yaml);

    expect(step).toContain('fanout-run.cjs');
    // The leaf agent is an iteration executor. A fan-out step that dispatches it
    // hands one lineage the whole loop, so every lineage would run the phase
    // machine the runner owns, without the runner's pool or stop checks.
    expect(step).not.toMatch(/\bfor_each\s*:/);
    expect(step).not.toMatch(/\bagent\s*:\s*deep-(?:review|research)\b/);
  });
});

// ── Single-file two-mode contract ───────────────────────────────────────────
//
// Each loop ships one command contract that runs unattended and interactive
// alike. Blocks that only run interactively carry `applies_to: confirm` (the
// approval gates are the confirm-only surface); every other step runs in both
// modes. A second per-mode file, or a gate without the marker, would silently
// diverge from this one. These guards pin the marker and the shared
// record-shape bindings.
const SINGLE_CONTRACTS = [
  {
    command: 'deep/review',
    yaml: '.skilled/commands/deep/assets/deep-review.yaml',
    gatewaySteps: ['step_evaluate_results', 'step_post_iteration_claim_adjudication', 'step_convergence_report'],
    configBindings: ['stopPolicy: "{stop_policy}"'],
    // Review opens its run as a gateway event built from the config file, so the
    // record step binds the event stem and the config it reads, not a flat row.
    recordBindings: ['stem: "deep_review.run_initialized"', '"{state_paths.config}"'],
  },
  {
    command: 'deep/research',
    yaml: '.skilled/commands/deep/assets/deep-research.yaml',
    gatewaySteps: ['step_convergence_report'],
    configBindings: ['lineage.sessionId: "{session_id_init}"'],
    // Research opens its run as a gateway event built from the config file, so the
    // record step binds the event stem and the config it reads, not a flat row.
    recordBindings: ['stem: "deep_research.run_initialized"', '"{state_paths.config}"'],
  },
] as const;

function readContract(yamlPath: string): string {
  return readFileSync(workspacePath(yamlPath), 'utf8');
}

// The approval gates are the confirm-only surface. A gate block runs until the
// next line at or above its own indentation, and the marker may sit a line or
// two above the key on the branch that carries the gate.
function approvalGateBlocks(source: string): string[] {
  const lines = source.split('\n');
  const blocks: string[] = [];
  for (const [index, line] of lines.entries()) {
    if (!/^\s*gate_[a-z0-9_]+:\s*$/.test(line)) continue;
    const indent = line.search(/\S/);
    const block: string[] = [];
    for (let above = index - 1; above >= 0 && index - above <= 3; above -= 1) {
      const candidate = lines[above];
      if (candidate.trim() === '') continue;
      if (candidate.search(/\S/) !== indent) break;
      if (/^\s*applies_to:\s*confirm\s*$/.test(candidate)) block.push(candidate);
    }
    block.push(line);
    for (const next of lines.slice(index + 1)) {
      if (next.trim() !== '' && next.search(/\S/) <= indent) break;
      block.push(next);
    }
    if (block.some((entry) => entry.trim() === 'type: approval_gate')) blocks.push(block.join('\n'));
  }
  return blocks;
}

function stepBlock(source: string, key: string, indent = 6): string | null {
  const marker = `${' '.repeat(indent)}${key}:`;
  const start = source.indexOf(`\n${marker}`);
  if (start === -1) return null;
  const tail = source.slice(start + 1);
  const end = tail.slice(marker.length).search(new RegExp(`\\n {${indent}}[A-Za-z_]`));
  return end === -1 ? tail : tail.slice(0, marker.length + end + 1);
}

describe('single-file two-mode contract', () => {
  it.each(SINGLE_CONTRACTS)('$command carries no per-mode parity census', ({ yaml }) => {
    expect(readContract(yaml)).not.toMatch(/\nconfirm_parity:/);
  });

  it.each(SINGLE_CONTRACTS)('$command marks every confirm-only approval gate with applies_to: confirm', ({ yaml }) => {
    const gates = approvalGateBlocks(readContract(yaml));

    expect(gates.length).toBeGreaterThan(0);
    for (const gate of gates) {
      expect(gate, `${yaml}: an approval gate is missing applies_to: confirm`).toContain('applies_to: confirm');
    }
  });

  it.each(SINGLE_CONTRACTS)('$command binds the config and line-one record placeholders', ({ yaml, configBindings, recordBindings }) => {
    const contract = readContract(yaml);
    const config = stepBlock(contract, 'step_create_config') ?? '';
    const record = stepBlock(contract, 'step_create_state_log') ?? '';

    for (const binding of configBindings) {
      expect(config, `${yaml}: config is missing ${binding}`).toContain(binding);
    }
    for (const fragment of recordBindings) {
      expect(record, `${yaml}: line-one config record is missing ${fragment}`).toContain(fragment);
    }
    expect(record).not.toContain('"emit":true');
  });

  it.each(SINGLE_CONTRACTS)('$command wires the state-record steps through the append gateway', ({ yaml, gatewaySteps }) => {
    const contract = readContract(yaml);

    for (const step of gatewaySteps) {
      const block = stepBlock(contract, step);
      expect(block, `${yaml}: ${step} not found`).not.toBeNull();
      // A canonical record written beside the state log is dropped by the next
      // projection refresh, so the step must stage it through the gateway.
      expect(block ?? '', `${yaml}: ${step} must stage its record through the gateway`).toContain('append-mode-event.cjs');
    }
  });
});
