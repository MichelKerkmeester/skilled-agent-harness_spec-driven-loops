---
title: "Implementation Summary: Subprocess env whitelist"
description: "Hardens the three named advisor subprocess spawn surfaces with explicit environment allowlists and tests that parent secrets do not leak."
trigger_phrases:
  - "018 subprocess env follow-on"
  - "subprocess env whitelist"
  - "advisor env hardening"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/023-subprocess-env-whitelist"
    last_updated_at: "2026-05-15T11:00:00Z"
    last_updated_by: "codex"
    recent_action: "Subprocess env whitelist implemented"
    next_safe_action: "Commit scoped changes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `023-subprocess-env-whitelist` |
| **Completed** | 2026-05-15 |
| **Level** | 2 |
| **Status** | Complete |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Hardens the three named advisor subprocess spawn surfaces with explicit environment allowlists and tests that parent secrets do not leak.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Create child env allowlist for npm build and server spawn. |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Modify | Pass allowlisted env to StdioClientTransport. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modify | Pass allowlisted env to the Node native bridge. |
| `Advisor tests` | Modify | Assert secret-like parent env keys are not forwarded. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet started with a source audit against packet 018's deferred item and the current implementation. The fix then touched only the packet-owned source, tests, or parent docs and used focused tests before broader validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep public ids stable | The dispatch forbids tool-id, server-id, and skill-id renames. |
| Use focused tests near the boundary | These items are narrow follow-ons; broad refactors would add risk without closing the named finding faster. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused packet tests | PASS: relevant focused Vitest and syntax checks passed. |
| Full advisor Vitest | PASS: 54 files passed, 371 passed, 4 skipped. |
| Strict validation | PASS: all new packet folders passed strict validation. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The allowlist intentionally does not cover unrelated subprocesses outside the three named item-2 surfaces.
<!-- /ANCHOR:limitations -->
