---
title: "Feature Specification: Installers, guides and diagnosis"
description: "Stop the installers writing an absolute interpreter path, teach the diagnostic route to detect a host that cannot satisfy the engine range, and record why the constraint exists where readers meet it."
trigger_phrases:
  - "code mode install script"
  - "doctor mcp node check"
  - "mcp install guide node version"
  - "isolated-vm constraint documentation"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Installers, guides and diagnosis

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-host-config-cutover |
| **Successor** | None |
| **Handoff Criteria** | A fresh install writes no absolute interpreter path, and a host that cannot satisfy the range is diagnosed before a tool call discovers it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the portable Node resolution specification.

**Scope Boundary**: Installers, guides, the diagnostic route, and one authoring checklist. No runtime behavior changes.

**Dependencies**:
- The cutover completed by 003-host-config-cutover

**Deliverables**:
- Installers that write the portable registration rather than an absolute path
- A diagnostic check that reports a host with no satisfying interpreter
- Documentation that records the constraint and its consequence where readers meet it

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two install scripts write MCP registrations, so a fresh install would reintroduce whatever shape they encode regardless of what the cutover fixed. The diagnostic route checks that servers are registered and reachable, but not that the host can satisfy the one server with an interpreter constraint, so the first symptom of an unsatisfiable host is a tool call that kills the connection.

Underneath both is an authoring gap. The constraint is explained in the server's postinstall check, but the places a reader is likely to meet the launch path first - the install guides and an authoring checklist - either omit the reason or restate the old absolute path as if it were the pattern to copy.

### Purpose

Close the loop so the portable shape survives a fresh install, an unsatisfiable host is reported rather than discovered, and the next reader learns why the constraint exists instead of inferring it from a path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The two install scripts that write the code_mode registration
- The two install guides that document its setup
- The diagnostic route's MCP target
- The authoring checklist that currently restates the absolute path

### Out of Scope

- Installing an interpreter on the operator's behalf - the diagnosis names what is missing and leaves the choice of version manager alone
- Rewording the server's postinstall check - it already carries the reason and is the source this phase quotes from

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-code-mode/scripts/install.sh` | Modify | Write the portable registration |
| `.opencode/install-guides/install-scripts/install-code-mode.sh` | Modify | Write the portable registration |
| `.opencode/install-guides/MCP - Code Mode.md` | Modify | Document the range and the refusal message |
| `.opencode/skills/mcp-code-mode/INSTALL-GUIDE.md` | Modify | Document the range and the refusal message |
| `.opencode/commands/doctor/mcp.md` | Modify | Report a host with no satisfying interpreter |
| `.opencode/skills/sk-code/sk-code-opencode/assets/checklists/mcp-server-authoring.md` | Modify | Record the constraint rather than one machine's path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A fresh install writes no absolute interpreter path | Running each installer against a scratch configuration produces a registration with no absolute interpreter path |
| REQ-002 | The diagnostic route reports an unsatisfiable host | With the range forced unsatisfiable, the MCP diagnosis names the requirement and does not report the server as healthy |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The guides state the requirement and what happens when it is unmet | Each guide names the supported range and the refusal behavior |
| REQ-004 | The authoring checklist stops presenting the old path as the pattern | The checklist names the constraint and its consequence, with no absolute interpreter path |
| REQ-005 | The diagnosis reads the range rather than restating it | Changing the declared range in the manifest changes what the diagnosis reports, with no edit to the diagnostic route |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A contributor installing on an unsupported interpreter is told so by the diagnostic route, before any tool call.
- **SC-002**: No installer, guide or checklist in the repository names an absolute interpreter path for this server.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The diagnosis duplicates the constraint and drifts from the manifest | Medium | The check reads the declared range through the resolver rather than restating it |
| Risk | An installer is edited without being run, so its output is assumed rather than observed | Medium | Each installer is executed against a scratch configuration and its output inspected |
| Dependency | The resolver and launcher from earlier phases | Low | Both are delivered, tested, and live by the time this phase runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the diagnostic route should offer to install a satisfying interpreter, or only report the gap.
- Whether the guides should name a specific version manager, given that the resolver deliberately supports several.
<!-- /ANCHOR:questions -->

---
