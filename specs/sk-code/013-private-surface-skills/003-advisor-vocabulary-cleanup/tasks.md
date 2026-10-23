---
title: "Tasks: Phase 3: advisor-vocabulary-cleanup"
description: "One change per task, each with its file, verified anchor, literal edit, proof command, acceptance criterion, rollback and stop condition, in execution order."
trigger_phrases:
  - "advisor vocabulary cleanup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: advisor-vocabulary-cleanup

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: one change per task. A task edits one file, runs one command, or generates one artifact. Every task carries the same seven fields in the same order: `File`, `Anchor`, `Change`, `Proof`, `AC`, `Rollback`, `Stop if`.

**Execution order.** Tasks run in numeric order. Every test task lands before the code task it proves, and the tracked graph is regenerated only after the compiler already skips `local-*`.

**Anchor convention.** Every anchor below was read on the working tree at `583316d083`. Read the file, confirm the quoted text sits on the named line, then edit. When the text has moved, edit where the quoted text is and leave the line number alone. Never delete a range you have not read.

**Branch.** Every task runs on `deepseekpi`. `deepseekpihigh` is not used in this phase, because even the one-line README description must land with the code it describes.

**Comment hygiene.** No task adds a spec path, packet number or phase number to a code comment. A new comment states the durable reason only.

**Positive controls.** Every zero-match proof starts with a control that runs the same pattern against a known-present file and expects a non-zero count. A zero without a control can mean a broken pattern instead of a clean file.

**Run locations.** Run vitest from `.skilled/skills/system-skill-advisor/runtime` as `../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts`. Run the Python suite from the same directory as `python3 tests/python/test_skill_advisor.py`. Run the CJS suites from the repository root.

**No-change screens.** T044 to T047 record three decisions that change no code: the native-scorer prompt stays correct, the surface-id files carry no token, and the leaf-manifest gate needs no filter. Each records the command that proved it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before starting any task: read the file named in its `File` field, confirm the `Anchor` text sits on the named line, and confirm the file is in the state the previous task left it. A mismatch is a stale anchor, not a reason to improvise.

### Execution Rules

| Rule | Statement |
|------|-----------|
| TASK-SEQ | Run tasks in numeric order. Do not reorder, merge or skip one. |
| TASK-SCOPE | Change only what the `Change` field states. Do not fix adjacent code, prose or formatting. |
| TASK-LOCATE | Find every edit by the text quoted in `Anchor`, not by its line number. A number is a cross-check on the file as measured; an earlier task on the same file may have shifted it. When a `Change` lists several edits in one file, apply them from the highest line number to the lowest. |
| TASK-PROOF | Run the `Proof` command and read both the output and the exit status before marking the task `[x]`. |
| TASK-TEST-FIRST | A test task's proof expects the new case to fail. Do not make the code change in the same task. |
| TASK-GENERATED | Never hand-edit a generated file. `skill-graph.json` comes from `skill_graph_compiler.py`. |
| TASK-COMMENT | Add no spec path, packet number or phase number to a code comment. |

### Status Reporting Format

Report one line per task as `T001 | done | advisor_rebuild: rebuilt`, or `T025 | blocked | anchor not found` when a stop condition fires. A `blocked` line names the failed condition from its `Stop if` field. Keep the red-first lines for T069.

### Blocked Task Protocol

When a `Stop if` condition fires, stop at that task, leave every later task untouched, and report the task id, the command that failed, its output and the anchor that did not match. Do not attempt a second interpretation of the same anchor after three failed matches on the same file.
<!-- /ANCHOR:ai-protocol -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T001 — Build the local advisor database

- **File:** none
- **Anchor:** `.skilled/bin/skill-advisor.cjs`, line 1 `#!/usr/bin/env node`.
- **Change:** run the rebuild command only.
  ```bash
  node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true --format text
  ```
- **Proof:**
  ```bash
  node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true --format text | tail -3
  ```
  Expected: a line reading `advisor_rebuild: rebuilt` and a line reading `skillCount: 14`
- **AC:** AC-014
- **Rollback:** n/a: the database is gitignored local state, rebuilt by the same command.
- **Stop if:** the command exits non-zero or prints no `skillCount:` line.

### T002 — Prove phase 2 removed both surface folders

- **File:** none
- **Anchor:** `specs/sk-code/013-private-surface-skills/002-hub-surface-removal/spec.md`, line 2 `title: "Feature Specification: Phase 2: hub-surface-removal"`.
- **Change:** fetch the remote, then run the `origin/main` tree check first, then the absence check.
  ```bash
  git fetch origin main
  git ls-tree -r --name-only origin/main -- .skilled/skills/sk-code | wc -l
  git ls-tree -r --name-only origin/main -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian | wc -l
  if [ ! -d .skilled/skills/sk-code/sk-code-webflow ] && [ ! -d .skilled/skills/sk-code/sk-code-obsidian ]; then echo absent; else echo present; fi
  ```
- **Proof:**
  ```bash
  git fetch origin main
  git ls-tree -r --name-only origin/main -- .skilled/skills/sk-code | wc -l
  git ls-tree -r --name-only origin/main -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian | wc -l
  test ! -d .skilled/skills/sk-code/sk-code-webflow && test ! -d .skilled/skills/sk-code/sk-code-obsidian && echo absent
  ```
  Expected: a non-zero count for the `sk-code` tree, then `0`, then `absent`
- **AC:** AC-029
- **Rollback:** n/a: read-only.
- **Stop if:** the first count is `0`, the second is not `0`, or the output is `present`, which means phase 2 has not landed on `origin/main` and the graph regeneration would keep the surface signals.

### T003 — Capture the skill-graph-db baseline

- **File:** none
- **Anchor:** `tests/skill-graph-db.vitest.ts`, line 13 `describe('skill graph database indexing', () => {`.
- **Change:** run the suite only, from `.skilled/skills/system-skill-advisor/runtime`.
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts
  ```
- **Proof:**
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts | tail -4
  ```
  Expected: `Tests  9 passed (9)`
- **AC:** AC-028
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `9`, because every later expectation is measured from it.

### T004 — Capture the advisor-status baseline

- **File:** none
- **Anchor:** `tests/handlers/advisor-status.vitest.ts`, line 129 `describe('advisor_status handler', () => {`.
- **Change:** run the suite only, from `.skilled/skills/system-skill-advisor/runtime`.
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/handlers/advisor-status.vitest.ts
  ```
- **Proof:**
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/handlers/advisor-status.vitest.ts | tail -4
  ```
  Expected: `Tests  18 passed (18)`
- **AC:** AC-028
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `18`.

### T005 — Capture the Python suite baseline

- **File:** none
- **Anchor:** `tests/python/test_skill_advisor.py`, line 2138 `def main():`.
- **Change:** run the suite only, from `.skilled/skills/system-skill-advisor/runtime`.
  ```bash
  python3 tests/python/test_skill_advisor.py
  ```
- **Proof:**
  ```bash
  python3 tests/python/test_skill_advisor.py | tail -1
  ```
  Expected: `Summary: pass=69, fail=0`
- **AC:** AC-028
- **Rollback:** n/a: read-only.
- **Stop if:** the summary is not `pass=69, fail=0`.

### T006 — Capture the Hermes suite baseline

- **File:** none
- **Anchor:** `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs`, line 41 `test('writes one markdown-only folder per SKILL.md, flat by frontmatter name, skipping node_modules', () => {`.
- **Change:** run the suite only.
  ```bash
  node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs
  ```
- **Proof:**
  ```bash
  node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs | rg '^ℹ (tests|pass|fail) '
  ```
  Expected: `ℹ tests 4`, `ℹ pass 4`, `ℹ fail 0`
- **AC:** AC-028
- **Rollback:** n/a: read-only.
- **Stop if:** the test count is not `4`.

### T007 — Capture the root-metadata contract baseline

- **File:** none
- **Anchor:** `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`, line 68 `function makeRoot(skillsDir, skillId, files) {`.
- **Change:** run the script only.
  ```bash
  node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs
  ```
- **Proof:**
  ```bash
  node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs | tail -1
  ```
  Expected: `[sk-doc] skill-root-metadata contract + fleet gate coverage passed`
- **AC:** AC-028
- **Rollback:** n/a: read-only.
- **Stop if:** the line is absent or the exit code is non-zero.

### T008 — Capture the freshness-panel baseline

- **File:** none
- **Anchor:** `tests/doctor/skill-graph-freshness-panel.vitest.ts`, line 110 `it('clean panel: compiled newer than every stamp, db matching, all diffs none', () => {`.
- **Change:** run the suite only, from `.skilled/skills/system-skill-advisor/runtime`.
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts
  ```
- **Proof:**
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts | tail -4
  ```
  Expected: `Tests  18 passed (18)`
- **AC:** AC-028
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `18`.

### T009 — Capture the plugin node:test baseline

- **File:** none
- **Anchor:** `.opencode/plugins/tests/system-skill-advisor.test.cjs`, line 356 `const summary = compiledRouteSummary(['quality', 'review', 'opencode', 'webflow', 'typescript']);`.
- **Change:** run the suite only.
  ```bash
  node --test .opencode/plugins/tests/system-skill-advisor.test.cjs
  ```
- **Proof:**
  ```bash
  node --test .opencode/plugins/tests/system-skill-advisor.test.cjs | rg '^ℹ (tests|pass|fail) '
  ```
  Expected: `ℹ tests 42`, `ℹ pass 42`, `ℹ fail 0`
- **AC:** AC-028
- **Rollback:** n/a: read-only.
- **Stop if:** the test count is not `42`.

### T010 — Capture the plugin vitest baseline

- **File:** none
- **Anchor:** `tests/system-skill-advisor-plugin.vitest.ts`, line 700 `['an Obsidian plugin', (dir: string) => writeFileSync(join(dir, 'manifest.json'), '{"id":"x","minAppVersion":"1.4.0"}'), 'OBSIDIAN'],`.
- **Change:** run the suite only, from `.skilled/skills/system-skill-advisor/runtime`.
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/system-skill-advisor-plugin.vitest.ts
  ```
- **Proof:**
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/system-skill-advisor-plugin.vitest.ts | tail -4
  ```
  Expected: `Tests  94 passed (94)`
- **AC:** AC-028
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `94`.

### T011 — Capture the surface-hint baseline

- **File:** none
- **Anchor:** `tests/advisor-surface-hint.vitest.ts`, line 16 `const SURFACE_HINT = 'WEBFLOW';`.
- **Change:** run the suite only, from `.skilled/skills/system-skill-advisor/runtime`.
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/advisor-surface-hint.vitest.ts
  ```
- **Proof:**
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/advisor-surface-hint.vitest.ts | tail -4
  ```
  Expected: `Tests  3 passed (3)`
- **AC:** AC-028
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `3` or the failure names a missing advisor projection, which means T001 did not build the database.

### T012 — Capture the native-scorer baseline

- **File:** none
- **Anchor:** `tests/scorer/native-scorer.vitest.ts`, line 387 `const result = scoreAdvisorPrompt('implement a responsive webflow animation module', {`.
- **Change:** run the suite only, from `.skilled/skills/system-skill-advisor/runtime`.
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/native-scorer.vitest.ts
  ```
- **Proof:**
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/native-scorer.vitest.ts | tail -4
  ```
  Expected: `Tests  22 passed (22)`
- **AC:** AC-028
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `22`.

### T013 — Capture the lexical pair baseline

- **File:** none
- **Anchor:** `tests/scorer/lexical-candidate-dedup.vitest.ts`, line 1 `// ───────────────────────────────────────────────────────────────`.
- **Change:** run the pair only, from `.skilled/skills/system-skill-advisor/runtime`.
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/lexical-candidate-dedup.vitest.ts tests/scorer/bm25-lexical-shadow.vitest.ts
  ```
- **Proof:**
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/lexical-candidate-dedup.vitest.ts tests/scorer/bm25-lexical-shadow.vitest.ts | tail -4
  ```
  Expected: `Tests  10 passed (10)`
- **AC:** AC-028
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `10`.

### T014 — Capture the ambiguity-slice baseline

- **File:** none
- **Anchor:** `tests/scorer/ambiguity-slice.vitest.ts`, line 112 `).toBeGreaterThanOrEqual(baselineCorrect);`.
- **Change:** run the suite only and record the failure line.
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/ambiguity-slice.vitest.ts
  ```
- **Proof:**
  ```bash
  ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/ambiguity-slice.vitest.ts 2>&1 | rg 'live='
  ```
  Expected: a line containing `live=17/24 baseline=19`
- **AC:** AC-028
- **Rollback:** n/a: read-only.
- **Stop if:** the run exits 0, because this gate is expected red at baseline and a green run means the baseline moved.

### T015 — Record the baseline table

- **File:** `implementation-summary.md`
- **Anchor:** line 92, the limitations anchor comment, immediately followed by line 93 `## Known Limitations`.
- **Change:** insert this block immediately before the limitations anchor comment.
  ```markdown
  ### Baseline

  Captured before the first edit. The ambiguity slice is expected red at baseline.

  | Suite | Baseline |
  |-------|----------|
  | `private-skill-target.vitest.ts` | does not exist yet; T016 creates it |
  | `skill-graph-db.vitest.ts` | 9 passing |
  | `advisor-status.vitest.ts` | 18 passing |
  | `test_skill_advisor.py` | `pass=69, fail=0` |
  | `sync-skills-hermes.test.mjs` | 4 passing |
  | `skill-root-metadata-contract.test.cjs` | `passed` |
  | `skill-graph-freshness-panel.vitest.ts` | 18 passing |
  | plugin `node:test` | 42 passing |
  | plugin vitest | 94 passing |
  | `advisor-surface-hint.vitest.ts` | 3 passing |
  | `native-scorer.vitest.ts` | 22 passing |
  | lexical pair | 10 passing |
  | `ambiguity-slice.vitest.ts` | `live=17/24 baseline=19`, expected red |
  ```
- **Proof:**
  ```bash
  sed -n '/^ *### Baseline/,/^ *## Known Limitations/p' implementation-summary.md | grep -c '^ *| '
  ```
  Expected: `14`, the table header plus thirteen baseline rows
- **AC:** AC-028
- **Rollback:** delete the `### Baseline` heading and its table from `implementation-summary.md`.
- **Stop if:** the anchor is absent or the count is not `14`.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Containment helper

### T016 — Add the containment helper tests

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts`
- **Anchor:** new file.
- **Change:** create the file with this content.
  ```ts
  // ───────────────────────────────────────────────────────────────
  // MODULE: Private Skill Target Containment Tests
  // ───────────────────────────────────────────────────────────────

  import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
  import { tmpdir } from 'node:os';
  import { join } from 'node:path';
  import { afterEach, describe, expect, it } from 'vitest';
  import { isTrustedPrivateSkillLink } from '../lib/private-skill-target.js';

  const roots: string[] = [];
  const savedRoots = process.env.SPECKIT_PRIVATE_SKILL_ROOTS;

  function tempRoot(): string {
    const root = mkdtempSync(join(tmpdir(), 'private-skill-target-'));
    roots.push(root);
    return root;
  }

  afterEach(() => {
    for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
    if (savedRoots === undefined) delete process.env.SPECKIT_PRIVATE_SKILL_ROOTS;
    else process.env.SPECKIT_PRIVATE_SKILL_ROOTS = savedRoots;
  });

  describe('private skill link containment', () => {
    it('accepts a link that resolves inside the skills root', () => {
      const root = tempRoot();
      const skills = join(root, 'skills');
      const target = join(skills, 'private-beta');
      mkdirSync(target, { recursive: true });
      symlinkSync(target, join(skills, 'local-beta'));
      expect(isTrustedPrivateSkillLink(join(skills, 'local-beta'), skills)).toBe(true);
    });

    it('rejects a link that resolves outside the skills root', () => {
      const root = tempRoot();
      const skills = join(root, 'skills');
      const target = join(root, 'outside-beta');
      mkdirSync(skills, { recursive: true });
      mkdirSync(target, { recursive: true });
      symlinkSync(target, join(skills, 'local-beta'));
      expect(isTrustedPrivateSkillLink(join(skills, 'local-beta'), skills)).toBe(false);
    });

    it('rejects a link whose target is missing', () => {
      const root = tempRoot();
      const skills = join(root, 'skills');
      mkdirSync(skills, { recursive: true });
      symlinkSync(join(root, 'missing-beta'), join(skills, 'local-beta'));
      expect(isTrustedPrivateSkillLink(join(skills, 'local-beta'), skills)).toBe(false);
    });

    it('rejects a link whose target is a regular file', () => {
      const root = tempRoot();
      const skills = join(root, 'skills');
      mkdirSync(skills, { recursive: true });
      writeFileSync(join(root, 'file-beta'), 'not a directory\n');
      symlinkSync(join(root, 'file-beta'), join(skills, 'local-beta'));
      expect(isTrustedPrivateSkillLink(join(skills, 'local-beta'), skills)).toBe(false);
    });

    it('accepts a link into a root named by SPECKIT_PRIVATE_SKILL_ROOTS', () => {
      const root = tempRoot();
      const skills = join(root, 'skills');
      const external = join(root, 'private-repos');
      const target = join(external, 'sk-code-webflow');
      mkdirSync(skills, { recursive: true });
      mkdirSync(target, { recursive: true });
      symlinkSync(target, join(skills, 'local-webflow'));
      process.env.SPECKIT_PRIVATE_SKILL_ROOTS = external;
      expect(isTrustedPrivateSkillLink(join(skills, 'local-webflow'), skills)).toBe(true);
    });
  });
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/private-skill-target.vitest.ts
  ```
  Expected: fails to resolve `../lib/private-skill-target.js`, so the file reports no passing tests
- **AC:** AC-019
- **Rollback:** `rm .skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts`
- **Stop if:** the run passes, because the module already exists and this task would then be testing an existing helper.

### T017 — Create the containment helper

- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts`
- **Anchor:** new file.
- **Change:** create the file with this content.
  ```ts
  // ───────────────────────────────────────────────────────────────
  // MODULE: Private Skill Target Containment
  // ───────────────────────────────────────────────────────────────
  // A `local-*` skill may be linked into the skills tree from a private checkout.
  // Following the link is safe only when its resolved target stays inside a
  // directory the operator has declared trusted, so resolve the whole chain and
  // test containment instead of trusting the link's name.

  import { existsSync, realpathSync, statSync } from 'node:fs';
  import { delimiter, isAbsolute, relative, resolve } from 'node:path';

  export const PRIVATE_SKILL_ROOTS_ENV = 'SPECKIT_PRIVATE_SKILL_ROOTS';

  function isInside(root: string, target: string): boolean {
    const rel = relative(root, target);
    return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
  }

  function trustedRoots(skillsRoot: string): string[] {
    const roots: string[] = [];
    if (existsSync(skillsRoot)) roots.push(realpathSync(skillsRoot));
    const declared = process.env[PRIVATE_SKILL_ROOTS_ENV] ?? '';
    for (const part of declared.split(delimiter)) {
      const candidate = part.trim();
      if (!candidate) continue;
      const absolute = resolve(candidate);
      if (existsSync(absolute)) roots.push(realpathSync(absolute));
    }
    return roots;
  }

  export function isTrustedPrivateSkillLink(entryPath: string, skillsRoot: string): boolean {
    let target: string;
    try {
      target = realpathSync(entryPath);
      if (!statSync(target).isDirectory()) return false;
    } catch {
      return false;
    }
    return trustedRoots(skillsRoot).some((root) => isInside(root, target));
  }
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/private-skill-target.vitest.ts
  ```
  Expected: `Tests  5 passed (5)`
- **AC:** AC-019
- **Rollback:** `rm .skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts`
- **Stop if:** any case fails, because the helper's contract is the five cases.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Follow-scans

### T018 — Add the graph linked-inside test

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph-db.vitest.ts`
- **Anchor:** line 5 `import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';` and lines 14-17:
  ```ts
    afterEach(() => {
      closeDb();
      vi.restoreAllMocks();
    });
  ```
- **Change:** first add `symlinkSync` to the `node:fs` import on line 5, then insert this case immediately after the `afterEach` block.
  ```ts
    it('indexes a private skill linked from inside the skills root', () => {
      const root = mkdtempSync(join(tmpdir(), 'skill-graph-db-link-'));
      const dbDir = join(root, 'db');
      const skillRoot = join(root, 'skills');
      try {
        initDb(dbDir);
        writeGraphMetadata(join(skillRoot, 'node_modules', 'private-beta'), 'local-beta');
        symlinkSync(join(skillRoot, 'node_modules', 'private-beta'), join(skillRoot, 'local-beta'));
        indexSkillMetadata(skillRoot);
        expect(getDb().prepare("SELECT id FROM skill_nodes WHERE id LIKE 'local-%'").all()).toEqual([{ id: 'local-beta' }]);
      } finally {
        closeDb();
        rmSync(root, { recursive: true, force: true });
      }
    });
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts
  ```
  Expected: `9 passed` and `1 failed`, the failure naming the linked skill
- **AC:** AC-002
- **Rollback:** delete the new `it` block and remove `symlinkSync` from the import.
- **Stop if:** the new case passes, because the graph scan would already follow the link.

### T019 — Add the graph linked-outside test

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph-db.vitest.ts`
- **Anchor:** the closing block written by T018:
  ```ts
        expect(getDb().prepare("SELECT id FROM skill_nodes WHERE id LIKE 'local-%'").all()).toEqual([{ id: 'local-beta' }]);
      } finally {
        closeDb();
        rmSync(root, { recursive: true, force: true });
      }
    });
  ```
- **Change:** append this case immediately after that block.
  ```ts
    it('does not index a private skill linked from outside the skills root', () => {
      const root = mkdtempSync(join(tmpdir(), 'skill-graph-db-outside-'));
      const dbDir = join(root, 'db');
      const skillRoot = join(root, 'skills');
      const outside = join(root, 'outside');
      try {
        initDb(dbDir);
        writeGraphMetadata(join(outside, 'private-beta'), 'local-beta');
        mkdirSync(skillRoot, { recursive: true });
        symlinkSync(join(outside, 'private-beta'), join(skillRoot, 'local-beta'));
        indexSkillMetadata(skillRoot);
        expect(getDb().prepare("SELECT COUNT(*) AS count FROM skill_nodes WHERE id LIKE 'local-%'").get()).toEqual({ count: 0 });
      } finally {
        closeDb();
        rmSync(root, { recursive: true, force: true });
      }
    });
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts
  ```
  Expected: `10 passed` and `1 failed`; this case passes because the scan skips every symlink today
- **AC:** AC-020
- **Rollback:** delete the new `it` block.
- **Stop if:** the case fails for a reason other than the linked-inside case, because the only expected red is T018's case.

### T020 — Follow a trusted link in the graph scan

- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts`
- **Anchor:** line 8 `import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs';` and lines 730-733:
  ```ts
      for (const entry of entries) {
        const entryPath = join(currentDir, entry.name);
        if (entry.isDirectory()) {
  ```
- **Change:** first add the helper import after line 8, then replace the three-line loop head with the block below.
  ```ts
  import { isTrustedPrivateSkillLink } from '../private-skill-target.js';
  ```
  ```ts
      for (const entry of entries) {
        const entryPath = join(currentDir, entry.name);
        // A private skill is linked into the tree on purpose; follow the link only
        // when its resolved target stays inside a directory the operator trusts.
        const linkedPrivateSkill = currentDir === skillDir
          && entry.name.startsWith('local-')
          && entry.isSymbolicLink()
          && isTrustedPrivateSkillLink(entryPath, skillDir);
        if (entry.isDirectory() || linkedPrivateSkill) {
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts
  ```
  Expected: `Tests  11 passed (11)`
- **AC:** AC-002, AC-020
- **Rollback:** remove the import and restore the bare `if (entry.isDirectory()) {` line.
- **Stop if:** either the linked-inside or the linked-outside case fails.

### T021 — Add the signature linked-inside test

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts`
- **Anchor:** line 5 `import { mkdtempSync, mkdirSync, readFileSync, utimesSync, writeFileSync } from 'node:fs';` and lines 130-131:
  ```ts
    // drift: verified against shipped behavior during Unit H
    it('reports live freshness', () => {
  ```
- **Change:** first add `symlinkSync` to the `node:fs` import on line 5, then insert this case before the `it('reports live freshness'` line.
  ```ts
    it('includes a private skill linked from inside the skills root in the source signature', () => {
      const root = workspace('linked');
      const skills = join(root, '.skilled', 'skills');
      mkdirSync(join(skills, '.private', 'private-beta'), { recursive: true });
      writeFileSync(join(skills, '.private', 'private-beta', 'SKILL.md'), 'first\n');
      writeFileSync(join(skills, '.private', 'private-beta', 'graph-metadata.json'), '{"skill_id":"local-beta"}\n');
      symlinkSync(join(skills, '.private', 'private-beta'), join(skills, 'local-beta'));
      const before = computeAdvisorSourceSignature(root);
      writeFileSync(join(skills, '.private', 'private-beta', 'SKILL.md'), 'second\n');
      expect(computeAdvisorSourceSignature(root)).not.toBe(before);
    });
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/handlers/advisor-status.vitest.ts
  ```
  Expected: `18 passed` and `1 failed`, the failure naming the unchanged signature
- **AC:** AC-004
- **Rollback:** delete the new `it` block and remove `symlinkSync` from the import.
- **Stop if:** the new case passes, because the signature would already follow the link.

### T022 — Add the signature linked-outside test

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts`
- **Anchor:** the closing block written by T021:
  ```ts
      const before = computeAdvisorSourceSignature(root);
      writeFileSync(join(skills, 'private-beta', 'SKILL.md'), 'second\n');
      expect(computeAdvisorSourceSignature(root)).not.toBe(before);
    });
  ```
- **Change:** append this case immediately after that block.
  ```ts
    it('ignores a private skill linked from outside every trusted root', () => {
      const root = workspace('outside');
      const skills = join(root, '.skilled', 'skills');
      const outside = join(root, 'outside-beta');
      mkdirSync(outside, { recursive: true });
      writeFileSync(join(outside, 'SKILL.md'), 'first\n');
      writeFileSync(join(outside, 'graph-metadata.json'), '{"skill_id":"local-beta"}\n');
      symlinkSync(outside, join(skills, 'local-beta'));
      const before = computeAdvisorSourceSignature(root);
      writeFileSync(join(outside, 'SKILL.md'), 'second\n');
      expect(computeAdvisorSourceSignature(root)).toBe(before);
    });
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/handlers/advisor-status.vitest.ts
  ```
  Expected: `19 passed` and `1 failed`; this case passes because the signature skips every symlink today
- **AC:** AC-021
- **Rollback:** delete the new `it` block.
- **Stop if:** the case fails for a reason other than T021's case.

### T023 — Add the signature declared-root test

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts`
- **Anchor:** the closing block written by T022:
  ```ts
      const before = computeAdvisorSourceSignature(root);
      writeFileSync(join(outside, 'SKILL.md'), 'second\n');
      expect(computeAdvisorSourceSignature(root)).toBe(before);
    });
  ```
- **Change:** append this case immediately after that block.
  ```ts
    it('includes a private skill linked into a declared external root', () => {
      const root = workspace('declared');
      const skills = join(root, '.skilled', 'skills');
      const external = join(root, 'private-repos');
      const target = join(external, 'sk-code-webflow');
      mkdirSync(target, { recursive: true });
      writeFileSync(join(target, 'SKILL.md'), 'first\n');
      writeFileSync(join(target, 'graph-metadata.json'), '{"skill_id":"local-webflow"}\n');
      symlinkSync(target, join(skills, 'local-webflow'));
      process.env.SPECKIT_PRIVATE_SKILL_ROOTS = external;
      try {
        const before = computeAdvisorSourceSignature(root);
        writeFileSync(join(target, 'SKILL.md'), 'second\n');
        expect(computeAdvisorSourceSignature(root)).not.toBe(before);
      } finally {
        delete process.env.SPECKIT_PRIVATE_SKILL_ROOTS;
      }
    });
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/handlers/advisor-status.vitest.ts
  ```
  Expected: `20 passed` and `1 failed`; this case passes because the signature skips every symlink today
- **AC:** AC-021
- **Rollback:** delete the new `it` block.
- **Stop if:** the case fails for a reason other than T021's case.

### T024 — Follow a trusted link in the source signature

- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts`
- **Anchor:** line 12 `import { join, resolve } from 'node:path';` and line 143:
  ```ts
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
  ```
- **Change:** first add the helper import after line 12, then replace the filter line.
  ```ts
  import { isTrustedPrivateSkillLink } from './private-skill-target.js';
  ```
  ```ts
      .filter(entry => !entry.name.startsWith('.') && (entry.isDirectory()
        || (entry.name.startsWith('local-')
          && entry.isSymbolicLink()
          && isTrustedPrivateSkillLink(join(skillRoot, entry.name), skillRoot))))
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/handlers/advisor-status.vitest.ts
  ```
  Expected: `Tests  21 passed (21)`
- **AC:** AC-004, AC-021
- **Rollback:** remove the import and restore the single filter line.
- **Stop if:** any of the three new cases fails.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Skip-scans

### T025 — Add the compiler real-folder test

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`
- **Anchor:** lines 2134-2136:
  ```python
  # ───────────────────────────────────────────────────────────────
  # 6. MAIN
  # ───────────────────────────────────────────────────────────────
  ```
- **Change:** insert this case above the `# 6. MAIN` banner, indented inside `test_graph_compiler`.
  ```python
      # A private skill is local-only, so graph discovery must never return it.
      try:
          with tempfile.TemporaryDirectory() as tmpdir:
              for skill_id in ("alpha", "local-private"):
                  directory = os.path.join(tmpdir, skill_id)
                  os.makedirs(directory)
                  with open(os.path.join(directory, "graph-metadata.json"), "w", encoding="utf-8") as handle:
                      json.dump({"skill_id": skill_id}, handle)
              discovered = [name for name, _path, _data in compiler.discover_graph_metadata(tmpdir)]
              if discovered == ["alpha"]:
                  ok("T246-GC-013: graph discovery skips a private skill", "local-private absent")
              else:
                  fail_test("T246-GC-013: graph discovery skips a private skill", f"discovered={discovered}")
      except Exception as exc:
          fail_test("T246-GC-013: graph discovery skips a private skill", str(exc))
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py
  ```
  Expected: `Summary: pass=69, fail=1`
- **AC:** AC-006
- **Rollback:** delete the new case.
- **Stop if:** the new case passes, because the compiler would already skip the name.

### T026 — Add the compiler symlink test

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`
- **Anchor:** the last line written by T025:
  ```python
          fail_test("T246-GC-013: graph discovery skips a private skill", str(exc))
  ```
- **Change:** append this case immediately after that line, still inside `test_graph_compiler`.
  ```python
      # A private skill linked from outside the scanned tree is skipped by name
      # before the compiler follows the link.
      try:
          with tempfile.TemporaryDirectory() as tmpdir, tempfile.TemporaryDirectory() as outside:
              target = os.path.join(outside, "private-target")
              os.makedirs(target)
              with open(os.path.join(target, "graph-metadata.json"), "w", encoding="utf-8") as handle:
                  json.dump({"skill_id": "local-linked"}, handle)
              os.symlink(target, os.path.join(tmpdir, "local-linked"))
              discovered = [name for name, _path, _data in compiler.discover_graph_metadata(tmpdir)]
              if discovered == []:
                  ok("T246-GC-014: graph discovery never follows a private link", "local-linked absent")
              else:
                  fail_test("T246-GC-014: graph discovery never follows a private link", f"discovered={discovered}")
      except Exception as exc:
          fail_test("T246-GC-014: graph discovery never follows a private link", str(exc))
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py
  ```
  Expected: `Summary: pass=69, fail=2`; this case fails because `os.path.isfile` follows the link today
- **AC:** AC-022
- **Rollback:** delete the new case.
- **Stop if:** the case passes, because the compiler would already exclude a linked target.

### T027 — Skip a private skill in compiler discovery

- **File:** `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py`
- **Anchor:** line 200 `    for entry in sorted(os.listdir(skills_dir)):`
- **Change:** insert these three lines immediately after line 200.
  ```python
          # A private skill lives only in the operator's checkout, so compiling it
          # would write its signals into the tracked fallback graph.
          if entry.startswith("local-"):
              continue
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py
  ```
  Expected: `Summary: pass=71, fail=0`
- **AC:** AC-006, AC-022
- **Rollback:** delete the three inserted lines.
- **Stop if:** either new case still fails.

### T028 — Add the Hermes real-folder test

- **File:** `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs`
- **Anchor:** line 41 `test('writes one markdown-only folder per SKILL.md, flat by frontmatter name, skipping node_modules', () => {`
- **Change:** insert this test immediately before line 41.
  ```js
  test('skips a top-level local-* skill so it is never mirrored', () => {
    const env = fixture();
    try {
      mkdirSync(join(env.source, 'local-webflow'), { recursive: true });
      writeFileSync(join(env.source, 'local-webflow', 'SKILL.md'), '---\nname: local-webflow\ndescription: "Private"\n---\n\n# Private\n');
      const out = run(env);
      assert.match(out, /Wrote 4 of 4/);
      assert.ok(!existsSync(join(env.output, 'local-webflow')));
    } finally {
      rmSync(env.root, { recursive: true, force: true });
    }
  });
  ```
- **Proof:**
  ```bash
  node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs | rg '^ℹ (tests|pass|fail) '
  ```
  Expected: `ℹ tests 5`, `ℹ pass 4`, `ℹ fail 1`
- **AC:** AC-007
- **Rollback:** delete the new test.
- **Stop if:** the new test passes, because the walk would already skip a real `local-*` folder.

### T029 — Add the Hermes symlink test

- **File:** `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs`
- **Anchor:** the closing block written by T028:
  ```js
      assert.match(out, /Wrote 4 of 4/);
      assert.ok(!existsSync(join(env.output, 'local-webflow')));
    } finally {
      rmSync(env.root, { recursive: true, force: true });
    }
  });
  ```
- **Change:** append this test immediately after that block.
  ```js
  test('never follows a local-* symlink into the mirror', () => {
    const env = fixture();
    try {
      const target = join(env.root, 'private-webflow');
      mkdirSync(target, { recursive: true });
      writeFileSync(join(target, 'SKILL.md'), '---\nname: private-webflow\n---\n');
      symlinkSync(target, join(env.source, 'local-webflow'));
      const out = run(env);
      assert.match(out, /Wrote 4 of 4/);
      assert.ok(!existsSync(join(env.output, 'local-webflow')));
      assert.ok(!existsSync(join(env.output, 'private-webflow')));
    } finally {
      rmSync(env.root, { recursive: true, force: true });
    }
  });
  ```
- **Proof:**
  ```bash
  node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs | rg '^ℹ (tests|pass|fail) '
  ```
  Expected: `ℹ tests 6`, `ℹ pass 5`, `ℹ fail 1`; this test passes because a symlink Dirent is neither a directory nor a file
- **AC:** AC-023
- **Rollback:** delete the new test.
- **Stop if:** the test fails for a reason other than T028's test.

### T030 — Skip a top-level private skill in the Hermes walk

- **File:** `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`
- **Anchor:** line 56 `      const absolute = path.join(current, entry.name);`
- **Change:** insert these three lines immediately after line 56.
  ```js
        // A private skill exists only in the operator's checkout; mirroring it would
        // commit its content into the tracked Hermes copy.
        if (current === directory && entry.name.startsWith('local-')) continue;
  ```
- **Proof:**
  ```bash
  node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs | rg '^ℹ (tests|pass|fail) '
  ```
  Expected: `ℹ tests 6`, `ℹ pass 6`, `ℹ fail 0`
- **AC:** AC-007, AC-023
- **Rollback:** delete the three inserted lines.
- **Stop if:** either new test still fails.

### T031 — Add the CI root-discovery test

- **File:** `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`
- **Anchor:** line 248 `function testFleetDiscoveryUsesTheAuthoredMarker() {` and line 611 `  testGateRejectsNonDirectorySkillsDir();`
- **Change:** insert this function immediately before `function testFleetDiscoveryUsesTheAuthoredMarker() {`, then add its call immediately before `testGateRejectsNonDirectorySkillsDir();`.
  ```js
  function testFindSkillRootsSkipsPrivateSkills() {
    const skillsDir = makeTmpSkillsDir();
    makeRoot(skillsDir, 'alpha', { 'graph-metadata.json': { skill_id: 'alpha' } });
    makeRoot(skillsDir, 'local-webflow', { 'graph-metadata.json': { skill_id: 'local-webflow' } });
    const roots = gate.findSkillRoots(skillsDir).map((dir) => path.basename(dir));
    assert.deepEqual(roots, ['alpha']);
  }
  ```
  ```js
    testFindSkillRootsSkipsPrivateSkills();
  ```
- **Proof:**
  ```bash
  node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs
  ```
  Expected: exits non-zero with `AssertionError` naming `local-webflow`
- **AC:** AC-008
- **Rollback:** delete the new function and its call.
- **Stop if:** the script passes, because `findSkillRoots` would already skip the name.

### T032 — Skip a private skill in root discovery

- **File:** `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`
- **Anchor:** line 144 `    .filter((entry) => entry.isDirectory() && entry.name !== 'node_modules' && !entry.name.startsWith('.'))`
- **Change:** replace that line with this two-line filter.
  ```js
      .filter((entry) => entry.isDirectory() && entry.name !== 'node_modules'
        && !entry.name.startsWith('.') && !entry.name.startsWith('local-'))
  ```
- **Proof:**
  ```bash
  node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs | tail -1
  ```
  Expected: `[sk-doc] skill-root-metadata contract + fleet gate coverage passed`
- **AC:** AC-008
- **Rollback:** restore the single filter line.
- **Stop if:** the contract line is absent.

### T033 — Add the freshness-panel private-skill case

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts`
- **Anchor:** lines 109-110:
  ```ts
  describe('skill-graph freshness panel', () => {
    it('clean panel: compiled newer than every stamp, db matching, all diffs none', () => {
  ```
- **Change:** insert this case immediately after the `describe(` line and before the first `it`.
  ```ts
    it('skips a private skill on disk so it is never a missing node', () => {
      const root = tempRoot();
      const dbDir = join(root, 'db');
      writeSkill(root, 'alpha', 'hub', { last_updated_at: OLD_STAMP });
      writeSkill(root, 'local-webflow', 'hub', { last_updated_at: OLD_STAMP });
      writeCompiled(root, NEW_STAMP, { hub: ['alpha'] });
      writeDb(dbDir, [['alpha', 'hub']]);

      const { status, output } = runPanel(root, dbDir);

      expect(status, output).toBe(0);
      expect(output).not.toContain('local-webflow');
      expect(output).toContain('MISSING (on disk, not in SQLite): none');
    });
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts
  ```
  Expected: `18 passed` and `1 failed`, the failure naming `local-webflow`
- **AC:** AC-009
- **Rollback:** delete the new `it` block.
- **Stop if:** the case passes, because the panel would already skip the name.

### T034 — Skip a private skill in the doctor on-disk read

- **File:** `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs`
- **Anchor:** line 147 `    if (!entry.isDirectory()) continue;`
- **Change:** insert these three lines immediately after line 147.
  ```js
      // A private skill is local-only, so it must not look like a node the tracked
      // graph is missing.
      if (entry.name.startsWith('local-')) continue;
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts
  ```
  Expected: `Tests  19 passed (19)`
- **AC:** AC-009
- **Rollback:** delete the three inserted lines.
- **Stop if:** the new case still fails.

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Python conflict reader

### T035 — Pin the conflict reader's inclusion of a private skill

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`
- **Anchor:** lines 2134-2136:
  ```python
  # ───────────────────────────────────────────────────────────────
  # 6. MAIN
  # ───────────────────────────────────────────────────────────────
  ```
  and line 2146 `    test_graph_compiler()`.
- **Change:** insert this function immediately before the `# 6. MAIN` banner, then add its call immediately after `test_graph_compiler()`.
  ```python
  def test_private_skill_conflict_declarations():
      """A local-* skill's conflict declaration is read like any other skill's."""
      original_skills_dir = advisor.SKILLS_DIR
      try:
          with tempfile.TemporaryDirectory() as tmpdir:
              for skill_id, targets in (("alpha", []), ("local-beta", ["alpha"])):
                  directory = os.path.join(tmpdir, skill_id)
                  os.makedirs(directory)
                  payload = {
                      "skill_id": skill_id,
                      "edges": {"conflicts_with": [{"target": target} for target in targets]},
                  }
                  with open(os.path.join(directory, "graph-metadata.json"), "w", encoding="utf-8") as handle:
                      json.dump(payload, handle)
              advisor.SKILLS_DIR = tmpdir
              declarations = advisor._load_source_conflict_declarations()
              if declarations.get("local-beta") == {"alpha"}:
                  ok("T246-CONFLICT-001: a local-* conflict declaration is read")
              else:
                  fail_test("T246-CONFLICT-001: a local-* conflict declaration is read", f"declarations={declarations}")
      except Exception as exc:
          fail_test("T246-CONFLICT-001: a local-* conflict declaration is read", str(exc))
      finally:
          advisor.SKILLS_DIR = original_skills_dir
  ```
  ```python
      test_private_skill_conflict_declarations()
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py | tail -1
  ```
  Expected: `Summary: pass=72, fail=0`
- **AC:** AC-024
- **Rollback:** delete the new function and its call.
- **Stop if:** the case fails, because the reader would then need a code change that this phase has not planned.

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Vocabulary sweep

### T036 — Delete the removed surface's hint token

- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts`
- **Anchor:** lines 37-39:
  ```ts
    // 'obsidian plugin' is the same mechanism used as intended: sk-code declares that
    // exact phrase and was losing it to a bare-token overlap by 0.004.
    'sk-code': ['css', 'html', 'javascript', 'frontend', 'viewport', 'responsive', 'mobile', 'cdn', 'opencode', 'classifier', 'helper', 'fixture', 'vitest', 'commonjs', 'typescript', 'python', 'script', 'mcp json', 'gate3 baseline', 'obsidian plugin'],
  ```
- **Change:** delete the two comment lines and remove `, 'obsidian plugin'` from the end of the array. Leave every other token and comment untouched.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts | rg -c -i 'obsidian'
  rg -n -i 'obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts || echo 0
  ```
  Expected: `2`, then `0`
- **AC:** AC-001
- **Rollback:** restore the two comment lines and append `, 'obsidian plugin'` to the `sk-code` array.
- **Stop if:** the file still reports a match.

### T037 — Keep only the SKILLED workspace surface

- **File:** `.opencode/plugins/system-skill-advisor.js`
- **Anchor:** lines 722-738, from the comment through the WEBFLOW branch.
  ```js
  // The sk-code surface a session works in, read from its workspace the way the hub's
  // stack-detection reference orders it: SKILLED > OBSIDIAN > WEBFLOW. Only cheap root
  // markers are read, since this runs before every uncached advisor call; a workspace
  // they do not name sends no hint and the compiled tie-break order applies.
  const workspaceSurfaceCache = new Map();
  function detectWorkspaceSurface(projectDir) {
    if (typeof projectDir !== 'string' || projectDir.length === 0) return null;
    if (workspaceSurfaceCache.has(projectDir)) return workspaceSurfaceCache.get(projectDir);
    let surface = null;
    try {
      const real = realpathSync(projectDir);
      const manifestPath = join(real, 'manifest.json');
      const hubRoot = resolveHubSkilledRoot();
      if (hubRoot && (real === hubRoot || real.startsWith(`${hubRoot}${sep}`))) surface = 'SKILLED';
      else if ((existsSync(manifestPath) && /"minAppVersion"/.test(readFileSync(manifestPath, 'utf8')))
        || existsSync(join(real, 'esbuild.config.mjs'))) surface = 'OBSIDIAN';
      else if (existsSync(join(real, 'src', '2_javascript')) || existsSync(join(real, 'wrangler.toml'))) surface = 'WEBFLOW';
    } catch {
      surface = null;
    }
    workspaceSurfaceCache.set(projectDir, surface);
    return surface;
  }
  ```
- **Change:** replace that whole block with this one. Delete `manifestPath` and both `else if` branches; keep the SKILLED branch, the cache, the `try`/`catch` and `realpathSync`.
  ```js
  // The sk-code surface a session works in, read from its workspace. Only the hub's
  // own root is detected; any other workspace sends no hint, so the compiled
  // tie-break order applies. The check is cheap because it runs before every
  // uncached advisor call.
  const workspaceSurfaceCache = new Map();
  function detectWorkspaceSurface(projectDir) {
    if (typeof projectDir !== 'string' || projectDir.length === 0) return null;
    if (workspaceSurfaceCache.has(projectDir)) return workspaceSurfaceCache.get(projectDir);
    let surface = null;
    try {
      const real = realpathSync(projectDir);
      const hubRoot = resolveHubSkilledRoot();
      if (hubRoot && (real === hubRoot || real.startsWith(`${hubRoot}${sep}`))) surface = 'SKILLED';
    } catch {
      surface = null;
    }
    workspaceSurfaceCache.set(projectDir, surface);
    return surface;
  }
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.opencode/plugins/system-skill-advisor.js | rg -c 'OBSIDIAN|WEBFLOW'
  rg -n 'OBSIDIAN|WEBFLOW' .opencode/plugins/system-skill-advisor.js || echo 0
  ```
  Expected: `3`, then `0`
- **AC:** AC-001
- **Rollback:** restore the deleted comment, `manifestPath` line and both `else if` branches.
- **Stop if:** `existsSync`, `readFileSync`, `join` or `sep` becomes unused, because that would mean another function relied on the deleted code.

### T038 — Rename the plugin fixture target

- **File:** `.opencode/plugins/tests/system-skill-advisor.test.cjs`
- **Anchor:** lines 356, 377 and 403, each `const summary = compiledRouteSummary(['quality', 'review', 'opencode', 'webflow', 'typescript']);`
- **Change:** replace `'webflow'` with `'skilled'` in all three arrays. Change nothing else; the target count stays five, so `targets=quality,review,opencode,+2 more` still holds.
- **Proof:**
  ```bash
  node --test .opencode/plugins/tests/system-skill-advisor.test.cjs | rg '^ℹ (tests|pass|fail) '
  ```
  Expected: `ℹ tests 42`, `ℹ pass 42`, `ℹ fail 0`
- **AC:** AC-001
- **Rollback:** replace `'skilled'` with `'webflow'` in the same three arrays.
- **Stop if:** the suite reports a count other than `42`.

### T039 — Delete the removed surface-detection rows

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts`
- **Anchor:** line 6 `import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';` and lines 700-702:
  ```ts
      ['an Obsidian plugin', (dir: string) => writeFileSync(join(dir, 'manifest.json'), '{"id":"x","minAppVersion":"1.4.0"}'), 'OBSIDIAN'],
      ['a Webflow project', (dir: string) => mkdirSync(join(dir, 'src', '2_javascript'), { recursive: true }), 'WEBFLOW'],
      ['a Cloudflare-deployed Webflow project', (dir: string) => writeFileSync(join(dir, 'wrangler.toml'), 'name = "x"\n'), 'WEBFLOW'],
  ```
- **Change:** delete those three lines, then remove `writeFileSync` from the `node:fs` import on line 6 because no other use remains. The import becomes `import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';`. Keep the `'a folder inside the hub'`, `'a .skilled folder outside the hub'` and `'a workspace with no surface markers'` rows and the rest of the test body.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/system-skill-advisor-plugin.vitest.ts | tail -4
  ```
  Expected: `Tests  91 passed (91)`
- **AC:** AC-001
- **Rollback:** restore the three rows.
- **Stop if:** the count is not `91`.

### T040 — Point the surface-hint test at a surface that still ships

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/advisor-surface-hint.vitest.ts`
- **Anchor:** line 16 `const SURFACE_HINT = 'WEBFLOW';`
- **Change:** replace that line with `const SURFACE_HINT = 'SKILLED';`. The comment above it about the prompt mapping to `sk-code` stays true, and the argv assertion reads `SURFACE_HINT` rather than a literal.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/advisor-surface-hint.vitest.ts | tail -4
  ```
  Expected: `Tests  3 passed (3)`
- **AC:** AC-014
- **Rollback:** restore `const SURFACE_HINT = 'WEBFLOW';`.
- **Stop if:** the suite fails on the argv assertion.

### T041 — Correct the CLI manifest description

- **File:** `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts`
- **Anchor:** line 58 `surfaceHint: { type: 'string', minLength: 1, maxLength: 64, description: 'Surface the caller already knows, such as WEBFLOW, forwarded to the compiled-route front door as --surface-hint. An unknown surface is ignored there.' },`
- **Change:** change `such as WEBFLOW` to `such as SKILLED`. Change nothing else in the schema.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts | rg -c 'such as WEBFLOW'
  rg -n 'such as WEBFLOW' .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts || echo 0
  ```
  Expected: `1`, then `0`
- **AC:** AC-015
- **Rollback:** change `such as SKILLED` back to `such as WEBFLOW`.
- **Stop if:** the file still reports a match.

### T042 — Correct the tool description

- **File:** `.skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts`
- **Anchor:** line 24 `surfaceHint: { type: 'string', minLength: 1, maxLength: 64, description: 'Surface the caller already knows, such as WEBFLOW, forwarded to the compiled-route front door as --surface-hint. An unknown surface is ignored there.' },`
- **Change:** the same one-word change: `such as WEBFLOW` becomes `such as SKILLED`.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts | rg -c 'such as WEBFLOW'
  rg -n 'such as WEBFLOW' .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts || echo 0
  ```
  Expected: `1`, then `0`
- **AC:** AC-015
- **Rollback:** change `such as SKILLED` back to `such as WEBFLOW`.
- **Stop if:** the file still reports a match.

### T043 — Correct the advisor README

- **File:** `.skilled/skills/system-skill-advisor/README.md`
- **Anchor:** line 117, the sentence containing `` such as `WEBFLOW` ``.
- **Change:** change the example to `` `SKILLED` `` and leave the length bound and the rest of the option list alone.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/system-skill-advisor/README.md | rg -c 'WEBFLOW'
  rg -n 'WEBFLOW' .skilled/skills/system-skill-advisor/README.md || echo 0
  ```
  Expected: `1`, then `0`
- **AC:** AC-015
- **Rollback:** change `` `SKILLED` `` back to `` `WEBFLOW` ``.
- **Stop if:** the file still reports a match.

<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: No-change screens

### T044 — Confirm the native-scorer prompt needs no edit

- **File:** none
- **Anchor:** `tests/scorer/native-scorer.vitest.ts`, line 387 `const result = scoreAdvisorPrompt('implement a responsive webflow animation module', {`.
- **Change:** none. Read the prompt and the assertion below it.
  ```bash
  sed -n '387,392p' .skilled/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/native-scorer.vitest.ts | tail -4
  ```
  Expected: the `sed` shows `expect(result.topSkill).toBe('sk-code');`, and the suite reports `Tests  22 passed (22)`
- **AC:** AC-016
- **Rollback:** n/a: read-only.
- **Stop if:** the assertion names a surface other than `sk-code`, because the hub would no longer own the frontend prompt.

### T045 — Run the zero-hit surface-id re-check

- **File:** none
- **Anchor:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts`, line 1.
- **Change:** run the positive control first, then the zero check.
  ```bash
  rg -c -i 'obsidian' .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
  rg -n -i 'webflow|obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts .skilled/skills/system-skill-advisor/leaf-aliases.json .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json || echo 0
  ```
- **Proof:**
  ```bash
  rg -c -i 'obsidian' .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
  rg -n -i 'webflow|obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts .skilled/skills/system-skill-advisor/leaf-aliases.json .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json || echo 0
  ```
  Expected: `1`, then `0`
- **AC:** AC-016
- **Rollback:** n/a: read-only.
- **Stop if:** the control prints `0`, because the pattern would then be broken rather than the files clean.

### T046 — Run the leaf-manifest screen

- **File:** none
- **Anchor:** `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs`, line 81 `function findManifestDirs(skillsDir) {`.
- **Change:** run the fleet control, the private-tree zero check and the gate.
  ```bash
  git ls-tree -r --name-only 42b41dd286 -- .skilled/skills | rg -c 'leaf-manifest.json'
  git ls-tree -r --name-only 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian | rg -c 'leaf-manifest.json' || echo 0
  node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs --format text | tail -1
  ```
- **Proof:**
  ```bash
  git ls-tree -r --name-only 42b41dd286 -- .skilled/skills | rg -c 'leaf-manifest.json'
  git ls-tree -r --name-only 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian | rg -c 'leaf-manifest.json' || echo 0
  node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs --format text | tail -1
  ```
  Expected: `14`, then `0`, then `checked=14 fresh=14 failed=0`
- **AC:** AC-025
- **Rollback:** n/a: read-only.
- **Stop if:** the first count is not `14`, because the control would then be wrong.

### T047 — Record the three no-change decisions

- **File:** `implementation-summary.md`
- **Anchor:** line 92, the limitations anchor comment, immediately followed by line 93 `## Known Limitations`.
- **Change:** insert this block immediately before the limitations anchor comment.
  ```markdown
  ### No-change decisions

  | Decision | Proof |
  |----------|-------|
  | The native-scorer `webflow` prompt stays; its assertion is `expect(result.topSkill).toBe('sk-code')` at line 392 and the suite passes 22 | T044's read of lines 387 to 392 and its 22-passing run |
  | `aliases.ts`, `leaf-aliases.json` and `scorer-calibration-baseline.json` carry no surface token; the `skill_advisor.py` control prints `1` | T045's control and zero check |
  | `ci-leaf-manifest-freshness.cjs` needs no change: 14 fleet manifests, 0 in either private source tree, and the gate reports `checked=14 fresh=14 failed=0` | T046's three commands |
  ```
- **Proof:**
  ```bash
  sed -n '/^ *### No-change decisions/,/^ *## Known Limitations/p' implementation-summary.md | grep -c '^ *| '
  ```
  Expected: `4`, the table header plus three decisions
- **AC:** AC-016, AC-025
- **Rollback:** delete the `### No-change decisions` heading and its table.
- **Stop if:** the count is not `4`.

<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:phase-8 -->
## Phase 8: Regenerate the tracked graph

### T048 — Regenerate the tracked fallback graph

- **File:** `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`
- **Anchor:** line 1, the single JSON line that begins `{"schema_version": 1, "generated_at":`.
- **Change:** run the compiler and let it write the file. Never hand-edit the JSON.
  ```bash
  python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json
  ```
- **Proof:**
  ```bash
  python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json | head -1
  ```
  Expected: `Compiled skill-graph.json: ` followed by a byte count and `(14 skills)`
- **AC:** AC-011, AC-012
- **Rollback:** `git checkout -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`
- **Stop if:** the command prints a validation error or a skill count other than `14`.

### T049 — Verify the sk-code surface signals are gone

- **File:** none
- **Anchor:** `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`, the `signals` object.
- **Change:** run the positive control first, then the zero check.
  ```bash
  node -e "const g=require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json');console.log(g.signals['mcp-tooling'].filter(x=>/obsidian/i.test(x)).length)"
  node -e "const g=require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json');console.log(JSON.stringify(g.signals['sk-code'].filter(x=>/webflow|obsidian/i.test(x))))"
  ```
- **Proof:**
  ```bash
  node -e "const g=require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json');console.log(g.signals['mcp-tooling'].filter(x=>/obsidian/i.test(x)).length)"
  node -e "const g=require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json');console.log(JSON.stringify(g.signals['sk-code'].filter(x=>/webflow|obsidian/i.test(x))))"
  ```
  Expected: `3`, then `[]`
- **AC:** AC-011
- **Rollback:** n/a: read-only.
- **Stop if:** the control is not `3`, because the predicate would then be broken rather than the signals clean.

### T050 — Verify the regenerated graph diff is limited

- **File:** none
- **Anchor:** `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`, line 1.
- **Change:** inspect the diff only.
  ```bash
  git diff --stat -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json
  git diff -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json | rg '^[-+].*mcp-tooling' || echo 0
  ```
- **Proof:**
  ```bash
  git diff --stat -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json
  git diff -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json | rg -c '^[-+].*sk-code'
  git diff -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json | rg '^[-+].*mcp-tooling' || echo 0
  ```
  Expected: one file changed, a `sk-code` line count of at least `1`, then `0`
- **AC:** AC-012
- **Rollback:** n/a: read-only.
- **Stop if:** the diff names any file other than `skill-graph.json`, or any `mcp-tooling` line changed, because that means the compiler ran before phase 2 or the skip is wrong.

<!-- /ANCHOR:phase-8 -->

---

<!-- ANCHOR:phase-9 -->
## Phase 9: Verification

### T051 — Re-run the containment helper suite

- **File:** none
- **Anchor:** `tests/private-skill-target.vitest.ts`, line 26 `describe('private skill link containment', () => {`.
- **Change:** run the suite only.
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/private-skill-target.vitest.ts
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/private-skill-target.vitest.ts | tail -4
  ```
  Expected: `Tests  5 passed (5)`
- **AC:** AC-019
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `5`.

### T052 — Re-run the graph-scan suite

- **File:** none
- **Anchor:** `tests/skill-graph-db.vitest.ts`, line 13 `describe('skill graph database indexing', () => {`.
- **Change:** run the suite only.
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts | tail -4
  ```
  Expected: `Tests  11 passed (11)`
- **AC:** AC-002, AC-020
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `11`.

### T053 — Re-run the advisor-status suite

- **File:** none
- **Anchor:** `tests/handlers/advisor-status.vitest.ts`, line 129 `describe('advisor_status handler', () => {`.
- **Change:** run the suite only.
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/handlers/advisor-status.vitest.ts
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/handlers/advisor-status.vitest.ts | tail -4
  ```
  Expected: `Tests  21 passed (21)`
- **AC:** AC-004, AC-021
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `21`.

### T054 — Re-run the Python suite

- **File:** none
- **Anchor:** `tests/python/test_skill_advisor.py`, line 2138 `def main():`.
- **Change:** run the suite only.
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py | tail -1
  ```
  Expected: `Summary: pass=72, fail=0`
- **AC:** AC-006, AC-022, AC-024
- **Rollback:** n/a: read-only.
- **Stop if:** the summary is not `pass=72, fail=0`.

### T055 — Re-run the Hermes suite

- **File:** none
- **Anchor:** `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs`, line 41 `test('writes one markdown-only folder per SKILL.md, flat by frontmatter name, skipping node_modules', () => {`.
- **Change:** run the suite only.
  ```bash
  node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs
  ```
- **Proof:**
  ```bash
  node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs | rg '^ℹ (tests|pass|fail) '
  ```
  Expected: `ℹ tests 6`, `ℹ pass 6`, `ℹ fail 0`
- **AC:** AC-007, AC-023
- **Rollback:** n/a: read-only.
- **Stop if:** the test count is not `6`.

### T056 — Re-run the root-metadata contract

- **File:** none
- **Anchor:** `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`, line 68 `function makeRoot(skillsDir, skillId, files) {`.
- **Change:** run the script only.
  ```bash
  node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs
  ```
- **Proof:**
  ```bash
  node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs | tail -1
  ```
  Expected: `[sk-doc] skill-root-metadata contract + fleet gate coverage passed`
- **AC:** AC-008
- **Rollback:** n/a: read-only.
- **Stop if:** the line is absent.

### T057 — Re-run the freshness-panel suite

- **File:** none
- **Anchor:** `tests/doctor/skill-graph-freshness-panel.vitest.ts`, line 109 `describe('skill-graph freshness panel', () => {`.
- **Change:** run the suite only.
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts | tail -4
  ```
  Expected: `Tests  19 passed (19)`
- **AC:** AC-009
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `19`.

### T058 — Re-run the plugin node:test suite

- **File:** none
- **Anchor:** `.opencode/plugins/tests/system-skill-advisor.test.cjs`, line 356 `  const summary = compiledRouteSummary(['quality', 'review', 'opencode', 'skilled', 'typescript']);`.
- **Change:** run the suite only.
  ```bash
  node --test .opencode/plugins/tests/system-skill-advisor.test.cjs
  ```
- **Proof:**
  ```bash
  node --test .opencode/plugins/tests/system-skill-advisor.test.cjs | rg '^ℹ (tests|pass|fail) '
  ```
  Expected: `ℹ tests 42`, `ℹ pass 42`, `ℹ fail 0`
- **AC:** AC-001
- **Rollback:** n/a: read-only.
- **Stop if:** the test count is not `42`.

### T059 — Re-run the plugin vitest suite

- **File:** none
- **Anchor:** `tests/system-skill-advisor-plugin.vitest.ts`, line 700 `['a folder inside the hub', (_dir: string) => undefined, 'SKILLED'],`.
- **Change:** run the suite only.
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/system-skill-advisor-plugin.vitest.ts
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/system-skill-advisor-plugin.vitest.ts | tail -4
  ```
  Expected: `Tests  91 passed (91)`
- **AC:** AC-001
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `91`.

### T060 — Re-run the surface-hint suite

- **File:** none
- **Anchor:** `tests/advisor-surface-hint.vitest.ts`, line 16 `const SURFACE_HINT = 'SKILLED';`.
- **Change:** run the suite only.
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/advisor-surface-hint.vitest.ts
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/advisor-surface-hint.vitest.ts | tail -4
  ```
  Expected: `Tests  3 passed (3)`
- **AC:** AC-014
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `3`.

### T061 — Re-run the native-scorer suite

- **File:** none
- **Anchor:** `tests/scorer/native-scorer.vitest.ts`, line 387 `const result = scoreAdvisorPrompt('implement a responsive webflow animation module', {`.
- **Change:** run the suite only.
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/native-scorer.vitest.ts
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/native-scorer.vitest.ts | tail -4
  ```
  Expected: `Tests  22 passed (22)`
- **AC:** AC-016
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `22`.

### T062 — Re-run the lexical pair

- **File:** none
- **Anchor:** `tests/scorer/lexical-candidate-dedup.vitest.ts`, line 1 `// ───────────────────────────────────────────────────────────────`.
- **Change:** run the pair only.
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/lexical-candidate-dedup.vitest.ts tests/scorer/bm25-lexical-shadow.vitest.ts
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/lexical-candidate-dedup.vitest.ts tests/scorer/bm25-lexical-shadow.vitest.ts | tail -4
  ```
  Expected: `Tests  10 passed (10)`
- **AC:** AC-001
- **Rollback:** n/a: read-only.
- **Stop if:** the count is not `10`.

### T063 — Re-run the ambiguity slice

- **File:** none
- **Anchor:** `tests/scorer/ambiguity-slice.vitest.ts`, line 112 `).toBeGreaterThanOrEqual(baselineCorrect);`.
- **Change:** run the suite only.
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/ambiguity-slice.vitest.ts
  ```
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/ambiguity-slice.vitest.ts 2>&1 | rg 'live='
  ```
  Expected: a `live=` value of `17/24` or higher; the gate stays red against `baseline=19`
- **AC:** AC-017
- **Rollback:** n/a: read-only.
- **Stop if:** the `live=` value is below `17/24`, because that is a regression this phase must not ship.

### T064 — Run the in-scope surface sweep

- **File:** none
- **Anchor:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts`, line 39, the `sk-code` array.
- **Change:** run the sweep only.
  ```bash
  rg -n -i 'webflow|obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer .skilled/skills/system-skill-advisor/runtime/tools .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts .skilled/skills/system-skill-advisor/README.md .opencode/plugins/system-skill-advisor.js .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs .skilled/commands/doctor/scripts/skill-graph-freshness.cjs
  ```
- **Proof:**
  ```bash
  rg -c -i 'webflow|obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts
  rg -n -i 'webflow|obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer .skilled/skills/system-skill-advisor/runtime/tools .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts .skilled/skills/system-skill-advisor/README.md .opencode/plugins/system-skill-advisor.js .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs .skilled/commands/doctor/scripts/skill-graph-freshness.cjs | wc -l
  ```
  Expected: `2`, then `3`
- **AC:** AC-001
- **Rollback:** n/a: read-only.
- **Stop if:** the sweep returns more than three lines, or any line other than `fusion.ts:600`, `fusion.ts:602` and `explicit.ts:131`.

### T065 — Verify the three description files carry no WEBFLOW

- **File:** none
- **Anchor:** `.skilled/skills/system-skill-advisor/README.md`, line 117.
- **Change:** run the positive control first, then the zero check.
  ```bash
  git show 42b41dd286:.skilled/skills/system-skill-advisor/README.md | rg -c 'WEBFLOW'
  rg -n 'WEBFLOW' .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts .skilled/skills/system-skill-advisor/README.md || echo 0
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/system-skill-advisor/README.md | rg -c 'WEBFLOW'
  rg -n 'WEBFLOW' .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts .skilled/skills/system-skill-advisor/README.md || echo 0
  ```
  Expected: `1`, then `0`
- **AC:** AC-015
- **Rollback:** n/a: read-only.
- **Stop if:** the control prints `0`, because the pattern would then be broken.

### T066 — Verify the sk-code signals with a positive control

- **File:** none
- **Anchor:** `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`, the `signals` object.
- **Change:** run the control and the zero check again from the final state.
  ```bash
  node -e "const g=require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json');console.log(g.signals['mcp-tooling'].filter(x=>/obsidian/i.test(x)).length)"
  node -e "const g=require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json');console.log(JSON.stringify(g.signals['sk-code'].filter(x=>/webflow|obsidian/i.test(x))))"
  ```
- **Proof:**
  ```bash
  node -e "const g=require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json');console.log(g.signals['mcp-tooling'].filter(x=>/obsidian/i.test(x)).length)"
  node -e "const g=require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json');console.log(JSON.stringify(g.signals['sk-code'].filter(x=>/webflow|obsidian/i.test(x))))"
  ```
  Expected: `3`, then `[]`
- **AC:** AC-011
- **Rollback:** n/a: read-only.
- **Stop if:** the control is not `3`.

### T067 — Verify the zero-hit surface-id files with a positive control

- **File:** none
- **Anchor:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts`, line 1.
- **Change:** run the control and the zero check again from the final state.
  ```bash
  rg -c -i 'obsidian' .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
  rg -n -i 'webflow|obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts .skilled/skills/system-skill-advisor/leaf-aliases.json .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json || echo 0
  ```
- **Proof:**
  ```bash
  rg -c -i 'obsidian' .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
  rg -n -i 'webflow|obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts .skilled/skills/system-skill-advisor/leaf-aliases.json .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json || echo 0
  ```
  Expected: `1`, then `0`
- **AC:** AC-016
- **Rollback:** n/a: read-only.
- **Stop if:** the control prints `0`.

### T068 — Re-run the leaf-manifest gate

- **File:** none
- **Anchor:** `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs`, line 81 `function findManifestDirs(skillsDir) {`.
- **Change:** run the gate only.
  ```bash
  node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs --format text
  ```
- **Proof:**
  ```bash
  node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs --format text | tail -1
  ```
  Expected: `checked=14 fresh=14 failed=0`
- **AC:** AC-025
- **Rollback:** n/a: read-only.
- **Stop if:** the summary differs.

### T069 — Record the red-first evidence

- **File:** `implementation-summary.md`
- **Anchor:** line 92, the limitations anchor comment, immediately followed by line 93 `## Known Limitations`.
- **Change:** insert this block immediately before the limitations anchor comment. Fill the observed failure text from the T018, T019, T021, T022, T023, T025, T026, T028, T029, T031 and T033 status lines.
  ```markdown
  ### Red-first evidence

  | Test task | Code task | Observed before the code change |
  |-----------|-----------|---------------------------------|
  | T018 | T020 | the linked skill is absent from `skill_nodes` |
  | T019 | T020 | passes before and after; it proves the containment rejection, not a regression |
  | T021 | T024 | the linked `SKILL.md` rewrite leaves the signature unchanged |
  | T022 | T024 | passes before and after; it proves the untrusted target is ignored |
  | T023 | T024 | passes before and after; it proves the declared root is honored |
  | T025 | T027 | `local-private` appears in the discovered list |
  | T026 | T027 | the linked target is followed through `os.path.isfile` |
  | T028 | T030 | the mirror reports `Wrote 5 of 5` |
  | T029 | T030 | passes before and after; it proves the symlink is never followed |
  | T031 | T032 | `findSkillRoots` returns `local-webflow` |
  | T033 | T034 | the panel reports `local-webflow` as a missing node |
  ```
- **Proof:**
  ```bash
  sed -n '/^ *### Red-first evidence/,/^ *## Known Limitations/p' implementation-summary.md | grep -c '^ *| T0'
  ```
  Expected: `11`, one row per test task
- **AC:** AC-003, AC-005, AC-010, AC-013
- **Rollback:** delete the `### Red-first evidence` heading and its table.
- **Stop if:** any row still carries the placeholder wording instead of the observed failure.

### T070 — Record the final counts

- **File:** `implementation-summary.md`
- **Anchor:** line 92, the limitations anchor comment, immediately followed by line 93 `## Known Limitations`.
- **Change:** insert this block immediately before the limitations anchor comment.
  ```markdown
  ### Final counts

  | Command | Final |
  |---------|-------|
  | containment helper | 5 passing |
  | `skill-graph-db` | 11 passing |
  | `advisor-status` | 21 passing |
  | Python advisor | `pass=72, fail=0` |
  | Hermes sync | 6 passing |
  | root-metadata contract | `passed` |
  | freshness panel | 19 passing |
  | plugin `node:test` | 42 passing |
  | plugin vitest | 91 passing |
  | `advisor-surface-hint` | 3 passing |
  | `native-scorer` | 22 passing |
  | lexical pair | 10 passing |
  | ambiguity slice | `live=17/24 baseline=19`, expected red |
  | in-scope surface sweep | 3 lines: `fusion.ts:600`, `fusion.ts:602`, `explicit.ts:131` |
  | leaf-manifest gate | `checked=14 fresh=14 failed=0` |
  ```
- **Proof:**
  ```bash
  sed -n '/^ *### Final counts/,/^ *## Known Limitations/p' implementation-summary.md | grep -c '^ *| '
  ```
  Expected: `16`, the table header plus fifteen final rows
- **AC:** AC-028
- **Rollback:** delete the `### Final counts` heading and its table.
- **Stop if:** the count is not `16`.

### T071 — Run the authoritative validator

- **File:** none
- **Anchor:** `spec.md`, line 13 `<!-- SPECKIT_LEVEL: 3 -->`.
- **Change:** run the validator only.
  ```bash
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict
  ```
- **Proof:**
  ```bash
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict | tail -1
  ```
  Expected: `RESULT: PASSED`
- **AC:** AC-018
- **Rollback:** n/a: read-only.
- **Stop if:** the last line is not `RESULT: PASSED`.

### T072 — Independent review

- **File:** none
- **Anchor:** `tasks.md`, this task.
- **Change:** dispatch a separate DeepSeek session on branch `deepseekpi` with read-only access. It checks: every follow path uses the containment helper and every skip is top-level only, every added comment states a durable reason and names no packet, phase or spec path, no tracked file in scope still names the removed surfaces, and each behavior change has a test that would fail without it. A finding is resolved in a follow-up task or recorded with its reason; two rounds without a new finding ends the review. The reviewer writes its report to `/tmp/phase3-review.txt` and closes it with a `VERDICT:` line.
- **Proof:**
  ```bash
  tail -1 /tmp/phase3-review.txt
  ```
  Expected: `VERDICT: CLEAN`, or a `VERDICT: FINDINGS` line whose findings are all resolved or recorded
- **AC:** AC-027
- **Rollback:** n/a: the report is a file under `/tmp`.
- **Stop if:** the reviewer reports an unresolved finding after two rounds.

### T073 — Re-run the authoritative validator from the final state

- **File:** none
- **Anchor:** `spec.md`, line 13 `<!-- SPECKIT_LEVEL: 3 -->`.
- **Change:** run the validator again after every edit.
  ```bash
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict
  ```
- **Proof:**
  ```bash
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict | tail -1
  ```
  Expected: `RESULT: PASSED`
- **AC:** AC-018
- **Rollback:** n/a: read-only.
- **Stop if:** the last line is not `RESULT: PASSED`.

### T074 — Commit the phase

- **File:** none
- **Anchor:** `tasks.md`, this task.
- **Change:** stage the changed files by name, never `git add -A`, and commit with a prose body.
  ```bash
  git add .skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts \
    .skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts \
    .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts \
    .skilled/skills/system-skill-advisor/runtime/tests/skill-graph-db.vitest.ts \
    .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts \
    .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts \
    .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py \
    .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py \
    .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs \
    .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs \
    .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs \
    .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs \
    .skilled/commands/doctor/scripts/skill-graph-freshness.cjs \
    .skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts \
    .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts \
    .opencode/plugins/system-skill-advisor.js \
    .opencode/plugins/tests/system-skill-advisor.test.cjs \
    .skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts \
    .skilled/skills/system-skill-advisor/runtime/tests/advisor-surface-hint.vitest.ts \
    .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts \
    .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts \
    .skilled/skills/system-skill-advisor/README.md \
    .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json \
    specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md \
    specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/plan.md \
    specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md \
    specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/acceptance-criteria.md \
    specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/decision-record.md \
    specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/implementation-summary.md \
    specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/goal.md \
    specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/description.json \
    specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/graph-metadata.json
  git commit -m "Retire the advisor's removed surface vocabulary and bound its private-skill scans"
  ```
- **Proof:**
  ```bash
  git log --oneline -1
  git diff --cached --name-only | wc -l
  ```
  Expected: one commit whose subject is `Retire the advisor's removed surface vocabulary and bound its private-skill scans`, and `0` staged paths after the commit
- **AC:** AC-026
- **Rollback:** `git reset --soft HEAD~1` before the push; after the push, use the phase rollback in `plan.md` §7.
- **Stop if:** `git status --porcelain` names a path outside the 23 changed files and this phase's documents.

### T075 — Push the phase

- **File:** none
- **Anchor:** `tasks.md`, this task.
- **Change:** push `HEAD:main` only after T073 and T074 pass. Never push a branch.
  ```bash
  git push origin HEAD:main
  ```
- **Proof:**
  ```bash
  git rev-parse HEAD
  git rev-parse origin/main
  ```
  Expected: two identical hashes
- **AC:** AC-026
- **Rollback:** no automatic rollback; a pushed commit is reverted with `git revert` per `plan.md` §7.
- **Stop if:** the push is rejected, because a non-fast-forward means someone else landed on `main`.

### T076 — Confirm the final state

- **File:** none
- **Anchor:** `tasks.md`, this task.
- **Change:** run the two checks only.
  ```bash
  git status --porcelain
  git rev-parse HEAD
  git rev-parse origin/main
  ```
- **Proof:**
  ```bash
  git status --porcelain
  git rev-parse HEAD
  git rev-parse origin/main
  ```
  Expected: no output from `git status --porcelain`, then two identical hashes
- **AC:** AC-026
- **Rollback:** n/a: read-only.
- **Stop if:** `git status --porcelain` prints anything, or the two hashes differ.

<!-- /ANCHOR:phase-9 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---
