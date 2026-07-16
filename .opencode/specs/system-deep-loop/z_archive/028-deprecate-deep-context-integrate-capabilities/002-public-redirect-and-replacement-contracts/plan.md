---
title: "Implementation Plan: Public Redirect And Replacement Context Contracts"
description: "Plan the staged /deep:context redirect, context snapshot replacement contracts, and generated command contract regeneration without starting runtime edits before validation."
trigger_phrases:
  - "deep-context redirect plan"
  - "replacement context snapshot plan"
  - "deep-context command contract regeneration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/028-deprecate-deep-context-integrate-capabilities/002-public-redirect-and-replacement-contracts"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "opencode"
    recent_action: "Planned phase 002 redirect and replacement contracts"
    next_safe_action: "Run validation and resolve command source authority"
    blockers:
      - "Missing maintained command source listed by compiled contract."
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-002-plan"
      parent_session_id: "2026-07-04-phase-002-contract-authoring"
    completion_pct: 20
    open_questions:
      - "Resolve command source authority before runtime edits."
    answered_questions:
      - "Generated contracts are regenerate-only."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Public Redirect And Replacement Context Contracts

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command contracts, YAML workflows, JSON registry/manifest, Node command compiler |
| **Framework** | OpenCode command assets, deep-loop-workflows packets, SpecKit validation |
| **Storage** | `.opencode/commands/deep/assets/`, `.opencode/skills/deep-loop-workflows/`, phase-local spec docs |
| **Testing** | Targeted grep, command contract regeneration, YAML path checks, SpecKit strict validation |

### Overview

Use the smallest safe runtime change: make `/deep:context` stop before legacy YAML dispatch, then add replacement context snapshot rules to `deep-research` and `deep-review`. The generated command contract is updated only by the existing compiler after maintained sources are corrected.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent phase structure approved by user.
- [x] Phase 001 research baseline available.
- [x] Active command assets observed with direct glob/grep.
- [ ] `/deep:context` maintained source authority resolved.
- [ ] Phase 002 docs validate without placeholders.

### Definition of Done
- [ ] `/deep:context` cannot load legacy context-loop YAML for new runs.
- [ ] `deep-research` and `deep-review` expose replacement context snapshot rules.
- [ ] Compiled command contracts and manifest are regenerated from maintained sources.
- [ ] Phase 002 checklist records direct verification evidence.
- [ ] Parent recursive strict validation passes after metadata refresh.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fail-closed public redirect plus embedded bounded snapshot contracts.

### Key Components
- **Command redirect**: a maintained command source or legacy body that stops before loading `deep_context_auto.yaml` or `deep_context_confirm.yaml`.
- **Workflow guard**: YAML-level early halt so direct YAML loading cannot start the old loop accidentally.
- **Replacement snapshot**: strategy/prompt guidance in `deep-research` and `deep-review` that captures pointers, integration points, reuse candidates, and risks without full source bodies.
- **Generated contract**: compiled command contract and manifest regenerated from source edits.

### Data Flow

```text
User asks for /deep:context
  -> command source resolves mode
  -> deprecation guard halts before legacy YAML dispatch
  -> guidance routes to @context, /deep:research, /deep:review, or /speckit:plan

Codebase-aware research/review
  -> strategy init records bounded context snapshot
  -> iterations read pointers on demand
  -> synthesis cites snapshot inputs
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/deep/assets/legacy/deep_context.body.md` | Observed router body for legacy command source | Update or replace after source authority resolution | Read source, grep redirect text |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Autonomous legacy context loop | Add early fail-closed guard | Grep guard and run YAML path check |
| `.opencode/commands/deep/assets/deep_context_confirm.yaml` | Confirm-mode legacy context loop | Add early fail-closed guard | Grep guard and run YAML path check |
| `.opencode/commands/deep/assets/deep_context_presentation.txt` | User-facing setup and result text | Replace with deprecation guidance | Read/grep guidance |
| `.opencode/commands/deep/assets/compiled/deep_context.contract.md` | Generated contract | Regenerate only | Compiler output diff includes updated source digests |
| `.opencode/skills/deep-loop-workflows/deep-research/*` | Research replacement owner | Add bounded context snapshot contract | Direct read plus targeted grep |
| `.opencode/skills/deep-loop-workflows/deep-review/*` | Review replacement owner | Add bounded context snapshot contract | Direct read plus targeted grep |

Required inventories:
- Same-class producers: search `/deep:context`, `deep_context`, `deep-context`, `workflowMode.*context`, and `runtimeLoopType.*context` before edits.
- Consumers of changed symbols: search `deep_context_auto`, `deep_context_confirm`, `deep_context.contract`, `Context Report`, `context-report`, and `resource-map` after edits.
- Matrix axes: auto mode, confirm mode, direct YAML guard, generated contract, research snapshot, review snapshot, historical artifacts.
- Algorithm invariant: no new standalone context-loop dispatch can occur after the public redirect phase passes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source Authority And Baseline
- [x] Inspect current command assets and generated contract.
- [ ] Resolve whether `.opencode/commands/deep/context.md` should be restored or removed from generation inputs.
- [ ] Capture fresh pre-edit grep inventory for command, registry, advisor, docs, fixtures, and runtime references.

### Phase 2: Replacement Contracts
- [ ] Add bounded context snapshot guidance to `deep-research` strategy and skill docs.
- [ ] Add bounded context snapshot guidance to `deep-review` strategy, skill docs, and review contract if needed.
- [ ] Confirm replacement guidance preserves `@context` for quick one-shot retrieval.

### Phase 3: Public Redirect
- [ ] Update maintained `/deep:context` source to show deprecation guidance.
- [ ] Add early halt guards to auto and confirm YAML assets.
- [ ] Update presentation text so all user-facing output agrees.

### Phase 4: Regeneration And Verification
- [ ] Run the command contract compiler.
- [ ] Run YAML path checks for deep command assets.
- [ ] Verify `/deep:context:auto` and `/deep:context:confirm` stop before legacy dispatch.
- [ ] Refresh metadata and run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source inventory | Active context references before and after edits | Grep/Glob |
| YAML integrity | Deep command workflow paths and shell/script references | Existing `verify-yaml-script-paths.sh` where applicable |
| Contract generation | Compiled command contract and manifest | Existing `compile-command-contracts.cjs` |
| Command behavior | Auto and confirm redirect/halting path | Direct command or contract smoke check |
| Spec validation | Phase 002 and parent packet | `validate.sh --strict`, recursive validation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 research synthesis | Internal evidence | Green | Implementation order loses source-of-truth rationale if ignored. |
| Command source authority | Internal command structure | Red | Runtime edits may target the wrong maintained file. |
| Command contract compiler | Internal tooling | Yellow | Generated contract may remain stale. |
| Code graph freshness | Internal index | Yellow | Use direct grep/read until refreshed. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `/deep:context` fails without replacement guidance, generated contracts do not match source edits, or research/review tests fail after snapshot changes.
- **Procedure**: Revert only phase 002 runtime file changes, regenerate command contracts from the prior maintained source, and keep phase docs noting the failed attempt and blocker. Existing context artifacts are unaffected.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Resolve command source authority
  -> add replacement snapshot contracts
  -> fail-closed public redirect
  -> regenerate contracts
  -> hand off to discoverability cleanup
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Source authority | Direct file inventory | Runtime edits |
| Replacement contracts | Phase 001 research | Public redirect closure |
| Public redirect | Replacement guidance | Phase 003 discoverability cleanup |
| Regeneration | Maintained source edits | Validation closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source authority | Medium | 30-90 minutes |
| Replacement contracts | Medium | 1-2 hours |
| Public redirect | Medium | 1-2 hours |
| Regeneration and verification | Medium | 1-2 hours |
| **Total** | | **4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Capture pre-edit copies through git diff, not separate backup files.
- [ ] Confirm generated files are regenerated, not manually edited.
- [ ] Confirm no existing context artifacts are deleted in this phase.

### Rollback Procedure
1. Revert maintained command, YAML, and research/review source edits from this phase.
2. Re-run command contract generation to restore compiled outputs.
3. Re-run command/YAML smoke checks to confirm previous behavior or documented halt.
4. Update phase docs with the blocker if source authority remains unresolved.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: File-level revert and regeneration only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phase 001 inventory -> source authority -> replacement contracts -> redirect -> generation -> phase 003
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Source authority resolution | Direct command file inventory | Maintained edit target | All runtime edits |
| Snapshot contracts | Research/review docs | Replacement guidance | Public redirect confidence |
| Redirect guard | Command/YAML source | Deprecated public route | Discoverability cleanup |
| Generated contracts | Compiler | Updated compiled contract and manifest | Phase handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Resolve source authority** - 30-90 minutes - CRITICAL
2. **Patch replacement contracts** - 1-2 hours - CRITICAL
3. **Patch public redirect and YAML guards** - 1-2 hours - CRITICAL
4. **Regenerate contracts and verify** - 1-2 hours - CRITICAL

**Total Critical Path**: 4-7 hours

**Parallel Opportunities**:
- Research and review snapshot doc edits can be prepared together after the source authority blocker is understood.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Source authority resolved | Maintained `/deep:context` source is present or generator inputs are corrected | Phase 002 |
| M2 | Replacement contracts present | Research/review snapshot rules exist and cite alternatives correctly | Phase 002 |
| M3 | Public route closed | Auto and confirm invocations cannot dispatch legacy context loop | Phase 002 |
| M4 | Contract generation done | Compiled contract and manifest match maintained sources | Phase 002 |
<!-- /ANCHOR:milestones -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm phase 001 evidence and this phase validate before runtime edits.
- Resolve `/deep:context` command source authority before changing behavior.
- Read every command, YAML, and workflow file before editing it.
- Keep compiled contract files regenerate-only.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Resolve source authority, then patch replacement contracts, then close the public route. |
| TASK-SCOPE | Do not perform registry, advisor, fixture, benchmark, or runtime cleanup in phase 002. |
| TASK-VERIFY | Run command/contract smoke checks and strict validation before phase 003 starts. |

### Status Reporting Format

Use `phase=002; task=<T###>; status=<pending|in_progress|blocked|complete>; evidence=<file-or-command>`.

### Blocked Task Protocol

If BLOCKED, document the source-authority or command-check failure in `implementation-summary.md`, leave checklist items unchecked, and stop before discoverability cleanup.

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Fail Closed Before Discoverability Cleanup

**Status**: Proposed

**Context**: Users can still reach standalone context behavior through command assets and compiled contracts. Removing discoverability first would hide the path without proving it is safe.

**Decision**: Close the public route first and keep cleanup phases separate.

**Consequences**:
- Public behavior becomes safe before registry and docs are cleaned.
- Existing discoverability may briefly point to a redirect message. This is acceptable because phase 003 removes or updates those references next.

**Alternatives Rejected**:
- Remove registry and docs first: rejected because command assets would still allow legacy runs.
- Delete the nested packet immediately: rejected because phase 004 must handle fixtures, benchmarks, and runtime branches after tests.
