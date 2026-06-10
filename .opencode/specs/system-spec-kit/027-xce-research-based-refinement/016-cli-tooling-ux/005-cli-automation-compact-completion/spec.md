---
title: "Feature Specification: CLI Compact Output and Shell Completion [template:level_1/spec.md]"
description: "Add list-tools --compact/--names-only machine-friendly JSON to all three CLIs and generate bash/zsh shell completion from the existing tool manifests."
trigger_phrases:
  - "cli list-tools compact names-only"
  - "cli shell completion generation"
  - "machine friendly cli json"
  - "cli automation manifests"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/005-cli-automation-compact-completion"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level-1 child from assessment rows 11, 12"
    next_safe_action: "Plan compact list-tools output and completion generation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-005-cli-automation-compact-completion"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CLI Compact Output and Shell Completion

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
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `list-tools --format json` output includes the full `inputSchema` for every tool, so machine scripts must parse large payloads to get tool names: spec (`spec-memory-cli.ts:463-481`; the spec-memory JSON was over 75KB in the assessment run), code (`code-index-cli.ts:542-562`), advisor (`skill-advisor-cli.ts:705-725`). There is no compact or names-only JSON mode. Separately, no CLI has a `completion` command; the tool registries already exist (`TOOL_DEFINITIONS`, `CODE_GRAPH_TOOL_SCHEMAS`, advisor manifest), so shell completion could be generated from the same source instead of hand-maintained.

### Purpose
Add a machine-friendly compact (`--compact` or `--names-only`) `list-tools --format json` mode to all three CLIs so automation avoids parsing huge schemas, and generate bash/zsh shell completion from the existing tool manifests so interactive DX improves without hand-maintained completion files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A compact / names-only machine-friendly `list-tools --format json` mode on all three CLIs.
- Generated bash/zsh shell completion from the existing tool manifests.

### Out of Scope
- Tool coverage changes (manifests already enumerate dynamically).
- The freshness/smoke, help/alias, documentation, and envelope work owned by sibling sub-phases 001, 002, 003, 004.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/spec-memory-cli.ts` (`:463-481`) | Modify | Add `--compact`/`--names-only` JSON to list-tools |
| `system-code-graph/mcp_server/code-index-cli.ts` (`:542-562`) | Modify | Add `--compact`/`--names-only` JSON to list-tools |
| `system-skill-advisor/mcp_server/skill-advisor-cli.ts` (`:705-725`) | Modify | Add `--compact`/`--names-only` JSON to list-tools |
| Shell completion generators (new) | Create | bash/zsh completion from `TOOL_DEFINITIONS` / `CODE_GRAPH_TOOL_SCHEMAS` / advisor manifest |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All three CLIs support a compact / names-only `list-tools --format json` mode | `list-tools --compact` (or `--names-only`) returns machine-friendly JSON without full `inputSchema`; counts still 37/8/9 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Shell completion (bash/zsh) is generated from the existing tool manifests | Completion lists the current tool names per CLI; regenerating after a manifest change reflects new tools |
| REQ-003 | Compact output stays consistent with the alias map from sub-phase 002 | Compact names match the canonical command names and aliases |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Automation can read tool names without parsing full schemas, with 37/8/9 counts intact.
- **SC-002**: Shell completion is generated from manifests, not hand-maintained, and reflects manifest changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Shell differences between bash and zsh | Med | Generate per-shell completion from one manifest source; test each shell |
| Risk | Compact mode drifts from full mode on counts | Low | Smoke check (sub-phase 001) asserts 37/8/9 for both modes |
| Dependency | Alias map from sub-phase 002 | Internal | Land aliases first so completion + compact names stay consistent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should completion be generated on demand via a `completion` subcommand, or pre-generated into a checked-in/CI artifact?
- Should `--compact` and `--names-only` be distinct modes, or one flag with a documented field set?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
