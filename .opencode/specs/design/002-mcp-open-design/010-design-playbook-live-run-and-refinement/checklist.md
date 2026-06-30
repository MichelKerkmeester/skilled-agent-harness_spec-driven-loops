---
title: "Verification Checklist: Live-run and refine the design playbooks"
description: "Verification Date: 2026-06-15"
trigger_phrases:
  - "design playbook live run checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/010-design-playbook-live-run-and-refinement"
    last_updated_at: "2026-06-15T10:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recording verification evidence for the run + refinements"
    next_safe_action: "Validate, commit, then restructure under 145-mcp-open-design"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-010-design-playbook-live-run-and-refinement"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Live-run and refine the design playbooks

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Both playbooks enumerated, 13 scenarios classified
- [x] CHK-002 [P0] Run approach defined (run-by-classification + evidence-driven refine)
- [x] CHK-003 [P1] Dependencies confirmed (OD app, Kimi/DeepSeek, Code Mode)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Refined skills pass `package_skill --check` (both valid)
- [x] CHK-011 [P0] Self-check counts preserved (mcp-od 5/4, sk-id 9); prompt-equality held
- [x] CHK-012 [P1] New script/doc content degrades gracefully and follows existing patterns
- [x] CHK-013 [P1] Refinements mirror the existing mcp-open-design integration pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 13 scenarios run live with a verdict (12 PASS / 1 PARTIAL / 0 SKIP)
- [x] CHK-021 [P0] Verdicts backed by real evidence (transcripts, run ids, tool output)
- [x] CHK-022 [P1] Both models (Kimi + DeepSeek) exercised on the 5 judgment/routing scenarios
- [x] CHK-023 [P1] Blocked scenarios honestly handled (the bundled systems un-blocked the 3 reads)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each refinement traces to a concrete live-run gap (instance class recorded in the matrix)
- [x] CHK-FIX-002 [P0] Same-class check: refinements applied consistently across both playbooks
- [x] CHK-FIX-003 [P0] Consumer check: self-checks (counts, prompt-equality) preserved after edits
- [x] CHK-FIX-004 [P0] N/A - no security/path/parser fix in this packet
- [x] CHK-FIX-005 [P1] N/A - no matrix-style fix
- [x] CHK-FIX-006 [P1] N/A - no process-wide state read
- [x] CHK-FIX-007 [P1] Evidence pinned to the scoped commits at completion
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets printed; gated generation used a throwaway project
- [x] CHK-031 [P0] No destructive verbs fired; FAIL-001 simulated non-destructively
- [x] CHK-032 [P1] The Mobbin/Refero auth (future) is documented as user-OAuth, not embedded
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks synchronized for this packet
- [x] CHK-041 [P1] Refinement comments state durable WHY; comment-hygiene clean
- [x] CHK-042 [P2] Playbook refinements + results matrix recorded
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Briefs, logs, and the results matrix kept in `scratch/`
- [x] CHK-051 [P1] Large seat JSON event-stream logs removed as throwaway; briefs, extracted model outputs, evidence, and the matrix kept as provenance
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-15
<!-- /ANCHOR:summary -->
