---
title: "Tasks: Deterministic Single-Executor Dispatch for cli-cursor/devin/pi"
description: "Task breakdown for adding deterministic per-kind branches to the single-executor path of the three auto loop YAMLs."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/024-executor-kind-routing"
    last_updated_at: "2026-08-27T09:10:00.000Z"
    last_updated_by: "claude"
    recent_action: "Branches inserted + proven; tasks complete pending whole-suite gates"
    next_safe_action: "Run whole-suite gates; commit"
---
# Tasks: Deterministic Single-Executor Dispatch for cli-cursor/devin/pi

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Trace the single-executor dispatch model: `phase_main_loop` `branch_on` is per-iteration; fan-out CLI lineages are whole-loop
- [x] T002 Confirm `buildLineageCommand` is exported from `fanout-run.cjs` and `require`-safe (guarded main)
- [x] T003 Confirm the cursor/devin/pi adapters read only `options.env`/`options.cwd` (safe standalone reuse)
- [x] T004 Map each YAML's executor field (`config.executor.kind` vs `config.executor.type`), dispatchId prefix, and insertion boundary

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Prove the reuse: `buildLineageCommand` yields `cursor-agent`/`devin`/`pi` with the prompt wired, and throws on a disallowed model
- [x] T006 Insert `if_cli_cursor/devin/pi` into `deep-review-auto.yaml` (field `config.executor.kind`, dispatchId `review`)
- [x] T007 Insert the three branches into `deep-research-auto.yaml` (field `config.executor.type`, dispatchId `research`)
- [x] T008 Insert the three branches into `deep-alignment-auto.yaml` (field `config.executor.kind`, dispatchId `alignment`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 All three YAMLs parse (`python yaml.safe_load`)
- [x] T010 Stubbed end-to-end run of the inserted body dispatches `cursor-agent` with the right dispatchId; disallowed model fails loud before dispatch
- [x] T011 Targeted auto-YAML vitest tests pass (`run-now-yaml-control`, `fanout-merge`, et al. — 71/71)
- [x] T012 Both whole-suite gates: no new code-caused failures vs baseline (`run-node-tests.mjs` 767 pass / 17 fail == baseline; a `git stash` baseline run shows the 5 vitest stress/integration failures fail on the clean tree too)
- [x] T013 `validate.sh <packet> --strict` clean (0 errors / 0 warnings); reconcile docs

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Three branches in each of the three auto YAMLs; all parse
- [x] Dispatch proven per kind; fail-loud negative control proven
- [x] No new whole-suite regression on either gate
- [x] Docs validated

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: `../spec.md`

<!-- /ANCHOR:cross-refs -->
