---
title: "Verification Checklist: Parser Quarantine Recovery (029 Phase 006)"
description: "Verification Date: 2026-05-27"
trigger_phrases:
  - "parser quarantine recovery checklist"
  - "f-runtime-2 checklist"
  - "029 phase 006 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/010-playbook-validation-and-hardening/006-parser-quarantine-recovery"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 006 checklist"
    next_safe_action: "Verify after code edits"
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
# Verification Checklist: Parser Quarantine Recovery (029 Phase 006)

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
- [ ] CHK-002 [P0] Quarantine trigger + init flow + scan injection point mapped
- [ ] CHK-003 [P1] sk-code OPENCODE/TypeScript surface confirmed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] tsc build clean (no type errors)
- [ ] CHK-011 [P0] No leftover debug logs / commented code
- [ ] CHK-012 [P1] `resetParserHealth` documented; trigger left unchanged
- [ ] CHK-013 [P1] Reset only on explicit full scan (not incremental)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] New recovery vitest passes (quarantine → reset → re-engage)
- [ ] CHK-021 [P0] Existing parser-skip-list + code-graph-scan tests still pass
- [ ] CHK-022 [P1] verify_alignment_drift.py clean on changed scope
- [ ] CHK-023 [P1] Live recovery confirmed OR documented as not reproduced
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] F-RUNTIME-2 classed: class-of-bug (missing recovery), not instance-only
- [ ] CHK-FIX-002 [P0] Consumer inventory of parser-health API done (status.ts read-only; tests)
- [ ] CHK-FIX-003 [P0] Additive API — no existing consumer behavior changed
- [ ] CHK-FIX-004 [P1] Adversarial: incremental scan does NOT reset (safety preserved)
- [ ] CHK-FIX-005 [P1] Matrix axis: full vs incremental × quarantined vs ok covered by reasoning/tests
- [ ] CHK-FIX-006 [P1] Re-quarantine-after-reset loop considered + accepted
- [ ] CHK-FIX-007 [P2] Evidence pinned to test output + build log
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets; internal module state only
- [ ] CHK-031 [P1] No new external/network surface
- [ ] CHK-032 [P2] Reset cannot be triggered by untrusted input beyond a normal full-scan request
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized
- [ ] CHK-041 [P1] implementation-summary updated post-fix
- [ ] CHK-042 [P2] 029 matrix F-RUNTIME-2 status updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only the 3 in-scope source/test files touched
- [ ] CHK-051 [P2] Verification transcripts in scratch/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 11 | 0/11 |
| P2 Items | 4 | 0/4 |

**Verification Date**: 2026-05-27
<!-- /ANCHOR:summary -->
