---
title: "Checklist: Scaffold system-code-graph skill folder"
description: "QA checklist for Phase 002 empty system-code-graph scaffold."
trigger_phrases:
  - "code graph skill scaffold"
  - "system-code-graph scaffold"
  - "002 scaffold-skill"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/007-016-scaffold-skill"
    last_updated_at: "2026-05-14T08:00:03Z"
    last_updated_by: "codex"
    recent_action: "Verified Phase 002 scaffold"
    next_safe_action: "Phase 003 can move source"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140002"
      session_id: "002-scaffold-skill"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Checklist: Scaffold system-code-graph skill folder

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] CHK-200 [P0] Strict validate this packet. (exit code 0)
- [x] CHK-201 [P0] Required skill tree validation returns `SKILL_TREE_VALIDATED=yes`.
- [x] CHK-202 [P1] Parent 014 graph metadata lists this child and makes it active.
- [x] CHK-203 [P1] No Phase 003+ packet folders are created.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-210 [P0] ADR-001 read. (Phase 002 row and Q3 co-resident topology verified)
- [x] CHK-211 [P0] Precedent packet read. (`001-extraction-design-and-adr` docs)
- [x] CHK-212 [P1] Existing placeholder state inspected. (`system-code-graph` had empty SKILL/README/graph metadata)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No code moved from `system-spec-kit/mcp_server/code_graph/`. (status clean for that path)
- [x] CHK-011 [P0] Skill docs state source moves happen in Phase 003. (`SKILL.md`, `README.md`)
- [x] CHK-012 [P1] Skill docs state doc migration happens in Phase 005. (`SKILL.md`)
- [x] CHK-013 [P1] Skill docs state tools remain registered under `spec_kit_memory`. (`SKILL.md`, `README.md`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Strict packet validation passes or exit code is recorded. (exit code 0)
- [x] CHK-021 [P0] Scaffold tree validation passes. (`SKILL_TREE_VALIDATED=yes`)
- [x] CHK-022 [P1] JSON files are 2-space formatted with trailing newlines. (manual file review)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All 7 packet target files exist.
- [x] CHK-FIX-002 [P0] Skill top-level target files exist.
- [x] CHK-FIX-003 [P0] Required empty scaffold directories exist.
- [x] CHK-FIX-004 [P1] `.gitkeep` files use the exact Phase 002 placeholder text.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-220 [P0] No required network requests were run. (validation and scaffold checks are local)
- [x] CHK-221 [P0] No secrets or credential files were touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and summary are synchronized.
- [x] CHK-041 [P1] Skill README has Tools, Storage, Integration, and References sections.
- [x] CHK-042 [P2] Metadata trigger phrases include the requested scaffold phrases.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-230 [P0] Only Phase 002 packet files, skill scaffold files, and parent graph metadata are touched.
- [x] CHK-231 [P1] Existing root placeholder files outside scope are not deleted.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Status |
|------|--------|
| All P0 items | PASS |
| All P1 items | PASS |
| Strict validation | PASS (exit code 0) |
| Skill tree validation | PASS (`SKILL_TREE_VALIDATED=yes`) |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-110 [P1] No long-running scans required. (scaffold-only packet)
<!-- /ANCHOR:perf-verify -->
