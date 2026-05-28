---
title: "Verification Checklist: Hook-Doc Reconciliation + 022 Re-verify (029 Phase 007)"
description: "Verification Date: 2026-05-27"
trigger_phrases:
  - "hook doc reconciliation checklist"
  - "022 transitive checklist"
  - "029 phase 007 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/007-followup-hook-docs-and-022"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 007 checklist"
    next_safe_action: "Verify as fixes land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Hook-Doc Reconciliation + 022 Re-verify (029 Phase 007)

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Real flat dist artifact path confirmed
- [ ] CHK-003 [P1] In-scope docs (5) vs out-of-scope records distinguished
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Corrected path passes `test -f` (devin artifact)
- [ ] CHK-011 [P0] No active doc cites the non-existent `system-code-graph/dist/system-spec-kit/.../hooks/` path
- [ ] CHK-012 [P1] deferred_decisions edit preserves history (dated note, not rewrite)
- [ ] CHK-013 [P1] README placeholder `<runtime>` maps to flat `dist/hooks/<runtime>/`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] 022 re-run executed against a deep-dependency subject
- [ ] CHK-021 [P0] transitive vs nontransitive counts recorded
- [ ] CHK-022 [P1] transitive > nontransitive shown OR topology limitation documented
- [ ] CHK-023 [P1] no staleness markers / workspace leftovers from the re-run
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Stale-path fix classed cross-consumer (5 docs); inventory via rg complete
- [ ] CHK-FIX-002 [P0] Out-of-scope records (029 packet, 026/008 history) intentionally NOT edited
- [ ] CHK-FIX-003 [P0] Only the 5 active docs + 007 evidence touched
- [ ] CHK-FIX-004 [P1] 022 re-run confined to disposable workspace; no tracked-file mutation
- [ ] CHK-FIX-005 [P1] Graph-metadata churn from the re-run reverted
- [ ] CHK-FIX-006 [P2] Evidence pinned to commands + JSON excerpts
- [ ] CHK-FIX-007 [P2] launcher.cjs untouched
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets in edits
- [ ] CHK-031 [P1] Paths stay repo-relative
- [ ] CHK-032 [P2] No new external surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized
- [ ] CHK-041 [P1] implementation-summary updated post-fix
- [ ] CHK-042 [P2] 029 matrix follow-ups updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only in-scope files touched
- [ ] CHK-051 [P2] 022 evidence in 007 packet
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 10 | 0/10 |
| P2 Items | 5 | 0/5 |

**Verification Date**: 2026-05-27
<!-- /ANCHOR:summary -->
