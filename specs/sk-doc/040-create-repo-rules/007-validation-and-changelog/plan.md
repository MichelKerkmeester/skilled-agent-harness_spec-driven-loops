---
title: "Implementation Plan: Phase 7: Validation, Changelog and Closeout"
description: "Exercise the mode against a real accept and a genuinely borderline refusal, write the changelog that also makes the packet empty directory exist in git, symlink it into the sk-doc tree, and close the packet on what the exercise produced rather than on the phase count."
trigger_phrases:
  - "closeout plan"
  - "end to end exercise"
  - "borderline refusal"
  - "changelog symlink"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: Validation, Changelog and Closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown changelog; a filesystem symlink; the mode itself as the thing under test |
| **Framework** | The changelog mode's format; the sibling symlink convention |
| **Storage** | The mode's `changelog/`, and `.opencode/changelog/sk-doc/` |
| **Testing** | Two real invocations, one accepted and one refused, kept as evidence |

### Overview
Six phases of structural checks have not answered whether the mode works. Run it twice - once on a request it should accept and once on one it should refuse - and choose the refusal to be genuinely borderline, because a mode that only refuses the obvious has not been tested. Close on what those two runs produced.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 3-6 closed, so there is a reachable mode
- [ ] The borderline refusal case chosen before the accept case, so it is not picked to be easy

### Definition of Done
- [ ] Both exercise outputs kept as evidence
- [ ] The changelog symlink followed to a real directory
- [ ] Recursive validation passes for the parent and all seven children
- [ ] Any defect found is attributed to its owning phase, not patched here
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Exercise, then close. The closure claim rests on two observed runs rather than on the absence of errors across six phases.

### Key Components
- **The refusal case**: chosen first and chosen borderline, because refusing is the common outcome and the easy refusal proves nothing.
- **The accept case**: run end to end, output checked against both the structural floor and the phase-4 standards.
- **The changelog**: written to the changelog mode's format; it is also what makes the directory exist in git.
- **The symlink**: created after the version file, since a link to an empty directory carries nothing.

### Data Flow
Two requests through the mode, two outputs kept, one changelog written, one symlink made and followed, then recursive validation and reconciliation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The mode packet | The thing under test | exercised, not modified | A defect goes to its owning phase |
| `changelog/` | Empty since phase 3, absent from git | create the first version file | The directory now exists in git |
| `.opencode/changelog/sk-doc/` | Sibling symlinks | add one | Followed to a real directory |
| The parent packet | Seven children | reconcile | No document contradicts another about state |
| `repo-rules/` | Where a produced rule would land | **not written** unless the operator wants the exercise rule shipped | `git diff --stat` empty for the corpus |

Required inventories:
- Same-class producers: sibling changelog symlinks, to match naming - `create-repo-rule`, not `sk-create-repo-rule`.
- Consumers of changed symbols: nothing consumes the changelog; the symlink is for discovery.
- Matrix axes: 2 exercise paths x (structural floor, quality standards, refusal naming).
- Algorithm invariant: the corpus is unchanged unless an operator decision says otherwise.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns task state (T001-T014).

### Phase 1: Exercise
- [ ] Borderline refusal case chosen and run; the refusal must name a test and a destination
- [ ] Accept case run end to end; output checked against structure and standards

### Phase 2: Changelog
- [ ] Version file written, then the symlink created and followed

### Phase 3: Close
- [ ] Recursive validation, reconciliation, and an honest report including anything the exercise found
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Accept path | A produced rule passes structure and standards | The phase-3 assertions plus the phase-4 bar |
| Refuse path | The refusal names a test and a destination | Read the output |
| Advisor | A plain-language request reaches this mode | Advisor query, if it is reachable |
| Symlink | Resolves to the packet changelog | Follow it |
| Recursive gate | Parent and seven children | `validate.sh --recursive --strict` |
| Non-disturbance | The corpus is unchanged | md5 set |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 3-6 | Internal | Sequenced | Nothing to exercise |
| The advisor | External | Intermittent this session | The smoke test is reported as not run, never as passed |
| The changelog mode's format | Internal | Green | The changelog would not match its siblings |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the exercise shows the mode does not work.
- **Procedure**: do not close the packet. Report the defect against the phase that owns it and reopen that phase. Rolling back this phase means deleting a changelog and a symlink; the real response to a failed exercise is upstream, not here.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Choose refusal --> Run refusal --> Run accept --> Changelog --> Symlink --> Recursive validate --> Reconcile
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Exercise | Phases 3-6 | Changelog |
| Changelog | Exercise | Symlink |
| Symlink | Changelog version file | Validate |
| Reconcile | Validate | Packet closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Exercise | Medium | two real runs plus judging the outputs |
| Changelog and symlink | Low | under an hour |
| Close | Low | 1-2 hours of reconciliation |
| **Total** | | **half a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Corpus md5 captured, so the exercise provably wrote nothing into `repo-rules/`
- [ ] The refusal case chosen and written down before either run

### Rollback Procedure
1. Remove the symlink and the changelog version file
2. Keep both exercise outputs regardless - they are the evidence, whatever the verdict
3. Reopen the phase the defect belongs to

### Data Reversal
- **Has data migrations?** No
<!-- /ANCHOR:enhanced-rollback -->

---

