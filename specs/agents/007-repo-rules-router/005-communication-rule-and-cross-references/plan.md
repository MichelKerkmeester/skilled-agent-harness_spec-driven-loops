---
title: "Implementation Plan: Phase 5: Communication Rule and Per-Section Rule Pointers"
description: "Write the eighth rule carrying everything AGENTS.md section 8 held plus the how it had no room for, cut section 8 to a pointer keeping only what must bind unconditionally, then insert one pointer line into every governed section and wire the router. The trigger is deliberately every substantive reply, because a total move with a narrow trigger would let the writing register go quiet."
trigger_phrases:
  - "communication rule plan"
  - "section 8 reduction"
  - "pointer insertion"
  - "broad trigger design"
  - "line accounting"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: Communication Rule and Per-Section Rule Pointers

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown read by an agent at load time |
| **Framework** | The rule shape established by the seven shipped `repo-rules/` files |
| **Storage** | Git working tree |
| **Testing** | Structural and link assertions, a pointer-coverage audit, and `validate.sh --strict` |

### Overview
Write the eighth rule in the shape the seven siblings use, carrying everything section 8 held plus the *how* it had no room for. Cut section 8 to a pointer that keeps only what must bind when nothing has loaded. Then insert one pointer line into each `AGENTS.md` section that has a governing rule, and wire the router. The only novel design decision is the trigger: because the move is total, the trigger must be every substantive reply, or the writing register stops firing on exactly the short answers it most applies to.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Operator approval for the `AGENTS.md` edits recorded
- [x] Section 8 measured (34 lines) and the pointer inventory taken (zero sections named a specific rule)
- [x] The accepted risk named before the work, not discovered after

### Definition of Done
- [x] All acceptance criteria met
- [x] Every rule file reachable from `AGENTS.md` by a resolving link
- [x] Net always-loaded change measured and reported in either direction
- [x] Docs updated (spec/plan/tasks/acceptance-criteria)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Router plus leaves, unchanged — now with back-links. The router still routes by action; what is new is that the always-loaded document points *down* at the leaf expanding each of its sections, so the set is reachable at the point of need rather than only from the gate.

### Key Components
- **`repo-rules/communication.md`**: eleven numbered sections, from register selection through what the rule is not.
- **Section 8 remnant**: a pointer naming the broad trigger, plus the two clauses that bind unconditionally.
- **Pointer lines**: one shape, one line plus a blank, in every governed section.
- **Router rows and scope statement**: the eighth trigger row, the eighth index row, and a scope statement that now covers delivery.

### Data Flow
An agent writing a reply matches the broad trigger and loads one leaf. An agent reading any governed `AGENTS.md` section sees which leaf expands it and loads that one directly, without returning to the gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The change touches the always-loaded document, so the inventory is about what reads it and what a moved rule stops binding.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `AGENTS.md` section 8 | Held the delivery rules in full | update — reduced to a pointer plus two unconditional clauses | Line count 34 to 8; both clauses present |
| `AGENTS.md` governed sections | Carried compressed rules with no pointer to their expansion | update — one pointer line each | Pointer count and per-rule reachability audit |
| `CLAUDE.md` | Symlink to `AGENTS.md` | not a separate consumer | The symlink means one edit serves both runtimes |
| `REPO RULES.md` | Router and scope statement | update — two rows and the scope boundary | Row counts 7 to 8 in both tables; scope statement names delivery |
| `repo-rules/uncertainty-and-honesty.md` section 6 | Owns registers and hedging | unchanged — cross-referenced, not moved | No diff on that file |
| Every runtime loading `AGENTS.md` each turn | Consumer of the delivery rules | behavior changes by intent: the rules now load on a trigger | The trigger is written broadly, and section 8 says so in bold |

Required inventories:
- Same-class producers: `grep -n '^#### \|^##### ' AGENTS.md` to enumerate every candidate section before deciding which are governed.
- Consumers of changed symbols: `rg -n 'repo-rules/' AGENTS.md 'REPO RULES.md'` after the edits.
- Matrix axes: section class (hard blocker, gate, discipline, mandate) x governed or not; every governed section needs a pointer and every ungoverned one needs none.
- Algorithm invariant: no rule section 8 bound is absent from the union of `communication.md` and the section-8 remnant.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the numbered task state (T001-T017); the stages below say what each one has to establish before the next can start.

### Phase 1: Measure and map
- [x] Section 8 measured at 34 lines, and the pointer inventory taken — zero sections named a specific rule
- [x] Every `AGENTS.md` subsection classified as governed or deliberately ungoverned

### Phase 2: Move and point
- [x] `communication.md` written, carrying section 8 plus the how and the failure each rule prevents
- [x] Section 8 cut to a pointer, keeping the two unconditional clauses
- [x] Pointer lines inserted into every governed section
- [x] Router trigger row, index row and scope statement updated

### Phase 3: Assert
- [x] Content parity, format, links, pointer coverage and line accounting all checked and recorded
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Content parity | Every section-8 rule present in the new file or the remnant | Rule-by-rule check against the committed text from `git show` |
| Structural | `Fires when`, one binding rule, numbered body, self-check | `grep -n '^## '` |
| Format conformance | Phase 1's casing, sequence and dividers | The phase-1 assertions, re-run over all eight files |
| Link resolution | Every link in the rule set and every `repo-rules/` link in `AGENTS.md` | Resolve each target with URL decoding |
| Pointer coverage | Each of the eight rules named from at least one section | Per-rule grep count |
| Line accounting | Net always-loaded change | `wc -l` before and after, reported either way |
| Packet gate | Spec docs validate | `validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator approval for `AGENTS.md` | External | Green — granted in the request that opened this phase | The whole phase blocks; phase 4 made this a precondition |
| Phase 1 format conventions | Internal | Green | The new rule would be born non-conforming |
| Seven sibling rule files | Internal | Green | No established anatomy to match |
| `validate.sh` orchestrator, compiled and not stale | Internal | Green | Closure cannot be gated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the writing register is observed going quiet in practice, the pointers read as noise, or a moved rule turns out to have needed always-loaded force.
- **Procedure**: `git revert` restores section 8 in full and removes the eighth rule; the pointers revert independently of the section-8 move, because they are separate hunks in the same file. That separation is deliberate — the two changes were asked for together but can fail apart.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Measure + classify --> Write the rule --> Cut section 8 --> Insert pointers --> Wire router --> Assert
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Measure and classify | Operator approval | Write the rule |
| Write the rule | Measure and classify | Cut section 8 |
| Cut section 8 | Write the rule | Insert pointers |
| Insert pointers | Cut section 8 | Wire router |
| Wire router | Insert pointers | Assert |
| Assert | Wire router | Packet closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Measure and classify | Low | under an hour |
| Core Implementation | Medium | 2-3 hours — the cost is expanding twelve one-line rules into actionable ones |
| Verification | Low | under an hour |
| **Total** | | **half a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Section-8 original text recoverable from git, so content parity is checkable
- [x] Pointer insertions kept as separate hunks from the section-8 move
- [x] No feature flag or monitoring applies — these are static documents

### Rollback Procedure
1. Revert the section-8 hunk to restore the full section
2. Delete `repo-rules/communication.md` and its two router rows
3. Optionally keep the pointers — they are independent of the move and useful on their own
4. Re-run the link and format assertions

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no persisted state derives from any of this
<!-- /ANCHOR:enhanced-rollback -->

---

