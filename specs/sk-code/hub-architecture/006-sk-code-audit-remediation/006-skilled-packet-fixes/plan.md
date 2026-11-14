---
title: "Implementation Plan: Phase 6: skilled-packet-fixes"
description: "Read each `SK` verdict in the ledger. Fix the rows that held, one statement per task, in the file the row cites. Prove each with the `rg` or test command on its task line."
trigger_phrases:
  - "skilled packet fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: skilled-packet-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | Markdown, JSON |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` |

### Overview
Read each `SK` verdict in the ledger. Fix the rows that held, one statement per task, in the file the row cites. Prove each with the `rg` or test command on its task line.
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
- [ ] `grep -c '^| SK-.*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/006-skilled-packet-fixes --strict --quiet` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One row, one fix

### Key Components
- **`.skilled/skills/sk-code/sk-code-skilled/`**: The only packet this phase edits
- **`findings-ledger.md`**: Receives the fix evidence for each row

### Data Flow
A ledger row names a file and a verdict. A task changes that file when the verdict held. The task's verify command becomes the row's fix evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `.skilled/skills/sk-code/sk-code-skilled/` entry documents and references | State the packet's rules | update per row | The verify clause on each task |
| Hub `ROUTER.md` and `leaf-manifest.json` | Point at this packet's files | unchanged | `run-all-drift-guards.sh` passes |
| The packet's own tests and guards | Pin some of its wording | unchanged | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` |

Required inventories:
- Same-class producers: every ledger row this phase owns is one producer, listed by id in `tasks.md`.
- Consumers of changed files: the rows above name each one and what proves it is unaffected.
- Matrix axes: the ledger verdict (`Confirmed`, `Changed`, `Refuted`, `Judgment`) is the one input axis, and each task states which verdicts it acts on.
- Algorithm invariant: N/A, this phase changes no parser, resolver or security path.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms no `SK` row is `Unverified` and records the guard baseline. Implementation fixes the rows that held, one per task. Verification runs the packet's guards and counts the open rows.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Unit | The packet's existing tests | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` |
| Integration | Hub drift guards | `run-all-drift-guards.sh` |
| Manual | One `rg` check per row | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 001 | Internal | Yellow | No verdicts to act on |
| Phase 005 | Internal | Yellow | The drift guards are red until it lands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A packet test or a hub drift guard fails after a fix.
- **Procedure**: Revert that task's commit with `git revert <sha>` and reopen its ledger row.
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
| Verification | Implementation | Closing this phase and starting `007-review-packet-fixes` |
<!-- /ANCHOR:phase-deps -->

---

