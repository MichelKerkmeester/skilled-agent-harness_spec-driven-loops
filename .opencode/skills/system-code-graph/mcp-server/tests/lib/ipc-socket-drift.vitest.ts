// ───────────────────────────────────────────────────────────────
// MODULE: IPC socket-server drift guard
// ───────────────────────────────────────────────────────────────
// The bind/reclaim/serve bridge logic is shared verbatim across the
// daemon launchers. memory + skill-advisor import it from the shared
// package; code-index keeps a LOCAL byte-identical copy because it has
// no dependency on the shared package (a single-project build with no
// node_modules link to it). This guard fails if the local copy drifts
// from the canonical shared source so the security/race-safety contract
// cannot silently diverge between services.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../../../../../..');

const canonicalPath = resolve(
  repoRoot,
  '.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts',
);
const localCopyPath = resolve(
  repoRoot,
  '.opencode/skills/system-code-graph/mcp-server/lib/ipc/socket-server.ts',
);

// Compare on normalized line endings so a CRLF/LF checkout difference is not flagged as drift; the
// behavioural content is what must stay identical.
function normalize(source: string): string {
  return source.replace(/\r\n/g, '\n');
}

describe('IPC socket-server drift guard (code-index local copy vs shared canonical)', () => {
  it('keeps the code-index local copy byte-identical to the shared canonical source', () => {
    const canonical = normalize(readFileSync(canonicalPath, 'utf8'));
    const localCopy = normalize(readFileSync(localCopyPath, 'utf8'));

    expect(
      localCopy,
      [
        'code-index lib/ipc/socket-server.ts has drifted from the canonical shared copy at',
        '.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts.',
        'Re-sync the two files (the shared copy is the source of truth) so every daemon keeps',
        'the same bind/reclaim/serve and stale-socket security contract.',
      ].join(' '),
    ).toBe(canonical);
  });
});
