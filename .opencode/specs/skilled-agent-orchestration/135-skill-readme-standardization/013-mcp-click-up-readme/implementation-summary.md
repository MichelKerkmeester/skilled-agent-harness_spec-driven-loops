---
title: "Implementation Summary: mcp-click-up README"
description: "The mcp-click-up README now reads in the narrative voice and leads with the dual-path ClickUp orchestrator (cupt CLI and official MCP), with the broken MCP integration facts corrected to their authoritative forms."
trigger_phrases:
  - "mcp-click-up readme shipped"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/013-mcp-click-up-readme"
    last_updated_at: "2026-06-07T12:50:50Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped mcp-click-up README; Batch C 2 of 3"
    next_safe_action: "Begin phase 014 (mcp-code-mode README)"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-click-up/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 7 cited paths resolve; anti-drift scan confirmed zero wrong-form MCP leaks (clickup.clickup_ naming, array call_tool_chain, opencode.json/clickup key); softened one pinned tool count"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-mcp-click-up-readme |
| **Completed** | 2026-06-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The mcp-click-up README now opens with a human pitch and an at-a-glance table, explains the risky-ClickUp-from-an-agent problem before the mechanism, and leads with the distinctive value: a dual-path orchestrator that routes daily task ops to a fast cupt CLI (with a dry-run safety net) and reserves the official ClickUp MCP for documents, goals and bulk work, plus agent safety invariants that force a status check and a dry-run before any completion.

### Narrative rewrite

HOW IT WORKS covers the operation router, the cupt path, the official MCP path, the safety invariants and the two example workflows. QUICK START shows the cupt install plus a `cupt list`/`cupt done --dry-run` sequence and an array-form `call_tool_chain([...])` MCP example. The table of contents and Version History section are gone. It is 233 lines and HVR-clean in prose.

### Broken MCP facts corrected

The old README told readers to register the server in `.utcp_config.json` with key `clickup_official` and call tools as `clickup_official.clickup_official_{tool}` through a `call_tool_chain({ code })` form. Every authoritative file disagrees, so the rewrite uses the correct forms: the platform MCP config (`opencode.json` and peers) with server key `clickup`, the `clickup.clickup_{tool_name}` naming and the array `call_tool_chain([{ tool, input }])` pattern. The version line, the Version History section and the contested counts are dropped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-click-up/README.md` | Modified | Narrative-voice rewrite with corrected MCP integration facts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A two-iteration deep-context sweep ran DeepSeek v4 Pro and MiMo v2.5 Pro as read-only seats. Both independently found that the README's MCP integration was wrong and agreed on the authoritative forms from SKILL.md, INSTALL_GUIDE, install.sh and mcp_tools.md. The host pinned the correct forms in the context report and forbade each wrong form in the authoring prompt. DeepSeek's draft was the stronger base. The host scanned it and confirmed zero wrong-form leaks (no `clickup_official`, no `.utcp_config.json`, no `{ code }` call), verified all 7 cited paths resolve, and softened one pinned tool count before publishing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Correct the MCP facts to the SKILL.md forms | The README was actively wrong; readers following it would fail |
| Lead with operation routing and the dry-run invariant | That is the skill's distinctive value and its main safety property |
| Drop the version line, Version History and counts | The template carries none, and the counts were contested across docs |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type readme` | PASS, 0 issues |
| HVR prose scan (em dash, semicolon, Oxford-comma list, code blocks excluded) | PASS, clean |
| Anti-drift scan (clickup_official, .utcp_config, `{ code }` call, version) | PASS, zero leaks |
| All 7 cited paths resolve | PASS |
| `validate.sh --strict` on the phase | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One source file still uses the wrong server key.** `mcp-servers/clickup-mcp/README.md` uses `clickup_official` as the server key, conflicting with SKILL.md and INSTALL_GUIDE. The skill README now follows the authoritative `clickup` key, but reconciling that vendored sub-readme is out of scope for a docs-only README phase; note it for a later packet.
<!-- /ANCHOR:limitations -->
