---
title: "Implementation Plan: Goal docs hygiene + cross-runtime contracts"
description: "Grep-confirm and fix the four stale rename-fallout references and the broken test path, then extend injection-contract.md, goal-plugin.md, and the runtime-routing constitutional rule with the phases 001-007 build, and author the goal/ concern README."
trigger_phrases:
  - "goal docs hygiene plan"
  - "goal rename fallout fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/008-goal-docs-hygiene"
    last_updated_at: "2026-07-29T07:06:08Z"
    last_updated_by: "claude"
    recent_action: "Phase 008 executed; docs closeout complete"
    next_safe_action: "Implement after phases 001-007 land, per phase-dependency order"
    blockers:
      - "Depends on phases 001-007 landing first."
    key_files:
      - ".opencode/skills/system-spec-kit/references/hooks/injection-contract.md"
      - ".opencode/skills/system-spec-kit/references/hooks/goal-plugin.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-008-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scope: docs-only closeout phase, no new hook code."
---
# Implementation Plan: Goal docs hygiene + cross-runtime contracts

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation, one Node `node --test` file |
| **Scope class** | Docs-only closeout phase |
| **Storage** | N/A |
| **Testing** | `node --test` on the repaired path test; `validate_document.py` on every touched/new doc |

### Overview

This phase is pure documentation hygiene and one test-path repair. It fixes stale references left by the `/goal_opencode` -> `/goal-opencode` -> `commands/goal/goal-opencode.md` rename history, then extends the goal system's reference docs with what phases 001-007 actually build: the shared cross-runtime state model, the manage CLI, the per-runtime adapters, and their injection visibility. No hook code changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phases 001-007 have landed (goal core, manage CLI, capability matrix, three per-runtime adapters).
- [ ] Real artifact paths and the phase 002 capability matrix are confirmed by reading the landed phase docs, not assumed.

### Definition of Done

- [ ] All four stale rename-fallout references fixed and grep-confirmed.
- [ ] `mk-goal-tool-path.test.cjs` passes.
- [ ] `injection-contract.md`, `goal-plugin.md` (or sibling), and `goal-prompting-runtime-specific.md` updated and consistent with the phases 001-007 build.
- [ ] `.opencode/hooks/goal/README.md` authored and validates clean.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Docs-repair-then-extend: fix known-stale references first (mechanical, low-risk), then add new documentation sections describing already-built phases 001-007 artifacts (descriptive, requires reading the real landed code first).

### Key Components

- **Rename-fallout fix set**: `goal-plugin.md`, `feature-catalog/ux-hooks/goal-opencode-plugin.md`, root `README.md`, `goal-prompting-runtime-specific.md`'s glob instruction.
- **Test-path repair**: `mk-goal-tool-path.test.cjs`.
- **New contract entries**: `injection-contract.md` (verbatim block + visibility), `goal-plugin.md` or `goal-cross-runtime.md` (state model + capability matrix), `goal-prompting-runtime-specific.md` (new routing rows).
- **New concern README**: `.opencode/hooks/goal/README.md`.

### Control Flow

Grep-confirm each of the 4 stale references -> fix each in place -> repoint and re-run the broken test -> read the landed phases 001-007 artifacts for real paths/text -> extend the 3 reference/constitutional docs -> author the concern README -> repo-wide re-grep for both retired path forms as final verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Grep-confirm the current state of all 4 stale references and the test failure, re-verifying line numbers against the live tree (they may have shifted since this packet's spec was authored).
- [ ] Read the landed phases 001-007 artifacts (goal core, manage CLI, capability matrix, per-runtime adapters) to source real paths and verbatim text for the doc updates.

### Phase 2: Implementation

- [ ] Fix the `goal_opencode`/flat-path references in `goal-plugin.md`, `feature-catalog/ux-hooks/goal-opencode-plugin.md`, root `README.md`, and the `*goal*.md` glob line in `goal-prompting-runtime-specific.md`.
- [ ] Repoint `mk-goal-tool-path.test.cjs` to the real current command path and re-run.
- [ ] Add the devin/cursor/pi goal-hook entries (verbatim `[active_goal]` block + visibility classification) to `injection-contract.md`.
- [ ] Update `goal-plugin.md` or author `goal-cross-runtime.md` with the shared-file state model and the phase 002 capability matrix.
- [ ] Add the new devin/cursor/pi routing rows to `goal-prompting-runtime-specific.md`.
- [ ] Author `.opencode/hooks/goal/README.md` in the behavioral concern-README style.

### Phase 3: Verification

- [ ] Run `node --test` on `mk-goal-tool-path.test.cjs`, confirm pass.
- [ ] Repo-wide grep for `goal_opencode` and the flat `commands/goal-opencode.md` form, confirm zero live hits.
- [ ] Run `validate_document.py` on every touched/new file, confirm 0 issues.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `mk-goal-tool-path.test.cjs` path resolution | `node --test` |
| Static | Stale-path detection | Repo-wide grep for both retired path/name forms |
| Documentation | All touched/new docs | `validate_document.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phases 001-007 (goal core, probes, adapters, dispatch coverage, symlinks) | Internal | Planned | Nothing real to document; this phase cannot start honestly until they land |
| `mk-goal-tool-path.test.cjs`'s existing `node --test` runner | Internal | Available | Cannot verify the path repair |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A doc fix introduces an inaccurate claim about phases 001-007's actual behavior, discovered during verification.
- **Procedure**: Revert the specific file edit via `git checkout -- <file>`; re-read the landed phase artifact before re-attempting the doc update.
- **Data impact**: None. Documentation-only change, no data migrations.
<!-- /ANCHOR:rollback -->
