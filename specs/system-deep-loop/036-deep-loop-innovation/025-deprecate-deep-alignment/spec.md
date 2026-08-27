---
title: "Feature Specification: Deprecate deep-alignment and Cascade to the Conformance-Benchmark Capability"
description: "Fully remove the deep-alignment deep-loop mode — command, agents, 126-file mode packet, dedicated + shared runtime code, registrations, and docs. deep-alignment turned out to be the shared conformance ENGINE behind /deep:command-benchmark and /create:benchmark's conformance axis, so per operator approval the removal cascades to those surfaces and the sk-create-benchmark conformance-benchmark family. Behavior/model/skill/agent-improvement benchmarks and the shared behavior-benchmark framework are preserved."
trigger_phrases:
  - "deprecate deep-alignment deep loop"
  - "remove conformance-benchmark command-benchmark cascade"
  - "deep-alignment shared conformance engine removal"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/025-deprecate-deep-alignment"
    last_updated_at: "2026-08-27T11:40:00.000Z"
    last_updated_by: "claude"
    recent_action: "Removed deep-alignment + command-benchmark + conformance; targeted gates green"
    next_safe_action: "Confirm whole-suite vitest; commit; push v4 + main"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/mode-registry.json"
      - ".opencode/commands/create/assets/create-benchmark-auto.yaml"
      - ".opencode/skills/sk-doc/sk-create-benchmark/SKILL.md"
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "deep-alignment is not a standalone mode; it is the shared conformance engine behind /deep:command-benchmark and /create:benchmark's conformance axis, so full removal cascades to them (operator-approved)."
      - "The advisor projection + command bridges + leaf-manifest are generated from mode-registry / command inventory, so editing the sources and regenerating keeps the CI drift-guards green."
---
# Feature Specification: Deprecate deep-alignment and Cascade to the Conformance-Benchmark Capability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3 | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-27 |
| **Source** | Operator directive: "deprecate deep-alignment completely — commands, related code, agent, references from readmes" |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 024-executor-kind-routing |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The operator asked to fully deprecate the `deep-alignment` deep-loop mode — command, agent, code, and README references. Auditing the footprint revealed that deep-alignment is **not a standalone mode**: its packet holds the shared conformance ENGINE (`scoping.cjs`, `check-convergence.cjs`, the peer adapters, the command-behavior matrix scheduler) that `/deep:command-benchmark` (which has no packet of its own) and `/create:benchmark`'s conformance axis both run on, and the `sk-doc/sk-create-benchmark` conformance-benchmark family authors inputs for. Removing deep-alignment therefore orphans those surfaces. The operator approved **cascading** the removal to the whole conformance-benchmark capability, keeping the other benchmark families (behavior, model, skill, agent-improvement) and the independent shared behavior-benchmark framework.

### Purpose

Remove the deep-alignment mode and its dependent conformance-benchmark capability cleanly and consistently across every surface — commands, agents, mode packet, dedicated and shared runtime code, all skill/advisor registration metadata, generated projections/bridges, and documentation — so nothing routes to, dispatches, or documents a mode/command/family that no longer exists, and the surviving modes and benchmark families keep working.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — Deleted

- **Command + assets**: `deep/alignment.md`, `deep/command-benchmark.md`, and their `deep-alignment-*` / `deep-command-benchmark-*` auto/confirm/presentation/legacy/compiled assets; `smoke-command-benchmark.cjs`.
- **Mode packet**: the 126-file `system-deep-loop/deep-alignment/` (engine, adapters, references, playbooks).
- **Agents**: `deep-alignment` in `.opencode`, `.claude`, `.codex`, `.cursor`, `.pi`, `.devin`.
- **Dedicated runtime**: `deep-alignment-ledger-schema/`, `deep-alignment-sealed-artifacts/`, `deep-alignment-reducers/`, `alignment-identity.cjs`, `reduce-alignment-state.cjs`, `deep-alignment-state-deltas-contract.ts`, `leaf-artifact-writer.ts`, and their tests.
- **Conformance family**: `sk-create-benchmark/assets/conformance-benchmark/`, `references/conformance-benchmark/`, and `references/shared/command-benchmark-composition.md`.

### In Scope — Surgically Edited (mode/family removed, other modes/families intact)

- ~25 shared runtime files (mode enums/unions, `append-mode-event` gateway, `shipped-census`, projection manifests, stopping-clocks, path-coverage, `compile-command-contracts`, the compiled-routing `registry-compiler.cjs` + canary).
- All system-deep-loop registration metadata (`mode-registry.json`, `hub-router.json`, `command-metadata.json`, `description.json`, `graph-metadata.json`, `leaf-manifest.json`) + the advisor routing projection (`aliases.ts`, `skill_advisor.py`) + command bridges (`projection.ts`, `command-bridges.generated.json`, `shadow-diff.md`) + `skill-graph.json`.
- `/create:benchmark` (conformance_benchmark family branch removed, mcp_promotion kept) + `sk-create-benchmark` SKILL/README/references + the family-registry test.
- ~50 docs (READMEs, SKILL/ROUTER, catalogs, cli rosters, agent templates) + sundry configs/fixtures.

### Out of Scope

- Behavior-benchmark, model-benchmark, skill-benchmark, agent-improvement families and the shared `system-deep-loop/shared/behavior-benchmark/` framework — all preserved.
- The `create/*` `@markdown` Phase-0 gate and `doctor/*`/`speckit/*` phase labels — unrelated to deep-alignment.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No surface routes to / dispatches / documents deep-alignment or command-benchmark | Grep for `deep-alignment`, `/deep:alignment`, `/deep:command-benchmark`, `conformance_benchmark`, `command-deep-alignment` returns 0 active files (historical benchmark reports + changelogs excluded). |
| REQ-002 | The surviving modes and benchmark families still work | Runtime removes alignment from shared enums without breaking review/research/ai-council/improvement; sk-create-benchmark keeps behavior/model/skill/agent families. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Generated metadata stays consistent with its sources | The advisor routing-projection, command bridges, and leaf-manifests are regenerated; routing-registry + bridge-resolution drift-guards pass. |
| REQ-004 | The family registry test passes with conformance removed | `test_create_benchmark_family_registry.py` PASSES for the surviving families. |
| REQ-005 | Compiled command contracts stay fresh | The 4th injection command (alignment) removed; the 3 remaining recompiled; `check-contract-drift` green. |
| REQ-006 | No new whole-suite regression | `run-node-tests.mjs` and the runtime vitest suite show no new code-caused failures vs baseline. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 0 active refs to the removed mode/command/family across `commands/` + `skills/`.
- **SC-002**: `test_create_benchmark_family_registry.py` PASS; routing-registry + command-bridge drift-guards PASS; `check-contract-drift` PASS.
- **SC-003**: Both whole-suite gates show no new failures vs baseline (the 3 pre-existing registry-compiler identity-resolution failures fail at HEAD too).

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Shared-runtime surgery with no typecheck | A missed alignment reference breaks a surviving mode | The vitest + node:test suites exercise the shared code and are the safety net; census-derived counts (8→7 modes) updated consistently. |
| Risk | Generated metadata drifting from hand-edited sources | Advisor routes to a dead mode; CI drift-guard fails | mode-registry is the source; the advisor projection + bridges + leaf-manifests are regenerated from it; drift-guards run green. |
| Risk | Cascade scope larger than the literal ask | Orphaned conformance tooling if only deep-alignment is removed | Operator approved the cascade after the engine-not-standalone finding was surfaced. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The 3 `deep-loop-registry-compiler` identity-resolution tests fail at HEAD (pre-existing, unrelated to this removal — the compiler's `ROUTER_RESOURCE_NOT_IN_MANIFEST` check fires before `PACKET_NOT_FOUND` on an injected bad packet). Left as a separate pre-existing item.

<!-- /ANCHOR:questions -->
