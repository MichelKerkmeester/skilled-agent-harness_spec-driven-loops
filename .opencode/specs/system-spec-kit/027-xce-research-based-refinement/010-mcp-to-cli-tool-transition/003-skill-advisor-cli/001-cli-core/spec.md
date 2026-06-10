---
title: "Feature Specification: Phase 1: CLI Core [system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core/spec]"
description: "skill-advisor CLI binary: 9-subcommand registry codegen from TOOL_DEFINITIONS + Zod schemas, IPC connect + auto-spawn, fail-closed trusted-caller gate on mutating commands, exits 0/1/64/69/75 (deltas D1, D3, D8)"
trigger_phrases:
  - "skill-advisor cli core"
  - "003 001-cli-core"
  - "skill-advisor phase 1"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core"
    last_updated_at: "2026-06-06T15:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded in planned state"
    next_safe_action: "Run speckit:plan on this phase when its predecessor ships"
    blockers: []
    key_files:
      - "spec.md"
      - "../000-skill-advisor-cli-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-003-001-cli-core-scaffold"
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
| **Predecessor** | 000-skill-advisor-cli-research |
| **Successor** | 002-hardening-and-tests |
| **Handoff Criteria** | 9/9 subcommands invocable against a live daemon; mutating commands fail closed untrusted; exit matrix verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the skill-advisor dual-stack CLI implementation (workstream 003-skill-advisor-cli), paired with runtime hooks and the OpenCode plugin per the program-wide pairing rule.

**Scope Boundary**: skill-advisor CLI binary: 9-subcommand registry codegen from TOOL_DEFINITIONS + Zod schemas, IPC connect + auto-spawn, fail-closed trusted-caller gate on mutating commands, exits 0/1/64/69/75 (deltas D1, D3, D8)

**Dependencies**:
- Research authority: `../000-skill-advisor-cli-research/research/research.md` (GO verdict, delta specs, measurements) — premise, do not relitigate
- Research phase complete (terminal verdict)

**Deliverables**:
- Registry codegen
- IPC connect + auto-spawn via `mk-skill-advisor-launcher.cjs`; warm-first policy with `--timeout-ms`
- Trusted-caller gate

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Only 1 of 9 mk_skill_advisor tools has real CLI coverage today (skill_advisor.py covers advisor_recommend); advisor_rebuild and 4 of 5 skill_graph tools have no shell path at all.

### Purpose
Ship the canonical generated 9-tool skill-advisor CLI over the existing handler/compat stack; skill_advisor.py remains a legacy facade (reconcile verdict).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Registry codegen: 9 subcommands from `TOOL_DEFINITIONS` with the exported Zod schemas at argv (closest sibling to the spec-memory codegen path) — D1
- IPC connect + auto-spawn via `mk-skill-advisor-launcher.cjs`; warm-first policy with `--timeout-ms`
- Trusted-caller gate: graph-mutating commands (`graph scan`, `rebuild`, `graph propagate-enhances --apply`) fail closed unless explicitly authorized — D3
- Output contracts `--format json|text`; exit map 0/1/64/69/75 — D8
- Resident-service semantics preserved: `status` reports artifact freshness and daemon trust-evidence as SEPARATE fields; telemetry/shadow-sink writes preserved on CLI calls; embedder resolution honored on CLI-triggered scan/rebuild paths
- skill_advisor.py untouched in this phase (facade reconciliation lands in phase 2 fixtures)

### Out of Scope
- MCP removal or reference migration — standing program non-goals
- Work owned by sibling phases (test suites → phase 2; runtime wiring → phase 3)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| mk_skill_advisor CLI entrypoint + shim + generated manifest | Create | Per the research delta specs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 9 subcommands generated from TOOL_DEFINITIONS | CLI help enumerates 9; invalid args match MCP Zod validation behavior |
| REQ-002 | Mutating commands fail closed | scan/rebuild/propagate-apply refuse without the trusted-caller flag/context; refusal is tested |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | IPC-only with auto-spawn | From a stopped daemon, any subcommand spawns via the existing launcher and answers |
| REQ-004 | Exit-code contract implemented | 75 retryable / 69 fail-closed mismatch / 64 usage verified by invocation matrix |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 9/9 subcommands invocable against a live daemon; mutating commands fail closed untrusted; exit matrix verified
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

- None blocking. Delta specifications are pinned in `../000-skill-advisor-cli-research/research/research.md`; remaining detail is planning-level.
<!-- /ANCHOR:questions -->
