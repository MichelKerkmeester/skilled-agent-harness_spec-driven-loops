---
title: "Feature Specification: Phase 10: agent-definitions"
description: "Strip code-graph tool grants and search-routing prose from the eight agent definitions, keeping the three runtime mirrors — OpenCode, Claude, and Codex — byte-consistent in intent so no agent is granted a tool that no longer exists."
trigger_phrases:
  - "agent code graph tool grant removal"
  - "context agent code graph"
  - "deep review agent graph tools"
  - "agent runtime mirror parity"
  - "036 agent definitions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/010-agent-definitions"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-010-agent-definitions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: agent-definitions

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Not Started |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 15 |
| **Predecessor** | 009-command-surface |
| **Successor** | 011-doctrine-and-docs |
| **Handoff Criteria** | No agent definition in any runtime grants or documents a removed tool, and the three mirrors stay consistent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the code graph decommission specification.

**Scope Boundary**: Agent definitions in `.opencode/agents/`, `.claude/agents/`, and `.codex/agents/`.

**Dependencies**:
- Phase 002 replacement routing, which supplies the guidance text that replaces graph-first search instructions.

**Deliverables**:
- Graph tool grants removed from all eight agents in all three runtimes.
- Search-routing prose rewritten to name the replacement path.
- Mirror parity confirmed across the three runtime formats.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Eight agents are defined three times over — once per runtime, in Markdown for OpenCode and Claude and in TOML for Codex — and each copy grants the code-graph tools and carries prose telling the agent to prefer structural search. The `context` and `deep-review` agents lean on it hardest. Because the definitions are mirrors rather than a shared source, an edit applied to one runtime silently diverges the other two, and an agent left holding a grant for a nonexistent tool will either error at dispatch or waste a turn discovering the tool is gone.

### Purpose
Bring all three runtime mirrors to the same post-decommission state: no grant for a removed tool, and search guidance that names a path the agent can actually take.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Tool-grant lists in all eight agent definitions across all **four** runtime mirrors: `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, and `.pi/agents/`.
- Search-routing, structural-discovery, and wedged-daemon-fallback prose inside those definitions.
- Parity between the Markdown and TOML formats.

> The Pi mirror arrived mid-packet with the `cli-pi` executor and is easy to miss: it is a fourth
> regular-file projection, not a symlink alias, and eight of its agent files carry the tool grants
> and the daemon-fallback paragraph. `.cursor/agents/` by contrast is symlinked and needs no edit.

### Out of Scope
- Agent behaviour unrelated to code search.
- The root instruction files that describe agent routing — phase 011.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agents/*.md` | Modify | Remove grants and graph-first prose |
| `.claude/agents/*.md` | Modify | Mirror of the above |
| `.codex/agents/*.toml` | Modify | Mirror in TOML form |
| `.pi/agents/*.md` | Modify | Fourth mirror; 8 files carry grants and daemon-fallback prose |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No agent grants a removed tool | No definition lists a graph tool id |
| REQ-002 | All four mirrors are updated together | The same agent has equivalent tool grants in OpenCode, Claude, Codex, and Pi |
| REQ-003 | Definitions remain parseable | Markdown frontmatter and TOML both parse cleanly |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Search guidance names the replacement | Prose directs agents to the phase 002 path |
| REQ-005 | Agents that lose a capability say so plainly | The `context` and `deep-review` definitions describe what they can still do |
| REQ-006 | No agent is left with an empty tool list | Each definition retains a workable tool set |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Dispatching each agent in its own runtime produces no unknown-tool error.
- **SC-002**: A diff across the three mirrors shows equivalent intent for every agent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | One runtime mirror missed | Divergent agent behaviour across runtimes | REQ-002 requires an explicit three-way check |
| Risk | Over-trimming a tool list | Agent loses unrelated capability | Restrict edits to graph tool ids |
| Risk | Prose still assumes structural search exists | Agents waste turns | REQ-004 rewrites the guidance, not just the grants |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the `context` agent's remit narrow explicitly now that structural retrieval is unavailable?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
