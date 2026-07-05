---
title: "Implementation Plan: Scaffold Content Backfill: Phases 004-007 (10 Leaves)"
description: "Plan to author real plan.md/tasks.md content and fix scaffold-signature frontmatter for 10 already-Complete leaves across phases 004, 005, 006, and 007."
trigger_phrases:
  - "scaffold content backfill"
  - "phases 004 through 007 scaffold"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/011-followup-remediation/005-scaffold-content-004-through-007"
    last_updated_at: "2026-07-01T22:55:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed scaffold content backfill"
    next_safe_action: "Review validation output"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Scaffold Content Backfill: Phases 004-007 (10 Leaves)

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec-kit documents (YAML frontmatter + template body) |
| **Framework** | system-spec-kit Level-1 `plan-core`/`tasks-core` templates |
| **Testing** | `check-scaffold-never-touched.sh` (rule `SCAFFOLD_NEVER_TOUCHED`), `validate.sh --strict` |

### Overview
Read each of the 10 leaves' own `spec.md` as ground truth, then author real `plan.md`/`tasks.md` body content matching the Level-1 template shape and marked complete (since the features are already shipped), while rewriting the frontmatter continuity block so no scaffold-signature marker remains.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All 10 leaves' `spec.md` read in full and confirmed as ground truth (already Complete, cites real shipped files).
- [x] Scaffold-marker defect confirmed for each leaf's `plan.md`/`tasks.md`; `SCAFFOLD_NEVER_TOUCHED` confirmed registered but dormant under the default `orchestrator.ts` path via a direct test run.

### Definition of Done
- [x] All 10 leaves' `plan.md`/`tasks.md` carry real, spec-grounded body content.
- [x] All 10 leaves' frontmatter continuity blocks are fixed (title, packet_pointer, last_updated_by, completion_pct).
- [x] Marker scans and recursive strict validation pass across phases 004, 005, 006, and 007.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-then-author backfill: for each leaf, read its own `spec.md` Scope/Requirements/Files-to-Change sections, then translate the already-described (and already-shipped) work into `plan.md`'s Implementation Phases and `tasks.md`'s task ledger, all marked complete.

### Key Components
- **Leaf `spec.md`**: ground truth for what shipped and which files it touched — never modified.
- **Leaf `plan.md`/`tasks.md`**: currently scaffold placeholders; rewritten to real, spec-grounded, complete-status content.
- **`check-scaffold-never-touched.sh`**: verification target — greps frontmatter for `[template:`, `scaffold/` packet_pointer, and `template-author` last_updated_by.

### Data Flow
Leaf `spec.md` (Scope/Requirements/Files to Change) -> read as ground truth -> translated into `plan.md` Implementation Phases + `tasks.md` task ledger (both marked complete) -> frontmatter continuity block rewritten -> `check-scaffold-never-touched.sh` re-run per leaf to confirm zero markers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read all 10 leaves' `spec.md` in full (already done during spec authoring; re-confirm before writing each leaf's plan/tasks).
- [x] Re-run `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED` on a representative leaf to capture the exact current marker shape before editing.

### Phase 2: Core Implementation
- [x] `004-system-spec-kit/001-speckit-autopilot-lifecycle`: authored `plan.md`/`tasks.md` grounded in its `spec.md` (unattended `:autopilot` envelope, terminal reason codes, branch-preserved failure path).
- [x] `005-skill-interconnection/001-advisor-routing-projection`: authored `plan.md`/`tasks.md` grounded in its `spec.md` (projection generator, drift-guard hash-freshness conversion, `workflowMode` publication).
- [x] `006-ux-observability-automation/001` through `006`: authored `plan.md`/`tasks.md` for all 6 leaves in phase order (sparkline trend, single-loop telemetry, unified event envelope, run-now control, per-iteration memory upsert, loop-wide dry-run), grounded in each leaf's `spec.md`.
- [x] `007-testing/001-hermetic-test-isolation` and `002-record-replay-cassette-harness`: authored `plan.md`/`tasks.md` for both leaves in phase order, grounded in each leaf's `spec.md`.
- [x] Fixed the frontmatter continuity block in all 20 files (title, `packet_pointer` without `scaffold/` prefix, `last_updated_by: claude-sonnet-5`, `completion_pct: 100`).

### Phase 3: Verification
- [x] Run marker scans against the four phase roots; confirm no scaffold frontmatter markers or common placeholder body text remain in the 10 target leaves.
- [x] Run `validate.sh --strict --recursive` against each of the four phase roots; confirm every folder reports `RESULT: PASSED`.
- [x] Manual spot-check: confirm each authored `plan.md`/`tasks.md` cites the same real files/evidence as its own `spec.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Rule check | Scaffold-signature marker detection per leaf | `check-scaffold-never-touched.sh` via `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED` |
| Manual | Content-accuracy spot-check against each leaf's own `spec.md` | Read + diff review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `004-scaffold-content-003-deep-loop-workflows` (Predecessor) | Internal | Not yet authored | None — this child's leaf set (004/005/006/007) does not overlap with the predecessor's leaf set (002/003), so it can proceed independently |
| `006-validate-sh-registry-bridge` (Successor) | Internal | Blocked on this child | Cannot bridge `SCAFFOLD_NEVER_TOUCHED` into `orchestrator.ts`'s default path until this child (and siblings 003/004) reach Status: Complete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A leaf's authored `plan.md`/`tasks.md` is found to misrepresent its own `spec.md`, or `check-scaffold-never-touched.sh` still reports markers after editing.
- **Procedure**: `git checkout -- <the affected leaf's plan.md and/or tasks.md>`; no other packet content touched; re-author from the leaf's `spec.md` again.
<!-- /ANCHOR:rollback -->
