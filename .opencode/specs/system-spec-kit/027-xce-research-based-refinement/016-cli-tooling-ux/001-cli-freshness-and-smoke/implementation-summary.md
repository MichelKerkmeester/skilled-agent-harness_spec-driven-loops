---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Planned scaffold for the CLI freshness gate fix and offline smoke check; no implementation done yet."
trigger_phrases:
  - "001-cli-freshness-and-smoke summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/001-cli-freshness-and-smoke"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded planned-state impl doc; no code written yet"
    next_safe_action: "Implement the freshness gate fix and offline smoke check"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-001-cli-freshness-and-smoke"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 001-cli-freshness-and-smoke |
| **Completed** | Not yet (planned) |
| **Level** | 1 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This sub-phase is scaffold-only and planned. The list below is the intended outcome and the planned target files, not a record of shipped code.

Planned deliverables and their target files:

- A durable content-hash freshness gate in `.opencode/bin/spec-memory.cjs` (current mtime gate at `:24-42`), replacing the gate that trips on mtime-only bumps.
- An actionable stale-dist state in the plugin bridge `mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs` (current redaction at `:266-280`), keeping stderr sanitized.
- A unified offline smoke command/script (new) verifying the 37/8/9 list-tools counts and stale-dist health with no daemon, build, or scan, reusing the parity scenario at `manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md:32-56`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. When implemented, the freshness gate will compare a content hash of watched sources against dist (or the build will always touch dist so the existing mtime gate stays valid), the plugin bridge will classify stale-dist into a diagnosable state while preserving the sanitized stderr marker, and the offline smoke script will run the three CLIs' offline `list-tools` enumerations and assert the expected counts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate on content hash rather than removing the freshness gate | Removing the gate would mask a genuinely stale dist; a content hash keeps the safety while fixing the false-positive |
| Keep stderr sanitized when surfacing stale-dist status | Assessment #10 guardrail: surface a classified state plus a sanitized marker, never raw stderr |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reproduce mtime-only stale-`69` | Pending |
| Plain rebuild restores freshness | Pending |
| Offline smoke reports 37/8/9 + stale-dist verdict | Pending |
| Plugin status shows actionable stale-dist with sanitized stderr | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. This document is a planned scaffold; all verification rows are pending until the sub-phase is implemented.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
