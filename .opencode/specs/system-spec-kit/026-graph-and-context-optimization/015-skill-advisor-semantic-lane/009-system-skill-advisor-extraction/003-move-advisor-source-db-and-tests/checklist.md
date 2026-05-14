---
title: "Checklist: Move advisor source DB and tests"
description: "QA gates for the physical source + DB move."
trigger_phrases:
  - "advisor source move checklist"
  - "015/009/003 checklist"
importance_tier: "critical"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/003-move-advisor-source-db-and-tests"
    last_updated_at: "2026-05-14T10:45:00Z"
    last_updated_by: "claude"
    recent_action: "Checklist authored"
    next_safe_action: "Author impl-summary"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-move-advisor-source-db-and-tests"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Move advisor source DB and tests

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol
- [ ] CHK-300 [P0] Strict validate 003.
- [ ] CHK-301 [P0] Strict validate parent 015/009 + parent 015.
- [ ] CHK-302 [P0] Vitest skill_advisor parity ≤ 3 failures.
- [ ] CHK-303 [P0] `tsc --noEmit` from `system-spec-kit/mcp_server/` exit-0.
- [ ] CHK-304 [P1] Grep sweep: no live code references old `skill_advisor/` path.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-310 [P0] Pre-move inventory captured (file list + import graph).
- [ ] CHK-311 [P0] ADR-001 + 002 scaffold re-read.
- [ ] CHK-312 [P1] Hardcoded-path fixture list enumerated.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-010 [P0] All moves via `git mv` (blame survives).
- [ ] CHK-011 [P0] Import paths inside moved files use correct relative paths.
- [ ] CHK-012 [P0] No `advisor_*` MCP tool-id renames.
- [ ] CHK-013 [P1] tsconfig + vitest config authored at new location and discoverable.
- [ ] CHK-014 [P1] DB path resolver honors `SYSTEM_SKILL_ADVISOR_DB_DIR` env override.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] All acceptance criteria from spec.md met.
- [ ] CHK-021 [P0] Vitest skill_advisor failure count ≤ 3.
- [ ] CHK-022 [P0] advisor_recommend MCP smoke returns shaped output post-move.
- [ ] CHK-023 [P1] DB-isolation: NEW path SQLite mtime advances after smoke; OLD path absent.
- [ ] CHK-024 [P1] Env-override test confirms `SYSTEM_SKILL_ADVISOR_DB_DIR` routing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] Old `skill_advisor/` directory empty after move (apart from ignorable artifacts).
- [ ] CHK-FIX-002 [P0] context-server.ts advisor handler imports point at new location.
- [ ] CHK-FIX-003 [P1] Updated mcp_server/README.md reflects landed content.
- [ ] CHK-FIX-004 [P1] Parity delta documented (4 → ≤ 3).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-320 [P0] No secrets in moved tree (grep for known token patterns pre-commit).
- [ ] CHK-321 [P0] New DB file permissions match old (700).
- [ ] CHK-322 [P1] Edits restricted to documented surfaces (no out-of-scope mutations).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P1] Spec/plan/tasks/checklist synchronized.
- [ ] CHK-041 [P1] Implementation-summary edit ledger present + parity delta documented.
- [ ] CHK-042 [P2] system-skill-advisor/mcp_server/README.md describes landed directories.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-330 [P0] Moved files land under `system-skill-advisor/mcp_server/` only.
- [ ] CHK-331 [P0] DB files (skill-graph.sqlite{,-shm,-wal}) at new location; old path absent.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All P0 items | Pending |
| All P1 items | Pending |
| Strict validation (003 + 009 + 015) | Pending |
| Vitest ≤ 3 failures | Pending |
| Parity test delta documented | Pending |
<!-- /ANCHOR:summary -->
