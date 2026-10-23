---
title: "Tasks: Phase 1: ignore-and-commit-guard"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "ignore and commit guard tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: ignore-and-commit-guard

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Every task names its file, its anchor, the exact edit, the writer branch and the command that proves it. A writer that finds the anchor text missing stops and reports; it does not guess a line number. Branch names come from the parent packet's process rules: `deepseekpi` for code changes, `deepseekpihigh` for docs-only changes.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author the four packet documents at planning time (specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/)
  - **File**: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`
  - **Anchor**: the scaffolded headings and anchors, kept in place
  - **Edit**: replace placeholder text with the real problem, scope, requirements, steps, tasks and criteria
  - **Branch**: `deepseekpihigh`
  - **Proof**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard --strict` prints `RESULT: PASSED`

- [ ] T002 Re-read the three implementation anchors (read-only, no file change)
  - **File**: `.skilled/scripts/git-hooks/pre-commit`, `.gitignore`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor**: `pre-commit` line 96 must be exactly `# --- Comment hygiene gate (blocking) ---`; read `.gitignore` and locate `# Runtime state leaked into nested trees`; read the test file and locate `echo "pre-commit gates: $PASS passed, $FAIL failed"`
  - **Edit**: none. Report and stop if any anchor differs, because the plan's insertion points depend on them
  - **Branch**: `deepseekpi`
  - **Proof**: `awk 'NR==96' .skilled/scripts/git-hooks/pre-commit` prints the comment-hygiene line; `grep -c '# Runtime state leaked into nested trees' .gitignore` prints `1`; `grep -c 'pre-commit gates: \$PASS passed' .skilled/scripts/git-hooks/tests/pre-commit.test.sh` prints `1`

- [ ] T003 Record how the installed hook resolves in this worktree (read-only, no file change)
  - **File**: `.skilled/scripts/install-git-hooks.sh` (invoked, not edited)
  - **Anchor**: none; this is a status call
  - **Edit**: none. Note whether the `pre-commit` entry reports `SHADOWED`, which means the global hook resolves to another checkout and a commit made here would not exercise the edit
  - **Branch**: `deepseekpi`
  - **Proof**: `bash .skilled/scripts/install-git-hooks.sh --status` prints a `pre-commit` entry with its `installed:` and `source:` lines
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the two private-skill ignore rules (.gitignore)
  - **File**: `.gitignore`
  - **Anchor**: read the file and locate the section header `# Runtime state leaked into nested trees`; insert immediately before it
  - **Edit**: insert a commented section titled `# Private skills (operator-local only)` followed by exactly two patterns, `/.skilled/skills/local-*` and `/.hermes/skills/local-*`, each with no trailing slash, and a comment saying why the slash is omitted (git treats a symlink as a file)
  - **Branch**: `deepseekpi`
  - **Proof**: `git check-ignore -v .skilled/skills/local-webflow/SKILL.md .hermes/skills/local-obsidian` prints two lines, each naming `.gitignore` and its rule, and exits 0; the same command exited 1 before the edit

- [ ] T005 Insert the blocking private-skill guard (.skilled/scripts/git-hooks/pre-commit)
  - **File**: `.skilled/scripts/git-hooks/pre-commit`
  - **Anchor**: line 96, exactly `# --- Comment hygiene gate (blocking) ---`; insert immediately before that line, one blank line after the inserted block
  - **Edit**: the `# --- Private skill guard (blocking) ---` block exactly as written in `plan.md` Step 2: the pattern `^\.(skilled|opencode|claude|pi|devin|hermes)/skills/local-[^/]+(/|$)`, a `while IFS= read -r -d ''` loop over `git diff --cached --name-only -z --diff-filter=ACMR`, an array length check, the `BLOCKED [gate:private-skill]` message naming each path and `git rm --cached -r -- "<path>"`, then `exit 1`. No `SPECKIT_SKIP_*` variable and no `lib/gates.tsv` row
  - **Branch**: `deepseekpi`
  - **Proof**: `bash -n .skilled/scripts/git-hooks/pre-commit` exits 0, and `awk '/Comment hygiene gate \(blocking\)/{print last; exit} NF{last=$0}' .skilled/scripts/git-hooks/pre-commit` prints `fi`, the guard's closing line (the proof reads the last non-blank line, because the required blank line sits between the block and the comment)

- [ ] T006 Name the guard in the harness header (.skilled/scripts/git-hooks/tests/pre-commit.test.sh)
  - **File**: `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor**: read the file and locate the header comment that begins `# Test harness for the pre-commit hook's two auto re-mint gates`
  - **Edit**: extend that sentence so it also says the harness covers the private-skill guard; leave the surrounding comment lines unchanged
  - **Branch**: `deepseekpi`
  - **Proof**: `grep -c 'private-skill' .skilled/scripts/git-hooks/tests/pre-commit.test.sh` prints at least `1`

- [ ] T007 Add harness case 74: a staged private skill is refused (.skilled/scripts/git-hooks/tests/pre-commit.test.sh)
  - **File**: `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor**: read the file and locate `echo "pre-commit gates: $PASS passed, $FAIL failed"`; insert above it, after the last existing block `# ── 67-73. doc-version bump`
  - **Edit**: case `# ── 74.` exactly as written in `plan.md` Step 4, using `setup_gate_fixture`, `stage_new` and `check`
  - **Branch**: `deepseekpi`
  - **Proof**: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh 2>&1 | grep -c '^PASS  a staged private skill is refused'` prints `1`

- [ ] T008 Add harness case 75: the printed repair clears the block (.skilled/scripts/git-hooks/tests/pre-commit.test.sh)
  - **File**: `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor**: the same insertion point, immediately after case 74
  - **Edit**: case `# ── 75.` exactly as written in `plan.md` Step 5: stage the private path, run `git -C "$TMP" rm --cached -r -q -- <path>`, then assert the hook exits 0
  - **Branch**: `deepseekpi`
  - **Proof**: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh 2>&1 | grep -c '^PASS  the printed repair clears the block'` prints `1`

- [ ] T009 Add harness case 76: every skill root and a nested private file are refused (.skilled/scripts/git-hooks/tests/pre-commit.test.sh)
  - **File**: `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor**: the same insertion point, immediately after case 75
  - **Edit**: case `# ── 76.` exactly as written in `plan.md` Step 6: loop the six roots `.skilled`, `.opencode`, `.claude`, `.pi`, `.devin`, `.hermes`, stage `<root>/skills/local-probe/SKILL.md` for each, also stage `.skilled/skills/local-probe/references/deep.md`, then assert the log names every path
  - **Branch**: `deepseekpi`
  - **Proof**: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh 2>&1 | grep -c 'the refusal names'` prints at least `7`

- [ ] T010 Add harness case 77: a `local-` name below the skill root does not block (.skilled/scripts/git-hooks/tests/pre-commit.test.sh)
  - **File**: `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`
  - **Anchor**: the same insertion point, immediately after case 76
  - **Edit**: case `# ── 77.` exactly as written in `plan.md` Step 7: stage `.skilled/skills/sk-code/local-notes.md`, assert exit 0, and assert the guard never spoke
  - **Branch**: `deepseekpi`
  - **Proof**: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh 2>&1 | grep -c '^PASS  a local- file below the skill root is committable'` prints `1`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run the whole harness and read the summary line
  - **File**: `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` (executed, not edited)
  - **Anchor**: the final line `pre-commit gates: <N> passed, <M> failed`
  - **Edit**: none. A single `FAIL` line is a stop condition; fix the guard, not the expectation
  - **Branch**: `deepseekpi`
  - **Proof**: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` exits 0 and the last line reads `pre-commit gates: <N> passed, 0 failed`, with `<N>` larger than the count before this phase

- [ ] T012 Prove the guard in a throwaway repository (no file in this checkout changes)
  - **File**: none; the probe builds a temporary repository under `mktemp -d`
  - **Anchor**: none
  - **Edit**: none. Run the probe exactly as written in `plan.md` Step 9 and delete the temporary repository afterwards
  - **Branch**: `deepseekpi`
  - **Proof**: the probe prints `rc=1` and its output contains `BLOCKED [gate:private-skill]` and `.skilled/skills/local-probe/SKILL.md`

- [ ] T013 Prove the ignore rules match a symlink, then clean the probe up (.gitignore)
  - **File**: `.gitignore` (read by git); the probe creates and removes `.skilled/skills/local-probe`
  - **Anchor**: the two rules added in T004
  - **Edit**: none. `rm -f .skilled/skills/local-probe` first, then `ln -s "$PWD" .skilled/skills/local-probe`, check, then `rm .skilled/skills/local-probe` in the same command sequence so no probe survives
  - **Branch**: `deepseekpi`
  - **Proof**: `git check-ignore -v .skilled/skills/local-probe` names `/.skilled/skills/local-*`, and afterwards `git status --porcelain | grep -c local-probe` prints `0`

- [ ] T014 Confirm the scope and the comment hygiene of the diff (all three files)
  - **File**: the three changed files, read through `git diff`
  - **Anchor**: base commit `42b41dd286`
  - **Edit**: none. Any file outside the three, or any added comment naming a spec path, packet number or phase number, is removed rather than justified
  - **Branch**: `deepseekpi`
  - **Proof**: `git diff --name-only 42b41dd286` lists only `.gitignore`, `.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` and this packet's documents; `git diff 42b41dd286 -- .gitignore .skilled/scripts/git-hooks/ | grep '^+' | grep -c -E 'specs/|phase [0-9]|013-private'` prints `0`

- [ ] T015 Reviewer round: a separate read-only DeepSeek session reads the diff and the packet, at most two rounds
  - **File**: the three changed files and this packet's four documents
  - **Anchor**: none
  - **Edit**: none by the reviewer. Findings come back as text; the writer repairs in-scope findings and the reviewer re-reads once. A finding that would widen the scope is recorded in `implementation-summary.md` and left to the phase that owns it
  - **Branch**: `deepseekpi` (reviewer session is read-only)
  - **Proof**: the reviewer's report names no unresolved in-scope finding after the second round, or names the ones deferred with the phase that owns them

- [ ] T016 Final validation
  - **File**: this packet
  - **Anchor**: none
  - **Edit**: none. Fix the documents until the command prints `RESULT: PASSED`; never edit the validator
  - **Branch**: `deepseekpihigh`
  - **Proof**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard --strict` prints `RESULT: PASSED`

- [ ] T017 Commit the phase and push it to main
  - **File**: `.gitignore`, `.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` and this packet's four documents
  - **Anchor**: none; this is the phase's single commit, the one section 7 of `plan.md` reverts
  - **Edit**: stage the files by name (never `git add -A`), commit with a conventional subject plus a prose body that names the ignore rules and the guard, then push `HEAD:main`. Do not create a branch, and do not push anything else
  - **Branch**: `deepseekpi`
  - **Proof**: `git log --oneline -1` shows the phase commit, `git status --porcelain` prints nothing, and `git log --oneline -1 origin/main` is that same commit after the push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: T011, T012 and T013 each read, not assumed
- [ ] T017 pushed: the phase commit is the tip of `origin/main`, so phase 002's "landed on main" dependency holds
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-010 [P0] `bash -n .skilled/scripts/git-hooks/pre-commit` and `bash -n .skilled/scripts/git-hooks/tests/pre-commit.test.sh` both exit 0
- [ ] CHK-011 [P0] The guard runs before the comment-hygiene gate and after the trust and kill-switch blocks
- [ ] CHK-012 [P1] The guard starts no `node` and no `python3`
- [ ] CHK-013 [P1] Code follows the hook's existing style: uppercase globals, `IFS= read -r -d ''`, `BLOCKED [gate:<name>]` message shape
- [ ] CHK-014 [P0] The guard carries no bypass variable and no `lib/gates.tsv` row
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete: the throwaway-repository probe and the symlink probe both run and are read
- [ ] CHK-022 [P1] Edge cases tested: nested private file, `local-` below the skill root, staged deletion, all six skill roots
- [ ] CHK-023 [P1] Error scenarios validated: a refusal names its path and its repair
- [ ] CHK-024 [P0] The harness exits 0 with `0 failed`, and the existing cases were not edited
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep: `rg -n 'local-' .gitignore .skilled/scripts/git-hooks/`
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the changed pattern and message: `rg -n 'gate:private-skill|PRIVATE_SKILL_RE|PRIVATE_STAGED' .`
- [ ] CHK-FIX-004 [P0] Path fixes include adversarial table tests for a space in the name, non-ASCII bytes, a staged deletion, a rename into the private path, and a `local-` name below the skill root
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed: six skill roots x three path shapes x four index actions
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state: the probe runs with no `skilled.trustRepoHooks` and an untrusted `SOURCE_ROOT`
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets, and no private content is read or written by this phase
- [ ] CHK-031 [P0] Input validation implemented: the staged path is matched against an anchored pattern, never interpreted
- [ ] CHK-032 [P1] The guard fails closed when it cannot read the staged names
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments explain the durable why and name no spec path, packet number or phase number
- [ ] CHK-042 [P2] README updated (not applicable: the hook's header and the harness header already describe their own gates)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion, and the two probes left nothing in the checkout
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | [ ]/14 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---

