---
title: "Anchor-Ownership and Injected-Question Conflict Merge ADR"
description: "When an injected question disagrees with the reducer's key-questions rewrite, the current code has a markdown overwrite race with no winner declared. This ADR makes key-questions a generated projection: inbox is immutable input, registry is canonical state, reducer is sole renderer."
trigger_phrases:
  - "anchor ownership conflict"
  - "injected question conflict ADR"
  - "question conflict event"
  - "reduce state sole renderer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/003-deep-loop-workflows/005-anchor-ownership-conflict-adr"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored spec.md from research.md §5.2 (iter 48)"
    next_safe_action: "Implement resolveQuestionConflicts() in reduce-state.cjs after 004 is complete"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-research/references/state/state_reducer_registry.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-003-deep-loop-workflows"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Anchor-Ownership and Injected-Question Conflict Merge ADR

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 12 |
| **Predecessor** | 004-injection-inbox-provenance |
| **Successor** | 006-rejected-pattern-cache |
| **Handoff Criteria** | `resolveQuestionConflicts()` implemented; `question_conflict` event emitted on disagreement; no silent markdown overwrite; `key-questions` section regenerated from registry on each reduce step |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the deep-loop-workflows recommendations.

**Scope Boundary**: Resolving who wins when an injected question (inbox) disagrees with the reducer's `key-questions` rewrite. Does not change inbox schema (frozen in 004) or cross-mode generalization.

**Dependencies**:
- **Hard dependency on 004-injection-inbox-provenance**: inbox schema and legacy import path must exist before conflict resolution is implemented

**Deliverables**:
- `resolveQuestionConflicts()` function in `reduce-state.cjs`
- `key-questions` as a generated projection from the canonical registry (not directly editable by inbox)
- Operator decisions recorded as `accepted/rejected/superseded/needs_decision` in the registry
- `question_conflict` JSONL event emitted on disagreement (not a silent markdown overwrite)
- `state_reducer_registry.md` and `deep_research_strategy.md` updated to document the ownership model
- `deep_research_auto.yaml` updated with a conflict-event step

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When an injected question from `research/inbox.jsonl` disagrees with the reducer's `key-questions` rewrite, the current system has an unresolved markdown overwrite race: whichever writer runs last wins, with no event emitted, no conflict record stored, and no declared owner. This makes the research strategy non-deterministic when inbox injections and the analyst-strategy reducer modify the same question anchor in the same reduce step.

### Purpose
Make `key-questions` a generated projection from the canonical registry: inbox is immutable input, the registry is canonical question state, and the reducer is the sole renderer. Operator decisions are recorded as `accepted/rejected/superseded/needs_decision`; conflicts surface as `question_conflict` events instead of silent overwrites.

> **Reference evidence**: `external/kasper/src/handlers.ts:352-475` (conflict resolution model, operator decision records); `external/kasper/src/state.ts:502-998` (registry as canonical source); `external/kasper/src/improvements.ts:9-12` (operator decision types). Research.md §5.2 + (iter 48).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `resolveQuestionConflicts()` in `reduce-state.cjs`: inbox = immutable input, registry = canonical state, reducer = sole renderer of `key-questions`
- Operator decision records: `accepted`/`rejected`/`superseded`/`needs_decision` stored in the registry
- `question_conflict` JSONL event emitted when inbox question disagrees with a registry entry
- `key-questions` in `deep_research_strategy.md` becomes a generated projection (read-only from the operator's perspective)
- `state_reducer_registry.md` updated to document the ownership model
- `deep_research_auto.yaml` updated with a conflict-event emission step

### Out of Scope
- Inbox schema changes — frozen in 004
- Cross-mode generalization of the conflict model

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modify | Add `resolveQuestionConflicts()`; make `key-questions` a generated projection from the registry |
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md` | Modify | Mark `key-questions` section as generated; document conflict-model ownership |
| `.opencode/skills/deep-loop-workflows/deep-research/references/state/state_reducer_registry.md` | Modify | Document: inbox = immutable, registry = canonical, reducer = sole renderer |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify | Add conflict-event step for `question_conflict` emission |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `resolveQuestionConflicts()` implemented; inbox is immutable input; registry is canonical; reducer is sole renderer of `key-questions`; disagreement between inbox and registry emits `question_conflict` event (not a silent markdown overwrite) | An inbox injection disagreeing with a registry entry emits a `question_conflict` event in JSONL; `key-questions` section is regenerated from the registry, not overwritten by the inbox record |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Operator decisions recorded as `accepted/rejected/superseded/needs_decision` in the registry; `question_conflict` event contains both `inboxValue` and `registryValue` fields | Registry records contain an operator decision field; `question_conflict` event JSONL has both values for transparency |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A conflict between an inbox question and the reducer's rewrite emits a `question_conflict` event; the `key-questions` markdown block is not silently overwritten
- **SC-002**: The `key-questions` section in the strategy doc is regenerated from the registry on each reduce step; a direct manual edit to that section is treated as a legacy-import via the 004 path, not as a registry write
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hard/deep-rewrite rating; existing sessions that rely on direct `key-questions` edits will lose the overwrite model | High | Legacy import path from 004 must be in place; communicate the change in `deep_research_strategy.md` |
| Risk | `needs_decision` conflicts could accumulate silently if the operator never acts on them | Med | `needs_decision` conflicts are counted and surfaced in the dashboard conflict summary; they do not block the run |
| Dependency | **Hard dependency on 004-injection-inbox-provenance** — inbox schema must be frozen before conflict resolution is implemented | High | Do not start this phase until 004 passes `validate.sh` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- When an `accepted` operator decision conflicts with a newer `rejected` decision on the same question ID, which takes precedence — latest timestamp or an explicit priority field in the decision record?
- Should `needs_decision` conflicts block the run in a strict mode, or should they always be lenient (warn only)? Is this a config option?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
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
