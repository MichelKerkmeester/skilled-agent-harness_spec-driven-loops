---
title: "Implementation Plan: Phase 7: shared-references-and-detection-order"
description: "Trim sk-code shared references to hub and mode doctrine, declare SKILLED as the one fallback surface in mode-registry.json, and teach the compiler, canary router, replay library, advisor plugin and fleet gate to read the declared order."
trigger_phrases:
  - "shared references and detection order plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 7: shared-references-and-detection-order

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, TypeScript tests, Markdown |
| **Framework** | sk-code parent hub, compiled routing, system-skill-advisor plugin |
| **Storage** | JSON registries (`mode-registry.json`, `graph-metadata.json`, `leaf-manifest.json`) |
| **Testing** | `node --test`, vitest, `verify-router-sync.cjs`, `parent-skill-check.cjs` |

### Overview
Worker one deletes or moves the shared references that are not hub doctrine and repoints every reader. Worker two moves surface order out of a regex and into declared data, with SKILLED as the single fallback that always ranks last. Phase A records the work and lets the fleet gate accept the outside declaration key. Phase B regenerates the derived files and runs the gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declared data, many readers.

### Key Components
- **`mode-registry.json` `surfaceDetection`**: the hub's declaration. `sk-code-skilled` carries label `SKILLED`, role `fallback`, path markers `.skilled/` and `.opencode/`, file markers and content markers.
- **`graph-metadata.json` `surface_detection`**: the declaration an outside sk-code family skill makes. Always treated as specific.
- **Registry compiler**: `validateSurfaceDetection` enforces the contract and emits `routingModel.surfaceDetection = { fallback, labels, specific }`.
- **Canary router**: resolves a hint by declared label. A fallback hint is a no-op.
- **Replay library and advisor plugin**: read the same order for text replay and workspace detection.

### Data Flow
Order is built as hub specific entries in `modes[]` order, then outside skills sorted by `skill_id`, then the fallback, then UNKNOWN. When a specific surface and SKILLED both match, the specific one leads and SKILLED stays as second evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `router-replay-lib.cjs` | Owned the hard-coded SKILLED regex | update | Replay parity over 77 hub playbook prompts |
| `system-skill-advisor.js` `detectWorkspaceSurface` | Hinted only SKILLED | update | `system-skill-advisor-plugin.vitest.ts`, 3 new cases |
| `registry-compiler.cjs`, `canary-router.cjs` | A SKILLED hint led a tie | update | `compiled-route-surface-hint.test.cjs`, 4 new cases |
| `ci-skill-root-metadata.cjs` | Closed top-level key set | update | `skill-root-metadata-contract.test.cjs`, 2 new cases |
| `hub-router.json` | tieBreak already ends with `sk-code-skilled` | unchanged | `rg -n tieBreak` |
| `advisor-surface-hint.vitest.ts` | Forwards the hint only | not a consumer | No change needed |

Required inventories:
- Same-class producers: `rg -n 'SKILLED' .skilled/skills/sk-code .skilled/plugins .skilled/bin/lib/compiled-routing`.
- Consumers of the moved style guide: `rg -n 'universal/code-style-guide' . --glob '!**/changelog/**'`.
- Matrix axes: surface kind (hub specific, outside specific, fallback, none) by hint (none, specific, fallback, UNKNOWN).
- Algorithm invariant: the fallback holds on real paths only through path markers resolved inside the hub's own `.skilled/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records both workers' notes. Implementation covers the two workers' changes and the phase A integration edits. Verification is phase B: regeneration, re-mint, Hermes sync and the full gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Compiler validation, hint resolution, fleet gate key | `node --test`, plain node test runners |
| Integration | Router sync, parent skill check, compiled-route suites | `verify-router-sync.cjs`, `parent-skill-check.cjs`, `compiled-route-*.test.cjs` |
| Manual | Replay parity over the hub playbook prompts | `router-replay-lib.cjs` old against new |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Optimizer workers on five shared references | Internal | Yellow | Phase B waits |
| `generate-leaf-manifest.cjs`, `compiled-route-manifest.cjs`, `compiled-route-sync.cjs`, Hermes sync | Internal | Green | Gates stay red on known drift |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate fails for a cause other than the known regeneration drift, or routing for a mixed prompt picks the wrong surface.
- **Procedure**: Revert the phase commit, rerun `compiled-route-sync.cjs` and `generate-leaf-manifest.cjs --write`, then rerun router-sync.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (notes) ──► Implementation (workers + phase A) ──► Verification (phase B)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation, optimizer workers done | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | High | Done by two workers |
| Verification | Med | 1 hour, an assumption |
| **Total** | | **About 1.5 hours left** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline gate numbers captured (both worker notes record them)
- [x] Authored twins match served copies (`compiled-route-sync.cjs --check`)

### Rollback Procedure
1. Revert the phase commit.
2. Rerun `compiled-route-sync.cjs` so served copies follow the reverted twins.
3. Rerun `generate-leaf-manifest.cjs --write .skilled/skills/sk-code` and router-sync.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
mode-registry.json ──► registry-compiler ──► canary-router ──► compiled manifests (phase B)
        │
        ├──► router-replay-lib ──► verify-router-sync leg 4
        └──► advisor plugin
graph-metadata.json surface_detection ──► ci-skill-root-metadata gate
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `mode-registry.json` | None | Declared order | Compiler, replay, plugin |
| Registry compiler | Registry | `routingModel.surfaceDetection` | Canary router, re-mint |
| Shared reference cleanup | None | Moved style guide | Leaf manifest regeneration |
| Fleet gate key | None | Accepted outside block | Any outside declaration |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Optimizer workers finish** - unknown - CRITICAL
2. **Leaf manifest regeneration and compiled routing re-mint** - 20 minutes - CRITICAL
3. **Full gates and recursive strict validation** - 30 minutes - CRITICAL

**Total Critical Path**: about 50 minutes after the optimizers finish

**Parallel Opportunities**:
- The Hermes sync and the trigger index rebuild can run beside the re-mint
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Workers done | Both notes files record their checks | Done |
| M2 | Phase A done | Fleet gate tests pass and this child validates | Phase A |
| M3 | Phase B done | Router-sync 5/5, parent-skill-check OK, compiled-route suites pass | Phase B |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: SKILLED is a declared fallback

**Status**: Accepted

**Context**: Detection hard-coded SKILLED first in one regex, so no other surface could lead.

**Decision**: `sk-code-skilled` declares `surfaceDetection` with role `fallback`. The compiler requires exactly one fallback on a hub with surface packets, last in tieBreak.

**Consequences**:
- A private or repo-added surface leads SKILLED when both match
- The fallback's `.ts` file marker could claim any TypeScript file. Mitigation: on real paths the fallback holds only through path markers inside the hub's own `.skilled/`

**Alternatives Rejected**:
- Reorder the regex: still one hard-coded list that an outside skill cannot extend

### ADR-002: Outside skills declare in graph-metadata.json

**Status**: Accepted

**Context**: An outside sk-code family skill has no `mode-registry.json` entry in the hub.

**Decision**: It declares the same inner block under the top-level key `surface_detection`. The fleet gate accepts the key as an optional object. A block claiming role `fallback` is ignored.

**Consequences**:
- The private `local-*` skills can opt in without a hub edit
- The fleet gate checks only the object shape. The detectors own the inner fields

**Alternatives Rejected**:
- A hub registry entry per outside skill: would put private ids in a tracked file

### ADR-003: Shared workflow docs stay shared controls

**Status**: Accepted

**Context**: `root-router-contract.cjs` fails an empty RESOURCE_MAP list, and a surface symlink path fails router-sync leg 2.

**Decision**: DEBUGGING and VERIFICATION point at the canonical `shared/references/workflow-*.md` paths, listed in SHARED_CONTROL_RESOURCES.

**Consequences**:
- The workflow docs have no single packet owner, which is what a shared control is

**Alternatives Rejected**:
- Route the symlinked surface copy: fails router-sync leg 2

---

## L3: AI Execution Protocol

### Pre-Task Checklist

- [x] Read `spec.md`, `tasks.md`, `acceptance-criteria.md` and both worker notes before editing.
- [x] Capture router-sync, parent-skill-check and suite baselines before any edit.
- [x] Confirm no optimizer is still editing a shared reference before phase B regenerates anything.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope lock | Edit only the files the two workers, the optimizers and the integration step name. |
| Regenerate, never hand-edit | Leaf manifest, activation manifests, Hermes copies, trigger index and retrieval fixtures come from their generators. |
| Twin parity | Every served compiled-routing copy changes with its authored twin, proven by `compiled-route-sync.cjs --check`. |
| Verification gate | No completion claim until every acceptance row is Met with observed output. |

### Status Reporting Format

```text
phase: 007
status: in-progress | blocked | verified
completed_tasks: T### list
next_task: T###
verification: command -> result
blockers: blocker list or none
```

### Blocked Task Protocol

Leave a blocked task unchecked, mark it `[B]` in `tasks.md`, record the blocker in `_memory.continuity.blockers` and name the next safe action. A blocked row never becomes `[x]` without observed evidence or an approved deferral.
