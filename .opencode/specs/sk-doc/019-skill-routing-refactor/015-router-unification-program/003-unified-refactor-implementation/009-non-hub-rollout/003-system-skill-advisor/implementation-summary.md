---
title: "Implementation Summary: system-skill-advisor Non-Hub Rollout"
description: "Real-green rollout evidence for compiling the authored advisor router through frozen shared modules without changing live authority or protected scorer bytes."
trigger_phrases:
  - "system skill advisor rollout summary"
  - "advisor compiled policy green"
  - "advisor shadow parity evidence"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/003-system-skill-advisor"
    last_updated_at: "2026-07-19T10:55:36Z"
    last_updated_by: "codex"
    recent_action: "Recorded green rollout evidence"
    next_safe_action: "Regenerate canonical metadata and run strict validation"
    blockers: []
    key_files:
      - "harness/run-phase.cjs"
      - "compiled/system-skill-advisor/policy.json"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-skill-advisor-rollout-20260719"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary: system-skill-advisor Non-Hub Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-system-skill-advisor |
| **Verification Date** | 2026-07-19 |
| **Level** | 2 |
| **Status** | Active — routing green; documentation conformance pending |
| **Authority** | Legacy only; candidate remains shadow-only |
| **Git** | No commit or push |

### Current State

Target-local implementation is green. The compiled generation has no live authority: legacy remains serving-authoritative, the candidate stays shadow-only, and every evaluator diagnostic reports an empty effects list.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- A target-local source adapter that uses the real frozen router parser and validates the authored contract against manifest, aliases, and disk.
- A deterministic build using the shared generic compiler and canonical contract.
- Three read-only projections plus five typed fixture families under `compiled/system-skill-advisor/`.
- A target-local gate that invokes the real protected scorer in a subprocess and the shared parity and fenced-activation modules directly.
- Prior, checked, candidate, and fence-state activation artifacts for a one-generation rollback drill.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation keeps target-specific work in a child-local source adapter and imports the generic compiler, frozen canonical contracts, schema validator, parity runner, and fenced state machine directly. All projections derive from one deterministic snapshot; the default harness invocation rebuilds in memory, compares checked bytes, invokes the protected scorer subprocess, exercises parity and rollback, and verifies that the child tree remains unchanged.

### Authored Router

The skill declares 20 weight-3 intents and 20 exact routed leaves. Fifteen route to `references/` documents and five route to `feature-catalog/mcp-surface/` leaves. The two defaults are `references/runtime/tool-ids-reference.md` and `references/runtime/standalone-mcp-shape.md`; their authored semantics are `fallback-only`, so they are support suggestions during disambiguation and never become a default route. The authored replacement exclusion supplies the forbidden negative admission.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the protected parser | Compilation and the legacy oracle must consume the same authored dictionary semantics |
| Keep both defaults fallback-only | The authored declaration makes them support suggestions, so zero signal must remain `defer(no-match)` |
| Keep N=1 behavior generic | One candidate and empty composition collections should produce standalone behavior without a skill-name branch |
| Run the scorer in a subprocess | The real compatibility path stays isolated and protected from artifact generation |
| Restrict parity to exact positive routes | Legacy observations cannot express typed defer, clarify, or reject names; those actions are proven separately through typed decisions and scorer projection |
| Keep activation shadow-only | Rollback evidence does not justify serving authority; legacy remains authoritative throughout |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Evidence |
|---|---|
| Deterministic policy | 3 compile runs + 2 isolated process runs; body SHA-256 `a2a7ac1899a2a6553cb207e9a531604a890bad58aba9e636693560a6f93ce15e` |
| Deterministic artifacts | 2 complete artifact builds byte-matched all 9 compiled files |
| One snapshot | Effective policy `3b2dfe70b132e6c0b8a7c1fdc3d7c13c2991b4266da6a0f8c258b7841c039e0d` across advisor, card, and five typed rows |
| Real scorer | 5/5 rows pass; extra-resource falsifier fails |
| Shadow parity | 20 routes, 20 matches, 0 mismatches, 0 effects, legacy authoritative |
| Closed algebra | zero signal defer; one clarify; forbidden reject; target-free non-routes with authority withheld; rank calls 0 |
| N=1 degeneracy | one candidate, single selection, empty bundle/cross-target/handoff/authority graphs, null overlay, static provenance |
| Rollback | pre/restored SHA-256 `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23`; fence 2; stale epoch rejected |
| Protected scorer | all three SHA-256 values match the captured baseline |
| Static checks | 5/5 CommonJS files pass `node --check`; comment hygiene passes |
| Read-only validation | target tree hash is identical before and after the gate |
| Packet validation | Pending canonical metadata regeneration and final strict receipt |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. This is a shadow candidate only. It does not grant live authority or prove behavior in a serving process.
2. The legacy observation format cannot represent typed defer, clarify, or reject action names. Exact shadow parity therefore covers all 20 positive routes; the three non-route actions are proven through typed decisions, real-scorer empty-observation compatibility, schema checks, and document-only replay.
3. The activation drill operates on copied manifest state. It proves generation pinning, stale-fence rejection, and byte-exact rollback without changing live routing.
4. No live skill, routing configuration, scorer, shared compiler, parent packet, or sibling packet was modified. No network, install, commit, or push was used.
<!-- /ANCHOR:limitations -->
