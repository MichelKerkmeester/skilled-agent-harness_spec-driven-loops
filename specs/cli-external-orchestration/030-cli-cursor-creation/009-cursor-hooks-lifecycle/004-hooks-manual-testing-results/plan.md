---
title: "Implementation Plan: cli-cursor hooks manual-testing results"
description: "Plan for independently re-executing the 4 hooks-category manual-testing-playbook scenarios and recording results."
trigger_phrases: ["cli-cursor hooks test results plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/004-hooks-manual-testing-results"
    last_updated_at: "2026-07-24T17:34:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 4 scenarios executed"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files: ["spec.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-manual-testing-results", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cli-cursor hooks manual-testing results

<!-- ANCHOR:summary -->
## 1. SUMMARY
Independently re-execute all 4 hooks-category manual-testing-playbook scenarios (`CU-013`, `CU-014`, `CU-020`, `CU-021`) per their own exact command sequences, record PASS/FAIL/SKIP verdicts with concrete evidence, and confirm the repo's own committed `.cursor/hooks.json` was never touched.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] Every scenario run per its own feature file's exact command sequence, not paraphrased.
- [x] Self-invocation guard (`env | grep -i cursor_` empty) confirmed before every dispatch.
- [x] Model allowlist respected (`composer-2.5` for every dispatch).
- [x] Repo's real `.cursor/hooks.json` confirmed untouched after every run.
- [x] All `/tmp` test artifacts deleted afterward.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
No new architecture -- this phase runs each scenario's already-specified isolated-`/tmp`-workspace probe-hook methodology (documented in each feature file's own "Exact Command Sequence" column) directly via Bash, in sequence, in the main session (not delegated to subagents, given only 4 short scenarios).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: CU-013 (confirmed-fires smoke test)
- [x] Created isolated `/tmp/cli-cursor-cu013-workspace/` with its own `.cursor/hooks.json` wiring `sessionStart`/`preToolUse`/`sessionEnd` to a logging probe script.
- [x] Confirmed self-invocation guard clean before dispatch.
- [x] Dispatched `cursor-agent -p "Run: echo isolated-probe-test" --workspace ... --model composer-2.5 --auto-review --sandbox enabled --trust` -- exit 0.
- [x] Probe log showed all 3 events: `sessionStart` (16:06:50Z), `preToolUse` (16:06:52Z), `sessionEnd` (16:06:55Z). PASS.

### Phase 2: CU-014 (confirmed-non-delivery documentation)
- [x] Extended the same workspace's `hooks.json` with `beforeSubmitPrompt`/`stop` entries alongside `sessionStart`/`sessionEnd`.
- [x] Dispatched `cursor-agent -p "Say a short goodbye and finish." --workspace ...` -- exit 0.
- [x] `beforeSubmitPrompt` count = 0, `stop` count = 0; `sessionStart`/`sessionEnd` still fired (harness sanity). Dormant adapter file confirmed present; both READMEs confirmed documenting the non-delivery finding. PASS.

### Phase 3: CU-020 (spec-gate-prebind.mjs, documentation-only)
- [x] Re-verified `spec-gate-prebind.mjs` still exists on disk.
- [x] Re-verified it is still uncommitted (`git status --porcelain` shows `??`).
- [x] Re-verified its source still states the `sessionStart`/`MK_SPEC_FOLDER`/`MK_SPEC_GATE_ENFORCE` design intent.
- [x] Recorded `SKIP` with the named blocker "pending review of a concurrent session's uncommitted work" -- still valid.

### Phase 4: CU-021 (Task-matcher preToolUse dispatch guard live-fire)
- [x] Created isolated `/tmp/cli-cursor-cu021-workspace/` with its own `.cursor/hooks.json` wiring two `preToolUse` entries: one unmatched, one `matcher: "Task"`.
- [x] Dispatched `cursor-agent -p "Delegate this to a subagent: write a one-line hello.txt file" --workspace ...` -- exit 0; stdout confirmed a real subagent created `hello.txt`.
- [x] Probe log showed the unmatched entry AND the `Task`-matcher entry firing at the same timestamp (16:07:32Z) for the Task call, plus 4 further unmatched-only entries for the child subagent session's own subsequent tool calls (expected -- those aren't `Task` calls). PASS.

### Phase 5: Cleanup + verification
- [x] Deleted all `/tmp/cli-cursor-cu013-*`/`cli-cursor-cu021-*` artifacts.
- [x] Confirmed `git status --porcelain .cursor/hooks.json` empty after every scenario.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
This phase IS the testing -- real `cursor-agent -p` dispatches against isolated `/tmp` workspaces, never mocked, matching the playbook's own EXECUTION POLICY. No unit/integration test suite applies (no application code changed).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| `cursor-agent` binary, authenticated | External | Green (Pro tier, confirmed) | All 4 scenarios require real dispatch |
| Phase 011's `task-dispatch-guard.mjs` wiring | Internal | Green (committed `bad9262a65`) | `CU-021`'s subject under test |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
None needed -- read-only verification, no code or config changed by this phase.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Extends the completed `030-cli-cursor-creation` packet, verifying phases 004/010/011's shipped hook wiring.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| 4 scenario executions | Low | 30 min |
| Docs + validation | Low | 15 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
None applicable -- no mutation of shipped state.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
