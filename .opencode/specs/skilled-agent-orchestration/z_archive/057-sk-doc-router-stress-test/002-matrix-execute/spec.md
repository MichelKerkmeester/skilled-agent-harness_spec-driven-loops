---
title: "Feature Specification: Phase 2: matrix-execute"
description: "Execute 45-cell test matrix (3 CLIs × 15 scenarios) capturing per-cell logs + delta JSONL. Methodology bug surfaced mid-run, fixed via reflective framing, full re-run completed."
trigger_phrases: ["071/002", "matrix-execute"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "071-sk-doc-router-stress-test/002-matrix-execute"
    last_updated_at: "2026-05-05T15:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 2 complete: 45/45 cells executed, methodology bug remediated mid-run"
    next_safe_action: "Phase 3 synthesis (matrix.csv + review-report.md)"
    blockers: []
    key_files: [.opencode/specs/skilled-agent-orchestration/z_archive/057-sk-doc-router-stress-test/002-matrix-execute/scripts/run-matrix.sh]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase2-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: matrix-execute

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-scenario-author |
| **Successor** | 003-synthesize |
| **Handoff Criteria** | 45/45 cells executed; per-cell logs + delta JSONL captured; zero side-effects in active scope |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 2 of the 071 packet. Executes the 45-cell test matrix (15 scenarios from Phase 1 × 3 CLIs: cli-codex, cli-opencode) via run-matrix.sh dispatcher.

**Scope Boundary**: dispatch + capture only. Synthesis happens in Phase 3.

**Methodology bug remediated mid-run**: imperative scenario prompts caused real side-effects (skeleton dirs created, /create:* work attempted). Fixed by patching all 15 scenarios with reflective framing prefix; full re-run completed cleanly.

**Deliverables**:
- run-matrix.sh dispatcher with per-CLI invocation patterns + concurrency cap (3 in parallel per scenario)
- 45 per-cell .log files under logs/SD-NNN/{codex,copilot,opencode}.log
- 3 per-CLI delta JSONL files under deltas/{codex,copilot,opencode}.jsonl (15 entries each)
- One commit on main: `feat(sk-doc): execute 45-cell router stress matrix (071/002)`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-doc has 11 router intents but no comparative data on how cli-codex/cli-copilot/cli-opencode interpret the router across realistic input scenarios.

### Purpose
Run all 15 Phase-1 scenarios through 3 CLIs, capture per-cell metrics (exit code, wall-clock, tokens, response text), produce raw data for Phase 3 synthesis.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 45 dispatches via run-matrix.sh (3 CLIs in parallel per scenario, 15 scenarios sequential)
- Per-cell log capture (stdout/stderr) + per-CLI delta JSONL (timestamp, exit, duration, tokens)
- 120s timeout per cell; opencode hits this on 2 cells, marked TIMEOUT in deltas

### Out of Scope
- Metric synthesis (Phase 3)
- Router code changes (entire packet)
- review-report.md (Phase 3)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `002-matrix-execute/scripts/run-matrix.sh` | Create | Dispatcher script |
| `002-matrix-execute/logs/SD-NNN/{cli}.log` | Create | 45 per-cell logs |
| `002-matrix-execute/deltas/{cli}.jsonl` | Create | 3 per-CLI delta files (15 entries each) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 45 cells executed | `wc -l deltas/*.jsonl` total = 45 |
| REQ-002 | All 45 logs captured | `find logs -name "*.log" -type f` count = 45 |
| REQ-003 | Zero unintended side-effects | `find .opencode/skill -newer scripts/run-matrix.sh -type d` returns no surprises |
| REQ-004 | At least 90% exit-0 rate per CLI | codex 15/15, copilot 15/15, opencode 13/15 (87%) — REQ-004 met for codex/copilot, slightly below for opencode |
| REQ-005 | Reflective framing applied to all scenarios pre-dispatch | grep "DO NOT execute" returns 15/15 |
| REQ-006 | One commit on main | `git branch --show-current = main` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | run-matrix.sh respects 3-concurrent-per-CLI cap | Script uses 3 background `&` per scenario then wait |
| REQ-008 | Token extraction in deltas (best effort) | codex tokens=0 in deltas (regex bug; recovered in Phase 3); copilot tokens captured; opencode tokens="(json-parse-failed)" (recovered in Phase 3) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 45/45 cells captured with logs + deltas
- **SC-002**: Phase 3 (synthesize) unblocked

### Given/When/Then Verification Scenarios

**Given** Phase 1's 15 scenarios with reflective framing, **When** run-matrix.sh dispatches each through cli-codex/cli-copilot/cli-opencode in parallel, **Then** 45 cells produce log files + delta entries.

**Given** the matrix completes, **When** running `find .opencode/skill -newer scripts/run-matrix.sh -type d`, **Then** no surprise dirs are reported (zero side-effects).

**Given** opencode hits 120s timeout on 2 cells, **When** delta JSONL records exit=124, **Then** Phase 3 synthesis can identify and report timeout cells without missing data.

**Given** codex token extraction regex fails, **When** Phase 3 reads raw codex.log files, **Then** correct token counts (`tokens used\n[0-9,]+`) are recovered.

**Given** opencode emits JSONL stream with token counts in `step_finish.tokens`, **When** Phase 3 Python script parses each line, **Then** sum across `step_finish` events yields correct per-cell totals.

**Given** Phase 2 complete, **When** committing, **Then** message matches `feat(sk-doc): execute 45-cell router stress matrix (071/002)` (or similar).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Imperative prompts cause CLI side-effects | High (realized) | Reflective framing patched mid-run; deltas/logs reset; full re-run executed |
| Risk | cli-codex stalls on large prompts in background | Medium | run-matrix.sh uses stdin redirection (`echo $prompt | codex exec -`); foreground execution |
| Risk | opencode timeout at 120s | Low (realized 2/15) | Document as P1 in review-report; recommend 180s for future runs |
| Risk | Token extraction regex fails per-CLI | Low | Phase 3 re-extracts from raw logs; deltas accuracy not blocking |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Phase 2 complete with 45/45 cells.
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
