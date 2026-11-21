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
version: 1.0.38.0
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

The value is a path relative to the tree root, written with forward slashes. It names a folder inside the tree, or a folder beside it as a direct sibling `../<name>`, such as `../team-overlays`. With no setting file the folder is `skilled-overlays/`. A backslash or an absolute path is refused with `.skilled-overlays.json must name a relative folder with forward slashes: <value>`. A deeper path such as `../../x` or `../a/b`, the tree's own name as `../<tree>`, a dangling sibling link and a looping link are refused with `.skilled-overlays.json names a folder outside the tree root: <value>`. A sibling link that leads back to the tree, and a sibling name that is a case variant of the tree's own, are refused with `.skilled-overlays.json names a sibling that resolves into the tree root: <value>`. A sibling that resolves to a folder holding the tree root is refused with `.skilled-overlays.json names a sibling that resolves to a folder holding the tree root: <value>`. A folder named inside the tree that resolves outside it, for example through a link, is refused with `.skilled-overlays.json names a folder inside the tree that resolves outside it: <value>`, and one that resolves to the tree root itself with `.skilled-overlays.json names a folder inside the tree that resolves to the tree root: <value>`. When the tree sits in a git repository, a sibling must sit inside that repository too: a sibling that resolves outside the repository's top level, or into its `.git`, is refused by every command, `status`, `apply`, `guard` and `pre-commit`, with exit 2 and `.skilled-overlays.json names a folder outside the git repository at <top>: <value>`. That refusal comes from reading the setting, not from `pre-commit`. A tree in no git repository keeps any direct sibling, and `pre-commit` then has nothing to compare and allows the commit. The folder holds:

| File | What it holds |
|------|---------------|
| `overlay-manifest.json` | The pinned upstream commit and one entry per overlay |
| `sync-state.json` | Schema version 2: the hashes it last applied to each destination, the layout link targets it made, the array items it added, the values its `set` and `insertObjectKeys` operations wrote and the keys its `setKeyOnItem` operations wrote |
| `.build-lock` | Present only while one of the engine's writing runs holds it: an `apply`, a capture, an adopt, a relayout, a live re-pin or a rollback |
| `repin-runs/`, `relayout-runs/` | The backups a re-pin and a relayout write before their first change |
| Everything else | The overlay sources the manifest entries name |

The setting lives outside `.skilled` because a re-copy overwrites that folder, and outside the manifest because the manifest sits inside the folder the setting finds. It stays at the tree root when the folder sits beside the tree, so the tree always names its own overlays.

`sync-state.json` carries four optional records beside its hashes. `links` maps each layout link path to the target the engine confirmed there, so when the manifest moves a link target the engine retargets its own link instead of refusing a stranger at that path. `items` holds the array items each `json-entry` overlay added, so an item the overlay drops is removed from the live file while it still equals what the engine wrote. An item recorded there but edited since is refused rather than deleted, because the entry set no longer describes what it should be. `sets` holds each `set` a `json-entry` overlay applied: its path, the value written and whether the engine added the key. Each key an `insertObjectKeys` inserts is recorded there too, as a `set` on that key's path, and returns the same way once the entry set stops naming it. Two operations on one path share one record, however the path spells an index. When the entry set stops naming that path, `apply` writes back the value the pin holds. A key the pin does not hold is deleted while it still carries the recorded value and the record shows this overlay added it. A value edited since it was recorded is refused rather than overwritten. Two nested `set` operations dropped together both leave: the outer value returns first, and a value a later `set` wrote inside it counts as part of its record. A `set` the entry set still lists inside a dropped outer one is written again once the outer value returns, provided the pin holds the key or object that set writes into. Otherwise the overlay is refused. A dropped `set` that a kept `set` wrote over, or that another operation kind wrote inside, is refused, because the live value no longer equals the record. Put the `set` back or restore the value by hand. A path through an array is restored only while that array holds the same number of items in the live file and in the pin, the overlay adds no item to it, and the item at each index is the pin's item apart from the values this overlay's operations wrote into it. When the overlay wrote the whole item, through one `set`, through several that cover every key, or through a `set` on the array above it, every other item of that array must be the pin's. A step into an array counts as an index however the entry set spells it. Otherwise `apply` refuses and names the outermost array on the path. That refusal clears once that array reads the same as the pin's. To clear it, put the whole array back to the pin's by hand and run `apply`. The operations the entry set still lists then write into it again. A key the pin does not hold that the live file already held when a `set` first named it is refused, not deleted, because a person may have written it. A record an older engine wrote never marks the keys it added, so it refuses the same way. Delete the key by hand or put the `set` back in the entry set. The restore reads the pinned copy the run was given. For `apply` that is the checkout the manifest's pin names, and for a re-pin it is the new commit, whether or not the copy writes the file. Before its backup a re-pin plans each `json-entry` destination its copy leaves in place against the new commit, and when one cannot be applied it refuses with exit 2 and writes nothing. A refused array clears once it is put back to the copy at the current pin by hand and `apply` runs, before the re-pin. Without a pinned copy the overlay is refused, unless the live file holds exactly the bytes the entry's `pinnedSha256` names, because those bytes are the pinned copy. The refusal says to set `pin.checkout` or to put the file back to those bytes. `keys` holds each key a `setKeyOnItem` wrote: the array path, the identity key and the matched item's identity, the key, the value written and whether the engine added the key. The item is found by its identity in the live file and in the pin, never by its position. When the entry set stops naming that key, `apply` writes back the value the pin's item holds, or deletes the key when the pin's item lacks it and the record shows this overlay added it. A value edited since is refused, and so is a drop with no readable pinned copy. A key on an item an `insertItems` or `appendItems` in the same entry set still lists leaves with that item's own rewrite. The cases that follow are not undone, and `status` prints a `NOTE` line for those it can see, described under [Notes](#notes). An operation of any kind whose path steps through an array index lands on another item when one before it is added or removed. A `set` through an array index that stays listed while an `insertItems` on that array leaves moves to the next item, and the value it wrote on the item before stays behind with no record. A link the state has no record of is refused and reported, and an item or a value it has no record of is left in place. A value no record covers, such as one an older engine wrote before a drop, stays in place, and the `cross-check` note names it. A state file from an older engine holds none of these keys, so nothing is retargeted, removed or restored until the first apply records them.

The engine reads a version 1 state file and the next `apply` rewrites it as version 2. An engine older than version 2 refuses to read a version 2 file. A record without a valid path is refused, and the error names the record and the fix. The engine writes `sync-state.json` and `overlay-manifest.json` through a temporary file and a rename, so an interrupted run leaves the old file whole. `apply` records the state right after it writes the destinations, before any `regenerate` step runs. When a step fails, the state says so, and the next `apply` runs the steps again even when every destination is already in sync. Until then `status` prints a `REGEN` line and fails. The first `apply` after an upgrade to an engine that records `setKeyOnItem` and `insertObjectKeys` rewrites `sync-state.json` even when it prints `0 changed`, because it records the operations the entry sets still list. Commit that change with the upgrade. An older engine ignores the `keys` record and drops it on its next write, so a `setKeyOnItem` dropped after that is not taken back. It also reads the inserted object keys in `sets` as dropped sets: it deletes each one and the `insertObjectKeys` puts it back, so the file ends the same.

### READMEs in the Overlay Folder

Every folder in the overlay folder needs a README: the overlay folder itself, `framework/`, `root/`, `checks/` and `tests/`, and every folder under them. A folder's README is `README.md` or `README.markdown`, and either name meets the need. In a folder under a `commands/` path, name it `README.markdown`, because sk-doc reads a `README.md` there as a command document. Only a regular file counts: a README that is a link counts as missing. A README either ships into the tree or is documentation only. The manifest entries decide which, and no manifest field marks it.

With `F` as a folder's path relative to the overlay folder, `F/README.md` or `F/README.markdown` ships when any one of these is true:

1. It is the `source` of a manifest entry of any scope, or a `marked-section` entry's `fragment` or `base`, because `apply` reads all three. A `file` entry is the usual case.
2. `F` is the `source` folder of a `directory` entry, or sits under it. Everything inside a whole-folder entry ships, except a Python bytecode cache.
3. `F` is the `source` folder of a `skill-root` entry, or sits under it, and the README's path relative to that source is listed in the entry's `replace`, or sits under a folder `replace` lists. A skill-root entry ships only what `replace` names.

A README whose path the skill-root entry's `retained` list names, on a path inside a folder its `replace` list names, is documentation only, because `apply` keeps the vendor's live bytes there. A retained path that `replace` names directly still ships.

Every other README is documentation only. These rules apply to both names alike.

A new README inside a directory entry ships. Adding one to a folder inside a `directory` entry, or inside a folder a `skill-root` entry's `replace` lists, changes the vendored tree on the next `apply`. It is overlay content like any other file in that folder.

A Python bytecode cache is never overlay content. Only a folder named `__pycache__`, or a file ending in `.pyc` or `.pyo`, counts as one. A folder whose name ends in `.pyc` is ordinary content. The folder readers skip a `__pycache__` folder and any `*.pyc` or `*.pyo` file on both sides of a `directory` or `skill-root` entry, so `apply` never ships one from the overlay folder, and status, capture and adopt pass over it. A cache a script wrote in the live tree is never deleted while its folder still ships. A folder the entry stops shipping goes with its cache. Once `apply` has deleted the folder's files, it removes the folder whole if nothing but caches is left in it. For a `directory` entry that is a folder the source no longer has. For a `skill-root` entry it is a folder at or under a `remove` path, or under a `replace` folder whose source lacks it. The rule goes by name, not by what git ignores, because an overlay folder can sit outside any repository. When `apply` cannot remove such a cache folder, for example because a file in it is read-only, it leaves the folder, prints a `NOTE` line naming it with an indented `Next: chmod -R u+w <folder> && rm -r <folder>` line, and still succeeds, because only caches were left. A re-pin backs up a cache only when its apply could remove it, so the backup never grows with caches that stay.

The engine never applies, adopts, captures, stages or flags a documentation-only README:

- `apply` never writes it to the tree.
- `apply --adopt` never takes it over as a source. An adopt that would place a source onto an existing documentation-only README, or would turn one into content by making its folder a `directory` entry, refuses and writes nothing.
- `apply --capture` never writes into it.
- `repin --stage` never puts it into the stage folder.
- No status line, `--json` field, audit finding, `pre-commit` refusal, guard refusal, `LAYOUT` line or relayout move names it as drift, extra, stray, unowned or off-layout. It shows up only in the README check `status --audit` runs, described under [README Checks](#readme-checks).

All of this holds the same way for an overlay folder inside the tree, the default `skilled-overlays/`.

---

## 3. WHAT EACH STATE MEANS

`/doctor:overlay status` prints one line per destination that is not in sync, with the fix the engine names.

| State | What happened | What resolves it |
|-------|---------------|------------------|
| `in-sync` | The destination matches the overlay copy | Nothing |
| `overlay-edited` | The overlay moved and the tree has not caught up | `/doctor:overlay apply` |
| `live-edited` | Someone edited the live copy. A path under a skill-root entry's `remove` list never reaches this state: the overlay owns its removal, so `apply` deletes it. A file upstream added inside a `directory` entry's folder, which the overlay's copy lacks, does not reach it either while it holds upstream's bytes: the overlay's copy is the whole folder, so `apply` deletes that file | `/doctor:overlay apply --capture <path>`, which moves the edit into the overlay |
| `both-changed` | The overlay and the live copy both moved, or a guarded destination matches neither its pinned hash nor the new copy | A person. Capture refuses and apply writes nothing |
| `upstream-moved` | The pin moved, and the destination matches neither the recorded hash nor the overlay copy | A person, who rebases the overlay onto the new upstream file |
| `cannot-apply` | A `json-entry` overlay's entry set cannot be applied to a destination nobody edited since the last apply or the pin, such as a dropped `set` the engine cannot restore. The fix text names why | A person, who changes the entry set or the destination as the fix text says |

`both-changed` and `upstream-moved` mean two copies of one intent disagree, and no script can say which is right. Read both, decide, update the overlay, then run `status` again. `cannot-apply` means the entry set itself cannot be applied. `apply` writes nothing at all while any of the three is present, because a half-applied set is worse than an untouched tree.

The common mistake is running `apply` over a `live-edited` destination. It blocks, and the fix was one capture away.

### Off-Layout and Stale Sources

Three more `status` lines name work no destination state covers.

| The line | What happened | What resolves it |
|----------|---------------|------------------|
| `STALE    root-file <path>` | Upstream changed a root file named in `repin.rootFiles` that a `file` or `marked-section` overlay owns and pins in `pinnedSha256`. A re-pin never copies a root file, so no destination line reports it | Rebase the overlay onto the new upstream file, then update its `pinnedSha256` |
| `REGEN    pending: <ids>` | An earlier `apply` wrote and recorded the destinations, then a `regenerate` step failed. The line names every `regenerate` step id in the manifest, comma-separated, because the next `apply` reruns them all. A why line and `Next: from <root>: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply` follow it. A manifest with no `regenerate` steps prints no line. `status --json` names the same ids in `regeneratePending`, after `staleRootFiles`. The field is always present and holds `[]` when nothing is pending. A REGEN line fails the status | Fix the step that failed, then run `/doctor:overlay apply` |
| `LAYOUT   <overlay>: <field> <from> belongs at <to>` | The copy the entry names sits off its layout path. A destination under `.skilled/` lays out under `framework/`, so `.skilled/skills/x` belongs at `framework/skills/x`, and `.skilled` itself at `framework`. Any other destination lays out under `root/`, with its leading dots dropped, so `.claude/settings.json` belongs at `root/claude/settings.json`. `<field>` is `source`, `fragment` or `base`, and a `marked-section` entry can print one line for each. The `base` path carries `.base` before the extension. `status` prints at most 20 of these lines, then one overflow line: `LAYOUT   … <n> more; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout` when no hidden move sits under `root/skilled`, `LAYOUT   … <n> more under root/skilled; change the destination or remove the entry` when every hidden move does, and `LAYOUT   … <n> more; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout for <m>, and change the destination or remove the entry for the <b> under root/skilled` when they mix. An indented `Next:` line follows the overflow line. When a hidden move can go and any move, shown or hidden, sits under `root/skilled`, it reads `Next: change the destination of each entry under root/skilled in <manifest path>, or remove the entry, then from <root>: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, because relayout refuses every move until those entries change. `status --json` keeps every move in `offLayout`. A LAYOUT line never fails the status | `/doctor:overlay apply --relayout`; when `<to>` sits under `root/skilled` the line ends `change the destination or remove the entry` instead, because relayout refuses that move |

`STALE` names a root file owned by a `file` or a `marked-section` overlay that carries `pinnedSha256`. Both scopes pin upstream's copy of the destination. A `file` entry copies that file whole, and a `marked-section` entry keeps it as its `base`. One comparison against the pinned commit therefore catches an upstream move for either one. The line prints even while the entry itself still applies cleanly, which is why it is the only sign the pin is out of date. Without a readable checkout at the pin the check cannot run, and `status` prints a `NOTE` line saying it skipped the check.

`apply --relayout` moves each off-layout copy onto its layout path, `framework/` for a destination under `.skilled/` and `root/` for any other, and with it a `marked-section` entry's `fragment` and `base`. It refuses, before it writes anything, a manifest whose layout link `path` or `replaces.path` escapes the tree root, as text or through a linked folder on its way: it prints `refuse: layout link path escapes the tree root: <path>` and exits 2. `status` and `apply` refuse the same manifest with exit 2 and `layout link path escapes the tree root: <path>`. The engine also refuses a manifest that lists one layout link `path` twice, before it writes anything: `status` and `apply` exit 2 with `layout link path is listed twice: <path>`, and `apply --relayout` prints `refuse: layout link path is listed twice: <path>` and exits 2. `apply --adopt` checks the layout links the same way before it writes the manifest, and refuses with the same `refuse:` line. It compares normalized paths, with `.` and `..` segments resolved, repeated slashes collapsed and a leading `./` and trailing slashes removed, so `./framework/x/`, `framework//x` and `framework/y/../x` all count as `framework/x`. On a filesystem that ignores letter case, such as macOS's default volume, paths that differ only in case count as one path too, under full Unicode case folding, so `STRASSE` and `straße` are one path there. The composed and decomposed forms of an accented name count as one path on every filesystem. The plan compares each nested link with the links above it the same way, so `EXT` pointing out of the tree with `ext/planted` below it is refused before anything is written. List each link once. When a move would land on a documentation-only README, the relayout refuses with `refuse: a documentation-only README sits at <overlay label>/<path>: merge it into the overlay copy or move it, then relayout`. The relayout copies every path it moves into `<overlayDir>/relayout-runs/<stamp>/` first, inside the overlay folder and keyed from its root, so a sibling folder keeps its own backup, then points the entry's fields and the manifest's layout links at the new path. When writing that backup fails before the first move, the run exits 2 with `error: relayout failed while writing the backup: <message>; nothing was moved and the partial backup was removed`, or, when that removal fails too, with `error: relayout failed while writing the backup: <message>; nothing was moved, but the partial backup at <backup> could not be removed: <message>`. It refuses rather than overwrite a path that already exists, and then it writes nothing. It refuses a move to a path under `root/skilled/` too, such as one for a destination named `skilled/...` at the tree root, because that folder holds no copy: the framework's copies live under `framework/` alone, so one destination never has two sources. A manifest whose `source`, `fragment` or `base` already sits there is a blocked overlay. The run retargets each live link that still named a moved copy and prints a `relinked` line for it. The plain `apply` that follows writes the destinations from the moved copies. When a move, the manifest write or a relink fails part way, the run puts back every copy it moved, the manifest and every link it retargeted, removes its own `relayout-runs/<stamp>/` folder, prints `error: relayout failed while <step>: <message>; every moved copy, the manifest and the links are back as they were` and exits 2. If that restore fails too, the line names the path it could not restore, keeps the backup, names `relayout-runs/<stamp>` as the place that holds every moved copy and the manifest as it was, and the run exits 2. When the backup skipped read-protected token-named files, that line ends instead `the backup at <backup> holds the manifest as it was and every moved copy except these files it skipped: <paths>`. Those skipped files are not in the backup, and they sit wherever the failed restore left them. If everything is back but the backup folder cannot be removed, the line says so, names the backup and the reason, and the run exits 2. When a run finishes but cannot remove an emptied source folder, it prints `note: relayout left an emptied folder in place after moving <path>: <message>`, still prints its moved count and its apply line, and exits 0. Nothing failed, and the empty folder can be removed by hand.

### Placing a Marked Block

A `marked-section` entry appends its fragment to the end of the base copy, so the fragment starts with the separator that leads into the begin marker. A file whose last section has to stay last, such as a reference that ends in RELATED RESOURCES, names that section's heading line in the optional `insertBefore` field:

```json
{
  "id": "review-core-code-review",
  "scope": "marked-section",
  "insertBefore": "## 10. RELATED RESOURCES"
}
```

The fragment then goes in exactly as written just before the last line that equals `insertBefore`, so it starts with the begin marker and ends with the separator that leads into that line. A later `apply` rewrites the block in place and keeps everything from the anchor line on, and `apply --capture` reads the block up to that line. A block an earlier `apply` appended at the end moves before the anchor on the next `apply`. When no line matches, the entry is refused with `has no line "<insertBefore>" for the block to go before; rebase the overlay`, and nothing is appended in its place. The block sits inside the section before the anchor, so a checker that numbers the top-level sections expects its headings one level down.

### Notes

`status` prints `NOTE` lines beside its check. A note never fails the run, and `status --json` lists the same text under `notes`.

| The note | What it means | What to do |
|----------|---------------|------------|
| `sync-state.json is schema version 1` | An older engine wrote the state file | Run `apply` once. A script that still writes version 1 drops the records of the items and values the `json-entry` overlays wrote |
| `no upstream checkout at the pin, so ... skipped` | The checkout `pin.checkout` names is missing, or it lacks the pinned commit, so the stale root-file check, the `json-entry` cross-check, or both did not run | Name the checkout in `pin.checkout`, or fetch the pinned commit into it |
| `<overlay>: insertItems before ... finds no such item` or `insertObjectKeys before ... finds no such key` | The `before` or `beforeKey` anchor names an item or key the file does not hold, so the items or keys go at the end instead. The apply still runs. A re-pin prints the same line when the new copy dropped the anchor | Point the anchor at an item or key the file holds |
| `<overlay>: insertItems at ... names a before anchor but no identityKey` | Without an `identityKey` the anchor cannot match an item, so it is ignored and the items go at the end | Add an `identityKey` to the operation |
| `<overlay>: <op> at ... goes through an array index` | The operation's path names an item by its position, whatever the operation kind, so it lands on another item when one before it is added or removed | Prefer an operation that matches the item by identity |
| `<n> unowned upstream path(s) at the pin ... missing from the tree` | Upstream ships the path at the pin, no overlay owns it, and the tree lacks it. A re-pin copies only the paths upstream changed, so the path stays missing through every later re-pin. The line names the first five paths and counts the rest. It needs a readable checkout at the pin, and `status --audit` prints a `missing` line instead | Restore the paths from the pinned commit, then run `status --audit` for the full drift report |
| `cross-check <path>: the live file differs ...` | An in-sync `json-entry` destination differs from the entry set applied to the pinned copy, at the path the line names. No record covers that value, such as one an older engine wrote and a later drop left behind | Remove the value by hand, or list the path in the `outputs` of the `regenerate` step that writes it |

The cross-check skips every destination a `regenerate` step lists in its `outputs`, because the step rewrites that file after the entry sets apply. A step that writes a `json-entry` destination without listing it gets a cross-check line on every run until the path joins its `outputs`.

A relative `pin.checkout` is read from the root of the tree the engine runs on, not from the folder the shell is in. `repin --stage` reads only the `--upstream` checkout it is given, but a later `status --root <staged tree root>` reads a relative checkout beside the staged copy. The staged tree root is the stage folder itself, unless the overlay folder sits beside the tree; the stage then prints it on a `staged tree root:` line, and the JSON report carries it as `stagedRoot` in both cases.

---

## 4. WHAT THE ENGINE REFUSES

Most refusals the engine, the doctor scripts and the git hooks print end with a `Next:` line naming the exact command to run, and the folder to run it from. The write guard's refusals name their command inline instead.

### A Held Lock

`apply`, a capture, an adopt, a relayout, a live re-pin and a rollback each take `<overlayDir>/.build-lock` and remove it when they finish, also on failure. The owner line records the process id and the host that wrote it, as `pid=<n> host=<name>`. A lock whose owner has ended on this host is leftover state, so the next run takes it over and prints one note naming whose lock it was. A `repin --stage` does not take it: it reads a dead owner's line, prints `note: the overlay lock belongs to a run that has ended:`, and leaves the lock for the next writing run. A line with a process id and no `host=` token came from an engine that only ever ran on the machine it was installed in, so that id is probed here too. The takeover runs behind `<overlayDir>/.build-lock.takeover`, and only one run at a time can create that file. A marker older than a minute is what a run killed mid-takeover leaves behind, so the next run clears it instead of waiting for it to go. Neither leftover is deleted by its shared path. The lock and the marker are each renamed aside first and deleted only when the renamed file is the one that was judged stale, and a file another run wrote in the meantime is put back, unless another file already stands at the path, in which case the set-aside file is dropped. A marker put back this way can outlive its run, and a takeover then refuses for up to a minute and says to run it again. A run killed in that instant can leave a `.claim` file beside the lock, which is safe to delete. A lock with a live owner, a lock another host wrote, or a lock with no process id in its line still refuses, and that refusal prints the owner line and the lock file path. Remove such a file by hand once you know its run has ended.

### Secret Files

The engine never reads a `.env` file, even one a manifest entry names. The template `.env.example` is the exception. It holds no secret by convention, so the engine reads, copies, re-pins and reports it like any vendored file. Only that exact name is exempt, the same name the env secret guard lets an agent read, so every other `.env` name stays protected. A file whose name contains `token` is read only when the manifest names its exact path:

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

### Another Shape in the Way

An entry can change what it writes at a destination between a file, a folder and a layout link. `apply` first removes its own earlier output there, meaning files whose bytes match what it last wrote or a layout link it made, then writes the new shape in the same run. A file, folder or link it did not write is unowned, so `apply` refuses it, writes nothing and exits 1:

```text
BLOCKED  t: thing is a folder that does not match what apply last wrote there, where overlay t writes a file; apply removes only its own output, so it stays
  Next: mv thing thing.keep && node .skilled/commands/doctor/scripts/overlay-engine.cjs apply
```

Move the unowned copy aside as the `Next:` line says, then compare it with the overlay before you delete it.

### An Edit to an Owned File

The `overlay-guard` hook refuses an agent's edit to a file an overlay owns, before it is written, and names the overlay file to edit instead. It asks the engine for each path, so it follows the same manifest. It is one runtime-neutral core with an adapter per runtime, for Claude, Codex, Cursor, Devin, Pi, DSH, OpenCode and Vibe, and the OpenCode adapter sits at `.skilled/hooks/overlay-guard/opencode/overlay-guard.js`. In a repository with no overlay folder it allows every edit at once. `SYSTEM_OVERLAY_GUARD_DISABLED=1` turns it off.

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

`/doctor:overlay apply --adopt <path>` turns the path into a manifest entry. It copies the file or folder into the overlay folder at its layout path, under `framework/` for a path under `.skilled/` and under `root/` for any other, with its leading dots dropped, then appends a `file` or `directory` entry and applies. An upstream file is pinned to upstream's bytes at the manifest's pin, read from the checkout `pin.checkout` names, so a later re-pin reports it as `upstream-moved`. A folder's token-named source files go into the entry's `protectedPaths`. Adopt refuses a generated path, a path an overlay already owns, a `.env` file, a token-named file that is not source or prose, a folder that holds upstream files, and a path whose copy would land under `root/skilled/`.

Adopt takes a path under `repin.exclude` only from its copy in the overlay folder. A re-pin never copies such a path, so it needs no overlay, but a project may still want its own file there carried and checked by an entry. Put the copy at the overlay path first, with the live file moved there or absent, then run `apply --adopt <path>`. The entry is a project addition with no `pinnedSha256`, and the apply writes the file back to the tree. Without that copy, adopt refuses and names the overlay path it looked for.

A write hook sees only an agent's write tools. For everything else, a project calls the same check from its commit hook:

```bash
node .skilled/commands/doctor/scripts/overlay-engine.cjs pre-commit
```

It exits 1 and names each staged change under a vendored root that no overlay owns. A generated path passes, and so does a staged file whose contents equal upstream's bytes at the pin, with CRLF read as LF. A commit that moves the pin is a re-pin and is not checked. With `strictWrites` off it checks nothing and exits 0.

### Drift No Overlay Owns

The write checks judge a write as it is made. A vendored file that already differs from upstream, or an upstream file the tree lacks, has no line in a re-pin unless the path is one the re-pin copies or deletes. A re-pin copies the `.skilled` paths upstream changed and the runtime folders whole, and it deletes the paths upstream dropped. A drifted path outside that set, such as a hand-edited `.skilled` file upstream left alone, is never refused, so `/doctor:overlay status --audit` is the only full report for it. Plain `status` also prints one `NOTE` for the missing kind, because a missing path costs one file check to find, while the full comparison reads every vendored file. It prints one `AUDIT` line per vendored path no overlay owns:

- `differs`: the path's contents differ from upstream at the pin.
- `missing`: upstream has the path at the pin and the tree does not.
- `extra`: the tree tracks the path and upstream never had it.

A generated path, a path an overlay owns, a path under a `repin.exclude` folder and a `.env` name are not judged. `audit=<n>` counts the findings and any finding fails the status. With no checkout at the pin the run prints `AUDIT    skipped: no upstream checkout at the pin` and judges nothing. The audit compares bytes, so a file that differs from upstream only by line endings is a `differs` finding. The commit check is the one place that reads CRLF as LF.

### README Checks

`status --audit` also checks the READMEs in the overlay folder, described under [READMEs in the Overlay Folder](#readmes-in-the-overlay-folder). This leg reads only the overlay folder, so it runs even when no checkout at the pin can be read. It walks every folder there and skips these, with everything under them:

- `repin-runs/` and `relayout-runs/` directly under the overlay folder, which hold the engine's runtime state and its backups.
- A folder whose name starts with a dot.
- A folder named `node_modules`.
- A folder named `__pycache__`, the bytecode cache Python writes beside a script it runs.
- A folder reached through a symbolic link. The walk never follows a link.

Every walked folder needs a `README.md` or a `README.markdown`, and only a regular file counts, so a README that is a link counts as missing. A folder the walk cannot read is skipped and not counted. Every README there, under either name and shipping or documentation only, goes through sk-doc's own validator, and a folder with both names has both checked. The engine runs `python3 <tree>/.skilled/skills/sk-doc/scripts/validate_document.py <README> --json` once per README, with `JEV_FEATURE_CITE_DRIFT=0` and `PYTHONDONTWRITEBYTECODE=1` set, and lets the validator detect the document type. A README with any `blocking_errors` is invalid, and so is one the validator answers without a `blocking_errors` list, for example with an `error` key or output that is not JSON. A validator still running after 30 seconds is killed and reported as invalid with `the validator did not finish in 30s`, and `OVERLAY_DOCS_VALIDATOR_TIMEOUT_MS` changes that limit. A validator that cannot start is reported with `the validator could not run: <error>`. The lines print after the `AUDIT` lines and before `checked=`:

```text
DOCS     missing-readme <overlay label>/<F>
DOCS     invalid-readme <overlay label>/<F>/<README name>: <first blocking error message>[ (+N more)]
DOCS     skipped: <reason>
docs=<number of DOCS findings>
```

`<overlay label>` is the label the `source` fields already use, such as `../overlays`, and the overlay folder itself prints as the label alone. `missing-readme` means the folder has neither name, and `<README name>` is the file the validator read, `README.md` or `README.markdown`. When python3 or the validator is missing, one `skipped` line takes the place of the validation, and the `missing-readme` findings still print. A `skipped` line is not a finding and does not count toward `docs=`.

The leg is advisory. Unlike an `AUDIT` finding, a `DOCS` finding never changes `RESULT:`, the `result` field of `--json` or the exit code, so a project whose overlay folder has no READMEs keeps the status result and the exit it had before. No manifest field turns the leg on or off.

`status --audit --json` adds a `docs` key beside `audit`. It holds `isValidated`, `skipped` with the reason or `null`, the counts `folders`, `readmes`, `shipping` and `docOnly`, and `findings`, one item per finding with its `kind` and `path`, sorted by `path`. An `invalid-readme` item also carries its `errors`. Without `--audit` the key is absent.

---

## 5. MOVING TO A NEW UPSTREAM COMMIT

A re-pin replaces the vendored copy with a newer upstream commit and puts the overlays back on top. It needs a local Skilled checkout that holds both the pinned commit and the new one.

### What a Re-Pin Copies

- **`.skilled`:** only the paths upstream added or changed between the two commits. Files the project regenerates, such as the trigger index, stay untouched unless upstream changed them.
- **The runtime folders:** each one whole, so an upstream runtime file that drifted comes back. A project's own files in those folders stay, because upstream never ships them. With no `repin.runtimeFolders` in the manifest they are `.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi` and `.vibe`.
- **Deleted paths:** whatever upstream removed between the two commits is removed here too.

A path in the manifest's `repin.exclude` list is never copied over, which keeps a project's real folder where upstream ships a link. Root files such as `AGENTS.md` and `REPO RULES.md` are never copied, so a re-pin never overwrites the project's own copy.

Name the root files the copy carries from upstream in `repin.rootFiles`. The re-pin report then prints one `root-file` line for each of them that upstream changed, however long the `not-copied` list is. A line that says no overlay owns the file means its upstream change is carried over by hand, or the file is adopted. A line that says to rebase the overlay means an overlay owns it and its source needs the upstream change.

What a re-pin leaves out, it lists. Each upstream change under `repin.exclude`, or under a top-level file or folder of the copy outside the copied roots, prints as a `not-copied` line, up to 20, then one line with the count of the rest. `report.json` keeps the full list. A top-level link, such as a `specs` link to the project's own folder, is skipped. Carry each listed change over by hand when it applies. For the shipped `AGENTS.md` sections, `/doctor:agents-md` owns that merge.

What the overlays write over after the copy, it lists too. Each prints as an `upstream-lost` line, and `report.json` keeps them under `upstreamLost`. A `json-entry` `set` prints one line per item upstream added to an array the set replaces and the result lacks, and one line when it overwrites a value upstream changed. A `setKeyOnItem` prints one when it overwrites a key upstream changed on its item. A `directory` overlay prints one per file upstream added or changed under it that its source lacks, and a `skill-root` overlay one per such file in a folder it replaces, leaving out its retained paths. The apply after the copy deletes those files. A value or file upstream did not change is the overlay's own choice from an earlier pin and is not listed. A path a `remove-root` entry or a skill-root `remove` list names goes by design and is not listed either. None of these lines stops the run. Carry each change into the overlay source by hand when it applies.

```json
"repin": {
  "runtimeFolders": [".claude", ".codex", ".cursor", ".devin", ".dsh", ".opencode", ".pi", ".vibe"],
  "exclude": [".opencode/scripts"]
}
```

### The Two Runs

1. Run `/doctor:overlay repin --upstream <checkout> --to <commit>`. It first builds the re-pinned tree in a temporary copy and reports how many paths it will copy and delete. The report also lists the blocked overlays, the overlays that now equal upstream, the `not-copied` changes, the `upstream-lost` changes and a `NOTE` line for each insert anchor the new copy no longer holds. The copy has no project install behind it, so it skips the manifest's `regenerate` and `verifyGenerated` steps and prints how many it skipped. A clean stage proves the copy and the overlays, not the generators. It ends `RESULT: STAGED` and exits 0. A stage that lists a blocked overlay or a failed check ends `RESULT: BLOCKED` and exits 1, so `STAGED` always means the copy re-pinned clean.
2. Rebase each blocked overlay onto the new upstream file, and drop each entry that now equals upstream. A `file` entry records the rebase in `pinnedSha256`. A `directory` or `skill-root` entry has no hash per file, so once you have read upstream's changes under it, set its `rebasedOnto` to the commit you are re-pinning to. The value holds for that one commit, so the next re-pin asks again. Then run the command again.
3. When the report lists nothing blocked, approve it. The live run backs up every path it will touch, copies, sets the pin, applies the overlays twice and runs the full check.

The run refuses before any write when a file no overlay owns differs from the pinned commit. That file holds an edit made in place, which the copy would revert. Move the edit into an overlay or upstream first.

Two cases are not edits made in place. A file a `regenerate` step writes is the project's own output once the step lists it under `outputs`, so list there every file a generator writes, including a field it adds to an upstream file. A link the new commit replaces with a folder is deleted before the folder's files are written, so a file seen through that link does not count as a copy at the new path.

A `regenerate` step can also rewrite a file an overlay owns. The live run then fails and prints a `regenerated <path>` line in place of `upstream-moved`. It names the overlay and the step, because the upstream diff for that path holds none of the change. A plain `apply` prints the same line. If the step's output is right, carry it into the overlay copy and run `apply`. Otherwise change the step so it leaves the file alone. A stage skips the steps, so only the live run can print this line.

### Rolling Back

Every live run keeps its backup in `<overlayDir>/repin-runs/<run-id>/`. When a run fails after its backup, it prints the rollback line:

```bash
node .skilled/commands/doctor/scripts/overlay-engine.cjs repin --rollback <run-id>
```

Rollback restores each backed-up file byte for byte and removes the files the run created. Run `/doctor:overlay status` afterwards to confirm the tree is back in sync.

With a sibling overlay folder, the backup also keeps the overlay folder's own files, as `area: "overlay"` entries under `<run>/overlay-backup/`, and rollback restores each file against its own root. `repin --stage <dir>` copies the tree to `<dir>/<tree name>` and the overlay folder to `<dir>/<overlay name>`, and it writes nothing live. It prints `staged tree root: <dir>/<tree name>`, the folder to pass as `--root` to a later `status`, because `<dir>` itself holds no setting file. It refuses a stage folder inside the overlay folder.

### Moving an existing tree onto the new layout

The layout path puts each copy under `framework/` when its destination sits under `.skilled/` and under `root/` otherwise. A tree whose overlay folder still keeps its copies at the older paths, the destination with its leading dots dropped and no prefix, needs no change to keep working:

- After the re-pin to an engine with this layout, `status` prints a `LAYOUT` note for each copy off its layout path. It prints at most 20 of them, then one overflow line, and `status --json` lists every move in `offLayout`.
- `status` still ends `RESULT: PASSED`. A `LAYOUT` note never fails it, and nothing is refused, because the engine reads each `source`, `fragment` and `base` exactly as the manifest names it, so every overlay keeps applying.
- The one action is `/doctor:overlay apply --relayout`, run once. It moves every copy `offLayout` lists, backs each one up first, and points the manifest at the new paths. The next `status` prints no `LAYOUT` line.
- Skipping it breaks nothing. Until it runs, though, `apply --adopt` writes each new entry at its `framework/` or `root/` path, so the folder holds both layouts side by side until the relayout moves the older copies.
- Adopting a path under `repin.exclude` accepts a copy at the older path too, and when both copies exist it takes the `framework/` or `root/` one.

---

## 6. ADOPTING THE ENGINE WITH EXISTING OVERLAYS

A project that already keeps its own overlay folder and replay script moves onto the engine without moving a file first. The engine reads the same manifest shape and the same `sync-state.json` shape, `{ "schemaVersion": 1, "pin", "files" }`, so the folder stays where it is. The first `apply` rewrites the state as schema version 2.

1. **Name the folder.** Add `.skilled-overlays.json` at the root of the vendored copy with `{ "overlayDir": "<folder>" }`. Without it the engine looks in `skilled-overlays/`, and `status` stops with an error that says so.
2. **Run `/doctor:overlay status`.** Each entry that walks a token-named file prints a `MISS` line naming the file. Add each one to that entry's `protectedPaths`, by its path relative to the entry.
3. **Add the `repin` block** from §5 when the copy keeps a real folder where upstream ships a link, or when it vendors a different set of runtime folders.
4. **Check the generated surfaces.** The manifest's `regenerate` and `verifyGenerated` steps run after an `apply` that wrote something, after one that follows a failed regeneration, which `status` reports on a `REGEN` line, and after every apply a re-pin makes. An `apply` that prints `0 changed` with nothing pending runs neither. Each command runs at the tree root, so review the list rather than copying one from a folder you do not trust. A verify step only fails when its command can fail: `skill-graph-freshness.cjs` reports and exits 0 unless it gets `--strict`.
5. **Expect `LAYOUT` lines.** Each copy that sits off its `framework/` or `root/` path prints one, as [Off-Layout and Stale Sources](#off-layout-and-stale-sources) describes. They never fail `status`. Run `/doctor:overlay apply --relayout` once when you want the copies moved onto their layout paths.
6. **Run `status` again** until it prints `RESULT: PASSED`, then use `apply` and `repin` as usual.

A replay script the project keeps beside the engine can keep reading the same folder. It reads only the keys it knows, and the engine ignores keys it does not read, such as a fork's own certificates. A script must not write `sync-state.json`: one that writes it as version 1 drops the records of the items and values the `json-entry` overlays wrote, and those then stay in the live files after they leave an entry set. Retire the script once nothing depends on its extra keys or states.

---

## 7. RELATED RESOURCES

- `.skilled/commands/doctor/overlay.md`: the command router.
- `.skilled/commands/doctor/scripts/overlay-engine.cjs`: the engine, whose header lists every target and exit code.
