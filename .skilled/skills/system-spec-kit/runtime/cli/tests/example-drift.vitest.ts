import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const SCRIPT = path.resolve(__dirname, '../spec/check-example-drift.sh');
const EXAMPLES = path.resolve(__dirname, '../../../templates/examples');
const scratch: string[] = [];

function copyExamples(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'example-drift-'));
  scratch.push(root);
  const copy = path.join(root, 'examples');
  fs.cpSync(EXAMPLES, copy, { recursive: true });
  return copy;
}

function runGuard(examples: string, env: NodeJS.ProcessEnv = process.env) {
  const result = spawnSync('bash', [SCRIPT, examples], { encoding: 'utf8', env });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

// A PATH that keeps every tool the guard calls except rg, so the guard's own
// preflight is what decides the outcome on any machine.
function pathWithoutRg(): string {
  const bin = fs.mkdtempSync(path.join(os.tmpdir(), 'example-drift-bin-'));
  scratch.push(bin);
  fs.symlinkSync(process.execPath, path.join(bin, 'node'));
  for (const tool of ['bash', 'awk', 'basename', 'dirname']) {
    const found = execFileSync('bash', ['-c', `command -v ${tool}`], { encoding: 'utf8' }).trim();
    fs.symlinkSync(found, path.join(bin, tool));
  }
  return bin;
}

afterAll(() => {
  for (const dir of scratch) fs.rmSync(dir, { recursive: true, force: true });
});

describe('example drift guard', () => {
  it('passes on the shipped examples', () => {
    const output = execFileSync('bash', [SCRIPT], { encoding: 'utf8' });
    expect(output.trim()).toBe('EXAMPLE_DRIFT_OK');
  });

  it('fails when an example loses a required anchor', () => {
    const copy = copyExamples();
    const plan = path.join(copy, 'level-1', 'plan.md');
    fs.writeFileSync(plan, fs.readFileSync(plan, 'utf8').replace(/<!-- \/?ANCHOR:summary -->\n/gu, ''));
    const run = runGuard(copy);
    expect(run.status).toBe(1);
    expect(run.output).toContain('missing_anchor summary');
  });

  it('fails when an example moves a section out of template order', () => {
    const copy = copyExamples();
    const plan = path.join(copy, 'level-1', 'plan.md');
    const text = fs.readFileSync(plan, 'utf8');
    const block = text.match(/<!-- ANCHOR:summary -->[\s\S]*?<!-- \/ANCHOR:summary -->\n/u)?.[0] ?? '';
    expect(block).not.toBe('');
    fs.writeFileSync(plan, `${text.replace(block, '')}\n${block}`);
    const run = runGuard(copy);
    expect(run.status).toBe(1);
    expect(run.output).toContain('out_of_order_anchor');
  });

  it('fails when a level has no example', () => {
    const copy = copyExamples();
    fs.rmSync(path.join(copy, 'level-2'), { recursive: true, force: true });
    const run = runGuard(copy);
    expect(run.status).toBe(1);
    expect(run.output).toContain('no example docs for Level 2');
  });

  it('fails when a level folder is empty', () => {
    const copy = copyExamples();
    const level = path.join(copy, 'level-3+');
    for (const file of fs.readdirSync(level)) fs.rmSync(path.join(level, file));
    const run = runGuard(copy);
    expect(run.status).toBe(1);
    expect(run.output).toContain('no example docs for Level 3+');
  });

  it('refuses to report success when rg is missing', () => {
    const copy = copyExamples();
    const run = runGuard(copy, { ...process.env, PATH: pathWithoutRg() });
    expect(run.status).toBe(2);
    expect(run.output).toContain('rg (ripgrep) is required');
    expect(run.output).not.toContain('EXAMPLE_DRIFT_OK');
  });
});
