---
title: "Implementation Plan: Scaffold Content Remediation - 003-deep-loop-workflows Leaves"
description: "Plan to replace scaffold body/frontmatter markers in all 12 leaf children of 003-deep-loop-workflows with real, spec.md-grounded plan.md/tasks.md content."
trigger_phrases:
  - "scaffold content remediation 003-deep-loop-workflows"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/011-followup-remediation/004-scaffold-content-003-deep-loop-workflows"
    last_updated_at: "2026-07-01T22:35:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Rewrote target leaf plan and task docs"
    next_safe_action: "Use validation evidence for handoff"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/030-deep-loop-improved/003-deep-loop-workflows/{001-012}-*/plan.md"
      - ".opencode/specs/system-deep-loop/030-deep-loop-improved/003-deep-loop-workflows/{001-012}-*/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Scaffold Content Remediation - 003-deep-loop-workflows Leaves

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec-kit docs (YAML frontmatter + markdown body) |
| **Framework** | system-spec-kit Level-1 `plan-core`/`tasks-core` v2.2 templates; `validate.sh` / `check-scaffold-never-touched.sh` |
| **Testing** | `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED bash validate.sh <leaf-folder> --strict` per leaf; `validate.sh --strict` for full packet validation |

### Overview
Read each of the 12 leaves' `spec.md` in full, then author real `plan.md`/`tasks.md` content for that leaf grounded strictly in what its `spec.md` already asserts, replacing scaffold-template placeholder body text and fixing the frontmatter continuity block so the scaffold-signature check no longer flags it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause and scaffold markers confirmed against current code (Explore research on `001-anti-convergence-floor` and `012-push-wave-fanout` as representative samples).
- [x] Fix scoped to `plan.md`/`tasks.md` body and frontmatter only; each leaf's own `spec.md` untouched.

### Definition of Done
- [x] All 12 leaves' `plan.md` have real content and a clean frontmatter continuity block.
- [x] All 12 leaves' `tasks.md` have real content and a clean frontmatter continuity block.
- [x] Full recursive strict validation passed for the phase parent and all 12 leaves.
- [x] Authored content was grounded in each leaf's own `spec.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-leaf read-then-rewrite loop: for each of the 12 leaves, read `spec.md` in full, derive `plan.md`/`tasks.md` content strictly from what `spec.md` already asserts (and the real code it cites), then overwrite `plan.md`/`tasks.md` preserving the `plan-core`/`tasks-core` v2.2 template shape.

### Key Components
- **Each leaf's `spec.md`**: ground-truth source of already-authored, evidence-backed implementation description; declares `Status: Complete`.
- **`check-scaffold-never-touched.sh`**: validator this remediation must satisfy (`SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED`).
- **`plan-core`/`tasks-core` v2.2 templates**: structural contract each rewritten file must continue to match.

### Data Flow
Leaf `spec.md` (real, `Status: Complete`) -> extract Problem/Scope/Requirements/Success Criteria/Files -> map into `plan.md` (Technical Context/Overview/Quality Gates/Architecture/Implementation Phases marked complete/Testing Strategy/Dependencies/Rollback) and `tasks.md` (task ledger with tasks marked `[x]`) -> fix frontmatter continuity block on both files (title, `packet_pointer`, `last_updated_by`, `completion_pct`, fingerprint).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read all 12 leaves' `spec.md` in full under `003-deep-loop-workflows/{001-012}-*/spec.md` (ground truth for what to describe).
- [x] Confirm the current scaffold markers present in each leaf's `plan.md`/`tasks.md` frontmatter (title, `packet_pointer`, `last_updated_by`, fingerprint).

### Phase 2: Implementation
- [x] For each of the 12 leaves, author real `plan.md` content (Technical Context/Overview/Quality Gates/Architecture/Implementation Phases marked complete/Testing Strategy/Dependencies/Rollback) grounded in that leaf's own `spec.md`.
- [x] For each of the 12 leaves, author real `tasks.md` content (task ledger with tasks marked `[x]` complete) grounded in that leaf's own `spec.md`.
- [x] Fix frontmatter on all 24 files: real title (no `[template:...]`), `packet_pointer` without a `scaffold/` prefix, `last_updated_by: claude-sonnet-5`, `completion_pct: 100`, non-zero fingerprint.

### Phase 3: Verification
- [x] Run full recursive `validate.sh --strict --recursive` against the phase parent; confirm 13 `RESULT: PASSED` entries and 0 findings.
- [x] Confirm all authored `plan.md`/`tasks.md` content was derived from each leaf's `spec.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Scaffold-signature check | Per-leaf `plan.md`/`tasks.md` frontmatter (title, `packet_pointer`, `last_updated_by`, fingerprint) | `validate.sh` with `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED` (sources `check-scaffold-never-touched.sh`) |
| Manual accuracy review | Authored `plan.md`/`tasks.md` content vs. each leaf's own `spec.md` and cited source | Manual spot-check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `006-validate-sh-registry-bridge` (sibling, same phase) | Soft | Not started | If 006 enables `SCAFFOLD_NEVER_TOUCHED` before this child completes, all 12 leaves' `plan.md`/`tasks.md` start failing `validate.sh --strict`; this child should land before or alongside 006 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Authored content found generic/inaccurate on spot-check, or `check-scaffold-never-touched.sh` still fails for a leaf.
- **Procedure**: `git checkout -- <affected leaf's plan.md tasks.md>`; re-read that leaf's `spec.md` and re-author; no other packet content touched.
<!-- /ANCHOR:rollback -->
