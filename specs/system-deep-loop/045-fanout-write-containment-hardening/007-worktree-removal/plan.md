---
title: "Implementation Plan: Remove the per-lineage worktree mechanism, its modules, wiring, tests and plan, now that attribution is not a requirement"
description: "Delete the worktree modules, their tests and their wiring; collapse lineage paths to the shared-checkout mapping; prove it with the suite, the wrapper tests and a live run."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Remove the per-lineage worktree mechanism, its modules, wiring, tests and plan, now that attribution is not a requirement

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM) plus a CommonJS runner script |
| **Framework** | None |
| **Storage** | Git working tree, JSONL state and status ledgers |
| **Testing** | Vitest |

### Overview
Everything the worktree option added is removed rather than left behind a flag. Lanes write, spawn and are inspected at the lineage directory inside the repo root, which is the mapping that existed before isolation. The launch wrapper's own provisioning is untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deletion to a single code path

### Key Components
- **fanout-run.cjs**: Shared-checkout lineage paths, containment against the repo root
- **executor-config.ts**: Containment schema without the worktrees field
- **Feature catalog and playbooks**: Describe the shared-checkout model only

### Data Flow
A lineage's directory name is run-keyed under the packet's research tree; the runner spawns the executor in the checkout, the containment guard snapshots and inspects the checkout, and the lane's artifacts stay where they were written.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Runner lane setup and settle | Branched on a lane worktree | update | suite green, `grep worktree` shows only checkout wording |
| Containment call sites | Took a per-lane root | update | repo root for every call |
| Launch wrapper | Provisions operator session worktrees | unchanged | wrapper tests 25 and 24 pass |

Required inventories:
- References outside the runtime: feature catalog, playbook index, two playbook pages; changelogs and benchmark reports left as history.
- Consumers of the removed config field: none after the runner change; typecheck exit 0.
- Invariant: a lane never had a worktree when the option was off, so the off-path behaviour is the surviving behaviour.
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
| Unit | Runner and config without worktrees | Vitest, 151 files |
| Wrapper | Launch-wrapper session and reaper tests | bash |
| Live | Two DeepSeek lanes on this checkout with a neighbour writer | fanout-run.cjs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 to 006 landed first | Internal | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Isolation is needed again
- **Procedure**: Revert this phase's commit; the modules and tests return intact
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | minutes |
| Core Implementation | Low | one dispatch |
| Verification | Med | full suite run |
| **Total** | | **one dispatch plus one suite run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---

