---
title: "Tasks: Phase 12: review-agent-gates"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review agent gates tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: review-agent-gates

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `R` is `.skilled/agents/review.md`. `RC` is `.claude/agents/review.md`. `S` is `.skilled/skills/sk-code/sk-code-review/scripts`. `F` is `S/tests/fixtures/review-output`. `scratch/` is this folder's `scratch/`. The step 7 command is the one in `plan.md` section 8.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the fast-path budget and the self-score rule phase 6 shipped (`../006-shared-agent-contract/implementation-summary.md`). Verify: `rg -c 'YOUR_VALUE_HERE[:]' ../006-shared-agent-contract/implementation-summary.md` exits 1, and the rule's anchor text is copied to `scratch/baseline.txt`.
- [x] T002 Re-run every Measured Behavior command in `spec.md` on the tree that holds phase 6, and save the output (`scratch/baseline.txt`). Verify: `rg -c '^\$ ' scratch/baseline.txt` prints 17 or more, and each line the build edits is still found by its quoted text.
- [x] T003 Run the checker test suite as a guard baseline (`S/tests/check-rule-copies.test.sh`). Verify: `bash S/tests/check-rule-copies.test.sh` exits 0, and its last lines are saved in `scratch/baseline.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 review-4: add the checker run to step 7 (`R`). Verify: `rg -c 'check-review-final-line.js' R` prints 1 or more, and `rg -c 'REVIEW_EOF' R` prints 2 or more.
- [x] T005 review-6: replace the Gate Types table with the `post_execution` sentence, and fix the `gate_type` input line, the `orchestrate.md` resource line, the `When invoked by orchestrator` line and the Mode 4 trigger cell (`R`). Verify: `rg -c 'pre_execution|mid_execution|pre/mid' R` exits 1, `rg -c 'invoked by orchestrator for review gate' R` exits 1, and `rg -c 'post_execution' R` prints 1 or more.
- [x] T006 review-6: drop the first advisory score table and reword its lead-in line (`R`). Verify: `sed -n '/^### Advisory Score/,/^## 7\./p' R | wc -l` prints 15 or less, measured before T007.
- [x] T007 review-6: apply the phase 6 self-score rule to the score section (`R`). Verify: `rg -n '<anchor text from T001>' R` prints one line, or `implementation-summary.md` records that phase 6 shipped no rule for this score. The lines this task adds to the score section are counted and named in the summary.
- [x] T008 review-2: make question 6 accept a fast-path review (`R`). Verify: `rg -c 'or is this a Fast Path review' R` prints 1.
- [x] T009 review-3: give the `:364` rule, the LOW row and the violation recovery one exit, and add the paragraph under the confidence table (`R`). Verify: `rg -c 'DO NOT send until fixed' R` exits 1, and `rg -c 'cannot be closed' R` prints 2 or more.
- [x] T010 review-6: drop the `Never let the score decide` anti-pattern block (`R`). Verify: `rg -c 'Never let the score decide' R` exits 1.
- [x] T011 Repeat T004 to T010 in the fork, anchored by text (`RC`). Verify: each T004 to T010 check run on `RC` prints what it printed on `R`.
- [x] T012 Rewrite the generated copies (`.pi/agents/review.md`, `.codex/agents/review.toml`, `.dsh/agents/review.patch.yml`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs` and `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs` each exit 0, and `rg -c 'mid_execution' .pi/agents/review.md .codex/agents/review.toml .dsh/agents/review.patch.yml` exits 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the step 7 command, copied out of `R`, on three fixtures (`F/pr-shape-valid.md`, `F/status-commented-open-p1.md`, `F/overall-contradicts-status.md`). Verify: it prints `final-line=0 findings=0`, then `final-line=0 findings=1`, then `final-line=1 findings=1`.
- [x] T014 Re-run the checker test suite (`S/tests/check-rule-copies.test.sh`). Verify: `bash S/tests/check-rule-copies.test.sh` exits 0, as in `scratch/baseline.txt`.
- [x] T015 Run the roster and mirror checks and the line cap (`R`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`, `node .skilled/bin/check-agent-mirror-sync.cjs` prints `all comparable mirrors in sync`, both exit 0, and `wc -l R` prints 600 or less.
- [x] T016 Write one row per owned finding with its closing command and output (`implementation-summary.md`). Verify: `rg -c 'review-[2346]' implementation-summary.md` prints 4 or more.
- [x] T017 Run strict validation on this folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/012-review-agent-gates --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every owned finding, review-2, review-3, review-4 and review-6, has a row in `implementation-summary.md` with the command that closed it
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, section 8 for the text of each edit and section 9 for the affected surfaces
- **Findings**: `../scratch/agent-review/agents-review.out.md`, section `## review`, and `../scratch/agent-review/finding-to-phase.tsv`
<!-- /ANCHOR:cross-refs -->

---
