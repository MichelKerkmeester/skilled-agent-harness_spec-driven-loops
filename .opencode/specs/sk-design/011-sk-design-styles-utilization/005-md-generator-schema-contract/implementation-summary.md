---
title: "Implementation Summary: design-md-generator v3 schema contract"
description: "Not-yet-built scaffold for the versioned v3 schema authority upgrade of design-md-generator. Records the planned single-source manifest, capability-driven Quick Start, hard-vs-advisory validation split, de-literalized corpus baseline, and schema-drift sentinel. Implementation not started."
trigger_phrases:
  - "md generator schema summary"
  - "v3 schema contract status"
  - "schema authority scaffold"
importance_tier: "important"
contextType: "implementation"
status: "planned"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/005-md-generator-schema-contract"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the v3 schema-contract L3 scaffold docs"
    next_safe_action: "Implement the v3 schema manifest as the single section authority"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-mdgen-schema-011-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

> **This is a not-yet-built scaffold.** No backend code has been changed. The sections below record the planned build so a later session can execute it and replace these placeholders with real emitted evidence.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-md-generator-schema-contract |
| **Status** | Planned — scaffold; implementation not started |
| **Level** | 3 |
| **Estimated Effort** | ~10–15 engineer-days |
| **Depends On** | `../004-retrieval-substrate/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is a planning scaffold for turning the `design-md-generator` backend into a single versioned v3 schema authority. When built, it will make one manifest the sole source of truth for section requiredness, conditional capabilities, extension slots, Quick Start groups, semantic typography roles, formatter emission, prompt instructions, and validation, removing the current formatter/prompt/validator drift.

### Planned Deliverables
- A versioned v3 schema manifest as the ONE source of truth for the concerns above.
- Capability-driven Quick Start emission through `formatters-v3.ts::emitQuickStart`.
- A semantic typography-role normalizer (stable core + namespaced extensions, preserving source labels).
- A compact corpus baseline + de-literalized fixture generator built from the 1,290 bundles via the phase-004 retrieval substrate.
- A hard-vs-advisory validation split in `validate.ts::validateDesignMd` / `checkSectionCompleteness`, surfaced through `report-gen.ts`.
- A schema-drift sentinel + counterfactual schema/emitter tests (Vitest).

### Files Changed (proposed)

| File | Action | Purpose |
|------|--------|---------|
| `design-md-generator/**/schema-v3.*` | Create (proposed) | Single versioned v3 authority |
| `design-md-generator/**/formatters-v3.ts` | Modify (proposed) | Capability-driven `emitQuickStart` |
| `design-md-generator/**/validate.ts` | Modify (proposed) | Hard-vs-advisory split |
| `design-md-generator/**/report-gen.ts` | Modify (proposed) | Surface stratified advisory warnings |
| `design-md-generator/**/*.test.ts` | Create (proposed) | Drift sentinel + counterfactual tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The plan sequences the work strictly after the phase-004 retrieval substrate lands: author the v3 manifest first (Phase 1), migrate the formatter/prompt/normalizer and validation split (Phase 2), then lock the single-authority invariant with a schema-drift sentinel and counterfactual Vitest tests plus fixture leak assertions (Phase 3). The iron rule (corpus teaches shape, never target-measured values) governs every corpus touch point throughout.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One versioned v3 manifest as single authority | Removes formatter/prompt/validator drift at the root (ADR-001) |
| Corpus teaches shape, never target-measured values | Prevents slop, source leaks, and aesthetic majority votes (ADR-002) |
| Hard-vs-advisory validation split | Calibrates output instead of majority-rejecting valid docs (ADR-003) |
| Corpus signals feed advisory strata only | Keeps generated documents target-truthful |
| Consume phase 004 through a stable interface | Insulates 005 from substrate shape changes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet executed. Implementation is not started, so no checks have run. The planned verification path is:

| Check | Command / Artifact | Result |
|-------|--------------------|--------|
| Spec-folder validity | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/011-sk-design-styles-utilization/005-md-generator-schema-contract --strict` | Pending |
| Counterfactual schema/emitter | `npx vitest run` (schema-mutation propagation suite) | Pending |
| Schema-drift sentinel | `npx vitest run` (drift suite) | Pending |
| Advisory-never-rejects | `npx vitest run` (corpus-divergent target-valid doc) | Pending |
| Fixture leak assertion | `npx vitest run` (no source literals/assets) | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not built.** This phase is a scaffold; no backend code has changed.
2. **Depends on phase 004.** The corpus baseline and fixtures require the retrieval substrate to exist first.
3. **STUDY exemplars out of scope.** Corpus-conditioned prose, hydration, and source-leak gates are deferred to `../006-md-generator-study-exemplars/`.
4. **Manifest authoring format undecided.** TS/JSON/hybrid to be resolved before Phase 1.
<!-- /ANCHOR:limitations -->
