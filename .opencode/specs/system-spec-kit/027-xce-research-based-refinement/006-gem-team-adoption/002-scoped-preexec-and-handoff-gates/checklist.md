---
title: "Verification Checklist: 027/006/002 Scoped Pre-Execution & Handoff Gates"
description: "Verification checklist for the three scoped, predicate-guarded gates: typed debug→implement handoff, boundary contract-first, and pre-mortem field."
trigger_phrases:
  - "027 phase 006/002"
  - "scoped preexec gates"
  - "debug handoff schema"
  - "boundary contract-first"
  - "pre-mortem field"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/006-gem-team-adoption/002-scoped-preexec-and-handoff-gates"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 002 scoped gates from 007 P2 + 009"
    next_safe_action: "Land 001 envelope, then wire the 3 scoped gates"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-002-scoped-preexec-gates-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 027/006/002 Scoped Pre-Execution & Handoff Gates

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in `spec.md`.
- [ ] CHK-002 [P0] Technical approach documented in `plan.md`.
- [ ] CHK-003 [P0] All six target surfaces read before editing.
- [ ] CHK-004 [P1] `001-typed-agent-io-adapter` envelope (`confidence`/`failure_type`) confirmed available to reuse.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each gate references exactly one `@orchestrate` predicate and skips when it is false.
- [ ] CHK-011 [P0] `@debug`'s 5-phase method is left untouched; only typed handoff fields are added.
- [ ] CHK-012 [P0] Boundary contract-first is scoped to API/schema/integration and does not trigger on ordinary edits.
- [ ] CHK-013 [P1] Edits follow existing agent/skill contract patterns and stay additive/advisory.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] A low/typo/docs task triggers none of the three gates.
- [ ] CHK-021 [P0] A medium/high task carries the pre-mortem field; a low task omits it.
- [ ] CHK-022 [P0] A debug→implement crossing carries the typed `root_cause`/`target_files`/`fix_recommendations`/`confidence` handoff.
- [ ] CHK-023 [P0] `@code` returns BLOCKED/LOW_CONFIDENCE (not a guessed fix) when a required handoff field is missing.
- [ ] CHK-024 [P1] An API/schema/integration change requires a contract / boundary test / acceptance check before edits.
- [ ] CHK-025 [P1] A legacy `debug-delegation.md` outside the new crossing warns rather than fails.
- [ ] CHK-026 [P1] `scaffold-debug-delegation.sh` produces a valid handoff doc with the new typed-field flags.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class documented as `cross-consumer` for the typed handoff (emitter `@debug`, carrier `@orchestrate`, validator `@code`).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory covers all three predicate definitions in `@orchestrate`.
- [ ] CHK-FIX-003 [P0] Consumer inventory confirms `root_cause`/`target_files`/`fix_recommendations`/`confidence` are consistent across `debug.md`, the template, and the scaffold.
- [ ] CHK-FIX-004 [P1] Gate matrix axes and row count (complexity × change class × crossing × completeness × provenance) are listed before completion is claimed.
- [ ] CHK-FIX-005 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets.
- [ ] CHK-031 [P0] No new network or provider calls; `@debug` remains user-opt-in (no auto-dispatch).
- [ ] CHK-032 [P1] No governance/validator file (`validate.sh`, `check-completion.sh`, `spec-doc-structure`) modified.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, and `tasks.md` remain synchronized.
- [ ] CHK-041 [P1] Gate A is documented as a downscale of Gem's `debugger_diagnosis` check, not a novel invention.
- [ ] CHK-042 [P1] Stale `SCHEMA SOURCE ... lines 60-89` comment in `scaffold-debug-delegation.sh` is corrected.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No scratch files left outside this packet.
- [ ] CHK-051 [P1] No files outside the six named surfaces changed during implementation.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 13 | 0/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-06
<!-- /ANCHOR:summary -->
