---
title: "Implementation Plan: Research Baseline And Inventory"
description: "Preserve completed deep-research evidence, classify active standalone deep-context surfaces, and record the baseline gates that must precede public redirect work."
trigger_phrases:
  - "deep-context research baseline plan"
  - "deep-context inventory plan"
  - "context deprecation baseline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/028-deprecate-deep-context-integrate-capabilities/001-research-baseline-and-inventory"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "opencode"
    recent_action: "Planned phase 001 evidence baseline"
    next_safe_action: "Refresh metadata and validate"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
      - "../spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-001-plan"
      parent_session_id: "2026-07-04-phase-001-research-baseline"
    completion_pct: 70
    open_questions: []
    answered_questions:
      - "Runtime deprecation begins in phase 002, not phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Research Baseline And Inventory

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs, JSON metadata, completed deep-research artifacts |
| **Framework** | SpecKit phased packet, deep-loop workflows |
| **Storage** | `.opencode/specs/system-deep-loop/028-deprecate-deep-context-integrate-capabilities/001-research-baseline-and-inventory/` |
| **Testing** | SpecKit strict validation, sk-doc spec validation, grep/glob inventory checks |

### Overview

This phase is documentation and evidence preservation. It moves the completed research under the first child phase, records active surface classes, and leaves runtime deprecation for later phases.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent phase structure approved by user.
- [x] Research synthesis completed after 10 iterations.
- [x] Target phase folder scaffolded from templates.

### Definition of Done
- [ ] Research artifacts are phase-local under `research/`.
- [ ] Phase 001 docs contain no placeholders.
- [ ] Metadata is refreshed for parent and child.
- [ ] Strict validation passes for this phase and recursive validation passes from the parent.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-first phase boundary.

### Key Components
- **Research evidence**: final synthesis, iterations, state log, dashboard, and registries.
- **Inventory classes**: surface categories that later phases must update or preserve.
- **Phase handoff**: parent phase map and child docs define when implementation can start.

### Data Flow

```text
Completed research artifacts
  -> phase 001 research/ evidence
  -> active surface classes and residual gaps
  -> phase 002 public redirect and replacement contracts
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `research/**` | Completed investigation evidence | Preserve under phase 001 | File inventory and synthesis references |
| Parent `spec.md` | Coordination root | Reference child phase, not detailed plan | Parent phase map read |
| Runtime command/agent/registry files | Future implementation surfaces | No phase 001 edits | Git diff and scope review |
| Historical specs and archives | Prior records | Leave unchanged | Inventory classification |

Required inventories:
- Same-class producers: search `/deep:context`, `@deep-context`, `deep-context`, `deep_context`, and `workflowMode.*context` across active roots.
- Consumers of changed symbols: search context-report, context assets, reducer scripts, fixture IDs, and runtime loop-type references.
- Matrix axes: active runtime, active docs, generated metadata, test/fixture, historical archive, false positive.
- Algorithm invariant: a later removed or redirected surface must first be classified and backed by evidence.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold child phase folder from SpecKit templates.
- [x] Confirm completed research artifacts exist.
- [x] Confirm parent is being converted to phase-parent shape.

### Phase 2: Implementation
- [x] Move completed research artifacts into `research/` under this child phase.
- [ ] Record fresh inventory output before phase 002 edits.
- [ ] Refresh child metadata after documentation updates.

### Phase 3: Verification
- [ ] Run strict validation for this child phase.
- [ ] Run recursive validation from the parent.
- [ ] Record validation output in `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Phase 001 and parent recursive packet | `validate.sh --strict`, `validate.sh --recursive --strict` |
| Documentation validation | Authored markdown docs | `validate_document.py --type spec --blocking-only` |
| Inventory | Active/historical surface split | Grep and Glob |
| Scope guard | Runtime untouched in this phase | Git diff review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Completed research synthesis | Internal evidence | Green | Later phases lose source-of-truth evidence if missing. |
| SpecKit metadata scripts | Internal tooling | Yellow | Metadata may need TypeScript source entrypoints when dist files are absent. |
| Code graph freshness | Internal index | Yellow | Treat graph claims as stale until refreshed. |
| Spec Memory daemon | Internal memory | Yellow | Research already recorded warm retrieval unavailability; use repo evidence. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase validation fails due to the research move, or parent recursive validation rejects the phase structure.
- **Procedure**: Move `research/` evidence back to the previous root location or adjust parent/child docs to match the validator, then rerun strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Research evidence preserved
  -> active surface classes documented
  -> phase 002 can update command and replacement contracts
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Evidence move | Existing research artifacts | Metadata refresh |
| Inventory classes | Research synthesis and grep evidence | Phase 002 start |
| Validation | Updated docs and metadata | Runtime work readiness |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Evidence move | Low | 15-30 minutes |
| Inventory refresh | Medium | 30-60 minutes |
| Metadata and validation | Medium | 30-90 minutes |
| **Total** | | **1-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production/runtime files edited in this phase.
- [x] Research artifacts are untracked packet-local files.
- [ ] Validation command output captured after metadata refresh.

### Rollback Procedure
1. Restore the prior parent-level research path if the validator requires it.
2. Restore child metadata to a valid child-only packet shape.
3. Re-run parent recursive validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: File move reversal plus metadata refresh.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Research state -> final synthesis -> inventory classes -> phase handoff
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Research artifacts | Completed deep-research run | Evidence source | Inventory and later phases |
| Inventory classes | Research synthesis plus grep | Surface matrix | Phase 002 edits |
| Metadata refresh | Authored docs | Discoverable phase packet | Validation closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Move research evidence** - 15-30 minutes - CRITICAL
2. **Replace scaffold docs** - 30-60 minutes - CRITICAL
3. **Refresh metadata and validate** - 30-90 minutes - CRITICAL

**Total Critical Path**: 1-3 hours

**Parallel Opportunities**:
- Metadata checks can run after all child docs are authored.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Evidence localized | Research artifacts live in phase 001 | Phase 001 |
| M2 | Inventory contract documented | Active surface classes named | Phase 001 |
| M3 | Validation ready | Metadata refreshed and strict validation passes | Phase 001 |
<!-- /ANCHOR:milestones -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the work remains documentation-only for phase 001.
- Read the research synthesis and target docs before edits.
- Keep runtime, registry, advisor, and command files out of scope.
- Run strict phase validation before claiming completion.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Preserve research evidence before metadata or validation edits. |
| TASK-SCOPE | Modify only phase 001 docs and metadata unless the parent phase map requires a reference update. |
| TASK-VERIFY | Re-run strict validation after authored doc or metadata changes. |

### Status Reporting Format

Use `phase=001; task=<T###>; status=<pending|in_progress|blocked|complete>; evidence=<file-or-command>`.

### Blocked Task Protocol

If BLOCKED, keep dependent checklist items unchecked, record the blocker in `implementation-summary.md`, and do not start phase 002 runtime edits.

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Keep research evidence phase-local

**Status**: Accepted

**Context**: The parent must stay lean, but the completed research is durable evidence for every implementation phase.

**Decision**: Store completed research in phase 001 and keep the parent as navigation only.

**Consequences**:
- The parent stays phase-parent compliant.
- Later phases have a stable evidence folder.

**Alternatives Rejected**:
- Leave research at parent: conflicts with lean phase-parent discipline.
