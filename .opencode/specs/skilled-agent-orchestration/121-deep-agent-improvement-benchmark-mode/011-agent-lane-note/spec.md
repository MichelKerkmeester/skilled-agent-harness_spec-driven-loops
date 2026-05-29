---
title: "Feature Specification: Phase 11: agent-lane-note"
description: "The @deep-agent-improvement agent note framed the skill as agent-improvement plus a model-benchmark mode bolt-on, which under-described the now co-equal Lane B and could mislead readers into thinking Lane B spawns a second Claude agent."
trigger_phrases:
  - "agent lane note"
  - "lane awareness"
  - "deep-agent-improvement agent mirrors"
  - "mode awareness to lane awareness"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/011-agent-lane-note"
    last_updated_at: "2026-05-29T07:36:07Z"
    last_updated_by: "build-agent"
    recent_action: "Spec filled for Lane awareness note upgrade across 4 mirrors"
    next_safe_action: "Edit 4 mirror notes byte-identical then validate"
    blockers: []
    key_files:
      - ".opencode/agents/deep-agent-improvement.md"
      - ".claude/agents/deep-agent-improvement.md"
      - ".gemini/agents/deep-agent-improvement.md"
      - ".codex/agents/deep-agent-improvement.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/011-agent-lane-note"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: agent-lane-note

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 13 |
| **Predecessor** | 009-skill-md-two-lane |
| **Successor** | 012-catalog-playbook-advisor-fp25 |
| **Handoff Criteria** | All 4 mirror notes byte-identical with Lane awareness text, validate.sh --strict PASSED |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the deep-agent-improvement benchmark-mode parent packet. Phase 009 restructured SKILL.md so model-benchmark became co-equal Lane B. This phase carries that two-lane framing into the @deep-agent-improvement agent file and its 3 runtime mirrors.

**Scope Boundary**: Only the single awareness note in the agent file and its 3 mirrors. No behavioral rules, workflow steps, or scripts change.

**Dependencies**:
- 009-skill-md-two-lane established the co-equal Lane A / Lane B framing this note must reflect.

**Deliverables**:
- Upgraded "Lane awareness" note in `.opencode/agents/deep-agent-improvement.md`.
- Byte-identical note in `.claude`, `.gemini`, and `.codex` mirrors.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The @deep-agent-improvement agent note called the skill "two modes" with model-benchmark as a separate mode bolt-on. That framing under-described the now co-equal Lane B and risked implying Lane B spawns or dispatches a second Claude agent, when in fact Lane B dispatches MODELS via dispatch-model.cjs and there is only ONE agent.

### Purpose
Reframe the note as "Lane awareness" so all 4 runtime surfaces describe two co-equal lanes and make clear Lane B never spawns a second agent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the awareness note in the canonical agent file.
- Apply the identical note text to the 3 runtime mirrors so all 4 stay byte-identical.
- Fill Level 1 phase docs and validate.

### Out of Scope
- Any change to agent workflow, rules, tools, or verification sections - this is awareness text only.
- Any change to loop-host, dispatch-model, or run-benchmark scripts - referenced, not modified.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/agents/deep-agent-improvement.md | Modify | Upgrade Mode awareness note to Lane awareness |
| .claude/agents/deep-agent-improvement.md | Modify | Apply byte-identical Lane awareness note |
| .gemini/agents/deep-agent-improvement.md | Modify | Apply byte-identical Lane awareness note |
| .codex/agents/deep-agent-improvement.toml | Modify | Apply Lane awareness prose inside the developer_instructions string |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Note describes two co-equal lanes and that Lane B dispatches MODELS, not a second agent | Note names Lane A and Lane B, both loop commands, dispatch-model.cjs, and states "ONE agent" / "never spawns a second Claude agent" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | All 4 mirrors stay byte-identical | md5 of the Lane awareness line matches across all 4 files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 mirror notes share one md5 hash for the Lane awareness line.
- **SC-002**: No "Mode awareness" string remains in any of the 4 mirror files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Mirror drift if one file edited differently | Med | md5-compare all 4 lines after editing |
| Dependency | 009 two-lane framing | Low | Note text mirrors phase 009 lane vocabulary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope and note text are fixed by the dispatch task.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
