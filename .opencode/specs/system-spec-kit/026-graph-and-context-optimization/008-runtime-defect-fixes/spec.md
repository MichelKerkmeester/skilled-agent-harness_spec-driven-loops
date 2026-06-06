---
title: "Feature Specification: Runtime Defect Fixes [system-spec-kit/026-graph-and-context-optimization/008-runtime-defect-fixes/spec]"
description: "Four live defects surfaced by the 028 CLI-transition research, fixed in place: broken mk-code-graph plugin bridge imports, Codex hooks registered to Claude scripts, a backwards DB-path note, and Gemini catalog source-path drift."
trigger_phrases:
  - "runtime defect fixes"
  - "code graph bridge repair"
  - "codex hooks rewiring"
  - "026 008 fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-defect-fixes"
    last_updated_at: "2026-06-06T16:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All four fixes applied and smoke-verified"
    next_safe_action: "Commit alongside the 028 program work"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Orphan sweep: no-op — all 9 launchers owned by live sessions at sweep time"
---
# Feature Specification: Runtime Defect Fixes

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
| **Created** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 028 CLI-transition research and gap audits surfaced four live defects in the three MCP systems' integration surfaces: the OpenCode code-graph plugin bridge crashed on import (three paths pointing at files that moved during skill extraction), Codex sessions ran Claude's hook scripts instead of the purpose-built Codex adapters, the Codex config carried a backwards DB-path note (calling the real default "legacy"), and the Gemini hook catalog pointed at the shim instead of the active implementation.

### Purpose
Fix all four in place — restoring the OpenCode code-graph plugin and correct Codex hook behavior today — independent of (and unblocking) the 028 implementation phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Bridge repair: re-point the three dead imports in `mk-code-graph-bridge.mjs` to their real homes in system-spec-kit's compiled server
- Codex hook rewiring: `SessionStart` and `UserPromptSubmit` entries in `.codex/hooks.json` → the Codex adapters; `PreCompact` deliberately stays on the shared Claude script (by-design sharing)
- `.codex/config.toml` DB-path note corrected (skill-local IS the default; the shared path is the legacy one)
- Gemini hook catalog source-path fix (active implementation vs shim)
- Orphan-launcher sweep (lease/owner-aware) — executed as a verified NO-OP: all 9 running launchers belonged to live sessions

### Out of Scope
- The launcher lifecycle fix (owner-exit reaping) — owned by the 028 skill-advisor workstream phases
- Any CLI implementation work — owned by the 028 program

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs | Modify | Three imports re-pointed to system-spec-kit dist |
| .codex/hooks.json | Modify | SessionStart + UserPromptSubmit → codex adapters |
| .codex/config.toml | Modify | DB-path note corrected |
| .opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/gemini-hook.md | Modify | Implementation/shim rows corrected |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Bridge runs again | `node mk-code-graph-bridge.mjs --minimal` exits 0 and emits the transport payload |
| REQ-002 | Codex hooks emit Codex envelopes | Rewired hooks produce valid JSON envelopes from sample stdin |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Doc corrections accurate | config.toml note matches launcher/source defaults; catalog names the active implementation |
| REQ-004 | Sweep is lease/owner-aware | No launcher belonging to a live session is killed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: OpenCode code-graph plugin path functional again (bridge emits `opencodeTransport.transportOnly: true`)
- **SC-002**: Codex sessions get Codex-shaped startup context and advisor briefs
- **SC-003**: Zero live sessions disrupted by the sweep
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cross-skill import couples the bridge to spec-kit dist layout | Low-Med | Comment documents the borrow; the 028 code-index phase 3 replaces this with the CLI-backed bridge |
| Risk | Rewired Codex hooks regress live Codex sessions | Low | Smoke-tested both adapters; PreCompact sharing preserved |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The deferred lifecycle fix is tracked in the 028 skill-advisor workstream.
<!-- /ANCHOR:questions -->
