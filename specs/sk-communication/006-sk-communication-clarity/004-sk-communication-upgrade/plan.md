---
title: "Implementation Plan: Phase 4: sk-communication-upgrade"
description: "Change the skill's wording-standard routing and rewrite contract without reopening the frozen projection invariants, then run the package gate from the final state."
trigger_phrases:
  - "skill upgrade plan"
  - "one home for the standard"
  - "rewrite pass declaration"
  - "package gate"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: sk-communication-upgrade

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill and command documents, over a TypeScript projection package |
| **Framework** | The skill routes by subsystem; the package is consumed through its subpath exports |
| **Storage** | Version-controlled skill documents; no runtime state changes here |
| **Testing** | The package's own gate, plus a rubric-duplication search across commands and assets |

### Overview

Change documents, not invariants. The skill's wording-standard section and the two rewrite command
documents carry the adopted changes. The package's source is touched only if an adopted row
requires it, and the frozen invariants are re-read rather than assumed so a document change does
not quietly describe behavior the code does not have.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One standard, one home, many consumers. The skill holds no rubric and points at the standard, so a
change to the standard reaches the skill with no edit to a command. This phase preserves that
shape and only changes which standard, or which half of it, the pointer resolves to.

### Key Components
- **The skill document**: routes by subsystem and states the wording standard by reference.
- **`/rewrite:response`**: an in-context re-render of the active reply, display-only.
- **`/rewrite:response-by-external-agent`**: a one-shot projection through a chosen engine, with the enablement flag set inline for the single run.
- **The wording standard**: currently one document under `sk-doc`, consumed by documents and by replies.
- **The projection package**: assembly, fidelity, privacy, providers, runtimes, evaluation, release. Frozen here.

### Data Flow

A target reply enters the rewrite path. Spans are protected, a candidate is produced, the candidate
is validated for meaning, and a render decision either replaces, appends, uses a sidecar, or shows
the original only. This phase changes what the candidate is asked to be, and nothing else in that
chain.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes a shared policy pointer, so the table applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Skill document's wording-standard section | Names the standard the rewrites are held to | Update the pointer and the stated exclusions | Read the section, then follow the pointer and confirm the target's scope covers a reply |
| `/rewrite:response` document | The in-context rewrite contract | Update to declare the pass | Read the command document |
| `/rewrite:response-by-external-agent` document | The one-shot external projection contract | Update to declare the pass | Read the command document |
| Claude-runtime command mirrors | The same two commands for the other runtime | Update in step | Diff the mirror against its source |
| Wording standard under `sk-doc` | The single home of the rubric | Update only if a reply-scope split was allocated | Its document consumers still resolve, and its scoring half is intact |
| Projection package source | Owns the invariants | Unchanged unless an adopted row requires it | The package gate runs green from the final state |

Required inventories:
- Same-class producers: every place a voice or tone rubric could have been copied. `rg -n 'em dash|semicolon|banned|hard blocker|plain English' .opencode/skills/sk-communication .opencode/commands/rewrite .claude/commands/rewrite`
- Consumers of changed symbols: every document pointing at the wording standard. `rg -n 'hvr-rules|sk-create-with-human-voice|Human Voice Rules' . --glob '*.md'`
- Matrix axes: command surface by runtime mirror. Both commands times both runtimes is the required row set.
- Algorithm invariant: a rewrite never changes what the original claimed. Adversarial cases are a reorder that inverts a cause, a cut that drops a caveat, and a plainer word that weakens a hedge the original meant.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Only if an adopted row touches package source | The package's own test runner |
| Integration | The package gate from the final state, output and exit status both read | `npm run check` in the package directory |
| Manual | A rewrite of a reply that carries a caveat, checking the caveat survives | Invoke the in-context command and compare claims |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 allocation table | Internal | Red until phase 002 closes | No authorized scope |
| Phase 003 | Internal | Red until phase 003 closes | The skill would point at rule text still being edited |
| The wording standard's owner accepting a scope split | Internal | Yellow | The exclusions stay hand-maintained and the skill says so plainly |
| A working package build | Internal | Green | The gate cannot certify the final state |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A rewrite is observed changing what the original claimed, or the package gate fails from the final state.
- **Procedure**: Revert the skill document and both command documents together with their mirrors, because a half-reverted pair leaves two runtimes describing different behavior. The enablement flag is off by default, so a reverted state rewrites nothing.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Re-read invariants ──► Skill document ──► Command documents and mirrors ──► Catalog and changelog ──► Package gate ──► Handoff to 005
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Re-read invariants | Phase 003 closed | Skill document |
| Skill document | Re-read invariants | Command documents and mirrors |
| Command documents and mirrors | Skill document | Catalog and changelog |
| Catalog and changelog | Command documents and mirrors | Package gate |
| Package gate | All document changes landed | Handoff to 005 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 to 45 minutes re-reading the skill and the package's public surfaces |
| Core Implementation | Medium | 3 to 5 hours across the skill, two commands and their mirrors |
| Verification | Medium | 1 hour for the gate and the duplication search |
| **Total** | | **About 5 to 7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Confirm the enablement flag is off, so no live path is rewriting while the revert runs
2. Revert the skill document and both command documents together with their runtime mirrors
3. Re-run the package gate and read its output and exit status
4. Re-run the duplication search, so a reverted state leaves no orphaned rubric copy

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable, no persisted state is written by this phase
<!-- /ANCHOR:enhanced-rollback -->

---

