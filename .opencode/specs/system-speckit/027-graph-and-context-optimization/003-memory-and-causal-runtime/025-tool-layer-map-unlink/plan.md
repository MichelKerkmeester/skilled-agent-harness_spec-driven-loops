---
title: "Implementation Plan: TOOL_LAYER_MAP Drift Fix (memory_causal_unlink L6)"
description: "One-line fix: add 'memory_causal_unlink' to the L6 (Analysis) tools array in lib/architecture/layer-definitions.ts so TOOL_LAYER_MAP gains the entry, restoring registry/map parity and turning 2 failing layer-definitions vitest tests green."
trigger_phrases:
  - "tool layer map drift plan"
  - "memory_causal_unlink l6 plan"
  - "layer-definitions fix plan"
  - "registered tool layer parity"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/025-tool-layer-map-unlink"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Wrote plan for the one-line L6 array addition"
    next_safe_action: "Apply edit; run vitest and tsc"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tool-layer-map-unlink-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: TOOL_LAYER_MAP Drift Fix (memory_causal_unlink L6)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server lib/architecture) |
| **Framework** | system-spec-kit MCP server / 7-layer tool architecture |
| **Storage** | None (in-memory constant) |
| **Testing** | `vitest` (`tests/layer-definitions.vitest.ts`) + `tsc --noEmit` |

### Overview
`TOOL_LAYER_MAP` is built by iterating `LAYER_DEFINITIONS[*].tools`. The registered tool
`memory_causal_unlink` (prefix `[L6:Analysis]`) was never added to any layer's `tools` array,
so it has no map entry. Two vitest tests assert registry/map parity and prefix alignment, and
both fail. The fix is a single string addition to the L6 `tools` array.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Failing tests and exact assertions identified
- [x] Root cause confirmed (tool registered but absent from `LAYER_DEFINITIONS.L6.tools`)
- [x] Target layer L6 confirmed from the tool's registered `[L6:Analysis]` prefix

### Definition of Done
- [x] `'memory_causal_unlink'` added to L6 `tools` array beside its causal siblings
- [x] `npx vitest run tests/layer-definitions.vitest.ts` → 41 passed, 0 failed
- [x] `tsc --noEmit` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-of-truth correction (constant catalog). `TOOL_LAYER_MAP` is derived, not hand-maintained,
so the only correct edit point is the layer's `tools` array.

### Key Components
- **`LAYER_DEFINITIONS.L6.tools`**: the array that must contain the tool name.
- **`TOOL_LAYER_MAP`**: derived map (no manual entry needed; it picks up the new tool).
- **`tool-schemas.ts` `memoryCausalUnlink`**: read-only source of truth for the tool's
  `[L6:Analysis]` prefix.

### Data Flow
`LAYER_DEFINITIONS.L6.tools` (add name) → derivation loop populates `TOOL_LAYER_MAP` → vitest
parity + prefix-alignment checks pass.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Verify the target layer
- [x] Read `tool-schemas.ts` `memoryCausalUnlink`; confirm prefix `[L6:Analysis]`
- [x] Confirm siblings `memory_causal_link` / `memory_causal_stats` live in the L6 group

### Phase 2: Apply the fix
- [x] Add `'memory_causal_unlink'` after `'memory_causal_stats'` in `LAYER_DEFINITIONS.L6.tools`

### Phase 3: Verification
- [x] `npx vitest run tests/layer-definitions.vitest.ts` (expect 41 passed, 0 failed)
- [x] `npx tsc --noEmit` (expect exit 0)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | layer-definitions parity + prefix alignment | `vitest` |
| Type check | Whole mcp_server compile | `tsc --noEmit` |
| Doc validation | Packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Commit `deee30b319` (registered the tool) | Internal | Green | None - already merged; this closes the parity gap |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: vitest or tsc regresses after the edit.
- **Procedure**: `git checkout -- lib/architecture/layer-definitions.ts` (single-line, no
  data/migration to revert).
<!-- /ANCHOR:rollback -->
