---
title: "Run record and result ledger"
description: "Writes one run record per run under the user-level state root and one idempotent result event through the deep-loop append gateway."
trigger_phrases:
  - "run record and result ledger"
  - "bot run record"
  - "awaiting-decision exit"
  - "run result event"
version: 1.0.0.0
---

# Run record and result ledger

## 1. OVERVIEW

Writes one run record per run under the user-level state root and one idempotent result event through the deep-loop append gateway.

The run record is the join every later surface reads: the queue links a request to its run through it, delivery appends to it and the status index is built from it. It lives outside the run folder, so losing a run folder to a re-pin or a reinstall never loses the record.

---

## 2. HOW IT WORKS

A record carries the bot and repository identity, the request it answers, a dispatch summary, the budget, the honored posture, the exit with its reason and failure class, the evidence locations, any worktree evidence and the delivery entries. Its strings reuse the existing stop, failure and delivery vocabularies. Failure classes are `author`, `operator`, `environment`, `hub` and `budget`. The one value it adds is `awaiting-decision`, a terminal exit for a run that parked a question. Every record write advances the identity's generation stamp.

Each run ends on exactly one result event of type `skilled-bots.run.result-recorded`, written through the deep-loop mode append gateway rather than appended by hand. The gateway validates the event, authorizes it under the bots policy, admits it by an authority record under the user-level state root and stores it under an idempotency key derived from the run id. A failed write is retried by re-sending the same event, so a re-sent event is stored once and the run is never dispatched a second time. A run whose result event cannot be recorded fails with one record and no lease left behind.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Shared | Record shape, vocabularies, validation and write |
| `.skilled/skills/system-skilled-bots/runtime/lib/result-ledger.ts` | Shared | The bots registration with the append gateway and the bounded re-send |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/run-record.vitest.ts` | Vitest | Record shape, the awaiting-decision exit and worktree evidence |
| `.skilled/skills/system-skilled-bots/runtime/tests/result-ledger.vitest.ts` | Vitest | Event registration, idempotent storage and re-send |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Vitest | A re-sent result event is stored once with no second dispatch |

---

## 4. SOURCE METADATA

- Group: Runs
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `runs/run-record-and-result-ledger.md`

Related references:
- [bot-runner.md](bot-runner.md) - the runner that writes the record and the event
- [../status/status-index.md](../status/status-index.md) - the index built from these records
