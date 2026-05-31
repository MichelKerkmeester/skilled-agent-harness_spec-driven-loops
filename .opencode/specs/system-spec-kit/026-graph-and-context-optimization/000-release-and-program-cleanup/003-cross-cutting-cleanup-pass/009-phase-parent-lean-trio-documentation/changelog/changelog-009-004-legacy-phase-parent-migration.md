---
title: "Retroactive Phase-Parent Migration: Lean Trio Applied to 31 Legacy Parents"
description: "31 legacy NNN-prefixed phase parents retrofitted to the lean-trio policy via 3 parallel cli-codex workers. Every touched parent now exposes spec.md plus description.json plus graph-metadata.json. Heavy docs and manual relationship blocks preserved verbatim."
trigger_phrases:
  - "retroactive phase parent migration"
  - "lean trio retrofit complete"
  - "legacy phase parent backfill"
  - "phase parent lean trio migration"
  - "004-legacy-phase-parent-migration"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation`

### Summary

The lean-trio policy (spec.md + description.json + graph-metadata.json at every phase-parent level) was enforced for new parents but not yet applied to the 28 to 31 legacy NNN-prefixed parents already in the repo. Those parents split into two states: Category B parents had a full lean trio but stale metadata, while Category C parents were missing spec.md entirely. Operators and the resume command encountered a mixed surface across the repo.

Three parallel cli-codex workers running gpt-5.4-medium with `service_tier=fast` processed all 31 parents in approximately 14 minutes. Worker 1 covered the 022 and 023 hybrid-rag subtrees (11 parents). Worker 2 covered 00--ai-systems, 024 plus the 026/011-stress subtree (9 parents). Worker 3 covered the 026 C-category parents and z_archive/z_future entries (11 parents). The first dispatch used cli-copilot, which stalled on `~/.copilot/session-state/` permission walls. The same briefs re-dispatched cleanly via cli-codex with the danger-full-access sandbox.

Every touched parent now exposes the lean trio. Manual relationship blocks (`depends_on`, `supersedes`, `related_to` in graph-metadata.json) were preserved byte-equal. Heavy docs at Category B parents were not deleted. The 026 regression baseline (three parent-level error rule classes) was unchanged.

### Added

- Full lean trio (`spec.md` + `description.json` + `graph-metadata.json`) synthesized for 9 Category C parents that lacked a `spec.md`. Affected parents include `024-compact-code-graph/`, `026/000-release-cleanup/`, `026/005-code-graph/` plus 4 z_archive parents.
- PHASE DOCUMENTATION MAP table populated in each synthesized and refreshed `spec.md`, listing every NNN-named child folder with its derived status.
- Per-worker JSON reports at `004/scratch/worker-{1,2,3}-report.json`, each recording processed count, skipped count, blocked count plus pre/post validator status.
- Aggregated migration manifest at `004/scratch/migration-manifest.json` as single audit source across all 3 workers.

### Changed

- `description.json` refreshed on all 22 Category B parents. The `lastUpdated` field now reflects the migration date. The `memoryNameHistory` array was preserved.
- `graph-metadata.json.derived` refreshed on all 22 Category B parents: `last_save_at`, `children_ids`, `derived.status` all now reflect filesystem reality. The `manual` block was preserved verbatim.
- `spec.md` updated on Category B parents where the existing content was heavy narrative rather than a lean manifest. Narrative vision and purpose sections were carried forward.

### Fixed

- Category C parents (`024-compact-code-graph/`, `026/005-code-graph/`, `026/000-release-cleanup/`) previously lacked a `spec.md`, causing `is_phase_parent()` to fire the FILE_EXISTS error path. Now each has a valid lean spec.
- Stale `children_ids` arrays in graph-metadata.json on Category B parents caused the resume command to list wrong or incomplete child sets. Refreshed derived block corrects this.
- The mixed lean surface across the repo meant AI agents and `spec_kit:resume` could not predict which parents would redirect vs. list children. The uniform post-migration surface resolves this inconsistency.

### Verification

| Check | Result |
|-------|--------|
| All 3 worker JSON reports filed (REQ-006) | PASS. `worker-{1,2,3}-report.json` all present |
| 31 phase parents processed, 0 skipped (REQ-001 + REQ-002) | PASS. 11 + 9 + 11 = 31 |
| Manual block byte-equal pre/post (REQ-003) | PASS. 0 violations across all 3 worker reports. Spot-check of 005-code-graph confirms 3 supersedes entries intact |
| Heavy docs preserved at parent level (REQ-004) | PASS. Spot-check of `00--ai-systems/001-global-shared` and `022/008` confirms `plan.md`, `tasks.md`, `implementation-summary.md` still present |
| 026 regression baseline unchanged (REQ-005) | PASS. Pre `[FRONTMATTER_MEMORY_BLOCK, SPEC_DOC_INTEGRITY, TEMPLATE_SOURCE]` (count=3) equals post (count=3) at 026 root |
| Narrative preservation (REQ-007) | PASS. 0 narrative violations across all 3 workers |
| PHASE DOCUMENTATION MAP populated (REQ-008) | PASS. Verified in 000-release-cleanup synthesized spec.md |
| Cross-impl detection still agrees (REQ-009) | PASS. `is_phase_parent()` and `isPhaseParent()` at 6/6 fixture parity from Phase 1. Lean-trio outputs continue to detect identically |
| Validator phase-parent branch fires (REQ-010) | PASS. Validator output shows `Phase parent: spec.md present (lean trio policy)` for spot-checked migrated parents |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| 22 phase parents: `description.json` + `graph-metadata.json.derived` | Modified | Refreshed metadata. Manual block and narrative preserved |
| 9 phase parents: full lean trio (`spec.md` + `description.json` + `graph-metadata.json`) | Created | Synthesized missing lean trio for Category C parents |
| `004/scratch/worker-1-report.json` (NEW) | Created | Worker 1 JSON migration report covering 022 and 023 subtrees (11 parents) |
| `004/scratch/worker-2-report.json` (NEW) | Created | Worker 2 JSON migration report covering 00--ai-systems, 024, 026/011-stress (9 parents) |
| `004/scratch/worker-3-report.json` (NEW) | Created | Worker 3 JSON migration report covering 026 C-category and z_archive/z_future (11 parents) |
| `004/scratch/migration-manifest.json` (NEW) | Created | Aggregated manifest across all 3 workers |

### Follow-Ups

- Improve the `check-spec-doc-integrity.sh` validator to skip plain-prose and HTML-comment mentions of `plan.md`, `tasks.md`, etc. The current rule flags the canonical CONTENT DISCIPLINE comment block in every lean parent template, producing false-positive `SPEC_DOC_INTEGRITY` warnings. This is a P3 improvement tracked separately.
- Populate `derived.last_active_child_id` on migrated parents that have never been saved. The field fills naturally on the next per-parent memory save. No action required in 004.
- Evaluate whether spec-collection roots (`.opencode/specs/system-spec-kit/`, `.opencode/specs/00--ai-systems/`) should receive a lightweight README equivalent. These folders trigger phase-parent detection but are directory containers, not spec packets. A separate "spec-roots README" packet can address this.
