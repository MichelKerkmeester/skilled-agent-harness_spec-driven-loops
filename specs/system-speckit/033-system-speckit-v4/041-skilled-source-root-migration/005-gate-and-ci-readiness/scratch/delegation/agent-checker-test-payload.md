# Files for unit agent-checker-test

Create each file named below with exactly the content between its two fence lines, without the fence lines themselves.

## File 1

File: `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-agent-mirror-sync.vitest.ts`

CONTENT:

~~~~text
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const SCRIPTS_DIR = '.opencode/skills/system-deep-loop/deep-improvement/scripts';

const AGENT_NAME = 'mirror-sync-probe';
const CANONICAL = `---
name: mirror-sync-probe
description: Mirror sync probe
---

# Mirror Sync Probe

Proposal-only agent body.

## 1. CORE WORKFLOW

Read first, verify runtime mirrors, and report structured evidence.
`;

let tmpDir: string;

function writeFile(relativePath: string, content: string): void {
  const filePath = path.join(tmpDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function runChecker(...args: string[]) {
  return spawnSync(process.execPath, [path.join(tmpDir, SCRIPTS_DIR, 'check-agent-mirror-sync.cjs'), ...args], {
    cwd: tmpDir,
    encoding: 'utf8',
  });
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'check-agent-mirror-sync-'));
  // The checker finds its repository from its own location, so a copy at the same
  // depth checks the fixture agents instead of the real ones.
  for (const file of ['check-agent-mirror-sync.cjs', 'lib/mirror-sync-verify.cjs']) {
    writeFile(path.join(SCRIPTS_DIR, file), fs.readFileSync(path.join(WORKSPACE_ROOT, SCRIPTS_DIR, file), 'utf8'));
  }
  // The copied verifier requires the shared frontmatter parser by package name.
  fs.mkdirSync(path.join(tmpDir, 'node_modules', '@spec-kit'), { recursive: true });
  fs.symlinkSync(
    path.join(WORKSPACE_ROOT, '.opencode/skills/system-spec-kit/shared'),
    path.join(tmpDir, 'node_modules', '@spec-kit', 'shared'),
  );
  writeFile(`.opencode/agents/${AGENT_NAME}.md`, CANONICAL);
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('check-agent-mirror-sync', () => {
  it('checks an agent changed under .skilled/agents', () => {
    writeFile(`.claude/agents/${AGENT_NAME}.md`, CANONICAL);

    const result = runChecker(`.skilled/agents/${AGENT_NAME}.md`);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('1 agent(s) checked');
  });

  it('blocks a drifted mirror named through a .skilled/agents path', () => {
    writeFile(`.claude/agents/${AGENT_NAME}.md`, '# Mirror Sync Probe\n\nA completely different body.\n');

    const result = runChecker(`.skilled/agents/${AGENT_NAME}.md`);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain(`DRIFT  ${AGENT_NAME} [claude]`);
  });
});
~~~~
