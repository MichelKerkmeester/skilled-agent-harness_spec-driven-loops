// The load-bearing safety property for wiring this admission gate into the live deep-research
// serving path: with no durable cutover on record, the gate must resolve to the legacy writer with
// admission open, so interposing it changes nothing until an explicit, authorized flip lands.
import { describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { admitCanonicalWrite } from '../../lib/deep-research-authority/index.js';
import { AuthorityRegistry } from '../../lib/per-mode-authority-flip/index.js';

function freshRoot(): string {
  return mkdtempSync(join(tmpdir(), 'dr-authority-'));
}

describe('admitCanonicalWrite — deep-research read-only admission gate', () => {
  it('defaults to the legacy writer for a never-written authority record', () => {
    const result = admitCanonicalWrite('deep-research', { authorityRoot: freshRoot() });
    expect(result.outcome).toBe('selected');
    if (result.outcome !== 'selected') return;
    expect(result.route).toBe('legacy');
    expect(result.admissionOpen).toBe(true);
    expect(result.state).toBe('legacy_authoritative');
  });

  it('is read-only: calling it never writes an authority record to the durable root', () => {
    const root = freshRoot();
    admitCanonicalWrite('deep-research', { authorityRoot: root });
    const after = new AuthorityRegistry(root).read('deep-research');
    expect(after.state).toBe('legacy_authoritative');
    expect(after.epoch).toBe(1);
    expect(after.selectedWriter).toBe('legacy');
  });

  it('denies (fail-closed) when the on-disk authority record is malformed JSON', () => {
    const root = freshRoot();
    mkdirSync(root, { recursive: true });
    writeFileSync(join(root, 'authority-deep-research.json'), '{ not valid json');
    expect(() => admitCanonicalWrite('deep-research', { authorityRoot: root })).toThrow();
  });
});
