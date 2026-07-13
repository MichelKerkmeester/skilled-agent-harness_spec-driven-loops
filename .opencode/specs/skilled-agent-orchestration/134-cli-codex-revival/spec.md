---
title: "Feature Specification: Codex CLI revival"
description: "Coordinate a six-phase revival of Codex CLI support while keeping unavailable Codex binaries fail-closed. All six phases now have implementation-summary.md evidence; phases 002-006 carry documented pending live-verification items ahead of final closeout."
trigger_phrases: ["cli-codex revival", "Codex CLI executor", "Codex hooks", "Codex agents"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival"
    last_updated_at: "2026-07-13T11:23:00Z"
    last_updated_by: "claude-code"
    recent_action: "Reconciled parent rollup — 6 child phases implemented (93%), live verification pending"
    next_safe_action: "Close out pending live-verification items across phases 002-006"
    blockers: ["Orchestrator dist build required for 004/006 hook live smoke tests", "Pre-existing repository dependency baseline (missing runtime-local better-sqlite3/tsx, stale AI-council contract digests) blocks 002's full-suite Vitest pass at 606/694"]
    key_files: ["001-codex-contract-pin/spec.md", "002-deep-loop-executor-support/spec.md", "003-cli-codex-skill-packet/spec.md", "004-codex-hook-adapter-layer/spec.md", "005-codex-agent-toml-sync/spec.md", "006-docs-and-closeout/spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "134-wave1", parent_session_id: null }
    completion_pct: 93
    open_questions: []
    answered_questions: ["All 6 phases have implementation-summary.md; phases 003-006 have pending live-verification items rather than being unbuilt (see PHASE DOCUMENTATION MAP)."]
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
| **Status** | Active, all 6 phases implemented (93%); live verification pending — see PHASE DOCUMENTATION MAP |
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
| `.opencode/skills/cli-external-orchestration/cli-codex/**` | Created | 003 | Skill built under the renamed hub; authoritative validation pending. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/**` | Created | 004 | Thin Codex adapters over runtime-neutral cores; dist/live smoke pending. |
| `.codex/agents/*.toml` | Modify | 005 | Canonical agent synchronization generated; live agent-load smoke pending. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP
| Phase | Folder | Focus | Status |
|---|---|---|---|
| 1 | `001-codex-contract-pin/` | Verify live CLI, hooks, project-dir, and adapter contracts. | Complete |
| 2 | `002-deep-loop-executor-support/` | Restore accepted, audited, fail-closed deep-loop executor support. | Complete — full-suite baseline gap documented (606/694; see child SC-002) |
| 3 | `003-cli-codex-skill-packet/` | Create the skill under the renamed external orchestration hub. | Implemented; authoritative validation pending |
| 4 | `004-codex-hook-adapter-layer/` | Add thin Codex hook adapters without changing neutral cores. | Source implemented; dist and live smoke pending |
| 5 | `005-codex-agent-toml-sync/` | Generate Codex agent TOMLs from canonical OpenCode agents. | Implemented; live agent-load smoke pending |
| 6 | `006-docs-and-closeout/` | Complete docs, parity checks, and packet closeout. | Implemented; hook live smoke pending dist build |

### Phase Transition Rules
- All 6 phases have implementation-summary.md and are implemented; phases 002-006 carry documented pending live-verification items (see Status column above) rather than being unbuilt.
- Phase 003 started only after the hub rename landed (confirmed: `cli-external-orchestration` exists on disk).
- Every routing surface must check `command -v codex` before advertising or dispatching Codex.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|---|---|---|---|
| 001 | 002 | Live 0.144.1 contract and existing architecture confirmed. | Met — `codex --version`, `codex features list`, source inspection (001 implementation-summary.md). |
| 002 | 003 | Runtime accepts Codex but rejects cleanly when the binary is absent. | Met for accept/reject behavior — 157/157 focused tests (CHK-020), explicit absent-PATH test (CHK-021); the unqualified full-suite bar (SC-002) is separately documented as amended at 606/694, unrelated to this transition. |
| 003 | 004 | Renamed hub contains an availability-gated skill. | Met — `cli-codex` skill built under `cli-external-orchestration` (003 implementation-summary.md); authoritative packet validation still pending. |
| 004 | 005 | Hook event/schema smoke tests pass against 0.144.1. | Pending — source adapters implemented; live smoke deferred until an orchestrator dist build (004 implementation-summary.md). |
| 005 | 006 | Generated TOMLs match the live canonical agent set. | Static parity implemented via `sync-agents.cjs --check`; live agent-load smoke in 0.144.1 still pending (005 implementation-summary.md). |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
- Resolved by phase 005: the canonical set is the live `.opencode/agents/*.md` filenames discovered at generation time, not a fixed count (005 implementation-summary.md).
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS
- `001-codex-contract-pin/spec.md`
- `002-deep-loop-executor-support/spec.md`
- `../122-cli-codex-deprecation/spec.md`
