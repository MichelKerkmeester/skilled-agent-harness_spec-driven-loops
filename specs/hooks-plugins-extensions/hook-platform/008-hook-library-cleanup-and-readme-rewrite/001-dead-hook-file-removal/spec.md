---
title: "Feature Specification: Phase 1: dead-hook-file-removal"
description: "The hook library tracks a legacy git pre-commit folder that no installer links and a TypeScript flags facade that only its own test imports. This phase deletes both, removes the tests written to prove the legacy hook and repairs every caller, list and doc that names them."
trigger_phrases:
  - "dead hook file removal"
  - "phase 1 dead hook file removal"
  - "legacy git pre-commit removal"
  - "typescript hook flags facade removal"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 1: dead-hook-file-removal

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`.skilled/hooks/git/` holds a standalone pre-commit that this checkout does not install, and `.skilled/hooks/shared/hook-flags.ts` is a facade no adapter imports. This phase deletes those five tracked files, removes the test cases that exist only to prove the legacy hook and repairs the CI step, the gate-file list, the fixtures and the docs that name them. The proof is that `git ls-files` prints neither path, a repo-wide search finds no remaining reference outside `specs/` and changelogs, and every suite in the baseline passes with a count that differs only by the removed cases.

**Key Decisions**: Delete the legacy `git/` folder together with the tests written to prove it (operator decision, 2026-11-15), drop the `.ts` leg from three flags tests instead of keeping the facade for them

**Critical Dependencies**: The baseline captured in the worktree before the first edit

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/411-hook-library-cleanup` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-codex-hook-check-merge |
| **Handoff Criteria** | `git/` and `shared/hook-flags.ts` are gone, no file outside `specs/` and changelogs names them and every baseline suite passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Hook library cleanup, literal names and README rewrite specification.

**Scope Boundary**: Deletions and the repairs they force. This phase moves no folder, renames no file and rewrites no README beyond the lines that state a removed file exists.

**Dependencies**:
- The baseline run in the worktree at commit `a03f07436cf`, recorded in `plan.md`.
- The operator's decision of 2026-11-15 to delete `git/` with the tests that prove it.

**Deliverables**:
- Five tracked files deleted: the four in `.skilled/hooks/git/` and `.skilled/hooks/shared/hook-flags.ts`.
- Every caller, list, fixture and doc that named them repaired.
- Four pinned lists rebased: the durable directory manifest, the README verdict baseline, the trigger index and its corpus manifest.
- Five untracked stray paths removed from the main checkout.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A reader of `.skilled/hooks/` cannot tell which files are live. The `git/` folder ships an installer and a pre-commit, yet `.skilled/scripts/install-git-hooks.sh:45` links hooks only from `scripts/git-hooks`, and the folder's own README calls it legacy. The folder still costs maintenance: a CI step, an entry in the gate-file list, nine cases in `pre-commit.test.sh` and two in `broken-move-drill.sh` exist to prove it. `shared/hook-flags.ts` has the same problem on a smaller scale. `shared/README.md:45` says Pi and Claude `.ts` adapters use it, but every adapter imports `hook-flags.mjs` or `hook-flags.cjs`, and the only importer is `hook-flags.test.cjs`.

### Purpose
`.skilled/hooks/` holds no file that nothing installs or imports, and no test, list or doc still names one.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git ls-files .skilled/hooks/git .skilled/hooks/shared/hook-flags.ts
.skilled/hooks/git/README.md
.skilled/hooks/git/install-hooks.sh
.skilled/hooks/git/install-hooks.test.sh
.skilled/hooks/git/pre-commit
.skilled/hooks/shared/hook-flags.ts

$ rg -n --hidden -g '!specs/**' -g '!**/node_modules/**' 'hook-flags\.ts' . | rg -v 'README\.md'
./.skilled/hooks/shared/hook-flags.test.cjs:79:  const ts = await import("./hook-flags.ts");
./.skilled/hooks/shared/hook-flags.test.cjs:232:  const ts = await import("./hook-flags.ts");
./.skilled/hooks/shared/hook-flags.test.cjs:565:  const ts = await import("./hook-flags.ts");

$ rg -n 'HOOK_SOURCE_DIR=' .skilled/scripts/install-git-hooks.sh
45:HOOK_SOURCE_DIR="$SOURCE_ROOT/scripts/git-hooks"
```
Run in the worktree on 2026-11-15 at commit `a03f07436cf`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the four files in `.skilled/hooks/git/` and delete `.skilled/hooks/shared/hook-flags.ts`.
- Remove the test cases that run the legacy pre-commit: nine in `pre-commit.test.sh` and two in `broken-move-drill.sh`, plus the history lookup that feeds the drill.
- Remove `hooks/git/pre-commit` from the gate-file list in `check-gate-inputs.sh`, and point the seven fixture cases written against it at another listed gate file.
- Remove the installer test step from `opencode-plugin-tests.yml` and the two legacy entries from `source-root-selection.test.sh`.
- Drop the `.ts` leg from the three tests in `hook-flags.test.cjs` that import the facade.
- Correct each doc line that says a removed file exists, and rebase the four pinned lists that name the folder or its README.
- Remove five untracked stray paths under `.skilled/hooks/` on the main checkout.

### Out of Scope
- The `git-commit-hooks` concern and `SYSTEM_GIT_COMMIT_HOOKS_DISABLED` - the primary pre-commit in `scripts/git-hooks/` still reads them.
- `hook-flags.mjs`, `hook-flags.cjs` and `hook-flags.sh` - they are the live readers.
- A full rewrite of `.skilled/hooks/README.md` or `shared/README.md` - phase 4 owns it. This phase changes only the lines that name a removed file.
- `.skilled/skills/sk-code/sk-code-quality/changelog/v1.1.1.0.md` - a changelog records what was true at its release.
- References inside `specs/` - historical spec documents stay as written.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/git/README.md`, `install-hooks.sh`, `install-hooks.test.sh`, `pre-commit` | Delete | The legacy standalone pre-commit, its installer and its installer test. |
| `.skilled/hooks/shared/hook-flags.ts` | Delete | The typed facade over `hook-flags.cjs` that no adapter imports. |
| `.skilled/hooks/shared/hook-flags.test.cjs` | Modify | Remove the `ts` binding from the tests at lines 73, 228 and 562. |
| `.skilled/hooks/shared/README.md` | Modify | Lines 45, 60 and 78 name the facade. |
| `.skilled/hooks/README.md` | Modify | Lines 2, 3, 28, 116 to 119, 301 and 309 name the `git/` folder. |
| `.github/workflows/opencode-plugin-tests.yml` | Modify | Remove the "Run the hook installer test" step and the comment that names it. |
| `.github/scripts/check-gate-inputs.sh` | Modify | Remove `hooks/git/pre-commit` from `GATE_FILES` and the header line that lists the legacy helper. |
| `.github/scripts/tests/check-gate-inputs.test.sh` | Modify | Remove the entry from `GATES` and point cases 14 and 43 to 47 at another gate file. |
| `.github/scripts/tests/broken-move-drill.sh` | Modify | Remove the history lookup at line 57 and the two legacy cases at lines 143 and 332. |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modify | Remove the legacy helper section and its nine `run_legacy` cases. |
| `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh` | Modify | Remove `hooks/git/pre-commit` from `SELECTING` and `hooks/git/install-hooks.sh` from `SCANNED`. |
| `.skilled/scripts/git-hooks/lib/README.md` | Modify | Line 42 lists the legacy helper as a consumer of `bounded-git.sh`. |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | Line 104 lists the legacy pre-commit as a reader of the kill switch. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/comment-hygiene-opencode-plugin.md` | Modify | Lines 54 and 74 point at the legacy installer and pre-commit. |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md` | Modify | Line 276 describes the legacy pre-commit as a kept helper. |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modify | Line 144 carries the same sentence. |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modify | Regenerated with `test_readme_manifest.py --write`. |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modify | Regenerated with `test_readme_verdict_parity.py --write`. |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and the generator's fixture files | Modify | Regenerated with `generate-trigger-index.mjs`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `git ls-files .skilled/hooks/git .skilled/hooks/shared/hook-flags.ts` prints nothing. |
| REQ-002 | `rg -n --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' 'hooks/git($\|[^-a-z])\|hook-flags\.(ts\|\{[^}]*\bts\b)' .` prints nothing. |
| REQ-003 | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`, and `check-gate-inputs.test.sh`, `pre-commit.test.sh` and `source-root-selection.test.sh` each exit 0 with no failed case. |
| REQ-004 | The hook Vitest tree, the hook `node --test` suites and the OpenCode plugin tests report no failure that the baseline did not report, and `node --test .skilled/hooks/shared/hook-flags.test.cjs` reports 0 failed. |
| REQ-005 | `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` each print PASS. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `test_readme_manifest.py` and `test_readme_verdict_parity.py` exit 0, and `generate-trigger-index.mjs --check` exits 0. |
| REQ-007 | The primary pre-commit still honours the kill switch: the cases in `pre-commit.test.sh` that set `SYSTEM_GIT_COMMIT_HOOKS_DISABLED` remain and pass. |
| REQ-008 | The five stray paths on the main checkout no longer exist, and the one log among them has a backup. |
| REQ-009 | `implementation-summary.md` carries the one sentence the release note needs about the removed standalone pre-commit. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git ls-files .skilled/hooks/git .skilled/hooks/shared/hook-flags.ts | wc -l` prints 0. It prints 5 today.
- **SC-002**: The REQ-002 search prints no line.
- **SC-003**: Every suite in the `plan.md` baseline table passes from the final state, and each test count differs from the baseline only by the cases this phase removed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The baseline run in the worktree | Without it "no regressions" has no before | Capture it before the first edit and record the counts in `plan.md`. |
| Risk | An outside repository installed `.skilled/hooks/git/pre-commit` through `install-hooks.sh` | Med | The release note names the removal and the replacement, `.skilled/scripts/install-git-hooks.sh`. |
| Risk | A fixture case re-pointed at another gate file stops testing what it tested | Med | Keep each case's `expect` label and failure text shape, change only the file name, and run the whole test file. |
| Risk | The other session on main edits `ENV-REFERENCE.md` and the trigger index, both changed here | Low | Keep each edit to the named lines so a merge conflict stays small, and regenerate the index after the merge. |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A. The phase deletes files and test cases and adds no code path.

### Security
- **NFR-S01**: The comment-hygiene and agent mirror-sync gates stay enforced by `scripts/git-hooks/pre-commit`. `pre-commit.test.sh` proves it after the legacy cases are gone.

### Reliability
- **NFR-R01**: `check-gate-inputs.sh` still fails when a listed gate file is missing. The remaining `gate-files` cases in its test prove it.

---

## 8. EDGE CASES

- Empty input: a clone that never ran `install-hooks.sh` is unaffected, because the primary installer never linked the legacy file.
- Maximum input: N/A. The phase processes no variable-size input.
- Failure path: a checkout whose `.git/hooks/pre-commit` still links to `.skilled/hooks/git/pre-commit` gets a dangling link and git skips the hook silently. Rerunning `.skilled/scripts/install-git-hooks.sh` replaces it.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 21 changed or deleted, LOC: about 450 removed, Systems: hooks, CI scripts, git-hook tests, docs |
| Risk | 9/25 | Auth: N, API: N, Breaking: Y for an outside repo that installed the legacy pre-commit |
| Research | 4/20 | The caller inventory is done and recorded in `plan.md` |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 5/15 | Dependencies: the live session on main and the later phases |
| **Total** | **32/100** | **Level 3** |

The child scores below Level 3 alone. It carries Level 3 because `recommend-level.sh` scored the whole decomposition at 75/100 and the children were scaffolded at the parent's level.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | An outside repository loses the standalone pre-commit it installed | M | L | Release-note sentence naming the replacement installer. |
| R-002 | A re-pointed fixture case passes without testing the rule it names | M | L | Run each re-pointed case once with its trigger line removed and confirm it fails. |
| R-003 | A reference survives under a spelling the search misses, such as `.opencode/hooks/git` | M | M | The REQ-002 pattern matches the bare `hooks/git` segment, which covers both source roots. |
| R-004 | A pinned list is rebased while another README change is in flight and absorbs it | L | L | Diff each regenerated list and confirm only the `git/` rows changed. |

---

## 11. USER STORIES

### US-001: A reader finds only live hook files (Priority: P0)

**As a** maintainer reading `.skilled/hooks/`, **I want** every folder and file there to be installed or imported by something, **so that** I do not spend time learning a hook that never fires.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: CI stops maintaining a dead file (Priority: P1)

**As a** maintainer of the git-hook tests, **I want** no test, gate list or CI step to require the legacy pre-commit, **so that** a change to the primary hook does not need a matching change in a file nobody installs.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Which changelog file receives the release-note sentence? Decision: the operator chooses at commit time. This phase writes the sentence into `implementation-summary.md`.
- Does any other step in `opencode-plugin-tests.yml` need the git identity step that was added for the installer test? Decision: read the workflow during implementation and keep the step if another suite commits in a temporary repository.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---
