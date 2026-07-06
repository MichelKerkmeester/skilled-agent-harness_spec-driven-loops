#!/usr/bin/env node
// ────────────────────────────────────────────────────────────────
// MODULE: Guided Run
// ────────────────────────────────────────────────────────────────
//
// Guided runner for the design-md-generator backend: parses run options,
// runs preflight checks, builds the ordered command plan, and executes the
// extraction (or reports it under --dry-run).

import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { resolveOutputPath } from './output-policy';

export interface GuidedRunOptions {
  url: string;
  output: string;
  designMd?: string;
  fast: boolean;
  report: boolean;
  dryRun: boolean;
}

export interface PreflightCheck {
  name: string;
  ok: boolean;
  detail: string;
}

export interface PlannedCommand {
  label: string;
  command: string;
  args: string[];
}

const BACKEND_ROOT = path.resolve(__dirname, '..');
const VALUE_FLAGS = new Set(['--output', '--design-md']);
const BOOLEAN_FLAGS = new Set(['--fast', '--report', '--dry-run']);
const PREFLIGHT_COMMAND_TIMEOUT_MS = 120_000;
const RUN_COMMAND_TIMEOUT_MS = 600_000;

interface CommandCheckResult {
  ok: boolean;
  detail: string;
}

interface SpawnResult {
  error?: Error;
  signal: string | null;
  status: number | null;
  stderr?: string | Buffer | null;
  stdout?: string | Buffer | null;
}

function usage(): string {
  return [
    'Usage: guided-run.ts <url> --output <dir> [--design-md <path>] [--fast] [--report] [--dry-run]',
    'Runs readiness checks, extraction, write-prompt generation and optional validation.',
    'It never authors DESIGN.md content.',
  ].join('\n');
}

export function parseGuidedRunArgs(argv: string[]): GuidedRunOptions {
  const args = argv.slice(2);
  const readValue = (flag: string): string | undefined => {
    const index = args.indexOf(flag);
    if (index === -1) return undefined;
    const value = args[index + 1];
    if (!value || value.startsWith('--')) return undefined;
    return value;
  };
  let url = '';
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (VALUE_FLAGS.has(arg)) {
      const value = args[index + 1];
      if (value && !value.startsWith('--')) index += 1;
      continue;
    }
    if (BOOLEAN_FLAGS.has(arg) || arg.startsWith('--')) continue;
    url = arg;
    break;
  }
  const output = readValue('--output') ?? '';
  if (!url || !output) {
    throw new Error(usage());
  }
  return {
    url,
    output,
    designMd: readValue('--design-md'),
    fast: args.includes('--fast'),
    report: args.includes('--report'),
    dryRun: args.includes('--dry-run'),
  };
}

function outputText(value: string | Buffer | null | undefined): string {
  if (!value) return '';
  return typeof value === 'string' ? value : value.toString('utf-8');
}

function describeSpawnFailure(label: string, result: SpawnResult, timeoutMs: number): string {
  if (result.signal === 'SIGTERM') {
    return `${label} timed out after ${timeoutMs}ms`;
  }
  if (result.error) {
    return `${label} failed: ${result.error.message}`;
  }
  if (result.status === null) {
    return `${label} failed without an exit status within ${timeoutMs}ms`;
  }
  if (result.signal) {
    return `${label} terminated by ${result.signal}`;
  }
  const output = outputText(result.stderr) || outputText(result.stdout);
  return `${label} exited ${result.status}${output ? `: ${output.trim()}` : ''}`;
}

function commandExists(command: string, args: string[]): CommandCheckResult {
  const label = [command, ...args].join(' ');
  const result = spawnSync(command, args, {
    cwd: BACKEND_ROOT,
    stdio: 'ignore',
    timeout: PREFLIGHT_COMMAND_TIMEOUT_MS,
  });
  if (result.status === 0 && !result.error && result.signal === null) {
    return { ok: true, detail: `${label} succeeded` };
  }
  return { ok: false, detail: describeSpawnFailure(label, result, PREFLIGHT_COMMAND_TIMEOUT_MS) };
}

export function runPreflight(options: GuidedRunOptions): PreflightCheck[] {
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  const packageJson = path.join(BACKEND_ROOT, 'package.json');
  const nodeModules = path.join(BACKEND_ROOT, 'node_modules');
  const chromium = commandExists('npx', ['playwright', 'install', '--dry-run', 'chromium']);
  // Shared with extract.ts/report-gen.ts/preview-gen.ts/proof.ts so the
  // spec-folder/sandbox boundary can't drift between callers.
  const outputPolicy = resolveOutputPath(options.output);

  return [
    { name: 'node', ok: nodeMajor >= 20, detail: `Node ${process.versions.node}` },
    { name: 'package-json', ok: fs.existsSync(packageJson), detail: packageJson },
    { name: 'dependencies', ok: fs.existsSync(nodeModules), detail: nodeModules },
    { name: 'chromium', ok: chromium.ok, detail: chromium.detail },
    { name: 'output-path', ok: outputPolicy.ok, detail: outputPolicy.ok ? outputPolicy.resolvedPath : `${outputPolicy.resolvedPath} is unsafe: ${outputPolicy.reason}` },
  ];
}

export function buildPlan(options: GuidedRunOptions): PlannedCommand[] {
  const tokensPath = path.join(options.output, 'tokens.json');
  const writePromptPath = path.join(options.output, 'write-prompt.md');
  const extractArgs = ['ts-node', 'scripts/extract.ts', options.url, '--output', options.output];
  if (options.fast) extractArgs.push('--fast');

  const plan: PlannedCommand[] = [
    { label: 'extract', command: 'npx', args: extractArgs },
    { label: 'write-prompt', command: 'npx', args: ['ts-node', 'scripts/build-write-prompt.ts', tokensPath] },
  ];

  if (options.designMd) {
    plan.push({ label: 'validate', command: 'npx', args: ['ts-node', 'scripts/validate.ts', options.designMd, tokensPath] });
    if (options.report) {
      plan.push({ label: 'report', command: 'npx', args: ['ts-node', 'scripts/report-gen.ts', tokensPath, options.output, options.designMd] });
    }
  }

  plan.push({ label: 'write-prompt-output', command: 'write-file', args: [writePromptPath] });
  return plan;
}

function runCommand(step: PlannedCommand): string {
  if (step.command === 'write-file') return '';
  const result = spawnSync(step.command, step.args, {
    cwd: BACKEND_ROOT,
    encoding: 'utf-8',
    timeout: RUN_COMMAND_TIMEOUT_MS,
  });
  if (result.status !== 0 || result.error || result.signal !== null) {
    throw new Error(describeSpawnFailure(step.label, result, RUN_COMMAND_TIMEOUT_MS));
  }
  return result.stdout ?? '';
}

export function runGuided(options: GuidedRunOptions): void {
  const checks = runPreflight(options);
  for (const check of checks) {
    console.log(`${check.ok ? 'PASS' : 'FAIL'} ${check.name}: ${check.detail}`);
  }
  if (checks.some((check) => !check.ok)) {
    throw new Error('Preflight failed');
  }

  // Resolve output/design-md to absolute paths against THIS process's cwd
  // once, up front. runCommand spawns child scripts with cwd: BACKEND_ROOT,
  // so a relative path threaded through unresolved would validate against
  // one cwd here and then get re-resolved against a different cwd inside the
  // child — silently landing somewhere other than what preflight checked.
  const resolvedOutput = path.resolve(process.cwd(), options.output);
  const resolvedDesignMd = options.designMd ? path.resolve(process.cwd(), options.designMd) : undefined;
  const resolvedOptions: GuidedRunOptions = { ...options, output: resolvedOutput, designMd: resolvedDesignMd };

  const plan = buildPlan(resolvedOptions);
  for (const step of plan) {
    console.log(`PLAN ${step.label}: ${step.command} ${step.args.join(' ')}`);
  }
  if (options.dryRun) return;

  fs.mkdirSync(resolvedOutput, { recursive: true });
  const extract = plan.find((step) => step.label === 'extract');
  const writePrompt = plan.find((step) => step.label === 'write-prompt');
  if (!extract || !writePrompt) throw new Error('Missing required plan steps');

  runCommand(extract);
  const prompt = runCommand(writePrompt);
  fs.writeFileSync(path.join(resolvedOutput, 'write-prompt.md'), prompt);

  if (!resolvedDesignMd) {
    console.log('STOP validation: provide --design-md after DESIGN.md is authored');
    return;
  }
  if (!fs.existsSync(resolvedDesignMd)) {
    console.log('STOP validation: DESIGN.md does not exist. The wrapper will not author it.');
    return;
  }
  for (const step of plan.filter((item) => item.label === 'validate' || item.label === 'report')) {
    runCommand(step);
  }
}

if (require.main === module) {
  try {
    runGuided(parseGuidedRunArgs(process.argv));
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}
