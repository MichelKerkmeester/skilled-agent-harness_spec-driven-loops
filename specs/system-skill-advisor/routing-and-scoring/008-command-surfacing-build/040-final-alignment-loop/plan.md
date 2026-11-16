---
title: "Implementation Plan: Phase 40: final-alignment-loop"
description: "Widen the command mention check for refusals after the name, document nouns, more wrappers and doc paths, fix one playbook prompt, add advisor intent phrases for four probe tasks, then rerun the gates, review and alignment."
trigger_phrases:
  - "final alignment loop plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 40: final-alignment-loop

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown, generated JSON |
| **Framework** | Vitest in the advisor runtime, the skill graph compiler, the alignment probe runner |
| **Storage** | Gate files in this phase's `scratch/` |
| **Testing** | Guards test failing-first, full suite both ways, `FLOOR`, `EVAL`, the stored sets, `run-probes.cjs` on the four probes |

### Overview
The mention check gains a tail clause for a refusal plus "it" and a rule that a command followed by a document noun is a mention. The fold drops the wider wrapper set and the occurrence scan skips a doc path, the same continuation rule the typed reader uses. The typed reader's start boundary takes the same wrappers. The playbook prompt changes to one the doctor row owns. The advisor gets intent phrases for the four probe tasks, each gated by the floors.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Each finding reproduced on `b8ebee37d75`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Review pass thirteen and the alignment run recorded in the goal log
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer: the mention reader every runtime's brief shares, and the advisor's own metadata. No new module, option or dependency.

### Key Components
- **`commandOnlyMentioned`**: decides whether each occurrence of a command name is refused or questioned
- **`typedCommandIn`**: finds the typed command name and its boundaries
- **system-skill-advisor `graph-metadata.json`**: the intent signals the scorer reads

### Data Flow
Prompt, then the fold, then each occurrence's lead and tail, then the attach decision in every runtime's brief.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `commandOnlyMentioned` | Misses four refusal shapes | Widened | Guards test, wrapper matrix |
| `typedCommandIn` | Narrower start boundary | Matched to the fold | Bracket case |
| Playbook scenario | Pins a stale prompt | New prompt | Claude hook output |
| Advisor intent signals | Miss four tasks | Phrases added | `run-probes.cjs`, floors |

Required inventories:
- Same-class producers: every wrapper and lead the mention check reads, through the invariance matrix.
- Consumers of changed symbols: `typedCommandForTop`, `attachCommand` and the deep-loop gate.
- Matrix axes: the suite is run with the child flag unset and set.
- Algorithm invariant: a request fixture stays a request under every wrapper.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reproduces each finding. Implementation adds the failing cases, then the fixes, then the playbook and the phrases. Verification reruns the gates both ways, scores the probes, runs review pass thirteen and a full alignment run, and logs the result. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The new refusal, document, wrapper, path and boundary cases | Vitest |
| Integration | Full suite both ways, `FLOOR`, `EVAL`, the stored sets, the four probes | Vitest, the capture scripts, `run-probes.cjs` |
| Manual | None. The playbook prompt is checked through the hook into a file | The Claude hook |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The alignment run `20261116T195539Z` | Internal | Green | No finding list |
| OpenCode Go for review and alignment lanes | External | Green | REQ-005 waits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a request fixture read as a refusal, or a moved floor
- **Procedure**: revert the phase's commit, recompile the graph and rebuild the advisor state
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (reproduce) | `b8ebee37d75` | Implementation |
| Implementation (cases, fixes, playbook, phrases) | The reproductions | Verification |
| Verification (gates, probes, review, alignment) | A green suite | Close-out |
<!-- /ANCHOR:phase-deps -->

---
