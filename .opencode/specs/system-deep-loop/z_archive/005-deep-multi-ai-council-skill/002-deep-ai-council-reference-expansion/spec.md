---
title: "Feature Specification: 101/004 Deep AI Council Reference Expansion"
description: "Expand deep-ai-council references, manual testing playbook coverage, and skill routing for scoring, depth dispatch, failure handling, and anti-pattern guidance."
trigger_phrases:
  - "101/004"
  - "deep-ai-council reference expansion"
  - "council scoring rubric"
  - "council depth dispatch"
  - "council failure handling"
  - "council anti-patterns"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/005-deep-multi-ai-council-skill/002-deep-ai-council-reference-expansion"
    last_updated_at: "2026-05-10T10:50:00Z"
    last_updated_by: "openai-gpt-5.5-codex"
    recent_action: "Expanded council references/playbook/routing."
    next_safe_action: "Run documentation and strict spec validation before reporting completion."
    blockers: []
    key_files:
      - references/scoring_rubric.md
      - references/depth_dispatch.md
      - references/failure_handling.md
      - references/anti_patterns.md
      - references/seat_diversity_patterns.md
      - playbook/06/001-depth-detection-parallel-vs-sequential.md
      - playbook/06/002-resume-after-interrupted-state.md
      - playbook/07/001-library-writer-call-sequence.md
      - playbook/07/002-five-dimension-scoring-rubric-application.md
      - playbook/07/003-hunter-skeptic-referee-cross-critique.md
      - playbook/07/004-out-of-scope-write-rejection.md
      - SKILL.md
      - .opencode/agents/deep-ai-council.md
      - .claude/agents/deep-ai-council.md
      - .codex/agents/deep-ai-council.toml
      - .gemini/agents/deep-ai-council.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-004-reference-expansion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Graph support remains out of scope for this packet."
      - "Advisor regression work remains out of scope for this packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 101/004 Deep AI Council Reference Expansion

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `001-deep-ai-council-skill-creation` |
| **Successor** | `003-deep-ai-council-graph-support` |
| **Handoff Criteria** | Reference files, playbook scenarios, skill routing, metadata, and strict spec validation all pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The agent body now contains five substantial council subsystems with no focused skill references: scoring and synthesis, depth-aware dispatch, failure handling, anti-pattern detection, and expanded seat-diversity guidance. The manual testing playbook also has six coverage gaps around writer-library sequence, depth detection, scoring, adversarial critique, scoped-write rejection, and interrupted-state resume.

### Purpose
Expand the `deep-ai-council` skill knowledge base and playbook so operators can load focused guidance without rereading the full runtime agent body.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create four new references: `scoring_rubric.md`, `depth_dispatch.md`, `failure_handling.md`, and `anti_patterns.md`.
- Expand `seat_diversity_patterns.md` to mirror the full agent §3 strategy, vantage, diversity, count, and auto-selection guidance.
- Add six manual testing scenarios across two new categories: depth/failure handling and writer-library contract.
- Update root `manual_testing_playbook.md` from 12 scenarios across 5 categories to 18 scenarios across 7 categories.
- Extend `SKILL.md` intent routing and reference lists for the four new reference files.
- Create this Level 1 spec packet with discovery metadata.

### Out of Scope
- Graph support - owned by the separate graph-support phase.
- Advisor regression - not changed by this packet.
- Runtime behavior changes - this packet reorganizes authoritative content into references and tests.
- New compatibility shims or legacy archives - legacy code/docs are deleted when explicitly in scope, not archived.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-ai-council/references/scoring_rubric.md` | Create | Five-dimension rubric, deliberation, critique, conflict, and attribution guidance |
| `.opencode/skills/deep-ai-council/references/depth_dispatch.md` | Create | Depth 0 and Depth 1 dispatch guidance |
| `.opencode/skills/deep-ai-council/references/failure_handling.md` | Create | Timeout, contradiction, failure, vantage, state-log, and rollback guidance |
| `.opencode/skills/deep-ai-council/references/anti_patterns.md` | Create | Anti-pattern table, detection cues, and recovery actions |
| `.opencode/skills/deep-ai-council/references/seat_diversity_patterns.md` | Modify | Expand existing diversity reference |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/06--depth-and-failure-handling/` | Create | DAC-014 and DAC-018 scenarios |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/07--writer-library-contract/` | Create | DAC-013 and DAC-015 through DAC-017 scenarios |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md` | Modify | Update counts, categories, TOC, summaries, and index |
| `.opencode/skills/deep-ai-council/SKILL.md` | Modify | Add routing intents, resource mappings, and references |
| `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/002-deep-ai-council-reference-expansion/` | Create | Level 1 packet docs and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | New references exist and follow sk-doc reference shape | Four snake_case reference files validate and contain required numbered sections |
| REQ-002 | Seat diversity reference covers full agent §3 routing | Strategy lenses, AI vantage targets, diversity requirements, count guidance, and flowchart are present |
| REQ-003 | Manual playbook coverage increases to 18 scenarios | Root playbook includes categories 06 and 07 plus DAC-013 through DAC-018 rows |
| REQ-004 | SKILL.md routes new reference topics | INTENT_MODEL and RESOURCE_MAP contain SCORING, DEPTH_DISPATCH, FAILURE_HANDLING, and ANTI_PATTERNS |
| REQ-005 | Spec packet validates | `validate.sh --strict` passes for this folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Reference content is source-aligned | Content is lifted or reorganized from `.opencode/agents/deep-ai-council.md` sections §0, §3, §5, §6, §10, §11, and §17 |
| REQ-007 | Playbook prompts follow prompt voice rule | Natural-human prompts are default; RCAF is used only for AI dispatcher or boundary-validator actors |
| REQ-008 | Verification commands pass | The ten requested verification gates pass before reporting |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Reference count is 10 total files: six existing plus four new.
- **SC-002**: Playbook file count is 19 total files: one root, twelve existing scenarios, and six new scenarios.
- **SC-003**: `quick_validate.py` accepts the `deep-ai-council` skill package.
- **SC-004**: `validate_document.py` accepts all five reference files and all six new playbook files.
- **SC-005**: `SKILL.md` contains at least eight matches for the four new intent names across INTENT_MODEL and RESOURCE_MAP.
- **SC-006**: Branch remains `main`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Agent body source | Reference content must match authoritative sections | Read source sections before writing and validate reference headings |
| Dependency | sk-doc templates | Reference and playbook shape must validate | Follow reference and playbook snippet templates |
| Risk | Root playbook index drift | Scenario counts or DAC rows may mismatch files | Verify DAC-013 through DAC-018 grep count and file count |
| Risk | Spec scaffold sidecar files | create.sh may create scratch files outside explicit list | Remove generated sidecar files not explicitly listed |
| Risk | Runtime mirror parity drift | Runtime mirrors may lag agent body updates | Record mirror paths in continuity and keep behavior checks in playbook |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No open questions remain for this packet.
<!-- /ANCHOR:questions -->
