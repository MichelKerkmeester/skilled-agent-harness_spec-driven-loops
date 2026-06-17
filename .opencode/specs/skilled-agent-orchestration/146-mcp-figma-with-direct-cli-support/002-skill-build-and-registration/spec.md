---
title: "Feature Specification: mcp-figma skill build and registration"
description: "Record of building the mcp-figma skill v0.1.0: terminal control of Figma Desktop via the silships figma-cli (npm figma-ds-cli), the gated command surface, the install and safety scripts, the optional Figma MCP via Code Mode, graph registration, and live install plus verification. Deliverable is the skill at .opencode/skills/mcp-figma/."
trigger_phrases:
  - "mcp-figma skill build"
  - "figma-ds-cli skill registration"
  - "figma terminal control skill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/146-mcp-figma-with-direct-cli-support/002-skill-build-and-registration"
    last_updated_at: "2026-06-14T17:00:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Documented the shipped mcp-figma v0.1.0 build, scripts, registration, and live verify"
    next_safe_action: "Operator reviews the record; both phases are complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-002-skill-build-and-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: mcp-figma skill build and registration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Type** | Retroactive record of completed work (already shipped) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The phase 001 research established that the silships figma-cli can drive the live Figma Desktop session from the terminal, that npm carries a naming trap and a minimal-build trap, and that an optional Figma MCP is reachable through Code Mode. But no skill packaged that surface for an agent to use. Without a skill, an agent had no house-conformant contract for installing and wiring figma-cli, no map of which commands are safe to call, no install path that selects the full repo build over the minimal npm publish, and no guard against the destructive commands the CLI exposes.

### Purpose
Build the `mcp-figma` skill so an agent can drive Figma Desktop from the terminal: install figma-ds-cli (the full repo build), connect to the live session in safe or yolo mode, read design systems, tokens, variables, and components, author and modify designs, export and extract, and optionally pull design context through the Code Mode `figma` MCP, all under a read-only, mutating, and destructive command gating policy modeled on the sibling terminal-control skills.

> **Retroactive record.** This packet documents work that already shipped into the skill at `.opencode/skills/mcp-figma/`. It is a past-tense record pointing to that deliverable. It does not re-do the build and it does not edit the skill.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `mcp-figma` skill package: `SKILL.md`, four references (`figma_cli_reference.md`, `tool_surface.md`, `mcp_wiring.md`, `troubleshooting.md`), a feature catalog, a manual testing playbook, a README, an INSTALL_GUIDE, and a v0.1.0.0 changelog.
- Eight install and safety scripts: `install.sh`, `connect-safe.sh`, `connect-yolo.sh`, `daemon.sh`, `doctor.sh`, `unpatch.sh`, `print-utcp-snippets.sh`, and the shared `_common.sh`.
- The gating policy: read-only commands surface, mutating commands are gated behind confirmation, destructive commands (including `eval`, `raw`, and `run` treated as arbitrary mutation) are kept off the default path.
- Graph registration: schema-2 skill graph metadata plus reciprocal sibling edges, and live install plus verification.

### Out of Scope
- Changes to the Figma app or the silships upstream repo (read-only third-party input).
- The unrelated npm `figma-cli` package, named only as a trap to avoid.
- Re-deriving or caching Figma content; the skill reads the live session and caches nothing beyond explicit user exports.

### Files Changed (shipped into the skill at `.opencode/skills/mcp-figma/`)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-figma/SKILL.md` | Created | Runtime contract: install, connect, read, author, export direction, the gating policy, the naming and version traps |
| `.opencode/skills/mcp-figma/references/figma_cli_reference.md` | Created | The figma-cli command surface and daemon model |
| `.opencode/skills/mcp-figma/references/tool_surface.md` | Created | The read-only, mutating, and destructive command tiers |
| `.opencode/skills/mcp-figma/references/mcp_wiring.md` | Created | The optional Figma MCP via Code Mode (Framelink `figma` manual) |
| `.opencode/skills/mcp-figma/references/troubleshooting.md` | Created | Failure paths and recovery |
| `.opencode/skills/mcp-figma/scripts/` (8 scripts) | Created | Install, safe and yolo connect, daemon, doctor, unpatch, UTCP snippets, shared helpers |
| `.opencode/skills/mcp-figma/feature_catalog/feature_catalog.md` | Created | Capability inventory |
| `.opencode/skills/mcp-figma/manual_testing_playbook/manual_testing_playbook.md` | Created | Operator scenarios |
| `.opencode/skills/mcp-figma/README.md` | Created | Narrative overview, troubleshooting, FAQ |
| `.opencode/skills/mcp-figma/INSTALL_GUIDE.md` | Created | Phase-based install and safety guide |
| `.opencode/skills/mcp-figma/changelog/v0.1.0.0.md` | Created | Initial release changelog |
| `.opencode/skills/mcp-figma/graph-metadata.json` | Created | Skill graph topics, edges, source docs |
| Sibling skills' `graph-metadata.json` | Modified | Reciprocal sibling edges (mcp-open-design, mcp-chrome-devtools, mcp-magicpath) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (delivered)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The skill installs and wires the correct figma-cli | `install.sh` selects the full repo build (figma-ds-cli >= 1.2.0) over the minimal npm publish, and the skill warns never to install npm `figma-cli` |
| REQ-002 | The command surface is mapped and gated | `tool_surface.md` classifies commands as read-only, mutating, or destructive, and treats `eval`, `raw`, and `run` as arbitrary mutation |
| REQ-003 | Connect modes are safe by default and reversible | The skill defaults to safe (plugin) connect, gates yolo (app.asar patch) connect, and ships `unpatch.sh` for rollback |

### P1 - Required (delivered)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The optional Figma MCP path is documented | `mcp_wiring.md` covers the Code Mode `figma` (Framelink) manual exposing `get_figma_data` and `download_figma_images`, marked opt-in |
| REQ-005 | The skill follows the sibling terminal-control structure | The package carries the same SKILL.md, references, feature catalog, playbook, README, and changelog shape as the sibling skills |
| REQ-006 | The skill is graph-registered and live-verified | Schema-2 graph metadata plus reciprocal sibling edges added; figma-ds-cli 1.2.0 installed and the Code Mode `figma` manual discovered live |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `mcp-figma` skill exists at `.opencode/skills/mcp-figma/` with the full package and eight scripts.
- **SC-002**: `validate.sh` on this packet with `--strict` reports zero errors.
- **SC-003**: `package_skill.py --check` returns PASS, figma-ds-cli 1.2.0 is installed from the repo build, and the Code Mode `figma` manual is confirmed to expose `get_figma_data` and `download_figma_images`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An agent installs the unrelated npm `figma-cli` | High | The SKILL.md states the naming trap up front and `install.sh` targets `figma-ds-cli` from the repo build |
| Risk | An agent runs a destructive command thinking it is read-only | High | The read-only, mutating, and destructive tiers gate the surface, with `eval`, `raw`, and `run` treated as arbitrary mutation |
| Risk | The yolo connect patch leaves Figma in a modified state | Medium | Safe (plugin) connect is the default and `unpatch.sh` rolls the yolo patch back |
| Dependency | Phase 001 research ground-truth | Green | The CLI surface, the MCP landscape, and the install path came from the five-iteration research |
| Dependency | The installed Figma Desktop and the silships repo | Green | The skill drives the live Figma session and installs the full surface from the repo build |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Safety
- **NFR-S01**: Every mutating command is gated behind explicit confirmation and every destructive command is kept off the default path, and the yolo connect patch ships with a rollback script, so an agent cannot overwrite, delete, or patch Figma without an intentional step.

### Consistency
- **NFR-C01**: The skill follows the sibling terminal-control package shape and house voice, with no em dashes and no prose semicolons in new prose.

### Accuracy
- **NFR-A01**: Capability and version claims are tagged confirmed or inferred so a reader can tell verified facts from reasoning, and the live install plus Code Mode discovery is the authority for the version and the MCP tool names.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Install boundaries
- The minimal npm build is already on PATH: `install.sh` `--source auto` upgrades to the full repo build when the npm version is stale.
- The unrelated npm `figma-cli` is on PATH: the skill warns it is a different tool and uses `figma-ds-cli` as the canonical command throughout.

### Connect boundaries
- Figma Desktop is closed or has no file open: the skill documents the connect failure path and the daemon prerequisite.
- A yolo patch is in place and must be undone: `unpatch.sh` reverts the app.asar patch.

### Tool-surface boundaries
- A command looks read-only but mutates: `eval`, `raw`, and `run` are classified as arbitrary mutation and gated.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | A full new skill package plus eight install and safety scripts |
| Risk | 11/25 | Correctness-critical command gating and an app-patch connect mode, mitigated by gating and rollback |
| Research | 6/20 | The CLI surface and install path were supplied by phase 001, and the build applied them |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The live install confirmed figma-ds-cli 1.2.0 from the repo build (npm publishes only a minimal 1.0.0) and the Code Mode `figma` manual exposing `get_figma_data` and `download_figma_images`.
<!-- /ANCHOR:questions -->
