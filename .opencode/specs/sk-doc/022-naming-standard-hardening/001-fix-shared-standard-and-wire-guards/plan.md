---
title: "Implementation Plan: Fix the Shared Naming Standard and Wire the Kebab Guards"
description: "Reconcile core-standards.md §2/§4/§5 to the kebab canon by rewriting the filename rule, transformations, and auto-fix labels; then wire the existing check_no_new_snake_case and check_no_hyphenated_catalog_content guards into the pre-commit hook and/or CI so kebab is enforced, not advisory."
trigger_phrases:
  - "core-standards kebab plan"
  - "kebab guard wiring plan"
  - "no-new-snake gate plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-naming-standard-hardening/001-fix-shared-standard-and-wire-guards"
    last_updated_at: "2026-07-20T10:13:27Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase-001 plan for core-standards edits and guard wiring"
    next_safe_action: "Break the plan into tasks and implement"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Fix the Shared Naming Standard and Wire the Kebab Guards

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs + Python 3 guards + git hook / CI YAML |
| **Framework** | None (shell + Python) |
| **Storage** | None |
| **Testing** | pytest (guard unit tests); manual staged-name check |

### Overview
Rewrite the three snake_case sections of `core-standards.md` to state the kebab canon, then invoke the already-passing kebab guards from a gate. No new detection logic is written — the guards exist; this phase points a gate at them and fixes the doc that contradicts them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `core-standards.md` §2/§4/§5 lines confirmed against the current file
- [ ] The two guards' CLI (`--changed-since`, `--all`) and exit codes confirmed
- [ ] The host gate (pre-commit hook / CI) identified

### Definition of Done
- [ ] `core-standards.md` §2/§4/§5 state kebab; no snake_case filename rule remains
- [ ] A staged snake_case `.md` name fails the gate; a kebab name passes
- [ ] Guard unit tests run in CI
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation reconciliation + gate wiring (no application architecture).

### Key Components
- **`core-standards.md` §2/§4/§5**: the authoritative shared standard doc to flip to kebab.
- **`check_no_new_snake_case.py`**: repo-wide kebab detector (warn/fail) with scope-aware exclusions.
- **`check_no_hyphenated_catalog_content.py`**: kebab detector for catalog/playbook content.
- **The gate**: pre-commit hook (`.opencode/scripts/git-hooks/pre-commit`) and/or a CI workflow.

### Data Flow
A commit's changed paths flow into the gate, which runs the guard(s); an underscore authored name returns exit 1 and blocks the commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches shared policy (the naming standard) and path handling (the guard scope), so the surface inventory matters.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `core-standards.md` §2/§4/§5 | States snake_case filename rule + a nonexistent auto-fix | update to kebab | grep shows no "snake_case" rule and no "Hyphens to underscores" transform |
| `check_no_new_snake_case.py` | Repo-wide kebab detector, wired to nothing | logic unchanged; invoked by a gate | a gate run fails on a staged underscore name |
| pre-commit hook / CI | Runs other gates, no naming gate | update to invoke the guard | hook/CI diff shows the guard call |
| Modes citing `core-standards.md` (create-quality-control) | Observe the standard | unchanged here; re-anchored in phase 002 | handled in 002 |

Required inventories:
- Guard invokers: `rg -n 'check_no_new_snake_case|check_no_hyphenated_catalog_content' .` (confirm zero before, one after).
- Exclusion coverage: confirm the guard excludes shipped legacy underscore roots and frozen surfaces before enabling `--all`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reconcile the standard doc
- [ ] Rewrite `core-standards.md` §2 filename rule + transformations to kebab
- [ ] Rewrite §4 Safe Auto-Fixes: drop "convert to snake_case"
- [ ] Rewrite §5 common-violations table: drop the "replace `-` with `_`" row
- [ ] Fix the inverted numbered-doc framing (`:53`)

### Phase 2: Wire the gate
- [ ] Choose the host (pre-commit hook and/or CI) per the open question
- [ ] Invoke `check_no_new_snake_case.py --changed-since` in the hook (and/or `--all` in CI)
- [ ] Confirm the guard exclusions cover shipped legacy underscore roots
- [ ] Add the guard unit tests to the CI suite

### Phase 3: Verification
- [ ] Stage a snake_case `.md` name; gate fails
- [ ] Stage a kebab name; gate passes
- [ ] `validate_document.py` on the edited `core-standards.md`: 0 issues
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The two guards | pytest (`test_no_new_snake_case_guard.py`, `test_naming_root_resolver.py`) |
| Integration | The gate blocks a staged underscore name | git + the hook / CI |
| Manual | Doc reads correctly, forward-pointer intact | review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `filesystem-naming-convention.md` (canon) | Internal | Green | Reconciliation target; already correct |
| The two guard scripts | Internal | Green | Exist and pass unit tests |
| Legacy underscore roots still on disk | Internal | Yellow | `--all` mode could hard-error until they migrate; use `--changed-since` first |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The gate blocks legitimate commits (false positive on a shipped legacy root), or the doc edit breaks a cross-reference.
- **Procedure**: Revert the pre-commit hook / CI change to disable the gate; revert the `core-standards.md` edit. Both are single-file reverts with no data impact.
<!-- /ANCHOR:rollback -->
