#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

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
const SKILL_ROOT = path.resolve(BACKEND_ROOT, '..');

function usage(): string {
  return [
    'Usage: guided-run.ts <url> --output <dir> [--design-md <path>] [--fast] [--report] [--dry-run]',
    'Runs readiness checks, extraction, write-prompt generation and optional validation.',
    'It never authors DESIGN.md content.',
  ].join('\n');
}

export function parseGuidedRunArgs(argv: string[]): GuidedRunOptions {
  const args = argv.slice(2);
  const url = args.find((arg) => !arg.startsWith('--')) ?? '';
  const readValue = (flag: string): string | undefined => {
    const index = args.indexOf(flag);
    if (index === -1) return undefined;
    return args[index + 1];
  };
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

function commandExists(command: string, args: string[]): boolean {
  const result = spawnSync(command, args, { cwd: BACKEND_ROOT, stdio: 'ignore' });
  return result.status === 0;
}

export function runPreflight(options: GuidedRunOptions): PreflightCheck[] {
  const outputPath = path.resolve(process.cwd(), options.output);
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  const packageJson = path.join(BACKEND_ROOT, 'package.json');
  const nodeModules = path.join(BACKEND_ROOT, 'node_modules');
  const chromiumOk = commandExists('npx', ['playwright', 'install', '--dry-run', 'chromium']);
  const escapesSkill = !outputPath.startsWith(SKILL_ROOT + path.sep);

  return [
    { name: 'node', ok: nodeMajor >= 20, detail: `Node ${process.versions.node}` },
    { name: 'package-json', ok: fs.existsSync(packageJson), detail: packageJson },
    { name: 'dependencies', ok: fs.existsSync(nodeModules), detail: nodeModules },
    { name: 'chromium', ok: chromiumOk, detail: 'Playwright Chromium dry-run check' },
    { name: 'output-path', ok: escapesSkill, detail: outputPath },
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
  const result = spawnSync(step.command, step.args, { cwd: BACKEND_ROOT, encoding: 'utf-8' });
  if (result.status !== 0) {
    throw new Error(`${step.label} failed: ${result.stderr || result.stdout}`);
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

  const plan = buildPlan(options);
  for (const step of plan) {
    console.log(`PLAN ${step.label}: ${step.command} ${step.args.join(' ')}`);
  }
  if (options.dryRun) return;

  fs.mkdirSync(path.resolve(process.cwd(), options.output), { recursive: true });
  const extract = plan.find((step) => step.label === 'extract');
  const writePrompt = plan.find((step) => step.label === 'write-prompt');
  if (!extract || !writePrompt) throw new Error('Missing required plan steps');

  runCommand(extract);
  const prompt = runCommand(writePrompt);
  fs.writeFileSync(path.resolve(process.cwd(), options.output, 'write-prompt.md'), prompt);

  if (!options.designMd) {
    console.log('STOP validation: provide --design-md after DESIGN.md is authored');
    return;
  }
  if (!fs.existsSync(path.resolve(process.cwd(), options.designMd))) {
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
