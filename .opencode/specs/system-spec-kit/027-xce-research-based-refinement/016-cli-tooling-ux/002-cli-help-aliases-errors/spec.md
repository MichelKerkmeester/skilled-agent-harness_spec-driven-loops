---
title: "Feature Specification: CLI Per-Command Help, Aliases, and Errors [template:level_1/spec.md]"
description: "Add per-command help/schema to spec-memory + code-index, consistent snake/kebab/camel aliases across all three CLIs, and improved unknown-command errors with a list-tools hint and closest-match suggestion."
trigger_phrases:
  - "cli per-command help"
  - "cli command aliases snake kebab camel"
  - "cli unknown command suggestion"
  - "cli help schema discoverability"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/002-cli-help-aliases-errors"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level-1 child from assessment rows 2, 3, 4"
    next_safe_action: "Plan per-command help, alias map, and error-hint changes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-002-cli-help-aliases-errors"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CLI Per-Command Help, Aliases, and Errors

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
The three daemon CLI front-doors are inconsistent in discoverability and error recovery. skill-advisor already offers per-command schema help (`skill-advisor-cli.ts:661-674`), but spec-memory always calls the global `usageText()` (`spec-memory-cli.ts:750-755`) and code-index does the same (`code-index-cli.ts:898-903`), so a user must read the giant `list-tools` JSON to learn one command's required args. Command aliasing is uneven: spec-memory maps snake+kebab only (`spec-memory-cli.ts:222-228`), code-index the same (`code-index-cli.ts:241-247`), while skill-advisor adds camel aliases (`skill-advisor-cli-manifest.ts:142-151`). Unknown-command handling emits structured JSON errors in shared catch paths (spec `spec-memory-cli.ts:774-793`, code `code-index-cli.ts:926-945`, advisor `skill-advisor-cli.ts:1111-1130`) but gives no "try list-tools" hint and no closest-match suggestion, so a typoed command is slow to recover from.

### Purpose
Bring spec-memory and code-index up to the skill-advisor discoverability bar with per-command help/schema, give all three CLIs consistent snake/kebab/camel command aliases, and improve unknown-command errors with a "try list-tools" hint plus a closest-match suggestion so typoed commands recover fast.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Per-command `<tool> --help`/schema for spec-memory and code-index, copying the skill-advisor pattern.
- Consistent snake/kebab/camel command aliases across all three CLIs.
- Improved unknown-command errors with a "try list-tools" hint and a closest-match suggestion.

### Out of Scope
- Tool coverage changes (the registries already auto-propagate new tools).
- The freshness/smoke, documentation, envelope, and completion work owned by sibling sub-phases 001, 003, 004, 005.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/spec-memory-cli.ts` (`:750-755`, `:222-228`, `:774-793`) | Modify | Per-command help, camel alias parity, unknown-command hint + suggestion |
| `system-code-graph/mcp_server/code-index-cli.ts` (`:898-903`, `:241-247`, `:926-945`) | Modify | Per-command help, camel alias parity, unknown-command hint + suggestion |
| `system-skill-advisor/mcp_server/skill-advisor-cli.ts` (`:1111-1130`) | Modify | Unknown-command hint + suggestion (already has per-command help + camel aliases) |
| `skill-advisor-cli-manifest.ts:142-151` (alias reference pattern) | Reference | Source-of-truth alias pattern to mirror |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | spec-memory and code-index expose per-command `<tool> --help`/schema matching the skill-advisor pattern | `spec-memory <tool> --help` and `code-index <tool> --help` print that tool's schema/args offline; exit `0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | All three CLIs accept consistent snake/kebab/camel command aliases with no collisions | Alias map is tested for collisions (guardrail: assessment #3 risk); a collision is a test failure, not a silent last-wins |
| REQ-003 | Unknown-command errors include a "try list-tools" hint and a closest-match suggestion | A typoed command returns structured JSON with the hint and the nearest valid command name |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: spec-memory and code-index match skill-advisor for offline per-command help.
- **SC-002**: The alias map is collision-tested and consistent across all three CLIs.
- **SC-003**: Unknown commands return an actionable hint plus a closest-match suggestion.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Alias collisions across snake/kebab/camel forms | Med | Test for collisions; a collision fails the build (assessment #3 guardrail) |
| Risk | Closest-match suggestion could mislead on near-ties | Low | Bound the suggestion to a single nearest match above a distance threshold |
| Dependency | skill-advisor per-command help pattern | Internal | Mirror `skill-advisor-cli.ts:661-674` rather than inventing a new shape |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should camel-case aliases be generated from the snake form, or declared explicitly per tool to avoid ambiguous transforms?
- What edit-distance threshold should gate the closest-match suggestion?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
