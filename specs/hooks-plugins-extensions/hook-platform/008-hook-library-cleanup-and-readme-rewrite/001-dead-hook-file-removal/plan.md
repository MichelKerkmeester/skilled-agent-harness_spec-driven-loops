---
title: "Implementation Plan: Phase 1: dead-hook-file-removal"
description: "Delete the legacy git pre-commit folder and the unused TypeScript flags facade, remove the test cases that prove the legacy hook, repair every caller and rebase the pinned lists. Proof is an empty reference search and the baseline suites passing from the final state."
trigger_phrases:
  - "dead hook file removal plan"
  - "legacy git pre-commit removal plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: dead-hook-file-removal

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Node.js (CommonJS and ESM), GitHub Actions YAML, Markdown, JSON |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, Vitest, bash test scripts, two Python README tests |

### Overview
Delete five tracked files: the four in `.skilled/hooks/git/` and `.skilled/hooks/shared/hook-flags.ts`. Then repair what named them, in this order: tests and gate lists first, CI second, docs third, pinned lists last. The phase is proven by an empty reference search and by every baseline suite passing from the final state.

### Baseline

Captured in the worktree on 2026-11-15 at commit `a03f07436cf`, before any edit outside this packet. The summary file is `../scratch/baseline/summary.txt`.

| Gate | Command | Baseline result |
|------|---------|-----------------|
| Hook Vitest tree | `.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts` | 9 files, 501 tests passed |
| Hook `node --test` suites | `node --test` over the 96 non-Vitest test files under `.skilled/hooks` and `.vibe/plugins/repo-guards/tests` | 1839 tests, 1838 pass, 1 fail |
| Flags test alone | `node --test .skilled/hooks/shared/hook-flags.test.cjs` | 31 tests, 31 pass |
| OpenCode plugin tests | `node --test '.opencode/plugins/tests/*.test.cjs'` | 591 pass, 0 fail |
| Pi extension tests | `npm --prefix .pi/extensions/<name> test` | `pi-cache-optimizer` 120 pass, `pi-fast-mode-w-subagent-support` 81 pass |
| Hook registrations | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` | PASS, 35-hook registry, 22 Pi extensions |
| Runtime mirrors | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` | PASS, 257 mirrors across 10 trees |
| Gate inputs | `bash .github/scripts/check-gate-inputs.sh` | `files=47`, `failures=0`, `RESULT: PASSED` |
| Gate inputs test | `bash .github/scripts/tests/check-gate-inputs.test.sh` | 61 passed, 0 failed |
| Primary pre-commit test | `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` | 163 passed, 0 failed |
| Source-root selection test | `bash .skilled/scripts/git-hooks/tests/source-root-selection.test.sh` | 60 passed, 0 failed |
| Legacy installer test | `bash .skilled/hooks/git/install-hooks.test.sh` | PASS 4 |
| README verdict parity | `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` | `baseline_files=1137`, `diff_entries=0`, PASS |
| README manifest | `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py` | `derived=922 frozen=922`, reproducible |
| Hook README structure | `validate_document.py` over 185 hook READMEs | 185 pass |
| Hook README voice | `hvr_scan.py` over 185 hook READMEs | 158 pass, 27 fail |

The one failing `node --test` case at baseline is "the Cursor preflight, MCP route and Task guards still answer a normal payload" in `.skilled/hooks/shared/hook-stdin-deadline.test.mjs`. It expects exit 2 and gets 0. It is outside this phase and is reported at close, not fixed here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. `spec.md` sections 2 and 3 name every file.
- [x] Success criteria measurable. Each one in `spec.md` section 5 is a command and its output.
- [x] Dependencies identified. The baseline table above is captured.

### Definition of Done
- [x] All acceptance criteria met
- [x] `git ls-files .skilled/hooks/git .skilled/hooks/shared/hook-flags.ts` prints nothing, and every gate in the baseline table passes with the counts `tasks.md` T025 states
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Delete and repair. No component is added.

### Key Components
- **`.skilled/hooks/git/`**: the legacy pre-commit, its installer and its installer test. Deleted.
- **`.skilled/hooks/shared/hook-flags.ts`**: a typed facade over `hook-flags.cjs`. Deleted. `hook-flags.mjs` is the facade every TypeScript adapter already imports.
- **`.github/scripts/check-gate-inputs.sh`**: iterates `GATE_FILES` and fails on a listed file that is missing (line 494). Its list loses one entry.
- **`.skilled/scripts/git-hooks/pre-commit`**: the primary pre-commit. Unchanged. It keeps the comment-hygiene and agent mirror-sync gates and the kill switch.

### Data Flow
`.skilled/scripts/install-git-hooks.sh` links each hook in `scripts/git-hooks/` into the directory `git rev-parse --git-path hooks` reports. A commit then runs `scripts/git-hooks/pre-commit`, which sources `hooks/shared/hook-flags.sh` and exits early when `git-commit-hooks` is disabled. None of that path passes through `hooks/git/`. `.opencode/hooks` is a symlink to `../.skilled/hooks`, so every test that names `.opencode/hooks/git/pre-commit` reads the same file this phase deletes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The inventory below comes from a repo-wide search for `hooks/git` and `hook-flags.ts` outside `specs/`, `node_modules` and changelog folders, with each code hit read in context.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.github/scripts/check-gate-inputs.sh:62-65` | `GATE_FILES` lists `hooks/git/pre-commit`. A missing listed file is `FAIL gate-files` (line 494). | Remove the entry and the header line that names the legacy helper. | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` with `files=46`. |
| `.github/scripts/tests/check-gate-inputs.test.sh:23` | `GATES` mirrors the list. `setup_fixture` creates a stub per entry. | Remove the entry. | The test file exits 0. |
| `check-gate-inputs.test.sh` cases 14 and 43 to 47 (lines 196, 441, 447, 453, 459, 470, 476) | Each appends a line to the fixture `hooks/git/pre-commit` and asserts on the file name and line number. They test path resolution, not the legacy hook. | Point each at the fixture `bin/check-git-hooks.sh` and update the file name in the expected text. | 61 passed, 0 failed, and each re-pointed case fails when its appended line is removed. |
| `.github/scripts/tests/broken-move-drill.sh:57,143-144,332` | Reads the legacy pre-commit from history, runs it after deleting the comment checker and compares it in a foreign repo. Runs locally, not in CI. | Remove the history lookup and both cases. | `bash -n` exits 0 and `rg -c 'hooks/git' .github/scripts/tests/broken-move-drill.sh` prints nothing. |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:529-533` and the `run_legacy` calls at 548, 559, 566, 572, 666, 690, 746, 1000 | A section headed "legacy hygiene helper" with nine calls and their assertions. | Remove the section, the helper function and all nine cases. | The file exits 0 and its pass count drops from 163 by the number of removed assertions. |
| `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh:20,22` | `SELECTING` lists `hooks/git/pre-commit` and `SCANNED` lists `hooks/git/install-hooks.sh`. No existence check guards either loop. | Remove both entries. | The file exits 0 with 0 failed. |
| `.github/workflows/opencode-plugin-tests.yml:143-144` and its header comment | Step "Run the hook installer test". | Remove the step and the comment clause. Keep the git identity step if another suite commits in a temporary repository. | `rg -n 'install-hooks' .github/workflows/opencode-plugin-tests.yml` prints nothing. |
| `.skilled/hooks/shared/hook-flags.test.cjs:73-82,228-235,562-616` | Three tests import `./hook-flags.ts` beside `hook-flags.mjs`. | Remove the `ts` binding and its assertions. Keep the `.mjs`, `.cjs` and shell legs. | `node --test .skilled/hooks/shared/hook-flags.test.cjs` reports 31 tests, 0 failed. |
| `.skilled/hooks/shared/README.md:45,60,78` and `.skilled/hooks/README.md:2,3,28,116-119,301,309` | Docs that say the facade or the folder exists. | Correct those lines only. Phase 4 rewrites both files. | The REQ-002 search prints nothing. |
| `ENV-REFERENCE.md:104`, `comment-hygiene-opencode-plugin.md:54,74`, `naming-and-commenting.md:276`, `sk-code-quality/SKILL.md:144`, `scripts/git-hooks/lib/README.md:42` | Docs that name the legacy pre-commit or installer. | State the current reader or installer, or drop the clause. | The REQ-002 search prints nothing. |
| `durable-directory-manifest.json:88`, `baseline-readme-verdicts.json:1256`, `trigger-index.json:158`, `corpus-manifest.json:178` | Pinned lists that name the folder or its README. | Regenerate with each list's own writer. | Both README tests exit 0 and `generate-trigger-index.mjs --check` exits 0. |
| `hook-registry.json` | No entry points under `hooks/git/`. | Not a consumer. | `rg -c 'hooks/git/' hook-registry.json` prints nothing, and both sync checks print PASS. |
| Every TypeScript adapter and OpenCode plugin | Import `hook-flags.mjs` or `hook-flags.cjs`. | Not a consumer of the `.ts` facade. | `rg -n --hidden -g '!specs/**' 'hook-flags\.ts' .` prints only the lines this phase edits. |

Required inventories:
- Same-class producers: `rg -n --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' 'hooks/git($|[^-a-z])' .`. The pattern excludes the seven `git-*` features, which are different folders.
- Consumers of changed symbols: `rg -n --hidden -g '!specs/**' -g '!**/node_modules/**' 'hook-flags\.ts|run_legacy|LEGACY=' .`.
- Matrix axes: two source-root spellings (`.skilled/hooks/git` and `.opencode/hooks/git`) by four file kinds (test, CI, doc, pinned list). Every cell has a row above.
- Algorithm invariant: N/A. No path, parser or resolver logic changes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads each test that names the legacy hook and confirms the baseline. Implementation deletes the five files, then repairs tests, gate lists, CI, docs and pinned lists in that order. Verification reruns the reference search and every gate in the baseline table from the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `hook-flags.test.cjs` after the `.ts` leg is gone | `node --test .skilled/hooks/shared/hook-flags.test.cjs` reports 0 failed |
| Integration | Gate inputs, the primary pre-commit, source-root selection, the hook suites and both sync checks | The commands in the baseline table, each compared with its baseline row |
| Manual | Negative control on each re-pointed fixture case | Remove the appended line once, confirm the case fails, restore it |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.skilled/node_modules` in the worktree | Internal | Green | The Vitest tree cannot run. |
| `python3` for the two README tests and their `--write` modes | External | Green | The pinned lists cannot be rebased. |
| `generate-trigger-index.mjs` accepting a bare run inside a linked worktree | Internal | Yellow | Its header says a bare run is refused in some linked setups. Fallback: pass `--repo-root` and `--out` as the header describes. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate in the baseline table fails for a reason other than a removed case and three fixes do not clear it, or the operator reverses the delete decision.
- **Procedure**: nothing in this phase is committed, so `git restore --staged --worktree -- .skilled .github` in the worktree brings back every tracked file, the five deleted ones included. The stray log removed from main is restored by copying it back from the session scratchpad backup.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The baseline table | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close, and phase 002 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐   ┌────────────────────┐   ┌──────────────┐   ┌──────────────┐
│ Delete five  │──►│ Tests, gate lists  │──►│ Pinned lists │──►│ Final gates  │
│ files        │   │ and CI             │   │ rebased      │   │              │
└──────┬───────┘   └────────────────────┘   └──────────────┘   └──────────────┘
       │                                           ▲
       │           ┌────────────────────┐          │
       └──────────►│ Doc lines          │──────────┘
                   └────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| File deletions | None | Five tracked files gone | Test repairs, doc lines |
| Test, gate-list and CI repairs | File deletions | Suites that no longer need the legacy hook | Final gates |
| Doc lines | File deletions | Docs that state current fact | Pinned lists |
| Pinned lists | Doc lines, file deletions | Rebased manifests and trigger index | Final gates |
| Final gates | All of the above | The evidence in `acceptance-criteria.md` | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Durations are assumptions, not measurements.

1. **Delete the five files and repair tests, gate lists and CI** - about 60 minutes - CRITICAL
2. **Rebase the pinned lists** - about 15 minutes - CRITICAL
3. **Rerun every baseline gate** - about 10 minutes, since the baseline run took under 5 - CRITICAL

**Total Critical Path**: about 85 minutes

**Parallel Opportunities**:
- The doc lines and the test repairs touch disjoint files and can run simultaneously
- The `hook-flags.ts` removal and the `git/` removal share no file and can run in either order
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Files gone | `git ls-files .skilled/hooks/git .skilled/hooks/shared/hook-flags.ts` prints nothing | Implementation |
| M2 | Callers repaired | The REQ-002 search prints nothing and the three bash test files exit 0 | Implementation |
| M3 | Gates green | Every row of the baseline table passes from the final state | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Delete the legacy pre-commit together with the tests that prove it

**Status**: Accepted

**Context**: The approved plan said to halt if a test exists to prove the legacy hook. Nine cases in `pre-commit.test.sh`, two in `broken-move-drill.sh` and one CI step do. No installer links the file.

**Decision**: The operator chose on 2026-11-15 to delete the folder and those tests.

**Consequences**:
- The primary pre-commit is the only hook that carries the comment-hygiene and mirror-sync gates, and its own cases keep covering them.
- An outside repository that installed the standalone pre-commit loses it. Mitigation: a release-note sentence names `.skilled/scripts/install-git-hooks.sh`.

**Alternatives Rejected**:
- Keep `git/` in place: it keeps eleven test cases, a gate-list entry and a CI step alive for a file nothing installs.

### ADR-002: Re-point the gate-input fixture cases instead of deleting them

**Status**: Accepted

**Context**: Cases 14 and 43 to 47 in `check-gate-inputs.test.sh` append a line to the fixture `hooks/git/pre-commit`. Their labels show they test how `check-gate-inputs.sh` resolves paths inside any gate file.

**Decision**: Write the same lines into the fixture `bin/check-git-hooks.sh`, which stays in `GATE_FILES` and is created by `setup_fixture` with one shebang line, so line numbers in the expected text do not move.

**Consequences**:
- The path-resolution rules keep their coverage.
- If `bin/check-git-hooks.sh` is scanned differently from a hook file, a case may need another target. Mitigation: T007 re-points the cases and T008 runs the negative control on one of them.

**Alternatives Rejected**:
- Delete the seven cases: it removes coverage of rules that are still live.

### ADR-003: Drop the TypeScript leg of three flags tests

**Status**: Accepted

**Context**: `hook-flags.ts` and `hook-flags.mjs` both re-export `hook-flags.cjs`. Three tests assert that the two facades agree. No adapter imports the `.ts` file.

**Decision**: Delete the facade and remove its binding from the three tests. The `.mjs`, `.cjs` and shell legs stay.

**Consequences**:
- One facade is left to keep in step with the implementation.
- A future adapter that wants typed imports has no ready file. Mitigation: none needed today, because every adapter imports `hook-flags.mjs`.

**Alternatives Rejected**:
- Keep the facade for the tests: the tests would then exist only to prove a file that exists only for the tests.

---
