---
title: "Tasks: Phase 8: orchestrate-routing-and-retry"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "orchestrate routing and retry tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: orchestrate-routing-and-retry

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

**Variables**: `O` is `.skilled/agents/orchestrate.md`. `R` is `.skilled/skills/system-spec-kit/references/workflows/orchestrator-dispatch.md`. `S` is `.skilled/skills/system-spec-kit`. `scratch/` is this folder's `scratch/`. Every command runs from the worktree root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phases 6 and 7 are merged on the base (`O`, `.skilled/agents/code.md`). Verify: `git log --oneline -3 -- O .skilled/agents/code.md` lists a commit from each phase.
- [x] T002 Re-run every command in `scratch/measured-behavior.txt` before any edit and save the output (`scratch/baseline.txt`). Verify: `diff scratch/measured-behavior.txt scratch/baseline.txt` shows only lines that phases 6 and 7 changed, and each owned finding still reproduces or is recorded as gone.
- [x] T003 Rebuild the section-move table in `plan.md` from the new heading map (`plan.md`). Verify: `awk '/^##+ /{print NR": "$0}' O` prints the headings the table cites, at the lines it cites.
- [x] T004 Save the baseline of the two plugin tests and the skill check (`scratch/baseline.txt`). Verify: the file shows `pass 5`, `pass 1`, `fail 0` twice and `Result: NO FINDINGS`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 REQ-001: set the `deep-research` `taskType` to name `/deep:research` and run `node .skilled/bin/sync-agent-roster.cjs` (`.skilled/agents/agent-registry.json`). Verify: `sync-agent-roster.cjs --check` prints `agent-roster: OK` and `sed -n '/BEGIN GENERATED: routing-table/,/END GENERATED/p' O | rg -c '/deep:research'` prints 1.
- [x] T006 REQ-001: rewrite the `/deep:*` depth rule so a request runs its command (`O`). Verify: `rg -n 'dispatch that leaf at depth 1' O` prints nothing.
- [x] T007 REQ-002: drop `execution` from the Task Format field and the resolution rule, and name the registry's three modes (`O`). Verify: `rg -n 'execution=|execution semantics|any of the 4' O` prints nothing and `rg -c 'mode=<workflowMode>; target_agent=' O` prints 1.
- [x] T008 REQ-006: include definition content only for `general-purpose`, in the protocol, the Task Format field, the PDR line and the anti-pattern row (`O`). Verify: `rg -n 'INCLUDE.*general-purpose' O` prints the step 2 line and `rg -c 'Agent Loading Protocol' O` prints 1 or more.
- [x] T009 REQ-009: set the example's `@code` skill to `sk-code`, and make Rule 3 and the session-save action say the orchestrator runs `/speckit:save` (`O`). Verify: `rg -n 'Skills: sk-code code-review mode|Mandate sub-agents to run|mandate sub-agents save' O` prints nothing.
- [x] T010 REQ-009: delete the Single-Hop Dispatch Model section (`O`). Verify: `rg -n 'Single-Hop Dispatch Model|@general-purpose, @review, @debug' O` prints nothing.
- [x] T011 REQ-004: name the main agent as the one spec-doc writer in Rules 2, 2b, 5 and 6, keeping `:461` and removing the `@markdown` route at `:444` and the rejection at `:499` (`O`). The operator chose the main agent on 2026-11-14. Verify: `rg -c 'main agent writes spec-folder docs directly' O` prints 1 or more, and `rg -c --include-zero 'spec-doc creation through .@markdown.' O` prints 0.
- [x] T012 REQ-003: write `### Retry Ladder` and point the rejection, quality-band, circuit-breaker, timeout and `@debug` passages to it (`O`). Verify: `rg -n 'after 2 rejections|up to 2x|after 2 retries|Attempts 1-2|60s cooldown' O` prints nothing and `rg -c '^### Retry Ladder$' O` prints 1.
- [x] T013 REQ-008: delete the unmeasurable gates and apply phase 6's self-score rule to the ≥ 70 item (`O`). Verify: `rg -n -i '50,000 tokens|~150K|\(2 min\)|approaching 80%|Score ≥ 70' O` prints nothing.
- [x] T014 REQ-007: limit the Pattern C file write to write-capable leaves, here and in the `scratch/` exception of Rule 5 (`O`). Verify: `rg -n 'Pattern C' O R` prints a line naming `@context` as returning its summary. After T017 the line lives in `R`, as REQ-007's grep allows.
- [x] T015 REQ-005: run the mirror routine in `plan.md` section 3 (`.claude/agents/orchestrate.md`). Verify: `sync-agent-roster.cjs --check` prints `agent-roster: OK` and `check-agent-mirror-sync.cjs` exits 0.
- [x] T016 REQ-010: create the reference from `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md`, routed through `sk-doc` (`R`). Verify: `ls R` prints the path and `rg -c '^## ' R` prints 3 or more.
- [x] T017 REQ-010: move the sections in the rebuilt table to `R` and leave a one-line pointer for each (`O`). Verify: `wc -l < O` prints 600 or less and `rg -c 'orchestrator-dispatch.md' O` prints 1 or more.
- [x] T018 REQ-010: replace the optional dispatch header and the pre-execution and handoff blocks with pointers to `agent-io-contract.md` (`O`). Verify: `rg -c 'AGENT_IO_DISPATCH v1$|AGENT_IO_HANDOFF v1$' O` prints 0 and `rg -c 'agent-io-contract.md' O` prints 1 or more.
- [x] T019 REQ-010: re-point every citation of a moved section that stays in the file, from the list in `plan.md` (`O`). Verify: `rg -n '§9|\(§4\)|see Conditional Branching below' O` prints only lines that also name `orchestrator-dispatch.md`, apart from two correct exceptions: `:384` cites `code.md` §9 and `:579` cites the Self-Protection Rules that stay in section 9.
- [x] T020 REQ-011: register `R` in the leaf manifest, the leaf aliases and the DISPATCH route of the router, routed through `skill-hub-routing.md` (`S/leaf-manifest.json`, `S/leaf-aliases.json`, `S/ROUTER.md`). Verify: `rg -c 'orchestrator-dispatch.md' S/leaf-manifest.json S/leaf-aliases.json S/ROUTER.md` prints 1 or more per file.
- [x] T021 REQ-005: run the mirror routine again (`.claude/agents/orchestrate.md`). Verify: `wc -l < .claude/agents/orchestrate.md` prints 600 or less and `check-agent-mirror-sync.cjs` exits 0.
- [x] T022 REQ-011: regenerate the trigger-index outputs (`S/runtime/`). Verify: `node S/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T023 Run every acceptance command in `spec.md` section 4 and save the output (`scratch/after.txt`). Verify: each command prints what its row names, REQ-004 included.
- [x] T024 Run both plugin tests (`.opencode/plugins/tests/`). Verify: `speckit-review-dispatch-contract.test.cjs` prints `pass 5` and `system-deep-loop-guard.test.cjs` prints `pass 1`, each with `fail 0`.
- [x] T025 Run the skill check (`S`). Verify: `node .skilled/commands/doctor/scripts/sk-skill-check.cjs S` prints `Result: PASS` (the check's current wording for no findings).
- [x] T026 Confirm no frontmatter permission changed (`.skilled/agents/`). Verify: `git diff -U0 -- .skilled/agents/*.md | rg -n '^[-+]  (read|write|edit|bash|task|webfetch|patch|list|glob|grep):'` prints nothing.
- [x] T027 Validate this folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/008-orchestrate-routing-and-retry --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining, or T011 deferred by a recorded operator decision
- [x] Manual verification passed
- [x] `scratch/after.txt` holds the output of every acceptance command
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
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

A `[B]` task stays open until the operator answers. Its REQ is then built or deferred by a recorded decision.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phases 6 and 7 are on the base. `git log --oneline -3 -- .skilled/agents/orchestrate.md` lists them
- [x] CHK-002 [P0] `scratch/baseline.txt` exists and holds the plugin-test and skill-check baselines
- [x] CHK-003 [P1] The section-move table in `plan.md` matches the heading map of the base
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node -e 'JSON.parse(require("fs").readFileSync(".skilled/agents/agent-registry.json","utf8"))'` exits 0
- [x] CHK-011 [P0] `sync-agent-roster.cjs --check` prints `agent-roster: OK`
- [x] CHK-012 [P1] `wc -l < .skilled/agents/orchestrate.md` prints 600 or less
- [x] CHK-013 [P1] `rg -c '\x{2014}' .skilled/skills/system-spec-kit/references/workflows/orchestrator-dispatch.md` prints nothing, the new prose follows the voice rules
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance row in `acceptance-criteria.md` is `Met`, or `Waived` by an ADR for REQ-004
- [x] CHK-021 [P0] Both plugin tests print `fail 0`
- [x] CHK-022 [P1] `check-agent-mirror-sync.cjs` exits 0
- [x] CHK-023 [P1] `sk-skill-check.cjs` prints `Result: PASS`, the check's wording for no findings
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each owned finding has the class `plan.md` gives it
- [x] CHK-FIX-002 [P0] The same-class lines for orchestrate-4, -5 and -6 are each fixed, by the greps in T008, T011 and T014
- [x] CHK-FIX-003 [P0] The consumers in the `plan.md` addendum are each checked by the command in their row
- [x] CHK-FIX-004 [P0] N/A. No security, path, parser or redaction code changes
- [x] CHK-FIX-005 [P1] The section-move table and its line count are recorded before the move
- [x] CHK-FIX-006 [P1] N/A. No test reads process-wide state
- [x] CHK-FIX-007 [P1] `scratch/after.txt` names the commit it ran on
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No agent gains a permission, by T026
- [x] CHK-031 [P0] Rule 7 keeps its seven numbered items. `awk '/^### Rule 7/,/^\*\*Logic/' .skilled/agents/orchestrate.md | rg -c '^[0-9]\. '` prints 7
- [x] CHK-032 [P1] N/A. No auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` name the same eleven REQs
- [x] CHK-041 [P1] No code comment changes. The phase edits prose only
- [x] CHK-042 [P2] The `system-spec-kit` ROUTER.md DISPATCH line names the new reference
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baselines and outputs live under `scratch/` only
- [x] CHK-051 [P1] `scratch/` holds only `.gitkeep`, `measured-behavior.txt`, `baseline.txt` and `after.txt` at close
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-15. Evidence for every row is in `scratch/after.txt`.
<!-- /ANCHOR:summary -->

---
