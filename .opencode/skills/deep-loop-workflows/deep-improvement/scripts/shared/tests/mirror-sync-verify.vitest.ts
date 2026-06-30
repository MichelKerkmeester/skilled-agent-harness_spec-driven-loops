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
  '.opencode/skills/deep-loop-workflows/deep-improvement/scripts/lib/mirror-sync-verify.cjs',
)) as {
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

function opencodeToml(body: string): string {
  return `# Agent: ${AGENT_NAME}
name = "${AGENT_NAME}"
description = "Mirror sync fixture"

developer_instructions = '''
${body}
'''
`;
}

function writeAllMirrors(options: { opencodeBody?: string; omitOpenCode?: boolean } = {}): void {
  writeFile(`.opencode/agents/${AGENT_NAME}.md`, CANONICAL);
  writeFile(`.claude/agents/${AGENT_NAME}.md`, CANONICAL.replace('.opencode/agents/*.md', '.claude/agents/*.md'));
  if (!options.omitOpenCode) {
    writeFile(`.opencode/agents/${AGENT_NAME}.toml`, opencodeToml(options.opencodeBody || CANONICAL.replace(/^---[\s\S]*?---\n/, '').trim()));
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
    expect(result.presentRuntimes.sort()).toEqual(['claude', 'opencode', 'opencode']);
    expect(result.missingRuntimes).toEqual([]);
    expect(result.driftRuntimes).toEqual([]);
  });

  it('reports a missing runtime when one mirror is absent', () => {
    writeAllMirrors({ omitOpenCode: true });

    const result = mirrorSync.verifyMirrorSync(AGENT_NAME, CANONICAL, { repoRoot: tmpDir });

    expect(result.allInSync).toBe(false);
    expect(result.missingRuntimes).toEqual(['opencode']);
  });

  it('reports OpenCode drift when TOML body tokens differ while markdown mirrors match', () => {
    writeAllMirrors({ opencodeBody: '# Mirror Sync Fixture\n\nProposal-only agent body.\n' });

    const result = mirrorSync.verifyMirrorSync(AGENT_NAME, CANONICAL, { repoRoot: tmpDir });

    expect(result.allInSync).toBe(false);
    expect(result.missingRuntimes).toEqual([]);
    expect(result.driftRuntimes).toEqual(['opencode']);
  });
});
