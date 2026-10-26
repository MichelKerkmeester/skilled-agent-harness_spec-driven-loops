---
title: "Feature Specification: Figma hosted server from CLI children"
description: "mcp-figma documents only the Code Mode path, so a harness that drives a headless Claude Code or Codex child against Figma's hosted MCP server has to rediscover the login reuse, the Codex app route and the approval setting each time."
trigger_phrases:
  - "figma hosted from cli children"
  - "figma hosted server from cli children"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Figma hosted server from CLI children

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-26 |
| **Branch** | `main` (no branch created) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`mcp-figma` documents the Code Mode path and calls the hosted server out of scope for it. A harness that drives a headless Claude Code or Codex child against Figma's hosted MCP server found on 2026-10-26 that each runtime needs one non-obvious setting, and nothing in the skills library recorded any of them.

### Purpose
The next harness reads, in one place, how each runtime's child reaches the hosted server and what stops it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a subsection to `mcp-wiring.md` Section 6 on reaching the hosted server natively from a Claude Code or Codex child
- Release the note as `mcp-figma` v1.1.6.0 with its changelog

### Out of Scope
- The Code Mode path, which this change leaves as it was
- `cli-codex` and `cli-claude-code`, which the operator chose not to change in this packet

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-tooling/mcp-figma/references/mcp-wiring.md` | Modify | New Section 6 subsection, version 1.0.2.0 |
| `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md` | Modify | Version 1.1.6.0 |
| `.skilled/skills/mcp-tooling/mcp-figma/changelog/v1.1.6.0.md` | Create | The release note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The subsection states only what a live run confirmed | Each bullet matches a probe or run recorded in `implementation-summary.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The packet version and its newest changelog agree | `SKILL.md` and `changelog/v1.1.6.0.md` both read `1.1.6.0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py` passes on the changed reference and the changelog
- **SC-002**: `validate.sh --strict` prints `RESULT: PASSED` on this folder
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Codex app config keys and Claude Code flags | A later CLI release renames them | The subsection names the two versions it was checked on |
| Risk | The Figma app on the ChatGPT account is per account | Low | The subsection also names the `[mcp_servers]` route and its login |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
