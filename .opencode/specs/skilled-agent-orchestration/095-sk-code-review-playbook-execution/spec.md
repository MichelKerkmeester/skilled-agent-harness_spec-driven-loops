---
title: "Feature Specification: 095 - execute sk-code-review manual_testing_playbook via cli-opencode + deepseek"
description: "Run all 18 sk-code-review playbook scenarios (CR-001..CR-018) using cli-opencode with DeepSeek as the provider; capture per-scenario verdict (PASS/PARTIAL/FAIL/SKIP) plus evidence; produce aggregated results report."
trigger_phrases:
  - "095 sk-code-review playbook execution"
  - "run sk-code-review playbook deepseek"
  - "execute playbook scenarios opencode deepseek"
importance_tier: "normal"
contextType: "skill-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/095-sk-code-review-playbook-execution"
    last_updated_at: "2026-05-07T13:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded Level 1 packet"
    next_safe_action: "Design dispatch loop"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code-review/manual_testing_playbook/"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 095 - execute sk-code-review playbook via cli-opencode + deepseek

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code-review playbook (just shipped via packet 093, naturalized via packet 094) has 18 scenarios but no actual execution-against-deepseek baseline. We don't yet know how DeepSeek-class models perform on findings-first code review under the sk-code-review baseline doctrine.

### Purpose
Execute all 18 sk-code-review playbook scenarios (CR-001..CR-018) using `opencode run --model deepseek/<model>` and capture per-scenario PASS/PARTIAL/FAIL/SKIP verdicts plus output transcripts so the user can assess DeepSeek's review-quality fitness.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Execute 18 sk-code-review scenarios via `opencode run --model deepseek/<model>`.
- Capture per-scenario stdout transcript + concise verdict against the playbook's pass/fail criteria.
- Aggregate results into a single results table for the user.
- Spec packet docs (Level 1: spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json).

### Out of Scope
- Modifying the sk-code-review skill or its playbook.
- Comparing DeepSeek to other providers (separate packet if desired).
- Auto-grading the verdicts — orchestrator-driven judgment per scenario's pass/fail criteria.
- Shipping a re-runnable harness script as a permanent artifact (this is a one-shot execution baseline).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/095-sk-code-review-playbook-execution/**` | Create | Level 1 spec packet docs |
| `.opencode/specs/skilled-agent-orchestration/graph-metadata.json` | Modify | Append 095 to children_ids |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 18 scenarios dispatched to opencode + deepseek | 18 transcripts captured |
| REQ-002 | Per-scenario verdict assigned per the playbook's pass/fail criteria | Each transcript reviewed and PASS/PARTIAL/FAIL/SKIP recorded |
| REQ-003 | Aggregated results table produced for user | Table shows scenario ID, scenario name, verdict, brief rationale |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Per-scenario evidence preserved | Logs in `/tmp/095-deepseek-CR-NNN.log` or similar; orchestrator can re-inspect |
| REQ-011 | Failed/skipped scenarios documented | If opencode + deepseek can't run a scenario (e.g., requires interactive operator), mark SKIP with reason |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 18 scenarios executed and transcripts captured.
- **SC-002**: Aggregated PASS/PARTIAL/FAIL/SKIP table delivered to user.
- **SC-003**: Spec packet validates clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | DeepSeek session pollution between dispatches | Med | Use `--format json` and avoid `--continue` |
| Risk | Several scenarios are sandbox-bound (e.g., GIT-style refusals) and cannot run as-is | Med | Sandbox-bound scenarios marked SKIP with reason; only review-style scenarios fully execute |
| Risk | Wall-clock cost at 18 dispatches × ~2-5 min/each | Low | Run sequentially; ~45-90 min total acceptable |
| Dependency | opencode CLI installed + DeepSeek auth configured | Green | Verified: opencode 1.14.39 present; DeepSeek + OpenCode Go credentials configured |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none - all clarifications resolved during planning)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Source playbook**: `.opencode/skills/sk-code-review/manual_testing_playbook/`
