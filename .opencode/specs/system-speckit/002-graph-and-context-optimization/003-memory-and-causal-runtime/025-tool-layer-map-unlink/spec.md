---
title: "Feature Specification: TOOL_LAYER_MAP Drift Fix (memory_causal_unlink L6)"
description: "memory_causal_unlink is a registered MCP tool (commit deee30b319) but is missing from TOOL_LAYER_MAP in lib/architecture/layer-definitions.ts, breaking 2 layer-definitions vitest tests on the clean baseline. Add it to the L6 (Analysis) group beside its siblings memory_causal_link and memory_causal_stats."
trigger_phrases:
  - "tool layer map drift"
  - "memory_causal_unlink missing layer"
  - "layer-definitions vitest failing"
  - "registered tool no layer definition"
  - "L6 analysis causal unlink"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/025-tool-layer-map-unlink"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added memory_causal_unlink to L6 group in layer-definitions.ts; vitest green"
    next_safe_action: "Commit when requested"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tool-layer-map-unlink-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Actual registered prefix verified: tool-schemas.ts memoryCausalUnlink description starts with [L6:Analysis]."
      - "Siblings memory_causal_link and memory_causal_stats both live in the L6 group; unlink belongs with them."
---
# Feature Specification: TOOL_LAYER_MAP Drift Fix (memory_causal_unlink L6)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`memory_causal_unlink` is a registered MCP tool (added by commit `deee30b319`, defined in
`tool-schemas.ts` with the description prefix `[L6:Analysis]`), but it is MISSING from the
`TOOL_LAYER_MAP` source in `lib/architecture/layer-definitions.ts`. The map is derived from
`LAYER_DEFINITIONS[*].tools`, and the tool name was never added to any layer's `tools` array.

This breaks two tests in `tests/layer-definitions.vitest.ts` on the clean baseline:
- `every registered tool has a layer definition` → `expected ['memory_causal_unlink'] to deeply equal []`
- `tool definition prefixes stay aligned with TOOL_LAYER_MAP` → `expected 'L6' to be undefined`
  (the tool's `[L6:Analysis]` description prefix has no matching `TOOL_LAYER_MAP` entry).

### Purpose
Restore TOOL_LAYER_MAP/registry parity so every registered tool has a layer definition and
its description prefix aligns with the map. The tool's real prefix is `[L6:Analysis]`, so it
belongs in the L6 group alongside its causal siblings.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `lib/architecture/layer-definitions.ts`: add the string `'memory_causal_unlink'` to the L6
  (Analysis) layer's `tools` array, grouped with `'memory_causal_link'` and
  `'memory_causal_stats'` to keep the causal trio together.

### Out of Scope
- Any change to `tool-schemas.ts` (the tool is already correctly registered with the
  `[L6:Analysis]` prefix; nothing to fix there).
- Any change to the failing test file or to `VIRTUAL_LAYER_TOOLS`.
- Any other layer group, tool, or token budget.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts` | Modify | Add `'memory_causal_unlink'` to the L6 `tools` array beside its causal siblings |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `memory_causal_unlink` is mapped to layer L6 | `TOOL_LAYER_MAP['memory_causal_unlink'] === 'L6'`; both failing vitest tests pass |
| REQ-002 | Layer matches the tool's registered description prefix | `tool-schemas.ts` `memoryCausalUnlink` prefix is `[L6:Analysis]`, matching layer L6 name `Analysis` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Causal tools stay grouped | `'memory_causal_unlink'` placed immediately after `'memory_causal_stats'` in the L6 `tools` array |
| REQ-004 | No regression elsewhere | `npx vitest run tests/layer-definitions.vitest.ts` → 41 passed, 0 failed; `tsc --noEmit` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `tests/layer-definitions.vitest.ts` goes from 2 failed to 0 failed (41 passed).
- **SC-002**: `tsc --noEmit` reports no errors; only `layer-definitions.ts` was modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Picking the wrong layer | Map/prefix mismatch test still fails | Verified the registered prefix `[L6:Analysis]` in `tool-schemas.ts` before editing |
| Risk | Scope creep into adjacent layers/tools | Unintended map churn | Single one-line array addition; scope locked to L6 group |
| Dependency | Commit `deee30b319` registered the tool without a layer entry | — | This packet closes the parity gap it opened |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The tool's layer (L6) was confirmed from its registered `[L6:Analysis]` description prefix.
<!-- /ANCHOR:questions -->
