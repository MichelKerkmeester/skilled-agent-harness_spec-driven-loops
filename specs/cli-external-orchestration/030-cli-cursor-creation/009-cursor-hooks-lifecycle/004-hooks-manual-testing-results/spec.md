---
title: "Feature Specification: cli-cursor hooks manual-testing results"
description: "Independent, first-hand reproduction of the hooks-category manual-testing-playbook scenarios (CU-013, CU-014, CU-020, CU-021) in this session, distinct from citing the phase 004/011 build reports."
trigger_phrases: ["cli-cursor hooks test results", "CU-013 CU-014 CU-020 CU-021 results", "hooks manual testing playbook run"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/004-hooks-manual-testing-results"
    last_updated_at: "2026-07-24T17:34:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 4 hooks scenarios executed for real and results recorded"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: [".opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-manual-testing-results", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Scope: hooks category only (CU-013/014/020/021), not the full 21-scenario suite -- the operator's request was specifically about the hooks."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: cli-cursor hooks manual-testing results

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../003-cursor-hooks-claude-parity/spec.md` |
| **Successor** | `../005-hooks-sk-code-alignment/spec.md` |
| **Handoff Criteria** | All 4 hooks-category scenarios (`CU-013`, `CU-014`, `CU-020`, `CU-021`) executed for real against the live `cursor-agent` binary in this session (not cited from an earlier phase's build report), each with a PASS/FAIL/SKIP verdict and concrete evidence, and the repo's own committed `.cursor/hooks.json` confirmed untouched by every run. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 004, 006, 009, 010, and 011 each captured live-fire evidence for the hooks category's events as part of their own build/wiring work, but no single session had independently *re-executed* the hooks category's playbook scenarios end-to-end afterward, purely as a verification exercise separate from any build. The operator asked directly: *"Run all testing playbooks for the hooks."* Per this session's own "finding is a hypothesis" standard, a build report's self-cited evidence is not the same as a fresh, independent reproduction.

### Purpose
Execute all 4 hooks-category manual-testing-playbook scenarios (`CU-013` confirmed-fires smoke test, `CU-014` confirmed-non-delivery documentation, `CU-020` `spec-gate-prebind.mjs` documentation-only check, `CU-021` Task-matcher `preToolUse` live-fire) for real, in this session, and record the results as first-class evidence in this packet.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Execute `CU-013`'s exact command sequence (isolated `/tmp` workspace, probe `hooks.json` wiring `sessionStart`/`preToolUse`/`sessionEnd`, real `cursor-agent -p` dispatch, inspect probe log).
- Execute `CU-014`'s exact command sequence (extend the same workspace with `beforeSubmitPrompt`/`stop`, dispatch, confirm zero firing, confirm dormant-adapter + README documentation).
- Execute `CU-020`'s documentation-only check (re-verify `spec-gate-prebind.mjs` still exists, still uncommitted, source still shows the `sessionStart` design intent) and record the `SKIP` verdict with its named blocker.
- Execute `CU-021`'s exact command sequence (isolated workspace with two `preToolUse` entries, one unmatched and one `matcher: "Task"`, dispatch a subagent-delegation prompt, confirm both entries fire for the same `Task` call).
- Confirm the repo's own real, committed `.cursor/hooks.json` was never touched by any of the 4 isolated-workspace runs.
- Clean up all `/tmp` test artifacts after each scenario.
- Record PASS/FAIL/SKIP verdicts with concrete evidence (probe log excerpts, counts, timestamps) in this phase's docs.

### Out of Scope
- The remaining 17 non-hooks scenarios (`CU-001`..`CU-012`, `CU-015`..`CU-019`) -- the operator's request was scoped to hooks specifically.
- Any new adapter code, wiring change, or fix -- this phase is verification-only; all 4 scenarios passed (or SKIPped by design) with no gap found requiring a follow-up build.
- Re-testing `beforeMCPExecution`/`afterMCPExecution` or the unwired `mcp-route-guard.mjs` -- no MCP server is configured on this machine (phase 011 finding, unchanged) and there is no corresponding playbook scenario for it yet.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/012-hooks-manual-testing-results/*` | Create | This phase's own docs recording the 4 scenario results. |
| `../003-cursor-hooks-claude-parity/spec.md` | Modify | Update `Successor` field to point here. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | Every one of the 4 hooks-category scenarios is executed for real in this session (not cited from a prior phase's report). | P0 |
| REQ-002 | Each scenario's verdict (PASS/FAIL/SKIP) is recorded with concrete evidence matching its own feature file's Pass/Fail Criteria column. | P0 |
| REQ-003 | The repo's own committed `.cursor/hooks.json` is confirmed untouched (via `git status --porcelain`) immediately after each isolated-workspace run. | P0 |
| REQ-004 | All `/tmp` test artifacts are deleted after execution; no stray files remain. | P1 |
| REQ-005 | `CU-020`'s blocker (unreviewed, uncommitted `spec-gate-prebind.mjs`) is re-verified fresh at execution time, not carried forward from an earlier phase's snapshot. | P1 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `CU-013` PASS -- probe log shows `sessionStart`, `preToolUse`, `sessionEnd` all present. **MET**.
- **SC-002**: `CU-014` PASS -- probe log shows zero `beforeSubmitPrompt` and zero `stop` entries across a full round trip, with `sessionStart`/`sessionEnd` still firing (harness sanity). **MET**.
- **SC-003**: `CU-020` SKIP (by design) -- file exists, still uncommitted, source intent confirmed, blocker re-validated as still true. **MET**.
- **SC-004**: `CU-021` PASS -- both the unmatched and `matcher:"Task"` `preToolUse` entries fire for the same dispatched `Task` call. **MET**.
- **SC-005**: `git status --porcelain .cursor/hooks.json` returns empty after every run. **MET**.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **A genuine CLI behavior regression could look identical to a harness bug.** Mitigation: `CU-014`'s own sanity check (confirming `sessionStart`/`sessionEnd` still fire in the same log where `beforeSubmitPrompt`/`stop` don't) rules out a broken probe harness as the explanation for zero counts.
- **Re-running isolated-workspace probes could, in principle, touch the repo's real hook state if a `--workspace` flag were mistyped.** Mitigation: explicit `git status --porcelain .cursor/hooks.json` check after every dispatch, confirmed empty each time.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-E01**: Every scenario is executed per its own feature file's exact command sequence, not a paraphrased or shortened variant.

## 8. EDGE CASES
- `spec-gate-prebind.mjs` gets committed/reviewed by its owning session between the playbook's last update and this execution: re-checked fresh immediately before recording `CU-020`'s verdict (still uncommitted at execution time).

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 6/25 | 4 scenario executions, no code changes. |
| Risk | 4/25 | Read-only/isolated-workspace only; repo's real config explicitly verified untouched each time. |
| Research | 3/20 | Scenario contracts already fully specified in existing feature files; no new investigation needed. |
| **Total** | **13/70** | **Level 2** (kept consistent with sibling phases in this packet; LOC is low but this documents load-bearing verification evidence). |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Harness bug produces a false non-firing result for CU-014 | Low | Medium (false confidence in a real gap) | Sanity-checked via sessionStart/sessionEnd still firing in the same log |
| Isolated workspace accidentally touches real repo config | Low | Medium (would corrupt live hook wiring) | Explicit git-status check after every dispatch |

## 11. USER STORIES
- As the operator, I want the hooks scenarios re-run for real in this session (not just cited from an earlier build report), so I have independent confirmation the shipped wiring actually behaves as documented.

## 12. OPEN QUESTIONS
None -- straightforward execution of already-specified scenarios.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../003-cursor-hooks-claude-parity/spec.md` (predecessor)
- `../../spec.md` (phase-parent packet)
- `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-fires-smoke-test.md` (`CU-013`)
- `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md` (`CU-014`)
- `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/spec-gate-prebind-unreviewed.md` (`CU-020`)
- `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md` (`CU-021`)
