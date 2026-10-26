---
title: "Implementation Summary"
description: "mcp-figma v1.1.6.0 records how headless Claude Code and Codex children reach Figma's hosted MCP server, from live FigJam runs on 2026-10-26."
trigger_phrases:
  - "figma hosted from cli children implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/025-figma-hosted-from-cli-children"
    last_updated_at: "2026-10-26T09:17:20Z"
    last_updated_by: "generate-context"
    recent_action: "Released the mcp-figma CLI child notes"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".skilled/skills/mcp-tooling/mcp-figma/references/mcp-wiring.md"
      - ".skilled/skills/mcp-tooling/mcp-figma/changelog/v1.1.6.0.md"
    session_dedup:
      fingerprint: "sha256:8b6f7482465a49dde160e25cf5b21e3cc8e3ca22ea067c546f85c046454b55b4"
      session_id: "scaffold-025-figma-hosted-from-cli-children"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.3 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-figma-hosted-from-cli-children |
| **Completed** | 2026-10-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A harness that drives a headless Claude Code or Codex child against Figma's hosted MCP server now has the four settings it needs in one place. Each one cost a failed probe to find on 2026-10-26.

### Figma hosted server from CLI children

You can give a Claude Code child the operator's Figma login through a strict MCP config that names the same server, and keep its temp root inside a seatbelt with `CLAUDE_CODE_TMPDIR`. You can let a Codex child draw through the ChatGPT account's Figma app once one config block pre-approves app tools. And you know to withhold `create_new_file` when a child must stay on one file.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/mcp-tooling/mcp-figma/references/mcp-wiring.md` | Modified | New Section 6 subsection, version 1.0.2.0 |
| `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md` | Modified | Version 1.1.6.0 |
| `.skilled/skills/mcp-tooling/mcp-figma/changelog/v1.1.6.0.md` | Created | Release note |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every bullet comes from a probe or run on 2026-10-26 in the Product Owner FigJam model comparison. A `claude -p` child with a strict MCP config called `whoami` with no login prompt. The same child under the run's seatbelt exited with `EEXIST` until `CLAUDE_CODE_TMPDIR` was set. A `codex exec` child called `figma.use_figma` and got `MCP tool call requires approval, but approval policy is never`, then read the test file's page once `[apps._default]` approved app tools. `codex mcp login figma` timed out with `deadline has elapsed` when the browser step was not completed. Claude Opus 5.5 low called `create_new_file` on three of its first four runs. The edit was made in a scratch clone and pushed from there, so other sessions' work in the shared checkout stayed untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A subsection in `mcp-wiring.md` Section 6, not a new reference | Section 6 already covers the hosted server, and a new leaf would need routing entries for one page |
| Name the CLI versions checked | The flags and config keys are young and may change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` on the reference and the changelog | See the commit's checks |
| `validate.sh --strict` on this folder | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Withholding `create_new_file` on Codex is unproven.** The subsection gives the Claude Code flag only. Codex's per-app tool settings were not tested.
<!-- /ANCHOR:limitations -->

---


