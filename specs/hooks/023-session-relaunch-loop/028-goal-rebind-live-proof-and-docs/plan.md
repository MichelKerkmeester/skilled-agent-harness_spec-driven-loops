---
title: "Implementation Plan: Phase 28: goal-rebind-live-proof-and-docs"
description: "Run one live hop with a goal per runtime, with the switch and no-goal controls, add the playbook scenarios, update the docs and parent maps, and close with recursive strict validation."
trigger_phrases:
  - "goal rebind live proof plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 28: goal-rebind-live-proof-and-docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell, tmux and the runtime CLIs, Markdown playbooks |
| **Framework** | The session-relaunch playbooks and the goal playbooks |
| **Storage** | None, evidence is transcripts under scratch/ |
| **Testing** | Live hops with controls, plus the existing gates |

### Overview
Run one hop per runtime with a goal, then the two controls, read the receiver status, write the scenarios into the playbooks and update the docs and parent maps.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Phases 025 to 027 are Complete

### Definition of Done
- [ ] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
- [x] Recursive strict validation passes for both parents
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Observe, record and document.

### Key Components
- **Live hop record**: One per runtime with the transcript, receiver status and history lines.
- **Playbook scenarios**: The repeatable form of each run.

### Data Flow
A sender with a goal prepares a hand-over, the wrapper relaunches, and the receiver status is read and saved.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The three relaunch playbooks | Describe live scenarios | Add scenarios | The scenario runs as written |
| README, goal plugin doc, handoff command, feature catalog | Describe behavior | Update | `rg` for the field and the switch |
| 023 and 060 parent specs | Phase maps | Add rows | `validate.sh --strict --recursive` |

Required inventories:
- Same-class producers: `rg -n "SESSION_RELAUNCH_GOAL" .skilled specs` lists every doc that names the switch.
- Consumers of the playbooks: the playbook index and the feature catalog entry.
- Matrix axes: runtime (seven), run kind (goal, switch off, no goal).
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
| Manual | Live hops and controls | tmux and the runtime CLIs |
| Automatable | Playbook scenarios that can run in a stub | `node --test` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 025 to 027 | Internal | Yellow | Nothing to prove |
| Runtime credentials | External | Yellow | The runtime is a SKIP |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A live run shows the goal bound to the wrong packet or a goal overwritten.
- **Procedure**: Stop the receiver, clear its goal, and send the defect to the owning phase as a failing test.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Live hops ──► Controls ──► Playbooks and docs ──► Parent maps ──► Strict validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Live hops | Phases 025 to 027 | Controls |
| Docs and maps | Live hops | Closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Live runs | High | 4 to 6 hours |
| Docs and closure | Med | 3 hours |
| **Total** |  | **8 to 10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Credentials checked per runtime without printing a key
- [x] Low hop cap and short task prepared

### Rollback Procedure
1. Stop every tmux session the runs started.
2. Clear any goal a run set.
3. Revert doc edits that name a result no run showed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
