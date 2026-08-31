---
title: "Implementation Plan: Phase 2: Delegation and Orchestration Rule"
description: "Write a seventh repo-rules file binding the delegating posture - orchestrate rather than author, brief with evidence, never let one model close a question - then wire it into the router with two rows. A forbidden-token scan keeps executor mechanics out so the rule cannot go stale when a CLI changes its flags."
trigger_phrases:
  - "delegation rule plan"
  - "orchestrate posture"
  - "router row wiring"
  - "forbidden token scan"
  - "rule shape conformance"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: Delegation and Orchestration Rule

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown prose read by an agent at load time |
| **Framework** | The rule shape established by the six shipped `repo-rules/` files |
| **Storage** | Git working tree |
| **Testing** | Structural assertions (shape, links, forbidden-token scan) plus `validate.sh --strict` |

### Overview
Write one rule file in the shape the six siblings already use, then add the two `REPO RULES.md` rows that reach it. The engineering content is the doctrine itself: each obligation is derived from a delegation failure this repository actually had, and a forbidden-token scan keeps executor mechanics - model uids, flags, env vars - out of the file so it cannot go stale when a CLI changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The failure modes the rule addresses are documented in this repository's history, not hypothesized
- [x] The rule shape is fixed by six existing siblings
- [x] Phase 1's heading convention has landed, so the new file is born conforming

### Definition of Done
- [x] All acceptance criteria met
- [x] Forbidden-token scan finds no executor mechanics in the file
- [x] Both router tables link to the file and the links resolve
- [x] Docs updated (spec/plan/tasks/acceptance-criteria)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Router plus leaf, unchanged. The router gains two rows; the leaf is self-contained. This is the parent packet's SC-003 exercised for real: a seventh rule must cost exactly one new file and two router rows.

### Key Components
- **`repo-rules/delegation-and-orchestration.md`**: `Fires when` triggers, one binding sentence, numbered body, closing self-check.
- **`REPO RULES.md` trigger row**: matches on the delegating action - about to dispatch, about to accept a return.
- **`REPO RULES.md` index row**: one-line summary, same register as the six existing rows.

### Data Flow
An agent about to dispatch matches the trigger row, loads the one leaf, holds the posture through briefing and acceptance, and routes onward to `evidence-and-proof.md` when it reports what came back.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The rule touches doctrine that other documents already carry pieces of, so the inventory is about overlap and precedence.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `AGENTS.md` Dispatch Rules | Requires reading `cli-X/SKILL.md` before composing a prompt | unchanged - the rule cross-references it, never restates it | `rg -n 'CLI dispatch' AGENTS.md` and a read of the new file's cross-reference line |
| `repo-rules/evidence-and-proof.md` section 7 | "A finding is a hypothesis" | unchanged - the rule points at it for verifying returns | Link present in the new file; no duplicated wording |
| `repo-rules/scope-discipline.md` | Frozen scope, amendment over absorption | unchanged - the rule points at it for scope travelling with delegated work | Link present; no duplicated wording |
| `REPO RULES.md` trigger and index tables | Route action to rule | update - two rows added | Row counts go 6 to 7 in both tables; both new links resolve |
| `cli-external-orchestration/cli-*/SKILL.md` | Own executor mechanics | not a consumer - the rule defers to them | Forbidden-token scan proves no mechanics leaked into the rule |

Required inventories:
- Same-class producers: `rg -n 'delegat|dispatch|orchestrat' 'REPO RULES.md' repo-rules/ AGENTS.md` before writing, so the rule expands rather than duplicates.
- Consumers of changed symbols: `rg -n 'repo-rules/' . --glob '*.md'` after the router edit.
- Matrix axes: delegation target (CLI executor, subagent, fan-out lineage, deep-loop leaf) x direction (briefing, accepting a return); every axis needs a sentence that applies to it.
- Algorithm invariant: no sentence in the file survives a CLI flag change - test by asking, for each clause, "does a `devin` version bump invalidate this?"
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the numbered task state (T001-T017); the stages below say what each one has to establish before the next can start.

### Phase 1: Inventory
- [x] Existing delegation language across `AGENTS.md` and `repo-rules/` catalogued, so the rule expands rather than duplicates
- [x] This repository's real delegation failures recorded, so every clause can name one

### Phase 2: Draft
- [x] The rule file written in the six siblings' shape, in phase 1's format
- [x] Each section grounded in a named failure rather than an abstract best practice

### Phase 3: Wire and assert
- [x] Two router rows added and both links resolved
- [x] Forbidden-token scan, shape check, and clause audit recorded
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | File carries `Fires when`, one `## THE RULE` sentence, numbered body, self-check | `grep -n` on the section headers |
| Forbidden-token | No model uid, CLI flag, env var, or version in the file | `rg -n -- '--[a-z-]{3,}\|deepseek\|gpt-5\|glm-\|MK_\|AI_SESSION' repo-rules/delegation-and-orchestration.md` returns nothing |
| Link resolution | Both new router links, and the file's own cross-references | Extract link targets, test each with `test -f` |
| Row count | Router trigger and index tables both gain exactly one row | Count rows before and after |
| Format conformance | Numbered headers uppercase, dividers present - phase 1's convention | Same assertions phase 1 used |
| Packet gate | Spec docs validate | `validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 heading convention | Internal | Green once phase 1 closes | The new file would be written in the old format and need a second pass |
| Six sibling rule files (shape reference) | Internal | Green | No established shape to conform to |
| This repository's dispatch failure history | Internal | Green | Clauses would be ungrounded best practice, which REQ-007 forbids |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the rule is found to duplicate rather than expand `AGENTS.md`, or it starts encouraging delegation of work that should simply be done.
- **Procedure**: `git rm repo-rules/delegation-and-orchestration.md` and revert the two `REPO RULES.md` rows. Nothing references the file except those two rows, which is the property the router architecture exists to give.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Inventory (existing coverage) --> Draft (rule file) --> Wire (router rows) --> Assert (shape, tokens, links)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | Phase 1 landed | Draft |
| Draft | Inventory | Wire |
| Wire | Draft | Assert |
| Assert | Wire | Packet phase 3 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Low | under an hour |
| Core Implementation | Medium | 1-2 hours - the cost is in grounding each clause in a real failure |
| Verification | Low | under an hour |
| **Total** | | **2-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Overlap inventory run, so the rule expands rather than duplicates
- [ ] Router row counts recorded before the edit
- [ ] No feature flag or monitoring applies - these are static documents

### Rollback Procedure
1. Delete `repo-rules/delegation-and-orchestration.md`
2. Revert the two `REPO RULES.md` rows
3. Confirm the router's trigger and index tables are back to six rows each and all links resolve

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

