---
title: "Tasks: Codex agent TOML sync"
description: "Implementation tasks and evidence for deterministic Codex agent adapter synchronization."
trigger_phrases: ["Codex agent sync tasks"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/005-codex-agent-toml-sync"
    last_updated_at: "2026-07-13T10:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Generated Codex agent adapters and parity check"
    next_safe_action: "Run live Codex 0.144.1 agent-load smoke"
    blockers: ["Live Codex agent-load smoke requires orchestrator"]
    completion_pct: 90
    open_questions: ["Will all generated agents load in a live Codex 0.144.1 session?"]
    answered_questions: ["The canonical set is the 13 live Markdown filenames"]
---
# Tasks: Codex agent TOML sync
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation
Completed tasks include command or file evidence. Runtime-only verification remains pending.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Inventory canonical agents at implementation time. Evidence: 13 sorted `.opencode/agents/*.md` filenames.
- [x] T002 Verify Codex 0.144.1 TOML schema. Evidence: recovered adapter shape and `tomllib` parsing for every output.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Build deterministic generator. Evidence: `.opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs`; second run wrote 0 files.
- [x] T004 Generate `.codex/agents/*.toml`. Evidence: 13 generated TOMLs for 13 canonical Markdown agents.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T005 Add and run mirror parity check. Evidence: `sync-agents.cjs --check` reports 13 agents in sync.
- [ ] T006 Smoke agent loading in Codex. Needs live Codex (orchestrator).
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria
- [x] Generated set exactly matches the live canonical set. Evidence: empty basename diff and 13/13 counts.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md`
- `plan.md`
- `../001-codex-contract-pin/spec.md`
<!-- /ANCHOR:cross-refs -->
