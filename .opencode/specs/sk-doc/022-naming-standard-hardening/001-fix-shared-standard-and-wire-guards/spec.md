---
title: "Feature Specification: Fix the Shared Naming Standard and Wire the Kebab Guards"
description: "core-standards.md still documents snake_case as the .md filename rule and labels a nonexistent kebab-to-snake auto-fix, contradicting the kebab canon the code already enforces. And the two repo-wide kebab guards run in no gate, so a new snake_case name can land unblocked. This phase reconciles the shared standard doc to the canon and wires the guards into a gate."
trigger_phrases:
  - "core-standards kebab reconciliation"
  - "wire kebab guards"
  - "no-new-snake gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-naming-standard-hardening/001-fix-shared-standard-and-wire-guards"
    last_updated_at: "2026-07-20T10:13:27Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase-001 spec for shared-standard reconciliation and guard wiring"
    next_safe_action: "Plan the core-standards edits and the guard gate wiring"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Fix the Shared Naming Standard and Wire the Kebab Guards

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-20 |
| **Parent** | `sk-doc/022-naming-standard-hardening` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | `../002-per-mode-naming-conformance/spec.md` |
| **Handoff Criteria** | `core-standards.md` states no snake_case filename rule; a gate runs a kebab guard |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of Naming Standard Hardening — the shared / global half. It reconciles the authoritative shared standard doc and wires the existing kebab guards, so the per-mode phase (002) builds on an enforced canon.

**Scope Boundary**: The shared standard doc (`core-standards.md`) and the gate wiring for the two kebab guards. Per-mode conformance is phase 002. No file renames on disk.

**Dependencies**:
- The kebab canon (`filesystem-naming-convention.md`) is already correct and is the reconciliation target.
- The two guards (`check_no_new_snake_case.py`, `check_no_hyphenated_catalog_content.py`) already exist and pass their unit tests.

**Deliverables**:
- A kebab-correct `core-standards.md` §2/§4/§5.
- The two guards invoked by a real gate.

**Changelog**: When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`shared/references/core-standards.md` still teaches snake_case as the `.md` filename rule: §2 (`:41` "lowercase snake_case for all `.md` files"; `:44-48` "Hyphens to underscores"), §4 (`:103` "Filename violations - Convert to snake_case" under Safe Auto-Fixes), and §5 (`:163-164` table "Hyphenated filename ... Replace with `_` ... auto"). This reverses the kebab canon and misdescribes the code: no script performs a kebab-to-snake conversion, and `validate_document.py --fix` never renames a file. Separately, the two repo-wide kebab guards run in no gate (verified: no invoker in the pre-commit hook, any CI workflow, or any build file), so kebab is advisory repo-wide.

### Purpose
Make the shared standard doc state the kebab canon, and make a gate actually run a kebab guard so a new snake_case authored name is blocked.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `core-standards.md` §2 (filename rule + transformations), §4 (auto-fix list), and §5 (common-violations table) to the kebab canon; drop the nonexistent kebab-to-snake auto-fix; keep the §2 forward-pointer to the canon.
- Correct the inverted numbered-doc framing at `core-standards.md:53` (hyphens are the default under the canon, not an exception to a snake default).
- Wire `check_no_new_snake_case.py` (and `check_no_hyphenated_catalog_content.py` for catalog/playbook content) into a gate — the existing pre-commit hook and/or a CI workflow — and run the guards' own unit tests wherever the sk-doc suite runs.

### Out of Scope
- Per-mode conformance (phase 002) - separate workstream.
- Renaming files on disk - the 020 program already made the tree kebab-case.
- The legacy underscore content roots still shipped on disk - a separate content workstream.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/shared/references/core-standards.md` | Modify | Flip §2/§4/§5 to kebab; fix §53 framing |
| `.opencode/scripts/git-hooks/pre-commit` (or a CI workflow) | Modify | Invoke the kebab guard(s) on changed paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `core-standards.md` §2 states kebab-case as the `.md` filename rule with kebab transformations. | §2 contains no "snake_case" rule text and no "Hyphens to underscores" transform; it states kebab. |
| REQ-002 | `core-standards.md` §4/§5 no longer label a kebab-to-snake conversion as an auto-fix. | §4 Safe Auto-Fixes and the §5 table describe no "convert to snake_case" / "replace `-` with `_`" filename fix. |
| REQ-003 | A gate invokes a kebab guard on changed authored paths. | Running the gate on a staged new snake_case `.md` name fails; on a kebab name it passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The inverted numbered-doc framing (`:53`) is corrected. | The doc frames hyphens as the default, not an exception to snake. |
| REQ-005 | The guards' unit tests run wherever CI runs the sk-doc suite. | A CI job executes `test_no_new_snake_case_guard.py` and `test_naming_root_resolver.py`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `core-standards.md` §2/§4/§5 agree with `filesystem-naming-convention.md` — no reader is told to snake_case a filename.
- **SC-002**: A newly staged snake_case authored name is blocked by a gate (demonstrated), closing the "advisory repo-wide" gap.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The guard hard-errors on legacy underscore roots still on disk (e.g. `feature_catalog/`). | Med - a gate could block unrelated commits. | Confirm the guard's exclusion list covers shipped legacy roots (it excludes completed spec roots and frozen surfaces); scope the gate to changed paths first. |
| Risk | `core-standards.md` is cited by other modes (create-quality-control). | Low - stale references. | Phase 002 re-anchors those references. |
| Dependency | `filesystem-naming-convention.md` (canon) | Reconciliation target must stay authoritative. | Keep the §2 forward-pointer to the canon. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the gate live in the pre-commit hook (fast, local), CI (unskippable), or both?
- Should the gate run `--changed-since` (staged/changed paths) or `--all` (whole tree) in each context?
<!-- /ANCHOR:questions -->
