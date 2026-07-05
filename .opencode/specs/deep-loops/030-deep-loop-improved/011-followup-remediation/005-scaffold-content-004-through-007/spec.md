---
title: "Scaffold Content Backfill: Phases 004-007 (10 Leaves)"
description: "Ten already-Complete leaf children across phases 004, 005, 006, and 007 still carry scaffold-template plan.md/tasks.md (placeholder body content plus [template:...] title, scaffold/ packet_pointer, and template-author frontmatter markers), which will fail SCAFFOLD_NEVER_TOUCHED the moment child 006 bridges that registry rule into validate.sh's default path."
trigger_phrases:
  - "scaffold content backfill"
  - "SCAFFOLD_NEVER_TOUCHED remediation"
  - "phases 004 through 007 scaffold"
  - "005 scaffold content 004 through 007"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/011-followup-remediation/005-scaffold-content-004-through-007"
    last_updated_at: "2026-07-01T22:55:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed scaffold content backfill"
    next_safe_action: "Review validation output"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
      - ".opencode/specs/deep-loops/030-deep-loop-improved/004-system-spec-kit/001-speckit-autopilot-lifecycle/spec.md"
      - ".opencode/specs/deep-loops/030-deep-loop-improved/005-skill-interconnection/001-advisor-routing-projection/spec.md"
      - ".opencode/specs/deep-loops/030-deep-loop-improved/006-ux-observability-automation/spec.md"
      - ".opencode/specs/deep-loops/030-deep-loop-improved/007-testing/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Scaffold Content Backfill: Phases 004-007 (10 Leaves)

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
| **Phase** | 5 |
| **Predecessor** | 004-scaffold-content-003-deep-loop-workflows |
| **Successor** | 006-validate-sh-registry-bridge |
| **Handoff Criteria** | All 10 leaves' plan.md and tasks.md carry zero scaffold-signature markers, real body content grounded in their own spec.md, and pass `check-scaffold-never-touched.sh` when run explicitly via `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Ten leaf children across four phases still have `plan.md`/`tasks.md` whose BODY content is unmodified scaffold-template placeholder prose (`[Core feature 1]`, `[MVC | MVVM | ...]`, generic Setup/Core Implementation/Verification checklists), carrying scaffold-signature frontmatter markers: a `title` containing `[template:...]`, a `packet_pointer` starting with `scaffold/`, and `last_updated_by: "template-author"`. The affected leaves are `004-system-spec-kit/001-speckit-autopilot-lifecycle` (1 leaf), `005-skill-interconnection/001-advisor-routing-projection` (1 leaf), `006-ux-observability-automation/001` through `006` (6 leaves), and `007-testing/001-hermetic-test-isolation` and `002-record-replay-cassette-harness` (2 leaves) — 10 leaves, ~20 files total. Every one of these leaves' own `spec.md` is genuinely authored, cites real shipped code (e.g. `reduce-state.cjs`, `atomic-state.ts`, `observability-events.cjs`, `spawn-cjs.ts`), and declares `Status: Complete` — exactly the precondition `check-scaffold-never-touched.sh` (rule `SCAFFOLD_NEVER_TOUCHED`) checks before flagging an error. Direct verification this session confirmed the rule is registered in `validator-registry.json` (no `strict_only` flag) but is currently dormant: `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED bash validate.sh 006-ux-observability-automation/001-dashboard-sparkline-trend` returns `FAILED` with 6 markers, while a plain `validate.sh <folder>` or `validate.sh <folder> --strict` call on the same folder reports nothing — because the default `orchestrator.ts` path never shells out to registry-backed rules; only `SPECKIT_RULES=...` triggers the shell-registry fallback that does. Sibling child `006-validate-sh-registry-bridge` closes that gap in `orchestrator.ts` so the rule runs under a plain `validate.sh --strict` call. These files will start failing the moment 006 ships, unless fixed first.

### Purpose
Author real `plan.md`/`tasks.md` content for all 10 leaves, grounded in each leaf's own already-correct `spec.md` and the real shipped code it references, marked complete since these are already-shipped features. Fix each file's frontmatter continuity block (real title, real `packet_pointer` without the `scaffold/` prefix, `last_updated_by: claude-sonnet-5`, `completion_pct: 100`) so the leaves stop tripping the scaffold-signature check before 006 wires it into the default path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read each of the 10 leaves' `spec.md` in full first as ground truth (already Complete, already cites real files).
- Author real `plan.md` content matching the Level-1 `plan-core` template shape (Summary, Quality Gates, Architecture, Implementation Phases marked complete, Testing Strategy, Dependencies, Rollback Plan) for each of the 10 leaves.
- Author real `tasks.md` content matching the Level-1 `tasks-core` template shape (Setup/Implementation/Verification phases, all tasks marked `[x]`) for each of the 10 leaves.
- Fix the frontmatter continuity block in every `plan.md`/`tasks.md`: real title (no `[template:...]`), real `packet_pointer` (no `scaffold/` prefix), `last_updated_by: claude-sonnet-5`, `completion_pct: 100`.
- Process one phase folder fully before moving to the next (004 -> 005 -> 006 -> 007) to avoid cross-phase context switching.

### Out of Scope
- Modifying the 10 leaves' own `spec.md` files — already correct, already Complete, not touched.
- Modifying any actual runtime source code referenced by the leaves — this child documents already-shipped work, it does not re-implement it.
- Phases 002/003's scaffold cleanup — covered by sibling children `003-scaffold-content-002-deep-loop-runtime` and `004-scaffold-content-003-deep-loop-workflows`.
- Bridging `SCAFFOLD_NEVER_TOUCHED` into `orchestrator.ts`'s default `validate.sh --strict` path — that is sibling child `006-validate-sh-registry-bridge`'s job; this child only removes the markers the rule would flag once bridged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/deep-loops/030-deep-loop-improved/004-system-spec-kit/001-speckit-autopilot-lifecycle/` | Modify | ~2 files: `plan.md` + `tasks.md` for 1 leaf |
| `.opencode/specs/deep-loops/030-deep-loop-improved/005-skill-interconnection/001-advisor-routing-projection/` | Modify | ~2 files: `plan.md` + `tasks.md` for 1 leaf |
| `.opencode/specs/deep-loops/030-deep-loop-improved/006-ux-observability-automation/{001..006}/` | Modify | ~12 files: `plan.md` + `tasks.md` per leaf across 6 leaves |
| `.opencode/specs/deep-loops/030-deep-loop-improved/007-testing/{001,002}/` | Modify | ~4 files: `plan.md` + `tasks.md` per leaf across 2 leaves |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero scaffold-signature markers remain in any of the 10 leaves' `plan.md`/`tasks.md` | `check-scaffold-never-touched.sh` reports 0 markers for each of the 10 leaves when run via `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED` |
| REQ-002 | Every `plan.md`/`tasks.md` has real, non-placeholder body content verified against its own leaf's `spec.md` | Manual spot-check: each phase/task references the actual files, functions, and behavior named in that leaf's `spec.md` Scope/Requirements sections |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Content accuracy — cite the same real files/evidence the leaf's own `spec.md` already cites | No new unverified claims introduced; every file path in the authored `plan.md`/`tasks.md` matches a path already named in that leaf's `spec.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED bash validate.sh <folder>` passes (0 markers) for each of the 10 leaves individually.
- **SC-002**: Manual spot-check confirms authored `plan.md`/`tasks.md` accuracy against each leaf's own `spec.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 4 different phases in one child broadens context-switching | Medium — increases chance of cross-phase detail bleed | Process one phase folder fully before moving to the next rather than interleaving |
| Dependency | `006-validate-sh-registry-bridge` (successor) has a hard block on this child (and its siblings 003/004) reaching Status: Complete before it can safely bridge `SCAFFOLD_NEVER_TOUCHED` into `orchestrator.ts`'s default path | Hard | This child must reach a clean `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED` result on all 10 leaves before 006 is implemented |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope bounded by direct Explore research this session confirming both the scaffold-marker defect (via `Read` on all 10 leaves' `spec.md`/`plan.md`/`tasks.md`) and the rule's current dormant state (via an explicit `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED` test run against a representative leaf); independently re-verified against current code before this phase was scaffolded.
<!-- /ANCHOR:questions -->
