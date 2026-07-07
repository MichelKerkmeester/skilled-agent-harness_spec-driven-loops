---
title: "Feature Specification: Wave 007 - Shared Base & Parity Core"
description: "Executes 5 real cli-opencode dispatches (SR-004, PB-001, PB-002, PB-004, PB-005) against sk-design's shared-reference-base and parity-behavior manual_testing_playbook scenarios, grading each against its own file's Pass/Fail Criteria."
trigger_phrases:
  - "wave 007 shared base parity core"
  - "SR-004 PB-001 PB-002 PB-004 PB-005"
  - "shared reference base routing-only proof"
  - "parity behavior procedure selection proof"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/007-shared-base-and-parity-core"
    last_updated_at: "2026-07-07T17:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Ran + graded 5 dispatches"
    next_safe_action: "Run validate.sh --strict"
    blockers: []
    key_files:
      - "dispatch-log.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-007-shared-base-parity-core"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Wave 007 - Shared Base & Parity Core

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 023 (full manual playbook execution) requires every `manual_testing_playbook` scenario to be dispatched for real through `cli-opencode` with the raw scenario prompt, not the Lane C harness's routing-analysis-only wrapper, and graded against that scenario file's own Pass/Fail Criteria. Wave 007 owns the shared-reference-base ownership proof (`SR-004`) plus four of the parity-behavior procedure-selection-proof scenarios (`PB-001`, `PB-002`, `PB-004`, `PB-005`) — no prior real dispatch evidence existed for any of these five.

### Purpose

Run the validated dispatch recipe (advisor probe via `skill_advisor.py`, then a real `opencode run` dispatch with the standardized addendum) for each of the 5 assigned scenarios, capture the full JSON-lines response, and grade PASS/PARTIAL/FAIL/SKIP strictly against each scenario file's own Pass/Fail Criteria section.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Advisor probe (`skill_advisor.py --threshold 0.8`) for each of the 5 dispatch prompts, using the clean exact prompt with no addendum.
- Real orchestrator dispatch via `timeout 300 opencode run --model openai/gpt-5.5-fast --variant medium --format json` for each of the 5 scenarios (6 total `opencode run` invocations, since `PB-005` requires its negative-control variant per its own Exact Command Sequence step 4).
- Capturing full JSON-lines stdout under `/tmp/skd-<dispatch-id>-response.jsonl` for each dispatch.
- Grading each dispatch PASS/PARTIAL/FAIL/SKIP strictly against the constituent scenario file's own Pass/Fail Criteria section, citing the specific criterion line.
- Authoring this Level 2 spec-folder documentation set plus `dispatch-log.md`.

### Out of Scope

- Any other wave's scenarios (`001`-`006`, `008`-`010` are owned by sibling wave agents).
- Editing the scenario files, `mode-registry.json`, `hub-router.json`, or any sk-design skill source — this wave is read-only evaluation, no repo documentation or code changes are in scope for the dispatch exchanges themselves.
- Building the phase-023 parent rollup (`verdict-matrix.md`, parent `implementation-summary.md`) — owned by the orchestrating session per its own task list.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/007-shared-base-and-parity-core/spec.md` | Create | This spec |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/007-shared-base-and-parity-core/plan.md` | Create | Implementation plan |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/007-shared-base-and-parity-core/tasks.md` | Create | Task breakdown |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/007-shared-base-and-parity-core/checklist.md` | Create | Verification checklist |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/007-shared-base-and-parity-core/implementation-summary.md` | Create | Delivered summary |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/007-shared-base-and-parity-core/dispatch-log.md` | Create | Per-dispatch row log |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every one of the 5 assigned scenarios gets an advisor probe + real dispatch, run one at a time (sequential, no self-parallelism) | 6 `opencode run` invocations total (5 primary + 1 `PB-005` negative control), each captured to its own `.jsonl` file |
| REQ-002 | Each dispatch is graded strictly against its own scenario file's Pass/Fail Criteria section | `dispatch-log.md` cites the specific criterion line for every verdict |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Advisor-probe divergences (native daemon unavailable → local fallback scorer) are recorded honestly, not smoothed over | `dispatch-log.md` and `implementation-summary.md` note the two fallback occurrences (`PB-002`, `PB-005` primary) and their effect on grading |
| REQ-004 | Documentation matches the Level 2 shape used by sibling phase `022-benchmark-rerun-and-coverage-fill/` | `validate.sh --strict` passes with 0 errors |
| REQ-005 | `PB-005`'s negative-control variant is dispatched, not skipped, since the scenario's own Exact Command Sequence requires it | A separate `opencode run` invocation for the negative-control prompt is captured and graded alongside the primary prompt |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** all 5 dispatches are run, **Then** each has a documented advisor top-1/confidence, resolved mode/packet/procedure card, and PASS/PARTIAL/FAIL/SKIP verdict citing the specific scenario criterion.
- **SC-002**: **Given** `dispatch-log.md` is read, **Then** every row traces to a real `/tmp/skd-*-response.jsonl` capture, not a paraphrase or assumption.
- **SC-003**: **Given** `validate.sh --strict` is run against this folder, **Then** it exits 0 with no errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Native skill-advisor daemon intermittently unavailable, degrading the standalone probe to a local fallback scorer that disagrees with the native ranking | Medium | Recorded honestly per dispatch; the live orchestrator's own internal advisor tool call (captured inside the `.jsonl` response) is treated as the more authoritative live signal when it diverges from the standalone probe |
| Risk | `opencode run` calls can exceed foreground patience and get auto-backgrounded by the harness | Low | Notification-driven wait, no polling; confirmed working for the `PB-005` negative-control dispatch |
| Dependency | `cli-opencode`'s one-dispatch-at-a-time rule | High | All 6 `opencode run` invocations executed strictly sequentially within this session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — all 5 scenarios dispatched and graded within this wave's scope.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: `dispatch-log.md`'s one-row-per-dispatch shape (dispatch_id, scenario_id, exact prompt, advisor top-1/confidence, resolved mode/packet/resources, verdict, rationale) is reusable by sibling wave folders for the phase-023 parent rollup.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- `PB-005` is the only scenario in this wave whose own Exact Command Sequence requires a second dispatch (the negative-control variant) to reach a real PASS verdict; both variants were run and both are logged as separate rows sharing the `PB-005` scenario id.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 5 assigned scenarios, 6 real dispatches, no source-code changes |
| Risk | 3/25 | Read-only evaluation dispatches; no mutating tools permitted or observed |
| Research | 6/20 | Reading 5 scenario files in full plus one reference sibling phase for doc shape |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Parent Phase**: `../` (`023-full-manual-playbook-execution/`, the phase-parent orchestrating all 10 waves)
- **Sibling Reference**: `../022-benchmark-rerun-and-coverage-fill/` (the exact Level 2 doc-shape template this wave mirrored)
- **Scenario Sources**: `.opencode/skills/sk-design/manual_testing_playbook/05--shared-reference-base/hub-routing-only.md`, `.opencode/skills/sk-design/manual_testing_playbook/06--parity-behavior/{procedure-selection-proof,context-proof-gates,motion-procedure-selection-proof,audit-procedure-selection-proof}.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Dispatch Log**: See `dispatch-log.md`
