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

**Task Format**: one change per task. A task edits one file, runs one command, or generates one artifact. A runtime-mirror generator counts as one command even when it writes the code/review pair, and a drift-check task counts as one check block. Every task carries the same seven fields in the same order: `File`, `Anchor`, `Change`, `Proof`, `AC`, `Rollback`, `Stop if`.

**Execution order.** Tasks run in numeric order. Every test task lands before the code task it proves, and the tracked graph is regenerated only after the compiler already skips `local-*`.

**Anchor convention.** Every anchor below was read on the working tree at `583316d083`. Read the file, confirm the quoted text sits on the named line, then edit. When the text has moved, edit where the quoted text is and leave the line number alone. Never delete a range you have not read.

**Executor.** Every task runs in an OpenCode 2 session with a DeepSeek orchestrator, written by the orchestrator or the `code` / `markdown` subagents. That includes the one-line README description, which must land with the code it describes. No dispatch kit or executor branch name is used.

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

### [x] T001 — Build the local advisor database

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
- **Evidence:** `advisor_rebuild --trusted --force true --format text` printed `advisor_rebuild: rebuilt` and `skillCount: 14`.
- **Drift:** The proof's `tail -3` drops the `rebuilt` line because the command prints five lines; the orchestrator ran it outside the Codex sandbox, where the advisor daemon cannot start.

### [x] T002 — Prove phase 2 removed both surface folders

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
- **Evidence:** `412`, `0`, `absent`.

### [x] T003 — Capture the skill-graph-db baseline

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
- **Evidence:** `Tests  9 passed (9)`.

### [x] T004 — Capture the advisor-status baseline

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
- **Evidence:** `Tests  18 passed (18)`.

### [x] T005 — Capture the Python suite baseline

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
- **Evidence:** `Summary: pass=69, fail=0`.

### [x] T006 — Capture the Hermes suite baseline

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
- **Evidence:** `ℹ tests 4`, `ℹ pass 4`, `ℹ fail 0`.

### [x] T007 — Capture the root-metadata contract baseline

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
- **Evidence:** `[sk-doc] skill-root-metadata contract + fleet gate coverage passed`.

### [x] T008 — Capture the freshness-panel baseline

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
- **Evidence:** `Tests  18 passed (18)`.

### [x] T009 — Capture the plugin node:test baseline

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
- **Evidence:** `ℹ tests 42`, `ℹ pass 42`, `ℹ fail 0`.

### [x] T010 — Capture the plugin vitest baseline

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
- **Evidence:** `Tests  94 passed (94)`.

### [x] T011 — Capture the surface-hint baseline

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
- **Evidence:** `Tests  3 passed (3)`.

### [x] T012 — Capture the native-scorer baseline

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
- **Evidence:** `Tests  22 passed (22)`.

### [x] T013 — Capture the lexical pair baseline

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
- **Evidence:** `Tests  10 passed (10)`.

### [x] T014 — Capture the ambiguity-slice baseline

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
- **Evidence:** `live=17/24 baseline=19`; the run exits non-zero, red as required.

### [x] T015 — Record the baseline table

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
- **Evidence:** The Baseline table is in `implementation-summary.md`; counted to the next heading it has 14 table lines.
- **Drift:** The original proof counts to the end of the file and holds only while the block is last; see the 2026-10-24 amendment in `decision-record.md`.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Containment helper

### [x] T016 — Add the containment helper tests

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
- **Evidence:** Red: `Test Files 1 failed`, `Tests no tests`; the module is unresolved.

### [x] T017 — Create the containment helper

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
- **Evidence:** `Tests  5 passed (5)`.
- **Drift:** Ran `npm run build` first because the advisor `dist/` was stale; `dist/` is generated and ignored.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Follow-scans

### [x] T018 — Add the graph linked-inside test

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
- **Evidence:** Red: `1 failed | 9 passed (10)`; the failure is the linked `local-beta` case.

### [x] T019 — Add the graph linked-outside test

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
- **Evidence:** `1 failed | 10 passed (11)`; the one failure is T018's case, so this case passes before the code change.

### [x] T020 — Follow a trusted link in the graph scan

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
- **Evidence:** `Tests  11 passed (11)`.

### [x] T021 — Add the signature linked-inside test

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
- **Evidence:** Red: `1 failed | 18 passed (19)`.
- **Drift:** The new case sits above the `// drift: verified against shipped behavior` comment so the comment stays attached to its own test.

### [x] T022 — Add the signature linked-outside test

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
- **Evidence:** `1 failed | 19 passed (20)`; the one failure is T021's case, so this case passes before the code change.
- **Drift:** The real closing block is `join(skills, '.private', 'private-beta', ...)`, not the quoted `join(skills, 'private-beta', ...)`.

### [x] T023 — Add the signature declared-root test

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
- **Evidence:** Red: `2 failed | 19 passed (21)`.
- **Drift:** Expected `20 passed, 1 failed`. The case asserts `not.toBe(before)` on a link nothing follows yet, so it is red like T021's, not a guard.

### [x] T024 — Follow a trusted link in the source signature

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
- **Evidence:** `Tests  21 passed (21)`.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Skip-scans

### [x] T025 — Add the compiler real-folder test

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
- **Evidence:** Red: `Summary: pass=69, fail=1` (`T246-GC-013`).

### [x] T026 — Add the compiler symlink test

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
- **Evidence:** Red: `Summary: pass=69, fail=2` (`GC-013`, `GC-014`).

### [x] T027 — Skip a private skill in compiler discovery

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
- **Evidence:** `Summary: pass=71, fail=0`.

### [x] T028 — Add the Hermes real-folder test

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
- **Evidence:** Red: `ℹ tests 5`, `ℹ pass 4`, `ℹ fail 1`.

### [x] T029 — Add the Hermes symlink test

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
- **Evidence:** `ℹ tests 6`, `ℹ pass 5`, `ℹ fail 1`; the one failure is T028's case, so this case passes before the code change.

### [x] T030 — Skip a top-level private skill in the Hermes walk

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
- **Evidence:** `ℹ tests 6`, `ℹ pass 6`, `ℹ fail 0`.

### [x] T031 — Add the CI root-discovery test

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
- **Evidence:** Red: `AssertionError`, actual `['alpha','local-webflow']` against expected `['alpha']`.

### [x] T032 — Skip a private skill in root discovery

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
- **Evidence:** `[sk-doc] skill-root-metadata contract + fleet gate coverage passed`, exit 0.

### [x] T033 — Add the freshness-panel private-skill case

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
- **Evidence:** Red: `1 failed | 18 passed (19)`.

### [x] T034 — Skip a private skill in the doctor on-disk read

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
- **Evidence:** `Tests  19 passed (19)`.

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Python conflict reader

### [x] T035 — Pin the conflict reader's inclusion of a private skill

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
- **Evidence:** `Summary: pass=72, fail=0`.
- **Drift:** The specified body uses `advisor`, which is function-local to `test_advisor_module`; the new test loads it with `advisor = load_module("skill_advisor", "skill_advisor.py")` and adds no `ok()` of its own on load success. The phase adds three `ok()` calls in all (T025, T026 and T035), taking the count from 69 to 72.

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Vocabulary sweep

### [x] T036 — Delete the removed surface's hint token

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
- **Evidence:** `rg -n -i 'obsidian' lexical.ts || echo 0` printed `0`; the control printed `2`.

### [x] T037 — Keep only the SKILLED workspace surface

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
- **Evidence:** `rg -n 'OBSIDIAN|WEBFLOW' .opencode/plugins/system-skill-advisor.js || echo 0` printed `0`; the control printed `3`.

### [x] T038 — Rename the plugin fixture target

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
- **Evidence:** `ℹ tests 42`, `ℹ pass 42`, `ℹ fail 0`; the fixture target is `'skilled'` at lines 356, 377 and 403.

### [x] T039 — Delete the removed surface-detection rows

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
- **Evidence:** `Tests  91 passed (91)`; three detection rows deleted.
- **Drift:** The unused `writeFileSync` import was removed with the rows.

### [x] T040 — Point the surface-hint test at a surface that still ships

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
- **Evidence:** `Tests  3 passed (3)` with `SURFACE_HINT = 'SKILLED'`.

### [x] T041 — Correct the CLI manifest description

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
- **Evidence:** `rg -n 'such as WEBFLOW' skill-advisor-cli-manifest.ts || echo 0` printed `0`; the control printed `1`.

### [x] T042 — Correct the tool description

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
- **Evidence:** `rg -n 'such as WEBFLOW' advisor-recommend.ts || echo 0` printed `0`; the control printed `1`.

### [x] T043 — Correct the advisor README

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
- **Evidence:** The `WEBFLOW` token at `README.md:117` is replaced; T065 re-measured `0` for `WEBFLOW` across the README and both tool files.

<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: No-change screens

### [x] T044 — Confirm the native-scorer prompt needs no edit

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
- **Evidence:** `sed -n '387,392p'` shows `expect(result.topSkill).toBe('sk-code');`; the suite reports `Tests  22 passed (22)`.

### [x] T045 — Run the zero-hit surface-id re-check

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
- **Evidence:** The zero check printed `0` across `aliases.ts`, `leaf-aliases.json` and `scorer-calibration-baseline.json`; the corrected control `rg -c -i 'webflow|obsidian' skill_advisor.py` printed `1` (line 2181, the D6-kept `webflow cms` entry).
- **Drift:** The control as written, `rg -c -i 'obsidian' skill_advisor.py`, prints nothing (exit 1) at `42b41dd286`, at `HEAD` and now: the file holds no `obsidian`. The control is corrected to `webflow|obsidian`.

### [x] T046 — Run the leaf-manifest screen

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
- **Evidence:** `14`, `0`, `checked=14 fresh=14 failed=0`.

### [x] T047 — Record the three no-change decisions

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
- **Evidence:** The `### No-change decisions` table has 4 table lines counted to the next heading.
- **Drift:** The second row records the corrected `skill_advisor.py` control (see T045). The original proof counts to the end of the file and holds only while the block is last.

<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:phase-8 -->
## Phase 8: Regenerate the tracked graph

### [x] T048 — Regenerate the tracked fallback graph

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
- **Evidence:** `Compiled skill-graph.json: ... (14 skills)`.

### [x] T049 — Verify the sk-code surface signals are gone

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
- **Evidence:** `3`, then `[]`.

### [x] T050 — Verify the regenerated graph diff is limited

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
- **Evidence:** `git diff --stat` shows one file changed, +1 -1; the `sk-code` line count is `2`; a semantic compare against `HEAD` prints `["generated_at"]` as the only differing top-level key.
- **Drift:** `skill-graph.json` is one JSON line, so the `mcp-tooling` grep matches both diff lines (count `2`, not `0`). The semantic compare shows `mcp-tooling` is unchanged, so the intent holds.

<!-- /ANCHOR:phase-8 -->

---

<!-- ANCHOR:phase-9 -->
## Phase 9: Verification

### [x] T051 — Re-run the containment helper suite

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
- **Evidence:** `Tests  5 passed (5)` when first run; `Tests  8 passed (8)` after the review follow-up added three cases (the plan's `5` is superseded).

### [x] T052 — Re-run the graph-scan suite

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
- **Evidence:** `Tests  11 passed (11)`.

### [x] T053 — Re-run the advisor-status suite

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
- **Evidence:** `Tests  21 passed (21)` when first run; `Tests  22 passed (22)` after the review follow-up added the status-scan case.

### [x] T054 — Re-run the Python suite

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
- **Evidence:** `Summary: pass=72, fail=0` when first run; `Summary: pass=76, fail=0` after the review follow-up added four trust tests, and `pass=83` after round 2 added six discovery tests and one compiler test.

### [x] T055 — Re-run the Hermes suite

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
- **Evidence:** `ℹ tests 6`, `ℹ pass 6`, `ℹ fail 0`, exit 0.

### [x] T056 — Re-run the root-metadata contract

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
- **Evidence:** `[sk-doc] skill-root-metadata contract + fleet gate coverage passed`, exit 0.

### [x] T057 — Re-run the freshness-panel suite

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
- **Evidence:** `Tests  19 passed (19)`.

### [x] T058 — Re-run the plugin node:test suite

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
- **Evidence:** `ℹ tests 42`, `ℹ pass 42`, `ℹ fail 0`, exit 0.

### [x] T059 — Re-run the plugin vitest suite

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
- **Evidence:** `Tests  91 passed (91)`.

### [x] T060 — Re-run the surface-hint suite

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
- **Evidence:** `Tests  3 passed (3)`.

### [x] T061 — Re-run the native-scorer suite

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
- **Evidence:** `Tests  22 passed (22)`.

### [x] T062 — Re-run the lexical pair

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
- **Evidence:** `Tests  10 passed (10)` over 2 files.

### [x] T063 — Re-run the ambiguity slice

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
- **Evidence:** `ambiguity top-1 regressed: live=17/24 baseline=19`; `Tests  1 failed | 2 passed (3)`, red against the baseline as required and no lower than `17/24`.

### [x] T064 — Run the in-scope surface sweep

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
- **Evidence:** `2`, then 3 lines: `fusion.ts:600`, `fusion.ts:602`, `explicit.ts:131`.

### [x] T065 — Verify the three description files carry no WEBFLOW

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
- **Evidence:** `1`, then `0`.

### [x] T066 — Verify the sk-code signals with a positive control

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
- **Evidence:** `3`, then `[]`.

### [x] T067 — Verify the zero-hit surface-id files with a positive control

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
- **Evidence:** The corrected control printed `1` and the zero check printed `0`.
- **Drift:** Same control correction as T045: `rg -c -i 'obsidian' skill_advisor.py` prints nothing; the control is `webflow|obsidian`.

### [x] T068 — Re-run the leaf-manifest gate

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
- **Evidence:** `checked=14 fresh=14 failed=0`.

### [x] T069 — Record the red-first evidence

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
- **Evidence:** The `### Red-first evidence` table has 11 `| T0` rows; 3 rows read `passes before and after`.
- **Drift:** T023 was observed red, so the table holds eight red-first rows and three guards (T019, T022, T029), not seven and four.

### [x] T070 — Record the final counts

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
- **Evidence:** The `### Final counts` table has 18 table lines counted to the next heading (header plus seventeen rows): the original fifteen plus projection freshness and daemon freshness, added by the review follow-up. It had 16 when first written.
- **Drift:** The original proof counts to the end of the file; Final counts is the last table, so both agree.

### [x] T070a — Add the advisor fallback to the code agent's route step

- **File:** `.skilled/agents/code.md`
- **Anchor:** line 66, the full line beginning ``3. **INVOKE sk-code**`` and carrying ``**HARD STOP**: if `sk-code` returns UNKNOWN or ambiguous routing, escalate `UNKNOWN_ROUTE` BEFORE any edit.``
- **Change:** replace the whole line with this line, leaving the tuple sentence and the final citation sentence unchanged.
  ```markdown
  3. **INVOKE sk-code** → Read `.skilled/skills/sk-code/SKILL.md` and execute its smart router to produce a concrete tuple: `(resolved_route, top-1/top-2 intents, conditional resource paths, verification command)`. **FALLBACK**: if `sk-code` returns UNKNOWN or ambiguous routing, run `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<task text>"}' --format json` and read the top pick at `.data.recommendations[0].skillId`; when it starts with `local-`, read that skill's `SKILL.md` as the standards overlay, cite it in the RETURN's Summary line, and continue. Otherwise escalate `UNKNOWN_ROUTE` BEFORE any edit. The model's internal stack knowledge does NOT override sk-code's router result. Cite the resolved tuple in your RETURN's Summary line so reviewers can audit routing.
  ```
- **Proof:**
  ```bash
  sed -n '66p' .skilled/agents/code.md | rg -c '\*\*FALLBACK\*\*.*advisor_recommend.*local-'
  sed -n '66p' .skilled/agents/code.md | rg -c 'Otherwise escalate `UNKNOWN_ROUTE` BEFORE any edit'
  git show 42b41dd286:.skilled/agents/code.md | rg -c 'HARD STOP'
  sed -n '66p' .skilled/agents/code.md | rg -c 'HARD STOP' || echo 0
  ```
  Expected: `1`, `1`, `1`, `0`. The first, second and fourth values exist only after T070a's edit; the `HARD STOP` control is `1` at `42b41dd286` and was measured now.
- **AC:** AC-030
- **Rollback:** replace line 66 with the anchor text; do not revert the other lines in the file.
- **Stop if:** the new line names a packet, phase, ADR or task id, or the non-local branch no longer escalates `UNKNOWN_ROUTE`.
- **Evidence:** `1`, `1`, `1`, `0` on `.skilled/agents/code.md` line 66.

### [x] T070b — Make the remaining code-agent statements agree

- **File:** `.skilled/agents/code.md`
- **Anchor:** line 550, `│  └─► Escalate UNKNOWN stack, scope conflict, or low confidence`; line 518, the `Skill-load-without-applying` row's final sentence ``If `stack==UNKNOWN`, escalate `UNKNOWN_STACK` BEFORE the first edit — even when the fix looks obvious``; line 437, ``If sk-code returned UNKNOWN, did I escalate `UNKNOWN_STACK` instead of implementing?``; line 396, ``- `sk-code` returns UNKNOWN or stack/task implication mismatch detected``; line 392, ``- Pick a default overlay when stack is uncertain — escalate `UNKNOWN_STACK` ``; line 371, ``- Load `sk-code` first, then exactly one applicable router-selected guidance set (or none + escalate UNKNOWN)``; line 359, ``- sk-code returns UNKNOWN → `UNKNOWN_STACK` ``; line 210, ``[ ] `sk-code` invoked or loaded for the resolved route; UNKNOWN or ambiguous routing escalated.``; line 118, ``6. If `sk-code` returns UNKNOWN, escalate `UNKNOWN_ROUTE`. NEVER guess.``; line 110, ``| **Fallback** | none | Route cannot be determined | Return `UNKNOWN_ROUTE`; do not silently pick a default route |``; line 73, ``@code does NOT pre-detect the project route. The full code-routing logic lives in `.skilled/skills/sk-code/SKILL.md` and its router references. UNKNOWN/ambiguous returns from sk-code → escalate to orchestrator (e.g. "sk-code returned UNKNOWN for cwd=…; needs a route hint or a new route plan").``
- **Change:** replace those eleven lines with the eleven lines below, highest line number first: 550, 518, 437, 396, 392, 371, 359, 210, 118, 110, 73. The three existing fallback replacements (73, 110, 118) stay; the other eight gain the non-local qualifier. The diagram line starts at column 1, so strip the two-space list indent from each block. No other line changes.
  ```markdown
  │  └─► Escalate UNKNOWN unless local-*, scope conflict, or low confidence   │
  ```
  ```markdown
  | **Skill-load-without-applying** | The agent fires `skill(sk-code)` or reads `sk-code/SKILL.md` but proceeds straight to the edit without extracting `route_code_resources(task)` outputs | Treat `skill(sk-code)` as a fire-and-forget context dump, then implement based on the model's internal language knowledge | Execute sk-code's `route_code_resources(task)` mentally to produce a concrete `(stack, intents, resource_paths, verification_command)` tuple. Cite the tuple in the RETURN Summary. If `stack==UNKNOWN` and the advisor's top pick is not a `local-*` skill, escalate `UNKNOWN_STACK` BEFORE the first edit — even when the fix looks obvious |
  ```
  ```markdown
  7. Did I cite sk-code's detected stack + selected intents + loaded resource paths in my RETURN Summary, proving the smart router actually fired (not just the SKILL.md read)? If sk-code returned UNKNOWN and the advisor's top pick is not a `local-*` skill, did I escalate `UNKNOWN_STACK` instead of implementing?
  ```
  ```markdown
  - `sk-code` returns UNKNOWN and the advisor's top pick is not a `local-*` skill, or a stack/task implication mismatch is detected
  ```
  ```markdown
  - Pick a default overlay when stack is uncertain — escalate `UNKNOWN_STACK` only when the advisor's top pick is not a `local-*` skill
  ```
  ```markdown
  - Load `sk-code` first, then exactly one applicable router-selected guidance set (or none + escalate UNKNOWN when the advisor's top pick is not a `local-*` skill)
  ```
  ```markdown
  - sk-code returns UNKNOWN and the advisor's top pick is not a `local-*` skill → `UNKNOWN_STACK`
  ```
  ```markdown
  [ ] `sk-code` invoked or loaded for the resolved route; UNKNOWN or ambiguous routing escalated when the advisor's top pick is not a `local-*` skill.
  ```
  ```markdown
  6. If `sk-code` returns UNKNOWN, run `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<task text>"}' --format json`; when `.data.recommendations[0].skillId` starts with `local-`, read that skill's `SKILL.md` as the standards overlay, cite it in the RETURN Summary and continue. With no such pick, escalate `UNKNOWN_ROUTE`. NEVER guess.
  ```
  ```markdown
  | **Fallback** | Advisor `local-*` overlay | Route cannot be determined | Run `advisor_recommend`; when `.data.recommendations[0].skillId` starts with `local-`, load that `SKILL.md` as the standards overlay; otherwise return `UNKNOWN_ROUTE` |
  ```
  ```markdown
  @code does NOT pre-detect the project route. The full code-routing logic lives in `.skilled/skills/sk-code/SKILL.md` and its router references. UNKNOWN/ambiguous returns from sk-code → run `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<task text>"}' --format json`; when `.data.recommendations[0].skillId` starts with `local-`, read that skill's `SKILL.md` as the standards overlay, cite it in the RETURN Summary and continue. With no such pick, escalate `UNKNOWN_ROUTE` to the orchestrator (e.g. "sk-code returned UNKNOWN for cwd=…; needs a route hint or a new route plan").
  ```
- **Proof:**
  ```bash
  sed -n '73p;110p;118p' .skilled/agents/code.md | rg -c 'advisor_recommend'
  sed -n '73p;110p;118p' .skilled/agents/code.md | rg -c 'local-'
  sed -n '73p;110p;118p' .skilled/agents/code.md | rg -c 'UNKNOWN_ROUTE'
  git show 42b41dd286:.skilled/agents/code.md | rg -c '\| none \|'
  sed -n '110p' .skilled/agents/code.md | rg -c '\| none \|' || echo 0
  sed -n '73p;110p;118p;210p;359p;371p;392p;396p;437p;518p;550p' .skilled/agents/code.md | rg -c 'local-'
  git show 42b41dd286:.skilled/agents/code.md | sed -n '73p;110p;118p;210p;359p;371p;392p;396p;437p;518p;550p' | rg -v 'local-' | rg -c 'UNKNOWN'
  sed -n '73p;110p;118p;210p;359p;371p;392p;396p;437p;518p;550p' .skilled/agents/code.md | rg -v 'local-' | rg -c 'UNKNOWN' || echo 0
  ```
  Expected: `3`, `3`, `3`, `1`, `0`, `11`, `11`, `0`. The `3`/`3`/`3`, `11` and `0` values exist only after this edit; the two control values (`1` and `11`) were measured now against `42b41dd286`.
- **AC:** AC-031
- **Rollback:** restore the eleven anchor lines; leave the line-66 fallback in place.
- **Stop if:** any of the eleven lines still lacks the `local-` qualifier or the non-local escalation.
- **Evidence:** `3`, `3`, `3`, `1`, `0`, `11`, `11`, `0` on the eleven lines.
- **Drift:** Line 392 is a NEVER-list bullet, so the plan's "escalate `UNKNOWN_STACK` only when the advisor's top pick is not a `local-*` skill" would invert it. It now reads "Pick a default overlay when stack is uncertain and the advisor's top pick is not a `local-*` skill — escalate `UNKNOWN_STACK`", which keeps the prohibition and carries the `local-` qualifier.

### [x] T070c — Add the advisor fallback to the review agent's route selection

- **File:** `.skilled/agents/review.md`
- **Anchor:** line 90, `- If the route is UNKNOWN, note the uncertainty and review only against baseline security/correctness minimums.` The handoff cites line 91; the quoted sentence sits on line 90 in this tree.
- **Change:** replace that line with this line. The section 6 `Fallback route` sentence stays unchanged, because noting uncertainty and not inventing route-specific findings remains true after the advisor fallback.
  ```markdown
  - If the route is UNKNOWN, run `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<task text>"}' --format json`; when `.data.recommendations[0].skillId` starts with `local-`, review against that skill's `SKILL.md` plus the baseline security/correctness minimums. Otherwise, note the uncertainty and review only against baseline security/correctness minimums.
  ```
- **Proof:**
  ```bash
  sed -n '90p' .skilled/agents/review.md | rg -c 'advisor_recommend.*local-.*SKILL\.md.*baseline'
  sed -n '90p' .skilled/agents/review.md | rg -c 'Otherwise, note the uncertainty and review only against baseline security/correctness minimums'
  ```
  Expected: `1`, `1`
- **AC:** AC-032
- **Rollback:** replace line 90 with the anchor text.
- **Stop if:** the non-local branch no longer reviews against the baseline minimums.
- **Evidence:** `1`, `1` on `.skilled/agents/review.md` line 90.

### [x] T070d1 — Mirror the code-agent body edits into the Claude twin

- **File:** `.claude/agents/code.md`
- **Anchor:** line 535, `│  └─► Escalate UNKNOWN stack, scope conflict, or low confidence`; line 503, the `Skill-load-without-applying` row's final sentence ``If `stack==UNKNOWN`, escalate `UNKNOWN_STACK` BEFORE the first edit — even when the fix looks obvious``; line 422, ``If sk-code returned UNKNOWN, did I escalate `UNKNOWN_STACK` instead of implementing?``; line 381, ``- `sk-code` returns UNKNOWN or stack/task implication mismatch detected``; line 377, ``- Pick a default overlay when stack is uncertain — escalate `UNKNOWN_STACK` ``; line 356, ``- Load `sk-code` first, then exactly one applicable router-selected guidance set (or none + escalate UNKNOWN)``; line 344, ``- sk-code returns UNKNOWN → `UNKNOWN_STACK` ``; line 195, ``[ ] `sk-code` invoked or loaded for the resolved route; UNKNOWN or ambiguous routing escalated.``; line 103, ``6. If `sk-code` returns UNKNOWN, escalate `UNKNOWN_ROUTE`. NEVER guess.``; line 95, ``| **Fallback** | none | Route cannot be determined | Return `UNKNOWN_ROUTE`; do not silently pick a default route |``; line 58, ``UNKNOWN/ambiguous returns from sk-code → escalate to orchestrator``; line 51, ``3. **INVOKE sk-code**`` with ``**HARD STOP**: if `sk-code` returns UNKNOWN or ambiguous routing, escalate `UNKNOWN_ROUTE` BEFORE any edit.`` The body otherwise matches `.skilled/agents/code.md` apart from runtime path names.
- **Change:** apply the twelve replacement lines below at those positions, highest line number first: 535, 503, 422, 381, 377, 356, 344, 195, 103, 95, 58, 51. Copy them verbatim from T070a and T070b; strip the two-space list indent so the diagram line starts at column 1, and do not reflow, reword or hand-edit any other line.
  ```markdown
  │  └─► Escalate UNKNOWN unless local-*, scope conflict, or low confidence   │
  ```
  ```markdown
  | **Skill-load-without-applying** | The agent fires `skill(sk-code)` or reads `sk-code/SKILL.md` but proceeds straight to the edit without extracting `route_code_resources(task)` outputs | Treat `skill(sk-code)` as a fire-and-forget context dump, then implement based on the model's internal language knowledge | Execute sk-code's `route_code_resources(task)` mentally to produce a concrete `(stack, intents, resource_paths, verification_command)` tuple. Cite the tuple in the RETURN Summary. If `stack==UNKNOWN` and the advisor's top pick is not a `local-*` skill, escalate `UNKNOWN_STACK` BEFORE the first edit — even when the fix looks obvious |
  ```
  ```markdown
  7. Did I cite sk-code's detected stack + selected intents + loaded resource paths in my RETURN Summary, proving the smart router actually fired (not just the SKILL.md read)? If sk-code returned UNKNOWN and the advisor's top pick is not a `local-*` skill, did I escalate `UNKNOWN_STACK` instead of implementing?
  ```
  ```markdown
  - `sk-code` returns UNKNOWN and the advisor's top pick is not a `local-*` skill, or a stack/task implication mismatch is detected
  ```
  ```markdown
  - Pick a default overlay when stack is uncertain — escalate `UNKNOWN_STACK` only when the advisor's top pick is not a `local-*` skill
  ```
  ```markdown
  - Load `sk-code` first, then exactly one applicable router-selected guidance set (or none + escalate UNKNOWN when the advisor's top pick is not a `local-*` skill)
  ```
  ```markdown
  - sk-code returns UNKNOWN and the advisor's top pick is not a `local-*` skill → `UNKNOWN_STACK`
  ```
  ```markdown
  [ ] `sk-code` invoked or loaded for the resolved route; UNKNOWN or ambiguous routing escalated when the advisor's top pick is not a `local-*` skill.
  ```
  ```markdown
  6. If `sk-code` returns UNKNOWN, run `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<task text>"}' --format json`; when `.data.recommendations[0].skillId` starts with `local-`, read that skill's `SKILL.md` as the standards overlay, cite it in the RETURN Summary and continue. With no such pick, escalate `UNKNOWN_ROUTE`. NEVER guess.
  ```
  ```markdown
  | **Fallback** | Advisor `local-*` overlay | Route cannot be determined | Run `advisor_recommend`; when `.data.recommendations[0].skillId` starts with `local-`, load that `SKILL.md` as the standards overlay; otherwise return `UNKNOWN_ROUTE` |
  ```
  ```markdown
  @code does NOT pre-detect the project route. The full code-routing logic lives in `.skilled/skills/sk-code/SKILL.md` and its router references. UNKNOWN/ambiguous returns from sk-code → run `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<task text>"}' --format json`; when `.data.recommendations[0].skillId` starts with `local-`, read that skill's `SKILL.md` as the standards overlay, cite it in the RETURN Summary and continue. With no such pick, escalate `UNKNOWN_ROUTE` to the orchestrator (e.g. "sk-code returned UNKNOWN for cwd=…; needs a route hint or a new route plan").
  ```
  ```markdown
  3. **INVOKE sk-code** → Read `.skilled/skills/sk-code/SKILL.md` and execute its smart router to produce a concrete tuple: `(resolved_route, top-1/top-2 intents, conditional resource paths, verification command)`. **FALLBACK**: if `sk-code` returns UNKNOWN or ambiguous routing, run `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<task text>"}' --format json` and read the top pick at `.data.recommendations[0].skillId`; when it starts with `local-`, read that skill's `SKILL.md` as the standards overlay, cite it in the RETURN's Summary line, and continue. Otherwise escalate `UNKNOWN_ROUTE` BEFORE any edit. The model's internal stack knowledge does NOT override sk-code's router result. Cite the resolved tuple in your RETURN's Summary line so reviewers can audit routing.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.claude/agents/code.md | rg -c 'HARD STOP'
  git show 42b41dd286:.claude/agents/code.md | rg -c '\| none \|'
  rg -c 'advisor_recommend' .claude/agents/code.md
  rg -c 'HARD STOP' .claude/agents/code.md || echo 0
  rg -c '\| none \|' .claude/agents/code.md || echo 0
  sed -n '51p;58p;95p;103p;195p;344p;356p;377p;381p;422p;503p;535p' .claude/agents/code.md | rg -c 'local-'
  git show 42b41dd286:.claude/agents/code.md | sed -n '51p;58p;95p;103p;195p;344p;356p;377p;381p;422p;503p;535p' | rg -v 'local-' | rg -c 'UNKNOWN'
  sed -n '51p;58p;95p;103p;195p;344p;356p;377p;381p;422p;503p;535p' .claude/agents/code.md | rg -v 'local-' | rg -c 'UNKNOWN' || echo 0
  node -e "
  const fs=require('fs');
  const {parseFrontmatter}=require('./.skilled/skills/system-spec-kit/shared/dist/frontmatter/parse-frontmatter.js');
  const norm=s=>s.replace(/\.(?:skilled|opencode|claude|pi)\/agents\//g,'<agents>/').trim();
  const a=norm(parseFrontmatter(fs.readFileSync('.skilled/agents/code.md','utf8')).body);
  const b=norm(parseFrontmatter(fs.readFileSync('.claude/agents/code.md','utf8')).body);
  console.log('code: '+(a===b?'identical':'DIFF'));
  "
  ```
  Expected: `1`, `1`, `4`, `0`, `0`, `12`, `12`, `0`, `code: identical`. The `4`, `12` and `0` values exist only after this edit; the three controls (`1`, `1` and `12`) were measured now against `42b41dd286`.
- **AC:** AC-033
- **Rollback:** restore the twelve anchor lines in `.claude/agents/code.md`.
- **Stop if:** the body comparison prints `DIFF` for the code agent, or a line outside the twelve matching positions changes.
- **Evidence:** `1`, `1`, `4`, `0`, `0`, `12`, `12`, `0`, `code: identical`.
- **Drift:** The twin lines were copied by script after asserting each `.claude` line matched `HEAD`'s `.skilled` line at the mapped position.

### [x] T070d2 — Mirror the review-agent body edit into the Claude twin

- **File:** `.claude/agents/review.md`
- **Anchor:** line 75, `- If the route is UNKNOWN, note the uncertainty and review only against baseline security/correctness minimums.` The body otherwise matches `.skilled/agents/review.md` apart from runtime path names.
- **Change:** replace that line with this line, copied verbatim from T070c.
  ```markdown
  - If the route is UNKNOWN, run `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<task text>"}' --format json`; when `.data.recommendations[0].skillId` starts with `local-`, review against that skill's `SKILL.md` plus the baseline security/correctness minimums. Otherwise, note the uncertainty and review only against baseline security/correctness minimums.
  ```
- **Proof:**
  ```bash
  rg -c 'advisor_recommend' .claude/agents/review.md
  sed -n '75p' .claude/agents/review.md | rg -c 'advisor_recommend.*local-.*SKILL\.md.*baseline'
  sed -n '75p' .claude/agents/review.md | rg -c 'Otherwise, note the uncertainty and review only against baseline security/correctness minimums'
  node -e "
  const fs=require('fs');
  const {parseFrontmatter}=require('./.skilled/skills/system-spec-kit/shared/dist/frontmatter/parse-frontmatter.js');
  const norm=s=>s.replace(/\.(?:skilled|opencode|claude|pi)\/agents\//g,'<agents>/').trim();
  const a=norm(parseFrontmatter(fs.readFileSync('.skilled/agents/review.md','utf8')).body);
  const b=norm(parseFrontmatter(fs.readFileSync('.claude/agents/review.md','utf8')).body);
  console.log('review: '+(a===b?'identical':'DIFF'));
  "
  ```
  Expected: `1`, `1`, `1`, `review: identical`. These values exist only after this edit.
- **AC:** AC-033
- **Rollback:** replace line 75 with the anchor text.
- **Stop if:** the body comparison prints `DIFF` for the review agent.
- **Evidence:** `1`, `1`, `1`, `review: identical`.

### [x] T070e1 — Regenerate the Codex mirrors

- **File:** `.codex/agents/code.toml` and `.codex/agents/review.toml`, written together by one generator.
- **Anchor:** `.codex/agents/code.toml` line 55, the old ``**HARD STOP**: if `sk-code` returns UNKNOWN or ambiguous routing, escalate `UNKNOWN_ROUTE` BEFORE any edit.`` Both files are generated from `.skilled/agents/{code,review}.md` and must never be hand-edited.
- **Change:** run the Codex generator once in write mode.
  ```bash
  node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs
  ```
- **Proof:**
  ```bash
  node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check
  rg -c 'advisor_recommend' .codex/agents/code.toml .codex/agents/review.toml
  ```
  Expected: `[codex-agent-sync] PASS: 11 agents are in sync.`, `.codex/agents/code.toml:4`, `.codex/agents/review.toml:1`. The two counts exist only after the `.skilled` edits and this regeneration.
- **AC:** AC-034
- **Rollback:** `git checkout -- .codex/agents/code.toml .codex/agents/review.toml`, then regenerate only if the `.skilled` text should stay.
- **Stop if:** the generator writes a path outside the two named mirrors, or the check exits non-zero.
- **Evidence:** Write mode printed `Wrote 2 of 11 generated agents.`; `--check` printed `[codex-agent-sync] PASS: 11 agents are in sync.`; `advisor_recommend` counts `.codex/agents/code.toml:4`, `.codex/agents/review.toml:1`. The pre-run `--check` named only the two stale files.

### [x] T070e2 — Regenerate the Pi mirrors

- **File:** `.pi/agents/code.md` and `.pi/agents/review.md`, written together by one generator.
- **Anchor:** `.pi/agents/code.md` line 59, the old ``**HARD STOP**: if `sk-code` returns UNKNOWN or ambiguous routing, escalate `UNKNOWN_ROUTE` BEFORE any edit.`` Both files are generated from `.skilled/agents/{code,review}.md` and must never be hand-edited.
- **Change:** run the Pi generator once in write mode.
  ```bash
  node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs
  ```
- **Proof:**
  ```bash
  node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check
  rg -c 'advisor_recommend' .pi/agents/code.md .pi/agents/review.md
  ```
  Expected: `[pi-agent-sync] PASS: 11 agents are in sync.`, `.pi/agents/code.md:4`, `.pi/agents/review.md:1`. The two counts exist only after the `.skilled` edits and this regeneration.
- **AC:** AC-034
- **Rollback:** `git checkout -- .pi/agents/code.md .pi/agents/review.md`, then regenerate only if the `.skilled` text should stay.
- **Stop if:** the generator writes a path outside the two named mirrors, or the check exits non-zero.
- **Evidence:** Write mode printed `Wrote 2 of 11 generated agents.`; `--check` printed `[pi-agent-sync] PASS: 11 agents are in sync.`; `advisor_recommend` counts `.pi/agents/code.md:4`, `.pi/agents/review.md:1`. The pre-run `--check` named only the two stale files.

### [x] T070e3 — Run the four agent-mirror drift checks

- **File:** none
- **Anchor:** `.skilled/bin/check-agent-mirror-sync.cjs`, line 1 `#!/usr/bin/env node`.
- **Change:** run the four checks only.
  ```bash
  set -e
  node .skilled/bin/check-agent-mirror-sync.cjs --all
  node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check
  node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check
  node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
  echo 'all four agent mirror checks exited 0'
  ```
- **Proof:**
  ```bash
  set -e
  node .skilled/bin/check-agent-mirror-sync.cjs --all
  node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check
  node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check
  node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
  echo 'all four agent mirror checks exited 0'
  ```
  Expected: `all four agent mirror checks exited 0`, with the doctor check printing `STATUS=OK agent-roster-mirror: every runtime covers the canonical roster`
- **AC:** AC-034
- **Rollback:** n/a: read-only.
- **Stop if:** any check exits non-zero.
- **Evidence:** `all four agent mirror checks exited 0`; the doctor check printed `STATUS=OK agent-roster-mirror: every runtime covers the canonical roster`.
- **Drift:** `sync-skills-hermes.cjs --check` reported `DRIFT agent-code` and `DRIFT agent-review` (the Hermes `agent-<name>` skills mirror the agent bodies). Regenerated with `sync-skills-hermes.cjs` (`Wrote 2 of 66 Hermes skill copies`); `--check` now prints `PASS: 66 Hermes skill copies in sync`. The commit stages `.hermes/skills/agent-code/SKILL.md` and `.hermes/skills/agent-review/SKILL.md`.

### [x] T070f — Record the deferred private-skill routing probe

- **File:** `implementation-summary.md`
- **Anchor:** line 92, the limitations anchor comment, immediately followed by line 93 `## Known Limitations`.
- **Change:** insert this block immediately before the limitations anchor comment, after the final-counts block. It records a routing probe that waits for phase 004; the insertion itself is proved now.
  ````markdown
  ### Deferred after phase 004

  The routing probe that proves a real private skill wins an UNKNOWN route runs once phase 004 creates the two symlinks. It is not a gate for closing this phase.

  ```bash
  cd "/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com"
  SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills:/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills" node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a responsive webflow animation module"}' --format json | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).data.recommendations[0].skillId))"
  ```

  Expected: `local-webflow`, the top `skillId`.
  ````
- **Proof:**
  ```bash
  rg -c '^### Deferred after phase 004' implementation-summary.md
  sed -n '/^### Deferred after phase 004/,/^## Known Limitations/p' implementation-summary.md | rg -c 'local-webflow'
  ```
  Expected: `1`, `1`. These values exist only after this insertion.

  **Deferred proof (after phase 004 lands):**
  ```bash
  cd "/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com"
  SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills:/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills" node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a responsive webflow animation module"}' --format json | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).data.recommendations[0].skillId))"
  ```
  Expected: `local-webflow`, the top `skillId`. This probe is deferred and is not a gate for closing this phase.
- **AC:** AC-035 (routing probe deferred after phase 004; the insertion proof above is immediate)
- **Rollback:** delete the `### Deferred after phase 004` heading, its paragraph, its command block and its `Expected` line.
- **Stop if:** the insertion proof is not `1`, `1`, or after phase 004 lands the top `skillId` is not `local-webflow`.
- **Evidence:** `### Deferred after phase 004` count `1`; `local-webflow` count in that block `1`. The routing probe stays deferred under ADR-008.

### [x] T071 — Run the authoritative validator

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
- **Evidence:** `RESULT: PASSED`, `Errors: 0  Warnings: 0`.
- **Drift:** The first run failed on `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` (`SOURCE_FINGERPRINT_MISMATCH`), because the derived `graph-metadata.json` predated the edited docs. `repair-derived.cjs --folder <folder> --apply` re-derived it (`repaired=1 failed=0`) and the rerun passed.

### [ ] T072 — Independent review

- **File:** none
- **Anchor:** `tasks.md`, this task.
- **Change:** none. Run the review through the `subagent` tool with agent `review` (agent `deep-review` for a multi-dimension pass), read-only by instruction: the prompt says it edits no file. Capture `git status --porcelain` before and after and require the two to be identical. It checks: every follow path uses the containment helper and every skip is top-level only, every added comment states a durable reason and names no packet, phase or spec path, no tracked file in scope still names the removed surfaces, and each behavior change has a test that would fail without it. A finding is resolved in a follow-up task or recorded with its reason; two rounds without a new finding ends the review. The reviewer returns its report in chat and closes it with a final `VERDICT:` line; the orchestrator writes that returned text to `/tmp/phase3-review.txt`.
- **Proof:**
  ```bash
  tail -1 /tmp/phase3-review.txt
  ```
  Expected: `VERDICT: CLEAN`, or a `VERDICT: FINDINGS` line whose findings are all resolved or recorded
- **AC:** AC-027
- **Rollback:** n/a: the report is a file under `/tmp`.
- **Stop if:** the reviewer reports an unresolved finding after two rounds.
- **Evidence:** Round 1 returned FAILED with two P1 and ten P2 findings; Phase 10 resolves them. Round 2 is pending: it needs a separate fresh reviewer, and the orchestrator owns the `/tmp/phase3-review.txt` capture.

### [x] T073 — Re-run the authoritative validator from the final state

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
- **Evidence:** `RESULT: PASSED`, `Errors: 0  Warnings: 0`, from the final doc state after the last `repair-derived.cjs --apply`.

### [ ] T074 — Commit the phase

- **File:** none
- **Anchor:** `tasks.md`, this task.
- **Change:** stage the changed files by name, never `git add -A`, and commit with a prose body. The `.codex` and `.pi` agent files are the T070e1 and T070e2 regenerated copies; stage them, never hand-edit them.
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
    .skilled/agents/code.md \
    .skilled/agents/review.md \
    .claude/agents/code.md \
    .claude/agents/review.md \
    .codex/agents/code.toml \
    .codex/agents/review.toml \
    .pi/agents/code.md \
    .pi/agents/review.md \
    .hermes/skills/agent-code/SKILL.md \
    .hermes/skills/agent-review/SKILL.md \
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
  git commit -m "Retire the advisor's surface vocabulary, bound its scans, and fall back to local skills" -m "advisor vocabulary cleanup: retire the surface vocabulary, bound the private-skill scans, and fall back to local skills"
  ```
- **Proof:**
  ```bash
  git log --oneline -1
  git diff --cached --name-only | wc -l
  ```
  Expected: one commit whose subject is `Retire the advisor's surface vocabulary, bound its scans, and fall back to local skills`, and `0` staged paths after the commit
- **AC:** AC-026
- **Rollback:** `git reset --soft HEAD~1` before the push; after the push, use the phase rollback in `plan.md` §7.
- **Stop if:** `git status --porcelain` names a path outside the 31 changed files and this phase's documents.
- **Evidence:** Pending. The orchestrator commits after the independent review.

### [ ] T075 — Push the phase

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
- **Evidence:** Pending. The orchestrator pushes after the commit.

### [ ] T076 — Confirm the final state

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
- **Evidence:** Pending. Runs after the push.

<!-- /ANCHOR:phase-9 -->

---

<!-- ANCHOR:phase-10 -->
## Phase 10: Review follow-up

Round 1 of the independent review failed the phase. Each task below resolves one finding. Frozen decisions D4 and D5 required extending scope to the files named in `spec.md` section 3; every extension is a dated 2026-10-24 amendment in `decision-record.md` under ADR-002. These were written code first, so each guard was checked by removing it and watching its test fail (see Evidence). T085 to T093 resolve the second independent review in the same way, recorded as the round 2 amendment.

### [x] T077 — Python readers follow only a trusted link (P1-1)

- **File:** `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`
- **Anchor:** `_load_source_graph_signal_map` and `_load_source_conflict_declarations`, each with `if not entry.is_dir(): continue`.
- **Change:** add `_trusted_private_link` (a port of the TypeScript containment check) and `_is_scannable_skill_entry`; both loops call the latter, so a symlink is followed only when its name starts with `local-` and its realpath is a directory inside the skills root or a root named in `SPECKIT_PRIVATE_SKILL_ROOTS`. Add `test_private_skill_link_trust`.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py | rg 'TRUST|Summary'
  ```
  Expected: four `T246-TRUST` `PASS` lines and a `Summary:` line ending `fail=0` (`pass=76` at this task, `pass=83` after T085 to T088)
- **AC:** AC-036
- **Rollback:** remove the two helpers and restore `if not entry.is_dir(): continue` in both loops.
- **Stop if:** the untrusted `local-evil` link is still returned.
- **Evidence:** four `T246-TRUST` lines `PASS`; `Summary: pass=76, fail=0`. With the guard replaced by `entry.is_dir()` the suite reported `pass=74, fail=2` (`T246-TRUST-001` and `T246-TRUST-003` failed, the untrusted `local-evil` link returned).

### [x] T078 — Two generators skip a `local-*` entry (P1-2)

- **File:** `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs`
- **Anchor:** the `for (const skillId of skillIds)` loop in `metadataEntries`; the `.filter` in `listSkillRoots`.
- **Change:** `if (skillId.startsWith('local-')) continue;` as the loop's first statement; add `!e.name.startsWith('local-')` to the root filter.
- **Proof:**
  ```bash
  node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check | rg '"status"|"commandMetadata"'
  ```
  Expected: `"status": "fresh"` and `"commandMetadata": 19`
- **AC:** AC-037
- **Rollback:** delete the two added conditions.
- **Stop if:** the check reports `stale`.
- **Evidence:** `"status": "fresh"`, `"commandMetadata": 19` with a probe folder `.skilled/skills/local-zzprobe/command-metadata.json` present (removed afterwards). With the skip deleted the same probe gave `"status": "stale"` and `"commandMetadata": 20`. Neither script exported a seam for a unit test at that point, so the probe was the proof. T089 added the seam and the automated cases.

### [x] T079 — Harden the containment helper (P2-5, P2-9)

- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts`, `lib/freshness.ts`, `lib/skill-graph/skill-graph-db.ts`
- **Anchor:** `isInside` and `trustedRoots`.
- **Change:** reject a link to the skills root itself; test the parent step as `..` or `..` plus a separator; add `createPrivateSkillLinkCheck`, which resolves the trusted roots once per scan and only when the first link is met; the graph scan and the source signature use it. Add three tests.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/private-skill-target.vitest.ts tests/skill-graph-db.vitest.ts tests/handlers/advisor-status.vitest.ts
  ```
  Expected: `Tests  41 passed (41)`
- **AC:** AC-019
- **Rollback:** restore the previous `isInside` and the per-call root resolution.
- **Stop if:** an in-root link or a declared-root link is rejected.
- **Evidence:** helper `Tests  8 passed (8)`, graph scan 11, advisor-status 22. Guard check: accepting the skills root itself failed the root-link case (`1 failed | 7 passed (8)`), and testing the parent step as `startsWith('..')` failed the `..dotted` case (`1 failed | 7 passed (8)`).

### [x] T080 — Follow a trusted link in the watcher, the projection and the status scan (P2-6)

- **File:** `lib/daemon/watcher.ts`, `lib/scorer/projection.ts`, `handlers/advisor-status.ts` under `.skilled/skills/system-skill-advisor/runtime/`, and their tests.
- **Anchor:** `walkSkillDirectories`, `loadFilesystemProjection`, `scanSkillMetadataFiles`.
- **Change:** each accepts a top-level `local-*` symlink through `createPrivateSkillLinkCheck`, so an edit to a private skill triggers a rebuild, the fallback projection sees it, and the status count agrees with the graph scan.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/daemon-freshness-foundation.vitest.ts tests/scorer/projection-freshness.vitest.ts tests/handlers/advisor-status.vitest.ts
  ```
  Expected: `Tests  47 passed (47)`
- **AC:** AC-038
- **Rollback:** restore the three `isDirectory()` filters.
- **Stop if:** an outside-root link appears in the watch targets, the projection or the count.
- **Evidence:** `Tests  47 passed (47)`; the two sibling watcher suites pass (5 and 7). Guard check: replacing the link test with `true` (accepts the outside link) and with `false` (ignores the inside link) each failed exactly one case in each of the three suites (`1 failed`).

### [x] T081 — The review agent falls back on an ambiguous route too (P2-4)

- **File:** `.skilled/agents/review.md`, `.claude/agents/review.md`, and the regenerated `.codex`, `.pi` and `.hermes` mirrors.
- **Anchor:** line 90 of `.skilled/agents/review.md`, `- If the route is UNKNOWN, run ...`.
- **Change:** read "If the route is UNKNOWN or ambiguous", matching `code.md` lines 66 and 73; copy to the Claude twin; regenerate the Codex, Pi and Hermes mirrors.
- **Proof:**
  ```bash
  sed -n '90p' .skilled/agents/review.md | rg -c 'UNKNOWN or ambiguous.*advisor_recommend.*local-.*SKILL\.md.*baseline'
  node .skilled/bin/check-agent-mirror-sync.cjs --all
  ```
  Expected: `1`, then `all mirrors in sync`
- **AC:** AC-032, AC-034
- **Rollback:** restore the shorter sentence and regenerate.
- **Stop if:** a mirror check exits non-zero.
- **Evidence:** `1`; the Codex, Pi and Hermes generators each wrote the single changed file; the four drift checks and `sync-skills-hermes.cjs --check` pass.

### [x] T082 — Move the graph-scan link fixture out of `node_modules` (P2-8)

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph-db.vitest.ts`
- **Anchor:** `indexes a private skill linked from inside the skills root`.
- **Change:** the target sits under `.cache` instead of `node_modules`. The review suggested `.private/`, but the graph scan walks dot folders, so a skill under `.private/` would be indexed without the link and the test would prove nothing; `.cache` is skipped by name, so only the link reaches it.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts
  ```
  Expected: `Tests  11 passed (11)`
- **AC:** AC-002
- **Rollback:** restore the `node_modules` path.
- **Stop if:** the test passes with the link removed.
- **Evidence:** `Tests  11 passed (11)`.
- **Drift:** `.cache` replaces the suggested `.private/`, for the reason above.

### [x] T083 — Reconcile the packet documents (P2-1, P2-2, P2-3, P2-7, P2-10)

- **File:** `acceptance-criteria.md`, `tasks.md`, `decision-record.md`, `plan.md`, `spec.md`, `implementation-summary.md`, `goal.md`, and the phase 002 `implementation-summary.md` reconciliation.
- **Anchor:** AC-010, AC-012 and AC-032; the T035 drift note; plan ADR numbering; the summary metadata table.
- **Change:** AC-010 counts six skip-scan and five follow-scan tests; AC-012 drops the historic commit block and keeps the semantic compare; the T035 sentence says the phase adds three `ok()` calls (69 to 72); plan.md ADR-006 and ADR-007 now match the decision record (the Python reader is covered under ADR-002); the summary gains a Status field; `decision-record.md` records the phase 002 summary reconciliation.
- **Proof:**
  ```bash
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict | tail -1
  ```
  Expected: `RESULT: PASSED`
- **AC:** AC-018
- **Rollback:** restore the previous wording.
- **Stop if:** the validator fails.
- **Evidence:** `RESULT: PASSED` after the final `repair-derived.cjs --apply`.

### [ ] T084 — Round 2 of the independent review

- **File:** none
- **Anchor:** `tasks.md`, this task.
- **Change:** a fresh reviewer re-reads the follow-up diff and the two P1 repros (a `local-evil` link declaring `conflicts_with alpha`; a `local-*` folder with a `command-metadata.json`).
- **Proof:**
  ```bash
  tail -1 /tmp/phase3-review.txt
  ```
  Expected: `VERDICT: CLEAN`, or findings all resolved or recorded
- **AC:** AC-027
- **Rollback:** n/a
- **Stop if:** an unresolved finding remains after two rounds.
- **Evidence:** Pending. Owned by the orchestrator.

### [x] T085 — Python skill-record discovery follows only a trusted link (P1-A)

- **File:** `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`
- **Anchor:** `_discover_skill_files`, which globbed `*/SKILL.md`; and `skill_advisor.py` `_trusted_private_link`, `_path_inside` and `_is_scannable_skill_entry`.
- **Change:** move the containment check into the runtime module as `create_private_skill_link_check` and `is_scannable_skill_entry`, because `skill_advisor.py` loads that module and the reverse import would be circular. Discovery scans the skills root, skips hidden folders as the glob did, and keeps an entry only through `is_scannable_skill_entry`. `skill_advisor.py` calls the runtime check and loses its copy. Add `test_private_skill_discovery_trust`.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py | rg 'DISCOVER|TRUST|Summary'
  ```
  Expected: six `T246-DISCOVER` and four `T246-TRUST` `PASS` lines, then `Summary: pass=83, fail=0`
- **AC:** AC-039
- **Rollback:** restore the glob in `_discover_skill_files` and the three helpers in `skill_advisor.py`, and delete the new test.
- **Stop if:** an untrusted `local-*` link or a non-local link is returned as a record.
- **Evidence:** six `T246-DISCOVER` lines `PASS` and `Summary: pass=83, fail=0`, exit 0. With the old glob swapped in, `T246-DISCOVER-001`, `-003` and `-005` failed and the other two passed (the untrusted `local-evil` and the non-local `plain-evil` and `linked-gamma` links were returned).

### [x] T086 — Resolve the Python trusted roots once per scan (P2-1)

- **File:** `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py`, `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`
- **Anchor:** the removed `_trusted_private_link`, which called `os.path.realpath(SKILLS_DIR)` and split `SPECKIT_PRIVATE_SKILL_ROOTS` on every call.
- **Change:** `create_private_skill_link_check(skills_dir)` returns a closure that resolves the roots with `_trusted_private_roots` at most once, and only when the first link is met. Each of the three Python scans builds one closure per scan. Add `T246-DISCOVER-006`, which counts resolutions.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py | rg 'DISCOVER-006'
  ```
  Expected: `PASS: T246-DISCOVER-006: a scan resolves its trusted roots once (1 resolution for 2 local-* links)`
- **AC:** AC-039
- **Rollback:** resolve the roots inside the check on every call.
- **Stop if:** the count is not one.
- **Evidence:** the `PASS` line above, exit 0.

### [x] T087 — The router-signal generator skips a `local-*` hub (P2-2)

- **File:** `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs`
- **Anchor:** `hubs()`, the `.filter` chain before the `ROUTER.md` probe.
- **Change:** add `.filter((name) => !name.startsWith('local-'))` ahead of the first `existsSync`, with a comment stating that a private skill belongs to one checkout and this writer rewrites hub metadata.
- **Proof:**
  ```bash
  node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs
  ```
  Expected: `[sk-doc] skill-derived regenerator + freshness gate coverage passed`
- **AC:** AC-041
- **Rollback:** delete the filter line and the comment.
- **Stop if:** the test passes with the filter removed.
- **Evidence:** the expected line, exit 0. With the filter removed the test failed with `a local-* hub must never be checked or written`.

### [x] T088 — The compiler and the bridge deriver refuse a non-private link (P2-3)

- **File:** `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py`, `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs`, `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`
- **Anchor:** `discover_graph_metadata`, after the `local-*` skip; `metadataEntries`, the `readdirSync` of the skills root.
- **Change:** the compiler skips an entry for which `os.path.islink` is true. The deriver reads the root with `withFileTypes` and drops a `local-*` name and a symbolic link. Before the change, record that no tracked top-level skill is a symlink. Add `T246-GC-015`.
- **Proof:**
  ```bash
  git ls-files -s .skilled/skills | awk '$1==120000' | wc -l
  git ls-files -s .skilled/skills | awk '$1==120000 {print $4}' | awk -F/ 'NF==3' | wc -l
  cd .skilled/skills/system-skill-advisor/runtime && python3 tests/python/test_skill_advisor.py | rg 'GC-015'
  ```
  Expected: `39`, `0`, then the `PASS: T246-GC-015` line
- **AC:** AC-040
- **Rollback:** delete the compiler `islink` condition and the deriver `isSymbolicLink` condition.
- **Stop if:** the second command prints anything other than `0`.
- **Evidence:** `39`, then `0`. The depth histogram of the 39 paths printed 12 at depth 5, 4 at depth 6, 5 at depth 7 and 18 at depth 8, so none is a top-level skill folder (depth 3). `T246-GC-015` `PASS`. The compiled graph still differs from `HEAD` only in `generated_at` (checked with the AC-012 compare).

### [x] T089 — Automated cases for the bridge deriver and the regenerator skip (P2-5)

- **File:** `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs`, `.skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts`, `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs`
- **Anchor:** the bottom `main();` call and the missing `module.exports` in the deriver; `listSkillRoots()` in the regenerator.
- **Change:** `metadataEntries` takes the skills root and is exported, and `main()` runs only when the file is the entry point. `listSkillRoots` takes the skills root. The vitest case builds a temporary skills root with a real folder, a `local-*` folder and a linked folder. The node case lists a temporary root holding `alpha` and `local-private`.
- **Proof:**
  ```bash
  node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check | rg '"status"'
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/command-bridges-drift-guard.vitest.ts
  node ../../sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs
  ```
  Expected: `"status": "fresh"`, `Tests  5 passed (5)`, then the `passed` line
- **AC:** AC-041
- **Rollback:** restore the unconditional `main();`, remove the export and the two parameters, and delete the two cases.
- **Stop if:** the deriver stops printing `fresh` when run as a script.
- **Evidence:** all three outputs as expected. With the skip removed, the vitest case failed with `expected [ 'alpha', 'linked', 'local-private' ] to deeply equal [ 'alpha' ]`, and the node case failed with `a local-* skill must never be listed for regeneration`.

### [x] T090 — Dispose of the cross-skill edge loader (P2-6)

- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/metadata-loader.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/cross-skill-edges.vitest.ts`
- **Anchor:** `discoverGraphMetadataFiles`, the loop over `readdirSync(currentDir, { withFileTypes: true })`.
- **Change:** investigated first. The loader reads through `Dirent.isDirectory()`, so it never follows a symlink. `propagateInboundEnhances` in apply mode writes a candidate's `graph-metadata.json`, so a private skill read here could put its name into a tracked skill's metadata. The loader now skips a top-level entry named `local-*`. One case builds `skill-a`, `local-private` and a nested `local-nested` folder and expects `['local-nested', 'skill-a']`.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && ../../system-spec-kit/node_modules/.bin/vitest run tests/cross-skill-edges.vitest.ts
  ```
  Expected: `Tests  15 passed (15)`
- **AC:** AC-041
- **Rollback:** delete the skip, the constant and the case.
- **Stop if:** a nested folder that merely starts with `local-` is dropped.
- **Evidence:** `Tests  15 passed (15)`. With the skip removed the case failed with `local-private` in the result.

### [x] T091 — Record the accepted dispositions (P2-4, P2-11, P2-12)

- **File:** `decision-record.md`, `goal.md`
- **Anchor:** the round 2 amendment; the Decisions table in `goal.md`.
- **Change:** record that `regenerate-skill-derived.cjs --root <path>` bypasses the skip by design, that the phase decision ids are local and which two restate parent D4 and D5, and that refusing a link to the skills root narrows parent D4 on purpose. No code changed.
- **Proof:**
  ```bash
  rg -c 'P2-4, accepted|P2-11|P2-12' decision-record.md
  ```
  Expected: `3`
- **AC:** AC-041
- **Rollback:** delete the three bullets.
- **Stop if:** the sentence about local ids would renumber a phase decision.
- **Evidence:** `3`. The three bullets sit at `decision-record.md` lines 799 to 801.

### [x] T092 — Reconcile the packet documents (P2-7, P2-8, P2-9, P2-10)

- **File:** `spec.md`, `plan.md`, `decision-record.md`, `implementation-summary.md`, `acceptance-criteria.md`, `goal.md`
- **Anchor:** every "seven scans, three include, four exclude" sentence; AC-012; the ADR-006 numbering note; the Files Changed row for `private-skill-target.vitest.ts`.
- **Change:** the count is sixteen, eight including and eight excluding, with the list in the `spec.md` section 3 inventory and a proof command in AC-039. AC-012 keeps only the semantic compare. The ADR-006 note says `plan.md` uses the same number and that neither document has an ADR-007. The helper test row says eight cases.
- **Proof:**
  ```bash
  rg -n -i 'seven scans|three include|four exclude|Three scans include' spec.md plan.md decision-record.md implementation-summary.md acceptance-criteria.md goal.md tasks.md | cut -c1-60
  rg -c 'git log -1 --format=%H' acceptance-criteria.md || echo 0
  grep -c '^  *it(' ../../../../.skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts
  ```
  Expected: six lines, all historical (two `spec.md` Open Questions notes, the `decision-record.md` ADR-002 context and round 2 bullet, and two lines of this task), then `0`, then `8`
- **AC:** AC-018
- **Rollback:** restore the previous wording.
- **Stop if:** the validator fails.
- **Evidence:** the first command printed six lines (`spec.md` 358 and 360, `decision-record.md` 155 and 802, `tasks.md` 2587 and 2591), all historical. The second printed `0` and the third printed `8`. `rg -l` over the two script trees printed 16 files, matching AC-039.

### [x] T093 — Re-verify from the final state

- **File:** none
- **Anchor:** the verification commands of the round 2 brief.
- **Change:** rerun the Python suite, the targeted vitests, the create-skill node tests and the graph compare, then `repair-derived.cjs --apply` and `validate.sh --strict`.
- **Proof:**
  ```bash
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict | tail -1
  ```
  Expected: `RESULT: PASSED`
- **AC:** AC-018
- **Rollback:** n/a
- **Stop if:** any command fails.
- **Evidence:** Python `Summary: pass=83, fail=0`. Eight targeted vitest files `Tests  105 passed (105)` (helper 8, graph scan 11, advisor-status 22, freshness panel 19, cross-skill edges 15, bridge drift guard 5, daemon freshness 22, projection freshness 3). Root-metadata contract and regenerator node tests print `passed`, and the create-skill `typo-flags` node test passes 17 of 17. The deriver prints `"status": "fresh"` with 19 metadata entries and the router-signal check prints `RESULT: PASSED` over 7 hubs. The compiled graph differs from `HEAD` only in `generated_at`. `repair-derived.cjs --apply` printed `inspected=1 repaired=1 failed=0` and `validate.sh --strict` printed `RESULT: PASSED` with `Errors: 0  Warnings: 0`.

<!-- /ANCHOR:phase-10 -->

---

<!-- ANCHOR:phase-11 -->
## Phase 11: Pre-existing advisor suite failures

The operator ruled that the seven failing runtime cases are fixed before this phase is committed. They fail identically on `origin/main` at `b2a1663ee9`. Each task resolves one cause, and the ruling is the 2026-10-24 amendment "Operator ruling: pre-existing advisor suite failures fixed before commit" in `decision-record.md`.

### [x] T094 — Re-derive the hook counts from the committed settings file

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/hooks/settings-driven-invocation-parity.vitest.ts`
- **Anchor:** `EXPECTED_HOOK_COUNTS`, and the header contract line that says `hooks[]` is a single-element array.
- **Change:** set the counts to `UserPromptSubmit` 3, `PreCompact` 1, `SessionStart` 8 and `Stop` 3, and reword the header. The counts were re-measured at `b830fd0276^`, `b830fd0276`, `d001d69fee`, `8ebd4b76d6` and `d4351c23f3`. `.claude/settings.json` is not edited.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/hooks/settings-driven-invocation-parity.vitest.ts
  ```
  Expected: `Tests  41 passed (41)`
- **AC:** AC-018
- **Rollback:** restore the counts 2, 1, 7 and 2.
- **Stop if:** a count has to be lowered to pass.
- **Evidence:** `Tests  41 passed (41)`. At `b830fd0276^` the file held 2, 1, 7, 2. At `b830fd0276` it held 3, 1, 7, 3. At `8ebd4b76d6` it held 3, 1, 8, 3, and the working file still holds that.

### [x] T095 — Pin the parity test to the instant its counts were derived

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts`
- **Anchor:** the top-level `describe('027/003 AC-1/AC-2 regression-protection parity and §11 gates'`.
- **Change:** a `SCORING_INSTANT` of `2026-10-03T00:00:00Z`, installed in `beforeAll` with `vi.useFakeTimers({ toFake: ['Date'] })` and released in `afterAll`, because the derived lane's age haircut reads the clock. The pinned counts and the ledger are unchanged.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/parity/python-ts-parity.vitest.ts tests/parity/scorer-eval-baseline-ratchet.vitest.ts
  ```
  Expected: `Tests` all passed
- **AC:** AC-018
- **Rollback:** delete the constant and the two hooks.
- **Stop if:** an expectation has to change to pass.
- **Evidence:** before the change `advisor-parity-report` showed `tsAlsoCorrect":99` and `rr-iter3-151` in `regressionIds`. An archive of `f8afb2def6e` failed on the real clock and passed with the date fixed at 2026-10-03. An archive of `b2a1663ee9` passed at 2026-10-03, 2026-10-07 and 2026-10-11 and failed at 2026-10-24. After the change the file passes.

### [x] T096 — Pin the ambiguity slice to the baseline's capture instant

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/scorer/ambiguity-slice.vitest.ts`
- **Anchor:** the `beforeAll` that computes `SLICE_CORRECT`.
- **Change:** fake only `Date` at midnight UTC of `BASELINE.capturedAt` before the slice is scored, release it in `afterAll`, and add `capturedAt` to the `Baseline` shape, as the baseline ratchet does. `scorer-eval-baseline.json` is not re-captured.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/scorer/ambiguity-slice.vitest.ts
  ```
  Expected: `Tests  3 passed (3)`, live count `19/24`
- **AC:** AC-017
- **Rollback:** delete the fake clock lines.
- **Stop if:** the live count falls below the baseline of 19.
- **Evidence:** `Tests  3 passed (3)`. A copy of the test with the final assertion forced to fail printed `live=19/24 baseline=19`. Unpinned it printed `live=17/24`.

### [x] T097 — A disabled launcher is not a spawn authority

- **File:** `.skilled/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts`, `.skilled/skills/system-spec-kit/runtime/tests/embedders/hf-local-client.vitest.ts`
- **Anchor:** `hasLiveHfSpawnAuthority`.
- **Change:** split the owner lease read into `hasLiveAdvisorOwnerLease` and count it only when `advisorLauncherSupervisesModelServer()` is true (`SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` empty or `1`, the launcher's own rule). The respawn lock and pid file checks are unchanged. One new case writes a fresh live lease with the flag set to `0` and expects a `not retrying` failure after the 5 second grace.
- **Proof:**
  ```bash
  cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/embedders
  ```
  Expected: `Test Files  9 passed (9)`
- **AC:** AC-018
- **Rollback:** restore the single function and delete the case.
- **Stop if:** a live respawn lock or pid file stops counting as authority.
- **Evidence:** `Test Files  9 passed (9)`, `Tests  102 passed | 2 skipped (104)`. With the supervision check removed the new case failed. The scan CLI in the test scope went from killed at 180 seconds to 78 seconds with only this fix.

### [x] T098 — Stop asking a dead embedding backend once the streak proves it

- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph-embedding-outage.vitest.ts`
- **Anchor:** `refreshSkillEmbeddingsLegacy`, next to `EMBEDDING_BACKEND_OUTAGE_STREAK`.
- **Change:** the legacy refresh path counts consecutive failures like the adapter path, stops after three, counts the remaining rows as failed with a cleared vector, and reports `EMBEDDING-BACKEND-OUTAGE`. The new file has a happy case (six embeds) and a dead-backend case (three calls, six failed).
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/skill-graph-embedding-outage.vitest.ts tests/skill-advisor-cli-job-semantics.vitest.ts
  ```
  Expected: all cases passed
- **AC:** AC-018
- **Rollback:** delete the streak lines and the new test file.
- **Stop if:** the happy case embeds fewer than all six skills.
- **Evidence:** `npm run build` finished and `npm run typecheck` printed no error. The three job-semantics cases passed in about 36 seconds in total, and the two cases that failed at 180 seconds pass.

### [x] T099 — Reconcile the earlier "red by design" lines

- **File:** `implementation-summary.md`
- **Anchor:** Known Limitations items 1 and 5.
- **Change:** item 1 now records that the slice is green at `19/24` once the clock is pinned, and item 5 records the reduced list of failures. The older amendment bullets in `decision-record.md` stay as history, with the ruling amendment as the current truth.
- **Proof:**
  ```bash
  rg -c 'stays red|not green' implementation-summary.md || echo 0
  ```
  Expected: `0`
- **AC:** AC-018
- **Rollback:** restore the two items.
- **Stop if:** the validator fails.
- **Evidence:** see T100.

### [x] T100 — Re-verify from the final state

- **File:** none
- **Anchor:** the full runtime run, the Python suite, `repair-derived.cjs --apply` and `validate.sh --strict`.
- **Change:** none.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && npx vitest run
  python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py | tail -1
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict | tail -1
  ```
  Expected: no `FAIL` line, `pass=83, fail=0`, `RESULT: PASSED`
- **AC:** AC-018
- **Rollback:** n/a
- **Stop if:** any command fails.
- **Evidence:** full runtime run `Test Files  147 passed (147)` and `Tests  1215 passed | 8 skipped (1223)`, exit 0, no `FAIL` line (it was `4 failed | 142 passed` and `7 failed | 1204 passed` on `HEAD`). Python `Summary: pass=83, fail=0`. `repair-derived.cjs --apply` printed `inspected=1 repaired=1 failed=0` and `validate.sh --strict` printed `RESULT: PASSED` with `Errors: 0  Warnings: 0`.

<!-- /ANCHOR:phase-11 -->

---

<!-- ANCHOR:phase-12 -->
## Phase 12: Review round 3

A third independent review found one P1 and five P2 findings. The amendment "Review follow-up amendments, round 3" in `decision-record.md` holds the reasoning. Each task names its proof, and each new case was run red against the old code first.

### [x] T101 — A current row keeps its vector after an embedding outage (P1)

- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph-embedding-outage.vitest.ts`
- **Anchor:** the `backendOutage !== null` branch in `refreshSkillEmbeddingsViaAdapter` and `refreshSkillEmbeddingsLegacy`.
- **Change:** move the outage branch below the empty-description rule and the up-to-date check in both loops. During an outage a row that needed embedding is counted failed and gets what a failed ask writes in that loop (a null vector with the model id and hash on the legacy column, a deleted row on the adapter table). Two cases pre-embed six skills, make four stale, trip the outage and expect the two current rows to keep their vector.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/skill-graph-embedding-outage.vitest.ts tests/skill-graph/refresh-roundtrip.vitest.ts
  ```
  Expected: `Tests  9 passed (9)`
- **AC:** AC-018
- **Rollback:** restore the outage branch above the description read and delete the two cases.
- **Stop if:** an empty-description row stops being counted as skipped.
- **Evidence:** `Test Files  2 passed (2)`, `Tests  9 passed (9)`. Before the fix both new cases failed (`failed: 6, skipped: 0` where `failed: 4, skipped: 2` is expected).

### [x] T102 — `--root` refuses a private skill (P2-1)

- **File:** `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs`
- **Anchor:** `run`, the `args.root` branch.
- **Change:** `isPrivateSkillPath` judges the resolved path and its real target, and `run` throws an input error before any read or write. One test case spawns the script on a `local-private` folder and on a neutrally named link to it. `decision-record.md` replaces the round 2 acceptance line with the outcome.
- **Proof:**
  ```bash
  node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs
  ```
  Expected: `ℹ pass 1`, `ℹ fail 0`
- **AC:** AC-037
- **Rollback:** delete the guard and the case.
- **Stop if:** `--all` or a tracked skill root is refused.
- **Evidence:** `ℹ pass 1`, `ℹ fail 0`. With the guard disabled the case failed (`a private root must exit non-zero`, `0 !== 2`).

### [x] T103 — The owner lease records whether its launcher supervises the model server (P2-2)

- **File:** `.skilled/bin/system-skill-advisor-launcher.cjs`, `.skilled/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts`, `.skilled/skills/system-spec-kit/runtime/tests/embedders/hf-local-client.vitest.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/launcher-model-server-default.vitest.ts`, `.skilled/skills/system-spec-kit/shared/tests/model-server-constants.test.ts`
- **Anchor:** `buildOwnerLease` and `hasLiveAdvisorOwnerLease`.
- **Change:** `buildOwnerLease` writes `supervisesModelServer` from `isModelServerEnabled()`. `hasLiveAdvisorOwnerLease` treats a recorded `false` as no authority and counts `true` or an absent field as before. The consumer no longer reads the flag. The launcher exports `buildOwnerLease`. Both packages declare the field name and the constants test compares them. Three client cases cover true, false and absent, and five launcher cases acquire a real lease for each flag value.
- **Proof:**
  ```bash
  cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/embedders
  cd ../../system-skill-advisor/runtime && npx vitest run tests/launcher-model-server-default.vitest.ts tests/launcher-reap-pid-reuse.vitest.ts
  cd ../../system-spec-kit/runtime && npx tsx ../shared/tests/model-server-constants.test.ts
  ```
  Expected: `Test Files  9 passed (9)`, `Tests  18 passed (18)`, `model-server constants agree across packages`
- **AC:** AC-018
- **Rollback:** restore the flag read in `hf-local.ts` and drop the field.
- **Stop if:** a lease without the field stops counting as authority.
- **Evidence:** `Test Files  9 passed (9)`, `Tests  104 passed | 2 skipped (106)`, `Tests  18 passed (18)`, and the constants test printed its agreement line. With the false check removed the false case failed, and with the field not written the five launcher cases failed.

### [x] T104 — Keep the calendar covered where the clocks are pinned (P2-3)

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/lifecycle-derived-metadata.vitest.ts`
- **Anchor:** the case `trust lanes keep author intent non-decaying and cap derived contributions`.
- **Change:** one new case applies the haircut to one block at 2026-02-01 and 2026-10-01 and expects the later date to score lower. The pins in `ambiguity-slice.vitest.ts` and `python-ts-parity.vitest.ts` stay.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/lifecycle-derived-metadata.vitest.ts
  ```
  Expected: `Tests  18 passed (18)`
- **AC:** AC-018
- **Rollback:** delete the case.
- **Stop if:** a pin is removed.
- **Evidence:** `Tests  18 passed (18)`.

### [x] T105 — Two test gaps in the discovery and containment suites (P2-4)

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`, `.skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts`
- **Anchor:** the `T246-DISCOVER` block, and the case `checks many links against one resolution of the trusted roots`.
- **Change:** a `.hidden/SKILL.md` fixture and `T246-DISCOVER-007`. The vitest case wraps `realpathSync` in a pass-through spy and counts calls on the skills root: none before the first link, one after three, two after two per-link calls.
- **Proof:**
  ```bash
  python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py | tail -1
  cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/private-skill-target.vitest.ts
  ```
  Expected: `Summary: pass=84, fail=0`, `Tests  8 passed (8)`
- **AC:** AC-036, AC-039
- **Rollback:** delete the fixture, the case and the spy.
- **Stop if:** the helper's public behavior has to change.
- **Evidence:** `Summary: pass=84, fail=0` and `Tests  8 passed (8)`. With the hidden-folder skip removed `T246-DISCOVER-007` failed (`records=['alpha', 'hidden-skill', 'local-beta']`, `pass=83, fail=1`). With the roots resolved on every link the vitest case failed (`expected 3 to be 1`).

### [x] T106 — Reconcile the packet documents (P2-5)

- **File:** `acceptance-criteria.md`, `decision-record.md`, `spec.md`, `implementation-summary.md`, `goal.md`, `tasks.md`
- **Anchor:** AC-036, AC-037, AC-039 and their proofs, the round 2 `P2-4` line, the Files to Change and Files Changed tables.
- **Change:** AC-037 cites the drift-guard test and the regenerator test instead of a probe folder. The Python counts become 84 and seven discovery cases. The round 3 amendment is added.
- **Proof:**
  ```bash
  rg -c 'local-zzprobe' acceptance-criteria.md || echo 0
  ```
  Expected: `0`
- **AC:** AC-037
- **Rollback:** restore the three AC blocks.
- **Stop if:** the validator fails.
- **Evidence:** `rg -c 'local-zzprobe' acceptance-criteria.md` printed `0`.

### [x] T107 — Re-verify from the final state

- **File:** none
- **Anchor:** the full advisor runtime run, the embedder run, the Python suite, `repair-derived.cjs --apply` and `validate.sh --strict`.
- **Change:** none.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && npx vitest run
  python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py | tail -1
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict | tail -1
  ```
  Expected: no `FAIL` line, `pass=84, fail=0`, `RESULT: PASSED`
- **AC:** AC-018
- **Rollback:** n/a
- **Stop if:** any command fails.
- **Evidence:** full advisor run `Test Files  147 passed (147)` and `Tests  1223 passed | 8 skipped (1231)`, exit 0, no `FAIL` line (it was `1215 passed | 8 skipped (1223)` before round 3). Python `Summary: pass=84, fail=0`. `npm run build` and `npm run typecheck` printed no error. `repair-derived.cjs --apply` printed `inspected=1 repaired=1 failed=0` and `validate.sh --strict` printed `RESULT: PASSED` with `Errors: 0  Warnings: 0`.

### [x] T108 — The lease equals the launcher's start decision (P2-1)

- **File:** `.skilled/bin/system-skill-advisor-launcher.cjs`, `.skilled/skills/system-skill-advisor/runtime/tests/launcher-model-server-default.vitest.ts`
- **Anchor:** `buildOwnerLease` and the case block `owner lease records the launcher supervision decision`.
- **Change:** the field is `isModelServerEnabled() && Boolean(hfControl)`. Two cases load a copy of the launcher with no `lib/` directory beside it and expect `false` for the flag unset and for the flag `1`.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/launcher-model-server-default.vitest.ts tests/skill-graph-embedding-outage.vitest.ts
  ```
  Expected: `Test Files  2 passed (2)`, `Tests  17 passed (17)`
- **AC:** AC-018
- **Rollback:** restore `isModelServerEnabled()` alone and drop the two cases.
- **Stop if:** a launcher that did start the server writes `false`.
- **Evidence:** `Test Files  2 passed (2)` and `Tests  17 passed (17)`. With the library check removed both new cases failed and eleven passed.

### [x] T109 — Isolate the lease cases from the shell's database directory (P2-2)

- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/launcher-model-server-default.vitest.ts`
- **Anchor:** the `beforeEach` and `afterEach` of the lease block.
- **Change:** `SYSTEM_SKILL_ADVISOR_DB_DIR` is saved at the block start, deleted before each case and restored after it.
- **Proof:** the T108 command, which now passes whether or not the variable is set in the shell.
- **AC:** AC-018
- **Rollback:** delete the hooks.
- **Stop if:** another case in the file starts to depend on the variable.
- **Evidence:** the T108 run, with the variable unset in the shell, printed `Tests  17 passed (17)`.

### [x] T110 — The `--root` guard ignores case (P2-3)

- **File:** `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs`
- **Anchor:** `isPrivateSkillPath` and `testExplicitRootRefusesPrivateSkill`.
- **Change:** the typed and real basenames are lowercased before the `local-` prefix test. One case adds a `LOCAL-Shouted` folder and expects true from the helper, exit 2 from the script and an unchanged file.
- **Proof:**
  ```bash
  node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs
  ```
  Expected: `ℹ pass 1`, `ℹ fail 0`
- **AC:** AC-037
- **Rollback:** restore the case-sensitive test and drop the case.
- **Stop if:** a tracked skill root is refused.
- **Evidence:** `ℹ pass 1`, `ℹ fail 0`. With the case-sensitive test the new assertion failed.

### [x] T111 — Record round 4 and fix the review order (doc nit)

- **File:** `decision-record.md`, `implementation-summary.md`, `goal.md`, `tasks.md`
- **Anchor:** the round 4 amendment and the How It Was Delivered paragraph.
- **Change:** the second review is listed before the third, and the round 4 outcome is recorded.
- **Proof:** T112.
- **AC:** AC-018
- **Rollback:** restore the paragraph and drop the amendment.
- **Stop if:** the validator fails.
- **Evidence:** see T112.

### [x] T112 — Re-verify from the final state

- **File:** none
- **Anchor:** the full advisor runtime run, `repair-derived.cjs --apply` and `validate.sh --strict`.
- **Change:** none.
- **Proof:**
  ```bash
  cd .skilled/skills/system-skill-advisor/runtime && npx vitest run
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict | tail -1
  ```
  Expected: no `FAIL` line, `RESULT: PASSED`
- **AC:** AC-018
- **Rollback:** n/a
- **Stop if:** any command fails.
- **Evidence:** full advisor run `Test Files  147 passed (147)` and `Tests  1225 passed | 8 skipped (1233)`, exit 0, no `FAIL` line (it was `1223 passed` before round 4). Validator result recorded in the final report.

<!-- /ANCHOR:phase-12 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-014)
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (T002: 412 files under sk-code on `origin/main`, both surface folders absent)
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

- [ ] CHK-020 [P0] All acceptance criteria met, or waived against a decision record (AC-035 under ADR-008)
- [ ] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested (outside-root, missing-target and file-target cases in the helper suite)
- [x] CHK-023 [P1] Error scenarios validated (untrusted and missing links leave every scan green)
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
- [x] CHK-031 [P0] Input validation implemented (realpath containment against the skills root and `SPECKIT_PRIVATE_SKILL_ROOTS`)
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
