---
title: "Verification Checklist: Agent Definition Cleanup"
description: "PENDING verification checklist for agent definition and runtime mirror sweep."
trigger_phrases:
  - "028 release cleanup agents checklist"
  - "agents cleanup checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-release-cleanup/007-agents"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Created PENDING cleanup checklist"
    next_safe_action: "Do not mark items complete until cleanup evidence exists"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-checklist-007-agents"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Agent Definition Cleanup

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Scope is limited to agent definition and runtime mirror sweep.
- [ ] CHK-002 [P0] Discovery command is run before edits.
- [ ] CHK-003 [P1] Candidate list is saved as evidence.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Edited markdown has no em dash character.
- [ ] CHK-011 [P0] Edited markdown has no semicolon character.
- [ ] CHK-012 [P1] Edited markdown avoids Oxford comma patterns.
- [ ] CHK-013 [P1] Edits follow nearby documentation structure.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Stale-reference scan is run with `deprecated tool|removed skill|stale route|orphan|missing mirror|renamed agent`.
- [ ] CHK-021 [P0] Source-file path claims are grep-traceable.
- [ ] CHK-022 [P1] Mirror or index counts are checked when the phase has mirrors or indexes.
- [ ] CHK-023 [P1] Strict validation exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] Every discovered candidate is reviewed.
- [ ] CHK-061 [P0] Every stale hit is fixed, explicitly deferred or proven historical.
- [ ] CHK-062 [P1] Out-of-scope files remain unchanged.
- [ ] CHK-063 [P1] Packet 030 remains unchanged.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or private tokens are added to docs.
- [ ] CHK-031 [P0] Command examples do not encourage unsafe shell execution.
- [ ] CHK-032 [P1] Paths do not expose machine-local private locations unless already present and required.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and checklist remain synchronized.
- [ ] CHK-041 [P1] Parent phase map still points to this child.
- [ ] CHK-042 [P2] Cleanup evidence is linked from the child phase when execution happens.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp files are committed.
- [ ] CHK-051 [P1] Generated discovery output stays in the phase evidence area if created later.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-06-19
<!-- /ANCHOR:summary -->
