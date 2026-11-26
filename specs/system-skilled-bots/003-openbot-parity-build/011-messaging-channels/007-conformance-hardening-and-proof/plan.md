---
title: "Implementation Plan: Phase 7: conformance-hardening-and-proof"
description: "A capability-matrix driver and one conformance file over all five transports, then the notices, the operator reference and the catalog lines, then the whole-phase gate."
trigger_phrases:
  - "channel conformance plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: conformance-hardening-and-proof

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript tests and Markdown |
| **Framework** | vitest |
| **Storage** | None beyond the temporary state root of each test |
| **Testing** | One conformance file over the fake transport and the capability matrix |

### Overview
The driver reads each transport's declared column and builds one case per operation: an undeclared one runs R1 and R2, a declared one runs R3, R4 and R5. Each transport runs behind the fake platform, which records every wire call with its operation, channel, conversation and idempotency key. The three hardening cases use the same fake. The documents are written last, from the runbook and the finished modules.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The five transport modules exist: `ls .skilled/skills/system-skilled-bots/runtime/lib/channel-{telegram,slack,signal,whatsapp,terminal}.ts` lists five
- [ ] The whole suite prints a `Test Files` line with no `failed` count

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The whole suite and the typecheck pass from the final state
- [ ] `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Table-driven conformance: the matrix is the input, and a case exists for every cell.

### Key Components
- **The driver in `tests/channel-support.ts`**: iterates `capabilities.md` section 2 and returns one case per transport and operation.
- **`tests/channel-conformance.vitest.ts`**: the 25 rule cases and the three hardening cases.
- **The operator documents**: the reference, the README rows, two skill lines and the catalog entry.

### Data Flow
The driver yields `telegram buttons`, declared. The case builds an outbound intent with one idempotency key, calls `send` on the Telegram transport over the fake platform and asserts R3, R4 and R5 on the receipt and the wire log. `signal buttons` is undeclared, so its case asserts R1 and R2.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup confirms the five transports and reads the reference checker. Implementation writes the driver and the conformance file, then the documents. Verification runs the conformance file, the suite, the typecheck, the document checks and the recursive validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Conformance | 25 cases over the matrix | `npx vitest run tests/channel-conformance.vitest.ts`, and `-t "^R2 "` prints `Tests  18 passed` for the 18 undeclared |
| Hardening | The mismatched sender id, the withheld secret, the chunked send | `-t "^hardening "` prints `Tests  3 passed` |
| Documents | The reference names every derived secret name the runbook names | `tasks.md` T011 |
| Packet | All eight folders validate | `validate.sh --strict --recursive` on the parent |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Children 003 to 006 | Internal | Planned | Nothing to prove |
| Phase 001's `THIRD_PARTY_NOTICES.md` | Internal | Yellow | T008 is `[B]` until the file exists |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a document misleads an operator.
- **Procedure**: revert this child's commit. No runtime behavior changes, because this child edits no module.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Children 003 to 006 | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The parent's closure and phase 012 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

The executor roster, the effort policy, the fallback ladder, the dispatch rules and the self-invocation guards are `../003-link-roster-and-answer-gate/plan.md` section 8. This child adds one wave table.

| Wave | Task ids | Files | Executor | Effort | Workers | Verify |
|------|----------|-------|----------|--------|---------|--------|
| 0 | T001 to T003 | none, reads | `cli-pi` | `--thinking high` | 1 | The setup checks |
| 1 | T004, T005 | `tests/channel-support.ts`, `tests/channel-conformance.vitest.ts` | `cli-pi` | `--thinking max` | 1, because the file imports the driver | T005 |
| 2 | T006 to T010 | the seven document files | `cli-pi` | `--thinking high` | 4: the notices, the reference, the README and skill lines, the catalog | Each task's check |
| 3 | T011 to T016 | none | the orchestrator | none | 1 | T011 to T016 |
<!-- /ANCHOR:external-orchestration -->
