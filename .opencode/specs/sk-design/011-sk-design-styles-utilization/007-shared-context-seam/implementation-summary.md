---
title: "Implementation Summary: shared corpus-context seam"
description: "Scaffold record for Phase A of the global-modes utilization work: the shared corpus-context seam (CORPUS_CONTEXT_PLAN v1, common proof/handoff fields, five shared fixtures). Planning only — no code built yet."
trigger_phrases:
  - "shared context seam summary"
  - "corpus context plan status"
  - "sk-design shared seam status"
importance_tier: "important"
contextType: "implementation"
status: "planned"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/007-shared-context-seam"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the shared-context-seam Level-2 planning scaffold"
    next_safe_action: "Build CORPUS_CONTEXT_PLAN v1 envelope and shared proof fields"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-context-seam-011-007"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Where does the shared package live so it stays out of the hub yet importable by every mode?"
    answered_questions:
      - "This phase ships the top-ranked Phase A seam before any per-mode pilot."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: shared corpus-context seam

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-shared-context-seam |
| **Status** | Planned — scaffold; implementation not started |
| **Level** | 2 |
| **Origin** | Phase A implementation of the styles-library utilization phase parent (from 003 research) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet — this is a not-yet-built scaffold. This document records the plan for the shared corpus-context seam so implementation can start against a fixed contract. The seam, once built, is the thin, neutral envelope every non-md-generator sk-design mode plugs into: `CORPUS_CONTEXT_PLAN v1` (produced by the hub intake/registry route, 0 hydrated styles), the common proof/handoff field set, and the five shared fixtures. No mode code, hub code, or schema package exists at scaffold time.

### Files Created / Changed (planned)

| File | Action | Result |
|------|--------|--------|
| `007-shared-context-seam/{spec,plan,tasks,checklist}.md` | Create | The Level-2 planning scaffold (this delivery). |
| A new shared schema/validator package (out of hub) | Create — proposed | The `CORPUS_CONTEXT_PLAN v1` envelope, common fields, five fixtures, and validator. Not yet built. |
| Hub intake/registry route | Modify — proposed | Emit the neutral envelope; remains routing-only. Not yet built. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The scaffold was authored by mirroring the validated L1 sibling `../003-global-modes-utilization/` shape (frontmatter keys, anchors, section shapes), bumped to Level 2 with a `checklist.md`. Content is drawn from the 003 research synthesis (`research/lineages/sol/research.md`), which ranked this shared seam as the ship-first Phase A deliverable. No build steps ran; no runtime was touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Neutral envelope with 0 hydrated styles | Keeps taste out of the hub; the hub stays routing-only and never chooses a style. |
| Common proof/handoff fields defined once | generation identity, source identity, provenance/use-label, semantic role, transformation, fallback, proof-state — shared so modes reference, not copy. |
| Fixed authority order | user brief & owned system > selected mode judgment > target evidence & deterministic checks > corpus reference evidence > transport output. Corpus evidence may explain relationships and sharpen critique; it may NOT select a mode, prove accessibility/performance, assign severity, establish copying, authorize exact reuse, or accept transport output. |
| Negative results are successful evidence | no-fit, comparison-unavailable, and `anchor:null` are valid outcomes to surface, not errors to hide. |
| Mode-specific fields stay OUT of the hub | The seam is a contract; per-mode logic lands in the pilots (`../008-interface-audit-pilots/`) and later phases. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scaffold documents present | PLANNED: spec/plan/tasks/checklist/implementation-summary authored; no build claim. |
| Envelope schema | NOT STARTED: `CORPUS_CONTEXT_PLAN v1` not yet built. |
| Common fields | NOT STARTED: shared proof/handoff fields not yet defined. |
| Fixtures | NOT STARTED: five shared fixtures not yet authored. |
| Packet validity | Run `validate.sh .opencode/specs/sk-design/011-sk-design-styles-utilization/007-shared-context-seam --strict` after this scaffold lands. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a plan, not a build.** No schema, validator, fixtures, or hub route exist yet.
2. **Blocked on phase 004.** The intake/registry route can only emit the envelope once retrieval output is available.
3. **Cost is an estimate.** ~2–4 engineer-days, per the 003 research ranking; re-estimate once the interface/audit pilots reveal actual field reuse.
4. **Package location undecided.** The shared package must stay out of the hub while remaining importable by every mode.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:next-steps -->
## Next Steps

- Fix the shared package location (out of hub, importable by all modes).
- Build `CORPUS_CONTEXT_PLAN v1` and encode the fixed authority order + prohibitions.
- Define the seven common proof/handoff fields and the proof-state representation for negatives.
- Author the five shared fixtures and the validator; keep the hub routing-only.
- Hand the stabilized fields to the two contrasting pilots in `../008-interface-audit-pilots/`.
<!-- /ANCHOR:next-steps -->
