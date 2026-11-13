// ───────────────────────────────────────────────────────────────────
// MODULE: Gate 1 Pointer Synchronizer
// ───────────────────────────────────────────────────────────────────
// The generator must write both pointer blocks from the root AGENTS.md lines,
// report a clean tree under --check, report drift when either block is edited
// by hand or removed, and drop the command block when its root line goes away,
// without touching the text around the blocks.

import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { afterAll, describe, expect, it } from 'vitest';

const SCRIPT = path.resolve(__dirname, '..', 'runtime-mirrors', 'sync-gate1-pointers.cjs');
const GATE_LINE = '1. Run the trigger index lookup: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "<prompt>"` → Surface relevant context.';
const GATE_TWO_CALL_LINE = '2. Run the direct call: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json <payload>` before acting.';
const GATE_TWO_COMMAND_LINE = '- **Command in the brief.** A brief that names a command offers its workflow beside the skill packet.';
const CURSOR_RULE = '---\nalwaysApply: true\n---\n\n# Routing\n\n- pointer one\n';

function run(root: string, ...args: string[]): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync('node', [SCRIPT, '--root', root, ...args], { encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function seed(root: string): void {
  fs.mkdirSync(path.join(root, '.cursor', 'rules'), { recursive: true });
  fs.writeFileSync(path.join(root, 'AGENTS.md'), `# Root\n\n#### GATE 1\n${GATE_LINE}\n\n#### GATE 2\n${GATE_TWO_CALL_LINE}\n${GATE_TWO_COMMAND_LINE}\n`);
  fs.writeFileSync(path.join(root, '.cursor', 'rules', 'skill-routing.md'), CURSOR_RULE);
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
    const text = fs.readFileSync(path.join(root, '.cursor', 'rules', 'skill-routing.md'), 'utf8');
    expect(text).toContain('<!-- spec-kit:gate1-pointer:start -->');
    expect(text).toContain('lookup-trigger-index.mjs --json -- "<prompt>"');
    // The text that was there before the block is untouched.
    expect(text.startsWith(CURSOR_RULE)).toBe(true);

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
    expect(fs.readFileSync(path.join(root, '.cursor', 'rules', 'skill-routing.md'), 'utf8')).toContain('--json --scope specs --');
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

  it('writes both pointer blocks and reports a clean tree', () => {
    const both = fs.mkdtempSync(path.join(tmpdir(), 'gate2-pointer-both-'));
    try {
      seed(both);
      const write = run(both);
      expect(write.status, write.stderr).toBe(0);

      const text = fs.readFileSync(path.join(both, '.cursor', 'rules', 'skill-routing.md'), 'utf8');
      expect(text).toContain('<!-- spec-kit:gate2-command-pointer:start -->');
      expect(text).toContain('<!-- spec-kit:gate2-command-pointer:end -->');
      expect(text).toContain('skill-advisor.cjs advisor_recommend');
      expect(text).toContain('**Command in the brief.**');
      // The command block follows the Gate 1 block rather than replacing it.
      expect(text.indexOf('<!-- spec-kit:gate1-pointer:start -->'))
        .toBeLessThan(text.indexOf('<!-- spec-kit:gate2-command-pointer:start -->'));

      const check = run(both, '--check');
      expect(check.status, check.stderr).toBe(0);
      expect(check.stdout).toMatch(/PASS/u);
    } finally {
      fs.rmSync(both, { recursive: true, force: true });
    }
  });

  it('writes block one only and removes a stale command block when the root line goes away', () => {
    const gone = fs.mkdtempSync(path.join(tmpdir(), 'gate2-pointer-gone-'));
    try {
      seed(gone);
      expect(run(gone).status).toBe(0);
      fs.writeFileSync(path.join(gone, 'AGENTS.md'), `# Root\n\n#### GATE 1\n${GATE_LINE}\n`);

      expect(run(gone).status).toBe(0);
      const text = fs.readFileSync(path.join(gone, '.cursor', 'rules', 'skill-routing.md'), 'utf8');
      expect(text).toContain('<!-- spec-kit:gate1-pointer:start -->');
      expect(text).not.toContain('<!-- spec-kit:gate2-command-pointer:start -->');
      expect(text).not.toContain('<!-- spec-kit:gate2-command-pointer:end -->');
      expect(run(gone, '--check').status).toBe(0);
    } finally {
      fs.rmSync(gone, { recursive: true, force: true });
    }
  });

  it('reports drift when the command block is edited by hand', () => {
    const edited = fs.mkdtempSync(path.join(tmpdir(), 'gate2-pointer-edited-'));
    try {
      seed(edited);
      expect(run(edited).status).toBe(0);
      const cursorRule = path.join(edited, '.cursor', 'rules', 'skill-routing.md');
      const clean = fs.readFileSync(cursorRule, 'utf8');
      fs.writeFileSync(cursorRule, clean.replace('offers its workflow beside the skill packet', 'offers its workflow beside the skill packet, edited'));

      const drifted = run(edited, '--check');
      expect(drifted.status).toBe(1);
      expect(drifted.stderr).toMatch(/skill-routing\.md: pointer block differs from the root AGENTS\.md Gate 2 lines/u);
    } finally {
      fs.rmSync(edited, { recursive: true, force: true });
    }
  });
});
