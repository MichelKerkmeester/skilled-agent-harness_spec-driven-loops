---
title: "Implementation Summary: OpenCode Directive Single-Source"
description: "Completed implementation summary for canonical three-directive composition in the OpenCode bridge and its complete local fallback."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "OpenCode directive single source implementation"
  - "OpenCode directive parity summary"
importance_tier: "high"
contextType: "implementation"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/016-opencode-directive-single-source"
    last_updated_at: "2026-08-09T14:52:52Z"
    last_updated_by: "sol"
    recent_action: "Reconciled OpenCode directive single-source delivery"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge.vitest.ts"
    session_dedup:
      fingerprint: "sha256:c84e6304b8ab3f1d75c96e7a5a7e065b9f1bf095df2c576368e13d5fdbca985f"
      session_id: null
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: OpenCode Directive Single-Source

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-opencode-directive-single-source |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 2 |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The OpenCode bridge composed one shared three-directive block sourced from the canonical renderer. The local compiled-module-unavailable fallback was completed so it emitted comment hygiene, governor, and proof-over-appearance directives instead of the previous two-of-three block.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation was confined to `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`. The compiled path and local fallback used the same three-directive composition contract, while the fallback retained a complete local copy for fail-open operation when the compiled module was unavailable.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep compiled-first rendering | The canonical renderer remained the normal path. |
| Complete the local fallback with all three directives | Compiled-module unavailability could not justify dropping proof-over-appearance. |
| Keep the implementation bridge-only | The defect was isolated to the bridge's two-of-three fallback. |
| Preserve directive text and order | The defect was source drift, not wording. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Bridge Vitest | 9 tests passed. |
| Negative controls | 13 tests passed. |
| Syntax | `node --check` completed cleanly. |
| Directive presence | A source grep confirmed that the proof-over-appearance directive was present. |
| Scope | Only `mk-skill-advisor-bridge.mjs` changed for this phase. |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The bridge retained a local fallback because the compiled module can be unavailable. That fallback duplicated the canonical three-directive content intentionally, and parity tests guarded it against returning to the incomplete two-directive form.

<!-- /ANCHOR:limitations -->
