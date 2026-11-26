---
title: "Design: the refusal catalogue of computer exposure"
description: "The refusals this phase adds, which is none, the one existing cause it reuses with its class and exit, the four refusals it must not introduce and why, and the exit codes and registry count it leaves untouched."
trigger_phrases:
  - "computer exposure refusals"
  - "working place refusal"
  - "resume-item-invalid working place"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The refusal catalogue

This phase adds no refusal. That is a decision and not an omission, so this note writes down what the phase reuses, what it must not add and what it leaves untouched. The packet's table is [`contracts/refusals.md`](../../contracts/refusals.md) and its section 3.3 already records this phase as adding none. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.3 Phase 004, computer exposure"]

---

## 1. WHAT THIS PHASE ADDS

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| none | - | - | - | - | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.3 Phase 004, computer exposure"] |

The registry holds 25 causes today and this phase changes neither the count nor an entry. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:122-149]

---

## 2. THE ONE CAUSE IT REUSES

The resumed-prompt check of [`prompt-line.md`](prompt-line.md) section 4 refuses a parked prompt that names another working place. It reuses an existing cause rather than adding one.

| Field | Value |
|-------|-------|
| Cause | `resume-item-invalid` |
| Layer | Run refusal, decided before dispatch |
| Class | `operator` |
| Exit | 4 |
| `REFUSAL_CAUSES` | Already there, unchanged |
| Detail | `the parked prompt names another working place` |
| Source | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:135] |

The cause already covers a parked prompt that does not name the parked tree as its checkout, with the detail `the parked prompt does not name the parked tree as its checkout`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1000] The new detail is the same class of fault on the same prompt, so it takes the same cause and a different detail. A reader who greps the cause finds both.

**Why not a new cause.** A new cause would enter `REFUSAL_CAUSES`, change the registry count, and need a row in the packet's table for a case that is nearly unreachable. The existing cause already means "the parked prompt cannot be dispatched as it stands", which is exactly this.

---

## 3. THE FOUR REFUSALS THIS PHASE MUST NOT ADD

Each of these is a plausible thing for a builder to write and each one is wrong.

| Tempting refusal | Why it is wrong |
|------------------|-----------------|
| `branch-unreadable`, for a git read that failed | D2 and NFR-R01. A null branch is a legal record value, so a failed read costs one row part and never a run. A refusal here would stop every run in a detached checkout |
| `working-place-missing`, for a caller that passed no working place | The builder's absent case is a legal input for a test, and no production caller passes none. A refusal would make the builder unusable by the suites that assert the other blocks |
| `status-branch-invalid`, for a summary whose branch is not a string | The read coalescing rule of [`records.md`](records.md) section 2.1 reads any non-string as null. A refusal would make one hand-edited index row unreadable and take the whole report with it |
| `working-place-stale`, for a parked prompt that names another place | The existing `resume-item-invalid` already covers it, and a second cause for one fault splits the registry |

---

## 4. THE EXIT CODES IT LEAVES UNTOUCHED

| Code | Name | This phase's relation to it |
|------|------|-----------------------------|
| 0 | `completed` | A run that dispatches with a null branch still exits 0. A status read over an old index exits 0 |
| 1 | `runFailure` | Unchanged. A status index that cannot be opened still exits 1, as it does today |
| 2 | `usage` | Unchanged. This phase adds no option and no argument |
| 3 | `recursionGuard` | Unchanged |
| 4 | `refused` | The reused `resume-item-invalid` exits 4, which is what it already does |
| 5 | `awaitingDecision` | Unchanged |

The six codes are the runner's own and the CLI returns them. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "1. EXIT CODES THAT EXIST TODAY"]

---

## 5. THE POST-RUN CAUSES IT LEAVES UNTOUCHED

This phase records no post-run cause. `postRunCauses` stays `[]` on every run it touches, because the child already ran and nothing this phase writes is a finding about the child. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "4. RUN RECORD ADDITIONS", row `postRunCauses`]

---

## 6. THE CHECKER

`bot-check.cjs` gains no invariant. The working place is a run-time fact and not a definition shape, so there is nothing for the checker to audit before a run. A definition that declares no isolation still gets a working-place line, and a definition that declares `worktree` still gets one. Neither is a defect.

---

## 7. THE TESTS THIS NOTE GIVES

| Test | File | What it asserts |
|------|------|-----------------|
| A refusal before the isolation step | `tests/runner.vitest.ts` | `evidence.branch` and `evidence.worktreePath` are both null |
| A refusal at the isolation step | `tests/isolation.vitest.ts` | The kept tree's path and branch are recorded, which is today's behavior and stays |
| A parked prompt that names another place | `tests/runner.vitest.ts` | The run is refused `resume-item-invalid` with the new detail and no child starts |
| A git read that fails | `tests/isolation.vitest.ts` | The run dispatches, the record's branch is null and no refusal is written |
| The registry | `tests/runner.vitest.ts` | `REFUSAL_CAUSES` holds the same keys before and after the phase |
