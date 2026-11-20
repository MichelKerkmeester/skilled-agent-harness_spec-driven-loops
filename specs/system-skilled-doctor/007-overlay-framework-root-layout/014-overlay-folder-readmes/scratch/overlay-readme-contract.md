# Overlay folder README contract

Written by the Skilled session that builds the engine support. Its record is phase 014 of `specs/system-skilled-doctor/007-overlay-framework-root-layout/` in Skilled. The engine change follows this contract exactly. If the engine needs to change any line here, this file is updated first and the change is marked `AMENDED`.

## 1. Which folders need a README

Every folder in the overlay folder needs a `README.md`. That includes the overlay folder itself, `framework/`, `root/`, `checks/` and `tests/`, and every folder under them. The overlay folder is the one `.skilled-overlays.json` names, for example `ai-speckit/overlays/`.

The walk skips these folders and everything under them:
- `repin-runs/` and `relayout-runs/` directly under the overlay folder. They are the engine's runtime state and hold its backups.
- Any folder whose name starts with a dot.
- Any folder named `node_modules`.
- Any folder reached through a symbolic link. A link is never followed.

## 2. Which READMEs ship, and which are documentation only

`F` is a folder's path relative to the overlay folder. `F/README.md` **ships** when any one of these is true:
1. It is the `source` of a manifest entry of any scope. A `file` entry is the usual case.
2. `F` is the `source` folder of a `directory` entry, or sits under it. Everything inside a whole-folder entry ships.
3. `F` is the `source` folder of a `skill-root` entry, or sits under it, **and** the README's path relative to that source is listed in the entry's `replace`, or sits under a folder that `replace` lists. A skill-root entry ships only what `replace` names.

Every other `README.md` is **documentation only**.

**A new README inside a directory entry ships.** Adding a README to a folder inside a `directory` entry, or inside a `skill-root` `replace` folder, changes the vendored tree on the next `apply`. It is overlay content like any other file in that folder.

## 3. What the engine does with a documentation-only README

It never applies, adopts, captures, stages or flags it:
- **apply** never writes it to the tree.
- **adopt** never takes it over as a source. If an adopt would place a source onto an existing documentation-only README, or would turn one into content by making its folder a directory entry, the adopt refuses and writes nothing.
- **capture** never writes into it.
- **repin --stage** never puts it into the staged tree.
- **Flag** means that no status line, `--json` field, audit finding, pre-commit refusal, guard refusal, LAYOUT line or relayout move names it as drift, extra, stray, unowned or off-layout. The only place it appears is the docs leg below.

All of this also holds for an overlay folder inside the tree, the default `skilled-overlays/`.

## 4. The manifest field

There is none. The docs leg is advisory: it never changes `RESULT:`, `result` in `--json`, or the exit code. Existing adopters with no READMEs keep the same status result and the same exit. The engine therefore needs no opt-in field, and the manifest is unchanged.

## 5. What `status --audit` prints

The docs leg runs only under `--audit`. It also runs when the pin is unavailable, because it reads only the overlay folder.

It validates every README in a walked folder, shipping and documentation-only alike, with sk-doc's own validator. The engine runs `python3 <tree>/.skilled/skills/sk-doc/scripts/validate_document.py <abs README> --json` once per README, with `JEV_FEATURE_CITE_DRIFT=0` set. It lets sk-doc auto-detect the document type, and a README is invalid when `blocking_errors` is non-empty.

Human output, printed after the `AUDIT` lines and before `checked=`:

```
DOCS     missing-readme <overlay label>/<F>
DOCS     invalid-readme <overlay label>/<F>/README.md: <first blocking error message>[ (+N more)]
DOCS     skipped: <reason>
docs=<number of DOCS findings>
```

- `<overlay label>` is the same label the existing `source` fields use, for example `../overlays`. The overlay folder itself prints as just the label.
- A `skipped` line replaces the validation when python3 or the validator is missing. The `missing-readme` findings still print.
- A `skipped` line is not a finding, and does not count toward `docs=`.

`--json` adds one key beside `audit`:

```json
"docs": {
  "isValidated": true,
  "skipped": null,
  "folders": 207,
  "readmes": 170,
  "shipping": 110,
  "docOnly": 60,
  "findings": [
    { "kind": "missing-readme", "path": "../overlays/framework/bin" },
    { "kind": "invalid-readme", "path": "../overlays/checks/README.md", "errors": ["..."] }
  ]
}
```

Findings are sorted by `path`. The `docs` key is absent without `--audit`.

## 6. Notes for the ai-speckit session

- Barter ships its own copy of `local-skilled-alignment` as a directory entry (`overlays/framework/commands/assets/local-skilled-alignment`). The Skilled session adds an overlays target to `resolve-scope.cjs` and `surface-map.yaml` in Skilled's private copy. That change reaches Barter only if the ai-speckit session mirrors it into Barter's overlay copy. The Skilled session's phase 015 record lists the exact change.
- Layout links: the engine now refuses a manifest that lists one layout-link path twice. Paths are compared after `./` and trailing slashes are removed. Barter's manifest must list each path once.
