---
title: "Tasks: Phase 6: open-items-and-alignment"
description: "Five open-item fixes, then an alignment run on the touched skills fixed until a recheck is clean."
trigger_phrases:
  - "open items and alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: open-items-and-alignment

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

`CR` is `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs`. `LSA` is `/local-skilled-alignment`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Merge main into the branch and re-mint the conflicted manifests (`5117366374`). Verify: all seven hubs report `compiled-serving` and `fresh`. Evidence: a second merge `c86580f127` regenerated the Hermes mirror and the skill graph, as the operator chose; after the last commit all seven hubs report `compiled-serving`, sk-code `fresh`.
- [x] T002 Write the alignment executor config with every lane and the critic on `opencode-go/deepseek-v4.1-flash` (`scratch/alignment-executors.json`). Verify: `rg -c llmgateway scratch/alignment-executors.json` prints 0. Evidence: no match, exit 1.
- [x] T003 Run `LSA` over the branch, its own commits only, against `origin/main` (`scratch/alignment-1/`). Verify: `report.md` and `findings.json` exist. Evidence: the harness writes its runs to `~/.local/state/local-skilled-alignment/314-frontend-upstream-proposals/`, not `scratch/`; the first pass is `run1` and `run2`, the second `run3`, and their reports are copied to `scratch/alignment-runs/`. The second pass scoped to local main after the merge.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Re-pin `LIVE_CORPUS_SIZE` at the live count (`.skilled/bin/tests/compiled-route-admission.test.cjs`). Verify: the admission suite reports `fail 0`. Evidence: 84 in `d51b61f4cf`, then 85 in `2c721cea1b` with the frontend gold scenario; the admission suite passes inside the 101/101 compiled-route run.
- [x] T005 Define the tie comparator in `CR` and its served copy, and add a same-mode tie test (`.skilled/bin/tests/compiled-route-sk-design-tie.test.cjs`). Verify: the test passes, and fails with the fix reverted. Evidence: `398226c556`; `scratch/tie-revert-test.txt` shows fail 1 reverted, pass 1 restored.
- [x] T006 Print a plan-only line in the save summary when the mode is not `full-auto`, with a vitest (`core/workflow.ts`). Verify: the vitest passes, and fails with the fix reverted. Evidence: `4e5de4c3bf`; `scratch/planonly-revert-test.txt` shows 1 failed of 8 reverted, 8 of 8 restored.
- [x] T007 Add the system-spec-kit changelog entry and bump `SKILL.md` (`system-spec-kit/changelog/`). Verify: the entry names the trigger-index warning and the plan-only line. Evidence: `1c5cad8bf7`, `v2.12.31.0.md` names both; `SKILL.md` reads `version: 2.12.31.0`.
- [x] T008 Record DeepSeek V4.1 Flash on opencode-go as the build executor in the parent goal (`../goal.md`). Verify: `goal.cjs packet` prints `packet_budget=ok`. Evidence: D6 names `opencode-go/deepseek-v4.1-flash`; `packet_budget=ok`.
- [x] T009 Fix every finding `LSA` confirms on a touched skill (the files its `fix-plan.md` names). Verify: each fix is listed against its finding id in `scratch/alignment-fixes.md`. Evidence: both passes are mapped there, finding by finding, with one conceded probe and its reason.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run `LSA --recheck` on the first run (`scratch/alignment-1/recheck.md`). Verify: no finding on a touched skill is still open. Evidence: `scratch/alignment-runs/recheck1.md` and `recheck3.md`. Each "still open" row is a false positive whose old text is a substring of its fix (B-02 first pass, D-02 second pass), and every needs-review row is settled in `scratch/alignment-fixes.md`.
- [x] T011 Run the compiled-route, sk-create-skill and trigger-index suites and the sync check (`scratch/final-suites.txt`). Verify: every suite reports `fail 0`. Evidence: `scratch/final-suites.txt`.
- [x] T012 Run reach on every hub at concurrency 2 (`scratch/reach-final.txt`). Verify: every hub prints `outranked=  0` and `wrong-hub=  0`. Evidence: seven hubs, `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The alignment recheck lists no open finding on a touched skill
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

A finding on a skill this packet did not touch is listed in `scratch/alignment-fixes.md` as out of scope, never fixed here.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The opencode-go DeepSeek route answers through both `pi` and `opencode`. Evidence: the lanes and critic ran through `pi`, every build through `opencode run`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npx tsc --noEmit` passes for the system-spec-kit CLI after the workflow change. Evidence: exit 0, no output.
- [x] CHK-011 [P1] No code comment carries a packet, phase, task or finding id. Evidence: every brief banned it, and the added comment lines were read before each commit.
- [x] CHK-012 [P1] Each open item lands as its own commit. Evidence: `d51b61f4cf`, `398226c556`, `4e5de4c3bf`, `1c5cad8bf7`; the goal change landed with the phase docs.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The tie and plan-only tests fail with their fixes reverted. Evidence: the two revert files under `scratch/`.
- [x] CHK-022 [P1] More than two tied same-mode intents sort by intent name. Evidence: the tie test ties three intents and asserts `A, B, C`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential path is read or written
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Each touched skill's changelog records its alignment fixes. Evidence: sk-code v3.10.0.0, sk-code-frontend v1.0.1.0, sk-create-skill v1.10.1.0, mcp-figma v1.2.0.0 and system-spec-kit v2.12.31.0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Alignment run folders live under `scratch/` and nothing writes outside the worktree. Evidence, with a deviation: the operator-local harness keeps its run state under `~/.local/state/local-skilled-alignment/`, its fixed location, so the reports are copied to `scratch/alignment-runs/`. Its worktree copy under `.skilled/commands/assets/local-lsa-worktree-copy` is gitignored and removed at close. No build wrote outside the worktree.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-03
<!-- /ANCHOR:summary -->

---
