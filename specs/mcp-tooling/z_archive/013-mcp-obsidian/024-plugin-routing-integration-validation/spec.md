---
title: "Plugin routing integration and validation for the six additions"
description: "Wire the six plugins into the SKILL.md router and resource map, refresh hub metadata, and validate the file-layer contract live with throwaway-vault discipline."
trigger_phrases:
  - "plugin routing integration"
  - "charts dataview excalidraw git outliner minimal routing"
  - "plugin validation closeout"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/024-plugin-routing-integration-validation"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase documentation"
    next_safe_action: "Execute the phase work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/024-plugin-routing-integration-validation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Plugin routing integration and validation for the six additions

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (013-mcp-obsidian) |
| **Parent Packet** | `mcp-tooling/013-mcp-obsidian` |
| **Predecessor** | `021-plugin-installation-batch` (or sibling ordering per phase map) |
| **Successor** | See phase map |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mode now ships six more community artifacts (five plugins and the Minimal theme) whose file layers are not yet documented, cataloged, or routed.

### Purpose

Extend `SKILL.md` with six plugin intents (PLUGIN_CHARTS, PLUGIN_DATAVIEW, PLUGIN_EXCALIDRAW, PLUGIN_GIT, PLUGIN_OUTLINER, PLUGIN_MINIMAL) in INTENT_SIGNALS + RESOURCE_MAP + keywords + resource map comments, load the new reference sets on demand, regenerate the mcp-tooling leaf manifest and hub metadata, run at least one live file-layer validation per plugin against a throwaway vault (never the real vaults), verify routing via the advisor/hub surfaces where warm, and close out phases 021-024 with implementation summaries, metadata regeneration, and validate.sh.

---

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Extend `SKILL.md` with six plugin intents (PLUGIN_CHARTS, PLUGIN_DATAVIEW, PLUGIN_EXCALIDRAW, PLUGIN_GIT, PLUGIN_OUTLINER, PLUGIN_MINIMAL) in INTENT_SIGNALS + RESOURCE_MAP + keywords + resource map comments, load the new reference sets on demand, regenerate the mcp-tooling leaf manifest and hub metadata, run at least one live file-layer validation per plugin against a throwaway vault (never the real vaults), verify routing via the advisor/hub surfaces where warm, and close out phases 021-024 with implementation summaries, metadata regeneration, and validate.sh.

### Out of Scope

- Changes to other skills or hub files outside the mcp-obsidian mode (except the mcp-tooling leaf manifest regeneration in the routing phase).
- Vault content beyond the installed plugin files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Listed in the phase tasks and checklist; all changes stay inside the `mcp-obsidian` mode tree plus phase docs | Author/Modify | Per the phase focus above |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Router covers the six plugins | INTENT_SIGNALS and RESOURCE_MAP name all six intents with correct reference lists |
| REQ-002 | Manifest and hub metadata fresh | Leaf manifest regenerated; description/graph metadata match docs |
| REQ-003 | Live validation executed | At least one file-layer scenario per plugin passed against a throwaway vault with recorded evidence |
| REQ-004 | Phases close out | Implementation summaries for 021-024; validate.sh errors zero |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Phase docs and metadata stay in sync | Tasks and checklist carry evidence; description.json and graph-metadata.json regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase's artifacts land and pass their stated gates.
- **SC-002**: The six additions behave as documented in at least one live or fixture-backed check.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 021-023 complete before 024 | Router points at missing docs | Ordering enforced by the phase map and handoff criteria |
| Risk | Unverifiable plugin details | Invented claims | `VERIFY` markers instead of guesses |
| Risk | Real vaults mutated during validation | Data loss | Throwaway-vault discipline (`_pbtest-`) only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->