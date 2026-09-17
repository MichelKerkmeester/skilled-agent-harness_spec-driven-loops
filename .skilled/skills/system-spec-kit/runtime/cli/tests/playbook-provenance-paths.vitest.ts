import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// A playbook entry that names a suite which does not exist is a verification
// instruction that verifies nothing; one with no provenance at all leaves the
// reader to guess. Every file carries exactly one of two forms, and a cited
// suite path must resolve from the repository, the skill or the runtime root.
const CLI_ROOT = path.resolve(__dirname, '..');
const SKILL_ROOT = path.resolve(CLI_ROOT, '../..');
const REPO_ROOT = path.resolve(SKILL_ROOT, '../../..');
const PLAYBOOK_ROOT = path.join(SKILL_ROOT, 'manual-testing-playbook');
const FORM = /^Provenance: (?:manual only - .+|(\S+\.(?:vitest\.ts|test\.mjs|test\.ts|test\.cjs)))$/u;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.md')) out.push(full);
  }
  return out;
}

function resolves(cited: string): boolean {
  return [REPO_ROOT, SKILL_ROOT, path.join(SKILL_ROOT, 'runtime')].some((base) => existsSync(path.resolve(base, cited)));
}

describe('playbook provenance lines', () => {
  const files = walk(PLAYBOOK_ROOT);

  it('finds the package', () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it('every file carries exactly one provenance line in one of the two forms', () => {
    const problems: string[] = [];
    for (const file of files) {
      const lines = readFileSync(file, 'utf8').split('\n').filter((line) => line.startsWith('Provenance:'));
      const rel = path.relative(PLAYBOOK_ROOT, file);
      if (lines.length !== 1) { problems.push(`${rel}: ${lines.length} provenance lines`); continue; }
      if (!FORM.test(lines[0])) problems.push(`${rel}: unrecognised form "${lines[0]}"`);
    }
    expect(problems).toEqual([]);
  });

  it('every cited suite path resolves on disk', () => {
    const missing: string[] = [];
    for (const file of files) {
      for (const line of readFileSync(file, 'utf8').split('\n')) {
        const match = FORM.exec(line);
        if (match && match[1] && !resolves(match[1])) missing.push(`${path.relative(PLAYBOOK_ROOT, file)} -> ${match[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
