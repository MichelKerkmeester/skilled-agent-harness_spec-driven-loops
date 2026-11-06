---
title: "Vendored Skilled Overlays"
description: "What each overlay sync state means, how the overlay folder is found, what the engine refuses and how to re-pin a vendored copy or roll a re-pin back."
trigger_phrases:
  - "vendored skilled overlays"
  - "overlay sync state"
  - "doctor overlay status"
  - "edit the overlay not the live file"
  - "overlay folder setting"
  - "re-pin vendored skilled"
  - "roll back a re-pin"
importance_tier: normal
contextType: general
version: 1.1.0.0
---

# Vendored Skilled Overlays

Open this when a project keeps its own changes to a vendored Skilled copy and `/doctor:overlay` reports a state you need to act on.

---

## 1. OVERVIEW

### Purpose

A project that vendors Skilled replaces its whole copy when it moves to a new upstream release. Its own changes survive only when each one also lives in an overlay folder, which the engine applies back onto the copy. Knowing what each state means tells you whether the engine can fix it or a person has to decide.

### When to Use

- `/doctor:overlay status` printed a line that is not `in-sync`.
- An edit to a vendored file was refused because an overlay owns it.
- A project is setting up overlays for the first time.
- A project is moving its vendored copy to a newer upstream commit.

### Core Principle

A file an overlay owns is edited in its overlay, never in the live copy. The next re-copy overwrites the live copy, and only the overlay carries the change forward.

---

## 2. WHERE THE OVERLAYS LIVE

The engine reads one setting file at the root of the vendored tree, `.skilled-overlays.json`:

```json
{ "overlayDir": "barter-overlays" }
```

The value is a path relative to the tree root. With no setting file the folder is `skilled-overlays/`. The folder holds:

| File | What it holds |
|------|---------------|
| `overlay-manifest.json` | The pinned upstream commit and one entry per overlay |
| `sync-state.json` | The bytes the engine last applied to each destination, as hashes |
| `.build-lock` | Present only while an `apply` or a capture runs |
| Everything else | The overlay sources the manifest entries name |

The setting lives outside `.skilled` because a re-copy overwrites that folder, and outside the manifest because the manifest sits inside the folder the setting finds.

---

## 3. WHAT EACH STATE MEANS

`/doctor:overlay status` prints one line per destination that is not in sync, with the fix the engine names.

| State | What happened | What resolves it |
|-------|---------------|------------------|
| `in-sync` | The destination matches the overlay copy | Nothing |
| `overlay-edited` | The overlay moved and the tree has not caught up | `/doctor:overlay apply` |
| `live-edited` | Someone edited the live copy | `/doctor:overlay apply --capture <path>`, which moves the edit into the overlay |
| `both-changed` | The overlay and the live copy both moved, or a guarded destination matches neither its pinned hash nor the new copy | A person. Capture refuses and apply writes nothing |
| `upstream-moved` | The pin moved, and the destination matches neither the recorded hash nor the overlay copy | A person, who rebases the overlay onto the new upstream file |

`both-changed` and `upstream-moved` mean two copies of one intent disagree, and no script can say which is right. Read both, decide, update the overlay, then run `status` again. `apply` writes nothing at all while either state is present, because a half-applied set is worse than an untouched tree.

The common mistake is running `apply` over a `live-edited` destination. It blocks, and the fix was one capture away.

---

## 4. WHAT THE ENGINE REFUSES

### A Held Lock

`apply` and a capture take `<overlayDir>/.build-lock` themselves and remove it when they finish, also on failure. While another run holds it, they refuse and print both the owner line and the lock file path. No run clears a lock on its own: when the owner process is gone, remove the file by hand and run again.

### Secret Files

The engine never reads a `.env` file, even one a manifest entry names. A file whose name contains `token` is read only when the manifest names its exact path:

- A `file` or `marked-section` entry names its destination exactly.
- A `directory` or `skill-root` entry walks a folder, so it lists each token-named file it may read in `protectedPaths`, by its path relative to the entry. Any other token-named file the walk meets is refused.

```json
{
  "id": "repo-frontend",
  "scope": "directory",
  "source": "sk-code/sk-code-frontend",
  "destination": ".skilled/skills/sk-code/sk-code-frontend",
  "protectedPaths": ["assets/tokens.css", "references/barter-design-tokens.md"]
}
```

A `protectedPaths` value that points outside the entry, an absolute path, an empty value or a `.env` name is refused before anything is read.

---

## 5. MOVING TO A NEW UPSTREAM COMMIT

A re-pin replaces the vendored copy with a newer upstream commit and puts the overlays back on top. It needs a local Skilled checkout that holds both the pinned commit and the new one.

### What a Re-Pin Copies

- **`.skilled`:** only the paths upstream added or changed between the two commits. Files the project regenerates, such as the trigger index, stay untouched unless upstream changed them.
- **The runtime folders:** each one whole, so an upstream runtime file that drifted comes back. A project's own files in those folders stay, because upstream never ships them.
- **Deleted paths:** whatever upstream removed between the two commits is removed here too.

A path in the manifest's `repin.exclude` list is never copied over, which keeps a project's real folder where upstream ships a link. Root files such as `AGENTS.md` are never copied.

### The Two Runs

1. Run `/doctor:overlay repin --upstream <checkout> --to <commit>`. It first builds the re-pinned tree in a temporary copy and reports how many paths it will copy and delete. The report also lists the blocked overlays and the overlays that now equal upstream.
2. Rebase each blocked overlay onto the new upstream file, and drop each entry that now equals upstream. Then run the command again.
3. When the report lists nothing blocked, approve it. The live run backs up every path it will touch, copies, sets the pin, applies the overlays twice and runs the full check.

The run refuses before any write when a file no overlay owns differs from the pinned commit. That file holds an edit made in place, which the copy would revert. Move the edit into an overlay or upstream first.

### Rolling Back

Every live run keeps its backup in `<overlayDir>/repin-runs/<run-id>/`. When a run fails after its backup, it prints the rollback line:

```bash
node .skilled/commands/doctor/scripts/overlay-engine.cjs repin --rollback <run-id>
```

Rollback restores each backed-up file byte for byte and removes the files the run created. Run `/doctor:overlay status` afterwards to confirm the tree is back in sync.

---

## 6. RELATED RESOURCES

- `.skilled/commands/doctor/overlay.md`: the command router.
- `.skilled/commands/doctor/scripts/overlay-engine.cjs`: the engine, whose header lists every target and exit code.
