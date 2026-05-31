---
title: "Verification Checklist: 027/002 Memory Write Safety"
description: "Verification checklist for the three P0 correctness fixes split from 027/009."
trigger_phrases:
  - "027 phase 002"
  - "feedback P0 correctness"
  - "auto-provenance cap broadening"
  - "manual-edge overwrite guard"
  - "retention-sweep tier basement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-memory-write-safety"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet per pt-04 audit"
    next_safe_action: "Verify P0 checklist"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-11-012-feedback-p0-correctness-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 027/002 Memory Write Safety

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
- [ ] CHK-003 [P0] Target production files read before editing.
- [ ] CHK-004 [P1] Existing tests located before adding new fixtures.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Auto-provenance predicate is deterministic and handles `auto` plus `auto-*`.
- [ ] CHK-011 [P0] Manual-edge overwrite guard runs before destructive upsert overwrite.
- [ ] CHK-012 [P0] Retention sweep delete path is gated by tier-aware decision.
- [ ] CHK-013 [P1] Implementation follows existing causal and retention module patterns.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Test proves `created_by='auto-session'` receives the automatic edge strength cap.
- [ ] CHK-021 [P0] Test proves non-auto provenance does not match the auto predicate.
- [ ] CHK-022 [P0] Test proves existing manual edge is not overwritten by attempted automatic upsert.
- [ ] CHK-023 [P0] Test proves existing auto edge can still update under cap.
- [ ] CHK-024 [P0] Test proves expired constitutional row is not deleted solely by TTL.
- [ ] CHK-025 [P0] Test proves expired critical row is not deleted solely by TTL.
- [ ] CHK-026 [P1] Test proves normal unprotected expired rows preserve existing deletion behavior.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class documented as `class-of-bug` for provenance cap broadening.
- [ ] CHK-FIX-002 [P0] Finding class documented as `cross-consumer` for manual-edge overwrite guard.
- [ ] CHK-FIX-003 [P0] Finding class documented as `algorithmic` for retention-sweep deletion decision.
- [ ] CHK-FIX-004 [P0] Same-class producer inventory covers causal write and consolidation cap sites.
- [ ] CHK-FIX-005 [P1] Consumer inventory confirms no reducer/code_graph/scorer files were modified.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets.
- [ ] CHK-031 [P0] No new network or provider calls.
- [ ] CHK-032 [P0] Destructive retention delete remains gated and test-covered.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, and `tasks.md` remain synchronized.
- [ ] CHK-041 [P1] `implementation-summary.md` updated after implementation.
- [ ] CHK-042 [P1] 027/009 dependency note can cite 012 as complete after this ships.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No scratch files left outside this packet.
- [ ] CHK-051 [P1] No files outside intended production/test surfaces changed during implementation.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 0/17 |
| P1 Items | 8 | 0/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-11
<!-- /ANCHOR:summary -->
