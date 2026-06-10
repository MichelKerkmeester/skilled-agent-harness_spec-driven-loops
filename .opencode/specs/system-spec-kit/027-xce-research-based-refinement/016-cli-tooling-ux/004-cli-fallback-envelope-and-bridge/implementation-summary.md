---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Planned scaffold for normalized warm-fallback envelopes across the three hook helpers and a spec-memory bridge allowlist; no implementation done yet."
trigger_phrases:
  - "004-cli-fallback-envelope-and-bridge summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/004-cli-fallback-envelope-and-bridge"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded planned-state impl doc; no code written yet"
    next_safe_action: "Implement the envelope normalization and bridge allowlist"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-004-cli-fallback-envelope-and-bridge"
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
| **Spec Folder** | 004-cli-fallback-envelope-and-bridge |
| **Completed** | Not yet (planned) |
| **Level** | 1 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This sub-phase is scaffold-only and planned. The list below is the intended outcome and the planned target files, not a record of shipped code.

Planned deliverables and their target files:

- A normalized warm-fallback envelope + reason codes (`skipped`, `fail_open`, `exitCode`, retryability) emitted by `mcp_server/hooks/spec-memory-cli-fallback.ts` (`:148-220`), `mcp_server/hooks/code-index-cli-fallback.ts` (`:151-220`), and `system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` (`:158-187`).
- A prompt-time allowlist on `mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs` (`:206-230`), mirroring the code-index denylist at `mk-code-graph-bridge.mjs:18-25` and `:272-282`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. When implemented, the normalized envelope will be defined once and emitted additively by all three helpers so existing consumer fields stay intact, and the spec-memory bridge will gate direct `toolName` calls through an explicit allowlist matching the plugin-called tools.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep envelope changes additive | Assessment #8 guardrail: hook consumers may depend on current shapes |
| Use an allowlist (not a denylist) on the spec-memory bridge | The bridge only legitimately calls `brief/status`; an allowlist is the tighter default-deny posture |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Envelope contract test asserts one shape across all three helpers | Pending |
| Existing consumer fields remain present (additive-only) | Pending |
| Spec-memory bridge rejects out-of-allowlist toolName | Pending |

Planned verification commands (run when implemented): envelope/reason-code contract test green via `npm --prefix .opencode/skills/system-spec-kit/mcp_server test`; bridge allowlist-rejection asserted with a `vitest` case proving an out-of-allowlist `toolName` is refused.
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
