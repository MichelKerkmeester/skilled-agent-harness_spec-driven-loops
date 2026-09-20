---
title: "Tasks: Codex hook adapter layer"
description: "Codex hook source adapters and project registration are implemented; dist and live smoke remain deferred."
trigger_phrases: ["Codex hook tasks"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/004-codex-hook-adapter-layer"
    last_updated_at: "2026-07-13T09:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Implemented Codex adapter sources and project bridge"
    next_safe_action: "Build dist and run the four-event Codex smoke matrix"
    blockers: []
    completion_pct: 75
    open_questions: []
    answered_questions: []
---
# Tasks: Codex hook adapter layer
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation
Checked tasks include source or configuration evidence. Runtime tasks stay pending until the orchestrator builds `dist`.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Verify config location and trust flow. `.codex/hooks.json` is present; trusted-project loading still needs live Codex verification after the dist build.
- [x] T002 Capture event names, matchers, payloads, and stdout contract. Evidence: four PascalCase registrations in `.codex/hooks.json`; input validation and Codex JSON output translation in `hooks/codex/shared.ts`.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Add thin Codex adapters over neutral cores. Evidence: `session-start.ts`, `user-prompt-submit.ts`, `session-stop.ts`, and `compact-inject.ts`; scoped git status shows only `hooks/codex/` under the hook tree.
- [x] T004 Add project-local hook registration keyed on `CODEX_PROJECT_DIR`. Evidence: `.codex/hooks.json` uses `cd "${CODEX_PROJECT_DIR:-$PWD}"`; `.codex/config.toml` enables hooks and registers the three project MCP launchers.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T005 Unit-test adapters. Scoped TypeScript syntax passes; executable adapter tests need the orchestrator-built `dist` artifacts.
- [ ] T006 Run live event smoke matrix. Needs dist build and trusted Codex 0.144.1 session (orchestrator).
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All events are verified live and neutral cores remain unchanged. Neutral-core status proof passes; live event verification remains deferred.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md`
- `plan.md`
- `../001-codex-contract-pin/spec.md`
<!-- /ANCHOR:cross-refs -->
