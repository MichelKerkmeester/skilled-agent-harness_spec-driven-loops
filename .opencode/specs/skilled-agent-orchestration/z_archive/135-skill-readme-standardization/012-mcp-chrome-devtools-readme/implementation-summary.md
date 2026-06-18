---
title: "Implementation Summary: mcp-chrome-devtools README"
description: "The mcp-chrome-devtools README now reads in the narrative voice and leads with the dual-path browser orchestrator (bdg CLI and Code Mode MCP), with heavy internal drift resolved to authoritative values."
trigger_phrases:
  - "mcp-chrome-devtools readme shipped"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/012-mcp-chrome-devtools-readme"
    last_updated_at: "2026-06-07T12:35:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped mcp-chrome-devtools README; Batch C started"
    next_safe_action: "Begin phase 013 (mcp-click-up README)"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-chrome-devtools/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 7 cited paths resolve; anti-drift scan confirmed zero leaks (no version line, no 300+/644, no bdg shorthand, no @0.26.0, no Node 14)"
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
| **Spec Folder** | 012-mcp-chrome-devtools-readme |
| **Completed** | 2026-06-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The mcp-chrome-devtools README now opens with a human pitch and an at-a-glance table, explains the browser-from-an-agent problem before the mechanism, and leads with the distinctive value: a dual-path orchestrator that drives a real browser through a fast token-efficient CLI (`bdg`, self-documenting, full CDP surface) for the common case and a Code Mode MCP path for parallel isolated sessions and multi-tool chaining, with a routing rule between them.

### Narrative rewrite

HOW IT WORKS covers the routing rule, the CLI path (self-documenting CDP discovery), the MCP path (isolated instances for parallelism), and the three example workflows (performance baseline, animation testing, multi-viewport). QUICK START shows the CLI install plus a bdg command and a `call_tool_chain()` MCP example. The old table of contents is gone. It is 208 lines and HVR-clean in prose.

### Drift resolved

The old README carried heavy internal drift against SKILL.md and the INSTALL_GUIDE. The rewrite drops every drifted value: no version line (the docs said 1.0.7.0, 1.0.8.0 and 2.1.0), no contested CDP count (300+ versus 644 became "the full CDP surface"), no MCP tool count (7, 12 and 26 became capability categories), `chrome-devtools-mcp@latest` rather than the pinned `@0.26.0`, Node 18+ rather than the stale 14.x+, and the SKILL.md bdg command forms (`bdg dom screenshot`, `bdg console --list`, `bdg cdp --list`) rather than the INSTALL_GUIDE shorthand.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-chrome-devtools/README.md` | Modified | Narrative-voice rewrite of the dual-path orchestrator README |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A two-iteration deep-context sweep ran DeepSeek v4 Pro and MiMo v2.5 Pro as read-only seats. Both surfaced the same internal drift and agreed that SKILL.md is the command authority. The host resolved each drifted fact to its authoritative value in the context report and forbade each one explicitly in the authoring prompt. DeepSeek's draft was the stronger base. The host scanned the draft and confirmed zero drift leaks (no version, no 300+/644, no bdg shorthand, no `@0.26.0`, no Node 14), verified all 7 cited paths resolve, and fixed one prose semicolon before publishing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lead with the two paths and the routing rule | That is the skill's distinctive value over a single browser tool |
| Drop all version lines and contested counts | Three documents disagreed on version and on two counts |
| Use the SKILL.md bdg command forms | SKILL.md is the runtime authority; the INSTALL_GUIDE shorthand is the drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type readme` | PASS, 0 issues |
| HVR prose scan (em dash, semicolon, Oxford-comma list, code blocks excluded) | PASS, clean |
| Anti-drift scan (version, 300+/644, bdg shorthand, @0.26.0, Node 14) | PASS, zero leaks |
| All 7 cited paths resolve | PASS |
| `validate.sh --strict` on the phase | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The SKILL.md-versus-INSTALL_GUIDE drift is unresolved at the source.** The README now follows the SKILL.md authority, but the INSTALL_GUIDE still uses the bdg shorthand, the 644 count and the 2.1.0 version. Reconciling those source files is out of scope for a docs-only README phase; note it for a later packet.
<!-- /ANCHOR:limitations -->
