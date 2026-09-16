---
title: "Tasks: Gate and CI Readiness"
description: "Ordered tasks with a named executor for each, from the phase 004 read and baselines through the two-root block, hook and workflow units, the independent check and the broken-move drill, plus the verification checklist."
trigger_phrases:
  - "gate readiness tasks"
  - "gate readiness verification checklist"
  - "hook and workflow unit tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Gate and CI Readiness

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

Every task names its executor in square brackets at the end. `DeepSeek` is DeepSeek V4.1 Flash as `llmgateway/deepseek-v4.1-flash` at `--thinking max` on cli-pi. `GPT-5.6` is `gpt-5.6-sol` at `xhigh` on cli-codex, read-only. `Orchestrator` is the session that owns this phase and verifies every return. Row IDs such as H09 and C04 point at the change list in `plan.md` §3.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read phase 004's frozen layout and record in `goal.md` what `.opencode/` keeps, the move's commit shape and the hook log root. Halt with a LOGIC-SYNC report if it contradicts this plan (`../004-migration-design/`) [Orchestrator]
- [x] T002 Re-open every line cited in plan §3 at the phase start commit and record any drift in `goal.md` (`.opencode/scripts/git-hooks/`, `.opencode/hooks/git/pre-commit`, `.opencode/bin/check-git-hooks.sh`, `.github/`) [Orchestrator]
- [x] T003 Record baselines: the six hook test scripts (126 cases at `728c4f3efc`), `bash -n` on each hook, the latest CI conclusion per workflow with the failing test or violation lines of every red workflow, and the median of ten no-op pre-commit runs [Orchestrator]
- [x] T004 Reproduce today's silent pass: in a disposable clone with `.opencode/` renamed to `.skilled/`, today's pre-commit with a staged `.skilled/agents/` file exits 0 with no gate output, and today's `comment-hygiene.yml` guard step exits 0 with its checker missing [Orchestrator]
- [x] T005 Read `cli-pi/SKILL.md` and `cli-codex/SKILL.md`, probe `llmgateway/deepseek-v4.1-flash` and `gpt-5.6-sol`, and record availability in `goal.md` [Orchestrator]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Two-root block and independent check
- T006 withdrawn by the L1 amendment (plan §AMENDMENT): Draft the canonical block with `source_root_resolve`, `source_root_toolchain`, `source_root_report` and the `export` mode (`.github/scripts/source-root.sh`) [DeepSeek]
- T007 withdrawn by the L1 amendment: Write the layout-matrix test and watch it fail against an empty stub before it passes (`.github/scripts/tests/source-root.test.sh`) [DeepSeek]
- T008 withdrawn by the L1 amendment: Review T006 and T007, and fix or answer every finding [GPT-5.6, then Orchestrator]
- [ ] T009 Draft the independent check with the five rules in plan §AMENDMENT (`.github/scripts/check-gate-inputs.sh`) [Orchestrator]
- [ ] T010 Write the check's fixture test: one failing case per rule and a whole-tree rename that passes (`.github/scripts/tests/check-gate-inputs.test.sh`) [DeepSeek]
- [ ] T011 Create the always-on workflow for the check and both tests (`.github/workflows/gate-inputs.yml`) [DeepSeek]
- [ ] T012 Review T009 to T011, and fix or answer every finding [GPT-5.6, then Orchestrator]

### Hooks, one section per brief with its test cases
- [x] T013 H04 and H05: agent filter and mirror pathspec twins (`.opencode/scripts/git-hooks/pre-commit:95`, `:125-145`) [DeepSeek]
- [ ] T014 H01 and H02: kill switch and comment hygiene (`pre-commit:17-28`, `:45-54`) [DeepSeek]
- [ ] T015 H03 and H06: agent mirror-sync checker and mirror parity scripts (`pre-commit:90-106`, `:167-191`) [DeepSeek]
- [ ] T016 H07 and H08: card-sync and mutation-class triggers and guards (`pre-commit:199-234`) [DeepSeek]
- [ ] T017 H09: route re-mint pathspecs, modules, runtime root and `--skill-root` (`pre-commit:253-410`) [DeepSeek]
- [ ] T018 H10: spec re-mint tool lookup (`pre-commit:503`) [DeepSeek]
- [ ] T019 H13, H14 and H16: skill detector, skill-gate path and routing-byte twins (`.opencode/scripts/git-hooks/pre-push:121`, `:208-231`, `:280-287`) [DeepSeek]
- [ ] T020 H11, H12 and H15: mass-deletion library, permission script and route guard (`pre-push:34-69`, `:136-139`, `:250-268`) [DeepSeek]
- [ ] T021 H17: allocator lookup and warning (`.opencode/scripts/git-hooks/prepare-commit-msg:39-50`) [DeepSeek]
- [ ] T022 H18 to H20: autostash library, kill switch, `git-sync.sh` and log root (`post-commit`, `post-merge`, `post-rewrite`, `lib/autostash-orphan-guard.sh`) [DeepSeek]
- [ ] T023 H21 and H22: legacy hygiene helper (`.opencode/hooks/git/pre-commit`) [DeepSeek]
- [ ] T024 H23 and H24: SessionStart hook check and its new test script (`.opencode/bin/check-git-hooks.sh`, `.opencode/bin/tests/check-git-hooks.test.sh`) [DeepSeek]
- [ ] T025 Review the rule diffs from T014 to T016, T018 and T020 to T024, and fix or answer every finding [GPT-5.6, then Orchestrator]
- [ ] T026 Describe the missing-script rule and the new cases (`.opencode/scripts/git-hooks/README.md`, `.opencode/scripts/git-hooks/tests/README.md`) [DeepSeek]

### CI, one workflow per brief
- [ ] T027 [P] C01: `.skilled/` twins for the 56 `paths:` entries, eight briefs (`chart-corpus.yml`, `diagram-corpus.yml`, `markdown-link-integrity.yml`, `repo-rules-corpus.yml`, `routing-registry-drift.yml`, `runtime-no-spec-import.yml`, `skill-doc-frontmatter.yml`, `spec-kit-check.yml`) [DeepSeek]
- [ ] T028 [P] C02 and C03: dependabot twin and agent name filter (`.github/dependabot.yml:13`, `.github/workflows/agent-mirror-sync.yml:29`) [DeepSeek]
- T029 withdrawn by the L1 amendment: C04: export step and `$SOURCE_ROOT` paths in all 21 jobs, nineteen briefs (`.github/workflows/*.yml`) [DeepSeek]
- [ ] T030 C05: fail-closed replacements for the six skip conditionals (`advisory-checks.yml`, `comment-hygiene.yml`, `markdown-link-integrity.yml`, `prompt-card-sync.yml`, `skill-doc-frontmatter.yml`) [Orchestrator]
- [ ] T031 Review T030, and fix or answer every finding [GPT-5.6, then Orchestrator]
- [ ] T032 Add the `gate-inputs.yml` row and the trigger notes (`.github/workflows/README.md`) [DeepSeek]

### Broken-move drill
- [ ] T033 Draft the drill with its four sections: moved and whole, moved and broken, pre-change control, foreign control (`.github/scripts/tests/broken-move-drill.sh`) [Orchestrator]
- [ ] T034 Review T033, and fix or answer every finding [GPT-5.6, then Orchestrator]

### Naming guard, a move keeps its name
- [ ] T045 Write the three REQ-012 cases in the guard's pytest suite and watch the first fail against today's guard (`.opencode/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py`) [DeepSeek]
- [ ] T046 Skip the destination basename of an `R` or `C` record when it equals the source basename, still checking every other destination component (`.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py`) [DeepSeek]
- [ ] T047 Review T045 and T046, and fix or answer every finding [GPT-5.6, then Orchestrator]
- [ ] T048 Run the suite with `-p no:cacheprovider`, then the guard with `--changed-since` on a rehearsal clone where `.opencode` is moved to `.skilled`, and read the `PASS:` line [Orchestrator]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T035 Run every hook test script and compare with the T003 baseline: every case passes and none was removed [Orchestrator]
- [ ] T036 Run `bash -n` on every changed shell file, and run `source-root.test.sh` under `/bin/bash` [Orchestrator]
- [ ] T037 Parse every workflow with `ruby -ryaml`, then run `bash .github/scripts/check-gate-inputs.sh` and its test, each ending in `RESULT: PASSED` [Orchestrator]
- [ ] T038 Run `bash .github/scripts/tests/broken-move-drill.sh`: `RESULT: PASSED`, with the pre-change control showing exit 0 and no gate output [Orchestrator]
- [ ] T039 Prove the foreign-repository allowance: in a scratch repository with no sentinel, every hook exits 0 with empty output [Orchestrator]
- [ ] T040 Run `check-comment-hygiene.sh` on every changed file and the naming guard with `--changed-since` the phase base, running its pytest suite with `-p no:cacheprovider` [Orchestrator]
- [ ] T041 Time the no-op pre-commit again and compare the median with T003 [Orchestrator]
- [ ] T042 Push the tip that carries this phase and read each workflow run's conclusion, `gate-inputs.yml` included [Orchestrator]
- [ ] T043 Write the phase 006 handoff list and the delegation summary (`implementation-summary.md`) [Orchestrator]
- [ ] T044 Mark each acceptance row with its evidence, then validate from the main checkout's toolchain until it prints `RESULT: PASSED` (`acceptance-criteria.md`) [Orchestrator]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The independent check and the drill both print `RESULT: PASSED` from the final state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
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

- [x] CHK-001 [P0] Phase 004's layout read, with what `.opencode/` keeps, the move's commit shape and the log root recorded in `goal.md`
- [x] CHK-002 [P0] Every line cited in plan §3 re-opened at the phase start commit
- [x] CHK-003 [P0] Baselines recorded: 126 hook test cases, CI conclusion and failure set per workflow, no-op pre-commit median
- [x] CHK-004 [P1] Today's silent pass reproduced in a renamed-tree clone before any change
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n` passes for every changed hook, library and script
- [ ] CHK-011 [P0] Every shell change runs under `/bin/bash` 3.2.57
- [ ] CHK-012 [P1] `check-comment-hygiene.sh` exits 0 or 2 for every changed file
- [ ] CHK-013 [P1] The naming guard passes with `--changed-since` the phase base, so every new file name is kebab-case
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] The six existing hook test scripts pass at or above 126 cases with none removed
- [ ] CHK-021 [P0] Each new test case was seen failing against the unchanged file before its change
- [ ] CHK-022 [P0] `check-gate-inputs.sh` and its test print `RESULT: PASSED` on the tip
- [ ] CHK-023 [P0] The drill prints `RESULT: PASSED`, and its pre-change control shows exit 0 with no gate output
- [ ] CHK-024 [P0] In a repository with no sentinel, every hook exits 0 with empty output
- [ ] CHK-025 [P1] Every workflow parses, and each run on the pushed tip was read by its conclusion
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every change row carries its class: the silent skip is `class-of-bug`, a gate that looks its script up at one root, and every instance appears in plan §3.
- [x] CHK-FIX-002 [P0] Same-class producer inventory rerun at the phase start: the `grep -n '\.opencode'` counts match plan §3 (43 lines in `pre-commit`, 19 in `pre-push`, 148 across the workflows) or the drift is recorded.
- [ ] CHK-FIX-003 [P0] Consumer inventory for the block complete: `grep -rn 'source_root_'` lists exactly the nine gate files, the check and the drill.
- [ ] CHK-FIX-004 [P0] The block's matrix test covers the adversarial cases: dangling `.opencode` link, a path present under both roots, a space in the path or root, a pattern character and neither root.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed in `goal.md` before completion is claimed: layout by script state by identity.
- [ ] CHK-FIX-006 [P1] Hostile environment variant executed: the hook test scripts pass when the caller has `GIT_DIR`, `GIT_INDEX_FILE` and a global `core.hooksPath` set.
- [ ] CHK-FIX-007 [P1] Evidence pinned to the unit commit SHAs logged in `goal.md`, not to a moving branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No gate gains a new bypass variable and no bypass name changes
- [ ] CHK-031 [P0] The block and the check only read, apart from the export step writing `SOURCE_ROOT` to `$GITHUB_ENV`
- [ ] CHK-032 [P1] `gate-inputs.yml` declares `contents: read` and no other permission
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria agree on counts and cited lines
- [ ] CHK-041 [P1] The git-hooks README, its tests README and the workflows README describe the missing-script rule, the new cases and `gate-inputs.yml`
- [ ] CHK-042 [P1] The phase 006 handoff list in `implementation-summary.md` names each script the gates call whose own root literal remains
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Disposable clones and drill output live in temporary directories outside the repository
- [ ] CHK-051 [P1] `scratch/` holds only the delegation record in `scratch/delegation/` before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 13 | 0/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not yet verified
<!-- /ANCHOR:summary -->

---
