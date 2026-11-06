---
title: "Implementation Plan: Phase 4: guard-hook"
description: "Add a pre-write guard hook that asks the overlay engine whether a path is owned and refuses the edit when it is, inert in a repository with no overlay manifest, registered once for every runtime the registry serves."
trigger_phrases:
  - "guard hook plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: guard-hook

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, one core plus one adapter per runtime, and a TypeScript Pi extension |
| **Framework** | The shared hook registry and its registration generator |
| **Storage** | None. The hook reads nothing but the engine's answer |
| **Testing** | `node --test` on the core and the adapters |

### Overview
An edit to a file an overlay owns is lost at the next re-pin. The guard asks the engine's `--guard` before the write and refuses it, naming the overlay file to edit instead. Barter's hook also applied overlays after an edit, and that half is not ported.

### Port Source
Barter's `overlay-sync-core.cjs`, frozen with its SHA-256 in phase 002's `plan.md`. The adapter shape follows `.skilled/hooks/mcp-route-guard/`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified: the engine's `--guard`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The hook tests and the doctor suite print `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A thin pre-write hook over the engine, in the same shape as `mcp-route-guard`.

### Key Components
- **`lib/overlay-guard.cjs`**: finds the tree root, allows at once when no manifest exists, and otherwise asks the engine about each path.
- **Runtime adapters**: translate each runtime's pre-tool payload into paths and its answer into an allow or a refusal.

### Data Flow
The runtime sends the pending write. The adapter extracts its paths, the core asks `overlay-engine.cjs --guard`, and an owned path is refused with the engine's message. An engine error allows the write with a one-line note.
<!-- /ANCHOR:architecture -->

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
| Unit | The core and each adapter's payload shape | `node --test` |
| Integration | The registration generator and the runtime mirrors | Their `--check` modes |
| Manual | A guarded edit on a fixture tree | The hook test's spawn of each adapter |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The engine's `--guard` | Internal | Green | Nothing to ask |
| The hook registry and its generator | Internal | Green | No runtime registers the hook |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the hook blocks an edit in a repository with no overlays, or slows every write.
- **Procedure**: revert this phase's commit and rerun the registration generator.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup: read the model hook | Phase 003 | Implementation |
| Implementation: tests, then the core, adapters and registry entry | Setup | Verification |
| Verification: tests, registrations, mirrors | Implementation | The packet close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
tests (red) ──► core (green) ──► adapters ──► registry entry ──► registrations
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Core | The engine's `--guard` | Allow or refuse per path | Adapters |
| Adapters | The core | One hook per runtime | Registry entry |
| Registry entry | Adapters | Generated registrations | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Inert without a manifest** - first - CRITICAL
2. **An owned path refused, naming its overlay** - next - CRITICAL
3. **No apply after an edit** - last - CRITICAL

**Total Critical Path**: one working session

**Parallel Opportunities**:
- The adapters are independent once the core exists.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Tests red | Each hook test fails before the core exists | Before the core |
| M2 | Core green | The core tests pass | Mid-phase |
| M3 | Registered | The registration `--check` and the mirror checks pass | Phase end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The decisions for this phase are in `decision-record.md`.

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [x] Read the engine's `--guard` contract and the model hook before the first test.
- [x] Confirm the post-edit apply is out of scope by the operator's ruling.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Each hook test is recorded failing before the code that passes it. |
| TASK-SCOPE | The hook only asks. It never applies, writes or captures an overlay. |

### Status Reporting Format
Report as: `Phase 004 - <In Progress|Complete> - hook tests <pass>/<total> - blocking on: <item | none>`.

### Blocked Task Protocol
A hook that blocks an edit in a repository with no manifest blocks the commit.
<!-- /ANCHOR:ai-execution-protocol -->
