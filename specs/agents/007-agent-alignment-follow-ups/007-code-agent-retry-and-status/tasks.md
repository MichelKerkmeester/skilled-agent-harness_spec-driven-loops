---
title: "Tasks: Phase 7: code-agent-retry-and-status"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "code agent retry and status tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: code-agent-retry-and-status

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

**Variables**: `C` is `.skilled/agents/code.md`. `O` is `.skilled/agents/orchestrate.md`. `R` is `.skilled/agents/agent-registry.json`. `scratch/` is this folder's `scratch/`. Line numbers are the ones at `c1dbb1bcc4` and move as earlier edits land, so each task finds its text by search, not by number.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Rerun every Measured Behavior command in `spec.md` before any edit and save the output (`scratch/baseline.txt`). Verify: `diff` of the saved output against the `spec.md` block prints nothing, or each difference is recorded in `scratch/baseline.txt` before T003 starts.
- [ ] T002 Read phase 6's shipped self-score and tool-budget rules (`../006-shared-agent-contract/implementation-summary.md`). Verify: `rg -n 'self-score|Rubric' ../006-shared-agent-contract/implementation-summary.md` prints the rule, or T011 is marked `[B]` with the reason.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 REQ-002: add the three-row `PASS`, `FAIL` and `BLOCKED` table at the top of section 8 and reword the circuit breaker to count `BLOCKED` and name `FAIL` as retryable (`C`). Verify: `rg -c '^\| .(PASS|FAIL|BLOCKED). \|' C` prints 3.
- [ ] T004 REQ-002: split the escalation triggers in section 9 into one `FAIL` line for `VERIFY_FAIL` and the `BLOCKED` list for the other four classes, and change the `LOW` confidence row to say `FAIL` for a failed command (`C`). Verify: `rg -n 'Return BLOCKED with the appropriate' -A7 C | rg -c VERIFY_FAIL` prints 0.
- [ ] T005 REQ-001: replace "NO internal retry. NO loop-fix." in step 6 with the one-fix rule, name the runner's verdict "a `BLOCKED` gate verdict" in step 5 with the same rule and say "after one targeted in-scope fix" in the escalate list (`C`). Verify: `rg -c 'NO internal retry|NO loop-fix' C` prints nothing and exits 1, and `rg -c 'one targeted in-scope fix' C` prints 3.
- [ ] T006 REQ-004: replace the four `UNKNOWN_ROUTE` escalations with `UNKNOWN_STACK` (`C`). Verify: `rg -c 'UNKNOWN_ROUTE' C` prints nothing and exits 1.
- [ ] T007 REQ-005: replace the dispatch gate with the caller note and drop "halts without its `Depth: 1` marker" from the related-resources line (`C`). Verify: `rg -c 'REFUSE: @code|orchestrator-context marker|halts without' C` prints nothing, and `rg -c 'state the packet and the frozen scope' C` prints 1.
- [ ] T008 REQ-005: drop "(`Depth: 1` marker required)" from the `code` record's `notes` (`R`). Verify: `node -e "JSON.parse(require('fs').readFileSync('.skilled/agents/agent-registry.json','utf8'))"` exits 0 and `rg -c 'marker required' R` prints nothing.
- [ ] T009 REQ-005: rewrite the generated roster row and drop "gated by a `Depth: 1` marker" from the related-resources line (`O`). Verify: `node .skilled/bin/sync-agent-roster.cjs` rewrites the row, and `rg -c 'Depth: 1. marker' .skilled/agents/` prints nothing.
- [ ] T010 REQ-006: cut section 6 to the P0 and P1 rule and the severity table, and cut section 8 to the status table and the circuit breaker (`C`). Verify: `rg -c 'Quality Bands|Scoring Dimensions|Dimension Rubrics|pre_implementation_check|Code Gate Validation' C` prints nothing, and `rg -n '^## 9\. RETURN CONTRACT' C` prints one line.
- [ ] T011 REQ-007: apply phase 6's self-score rule to the `Rubric Score` field, the `rubric_score` entry, the "Score using §6 rubric" rule and the confidence rows (`C`). Verify: `rg -n '§6 rubric|rubric self-score|rubric 70-89|rubric < 70' C` prints nothing, and each remaining `Rubric Score` line matches the rule read in T002.
- [ ] T012 Hand-edit the same changes into the Claude forks (`.claude/agents/code.md`, `.claude/agents/orchestrate.md`). Verify: `diff <(sed -n '/^# The Code Implementer/,$p' C | sed 's#\.skilled/agents/\([a-z*-]*\)\.md#.claude/agents/\1.md#g') <(sed -n '/^# The Code Implementer/,$p' .claude/agents/code.md)` prints nothing and exits 0, as it does at `c1dbb1bcc4`.
- [ ] T013 Regenerate the Pi, Codex and harness copies (`.pi/agents/`, `.codex/agents/`, `.dsh/agents/`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs` and `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs` each exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run the roster and mirror checks on the final tree (`scratch/after.txt`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`, and `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `OK` and exits 0.
- [ ] T015 Run the review dispatch contract test (`.opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs`). Verify: `node --test` on it prints `pass 5` and `fail 0`, as in the baseline.
- [ ] T016 Check the cap and the removed names in every copy (`scratch/after.txt`). Verify: `wc -l C .claude/agents/code.md` prints 600 or less for each, and `rg -c 'UNKNOWN_ROUTE|NO internal retry|Quality Bands|Code Gate Validation|REFUSE: @code' C .claude/agents/code.md .pi/agents/code.md .codex/agents/code.toml .dsh/agents/code.patch.yml` prints nothing and exits 1.
- [ ] T017 Record one row per owned finding with its closing command (`implementation-summary.md`). Verify: `rg -c 'code-[12346]' implementation-summary.md` prints 5 or more.
- [ ] T018 Run strict validation on this folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/007-code-agent-retry-and-status --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every owned finding id has a row in `implementation-summary.md`, and code-1 and code-6 name the part that did not reproduce
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
- **Depends on**: `../006-shared-agent-contract/`
- **Depended on by**: `../008-orchestrate-routing-and-retry/`
<!-- /ANCHOR:cross-refs -->

---
