---
title: "Contract: refusals and exit codes for the parity build"
description: "Every refusal the fourteen phases add with its phase, layer, failure class, exit code and whether it enters the runner's typed registry, plus every exit code the runtime has today."
trigger_phrases:
  - "bots refusal table"
  - "bots exit codes"
  - "refusal causes registry"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Refusals and exit codes

One table of every refusal the packet adds, and one table of the exit codes the runtime already has. A phase that adds, renames or reclasses a refusal edits this file in the same change, per the rule in [README.md](README.md).

Paths in citations are repository-relative. `L/` below means `.skilled/skills/system-skilled-bots/runtime/lib/` and `B/` means `specs/system-skilled-bots/003-openbot-parity-build/`, the same prefixes the plan-depth research uses.

---

## 1. EXIT CODES THAT EXIST TODAY

The runner exports six codes, and the CLI returns them. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:113-120]

| Code | Name in `EXIT_CODES` | Meaning | Who returns it |
|------|----------------------|---------|----------------|
| 0 | `completed` | The run completed, or the verb did what it was asked | `exitCodeFor` for a completed run [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:318-321] and every verb on success |
| 1 | `runFailure` | A dispatched run failed, or the CLI caught a throw | `exitCodeFor` for a failed run [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:326-327] and the top-level catch in the CLI [SOURCE: .skilled/bin/bots.cjs:542-545] |
| 2 | `usage` | The command line itself is wrong: an unknown option, a missing value, a malformed request shape | `usageExit` prints `bots: <message>` then the usage text [SOURCE: .skilled/bin/bots.cjs:94-98], and the enqueue verb maps request-shape reasons to 2 [SOURCE: .skilled/bin/bots.cjs:200-206] [SOURCE: .skilled/bin/bots.cjs:252] |
| 3 | `recursionGuard` | A failed run whose runner exit was the recursion guard | `exitCodeFor` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:327] |
| 4 | `refused` | A run refused before dispatch, or a verb whose runtime call returned a refusal | `exitCodeFor` for a refused run [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:322-323] and `describeRefusal` callers such as the answer verb [SOURCE: .skilled/bin/bots.cjs:208-214] [SOURCE: .skilled/bin/bots.cjs:292-297] |
| 5 | `awaitingDecision` | The run parked a needs-you item and exited | `exitCodeFor` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:324-325] |

The definition checker keeps its own codes: 0 when every invariant passes, 1 when any `FAIL:` line printed and 2 when it stopped before auditing. [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:118] [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:168] A checker invariant below therefore exits 1.

The answer verb's own returns, line by line, are drawn in the screen's answer contract and are not copied here: [state-machines.md section 4.2](../003-terminal-screen/005-answer-flow/design/state-machines.md). Every refusal from `answerItem` exits 4 there, and that rule binds the rows below that reach the answer verb.

---

## 2. LAYERS AND THE EXIT RULE

| Layer | Where it is decided | How it surfaces | Exit | Enters `REFUSAL_CAUSES` |
|-------|---------------------|-----------------|------|-------------------------|
| Definition parse | `parseDefinition` and the parsers it calls | At run time as the run refusal `definition-malformed` with the parse reason as its detail [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:125] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:789], and in the checker as `definition.<reason>` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, REQ-005] | 4 at run time, 1 in the checker | No. The parse reason is a detail of `definition-malformed` |
| Checker invariant | `bot-check.cjs` | One `FAIL: <id>: <message>` line [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:110-113] | 1 | No |
| Run refusal | `runBot` before dispatch | A run record whose exit names the cause, and no child started | 4 | Yes |
| Verb refusal | `bots.cjs` or the runtime call a verb makes | `bots: <reason>` or `bots: <reason>: <detail>` on stderr [SOURCE: .skilled/bin/bots.cjs:208-214] | 2 when `bots.cjs` refuses before any runtime call, 4 when a runtime `Result` refused | No |
| Post-run cause | `runBot` after the child exited | A named cause on the run record. The run's own outcome and exit stand | The run's own exit | No |

A refusal's detail is a fixed phrase that may carry a name, a path, a count, an exit code or an errno code. It is never captured program output, because another program's output can echo part of a secret. 008's phrases are `008-vault/design/backends.md` section 6. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/backends.md, section "2.3 The line bound"]

The exit rule for a verb refusal is the one the CLI already follows: the parser and any check `bots.cjs` makes on its own input exit 2, and a refusal that comes back from a runtime call exits 4. A new verb follows the same rule unless its row below says otherwise and gives the reason.

---

## 3. REFUSALS THE PACKET ADDS

Class is the failure class the run record carries, one of `author`, `operator`, `environment`, `hub` or `budget`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:50] A dash means the layer carries no class. `null` means a run refusal whose class is null, as `disabled` and `lease-held` are today. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:130] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:136]

### 3.1 Phase 001, activity and actor

| Name or message | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|-----------------|-------|-------|------|------------------|--------|
| `bots: --as needs a tty` | Verb refusal (`answer`, `run`) | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, SC-004] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, section "L2: EDGE CASES"] |
| `bots: --as takes a name` | Verb refusal | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, section "L2: EDGE CASES"] |
| `bots: option --as needs a value` | Verb refusal | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, section "L2: EDGE CASES"] |
| `grant-scope-unsupported` | Verb refusal (`answer`) | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-010] |
| `bots: --scope takes once or deny` | Verb refusal (`answer`) | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-010] |
| `bots: <reason>` for an index that cannot be opened | Verb refusal (`activity`) | - | 1 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, section "L2: EDGE CASES"] |
| `bots: --full-access needs a tty` | Verb refusal (`schedule install`), checked before the installer is called | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/design/refusals.md, section "1. THE ROWS"], R6 |
| `bots: activity takes no id` | Verb refusal (`activity`), a positional after the verb | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/design/refusals.md, section "1. THE ROWS"], R7 |
| `bots: activity takes no --<option>` | Verb refusal (`activity`), any option but `--json`, `--repo` and `--skilled-tree` | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/design/refusals.md, section "1. THE ROWS"], R8 |
| `child-write-refused` | Verb refusal (`answer`, `enable`, `remember`, `secret set`, `channel link`, `channel roster`), a bot child's run marker is in the environment | - | 2 | No | Named here, see [answer-seam.md](answer-seam.md) step 1 |

The last two rows are the parser's existing messages for any verb, so they need only the verb's row in `VERB_SPECS` and no new code. The `activity` index failure keeps exit 1 because `bots status` already uses 1 for an index failure and the phase matches it on purpose. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, section "L2: EDGE CASES"]

`child-write-refused` is the one bar that separates a bot child from the operator. A child runs as the same OS user, so the roster cannot tell the two apart, and the run marker can. It is a bar and not an authentication: a child that clears the marker is not stopped by it. The marker is `SKILLED_BOT_RUN_ID`, which `dispatch.ts` sets, or `AI_SESSION_CHILD=1`. 001 lands the check in `bots.cjs` for the verbs it has, and each later phase adds its own write verb to the same list.

### 3.2 Phase 002, routine layer

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `routine-trigger-conflict` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-002] |
| `routine-tell-with-targets` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-003] |
| `routine-starts-empty` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-008] |
| `routine-starts-multiple-cron` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-009] |
| `routine-starts-cron-not-first` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-009] |
| `routine-starts-multiple` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-009] |
| `routine-until-check-without-outcome` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-011] |
| `routine-until-shell-metacharacters` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-011] |
| `routine-floor-15-minutes` | Checker invariant, and an install refusal | - | 1 checker, 4 `bots install` | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-005] |
| `routine-fatigued` | Run refusal | `null` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, section "Files to Change"] |
| `routine-completed` | Run refusal | `null` | 4 | Yes | Decided here, see section 5 |

### 3.2.1 Phase 003, terminal screen

Numbered 3.2.1 rather than 3.3 so the sections after it keep the numbers the phase documents cite.

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `ui-unavailable` | Verb refusal (`ui`), the Skilled tree holds no `.skilled/crates/bots-tui` | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md, REQ-001] |
| `ui-not-built` | Verb refusal (`ui`), the crate is present and the binary is not | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md, REQ-001] |
| `ui-contract-mismatch` | Verb refusal (`ui`), the binary's contract number differs from the verb's | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md, REQ-001] |

All three exit 4 rather than the 2 the layer rule gives a `bots.cjs` refusal, and the reason is the layer's own: the command line is valid and the failure is the environment's, which is the class exit 4 already carries for a verb whose runtime call refused. Each prints one line in the `bots: <reason>: <detail>` form, and the detail names the path or the two contract numbers.

### 3.3 Phase 004, computer exposure

Phase 004 adds no refusal. Its requirements add a prompt line and two record fields. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md, REQ-001 and REQ-002 and REQ-003 and REQ-004 and REQ-005 and REQ-006, section "P0 - Blockers (MUST complete)"]

### 3.4 Phase 005, memory

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `memory-full` | Verb refusal (`remember`, `answer confirm`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-003] |
| `memory-entry-too-long` | Verb refusal (`remember`), checked in `bots.cjs` on its argument | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-003] |
| `memory-entry-unknown` | Verb refusal (`remember --forget`) | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-005] |
| `memory-invalid` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-010] |
| `memory-secret` | Verb refusal (`remember`, `answer confirm`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-011] |
| `memory-proposal-secret` | Post-run cause | - | The run's own, 0 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-011] |
| `remember-type-invalid` | Post-run cause | - | The run's own, 0 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, section "10. OPEN QUESTIONS"] |
| `review-answer-invalid` | Verb refusal (`answer` on a `memory-proposal` item, text other than `confirm` or `reject`) | - | 4 | No | Named here, see section 5 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-008] |
| `bot-id-invalid` | Verb refusal (`remember --bot`) | - | 2 | No | Named here, see section 5 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-012] |
| `prompt-over-budget` | Run refusal | `author` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-015] |
| `body-secret` for a memory file | Run refusal, existing cause | `author` | 4 | Already there [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:141] | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-011] |

The prompt budget and its overflow rule are in [prompt-sections.md](prompt-sections.md).

### 3.5 Phase 006, approval grants

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `answer-not-approver` | Verb refusal (`answer`, `enable`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, section "In Scope"] |
| `item-answered-differently` for a second answer with the same text and another scope, and for the loser of a race | Verb refusal (`answer`), existing reason | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, REQ-013 and REQ-014] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:84-86] |
| `item-busy` | Verb refusal (`answer`), the item lock is held by a live process past the wait | - | 4 | No | Named here, see [answer-seam.md](answer-seam.md) step 6 |
| `action-kind-invalid` | Run failure reason after dispatch, for a run that parked a question with an `[ACTION: <kind>]` line naming no known kind | - | 1, the run is failed with class `author` | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, REQ-012] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, section "L2: EDGE CASES"] |
| `grant-kind-unknown` | Verb refusal, reserved. No rule store lands in this packet, so nothing can raise it yet | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, REQ-006] |

`answer-not-approver` is named in 006's scope and built by 011, which lands the roster the check reads. Its row is section 3.10, because a row belongs to the phase that adds the refusal.

### 3.6 Phase 007, per-bot apps

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `apps-invalid` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md, REQ-001] |
| `apps-unknown-server` | Checker invariant, failing closed | - | 1 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md, REQ-002] |
| `apps-refused` | Run refusal | `author` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md, REQ-007] |
| `apps-unenforceable` | Run refusal | `author` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md, REQ-005] |
| `utcp-config-missing`, `utcp-config-invalid` | Detail of `apps-refused` | `author` | 4 | No, they are details | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md, section "6. RISKS & DEPENDENCIES"] |

### 3.7 Phase 008, vault

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `secret-no-input` | Verb refusal (`secret set`), in `bots.cjs` | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, REQ-001] |
| `secret-empty` | Verb refusal (`secret set`) | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, REQ-010] |
| `secret-too-long` | Verb refusal (`secret set`), on the value read | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, section "8. EDGE CASES"] |
| `secret-write-dropped` | Verb refusal (`secret set`), the read-back found no value | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, REQ-011] |
| `secret-name-invalid` | Definition parse, and a verb refusal on `secret set` | - | 4 run, 1 checker, 2 verb | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, REQ-005] |
| `secret-unknown` | Run refusal | `operator` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, REQ-006] |
| `secret-store-unreadable` | Run refusal, and a verb refusal on `secret set`, `secret list`, `secret forget` and `answer`, each printing `bots: secret-store-unreadable: <detail>` | `environment` on a run | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, REQ-017] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/leak-checks.md, section "2. THE KNOWN-SECRET MAP"] |
| `secret-in-output` | Post-run cause. The line is redacted and the delivery withheld | - | The run's own | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md, REQ-014] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "Shared Records"] |

`secret-in-output` is one cause name for the `stdout.log` scan and for 010's reply scan. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "Shared Records"] It is not a refusal, because the child already ran, so it stays out of `REFUSAL_CAUSES` and the run keeps the exit its outcome gives. Its field on the run record is in [records.md](records.md).

No refusal names a short value. A value under 8 characters is stored, but no literal check matches it, and 008 accepts that residual because a real key is longer [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/threat-model.md, T9]. A later `secret-too-short` would be a new row here and a new check in 008.

### 3.8 Phase 009, skills

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `skills-duplicate` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-008] |
| `skills-name-invalid` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-008] |
| `skills-unknown` | Checker invariant | - | 1 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-007] |
| `skills-too-large` | Checker invariant | - | 1 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-007] |
| `skills-over-budget` | Checker invariant | - | 1 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-007] |
| `skill-unknown` | Run refusal | `author` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-002] |
| `skill-too-large` | Run refusal | `author` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-003] |
| `skills-over-budget` | Run refusal | `author` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-003] |
| `skill-unreadable` | Run refusal | `environment` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, section "Reliability"] |
| `skill-changed` | Run refusal | `operator` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-011] |
| `run-record-missing` | Verb refusal (`skill propose`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md, section "Waves"] |
| `review-already-exists` | Verb refusal (`skill propose`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, section "Reliability"] |
| `proposal-secret` | Verb refusal (`skill propose`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-009] |
| `proposal-hidden-character` | Verb refusal (`skill propose`), the draft holds a hidden direction or zero-width character | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-013] |
| `proposal-stale` | Verb refusal (`answer` on a `skill-proposal` item) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-006] |

The checker names are plural (`skills-unknown`) and the run names singular (`skill-unknown`), as the phase writes them. Both spellings are kept because the checker audits the list and the runner names the one skill. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, section "L2: EDGE CASES"]

### 3.9 Phase 010, conversations

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `bot-unknown` | Verb refusal (`chat`), nothing is appended | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md, REQ-004] |
| `body-secret` for a human message | Run refusal with the existing cause. Nothing is appended | `author` | 4 | Already there | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md, REQ-014] |
| `prompt-over-budget` | Run refusal, 005's cause | `author` | 4 | Yes, one entry | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md, REQ-009] |
| `secret-in-output` on the reply | Post-run cause, 008's name | - | The run's own | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md, REQ-014] |

### 3.10 Phase 011, messaging channels

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `channel-unlinked` | Inbound refusal. The message reaches no bot. From the CLI it is reachable only in tests | - | 4 where a verb returns it | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md, REQ-003] |
| `channel-locked` | Inbound refusal, with the seconds remaining | - | 4 where a verb returns it | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md, REQ-004] |
| `channel-roster-missing` | Verb refusal (`channel link`, `channel roster add --role member`) and an answer refusal on the `channel` surface | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md, REQ-003] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md, REQ-005] |
| `channel-roster-owner` | Verb refusal (`channel roster remove`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md, REQ-020] |
| `channel-group-approval` | Inbound answer refusal for a group chat | - | 4 where a verb returns it | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md, REQ-006] |
| `channel-signature` | Inbound refusal on the WhatsApp webhook before any parse | - | None, the webhook answers the HTTP request | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/spec.md, REQ-012] |
| `channel-daemon-unreachable` | Send refusal on the Signal transport. The queue keeps the entry | - | 4 on `channel send`. `channel drain` exits 1 while any due entry is still queued or failed | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/spec.md, section "6. RISKS & DEPENDENCIES"] |
| `channel-listening` | Verb refusal (`channel listen`), the per-channel lease is held | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md, REQ-024] |
| `bots: <channel> rejected the credential`, no refusal name | Failure line of `channel listen` when the provider rejects the credential on the start probe, as a `401` from Telegram's `getMe`. The lease is released | - | 1 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md, REQ-024 and REQ-025] |
| `unsupported` | The adapter result for an undeclared operation, `retryable: false` | - | Not a CLI exit | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md, REQ-001] |
| `answer-not-approver`, `item-expired` on a press | Answer refusals, existing names | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md, REQ-005] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md, REQ-006] |

A rejected credential exits 1 and carries no name, as 011 chose. The secret resolved, so it is not `secret-unknown`, and the provider's answer is a runtime failure the operator fixes by storing a new value, not a refusal the runtime decides. Exit 1 is also what 011's transport children specify, so the contract and 011 agree. A later name would be a new row here and a new exit for 011.

**The drain's exit.** `channel drain` walks every due entry once. It exits 0 when every due entry reached a terminal state, 1 when any due entry is still `queued` or `failed` after the pass, and 4 only when the verb refuses before it walks the queue, such as a channel name it does not know. `channel send` exits 4 on a refusal and 1 on a send failure. This is the rule `bots drain` already follows, where a stopped drain exits 1 and a completed one exits 0. 005 REQ-024 names who runs the pass: `listen` runs it for its own channel after each inbound turn and on a fixed tick, and `bots channel drain` runs it once by hand.

`channel-unsupported` is not new. It is the evidence a delivery entry on an unknown channel already records today, and it returns for a channel target if 011 is reverted. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:142] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/plan.md, section "7. ROLLBACK PLAN"]

### 3.11 Phases 012 to 014

These phases test, align and review. They add no refusal.

---

## 4. THE REGISTRY AFTER THE PACKET

`REFUSAL_CAUSES` today holds 25 causes. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:122-149] The packet adds the twelve below and removes none, so the registry ends at 37.

| Cause | Phase | Class |
|-------|-------|-------|
| `routine-fatigued` | 002 | `null` |
| `routine-completed` | 002 | `null` |
| `prompt-over-budget` | 005 | `author` |
| `apps-refused` | 007 | `author` |
| `apps-unenforceable` | 007 | `author` |
| `secret-unknown` | 008 | `operator` |
| `secret-store-unreadable` | 008 | `environment` |
| `skill-unknown` | 009 | `author` |
| `skill-too-large` | 009 | `author` |
| `skills-over-budget` | 009 | `author` |
| `skill-unreadable` | 009 | `environment` |
| `skill-changed` | 009 | `operator` |

Every entry keeps the shape `{ reason, class }` the registry already types. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:149]

---

## 5. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| `routine-fatigued` is decided at the `disabled` check: when the `disabled` switch is set and the routine state file records `fatiguedAt`, the run is refused `routine-fatigued` instead of `disabled` | Fatigue sets the `disabled` switch, and the `disabled` check refuses before anything else could name fatigue [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:822-823] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-006]. Without this the name 002 requires can never be recorded |
| The `completed` switch refuses as `routine-completed`, class `null`, checked beside `disabled` | 002 adds the switch and reads it before the lease but names no cause for it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md, section "Key Components"] |
| Definition parse names are details of `definition-malformed`, never registry entries | The runner already folds every parse refusal into that one cause [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:789] |
| `memory-full` exits 4, not 1 | Exit 1 means a run failure or a caught throw [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:115] [SOURCE: .skilled/bin/bots.cjs:542-545], and the screen classes exit 1 as a throw. A full file is a runtime refusal |
| `memory-entry-too-long` exits 2 | The length is checked on the argument before any file is read, which is the usage layer |
| `memory-entry-unknown` keeps the phase's exit 2 | A new verb may treat an entry id that names nothing as a bad argument. It does not reach the answer verb |
| A non-`confirm` answer on a memory proposal is refused `review-answer-invalid` with exit 4 | Every `answerItem` refusal exits 4 and the screen depends on it [SOURCE: .skilled/bin/bots.cjs:292-297]. The phase names no reason and says exit 2 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-008] |
| An unsafe `--bot` id on `remember` is `bot-id-invalid`, exit 2 | The phase says "refused by name" and names none [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-012] |
| `memory-proposal-secret` and `remember-type-invalid` are post-run causes: the run stays `completed`, no item is written and the cause is recorded on the run record beside `secret-in-output` | The child already ran, and 005 ends a proposing run `completed` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md, REQ-007] |
| `action-kind-invalid` ends the run failed with class `author`, exit 1 | The item is not written [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, section "L2: EDGE CASES"], so the run cannot park. The bot author wrote the bad line |
| `item-busy` is a new answer refusal, exit 4 | The lock that [answer-seam.md](answer-seam.md) takes needs a name for a holder that is still alive |
| `secret-too-long` exits 2 and `secret-write-dropped` exits 4 | The first is a check on input read before any store is touched. The second is a runtime finding after a write |
| `secret-unknown` is class `operator`, `secret-store-unreadable` is `environment` | The operator sets the missing name. A folder that cannot be read is the host's |
| `skill-changed` is class `operator` | The operator reinstalls to record the new digest |
| `channel-signature` has no CLI exit | It is answered inside the webhook handler before any verb sees the body |
