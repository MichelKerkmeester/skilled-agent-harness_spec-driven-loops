---
title: "Feature Specification: Codex CLI revival"
description: "Coordinate a six-phase revival of Codex CLI support while keeping unavailable Codex binaries fail-closed. Wave 1 pins the live contract and restores deep-loop executor support; later phases remain planned."
trigger_phrases: ["cli-codex revival", "Codex CLI executor", "Codex hooks", "Codex agents"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival"
    last_updated_at: "2026-07-13T05:37:00Z"
    last_updated_by: "opencode"
    recent_action: "Authored Wave 1 packet and restored runtime executor support"
    next_safe_action: "Wait for the cli-external hub rename before phase 003"
    blockers: ["Phase 003 requires cli-external to be renamed to cli-external-orchestration"]
    key_files: ["001-codex-contract-pin/spec.md", "002-deep-loop-executor-support/spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "134-wave1", parent_session_id: null }
    completion_pct: 33
    open_questions: []
    answered_questions: ["Wave 1 implements only phases 001 and 002."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->
# Feature Specification: Codex CLI revival

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 phased packet |
| **Priority** | P0 |
| **Status** | Active, Wave 1 complete |
| **Created** | 2026-07-13 |
| **Branch** | `wt/goalD-codex` |
| **Parent Packet** | `skilled-agent-orchestration/134-cli-codex-revival` |
| **Predecessor** | `122-cli-codex-deprecation` (reversed prior decision; unchanged) |
| **Successor** | None |
| **Handoff Criteria** | Every phase validates independently; unavailable Codex binaries never become routable. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Codex CLI 0.144.1 now provides stable native hooks, multi-agent support, and a supported non-interactive executor, reversing the operational assumptions behind packet 122. Revival must restore support without repeating the former advertised-but-unusable failure mode.

### Purpose
Restore Codex through six bounded phases, beginning with a verified contract and a fail-closed deep-loop executor. Detailed implementation remains in child phases.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Pin the installed Codex contract and historical adapter architecture.
- Restore deep-loop executor configuration, fan-out command construction, audit data, and tests.
- Plan the skill, hook adapter, agent TOML, and closeout phases.

### Out of Scope
- Implementing phases 003-006 in Wave 1.
- Creating a `cli-codex` skill or touching the current `cli-external` hub.
- Rewriting packet 122 or runtime-neutral hook cores.

### Files to Change
| File Path | Change Type | Phase | Description |
|---|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/**` | Modify | 002 | Restore executor kind, adapter, fan-out, audit, and tests. |
| `.opencode/skills/cli-external-orchestration/cli-codex/**` | Planned | 003 | Future skill under the renamed hub. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/**` | Planned | 004 | Future thin Codex adapters over runtime-neutral cores. |
| `.codex/agents/*.toml` | Planned | 005 | Future canonical agent synchronization. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP
| Phase | Folder | Focus | Status |
|---|---|---|---|
| 1 | `001-codex-contract-pin/` | Verify live CLI, hooks, project-dir, and adapter contracts. | Complete |
| 2 | `002-deep-loop-executor-support/` | Restore accepted, audited, fail-closed deep-loop executor support. | Complete |
| 3 | `003-cli-codex-skill-packet/` | Create the skill under the renamed external orchestration hub. | Planned, blocked |
| 4 | `004-codex-hook-adapter-layer/` | Add thin Codex hook adapters without changing neutral cores. | Planned |
| 5 | `005-codex-agent-toml-sync/` | Generate Codex agent TOMLs from canonical OpenCode agents. | Planned |
| 6 | `006-docs-and-closeout/` | Complete docs, parity checks, and packet closeout. | Planned |

### Phase Transition Rules
- Phases 003-006 remain documentation-only in Wave 1.
- Phase 003 cannot start before the hub rename lands.
- Every routing surface must check `command -v codex` before advertising or dispatching Codex.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|---|---|---|---|
| 001 | 002 | Live 0.144.1 contract and existing architecture confirmed. | `codex --version`, `codex features list`, source inspection. |
| 002 | 003 | Runtime accepts Codex but rejects cleanly when the binary is absent. | Runtime suite, typecheck, absent-PATH test. |
| 003 | 004 | Renamed hub contains an availability-gated skill. | Future skill validation. |
| 004 | 005 | Hook event/schema smoke tests pass against 0.144.1. | Future hook tests. |
| 005 | 006 | Generated TOMLs match the live canonical agent set. | Future mirror check. |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
- Phase 005 must resolve whether the canonical agent count remains 14 or gains a fifteenth agent before synchronization.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS
- `001-codex-contract-pin/spec.md`
- `002-deep-loop-executor-support/spec.md`
- `../122-cli-codex-deprecation/spec.md`
