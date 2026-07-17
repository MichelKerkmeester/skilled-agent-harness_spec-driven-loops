---
title: "Feature Specification: inventory and frozen rename map (032 phase 006)"
description: "Before any rename, the in-scope surface must be frozen into a fully-classified rename map partitioned by dependency closure, pinned to the CURRENT migration tip (not the authoring SHA). Every candidate is classified exactly once (rename/exempt/frozen/generated/tool-mandated) with no 'unknown' bucket; rename entries carry a pending vs already-applied disposition because concurrent v4 work has landed part of the surface (the sk-git kebab pilot). The map is hashed with BASE so execution is reproducible, and the generated .codex/prompts surface is in scope, classified generated."
trigger_phrases:
  - "inventory and frozen rename map"
  - "hyphen naming phase 006"
  - "kebab-case inventory and"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added executable per-batch touch-sets and the epochal map cadence to phase 006"
    next_safe_action: "Materialize executable batches with touch-sets; pin the epoch and classify .codex"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Inventory and frozen rename map

> Phase adjacency under the 032 parent (grouping order, not a runtime dependency): predecessor `005-rename-and-reference-tooling`; successor `007-shared-and-cross-cutting-closures`.

> **RECONCILED — v4 reconciliation (2026-07-15).** Two authoring-time assumptions no longer hold and this phase absorbs the correction: (1) **BASE is not the authoring structure SHA.** The frozen map and its digest must pin to the **current migration tip at execution time**, because concurrent v4 work has already landed part of the in-scope surface (the sk-git kebab pilot: references, assets, manual-testing-playbook). Those entries satisfy the invariant in the ALREADY-APPLIED direction (source absent, target present) and must carry an explicit `already-applied` disposition instead of being flagged as missing sources. (2) **The generated `.codex/prompts/` surface is now in scope**, produced by `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs` and classified `generated` — naming is corrected at the producer, never by hand-renaming outputs; two known snake regressions (`agent_router.md`, `goal_opencode.md`) are flagged for a producer fix. Full inventory: the packet's v4-reconciliation-inventory.md.

> **EXECUTABLE-DAG + EPOCHS — execution-readiness reconciliation (2026-07-15).** Because the base keeps moving under concurrent sessions, the frozen map is not a one-shot snapshot: it must be (a) **executable** — every batch carries a complete touch-set (source/target, static reference sites, dynamic-reference dispositions, symlink endpoints, producer manifests, read/write sets, and dependency + batch hashes) sufficient for deterministic replay and the phase 005/004 compare-and-swap executor — and (b) **epochal** — each pin is an immutable epoch, and a post-pin candidate (e.g. the late `conformance_benchmark` family) issues a new epoch over only the affected subgraph rather than escaping the map. The re-pin/epoch cadence, drift census, and reconciliation rules live in the packet's execution-parallelization-strategy.md; this phase owns producing the executable batches and the epoch record.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 006 of the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Before any rename, the in-scope surface must be frozen into a bijective, fully-classified rename map partitioned by dependency closure. Every candidate must be classified exactly once (rename/exempt/frozen/generated/tool-mandated) with no "unknown" bucket, and the map hashed with BASE so execution is reproducible. Because the base moves under concurrent sessions, the map is materialized as an EXECUTABLE dependency-graph: each batch carries a complete touch-set so a drifted batch can be regenerated deterministically, and the pin is an immutable epoch that can be reissued over only an affected subgraph when a new candidate appears.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A full repo inventory (recomputed independently of 000) with every exemption applied, taken against the CURRENT migration tip.
- A source->target rename map where each rename entry is either pending (source exists, target absent) or already-applied on v4 (source absent, target present); no entry is both-present or both-absent.
- A complete classification: every candidate is exactly one of rename/exempt/frozen/generated/tool-mandated; no "unknown". Rename entries additionally carry a pending vs already-applied disposition.
- The generated `.codex/prompts/` surface classified `generated` (regenerate from `sync-prompts.cjs`, never hand-rename outputs); the two snake regressions (`agent_router.md`, `goal_opencode.md`) flagged for a producer fix.
- Partition into dependency-closed batches (reference-graph SCCs), hashed together with BASE pinned to the current migration tip.
- An executable per-batch touch-set: source/target paths, static reference sites, dynamic-reference dispositions, symlink endpoints, producer manifests, read/write sets, and dependency + batch hashes, sufficient for deterministic replay and the phase 005/004 compare-and-swap executor.
- An epochal frozen map: each pin is an immutable epoch record (epoch id, map-base SHA, parent-epoch hash, candidate-set hash, graph hash), re-pinned on the strategy's cadence so a post-pin candidate issues a new epoch over only the affected subgraph.

### Out of Scope
- Performing the renames (007+).
- Tooling construction (004/005).
- Fixing the `sync-prompts.cjs` producer itself (that is 013-commands / 008/008-scripts scope); 006 only classifies and flags.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The inventory counts only in-scope names with every exemption applied | Vendored/.py/package-dir/generated/tool-mandated names are excluded |
| REQ-002 | The rename map accounts for already-applied entries | Each rename entry is either pending (source exists, target unique and absent) or already-applied on v4 (source absent, target present); no entry is both-present or both-absent, and no already-applied entry is flagged as a missing source |
| REQ-003 | Every candidate has exactly one classification with no "unknown" bucket | The classification report has 0 un-classified candidates; rename entries additionally record a pending/already-applied disposition |
| REQ-004 | Batches are dependency-closed (reference-graph SCCs) | No batch references a rename in another un-landed batch |
| REQ-005 | The map is hashed together with the CURRENT-tip BASE for reproducibility | A stored digest binds the map to the migration-tip BASE SHA (not the authoring structure SHA) |
| REQ-006 | The generated `.codex/prompts/` surface is classified, not hand-renamed | Every `.codex/prompts/*` name is classified `generated`; the fix path is the `sync-prompts.cjs` producer, and the 2 snake regressions (`agent_router.md`, `goal_opencode.md`) are flagged for a producer fix rather than a manual rename |
| REQ-007 | Already-applied surfaces are reconciled against the current tip | The sk-git kebab-pilot surfaces (references, assets, manual-testing-playbook) are recorded `already-applied` and excluded from the pending-rename batches |
| REQ-008 | Every batch carries a complete executable touch-set | Each batch records source/target paths, static reference sites, dynamic-reference dispositions, symlink endpoints, producer manifests, read/write sets, and dependency + batch hashes — enough to replay and compare-and-swap without re-deriving the map |
| REQ-009 | The frozen map is epochal, not a one-shot snapshot | Each pin is an immutable epoch record (epoch id, map-base SHA, parent-epoch hash, candidate-set hash, graph hash); a post-pin candidate or new reference edge issues a successor epoch that recomputes only the affected subgraph, and no new candidate escapes classification |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A trustworthy, frozen, fully-classified rename map exists, pinned to the current migration tip, with pending vs already-applied dispositions recorded.
- **SC-002**: Execution batches are dependency-closed and reproducible, and exclude already-applied surfaces.
- **SC-003**: The generated `.codex/prompts/` surface is classified `generated` with producer-fix flags, not enqueued for manual rename.
- **SC-004**: Every batch is executable (complete touch-set + batch hash) and the pin is an immutable epoch record; a post-pin candidate reissues only its affected subgraph.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 032 parent spec (import breakage, validator downgrade, non-reproducible builds,
over-broad sweep, exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; resolved during this phase's execution against the pinned baseline. Note: BASE is the current migration tip at execution time, not the authoring structure SHA, so the already-applied v4 surfaces reconcile cleanly.
<!-- /ANCHOR:questions -->
