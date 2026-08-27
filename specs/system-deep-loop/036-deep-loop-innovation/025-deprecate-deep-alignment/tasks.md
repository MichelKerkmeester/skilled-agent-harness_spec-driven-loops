---
title: "Task Breakdown: Deprecate deep-alignment and Cascade to the Conformance-Benchmark Capability"
description: "The ordered task list executing the deep-alignment deprecation cascade — audit, delete self-contained units, surgically edit shared runtime, cascade the conformance-benchmark family, regenerate derived metadata, and verify against a captured baseline."
importance_tier: "medium"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/025-deprecate-deep-alignment"
    last_updated_at: "2026-08-27T11:40:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the task list; Phase 1-3 tasks complete except the push"
    next_safe_action: "Confirm whole-suite vitest; commit; push v4 + main"
---
# Task Breakdown: Deprecate deep-alignment and Cascade to the Conformance-Benchmark Capability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` pending. Each task is a single verifiable action.
- IDs are `T-<phase><nn>`; phase order is Setup → Implementation → Verification.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Grep-inventory every `deep-alignment` / `/deep:alignment` / `command-benchmark` / `conformance_benchmark` / `command-deep-alignment` surface.
- [x] T-002 Classify each hit: self-contained (delete) vs shared (edit) vs derived (regenerate) vs historical (leave).
- [x] T-003 Confirm the cascade: `/deep:command-benchmark` runs on the deep-alignment engine; the conformance family authors its inputs.
- [x] T-004 Capture whole-suite baseline (node:test 767/17; the 5 pre-existing runtime vitest failures).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-101 `git rm` the 126-file `system-deep-loop/deep-alignment/` mode packet.
- [x] T-102 `git rm` dedicated runtime libs/scripts/tests (`deep-alignment-*`, `alignment-identity.cjs`, `reduce-alignment-state.cjs`, `leaf-artifact-writer.ts`).
- [x] T-103 `git rm` commands `deep/alignment.md` + `deep/command-benchmark.md` + their assets + `smoke-command-benchmark.cjs`.
- [x] T-104 `git rm` the 6 `deep-alignment` agents across runtimes.
- [x] T-105 `git rm` conformance-benchmark family assets/references + `command-benchmark-composition.md`.
- [x] T-106 Strip alignment from the `append-mode-event` gateway (2 imports + 3 mode branches).
- [x] T-107 Strip alignment from the remaining ~24 shared runtime files (enums/unions/census/manifests/stopping-clocks/path-coverage/registry-compiler + canary) and the `dispatch-guard.cjs` LOOP_EXECUTOR_AGENTS set.
- [x] T-108 Remove the alignment mode object from `mode-registry.json` + clean the backendKind description.
- [x] T-109 Cascade: strip `conformance_benchmark` from `create-benchmark-*.yaml` (keep `mcp_promotion`).
- [x] T-110 Cascade: strip conformance from `sk-create-benchmark` SKILL/README/references + the family-registry test.
- [x] T-111 Remove alignment + command-benchmark from `hub-router.json`, `command-metadata.json`, advisor `projection.ts` / `skill_advisor.py` / bridges / `skill-graph.json`.
- [x] T-112 Regenerate advisor routing-projection, leaf-manifest, compiled command contracts, packet `description.json` / `graph-metadata.json`.
- [x] T-113 Sweep ~50 docs (READMEs, SKILL/ROUTER, catalogs, cli rosters, agent rosters, root README).

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-201 Grep sweep → 0 active refs (historical excluded).
- [x] T-202 `test_create_benchmark_family_registry.py` → PASS (surviving families).
- [x] T-203 Advisor `routing-registry-drift-guard` + `command-bridge-resolution-guard` → PASS.
- [x] T-204 `check-contract-drift` → PASS.
- [x] T-205 Whole-suite node:test + vitest → no NEW failures vs baseline.
- [x] T-206 `validate.sh <spec-folder> --strict` → Errors: 0.
- [ ] T-207 Commit + push to v4 and main (operator checkpoint before push).

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- All Phase 1-3 tasks except T-207 (the operator-gated push) are `[x]` with evidence.
- The two whole-suite gates are baseline-compared with no NEW failures.
- `validate.sh --strict` returns Errors: 0.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements REQ-001..006 and success criteria SC-001..003.
- `plan.md` — the delete-then-regenerate architecture and rollback plan.
- `implementation-summary.md` — the final change footprint and verification evidence.

<!-- /ANCHOR:cross-refs -->
