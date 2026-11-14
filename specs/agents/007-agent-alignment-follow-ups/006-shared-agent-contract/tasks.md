---
title: "Tasks: Phase 6: shared-agent-contract"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "shared agent contract tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: shared-agent-contract

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `A` is `.skilled/agents`. `T` is `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md`. `D` is `.skilled/skills/system-deep-loop`. `Y` is `.skilled/commands/deep/assets`. `scratch/` is this folder's `scratch/`. Run every command from the worktree root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-run every Measured Behavior command in `spec.md` and save the output before any edit (`scratch/before.txt`). Verify: `diff <(sed -n '/^\$ rg -n .Max 5/,$p' scratch/baseline.txt) <(sed -n '/^\$ rg -n .Max 5/,$p' scratch/before.txt)` prints nothing, or each difference is explained in `scratch/before.txt` before T002 starts.
- [x] T002 Recount the mandatory calls of `deep-research`, `deep-review` and the three fast paths from the current text (`scratch/before.txt`). Verify: the counts are 12, 16, 6, 8 and 6, as `spec.md` records them.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 REQ-001 and REQ-006: add the budget rule to section 5 and the self-attested-output rule to section 6, each with a section 10 checklist row (`T`). Verify: `rg -c 'row is the agent.s one budget' T` prints 1 and `rg -c 'checklist in an agent file ships unticked' T` prints 1.
- [x] T004 REQ-009 and REQ-010: merge the two refusal blocks of section 4 into one and add the untrusted-content bullet to the section 0 wording and the skeleton (`T`). Verify: `rg -c -F 'REFUSE: nested Task tool dispatch is forbidden for LEAF agents.' T` prints 2 and `rg -c -i 'untrusted' T` prints 2 or more.
- [x] T005 [P] REQ-002, REQ-009, REQ-010 and REQ-012: delete "Max 5 tool calls.", rewrite the delegation bullet to emit the refusal line, add the untrusted bullet and replace "Layer 1" (`A/code.md`). Verify: `rg -c 'Max 5 tool calls\|Layer 1' A/code.md` exits 1 and `wc -l < A/code.md` prints 600 or less.
- [x] T006 [P] REQ-002, REQ-009, REQ-010, REQ-011 and REQ-012: the same four edits plus deleting the "Daemon-free" line, in both "Layer 1" places (`A/review.md`). Verify: `rg -c 'Max 5 tool calls\|Layer 1\|Layer-1\|Daemon-free' A/review.md` exits 1 and `rg -c -i 'untrusted' A/review.md` prints 1.
- [x] T007 [P] REQ-002, REQ-008, REQ-009, REQ-010, REQ-011 and REQ-012: the same edits, and the three verification lines with Command and Exit Code fields (`A/debug.md`). Verify: `rg -c 'Exit Code' A/debug.md` prints 3, `rg -c '\[x\]\|Max 5 tool calls\|Daemon-free' A/debug.md` exits 1 and `wc -l < A/debug.md` prints 648 or less.
- [x] T008 [P] REQ-003, REQ-007, REQ-009 and REQ-011: rewrite the budget at `:183`, replace the budget table and `:417` with one pointer line, untick the 19 boxes, delete the "Daemon-free" line and add the refusal line to section 0 (`A/deep-research.md`). Verify: `rg -c 'hard max 12\|approaching 12\|8-11\|\[x\]\|Daemon-free' A/deep-research.md` exits 1 and `wc -l < A/deep-research.md` prints 600 or less. [DEVIATION: the ALWAYS rule at `:459` also restated "target 8-11, max 12" and sat inside REQ-003's own search, so it was repointed at the prompt's `Max N` line.]
- [x] T009 [P] REQ-004, REQ-007 and REQ-011: delete the budget profiles, the profile line and ALWAYS rule 4, point `:506` and `:580` at the prompt line, untick the 9 boxes and keep only the "Never block an iteration on retrieval" rule (`A/deep-review.md`). Verify: `rg -c 'max 13\|[0-9]+-[0-9]+ (tool )?calls\|\[x\]\|Daemon-free' A/deep-review.md` exits 1, `rg -c -i 'never block an iteration on retrieval' A/deep-review.md` prints 1 and `wc -l < A/deep-review.md` prints 600 or less.
- [x] T010 [P] REQ-009, REQ-010 and REQ-011: add the refusal clause to the Depth 1 bullet, add the untrusted bullet and delete the "Daemon-free" line (`A/ai-council.md`). Verify: `rg -c -F 'REFUSE: nested Task tool dispatch' A/ai-council.md` prints 1 and `wc -l < A/ai-council.md` prints 816 or less.
- [x] T011 [P] REQ-009, REQ-010 and REQ-011: emit the refusal line before the "report the refused boundary" clause, add the untrusted bullet and delete the "Daemon-free" line (`A/context.md`). Verify: `rg -c -i 'untrusted' A/context.md` prints 1 and `rg -c 'Daemon-free' A/context.md` exits 1.
- [x] T012 [P] REQ-009 and REQ-010: add the refusal line and the untrusted bullet to section 0 (`A/design.md`, `A/prompt-improver.md`). Verify: `rg -l -F 'REFUSE: nested Task tool dispatch' A/design.md A/prompt-improver.md` lists both files.
- [x] T013 [P] REQ-010: add the untrusted bullet to section 0 (`A/markdown.md`). Verify: `rg -c -i 'untrusted' A/markdown.md` prints 1.
- [x] T014 [P] REQ-005: rewrite the 13+ action cell and the SELF-GOVERNANCE footer in place (`A/orchestrate.md`). Verify: `rg -c 'more than 12 tool calls' A/orchestrate.md` exits 1, `rg -c 'Tool Calls. budget' A/orchestrate.md` prints 2 and `wc -l < A/orchestrate.md` prints 910 or less.
- [x] T015 REQ-003: delete `tool_call_budget` from both research YAMLs and repoint the numbers in the mode's skill and protocol docs (`Y/deep-research-auto.yaml`, `Y/deep-research-confirm.yaml`, `D/deep-research/SKILL.md`, `D/deep-research/references/protocol/loop-protocol.md`). Verify: `rg -n 'tool_call_budget\|8-11\|max 12\|default: 12' Y/deep-research-*.yaml D/deep-research/SKILL.md D/deep-research/references/protocol/loop-protocol.md` exits 1, and both YAMLs parse with `python3 -c 'import yaml,sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]'`.
- [x] T016 REQ-004: set the review budget to 24, render it in the review template, pass it from both review YAMLs, delete their `tool_call_budget`, pass it in both tests that render the review pack and assert it in the first, and repoint the skill and protocol docs, all in one commit (`D/deep-review/assets/deep-review-config.json`, `D/deep-review/assets/prompt-pack-iteration.md.tmpl`, `Y/deep-review-auto.yaml`, `Y/deep-review-confirm.yaml`, `D/runtime/tests/unit/prompt-pack.vitest.ts`, `D/runtime/tests/fanout-review-focus.vitest.ts`, `D/deep-review/SKILL.md`, `D/deep-review/references/protocol/loop-protocol.md`). Verify: `rg -c 'max_tool_calls_per_iteration' Y/deep-review-auto.yaml Y/deep-review-confirm.yaml` prints 1 for each, and the prompt-pack suite passes with a review `Max 24 tool calls total.` assertion.
- [x] T017 Raise the two mode versions and write their changelog entries (`D/deep-research/changelog/v1.15.13.0.md`, `D/deep-review/changelog/v1.11.15.0.md`, both `SKILL.md`). Verify: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` on both files prints `pass=2 fail=0`, and each `SKILL.md` version equals its newest entry.
- [x] T018 Mirror routine: hand-edit each `.claude/agents/<name>.md` fork to match its canonical file, then regenerate the other runtimes (`.claude/agents/`, `.pi/agents/`, `.codex/agents/`, `.dsh/agents/`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs` and `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs` each exit 0, then `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0.
- [x] T019 Regenerate the three compiled contracts after the last source edit (`Y/compiled/`). Verify: `node D/runtime/scripts/compile-command-contracts.cjs --command deep/<x> --write` for `ai-council`, `research` and `review` each print the contract path, and `node D/runtime/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run every acceptance search in `spec.md` section 4 (`scratch/after.txt`). Verify: each prints the output its row names, and `scratch/after.txt` holds all fifteen.
- [x] T021 Run the deep-loop suites (`D/runtime`). Verify: `npx vitest run tests/unit/prompt-pack.vitest.ts tests/unit/compile-command-contracts.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/fanout-review-focus.vitest.ts` prints `Test Files  4 passed (4)` and 43 tests or more, as at base, with the new review assertion inside the existing render test.
- [x] T022 Recount each touched agent's mandatory calls against the budget it now reads (`scratch/after.txt`). Verify: no recount exceeds its budget, and the `deep-review` floor of 16 sits under the rendered `Max 24`.
- [x] T023 Run the frontmatter version gate (`.skilled/skills/sk-doc/scripts/check-frontmatter-versions.sh`). Verify: it exits 0, as at base.
- [x] T024 Regenerate the trigger-index outputs after the last document edit (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0 with no `manifest hash differs` note.
- [x] T025 Check the scoped diff (`git status --short`). Verify: every changed path is in `spec.md` Files to Change, and `scratch/` holds only `baseline.txt`, `before.txt` and `after.txt`.
- [x] T026 Run strict validation on this folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/006-shared-agent-contract --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every owned finding has a row in `implementation-summary.md` with the command that shows it fixed or the evidence that closes it
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent**: See `../spec.md`
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

A blocked task is marked `[B]` with the failing command and its output on the task line, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The requirements are in `spec.md` section 4, one per planned fix, each with a search. Verify: `rg -c '^\| REQ-0' spec.md` prints 15.
- [x] CHK-002 [P0] The fix approach for each requirement is in `plan.md` section 3. Verify: `rg -c '^- \*\*REQ-0' plan.md` prints 13 or more.
- [x] CHK-003 [P1] The base commit and the baseline are recorded. Verify: `rg -c 'c1dbb1bcc4' spec.md` prints 1 or more and `scratch/baseline.txt` exists.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both review YAMLs and both research YAMLs parse. Verify: `python3 -c 'import yaml,sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]'` over the four files exits 0.
- [x] CHK-011 [P0] The review config parses and holds 24. Verify: `node -e 'console.log(require("./.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json").maxToolCallsPerIteration)'` prints 24.
- [x] CHK-012 [P1] No agent comment or text carries a packet or finding id. Verify: `git diff -U0 -- .skilled/agents | rg -n '^\+.*(REQ-0|across-[0-9]|specs/agents/007)'` exits 1.
- [x] CHK-013 [P1] Each touched agent is within its line limit. Verify: the REQ-013 `wc -l` run prints 600 or less, or not above 816, 648 and 910 for the three over-cap files.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is `Met` with its observed output. Verify: `rg -c '\| Met \|' acceptance-criteria.md` prints 15.
- [x] CHK-021 [P0] The deep-loop suites pass. Verify: T021's output.
- [x] CHK-022 [P1] A missing review variable fails loudly. Verify: rendering the review template without `max_tool_calls_per_iteration` throws `PromptPackError` naming it.
- [x] CHK-023 [P1] The contracts are fresh. Verify: `check-contract-drift.cjs` prints `OK commands=3`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: across-1, across-2, across-3, across-4 and across-5 are `class-of-bug`, code-5, review-1, review-5 and debug-3 are `instance-only` instances of them, and deep-research-1, deep-review-1 and orchestrate-3 are `cross-consumer`. Verify: `spec.md` section 3 names each.
- [x] CHK-FIX-002 [P0] The same-class producer inventory is complete. Verify: the inventories in `plan.md` affected surfaces return no producer outside its table.
- [x] CHK-FIX-003 [P0] The consumer inventory covers the YAMLs, templates, config, test, skill docs, protocols, compiled contracts and runtime copies. Verify: the `plan.md` surfaces table has a row for each.
- [x] CHK-FIX-004 [P0] N/A. No security, path, parser or redaction code changes. Verify: `git diff --stat` lists no `.cjs`, `.mjs` or `.ts` source outside the one test.
- [x] CHK-FIX-005 [P1] Matrix axes are listed: 11 agents by 5 rules. Verify: `plan.md` names both axes.
- [x] CHK-FIX-006 [P1] N/A. No test reads process-wide state that this phase changes. Verify: the prompt-pack test passes its variables explicitly.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the fix commit. Verify: `implementation-summary.md` names the commit SHA beside each output.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential is read or written. Verify: `git diff | rg -i 'token|secret|api_key'` finds no added line.
- [x] CHK-031 [P0] Every LEAF agent treats read content as data. Verify: REQ-010's search prints 10.
- [x] CHK-032 [P1] No permission or tool grant changes. Verify: `git diff -- .skilled/agents | rg '^[+-]\s+(read|write|edit|bash|task|webfetch):'` exits 1.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria name the same fifteen requirements. Verify: `rg -o 'REQ-0[0-9]+' spec.md acceptance-criteria.md | sort -u` lists REQ-001 to REQ-015 for each file.
- [x] CHK-041 [P1] The two changelog entries describe what shipped. Verify: T017's shape check passes.
- [x] CHK-042 [P2] The hand-offs to phases 7, 8, 12 and 13 are named. Verify: `rg -c 'phase 7\|phase 8\|phase 12\|phase 13' spec.md` prints 1 or more.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary captures live in `scratch/` only. Verify: `git status --short` lists no new file outside the Files to Change table and this folder.
- [x] CHK-051 [P1] `scratch/` holds only the three capture files at close. Verify: `ls scratch/` prints `after.txt`, `baseline.txt` and `before.txt`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14, at `24594b2b28`. Evidence is in `scratch/after.txt`, `acceptance-criteria.md` and `implementation-summary.md`.
<!-- /ANCHOR:summary -->

---
