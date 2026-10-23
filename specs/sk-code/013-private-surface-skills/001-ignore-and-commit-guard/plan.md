---
title: "Implementation Plan: Phase 1: ignore-and-commit-guard"
description: "Add four root local-* ignore rules, insert one blocking private-skill guard into the pre-commit hook just before the comment-hygiene gate, and prove both with seven harness cases and a throwaway-repository probe. Every construct is chosen for the bash 3.2 that runs the hook."
trigger_phrases:
  - "ignore and commit guard plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: ignore-and-commit-guard

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`/bin/bash` 3.2 on macOS, the shell that runs the hook), git plumbing, POSIX file rules |
| **Framework** | None; the repository's own pre-commit hook and its shell test harness |
| **Storage** | The git index (`git diff --cached`), the root `.gitignore`, `lib/gates.tsv` for gate registration |
| **Testing** | `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`, a self-contained shell harness that builds throwaway repositories |

### Overview
Two edits close the publish path and one test file proves them. The ignore rules make a `local-*` skill directory invisible to `git add`; the guard makes `git add -f` useless by refusing the staged path inside the hook. The harness gains seven cases so the guard's block, its printed repair, its coverage of all eight skill roots, its false-positive boundary and three adversarial index shapes stay true after the next edit to the hook. The phase is 116 added lines across three files and ships as one commit.

The earlier draft covered six roots and four cases. Both counts were short: `.codex` and `.cursor` are tracked runtime roots with no `skills/` child today (ADR-001), and a guard whose proof matrix omits a staged symlink or gitlink can pass while refusing neither.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The planning commit that ships the Level 3 upgrade of all five phases is on `main`, so the phase starts from a clean worktree
- [ ] Every anchor in T002 to T004 re-read at the phase base; the line numbers in `tasks.md` match the files
- [ ] `git check-ignore -v .skilled/skills/local-webflow/SKILL.md` exits 1 before the change, which is the failing baseline
- [ ] The installed hook's resolution is known (`bash .skilled/scripts/install-git-hooks.sh --status`); it is `SHADOWED` in this worktree, which is expected and does not block

### Definition of Done
- [ ] All fifteen acceptance criteria in `acceptance-criteria.md` are `Met`
- [ ] `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` exits 0 with `pre-commit gates: 131 passed, 0 failed`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks/acceptance criteria/decision record/goal)
- [ ] The phase ships as one commit pushed as `HEAD:main` (T025 and T026), and `git status --porcelain` is empty with HEAD equal to `origin/main` (T027)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered gate: the ignore rules are the default, the hook is the enforcement point, the harness is the proof. Each layer fails closed and each is independently observable.

### Key Components
- **Root `.gitignore` rules**: git's own ignore layer. Matches the `local-*` directory name itself, so everything under it is ignored, including a symlink (which git treats as a file, which is why no rule carries a trailing slash). Four rules cover the four roots that hold a real `skills/` directory or would hold one: `.skilled` and `.hermes` today, `.codex` and `.cursor` when their `skills/` child appears. The four runtime roots that symlink to `.skilled/skills` need no rule, because git cannot stage a path beneath a symlink.
- **Private-skill guard in `pre-commit`**: a pure-bash block that reads staged names from the index and exits non-zero on a match. It sits after the trust block and the shared kill switch and before the comment-hygiene gate, so it inherits documented behavior and introduces no new configuration. It covers all eight runtime roots by path name, whether or not a given root has a `skills/` child today.
- **`lib/gates.tsv`**: the registry the hook reads through `gate-config.sh` to decide which gates may be switched off. The guard is deliberately absent from it, so no git config key and no `SPECKIT_SKIP_*` variable can disable it.
- **`tests/pre-commit.test.sh`**: builds throwaway repositories with `core.hooksPath /dev/null` and runs the real hook file against them, so a case covers the block as written rather than a copy.

### Data Flow
`git add` consults `.gitignore` and skips the private path. `git add -f` bypasses that, so the path reaches the index. `git commit` runs the hook, which reads `git diff --cached --name-only -z --diff-filter=ACMR`, matches each name against the anchored pattern, prints the offending paths plus the `git rm --cached -r -- "$PRIVATE_PATH"` repair, and exits 1. The operator runs the printed command, the index no longer carries the path, and the next commit proceeds.

The pattern is one constant in the hook:

```bash
^\.(skilled|opencode|claude|pi|devin|hermes|codex|cursor)/skills/local-[^/]+(/|$)
```

`(/|$)` is load-bearing: a staged symlink named exactly `local-x` has no child path, so a pattern that required a trailing slash would let it through. The match is on the name, not the content, so a private skill copied to a tracked non-local name passes - ADR-003 records that limit and phase 5 compares blobs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.gitignore` (root) | Policy: the only ignore layer the commit path consults | update - four rules | `git check-ignore -v .skilled/skills/local-webflow/SKILL.md .hermes/skills/local-obsidian .codex/skills/local-probe .cursor/skills/local-probe` |
| `.skilled/scripts/git-hooks/pre-commit` | Producer: the live blocking gate | update - one block before the comment-hygiene gate | `bash -n` plus the harness |
| `.opencode/scripts` | Symlink to `../.skilled/scripts`, verified with `readlink` | unchanged - resolves to the edited file | `readlink .opencode/scripts` |
| `.opencode/skills`, `.claude/skills`, `.pi/skills`, `.devin/skills` | Symlinks to `../.skilled/skills` | unchanged - a path beneath a symlink cannot be staged, and the guard still matches the name | `readlink .opencode/skills .claude/skills .pi/skills .devin/skills` |
| `.codex/skills`, `.cursor/skills` | Absent in this checkout, though both roots are tracked | covered by a guard root and an ignore rule, inert until a `skills/` child appears | `ls -d .codex/skills .cursor/skills` fails today; AC-001 still proves the rule matches the path |
| `.skilled/scripts/git-hooks/lib/gates.tsv` | Gate registry read by `gate-config.sh` | unchanged - deliberate: no row means no bypass | `rg -c 'private' .skilled/scripts/git-hooks/lib/gates.tsv` is 0 |
| `.skilled/scripts/git-hooks/lib/gate-config.sh` | Consumer of `gates.tsv` | not a consumer of the guard | `rg -n gates.tsv .skilled/scripts/git-hooks/lib/gate-config.sh` |
| `.skilled/scripts/install-git-hooks.sh` | Installs hooks as symlinks (`ln -sf`), so an edit is live once installed | unchanged | `bash .skilled/scripts/install-git-hooks.sh --status` |
| `.opencode/hooks/git/pre-commit` | Legacy compatibility helper with two gates of its own | unchanged - the live hook is the enforcement point, and the helper's scope is the mirror and comment gates | `rg -c 'private-skill' .opencode/hooks/git/pre-commit` is 0 |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Consumer: runs the real hook against throwaway repositories | update - header line plus seven cases | harness exit 0 with `0 failed` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` `gitIgnoredPaths` | Consumer of committed `.gitignore` files; keeps `local-*` out of the tracked trigger index | unchanged - it reads the file this phase edits | `rg -n gitIgnoredPaths` and the 005 zero-hit check |

Required inventories:
- Same-class producers: `rg -n 'local-' .gitignore .skilled/scripts/git-hooks/` - after the change, the four rules, the guard and the harness cases are the only hits, so no second ignore layer needs the pattern.
- Consumers of changed symbols: `rg -n 'gate:private-skill|PRIVATE_SKILL_RE|PRIVATE_STAGED' .` - the hook and the harness only.
- Matrix axes: skill root (eight: `.skilled`, `.opencode`, `.claude`, `.pi`, `.devin`, `.hermes`, `.codex`, `.cursor`) x path shape (top-level skill dir, file nested inside it, `local-` name below the skill root) x index action (add, modify, rename, delete).
- Adversarial index shapes: a staged copy of a private skill under a non-local name (must pass), a staged symlink named `local-*` (must block), a staged gitlink named `local-*` (must block), a path with a space, non-ASCII bytes, a staged deletion (must pass), and a rename into the private path (must block).
- Algorithm invariant: a path is refused if and only if its first segment is a runtime root and the directory immediately below `skills/` starts with `local-`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:ai-exec -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
Before starting any task, verify:
1. [ ] The task's **Anchor** text is present in the named file, re-read now, not remembered from this plan
2. [ ] The previous task's **Proof** was read and matched its **Expected** value
3. [ ] The task's **AC** id exists in `acceptance-criteria.md`
4. [ ] No earlier task is marked `[B]` or left incomplete
5. [ ] `git status --porcelain` shows only files this phase owns

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Run T001 through T027 in order; a later task assumes every earlier one landed |
| TASK-SCOPE | One task changes one file or runs one command; never bundle two edits |
| TASK-VERIFY | Run the task's **Proof** and compare with **Expected** before starting the next task |
| TASK-STOP | An anchor that is missing after one re-read stops the phase; report the file and the anchor |
| TASK-NO-JUDGE | When an expectation and an observation differ, report the difference; never edit the expectation |
| TASK-AC | Record the observed output against the task's AC id before marking the task `[x]` |

### Status Reporting Format
After each task, append one line to the phase log in this shape, with the four
columns filled from the run just completed. The example is the line T006 produces
when its first proof prints `4`:

```
T006 | pass | AC-001, AC-002 | 4
```

A task that fails its proof reports `fail` and stops the phase. A phase that reaches
T027 reports the four values from T016, T020, T023 and T027 in that same order.

### Blocked Task Protocol
A task becomes `[B]` only when its **Stop if** condition holds. Write the task id, the
anchor or command that failed, and the observed output into `implementation-summary.md`,
then stop. Do not work around a blocked task by widening its scope, adding a bypass
variable, or editing an acceptance criterion. A blocked phase reports the block to the
operator instead of guessing.
<!-- /ANCHOR:ai-exec -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the task state and carries the literal edit for every step. The order
below is the order the proofs depend on; each step names the tasks that perform it and
the command that proves it.

### Step 0 - Capture the base and re-read the anchors (T001 to T005, read-only)

T001 writes `git rev-parse HEAD` to `scratch/phase-base.txt`, which every scope proof
reads. T002 to T004 re-read the three insertion anchors and stop the phase if any has
moved. T005 records that the installed hook is shadowed in this worktree.

Anchors, verified on disk when this plan was written:

- `.skilled/scripts/git-hooks/pre-commit` line 96 is exactly `# --- Comment hygiene gate (blocking) ---`.
- `.gitignore` lines 227 to 229 are the divider, `# Runtime state leaked into nested trees`, and the divider.
- `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` line 2 is the harness header sentence, line 929 opens the last existing case block (`# ── 67-73. doc-version bump`), and line 999 is `echo "pre-commit gates: $PASS passed, $FAIL failed"`.

Proof: T001 to T005 each carry their own, and all five are read before Step 1.

### Step 1 - Add the four ignore rules (T006)

File: `.gitignore`. Replace the three-line section header that introduces
`# Runtime state leaked into nested trees` with the new private-skills section followed
by that same header. The new section carries four patterns, none with a trailing slash.

Proof: `rg -c '^/\.(skilled|hermes|codex|cursor)/skills/local-\*$' .gitignore` prints `4`,
and `git check-ignore -v` names each rule for a path under each root.

### Step 2 - Insert the guard into the hook (T007)

File: `.skilled/scripts/git-hooks/pre-commit`. Insert the block immediately before the
comment-hygiene line, with one blank line between the block and that line, so the guard
runs first. T007 carries the literal text.

Constraints, all load-bearing:

- The pattern variable is used unquoted after `=~`; quoting it would turn the regex into a literal string.
- `${#PRIVATE_STAGED[@]}` on an empty array is safe under `set -u` on bash 3.2; verified on the shell that runs this hook.
- `--diff-filter=ACMR` excludes `D`, so the repair the guard prints does not itself block.
- No `SPECKIT_SKIP_*` read and no `lib/gates.tsv` row. Do not add either.

Proof: `bash -n` exits 0, the last non-blank line before the comment-hygiene gate is
`fi`, and the guard's line number is lower than the gate's.

### Step 3 - Describe the new coverage in the harness header (T008)

File: `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`. Extend the header sentence
so it names the private-skill guard.

Proof: `rg -c 'private-skill' .skilled/scripts/git-hooks/tests/pre-commit.test.sh` prints `1` before the cases land.

### Steps 4 to 10 - Seven harness cases (T009 to T015)

Each task inserts one case block immediately above the summary line, so each lands after
the previous one. The numbering continues the file's `# ── N.` style from 74:

| Case | What it pins | Expected exit code | Task |
|------|--------------|--------------------|------|
| 74 | A staged private skill is refused, and the refusal names the path and the repair | 1 | T009 |
| 75 | The printed repair leaves a committable index | 0 | T010 |
| 76 | Every one of the eight roots and a nested file are refused and named | 1 | T011 |
| 77 | A `local-` name below the skill root is committable, and the guard stays silent | 0 | T012 |
| 78 | A renamed copy of a private skill is committable: the guard matches names | 0 | T013 |
| 79 | A staged symlink named `local-*` is refused | 1 | T014 |
| 80 | A staged gitlink named `local-*` is refused | 1 | T015 |

Proof: each task runs the harness and greps its own label; the count for each label is `1`.

### Step 11 - Run the whole harness (T016)

Proof: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` exits 0 and its last
line reads `pre-commit gates: 131 passed, 0 failed`. The baseline before this phase is
`111 passed, 0 failed`; the seven cases add 20 passing checks. A single `FAIL` line is a
stop condition.

### Step 12 - Prove the guard outside the harness (T017)

Build a throwaway repository, stage a private path and run the real hook against it.
`HOOK` is captured before the `cd`, so the probe runs this checkout's hook rather than a
path inside the throwaway repository.

Proof: `rc=1` and the output contains `BLOCKED [gate:private-skill]`, the staged path and
`git rm --cached -r`. Before the guard exists the same probe prints `rc=0`, which is the
failing baseline.

### Step 13 - Prove the ignore rules against a symlink, then clean up (T018 and T019)

T018 creates `.skilled/skills/local-probe` as a symlink to the checkout and checks it.
T019 removes it and proves nothing is left. The slash-less pattern is the load-bearing
part: written with a trailing slash it matches a real directory but not a symlink, which
is why REQ-001 forbids the slash.

Proof: `git check-ignore -v` names `/.skilled/skills/local-*`, and after the removal
`git status --porcelain | rg -c 'local-probe' || echo 0` prints `0`, because a
zero-match `rg -c` prints nothing and exits 1 unless the guard turns it into an
explicit zero.

### Step 14 - Confirm the scope and the comment hygiene (T020)

Proof: the diff against `scratch/phase-base.txt` lists only the three code files outside
`specs/`, 26 added lines mention `local-`, and none of the added lines names a spec path,
a phase number or the packet id.

### Step 15 - Confirm the limits are recorded (T021)

Proof: the four `rg -c` counts on `spec.md` match `4`, `4`, `3` and `5`.

### Step 16 - Review round (T022)

The review runs through the `subagent` tool with agent `review` (agent `deep-review`
for a multi-dimension pass), read-only by instruction: the prompt says it edits no
file. The orchestrator captures `git status --porcelain` before and after and requires
the two to be identical. The reviewer reads the diff and the packet, at most two rounds.
Findings are recorded, repaired where they are in scope, and re-reviewed once. A finding
that would widen the scope is recorded and left to the phase that owns it. The reviewer
ends with `VERDICT: PASS` or names the unresolved finding.

### Step 17 - Final strict validation (T023)

Proof: `validate.sh --strict` prints `RESULT: PASSED` and exits 0. A
`SPEC_DOC_SUFFICIENCY` warning naming `implementation-summary.md` is expected before
implementation and does not fail the run.

### Step 18 - Clean, commit, push, confirm (T024 to T027)

T024 removes the scratch artifacts. T025 stages the thirteen files by name and commits.
T026 pushes `HEAD:main`. T027 confirms `git status --porcelain` is empty and HEAD equals
`origin/main`.

**Commit and push last.** Commit and push `HEAD:main` only after T016, T020, T022 and T023
have passed, in that order. Never commit before the reviewer and the strict validator have
both spoken, and never push anything except that single phase commit. After the push,
confirm `git status --porcelain` is empty and `git rev-parse HEAD` equals
`git rev-parse origin/main`; a dirty worktree at that point means a file was left
unstaged, and a differing SHA means the push did not land.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The guard's pattern against the path matrix: eight roots, nested file, `local-` below the root, staged deletion, staged symlink, staged gitlink, renamed copy | `tests/pre-commit.test.sh` cases 74-80 |
| Integration | The real hook file run against a throwaway repository, including the trust block and the kill switch it inherits | `tests/pre-commit.test.sh` fixtures, plus the T017 probe |
| Manual | The ignore rules against a real directory and a real symlink, then a clean `git status` | `git check-ignore -v`, `git status --porcelain` |
| Regression | The 111 checks the harness already carried, unchanged | `git diff` on the harness header and the summary line |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git diff --cached --name-only -z` support | External (git) | Green | The guard cannot read staged names; the phase stops rather than guessing a second read path |
| bash 3.2 semantics for empty arrays under `set -u` | Internal (runtime shell) | Green - verified on the shell that runs the hook | A bash 4-only idiom would break every commit; the plan pins the verified form |
| `.opencode/scripts` symlink to `../.skilled/scripts` | Internal | Green - verified with `readlink` | The harness would run a copy instead of the edited file, so a passing run would prove nothing |
| `lib/gates.tsv` unchanged | Internal (this phase) | Green | A row would create a bypass, contradicting REQ-003 |
| The planning commit for all five phases | Internal (packet) | Pending until the planning commit lands | A dirty worktree at phase start makes the scope proofs ambiguous, and T027 cannot reach a clean status |

### Upstream and downstream

- **Upstream**: none. This is the first phase; it depends only on the anchors and on the planning commit.
- **Downstream**: 002 depends on the ignore rules and the guard; 003 depends on 002; 004 depends on 001's ignore rules and 003's symlink-following scan; 005 depends on 004.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the guard blocks a path that is not a private skill, or the harness fails after a repair attempt, or a review round finds the guard cannot be made correct within this phase's scope.
- **Procedure**: the phase ships as one commit, pushed as `HEAD:main`. Revert that commit with `git revert --no-edit HEAD`; the three files return to their phase-base content. Per file, without a commit: `git checkout HEAD~1 -- .gitignore .skilled/scripts/git-hooks/pre-commit .skilled/scripts/git-hooks/tests/pre-commit.test.sh`.
- **Verify the rollback**: `git check-ignore -v .skilled/skills/local-webflow` exits 1 again, `rg -c 'gate:private-skill' .skilled/scripts/git-hooks/pre-commit` prints `0`, and `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` still passes, because the revert removes only the new cases.
- **Do not** delete anything under `.skilled/skills/local-*` or `.hermes/skills/local-*` as part of a phase 1 rollback. This phase creates no such path, and by the time it is reverted a later phase may own real private content there. Check first: `git status --porcelain --ignored | rg -c 'local-'` printing `0` means there is nothing to protect.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (ignore rules + guard) ──► Phase 2 (hub removal) ──► Phase 3 (advisor vocabulary)
                                          │                            │
                                          └──────────────► Phase 4 (private skills) ──► Phase 5 (verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001-ignore-and-commit-guard | None | 002, 003, 004, 005 |
| 002-hub-surface-removal | 001 | 003 |
| 003-advisor-vocabulary-cleanup | 002 | 004 |
| 004-private-local-skills | 001 (ignore rules) and 003 (scan follows a symlink) | 005 |
| 005-leak-and-routing-verification | 004 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (capture the base, re-read anchors, confirm the installed hook) | Low | 15 minutes |
| Core Implementation (four rules, one guard block, seven cases) | Medium | 2-3 hours |
| Verification (harness, two probes, scope check, review round, validation, commit) | Medium | 2-3 hours |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (not applicable: no data changes; `scratch/phase-base.txt` names the restore point)
- [ ] Feature flag configured (not applicable: the guard has no bypass by design)
- [ ] Monitoring alerts set (the harness and the two probes are the signal)

### Rollback Procedure
1. Identify the phase commit: `git log --oneline -1 -- .skilled/scripts/git-hooks/pre-commit`.
2. Revert it: `git revert --no-edit HEAD`, or restore the three files from the phase base as in section 7.
3. Verify: `git check-ignore -v .skilled/skills/local-webflow` exits 1 and the harness passes.
4. Tell the next phase: 002 must not start until the ignore rules are back, because it removes the hub surfaces whose replacement lives at the ignored path.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. No private file exists yet, so a revert publishes nothing; the history limit (D7) is unchanged by a revert.
<!-- /ANCHOR:enhanced-rollback -->

---


<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
      ┌──────────────────────┐
      │ T001 phase base SHA  │
      └──────────┬───────────┘
                 │
      ┌──────────▼───────────┐        ┌──────────────────────┐
      │ T006 .gitignore      │        │ T007 guard in hook   │
      │ four rules           │        │ eight roots          │
      └──────────┬───────────┘        └──────────┬───────────┘
                 │                               │
                 │                    ┌──────────▼───────────┐
                 │                    │ T008 header + T009-  │
                 │                    │ T015 seven cases     │
                 │                    └──────────┬───────────┘
                 │                               │
      ┌──────────▼───────────────────────────────▼───────────┐
      │ T016 harness · T017 probe · T018/T019 symlink        │
      └──────────────────────────┬───────────────────────────┘
                                 │
      ┌──────────────────────────▼───────────────────────────┐
      │ T020 scope · T021 limits · T022 review · T023 strict │
      └──────────────────────────┬───────────────────────────┘
                                 │
      ┌──────────────────────────▼───────────────────────────┐
      │ T024 clean · T025 commit · T026 push · T027 confirm  │
      └──────────────────────────────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase base SHA (T001) | None | `scratch/phase-base.txt` | T006, T007, T008, T020, T024 |
| Ignore rules (T006) | T001 | Four `.gitignore` rules | T018, T019, phases 002 and 004 |
| Guard block (T007) | T001 | One blocking gate in the hook | T009 to T015, phases 002 through 005 |
| Harness cases (T008 to T015) | T007 | Seven cases, 20 passing checks | T016 |
| Probes (T017 to T019) | T006, T007 | Two independent proofs | T020 |
| Review and validation (T022, T023) | T016, T020, T021 | `VERDICT: PASS`, `RESULT: PASSED` | T025 |
| Delivery (T024 to T027) | T023 | One pushed commit | Phase 002 |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001 to T005 - setup** - 15 minutes - CRITICAL, because every anchor and every scope proof depends on the captured base
2. **T006 and T007 - the two edits** - 1 to 2 hours - CRITICAL, because no case can pass before the guard exists
3. **T009 to T015 - seven cases** - 1 hour - CRITICAL, because the harness is the only proof that survives the next edit to the hook
4. **T016 to T019 - harness and probes** - 30 minutes - CRITICAL, because these are the observed results the packet closes on
5. **T022 and T023 - review and strict validation** - 45 minutes - CRITICAL, because the commit is barred until both pass
6. **T025 and T026 - commit and push** - 10 minutes - CRITICAL, because phase 002 cannot start until the rules are on `main`

**Total Critical Path**: 4 to 6 hours

**Parallel Opportunities**:
- None inside the phase. The two edits touch different files, but the harness cases depend on the guard, so running T006 and T007 in parallel buys minutes and risks a half-applied state.
- Phase 002's planning can proceed while this phase executes, but its implementation cannot start until T026 lands.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | T001 to T005 pass, and the phase base SHA is recorded | Phase start + 15 minutes |
| M2 | Both edits landed | T006 and T007 pass their proofs, and `bash -n` exits 0 | Phase start + 2 hours |
| M3 | Harness complete | T016 prints `pre-commit gates: 131 passed, 0 failed` | Phase start + 3 hours |
| M4 | Probes complete | T017 prints `rc=1`, T019 prints `0` | Phase start + 3.5 hours |
| M5 | Review and validation | T022 reports `VERDICT: PASS`, T023 prints `RESULT: PASSED` | Phase start + 4.5 hours |
| M6 | Delivered | T026 pushed, T027 prints both confirmation lines | Phase start + 5 hours |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

The full records, with alternatives, consequences and the five checks, live in
`decision-record.md`. This table is the index a reader uses to find the one that governs
a question.

| ADR | Decision | Status | Governs |
|-----|----------|--------|---------|
| ADR-001 | Guard eight skill roots, adding `.codex` and `.cursor` to the six the earlier draft named | Accepted | The pattern constant, the ignore rules and the T011 matrix |
| ADR-002 | Enforce with a blocking hook that has no bypass variable and no `lib/gates.tsv` row | Accepted | T007, AC-007 and the `--no-verify` limit |
| ADR-003 | Match the staged path name, not the content, and record the renamed-copy limit | Accepted | T013, AC-011 and the phase 5 blob comparison |
| ADR-004 | Keep the guard pure bash, NUL-separated and bash 3.2 compatible | Accepted | The loop shape in T007 and NFR-S02 |
| ADR-005 | Accept the absence of a recurring pre-push surface-token guard | Accepted | The maintenance limit in `spec.md` section 6 |

---
