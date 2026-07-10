import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SB = resolve(__dirname, '..');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { scanConnectivity } = require(join(SB, 'd5-connectivity.cjs'));

const DIRS: string[] = [];
afterEach(() => { for (const d of DIRS.splice(0)) rmSync(d, { recursive: true, force: true }); });

// A minimal skill whose router reaches referenced.md but not the two catalog files.
function makeSkill(withAllowlist: boolean): string {
  const dir = mkdtempSync(join(tmpdir(), 'allowlist-'));
  DIRS.push(dir);
  mkdirSync(join(dir, 'references'), { recursive: true });
  mkdirSync(join(dir, 'assets'), { recursive: true });
  writeFileSync(join(dir, 'references', 'referenced.md'), '# routed\n');
  writeFileSync(join(dir, 'references', 'orphan.md'), '# not routed\n');
  writeFileSync(join(dir, 'assets', 'README.md'), '# index catalog\n');
  writeFileSync(join(dir, 'SKILL.md'),
    '---\nname: t\n---\n```python\n' +
    'INTENT_SIGNALS = {\n  "X": {"weight": 3, "keywords": ["x"]},\n}\n' +
    'RESOURCE_MAP = {\n  "X": ["references/referenced.md"],\n}\n```\n');
  if (withAllowlist) {
    writeFileSync(join(dir, 'routing-allowlist.json'),
      JSON.stringify({ intentionally_unrouted: [{ path: 'assets/README.md', reason: 'index catalog' }] }));
  }
  return dir;
}

describe('routing allowlist — d5 connectivity', () => {
  it('without an allowlist, both unrouted files are orphans (backward-compatible)', () => {
    const r = scanConnectivity({ skillRoot: makeSkill(false) });
    expect(r.orphanReferences.sort()).toEqual(['assets/README.md', 'references/orphan.md']);
    expect(r.findings.some((f: any) => f.class === 'orphan_allowlisted')).toBe(false);
  });

  it('an allowlisted file is not an orphan and carries zero score penalty', () => {
    const withList = scanConnectivity({ skillRoot: makeSkill(true) });
    // README is exempted; only the real orphan remains
    expect(withList.orphanReferences).toEqual(['references/orphan.md']);
    expect(withList.findings.some((f: any) => f.class === 'orphan_allowlisted' && f.severity === 'info')).toBe(true);
    // score is strictly higher than the same skill without the allowlist (one fewer P2)
    const withoutList = scanConnectivity({ skillRoot: makeSkill(false) });
    expect(withList.score).toBeGreaterThan(withoutList.score);
  });

  it('malformed allowlist json falls back to empty (no crash, no exemptions)', () => {
    const dir = makeSkill(false);
    writeFileSync(join(dir, 'routing-allowlist.json'), '{ not valid json');
    const r = scanConnectivity({ skillRoot: dir });
    expect(r.orphanReferences.sort()).toEqual(['assets/README.md', 'references/orphan.md']);
  });
});
