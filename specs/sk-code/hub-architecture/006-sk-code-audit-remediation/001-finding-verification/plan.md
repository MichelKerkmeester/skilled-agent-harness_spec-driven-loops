---
title: "Implementation Plan: Phase 1: finding-verification"
description: "Read each unverified row, run the command that could contradict it and write the verdict. Save the router and setup output as baselines. Prove it with two `grep -c` counts that print 0."
trigger_phrases:
  - "finding verification plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: finding-verification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | Markdown, ripgrep, Node 24 |
| **Framework** | None |
| **Storage** | `findings-ledger.md` |
| **Testing** | `grep -c` counts on the ledger |

### Overview
Read each unverified row, run the command that could contradict it and write the verdict. Save the router and setup output as baselines. Prove it with two `grep -c` counts that print 0.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `spec.md` section 2 states the problem and section 3 lists the files to change
- [ ] Every requirement in `spec.md` section 4 names a command and its expected output
- [ ] The predecessor phase's handoff criteria are met, or this is phase 1

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] `grep -c '| Unverified |' findings-ledger.md` prints 0
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification --strict --quiet` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only evidence ledger

### Key Components
- **`findings-ledger.md`**: Holds one row per finding with its verdict and evidence
- **`scratch/probes.txt`**: Holds the 22 prompts every router measurement in this packet replays

### Data Flow
A raw report line becomes a ledger row. A command run against the cited file sets the verdict. The fix phase named in the row reads the verdict before it edits.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `findings-ledger.md` | Owns every verdict | update | `grep -c '| Unverified |'` prints 0 |
| Phases 002 to 008 `tasks.md` | Read the verdict before each fix | unchanged | Each fix task starts with the row id it reads |

Required inventories:
- Same-class producers: every ledger row this phase owns is one producer, listed by id in `tasks.md`.
- Consumers of changed files: the rows above name each one and what proves it is unaffected.
- Matrix axes: the ledger verdict (`Confirmed`, `Changed`, `Refuted`, `Judgment`) is the one input axis, and each task states which verdicts it acts on.
- Algorithm invariant: N/A, this phase changes no parser, resolver or security path.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the three reports and the 37 open rows. Implementation checks the rows packet by packet and saves the two baselines. Verification counts the open rows and validates the folder.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Unit | N/A: this phase writes no code | None |
| Integration | The 22 router probes | `compiled-route.cjs` |
| Manual | Ledger counts | `grep -c` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| `compiled-route.cjs` | Internal | Green | No router baseline |
| ripgrep | External | Green | No evidence commands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A verdict turns out to be wrong after a fix phase has read it.
- **Procedure**: Correct the row in `findings-ledger.md` and reopen the task that read it. No file under `.skilled/` changes in this phase, so there is nothing else to revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|---|---|---|
| Setup | The predecessor phase's handoff criteria | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing this phase and starting `002-frontend-reach` |
<!-- /ANCHOR:phase-deps -->

---

