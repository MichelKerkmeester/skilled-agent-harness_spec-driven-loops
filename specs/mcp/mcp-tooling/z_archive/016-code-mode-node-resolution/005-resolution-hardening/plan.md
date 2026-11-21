---
title: "Implementation Plan: Resolution hardening"
description: "Repair candidate enumeration against real filesystem entries, add a bounded version probe, put existence checks behind the launch path, and reconcile the packet's completion records."
trigger_phrases:
  - "resolution hardening plan"
  - "interpreter probe design"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Resolution hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS on Node for the resolver, bash for the installer, diagnosis and sweepers |
| **Framework** | None; standard library only |
| **Storage** | None; reads manifests, directory listings and symlink targets |
| **Testing** | `node --test` against real temporary directories, plus the workspace node gate |

### Overview

Three changes to enumeration, in the order a version becomes harder to obtain: accept a real directory entry, follow its symlink, then ask the interpreter itself. Two existence checks behind the launch path. Two sweeper patterns. Then the packet's own records are brought back in line with what was run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The dead branch is reproduced with a real interpreter planted on the search path
- [ ] The probe's exposure is bounded against what a launch already executes
- [ ] The pre-existing gate baseline is measured and attributed before any edit

### Definition of Done
- [ ] The planted interpreter is returned after the change and was not before
- [ ] The search-path tests fail if the directory test is reintroduced
- [ ] The workspace node gate shows no failure that this phase introduced
- [ ] No completion item in the packet asserts an execution that did not happen
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A version ladder with widening cost. Each rung is tried only when the cheaper one above it returns nothing, so the common case still reads directories and the expensive case is bounded and deduplicated.

### Key Components

- **Entry test**: distinguishes a candidate binary from a directory, replacing a check that required the opposite.
- **Version ladder**: the literal path, then the symlink target, then the interpreter's own `-v` output.
- **Probe budget**: probes deduplicated by real path and capped, so a long search path cannot turn enumeration into a series of process spawns.
- **Existence checks**: the installer and the diagnosis both assert the launcher file before treating the registration as usable.

### Data Flow

A search-path directory yields entries. An entry named `node` that is not a directory becomes a candidate. Its version comes from the first rung of the ladder that answers. Candidates outside the declared range are discarded, and the highest survivor is returned exactly as before; only the supply of candidates changed.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the per-task state. The work divides into three stages:

### Phase 1: Reproduce and measure
Plant a real in-range interpreter on the search path and record that enumeration misses it. Measure the workspace gate before any edit, so a pre-existing failure cannot later be mistaken for one of this phase's.

### Phase 2: Repair
Enumeration first, since the tests for everything else depend on it answering correctly. Then the existence checks and the sweeper patterns, each independent of the others.

### Phase 3: Prove and reconcile
Re-run the reproduction as a positive control. Execute the installer that the previous phase recorded as unexecuted, then correct every completion record the evidence does not support.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The search-path tests are rebuilt on real temporary directories read through the default host access, because the defect being fixed is precisely that fixture-shaped entries hide it. Each rung of the version ladder gets a directory whose layout forces that rung: a version in the path, a symlink into a versioned directory, and a bare directory holding an interpreter that answers only when asked. The installer is executed against a scratch project root with a scratch home directory, so its unconditional cache clearing cannot reach the operator's own.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The resolver stays the only reader of the declared range. The installer and the diagnostic route call it rather than restating a version, so a manifest change moves all three together.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is additive to existing files and reversible with `git revert` of this phase's commit. The resolver's selection contract is unchanged - the same range parsing, the same highest-satisfying rule, the same null on failure - so reverting narrows the candidate supply back to its previous state without altering how a candidate is chosen. No host configuration, registration or installed artifact changes here.
<!-- /ANCHOR:rollback -->

---
