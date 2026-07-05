---
title: "Implementation Plan: Anchor-Ownership and Injected-Question Conflict Merge ADR"
description: "Documents the completed reducer-owned question registry model and injected-question conflict event work."
trigger_phrases:
  - "anchor ownership conflict"
  - "injected question conflict ADR"
  - "question conflict event"
  - "reduce state sole renderer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/003-deep-loop-workflows/005-anchor-ownership-conflict-adr"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md"
      - ".opencode/skills/deep-loop-workflows/deep-research/references/state/state_reducer_registry.md"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Anchor-Ownership and Injected-Question Conflict Merge ADR

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode deep-research reducer JavaScript, YAML command steps, markdown state references |
| **Framework** | `deep-loop-workflows` research reducer and canonical question registry |
| **Storage** | Reducer registry records, generated `key-questions` projection, JSONL conflict events |
| **Testing** | Conflict fixture checks and generated-projection verification |

### Overview
This completed work made `key-questions` a generated projection instead of a shared editable anchor. Inbox records remain immutable input, the registry owns canonical question state, and disagreements emit `question_conflict` events instead of silently overwriting markdown.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Inbox schema from leaf 004 is available and stable.
- [x] Ownership model is explicit: inbox input, registry state, reducer renderer.
- [x] Cross-mode conflict generalization remains out of scope.

### Definition of Done
- [x] `resolveQuestionConflicts()` exists in the reducer path.
- [x] `key-questions` is regenerated from registry state.
- [x] Operator decisions record `accepted`, `rejected`, `superseded`, or `needs_decision`.
- [x] Disagreements emit `question_conflict` JSONL with both values.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-writer generated projection: inbox and legacy imports feed a canonical registry, and only the reducer renders the markdown anchor.

### Key Components
- **`reduce-state.cjs`**: Implements `resolveQuestionConflicts()` and writes the generated `key-questions` projection.
- **Canonical registry**: Stores question state and operator decisions.
- **`state_reducer_registry.md`**: Documents the ownership model for future maintainers.
- **`deep_research_auto.yaml`**: Emits conflict events in the command workflow.

### Data Flow
Inbox records and legacy imports enter the reducer, the reducer compares them with registry state, and conflicts are stored as registry decisions plus `question_conflict` events. The markdown `key-questions` section is rendered from the registry on each reduce step.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Reducer conflict logic | Owns question state transitions | Add `resolveQuestionConflicts()` | Conflict fixture emits event |
| Registry docs | Defines state ownership | Document inbox, registry, and renderer roles | Reference doc names sole renderer |
| Strategy markdown | User-facing question projection | Mark `key-questions` generated | Manual edit imports through leaf 004 path |
| Command YAML | Emits workflow events | Add `question_conflict` event step | JSONL contains both values |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and confirm hard dependency on leaf 004.
- [x] Identify reducer, registry docs, strategy docs, and YAML workflow surfaces.
- [x] Keep inbox schema changes out of this leaf.

### Phase 2: Core Implementation
- [x] Implement `resolveQuestionConflicts()` in `reduce-state.cjs`.
- [x] Make `key-questions` a generated projection from registry state.
- [x] Store operator decision states in the registry.
- [x] Emit `question_conflict` JSONL events on disagreement.
- [x] Update reducer registry and strategy docs with the ownership model.
- [x] Add conflict-event wiring to `deep_research_auto.yaml`.

### Phase 3: Verification
- [x] Verify an inbox/registry disagreement emits `question_conflict`.
- [x] Verify `key-questions` is not silently overwritten by inbox content.
- [x] Verify conflict events include `inboxValue` and `registryValue`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Conflict fixture | Inbox question disagrees with registry state | Reducer fixture run |
| Projection check | `key-questions` regenerated from registry | Strategy markdown inspection |
| Event payload | `question_conflict` includes both values | JSONL output inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `004-injection-inbox-provenance` | Hard predecessor | Complete | Conflict logic needs stable inbox schema and legacy import behavior |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Conflict resolution drops questions, event payloads are incomplete, or generated projection breaks legacy imports.
- **Procedure**: Revert reducer conflict handling, registry-doc updates, and YAML event wiring, then return to the leaf 004 provenance-only model until conflict semantics are corrected.
<!-- /ANCHOR:rollback -->
