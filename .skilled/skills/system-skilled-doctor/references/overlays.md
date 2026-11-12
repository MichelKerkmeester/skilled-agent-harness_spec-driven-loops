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
version: 1.0.11.0
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
| `sync-state.json` | The hashes it last applied to each destination, the layout link targets it made and the array items it added |
| `.build-lock` | Present only while one of the engine's writing runs holds it: an `apply`, a capture, an adopt, a relayout, a live re-pin or a rollback |
| Everything else | The overlay sources the manifest entries name |

The setting lives outside `.skilled` because a re-copy overwrites that folder, and outside the manifest because the manifest sits inside the folder the setting finds.

`sync-state.json` carries two optional records beside its hashes. `links` maps each layout link path to the target the engine confirmed there, so when the manifest moves a link target the engine retargets its own link instead of refusing a stranger at that path. `items` holds the array items each `json-entry` overlay added, so an item the overlay drops is removed from the live file while it still equals what the engine wrote. An item recorded there but edited since is refused rather than deleted, because the entry set no longer describes what it should be. A link the state has no record of is refused and reported, and an item it has no record of is left in place. A state file from an older engine holds neither key, so nothing is retargeted or removed until the first apply records them.

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

### Off-Layout and Stale Sources

Two more `status` lines name work no destination state covers.

| The line | What happened | What resolves it |
|----------|---------------|------------------|
| `STALE    root-file <path>` | Upstream changed a root file named in `repin.rootFiles` that a `file` or `marked-section` overlay owns and pins in `pinnedSha256`. A re-pin never copies a root file, so no destination line reports it | Rebase the overlay onto the new upstream file, then update its `pinnedSha256` |
| `LAYOUT   <overlay>: <field> <from> belongs at <to>` | The copy the entry names sits off its layout path, which is the entry's destination path with the leading dot dropped. `<field>` is `source`, `fragment` or `base`, and a `marked-section` entry can print one line for each. The `base` path carries `.base` before the extension | `/doctor:overlay apply --relayout` |

`STALE` names a root file owned by a `file` or a `marked-section` overlay that carries `pinnedSha256`. Both scopes pin upstream's copy of the destination. A `file` entry copies that file whole, and a `marked-section` entry keeps it as its `base`. One comparison against the pinned commit therefore catches an upstream move for either one. The line prints even while the entry itself still applies cleanly, which is why it is the only sign the pin is out of date.

`apply --relayout` moves each off-layout copy onto its layout path, and with it a `marked-section` entry's `fragment` and `base`. It copies every path it moves into `<overlayDir>/relayout-runs/<stamp>/` first, then points the entry's fields and the manifest's layout links at the new path. It refuses rather than overwrite a path that already exists, and then it writes nothing. The run retargets each live link that still named a moved copy and prints a `relinked` line for it. The plain `apply` that follows writes the destinations from the moved copies.

---

## 4. WHAT THE ENGINE REFUSES

### A Held Lock

`apply`, a capture, an adopt, a relayout, a live re-pin and a rollback each take `<overlayDir>/.build-lock` and remove it when they finish, also on failure. The owner line records the process id and the host that wrote it, as `pid=<n> host=<name>`. A lock whose owner has ended on this host is leftover state, so the next run takes it over and prints one note naming whose lock it was. A line with a process id and no `host=` token came from an engine that only ever ran on the machine it was installed in, so that id is probed here too. The takeover runs behind `<overlayDir>/.build-lock.takeover`, and only one run can create that file. A marker older than a minute is what a run killed mid-takeover leaves behind, so the next run clears it instead of waiting for it to go. A lock with a live owner, a lock another host wrote, or a lock with no process id in its line still refuses, and that refusal prints the owner line and the lock file path. Remove such a file by hand once you know its run has ended.

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

The `overlay-guard` hook refuses an agent's edit to a file an overlay owns, before it is written, and names the overlay file to edit instead. It asks the engine for each path, so it follows the same manifest. It is one runtime-neutral core with an adapter per runtime, for Claude, Codex, Cursor, Devin, Pi, DSH and OpenCode, and the OpenCode adapter sits at `.skilled/hooks/overlay-guard/opencode/overlay-guard.js`. In a repository with no overlay folder it allows every edit at once. `SYSTEM_OVERLAY_GUARD_DISABLED=1` turns it off.

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

A path matching a `generated` glob is allowed, because a generator writes it and no overlay can own it. In a glob, `*` stays inside one path segment and `**` crosses segments. A `**/` matches zero or more whole segments, so `.skilled/**/graph-metadata.json` covers that file at any depth, the top level included, and never a longer name beside it. A path git ignores is allowed too.

A path under a `repin.exclude` folder is never copied by a re-pin, so a write there cannot be lost. With `strictWrites` on, the guard, the commit check and the audit all leave it alone.

`/doctor:overlay apply --adopt <path>` turns the path into a manifest entry. It copies the file or folder into the overlay folder, at the same path without its leading dot, appends a `file` or `directory` entry and applies. An upstream file is pinned to upstream's bytes at the manifest's pin, read from the checkout `pin.checkout` names, so a later re-pin reports it as `upstream-moved`. A folder's token-named source files go into the entry's `protectedPaths`. Adopt refuses a generated path, a path an overlay already owns, a `.env` file, a token-named file that is not source or prose, and a folder that holds upstream files.

A write hook sees only an agent's write tools. For everything else, a project calls the same check from its commit hook:

```bash
node .skilled/commands/doctor/scripts/overlay-engine.cjs pre-commit
```

It exits 1 and names each staged change under a vendored root that no overlay owns. A generated path passes, and so does a staged file whose contents equal upstream's bytes at the pin, with CRLF read as LF. A commit that moves the pin is a re-pin and is not checked. With `strictWrites` off it checks nothing and exits 0.

### Drift No Overlay Owns

The write checks judge a write as it is made. A vendored file that already differs from upstream, or an upstream file the tree lacks, has no line in a re-pin unless the path is one the re-pin copies or deletes. A re-pin copies the `.skilled` paths upstream changed and the runtime folders whole, and it deletes the paths upstream dropped. A drifted path outside that set, such as a hand-edited `.skilled` file upstream left alone, is never refused, so `/doctor:overlay status --audit` is the only report for it. It prints one `AUDIT` line per vendored path no overlay owns:

- `differs`: the path's contents differ from upstream at the pin.
- `missing`: upstream has the path at the pin and the tree does not.
- `extra`: the tree tracks the path and upstream never had it.

A generated path, a path an overlay owns, a path under a `repin.exclude` folder and a `.env` name are not judged. `audit=<n>` counts the findings and any finding fails the status. With no checkout at the pin the run prints `AUDIT    skipped: no upstream checkout at the pin` and judges nothing. The audit compares bytes, so a file that differs from upstream only by line endings is a `differs` finding. The commit check is the one place that reads CRLF as LF.

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
