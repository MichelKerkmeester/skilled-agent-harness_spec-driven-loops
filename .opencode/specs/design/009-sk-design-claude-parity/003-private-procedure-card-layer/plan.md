---
title: "Implementation Plan: Phase 003 - Private Procedure Card Layer"
description: "Plan for adapting external Claude design procedures into private OpenCode-native procedure cards selected by the existing sk-design modes."
trigger_phrases:
  - "phase 003 plan"
  - "procedure-card implementation plan"
  - "mode-local cards"
  - "source adaptation rules"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "design/009-sk-design-claude-parity/003-private-procedure-card-layer"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created Phase 003 plan."
    next_safe_action: "Implement approved cards."
---
# Implementation Plan: Phase 003 - Private Procedure Card Layer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON metadata, future OpenCode skill docs |
| **Framework** | Spec Kit Level 3 packet with existing `sk-design` five-mode architecture |
| **Storage** | File-based spec packet and future private procedure-card files |
| **Testing** | Spec strict validation, placeholder scan, mode routing review, source-adaptation review |

### Overview

This phase plans a private procedure-card layer that maps the fourteen external Claude procedure themes into the existing `sk-design` modes. The implementation should create a schema, a per-mode inventory, routing rules, source-adaptation rules, and proof requirements while preserving one public `sk-design` hub.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 parent hub compatibility shell is available or its routing assumptions are explicitly frozen.
- [ ] External procedure source identifiers are available for citation without copying source prompt bodies.
- [ ] Existing five `sk-design` modes are treated as the only public mode taxonomy.
- [ ] The implementation boundary permits edits to the future card locations.

### Definition of Done
- [ ] Procedure-card schema is documented and used consistently.
- [ ] Every external procedure theme has a mode-local or justified shared placement.
- [ ] Routing and conflict rules are documented with fallback behavior.
- [ ] Source-adaptation rules are applied and reviewed.
- [ ] Proof gates exist for every card.
- [ ] Strict validation for this phase packet passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Private mode-local procedure cards with a narrow shared orchestration layer.

### Key Components
- **Procedure-card schema**: The contract each card must follow, including purpose, trigger, owning mode, source reference, output contract, proof gate, and privacy rule.
- **Mode-local inventories**: Card lists owned by `design-interface`, `design-foundations`, `design-motion`, `design-audit`, and `design-md-generator`.
- **Shared procedure bucket**: A limited home for cards that orchestrate multiple modes and cannot be owned by one mode without duplication.
- **Routing rules**: Deterministic selection rules that choose cards after the parent hub has selected the public mode.
- **Source-adaptation rules**: Guardrails for synthesis, citation, and no long-form external prompt copying.
- **Proof requirements**: Evidence each card must produce or request before a mode can claim the procedure was followed.

### Data Flow

User request enters the public `sk-design` hub, the hub routes to an existing mode, the mode evaluates its private card inventory, a selected card adds procedure steps and proof requirements, and the mode returns output using its normal public identity. Shared procedures are loaded only when the selected mode explicitly delegates cross-mode orchestration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Phase 003 spec packet | Planning and continuity surface | Create Level 3 docs and metadata | `validate.sh <phase-root> --strict` |
| `sk-design` public hub | Single public design identity | Planned future consumer, unchanged during packet creation | Boundary review confirms no current edit |
| Five `sk-design` modes | Future owners of private cards | Planned future placement targets | Inventory review in implementation phase |
| External procedure inventory | Source evidence for adaptation | Read-only future input | Source citations required on every card |
| Shared procedure bucket | Future cross-mode exception path | Create only for true shared orchestration | Checklist requires shared-placement rationale |

Required inventories:
- Same-class producers: List the fourteen procedure themes and classify each as mode-local or shared.
- Consumers of changed symbols: Review the parent hub and five modes before implementation to confirm no public taxonomy expansion.
- Matrix axes: Owning mode, procedure theme, trigger, source reference, output contract, proof gate, and privacy rule.
- Algorithm invariant: A procedure card may add private process to a mode, but it may not create a new public skill identity.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source Theme Normalization
- [ ] Identify the fourteen source procedure themes by safe source identifier.
- [ ] Group themes into discovery, direction, prototyping, extraction, review, and polish families.
- [ ] Record source references at citation level only, not source prompt bodies.

### Phase 2: Card Schema and Inventory
- [ ] Define the procedure-card schema.
- [ ] Create per-mode inventory rows for the five current modes.
- [ ] Mark shared candidates only when cross-mode orchestration is required.

### Phase 3: Routing, Adaptation, and Proof Rules
- [ ] Define card selection precedence inside a mode.
- [ ] Define conflict handling and parent hub fallback.
- [ ] Define adaptation rules that require synthesis and no long-form source copying.
- [ ] Define proof requirements for each card category.

### Phase 4: Verification and Handoff
- [ ] Run strict spec validation.
- [ ] Run placeholder and source-copying checks.
- [ ] Review that no public fourteen-skill mirror was introduced.
- [ ] Update implementation summary with final status and evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Required Level 3 docs and metadata | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-root> --strict` |
| Placeholder scan | Template placeholders and sample residue | Validator output plus targeted text search if validation flags issues |
| Boundary audit | No edits outside Phase 003 root during packet creation | `git diff -- .opencode/specs/design/009-sk-design-claude-parity/003-private-procedure-card-layer` |
| Source adaptation review | Cards synthesize and cite source procedures without copying bodies | Manual reviewer pass during implementation |
| Routing review | Existing public hub and five modes remain the public taxonomy | Mode inventory and routing matrix review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 baseline ownership gate | Internal phase | Complete or prerequisite from parent plan | Confirms `sk-design` ownership boundaries |
| Phase 002 parent hub compatibility shell | Internal phase | Depends on Task 19 retry | Blocks final routing assumptions for private cards |
| External procedure inventory | Source material | Read-only future input | Blocks complete mapping of all fourteen themes |
| Existing five-mode `sk-design` architecture | Internal contract | Preserved | Blocks mode-local placement if the mode registry changes first |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase packet validation fails in a way that cannot be corrected within the packet boundary, or the parent plan rejects private procedure cards.
- **Procedure**: Revert only the Phase 003 child folder additions, then re-run parent packet validation if parent metadata is later changed by an approved follow-up.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 001 baseline ownership gate -> Phase 002 parent hub shell -> Phase 003 private procedure cards
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Source Theme Normalization | Phase 002 assumptions, external inventory | Card Schema and Inventory |
| Card Schema and Inventory | Source Theme Normalization | Routing, Adaptation, and Proof Rules |
| Routing, Adaptation, and Proof Rules | Card Schema and Inventory | Verification and Handoff |
| Verification and Handoff | Routing, Adaptation, and Proof Rules | Phase completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source Theme Normalization | Medium | 1-2 hours |
| Card Schema and Inventory | High | 3-5 hours |
| Routing, Adaptation, and Proof Rules | High | 3-5 hours |
| Verification and Handoff | Medium | 1-2 hours |
| **Total** | | **8-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm edits are allowed outside the Phase 003 packet before implementation begins.
- [ ] Confirm no parent, sibling, external, or research folders are modified during packet creation.
- [ ] Confirm future procedure-card locations are reviewed before any implementation write.

### Rollback Procedure
1. Stop implementation if a card requires a new public skill identity.
2. Revert the mode-local or shared card files introduced by the phase.
3. Restore the prior mode routing behavior.
4. Re-run strict spec validation and any mode-level verification used by the implementation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove or revert private card docs/config only; no persisted user data is involved.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
External procedure inventory
        |
        v
Source theme normalization ---> Card schema and inventory ---> Routing and proof rules ---> Verification
        ^                                  |
        |                                  v
Phase 002 parent hub shell --------> Mode-local placement review
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Source theme normalization | External source identifiers | Theme map | Schema inventory |
| Procedure-card schema | Source themes, mode architecture | Card contract | Card authoring |
| Per-mode inventory | Schema, five-mode architecture | Placement matrix | Routing rules |
| Routing rules | Parent hub shell, per-mode inventory | Selection precedence | Verification |
| Proof requirements | Card schema, review themes | Evidence rules | Completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Source theme normalization** - 1-2 hours - CRITICAL
2. **Card schema and inventory** - 3-5 hours - CRITICAL
3. **Routing and proof rules** - 3-5 hours - CRITICAL
4. **Verification and handoff** - 1-2 hours - CRITICAL

**Total Critical Path**: 8-14 hours

**Parallel Opportunities**:
- Mode inventory drafting can split by existing `sk-design` mode after the schema is stable.
- Source-adaptation review and proof-gate review can run in parallel after cards are drafted.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Schema ready | Procedure-card schema covers trigger, source, output, proof, and privacy fields | After source normalization |
| M2 | Inventory ready | All fourteen procedure themes map to mode-local or justified shared placement | After schema approval |
| M3 | Routing ready | Selection, conflict, fallback, and proof rules are documented | Before verification |
| M4 | Phase ready | Strict validation and source-adaptation review pass | Phase completion |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISIONS

| Decision | Rationale | Consequence |
|----------|-----------|-------------|
| Private mode-local cards by default | Preserves one public `sk-design` identity and keeps procedures close to the mode that uses them | Mode authors must maintain card inventories |
| Shared procedures only for cross-mode orchestration | Prevents duplicated orchestration logic without creating a public taxonomy | Shared cards need stricter ownership and proof gates |
| Source synthesis over prompt mirroring | Reduces copying risk and adapts behavior to OpenCode conventions | Review must compare intent rather than exact wording |
| Proof gate on every card | Keeps procedure cards testable instead of advisory blobs | Card authoring takes longer but completion evidence improves |

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm the current task scope permits edits outside this Phase 003 packet before implementation begins.
- Confirm source procedure identifiers are available without copying restricted source text.
- Confirm Phase 002 routing assumptions are available or explicitly frozen.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Complete source mapping before authoring cards. |
| TASK-SCOPE | Keep public `sk-design` taxonomy unchanged unless a later decision approves expansion. |
| TASK-PROOF | Every card must include an output contract and proof gate. |

### Status Reporting Format
Use `STATUS=<planned|blocked|validated> PHASE=003 DETAIL=<short detail>` for handoff updates.

### Blocked Task Protocol
If source identifiers, Phase 002 routing, or implementation write scope is unavailable, mark the task `BLOCKED` and report the missing input before editing card files.
