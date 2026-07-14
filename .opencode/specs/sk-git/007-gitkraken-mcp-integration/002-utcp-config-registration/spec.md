---
title: "Feature Specification: Phase 2: utcp-config-registration"
description: "Register the GitKraken MCP server as a new stdio manual_call_template in .utcp_config.json, following the repo's existing npx -y <pkg> convention used by every other manual."
trigger_phrases:
  - "gitkraken utcp config"
  - "gitkraken manual call template"
  - "phase 002 utcp-config-registration"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/007-gitkraken-mcp-integration/002-utcp-config-registration"
    last_updated_at: "2026-07-14T20:48:58Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase spec ahead of implementation"
    next_safe_action: "Add the gitkraken manual_call_template entry to .utcp_config.json"
    blockers: []
    key_files:
      - ".utcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-utcp-config-registration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Config shape resolved in phase 001 REQ-003: npx -y @gitkraken/gk mcp, stdio, no env vars required"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: utcp-config-registration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-research-and-context |
| **Successor** | 003-sk-git-integration-doc-and-router |
| **Handoff Criteria** | `.utcp_config.json` parses as valid JSON and the `gitkraken` manual entry matches the repo's stdio convention |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Code Mode has no path to the GitKraken MCP server: `.utcp_config.json` has no `gitkraken` entry, so `call_tool_chain` cannot reach it regardless of what sk-git documents.

### Purpose
Register the server as a new `manual_call_template`, using the config shape phase 001 resolved, so phase 003's usage examples reference a real, live-registered manual.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Adding one `gitkraken` object to `.utcp_config.json`'s `manual_call_templates` array.

### Out of Scope
- Any sk-git or advisor file — out of this phase's boundary, covered by phases 003-004.
- Live `npx @gitkraken/gk mcp` handshake testing — deferred to phase 005.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.utcp_config.json` | Modify | Add the `gitkraken` manual, alphabetically placed between `github` and `open_design` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### REQ-001: Add the `gitkraken` manual_call_template
```json
{
  "name": "gitkraken",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "gitkraken": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@gitkraken/gk", "mcp"],
        "env": {}
      }
    }
  }
}
```

### REQ-002: Preserve JSON validity
The file must remain valid JSON after the edit (`python3 -c "import json; json.load(open('.utcp_config.json'))"` exits 0). No other existing entries change.

### REQ-003: No env vars required
Unlike `github` (`GITHUB_PERSONAL_ACCESS_TOKEN`) or `figma` (`FIGMA_API_KEY`), GitKraken's auth is handled by the CLI's own `gk auth login` flow against the local machine's GitKraken account state — confirmed by phase 001's `gk whoami` probe succeeding with no env vars set. `env: {}` is correct and matches `chrome_devtools_1/2` and `refero`, which also need none.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.utcp_config.json` parses as valid JSON with the `gitkraken` manual present in the exact resolved stdio shape.
- **SC-002**: No other existing manual entry changes — the diff is additive-only.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001's resolved config shape | Without it, an incorrect shape (e.g. the locally-installed-binary form) could be registered | Phase 001 REQ-003 already resolved and cited directly |
| Risk | JSON syntax error breaks Code Mode for ALL manuals, not just `gitkraken` | Every registered tool (github, figma, clickup, chrome-devtools, etc.) becomes unreachable | Validate JSON parses immediately after the edit, before moving to phase 003 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None outstanding.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:testing -->
## 8. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| JSON validity | `.utcp_config.json` | `python3 -c "import json; json.load(open('.utcp_config.json'))"` |
| Structural diff | New entry only | `git diff .utcp_config.json` reviewed for scope |
<!-- /ANCHOR:testing -->

---

## RELATED DOCUMENTS

- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor**: See `../001-research-and-context/spec.md`
