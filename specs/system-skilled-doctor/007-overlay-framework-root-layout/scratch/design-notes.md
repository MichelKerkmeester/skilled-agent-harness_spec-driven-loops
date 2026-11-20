# Design notes for the overlay framework/root layout

Working notes the phase docs draw on. Engine line numbers refer to
`.skilled/commands/doctor/scripts/overlay-engine.cjs` (6419 lines) at the
working-tree state of 2026-11-20. Barter paths are under
`/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit`.

## Verified engine facts

- `SETTING_FILE = '.skilled-overlays.json'`, `DEFAULT_OVERLAY_FOLDER = 'skilled-overlays'` (`:72-73`).
- `resolveOverlayDir` refuses `.`, `..` and anything starting `../` (`:442-444`).
- `createContext` joins the label onto the tree root (`:455-466`), so the overlay root is always inside the tree today.
- `relativeKey(root, file)` throws `destination escapes the sync root` for any path outside `root` (`:168-175`).
- `sourceRelative(ctx, p)` makes a path relative to the overlay root and throws when it escapes (`:649-655`).
- `adoptSource(key)` drops leading dots (`:5399-5401`). Callers: `layoutMoves` (`:3362-3385`), adopt (`:5563`), and the strict-write refusal message (`:5462`).
- LAYOUT notes are advisory: `commandStatus` computes `offLayout` (`:3567`) but `isInSync` (`:3569-3570`) does not read it.
- `relayoutUnderLock` (`:6215-6267`) renames inside the overlay folder, backs up under `relayout-runs/<stamp>` and rewrites the manifest and link targets. It never moves the overlay folder itself. Backup paths go through `relativeKey(ctx.root, ...)` (`:6248-6250`), which throws once the overlay folder is outside the tree.
- `--stage` copies only the tree (`copyTreeForStage`, `:5094`) and then calls `createContext(stageDir)` (`:5175`), so a `../overlays` label would resolve beside the stage folder, not to the live or a copied overlay folder.
- `notCopiedChanges` filters upstream paths under the overlay label (`:4670`) and the re-pin refuses an overlay folder inside a copied root (`:4988`). Both compare the label as a tree-relative path. With `../overlays` both become no-ops, which is the right outcome, but it should be explicit.
- `strictWriteRefusal` returns null (allow) for any path outside the tree root (`:5439`), so edits inside an out-of-tree overlay folder pass the guard.
- `stagedUnownedChanges` builds the manifest's git path as `prefix + path.relative(ctx.root, ctx.manifestPath)` (`:5706`). For `skilled/` + `../overlays/overlay-manifest.json`, `path.posix.join` normalizes to `overlays/overlay-manifest.json`, which is right. When the tree is the git top level the prefix is empty and the path stays `../overlays/...`, so `git show` fails and the pin-change exemption silently stops working.
- The re-pin runs the vendored engine: `ENGINE_COMMAND = 'node .skilled/commands/doctor/scripts/overlay-engine.cjs'` (`:86`). Barter must take the new engine with a re-pin while still on the old layout and location.
- `sync-state.json` keys `files` by destination path (Barter `sync-state.json`, schemaVersion 2), so a relayout or folder move does not need to rewrite it.

## Barter facts

- `skilled/.skilled-overlays.json` is `{ "overlayDir": "barter-overlays" }`.
- Manifest: 133 entries. Scopes: file 99, directory 17, json-entry 13, marked-section 1, skill-root 1, remove-root 2. Source top segments: skilled 110, opencode 11, vibe 3, pi 3, AGENTS.md 1, REPO RULES.md 1, utcp_config.json 1, opencode.json 1, none 2 (the remove-root entries).
- `repin.rootFiles`: AGENTS.md, REPO RULES.md, .utcp_config.json. `.skilled-overlays.json` is not a root file, so a re-pin leaves it alone.
- The manifest owns Barter's guard hooks as overlays, among them `.skilled/hooks/barter-overlay-guard`, `.skilled/hooks/barter-git-write-gate`, `.opencode/scripts/git-hooks/pre-commit`, `.opencode/plugins/barter-overlay-guard.js`.
- `skilled/specs` is a link to `../specs/skilled-barter-overlays`, a spec track name. Not the overlay folder.

## Decisions taken in the plan (each open to the operator)

1. **Location.** `overlayDir` may also name `../<one segment>`, a sibling of the tree root. Deeper climbs (`../../x`, `../a/b`) stay refused.
2. **Naming rule switch.** A manifest field `"sourceLayout": "framework-root"` turns on the new rule. Absent means today's rule (`"mirror"`). LAYOUT notes are advisory, so a global flip would not fail anyone's status, but `--adopt` would start writing `framework/` paths into old-layout folders and every consumer's status would print a LAYOUT line per entry. The switch keeps every existing consumer unchanged.
3. **Rule.** Under `framework-root`: destination `.skilled/X` maps to `framework/X`; any other destination `X` maps to `root/` plus `X` with its leading dots dropped; a `source`, `fragment` or `base` under `root/skilled/` is refused as a blocked overlay.
4. **Stage.** With an out-of-tree overlay folder, `--stage <dir>` copies the tree into `<dir>/<tree folder name>` and the overlay folder into `<dir>/<overlay folder name>`, so the sibling resolves inside the stage and a stage never writes the live overlay folder.
5. **Move order on the Barter side.** Re-pin first (old layout), then relayout in the tree, then move the folder. One commit per step, so each reverts on its own.
6. **Setting file stays in the tree.** `skilled/.skilled-overlays.json` keeps naming the folder, now `../overlays`. It is Barter's own file, not vendored content.

## Revision after the operator's answers (2026-11-20)

The operator answered the six open questions:

1. The `framework/` + `root/` rule is the default for every engine consumer. There is no opt-in `sourceLayout` field.
2. Only a direct sibling `../<name>` is allowed.
3. An overlay folder outside the git repository is refused.
4. The stage holds `<dir>/<tree>` and `<dir>/<overlays>`.
5. `skilled/.skilled-overlays.json` stays in the vendored copy.
6. Phase 004 records the commit phase 003 produces.

### Migration decision for existing consumers (phase 002)

- **Sources are always read verbatim from the manifest.** `planFileOverlay` joins `entry.source` onto the overlay root (`overlay-engine.cjs:1817`), and `planDirectoryOverlay` does the same (`:1855`). The naming rule never decides what `apply` writes. It decides only four things: the source `--adopt` creates (`:5563`), the strict-write and adopt hint text (`:5465`, `:5469`, `:5556`), the LAYOUT notes (`layoutMoves`, `:3362-3385`) and the `apply --relayout` targets. So flipping the default changes no destination byte on any tree.
- **Old-layout trees keep working, with a standing notice. Nothing is refused.**
  - `status` and `apply` keep reading the old sources.
  - `status` reports off-layout sources as LAYOUT notes and still prints `RESULT: PASSED`. `isInSync` ignores `offLayout` (`:3569-3570`), and LAYOUT is not in `BLOCKING_STATES` (`:85`).
  - To keep one notice per entry from drowning the lines that matter, status prints at most 20 LAYOUT lines, then one `LAYOUT   … N more; run <engine> apply --relayout` line. This follows the existing `NOT_COPIED_SHOWN = 20` cap (`:4646`). `status --json` keeps the full `offLayout` list.
- **Why not refuse.** A consumer gets the new engine only through a re-pin, and the re-pin applies with the old vendored engine before the new one is in place (`ENGINE_COMMAND`, `:86`). A refusal in the new engine would land on every consumer's first status after the re-pin, before it could act. A refusal also buys no correctness, since verbatim reads apply old sources correctly.
- **Why not keep the old rule for old trees.** Detecting "this tree is on the old layout" and switching rules per tree is the opt-in switch the operator rejected, only implicit. One rule, with a notice, is simpler and makes every consumer converge.
- **Transition window.** None is enforced, and old-layout trees are supported with no deadline. Retiring support for reading old-layout sources would be its own future packet. It is not planned here.
- **A consumer that never runs relayout.** Every re-pin and apply keeps working, because layout never blocks (`:85`, `:3569-3570`), and status keeps the notice. The one visible change is `--adopt`, which writes new entries at `framework/…` or `root/…`. The folder is mixed until a relayout, and the mixture is harmless because each entry names its own source.
- **The one action to take** is `apply --relayout`, once, after the re-pin. It moves every copy, rewrites the manifest and retargets the layout links. It never refuses for layout reasons. It refuses only a move whose target is taken (`follow-up.test:1143-1170`) and an entry whose new-rule path would land under `root/skilled/` (a destination starting `skilled/` with no dot). Such an entry stays where it is and is named.
- **Rollback.** A `git revert` of phase 002 brings the old default back. A tree already relaid out still applies correctly through the verbatim reads, and gets LAYOUT notes pointing back. That is advisory only, so a revert breaks no consumer in either direction.
- **Test cost.** These existing expectations change because the default changed: the LAYOUT and relayout section of `overlay-engine-follow-up.test.cjs` (`:899-1170`, including `:903` and `:957`) and the ten mirror-path expectations in `overlay-engine-strict-writes.test.cjs` (`:173`, `:189`, `:279`, `:356`, `:554`, `:573` and others). Fixture sources stay on the old layout on purpose. They now also prove that old sources still apply.

### Barter sequencing (old phases 004 and 005)

- **Merged into one phase, `004-barter-repin-and-relayout`, run in one ai-speckit session.** Once the re-pin lands, all 131 Barter entries are off-layout under the new default. Leaving that state across sessions risks an `--adopt` that mixes the folder, and it makes a handoff state ("status passes with zero LAYOUT") impossible to state between two phases.
- **Three commits so each step reverts alone:**
  - the re-pin;
  - its changelog record;
  - the relayout, together with the path fixes in tests and docs.
- **Ordering guarantee inside the phase.** No `--adopt` and no overlay edit runs between the re-pin and the relayout. The phase is not closeable until status shows zero LAYOUT lines.
- **Renumbering.** Old phase 006 becomes `005-barter-move-overlays-out-of-tree`.
