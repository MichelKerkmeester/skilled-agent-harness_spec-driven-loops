---
title: "Feature Specification: CLI transport proof"
description: "Nothing in this repository has ever registered a UTCP cli manual; this phase proves one registers and answers through Code Mode before four other phases depend on it."
trigger_phrases:
  - "utcp cli transport proof"
  - "cli manual registration"
  - "code mode cli call"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CLI transport proof

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-manual-and-auth |
| **Handoff Criteria** | A `cli` manual is callable through Code Mode and returns the CLI's own parsed output rather than a registration or transport error |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the MagicPath tool bridge specification.

**Scope Boundary**: One probe manual and the calls that exercise it. No skill packet, no hub metadata, no authentication, and no MagicPath command beyond the one that answers without credentials.

**Dependencies**:
- `@utcp/cli@1.1.0`, already present in the Code Mode server's dependencies
- `magicpath-ai` on PATH, already installed at 2.3.2

**Deliverables**:
- A probe manual registered as `call_template_type: "cli"`
- A recorded `call_tool_chain` result proving the transport answers
- A decision, evidenced, on whether the probe is promoted or removed

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Every manual this repository has ever registered is `call_template_type: "mcp"`. All thirteen of them. The plan for MagicPath rests entirely on a fourteenth kind that has never been exercised here, and four later phases assume it works.

The plugin is installed and its contract is readable: `@utcp/cli` declares a manual whose tools are command templates, substitutes arguments through `UTCP_ARG_name_UTCP_END` placeholders, and parses stdout as JSON when it detects it. Reading that is not the same as watching it answer. If Code Mode cannot reach a `cli` manual - because it filters by template type, because tool discovery expects a UTCP manual the CLI does not emit, or because the generated shell wrapper fails on this platform - then the packet's shape is wrong and the cost of learning that rises with every phase built on top of it.

MagicPath supplies an unusually good probe. `magicpath-ai info -o json` needs no credentials, makes its verdict explicit rather than failing, and emits structured JSON: on this machine it returns `authenticated:false` alongside the CLI version and its own command list. That is a command which answers truthfully whether or not the account is set up, so the transport can be proven before authentication is.

### Purpose

Turn the packet's central assumption into an observed result, using the smallest manual that can carry it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- One probe manual registering a single read-only command
- Calling it through Code Mode and recording what comes back
- Confirming argument substitution, since every later tool depends on it
- Confirming the registration leaves the thirteen existing manuals untouched

### Out of Scope

- Authentication - the probe command is chosen precisely because it answers without it
- The wider MagicPath command surface, which is phase 002
- Any skill, hub or routing surface

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| None | - | The probe is registered at runtime rather than written to `.utcp_config.json`, which four live servers read; the shared file ends the phase byte-identical |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A `cli` manual registers without disturbing the existing manuals | The config parses, the manual count rises by exactly one, and the thirteen existing entries are byte-identical |
| REQ-002 | Code Mode reaches the manual | A `call_tool_chain` against the probe tool returns the CLI's own output, and the returned payload contains the version field the CLI reports |
| REQ-003 | A failure is legible rather than silent | With the command deliberately misspelled, the call reports a failure naming the command instead of returning empty success |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Argument substitution works | A tool taking one argument reaches the CLI with that argument's value, proven with a value that could not appear by chance |
| REQ-005 | The probe does not outlive its purpose | At phase close the probe is either promoted into the phase 002 surface or removed, and the config reflects that choice |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A recorded Code Mode call returns MagicPath's own JSON through a `cli` manual.
- **SC-002**: A deliberately broken command produces a reported failure, so a later green result means something.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Code Mode restricts manuals to the mcp template type | High | This is the phase's whole question; discovering it here costs one manual entry rather than four phases |
| Risk | A malformed manual breaks the config for every other tool | High | The config is validated as JSON before and after, and the existing entries are diffed rather than assumed intact |
| Risk | The generated shell wrapper behaves differently on this platform | Medium | The probe is executed on the target machine, not reasoned about from the plugin's readme |
| Dependency | `magicpath-ai` on PATH | Low | Installed at 2.3.2; the probe command runs without credentials |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Both questions this phase opened are answered by observed results.

- **Several tools in one entry, or one entry per tool**: neither, and the real answer reshapes phase 002. A `cli` manual declares a *discovery command*, and its stdout must itself be a UTCP manual. The call template accepts `commands`, `env_vars`, `working_dir` and `auth` only - there is no inline tool list - so tools are supplied by whatever the discovery command prints. One registration produced three tools this way. Phase 002 therefore needs a discovery emitter this repository owns, not a hand-written tool array in the config.
- **Whether tool search surfaces `cli` tools**: yes, identically to MCP ones. The search returned every probe tool with a generated TypeScript interface, and an input schema became a typed signature, so a well-written schema in the discovery manual is what an agent actually reads.
<!-- /ANCHOR:questions -->

---
