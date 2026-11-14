---
title: "Goal: Phase 5: command-and-skill-doc-alignment"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "command and skill doc alignment goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/005-command-and-skill-doc-alignment"
    last_updated_at: "2026-11-14T11:33:23Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-command-and-skill-doc-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: command-and-skill-doc-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every deep-research and deep-review doc state each loop fact the way its single owner does, and make a drift check fail when one stops.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each fact has one owner and the other docs point at it. `EXECUTOR_KINDS` in `executor-config.ts` owns the executor list. The command doc's flag table owns the flag surface. The surface the runtime enforces owns the tool-call budget. |
| D2 | The autonomous directive is written once per command doc, names no runtime binary and agrees that the workflow owns dispatch. |
| D3 | Both command docs share one section order. A section present in one is present in the other or its absence is stated. |
| D4 | A doc drift guard fails when a doc states an executor count that differs from `EXECUTOR_KINDS`, names a workflow or script file that does not exist, or lists routing-step flags that differ from the flag table. It extends `runtime/scripts/check-documentation-drift.cjs`. |
| D5 | Docs go through `sk-doc`. Hub files (`SKILL.md`, `ROUTER.md`, registries) change only where a file name or fact is wrong, never rewired. |
| D6 | This phase runs after phases 001 to 004 and depends on them. Phase 006 follows it. |
| D7 | No runtime code counts tool calls, so the budget owner is the value the prompt pack shows the agent: `maxToolCallsPerIteration` in `deep-research-config.json` for research and line 94 of the review prompt pack template for review. Docs name the owner and state no number. |
| D8 | The routing step in each command doc points at the flag table and lists no flags of its own. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs --facts` exited 1 on the start commit and `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` exits 0 with `"errors": []` on the final tree.
- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/check-documentation-drift.vitest.ts tests/unit/typo-flags.vitest.ts` exits 0.
- [x] `rg -n 'opencode run|research topic' .skilled/commands/deep/research.md .skilled/commands/deep/review.md` prints nothing.
- [x] `rg -n 'max 12|nine executor kinds|never replace|@orchestrate dispatches' .skilled/skills/system-deep-loop/deep-research/SKILL.md .skilled/skills/system-deep-loop/deep-review/SKILL.md` prints nothing.
- [x] Every row in `acceptance-criteria.md` is `Met`, and `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Spec docs authored | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` written on 2026-11-14. Implementation has not started. |
| Operator answers recorded | Done | Six answers from 2026-11-14 folded into all five docs. REQ-013 to REQ-019 and AC-013 to AC-019 added. |
| Setup | Done | Phases 001 to 004 read Complete. Inventory rerun: 127 files against the 131 baseline, saved as scratch/doc-inventory.txt. Checker baseline exit 0 with errors [] |
| Facts check, failing first | Done | d60 added --facts and its test, 25 passed and the live-tree case fails. First live run: 463 errors (1 count, 460 file, 2 routing), saved as scratch/facts-before.json after four false-positive rules were tuned (439). It names deep-research/SKILL.md:92, deep-review/SKILL.md:59 and the research.md routing step |
| Old workflow names renamed by script | Done | 127 skill doc files under deep-research, deep-review and runtime. Facts errors fell to 45 |
| Agent files | Done | Budget numbers in deep-research and the two twin rows in deep-review replaced in .skilled, .claude and .dsh, Pi and Codex regenerated. check-agent-mirror-sync --all OK |
| Docs outside the mode packets | Done | sk-create-command example, command-authoring checklist, speckit README tree, folder-structure.md and two lines in cli-opencode destructive-scope-violations.md name files that exist |
| Command docs, presentation files, hub doc and snapshot generator | Done | d61 diff read and its checks rerun: contract drift OK commands=3, 75 and 21 contract tests passed. By hand: ARCHITECTURE.md paths, render-contract-snapshot.cjs file name plus regenerated snapshot, confirm-only failure gate row in both presentation files, dry-run sentence in both command docs and legacy bodies |
| Research skill doc, README and references (d62) | Done | 9 files, diff read line by line, failure and evidence filters confirmed at convergence.cjs 1321 and 1573, d62 checks all pass |
| Review skill doc, references and integration points (d63) | Done | 9 files, diff read line by line, replaced file references confirmed on disk, composite key at coverage-graph-db.ts 250, signals import at convergence.cjs 1680, d63 checks all pass |
| Research feature catalog and playbook (d64) | Done | 66 files, every non-rename change read, new search terms confirmed in convergence.cjs and deep-research.yaml. Three sentences corrected by hand: the missing graph decision in graph-convergence.md and the catalog index, and minIterationsNotReached restored to the no-pivot list |
| Review and runtime catalogs and playbooks (d65) | Done | 60 files, every non-rename change read, the rewritten native fan-out scenario confirmed against deep-review.yaml 305 to 332, check-documentation-drift.cjs --facts prints errors [] on my rerun |
| Changelogs | Done | Five entries, one per changed packet, each PASS in check_changelog_shape.py. Four SKILL.md versions bumped to match |
| Deviation: fixture root | Done | The checker first read an environment variable for test fixtures. CHK-031 and CHK-FIX-006 require none, so it now takes --facts-root=<dir>. The 11 checker cases pass |
| Deviation: T002 | Recorded | rg -c maxDurationReached on convergence.cjs prints nothing. The reason is in runtime/lib/deep-loop/lifecycle-taxonomy.cjs lines 14 and 56 and in both workflow files. Phase 003 put the duration stop in the workflow, so the docs attribute it to the loop |
| Deviation: files outside the task list | Done | render-contract-snapshot.cjs and its regenerated snapshot (the facts check reported the snapshot), both legacy bodies (dry-run sentence only), and research.md line 62 where research topic became topic so the goal criterion prints nothing |
| Phase 004 findings carried | Recorded | The dry-run sentence now says every packet stops at directory creation. The halt_hook_rule and safe_operations overlap stays open, listed in implementation-summary.md |
| Commits | Done | Code and docs under .skilled plus the agent mirrors: 9d02835e46 on worktrees/382-deep-loop-workflow-logic-hardening. Final tree: 183 test files, 3028 passed, 8 skipped, 0 failed, exit 0, typecheck exit 0, contract drift OK commands=3. Nothing pushed |

### Deviations and findings

| Item | Note |
|------|------|
| F13 owner | No runtime code reads the YAML `tool_call_budget` blocks or counts calls. D7 records the prompt pack as the owner. The review config value 12 is never rendered. |
| F18 partly holds | `deep-research/SKILL.md:309` names an existing research reducer. `integration-points.md:158` names a council file, not a review file. `deep-review/feature-catalog/severity-system/quality-gates.md:27` is a stale name the finding missed. |
| Finding classes | F13 cross-consumer. F17 instance-only. F18 class-of-bug. F19 instance-only. F20 class-of-bug. F21 instance-only. |
| Operator decision 2026-11-14: budget (closes open question 1) | Keep the prompt values that run today: research 24, review target 9, soft max 12 and hard max 13. Skills and agents point at the prompt value, as D7 says. No task changes a number. |
| Operator decision 2026-11-14: names (closes open question 2) | The stop decision script is `runtime/scripts/convergence.cjs` (phase 001). The workflow files become `deep-research.yaml` and `deep-review.yaml` (phase 004). The duration stop reason is `maxDurationReached`, added to the frozen list by phase 001 and used by phase 003. T002, T022, T025 and AC-011 use these names. |
| Operator decision 2026-11-14: wider scope | This phase also owns `deep-research/references/convergence/convergence.md` sections 2 and 3, the agent definitions, the `sk-doc` and `sk-code` command checklists and the speckit README. A file a phase 004 test reads is updated by phase 004, so the command doc file names and the `--dry-run` row stay phase 004's. REQ-013 to REQ-017 added. |
| Operator decision 2026-11-14: same-class defects (closes open question 3) | `deep-review/SKILL.md:249` is fixed here (REQ-018). `ai-council.md:44` and `integration-points.md:158` are left to phase `006-ai-council-mode-deprecation`, which is now this phase's successor. |
| Operator decision 2026-11-14: confirm gate | Confirm mode keeps a Retry, Skip or Cancel gate after three failed iterations (phase 002). Docs describe it as a confirm-only checkpoint (REQ-019). |
| Open question 4 closed by phase 002 | Phase 002 `goal.md` D6 says the research reducer runs before the failure row and D7 says the review reducer runs after it, so each mode keeps its own reducer. Research docs name `deep-research/scripts/reduce-state.cjs` and review docs name `runtime/scripts/reduce-state.cjs`. |
<!-- /ANCHOR:log -->
