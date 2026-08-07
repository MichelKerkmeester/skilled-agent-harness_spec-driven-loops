---
title: "Feature Specification: sk-doc skill-routing refactor — routing correctness across the skill fleet"
description: "Phase parent for the sk-doc skill-routing program: router audits, create-* conformance, benchmark and typed-pair fixes, a shared research layer, the fleet-wide router-unification program, and the documentation-quality program."
trigger_phrases:
  - "019-skill-routing-refactor"
  - "sk-doc skill routing refactor"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: sk-doc skill-routing refactor — routing correctness across the skill fleet

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-13 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None |
| **Parent Packet** | None (top-level under the `sk-doc` track) |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child phase is the source of truth for its slice of routing; routing behavior is measurable on the canonical typed-pair surface for every instrumented hub; the fleet router-unification program's compiled-routing runtime serves byte-identically to legacy with a reversible kill-switch; and the documentation-quality program's remediation closes out |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Routing across the skill fleet was neither uniform nor measurable. It began as a narrow sk-doc concern — the ten `create-*` creation packets did not present a consistent routing contract against the create-skill standard — but the same defect recurred fleet-wide: hubs could not be measured on a canonical typed-pair surface, router configuration drifted between skills, and no runtime made compiled routing authoritative without coupling the serving path to the mutable spec tree. In parallel, the skill tree had drifted from sk-doc's own documentation standards.

### Purpose
Make routing correct, measurable, and consistent across the skill fleet, and restore documentation conformance. Concretely: give each `create-*` packet a uniform routing contract; root-cause and fix the benchmark-measurable routing defects for sk-doc and the skill-advisor; instrument per-hub routing on the typed-pair surface across the fleet; run the fleet-wide router-unification program that standardizes routing config and promotes a compiled-routing runtime that serves byte-identically to legacy behind a reversible flag; and run the documentation-quality program that returns the tree to sk-doc's standards.

> **Phase-parent note:** This spec.md documents root purpose and the sub-phase list only — all detailed planning, tasks, checklists, decisions, and continuity live in the child phase folders below. The parent level also carries three companion docs (never heavy per-phase docs): `context-index.md` (folder provenance + structural history) and the two routing references `routing-config-and-advisor-reference.md` and `routing-before-after.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Group A — Router audit and fixes (002-005):** audit the routing sources, resolve trigger collisions and ownership, scope triggers and correct sibling handoffs, and standardize packet shape with synchronized router projections.
- **Group B — create-skill routing conformance (006-010):** document each flat-resource packet's smart-routing posture, analyze the residual router-marker gap, close hub keyword-coverage and benchmark-routing gaps, and normalize packets to the create-skill canon.
- **Group C — Benchmark and typed-pair routing fixes (011-014):** implement the sk-doc and skill-advisor fixes, wire typed gold through the benchmark harness, and run the sk-code measurement pilot.
- **Group D — Research layer (`001-research`):** hold the eleven research lineages covering sk-doc, skill-advisor, sk-code, the per-hub surfaces, defaultMode policy, out-of-box alternatives, and unified-router design.
- **Group E — Router-unification program (015):** a nested program standardizing fleet routing config, resolving the defaultMode policy, and designing plus implementing the unified router — including the promoted compiled-routing runtime.
- **Group F — Documentation-quality program (016):** a nested program restoring the skill tree to sk-doc's documentation standards across metadata, templates, READMEs, tooling, and validators.

### Out of Scope
- Any change outside routing correctness/measurement, the router-unification runtime, and documentation quality.
- Rewriting historical research, benchmark, or lineage artifacts.
- Committing the fleet compiled-routing cutover as a default is owned by Group E (`015`), not this parent. (That cutover is now complete — default-on for all seven hubs via `servingAuthority: compiled` manifests, reversible via the `SPECKIT_COMPILED_ROUTING=0` kill-switch.)

### Files to Change
Aggregate scope; per-phase detail lives in child plans.

| File Path | Change Type | Group | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/create-*/SKILL.md` and `.opencode/skills/sk-doc/{mode-registry.json,hub-router.json}` | Modify | A, B | Routing contracts, sibling handoffs, and synchronized router projections |
| `.opencode/skills/<hub>/**` routing surfaces + typed-pair benchmark fixtures | Modify | C, D | Path-contract fixes, advisor fixes, and typed-gold measurement wiring |
| `.opencode/bin/lib/compiled-routing/**` and the authored source under `015-router-unification-program/**` | Modify | E | The promoted compiled-routing runtime and its authored source |
| Skill/mode READMEs, metadata, templates, and doc validators across the tree | Modify | F | Documentation-quality remediation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Phased decomposition. Each phase is an independently executable child spec folder; all implementation detail lives inside the phase children. The direct tree is `001-research` plus numbered phases `002`–`016`, grouped into six narrative workstreams (A-F).

| Phase | Group | Focus | Status |
|-------|-------|-------|--------|
| 001-research | D | Research parent for eleven routing lineages spanning benchmark, per-hub, sk-code, defaultMode, out-of-box, and unified-refactor questions | Research layer |
| 002-router-audit-and-fix-map | A | Audit the routing sources, baseline the queries, and map the prioritized fixes before edits | Complete |
| 003-router-collision-fixes | A | Move existing-document audit/validation ownership from README/flowchart creators to quality control | Complete |
| 004-trigger-scoping-and-handoffs | A | Remove broad selector tokens and replace vague exclusions with exact sibling handoffs | Complete |
| 005-router-standardization-and-regen | A | Standardize packet trigger/handoff shapes and synchronize both router JSON projections with zero drift | Complete |
| 006-create-skill-smart-routing-notes | B | Document honest smart-routing postures for flat-resource packets instead of force-fitting keyed discovery | Complete |
| 007-create-skill-router-marker-gap | B | Analyze the residual router-marker warnings and frame the keep-N/A-versus-wire decision from live evidence | Research; decision pending |
| 008-hub-intent-keyword-coverage | B | Add artifact-noun keyword coverage so agent/changelog prompts avoid generic create-skill tie-breaking | Complete |
| 009-create-benchmark-routing-fix | B | Swap a redundant benchmark alias for `benchmark package` across synced surfaces under the word cap | Complete |
| 010-create-packet-routing-conformance | B | Normalize the flat-resource packets to the canonical create-skill contract so `package_skill.py --check` passes | Complete |
| 011-sk-doc-routing-fixes | C | Enforce the canonical typed leaf-resource contract across sk-doc routing, fixtures, replay, and doctrine | Planned |
| 012-skill-advisor-routing-fixes | C | Repair advisor correctness, calibration measurement, discovery guards, and transport diagnostics | Planned |
| 013-benchmark-harness-typed-wiring | C | Wire typed routing through dispatch and blind benchmarks behind offline+live gates before propagation | Planned |
| 014-sk-code-router-alignment | C | Pilot typed-gold derivation, refresh sk-code's baseline, and establish a reusable fan-out recipe | In progress |
| 015-router-unification-program | E | Fleet router-unification: 3-tier config standard, defaultMode policy, and the unified compiled-routing runtime (reversible, route-gold-gated) | Active (nested program) |
| 016-documentation-quality-program | F | Restore documentation conformance across metadata, templates, READMEs, tooling, and validators, plus review remediation | In progress (nested program) |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently. Within the sequential workstreams, Groups A→B and research→Group C fixes are dependency-ordered; Groups E and F run concurrently. The grouping is per-workstream, not a single global sequence.
- The parent tracks aggregate progress via this map; run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.
- Groups E and F are nested sub-programs with their own children; resume them at their own parent spec.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 002-router-audit-and-fix-map | 003-router-collision-fixes | Exact fix map and before-state recorded | Phase 002 plan/tasks contain the fix map |
| Group A (002-005) | Group B (006-010) | Registries synchronized with zero drift; every packet has a documented smart-routing posture | Extractor drift check + `package_skill.py --check` |
| Research `001-research/001-002` | Group C fixes (011-013) | Root causes recorded with dependency-ordered fix plans | Research child fix plans |
| Research `001-research/003-006` | Group C pilot (014) | Typed-pair measurement plan and typed-gold seed recorded | Per-hub research docs |
| Group C pilot (014) | Later per-hub implementation | Reusable typed-gold derivation recipe + refreshed sk-code baseline | 014 implementation-summary |
| Groups E, F (015, 016) | (nested) | Each nested program gates internally at its own parent spec | `015/spec.md`, `016/spec.md` |
| All workstreams (A–F) | Parent closeout | Every workstream meets its §1 Handoff Criteria | `validate.sh --recursive` + per-workstream evidence |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The create-skill router-marker posture for the flat-resource packets (Group B) — the keep-N/A-versus-wire decision framed in child `007-create-skill-router-marker-gap`.
- The fleet compiled-routing cutover is now **default-on** for all seven eligible hubs (activation manifests flipped to `compiled`; unset `SPECKIT_COMPILED_ROUTING` serves compiled), reversible via the `=0` kill-switch; the formal default-on decision is recorded in `015/016-default-on-decision`.
<!-- /ANCHOR:questions -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm the active child phase and its allowed files.
- Read source files before editing.
- Preserve historical research/benchmark/lineage artifacts unchanged.

### Execution Rules
| Rule | Required Behavior |
|---|---|
| Scope | Write only to the approved files for the active child phase |
| Source | Treat committed route-gold and packet contracts as authoring truth |
| Verification | Run package, drift, routing, typed-benchmark, and spec gates for the active phase |

### Status Reporting Format
Report phase, changed files, verification commands, results, and blockers.

### Blocked Task Protocol
Stop the blocked gate, preserve verified work, record the exact error, and never write to a banned path to bypass it.

---

## RELATED DOCUMENTS

- **Phase children**: the `001-research` parent plus the fifteen numbered child folders above hold per-phase canonical docs.
- **Provenance & rename history**: see `./context-index.md` for the folder-history bridge and the old→new rename map.
- **Parent Spec**: none — this is a top-level packet on the `sk-doc` track.
