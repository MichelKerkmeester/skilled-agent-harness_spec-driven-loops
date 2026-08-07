import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../../');
const require = createRequire(import.meta.url);

const mirrorSync = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs',
)) as {
  compareBodyTokens: (expectedBody: string, actualBody: string) => {
    matches: boolean;
    orderMatches?: boolean;
  };
  verifyMirrorSync: (
    agentName: string,
    content: string,
    options?: { repoRoot?: string; expectedFormat?: string },
  ) => {
    presentRuntimes: string[];
    missingRuntimes: string[];
    driftRuntimes: string[];
    allInSync: boolean;
  };
};

const AGENT_NAME = 'mirror-sync-fixture';
const CANONICAL = `---
name: mirror-sync-fixture
description: Mirror sync fixture
---

# Mirror Sync Fixture

Proposal-only agent body.

**CRITICAL**: Keep all runtime mirrors aligned.

## 1. CORE WORKFLOW

Read first, verify runtime mirrors, and report structured evidence.
`;

let tmpDir: string;

function writeFile(relativePath: string, content: string): void {
  const filePath = path.join(tmpDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeAllMirrors(options: { claudeBody?: string; omitClaude?: boolean } = {}): void {
  writeFile(`.opencode/agents/${AGENT_NAME}.md`, CANONICAL);
  if (!options.omitClaude) {
    const claudeBody = options.claudeBody || CANONICAL.replace('.opencode/agents/*.md', '.claude/agents/*.md');
    writeFile(`.claude/agents/${AGENT_NAME}.md`, claudeBody);
  }
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mirror-sync-verify-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('mirror-sync-verify', () => {
  it('reports allInSync when all repo-managed runtime mirrors match', () => {
    writeAllMirrors();

    const result = mirrorSync.verifyMirrorSync(AGENT_NAME, CANONICAL, { repoRoot: tmpDir });

    expect(result.allInSync).toBe(true);
    expect(result.presentRuntimes.sort()).toEqual(['claude', 'opencode']);
    expect(result.missingRuntimes).toEqual([]);
    expect(result.driftRuntimes).toEqual([]);
  });

  it('reports a missing runtime when one mirror is absent', () => {
    writeAllMirrors({ omitClaude: true });

    const result = mirrorSync.verifyMirrorSync(AGENT_NAME, CANONICAL, { repoRoot: tmpDir });

    expect(result.allInSync).toBe(false);
    expect(result.missingRuntimes).toEqual(['claude']);
  });

  it('reports Claude drift when mirror body tokens differ from the canonical', () => {
    writeAllMirrors({ claudeBody: '# Mirror Sync Fixture\n\nA completely different body.\n' });

    const result = mirrorSync.verifyMirrorSync(AGENT_NAME, CANONICAL, { repoRoot: tmpDir });

    expect(result.allInSync).toBe(false);
    expect(result.missingRuntimes).toEqual([]);
    expect(result.driftRuntimes).toEqual(['claude']);
  });

  it('rejects a reordered load-bearing instruction sequence', () => {
    const expected = `# Deep Review

1. READ STATE
2. WRITE FINDINGS
`;
    const reordered = `# Deep Review

1. WRITE FINDINGS
2. READ STATE
`;

    const comparison = mirrorSync.compareBodyTokens(expected, reordered);

    expect(comparison.matches).toBe(false);
    expect(comparison.orderMatches).toBe(false);
  });

  it('rejects a mirror whose body requires a tool absent from its declared surface', () => {
    const canonical = `---
name: ${AGENT_NAME}
description: Mirror sync fixture
permission:
  read: allow
  detect_changes: allow
---

# Mirror Sync Fixture

Use detect_changes before reporting structural impact.
`;
    const claude = `---
name: ${AGENT_NAME}
description: Mirror sync fixture
tools: Read
---

# Mirror Sync Fixture

Use detect_changes before reporting structural impact.
`;
    writeFile(`.opencode/agents/${AGENT_NAME}.md`, canonical);
    writeFile(`.claude/agents/${AGENT_NAME}.md`, claude);

    const result = mirrorSync.verifyMirrorSync(AGENT_NAME, canonical, { repoRoot: tmpDir });

    expect(result.allInSync).toBe(false);
    expect(result.driftRuntimes).toEqual(['claude']);
  });

  it('checks a Codex mirror only when that agent is actually shipped there', () => {
    writeAllMirrors();
    const withoutCodex = mirrorSync.verifyMirrorSync(AGENT_NAME, CANONICAL, { repoRoot: tmpDir });
    expect(withoutCodex.missingRuntimes).toEqual([]);

    const codexBody = CANONICAL.replace(/^---[\s\S]*?---\n+/, '').trim();
    writeFile(
      `.codex/agents/${AGENT_NAME}.toml`,
      `name = "${AGENT_NAME}"\ndescription = "Mirror sync fixture"\ndeveloper_instructions = '''\n${codexBody}\n'''\n`,
    );
    const withCodex = mirrorSync.verifyMirrorSync(AGENT_NAME, CANONICAL, { repoRoot: tmpDir });

    expect(withCodex.presentRuntimes.sort()).toEqual(['claude', 'codex', 'opencode']);
    expect(withCodex.missingRuntimes).toEqual([]);
    expect(withCodex.driftRuntimes).toEqual([]);
  });
});
