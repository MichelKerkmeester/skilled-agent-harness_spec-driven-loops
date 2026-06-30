---
title: "Implementation Plan: adopt the designer-skills-main interface + motion findings into sk-design"
description: "Per-file build plan applying the adopt the designer-skills-main interface + motion findings into sk-design via cli-codex gpt-5.5 high fast, scope-locked, with read-first skip-if-present and per-diff verification."
trigger_phrases:
  - "026-interface-motion-adoption plan"
  - "sk-design adoption plan"
  - "designer-skills build plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/026-interface-motion-adoption"
    last_updated_at: "2026-06-27T11:49:46Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the build plan and edit map"
    next_safe_action: "Commit phases 025-027 once all three finalize"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-026-interface-motion-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:

---
# Implementation Plan: adopt the designer-skills-main interface + motion findings into sk-design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown design-guidance docs in the sk-design modes |
| **Framework** | system-spec-kit phase; cli-codex gpt-5.5 high fast |
| **Storage** | n/a |
| **Testing** | `validate.sh --strict`; per-diff scope-lock; read-first skip-if-present |

### Overview
Apply the interface + motion slices of `../024-designer-skills-research/research/research.md` into five live files via one scope-locked cli-codex dispatch (run concurrently with the audit and foundations phases). Codex reads current state, adds only net-new items, and the orchestrator verifies the diff.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The 024 backlog names the targeted items + files
- [x] The target files confirmed present
- [x] Executor confirmed (cli-codex gpt-5.5 high fast, workspace-write)

### Definition of Done
- [x] Targeted items applied additively; nothing already-present duplicated
- [x] Scope lock held; each diff verified
- [x] `validate.sh --strict` clean for the packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Anchor-scoped additive edits to existing mode references, applied by a scope-locked codex dispatch and verified by the orchestrator.

### Key Components
- **cli-codex gpt-5.5 high fast**: reads each file, adds named items, skips present content.
- **Orchestrator**: writes the prompt, verifies the diff, reverts on drift.

### Data Flow
024 backlog -> scope-locked prompt -> codex edit -> diff review -> accept or revert.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Each surface is edited additively. Adjacent content is not rewritten.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `design-interface/references/design-process/ux_quality_reference.md` | product-flow guidance | add compact UX quality floor | diff shows one additive floor section |
| `design-interface/references/design-process/copy_and_mock_data.md` | copy guidance | add state-copy voice + error/empty/CTA formulas | diff shows additive formulas; basics skipped |
| `design-interface/references/design-process/design_principles.md` | build principles | add media/illustration contract + earned-deviation restraint | diff shows additive principles |
| `design-motion/assets/motion_pattern_cards.md` | motion pattern cards | add async state-machine card | diff shows a net-new card |
| `design-motion/references/motion_strategy.md` | motion strategy | add motion-token verification + gesture-a11y | diff shows additions; duration table not duplicated |

Required inventories:
- Same-class producers: additive guidance; no shared symbol changes.
- Consumers of changed symbols: none — human-read design docs.
- Matrix axes: backlog items x their target files; skip-if-present applies to every edit.
- Algorithm invariant: phase-023 and already-covered content is skipped; additions are net-new.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Phase folder + spec/plan/tasks scaffolded
- [x] Target files confirmed; executor confirmed
- [x] Scope-locked codex prompt authored

### Phase 2: Core Implementation
- [x] Dispatch the scope-locked codex edit
- [x] Codex adds the named items; skips present content

### Phase 3: Verification
- [x] Diff scope-lock verified; no duplication
- [x] `validate.sh --strict` clean; phase docs finalized
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | n/a (doc edits) | n/a |
| Integration | Mode-internal consistency | Read/Grep |
| Manual | Per-diff scope-lock + skip-if-present verification | git diff, Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 024 backlog | Internal (read-only) | Green | No build spec |
| Live mode references | Internal | Green | Nothing to edit |
| cli-codex gpt-5.5 high fast | External | Green | Edits cannot be applied |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An edit drifts scope, duplicates content, or breaks a doc.
- **Procedure**: `git checkout -- <file>` to revert the specific file, then re-dispatch with a tighter prompt.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup --> Dispatch --> Verify --> Finalize
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Dispatch |
| Dispatch | Setup | Verify |
| Verify + finalize | Dispatch | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | scaffolded |
| Dispatch | Med | one focused codex dispatch |
| Verify + finalize | Med | diff review + wrapper docs + validation |
| **Total** | | **1 dispatch + verify** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The 024 deliverable is preserved and unaffected
- [x] The target files are under git, so per-file revert is clean
- [x] The dispatch is verified before finalizing

### Rollback Procedure
1. Identify the drifted file from the diff review
2. `git checkout -- <file>` to restore its pre-dispatch state
3. Re-dispatch with a tighter scope-locked prompt

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
024 backlog --> codex dispatch --> diff verify --> finalize
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| 024 backlog | (read-only) | edit spec | the dispatch |
| codex dispatch | backlog | live edits | verification |
| verify + finalize | dispatch | validated phase | next phase |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Scope-locked dispatch** - the live edits - CRITICAL
2. **Diff verification** - scope-lock + no-duplication - CRITICAL
3. **Validation** - strict packet validation - CRITICAL

**Total Critical Path**: Setup -> dispatch -> verify -> validate.

**Parallel Opportunities**:
- This phase ran concurrently with its sibling adoption phases (disjoint files).
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Edits live | named items applied at anchors | Phase 2 |
| M2 | Verified | diff scope-locked, no duplication | Phase 3 |
| M3 | Validated | strict validation clean | Phase 3 |
<!-- /ANCHOR:milestones -->

---

<!--
LEVEL 3 PLAN ADDENDUM
- L2/L3 sections present
- Build cluster: one scope-locked cli-codex dispatch, orchestrator verifies the diff
-->
