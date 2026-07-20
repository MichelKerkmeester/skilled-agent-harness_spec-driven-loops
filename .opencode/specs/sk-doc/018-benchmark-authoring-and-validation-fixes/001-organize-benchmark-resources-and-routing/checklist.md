---
title: "Verification Checklist: Create-Benchmark Resource Reorganization and Routing"
description: "Verify tracked resource moves, path integrity, family routing coverage, package validity, and recursive packet validity."
trigger_phrases:
  - "verify create benchmark reorganization"
  - "verify benchmark routing coverage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-benchmark-authoring-and-validation-fixes/001-organize-benchmark-resources-and-routing"
    last_updated_at: "2026-07-13T06:05:00Z"
    last_updated_by: "claude-code"
    recent_action: "All verification items confirmed with evidence"
    next_safe_action: "Recursive strict validation and commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Create-Benchmark Resource Reorganization and Routing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or document an operator-imposed scope constraint |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` (§4 REQ-001..005).
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Exact moves, allowed paths, banned operations, and verification commands identified in `spec.md` §3 + `tasks.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All changed JSON parses (`node -e require(mode-registry.json)+require(hub-router.json)` → `both JSON parse OK`).
- [x] CHK-011 [P0] `package_skill.py create-benchmark --check` reports `PASS`.
- [x] CHK-012 [P1] Resource grouping preserves top-level `assets/` and `references/` (subfolders live under them; `package_skill` `PASS`).
- [x] CHK-013 [P1] No unrelated sk-doc packet or lane behavior changed (diff limited to `create-benchmark/**`, `mode-registry.json`, `hub-router.json`, consumer paths).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 16 requested target files exist (`git status` shows `16 R` renames into the family subfolders).
- [x] CHK-021 [P0] Exact family vocabulary exists in all three routing sources: `create-benchmark/SKILL.md` §2 + Keywords, `mode-registry.json` aliases, `hub-router.json` `create-benchmark-aliases`.
- [x] CHK-022 [P1] Active writable consumers point at new paths (`migrate-cb-paths.cjs`: 136 refs / 31 files; `0` residual stale in live files).
- [x] CHK-023 [P1] Recursive strict packet validation reports zero errors and warnings (`validate.sh --recursive --strict` → Errors: 0, Warnings: 0).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classes are `class-of-path-reference` and `cross-consumer-routing`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed by exact filename search (`git grep` over all 16 basenames).
- [x] CHK-FIX-003 [P1] Consumer inventory completed across markdown, YAML, JSON, and scripts (`git grep` over all 16 basenames; 31 files touched).
- [x] CHK-FIX-004 [P1] Security/path/parser adversarial code tests not applicable to documentation path moves (`git diff` = renames + text only; no executable parser or input boundary).
- [x] CHK-FIX-005 [P1] Matrix axes: `4 families × 2 roots` (16 moves), plus `4 vocab terms × 3 routing sources`.
- [x] CHK-FIX-006 [P1] Process-global state not read by the changed resources or routing metadata (`git diff` = static path + JSON vocab edits; no runtime state reads).
- [x] CHK-FIX-007 [P1] Evidence pinned to the final uncommitted worktree `git diff` and command output.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Diff contains no secrets or credentials (`git diff` = path + vocabulary text only).
- [x] CHK-031 [P0] Input validation changes not applicable; no executable input boundary changes (`git diff` = doc path moves + JSON vocab text only).
- [x] CHK-032 [P1] Authentication and authorization not applicable to documentation path + routing-vocabulary edits (`git diff` verified).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Child `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` agree.
- [x] CHK-041 [P1] No code comments were added (`git diff` = path/vocab edits only; comment-hygiene clean).
- [x] CHK-042 [P2] create-benchmark `README.md` resource map uses the new family paths (19 refs repointed).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Every moved file is under its exact requested family subfolder (`git status` renames confirm).
- [x] CHK-051 [P1] No temporary files were created in the packet (`git status --porcelain` = tracked spec docs + renames only).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-13
<!-- /ANCHOR:summary -->
