---
title: "Implementation Plan: Phase 16: code standards alignment"
description: "Read every added line against two authorities, change only what genuinely misses, and record a reason for each decline."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 16: code standards alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Read the code, then read the standards, then decide. The order matters: starting from the standards
produces a checklist pass that finds whatever the checklist names and nothing else.

The audit's own failure is the part worth keeping. A branch was judged unreachable from the map of
which case keys on which predicate, cut, and the scorer then failed on every frozen side. The map
was the wrong lens, because scoring runs every dimension mechanic against every case.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 5. QUALITY GATES

- `npm run check` in `cli-communication-projection`
- Six frozen benchmark sides rescored, identical weighted means and blocking rows
- `validate.sh <folder> --strict` → `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 2. APPROACH

1. **Load the surface standards and the restraint rule** through the code skill's router rather than from memory.
2. **Read each added block** against the file it lives in, since a file's own convention is the first standard.
3. **Test every cut before shipping it.** A reachability claim is a hypothesis until a run confirms it.
4. **Record each decline with the clause that permits it**, so the next audit does not relitigate the same four.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 3. WORK BREAKDOWN

| Step | What | Outcome |
|------|------|---------|
| 1 | The projection engine's causal-direction check | One TSDoc block added |
| 2 | The scorer's retention predicate | A cut attempted, reverted, and a comment added in its place |
| 3 | The scorer's case validation | A guard added against a silent vacuous pass |
| 4 | Four restraint candidates | Declined, each with its clause |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. PROOF PLAN

| Claim | Check |
|-------|-------|
| The engine change is sound | `npm run check` in the projection package |
| The scorer still measures what it measured | Six frozen sides rescored against the committed results |
| The new guard fires | Run the scorer against a case set with the field removed, and read the exit status |
| The guard does not fire falsely | The same six rescores, which all pass validation first |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-code`'s OpenCode surface packet, for the TypeScript standards.
- `prevent-overengineering.md`, for the restraint ladder and the specific restraints.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK

Remove the TSDoc block, the guard and the comment. None of the three changes behavior on any
input the benchmark uses, which the six rescores confirm.
<!-- /ANCHOR:rollback -->

---

