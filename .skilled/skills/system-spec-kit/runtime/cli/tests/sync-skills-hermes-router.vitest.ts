// ───────────────────────────────────────────────────────────────────
// MODULE: Hermes Skill Sync Router Copy
// ───────────────────────────────────────────────────────────────────
//
// A skill's ROUTER.md sits beside its SKILL.md, so the Hermes copy of the
// router needs the same relative-link rewrite as the skill body, or every
// prose link in it points at nothing under .hermes/skills/<name>/. Fenced
// blocks and inline code are data a tool parses, so they must stay
// byte-identical to the source.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const SCRIPT = path.join(__dirname, '..', 'hermes', 'sync-skills-hermes.cjs');

const FENCED = ['```python', 'RESOURCE_MAP = {"A": ["references/a.md"]}  # [x](references/a.md)', '```'];
const INLINE = 'Load `[y](references/a.md)` only on request.';

let sandbox = '';
let sourceDir = '';
let outputDir = '';

function runSync(extraArgs: string[]) {
  return spawnSync(process.execPath, [SCRIPT, ...extraArgs], {
    encoding: 'utf8',
    env: {
      ...process.env,
      HERMES_SKILLS_SOURCE_DIR: sourceDir,
      HERMES_SKILLS_OUTPUT_DIR: outputDir,
      HERMES_AGENTS_SOURCE_DIR: path.join(sandbox, 'agents'),
    },
  });
}

beforeAll(() => {
  sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'hermes-router-sync-'));
  sourceDir = path.join(sandbox, 'skills');
  outputDir = path.join(sandbox, 'out');
  const hub = path.join(sourceDir, 'hub');
  const plain = path.join(sourceDir, 'plain');
  fs.mkdirSync(path.join(hub, 'references'), { recursive: true });
  fs.mkdirSync(plain, { recursive: true });
  fs.writeFileSync(path.join(hub, 'references', 'a.md'), '# A\n');
  fs.writeFileSync(path.join(hub, 'SKILL.md'), '---\nname: hub\ndescription: "hub"\n---\n\n# Hub\n');
  fs.writeFileSync(path.join(hub, 'ROUTER.md'), [
    '---', 'title: Hub Router', 'skill_pointer: SKILL.md', '---', '',
    'See [the reference](references/a.md#top) and [the site](https://example.com).', '',
    ...FENCED, '', INLINE, '',
  ].join('\n'));
  fs.writeFileSync(path.join(plain, 'SKILL.md'), '---\nname: plain\ndescription: "plain"\n---\n\n# Plain\n');
});

afterAll(() => {
  fs.rmSync(sandbox, { recursive: true, force: true });
});

describe('sync-skills-hermes router copy', () => {
  it('rewrites prose links and keeps fences and inline code byte-identical', () => {
    const result = runSync([]);
    expect(result.status, result.stderr).toBe(0);

    const copy = fs.readFileSync(path.join(outputDir, 'hub', 'ROUTER.md'), 'utf8');
    const expectedTarget = path.posix.relative(
      path.join(outputDir, 'hub').split(path.sep).join('/'),
      path.join(sourceDir, 'hub', 'references', 'a.md').split(path.sep).join('/'),
    );
    expect(copy).toContain(`[the reference](${expectedTarget}#top)`);
    expect(fs.existsSync(path.resolve(outputDir, 'hub', expectedTarget))).toBe(true);
    expect(copy).toContain('[the site](https://example.com)');
    expect(copy).toContain(FENCED.join('\n'));
    expect(copy).toContain(INLINE);
    expect(copy.startsWith('---\ntitle: Hub Router\nskill_pointer: SKILL.md\n---\n')).toBe(true);
  });

  it('writes no router for a skill without one, and --check then passes', () => {
    expect(fs.existsSync(path.join(outputDir, 'plain', 'SKILL.md'))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, 'plain', 'ROUTER.md'))).toBe(false);
    const check = runSync(['--check']);
    expect(check.status, check.stdout).toBe(0);
    expect(check.stdout).toContain('PASS: 2 Hermes skill copies in sync');
  });
});
