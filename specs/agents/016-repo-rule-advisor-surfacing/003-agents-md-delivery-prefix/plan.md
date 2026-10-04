---
title: "Implementation Plan: AGENTS.md delivery prefix"
description: "Measure the must-carry set, decide what moves below the cut, restructure `AGENTS.md`, then extend the existing rule-copy checker with a byte-position guard so the layout cannot silently regress."
trigger_phrases:
  - "agents md delivery prefix plan"
  - "devin agents md truncation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: AGENTS.md delivery prefix

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Node.js (CommonJS), bash |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `check-rule-copies.test.sh`, vitest suites under `system-spec-kit/runtime/cli/tests` |

### Overview
Measure the must-carry set, decide what moves below the cut, restructure `AGENTS.md`, then extend the existing rule-copy checker with a byte-position guard so the layout cannot silently regress.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement backed by measurement in `002-rule-concision-and-loading`
- [ ] Predecessor handoff met: `002-rule-concision-and-loading` research (the cap table and the must-carry list)
- [x] Affected files identified by codebase exploration

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests and checks named in the testing strategy pass
- [ ] spec.md, plan.md and tasks.md synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place extension of an existing CI checker

### Key Components
- **`AGENTS.md`**: the instruction file every runtime reads, in full or truncated
- **`check-rule-copies.js`**: already reads `AGENTS.md` on every PR and push (`rule-canary-sync.yml`), so the guard joins it instead of adding a new script

### Data Flow
The guard reads `AGENTS.md` as bytes, finds each anchor phrase from a constant list, computes the byte where that line ends, and compares it with 16,384. It also compares the file size with 32,768.

### Decision
**ADR-001: Keep section numbers, place §4 before §3 (revised 2026-10-04, operator decision).** The T003 budget falsified the first draft of this decision. The last must-carry clause (MEMORY SAVE) ended at byte 17,299 and §3 sat physically between §2 and §4, so with numbering and order both kept nothing could move below the cut, and meaning-preserving condensing freed only about 1 KB of the 1.75 KB needed. Three options went to the operator: §4 before §3 with numbers kept, renumbering §3 and §4 (which edits ten references, six of them in rule files, and so amends D1), or harder condensing (rejected as meaning-changing). The operator chose §4 before §3. The §8 block and the two §10 mandates moved to the end of §4 as "Reply Rules and Mandates", in a shortened copy, with one-line pointers left under §8 and §10. §3's Blast-Radius Management stays inside the cut and is a guard anchor. What falls past the cut for Devin is the rest of §3 (Execution Behavior, Quality Principles, Restraint Signals) and §5 to §10, none of which is a hard blocker.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `AGENTS.md` | Producer of every instruction | Update | Guard output plus diff review |
| `check-rule-copies.js` Iron Law check | Reads `AGENTS.md` by text | Unchanged | Text search, not position: test still passes |
| `sync-gate1-pointers.cjs` | Copies the Gate 1 line by text | Unchanged | `--check` exit 0 |
| `~/.claude/CLAUDE.md` | Symlink to `AGENTS.md` | Follows automatically | `ls -la` shows the link |
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
| Unit | Guard pass and fail fixtures | `check-rule-copies.test.sh` |
| Integration | Gate 1 sync and workflow invariance | vitest, `sync-gate1-pointers.cjs --check` |
| Manual | Devin delivery | Live Devin probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Devin CLI | External | Green | SC-002 reported unverified |
| rule-canary CI workflow | Internal | Green | Guard does not run on PRs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guard fails after merge, or a runtime behaves worse
- **Procedure**: `git revert` the single commit. The symlinked global file follows.
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
| Setup | `002-rule-concision-and-loading` research (the cap table and the must-carry list) | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | 004-rule-delivery-instrumentation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 3-4 hours |
| Verification | Low | 1-2 hours |
| **Total** |  | **5-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Each change lands as its own revertable commit
- [ ] The checks in the testing strategy pass before the commit

### Rollback Procedure
1. `git revert` the single commit. The symlinked global file follows.
2. Rerun the checks named in the testing strategy on the reverted tree.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
