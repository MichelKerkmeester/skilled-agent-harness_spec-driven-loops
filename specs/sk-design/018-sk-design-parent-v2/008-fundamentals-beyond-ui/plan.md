---
title: "Implementation Plan: fundamentals covers every surface, not only UI"
description: "Name the surfaces the fundamentals mode serves, say what differs between them, and put the vocabulary where the advisor actually reads it."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: fundamentals covers every surface, not only UI

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`sk-design-fundamentals` carried 46 UI-specific mentions against 1 non-UI. Its H1 read
`Visual UI Design`, its description said it "designs, builds and reviews UI", and its keyword block
was entirely screen vocabulary.

The judgment underneath is not screen-specific. A spacing scale, a type scale, a colour ramp and a
hierarchy pyramid decide a slide, a printed page and a report layout as much as they decide a
component. Only two of its six references are genuinely screen-only.

### Overview

Name five surfaces and what changes on each, say which two references do not apply off-screen, and
add surface vocabulary to the hub's `intent_signals`, which is the only file the advisor reads.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The problem statement and frozen scope are in `spec.md`
- [x] Success criteria are observable commands, not adjectives
- [x] A baseline for the new surface phrases is captured before any edit; it cannot be recaptured

### Definition of Done
- [x] Every acceptance criterion in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [x] Three previously-dead surface phrases route, and every control holds
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Broaden one mode rather than fork a second. The systems are shared; only the extras differ, so a
fork would duplicate the shared part and drift.

### Key Components

- **The surfaces table**: five surfaces, what applies, what changes, what does not.
- **`intent_signals`**: 17 new entries, the only vocabulary surface the advisor reads.
- **The router's VALUES and REVIEW keyword lists**: kept in step with the hub vocabulary.
- **The controls**: chart, diagram, padding, contrast and extract phrases, replayed to prove the
  widening did not pull a canvas phrase off the mode that owns it.

### Data Flow

A surface question scores against the hub's `intent_signals`, the hub resolves VALUES or REVIEW, and
fundamentals answers. Nothing new is loaded; the same references serve every surface bar two.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Change |
|---------|--------|
| `sk-design-fundamentals/SKILL.md` | H1, description, opening, a surfaces table, hierarchy framing, keyword block |
| `sk-design/graph-metadata.json` | 17 `intent_signals` for slide, print and document layouts |
| `sk-design/ROUTER.md` | VALUES and REVIEW keyword lists extended to match |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | What | Gate |
|------|------|------|
| 1 | Capture a baseline for twelve surface and control phrases | The file exists before any edit |
| 2 | Read the contract and decide what is genuinely screen-only | Two references, named |
| 3 | Rewrite the framing and add the surfaces table | The table says what changes per surface |
| 4 | Add vocabulary to `intent_signals`, not to `description.json` | Keywords there move no score |
| 5 | Rebuild and replay both sets | Dead phrases route; controls hold |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | How |
|-------|-----|
| The new surfaces route | Twelve-phrase replay against the pre-edit baseline |
| Nothing was pulled off its mode | Chart, diagram, padding, contrast and extract replayed as controls |
| No packet regression | The sixteen-phrase set replayed and diffed |
| The hub stays valid | Fleet metadata, leaf manifests, derived freshness, router contract |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Depends on | Nature |
|-----------|--------|
| `006` | The contract should name final mode names |
| `intent_signals` | The only vocabulary surface the advisor reads, measured twice in this packet |
| A pre-edit baseline | Unrepeatable once vocabulary changes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the three files and rebuild the advisor. The three surface phrases return to reaching nobody,
which is the state this phase found.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| This phase | Depends on | Blocks |
|-----------|-----------|--------|
| `008-fundamentals-beyond-ui` | `006` | Nothing |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Size |
|------|------|
| Files changed | 3 |
| `intent_signals` added | 17 |
| Phrases measured | 12 surface plus 16 packet |
| Commits | 1 |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured before any edit
- [x] Controls replayed alongside the new phrases, not after them
- [x] Vocabulary added where the advisor reads it

### Rollback Procedure
1. Revert the three files
2. Rebuild the advisor and observe the generation move
3. Expect the three surface phrases to reach nobody again

### Data Reversal

None. Documentation and vocabulary only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
capture baseline (12 phrases, unrepeatable)
        |
        v
read the contract -> decide what is genuinely screen-only
        |
        v
surfaces table + reframed opening + keyword block
        |
        v
17 intent_signals -> router keyword lists in step
        |
        v
rebuild (665 -> 666) -> replay both sets -> controls held
```

### Dependency Matrix

| Step | Needs | Produces |
|------|-------|----------|
| Baseline | An untouched vocabulary | The comparison target |
| Read | The contract and its references | What is shared, what is screen-only |
| Rewrite | That distinction | A table that says what changes per surface |
| Vocabulary | The rewrite | Reachable surfaces |
| Replay | An explicit rebuild | Proof the canvases kept their phrases |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The baseline, because it cannot be recaptured, and the controls, because the real risk here is not
that a new phrase fails to route but that it steals one that already did.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Surfaces named | Five, with what changes and what does not apply |
| Dead phrases route | 0.9059, 0.8962, 0.9112, from nothing |
| Existing phrases improved | Printed report 0.858 to 0.95; deck spacing 0.82 to 0.9059 |
| Controls held | Chart, diagram, padding, contrast, extract unchanged |
| No packet regression | Sixteen-phrase set: no owner changed, nothing below baseline |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Broaden the one mode rather than fork a second

**Status**: Accepted

**Context**: A slide deck, a printed page and a document layout each need the same spacing scale,
type scale, colour ramp and hierarchy pyramid that a screen does.

**Decision**: Name the surfaces inside `sk-design-fundamentals` and say what differs, rather than
adding a deck or print mode.

**Consequences**:
- The shared judgment lives once. A fork would duplicate it and the copies would drift.
- The mode's contract is longer and has to carry a per-surface table to stay specific.

**Alternatives Rejected**:
- A separate slide-deck mode: duplicates four systems to differentiate two references.

### ADR-002: Say what differs, not only what is shared

**Status**: Accepted

**Context**: Surface-agnostic framing that stops naming differences stops being useful. "Design
applies everywhere" helps nobody lay out a slide.

**Decision**: Carry a table naming each surface, which systems apply, what changes, and what does not
apply at all.

**Consequences**:
- A deck question gets the systems and is told to skip focus rings and touch targets.
- The table is a maintenance surface: a new reference has to be classified as shared or screen-only.

**Alternatives Rejected**:
- A single sentence saying the rules are surface-agnostic: true and useless.

### ADR-003: Leave the deck-review ordering to whoever owns it

**Status**: Accepted

**Context**: `design review of this slide deck` reaches this hub at 0.9107 but `sk-code` wins at
0.9379. The pattern holds across rephrasings and inverts when the review verb is dropped.

**Decision**: Record it. Do not inflate this hub's weights or trim another hub's vocabulary.

**Consequences**:
- The requirement is satisfied, since the phrase reaches the hub above the bar.
- A design review of a non-code artifact still routes to the code skill first, which is a real
  question this phase is not scoped to answer.

**Alternatives Rejected**:
- Trim `sk-code`'s review vocabulary: changing another hub to win an ordering contest is how
  vocabulary drifts across a fleet.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
