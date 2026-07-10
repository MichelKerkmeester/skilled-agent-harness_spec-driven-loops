---
title: "Implementation Summary: Phase 1: CLI Core [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/implementation-summary]"
description: "Planned-stub summary for Phase 1 CLI Core. Nothing implemented yet."
trigger_phrases:
  - "code-index cli core result"
  - "002 001-cli-core result"
  - "code-index phase 1 result"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core"
    last_updated_at: "2026-06-09T20:10:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Code-index CLI core shipped and docs reconciled"
    next_safe_action: "Continue later-phase end-to-end verification work"
    blockers: []
    key_files:
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-cli-core |
| **Completed** | 2026-06-09 - shipped |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The code-index CLI core shipped as a manifest-backed CLI over the existing daemon contract. The shipped entrypoints are `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts`, `.opencode/skills/system-code-graph/mcp_server/code-index-cli-manifest.ts`, and shim `.opencode/bin/code-index.cjs`. The CLI exposes exactly 8 commands from `CODE_GRAPH_TOOL_SCHEMAS`, validates argv through `validateToolArgs()` parity, preserves blocked-read payloads in JSON and text output, maps exits to 0/1/64/69/75, supports IPC auto-spawn, and guards stale dist output with the `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE` override.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` | Added | CLI dispatcher, argument validation, output rendering, exit taxonomy, and IPC auto-spawn |
| `.opencode/skills/system-code-graph/mcp_server/code-index-cli-manifest.ts` | Added | Manifest-backed command registry generated from `CODE_GRAPH_TOOL_SCHEMAS` |
| `.opencode/bin/code-index.cjs` | Added | Stable shim with dist-freshness guard and development stale-dist override |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as a CLI-only layer over the existing code-index daemon and launcher contracts. No daemon or launcher files changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope inherited verbatim from the research record + program pairing rule | The research terminally classified the risks; the pairing rule is operator-directed program scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Clean build | TypeScript 5.9.3 build passed cleanly |
| Manifest parity | `list-tools` enumerated exactly 8 commands matching `CODE_GRAPH_TOOL_SCHEMAS` |
| Daemon smoke | Isolated `code_graph_status` passed, including IPC auto-spawn |
| Argument validation | Bad enum, unknown key, and missing required argument rejected with exit 64 |
| Output and exits | Blocked-read rendering preserved in JSON and text; exit taxonomy 0/1/64/69/75 verified |
| Dist freshness | Stale dist exited 69; `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE` override verified |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Later program phases still own broader end-to-end transition verification; this phase did not change daemon or launcher files.
<!-- /ANCHOR:limitations -->
