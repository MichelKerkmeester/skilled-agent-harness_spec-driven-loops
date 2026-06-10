---
title: "Feature Specification: Phase 1: CLI Core [system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/spec]"
description: "code-index CLI binary: all-8 manifest codegen from CODE_GRAPH_TOOL_SCHEMAS, validateToolArgs parity at argv, IPC connect + auto-spawn, blocked-read rendering, exits 0/1/64/69/75, shim with dist-freshness (deltas D1–D7, D10)"
trigger_phrases:
  - "code-index cli core"
  - "002 001-cli-core"
  - "code-index phase 1"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core"
    last_updated_at: "2026-06-06T15:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded in planned state"
    next_safe_action: "Run speckit:plan on this phase when its predecessor ships"
    blockers: []
    key_files:
      - "spec.md"
      - "../000-code-index-cli-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-002-001-cli-core-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: CLI Core

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned (not implemented) |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | 000-code-index-cli-research |
| **Successor** | 002-hardening-and-tests |
| **Handoff Criteria** | All 8 subcommands invocable against a live daemon; blocked-read renders blocked; exit matrix verified; auto-spawn works from a dead socket |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the code-index dual-stack CLI implementation (workstream 002-code-index-cli), paired with runtime hooks and the OpenCode plugin per the program-wide pairing rule.

**Scope Boundary**: code-index CLI binary: all-8 manifest codegen from CODE_GRAPH_TOOL_SCHEMAS, validateToolArgs parity at argv, IPC connect + auto-spawn, blocked-read rendering, exits 0/1/64/69/75, shim with dist-freshness (deltas D1–D7, D10)

**Dependencies**:
- Research authority: `../000-code-index-cli-research/research/research.md` (GO verdict, delta specs, measurements) — premise, do not relitigate
- Research phase complete (terminal verdict)

**Deliverables**:
- Stable shim (`.opencode/bin/code-index.cjs` working name) with dist-freshness guard (stale/missing dist → exit 69 unless dev override)
- Manifest codegen for all 8 subcommands from `CODE_GRAPH_TOOL_SCHEMAS`; validation parity via `validateToolArgs()` + dispatcher required-field checks (NOT Zod — confirmed system-specific)
- Blocked-read rendering

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mk_code_index daemon has no CLI front door: 8 tools are MCP-only, so transport-down sessions, hooks, cron, and scripts cannot reach structural code search at all.

### Purpose
Ship the code-index CLI as a second IPC client over the unchanged daemon: all 8 tools invocable from a shell, MCP registration untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stable shim (`.opencode/bin/code-index.cjs` working name) with dist-freshness guard (stale/missing dist → exit 69 unless dev override) — deltas D1, D2, D10
- Manifest codegen for all 8 subcommands from `CODE_GRAPH_TOOL_SCHEMAS`; validation parity via `validateToolArgs()` + dispatcher required-field checks (NOT Zod — confirmed system-specific) — D3, D4
- Blocked-read rendering: `query`/`context`/`detect-changes` stale-readiness `status: blocked` + `requiredAction` preserved in every output format, never false empty success — D5
- Exit taxonomy 0/1/64/69/75 incl. retryable socket/backend/cold-start → 75 — D6; `--timeout-ms` + warm-only spawn policy plumbing — D7
- Connect-falls-back-to-spawn over the IPC socket via `mk-code-index-launcher.cjs`; `apply` keeps its `--confirm` hard-stale gate; scan/apply/verify confirmation UX

### Out of Scope
- MCP removal or reference migration — standing program non-goals
- Work owned by sibling phases (test suites → phase 2; runtime wiring → phase 3)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| mk_code_index CLI entrypoint + shim + generated manifest | Create | Per the research delta specs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 8 subcommands generated from CODE_GRAPH_TOOL_SCHEMAS | `code-index list-tools --format json` (or --help) enumerates 8; no handwritten per-tool arg mapping |
| REQ-002 | Blocked-read envelopes preserved | Stale-readiness paths render blocked with requiredAction in json AND text modes; exit policy documented |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | IPC-only with auto-spawn | From a stopped daemon, any subcommand spawns via the existing launcher and answers; no direct SQLite access from the CLI |
| REQ-004 | Exit-code contract implemented | 75 for retryable classes, 69 protocol-mismatch fail-closed, 64 usage — verified by invocation matrix |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 8 subcommands invocable against a live daemon; blocked-read renders blocked; exit matrix verified; auto-spawn works from a dead socket
- **SC-002**: MCP surface untouched throughout (dual-stack) — existing clients work unchanged
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Research record (complete) | Phase cannot start | Phase ordering enforced by parent handoff criteria |
| Risk | Scope drift beyond the delta specs | Med | Research deltas are the binding scope authority; new work needs operator sign-off |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Delta specifications are pinned in `../000-code-index-cli-research/research/research.md`; remaining detail is planning-level.
<!-- /ANCHOR:questions -->
