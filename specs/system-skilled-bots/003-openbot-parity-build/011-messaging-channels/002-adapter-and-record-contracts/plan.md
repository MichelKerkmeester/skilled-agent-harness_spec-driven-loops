---
title: "Implementation Plan: Phase 2: adapter-and-record-contracts"
description: "Five design documents in design/, written against the frozen channel contracts and the reference providers, so the build children implement the capability matrix, the records, the acknowledge order and the conformance rules without a design decision of their own."
trigger_phrases:
  - "adapter contracts plan"
  - "channel records plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: adapter-and-record-contracts

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown. No code |
| **Framework** | None |
| **Storage** | `design/` in this child folder |
| **Testing** | `rg`, `awk` and `comm` checks that run without a tty |

### Overview
The contracts own every channel record's fields. This child owns what they leave open. The capability matrix turns the reference's structured capability record into eight booleans and three facts per transport, because five transports and five operations need no more. The records document restates each contract table and adds its lifecycle, which the build children need to write files in the right order. The inbound sequence takes the reference's default acknowledge policy for every transport that has an acknowledge. The conformance rules number the reference checker's assertions. The runbook turns the risk table into steps.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `rg -n '^## 1[1-6]\. ' specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md` prints the six channel sections
- [ ] `test -f specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs` exits 0

### Definition of Done
- [ ] Each check in `tasks.md` prints what it says
- [ ] `git diff --name-only "$(rg -o 'base commit [0-9a-f]{40}' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/goal.md | cut -d' ' -f3)"..HEAD -- specs/system-skilled-bots/003-openbot-parity-build/contracts` prints nothing
- [ ] Every acceptance criterion reads `Met`
- [ ] `validate.sh --strict` on this folder prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Design contract under a frozen contract: each document owns one subject, restates what the packet contract owns and adds only what it leaves open.

### Key Components
- **`design/capabilities.md`**: the vocabulary and the matrix. `channel.ts` exports the keys, each transport returns its column and the conformance suite iterates the matrix.
- **`design/records.md`**: the records, their lifecycles, the derived secret names, the backoff data, the listen lease and the write order of one prompt.
- **`design/inbound-sequence.md`**: the acknowledge order per transport.
- **`design/conformance-rules.md`**: R1 to R5 and the 25 cases.
- **`design/operator-runbook.md`**: what the operator runs.

### Data Flow
`003-link-roster-and-answer-gate` builds `channel.ts` from the capability keys and the config and link records. `004-approval-index-and-send-queue` builds the index and the queue from their sections. `005-polling-transports` and `006-daemon-and-webhook-transports` follow the inbound sequence and the runbook's health checks. `007-conformance-hardening-and-proof` builds the suite from the rules and copies the runbook into the operator reference.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification checkboxes and task state.

Setup confirms the contracts and the reference files this phase reads. Implementation writes the five documents. Verification runs each document's check, confirms no contract changed and runs the validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Count | Eleven matrix rows, nine samples, five transport sections, five rules, twelve runbook checks | `rg -c` and `awk` |
| The backoff table | The table holds five values and a cap of five attempts, read out of `records.md` | `rg -c` |
| Coverage | 18 undeclared and 7 declared conformance cases | `rg -o` and `uniq -c` |
| Freeze | No contract file changed since the base commit | `git diff --name-only` |
| Packet | The child validates | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `contracts/records.md`, `cli-json.md`, `refusals.md`, `runtime-architecture.md`, `versioning.md` | Internal | Green, frozen | The fields and names would be undecided |
| The tinychannels providers and crates | External, gitignored | Present in this worktree | The wire facts could not be cited |
| turnstone and rakazo setup documents | External, gitignored | Present | The runbook's scopes could not be cited |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the contract owner rejects the derived secret names, or a build child finds a lifecycle it cannot implement.
- **Procedure**: revert the commit that adds `design/`. No code depends on it until child 003 starts.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The contracts and the reference files | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The handoff to `003-link-roster-and-answer-gate` |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

The executor roster, the effort policy, the fallback ladder, the dispatch rules and the self-invocation guards are the ones `../003-link-roster-and-answer-gate/plan.md` section 8 writes out for this phase parent. This child adds one wave table.

| Wave | Task ids | Files | Executor | Effort | Workers | Verify |
|------|----------|-------|----------|--------|---------|--------|
| 0 | T001 to T003 | none, three reads | `cli-pi` | `--thinking high` | 1 | The setup checks |
| 1 | T004 to T008 | the five design documents | `cli-pi` | `--thinking max` | 5, one per file | Each document's check |
| 2 | T009 to T012 | none | the orchestrator | none | 1 | The freeze check and the validator |
<!-- /ANCHOR:external-orchestration -->
