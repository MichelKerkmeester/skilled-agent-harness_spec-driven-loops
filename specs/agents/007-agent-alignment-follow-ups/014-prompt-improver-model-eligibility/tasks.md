---
title: "Tasks: Phase 14: prompt-improver-model-eligibility"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "prompt improver model eligibility tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: prompt-improver-model-eligibility

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

**Variables**: `A` is `.skilled/agents/prompt-improver.md`. `S` is `.skilled/skills/sk-prompt/SKILL.md`. `W` is `.skilled/commands/prompt/assets`. The mirror routine is the five commands in `plan.md` section 5. Line numbers are the ones at `c1dbb1bcc4` and are re-read in T001.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-run every Measured Behavior command in `spec.md` after phase 006 lands, and note any line it moved (`scratch/baseline.txt`). Verify: `rg -c '^\$ ' scratch/baseline.txt` prints 15 or more, and the mirror check in it prints `all comparable mirrors in sync`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 REQ-003: fix the `TEST` field to `NOT RUN`, reword the VALIDATE step so `TEST` is always `NOT RUN` and drop `quick test +` from the thorough branch (`A`). Verify: `rg -n '^TEST: ' A` prints one line ending `NOT RUN` with no `ran:`, and `rg -c 'quick test' A` exits 1.
- [x] T003 REQ-005: delete the Integration Touchpoint table, drop the `Integration ID` column from the three section 2 tables and reword the routing, `RATIONALE` and checklist lines that cite the ids (`A`). Verify: `rg -c 'INT-[A-Z]|Integration ID' A` exits 1.
- [x] T004 REQ-004: replace `@general-purpose` with `@orchestrate` and `/prompt-improve` with `/prompt:improve` on every remaining line (`A`). Verify: `rg -c 'general-purpose|/prompt-improve\b' A` exits 1, and `rg -c '/prompt:improve' A` prints 1 or more.
- [x] T005 Run the mirror routine for T002 to T004: hand-edit the fork, then the three generators, the roster check and the mirror check (`.claude/agents/prompt-improver.md`). Verify: the mirror check prints `all comparable mirrors in sync` and exits 0, `sync-agent-roster.cjs --check` prints `agent-roster: OK`, and `wc -l A` prints 600 or less.
- [x] T006 REQ-003: set the agent output block's `TEST` field to `NOT RUN` and leave the inline quick-test line at `:140` (`S`). Verify: `rg -c 'ran: summary' S` exits 1, and `rg -c 'Quick test: NOT RUN' S` prints 1.
- [x] T007 REQ-002 outcome A, step 1: before any edit, dispatch `@prompt-improver` from a Claude Code session on Opus with a one-line `raw_task`, passing no model (`scratch/opus-probe.txt`). Verify: the file holds the returned text, and `spec.md` section 7's second question is answered with refusal or package.
- [x] T008 REQ-002 outcome A, step 2: replace section 0.1 with one backstop sentence in phase 006's canonical refusal form that points at the skill's table (`A`). Verify: `rg -c 'Denied under no circumstances' A` exits 1.
- [x] T009 REQ-002 outcome A, step 3: make the skill the canonical home of the table and turn its canonical-home line round (`S`). Verify: `rg -c 'Denied under no circumstances' S` prints 2.
- [x] T010 REQ-002 outcome A, step 4: add `, model=sonnet` to the AGENT dispatch line of both workflow files (`W/prompt_improve_auto.yaml`, `W/prompt_improve_confirm.yaml`). Verify: `rg -c 'subagent_type=prompt-improver, model=sonnet'` prints 1 for each file, and both parse with `python3 -c 'import yaml,sys; yaml.safe_load(open(sys.argv[1]))'`.
- [x] T011 REQ-002 outcome A, step 5: add `model: sonnet` to the fork's frontmatter, then run the mirror routine (`.claude/agents/prompt-improver.md`). Verify: `rg -n '^model: sonnet' .claude/agents/prompt-improver.md` prints one line, and the mirror check exits 0.
- [x] T012 REQ-002 outcome A, step 6: add the new Claude pin to the pin lists (`.skilled/agents/README.txt`, `.skilled/bin/agent-mirror-crosswalk.md`). Verify: `rg -c 'prompt-improver' .skilled/bin/agent-mirror-crosswalk.md` prints 1 or more, and `README.txt` no longer says no agent pins a model without naming the Claude pins.
- [x] T013 REQ-002 outcome B, skipped: the operator chose outcome A on 2026-11-14, so T007 to T012 run and this task does not. The outcome B text stays as the record: delete section 0.1 from the agent and the Model Eligibility subsection from the skill, then run the mirror routine (`A`, `S`). Verify: `rg -c 'Opus|Fable' A S` exits 1, and the mirror check exits 0. Runs instead of T007 to T012.
- [x] T014 REQ-006: raise the skill to `version: 4.0.5.0` and write its changelog entry for the section 7 change (`.skilled/skills/sk-prompt/changelog/v4.0.5.0.md`). Verify: `sed -n 5p S` prints `version: 4.0.5.0`, and `check_changelog_shape.py` on the entry prints `pass=1 fail=0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Under outcome A, re-run the T007 probe after the pin (`scratch/opus-probe.txt`). Verify: the dispatch returns a package whose first line starts `FRAMEWORK:`, not a refusal.
- [x] T016 Run every acceptance command in `spec.md` section 4 on the final tree (`scratch/after.txt`). Verify: each prints the output its row names, REQ-002 checked against the outcome the operator picked.
- [x] T017 Confirm the playbook consumer still finds the `TEST` label (`.skilled/skills/sk-prompt/manual-testing-playbook/escalation-tiers/prompt-improver-output-block.md`). Verify: `rg -c '^TEST: ' A` prints 1.
- [x] T018 Run strict validation on this folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/014-prompt-improver-model-eligibility --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, with T007 to T012 or T013 skipped by the operator's outcome and the skip recorded
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `implementation-summary.md` has one row per owned finding with the command that shows it closed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: `../scratch/agent-review/agents-review.out.md`, section `## prompt-improver`
- **Prior packet**: `specs/sk-prompt/009-prompt-improver-model-eligibility/spec.md`, which added the deny rows
<!-- /ANCHOR:cross-refs -->

---
