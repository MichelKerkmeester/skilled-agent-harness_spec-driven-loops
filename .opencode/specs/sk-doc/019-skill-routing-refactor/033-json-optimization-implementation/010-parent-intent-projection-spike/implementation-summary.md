---
title: "Design Spike Plan: Parent-Intent Projection"
description: "Planned record of the O8 parent-intent projection design spike: what will be built once phase 009 and phase 002/006 unblock it, and how the ship/no-ship decision will be measured."
trigger_phrases:
  - "parent intent projection design spike summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/010-parent-intent-projection-spike"
    last_updated_at: "2026-07-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Phase 009 canonical derived-producer decision not yet resolved"
      - "Phase 002/006 pinned routing-accuracy corpus not yet established"
    key_files:
      - "implementation-summary.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-parent-intent-projection-spike"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which of derived.trigger_phrases vs derived.key_topics is the right destination for a given projected phrase?"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Design Spike Plan: Parent-Intent Projection

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Track** | sk-doc |
| **Depends On** | Phase 009 (canonical `derived` producer, O1) · Phase 002/006 (pinned routing-accuracy corpus) |
| **Gating** | Single-lineage hypothesis (O8, research.md:88); ships only if the measured comparison clears a pre-registered bar |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been built yet — this phase is Planned. What follows is what will be built once phase 009 names the canonical `derived` producer and phase 002/006 pin the routing-accuracy corpus: a scratch prototype that reads `hub-router.json.vocabularyClasses` and `mode-registry.json.modes[].aliases` for the sk-doc pilot hub, filters candidate phrases by specificity and fleet-wide distinctiveness, and writes the survivors into a SCRATCH copy of `graph-metadata.json.derived` — the same channel the parent-selection scorer already reads through `derivedTriggers`/`derivedKeywords`, so the mechanism needs zero new scorer lane and zero new weight.

### Parent-Intent Projection (Planned)

Once unblocked, the prototype closes the gap identified by O8: rich per-mode vocabulary in `hub-router.json`/`mode-registry.json` currently only reaches the sk-doc hub's own internal mode router (`registry-compiler.cjs`'s `vocabularyForMode`, which runs AFTER the skill-advisor has already picked sk-doc as the parent) and never reaches the fields the advisor actually scores for parent selection. The spike's job is to design and measure — not assume — whether projecting a high-specificity, hub-distinctive subset of that vocabulary into the existing `derived.trigger_phrases`/`derived.key_topics` channel measurably improves parent-selection accuracy on a pinned corpus.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| (none yet) | Planned | This phase has not executed; all planned changes are scoped to a scratch workspace inside this phase folder, never to a live hub's `graph-metadata.json`/`hub-router.json`/`mode-registry.json` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered — this is a Planned spike. Once phase 009 and phase 002/006 unblock it, delivery follows `plan.md`'s three phases: build the prototype and run it against the sk-doc pilot hub in a scratch workspace (Phase 2), then measure before/after parent-selection accuracy on the pinned corpus and write a decision-record with an explicit ship/no-ship verdict (Phase 3). No production code path is touched at any point; confidence comes from the measured corpus delta, not from the design alone.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Project through the EXISTING `derived.trigger_phrases`/`derived.key_topics` channel rather than adding a new scorer lane | Keeps the "without changing scorer math" constraint literal — the derived lane (`scorer/lanes/derived.ts:62-87`) already scores these fields; a new lane would be an actual scorer-math change, not a data-generation-time enrichment |
| Gate ship on a pre-registered accuracy bar measured against a hash-pinned corpus | The premise is a single-lineage hypothesis (research.md:88); measuring against a moving or un-pinned baseline would let confirmation bias decide instead of evidence |
| Restrict all spike output to scratch artifacts inside this phase folder | Nothing outside this folder should change unless the decision-record verdict is "ship" and a new, separately gated phase actually wires it in |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Prototype writes only scratch artifacts | PENDING — spike not yet executed |
| Zero diff in `scorer/lanes/*.ts` and `scorer/projection.ts` | PENDING |
| Before/after accuracy delta vs the pinned 002/006 corpus | PENDING |
| `decision-record.md` ship/no-ship verdict recorded | PENDING |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Single-lineage hypothesis.** O8 was raised by only one of the three research lineages (research.md:88); this spike's job is partly to test whether the premise holds at all, not just to design a mechanism for it.
2. **Blocked on two upstream decisions.** This phase cannot execute until phase 009 names the canonical `derived` producer and phase 002/006 pin the routing-accuracy corpus; until then it stays Planned.
3. **May not ship.** Per the parent research's own gating language, this spike ships ONLY if the measured comparison clears a pre-registered bar; a "no-ship" outcome is an equally valid, complete result for this phase.
<!-- /ANCHOR:limitations -->
