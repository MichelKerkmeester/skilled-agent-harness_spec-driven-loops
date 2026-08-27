---
title: "Implementation Summary: Deprecate deep-alignment and Cascade to the Conformance-Benchmark Capability"
description: "Final state of the deep-alignment deprecation: the mode packet, dedicated + shared runtime, both commands, 6 agents, and the dependent conformance-benchmark capability (/deep:command-benchmark + the sk-create-benchmark conformance family) removed across ~280 changed files; every derived projection regenerated; the surviving four benchmark families and all other deep-loop modes verified intact against a captured whole-suite baseline."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/025-deprecate-deep-alignment"
    last_updated_at: "2026-08-27T14:05:00.000Z"
    last_updated_by: "claude"
    recent_action: "Whole-suite vitest clean (6 pre-existing, 0 new); 3 regressions fixed; handed off to coordinator"
    next_safe_action: "Coordinator stages + commits + pushes v4 + main"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/mode-registry.json"
      - ".opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts"
      - ".opencode/skills/sk-doc/sk-create-benchmark/SKILL.md"
    completion_pct: 98
    open_questions: []
    answered_questions:
      - "deep-alignment is the shared conformance engine behind /deep:command-benchmark and /create:benchmark's conformance axis; removing it cascades to those surfaces and the conformance-benchmark family (operator-approved)."
      - "Derived metadata (advisor projection, command bridges, leaf-manifests, compiled contracts) is regenerated from hand-edited sources so the CI drift-guards validate the final state."
---
# Implementation Summary: Deprecate deep-alignment and Cascade to the Conformance-Benchmark Capability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete (pending operator push checkpoint) |
| **Change footprint** | 174 deletions + 110 modifications (tracked) + new packet docs |
| **Predecessor** | 024-executor-kind-routing |
| **Rollback** | `git revert <commit>` — clean removal, no data migration |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

This packet REMOVES rather than builds. The `deep-alignment` deep-loop mode is fully gone, and — per operator approval after the engine-not-standalone finding was surfaced — the removal cascaded to the dependent conformance-benchmark capability. Nothing routes to, dispatches, or documents `deep-alignment`, `/deep:alignment`, `/deep:command-benchmark`, or the `conformance_benchmark` family. The other four deep-loop modes (research, review, ai-council, agent-improvement) and the surviving benchmark families (behavior, model, skill, agent-improvement) plus `mcp_promotion` are intact and verified against a captured whole-suite baseline.

### Files Changed

**Deleted (self-contained units)**

- **Mode packet** — the 126-file `system-deep-loop/deep-alignment/` (engine `scoping.cjs` / `check-convergence.cjs`, peer adapters, matrix scheduler, references, playbooks).
- **Dedicated runtime** — `deep-alignment-ledger-schema/`, `deep-alignment-sealed-artifacts/`, `deep-alignment-reducers/`, `alignment-identity.cjs`, `reduce-alignment-state.cjs`, `deep-alignment-state-deltas-contract.ts`, `leaf-artifact-writer.ts`, and 4 dedicated tests.
- **Commands** — `deep/alignment.md`, `deep/command-benchmark.md`, all their auto/confirm/presentation/legacy/compiled assets, `smoke-command-benchmark.cjs`.
- **Agents** — `deep-alignment` in `.opencode`, `.claude`, `.codex`, `.cursor`, `.pi`, `.devin`.
- **Conformance family** — `sk-create-benchmark/{assets,references}/conformance-benchmark/`, `references/shared/command-benchmark-composition.md`.

**Surgically edited (mode/family removed, others intact)**

- **Shared runtime** — the `append-mode-event` gateway (2 alignment imports + 3 `mode === 'deep-alignment' || 'alignment'` branches); mode enums/unions; `shipped-census` (8→7 modes); projection manifests; stopping-clocks; path-coverage; `compile-command-contracts`; the compiled-routing `registry-compiler.cjs` (alignment RUNTIME_KEY_COLLAPSE check) + `canary-cases.v1.json` (`single-alignment` case).
- **Harness guard** — `dispatch-guard.cjs` `LOOP_EXECUTOR_AGENTS` drops `deep-alignment`; the two guard tests drop the alignment cases.
- **Registrations** — `mode-registry.json`, `hub-router.json`, `command-metadata.json`, `description.json`, `graph-metadata.json`, `leaf-manifest.json`.
- **Advisor** — `projection.ts`, `skill_advisor.py`, `command-bridges.generated.json`, `shadow-diff.md`, `skill-graph.json`.
- **Benchmark-family cascade** — `create-benchmark-auto.yaml` / `create-benchmark-confirm.yaml` (`conformance_benchmark` stripped, `mcp_promotion` kept); `sk-create-benchmark` SKILL/README/references; `test_create_benchmark_family_registry.py`.
- **Docs** — ~50 READMEs, SKILL/ROUTER files, catalogs, cli rosters, agent rosters, root `README.md`.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delete-then-regenerate, in the order audit → delete → surgically edit → regenerate → verify. Deletions came first so the compiler and test failures pinpointed the exact shared references still needing edits. Derived metadata (advisor routing-projection, leaf-manifest, compiled command contracts, packet `description.json` / `graph-metadata.json`) was regenerated from its now-edited sources last, so the CI drift-guards validated the final removed state rather than an intermediate one.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Cascade the removal.** deep-alignment is the shared conformance engine, not a standalone mode. Removing it without removing `/deep:command-benchmark` and the conformance-benchmark family would leave those surfaces dispatching to a deleted engine. The operator approved the cascade after the finding was surfaced, so all three ship together.
- **Tests as ground truth.** The shared-runtime surgery has no typecheck gate, so the dual whole-suite suites (node:test + runtime vitest), baseline-compared, are the authoritative safety net; the targeted drift-guards prove the derived metadata matches its regenerated sources.
- **Regenerate, never hand-edit derived metadata.** `mode-registry.json` is the source; the advisor projection, bridges, leaf-manifest, and compiled contracts are regenerated so no projection silently drifts. The compiled command contracts additionally record a `sha256` of `SKILL.md`, so editing `SKILL.md` in the doc sweep required re-running `compile-command-contracts.cjs --write` for the 3 surviving commands — missed on the first pass, caught by `check-contract-drift`.
- **Legacy-projection removal was forced, not optional.** The alignment legacy-projection contract imports the deleted `deep-alignment-ledger-schema`, so it is coupled to the deleted mode and cannot be retained (a restore experiment produced a dangling import that broke the whole legacy-projections module load and cascaded to the gateway tests). The removal was therefore completed across the manifest, `index.ts`, the contract, the frozen packet-001 census (3 JSON-bearing rows), and the test counts — the minimal edit the runtime `census == manifest` invariant forces.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

A fresh whole-suite vitest surfaced **3 real regressions** that earlier targeted-gate re-runs (based on a stale background run) had masked. All three are diagnosed and fixed; the table records the FINAL state.

| Gate | Command | Result |
|------|---------|--------|
| No active references | `rg 'deep-alignment\|/deep:command-benchmark\|conformance_benchmark'` (excl. historical) | 0 active files |
| Family registry parity | `python3 test_create_benchmark_family_registry.py` | PASS (5 surviving families) |
| Advisor drift-guards | `routing-registry-drift-guard` + `command-bridge-resolution-guard` | 13/13 PASS |
| Contract drift (FIXED) | `check-contract-drift` + `render-command-contract` | 24/24 PASS after regenerating the 3 surviving compiled contracts (see Key Decisions) |
| Legacy-projection census (FIXED) | `legacy-projections.test.ts` + `append-mode-event` | 28/28 PASS after completing the census + test removal |
| Whole-suite node:test | `run-node-tests.mjs` | 715 pass / 16 fail — stable, no new failures (baseline 767/17; fewer tests because alignment tests were deleted; `contracts cover every command topology` now green) |
| Whole-suite vitest | `npx vitest run` (runtime) | 6 failed / 146 passed (152 files); 6 failed / 2498 passed / 7 skipped (2511 tests) — all 6 failing files pre-existing (0 alignment refs each); the 3 regressions fixed and absent; delta 11→6 vs the stale run |
| Packet validate | `validate.sh <spec-folder> --strict` | Errors: 0, Warnings: 0, PASSED |

**Confirmed vs inferred**: the deletions/edits (git status 174 D + 110 M), the family-registry PASS, the advisor drift-guards, the regenerated-contract PASS (24/24), the legacy-projections PASS (28/28), the node:test 715/16 delta, and the fresh whole-suite vitest (6 pre-existing failures, 0 new) were each run and their exit status read. The 3 `deep-loop-registry-compiler` identity failures are confirmed pre-existing (fail at HEAD via a clean-tree check). The 6 remaining vitest failures are the timing-sensitive stress/ledger family (ledger-stem stress, lineage stress, concurrency serialization, graphless-STOP integration), each verified alignment-free; two that flaked in the contended stale run (`fanout-run`, `agent-improvement-ledger-schema`) passed cleanly in the sole fresh run.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- The 3 `deep-loop-registry-compiler` identity-resolution tests fail at HEAD (the compiler's `ROUTER_RESOURCE_NOT_IN_MANIFEST` check fires before `PACKET_NOT_FOUND` on an injected bad packet). Pre-existing and unrelated to this removal; left as a separate item.
- **Frozen-baseline scope call (surface to operator):** this edits a frozen sibling-packet research artifact — `001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json` — removing the 3 JSON-bearing alignment rows. The edit is forced by the runtime `census == manifest` invariant (the manifest cannot keep alignment once its ledger-schema is deleted) and precedented (git history shows prior "census drift" fixes). Left untouched: the non-JSON alignment rows (`alignment-control`, `alignment-workdirs`), the historical `discovery.discoveredBackendIds` list, and the frozen `event-streams.json` fixture — none are runtime-coupled.
- **Staging hygiene:** the worktree carries `runtime/database/council-graph.sqlite` with test-induced drift (the vitest runs write it) and ~59 untracked deep-loop run artifacts from sibling packets (012/014/016) plus other `*.sqlite` / `*.jsonl`. Restore the sqlite drift and stage explicitly (the tracked deprecation changes + the 025 folder); do NOT stage any `*.sqlite` / `*.jsonl` or the sibling run artifacts.
- v4 (`skilled/v4.0.0.0`) and `main` have advanced during this session; rebase/cherry-pick onto the current tips at push time and re-verify no file overlap.

<!-- /ANCHOR:limitations -->
