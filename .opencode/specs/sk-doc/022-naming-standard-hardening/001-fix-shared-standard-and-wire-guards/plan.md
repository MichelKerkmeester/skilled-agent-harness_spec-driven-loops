---
title: "Implementation Plan: Fix the Shared Naming Standard and Wire the Kebab Guards"
description: "Reconcile core-standards.md §2/§4/§5 to the kebab canon, then run check_no_new_snake_case.py and its unit tests in a CI-only gate for pull requests and release-branch pushes."
trigger_phrases:
  - "core-standards kebab plan"
  - "kebab guard wiring plan"
  - "no-new-snake gate plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-naming-standard-hardening/001-fix-shared-standard-and-wire-guards"
    last_updated_at: "2026-07-20T11:48:40Z"
    last_updated_by: "codex"
    recent_action: "Executed the shared standard flip and CI-only guard plan"
    next_safe_action: "Run central metadata and packet validation"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Gate host: CI only; pre-commit wiring remains a documented follow-up"
      - "Comparison mode: --changed-since the event-specific base"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fix the Shared Naming Standard and Wire the Kebab Guards

<!-- SPECKIT_LEVEL: 1 -->

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
Rewrite the three snake_case sections of `core-standards.md` to state the kebab canon, then invoke the already-passing repo-wide guard from CI. No new detection logic is written; this phase points a gate at the guard, runs its tests, and fixes the doc that contradicted it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `core-standards.md` §2/§4/§5 lines confirmed against the current file
- [x] The repo-wide guard's `--changed-since` behavior and exit codes confirmed
- [x] CI selected as the gate host

### Definition of Done
- [x] `core-standards.md` §2/§4/§5 state kebab; no snake_case filename rule remains
- [x] An isolated snake_case `.md` name fails the guard; a kebab name passes
- [x] Guard unit tests run in CI
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation reconciliation + gate wiring (no application architecture).

### Key Components
- **`core-standards.md` §2/§4/§5**: the authoritative shared standard doc to flip to kebab.
- **`check_no_new_snake_case.py`**: repo-wide kebab detector (warn/fail) with scope-aware exclusions.
- **`.github/workflows/naming-standard-guard.yml`**: CI-only gate for pull requests and `skilled/v*` release pushes.

### Data Flow
The event-specific Git base and checked-out tree flow into the CI gate. The guard compares changed paths, and an underscore-authored name returns exit 1 and fails the job.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches shared policy (the naming standard) and path handling (the guard scope), so the surface inventory matters.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `core-standards.md` §2/§4/§5 | States snake_case filename rule + a nonexistent auto-fix | update to kebab | grep shows no "snake_case" rule and no "Hyphens to underscores" transform |
| `check_no_new_snake_case.py` | Repo-wide kebab detector, previously wired to nothing | logic unchanged; invoked by CI | isolated underscore name exits 1 |
| `.github/workflows/naming-standard-guard.yml` | New CI gate | compare against PR base or push's previous commit | YAML parse and action-ref assertions pass |
| Modes citing `core-standards.md` (create-quality-control) | Observe the standard | unchanged here; re-anchored in phase 002 | handled in 002 |

Required inventories:
- Guard invokers: `rg -n 'check_no_new_snake_case' .github/workflows` (confirm the CI invocation).
- Comparison mode: use `--changed-since`; do not enable `--all` while shipped legacy underscore roots remain.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reconcile the standard doc
- [x] Rewrite `core-standards.md` §2 filename rule + transformations to kebab
- [x] Rewrite §4 Safe Auto-Fixes: drop "convert to snake_case"
- [x] Rewrite §5 common-violations table: make underscored filenames the violation
- [x] Fix the inverted numbered-doc framing (`:53`)

### Phase 2: Wire the gate
- [x] Use CI only; leave the pre-commit hook unchanged
- [x] Checkout full history and derive the PR or push comparison base
- [x] Invoke `check_no_new_snake_case.py --changed-since` in CI
- [x] Add the guard and root-resolver unit tests to the CI job

### Phase 3: Verification
- [x] Create a temporary snake_case `.md` name; guard exits 1
- [x] Create a temporary kebab name; guard exits 0
- [x] Run the two guard test files: 4 passed
- [x] Parse the workflow YAML and assert the action refs and `fetch-depth: 0`
- [x] Run `validate_document.py` on the edited `core-standards.md`: 0 issues
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The guard and root resolver | pytest (`test_no_new_snake_case_guard.py`, `test_naming_root_resolver.py`) |
| Integration | The guard blocks a changed underscore name | isolated temporary Git repository |
| Manual | Doc reads correctly, forward-pointer intact | review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `filesystem-naming-convention.md` (canon) | Internal | Green | Reconciliation target; already correct |
| The guard and root resolver | Internal | Green | Exist and pass unit tests |
| Legacy underscore roots still on disk | Internal | Yellow | `--all` could hard-error until they migrate; CI uses `--changed-since` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The gate blocks legitimate changes, or the doc edit breaks a cross-reference.
- **Procedure**: Revert the CI workflow and `core-standards.md` edits. Both are file-only reverts with no data impact.
<!-- /ANCHOR:rollback -->

---

## 8. RESOLVED QUESTIONS

| Question | Resolution |
|----------|------------|
| Gate host | CI only. The current guard scans the working tree and has no staged-only mode, so local hook wiring could inspect another session's files. |
| Guard mode | `--changed-since` the pull request base ref or push event's previous commit. |
| Pre-commit follow-up | Add a staged-only guard mode before reconsidering local hook wiring. |
