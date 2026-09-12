---
title: "Implementation Plan: Phase 2: synthesis-and-decisions"
description: "Turn the two research syntheses into one allocation table, record the four candidates with no owning surface as deliberate non-work, and write the rejection list with a reason per rejection."
trigger_phrases:
  - "synthesis plan"
  - "allocation approach"
  - "adr per contradiction"
  - "reconcile disagreement"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: synthesis-and-decisions

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown allocation table, non-work register and rejection list |
| **Framework** | None, this phase is judgment recorded against cited evidence |
| **Storage** | The allocation table lands in `spec.md` per this phase's own file list. `decision-record.md` already holds the eight Accepted ADRs |
| **Testing** | Row-count, duplicate-assignment and ADR-reachability checks over the allocation table |

### Overview

The deciding is over. `decision-record.md` holds eight Accepted ADRs, three settling rule conflicts and
five settling engine questions, and every downstream phase reads that file for its authorised scope.
Nothing here reopens one or treats a settled question as work to do.

What remains is the synthesis those decisions unblocked: one allocation table over the candidate union
the two research runs produced, four rows recorded as deliberate non-work with their blocking reasons,
and a rejection list with one reason per rejection.

### What is inherited as decided

| ADR | What it settled | Where the work lands |
|-----|-----------------|----------------------|
| ADR-001 | The colon-clause ban is rejected and the existing rule stands | No file changes. Read by phases 3, 6 and 8, which all touch punctuation guidance |
| ADR-002 | The banned framework word applies to reply prose, with a carve-out for framework vocabulary | The reply-shape rule's filler list, in phase 8 |
| ADR-003 | The cause-then-fix order is kept, with the cause's epistemic status stated when nothing confirms it | The evidence rule, in phase 8 |
| ADR-004 | The projection stays a smoothing pass, and both rewrite commands declare the pass they perform | Both command documents, in phase 4 |
| ADR-005 | The wording standard's reply base becomes the provider instruction, and no detector layer is built | The hoisted instruction constant, in phase 4. Phase 7 must land first, because the base is its output |
| ADR-006 | A claim, caveat or requirement present in the source and absent from the candidate rejects it | The fidelity validator's existing guard, in phase 4 |
| ADR-007 | An unchanged candidate is recorded as its own no-op outcome | The accept record's change-kind field, in phase 4 |
| ADR-008 | Both provider profiles use provider-default thinking mode | The external CLI profile, in phase 4 |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Both research syntheses present at their exact paths and read, rather than trusted from their own summaries
- [ ] Each of the eight ADRs read, with its Status field confirmed as Accepted
- [ ] The candidate union and its arithmetic taken from the phase 001 synthesis

### Definition of Done
- [ ] Every candidate in the union carries exactly one verdict, and no row is blank
- [ ] Every adopted candidate names exactly one owning document and the failure it prevents
- [ ] The four candidates with no owning surface are recorded as deliberate non-work with a blocking reason, and the rejection list carries a reason per rejection
- [ ] All acceptance criteria met
- [ ] `validate.sh --strict` run from the final state, with its output and exit status read
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One pass over the merged candidate list, with a fixed decision shape per row. The shape is what keeps
the pass honest: a row cannot be adopted without an owning document, a named failure and, where a
settled decision produced the verdict, the ADR it came from. Already-covered is a real outcome rather
than a gap, and so is recorded non-work.

### Key Components

- **Candidate union**: the 29 candidates the phase 001 synthesis merged from 44 candidate rows, keyed
  by the failure each one prevents rather than by wording.
- **Verdict column**: adopt, reject, already-covered or recorded non-work. The last two are outcomes a
  reader can act on, not blanks.
- **Owning-document column**: exactly one of a named existing repo rule, a named new rule file, the
  wording standard or the skill's benchmark folder. No row lands in `AGENTS.md`, because the two-clause
  floor there is deliberate and the candidates do not need it.
- **ADR pointer**: the decision a row's verdict came from, so a settled conflict is cited rather than
  re-argued at the row.
- **Non-work register**: the four candidates with no owning surface, each carrying its blocking reason.
- **Rejection list**: every rejected candidate and option with one reason, because an unrecorded
  rejection reads as an oversight later.

### Data Flow

Both research syntheses feed the candidate union. The union feeds the allocation table. The table is
what phases 003, 004, 006, 007 and 008 execute against, so it is the only place a downstream phase
reads its scope from. `decision-record.md` sits beside the table as the authority for each settled
question the rows cite, and it is never edited by this phase.

### Decisions this phase does not make

Two plan corrections were ratified alongside the eight ADRs and they shape rows rather than needing a
decision at the row. The wording standard becomes a base plus a supplement rather than two halves, so
the two reply-facing wording candidates flow through the voice-half delegation and both surfaces move
together. The reader-profile contract splits into the rules that bind whenever a reply is written and
the reader-conditional rules that need an operator-selected mode staying off by default.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase decides and records. It changes no producer, consumer, policy or schema, so the table is
retained with an explicit verdict per row rather than deleted.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repo-rules/` and `AGENTS.md` | The surfaces the allocation rows name | Unchanged in this phase | The scoped diff shows changes only under this phase folder |
| `sk-communication` and its benchmark folder | Named as an owning surface for two measurement candidates | Unchanged in this phase | `git status` confirms no change under the skill |
| `decision-record.md` | Authority for what the eight decisions adopted and rejected | Already written, and not reopened | Read each Status field and treat nothing as settled unless it reads Accepted |

Required inventories, answered for this phase:
- Same-class producers: none, no behavior changes here.
- Consumers of changed symbols: none, no symbol changes here.
- Matrix axes: candidate source and owning document, and the rows are the allocation table itself.
- Algorithm invariant: one candidate maps to exactly one owning document, and a duplicate assignment
  fails the closure gate.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase
checkboxes and task state. Three work items carry this phase, and the tasks file orders them:

1. Build the allocation table over the candidate union, with a verdict, an owning document and a named
   failure per adopted row.
2. Record the four candidates that have no owning surface as deliberate non-work with their blocking
   reasons.
3. Write the rejection list with one reason per rejection.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None, this phase writes documents | Not applicable |
| Integration | The row count equals the candidate union, every row carries a verdict, no candidate is assigned twice, and each of the eight ADRs is reachable and Accepted | Table read, a duplicate scan over the owning-document column, and each ADR's Status field read beside its rows |
| Manual | Each adopted row's named failure is specific enough to argue with, and each non-work row's blocking reason names what would have to change | Read each row and reject any failure statement that could sit in any rule set |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 research synthesis | Internal | Green, ten iterations written | No candidate union to allocate |
| Phase 004 research synthesis | Internal | Green, five iterations written | The engine rows have no evidence behind them |
| The eight ADRs in `decision-record.md` | Internal | Green, all Accepted | The verdict column has no authority to cite |
| The current stack documents | Internal | Green | No classification baseline, so an already-covered row cannot be checked against the rule text |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A row's verdict rests on a finding whose citation does not resolve, or on an ADR that does not read Accepted.
- **Procedure**: Supersede the affected ADR with a new one rather than editing it, then correct the row it fed. This phase's writes are confined to this folder, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Read both syntheses --> Merge the candidate union --> Allocate and record --> Record non-work and rejections --> Verify rows against the ADRs --> Handoff to 003
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Read both syntheses | Phases 001 and 004 settled | Merge the candidate union |
| Merge the candidate union | Read both syntheses | Allocate and record |
| Allocate and record | Merge the candidate union | Record non-work and rejections |
| Record non-work and rejections | Allocate and record | Verify rows against the ADRs |
| Verify rows against the ADRs | Record non-work and rejections | Handoff to 003 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 to 20 minutes reading both syntheses and the decision record |
| Core Implementation | Medium | 2 to 3 hours, dominated by the per-row failure statement and the four blocking reasons |
| Verification | Low | 20 to 30 minutes of row, duplicate and ADR checks |
| **Total** | | **About 3 to 4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Correct the affected allocation row
2. Supersede the ADR that carried the decision, rather than editing it
3. Confirm no downstream phase has already executed against the corrected row
4. Record what the reversal revealed, because a reversed decision is evidence about the question

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, markdown documents in one folder with no persisted output
<!-- /ANCHOR:enhanced-rollback -->

---
