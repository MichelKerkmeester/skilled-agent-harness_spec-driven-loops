---
title: "Feature Specification: Scaffold Content Remediation - 003-deep-loop-workflows Leaves"
description: "Replace scaffold-template placeholder body content and frontmatter markers in all 12 leaf children of 003-deep-loop-workflows with real, spec.md-grounded plan.md/tasks.md content before SCAFFOLD_NEVER_TOUCHED validation ships."
trigger_phrases:
  - "scaffold content remediation 003-deep-loop-workflows"
  - "scaffold never touched leaves fix"
  - "003-deep-loop-workflows plan tasks scaffold cleanup"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/011-followup-remediation/004-scaffold-content-003-deep-loop-workflows"
    last_updated_at: "2026-07-01T22:35:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Rewrote target leaf plan and task docs"
    next_safe_action: "Use validation evidence for handoff"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/024-deep-loop-improved/003-deep-loop-workflows/{001-012}-*/plan.md"
      - ".opencode/specs/system-deep-loop/024-deep-loop-improved/003-deep-loop-workflows/{001-012}-*/tasks.md"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Scaffold Content Remediation - 003-deep-loop-workflows Leaves

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
| **Phase** | 4 |
| **Predecessor** | 003-scaffold-content-002-deep-loop-runtime |
| **Successor** | 005-scaffold-content-004-through-007 |
| **Handoff Criteria** | All 12 leaves under `003-deep-loop-workflows/{001-012}-*/` have `plan.md` and `tasks.md` with zero scaffold-signature markers and real content verified against that leaf's own `spec.md`; `check-scaffold-never-touched.sh` (`SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED`) passes for all 12 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
12 leaf children under `.opencode/specs/system-deep-loop/024-deep-loop-improved/003-deep-loop-workflows/` (`001-anti-convergence-floor` through `012-push-wave-fanout`) each have a `plan.md` and `tasks.md` whose BODY content, not just frontmatter, is still unmodified scaffold-template placeholder prose (literal text like `[Component 1]: [Purpose]` and unchecked items literally reading `[Implement core feature 1]`). Their frontmatter also still carries scaffold markers: title containing `[template:...]`, `_memory.continuity.packet_pointer` starting with `"scaffold/"`, `last_updated_by: "template-author"`, all-zero fingerprint. Confirmed directly against `001-anti-convergence-floor/plan.md` and `012-push-wave-fanout/plan.md`/`tasks.md` this session. Meanwhile each leaf's OWN sibling `spec.md` is genuinely authored, cites real shipped code, and declares `Status: Complete` — exactly the precondition a new validate.sh rule (`SCAFFOLD_NEVER_TOUCHED`, being enabled by sibling child `006-validate-sh-registry-bridge` in this same phase) checks before flagging an error. This means these 24 files (12 `plan.md` + 12 `tasks.md`) will start failing `validate.sh --strict` the moment child 006 ships, unless fixed first.

### Purpose
Author real `plan.md`/`tasks.md` content for all 12 of `003-deep-loop-workflows`'s leaf children, grounded in each leaf's own already-correct `spec.md` (which describes what was actually built and cites real file:line evidence) and the real shipped code it references. Also fix the frontmatter continuity block (title, packet_pointer, last_updated_by, fingerprint) to stop tripping the scaffold-signature check.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read each of the 12 leaves' `spec.md` in full first (they are the ground truth for what to describe).
- Author a `plan.md` (Technical Context/Overview/Quality Gates/Architecture/Implementation Phases marked complete/Testing Strategy/Dependencies/Rollback, matching the Level-1 `plan-core` template shape) for each of the 12 leaves that accurately describes the real implementation, not generic placeholder text.
- Author a `tasks.md` (task ledger with tasks marked `[x]` complete, matching the Level-1 `tasks-core` template shape) for each of the 12 leaves.
- Fix frontmatter on all 24 files to remove scaffold markers: real title (no `[template:...]`), real `packet_pointer` without a `scaffold/` prefix, `last_updated_by: claude-sonnet-5` (or an appropriate real author), `completion_pct: 100` since these are already-shipped features.

### Out of Scope
- Modifying the leaves' own `spec.md` files (already correct).
- Modifying any actual runtime source code.
- Phases 002/004-007's scaffold cleanup — those are separate sibling children `003-scaffold-content-002-deep-loop-runtime` and `005-scaffold-content-004-through-007`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `003-deep-loop-workflows/{001-012}-*/plan.md` (12 files) | Modify | Replace scaffold body + frontmatter markers with real content grounded in that leaf's own `spec.md` |
| `003-deep-loop-workflows/{001-012}-*/tasks.md` (12 files) | Modify | Replace scaffold body + frontmatter markers with a real task ledger grounded in that leaf's own `spec.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero remaining scaffold-signature markers | Every one of the 12 leaves' `plan.md` and `tasks.md` has no `[template:` in title, no `scaffold/`-prefixed `packet_pointer`, and no `last_updated_by: "template-author"` |
| REQ-002 | Real, non-placeholder body content | Every one of the 12 leaves' `plan.md` and `tasks.md` describes what was actually built, verified against that leaf's own `spec.md` |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Content accuracy | Authored content cites the same real files/evidence the leaf's own `spec.md` already cites; no fabricated new claims |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-scaffold-never-touched.sh` run explicitly via `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED` against each of the 12 leaves passes with zero findings.
- **SC-002**: A manual spot-check confirms the authored content matches what the sibling `spec.md` and real code describe.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Authored content becomes superficial/generic filler instead of accurately describing what was built | Passes the scaffold-signature check syntactically while remaining untrustworthy documentation | Read each leaf's own `spec.md` in full first as the grounding source before rewriting that leaf's `plan.md`/`tasks.md`; no claim beyond what `spec.md` already cites |
| Dependency | Sibling child `006-validate-sh-registry-bridge` enables `SCAFFOLD_NEVER_TOUCHED` in the same phase | If 006 ships before this child completes, all 12 leaves fail `validate.sh --strict` | Land this child before or alongside 006 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope confirmed via direct Explore research this session against `001-anti-convergence-floor` and `012-push-wave-fanout` as representative samples, following the same remediation pattern as sibling child `003-scaffold-content-002-deep-loop-runtime`.
<!-- /ANCHOR:questions -->
