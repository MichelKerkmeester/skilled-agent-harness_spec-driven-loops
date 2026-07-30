---
title: "Tasks: Portability and False-Green Repair"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "portability repair tasks"
  - "errexit adoption tasks"
  - "false green repair tasks"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/004-portability-and-false-green-repair"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the task breakdown for portability and false-green repair"
    next_safe_action: "Run T001"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Portability and False-Green Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm every finding against HEAD before any edit. Four were verified by the synthesis author and must still reproduce: the 7 hardcoded checkout literals across four helpers; the advisor path being absent while the real file sits under the advisor's own package; `verify_alignment_drift.py --root .opencode/bin` returning FAIL with 3 `SH-STRICT-MODE` errors; the flowchart validator exiting 1 with no verdict on a synthetic no-box input. Three are unverified and must be reproduced or struck here: the `eval` of generated environment-derived assignments, the pre-push harness's missing errexit, and the MCP suites' machine-specific paths. Also re-check whether the MCP fixture path is moving under any in-flight spec reorganisation. **Assign the two unnamed `git-hooks/lib` shell strict-mode errors** (`autostash-orphan-guard.sh`, `memory-drift-marker.sh`) to this child or to child 003, by reading whether their omission is deliberate, and record the decision.
- [ ] T002 Capture the pre-change specification: for each of the three git-coordination scripts, run the injected-failure cases for fetch failure, rebase failure and fast-forward failure, and record the exit code and the resulting working-tree state. These nine recordings are what "unchanged semantics" will be measured against.
- [ ] T003 Build the per-command tolerance inventory for each of the three scripts: which commands may legitimately exit non-zero, what that exit signals, and which guard will express it. No flag is added before this inventory exists.
- [ ] T004 [P] Add the no-box regression fixture to the flowchart validator's test surface and demonstrate it failing — the fixture lands before the fix (`validate-flowchart.sh` test surface).
- [ ] T005 [P] Inventory every remaining hardcoded checkout root and every conditional skip beyond the named findings: `rg -n '/Users/'` over authored code, and `rg -n '\.skip\(|it\.skip|describe\.skip|skipIf'` over TypeScript. Record any instance outside this child's scope rather than silently leaving it.
- [ ] T006 Confirm child 003 excludes the three git-coordination scripts from its lane A, so the two children cannot collide on the same files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Portability lane

- [ ] T007 Replace the 7 hardcoded `/Users/…` literals across the four spec-kit audit helpers with location-derived or argument-derived roots, resolved canonically so a symlinked checkout cannot escape the intended tree.

### False-green lane

- [ ] T008 Repoint `test_dual_threshold.py` at the advisor's real package location and register it in that package's documented verification command — or retire it explicitly, if reading the test shows its assertions no longer describe real behaviour. Record which and why.
- [ ] T009 Repair the two MCP Vitest suites: move the fixtures in-tree, or replace the silent skip with an explicit loud failure whose message names the expected path and the reason. A skip is a failure for this child.
- [ ] T010 [P] Replace `eval "$(get_feature_paths)"` with a structured return, and update every caller found by the consumer inventory. Cover the new return shape with a test using a path containing a space.
- [ ] T011 [P] Make the flowchart validator emit a verdict on every input, including one with no box borders and one with zero lines. The regression fixture from T004 must go green.

### Shell lane

- [ ] T012 Convert each tolerated non-zero exit in `git-sync.sh` into an explicit guarded conditional, then add `-e`. Run the three injection cases and confirm exit code and tree state match the T002 recording exactly (`.opencode/bin/git-sync.sh`).
- [ ] T013 Same for `git-live-follow.sh`, with its own three injection cases (`.opencode/bin/git-live-follow.sh`).
- [ ] T014 Same for `worktree-status.sh`, with its own three injection cases (`.opencode/bin/worktree-status.sh`).
- [ ] T015 Adopt errexit in the pre-push test harness and confirm a deliberately failing case now fails the harness (`.opencode/scripts/git-hooks/tests/pre-push.test.sh`).
- [ ] T016 [B] Repair the two `git-hooks/lib` shell files if T001 assigned them here; otherwise record the hand-off to child 003.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Test happy path manually: create a `git worktree` at a temporary unrelated path, run each repaired helper from it, and diff the output against a run from the primary checkout. Repeat through a symlinked path.
- [ ] T018 Test edge cases: run all nine failure-injection cases and confirm each matches its T002 recording — same exit code, same working-tree state. Any divergence blocks the script.
- [ ] T019 Confirm zero skipped cases across the repaired Python test and both MCP suites; parse the runner output for skip counts rather than eyeballing it.
- [ ] T020 Run `python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/bin` and record the delta: baseline FAIL with 3 `SH-STRICT-MODE` errors, target PASS with 0.
- [ ] T021 Confirm `rg -n '/Users/'` over authored code returns no hardcoded checkout root inside this child's scope, and that anything outside scope is recorded rather than dropped.
- [ ] T022 Exercise the rollback: revert one shell-lane commit, re-run its three injection cases, and confirm they match the pre-change specification. A partially-guarded script is more dangerous than an unguarded one, so the revert path must be proven.
- [ ] T023 Update documentation: reconcile `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` and `implementation-summary.md` so no document contradicts another's completion state.
- [ ] T024 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and record exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Zero skips anywhere in this child's repaired suites
- [ ] All nine injection cases match their captured pre-change specification
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
