---
title: "Implementation Plan: Path Containment Follow-Ups"
description: "Close the scan-to-write gap by making the write prove its own precondition, and remove a guard branch that was measured to change no outcome."
trigger_phrases:
  - "path containment plan"
  - "handle identity check"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Path Containment Follow-Ups

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Two changes with opposite shapes. One adds a check that is currently missing and destroys data
when it is absent. The other deletes a check that was measured to decide nothing. They ship
separately so the deletion cannot be mistaken for part of the fix.

The order is: reproduce, fix the write, then delete the branch. The reproduction comes first
because the previous attempt at this family shipped a test that passed against unfixed code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:architecture -->
## 2. APPROACH

**The write proves its own precondition.** Refusing a symlink at the final component is a
path-level check, and the path is not what the write acts through. The handle is. After opening,
compare the handle's device and inode against what the scan observed for that candidate; if they
differ, the thing being written is not the thing that was classified, and the write is refused.

This is the same correction the write guard already made in a different place — establish the
property on the object that is acted upon, not on a name that can be re-pointed. Applying it to
the handle rather than to a second path inspection is what makes it hold against a swap that
happens after the check.

**The branch that decides nothing comes out.** The write guard consults process-derived roots and
destination-derived roots. Removing the first leaves the containment suite at 8 of 8, which is the
measurement, not an argument. What replaces it is a suite case that pins the guard's real limit,
so the record shows what it bounds instead of implying more.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 3. IMPLEMENTATION STEPS

| Step | Work | Gate before the next step |
|------|------|---------------------------|
| 1 | Add the directory-swap case to the repair suite | It fails against current code, and the victim file is observably overwritten |
| 2 | Carry the scan-time observation to the write and compare handle identity | The new case is refused; the victim is unchanged |
| 3 | Exercise a real symlinked track end to end | A legitimate repair inside a sibling repository still succeeds |
| 4 | Remove the process-derived root source | The containment suite still passes |
| 5 | Add the case pinning what defeats the guard | The suite records the permissive outcome rather than describing it in prose |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. TESTING STRATEGY

Step 1 is a negative control by construction, and it is the step that must not be skipped: the
predecessor packet's suite passed 5 of 5 against code with no protection at all, because the test
reimplemented the behaviour it was meant to be checking. Every case here exercises the shipped
function.

- Directory swapped between scan and write: refused, victim byte-identical.
- Final component swapped: still refused, unchanged from today.
- Legitimate write inside a real symlinked track: succeeds. This is the direction a stricter
  earlier attempt broke, so it is a required case rather than a nice-to-have.
- File removed between scan and write: refused, and no file created.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 5. DEPENDENCIES

| Dependency | Why | Risk if unavailable |
|------------|-----|---------------------|
| The scan's per-candidate observation | The write compares against it | If the scan does not retain it, it must carry it forward rather than the write re-deriving it — re-deriving reopens the same gap |
| A real symlinked track in the tree | Proves the fix does not refuse legitimate writes | Without one, the case is a fixture and proves less |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK

Two commits, independently revertible. The write fix is additive — reverting it restores the
current permissive behaviour, which is a known state rather than a corrupted one. The branch
removal touches one expression and reverts cleanly.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## L2: AFFECTED SURFACES

| Surface | Effect |
|---------|--------|
| The metadata repair sweep | Refuses candidates whose identity changed mid-run |
| The graph-metadata write guard | Same outcomes, one fewer branch |
| Both suites | Gain the cases that separate a real check from a described one |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Standalone. Shares no file with the two open phases under the template-reduction parent.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT

| Step | Estimate |
|------|----------|
| Reproduction case | Small; already reproduced by hand |
| Handle identity check | Medium; the work is in threading the scan observation, not the comparison |
| Real-track verification | Small, but it is the case that decides whether the fix is usable |
| Branch removal and its case | Small |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ROLLBACK DETAIL

If the identity check proves too strict in a way the suite did not catch, the symptom is a repair
run that refuses files it should write — noisy and non-destructive. That is the preferred failure
direction and is why the check refuses rather than falling back.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- Both suites pass, and every added case was observed failing first.
- A real symlinked track is exercised, not only a temporary fixture.
- `validate.sh <packet> --strict` reports `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->
