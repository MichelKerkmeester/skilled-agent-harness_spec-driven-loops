---
title: "Implementation Plan: Phase 2: overlay-engine"
description: "Merge Barter's replay and sync scripts into one standard-library engine, port their tests to prove the merge kept behavior, then fix six defects test first, and route /doctor:overlay status and apply to the engine."
trigger_phrases:
  - "overlay engine plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: overlay-engine

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, standard library only |
| **Framework** | The doctor command family: a router `.md`, workflow YAML, a presentation asset and an engine script |
| **Storage** | JSON files in the overlay folder: the manifest and the applied-hash state |
| **Testing** | `node --test`, with Barter's sync and replay tests ported and one test per fix |

### Overview
The engine is a straight merge of Barter's two scripts first, proven by their own tests, then each defect is reproduced by a test and fixed. The command router and its workflows call only the engine.

### Port Source
Frozen copies, kept outside the repository in the session scratchpad, with their SHA-256:

| File | SHA-256 |
|------|---------|
| `barter-overlays/replay.cjs` | `bbe36ff1b931ea8e4a71cf1668ea339144af1694c21024598b530ee786a17788` |
| `barter-overlays/sync.cjs` | `28dc594fc4b8b040751713815a937178da1654e0de847594482106f125cc3c4f` |
| `barter-overlays/tests/replay.test.cjs` | `87bab715bb84d28ca01be6d43d9c93f5f9f14dc48894109711ceddd4c4a038e5` |
| `barter-overlays/tests/sync.test.cjs` | `3ee99979617930d2dad2a5718c856ccac20172c5c20d22de0ca3ceff2d0c98a2` |
| `.skilled/hooks/overlay-sync/lib/overlay-sync-core.cjs` | `711fba87cf5185d2c59c86d71cc5107e206be2a6b0bdc690d2a69b00fa500429` |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` prints `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One engine script behind a thin command router, the shape every doctor command uses.

### Key Components
- **`overlay-engine.cjs`**: plans, applies and checks every overlay scope, owns the lock and reads the overlay folder setting through `resolveOverlayDir(root)`.
- **`/doctor:overlay`**: binds `status` or `apply`, shows what will change before `apply`, and renders the engine's output.

### Data Flow
`resolveOverlayDir` reads `.skilled-overlays.json`, the engine loads the manifest and the applied-hash state from that folder, plans every entry with the same accepted hashes, then either reports each destination's state or writes the planned bytes under its lock and records their hashes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Planner calls | Check plans without accepted hashes | Every plan passes the accepted hashes | The changed-overlay test, red then green |
| Retained outputs | Skipped as outputs and unguarded | A path in both `replace` and `retained` is an output | The retained-output test, red then green |
| Protected names | An extension-list patch | Exact manifest paths, with `protectedPaths` for walked entries | The token tests and the parity run |

Required inventories:
- Same-class producers: every `planOverlay` call site in the engine passes the accepted hashes.
- Matrix axes: six scopes by the state each can reach.
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
| Unit | Ported sync and replay tests, one test per fix | `node --test` |
| Integration | The command router's contract and the doctor suite | `node --test`, `route-validate.sh` |
| Manual | `status` on a copy of Barter's tree | The parity run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Frozen Barter scripts | External | Green | No port source |
| Phase 001's skill | Internal | Green | The command has no owner |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the engine misreports a state that Barter's scripts report correctly.
- **Procedure**: revert this phase's commit. Barter keeps its own scripts until its cutover, so nothing downstream depends on the engine yet.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup: freeze the source | None | Implementation |
| Implementation: port, then fixes, then the command | Setup | Verification |
| Verification: suite, parity, routing | Implementation | Phase 003 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
freeze ──► straight port + ported tests ──► fix tests (red) ──► fixes (green) ──► command ──► verify
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Straight port | Frozen source | An engine with Barter's behavior | Fix tests |
| Fix tests | Straight port | Red evidence | Fixes |
| Fixes | Fix tests | The corrected engine | Command |
| Command | Fixes | `/doctor:overlay status` and `apply` | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Straight port proven by Barter's tests** - first - CRITICAL
2. **Each fix shown red then green** - next - CRITICAL
3. **Parity on a copy of Barter's tree** - last - CRITICAL

**Total Critical Path**: one working session

**Parallel Opportunities**:
- The command files and the skill reference can be written while the engine is ported.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Port proven | 21 ported tests pass on the straight port | Before any fix |
| M2 | Fixes green | Every fix test passes, each recorded red first | Mid-phase |
| M3 | Command routed | `/doctor:overlay` passes its contract and the doctor suite | Phase end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The decisions for this phase are in `decision-record.md`: ADR-001 for `protectedPaths`, ADR-002 for the report line shape and ADR-003 for the test that is not ported.

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [x] Freeze the port source and record each SHA-256 before the first edit.
- [x] Read the design's requirement rows before writing each fix test.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | The ported tests pass on the straight port before any fix, and each fix test is recorded failing before its fix. |
| TASK-SCOPE | Never write under Barter's tree. The parity run uses a scratch copy only. |

### Status Reporting Format
Report as: `Phase 002 - <In Progress|Complete> - engine tests <pass>/<total> - fixes red-then-green <n>/6 - blocking on: <item | none>`.

### Blocked Task Protocol
A fix test that passes on the straight port is reported as not reproducing its defect, never weakened to fail. A parity difference that is not an intended fix blocks the commit until it is explained.
<!-- /ANCHOR:ai-execution-protocol -->

---
