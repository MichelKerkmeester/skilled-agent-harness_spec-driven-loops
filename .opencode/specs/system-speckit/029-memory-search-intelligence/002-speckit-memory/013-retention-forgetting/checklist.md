---
title: "Verification Checklist: Memory Retention / Forgetting + Recall-Diversity Result-Shaping (028 Wave-1)"
description: "Verification Date: 2026-06-19 (partial implementation, retention spare-only + live-edge allowlist done)"
trigger_phrases:
  - "verification"
  - "checklist"
  - "memory retention forgetting"
  - "c7-a dominance cap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/013-retention-forgetting"
    last_updated_at: "2026-07-04T17:51:08.036Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented retention spare-only eligibility and live-edge allowlist"
    next_safe_action: "Run strict validation, then continue semantic edge layer"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-011-retention-forgetting"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Memory Retention / Forgetting + Recall-Diversity Result-Shaping (028 Wave-1)

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

> PARTIAL IMPLEMENTATION STATE: retention spare-only eligibility and live incoming-edge allowlist are implemented and tested. Benchmark-gated recall shaping and shared-infra quarantine remain pending.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006 with research-cited acceptance criteria)
- [x] CHK-002 [P0] Technical approach defined in plan.md (sequencing + affected-surfaces + rollback)
- [ ] CHK-003 [P1] Dependencies identified and available (forget-learning gate present, allowlist label column + recall baseline are Yellow, see plan §6)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented (non-finite SPARE guard, both-floors-at-ceiling refusal)
- [x] CHK-013 [P1] Code follows project patterns for the implemented reducer/sweep/schema/flag-gated conventions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..006)
- [ ] CHK-021 [P0] Manual testing complete (baseline-vs-delta recall for C7-A + never-truncate)
- [ ] CHK-022 [P1] Edge cases tested (single-folder-dominance + spill, non-finite-spare, constitutional-starvation, trust>=0.7 gate)
- [ ] CHK-023 [P1] Error scenarios validated (both-floors-at-ceiling refusal, missing allowlist column blocks rather than over-forgets)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate has a finding class: spare-only = `algorithmic` (eligibility predicate), C7-A + never-truncate = `class-of-bug` (result-set shaping), forget-allowlist = `cross-consumer` (sweep vs edge store), quarantine = `algorithmic` (merge gate).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed (`slice(0, config.limit)`, `EXTENDABLE_TIERS`, `referenced_count`, `reconsolidate(`) per plan affected-surfaces.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed reducer/pipeline/policy symbols + response shape (recall envelope order).
- [ ] CHK-FIX-004 [P0] Forget-eligibility + cap invariants table-tested: spare-only AND with finite-guards, spill-if-underfilled never drops below `config.limit` when fillable, quarantine reversible by edge delete.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion (eligibility 6-axis, cap per-folder × headroom, quarantine trust-side × edge-presence).
- [ ] CHK-FIX-006 [P1] Flag/global-state variant executed (default-OFF shadow for spare-only, `SPECKIT_RECONSOLIDATION` off-by-default for quarantine).
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA / diff range, not a moving branch range, spec §6 STATUS reconciled to 030 §14.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented (non-finite eligibility inputs SPARE, never doom)
- [x] CHK-032 [P1] Destructive-adjacent paths default-OFF for implemented retention behavior, no persistent deny-list of erased ids introduced
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (authored together, per-candidate STATUS in spec §6)
- [x] CHK-041 [P1] Code comments adequate (durable WHY only, no artifact-ID labels per comment-hygiene)
- [ ] CHK-042 [P2] ENV_REFERENCE.md updated for the new default-OFF reconsolidation flag (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 4/11 |
| P1 Items | 12 | 5/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-06-19 (partial implementation, retention spare-only + live-edge allowlist done)
<!-- /ANCHOR:summary -->
