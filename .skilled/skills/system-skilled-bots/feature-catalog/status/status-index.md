---
title: "Status index"
description: "Keeps a derived SQLite index of run records and needs-you items under the user-level state root that a rebuild can always restore."
trigger_phrases:
  - "status index"
  - "bots status rebuild"
  - "bot run retention"
  - "status index sqlite"
version: 1.0.0.0
---

# Status index (bots status --rebuild)

## 1. OVERVIEW

Keeps a derived SQLite index of run records and needs-you items under the user-level state root that a rebuild can always restore.

`bots status` must answer without opening a run folder and must say when its answer is old. The index is built only from the run records, the needs-you items and the retired identities in the registered-roots file, so it holds nothing a rebuild cannot restore.

---

## 2. HOW IT WORKS

A run row is written once and never updated, because a summary that can change after the run ended cannot be trusted as history. What does change after a run (its delivery outcome and an item's answer) lives in tables of its own. The index records the generation stamp it last read per identity, so status can tell when records changed since the last build and point to `bots status --rebuild`. The file is owner-only and opened with a busy timeout.

Retention is a count bound per identity and per bot, read from the repository config, and it is applied the same way on every write and every rebuild, so a rebuild lands on the same rows. Applying it deletes run folders and closed needs-you item files past their bounds. A build plans its deletions and carries them out only after the new file is in place, so a build that fails deletes nothing.

`bots status --rebuild` rebuilds the index from the run records first. `bots status --unregister <owner/name>` writes a retired identity into the registered-roots file, which hides its rows and deletes nothing, and `--all` shows them again. Both write, so the status mode names them for the operator instead of running them.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Shared | Index open, run and item rows, generation tracking, retention planning and pruning |
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | Shared | The rebuild and unregister entry points |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts` | Vitest | Opening, building, rebuilding and retention of the index |
| `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` | Reference | Which status flags write and are left to the operator |

---

## 4. SOURCE METADATA

- Group: Status
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `status/status-index.md`

Related references:
- [status-and-inbox-report.md](status-and-inbox-report.md) - the report read from this index
- [../runs/run-record-and-result-ledger.md](../runs/run-record-and-result-ledger.md) - the records the index is built from
