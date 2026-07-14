---
title: "Feature Specification: Codex contract pin"
description: "Record the verified Codex CLI 0.144.1 hook, executor, project directory, and adapter-layer contract before implementation."
trigger_phrases: ["Codex contract pin", "Codex hooks stable", "CODEX_PROJECT_DIR"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/001-codex-contract-pin"
    last_updated_at: "2026-07-13T05:37:00Z"
    last_updated_by: "opencode"
    recent_action: "Verified and folded the Codex 0.144.1 contract"
    next_safe_action: "Use the pinned contract in later Codex phases"
    blockers: []
    key_files: ["spec.md", "implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "134-001", parent_session_id: "134-wave1" }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Native hooks are stable and enabled in Codex 0.144.1."]
---
# Feature Specification: Codex contract pin
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-13 |
| **Branch** | `wt/goalD-codex` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None |
| **Successor** | `../002-deep-loop-executor-support/spec.md` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Codex was deprecated after its active runtime contract became unreliable. Revival needs current, reproducible facts rather than assumptions inherited from older plugin-hook behavior.
### Purpose
Pin the installed CLI, hook feature, project-root environment, neutral-core architecture, missing adapter layer, and future verification boundaries.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Verify `/opt/homebrew/bin/codex` reports `codex-cli 0.144.1`.
- Verify `hooks` is stable/true and `plugin_hooks` is removed/false.
- Record the historical `.codex/hooks.json` use of `CODEX_PROJECT_DIR`.
- Confirm runtime-neutral hook cores exist and `hooks/codex/` adapters do not.
### Out of Scope
- Implementing adapters or changing hook cores.
- Assuming historical event names or payload shapes remain valid for new events.
### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| This phase folder | Create | Canonical contract evidence. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Confirm installed CLI | `codex --version` returns 0.144.1. |
| REQ-002 | Confirm native hooks | Feature list reports stable/true. |
| REQ-003 | Establish fail-closed prerequisite | Future routing requires `command -v codex`. |
### P1 - Required
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-004 | Preserve adapter architecture | Later work adds thin adapters over existing neutral cores. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: Version and feature outputs are recorded from the live binary.
- **SC-002**: The historical hook shape and `CODEX_PROJECT_DIR` key are documented.
- **SC-003**: New hook event/schema validation is deferred explicitly to phase 004.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | Historical hook payload drift | Broken adapters | Validate every event and output shape live in phase 004. |
| Dependency | Codex binary availability | Cannot verify | Fail closed and do not advertise Codex. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- Phase 004 must verify the 0.144.1 hook configuration location, five additional event names, matchers, and stdout contract.
- Phase 005 must reconcile the live 14-agent canonical set with the prior 15-agent planning claim.
<!-- /ANCHOR:questions -->
