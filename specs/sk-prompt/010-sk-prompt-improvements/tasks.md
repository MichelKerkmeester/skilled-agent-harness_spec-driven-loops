---
title: "Tasks: Fix sk-prompt drift and recommend improvements from a survey of other prompt improvers"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "sk prompt improvements tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Fix sk-prompt drift and recommend improvements from a survey of other prompt improvers

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

`S` is `.skilled/skills/sk-prompt`. `PI` is `AI Systems/AI Systems/Prompt Improver/sk-prompt-improver`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Replace `skill_advisor.py` with `.skilled/bin/skill-advisor.cjs` (`S/SKILL.md`). Verify: `rg -n "skill_advisor.py" S/SKILL.md` prints nothing (exit 1).
- [x] T002 [P] Remove the `sk-prompt-small-model` mention (`PI/SKILL.md`, `PI/README.md`). Verify: `rg -n "sk-prompt-small-model"` over the Prompt Improver folder outside changelogs and specs prints nothing, and `run_fixtures.sh` printed `PASSED 32/32 fixtures`.
- [x] T003 Record the survey ledger (`scratch/prompt-improver-survey.md`). Verify: `rg -c "CONFIRMED" scratch/prompt-improver-survey.md` prints 5.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace DEPTH with the one-pass checklist and the early exit (`S/references/depth-framework.md`, `S/SKILL.md`). Verify: `rg -c "DEPTH" S/SKILL.md` prints 0. Evidence: `depth-framework.md` renamed to `improvement-checklist.md` and rewritten; `rg -c DEPTH S/SKILL.md` printed 0.
- [x] T005 Add the pasted-prompt guard and deliver-first open items (`S/ROUTER.md`, `S/SKILL.md`). Verify: `rg -c "strip_source_prompt" S/ROUTER.md` prints at least 1. Evidence: `rg -c strip_source_prompt S/ROUTER.md` printed 3; open items are in the SKILL.md output contract.
- [x] T006 Replace the framework matrix with the component skeleton and craft checks (`S/references/patterns-evaluation.md`). Verify: `rg -n "RCAF" S/SKILL.md` prints only alias lines or nothing. Evidence: `patterns-evaluation.md` has Default Skeleton, Choosing a Preset and Preset Fit Table; RCAF in SKILL.md appears only in the keyword line, the preset sentence, the preset table and format-guide titles.
- [x] T007 Add the quick test, length cap and change list to the output block (`S/SKILL.md`). Verify: `rg -n "CHANGES:" S/SKILL.md` prints one line. Evidence: `rg -c "CHANGES:" S/SKILL.md` printed 1; the block also carries `TEST:`.
- [x] T008 Update the callers that name DEPTH (`.skilled/agents/prompt-improver.md`, `.skilled/commands/prompt/`). Verify: `rg -c "DEPTH" .skilled/agents/prompt-improver.md .skilled/commands/prompt/` prints 0 for each file. Evidence: `rg -c DEPTH` over the agent and `.skilled/commands/prompt/` printed nothing (exit 1); the confirm checkpoints are after_checklist, after_draft and after_screen.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Add router fixtures (`S/benchmark/router/run_fixtures.sh`). Verify: the script prints `PASSED n/n` and includes a pasted-`$json` fixture. Evidence: `run_fixtures.sh` printed `PASSED 12/12 fixtures`, two of them pasted-`$json`; 8 of 12 fail against the HEAD router.
- [x] T010 Rewrite the 25 playbook scenarios that name DEPTH (`S/manual-testing-playbook/`). Verify: `rg -l "DEPTH" S/manual-testing-playbook | wc -l` prints 0. Evidence: 14 scenarios rewritten into `checklist-pass/` and siblings, 12 files patched, index at 3.0.0.0 with 28 SP blocks; `rg -l DEPTH S/manual-testing-playbook | wc -l` printed 0.
- [x] T011 Check the runtime mirrors of the agent and command (`.skilled/agents/prompt-improver.md`). Verify: `/doctor:runtime-mirrors` reports no drift for `prompt-improver`. Evidence: runtime-mirror sync PASS (203), codex and pi agent sync PASS (11), codex and pi prompt sync PASS (39), Hermes copies regenerated.
- [x] T012 Fix the findings of a fresh review (4 P1, 10 P2): router conflict and paste-guard gaps, one repair cap, deliver-first wording, seven-field output capture, preset wording, confirm-mode checkpoints, playbook expectations. Verify: `run_fixtures.sh` prints `PASSED 19/19 fixtures`. Evidence: printed `PASSED 19/19 fixtures`; the residue grep for the flagged phrases printed nothing; mirror and agent checks PASS. Two P2 points kept by design: `$raw` anywhere means passthrough, and a lead-in strips up to the next blank line.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: one `/prompt:improve` run delivers a prompt, open items and a change list. Evidence: `@prompt-improver` on Sonnet returned FRAMEWORK default skeleton, CLEAR 43/50, `TEST: NOT RUN`, a CHANGES line, numbered open items and the about-3x length warning; on Opus it refused under Model Eligibility, as written.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Survey ledger**: See `scratch/prompt-improver-survey.md`
<!-- /ANCHOR:cross-refs -->

---
