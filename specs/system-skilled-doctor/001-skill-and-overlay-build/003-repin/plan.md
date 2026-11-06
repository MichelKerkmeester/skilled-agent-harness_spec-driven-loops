---
title: "Implementation Plan: Phase 3: repin"
description: "Add a repin target to the overlay engine that stages the new upstream commit, refuses unowned drift, backs up every path it touches and rolls back byte for byte, then route it through /doctor:overlay repin."
trigger_phrases:
  - "repin plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: repin

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, standard library only, plus the `git` command |
| **Framework** | The doctor command family: a router `.md`, workflow YAML, a presentation asset and the engine |
| **Storage** | A run folder per re-pin in the overlay folder, holding the backup bytes and their hashes |
| **Testing** | `node --test`, with a temporary git repository as the upstream checkout |

### Overview
`repin` automates Barter's seven-step runbook in one engine target. It stages the new commit, refuses an in-place edit the copy would revert, backs up every path it will touch, copies, re-applies and checks. `--stage` runs the same steps on a copy, and `--rollback` puts the backed-up bytes back.

### Port Source
The steps come from the frozen Barter runbook, `barter-overlays/README.md` lines 50 to 160, listed with its SHA-256 in phase 002's `plan.md` port-source table.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified: phase 002's engine and lock

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` prints `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One more engine target behind the same thin command router as `status` and `apply`.

### Key Components
- **`repin` in `overlay-engine.cjs`**: computes one set of touched paths, backs them up, copies and re-applies under the engine lock.
- **`/doctor:overlay repin`**: runs the stage as its plan, asks once, runs the live repin, and offers the rollback when a run fails after its backup.

### Data Flow
The manifest's pin and `--to` name the two commits. `git archive` stages the new one, and `git diff` between them gives the changed `.skilled` paths and the deleted paths. The runtime folders are added whole and `repin.exclude` is removed. That one set feeds the drift scan, the backup and the copy.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Re-pin copy | A hand-run `rsync` and `tar` | One computed set of touched paths | A test compares the backup list with the copy list |
| Rollback | "Restore from git", which an untracked tree cannot do | A run folder with the bytes and their hashes | The rollback test, byte for byte |
| In-place edits | Reverted by the next copy without warning | Refused before any write, naming the path | The unowned-drift test |

Required inventories:
- Same-class producers: every path the copy writes or deletes comes from the one touched-path set.
- Matrix axes: the three copy kinds (changed, whole folder, deleted) by live and stage runs.
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
| Unit | One test per requirement, against a temporary upstream repository | `node --test` |
| Integration | The command's contract and the doctor suite | `node --test`, `route-validate.sh` |
| Manual | A stage run on a copy of Barter's tree, against the Skilled checkout | The parity run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002's engine and lock | Internal | Green | No target to extend |
| `git` and a checkout with both commits | External | Green | `repin` refuses before any write |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `repin` writes a path outside its touched set, or a rollback is not byte-exact.
- **Procedure**: revert this phase's commit. No project runs `repin` yet, so nothing downstream depends on it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup: read the runbook | Phase 002 | Implementation |
| Implementation: tests, then the target, then the command | Setup | Verification |
| Verification: suite, stage run, routing | Implementation | Phase 004 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
tests (red) ──► repin target (green) ──► command route ──► stage run on Barter's copy
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Repin tests | Phase 002's fixtures | Red evidence | The target |
| Repin target | The tests | `repin`, `--stage` and `--rollback` | The command |
| Command route | The engine contract | `/doctor:overlay repin` | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Backup before the first write, proven by a test** - first - CRITICAL
2. **Byte-exact rollback** - next - CRITICAL
3. **A stage run that leaves the live tree unchanged** - last - CRITICAL

**Total Critical Path**: one working session

**Parallel Opportunities**:
- The command files are written against a fixed engine contract while the target is built.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Tests red | Each requirement test fails on phase 002's engine | Before the target |
| M2 | Target green | Every repin test passes | Mid-phase |
| M3 | Command routed | `/doctor:overlay repin` passes its contract and the doctor suite | Phase end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The decisions for this phase are in `decision-record.md`.

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [x] Read the Barter runbook and the design rows before the first test.
- [x] Fix the engine's command-line contract before the command files are written.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Each requirement test is recorded failing before the target that passes it. |
| TASK-SCOPE | Never write under Barter's tree. The stage run uses a scratch copy, and the Skilled checkout is only read through `git`. |

### Status Reporting Format
Report as: `Phase 003 - <In Progress|Complete> - repin tests <pass>/<total> - blocking on: <item | none>`.

### Blocked Task Protocol
A requirement test that passes before the target exists is reported as not reproducing, never weakened. A stage run that changes the live tree blocks the commit.
<!-- /ANCHOR:ai-execution-protocol -->
