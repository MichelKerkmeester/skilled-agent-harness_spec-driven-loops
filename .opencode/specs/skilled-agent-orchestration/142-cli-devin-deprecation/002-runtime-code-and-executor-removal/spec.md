---
title: "Feature Specification: Phase 2: runtime-code-and-executor-removal"
description: "cli-devin was wired into the deep-loop runtime executor layer (executor-config.ts EXECUTOR_KINDS + DEVIN_SUPPORTED_MODELS + permission/valid"
trigger_phrases:
  - "cli-devin deprecation phase 2"
  - "runtime-code-and-executor-removal"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/142-cli-devin-deprecation/002-runtime-code-and-executor-removal"
    last_updated_at: "2026-06-08T17:34:13.174Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 2 complete: runtime-code-and-executor-removal executed and verified"
    next_safe_action: "Proceed to phase 3"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: runtime-code-and-executor-removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-canonical-rehome-and-ci-gate |
| **Successor** | 003-registry-graph-and-skill-advisor-removal |
| **Handoff Criteria** | deep-loop-runtime executor tests green (56) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the cli-devin deprecation specification. The verified, line-resolved edit list lives in ../context/context-report.md §2.

**Scope Boundary**: executor-config.ts / executor-audit.ts / fanout-run.cjs cli-devin removal + swe-1.6 hard-code removal

**Dependencies**:
- Predecessor phase 001-canonical-rehome-and-ci-gate complete

**Deliverables**:
- executor-config.ts / executor-audit.ts / fanout-run.cjs cli-devin removal + swe-1.6 hard-code removal
- dispatch-model.cjs + profile-validator.cjs KNOWN_EXECUTORS
- executor unit tests adjusted
- 5 deep-loop YAMLs (if_cli_devin blocks + seat notes) + 6 command docs (executor enums)

**Changelog**:
- Phase work recorded in implementation-summary.md.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli-devin was wired into the deep-loop runtime executor layer (executor-config.ts EXECUTOR_KINDS + DEVIN_SUPPORTED_MODELS + permission/validation, executor-audit.ts lookup maps, fanout-run.cjs dispatch branch), the deep-improvement model-benchmark dispatcher (two hand-synced KNOWN_EXECUTORS sets), and the five deep-loop command YAMLs (if_cli_devin blocks + executor enums). Left in place these route to a non-existent skill.

### Purpose
Remove cli-devin as an executor kind from all runtime dispatch code and command workflows, keeping the remaining executors (native, cli-codex, cli-claude-code, cli-opencode) sound.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- executor-config.ts / executor-audit.ts / fanout-run.cjs cli-devin removal + swe-1.6 hard-code removal
- dispatch-model.cjs + profile-validator.cjs KNOWN_EXECUTORS
- executor unit tests adjusted
- 5 deep-loop YAMLs (if_cli_devin blocks + seat notes) + 6 command docs (executor enums)

### Out of Scope
- Registry/graph (phase 003)
- Agent rosters / governance (phase 004)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modify | Removed cli-devin from EXECUTOR_KINDS + DEVIN_* consts/types/guards |
| `deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Modify | Removed 5 cli-devin lookup-map entries |
| `deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Removed cli-devin dispatch branch + permission triad |
| `deep-improvement/.../dispatch-model.cjs + profile-validator.cjs` | Modify | Removed cli-devin from KNOWN_EXECUTORS |
| `commands/deep/assets/*.yaml + start-*-loop.md` | Modify | Removed if_cli_devin blocks + executor enums |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | cli-devin not in any EXECUTOR_KINDS / KNOWN_EXECUTORS | grep 0 + tests green |
| REQ-002 | Remaining executors still dispatch correctly | executor unit tests pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No swe-1.6 hard-code in runtime | grep 0 in runtime code |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: deep-loop-runtime executor tests green (56)
- **SC-002**: deep-improvement remediation tests green (23)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Predecessor phase 001-canonical-rehome-and-ci-gate | Blocks start | Completed before this phase |
| Risk | Dangling reference after edits | Med | Global grep verification + deep review |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — phase complete and verified.
<!-- /ANCHOR:questions -->
