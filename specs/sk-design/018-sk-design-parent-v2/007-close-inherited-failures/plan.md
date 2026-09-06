---
title: "Implementation Plan: close every gate this packet left red"
description: "Move four playbook fixtures onto the hub that owns their mode, give a compiled-routing scenario the criteria heading its contract requires, and repair two malformed spec documents."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: close every gate this packet left red

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Four failures across three gates, all diagnosed by the closing phase and none of them large.

`sk-doc`'s typed-gold playbook gate blocked four fixtures asserting `sk-doc` owns FLOWCHART. Three are
pure FLOWCHART; the fourth pairs one mode from each hub and the gate is per-hub by design.
`validate-compiled-routing-scenarios` rejected `SD-CR-001` for null criteria. Two children of the
router-unification packet failed on an empty required frontmatter field and a closing anchor with no
opening.

### Overview

Create the `sk-design` hub playbook the fixtures need, move all four as renames keeping their ids,
repoint the cross-hub one to a pair the design hub owns, correct both indexes, and repair the two spec
documents.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The problem statement and frozen scope are in `spec.md`
- [x] Success criteria are observable commands, not adjectives
- [x] The rename landed first, so the fixtures move once onto their final mode names

### Definition of Done
- [x] Every acceptance criterion in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [x] Every gate this packet touched exits 0 under `--strict`
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Relocation plus repair. No routing metadata changes; the fixtures move to the hub whose manifest
already lists their mode.

### Key Components

- **`sk-design/manual-testing-playbook/`**: the corpus the moved fixtures need, with its own index.
- **`SD-007`**: repointed from a cross-hub pair to chart-versus-diagram, which the design hub owns.
- **Both playbook indexes**: scenario ranges and per-scenario rows corrected.
- **`SD-CR-001`**: a heading rename, not new content.
- **Two spec documents**: a filled frontmatter field and an opened anchor.

### Data Flow

The typed-gold gate reads a hub's playbook fixtures and joins each declared `workflowMode` against
that hub's leaf manifest. A fixture naming a mode the hub does not list blocks; the fix is to put the
fixture under the hub that lists it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Change |
|---------|--------|
| Four fixtures | Moved as renames, ids preserved |
| `SD-007` | Its pair repointed and its narrative rewritten to match |
| `sk-design/manual-testing-playbook/manual-testing-playbook.md` | Created |
| `sk-doc/manual-testing-playbook/manual-testing-playbook.md` | Ranges and rows corrected |
| `bundle-rules-compiled-routing.md` | Heading renamed to the parsed form |
| Two router-unification spec documents | One field, one anchor |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | What | Gate |
|------|------|------|
| 1 | Create the design hub playbook tree and index | The directory exists with its categories |
| 2 | Move the four fixtures as renames | `git diff --cached -M` shows `R`, ids unchanged |
| 3 | Repoint `SD-007` and rewrite its narrative | The design hub gate passes it |
| 4 | Correct both indexes | Neither names a fixture it no longer holds |
| 5 | Rename the criteria heading in `SD-CR-001` | The scenario validator passes |
| 6 | Repair the two spec documents | Both validate under `--strict` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | How |
|-------|-----|
| Both hubs' typed-gold gates | `validate-playbook-topology --strict` per hub, exit code read |
| The scenario validator | `validate-compiled-routing-scenarios --strict` |
| The router-unification packet | `validate.sh --strict`, folder count compared against 23 of 25 |
| History and ids | `git diff --cached --name-status -M` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Depends on | Nature |
|-----------|--------|
| `006-design-mode-and-command-rename` | The fixtures should land on final mode names |
| The per-hub design of the typed-gold gate | Why a cross-hub fixture validates nowhere |
| Benchmark reports dated 2026-07-21 | They key results to the ids being moved |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. Every change is a file move, a heading, a field or an anchor; nothing is generated
and no cache needs refreshing. The four fixtures return to `sk-doc`'s corpus and its gate goes red
again on the same four.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| This phase | Depends on | Blocks |
|-----------|-----------|--------|
| `007-close-inherited-failures` | `006` | Nothing; `008` is independent of it |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Size |
|------|------|
| Fixtures moved | 4, as renames |
| Documents created | 1 index |
| Documents edited | 4 |
| Commits | 1 |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The rename landed first, so the fixtures moved once
- [x] Ids preserved so published reports still resolve
- [x] `--strict` on every gate, because one of them exits 0 while printing a failing verdict

### Rollback Procedure
1. `git revert` the commit
2. Re-run both playbook gates; expect `sk-doc` to block on four again

### Data Reversal

None. No state is stored; this phase moves files and edits documents.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
006 renames landed
        |
        v
create sk-design/manual-testing-playbook/{holdout,resource-loading,unknown-fallback}
        |
        v
move 4 fixtures as renames (ids preserved)
        |
        v
repoint SD-007: cross-hub pair -> chart vs diagram
        |
        v
correct both indexes -> rename SD-CR-001 heading -> repair 2 spec docs
        |
        v
both hubs PASS, scenario validator PASS, 019/015 at 25 of 25
```

### Dependency Matrix

| Step | Needs | Produces |
|------|-------|----------|
| Create | A hub whose manifest lists the modes | A corpus the fixtures can live in |
| Move | The corpus | Four fixtures under the right hub |
| Repoint | Two modes in one hub | A pair a per-hub gate can validate |
| Index | The moves | Two indexes describing what they hold |
| Repair | Nothing | Two more folders validating |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Ordering behind the rename is the only real constraint: moving the fixtures first would have meant
touching them twice. Everything else is independent.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Design hub corpus exists | Four fixtures, `verdict=PASS valid=4 blocked=0` |
| `sk-doc` unblocked | `verdict=PASS valid=28 blocked=0`, from 28 valid and 4 blocked |
| Scenario validator green | `pass=1 fail=0` |
| Router-unification packet green | 25 of 25, from 23 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Repoint the cross-hub fixture rather than retire it

**Status**: Accepted, on operator instruction

**Context**: `SD-007` paired `sk-create-quality-control` with the diagram mode. Those now sit in
different hubs and the typed-gold gate is per-hub by design, so no gate could validate it. The closing
phase left three options: retire it, repoint it, or leave it blocked.

**Decision**: Move it to the design hub and repoint its pair to chart-versus-diagram, an ambiguity the
receiving hub genuinely owns.

**Consequences**:
- The scenario tests something different from what its 2026-07-21 report describes, so the fixture and
  the design hub's index both say so in plain terms.
- The id is preserved, so those reports still resolve to a file.
- No tracked coverage is deleted.

**Alternatives Rejected**:
- Retire it: deletes coverage and orphans report lineage.
- Leave it blocked: keeps a gate red for a fixture nobody intends to fix.

### ADR-002: `SD-CR-001` needed a heading, not criteria

**Status**: Accepted

**Context**: The validator reported "missing or empty pass/fail criteria (null-criteria scenario)".
The scenario had a full three-clause PASS/FAIL/SKIP section under the heading `Pass / Fail`; the
parser matches `Pass/Fail Criteria`.

**Decision**: Rename the heading. Write no new criteria.

**Consequences**:
- The gate passes against content that was always there.
- A diagnosis that read as missing content was actually a heading mismatch, which is worth recording
  so the next reader does not write criteria that already exist.

**Alternatives Rejected**:
- Author new criteria: would have duplicated a section the document already carried.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
