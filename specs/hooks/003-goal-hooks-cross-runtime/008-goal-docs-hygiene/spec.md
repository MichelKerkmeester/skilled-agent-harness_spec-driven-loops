---
title: "Feature Specification: Goal docs hygiene + cross-runtime contracts"
description: "Fix the four stale rename-fallout references and the broken goal command-path test, then document the new cross-runtime goal hooks in injection-contract.md, goal-plugin.md, and the runtime-routing constitutional rule, plus a behavioral concern README for .opencode/hooks/goal/."
trigger_phrases:
  - "goal docs hygiene"
  - "goal rename fallout"
  - "goal injection contract"
  - "goal cross runtime docs"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/008-goal-docs-hygiene"
    last_updated_at: "2026-07-29T07:06:08Z"
    last_updated_by: "claude"
    recent_action: "All 6 REQs done; 10 stale refs fixed, 3 docs updated, test repaired"
    next_safe_action: "Commit phase 008; final packet --recursive validate"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/hooks/injection-contract.md"
      - ".opencode/skills/system-spec-kit/references/hooks/goal-plugin.md"
      - ".opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md"
      - ".opencode/plugins/tests/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-008-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope: docs-only closeout phase, no new hook code."
      - "This phase runs last, after 001-007 land conceptually."
      - "The rename-fallout sweep found 4 more stale refs beyond the spec's named 4; all fixed to meet REQ-001's zero-live-hits acceptance."
      - "goal-plugin.md hosts the cross-runtime relationship section (no separate goal-cross-runtime.md sibling was needed)."
---
# Feature Specification: Goal docs hygiene + cross-runtime contracts

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Branch** | `skilled/v4.0.0.0` (direct, per parent packet's operator choice) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `007-opencode-plugin-symlinks` |
| **Successor** | None (last phase) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `/goal:goal-opencode` command's file moved into a `commands/goal/` subfolder during an earlier rename, but four references across the repo still point at the retired flat path or form, and one test resolves a path that no longer exists so it fails. Once phases 001-007 add cross-runtime goal hooks (devin/cursor/pi), the repo's hook-injection documentation (`injection-contract.md`) and the goal-plugin doc will not describe them, and the runtime-routing constitutional rule will still say those three runtimes have no goal routing.

### Purpose

Close out packet 003 by fixing every stale rename-fallout reference, repairing the broken test path, and bringing the goal system's documentation up to date with what phases 001-007 actually built: the shared cross-runtime state model, the new manage CLI, the per-runtime adapters, and their injected `[active_goal]` block visibility per runtime.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fix 4 stale rename-fallout references: `.opencode/skills/system-spec-kit/references/hooks/goal-plugin.md`, `.opencode/skills/system-spec-kit/feature-catalog/ux-hooks/goal-opencode-plugin.md`, root `README.md:1063`, and the `*goal*.md` glob instruction in `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md`.
- Fix `.opencode/plugins/tests/mk-goal-tool-path.test.cjs:123` (and its related assertions) so it resolves the real current command path instead of the retired flat one.
- Add the phase 003/004/005 goal hooks to `.opencode/skills/system-spec-kit/references/hooks/injection-contract.md`: the verbatim injected `[active_goal]` block text and per-runtime visibility classification (Pi operator-visible in chat; Devin and Cursor not visible).
- Update `.opencode/skills/system-spec-kit/references/hooks/goal-plugin.md`, or author a sibling `goal-cross-runtime.md`, documenting the shared-file state model (one `active-goal.json` for non-OpenCode runtimes vs. mk-goal's per-OpenCode-session state files) and the phase 002 capability matrix.
- Update `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` with the new per-runtime routing: devin/cursor/pi route to the phase 001 manage CLI (`.opencode/hooks/goal/bin/goal.cjs`) plus their own hook adapters.
- Author a behavioral concern README for `.opencode/hooks/goal/` in this repo's "WHAT IT DOES AND INJECTS" style, with verbatim injected block text and visibility classes per runtime.

### Out of Scope

- Any new hook code, adapter, or state-model change (owned by phases 001-007).
- Codex goal support (operator-excluded at the parent-packet level).
- Changing `mk-goal.js`'s own OpenCode-session behavior or state format.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/references/hooks/goal-plugin.md` | Modify | Fix stale command path; add shared-file model + capability matrix section |
| `.opencode/skills/system-spec-kit/references/hooks/goal-cross-runtime.md` | Create (if goal-plugin.md is not the right host) | Cross-runtime goal-hook contract sibling doc |
| `.opencode/skills/system-spec-kit/references/hooks/injection-contract.md` | Modify | Add devin/cursor/pi goal-hook entries with verbatim block + visibility class |
| `.opencode/skills/system-spec-kit/feature-catalog/ux-hooks/goal-opencode-plugin.md` | Modify | Fix stale `goal_opencode.md` path references |
| `README.md` | Modify | Fix line ~1063 `/goal_opencode` reference |
| `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` | Modify | Fix `*goal*.md` glob instruction; add devin/cursor/pi routing rows |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Modify | Repoint to the real `commands/goal/goal-opencode.md` path |
| `.opencode/hooks/goal/README.md` | Create | Behavioral concern README for the goal hooks tree |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix the four stale rename-fallout references. | Repo-wide grep for `goal_opencode` and the flat `commands/goal-opencode.md` form returns zero live hits outside git history in the four named files. |
| REQ-002 | Repair the broken test path. | `mk-goal-tool-path.test.cjs` passes when run via its documented `node --test` invocation. |
| REQ-003 | Document the new cross-runtime goal hooks in `injection-contract.md`. | The doc carries the verbatim `[active_goal]` block text and a per-runtime visibility row for devin, cursor, and pi. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Update `goal-plugin.md` (or a new sibling) with the shared-file state model and phase 002 capability matrix. | The doc distinguishes the shared `active-goal.json` (non-OpenCode) from mk-goal's per-session state files, and reproduces the capability matrix. |
| REQ-005 | Update `goal-prompting-runtime-specific.md` with the new per-runtime routing. | Devin/cursor/pi rows route to the manage CLI + their hook adapter, replacing the current "no goal routing" state. |
| REQ-006 | Author the `.opencode/hooks/goal/` concern README. | README follows the repo's behavioral concern-README convention (WHAT IT DOES AND INJECTS), with verbatim injected text and visibility classes per runtime. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 stale rename-fallout references fixed and grep-confirmed zero remaining hits.
- **SC-002**: `mk-goal-tool-path.test.cjs` passes.
- **SC-003**: `injection-contract.md`, `goal-plugin.md` (or its sibling), and `goal-prompting-runtime-specific.md` all reflect the phases 001-007 build, and the new `.opencode/hooks/goal/README.md` validates clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001-007 must land first | Nothing to document accurately without the real built artifacts (state file shape, CLI contract, adapter files, capability matrix) | Sequence this phase strictly last per the parent packet's phase order |
| Risk | Concurrent sessions editing the same constitutional/reference docs | A doc fix could collide with an unrelated concurrent edit | Re-grep immediately before editing each target file |
| Risk | Missing a fifth stale reference not yet found | Rename fallout could resurface after this phase closes | Run a fresh repo-wide grep for both retired forms as the final verification step, not just the four named files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to update `goal-plugin.md` in place or author a new sibling `goal-cross-runtime.md` — decide once phases 001-007's actual doc surface area is known.
<!-- /ANCHOR:questions -->
