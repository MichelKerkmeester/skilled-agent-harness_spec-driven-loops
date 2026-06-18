---
title: "Implementation Plan: mcp-figma skill build and registration"
description: "Plan record for the shipped mcp-figma v0.1.0 build: install figma-ds-cli (full repo build), map and gate the command surface, author the install and safety scripts, document the optional Code Mode MCP, register the skill graph, and live-verify. Deliverable is the skill at .opencode/skills/mcp-figma/."
trigger_phrases:
  - "mcp-figma build plan"
  - "figma skill registration plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/146-mcp-figma-with-direct-cli-support/002-skill-build-and-registration"
    last_updated_at: "2026-06-14T17:00:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Recorded the executed approach for the shipped v0.1.0 build"
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
# Implementation Plan: mcp-figma skill build and registration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs plus eight bash install and safety scripts |
| **Framework** | OpenCode skill structure, sk-doc templates, house voice |
| **Storage** | `.opencode/skills/mcp-figma/` |
| **Testing** | `package_skill.py --check`, live install of figma-ds-cli, Code Mode discovery, `validate.sh --strict` on this packet |

### Overview
Build the `mcp-figma` skill from the phase 001 research ground-truth, modeled on the sibling terminal-control skills. The skill carries the install direction (the full repo build of figma-ds-cli over the minimal npm publish), the connect direction (safe by default, yolo gated with rollback), the read and author directions, the export and extract directions, and the optional Code Mode MCP path, all under a read-only, mutating, and destructive gating policy. This plan records the approach that shipped into the skill.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The phase 001 CLI surface, MCP landscape, and install path are documented
- [x] The sibling terminal-control package shape is available as the structural model
- [x] The gating policy (read-only, mutating, destructive) is fixed

### Definition of Done
- [x] The skill package is complete with SKILL.md, references, scripts, catalog, playbook, README, INSTALL_GUIDE, changelog
- [x] Every mutating command is gated and every destructive command is kept off the default path
- [x] `package_skill.py --check` PASS, figma-ds-cli 1.2.0 installed, the Code Mode `figma` manual discovered
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Model-on-sibling skill build. The sibling terminal-control skills (`mcp-open-design`, `mcp-chrome-devtools`, `mcp-magicpath`) are the structural template, and the phase 001 research is the source of truth for the figma-cli surface and the install path.

### Key Components
- **SKILL.md**: the runtime contract. Carries the install, connect, read, author, and export directions, the naming and version traps, and the gating rules.
- **references/**: `figma_cli_reference.md` (the command surface and daemon model), `tool_surface.md` (the read-only, mutating, destructive tiers), `mcp_wiring.md` (the optional Code Mode `figma` MCP), `troubleshooting.md` (failure paths).
- **scripts/**: eight bash scripts for install, safe and yolo connect, daemon, doctor, unpatch, UTCP snippets, and shared helpers.
- **feature_catalog/ and manual_testing_playbook/**: the capability inventory and the operator scenarios.

### Data Flow
Phase 001 research to SKILL.md and references to scripts to feature catalog and playbook to README and INSTALL_GUIDE and changelog to graph-metadata, then live install and validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The only writes were to the new `mcp-figma` skill, the sibling skills' reciprocal edges, and (in this packet) its control docs. No application code was touched.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-figma/SKILL.md` | Runtime contract | Created at v0.1.0 | package check PASS |
| `.opencode/skills/mcp-figma/references/` | CLI, tools, MCP, troubleshooting detail | Created | package check PASS |
| `.opencode/skills/mcp-figma/scripts/` | Install and safety scripts | Created (8 scripts) | install run live |
| `.opencode/skills/mcp-figma/feature_catalog/` | Capability inventory | Created | package check PASS |
| `.opencode/skills/mcp-figma/manual_testing_playbook/` | Operator scenarios | Created | package check PASS |
| `.opencode/skills/mcp-figma/changelog/` | Version history | v0.1.0.0 added | file present |
| Sibling skills' `graph-metadata.json` | Sibling skills | Reciprocal edges added | skill graph valid |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the phase 001 research ground-truth (CLI surface, MCP landscape, install path)
- [x] Read the sibling terminal-control skills as the structural model
- [x] Fix the read-only, mutating, and destructive gating policy

### Phase 2: Core Implementation
- [x] Author SKILL.md with the install, connect, read, author, and export directions and the traps
- [x] Author the four references (figma_cli_reference, tool_surface, mcp_wiring, troubleshooting)
- [x] Author the eight install and safety scripts
- [x] Author the feature catalog, the manual testing playbook, the README, the INSTALL_GUIDE, the v0.1.0.0 changelog, and graph-metadata

### Phase 3: Verification
- [x] `package_skill.py --check` PASS
- [x] Register the skill graph and add the reciprocal sibling edges
- [x] Live-install figma-ds-cli 1.2.0 from the repo build and confirm the Code Mode `figma` manual
- [x] `validate.sh --strict` on this packet reports zero errors
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Skill structure | The whole skill package | `package_skill.py --check` |
| Policy review | Every command classified read-only, mutating, or destructive | manual review of tool_surface.md |
| Live install | The full repo build of figma-ds-cli | `install.sh`, `figma-ds-cli --version` |
| MCP discovery | The Code Mode `figma` manual tool names | Code Mode tool listing |
| Spec validation | This packet's docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 research ground-truth | Input | Green | Without it the skill has no source of truth for the CLI surface |
| The sibling terminal-control skills | Internal | Green | No structural model to follow |
| The silships figma-cli repo build | External | Green | No full command surface to install |
| The Code Mode `figma` manual | Internal | Green | No optional MCP path to document |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The skill is found inaccurate or fails its structure check and cannot be fixed.
- **Procedure**: Revert the skill files at `.opencode/skills/mcp-figma/` and the reciprocal sibling edges. The change is a new documentation-and-scripts skill, so there is no runtime or data state to unwind. A live yolo patch, if present, is reverted with `unpatch.sh`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 research | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Read the research and the model skills |
| Implementation | Medium | Author the full skill package and eight scripts |
| Verification | Medium | Package check, live install, MCP discovery, strict validate |
| **Total** | Medium | One focused session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes, so no backup needed (verified) docs-and-scripts skill
- [x] No feature flag involved (verified) skill markdown has no runtime gate
- [x] The skill is additive (verified) a new skill, no existing surface removed

### Rollback Procedure
1. Revert the skill files at `.opencode/skills/mcp-figma/`.
2. Re-run `package_skill.py --check` on any sibling skill to confirm the registry is valid.
3. Confirm the reciprocal sibling edges reverted with it.
4. If a yolo patch is in place on the local Figma install, run `unpatch.sh`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change is documentation and scripts only
<!-- /ANCHOR:enhanced-rollback -->
