---
title: "Plan: Contract Compiler Design"
description: "Lean plan for phase 001 of packet 036 (command contract compiler). Design-first; authored fully at execution."
trigger_phrases: ["plan", "036 001 plan"]
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/036-command-contract-compiler/001-contract-compiler-design"
    last_updated_at: "2026-07-03T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Plan stub scaffolded"
    next_safe_action: "Verify the seed design and resolve the three unknowns"
    blockers: []
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "036-001-plan", parent_session_id: null}
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Contract Compiler Design

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Verify + expand the seed design (`design.md`) into an implementable spec, resolving the three named unknowns, then decompose the build/retrofit phases. Requirements in `spec.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|---|---|
| Citation fidelity | Every design.md file citation verified against the live tree |
| Unknowns resolved | Injection seam, checksum ownership, CLI parity each answered with cited evidence |
| Decomposition | Build/retrofit phases named with effort + acceptance |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Per `spec.md` §3-4 and the seed `design.md`. The compiler collapses the ~14-file `/deep:review` authority chain into one typed contract; this phase produces the implementable spec, not the build.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | Work | Gate |
|---|---|---|
| Verify | Check design.md citations; resolve the three unknowns | unknowns resolved |
| Spec | Finalize the implementable contract-compiler spec | citation fidelity |
| Decompose | Author the build/retrofit phase children | decomposition |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Design phase — validation is citation-checking + unknown-resolution evidence, not runtime tests. The build phases (decomposed here) carry the 035 behavior-benchmark acceptance.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

References the 035 dispatch-receipt + progress mechanisms (035 phase 004). Depends on the 035 restructure + this packet's `spec.md`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Design-only phase; artifacts are markdown docs, reversible via git. No runtime changes.
<!-- /ANCHOR:rollback -->
