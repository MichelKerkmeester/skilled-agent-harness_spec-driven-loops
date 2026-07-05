---
title: "Implementation Plan: Scaffold Content Remediation — 002-deep-loop-runtime Leaves"
description: "Plan to author real plan.md/tasks.md content and fix scaffold-signature frontmatter for all 18 leaf children under 002-deep-loop-runtime."
trigger_phrases:
  - "scaffold content remediation deep-loop-runtime"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/011-followup-remediation/003-scaffold-content-002-deep-loop-runtime"
    last_updated_at: "2026-07-01T21:58:00Z"
    last_updated_by: "gpt-5-5"
    recent_action: "Completed all per-leaf plan/tasks remediations and verification"
    next_safe_action: "No plan action remaining"
    blockers: []
    key_files:
      - ".opencode/specs/deep-loops/030-deep-loop-improved/002-deep-loop-runtime/001-atomic-state-serialize-diff/plan.md"
    session_dedup:
      fingerprint: "sha256:003b9f2c6e1d8b4f0c7a5e3d9b1f6a8c2e4d7f9b0a3c5e8d1f2b4a6c9e0d3f5b"
      session_id: "scaffold-content-remediation-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Scaffold Content Remediation — 002-deep-loop-runtime Leaves

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec-kit documentation (frontmatter + anchor-tagged body) |
| **Framework** | system-spec-kit Level-1 `spec-core`/`plan-core`/`tasks-core` templates |
| **Testing** | `check-scaffold-never-touched.sh` via `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED validate.sh --strict` |

### Overview
Read each of the 18 `002-deep-loop-runtime` leaf children's `spec.md` in full, then author a matching `plan.md` and `tasks.md` per leaf describing the real, already-shipped implementation and marking the task ledger complete, while fixing the four scaffold-signature frontmatter markers (`[template:` title, `scaffold/` packet_pointer, `template-author`, all-zero fingerprint) that would otherwise trip `SCAFFOLD_NEVER_TOUCHED` once sibling child 006 registers it into `validate.sh --strict`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause and exact scaffold markers confirmed against current code (Explore research: `[template:` title, `scaffold/` packet_pointer, `template-author`, all-zero fingerprint).
- [x] `SCAFFOLD_NEVER_TOUCHED` rule logic read and confirmed (`check-scaffold-never-touched.sh`) — it only fires when the leaf's own spec.md declares `Status: Complete`, which all 18 leaves do.

### Definition of Done
- [x] All 18 leaves' `plan.md` have real body content grounded in that leaf's spec.md.
- [x] All 18 leaves' `tasks.md` have a real task ledger with every task marked `[x]`, grounded in that leaf's spec.md.
- [x] All 36 files have scaffold-signature frontmatter fixed (title, packet_pointer, last_updated_by, fingerprint, completion_pct).
- [x] `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED validate.sh --strict` passed for each of the 18 leaf folders.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-leaf documentation remediation: for each of the 18 leaves, read-then-author, applied uniformly across a fixed template shape.

### Key Components
- **Leaf `spec.md` (read-only, ground truth)**: already-authored, `Status: Complete`, cites real shipped code — the source every plan.md/tasks.md rewrite must be grounded in.
- **`plan-core` v2.2 template shape**: Technical Context / Overview / Quality Gates / Architecture / Implementation Phases / Testing Strategy / Dependencies / Rollback — reused per leaf, populated with real content instead of placeholders.
- **`tasks-core` v2.2 template shape**: Task Notation / Phase 1-3 ledger / Completion Criteria / Cross-References — reused per leaf, tasks marked `[x]` complete.
- **`check-scaffold-never-touched.sh`**: the validate.sh rule this remediation exists to satisfy; it scans `plan.md`, `tasks.md`, `implementation-summary.md`, and `checklist.md` frontmatter for the four scaffold markers whenever the sibling `spec.md` claims `Status: Complete`.

### Data Flow
For each of the 18 leaves: read `spec.md` in full -> extract real components/evidence/file:line citations -> author `plan.md` describing the implementation as already complete -> author `tasks.md` with the equivalent work items marked `[x]` -> fix both files' frontmatter -> spot-check against `spec.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Enumerate the 18 leaf folders under `002-deep-loop-runtime/` (`001-atomic-state-serialize-diff` through `018-persisted-wait-crash-resume`).
- [x] Confirm the exact `SCAFFOLD_NEVER_TOUCHED` marker patterns against `check-scaffold-never-touched.sh`.

### Phase 2: Implementation
- [x] Per leaf: read `spec.md` in full as grounding source.
- [x] Per leaf: author `plan.md` (real Technical Context/Overview/Quality Gates/Architecture/Implementation Phases marked complete/Testing Strategy/Dependencies/Rollback).
- [x] Per leaf: author `tasks.md` (real task ledger, all tasks `[x]`).
- [x] Per leaf: fix frontmatter in both files (title, packet_pointer, last_updated_by, fingerprint, completion_pct: 100).

### Phase 3: Verification
- [x] Run `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED validate.sh --strict` against each of the 18 leaf folders; confirmed 0 failures.
- [x] Manual spot-check each leaf's authored content against its own spec.md and cited evidence list during the per-leaf pass.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Rule check | `SCAFFOLD_NEVER_TOUCHED` marker absence, per leaf | `check-scaffold-never-touched.sh` via `validate.sh --strict` |
| Manual | Content-accuracy spot-check against each leaf's own spec.md | Read + diff review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sibling child `006-validate-sh-registry-bridge` | Internal | Not started | Registers `SCAFFOLD_NEVER_TOUCHED` into `validate.sh --strict`; this child's fix must land before or alongside 006 to avoid new `--strict` failures on the 18 leaves |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Authored content for a leaf is found to be inaccurate or fabricated relative to its own spec.md.
- **Procedure**: `git checkout -- <the specific leaf's plan.md and/or tasks.md>`; re-author from that leaf's spec.md only, no other leaf or packet content touched.
<!-- /ANCHOR:rollback -->
