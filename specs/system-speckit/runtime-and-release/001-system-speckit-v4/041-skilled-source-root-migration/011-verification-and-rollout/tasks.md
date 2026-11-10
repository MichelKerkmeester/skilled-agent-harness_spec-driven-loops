---
title: "Tasks: Phase 11: verification-and-rollout"
description: "Ordered tasks with a named executor each for verifying the .skilled migration, publishing it to skilled/v4.0.0.0 and main, reconciling the main checkout and cleaning up, plus the phase's verification checklist."
trigger_phrases:
  - "skilled verification tasks"
  - "skilled rollout checklist"
  - "skilled push tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: verification-and-rollout

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
| `[orchestrator]` | The Opus orchestrator session runs it and owns the verdict |
| `[deepseek-pi]` | DeepSeek V4.1 Flash max on cli-pi through the LLM Gateway, one read-only unit per brief, verified by the orchestrator |
| `[gpt-codex]` | GPT-5.6 Sol on cli-codex in a read-only sandbox, the second model family |
| `[operator]` | Only the operator can do it |

**Task Format**: `T### [executor] Description (file path or plan section)`

Procedures live in `plan.md`. `$W`, `$P`, `$PKT`, `$EV`, `TIP`, `BASE`, `OLD_V4` and `OLD_MAIN` are defined in plan §4.1 and §4.2.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Inputs from earlier phases
- [x] T001 [orchestrator] Confirm phase 010 validates `RESULT: PASSED` on its own strict run and every 010 acceptance row is `Met` (`../goal.md:46`)
- [x] T002 [orchestrator] Record phase 004's kept `.opencode/` set, reference allowlist, freeze policy for `specs/**`, retire list and rollback window (`$EV/design-inputs.md`)
- [x] T003 [orchestrator] Record phase 005's independent check: its command, its location outside the moved tree and its breakage classes (`../spec.md:120`, `../spec.md:144`)
- [x] T004 [orchestrator] Record phase 010's targets for the seven global hooks and the home-config paths, with its rollback (`../spec.md:149`)
- [x] T005 [orchestrator] Pre-flight all seven runtime CLIs, `gh auth status`, `rg --version` and the Hermes trust state (`hermes skills list` shows `local` rows), reading output text rather than exit codes

### Pin and baseline
- [x] T006 [orchestrator] Fetch, rebase and pin `TIP`, `BASE`, `OLD_V4` and `OLD_MAIN`. Move any upstream `.opencode/` additions in a rename-only commit (plan §4.2)
- [x] T007 [orchestrator] Unless phase 005 or 006 recorded them, capture pre-move baselines in a detached checkout at `BASE`: deep-loop suite file and test counts, spec-kit CLI counts, trigger-index `documents scanned` and skill-root `checked=13`
- [x] T008 [orchestrator] Snapshot `git status --porcelain`, delete every `.pytest_cache` under `.skilled/` and `.opencode/` and confirm the count is 0 (plan §5.2)
- [x] T009 [orchestrator] Write the push rollback and the pinned SHAs into the parent goal log before any push (plan §7, `../goal.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Runtime canary smoke tests
- [x] T010 [orchestrator] Confirm the canary files are clean, plant the tokens, regenerate the Hermes, Codex and Pi copies and record the realpath and pointer-stub census (plan §5.1)
- [x] T011 [orchestrator] Claude Code: skill, command and agent cells plus the negative control (plan §5.1)
- [x] T012 [orchestrator] Codex: skill and command cells, generated-agent proof and the negative control (plan §5.1)
- [x] T013 [orchestrator] Cursor: skill, command and agent cells plus the negative control (plan §5.1)
- [x] T014 [orchestrator] Devin: skill and agent cells, command-surface listing and the negative control (plan §5.1)
- [x] T015 [orchestrator] Pi: skill cell natively and then with `--skill`, command cell, generated-agent proof and the negative control (plan §5.1)
- [x] T016 [orchestrator] Hermes: skill, command and agent cells plus the negative control. If T005 found the worktree root untrusted, this waits on T017 (plan §5.1)
- [x] T017 [operator] Only when T005 found the worktree root untrusted: run `hermes skills trust` from the worktree root (`.hermes/SYNC.md:40`)
- [x] T018 [orchestrator] opencode: skill and command cells, the agent cell after the `opencode run --help` check and the `--pure` negative control (plan §5.1)
- [x] T019 [orchestrator] Restore the canary files from git, re-run the three generators and confirm `git status --porcelain` matches T008's snapshot (plan §5.1)

### Local gate matrix
- [x] T020 [orchestrator] Run G01 to G07 at `TIP` with one kebab-case log per gate, reading each affirmative marker (plan §5.2)
- [x] T021 [orchestrator] Run G08 to G13 at `TIP`, reading each affirmative marker (plan §5.2)
- [x] T022 [deepseek-pi] Triage each suite log into file counts, test counts and failing test ids, one unit per log. The orchestrator checks every number against the log's own summary line (plan DELEGATION)

### Tree shape, residue and independent check
- [x] T023 [orchestrator] Tree-shape census at `TIP` against the parent's authored-directory list and 004's kept set (plan §5.3)
- [x] T024 [deepseek-pi] Link and runtime-file census, one unit per runtime root. The orchestrator verifies every dangling count with `find -L` (plan DELEGATION)
- [x] T025 [orchestrator] Enumerate every `.opencode` hit with `git grep -a`, prove the pattern on a planted positive control in a clone and split the hits by area (plan §5.3)
- [x] T026 [deepseek-pi] Classify the hits, one unit per area, each returning a TSV with a cited basis per line (plan §5.3, DELEGATION)
- [x] T027 [orchestrator] Reconcile unit totals with the enumeration, run the deterministic reclassifier and open every `residue` row and every disagreement (plan §5.3)
- [x] T028 [orchestrator] Run phase 005's independent check on the control clone and on each mutant clone, then remove the clones (plan §5.4)

### Review and publish
- [x] T029 [gpt-codex] Read the evidence folder against AC-001 to AC-008 and return a verdict per row with `file:line` (plan DELEGATION)
- [x] T030 [orchestrator] Re-run the check behind every `unsupported` or `contradicted` row, then confirm `origin/skilled/v4.0.0.0` still equals `BASE`. If it moved, return to T006
- [x] T031 [orchestrator] Pairing precheck against `origin/skilled/v4.0.0.0`, push `TIP` to `skilled/v4.0.0.0` and read the hook output line by line (plan §4.3)
- [x] T032 [orchestrator] CI census on `skilled/v4.0.0.0`: expected against observed, every run watched to completion, logs read for markers and skip lines (plan §5.5)
- [x] T033 [orchestrator] Confirm `origin/main` is an ancestor of `TIP`, run the pairing precheck against `origin/main`, then push with `SPECKIT_ALLOW_REMOTE_PUSH=1` on that one command (plan §4.3)
- [x] T034 [orchestrator] CI census on `main` (plan §5.5)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Main checkout and machine
- [x] T035 [orchestrator] Step 5b: check that the primary checkout is clean and fast-forwardable, then `git merge --ff-only`. If it is not, stop and report the SHA and the sync commands (plan §4.4)
- [x] T036 [operator] Only when T035 stopped: decide what happens to the primary checkout's tracked changes, then run the reported sync command
- [x] T037 [orchestrator] Read-only machine proofs from the primary: all seven hook links resolve, the recorded home-config paths exist, the listing surfaces report `.skilled/` paths and G13 passes there (plan §4.4)

### Closure and cleanup
- [x] T038 [orchestrator] Validate all eleven phases on their own strict runs and record each first `RESULT:` line (plan §5.2 G13)
- [x] T039 [orchestrator] Write the evidence digest into `implementation-summary.md`, mark this phase's acceptance rows and goal, update the parent goal log and six criteria, set the phase 11 status in `../spec.md` and regenerate metadata with the repair command `validate.sh` prints
- [x] T040 [orchestrator] Remove `$EV`, every clone and every `.pytest_cache` in the worktree and the primary checkout, then confirm a count of 0 (plan §4.5)
- [x] T041 [orchestrator] Commit the closure documents with `git commit -- <paths>`, fast-forward both branches per plan §4.3, census CI for that SHA and repeat the Step 5b fast-forward. The census for this last push goes in the close-out report, because committing it would need another push
- [x] T042 [orchestrator] Worktree 055 preconditions: its branch is an ancestor of `origin/skilled/v4.0.0.0`, every untracked entry is resolved or handed to the operator and the rollback sentence is written (plan §4.5)
- [ ] T043 [operator] Approve retiring worktree 055
- [ ] T044 [orchestrator] `git worktree remove` without `--force`, confirm `git worktree list` no longer shows it and keep the branch ref (plan §4.5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, with operator tasks either done or marked not needed and the reason given
- [ ] No `[B]` blocked tasks remaining
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] The parent goal's six completion criteria are checked with receipts (`../goal.md:86-91`)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Phase Goal**: See `goal.md`
- **Parent Goal**: See `../goal.md`
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

- [x] CHK-001 [P0] Phase 010 validates `RESULT: PASSED` and its acceptance rows are all `Met`
- [x] CHK-002 [P0] Phase 004's kept set, allowlist and freeze policy are recorded before the residue scan starts
- [x] CHK-003 [P0] `TIP`, `BASE`, `OLD_V4`, `OLD_MAIN` and the pre-move suite baselines are recorded in the parent goal log
- [x] CHK-004 [P0] The push rollback is written before the first push
- [x] CHK-005 [P1] All seven runtime CLIs, `gh` and `rg` answer with real output, not an authentication error
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every forward fix touches only the failing surface and passes the gate that failed, re-run from the final state
- [x] CHK-011 [P0] No generated file is text-edited. Every derived artifact comes from its owning generator (`../goal.md:49`)
- [x] CHK-012 [P1] No code comment in a forward fix names a spec path, phase number or task id
- [x] CHK-013 [P1] Renames stay in rename-only commits (`../goal.md:49`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All 21 canary cells are recorded, each with its token result, negative control, realpath and consumption path
- [x] CHK-021 [P0] All 13 gates pass at `TIP`, each with its affirmative marker quoted in the evidence digest
- [x] CHK-022 [P0] The residue scan shows 0 residue files and finds its positive control. Its unit totals equal the enumerated total
- [x] CHK-023 [P0] The independent check passes its control clone and fails every mutant clone, naming the mutated path
- [x] CHK-024 [P0] The CI census on both branches shows expected equal to observed, every run `success` and 0 skip lines in the logs
- [x] CHK-025 [P1] Suite counts meet the recorded baselines, and every delta is named
- [x] CHK-026 [P0] The primary checkout carries `TIP` and all seven global hook links resolve from it
- [x] CHK-027 [P1] The GPT-5.6 review left no `contradicted` row, and every `unsupported` row was re-run
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each red gate gets a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`
- [x] CHK-FIX-002 [P0] A `class-of-bug` finding, such as a path still keyed on `.opencode`, gets a same-class search across the tree before its fix lands
- [x] CHK-FIX-003 [P0] Consumers of any changed path constant come from a search, not from memory
- [x] CHK-FIX-004 [P1] The matrix axes are stated before completion: 7 runtimes by 3 surfaces, 13 gates, 2 branches, 1 primary checkout
- [x] CHK-FIX-005 [P1] Evidence pins to the `TIP` SHA, never a branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret reaches an evidence log or a delegate brief. Home configs are probed for paths only
- [x] CHK-031 [P0] `SPECKIT_ALLOW_REMOTE_PUSH` and `SPECKIT_ALLOW_MASS_DELETION` appear only on the single push command they authorize
- [x] CHK-032 [P0] No force push and no history rewrite happens without the operator's explicit yes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, acceptance criteria and goal agree on REQ ids, gate ids and the pinned SHA
- [x] CHK-041 [P1] The parent goal log carries the push SHAs, the CI run URLs and the rollback
- [x] CHK-042 [P1] `implementation-summary.md` carries the evidence digest (commands, markers, counts and run URLs) before scratch is cleaned
- [x] CHK-043 [P2] The stale `skilled/v*` wildcard line in `.opencode/skills/sk-git/references/remote-branch-policy.md:38-39` is reported to the sk-git owner
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Raw logs, TSVs, query files and clones lived under `scratch/evidence/` only
- [x] CHK-051 [P1] `scratch/evidence/`, every clone and every `.pytest_cache` are removed, and a recount shows 0
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-17. Retiring worktree 055 (T043, T044) waits on the operator.
<!-- /ANCHOR:summary -->
