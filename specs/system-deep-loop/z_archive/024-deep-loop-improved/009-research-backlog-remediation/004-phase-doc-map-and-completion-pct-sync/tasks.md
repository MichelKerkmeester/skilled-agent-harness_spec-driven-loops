---
title: "Tasks: Phase Documentation Map and Completion-Pct Sync"
description: "Task list for the phase-map and completion_pct sync script + backfill."
trigger_phrases:
  - "phase documentation map sync tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/009-research-backlog-remediation/004-phase-doc-map-and-completion-pct-sync"
    last_updated_at: "2026-07-01T07:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase Documentation Map and Completion-Pct Sync

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Wrote `sync-phase-map-status.ts` (ESM TS, `.opencode/skills/system-spec-kit/scripts/spec/`) with `--dry-run` and write modes, scoped to one phase-parent target at a time (no repo-wide `--all` mode)
- [x] T002 Unit test: stale-Draft row gets corrected to match child's real Complete status — passes
- [x] T003 Unit test: already-correct row produces a no-op — passes
- [x] T004 Unit test: `In Progress` and `Not Started` children are never force-completed (explicit body status wins over any implementation-summary fallback) — passes
- [x] T005 Unit test: idempotency (run twice, second diff is empty) — passes; 5/5 total, independently re-run
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Dry-run against phases 002-007; reviewed the diff. Discovered the real descendant `spec.md` count is **40, not 143** — the original spec's estimate was wrong; corrected against ground truth rather than forcing the stale count
- [x] T007 Ran for real against phases 002-007: 40 phase-map rows (`Draft`→`Complete`) + 40 `completion_pct` fields (`0`→`100`) corrected, matching the dry-run exactly
- [x] T008 Spot-checked edited files across phases 002, 003, 006, 007 directly — parent map rows read `Complete`, descendant frontmatter reads `completion_pct: 100`, independently re-confirmed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Ran `validate.sh --recursive` on the root packet. The dispatched agent correctly refused to touch `graph-metadata.json` (out of its allowed write scope), which left a `SOURCE_FINGERPRINT_MISMATCH` on the 6 touched phase-parents plus a pre-existing `FRONTMATTER_MEMORY_BLOCK` narrative-field issue on the root packet's own `spec.md` (from this session's own earlier edit, unrelated to this child's scope). Both fixed directly by this orchestrating session: regenerated `graph-metadata.json` for the 6 phase-parents + root, and shortened the root's `recent_action`/`next_safe_action` frontmatter fields. Full recursive validation now **PASSED on all 10 folders** (root + 001-009), independently re-run
- [x] T010 Ran the new script's targeted Vitest file independently: 5/5 pass. Typecheck (`tsc --noEmit`) clean, no errors for the new script
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 10 tasks complete; 40 phase-map rows + 40 completion_pct fields backfilled (actual count, corrected down from the original 143 estimate); script idempotent and tested; validate.sh --recursive clean across all 10 folders.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md` · Plan: `./plan.md` · Implementation summary: `./implementation-summary.md`
- Source findings: `../../research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-001/G-001, F-003)
<!-- /ANCHOR:cross-refs -->
