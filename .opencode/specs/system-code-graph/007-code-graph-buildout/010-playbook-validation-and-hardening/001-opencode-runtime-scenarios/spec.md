---
title: "Feature Specification: OpenCode Runtime Scenarios (Code Graph Playbook 001)"
description: "Run the 15 live-runtime code-graph playbook scenarios via cli-opencode DeepSeek and capture per-scenario PASS/FAIL/SKIP evidence."
trigger_phrases:
  - "opencode runtime scenarios"
  - "code graph live mcp scenarios"
  - "029 phase 001 opencode runtime"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/010-playbook-validation-and-hardening/001-opencode-runtime-scenarios"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 001 plan for live-runtime scenario dispatch"
    next_safe_action: "Dispatch group 01-02 scenarios to cli-opencode after operator green-light"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-26-code-graph-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: OpenCode Runtime Scenarios (Code Graph Playbook 001)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
15 of the 22 code-graph playbook scenarios require the live `mk-code-index` MCP runtime (scan, query, verify, status, context, detect_changes), the deep-loop coverage-graph runtime, or the doctor-code-graph slash surface. None of these tools are registered in the orchestrating Claude Code runtime.

### Purpose
Run these 15 scenarios inside `cli-opencode` (which loads the full project plugin/skill/MCP runtime) and capture per-scenario evidence so the parent release-readiness matrix can be assembled.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Scenarios 001, 002 (read-path freshness); 003-006 (scan/verify/status); 007, 024 (detect_changes); 008 (context); 009, 010 (coverage graph); 011, 022 (MCP tool surface); 015, 023 (doctor).
- Dispatch via `opencode run --model deepseek/deepseek-v4-pro --variant high --format json --dir <repo-root>`.
- Disposable-workspace copies for any mutating scenario.

### Out of Scope
- Static manifest/build/hook scenarios (016-021, 025) — those are phase 002.
- Fixing defects surfaced by a FAIL verdict.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/dispatch-*.md` | Create | Rendered dispatch prompts per scenario batch |
| `scratch/evidence-*.json` | Create | Captured JSON event streams / payload excerpts |
| `evidence.md` | Create | Per-scenario verdict table with JSON proof |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 15 scenarios dispatched and a verdict recorded | 15 rows in `evidence.md`, each PASS/FAIL/SKIP with one reason |
| REQ-002 | Each verdict cites JSON field evidence | Verdict row links to a `scratch/evidence-*.json` excerpt |
| REQ-003 | No mutation of the live repo graph DB | Mutating scenarios run against a disposable workspace copy |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Single-dispatch discipline honored | One cli-opencode dispatch at a time, killed before next, unless operator authorizes parallel |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 15/15 live-runtime scenarios have a recorded verdict with evidence.
- **SC-002**: Any FAIL is logged with reproducing command and JSON, not silently fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek API provider configured in opencode | Blocks all dispatch | Confirmed present at pre-flight (`opencode providers list`) |
| Risk | deepseek-v4-pro slow (>15 min/dispatch) | Long runtime | Batch related scenarios per dispatch; ≥25-min timeouts |
| Risk | Mutating scenario hits live DB | Corrupts graph index | Disposable workspace copy + no `--dangerously-skip-permissions` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Per-dispatch timeout ≥ 25 minutes for deepseek-v4-pro batches.

### Security
- **NFR-S01**: No secrets in dispatch prompts; spec folder passed as pre-approved.

### Reliability
- **NFR-R01**: Each dispatch captured with `2>&1 </dev/null`; failures surface to orchestrator.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty/stale graph: scenario expects readiness block or self-heal, not a hidden full scan.
- Malformed MCP call (011): expects field-specific `status:"error"`.

### Error Scenarios
- Provider auth failure mid-dispatch: rerun pre-flight, do not substitute model silently.
- Dispatch hang: SIGKILL `opencode run`, record SKIP with reason, retry once.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 15 scenarios, multi-batch dispatch |
| Risk | 12/25 | Read-mostly; disposable workspaces bound risk |
| Research | 8/20 | Playbook + runtime already understood |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Batch granularity: one dispatch per playbook group, or one mega-dispatch for all 15?
<!-- /ANCHOR:questions -->
