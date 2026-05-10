import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(TEST_DIR, '../../../../../');

const markdownMirrors = [
  '.opencode/agents/deep-ai-council.md',
  '.claude/agents/deep-ai-council.md',
  '.gemini/agents/deep-ai-council.md',
];

function read(path: string): string {
  return readFileSync(join(WORKSPACE_ROOT, path), 'utf8').replace(/\r\n/g, '\n');
}

function frontmatter(text: string): string {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1].trim() : '';
}

function body(text: string): string {
  return text.replace(/^---\n[\s\S]*?\n---\n+/, '').trim();
}

describe('deep-ai-council runtime mirror parity', () => {
  it('keeps markdown mirror permission YAML byte-equivalent', () => {
    const canonical = frontmatter(read(markdownMirrors[0]));
    // OpenCode permission schema accepts `allow` | `ask` | `deny` strings or
    // a glob-keyed object — NOT a `paths: [...]` array. Path-scope to
    // `ai-council/**` is enforced in lib/persist-artifacts.js via
    // OUT_OF_SCOPE_WRITE rejection. See ADR-001 follow-up note.
    expect(canonical).toContain('write: allow');
    expect(canonical).toContain('edit: allow');
    expect(canonical).toContain('bash: deny');
    expect(canonical).toContain('patch: deny');

    for (const mirror of markdownMirrors.slice(1)) {
      expect(frontmatter(read(mirror)), mirror).toBe(canonical);
    }
  });

  it('keeps all four body mirrors aligned and removes planning-only persistence text', () => {
    const canonicalBody = body(read(markdownMirrors[0]));
    for (const mirror of markdownMirrors.slice(1)) {
      expect(body(read(mirror)), mirror).toBe(canonicalBody);
    }

    const codex = read('.codex/agents/deep-ai-council.toml');
    expect(codex).toContain('sandbox_mode = "workspace-write"');
    expect(codex).toContain('ai-council/**');
    expect(codex).toContain('COUNCIL PERSISTENCE PROTOCOL');
    expect(codex).not.toContain('planning-only: write, edit, bash, and patch remain denied');
  });
});
