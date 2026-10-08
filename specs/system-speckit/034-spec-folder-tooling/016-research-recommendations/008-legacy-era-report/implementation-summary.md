---
title: "Implementation Summary"
description: "This phase is planned and not yet built."
trigger_phrases:
  - "legacy era report implementation summary"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/008-legacy-era-report"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "planning-author"
    recent_action: "Planned the phase"
    next_safe_action: "Build against goal.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-legacy-era-report |
| **Status** | Planned |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-will-be-built -->
## What Will Be Built

This phase is planned but not yet implemented. The plan calls for building a unified, read-only packet classifier that walks the spec tree once and categorizes each packet by five independent pre-v4 signals: the old `.opencode/specs` layout, missing frontmatter, missing or legacy template markers, missing generated metadata, and documents older than their level requires. The classifier uses an exclusion list to skip research lineages, scratch directories, changelog folders, and git-ignored paths. A header alias table normalizes drifting document spellings so missing-document repair can use canonical names. The era report feeds into `/doctor:update check` for external user compatibility assessment and into `upgrade-legacy` preflight to show what repair stages need to run.

### Files to Be Created
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs` (new module, 400+ lines)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts` (new test suite, 450 lines)

### Files to Be Modified
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` (preflight section)
- `.skilled/commands/doctor/assets/doctor-update-check.yaml` (compatibility section)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` (documentation)
<!-- /ANCHOR:what-will-be-built -->

---

<!-- ANCHOR:how-will-be-delivered -->
## How It Will Be Delivered

Tasks T001 through T019 (listed in tasks.md) follow the implementation phases: setup (exclusion list and aliases), implementation (classifier and report), verification (unit and integration tests, manual verification on the real corpus). The phase is not yet executed.
<!-- /ANCHOR:how-will-be-delivered -->

---

<!-- ANCHOR:key-decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Synchronous, single-threaded classifier | Corpus walk is fast enough (under 10s), keeping the module simple and testable |
| Independent signal detectors | Each runs on every packet so results can be cross-checked and findings sorted by class |
| Exclusion before classification | Keeps counts clean and prevents silently dropping real packets |
| Separate data structures for exclusions and aliases | Testable independently and easier to maintain as the corpus evolves |
<!-- /ANCHOR:key-decisions -->

---

<!-- ANCHOR:status -->
## Status: Planned, Not Yet Built

This packet is in the planning phase. Spec, plan, tasks, acceptance criteria and implementation summary are complete. The coordinator will set a goal once the planning documents pass validation. The phase is ready for implementation in a future session.
<!-- /ANCHOR:status -->

---


