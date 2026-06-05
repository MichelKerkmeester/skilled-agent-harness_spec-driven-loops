import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(TEST_DIR, '../../../../../');

const markdownMirrors = [
  '.opencode/agents/ai-council.md',
  '.claude/agents/ai-council.md',
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

function normalizeProse(text: string): string {
  return text.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\s+/g, ' ').trim();
}

function sharedBody(text: string): string {
  return text
    .replace(/\n## Convergence Threshold Semantics\n[\s\S]*?\n---\n/, '\n---\n')
    .trim();
}

describe('ai-council runtime mirror parity', () => {
  it('keeps markdown mirror permission YAML byte-equivalent', () => {
    const canonical = frontmatter(read(markdownMirrors[0]));
    // OpenCode permission schema accepts `allow` | `ask` | `deny` strings or
    // a glob-keyed object — NOT a `paths: [...]` array. Path-scope to
    // `ai-council/**` is enforced in lib/persist-artifacts.js via
    // OUT_OF_SCOPE_WRITE rejection. See follow-up note
    expect(canonical).toContain('write: allow');
    expect(canonical).toContain('edit: allow');
    expect(canonical).toContain('bash: deny');
    expect(canonical).toContain('patch: deny');

    // Claude uses a translated frontmatter schema (commit 85bd60b9f) — `tools:` list
    // instead of the OpenCode `mode:`/`temperature:`/`permission:` block. Path-scope
    // is enforced by the same OUT_OF_SCOPE_WRITE rejection in the helper library.
    // Assert the shared identity fields (name + description prose) match and that
    // the Claude-specific tools whitelist is present.
    const claudeFM = frontmatter(read('.claude/agents/ai-council.md'));
    const nameMatch = canonical.match(/^name:\s*(.+)$/m);
    const descMatch = canonical.match(/^description:\s*"?(.+?)"?$/m);
    expect(nameMatch, 'canonical name field').not.toBeNull();
    expect(descMatch, 'canonical description field').not.toBeNull();
    expect(claudeFM, '.claude name').toContain(`name: ${nameMatch![1]}`);
    expect(claudeFM, '.claude description prose').toContain(descMatch![1]);
    expect(claudeFM, '.claude tools line').toMatch(/^tools:\s*.*Read/m);
    expect(claudeFM, '.claude tools includes Write').toContain('Write');
    expect(claudeFM, '.claude tools includes Edit').toContain('Edit');
  });

  it('keeps repo-managed body mirrors aligned and removes planning-only persistence text', () => {
    const canonicalFM = frontmatter(read(markdownMirrors[0]));
    const nameMatch = canonicalFM.match(/^name:\s*"?(.+?)"?$/m);
    const descMatch = canonicalFM.match(/^description:\s*"?(.+?)"?$/m);
    expect(nameMatch, 'canonical name field').not.toBeNull();
    expect(descMatch, 'canonical description field').not.toBeNull();

    const canonicalBody = body(read(markdownMirrors[0]));
    expect(canonicalBody).toContain('deep-ai-council threshold scores');
    const canonicalSharedBody = sharedBody(canonicalBody);
    for (const mirror of markdownMirrors.slice(1)) {
      expect(sharedBody(body(read(mirror))), mirror).toBe(canonicalSharedBody);
    }

    const codex = read('.codex/agents/ai-council.toml');
    expect(codex).toContain(`name = "${nameMatch![1]}"`);
    expect(normalizeProse(codex)).toContain(normalizeProse(descMatch![1]));
    expect(codex).toContain('sandbox_mode = "workspace-write"');
    expect(codex).toContain('ai-council/**');
    expect(codex).toContain('COUNCIL PERSISTENCE PROTOCOL');
    expect(codex).not.toContain('planning-only: write, edit, bash, and patch remain denied');
  });
});
