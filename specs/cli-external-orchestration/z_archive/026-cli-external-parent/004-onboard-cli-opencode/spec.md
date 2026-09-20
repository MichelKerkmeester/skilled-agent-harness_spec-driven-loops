---
title: "Feature Specification: Phase 4: onboard-cli-opencode"
description: "Phase 003 created the parent-hub skeleton, but its cli-opencode workflow packet is still empty. This phase plans the future git mv of today's cli-opencode behavior into that packet and the repoint of the shared, fail-open PreToolUse dispatch hook that physically lives inside cli-opencode."
trigger_phrases:
  - "onboard cli-opencode"
  - "cli-external parent"
  - "dispatch preflight hook repoint"
  - "PreToolUse hook hub-aware"
  - "phase 004"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/004-onboard-cli-opencode"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the cli-opencode onboarding spec, plan, and tasks"
    next_safe_action: "Execute the cli-opencode move and hook repoint after phase 003"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external/cli-opencode/SKILL.md"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-onboard-cli-opencode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The self-invocation guard is runtime-signal-based (env/ancestry/lockfile), not path-based, so it survives the move unchanged"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: onboard-cli-opencode

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 8 |
| **Predecessor** | 003-scaffold-hub |
| **Successor** | 005-foldin-cli-claude-code |
| **Handoff Criteria** | The cli-opencode relocation plan is specific enough for future execution: the ~70-file tree and its shared dispatch hook move into the packet, the fail-open PreToolUse hook path is repointed, and the hook resolves cli-opencode from its new hub location without touching cli-claude-code assets or the scorer |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Merge cli-opencode and cli-claude-code into one parent hub cli-external with two workflow modes: cli-opencode and cli-claude-code specification.

**Scope Boundary**: Move and hook-repoint only. This phase relocates the cli-opencode tree into the already-scaffolded `cli-opencode/` workflow packet and repoints the shared, fail-open PreToolUse dispatch hook; it does not fold in cli-claude-code, dissolve graph identities, or rewrite the scorer.

**Dependencies**:
- Phase 003 hub skeleton exists with an empty `cli-opencode/` packet location.
- Current `.opencode/skills/cli-opencode/` content remains the source of truth until the future execution pass runs `git mv`.
- Phase 005 owns the cli-claude-code fold-in, the identity dissolution, and the atomic scorer rewrite.

**Deliverables**:
- A scoped specification for relocating the current cli-opencode skill into `.opencode/skills/cli-external/cli-opencode/`, preserving git history.
- A concrete plan covering the future `git mv`, the `.claude/settings.json` PreToolUse hook-path repoint, and the hub-aware update to the hook's internal skill registry for cli-opencode.
- An executable task list for the later implementation pass, including the mid-migration-window mitigation (keep 004 and 005 tight).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 created the parent-hub skeleton, but the `cli-opencode/` packet has no relocated implementation yet. The cli-opencode tree also physically hosts the shared `scripts/hooks/dispatch-preflight-lint.mjs` that the `.claude/settings.json` PreToolUse(Bash) hook runs on every Bash call. That hook fails OPEN: if its path 404s after the move, dispatch-rule enforcement is silently lost with no error. So the move and the hook-path repoint must land atomically.

### Purpose
Populate the `cli-opencode` workflow packet with the current cli-opencode behavior through a history-preserving move, and repoint the fail-open PreToolUse dispatch hook so it keeps firing from the new hub location, without changing any dispatch semantics.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Plan the future `git mv` relocation of today's `.opencode/skills/cli-opencode/` ~70-file tree (including `scripts/`, `references/`, `assets/`, `changelog/`, and `manual_testing_playbook/`) into `.opencode/skills/cli-external/cli-opencode/`, preserving history.
- Plan the `.claude/settings.json` PreToolUse hook-path repoint from `.opencode/skills/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` to the new hub location, atomic with the move.
- Plan the hub-aware update to the hook's internal `DISPATCH_SKILLS` registry and its `path.join(projectDir, '.opencode/skills', skill, 'SKILL.md')` resolution so it resolves cli-opencode from `cli-external/cli-opencode/SKILL.md`; the cli-claude-code registry entry finalizes in phase 005.
- Plan the rewrite of cli-opencode's internal outbound paths IN THE SAME MOVE: the ~54 relative cross-skill references (`../sk-prompt/...`, `../system-spec-kit/...`, playbook anchors) each gain a `../` because the tree nests one level deeper, and any absolute self-references (`.opencode/skills/cli-opencode/...`) become `cli-external/cli-opencode/...`. A depth-broken `../../sk-prompt/...` never contains the old flat path string, so phase 006's grep cannot catch it — this must land in the move, verified by a link-resolve check.
- Plan the repoint of `check-prompt-quality-card-sync.sh`'s cli-opencode card path (and its `cli_skills` array handling) in the SAME commit as the move, so the CI-wired `.github/workflows/prompt-card-sync.yml` gate does not go red for the 004-to-005 window.
- Confirm the packet-local `graph-metadata.json` is not duplicated as a surviving identity — the hub owns the single advisor identity, and full dissolution completes in phase 005.

### Out of Scope
- Folding `.opencode/skills/cli-claude-code/` into the hub - phase 005 owns cli-claude-code, the identity dissolution, and the scorer rewrite.
- Editing `executor-delegation.ts`, its dist, or the parity fixtures - phase 005 owns the atomic scorer bundle.
- The broad documentation/prose referrer sweep and the Python alias-map repoint - phase 006 owns those.
- Changing cli-opencode's dispatch behavior, self-invocation guard, or provider handling - this phase is pure relocation plus a functional hook-path repoint.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-opencode/` -> `.opencode/skills/cli-external/cli-opencode/` | Move | Future `git mv` of the current ~70-file cli-opencode tree into the workflow packet, with the packet-local `graph-metadata.json` not duplicated as a surviving identity. |
| `.claude/settings.json` | Modify | Repoint the PreToolUse(Bash) hook path to the hook's new hub location, atomic with the move; the hook fails open, so a stale path silently loses enforcement. |
| `.opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` | Modify | Make the hook hub-aware: its `DISPATCH_SKILLS` registry and `SKILL.md` path resolution must resolve cli-opencode from the hub layout; the cli-claude-code entry finalizes in phase 005. |
| `cli-external/cli-opencode/**` internal outbound paths (~54 relative cross-skill refs + any absolute self-refs) | Modify | Add a `../` to every relative cross-skill path (nested one dir deeper) and rewrite absolute self-refs; verify with a link-resolve check — grep cannot catch these afterward. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` | Modify | Repoint the cli-opencode card path in the same commit as the move to keep `.github/workflows/prompt-card-sync.yml` green through the 004-to-005 window. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All current cli-opencode files are present under `.opencode/skills/cli-external/cli-opencode/` with git history preserved. | `git status --short` shows renames rather than copy/delete churn for the relocated files, and the future implementation accounts for the expected ~70-file source set with packet-local graph metadata excluded from duplication. |
| REQ-002 | The fail-open PreToolUse hook path is repointed atomically with the move. | `.claude/settings.json` references the hook's new hub location, and a Bash-call smoke check confirms the dispatch-preflight lint still runs (does not 404 silently). |
| REQ-003 | The hook resolves cli-opencode from its new hub location. | The hook's `DISPATCH_SKILLS` registry and `SKILL.md` path resolution reach `cli-external/cli-opencode/SKILL.md`; the cli-claude-code entry is explicitly left for phase 005 with the 004-to-005 window kept tight. |
| REQ-006 | cli-opencode's internal outbound paths are rewritten in the same move and resolve. | Every relative cross-skill path gains the extra `../` and every absolute self-ref is rewritten; a link-resolve check (or a targeted grep for unresolved `../sk-`/`../system-` targets) confirms zero broken outbound links — this is NOT deferred to phase 006, whose grep cannot detect a depth-broken relative path. |
| REQ-007 | The card-sync CI gate stays green across the move. | `check-prompt-quality-card-sync.sh`'s cli-opencode card path is repointed in the same commit as the move, so `.github/workflows/prompt-card-sync.yml` does not go red during the 004-to-005 window. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The self-invocation guard survives the move unchanged. | The cli-opencode guard remains runtime-signal-based (env var / process ancestry / lockfile) and its parallel-detached carve-out is preserved; no path-based rewrite is applied. |
| REQ-005 | No dispatch behavior changes during relocation. | The moved packet keeps its `allowed-tools`, hard-rules, and dispatch procedure bodies unchanged; only paths move. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future execution pass can relocate the cli-opencode tree with `git mv` and no behavior edits to dispatch, guard, or provider logic.
- **SC-002**: The fail-open PreToolUse hook keeps firing after the move because its path is repointed in the same change and confirmed by an active Bash-call check.
- **SC-003**: Exactly one advisor identity remains authoritative (the hub's); the packet-local graph metadata is not duplicated as a competing identity.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 parent hub skeleton | High if missing | Confirm the hub and empty `cli-opencode/` packet exist before running any future move. |
| Risk | The fail-open PreToolUse hook path is not repointed atomically | High | Repoint `.claude/settings.json` in the same change as the move; confirm with an active Bash-call check, not a passive "no error" |
| Risk | Mid-migration dispatch window while cli-claude-code is still flat | Medium | Keep 004 and 005 tight; the hook's cli-claude-code entry finalizes in 005; cli-claude-code resolves at its flat path until then |
| Risk | Accidental behavior edits during relocation | Medium | Restrict implementation to `git mv`, the settings.json path, and the hook's cli-opencode resolution; compare content before/after if uncertainty appears |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No open questions for this drafting pass. The shared-hook-lift sub-decision (hub root vs packet-local `scripts/`) is resolved at execution time when the move runs; either placement is acceptable as long as the hook is made hub-aware and the settings.json path matches.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
