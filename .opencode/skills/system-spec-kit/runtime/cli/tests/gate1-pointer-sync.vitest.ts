// ───────────────────────────────────────────────────────────────────
// TEST: Gate 1 pointer synchronizer
// ───────────────────────────────────────────────────────────────────
// The generator must write the pointer blocks from the root AGENTS.md line,
// report a clean tree under --check, and report drift when a target's block
// is edited by hand or removed, without touching the text around the block.

import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { afterAll, describe, expect, it } from 'vitest';

const SCRIPT = path.resolve(__dirname, '..', 'runtime-mirrors', 'sync-gate1-pointers.cjs');
const GATE_LINE = '1. Run the trigger index lookup: `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "<prompt>"` → Surface relevant context.';
const NODETERM = '<!-- nodeterm:demo:start -->\n# Demo\nowned by nodeterm\n<!-- nodeterm:demo:end -->\n';

function run(root: string, ...args: string[]): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync('node', [SCRIPT, '--root', root, ...args], { encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function seed(root: string): void {
  fs.mkdirSync(path.join(root, '.codex'), { recursive: true });
  fs.mkdirSync(path.join(root, '.cursor', 'rules'), { recursive: true });
  fs.writeFileSync(path.join(root, 'AGENTS.md'), `# Root\n\n#### GATE 1\n${GATE_LINE}\n`);
  fs.writeFileSync(path.join(root, '.codex', 'AGENTS.md'), NODETERM);
  fs.writeFileSync(path.join(root, '.cursor', 'rules', 'skill-routing.md'), '---\nalwaysApply: true\n---\n\n# Routing\n\n- pointer one\n');
}

describe('sync-gate1-pointers.cjs', () => {
  const root = fs.mkdtempSync(path.join(tmpdir(), 'gate1-pointer-sync-'));
  afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

  it('reports drift before the blocks exist, writes them, then reports a clean tree', () => {
    seed(root);
    const before = run(root, '--check');
    expect(before.status).toBe(1);
    expect(before.stderr).toMatch(/no Gate 1 pointer block/u);

    const write = run(root);
    expect(write.status, write.stderr).toBe(0);
    for (const file of ['.codex/AGENTS.md', '.cursor/rules/skill-routing.md']) {
      const text = fs.readFileSync(path.join(root, file), 'utf8');
      expect(text).toContain('<!-- spec-kit:gate1-pointer:start -->');
      expect(text).toContain('lookup-trigger-index.mjs --json -- "<prompt>"');
    }
    // The text that was there before the block is untouched.
    expect(fs.readFileSync(path.join(root, '.codex', 'AGENTS.md'), 'utf8').startsWith(NODETERM)).toBe(true);

    const after = run(root, '--check');
    expect(after.status, after.stderr).toBe(0);
    expect(after.stdout).toMatch(/PASS/u);
  });

  it('reports drift when a pointer block is edited by hand and is idempotent when rewritten', () => {
    const cursorRule = path.join(root, '.cursor', 'rules', 'skill-routing.md');
    const clean = fs.readFileSync(cursorRule, 'utf8');
    fs.writeFileSync(cursorRule, clean.replace('lookup-trigger-index.mjs', 'lookup-trigger-index-old.mjs'));
    const drifted = run(root, '--check');
    expect(drifted.status).toBe(1);
    expect(drifted.stderr).toMatch(/skill-routing\.md: pointer block differs/u);

    expect(run(root).status).toBe(0);
    expect(fs.readFileSync(cursorRule, 'utf8')).toBe(clean);
    expect(run(root).status).toBe(0);
    expect(fs.readFileSync(cursorRule, 'utf8')).toBe(clean);
  });

  it('follows the root line when it changes', () => {
    const rootAgents = path.join(root, 'AGENTS.md');
    fs.writeFileSync(rootAgents, fs.readFileSync(rootAgents, 'utf8').replace('--json --', '--json --scope specs --'));
    expect(run(root, '--check').status).toBe(1);
    expect(run(root).status).toBe(0);
    expect(fs.readFileSync(path.join(root, '.codex', 'AGENTS.md'), 'utf8')).toContain('--json --scope specs --');
  });

  it('exits 2 when the root AGENTS.md carries no Gate 1 line', () => {
    const bare = fs.mkdtempSync(path.join(tmpdir(), 'gate1-pointer-bare-'));
    try {
      fs.writeFileSync(path.join(bare, 'AGENTS.md'), '# nothing here\n');
      const result = run(bare, '--check');
      expect(result.status).toBe(2);
      expect(result.stderr).toMatch(/carries no line naming lookup-trigger-index\.mjs/u);
    } finally {
      fs.rmSync(bare, { recursive: true, force: true });
    }
  });
});
