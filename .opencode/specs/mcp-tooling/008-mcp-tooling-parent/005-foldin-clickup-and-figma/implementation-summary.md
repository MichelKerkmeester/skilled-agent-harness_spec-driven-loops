---
title: "Implementation Summary: Phase 5: foldin-clickup-and-figma"
description: "The mcp-click-up workflow packet and the mcp-figma transport packet are relocated under the mcp-tooling hub, transport posture preserved."
trigger_phrases:
  - "clickup figma fold-in summary"
  - "phase 005 implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-tooling-parent/005-foldin-clickup-and-figma"
    last_updated_at: "2026-07-10T07:20:00Z"
    last_updated_by: "claude"
    recent_action: "Documented the executed clickup and figma moves"
    next_safe_action: "No further action required"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-click-up/SKILL.md"
      - ".opencode/skills/mcp-tooling/mcp-figma/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-foldin-clickup-and-figma"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "figma moves as the transport packet keeping its no-Write/Edit surface, version 1.0.0.0, and sk-design pairing"
      - "click-up moves as a workflow packet keeping version 1.0.0.0 and its changelog"
---
# Implementation Summary: Phase 5: foldin-clickup-and-figma

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-foldin-clickup-and-figma |
| **Completed** | 2026-07-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The hub now carries its second workflow packet and its transport packet: `mcp-click-up` and `mcp-figma` both resolve under `.opencode/skills/mcp-tooling/`, with figma's read-only transport posture and cross-hub `sk-design` pairing preserved byte-for-byte.

### Click-Up and Figma Fold-In

Both trees relocated with `git mv` — 153 rename entries for click-up, 39 for figma — so git recorded renames rather than delete-plus-add pairs. Every internal self-path was rewritten to the nested hub location, verified by a zero-hit grep sweep. Figma's `allowed-tools` still grant no `Write`/`Edit` and `mutatesWorkspace: false`; its mandatory `sk-design` cross-hub pairing survived in `mode-registry.json`'s `transport-axis` extension. Both packets kept their own `version: 1.0.0.0` and single-entry changelog. The pre-existing click-up OAuth-vs-`@clickup/mcp-server` config/doc drift was left untouched and stays tracked as a deferred follow-up, not fixed by this move.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-click-up/*` (153 tracked files) | Moved | `git mv` to `.opencode/skills/mcp-tooling/mcp-click-up/*` |
| `.opencode/skills/mcp-figma/*` (39 tracked files) | Moved | `git mv` to `.opencode/skills/mcp-tooling/mcp-figma/*` |
| `mcp-tooling/mcp-click-up/**`, `mcp-tooling/mcp-figma/**` | Modified | Internal self-paths rewritten to the nested locations |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two single-tree `git mv` relocations plus a self-path rewrite pass, verified by a repo-scoped grep sweep, a `git status` rename check, and a before/after diff of figma's `allowed-tools`. No external referrer, advisor graph file, or `mcp-code-mode` file was touched in this phase — that sweep is scoped to phase 006.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move click-up and figma together, after chrome-devtools | The move procedure was already proven on the smallest tree; this batch clears the second workflow packet and the transport packet in one phase |
| Leave the click-up OAuth-vs-`@clickup/mcp-server` drift untouched | Pre-existing, unrelated to the fold-in; fixing it here would blur this phase's scope boundary |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Coverage |
|-------|--------|----------|
| `git status --short` rename count | PASS | 153 click-up + 39 figma entries, all `R`/`RM` |
| `rg` for old flat self-paths inside both moved trees | PASS | zero live hits |
| figma `allowed-tools` before/after diff | PASS | no `Write`/`Edit`, `mutatesWorkspace: false` unchanged |
| Both packets' `version` and `changelog/` | PASS | both `1.0.0.0`, changelogs intact |
| Checklist | PASS | 17/17 items verified (8 P0, 8 P1, 1 P2) |
| `validate.sh 005-foldin-clickup-and-figma --strict` | PASS | Errors: 0, Warnings: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Click-up OAuth-vs-API-key config drift** — `SKILL.md` documents OAuth 2.1 + PKCE via `mcp-remote`, while `.utcp_config.json` registers `clickup_official` via `@clickup/mcp-server`. Pre-existing, not caused by this move; tracked as a deferred follow-up and re-confirmed still-deferred in phase 008.
<!-- /ANCHOR:limitations -->
