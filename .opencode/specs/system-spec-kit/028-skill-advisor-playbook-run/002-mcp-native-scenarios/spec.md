---
title: "Feature Specification: MCP-Native Scenarios (Playbook Run Phase 002)"
description: "Execute the native MCP tool scenarios NC-001..009 of the skill-advisor playbook locally via the mk_skill_advisor MCP tools, capturing envelopes and assigning verdicts."
trigger_phrases:
  - "playbook mcp native scenarios"
  - "NC scenarios skill advisor"
  - "028 phase 002"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/002-mcp-native-scenarios"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "Executed NC native scenarios"
    next_safe_action: "Phase 003 CLI hooks"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: MCP-Native Scenarios (Playbook Run Phase 002)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The native MCP tool scenarios NC-001..009 exercise `advisor_recommend`, `advisor_status`, `advisor_validate`, `advisor_rebuild`, `skill_graph_status/query/validate`. These tools are registered in the operating runtime and can only be exercised by the in-session agent (a CLI subagent cannot call them), so this phase runs them locally.

### Purpose
Confirm the native advisor surface returns prompt-safe, correctly-shaped envelopes and surface any drift between documented expected signals and live behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- NC-001 recommend happy path; NC-002 status transitions; NC-003 validate slice bundle; NC-004 ambiguous brief; NC-005 lifecycle redirect; NC-006 status/rebuild separation; NC-007/008/009 skill graph status/query/validate.

### Out of Scope
- Stale/absent disposable-workspace simulations for NC-002 and NC-006 stale-repair half (deferred — no disposable+daemon harness this session).
- Remediating the accuracy-regression finding.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `/tmp/skill-advisor-playbook/*.json` | Evidence | Captured MCP envelopes (untracked) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each NC scenario executed | A verdict + evidence recorded for NC-001..009 |
| REQ-002 | Prompt-safety holds | No raw prompt literal in any attribution/metadata field |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Drift surfaced as findings | Any expected-signal mismatch recorded with evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 NC scenarios carry a recorded verdict.
- **SC-002**: The advisor_validate accuracy regression is quantified against the documented baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live skill-graph DB | Recommendations depend on it | Confirmed live in phase 001 |
| Risk | Heavy `advisor_validate` run mutates metrics | Telemetry counts shift | Read-only baseline call; documented |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each recommend/status call returns within interactive latency (sub-second observed).

### Security
- **NFR-S01**: Prompt text must never appear in laneBreakdown, trustState, cache, warnings or abstainReasons.

### Reliability
- **NFR-R01**: `advisor_status` is diagnostic-only and never advances generation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not exercised (all prompts substantive).
- Maximum length: not exercised.
- Invalid format: `advisor_validate` outcomeEvents not exposed in the current MCP schema (additionalProperties:false) — focused-injection sub-step of NC-003 not callable via MCP.

### Error Scenarios
- External service failure: N/A (local MCP).
- Network timeout: N/A.
- Concurrent access: force rebuild bumped generation 4463 to 4464 cleanly.

### State Transitions
- Partial completion: NC-002 stale/absent and NC-006 stale-repair require disposable copies — deferred.
- Session expiry: advisor MCP server disconnected after the force rebuild (benign; all NC results already captured).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 9 scenarios, 7 distinct tools |
| Risk | 6/25 | Read-only except one force rebuild |
| Research | 8/20 | Map scenarios to tool calls + expected signals |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the corpus skill-ID drift (`sk-deep-research`/`sk-deep-review` gold labels vs live `deep-research`/`deep-review` graph IDs) be fixed in the corpus or the graph? Recorded for triage.
<!-- /ANCHOR:questions -->
