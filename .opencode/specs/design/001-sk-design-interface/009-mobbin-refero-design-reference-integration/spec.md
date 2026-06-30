---
title: "Feature Specification: Mobbin and Refero design-reference integration"
description: "sk-design-interface could name the default to deviate from only from a design system (mcp-open-design) or its built-in AI-default calibration, with no live window onto the real-world shipped-UI median. This phase wires the Mobbin and Refero reference MCPs into Code Mode and integrates them into the skill as a critique-against reference, under strict no-chooser, read-live, never-copy rules."
trigger_phrases:
  - "mobbin refero design reference integration"
  - "real world ui reference mcp wiring"
  - "sk-design-interface mobbin refero"
  - "design references code mode"
  - "critique against real world default"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/009-mobbin-refero-design-reference-integration"
    last_updated_at: "2026-06-15T11:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Wired Mobbin/Refero into Code Mode and integrated them into sk-design-interface"
    next_safe_action: "User OAuth plus Code Mode reload, then verify the tools resolve"
    blockers: []
    key_files:
      - ".utcp_config.json"
      - ".opencode/skills/sk-design-interface/references/design_references_mcp.md"
      - ".opencode/skills/sk-design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-009-mobbin-refero-design-reference-integration"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Both MCPs wire via the mcp-remote stdio bridge; the user has both paid subscriptions and OAuths live"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Mobbin and Refero design-reference integration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-doc-realignment |
| **Successor** | None |
| **Handoff Criteria** | Both manuals valid in Code Mode; the skill encodes the critique-against rules and passes `package_skill --check`; no third-party content copied into the repo |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the 143-sk-design-interface packet. The earlier phases built the skill, de-vendored it from `ui-ux-pro-max`, and added the Claude Design parity loop and variation-diversity. This phase adds a real-world shipped-UI reference path so the skill can name the real-world default for a category and deviate from it deliberately.

**Scope Boundary**: Wire two reference MCPs into Code Mode and integrate them into the skill as a critique-against reference. No generation, no caching, no copied content.

**Dependencies**:
- Code Mode (UTCP) for the MCP transport, plus the `mcp-remote` stdio bridge for the remote OAuth endpoints.
- The user's own paid Mobbin and Refero subscriptions and a browser OAuth.

**Deliverables**:
- Two `mcp` manuals (`mobbin`, `refero`) in `.utcp_config.json`.
- A new `references/design_references_mcp.md` and the matching SKILL.md and `design_inventory.md` integration.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-design-interface resists templated defaults, but its only concrete window onto a "default" was a design system read via `mcp-open-design` or its built-in calibration of the AI-default looks. It had no live view of the real-world shipped-UI median, which is its own gravity well. Two paid reference libraries (Mobbin and Refero) hold hundreds of thousands of real screens and flows, but they were not reachable from the terminal or wired into the skill.

### Purpose
Wire Mobbin and Refero into Code Mode and integrate them into sk-design-interface as a critique-against reference, so the skill can name the real-world default for a category and deviate from it deliberately, without ever becoming a chooser or a trend-copier.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Two `call_template_type: "mcp"` manuals in `.utcp_config.json` (`mobbin`, `refero`) via the `mcp-remote` stdio bridge.
- A new `references/design_references_mcp.md` encoding the critique-against use and the hard rules.
- SKILL.md integration (ON_DEMAND row, references entry, Related Skills bullet, reference-loading note) plus a `design_inventory.md` cross-pointer.

### Out of Scope
- Installing Refero's own `refero_skill` - the user asked for sk-design-interface integration, not a separate skill.
- Live tool-resolution verification - it needs the user's browser OAuth and a Code Mode reload (stdio manuals load at startup).
- Any reuse-ground or generation path from these references - they are third-party records, read-only and never copied.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.utcp_config.json` | Modify | Add `mobbin` + `refero` mcp-remote stdio manuals |
| `.opencode/skills/sk-design-interface/references/design_references_mcp.md` | Create | The critique-against reference doc and hard rules |
| `.opencode/skills/sk-design-interface/references/{mobbin_tools.md, refero_tools.md}` | Create | Per-MCP tool catalogs (tools, call convention, result shapes), modeled on a dedicated MCP skill's tooling reference |
| `.opencode/skills/sk-design-interface/SKILL.md` | Modify | ON_DEMAND row, references entry, Related Skills bullet, loading note |
| `.opencode/skills/sk-design-interface/references/design_inventory.md` | Modify | Cross-pointer to the new reference path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Wire both MCPs into Code Mode | `.utcp_config.json` parses; `mobbin` and `refero` are valid `mcp` manuals using `npx -y mcp-remote <url>` |
| REQ-002 | Integrate as a critique-against reference | `design_references_mcp.md` exists; SKILL.md routes to it; `package_skill --check` passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Encode the guardrails | The reference encodes one-reference-not-a-chooser, read-live-never-cache, inform-not-copy-the-trend, grounding-upstream, and quality-floor-holds |
| REQ-004 | Mirror the existing integration pattern | The SKILL.md additions match the `mcp-open-design` / `mcp-figma` style; SKILL.md stays under the word cap; no em dashes |
| REQ-005 | Stay Apache-2.0 clean | No Mobbin or Refero screens or content copied into the repo; links and tool references only |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both manuals are present and valid in `.utcp_config.json`, and the endpoints answer an auth challenge (they exist and require OAuth).
- **SC-002**: sk-design-interface passes `package_skill --check` and routes a design task to the new reference as a critique-against source, never a chooser.

### Acceptance Scenarios

- **Given** the wired config, **When** parsed, **Then** `mobbin` and `refero` are valid `mcp-remote` stdio manuals.
- **Given** the two endpoints, **When** probed, **Then** both return an auth challenge, confirming they exist and need OAuth.
- **Given** a brief in a crowded category, **When** the skill consults a reference, **Then** it resolves exactly one reference and names the default to deviate from, not a gallery to pick.
- **Given** the refined skill, **When** `package_skill --check` runs, **Then** it passes and the self-checks hold.
- **Given** the integration, **When** inspected, **Then** no Mobbin or Refero content is copied into the repo.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Code Mode startup load | New stdio manuals are not live until a Code Mode reload | Honest Review status; verify after the user's reload |
| Dependency | User OAuth (paid subscriptions) | Tools do not resolve until the user authorizes | mcp-remote opens the browser flow on first connect; user has both subscriptions |
| Risk | Refero uses a static Bearer rather than OAuth | mcp-remote may need an explicit header | Fallback: add `--header "Authorization: Bearer ${REFERO_TOKEN}"` and a `.env` entry |
| Risk | Treating a reference as inspiration to copy | Defeats the anti-default mandate | Hard rules forbid copying and chooser flows; grounding stays upstream |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The wiring approach (mcp-remote bridge), the skill-integration target, and the user OAuth were all resolved with the user.
<!-- /ANCHOR:questions -->
