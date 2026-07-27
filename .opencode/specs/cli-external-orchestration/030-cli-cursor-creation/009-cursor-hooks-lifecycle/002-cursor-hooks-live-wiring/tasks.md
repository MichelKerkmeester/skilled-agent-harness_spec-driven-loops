---
title: "Tasks: cli-cursor committed .cursor/hooks.json registration"
description: "Task breakdown for creating and live-fire testing the committed, project-level .cursor/hooks.json."
trigger_phrases: ["cli-cursor hooks.json registration tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/010-cursor-hooks-live-wiring"
    last_updated_at: "2026-07-24T16:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-live-wiring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cli-cursor committed .cursor/hooks.json registration

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Confirmed no repo-level `.cursor/` existed (`find` → "No such file or directory")
- [x] T002 Confirmed live `~/.cursor/hooks.json` registers only an unrelated third-party terminal tool's integration (`~/.superset/hooks/cursor-hook.sh`), zero entries for this repo's adapters
- [x] T003 Read `references/hook-contract.md` §3 Discovery Order — confirmed project-level `.cursor/hooks.json` is real and supported
- [x] T004 `WebFetch` against Cursor's own hooks documentation — confirmed hooks merge across scopes ("all matching hooks from every source run"), not shadow
- [x] T005 Standalone-tested all 4 target adapters (`session-start.js`, `session-end.js`, `spec-gate-enforce.mjs`, `spec-gate-classify.mjs`) with synthetic stdin payloads — all returned sane response envelopes
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T006 Created `.cursor/hooks.json` (absolute paths, first pass) wiring `sessionStart`/`sessionEnd`/`preToolUse`/`beforeSubmitPrompt`
- [x] T007 Live-fire tested with a temporary logging-wrapper diagnostic against a real `cursor-agent -p` dispatch from repo root — confirmed 3/4 events fired with real timestamps (`beforeSubmitPrompt` did not, matching phase 004's dormancy finding)
- [x] T008 Rebuilt with relative paths per ADR-001's "committed to the repo" decision; re-ran the same diagnostic from repo root AND a nested subdirectory — `/tmp/cli-cursor-hook-fire-log2.txt` shows identical `pwd=.../Public` for both runs, confirming hook execution cwd = project root, not invocation cwd
- [x] T009 Reverted to the clean, undecorated command strings; deleted the diagnostic log and all `/tmp` test artifacts
- [x] T010 Corrected 4 stale doc references (`references/hook-contract.md`, `manual-testing-playbook.md`, `hooks/confirmed-fires-smoke-test.md`, `feature-catalog/feature-catalog.md`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T011 Re-confirmed `.cursor/hooks.json` valid JSON, trackable (not gitignored)
- [x] T012 Full-repo `git diff --stat` swept for collateral changes — found a concurrent session's own archive-move activity had transiently diverged 4 of this phase's files from HEAD; restored those specific files from HEAD before re-applying this phase's edits, left all concurrent-session-owned paths untouched
- [x] T013 Grep sweep for stale phrasing (`deliberately uncommitted`, `does not yet ship a hook adapter layer`, `committed-but-unregistered`) — 0 hits after corrections
- [x] T014 `bash validate.sh 030-cli-cursor-creation --recursive --strict` → confirmed passing
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T015 `validate.sh 010-cursor-hooks-live-wiring --strict` passes 0/0; SC-001..SC-005 met; `implementation-summary.md` written
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Executes ADR-001 (phase 004's original committed-registration decision, deferred at the time).
- Extends phase 009 (hooks catalog + playbook coverage) with corrected registration-status wording.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
