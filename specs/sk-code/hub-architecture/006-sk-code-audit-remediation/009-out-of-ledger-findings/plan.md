---
title: "Implementation Plan: Phase 9: out-of-ledger-findings"
description: "Read each cited line. Fix each finding with one literal edit in the file it cites. Prove each with the `rg` or check command on its task line."
trigger_phrases:
  - "out of ledger findings plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: out-of-ledger-findings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` |

### Overview
Read each cited line. Fix each finding with one literal edit in the file it cites. Prove each with the `rg` or check command on its task line.
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
- [ ] `rg -c 'CHK-CMT' .skilled/skills/sk-code -g '*.md' -g '!**/changelog/**'` prints nothing and exits 1
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/009-out-of-ledger-findings --strict --quiet` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One finding, one literal edit

### Key Components
- **`.skilled/skills/sk-code/sk-code-skilled/`**: Two checklists, the entry document, the scripts README and the playbook root
- **`.skilled/skills/sk-code/sk-code-review/`**: One playbook scenario and the entry document's version
- **`.skilled/skills/sk-code/sk-code-quality/`**: The README and the entry document

### Data Flow
A logged finding names a file and a line. A task changes that line. The task's verify command is the proof.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| The eight documents in `spec.md` Files to Change | State the packets' rules and inventories | update per finding | The verify clause on each task |
| Hub `ROUTER.md`, `hub-router.json` and `mode-registry.json` | Route requests | unchanged | `run-all-drift-guards.sh` passes |
| The three packets' tests and guards | Pin some wording | unchanged | The test commands in `tasks.md` T017 |

Required inventories:
- Same-class producers: each finding is one producer, listed by file in `tasks.md`.
- Consumers of changed files: the rows above name each one and what proves it is unaffected.
- Matrix axes: N/A, each finding has one input, the cited line.
- Algorithm invariant: N/A, this phase changes no parser, resolver or security path.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads each cited line and records the guard baseline. Implementation makes one literal edit per finding and writes the three release notes. Verification runs the packets' tests, the drift guards and the README reference check.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Unit | The packets' existing tests | `node --test` on `sk-code-skilled/scripts/tests` and `sk-code-quality/scripts/tests` |
| Integration | Hub drift guards and the setup battery | `run-all-drift-guards.sh`, `sk-code-setup-check.cjs` |
| Manual | One `rg` check per finding | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phases 006 to 008 | Internal | Green | No findings to act on |
| DeepSeek V4.1 Flash through cli-pi | External | Green | The edits are made by hand and the summary says so |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A packet test or a hub drift guard fails after a fix.
- **Procedure**: Revert the phase's code commit with `git revert <sha>` and reopen the finding in `goal.md`.
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
| Verification | Implementation | Closing this phase and starting `None` |
<!-- /ANCHOR:phase-deps -->

---

