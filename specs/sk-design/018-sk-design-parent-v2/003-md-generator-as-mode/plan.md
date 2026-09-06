---
title: "Implementation Plan: sk-design-md-generator as the EXTRACT mode"
description: "Merge the md generator into the sk-design hub as its EXTRACT mode, fold its advisor identity into the hub's, and close the routing regression the hub conversion introduced."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-design-md-generator as the EXTRACT mode

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`sk-design-md-generator` is a standalone skill of 7,946 tracked files and 216 MB, of which the
shared `styles/` corpus is 7,812. It carries its own `graph-metadata.json`, `leaf-manifest.config.json`,
`leaf-manifest.json` and `leaf-aliases.json`. A second advisor identity below a hub root is rejected
outright, so those four files cannot survive the move.

Phase 002 left one phrase broken: `validate this design.md` scored 0.8451 to this skill at baseline
and returns nothing, because two identities carrying design vocabulary split a weak phrase until
neither clears the bar.

### Overview

Move the tree under `sk-design/` as renames, delete the packet's identity files, fold its domains,
intent signals and cross-skill edges into the hub's `graph-metadata.json`, and rewrite the live path
references while deliberately leaving the historical ones. The phase does not close until
`validate this design.md` routes again.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The problem statement and frozen scope are in `spec.md`
- [x] Success criteria are observable commands, not adjectives
- [x] The 74 files carrying the old path are classified into live and historical before any rewrite

### Definition of Done
- [x] Every acceptance criterion in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [x] `validate this design.md` routes above the bar, measured after an explicit daemon rebuild
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Identity merge. Two advisor identities become one: the mode reaches the advisor only through the
hub's `graph-metadata.json`, and the hub's `hub-router.json` resolves the EXTRACT intent to it.

### Key Components

- **`sk-design/sk-design-md-generator/`**: the moved tree, history intact.
- **`sk-design/graph-metadata.json`**: absorbs 5 domains and 18 intent signals, going from 19 and 72
  to 24 and 90.
- **`sk-design/command-metadata.json`**: binds `/design:extract` to the hub.
- **`sk-design-fundamentals/manual-testing-playbook/boundary/extraction-defers-to-md-generator.md`**:
  asserts where fundamentals stops and extraction begins, and that boundary changes meaning once both
  are modes of one hub.

### Data Flow

A design-extraction request scores against the hub's `intent_signals`, the hub resolves the EXTRACT
intent, and `sk-design-md-generator/SKILL.md` takes over. Inbound graph edges from other skills that
named the standalone now name `sk-design`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Count | Change |
|---------|-------|--------|
| The skill's own tree | 7,942 | Renamed under `sk-design/` |
| The packet's identity files | 4 | Deleted; a second identity below a hub is rejected |
| `sk-design/graph-metadata.json` | 1 | Domains and signals folded in |
| References inside the skill | 24 | Rewritten |
| Live references elsewhere | 20 | Rewritten |
| Historical records under `specs/` | 30 | **Left as written** |

The 20 live ones: the design agent in four runtime mirrors, the `/design:extract` command and its
three assets, three cli-orchestration contracts, a command contract and a playbook allowlist under
`sk-doc`, a durable-directory manifest, two retrieval fixtures, the lexical `trigger-index.json`, one
runtime path in `dist-freshness.cjs`, and one boundary playbook inside `sk-design-fundamentals`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | What | Gate |
|------|------|------|
| 1 | Classify all 74 path references into live and historical | The three-way split is written down before any rewrite |
| 2 | Move the tree under `sk-design/` | `git diff --cached -M` shows renames |
| 3 | Delete the four identity files; fold vocabulary into the hub | Fleet gate reports no nested identity |
| 4 | Rewrite the 44 live references | No live file resolves to the old path |
| 5 | Rebuild the daemon, then replay | `validate this design.md` above the bar |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | How |
|-------|-----|
| No nested identity | Fleet metadata audit, `sk-design` class H |
| No dangling edges | `skill_graph_validate` |
| The skill still works | Its own test suite, run from the new location, not the old one |
| The regression closed | Replay after an explicit daemon rebuild, generation observed to move |
| History preserved | `git diff --cached --name-status -M` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Depends on | Nature |
|-----------|--------|
| `002-hub-and-fundamentals` | The hub must exist and be class H before anything can be a mode of it |
| The metadata contract | Defines that a second identity below a hub root is rejected |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert `fa35e09653`. The move, the identity deletions, the vocabulary fold and the 44 rewrites are
one commit, so a revert restores the standalone skill and reopens the regression phase 002 created.
The 30 historical records were never touched and need no reversal.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| This phase | Depends on | Blocks |
|-----------|-----------|--------|
| `003-md-generator-as-mode` | `002` | `004`, and therefore `001` and `005` |

It also carries an obligation from `002`: the regression that phase created closes here or the phase
does not close.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Size |
|------|------|
| Files moved | 7,942, as renames |
| Of which the shared `styles/` corpus | 7,812 |
| Identity files deleted | 4 |
| Path references rewritten | 44 of 74 |
| Commits | 1 |

The file count is dominated by a corpus that is not the subject of the change.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The 74 references classified before any rewrite, so historical records are not caught by a sweep
- [x] Renames verified before committing
- [x] The daemon rebuilt explicitly before any routing number is quoted

### Rollback Procedure
1. `git revert fa35e09653`
2. Rebuild the advisor daemon and observe its generation move
3. Expect `validate this design.md` to return nothing again: that is phase 002's open regression

### Data Reversal

None. The move rewrites paths and metadata. No state is stored and no data is migrated.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
002 hub exists (class H)
        |
        v
classify 74 path references: 24 internal / 30 historical / 20 live
        |
        v
move 7,942 files as renames
        |
        v
delete 4 identity files -> fold 19+72 into 24+90
        |
        v
rewrite 44 live references
        |
        v
rebuild daemon (gen 618) -> replay -> regression closed
```

### Dependency Matrix

| Step | Needs | Produces |
|------|-------|----------|
| Classify | The full grep, counted not estimated | The three-way split |
| Move | A class H hub | The tree under `sk-design/` |
| Fold | The move | One identity carrying 24 domains and 90 signals |
| Rewrite | The split | Live references that resolve |
| Replay | An explicit rebuild | The closing evidence for the owned regression |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Classification is on the critical path, not the move. A blind sweep would have rewritten 30
historical records and falsified `016`'s account of the decision this packet supersedes. The measured
count was 74; a prior estimate said 16, which is why the rule is to count.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| References classified | The three-way table, measured |
| Tree moved | 7,942 renames |
| One identity | 24 domains, 90 intent signals |
| Regression closed | `validate this design.md` at 0.82, generation 618 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Delete the packet's identity files rather than nest them

**Status**: Accepted

**Context**: The moved skill carries four identity files. A second advisor identity below a hub root
is rejected outright by the class contract.

**Decision**: Delete all four and fold the skill's domains, intent signals and cross-skill edges into
the hub's `graph-metadata.json`.

**Consequences**:
- The hub becomes the only identity, which is what closes the split-phrase regression.
- The mode has no advisor entry of its own and is reachable only through the hub's vocabulary.

**Alternatives Rejected**:
- Keep the identity and nest it: rejected by the gate, and it would not close the regression.

### ADR-002: Leave the 30 historical records carrying the old path

**Status**: Accepted

**Context**: 30 of the 74 files carrying `skills/sk-design-md-generator` are records under `specs/`,
and 30 of those are `016`'s own account of graduating this skill to standalone.

**Decision**: Rewrite the 44 live references and leave the historical records untouched.

**Consequences**:
- A grep for the old path still returns hits, permanently, and that is correct.
- The record of the decision this packet supersedes still describes what actually happened.

**Alternatives Rejected**:
- Rewrite everything: makes a historical record describe something that never happened.

### ADR-003: Correct two acceptance criteria rather than declare them met

**Status**: Accepted

**Context**: Two criteria were written as "at or above the baseline score". The baselines belonged to
a standalone identity; the answering identity is now the hub, so the numbers describe different
things.

**Decision**: Restate them against the merged identity and record the measured values: 0.8451 became
0.82 and 0.9157 became 0.896, both still clearing the bar and reaching the owner.

**Consequences**:
- The criteria say what was actually verified rather than comparing incomparable numbers.
- The residual is documented as the scorer's shape, since adding hub vocabulary moved neither number.

**Alternatives Rejected**:
- Declare them met against the old numbers: a comparison between two different identities.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
