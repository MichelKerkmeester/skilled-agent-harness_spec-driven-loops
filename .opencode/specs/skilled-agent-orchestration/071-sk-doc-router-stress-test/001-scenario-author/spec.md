---
title: "Feature Specification: Phase 1: scenario-author"
description: "Author NEW sk-doc/manual_testing_playbook/ with 5 categories x 3 scenarios = 15 scenarios + index. Closes a real gap (sk-doc had no manual_testing_playbook before)."
trigger_phrases:
  - "071/001"
  - "scenario-author"
  - "sk-doc playbook scaffold"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "071-sk-doc-router-stress-test/001-scenario-author"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored phase 1 spec.md while cli-copilot scaffolds 16 files"
    next_safe_action: "Wait for copilot completion, validate scenarios, commit"
    blockers: []
    key_files:
      - .opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase1-authoring"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: scenario-author

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-matrix-execute |
| **Handoff Criteria** | 15 scenario .md files exist across 5 categories + 1 index file; each scenario has expected_intent, expected_resources, success criteria; commit on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 1 of the 071 packet. It creates `.opencode/skills/sk-doc/manual_testing_playbook/` from scratch — sk-doc previously had no test playbook (just `assets/testing_playbook/` templates for OTHER projects).

**Scope Boundary**: 15 scenario .md files + 1 top-level index. NO router code changes. NO test execution (Phase 2 handles execution). NO synthesis (Phase 3 handles).

**Dependencies**:
- sk-doc/SKILL.md §2 Smart Routing already defines INTENT_MODEL, RESOURCE_MAP (11 intents)
- sk-code/manual_testing_playbook/01--surface-detection/001-webflow-detection.md as structural template

**Deliverables**:
- 5 categories (intent-detection, resource-loading, unknown-fallback, cross-cli-dispatch, token-cost-baseline)
- 3 scenarios per category = 15 scenarios (SD-001 .. SD-015)
- Top-level manual_testing_playbook.md index
- One commit on main: `feat(sk-doc): scaffold manual_testing_playbook (071/001)`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-doc has a smart router with 11 distinct intents but NO test playbook to verify router behavior across model interpretations. Other skills (sk-code, sk-improve-agent, sk-deep-research, sk-deep-review) have manual_testing_playbook folders; sk-doc is the gap.

### Purpose
Author 15 representative scenarios that exercise sk-doc's router across intent classification, resource loading, unknown-fallback escalation, cross-CLI dispatch, and token cost baselines. These scenarios become the input dataset for Phase 2's 45-cell test matrix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 15 scenario .md files under `.opencode/skills/sk-doc/manual_testing_playbook/<category>/<scenario>.md`
- 1 top-level `manual_testing_playbook.md` index
- Each scenario has frontmatter (id, category, expected_intent, expected_resources, expected_token_range), Setup, Expected Behavior, Cross-CLI Variants, Success Criteria
- Authored by cli-copilot in one batched dispatch

### Out of Scope
- Test execution (Phase 2)
- Metric extraction (Phase 2/3)
- Synthesis (Phase 3)
- Router code changes (entire packet)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/manual_testing_playbook/{01-05}/{001-003}-*.md` | Create | 15 scenarios |
| `.opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md` | Create | Index |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 15 scenario files created across 5 categories | `find .opencode/skills/sk-doc/manual_testing_playbook -name "[0-9][0-9][0-9]-*.md" \| wc -l` returns 15 |
| REQ-002 | Each scenario has required frontmatter fields | grep -L "expected_intent:\|expected_resources:" returns no files |
| REQ-003 | Top-level index exists | `test -f .opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md` |
| REQ-004 | Each scenario references a valid intent from sk-doc's RESOURCE_MAP | Manual review confirms expected_intent ∈ {DOC_QUALITY, OPTIMIZATION, SKILL_CREATION, AGENT_COMMAND, FLOWCHART, INSTALL_GUIDE, HVR, PLAYBOOK, FEATURE_CATALOG, README_CREATION, CHANGELOG, UNKNOWN_FALLBACK} |
| REQ-005 | All 5 categories have exactly 3 scenarios | `for d in .opencode/skills/sk-doc/manual_testing_playbook/[0-9]*/; do echo "$d: $(ls $d | wc -l)"; done` shows 3 each |
| REQ-006 | One commit on main; no surviving feature branch | `git branch --show-current = main` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Cross-CLI Variants section in each scenario lists codex/copilot/opencode behaviors | grep "cli-codex\|cli-copilot\|cli-opencode" present in each scenario |
| REQ-008 | Success Criteria section in each scenario is actionable | Manual review confirms criteria are measurable, not vague |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 16 files (15 scenarios + 1 index) shipped on main
- **SC-002**: Phase 2 (matrix-execute) unblocked

### Given/When/Then Verification Scenarios

**Given** sk-doc has 11 intents in RESOURCE_MAP, **When** authoring 15 scenarios across 5 categories, **Then** at least 7 distinct intents are covered (representative subset).

**Given** sk-code/manual_testing_playbook/01--surface-detection/001-webflow-detection.md as template, **When** authoring sk-doc scenario files, **Then** they follow the same frontmatter + Setup + Expected Behavior + Cross-CLI Variants + Success Criteria structure.

**Given** cli-copilot dispatched with the authoring prompt, **When** it completes, **Then** all 16 files exist with non-empty content.

**Given** all 16 files exist, **When** running `wc -l .opencode/skills/sk-doc/manual_testing_playbook/*/*.md`, **Then** each scenario is 30-80 lines (not bloated, not stub).

**Given** all scenarios authored, **When** committing, **Then** message matches `feat(sk-doc): scaffold manual_testing_playbook (071/001)`.

**Given** commit lands, **When** running `git branch --show-current`, **Then** returns `main`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-copilot reliable for batch authoring | High | Proven reliable in 7-iter deep-review run earlier this session |
| Risk | Copilot generates stub scenarios | Low | Prompt enforces 30-50 lines per scenario; manual review post-completion |
| Risk | Expected_intent values inconsistent with RESOURCE_MAP | Low | Prompt enumerates valid intent names; manual cross-check at REQ-004 |
| Risk | Scenarios miss representative intent coverage | Medium | Category structure forces intent diversity (intent-detection covers DOC_QUALITY/SKILL_CREATION/AGENT_COMMAND; resource-loading covers HVR/FLOWCHART/README_CREATION; etc.) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — Phase 1 scope is well-defined. Authoring delegated to cli-copilot.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE
-->


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
