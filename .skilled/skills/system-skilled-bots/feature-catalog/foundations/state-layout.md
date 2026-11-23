---
title: "State layout"
description: "Keeps everything a run must not write under a user-level state root outside every checkout, and run evidence in the Skilled tree's gitignored state folder."
trigger_phrases:
  - "state layout"
  - "bots state root"
  - "user-level state root"
  - "bot run folder"
version: 1.0.0.0
---

# State layout

## 1. OVERVIEW

Keeps everything a run must not write under a user-level state root outside every checkout, and run evidence in the Skilled tree's gitignored state folder.

A bot run may write its checkout, so a stop switch or a needs-you item kept in that checkout would be one the run could clear. The layout puts every control file where no run can reach it, and every caller takes its paths from one module so no path is joined by hand.

---

## 2. HOW IT WORKS

The user-level state root is `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots`, or the absolute `stateRoot` the repository config names. An installed job pins the root it was installed under in `SKILLED_BOTS_STATE_ROOT`, and that absolute path outranks the config, so a run that edits `bots/config.json` cannot point the next fire's switches, holds and leases somewhere empty. Under the root each repository identity gets its own folders for requests, leases, switches, needs-you items, run records, install records, definition approvals under `approvals/`, dispatch receipts, per-schedule fire records and the drain backoff. The status index and the registered-roots file sit at the top of the state root and span every identity. Folders are created owner-only, the same rule the environment-secret guard applies to its own state. Dispatch receipts live here too, one folder per run, because a receipt records the command line and for some executor kinds that line is the whole prompt.

Only run evidence a child may read without harm (ledgers, logs and transcripts) lives in the Skilled tree, under the gitignored `.state` folder beside the skill. It sits next to the code that produced it and never reaches `git status`. The request queue uses sibling folders under one directory (inbox, tmp, claimed, done, quarantine and seen), so every state change is a rename on one filesystem.

A path segment taken from a bot id or an item id is checked before use, and an unsafe segment is refused instead of joined. A generation stamp per identity is advanced whenever state changes that the status index must notice.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Shared | Resolves both roots, the pinned one first, and names every state path, the request folders, the approval files and the generation stamp |
| `.skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts` | Shared | Supplies the optional `stateRoot` override |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/runtime/tests/state-root.vitest.ts` | Vitest | The user-level root resolution, the per-identity layout and run folders |

---

## 4. SOURCE METADATA

- Group: Foundations
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `foundations/state-layout.md`

Related references:
- [repository-config-and-identity.md](repository-config-and-identity.md) - the identity and override this layout is keyed by
- [../operator-loop/stop-switches.md](../operator-loop/stop-switches.md) - switch files that rely on this layout to stay out of a run's reach
