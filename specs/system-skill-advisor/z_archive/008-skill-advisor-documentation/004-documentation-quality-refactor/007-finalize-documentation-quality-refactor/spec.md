---
title: "Feature Specification: 007-finalize-documentation-quality-refactor (cli-opencode + DeepSeek API single-dispatch)"
description: "Close all remaining deferred items from 006 Known Limitations via one automated cli-opencode dispatch with DeepSeek API: semicolon HVR sweep, F34 playbook restructure, 4 new ref docs, Tier D decisions documented in a deferred-decisions ref."
trigger_phrases:
  - "skill-advisor deferred final"
  - "007 deferred final"
  - "cli-opencode deepseek deferred dispatch"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/008-skill-advisor-documentation/004-documentation-quality-refactor/007-finalize-documentation-quality-refactor"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded 007"
    next_safe_action: "Dispatch cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Feature Specification: 007-finalize-documentation-quality-refactor

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Recovery baseline** | git HEAD `956595dbdbe9a76297b50257be7e0a6feb13de7a` at dispatch time |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After 006 closed Tier A + Tier B + bulk Oxford comma sweep, the remaining deferred backlog covers: 135 semicolons (context-aware HVR sweep), F34 playbook TEST EXECUTION structure across 20 files, F4/F6/F35/F36/F37 architectural decisions, plus 4 net new reference docs. The user asked to close all of this in one automated cli-opencode dispatch via DeepSeek API.

### Purpose
Dispatch a single `opencode run --model deepseek/deepseek-v4-pro` job with scope-locked prompt covering: semicolon sweep, playbook restructure, 4 new ref docs, plus a deferred-decisions.md doc that captures the Tier D choices for human review.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (automated by dispatch)

1. **Semicolon HVR sweep** (~135 instances): context-aware replace. Body text `; ` → `. ` plus capitalize next letter. Skip semicolons inside code fences, inline backticks, URLs, YAML frontmatter values.
2. **F34 playbook TEST EXECUTION restructure** (20 files in categories 05-08): adopt canonical sk-doc template structure (`### Prompt`, `### Commands`, `### Expected`, `### Evidence`, `### Pass / Fail`, `### Failure Triage`) OR document the deviation as intentional in a per-category README if restructure is too risky. Pick the safer option per file.
3. **4 new reference docs** authored from research findings:
   - `references/skill-graph-query-cookbook.md` (worked examples for all 10 query types)
   - `references/validation-baselines.md` (baseline metrics + troubleshooting)
   - `references/daemon-lease-contract.md` (lease semantics + contention recovery)
   - `references/skill-graph-drift.md` (SQL vs graph-metadata.json reconciliation)
4. **Deferred-decisions doc** `.opencode/skills/system-skill-advisor/references/deferred-decisions.md`: documents F4 (Devin hooks migration), F6 (dual hook locations), F35/F36/F37 (numbering gaps) with proposed actions + status. NO actual runtime config or numbering changes — pure documentation of the decisions for human review.

### Out of Scope
- Actual `.devin/hooks.v1.json` runtime config changes (Tier D F4 deferred to human approval).
- Actual hooks/ directory cleanup or deprecation (Tier D F6 same).
- Actual catalog/playbook renumbering (Tier D F35/F36/F37 same).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| ~30 .md files under `.opencode/skills/system-skill-advisor/` excluding `changelog/`, `node_modules/`, `dist/` | Modify | Semicolon HVR sweep |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/0[5-8]--*/*.md` (20 files) | Modify or Annotate | F34 restructure or deviation doc |
| `.opencode/skills/system-skill-advisor/references/skill-graph-query-cookbook.md` | Create | New ref doc |
| `.opencode/skills/system-skill-advisor/references/validation-baselines.md` | Create | New ref doc |
| `.opencode/skills/system-skill-advisor/references/daemon-lease-contract.md` | Create | New ref doc |
| `.opencode/skills/system-skill-advisor/references/skill-graph-drift.md` | Create | New ref doc |
| `.opencode/skills/system-skill-advisor/references/deferred-decisions.md` | Create | Tier D decision rationale doc |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Semicolon count package-wide drops by ≥ 80% | `grep -c ';'` in authored files (excluding code fences) drops from 135 to ≤ 27 |
| REQ-002 | 4 new ref docs ship with sk-doc skill_reference template | Each file passes anchor + frontmatter checks |
| REQ-003 | deferred-decisions.md ships with proposed Tier D actions | File exists, lists F4/F6/F35/F36/F37 with status + recommendation |
| REQ-004 | No grammar regressions from semicolon sweep | Manual spot-check 5 random files post-sweep |
| REQ-005 | No out-of-scope writes | Recovery-baseline git diff shows only ALLOWED WRITE PATHS modified |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | F34 either restructured OR documented as intentional | Either 20 files use canonical TEST EXECUTION structure OR deviation noted in per-category README |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --strict` on this child passes (0 errors)
- **SC-002**: Semicolon HVR violations drop to ≤ 27 in authored files
- **SC-003**: All 7 packets (parent + 001-007) pass strict-validate
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | DeepSeek dispatch makes out-of-scope writes (RM-8) | High | Prompt includes explicit BANNED OPERATIONS + ALLOWED WRITE PATHS; recovery-baseline git HEAD recorded; post-dispatch git-diff scope verification |
| Risk | Semicolon sweep produces ungrammatical output | Medium | Prompt requires context-aware editing with capitalization; spot-check 5 files post-dispatch |
| Risk | F34 restructure is too aggressive plus breaks scenario semantics | Medium | Prompt gives per-file choice: restructure OR document deviation. Bias toward documentation. |
| Dependency | DeepSeek API configured | Green | Verified via `opencode providers list` |
| Dependency | opencode v1.15.1 installed | Green | Verified |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for the automated scope. Tier D F4/F6 runtime changes stay for explicit human approval after reviewing deferred-decisions.md.
<!-- /ANCHOR:questions -->
