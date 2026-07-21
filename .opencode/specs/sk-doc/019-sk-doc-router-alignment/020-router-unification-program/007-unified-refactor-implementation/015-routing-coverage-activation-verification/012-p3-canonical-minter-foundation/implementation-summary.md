---
title: "Implementation Summary: P3 Canonical Manifest Minter Foundation"
description: "Planned-state record for the minimal shared minter and freshness foundation. No runtime implementation, manifest, routing decision, or scorer file was changed by this documentation phase."
trigger_phrases:
  - "canonical minter planned summary"
  - "manifest freshness current status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/012-p3-canonical-minter-foundation"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned-state minter foundation packet"
    next_safe_action: "Implement the shared module and verify routing remains unchanged"
    blockers:
      - "The canonical minter, freshness predicate, and tests are not implemented."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-21-canonical-minter-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Refresh and data-driven serving ownership remain future decisions."
    answered_questions:
      - "The 006 compiler core is reusable; its hardcoded harness is not."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify + level3-architecture | v2.2 -->
# Implementation Summary: P3 Canonical Manifest Minter Foundation

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Date** | 2026-07-21 |
| **Level** | 3 |
| **Implementation** | Not started |
| **Consumer** | `../../013-create-skill-alignment/` |
| **Routing impact** | None; documentation only |
| **Strict validation** | Authoring gate runs after metadata; implementation gate remains pending |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No runtime behavior was built in this documentation phase. The packet specifies the missing shared contract that a later implementation phase must deliver.

The authored planning artifacts are `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and this planned-state record.

### Planned Foundation

The planned module will compile a newly generated registry-driven parent hub through the existing generic 006 compiler, create one inert V1 activation manifest at the promoted canonical path, and recompile current inputs to decide exact freshness. A JSON CLI lets create-skill call that contract without reproducing CommonJS logic in Python.

Status will expose the predicate separately from serving authority. Runtime sync will preserve the exact bytes of valid new-hub manifests. Resolver decisions, fixed eligibility and dispatch maps, default-on cohorts, and frozen benchmark scorers remain outside the change.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The design was derived from the shipped compiler, per-hub build harnesses, activation manifest shape, runtime sync, status probe, engine dispatch, the default-on decision record, and packet 013's dependency contract. The compiler core can be reused. The hardcoded harness and runtime hub maps cannot serve as a general new-hub interface, so the plan adds only an adapter, a truthful predicate, additive status visibility, and store durability.

Implementation waits for a later execution pass. No `.cjs`, `.ts`, `.py`, `.sh`, activation manifest, or benchmark file was edited here.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Wrap the generic 006 `compileRegistry()` | It already computes the authoritative policy hash for the generated registry-driven parent shape. |
| Add a small stable CommonJS module and JSON CLI | create-skill is Python and needs one callable contract without embedding policy logic. |
| Use generation `1` and create-if-absent | Packet 013 creates new hubs; refresh and overwrite authority are unnecessary and risky here. |
| Keep `servingAuthority: legacy` and `shadowOnly: true` | Minting proves artifact readiness without changing a routing decision. |
| Compare a new compile with the selected policy hash | The current status fingerprint identifies bytes but does not prove current inputs produced them. |
| Preserve new-hub manifest bytes across sync | The current sync deletes the promoted runtime root before rebuilding it. |
| Defer fixed-map removal and P4 advancement | They are separate serving and eligibility changes, not prerequisites for initial mint and freshness. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Compiler reuse inspection | Confirmed: `compileRegistry()` is parameterized for the create-skill parent shape. |
| Existing harness inspection | Confirmed: source and output roots are fixed to an existing hub child. |
| Existing status freshness | Confirmed absent: status parses and fingerprints but does not compile current inputs. |
| Canonical store durability | Confirmed gap: sync replaces the full promoted runtime root. |
| New-hub runtime serving | Confirmed absent: engine and advisor eligibility remain fixed to seven hubs. |
| Runtime implementation tests | Planned; no code exists yet. |
| Strict packet validation | Authoring gate runs after metadata generation; runtime completion validation remains Planned. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No implementation exists.** Packet status remains Planned until every P0 task and checklist item has evidence.
2. **A fresh manifest is not a serving registration.** The new hub stays on the legacy sentinel until later data-driven discovery and eligibility work.
3. **Initial mint only.** Refresh, overwrite, generation increment, rollback, and promotion are deferred.
4. **One generated archetype only.** The adapter targets the registry-driven create-skill parent and does not unify the specialized existing hub compilers.
5. **Status remains control-plane.** Freshness recompiles inputs and must not be inserted into a per-request routing hot path by this phase.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [ ] Execute T001-T022 in `tasks.md` and record baseline-to-final verification.
- [ ] Update packet 013 to call the shipped CLI after final router inputs exist.
- [ ] Assign separate future ownership for refresh semantics.
- [ ] Execute ADR-002 data-driven eligibility and fixed-map removal as named future work.
- [ ] Advance hubs through P4 only after the existing cutover join gate passes.
<!-- /ANCHOR:follow-up -->
