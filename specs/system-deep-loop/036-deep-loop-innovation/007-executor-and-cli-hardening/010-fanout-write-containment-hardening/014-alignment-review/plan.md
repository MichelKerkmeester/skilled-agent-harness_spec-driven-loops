---
title: "Implementation Plan: Phase 1: alignment-review"
description: "Run three cli-devin DeepSeek lanes of five iterations over the 014 spec folder, merge, verify every P0 and P1 against the tree, and bind each to a phase or a recorded disposition."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: alignment-review

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
The lanes read the 014 spec, which names the six dimensions and their surfaces, and review the tree against the repo rules. After the merge the orchestrator verified each P1 by reading the cited code and documents, bound the confirmed ones to phases 016 to 020 and recorded the rest with reasons.
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
Fan-out review with orchestrator verification and phase binding

### Key Components
- **Three cli-devin lanes**: Five iterations each on the primary executor
- **Merge**: Strongest-restriction verdict and attribution
- **Binding table**: Phase or reviewed disposition per finding

### Data Flow
014 spec → lanes → reports and registries → merge → verification → phases 016 to 020 or recorded dispositions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Command YAMLs | Different runner flags; leaf as full loop | phase 016 | landed |
| Review protocol and hub catalog | Missing containment rules; wrong mode count | phase 017 | landed |
| Orchestrate mirrors | Delegation tool undeclared | phase 018 | landed |
| Forced-depth validator | Empty record set passed | phase 019 | landed |
| Direct append sites | Dropped by the projection refresh | phase 020 | landed |

Required inventories:
- Confirmed P1s: five from lane A, one each from lanes B and C, two of which are the same protocol finding.
- Recorded as reviewed: the review YAML's single-executor linked-worktree guard (predates the packet), Pi's generated tools list (no installed delegation tool), a model-benchmark test expecting a retired route.
- Route proof: every numbered record carries target_agent, resolved_route, agent_definition_loaded and mode.
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
| Run | Three lanes, fifteen iterations | fanout-run.cjs |
| Merge | Attribution and verdict | fanout-merge.cjs |
| Verification | Each P1 read against the tree | orchestrator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 008 to 013 and 015 landed first | Internal | Green | - |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable
- **Procedure**: A review binds work; the phases carry their own rollback
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

