---
title: "Implementation Plan: Phase 5: routing-integration [template:level-3/plan.md]"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: routing-integration

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON routing policy, Markdown routing documents, Node harnesses |
| **Framework** | sk-doc parent hub, two-stage routing, compiled route manifest |
| **Storage** | None. Every surface is a file in the repository |
| **Testing** | The hub canary, the per-hub invariant gate and live replays of both stages |

### Overview

Register `sk-create-chart` as the sixteenth mode of the `sk-doc` hub, give it vocabulary that reaches it at both routing stages, cover the route with a canary case that fails when the registration is withdrawn and republish the compiled routing the hub serves from.
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
- [x] Canary green, and shown red under a withdrawn registration
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-stage routing under one advisor identity. The advisor scores the hub from `graph-metadata.json`, and only then does the hub pick a mode from `hub-router.json` and `ROUTER.md`.

### Key Components
- **`mode-registry.json`**: the packet registration. Nothing routes without it.
- **`hub-router.json`**: the stage-one signal weight, the vocabulary class and the tie-break slot. Key order in `routerSignals` is the compiled tie-break, so position decides who wins a score tie.
- **`ROUTER.md`**: the stage-two intent and the leaves that intent loads.
- **`graph-metadata.json` and `description.json`**: the only path a metadata-class mode has to the advisor.
- **The hub canary**: the route coverage guard, derived from the live registry rather than a written list.

### Data Flow

A request reaches the advisor, which scores hubs from their graph metadata. When `sk-doc` wins, the compiled policy scores modes by counting keyword hits and multiplying by the mode weight. The effective keyword set is the union of the registry aliases and the router vocabulary class, so an edit to one file alone changes nothing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` | packet registration | update | `parent-skill-check` 3b reports 16 modes |
| `hub-router.json` | stage-one signals, vocabulary, tie-break | update | `parent-skill-check` 5b and 5e pass |
| `ROUTER.md` | stage-two intent and leaves | update | router replay resolves the mode to leaves that exist |
| `graph-metadata.json`, `description.json` | advisor identity | update | an advisor run selects `sk-doc` for chart phrasings |
| `SKILL.md` at the hub | human-facing mode table | update | `parent-skill-check` 6b names 16 modes |
| `leaf-manifest.json` | leaf index | regenerate | `parent-skill-check` 10b byte drift passes |
| The hub canary fixture and its pins | route coverage | update | canary green, and red when the registration is withdrawn |
| The compiled route manifest | served policy | refresh, sync, verify, finalize | freshness reports `fresh` and status reports `compiled-serving` |
| `sk-create-diagram` | nearest neighbour | not a consumer, unchanged | every neighbour prompt resolves identically before and after |

Required inventories:
- Effective vocabulary: `vocabularyForMode` unions `workflowMode`, `command`, registry `aliases` and the router class keywords.
- Collision inventory: every candidate keyword checked in both directions against all existing keywords in `hub-router.json`, `mode-registry.json` and `ROUTER.md`.
- Matrix axes: six chart phrasings, twelve neighbour phrasings and three out-of-domain phrasings, each replayed at both stages.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. That file owns the Setup, Implementation and Verification phase checkboxes along with the task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Hub invariants, leaf manifest drift | `parent-skill-check.cjs` |
| Integration | Both routing stages on real phrasings | `router-replay.cjs`, `skill-advisor.cjs` |
| Manual | The negative control that withdraws the registration | `validate-canary.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 3 packet scaffold | Internal | Green | Nothing to register |
| Phase 4 chart corpus | Internal | Green | A route to an empty packet proves nothing |
| Compiled route manifest tooling | Internal | Green | The hub silently drops to a legacy path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A neighbour mode stops resolving, or a post-publish gate fails.
- **Procedure**: `compiled-route-sync.cjs --revert <retained rollback>` restores the previous promoted mirror. The authored surfaces revert with `git checkout` on the seven hub files, after which the leaf manifest is regenerated and the canary artifacts are rebuilt.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Vocabulary design ──► Registration ──► Both stages verified ──► Canary ──► Publication
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Vocabulary design | None | Registration |
| Registration | Vocabulary design | Verification |
| Verification | Registration | Canary |
| Canary | Verification | Publication |
| Publication | Canary | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Baseline capture across both stages |
| Core Implementation | Med | Seven routing surfaces plus the mode's own documents |
| Verification | High | Two stages, twelve neighbours and a negative control |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured for every prompt before any edit
- [x] Rollback directory retained by the sync tool
- [x] Hub status read before and after publication

### Rollback Procedure
1. `compiled-route-sync.cjs --revert <retained rollback>`
2. `git checkout` the hub routing files
3. Regenerate `leaf-manifest.json` and rebuild the canary artifacts
4. Re-run `parent-skill-check.cjs` and the canary

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Vocabulary  │───►│ Registration │───►│ Verification │
└──────────────┘    └──────┬───────┘    └──────┬───────┘
                          │                    │
                    ┌─────▼──────┐      ┌──────▼──────┐
                    │   Canary   │─────►│ Publication │
                    └────────────┘      └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Vocabulary | Collision inventory | 33 keywords | Registration |
| Registration | Vocabulary | Seven wired surfaces | Verification, Canary |
| Verification | Registration | Both-stage evidence | Canary |
| Canary | Registration | Coverage plus a negative control | Publication |
| Publication | Canary | A refreshed served manifest | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Vocabulary design and collision inventory** - the whole route hangs on it - CRITICAL
2. **Registration across all seven surfaces** - a partially wired mode is invisible - CRITICAL
3. **Publication of the compiled manifest** - without it the hub serves the old policy - CRITICAL

**Total Critical Path**: One session

**Parallel Opportunities**:
- The mode's own stale documents can be corrected while the routing edits settle
- Neighbour replays and chart replays run from the same driver
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Registration closes the hub gate | `parent-skill-check` exits 0 and invariant 6a passes | Registration |
| M2 | Both stages resolve | The advisor selects `sk-doc` and the router resolves `sk-create-chart` | Verification |
| M3 | Coverage that can fail | The canary is green, and red once the registration is withdrawn | Canary |
| M4 | The hub serves what the files say | Freshness reports `fresh` and status reports `compiled-serving` | Publication |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: The neighbour keeps its bare type names

**Status**: Accepted

**Context**: `sk-create-diagram` documents bar, line, scatter, radar, Gantt and org-chart types in its own selection guide, and none of those names carried routing vocabulary before this phase. Claiming them would have been free in routing terms, because that packet scored zero on them.

**Decision**: Leave the bare type names with `sk-create-diagram`. Claim the form names that packet has no file for, the explicit chart-authoring phrasings and three data-qualified forms: `bar chart of`, `line chart of` and `scatter plot of`.

**Consequences**:
- A request that names a data chart reaches the chart packet, and a request that names a diagram type reaches the diagram packet.
- A bare "make a bar chart" with no object still reaches neither, which is unchanged from before this phase.

**Alternatives Rejected**:
- Claim the bare names: routing would have been cleaner, but the neighbour's own documentation would then promise a capability requests never reach.
- Claim nothing beyond the unique form names: the packet's most common request would stay unreachable.

### ADR-002: Weight parity with the nearest neighbour

**Status**: Accepted

**Context**: Mode score is the keyword hit count multiplied by the mode weight, and the ambiguity delta is one. A mode at weight 4 beside a neighbour at weight 3 wins every single-hit tie.

**Decision**: Give `sk-create-chart` weight 3, matching `sk-create-diagram`, and place it after that mode in `routerSignals` key order so a genuine tie resolves to the neighbour.

**Consequences**:
- Neither visual mode outranks the other by construction.
- A phrase that genuinely hits both produces a clarify rather than a silent pick.

**Alternatives Rejected**:
- Weight 4: it would have taken ties from the neighbour, which the phase scope forbids.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
