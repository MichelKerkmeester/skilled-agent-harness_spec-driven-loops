---
title: "Checklist: Code Graph — Generation Watermark (Q6-C2 → Q6-C1)"
description: "Level-2 QA checklist for the staged code-graph generation watermark. Pre-implementation items reflect the completed planning; code-quality/testing items are pending the Q6-C2 implementation."
trigger_phrases:
  - "code graph generation watermark checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/003-003-generation-watermark"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-2 checklist; pre-impl items reflect completed planning"
    next_safe_action: "Verify code-quality + testing items after Q6-C2 implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-003-generation-watermark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Code Graph — Generation Watermark (Q6-C2 → Q6-C1)

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..005, Q6-C2 + Q6-C1)
- [x] CHK-002 [P0] Technical approach defined in plan.md (staged Q6-C2 → Q6-C1, correct bump site)
- [x] CHK-003 [P1] Dependencies identified and available (`code_graph_metadata` present; Q1-C1 cluster gates Q6-C1)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks (`node --check` / `tsc`)
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented (`parseInt || 0` for malformed/unset generation)
- [ ] CHK-013 [P1] Code follows project patterns (KV helper beside existing `setLastGitHead`/`getLastGitHead`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..004 for Q6-C2; REQ-005 design-only)
- [ ] CHK-021 [P0] Manual testing complete (two `code_graph_scan` runs advance `generation`)
- [ ] CHK-022 [P1] Edge cases tested (unset→0, malformed→0, non-promoting scan no-op)
- [ ] CHK-023 [P1] Error scenarios validated (parse-error/persistence-error scan does not bump)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class recorded: `cross-consumer` (corrects the REFUTED `ensure-ready.ts:497` bump-site claim; the freshness envelope is a public field)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'setLastGitHead\|setCodeGraphScope\|scanPromotable' handlers/scan.ts` — confirm the single finalize block is the only promotion site
- [ ] CHK-FIX-003 [P0] Consumer inventory for the changed freshness envelope: `rg -n 'freshness' .opencode/skills/system-code-graph/mcp_server --glob '*.ts'` — confirm none branch on `generation`
- [ ] CHK-FIX-004 [P0] N/A — no security/path/parser/redaction surface (additive internal int); state N/A with reason
- [ ] CHK-FIX-005 [P1] Matrix axes listed: {full_scan, selective_reindex, non-promoting} × {unset, set} before completion
- [ ] CHK-FIX-006 [P1] No process-wide state read by the counter; N/A
- [ ] CHK-FIX-007 [P1] Evidence pinned to the Q6-C2 fix SHA, not a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation: `generation` is an internal monotonic int, not external input; N/A but stated
- [ ] CHK-032 [P1] Auth/authz unchanged (no auth surface touched)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized (Q6-C1 DEFER-speculative gate recorded in all three)
- [ ] CHK-041 [P1] Code comments adequate (durable WHY for the bump site, no ephemeral spec/packet ids)
- [ ] CHK-042 [P2] README updated (system-code-graph readiness docs, if applicable)
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
| P0 Items | 11 | 2/11 |
| P1 Items | 13 | 1/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-06-19 (planning only — implementation pending)
<!-- /ANCHOR:summary -->

---
