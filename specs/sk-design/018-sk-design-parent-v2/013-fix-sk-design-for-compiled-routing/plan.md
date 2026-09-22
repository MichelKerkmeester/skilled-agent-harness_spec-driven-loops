---
title: "Implementation Plan: Compile current sk-design for compiled routing"
description: "Compile the live four-mode registry and root router into the existing shadow-child contract, generate inert artifacts first, then promote a verified manifest and wire the runtime and advisor cohorts."
trigger_phrases:
  - "compiled routing implementation plan"
  - "sk-design rollout architecture"
  - "compiled routing testing strategy"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Compile current sk-design for compiled routing

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, JSON, TypeScript source and ESM dist |
| **Framework** | Existing compiled-routing runtime and route-evaluator contracts |
| **Storage** | Committed compiled snapshots and activation manifests |
| **Testing** | Node syntax checks, focused CJS probes, Vitest, admission and strict spec validation |

### Overview

The new shadow child reads the current `.skilled/skills/sk-design` bytes, validates the four-mode registry against `hub-router.json`, parses the root `ROUTER.md`, and compiles a policy plus a bespoke routing model. Its canary routes stage one modes and resolves stage-two leaves from the root resource map. The build harness writes compiled artifacts and a legacy shadow manifest before the runtime and advisor cohort are updated.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement and frozen scope are documented.
- [x] Current registry, hub router, root router, leaf manifest, runtime engine, resolver, advisor, guard, and admission surfaces were read.
- [x] Rollback is available through the fleet flag or a manifest revert.

### Definition of Done

- [ ] All P0 acceptance criteria are Met.
- [ ] The focused runtime, admission, syntax, and packet validation checks pass.
- [ ] Generated artifacts are refreshed after source changes.
- [ ] The implementation summary records observed evidence and limitations.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Relationship-driven shadow compilation with fail-safe serving authority.

### Key Components

- **Current-source loader**: reads the live hub registry, hub router, root router, mode packets, and leaf manifest.
- **Registry compiler**: validates identity and ownership relationships, then emits policy, projection, graph, and routing-model artifacts.
- **Canary router**: scores mode signals, applies explicit mode and near-tie rules, then resolves root-router leaves for the selected modes.
- **Artifact harness**: writes deterministic compiled artifacts, typed route gold, policy card, and inert activation state.
- **Serving wiring**: registers the hub in the engine, resolver, advisor, guard, foundation assertions, and closure manifest.

### Data Flow

`live source bytes → compiler snapshot → canary replay → typed gold/admission → activation manifest → resolver flag/hash/generation gate → compiled front door`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design` registry and root router | Own stage-one and stage-two design routing | Read-only source input to the compiler | Source identity, root leaf closure, replay |
| Shadow rollout child | Produces compiled policy and canary decisions | Create current-hub implementation and artifacts | Build output, syntax, route gold |
| Runtime engine and resolver | Loads and authorizes compiled routes | Add one hub mapping and default-on member | Status, front door, flag matrix |
| Advisor source and dist | Probes eligible hubs and publishes cohort | Add the same hub in both copies | Foundation lockstep |
| Guard and closure manifest | Detects stale and incomplete serving state | Add hub and new runtime files | Guard and closure checks |
| Existing design playbook | Admission input | Do not rewrite unless current contract proves stale gold | Admission report and documented result |
<!-- /ANCHOR:affected-surfaces -->

---

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.

1. **Setup**: author packet docs and confirm current source and runtime contracts.
2. **Core**: add compiler, root-router-aware canary, build harness, fixture, and generated shadow artifacts.
3. **Wiring**: register engine, resolver, advisor, guard, closure metadata, and live skill contract.
4. **Verification**: replay both routing stages, run admission and status, run syntax and targeted tests, then validate the packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Compiler identity, root leaf ownership, scoring and fallback | Node probes and existing route contract |
| Integration | Build artifacts, activation freshness, runtime serving and flag behavior | Build harness, manifest CLI, route/status CLIs |
| Admission | Live sk-design routing gold and declared mode coverage | `compiled-route-admission.cjs --hub sk-design --json` |
| Cross-surface | Engine, resolver, advisor source/dist and guard membership | Foundation Vitest and focused cohort checks |
| Manual | A real mode-plus-leaf request through both stages | Compiled front door output plus canary trace |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current `sk-design` source tree | Internal | Green | No trustworthy policy can be compiled |
| Runtime contract schemas | Internal | Green | Generated policy cannot be served |
| Existing route admission and foundation gates | Internal | Green | Promotion cannot be proved |
| Source-sync authored resolver path | Internal | Yellow, pre-existing baseline failure | Sync proof remains blocked and is reported separately |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any focused check reports drift, unsafe routing, broken engine loading, or an incorrect live decision.
- **Procedure**: Set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing, or restore the prior activation manifest and cohort entries. Revert the implementation commit to remove the compiled child and generated artifacts.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Packet docs ─────► Shadow compiler/artifacts ─────► Cohort wiring ─────► Serving and admission proof
       └──────────────────────────────► Root leaf closure ───────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Packet docs | None | Core |
| Core | Packet docs, current source | Wiring |
| Root leaf closure | Current source | Wiring, verification |
| Wiring | Core, root leaf closure | Verification |
| Verification | Wiring | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Packet docs and source contract | Low | 30-60 minutes |
| Core compiler and artifacts | High | 2-4 hours |
| Cohort wiring | Medium | 45-90 minutes |
| Verification and packet closure | High | 1-2 hours |
| **Total** | | **4-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] The old runtime behavior is known: `sk-design` returns the legacy sentinel.
- [ ] The new manifest is fresh and selected policy identity is recorded.
- [ ] Focused admission and stage-two replay are green.

### Rollback Procedure

1. Set `SPECKIT_COMPILED_ROUTING=0`.
2. Confirm the front door returns the legacy sentinel for `sk-design`.
3. Restore the previous activation/cohort files if the implementation is being reverted.
4. Re-run the status probe and focused legacy fallback check.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Restore committed files or revert the implementation commit.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
source loader ─► registry compiler ─► canary router ─► typed gold
       │                 │                 │              │
       └──────────────► generated artifacts ─► activation ─► resolver/front door
                                               └────────────► advisor and guard
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Source loader | Live hub files | Byte snapshot | Compiler |
| Registry compiler | Snapshot and schemas | Policy and projections | Router, artifacts |
| Canary router | Routing model and policy | Typed decisions and leaf pairs | Gold, admission |
| Build harness | Compiler, router, fixture | Committed artifacts | Activation |
| Runtime wiring | Generated activation and child | Served route | Final proof |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Compile the current source contract** - 90 minutes - CRITICAL
2. **Build and verify route gold and activation identity** - 60 minutes - CRITICAL
3. **Wire the runtime and advisor cohorts** - 45 minutes - CRITICAL
4. **Replay both stages and run admission/status gates** - 60 minutes - CRITICAL

**Total Critical Path**: 4 hours 15 minutes

**Parallel Opportunities**:
- Packet metadata refresh and source inventory can run beside the initial compiler adaptation.
- Cohort text updates can be prepared while generated artifacts are being checked.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Current source compiles | Snapshot and artifacts generated without retired-mode assumptions | Core |
| M2 | Both routing stages replay | Mode and leaf outputs match focused gold | Core |
| M3 | Serving is promoted | Status is fresh and front door serves compiled | Wiring |
| M4 | Packet closes | Acceptance, strict validation, and final proof are complete | Verification |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr -->
## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Compile the current root-router contract

**Status**: Accepted

**Context**: The deleted historical design rollout used retired modes and a prior generation model. The live hub now selects modes through `hub-router.json` and leaves through root `ROUTER.md`.

**Decision**: Build a relationship-driven child from the current source bytes. Treat the root router as the stage-two leaf source and derive mode ownership from the live registry and leaf manifest.

**Consequences**:
- The compiled policy follows current source identity and fails when the source contract drifts.
- The implementation does not preserve historical fixture assumptions.

**Alternatives Rejected**:
- **Copy the deleted rollout unchanged**: it names modes and resources that no longer exist.
- **Use the generic parent compiler without a shadow child**: it cannot reproduce this hub's root-router leaf contract.

### ADR-002: Promote only after independent serving identity is proven

**Status**: Accepted

**Context**: A minted manifest is not enough to establish compiled authority. The resolver already requires flag permission, compiled serving state, matching policy hash, and matching generation.

**Decision**: Generate shadow-only artifacts first, then set the activation manifest to compiled only after focused admission, freshness, status, and both-stage replay checks pass.

**Consequences**:
- The flag and manifest remain immediate rollback controls.
- A stale or broken child falls back to legacy rather than throwing into routing.

**Alternatives Rejected**:
- **Activate on artifact creation**: it would make generated bytes authoritative before parity is observed.
<!-- /ANCHOR:l3-adr -->

---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before starting a task, confirm the current phase, read the targeted files, and check that the task's prerequisite evidence exists. A task whose prerequisite evidence is missing is not startable.

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Tasks run in documented order unless marked parallelizable. |
| TASK-SCOPE | A task touches only the files its row names. |
| TASK-EVIDENCE | A command counts as evidence only after its output and exit status are read. |
| TASK-DEVIATION | A deviation from the documented step is recorded, never absorbed silently. |

### Status Reporting Format

Every status report states what ran and what it returned, what was inferred, what only the operator can verify, and the edited, committed, and pushed state of the work.

### Blocked Task Protocol

A blocked task records the blocker, the evidence, and the proposed next step, then stops. The `[B]` marker in tasks.md carries the blocker text in the same row, and an unresolved blocker keeps the packet open.
<!-- /ANCHOR:ai-protocol -->
