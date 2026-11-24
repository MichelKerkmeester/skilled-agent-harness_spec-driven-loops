---
title: "Bot Status and Inbox"
description: "How to read installed bots, last runs, deliveries and the needs-you inbox through the bots CLI, and which status flags only the operator runs."
trigger_phrases:
  - "bot status"
  - "bot inbox"
  - "which bots are installed"
importance_tier: normal
contextType: reference
version: 1.0.1.0
---

# Bot Status and Inbox

`bots status` and `bots inbox` answer what the bots did and what they need. This reference names both verbs and their flags.

---

## 1. OVERVIEW

### Purpose

Give the status mode the two read verbs and the flags that change what they show, so a status answer never needs a write.

### When to Use

- Listing installed bots, their last run and its delivery.
- Reading open and expired needs-you items.
- Naming the rebuild step when the status index looks stale.

---

## 2. VERBS

| Command | Shows | Run by the status mode |
|---------|-------|------------------------|
| `bots status` | Every installed bot, its last run and delivery, and open needs-you items, read from the status index | Yes |
| `bots status --json` | The same rows as JSON | Yes |
| `bots inbox` | Open and expired needs-you items | Yes |
| `bots status --rebuild` | Rebuilds the index from the run records first | No: it writes, so name it for the operator |
| `bots status --all` | Also shows identities hidden with `--unregister` | Yes, read only |

Each verb takes `--repo <path>` for the consumer checkout. A row can also report a missing checkout, a changed runner path that needs a reinstall, or a run folder that vanished.

---

## 3. BOUNDARY

Status only reads the consumer checkout. `--rebuild` rewrites the status index under the user-level state root, and `--unregister <owner/name>` hides an identity's rows and deletes nothing. Neither flag is run from the status mode. Answering an inbox item is a run action: use `bots answer` through the run mode.
