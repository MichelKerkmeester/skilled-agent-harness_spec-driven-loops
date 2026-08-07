---
title: "Implementation Summary: Codex contract pin"
description: "The live Codex 0.144.1 contract is pinned for safe revival work."
trigger_phrases: ["Codex contract summary"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/001-codex-contract-pin"
    last_updated_at: "2026-07-13T05:37:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed live contract verification"
    next_safe_action: "Use this evidence in phases 002-005"
    blockers: []
    key_files: ["spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "134-001", parent_session_id: "134-wave1" }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|---|---|
| **Spec Folder** | 001-codex-contract-pin |
| **Completed** | 2026-07-13 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## What Was Built
The revival now has a current contract: Codex resolves at `/opt/homebrew/bin/codex`, reports `codex-cli 0.144.1`, exposes stable native hooks, and uses `CODEX_PROJECT_DIR` in the historical project hook bridge. Existing runtime-neutral hook cores remain the implementation authority; Codex adapters do not yet exist.
<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## How It Was Delivered
Live CLI output was reconciled with the supplied pin document and current source tree.
<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## Key Decisions
| Decision | Why |
|---|---|
| Target native `hooks`, not `plugin_hooks` | The former is stable/true; the latter is removed/false. |
| Require `command -v codex` | Missing binaries previously created unusable advertised routes. |
<!-- /ANCHOR:decisions -->
<!-- ANCHOR:verification -->
## Verification
| Check | Result |
|---|---|
| `codex --version` | PASS: `codex-cli 0.144.1` |
| `codex features list` | PASS: `hooks stable true`; `plugin_hooks removed false` |
| Hook source inspection | PASS: neutral cores present; no `hooks/codex/` adapters |
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## Known Limitations
1. Exact 0.144.1 hook event names, matchers, payloads, trust flow, and stdout response contract remain phase-004 work.
<!-- /ANCHOR:limitations -->
