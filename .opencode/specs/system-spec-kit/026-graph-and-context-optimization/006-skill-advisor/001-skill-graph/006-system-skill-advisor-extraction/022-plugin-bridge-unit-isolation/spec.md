---
title: "Feature Specification: Plugin bridge unit isolation"
description: "Converts plugin bridge behavioral tests from subprocess calls to direct unit tests while keeping one subprocess smoke for the OpenCode bridge contract."
trigger_phrases:
  - "018 plugin bridge follow-on"
  - "plugin bridge unit isolation"
  - "bridge subprocess smoke"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/022-plugin-bridge-unit-isolation"
    last_updated_at: "2026-05-15T11:00:00Z"
    last_updated_by: "codex"
    recent_action: "Plugin bridge unit isolation implemented"
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
# Feature Specification: Plugin bridge unit isolation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Spec Folder** | `022-plugin-bridge-unit-isolation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 018 deferred plugin bridge unit isolation because behavioral tests still spawned the bridge process for every assertion. That made logic failures slower to diagnose and coupled unit coverage to MCP subprocess availability.

### Purpose
Keep one process-boundary smoke while testing bridge logic through importable functions and mocked advisor modules.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Export pure bridge helpers from the MJS bridge source.
- Convert behavioral bridge tests to direct unit tests with fake native advisor dependencies.
- Keep exactly one subprocess smoke for the stdin/stdout JSON envelope.

### Out of Scope
- Changing public plugin input/output shape.
- Renaming bridge files, tool ids, server ids, or skill ids.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Modify | Export bridge helpers and guard the CLI entrypoint. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/plugin-bridge.vitest.ts` | Modify | Use direct imports and mocked native dependencies. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/plugin-bridge-smoke.vitest.ts` | Modify | Keep one subprocess smoke for the JSON envelope. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Behavioral plugin bridge tests avoid subprocess spawning. | `plugin-bridge.vitest.ts` imports the bridge module and passes focused unit coverage. |
| REQ-002 | One subprocess smoke remains for OpenCode contract coverage. | `plugin-bridge-smoke.vitest.ts` has one spawning test. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-900 | Preserve public advisor identities. | No tool-id, server-id, or skill-id rename is introduced. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Bridge behavior tests are pure unit tests.
- **SC-002**: The one subprocess smoke still validates a JSON envelope.
- **SC-003**: Advisor focused Vitest for bridge tests passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Importing the MJS bridge could execute `main()`. | Tests would hang or read stdin. | Guard entrypoint with direct-run detection. |
| Risk | Mocked unit tests could drift from subprocess behavior. | False confidence. | Keep one smoke at the process boundary. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-01**: Unit tests avoid subprocess latency except the smoke test.
- **NFR-02**: The bridge remains prompt-safe and exports no private credentials.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **EC-01**: Empty stdin is covered by the pure parser test.
- **EC-02**: Disabled hook mode returns silent skipped output without prompt leakage.
- **EC-03**: Forced-local mode still fails open through the legacy route.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Small, scoped surfaces with targeted tests. |
| Risk | 14/25 | Runtime bridge and metadata paths require focused validation. |
| Research | 8/20 | Audit driven from packet 018 and current source. |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Gate 3 was pre-answered as Option B for new follow-on packets.
<!-- /ANCHOR:questions -->
