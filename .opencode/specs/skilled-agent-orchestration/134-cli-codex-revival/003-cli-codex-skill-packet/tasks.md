---
title: "Tasks: cli-codex skill packet"
description: "Implementation tasks and evidence for the revived cli-codex nested mode."
trigger_phrases: ["cli-codex skill tasks"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/003-cli-codex-skill-packet"
    last_updated_at: "2026-07-13T09:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Built and verified the nested cli-codex mode"
    next_safe_action: "Run orchestrator-owned validate.sh"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: cli-codex skill packet
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation
Completed tasks carry short path or command evidence.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Wait for `cli-external-orchestration` hub rename. Evidence: `cli-external-orchestration/SKILL.md`.
- [x] T002 Read the landed hub registry and templates. Evidence: `mode-registry.json`, `cli-opencode/SKILL.md`.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Scaffold the nested skill. Evidence: `cli-codex/SKILL.md`, `cli-codex/README.md`.
- [x] T004 Add fail-closed availability and audited dispatch wiring. Evidence: `command -v codex`, `fanout-run.cjs` delegation.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T005 Test binary present and absent paths. Evidence: `/opt/homebrew/bin/codex`, `ABSENT PATH REFUSED`.
- [x] T006 Validate the skill and parent hub. Evidence: `package_skill.py --check`, `verify_alignment_drift.py`.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria
- [x] Hub dependency landed and all scoped tasks complete. Evidence: `mode-registry.json`, `hub-router.json`.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md`
- `plan.md`
- `../002-deep-loop-executor-support/spec.md`
<!-- /ANCHOR:cross-refs -->
