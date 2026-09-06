---
title: "Implementation Plan: a phrase the router declares reaches the hub"
description: "Probe the 55 keywords the sk-design router declares that its scoring vocabulary never sees, repair the 11 that genuinely fail, and remove the chart vocabulary sk-doc kept."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: a phrase the router declares reaches the hub

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Two vocabularies, two jobs. A router's `INTENT_SIGNALS` resolves an intent inside a hub already
chosen. A hub's `graph-metadata.json` `intent_signals` decides which hub gets chosen. They are not
meant to be identical, so the 55 keywords present in one and absent from the other are not 55 defects.

Probing fifteen found eleven real ones: eight reaching nobody, two reaching `sk-doc`, and one losing
an ordering to `sk-code`.

### Overview

Probe rather than diff, add only distinctive multi-word phrases, and replay both prior phrase sets as controls.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The problem statement and frozen scope are in `spec.md`
- [x] Success criteria are observable commands, not adjectives
- [x] A baseline for the probed phrases is captured before any edit

### Definition of Done
- [x] Every acceptance criterion in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [x] At least nine of eleven reach the hub, with both control sets unchanged
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Measure, repair, re-measure, with the controls in the same run as the change.

### Key Components

- **`sk-design/graph-metadata.json`**: 17 distinctive phrases.
- **`sk-doc/graph-metadata.json` and `description.json`**: two chart phrases removed.
- **The controls**: the packet's sixteen phrases and the preceding phase's twelve.

### Data Flow

A phrase scores against every hub's `intent_signals`; the winner's router then resolves an intent. Only the first stage is changed here.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Change |
|---------|--------|
| `sk-design/graph-metadata.json` | 137 to 154 signals |
| `sk-doc/graph-metadata.json` | 86 to 84 signals |
| `sk-doc/description.json` | 45 to 44 keywords |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | What | Gate |
|------|------|------|
| 1 | Diff both vocabularies across all six hubs to size the question | 168 orphaned keywords fleet-wide |
| 2 | Probe a sample rather than assuming the diff is the defect | 9 of 14 routed fine; the diff is not the bug |
| 3 | Probe the sk-design router's own declarations | 11 of 15 genuinely broken |
| 4 | Add distinctive phrases; remove sk-doc's chart residue | Rebuild and re-measure |
| 5 | Replay both control sets | Unchanged |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | How |
|-------|-----|
| The eleven | Probed before and after at a named generation |
| Ownership | `data visualization` compared across both hubs |
| No regression | Sixteen-phrase set and twelve-phrase surface set |
| Hub health | Fleet metadata, leaf manifests, derived freshness, graph validator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Depends on | Nature |
|-----------|--------|
| The two-stage routing model | Distinguishes a real gap from a design difference |
| `004` | Left the chart residue this phase removes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the three files and rebuild. The eleven phrases return to failing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| This phase | Depends on | Blocks |
|-----------|-----------|--------|
| `011-router-vocabulary-repair` | `008` | Nothing |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Size |
|------|------|
| Files | 3 |
| Signals added | 17 |
| Signals removed | 2 |
| Phrases probed | 15 plus 28 controls |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured first
- [x] Controls replayed in the same run as the change
- [x] Only distinctive multi-word phrases added

### Rollback Procedure
1. Revert the three files
2. Rebuild and observe the generation move
3. Expect the eleven to fail again

### Data Reversal

None. Vocabulary only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
diff both vocabularies across 6 hubs -> 168 orphans
        |
        v
probe a sample -> 9 of 14 route anyway: the diff is not the defect
        |
        v
probe sk-design's own declarations -> 11 of 15 genuinely broken
        |
        v
add 17 distinctive phrases | remove sk-doc's 2 chart phrases
        |
        v
rebuild (666 -> 667) -> 9 of 11 fixed, both control sets unchanged
```

### Dependency Matrix

| Step | Needs | Produces |
|------|-------|----------|
| Diff | Both vocabularies | A candidate list, not a defect list |
| Probe | The candidates | The 11 real ones |
| Repair | The 11 | 17 additions, 2 removals |
| Replay | A rebuild | Proof no control moved |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Probing before repairing. The diff says 55; the truth is 11, and treating the diff as the defect list
would have added 44 common words that over-trigger hub selection.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Sized | 168 orphans fleet-wide, 55 on this hub |
| Diagnosed | 11 genuinely broken, probed |
| Repaired | 9 of 11 route; `data visualization` ownership flipped |
| No regression | Both control sets unchanged |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Probe each candidate rather than diffing the vocabularies

**Status**: Accepted

**Context**: 55 keywords the sk-design router declares are absent from the hub's scoring vocabulary,
and 168 across the fleet. Treating that gap as a defect list is the obvious move and the wrong one:
the two vocabularies serve different stages, and a sample of 14 orphans found 9 routing correctly
anyway.

**Decision**: Probe every candidate against the live advisor. Repair only what actually fails.

**Consequences**:
- 11 real defects fixed instead of 55 imagined ones.
- 44 bare common words stay out of hub selection, where they would over-trigger.
- The distinction is written into the spec so the next reader does not repeat the diff.

**Alternatives Rejected**:
- Sync the two lists: adds `padding`, `color` and `shadow` to stage-one hub selection.

### ADR-002: The packet's baseline proved less than it appeared to

**Status**: Accepted

**Context**: Every replay in this packet passed while eleven router-declared phrases were dead,
because the sixteen-phrase baseline did not contain any of them.

**Decision**: Record it plainly rather than quietly widening the baseline.

**Consequences**:
- The packet's central claim is narrower than it read: no phrase *in the baseline* stopped arriving.
- A future packet choosing a baseline knows to sample the router's own declarations.

**Alternatives Rejected**:
- Add the eleven to the baseline retroactively: makes the earlier replays look like they covered
  something they never did.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
