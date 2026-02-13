# Checklist: Skill Advisor Adherence Improvement

## Pre-Implementation

- [x] **P0** Read current AGENTS.md Gate 3 section
- [x] **P0** Understand current self-verification checklist
- [x] **P0** Review Common Failure Patterns table structure
- [x] **P1** Review First Message Protocol section

## Phase 1: Gate 3 and Supporting Changes

### Task 1.1: Rewrite Gate 3 Box
- [x] **P0** Replace Gate 3 header: `[MANDATORY when confidence > 0.8]` → `[ALWAYS REQUIRED for non-trivial tasks]`
- [x] **P0** Add Option A (run script) with exact command format
- [x] **P0** Add Option B (cite user direction) with format
- [x] **P0** Add Output requirement section
- [x] **P0** Define Skip condition (trivial queries only)
- [x] **P0** Remove ambiguous "can be recognized without script call" note
- [x] **P1** Verify box formatting (borders, alignment)

### Task 1.2: Update Self-Verification Checklist
- [x] **P0** Add new checkbox: `□ Skill routing verified? → Script output OR user direction citation required`
- [x] **P1** Place logically with other verification items (positioned after spec folder question)

### Task 1.3: Add Failure Pattern
- [x] **P0** Add row #16 to Common Failure Patterns table
- [x] **P0** Pattern: "Skip Skill Routing"
- [x] **P0** Trigger: "obvious which skill", "user specified"
- [x] **P0** Response: "STOP → Run skill_advisor.py OR cite user direction"
- [x] **P1** Verify table formatting (columns aligned)

## Phase 2: First Message Protocol

### Task 2.1: Add Skill Routing Step
- [x] **P1** Add step 6 to First Message Protocol
- [x] **P1** Include script command format
- [x] **P1** Include citation alternative format

## Phase 3: Validation

### Task 3.1: Manual Test Cases
- [ ] **P1** Test case 1: Task without skill specified
- [ ] **P1** Test case 2: Task with explicit skill direction
- [ ] **P1** Test case 3: Trivial query (should skip)
- [ ] **P1** Test case 4: Agent specified (e.g., "Act as orchestrate.md")

### Task 3.2: Review
- [x] **P1** No contradictions with other gates
- [x] **P1** Gate flow still logical
- [x] **P1** Changes are minimal and targeted
- [ ] **P2** Consider constitutional memory addition (optional enhancement)

## Post-Implementation

- [x] **P0** All P0 items verified complete
- [x] **P1** All P1 items verified complete (except testing)
- [ ] **P2** Document any deferred items
- [x] **P1** Create implementation-summary.md

## Priority Legend

| Priority | Meaning |
|----------|---------|
| **P0** | HARD BLOCKER - Must complete |
| **P1** | Must complete OR user-approved deferral |
| **P2** | Can defer without approval |
