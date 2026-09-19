---
title: "ORCA-007 -- Terminal receipts and replay"
description: "This scenario validates terminal receipt stages, retry-request replay and the unverifiable bulk-close outcome on an authorized disposable terminal."
stage: mutation
version: 0.1.0.0
---

# ORCA-007 -- Terminal receipts and replay

## 1. OVERVIEW

This scenario exercises terminal input receipts on an authorized disposable terminal: `input_accepted` versus `turn_started`, `--wait-submit` observation, retry-request replay after an ambiguous failure and the `unverifiable` bulk-close outcome.

### Why This Matters

An accepted input is not a started turn and a timeout from `--wait-submit` is not permission to resend. Treating an unproven state as success is the exact claim this packet must never make.

---

## 2. SCENARIO CONTRACT

- Feature ID: `ORCA-007`
- Feature Name: Verify terminal receipts, retry and unverifiable close
- Scenario Objective: On an authorized disposable terminal, send one tracked prompt, distinguish the receipt stages, replay via the reported retry request on an ambiguous failure and observe the bulk-close outcome without claiming unproven exits.
- Exact Prompt: `Send one tracked prompt to a disposable Orca terminal, record each receipt stage and if delivery is ambiguous replay with the reported retry request. Do not claim exits the host did not confirm.`
- Exact Command Sequence: `1. bash: orca terminal send --terminal <handle> --text "..." --enter --json -> 2. bash: orca terminal send ... --wait-submit 10 --json -> 3. bash: retry-request replay of the exact command if a transport failure occurs -> 4. bash: orca terminal close (specific or bulk per the guide, --json)`
- Expected Signals: `input_accepted` is reported separately from `turn_started`; `--wait-submit` observes the same accepted request; replay uses the reported retry request rather than a new prompt; a bulk close that cannot confirm every PTY is recorded as `unverifiable`.
- Evidence: Every receipt stage with exit statuses, the retry request id used and the close outcome exactly as the host reported it.
- Pass/Fail Criteria: PASS only with an authorized disposable terminal and receipts preserved; SKIP by default without one (blocker: missing authorized terminal); FAIL on a resend of an untracked prompt, a disguised `unverifiable` or a claimed exit without a receipt.
- Failure Triage: 1. Re-read the receipt stages. 2. Replay only with the exact command and reported retry request. 3. Preserve `unverifiable` as the outcome and do not retry on another host.

---

## 3. TEST EXECUTION

### Prerequisites

An authorized disposable Orca terminal with a connected runtime. Receipt semantics come from the loaded guide.

### Prompt

`Send one tracked prompt to a disposable Orca terminal, record each receipt stage and if delivery is ambiguous replay with the reported retry request. Do not claim exits the host did not confirm.`

### Commands

1. `orca terminal send --terminal <handle> --text "..." --enter --json`
2. `orca terminal send --terminal <handle> --text "..." --enter --wait-submit 10 --json`
3. Retry-request replay of the exact command if a transport failure occurs.
4. `orca terminal close` specific or bulk per the guide.

### Expected

Receipt stages are distinguishable, replay follows the reported retry request and the close outcome is recorded exactly as the host reported it.

### Evidence

Receipt stages, exit statuses, retry request id, close outcome.

### Pass / Fail

- **Pass:** receipts preserved on an authorized terminal with correct replay semantics.
- **Skip:** no authorized disposable terminal.
- **Fail:** untracked resend, disguised `unverifiable` or an unproven exit claim.

### Failure Triage

1. Re-read the receipt stages before any further action.
2. Replay only the exact command with the reported retry request.
3. Preserve `unverifiable` and do not retry on another host.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-007 | Terminal receipts and replay | Distinguish receipt stages, replay correctly, record unverifiable close | `Send one tracked prompt to a disposable Orca terminal, record each receipt stage and if delivery is ambiguous replay with the reported retry request. Do not claim exits the host did not confirm.` | send -> wait-submit -> retry replay -> close | `input_accepted` distinct from `turn_started`; replay uses retry request; `unverifiable` preserved | Receipt stages, exit statuses, retry id, close outcome | PASS with authorized terminal plus preserved receipts; SKIP by default; FAIL on untracked resend or unproven exit | Re-read receipts, exact replay, preserve unverifiable |

---

## 4. SOURCE FILES

### Playbook Sources

| Source | Location |
|---|---|
| Packet runtime contract | `SKILL.md` |
| Receipt contract | `references/session-and-runtime.md` Section 6 |

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: `ORCA-007`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `mutation/terminal-receipt-recovery.md`
