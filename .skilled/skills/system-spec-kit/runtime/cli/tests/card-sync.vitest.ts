// ───────────────────────────────────────────────────────────────────
// MODULE: Card Sync Tests
// ───────────────────────────────────────────────────────────────────
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(TEST_DIR, '..', '..', '..');
const GUARD = path.join(SKILL_ROOT, 'runtime', 'cli', 'spec', 'check-card-sync.sh');
const CARD = 'references/workflows/spec-authoring-card.md';
const CHECKLIST = 'references/workflows/spec-folder-authoring-checklist.md';
const scratch: string[] = [];

// The guard reads only these files and the examples folder, so a root holding
// copies of them stands in for the skill without touching the real tree.
function copySkillRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'card-sync-'));
  scratch.push(root);
  for (const rel of ['SKILL.md', 'ROUTER.md', 'leaf-manifest.json', 'leaf-aliases.json', CARD, CHECKLIST]) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.copyFileSync(path.join(SKILL_ROOT, rel), path.join(root, rel));
  }
  fs.mkdirSync(path.join(root, 'templates', 'examples'), { recursive: true });
  return root;
}

function runGuard(root: string, env: NodeJS.ProcessEnv = process.env) {
  const result = spawnSync('bash', [GUARD, '--skill-root', root], { encoding: 'utf8', env });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

function edit(root: string, rel: string, change: (text: string) => string): void {
  const file = path.join(root, rel);
  fs.writeFileSync(file, change(fs.readFileSync(file, 'utf8')));
}

afterAll(() => {
  for (const dir of scratch) fs.rmSync(dir, { recursive: true, force: true });
});

describe('authoring card sync', () => {
  it('keeps the card, the router, the inventory and the checklist in agreement', () => {
    const output = execFileSync('bash', [GUARD], { cwd: SKILL_ROOT, encoding: 'utf8' });
    expect(output).toContain('CARD SYNC OK');
  });

  it('passes on an unchanged copy of the skill root', () => {
    const run = runGuard(copySkillRoot());
    expect(run.status).toBe(0);
    expect(run.output).toContain('CARD SYNC OK');
  });

  it('runs every check after the first failure', () => {
    const root = copySkillRoot();
    fs.rmSync(path.join(root, CARD));
    fs.writeFileSync(path.join(root, CHECKLIST), '');
    const run = runGuard(root);
    expect(run.status).toBe(1);
    expect(run.output).toContain('FAIL card-exists');
    expect(run.output).toContain('FAIL checklist');
    expect(run.output).toContain('FAIL card-names-checklist');
    expect(run.output).toContain('CARD SYNC FAILED');
  });

  it('fails when the checklist still sends a reader to the templates root', () => {
    const root = copySkillRoot();
    edit(root, CHECKLIST, (text) => `${text}\nRead templates from \`.skilled/skills/system-spec-kit/templates/\`\n`);
    const run = runGuard(root);
    expect(run.status).toBe(1);
    expect(run.output).toContain('FAIL checklist: still sends a reader to the templates root');
  });

  it('fails when the checklist names no example route', () => {
    const root = copySkillRoot();
    fs.writeFileSync(path.join(root, CHECKLIST), '');
    const run = runGuard(root);
    expect(run.status).toBe(1);
    expect(run.output).toContain('FAIL checklist: does not send a reader to templates/examples/');
  });

  it('fails when the checklist is missing', () => {
    const root = copySkillRoot();
    fs.rmSync(path.join(root, CHECKLIST));
    const run = runGuard(root);
    expect(run.status).toBe(1);
    expect(run.output).toContain(`FAIL checklist: missing ${CHECKLIST}`);
  });

  it('fails when the example route points at a folder that does not exist', () => {
    const root = copySkillRoot();
    fs.rmSync(path.join(root, 'templates'), { recursive: true });
    const run = runGuard(root);
    expect(run.status).toBe(1);
    expect(run.output).toContain('which does not exist');
  });

  it('fails when the card no longer names the checklist', () => {
    const root = copySkillRoot();
    edit(root, CARD, (text) => text.replaceAll('spec-folder-authoring-checklist.md', 'another-checklist.md'));
    const run = runGuard(root);
    expect(run.status).toBe(1);
    expect(run.output).toContain('FAIL card-names-checklist');
  });

  it('reads every mode of the leaf inventory, not only the last one', () => {
    const root = copySkillRoot();
    edit(root, 'leaf-manifest.json', (text) => {
      const manifest = JSON.parse(text);
      manifest.modes.push({ packet: 'other', workflowMode: 'other-mode', leaves: ['assets/other.md'] });
      return JSON.stringify(manifest);
    });
    expect(runGuard(root).output).toContain('PASS leaf-manifest');

    edit(root, 'leaf-manifest.json', (text) => {
      const manifest = JSON.parse(text);
      manifest.modes[0].leaves = manifest.modes[0].leaves.filter((leaf: string) => leaf !== CARD);
      return JSON.stringify(manifest);
    });
    const run = runGuard(root);
    expect(run.status).toBe(1);
    expect(run.output).toContain('FAIL leaf-manifest');
  });

  it('refuses to report success when rg is missing', () => {
    const root = copySkillRoot();
    edit(root, CHECKLIST, (text) => `${text}\nRead templates from \`.skilled/skills/system-spec-kit/templates/\`\n`);
    const bin = fs.mkdtempSync(path.join(os.tmpdir(), 'card-sync-bin-'));
    scratch.push(bin);
    for (const tool of ['bash', 'awk', 'jq', 'wc', 'tr', 'dirname', 'sed']) {
      const found = execFileSync('bash', ['-c', `command -v ${tool}`], { encoding: 'utf8' }).trim();
      fs.symlinkSync(found, path.join(bin, tool));
    }
    const run = runGuard(root, { ...process.env, PATH: bin });
    expect(run.status).toBe(2);
    expect(run.output).toContain('rg (ripgrep) is required');
    expect(run.output).not.toContain('CARD SYNC OK');
  });
});
