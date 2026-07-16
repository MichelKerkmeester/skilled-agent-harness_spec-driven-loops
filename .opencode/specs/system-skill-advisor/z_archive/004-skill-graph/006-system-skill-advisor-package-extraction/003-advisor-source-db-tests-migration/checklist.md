---
title: "Checklist: Finalize advisor move recalibration"
description: "QA gates for moved advisor source/package/spec recalibration."
trigger_phrases:
  - "advisor move recalibration checklist"
  - "013/009/003 checklist"
importance_tier: "critical"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/003-advisor-source-db-tests-migration"
    last_updated_at: "2026-05-14T12:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed"
    next_safe_action: "Continue 004"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0130090030000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-003-recalibrate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Finalize Advisor Move Recalibration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [x] CHK-300 [P0] Rename sweep for the old moved spec path returns zero hits.
- [x] CHK-301 [P0] Typecheck from `system-spec-kit/mcp_server` exits 0.
- [x] CHK-302 [P0] Requested Vitest command run and fail count recorded.
- [x] CHK-303 [P0] Strict validate 003.
- [x] CHK-304 [P0] Strict validate 009.
- [x] CHK-305 [P0] Strict validate 013.
- [x] CHK-306 [P0] Strict validate 008.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-310 [P0] Gate 3 satisfied with existing `013/009/003` packet.
- [x] CHK-311 [P0] Relevant skill docs read.
- [x] CHK-312 [P1] Old source directory absence confirmed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] `context-server.ts` advisor imports point at `system-skill-advisor/mcp_server`.
- [x] CHK-011 [P0] Bridge schemas/tools/helpers no longer import the deleted advisor source path.
- [x] CHK-012 [P0] No `advisor_*` MCP tool-id rename.
- [x] CHK-013 [P1] Package config trio authored.
- [x] CHK-014 [P1] DB resolver honors `SYSTEM_SKILL_ADVISOR_DB_DIR`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Spec Kit bridge typecheck passed.
- [x] CHK-021 [P0] Vitest fail count recorded.
- [x] CHK-022 [P0] Strict validation green at all requested levels.
- [x] CHK-023 [P1] Old DB stub absent; new DB row counts recorded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] Step A path rewrite completed.
- [x] CHK-FIX-002 [P0] Step B bridge import fixups completed.
- [x] CHK-FIX-003 [P1] Package README reflects landed content.
- [x] CHK-FIX-004 [P1] DB stub outcome documented.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-320 [P0] No old DB stub deleted without evidence.
- [x] CHK-321 [P0] Public `advisor_*` ids unchanged.
- [x] CHK-322 [P1] Runtime configs and hook cutover left untouched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] Spec/plan/tasks/checklist rewritten to finalization contract.
- [x] CHK-041 [P1] Implementation summary ledger present.
- [x] CHK-042 [P2] Package README describes landed directories.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-330 [P0] Old source directory not recreated.
- [x] CHK-331 [P0] New package configs live under `system-skill-advisor/mcp_server`.
- [x] CHK-332 [P1] Parent graph lists moved `013` child.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| Rename sweep | Pass |
| Typecheck | Pass |
| Vitest | Recorded: requested filter found no test files; fail count 0 |
| Strict validation | Pass |
<!-- /ANCHOR:summary -->
