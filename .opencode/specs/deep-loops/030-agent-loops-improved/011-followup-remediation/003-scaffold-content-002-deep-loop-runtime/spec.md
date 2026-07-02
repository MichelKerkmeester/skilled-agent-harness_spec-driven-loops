---
title: "Feature Specification: Scaffold Content Remediation — 002-deep-loop-runtime Leaves"
description: "Author real plan.md/tasks.md content and clean scaffold-signature frontmatter for all 18 leaf children under 002-deep-loop-runtime before the SCAFFOLD_NEVER_TOUCHED validate.sh rule (enabled by sibling child 006) starts failing them."
trigger_phrases:
  - "scaffold content remediation deep-loop-runtime"
  - "002-deep-loop-runtime scaffold cleanup"
  - "SCAFFOLD_NEVER_TOUCHED deep-loop-runtime"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/011-followup-remediation/003-scaffold-content-002-deep-loop-runtime"
    last_updated_at: "2026-07-01T21:58:00Z"
    last_updated_by: "gpt-5-5"
    recent_action: "Completed scaffold-content remediation across all 18 deep-loop-runtime leaves"
    next_safe_action: "No implementation action remaining; keep per-leaf docs indexed for future validation"
    blockers: []
    key_files:
      - ".opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime/001-atomic-state-serialize-diff/plan.md"
      - ".opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime/018-persisted-wait-crash-resume/tasks.md"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh"
      - ".opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation/003-scaffold-content-002-deep-loop-runtime/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:003a9f2c6e1d8b4f0c7a5e3d9b1f6a8c2e4d7f9b0a3c5e8d1f2b4a6c9e0d3f5a"
      session_id: "scaffold-content-remediation-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Scaffold Content Remediation — 002-deep-loop-runtime Leaves

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 |
| **Predecessor** | 002-fanout-leaf-identity-conflation |
| **Successor** | 004-scaffold-content-003-deep-loop-workflows |
| **Handoff Criteria** | All 18 leaf children under `002-deep-loop-runtime/` have real, non-placeholder plan.md/tasks.md body content grounded in each leaf's own spec.md, and zero scaffold-signature markers remain in either file's frontmatter |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
All 18 leaf children under `.opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime/` (`001-atomic-state-serialize-diff` through `018-persisted-wait-crash-resume`) have a `plan.md` and `tasks.md` whose body content is still unmodified scaffold-template placeholder prose — literal text such as `[Component 1]: [Purpose]` (e.g. `002-deep-loop-runtime/001-atomic-state-serialize-diff/plan.md:84`) and unchecked items literally reading `[Implement core feature 1]` (`.../tasks.md:63`). Their frontmatter also still carries scaffold markers: `title: "... [template:level_1/plan.md]"`, `_memory.continuity.packet_pointer: "scaffold/<child-name>"`, `last_updated_by: "template-author"`, and an all-zero `session_dedup.fingerprint`. Meanwhile each leaf's own sibling `spec.md` is genuinely authored, cites real shipped code (e.g. `001-atomic-state-serialize-diff/spec.md` cites `writeStateIfChangedAtomic`), and declares `Status: Complete` — exactly the precondition the `SCAFFOLD_NEVER_TOUCHED` rule (`.opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh`, being registered into `validate.sh --strict` by sibling child `006-validate-sh-registry-bridge` in this same phase) checks before flagging an error. Once child 006 ships, these 36 files (18 `plan.md` + 18 `tasks.md`) will start failing `validate.sh --strict` unless remediated first.

### Purpose
Author real `plan.md`/`tasks.md` content for all 18 of `002-deep-loop-runtime`'s leaf children, grounded in each leaf's own already-correct `spec.md` (the ground truth for what was actually built) and the real shipped code it cites. Fix the frontmatter continuity block (title, packet_pointer, last_updated_by, fingerprint) so `SCAFFOLD_NEVER_TOUCHED` stops flagging these already-shipped, already-Complete leaves.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read each of the 18 leaves' `spec.md` in full first — they are the ground truth for what was actually built.
- Author `plan.md` for each leaf (Technical Context / Overview / Quality Gates / Architecture / Implementation Phases marked complete / Testing Strategy / Dependencies / Rollback, matching the Level-1 `plan-core` template shape) describing the real implementation.
- Author `tasks.md` for each leaf (task ledger with all tasks marked `[x]` complete, matching the Level-1 `tasks-core` template shape) describing the real work performed.
- Fix frontmatter for both files per leaf: real, non-`[template:` title; `packet_pointer` without a `scaffold/` prefix (using the leaf's real packet path); `last_updated_by: "claude-sonnet-5"` (or an appropriate real author); `completion_pct: 100` since these are already-shipped features; a real (non-all-zero) fingerprint value.

### Out of Scope
- Modifying the leaves' own `spec.md` files (already correct and authored).
- Modifying any actual runtime source code under `.opencode/skills/deep-loop-runtime/`.
- Scaffold cleanup for phases 003-007 (`002-deep-loop-workflows` and phases 004 through 007) — those are separate sibling children `004-scaffold-content-003-deep-loop-workflows` and `005-scaffold-content-004-through-007`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `002-deep-loop-runtime/{001-018}-*/plan.md` | Modify | Replace scaffold placeholder body + fix scaffold-signature frontmatter (18 files, one per leaf) |
| `002-deep-loop-runtime/{001-018}-*/tasks.md` | Modify | Replace scaffold placeholder task ledger + fix scaffold-signature frontmatter (18 files, one per leaf) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero scaffold-signature markers remain | None of the 18 leaves' plan.md/tasks.md contain `[template:` in title, a `scaffold/`-prefixed packet_pointer, or `last_updated_by: "template-author"` |
| REQ-002 | Real, non-placeholder body content | Every plan.md/tasks.md describes the actual implementation, verified against that leaf's own spec.md — no literal `[Component N]`, `[Implement core feature N]`, or other bracketed placeholder text remains |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Content accuracy | Authored content cites the same real files/evidence the leaf's own spec.md already cites — no fabricated claims |
| REQ-004 | Fingerprint/completion parity | Each fixed file carries a non-all-zero fingerprint and `completion_pct: 100`, matching the leaf's Complete status |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <leaf-folder> --strict` passes (exit 0) for all 18 leaves under `002-deep-loop-runtime/`.
- **SC-002**: A manual spot-check across a sample of leaves confirms authored plan.md/tasks.md content matches what the sibling spec.md and real shipped code describe.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Largest single chunk of work in the phase (18 leaves x 2 files = 36 files) | Time/effort risk | Batch by leaf; read each leaf's spec.md before authoring its plan.md/tasks.md pair |
| Risk | Superficial/generic filler text instead of real accurate content | Would defeat the purpose of the fix and could reintroduce a soft scaffold problem | Require each leaf's own spec.md be read first as the grounding source; cite the same file:line evidence it already cites |
| Dependency | Sibling child `006-validate-sh-registry-bridge` (registers `SCAFFOLD_NEVER_TOUCHED` into `validate.sh --strict`) | This child's fix is only enforced once 006 ships, but must land before or alongside it to avoid new `--strict` failures | Complete this child's remediation before or in lockstep with 006's registry-bridge landing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope bounded by direct Explore research this session confirming the scaffold-content gap across all 18 leaves.
<!-- /ANCHOR:questions -->
