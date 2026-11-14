---
title: "Tasks: Phase 10: deep-loop-leaf-state-and-status"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "deep loop leaf state and status tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: deep-loop-leaf-state-and-status

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

**Variables**: `R` is `.skilled/agents/deep-research.md`. `V` is `.skilled/agents/deep-review.md`. `scratch/` is this folder's `scratch/`. Every command runs from the worktree root unless it shows a `cd`. Each edit finds its text with `rg -n` on a quoted string, because phase 006 moves the line numbers first.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phase 006 is merged into this branch, or record the operator's word that this phase goes first (`specs/agents/007-agent-alignment-follow-ups/006-shared-agent-contract/spec.md`). Verify: `rg -n 'Status' specs/agents/007-agent-alignment-follow-ups/006-shared-agent-contract/spec.md` prints a status other than `Draft` or `Planned`, or `scratch/baseline.txt` holds the operator's answer.
- [ ] T002 Re-run the Measured Behavior commands by quoted text and save the output (`scratch/baseline.txt`). Verify: `rg -c 'set status to .error.' R` prints 2, `rg -c 'Append the structured JSONL record' R` prints 1, `grep -c durationMs R` prints 2, `rg -c 'BEFORE any state read' V` prints 1, `rg -c 'and JSONL state log listed' V` prints 1 and `rg -c 'append a typed .restarted. event' V` prints 1.
- [ ] T003 Save the baseline of the three suites and the four checks (`scratch/baseline.txt`). Verify: the parity suites print `Tests  19 passed (19)`, the fan-out suite prints `Tests  8 passed (8)`, both drift checks print `OK commands=1`, the roster check prints `agent-roster: OK` and the mirror check exits 0.
- [ ] T004 Re-run the `durationMs` reader search (`scratch/baseline.txt`). Verify: `rg -n durationMs .skilled/skills/system-deep-loop/deep-research .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-research-confirm.yaml` shows writers and examples only. A reader stops T008.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 REQ-004: delete the `## Convergence Threshold Semantics` block, the `### Error-Aware Execution` block and the `### Write Safety` block (`R`). Verify: `rg -c '^## Convergence Threshold Semantics' R`, `rg -c '^### Error-Aware Execution' R` and `rg -c '^### Write Safety' R` each exit 1, and `rg -c 'Tier 1 \(Source failure\)' R` prints 1.
- [ ] T006 REQ-001: rewrite the remaining `Tier 3+ escalation` bullet in Step 5 to report `timeout` or `stuck` (`R`). Verify: `rg -c 'set status to .error.' R` exits 1, and `rg -n 'Tier 3\+ escalation' R` prints one line naming `timeout` and `stuck`.
- [ ] T007 REQ-002: replace Step 7 item 2 with "Record the iteration through the append gateway (Step 8)." (`R`). Verify: `rg -c 'Append the structured JSONL record' R` exits 1.
- [ ] T008 REQ-003: drop the timing fields from the Step 8 record and the Step 11 field list, and add the gateway sentence (`R`). Verify: `grep -c durationMs R` prints 0, and `rg -n 'gateway stamps' R` prints one line. When the operator said yes to open question 1, `rg -c '"sessionId"' R` also prints 1 or more.
- [ ] T009 REQ-005: make the binding paragraph open "After Step 2 reads the config and BEFORE any review action" (`V`). Verify: `rg -c 'BEFORE any state read' V` exits 1, and `rg -n 'BINDING line' V` prints a line that names the config.
- [ ] T010 REQ-006: reword the permission line to name the write-once delta file and the append gateway (`V`). Verify: `rg -c 'and JSONL state log listed' V` exits 1, and `rg -n 'SPEC FOLDER PERMISSION.*deltas/iter-NNN.jsonl' V` prints one line.
- [ ] T011 REQ-009: replace the four lifecycle bullets with the one workflow-owner bullet (`V`). Verify: `rg -c 'append a typed .restarted. event' V` exits 1, and `rg -c 'completed-continue' V` prints 1 or more.
- [ ] T012 REQ-007: rewrite the FAIL cell of the Verdicts table to name the session verdict (`V`). Verify: `rg -n 'FAIL.*session verdict' V` prints one line, and `rg -c 'FAIL when any active P0 remains' V` prints 1.
- [ ] T013 REQ-008: add `noveltyJustification` to the Step 9 required list (`V`). Verify: `rg -n '^- Required review data includes.*noveltyJustification' V` prints one line.
- [ ] T014 REQ-009: delete the `stop_policy=max-iterations` bullet from Write Safety (`V`). Verify: `rg -c 'stopReason: maxIterationsReached' V` exits 1, and `wc -l V` prints 600 or less.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Hand-edit the two forks to carry the same changes (`.claude/agents/deep-research.md`, `.claude/agents/deep-review.md`). Verify: each acceptance command from T005 to T014, run on the fork, prints what it printed on the canonical file.
- [ ] T016 Run the three sync scripts (`.pi/agents/`, `.codex/agents/`, `.dsh/agents/`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs` and `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs` each exit 0.
- [ ] T017 Check the roster and the mirrors (`.skilled/bin/`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`, and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0.
- [ ] T018 Rebuild both compiled contracts (`.skilled/commands/deep/assets/compiled/`). Verify: `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research --write` and the same with `deep/review` each print their output path, then `check-contract-drift.cjs --command deep/research` and `--command deep/review` each print `[CONTRACT DRIFT] OK commands=1`.
- [ ] T019 Run the two parity suites (`.skilled/skills/system-spec-kit/runtime/cli/tests/`). Verify: `cd .skilled/skills/system-spec-kit/runtime/cli && npx --no-install vitest run --config ../../vitest.config.ts --project cli tests/deep-review-contract-parity.vitest.ts tests/deep-research-contract-parity.vitest.ts` prints `Tests  19 passed (19)`.
- [ ] T020 Run the fan-out prompt suite (`.skilled/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts`). Verify: `cd .skilled/skills/system-deep-loop/runtime && node_modules/.bin/vitest run --config vitest.config.ts tests/fanout-loop-prompt-in-process.test.ts` prints `Tests  8 passed (8)`.
- [ ] T021 Check the size cap and the scoped diff (`R`, `V`). Verify: `wc -l R V` prints 600 or less for each, and `git status --short` lists only the files in `spec.md` section 3 and this folder.
- [ ] T022 Validate this folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/010-deep-loop-leaf-state-and-status --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every owned finding id has a row in `implementation-summary.md` with the command that shows it closed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
- **Measured baseline**: See `scratch/measured.txt`
<!-- /ANCHOR:cross-refs -->

---
