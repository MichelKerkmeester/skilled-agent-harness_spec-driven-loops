---
title: "Checklist - Phase 001 Complete CocoIndex MCP Fork"
description: "Verification checklist for complete CocoIndex MCP fork planning and implementation."
trigger_phrases:
  - "027 phase 001 checklist"
  - "cocoindex complete fork checklist"
importance_tier: "important"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-cocoindex-complete-fork"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored Phase 001 checklist"
    next_safe_action: "Record implementation evidence during fork import"
    blockers: []
    key_files: ["checklist.md", "tasks.md", "implementation-summary.md"]
    completion_pct: 0
---
# Verification Checklist: Complete CocoIndex MCP Fork

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- P0 items block completion.
- P1 items require completion or user-approved deferral.
- Evidence must include command output, file links, or test names.
- Do not run destructive `ccc reset` unless the user approves the reset step.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Existing spec parent selected: `027-xce-research-based-refinement`. Evidence: user request named the folder.
- [x] CHK-002 [P0] Upstream baseline researched. Evidence: GitHub `v0.2.33` latest release checked; local downloaded `cli.py` matches raw v0.2.33.
- [x] CHK-003 [P0] Level selected. Evidence: `recommend-level.sh --loc 1200 --files 35 --architectural --api --db` returned Level 3 score 90.
- [ ] CHK-004 [P0] Transitive `cocoindex` engine boundary confirmed.
- [ ] CHK-005 [P0] Fork-root layout decision recorded in ADR-001.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] Upstream source import excludes `.venv`, caches, build artifacts, and generated databases.
- [ ] CHK-007 [P0] Spec-kit patch overlay is named and reviewable, not hidden inside broad rewrites.
- [ ] CHK-008 [P0] Type/schema changes preserve MCP search compatibility.
- [ ] CHK-009 [P1] Update helper produces a clear upstream-vs-local diff report.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Upstream pytest subset passes locally.
- [ ] CHK-011 [P0] Spec-kit patch regression tests pass.
- [ ] CHK-012 [P0] `ccc --help` and `ccc --version` work from local editable install.
- [ ] CHK-013 [P1] MCP server construction or stdio smoke test passes without requiring live embedding provider.
- [ ] CHK-014 [P1] Docker E2E tests are either run or documented as manual/optional.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-015 [P0] `source_realpath` and `content_hash` behavior covered.
- [ ] CHK-016 [P0] `path_class` behavior covered.
- [ ] CHK-017 [P0] over-fetch dedup behavior covered.
- [ ] CHK-018 [P0] `dedupedAliases` and `uniqueResultCount` behavior covered.
- [ ] CHK-019 [P0] `raw_score` and `rankingSignals` behavior covered.
- [ ] CHK-020 [P1] canonical resource boost behavior covered.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-021 [P0] No script fetches and executes remote source during normal install.
- [ ] CHK-022 [P0] Apache-2.0 attribution preserved.
- [ ] CHK-023 [P1] Dependency versions and external engine boundary documented.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-024 [P0] Phase 001 spec, plan, tasks, checklist, ADR, research, and resource map created.
- [ ] CHK-025 [P0] Skill docs updated from soft-fork language to complete-fork language after implementation.
- [x] CHK-026 [P1] Later phase docs updated to depend on Phase 001 where needed. Evidence: Phase 007, 010, and 011 specs/plans/metadata now reference the complete-fork prerequisite.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-027 [P0] `001-cocoindex-complete-fork/` created under the parent packet.
- [x] CHK-028 [P0] Existing child phase folders renumbered to `002`-`011`.
- [ ] CHK-029 [P0] Imported upstream files classified in import manifest.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Area | Status | Evidence |
|------|--------|----------|
| Planning | Complete | Phase docs created 2026-05-10; parent/child phase map updated |
| Implementation | Pending | No code import performed in this planning pass |
| Tests | Pending | To run during implementation |
| Validation | Passed | `validate.sh` passed for parent and all 11 child phase folders |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-030 [P1] ADR-001 accepted and implemented.
- [ ] CHK-031 [P1] Fork-root layout matches ADR.
- [ ] CHK-032 [P1] Transitive engine boundary documented.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-033 [P1] CLI startup smoke captures no obvious regression from upstream lazy-load behavior.
- [ ] CHK-034 [P1] Search smoke performance recorded if daemon search is run.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-035 [P1] Local install path verified.
- [ ] CHK-036 [P1] Reindex requirement documented.
- [ ] CHK-037 [P1] Rollback command sequence documented in implementation summary.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-038 [P1] `NOTICE` names upstream v0.2.33 baseline.
- [ ] CHK-039 [P1] `CHANGELOG.md` records local fork version bump and patch port.
- [ ] CHK-040 [P1] Apache-2.0 license text remains present.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-041 [P1] `SKILL.md` and references match implemented behavior.
- [ ] CHK-042 [P1] `INSTALL_GUIDE.md` and `README.md` match scripts.
- [x] CHK-043 [P1] Parent phase map lists all children in current order. Evidence: parent `description.json` and `graph-metadata.json` list 001-011; strict validation passed for all child folders.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Role | Status | Notes |
|------|--------|-------|
| Planner | Complete | Planning artifacts authored |
| Implementer | Pending | Implementation not started |
| Reviewer | Pending | User review needed for engine boundary |
<!-- /ANCHOR:sign-off -->
