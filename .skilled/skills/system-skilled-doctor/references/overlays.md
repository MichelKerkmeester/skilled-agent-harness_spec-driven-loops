---
title: "Vendored Skilled Overlays"
description: "What each overlay sync state means, how the overlay folder is found, what the engine refuses, how strict writes and adopt keep every vendored change in an overlay, how to re-pin a vendored copy or roll a re-pin back, and how a project with its own overlay folder adopts the engine."
trigger_phrases:
  - "vendored skilled overlays"
  - "adopt the overlay engine"
  - "migrate my overlay folder"
  - "my changes vanish on update"
  - "doctor overlay status"
  - "edit the overlay not the live file"
  - "re-pin vendored skilled"
  - "roll back a re-pin"
importance_tier: normal
contextType: general
version: 1.0.5.0
---

# Vendored Skilled Overlays

Open this when a project keeps its own changes to a vendored Skilled copy and `/doctor:overlay` reports a state you need to act on.

---

## 1. OVERVIEW

### Purpose

A project that vendors Skilled replaces its whole copy when it moves to a new upstream release. Its own changes survive only when each one also lives in an overlay folder, which the engine applies back onto the copy. Knowing what each state means tells you whether the engine can fix it or a person has to decide.

### When to Use

- `/doctor:overlay status` printed a line that is not `in-sync`.
- An edit to a vendored file was refused because an overlay owns it, or because no overlay owns it yet.
- A project is setting up overlays for the first time.
- A project is moving its vendored copy to a newer upstream commit.

### Core Principle

A file an overlay owns is edited in its overlay, never in the live copy. The next re-copy overwrites the live copy, and only the overlay carries the change forward.

---

## 2. WHERE THE OVERLAYS LIVE

The engine reads one setting file at the root of the vendored tree, `.skilled-overlays.json`:

```json
{ "overlayDir": "team-overlays" }
```

The value is a path relative to the tree root. With no setting file the folder is `skilled-overlays/`. The folder holds:

| File | What it holds |
|------|---------------|
| `overlay-manifest.json` | The pinned upstream commit and one entry per overlay |
| `sync-state.json` | The bytes the engine last applied to each destination, as hashes |
| `.build-lock` | Present only while an `apply`, a capture, an adopt or a re-pin runs |
| Everything else | The overlay sources the manifest entries name |

The setting lives outside `.skilled` because a re-copy overwrites that folder, and outside the manifest because the manifest sits inside the folder the setting finds.

---

## 3. WHAT EACH STATE MEANS

`/doctor:overlay status` prints one line per destination that is not in sync, with the fix the engine names.

| State | What happened | What resolves it |
|-------|---------------|------------------|
| `in-sync` | The destination matches the overlay copy | Nothing |
| `overlay-edited` | The overlay moved and the tree has not caught up | `/doctor:overlay apply` |
| `live-edited` | Someone edited the live copy. A path under a skill-root entry's `remove` list never reaches this state: the overlay owns its removal, so `apply` deletes it | `/doctor:overlay apply --capture <path>`, which moves the edit into the overlay |
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
  "protectedPaths": ["assets/tokens.css", "references/team-design-tokens.md"]
}
```

A `protectedPaths` value that points outside the entry, an absolute path, an empty value or a `.env` name is refused before anything is read.

A refused file blocks only the entry it belongs to. `status` still reports every other overlay, then prints a `MISS` line for the blocked entry that names the file and the fix, such as `add "assets/tokens.css" to this entry's protectedPaths`, and exits 1. `apply` writes nothing while any entry is blocked, and `repin` refuses before its backup.

### An Edit to an Owned File

The `overlay-guard` hook refuses an agent's edit to a file an overlay owns, before it is written, and names the overlay file to edit instead. It asks the engine for each path, so it follows the same manifest. In a repository with no overlay folder it allows every edit at once. `SYSTEM_OVERLAY_GUARD_DISABLED=1` turns it off.

### A Write No Overlay Owns

By default the guard refuses only what an overlay already owns. Every other write under the vendored copy is allowed, and it is lost or refused weeks later, at the next re-pin: a new file has no upstream copy for the re-pin to carry, and an edit to an upstream file is overwritten. A vendoring project closes that gap with one key in `overlay-manifest.json`:

```json
{
  "strictWrites": true,
  "generated": [".claude/agents/**", ".skilled/**/graph-metadata.json"],
  "repin": { "rootFiles": ["REPO RULES.md"] }
}
```

With `strictWrites` on, the engine's `--guard` also refuses a write under `.skilled`, under a runtime folder or to a file named in `repin.rootFiles`, when no overlay owns the path. The refusal names what to do:

| The write | The refusal names |
|-----------|-------------------|
| An edit to an upstream file no overlay owns | `apply --adopt <path>`, then the overlay copy to edit |
| A new file inside a folder an overlay owns | The overlay path to create it at, then `apply` |
| A new file anywhere else | The overlay path to create it at, then `apply --adopt` for the highest new folder |
| A file inside a skill-root entry's folder that the entry does not replace | That entry's `replace` list |

A path matching a `generated` glob is allowed, because a generator writes it and no overlay can own it. `*` stays inside one path segment and `**` crosses segments. A path git ignores is allowed too.

`/doctor:overlay apply --adopt <path>` turns the path into a manifest entry. It copies the file or folder into the overlay folder, at the same path without its leading dot, appends a `file` or `directory` entry and applies. An upstream file is pinned to upstream's bytes at the manifest's pin, read from the checkout `pin.checkout` names, so a later re-pin reports it as `upstream-moved`. A folder's token-named source files go into the entry's `protectedPaths`. Adopt refuses a generated path, a path an overlay already owns, a `.env` file, a token-named file that is not source or prose, and a folder that holds upstream files.

A write hook sees only an agent's write tools. For everything else, a project calls the same check from its commit hook:

```bash
node .skilled/commands/doctor/scripts/overlay-engine.cjs pre-commit
```

It exits 1 and names each staged change under a vendored root that no overlay owns. A generated path passes, and so does a staged file equal to upstream's bytes at the pin. A commit that moves the pin is a re-pin and is not checked. With `strictWrites` off it checks nothing and exits 0.

---

## 5. MOVING TO A NEW UPSTREAM COMMIT

A re-pin replaces the vendored copy with a newer upstream commit and puts the overlays back on top. It needs a local Skilled checkout that holds both the pinned commit and the new one.

### What a Re-Pin Copies

- **`.skilled`:** only the paths upstream added or changed between the two commits. Files the project regenerates, such as the trigger index, stay untouched unless upstream changed them.
- **The runtime folders:** each one whole, so an upstream runtime file that drifted comes back. A project's own files in those folders stay, because upstream never ships them. With no `repin.runtimeFolders` in the manifest they are `.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode` and `.pi`.
- **Deleted paths:** whatever upstream removed between the two commits is removed here too.

A path in the manifest's `repin.exclude` list is never copied over, which keeps a project's real folder where upstream ships a link. Root files such as `AGENTS.md` and `REPO RULES.md` are never copied, so a re-pin never overwrites the project's own copy.

Name the root files the copy carries from upstream in `repin.rootFiles`. The re-pin report then prints one `root-file` line for each of them that upstream changed, however long the `not-copied` list is. A line that says no overlay owns the file means its upstream change is carried over by hand, or the file is adopted. A line that says to rebase the overlay means an overlay owns it and its source needs the upstream change.

What a re-pin leaves out, it lists. Each upstream change under `repin.exclude`, or under a top-level file or folder of the copy outside the copied roots, prints as a `not-copied` line, up to 20, then one line with the count of the rest. `report.json` keeps the full list. A top-level link, such as a `specs` link to the project's own folder, is skipped. Carry each listed change over by hand when it applies. For the shipped `AGENTS.md` sections, `/doctor:agents-md` owns that merge.

```json
"repin": {
  "runtimeFolders": [".claude", ".codex", ".cursor", ".devin", ".dsh", ".opencode", ".pi"],
  "exclude": [".opencode/scripts"]
}
```

### The Two Runs

1. Run `/doctor:overlay repin --upstream <checkout> --to <commit>`. It first builds the re-pinned tree in a temporary copy and reports how many paths it will copy and delete. The report also lists the blocked overlays, the overlays that now equal upstream and the `not-copied` changes. The copy has no project install behind it, so it skips the manifest's `regenerate` and `verifyGenerated` steps and prints how many it skipped. A clean stage proves the copy and the overlays, not the generators.
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

## 6. ADOPTING THE ENGINE WITH EXISTING OVERLAYS

A project that already keeps its own overlay folder and replay script moves onto the engine without moving a file. The engine reads the same manifest shape and the same `sync-state.json` shape, `{ "schemaVersion": 1, "pin", "files" }`, so the folder stays where it is.

1. **Name the folder.** Add `.skilled-overlays.json` at the root of the vendored copy with `{ "overlayDir": "<folder>" }`. Without it the engine looks in `skilled-overlays/`, and `status` stops with an error that says so.
2. **Run `/doctor:overlay status`.** Each entry that walks a token-named file prints a `MISS` line naming the file. Add each one to that entry's `protectedPaths`, by its path relative to the entry.
3. **Add the `repin` block** from §5 when the copy keeps a real folder where upstream ships a link, or when it vendors a different set of runtime folders.
4. **Check the generated surfaces.** The manifest's `regenerate` and `verifyGenerated` steps run after every apply, including the one a re-pin makes. Each command runs at the tree root, so review the list rather than copying one from a folder you do not trust. A verify step only fails when its command can fail: `skill-graph-freshness.cjs` reports and exits 0 unless it gets `--strict`.
5. **Run `status` again** until it prints `RESULT: PASSED`, then use `apply` and `repin` as usual.

A replay script the project keeps beside the engine can keep running against the same folder. It reads only the keys it knows, and the engine ignores keys it does not read, such as a fork's own certificates. Retire the script once nothing depends on its extra keys or states.

---

## 7. RELATED RESOURCES

- `.skilled/commands/doctor/overlay.md`: the command router.
- `.skilled/commands/doctor/scripts/overlay-engine.cjs`: the engine, whose header lists every target and exit code.
