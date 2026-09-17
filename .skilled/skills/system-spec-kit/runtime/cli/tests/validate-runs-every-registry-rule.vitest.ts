import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

// Every registry row must actually run when validate.sh evaluates a packet.
// A row whose script never fires is a rule in name only, and nothing else in
// the suite would notice: the help printer lists rows, it does not run them.
const CLI_ROOT = path.resolve(__dirname, '..');
const REGISTRY = path.join(CLI_ROOT, 'lib', 'validator-registry.json');
const CREATE = path.join(CLI_ROOT, 'spec', 'create.sh');
const VALIDATE = path.join(CLI_ROOT, 'spec', 'validate.sh');

describe('validate.sh runs every registry rule', () => {
  const tempRoot = mkdtempSync(path.join(tmpdir(), 'speckit-registry-coverage-'));
  afterAll(() => rmSync(tempRoot, { recursive: true, force: true }));

  it('reports an entry for every rule id on a fresh Level 2 scaffold', () => {
    const registry = JSON.parse(readFileSync(REGISTRY, 'utf8')) as Array<{ rule_id: string }>;
    const scaffold = JSON.parse(
      execFileSync('bash', [CREATE, '--json', '--skip-branch', '--level', '2', '--path', tempRoot, '--number', '900', 'Registry coverage'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      }).split('\n').filter((line) => line.startsWith('{')).pop() ?? '{}',
    ) as { SPEC_FILE?: string };
    const specFolder = path.dirname(scaffold.SPEC_FILE ?? '');
    expect(specFolder.length).toBeGreaterThan(1);

    let stdout = '';
    try {
      stdout = execFileSync('bash', [VALIDATE, specFolder, '--strict', '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (error) {
      stdout = String((error as { stdout?: string }).stdout ?? '');
    }
    const report = JSON.parse(stdout.trim()) as { entries: Array<{ rule: string }> };
    const seen = new Set(report.entries.map((entry) => entry.rule));
    const missing = registry.map((row) => row.rule_id).filter((id) => !seen.has(id));
    expect(missing).toEqual([]);
  });
});
