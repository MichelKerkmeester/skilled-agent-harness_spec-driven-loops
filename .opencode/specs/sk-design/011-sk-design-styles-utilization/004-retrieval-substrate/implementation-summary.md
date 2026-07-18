---
title: "Implementation Summary: styles-library retrieval substrate"
description: "Planning scaffold for the Phase A retrieval engine over the sk-design styles library. Nothing is built yet — this records the intended manifest generator, deterministic eligibility, disposable FTS accelerator, generation-guarded hydration, and CORPUS_USE_PROOF v1 gate, plus the ADRs and task queue that will drive the build."
trigger_phrases:
  - "retrieval substrate status"
  - "retrieval substrate summary"
  - "corpus use proof status"
importance_tier: "important"
contextType: "implementation"
status: "planned"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/004-retrieval-substrate"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the retrieval-substrate L3 scaffold docs"
    next_safe_action: "Begin T001 — draft manifest schema behind build --write"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-retrieval-substrate-011-004"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Ship the FTS accelerator in Phase A or defer to Phase B based on measured repeated-query load?"
    answered_questions:
      - "Deterministic eligibility decides membership; lexical scores only order the eligible set."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

<!-- STATUS: Planned — scaffold; implementation not started. This is a not-yet-built planning artifact. -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-retrieval-substrate |
| **Status** | Planned — scaffold; implementation not started |
| **Level** | 3 |
| **Estimated Effort** | ~5-8 engineer-days (Phase A) + 1-2 days (FTS accelerator) |
| **Origin** | Fourth child (first implementation phase) of the styles-library utilization phase parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Nothing yet — planning scaffold.** No `styles/_engine/` modules, no `styles/_retrieval-manifest.json`, and no fixtures exist. This phase currently consists only of its planning documents (spec, plan, tasks, checklist, decision-record, and this summary), which define the retrieval engine to be built.

### Files to Build (NEW/proposed — not created yet)

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/styles/_engine/style-library.mjs` | Create | CLI: `build --write/--check`, `query`, `hydrate` |
| `.opencode/skills/sk-design/styles/_engine/manifest.mjs` | Create | Manifest schema, refresh, hashing |
| `.opencode/skills/sk-design/styles/_engine/eligibility.mjs` | Create | Facet/exclusion/provenance gates |
| `.opencode/skills/sk-design/styles/_engine/rank-fts.mjs` | Create | Disposable FTS + source-scan fallback |
| `.opencode/skills/sk-design/styles/_engine/cards.mjs` | Create | Candidate cards |
| `.opencode/skills/sk-design/styles/_engine/hydrate.mjs` | Create | Generation-guarded hydration |
| `.opencode/skills/sk-design/styles/_engine/corpus-use-proof.mjs` | Create | `CORPUS_USE_PROOF v1` gate |
| `.opencode/skills/sk-design/styles/_retrieval-manifest.json` | Create | Committed manifest (only retrieval artifact) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. Delivery is planned as five phases in `plan.md` and `tasks.md`: manifest generator (Phase 1 / Setup), then eligibility, ranking, cards, hydration, and the proof gate (Phase 2 / Implementation), then change/invalidation fixtures and CI wiring (Phase 3 / Verification). Verification will prove byte-stable `build --check`, eligibility-before-ranking, generation-guarded hydration, and the `CORPUS_USE_PROOF v1` block before any completion claim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Committed checked manifest is the only retrieval artifact | Canonical, reviewable, hash-bound; ~503 KB and ~1 ms scans beat grep or a stale hand-index (ADR-001) |
| Deterministic eligibility decides; scores only explain ordering | Composition and negation need determinism; P@5 0.60 vs BM25 0.33 in the research holdout (ADR-002) |
| Disposable same-generation FTS5/BM25 accelerator | Fast ordering with no drift and nothing committed; sub-second rebuild (ADR-003) |
| Generation-guarded hydration + source-scan fallback | Refuse stale values, degrade rather than fail hard (ADR-004) |
| `CORPUS_USE_PROOF v1` blocking ready-gate | No un-provenanced or averaged corpus output ships; never average token values (ADR-005) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

**Not verified — nothing built.** No tests, fixtures, or measurements exist yet. Planned verification lives in `checklist.md` and `tasks.md` Phase 3.

| Check | Result |
|-------|--------|
| `build --check` byte-stability (REQ-001) | Not started |
| Eligibility-before-ranking (REQ-002) | Not started |
| Generation-guarded hydration (REQ-003) | Not started |
| `CORPUS_USE_PROOF v1` gate (REQ-004) | Not started |
| Change/invalidation fixtures (REQ-008) | Not started |
| Packet validity | Run `validate.sh 004-retrieval-substrate --strict` after this scaffold lands |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is built.** This phase is a planning scaffold; the engine, manifest, and fixtures do not yet exist.
2. **Facet vocabulary is only seeded.** `requiredFacets`/`exclusions` are drafted from research §5 examples and must be finalized during implementation.
3. **FTS accelerator timing is open.** Whether it ships in Phase A or defers to Phase B depends on measured repeated-query load.
4. **Downstream wiring deferred.** No sk-design mode consumes the engine until `../005-md-generator-schema-contract/`.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:architecture-summary -->
## Architecture Decisions Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Committed checked manifest is the only retrieval artifact | Proposed | Canonical, reviewable, hash-bound index |
| ADR-002 | Deterministic eligibility decides; scores only order | Proposed | Composition/negation correctness; slop resistance |
| ADR-003 | Disposable same-generation FTS5/BM25 accelerator | Proposed | Fast ordering, no drift, uncommitted |
| ADR-004 | Generation-guarded hydration + source-scan fallback | Proposed | No stale-value leakage; resilient retrieval |
| ADR-005 | `CORPUS_USE_PROOF v1` blocking ready-gate | Proposed | No un-provenanced/averaged corpus output ships |

See `decision-record.md` for full ADR documentation. All five stay Proposed until the build validates.
<!-- /ANCHOR:architecture-summary -->

---

## Follow-Up Items

- [ ] Implement Phase 1-3 per `tasks.md` (T001-T028)
- [ ] Decide FTS accelerator timing (Phase A vs Phase B)
- [ ] Wire the engine into `../005-md-generator-schema-contract/`
- [ ] Promote ADR-001..005 from Proposed to Accepted after the build validates
</content>
