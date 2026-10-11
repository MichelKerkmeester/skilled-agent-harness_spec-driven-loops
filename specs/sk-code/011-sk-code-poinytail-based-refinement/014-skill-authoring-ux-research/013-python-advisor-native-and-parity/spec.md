---
title: "Feature Specification: Phase 13: python-advisor-native-and-parity"
description: "Keep skill_advisor.py on the native scorer after the daemon idles out, port the path and doc-target rules, and make both batteries refuse a non-native row."
trigger_phrases:
  - "python advisor native and parity"
  - "phase 13 python advisor native and parity"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: python-advisor-native-and-parity

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/095-skill-authoring-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 9 |
| **Predecessor** | 012-advisor-doc-target-and-engines |
| **Successor** | 014-gate-index-and-deletions |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the skill authoring UX phase parent. It remediates findings from `../001-authoring-ux-research/research/research.md`.

**Scope Boundary**: Only the files in the table below change. Document content owned by the parallel feature-catalog track is handed off, not edited.

**Dependencies**:
- The research in `../001-authoring-ux-research/`.
- The DeepSeek V4.1 Flash builder through cli-pi, verified by the orchestrator.

**Deliverables**:
- Keep skill_advisor.py on the native scorer after the daemon idles out, port the path and doc-target rules, and make both batteries refuse a non-native row.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
skill_advisor.py --force-native reports freshness unavailable whenever the advisor daemon has shut down on its idle timeout, because shutdown publishes generation state unavailable and the bridge probe accepts only live or stale, although the index content hashes match disk. The default path then falls back to the local Python scorer, which lacks the path and doc-target rules (P2-07), and both battery scripts score that fallback silently.

### Purpose
Make the native path usable whenever the index is fresh, bring the fallback scorer in line, and stop a degraded run from posing as a battery result.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The bridge probe in `skill_advisor.py`.
- The Python explicit name and author matching.
- Both battery scripts.

### Out of Scope
- The daemon shutdown contract that publishes unavailable, which other readers rely on.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | Bridge eligibility and the two rules |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | Modify | Cases for both |
| `007-advisor-name-mention-scoring/scratch/advisor-battery.py`, `../011-round-four-remediation/003-hub-surface-precedence/scratch/advisor-battery.cjs` | Modify | Fail on a non-native row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | --force-native works after an idle shutdown | Exit 0 with recommendations while the generation file reads unavailable |
| REQ-002 | Python fallback skips path and doc-target mentions | pytest cases pass and fail before |
| REQ-003 | Batteries refuse a non-native row | Each exits non-zero when a row is not native |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-090 | Strict validation of this phase passes | validate.sh --strict prints RESULT: PASSED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every completion criterion in goal.md passes when the orchestrator reruns it.
- **SC-002**: The phase lands as one conventional commit in the worktree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | LLM Gateway route for DeepSeek V4.1 Flash | The build cannot start | Switch to the cline route; if that is limited too, wait for the reset |
| Risk | A builder report is a claim | High | The orchestrator reruns every check itself |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
