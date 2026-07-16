---
title: "Feature Specification: Rename the deep router agent to deep-loop"
description: "The primary deep-loop router agent was named `deep`, which read ambiguously against the `/deep:*` command namespace and the `deep-loop-workflows` / `deep-loop-runtime` skills. Rename the agent (and only the agent) to `deep-loop` for a single, consistent identity."
trigger_phrases:
  - "deep router rename"
  - "deep-loop agent"
  - "rename deep agent"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/009-deep-router-agent-rename"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "claude-code"
    recent_action: "Renamed the router agent across all three runtime mirrors"
    next_safe_action: "Validate, commit the tracked rename, and push"
    blockers: []
    key_files:
      - ".opencode/agents/deep-loop.md"
      - ".claude/agents/deep-loop.md"
      - ".opencode/agents/orchestrate.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-deep-router-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Rename the deep router agent to deep-loop

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The primary deep-loop router agent was named `deep`. That bare name reads ambiguously against the `/deep:*` command namespace, the `deep-loop-workflows` and `deep-loop-runtime` skills, and the sibling leaf agents (`deep-research`, `deep-review`, `deep-context`). A reader could not tell whether `@deep` meant the router, a command, or a family of agents.

### Purpose
The router agent has one unambiguous identity, `deep-loop`, that matches the surrounding deep-loop naming and never collides with the `/deep:*` command namespace.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the router agent definition `deep.md` to `deep-loop.md` in all three runtime mirrors and set `name: deep-loop`.
- Update the intra-file mirror notes so their path references point at `deep-loop.md`.
- Update the three `orchestrate.md` routing mirrors so their bare `@deep` boundary references read `@deep-loop`.

### Out of Scope
- The `/deep:*` command namespace - it is a command surface, not the agent name, and stays `/deep:*`.
- The sibling leaf agents (`@deep-research`, `@deep-review`, `@deep-context`, `@ai-council`) and `mode-registry.json` - they never reference the router by its bare name, so routing is unaffected.
- Historical spec-folder docs and changelogs that mention `@deep` - they are frozen records of past state and must not be retroactively rewritten.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/agents/deep.md | Delete (rename) | Renamed to deep-loop.md via git mv |
| .opencode/agents/deep-loop.md | Create (rename) | New name; `name: deep-loop`; mirror note repointed |
| .claude/agents/deep.md | Delete (rename) | Renamed to deep-loop.md via git mv |
| .claude/agents/deep-loop.md | Create (rename) | New name; `name: deep-loop`; mirror note repointed |
| .codex/agents/deep-loop.md | Modify | Codex mirror (untracked) renamed on disk for runtime parity |
| .opencode/agents/orchestrate.md | Modify | Bare `@deep` boundary references become `@deep-loop` |
| .claude/agents/orchestrate.md | Modify | Bare `@deep` boundary references become `@deep-loop` |
| .codex/agents/orchestrate.md | Modify | Bare `@deep` boundary references become `@deep-loop` (untracked) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The router agent resolves under the name `deep-loop` in every runtime mirror | Each `deep-loop.md` declares `name: deep-loop`; no `deep.md` router file remains |
| REQ-002 | No live functional reference to the old bare `@deep` router name survives | Zero bare `@deep` matches (excluding `@deep-<mode>`) across live agent and orchestrate files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No sibling agent, command, or registry entry is disturbed | `/deep:*` commands, `@deep-<mode>` agents, and `mode-registry.json` are byte-unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three router mirrors are named `deep-loop.md` with `name: deep-loop`, and no `deep.md` router file exists.
- **SC-002**: Zero bare `@deep` router references remain in live functional files; the `@deep-<mode>` leaf mentions are untouched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-broad replace catching `@deep-research`/`-review`/`-context` | High | Used a negative-lookahead pattern `@deep(?![-\w])` so only the bare router name matched |
| Risk | Codex mirror is untracked; rename would drift from opencode/claude | Med | Renamed the codex mirror on disk for runtime parity and diff-confirmed it matches opencode |
| Dependency | Concurrent session sharing the working tree | Med | Every git add scoped to exact paths; staged set verified leak-free before commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope (agent-only) and documentation target (new spec folder) were confirmed with the user before implementation.
<!-- /ANCHOR:questions -->
