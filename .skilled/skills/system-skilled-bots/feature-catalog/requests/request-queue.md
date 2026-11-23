---
title: "Request queue"
description: "Queues run requests as files under the user-level state root, where each state change is one rename and a re-sent event is stored once."
trigger_phrases:
  - "request queue"
  - "bots enqueue"
  - "enqueue a bot run"
  - "bot request dedupe"
version: 1.0.0.0
---

# Request queue (bots enqueue)

## 1. OVERVIEW

Queues run requests as files under the user-level state root, where each state change is one rename and a re-sent event is stored once.

Every producer (a typed enqueue, an answered needs-you item and a commit) writes the same request record, so the drain reads one shape and dedupe works the same way for all of them. `bots enqueue <id> --source <name> (--event-id <id> | --key <key>)` is the operator's entry point.

---

## 2. HOW IT WORKS

A request is a `run` or a `resume`. Its idempotency key comes from the event source and that source's own event id, or from a key the caller supplies. It is never a hash of the body, because a producer that re-sends one event with a changed payload must still land on the same key. The request id is derived from the bot and the key, so a re-sent event names the request that is already queued. Each request records its target repository identity and checkout path.

The queue lives under the identity's request folder in sibling folders: `inbox`, `tmp`, `claimed`, `done`, `quarantine` and `seen`. Every state change is one rename between siblings on one filesystem, so a request is in exactly one folder and only one consumer can win a claim. Temp files are written in `tmp/`, so the watched inbox holds only complete requests, because a launchd queue agent keeps firing while anything sits there.

A seen-key marker, created exclusively, makes a re-sent event a duplicate instead of a second run. A crash after the marker and before the rename loses the event rather than running it twice. Enqueue refuses while the repository identity is unknown, before it writes anything.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/request-record.ts` | Shared | Request shape, idempotency key and request id |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts` | Shared | Enqueue, seen markers, claim, finish, retry and quarantine renames |
| `.skilled/bin/bots.cjs` | Handler | The `enqueue` verb |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/request-record.vitest.ts` | Vitest | Request record shape and key derivation |
| `.skilled/skills/system-skilled-bots/runtime/tests/request-queue.vitest.ts` | Vitest | Folder layout and rename transitions |
| `.skilled/skills/system-skilled-bots/runtime/tests/dedupe.vitest.ts` | Vitest | A re-sent event is stored once |
| `.skilled/skills/system-skilled-bots/runtime/tests/identity-refusal.vitest.ts` | Vitest | Enqueue refuses an unknown identity |

---

## 4. SOURCE METADATA

- Group: Requests
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `requests/request-queue.md`

Related references:
- [queue-drain.md](queue-drain.md) - the pass that claims and runs queued requests
- [commit-triggered-requests.md](commit-triggered-requests.md) - the commit producer that writes into this queue
