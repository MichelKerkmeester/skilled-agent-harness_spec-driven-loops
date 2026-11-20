# Upstream docs and hooks inventory (worker C, @context on Opus, read-only)

Orchestrator spot-checks, all confirmed by reading the lines: `doctor-overlay-presentation.txt:557`, `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs:61-82`, `references/overlays.md:92`, `doctor-overlay-repin.yaml:76`.

## A. Docs stating the location or naming rule
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:557`: "The setting must name a relative folder inside the tree with forward slashes". Contradicts `../overlays`. Highest priority.
- `.skilled/skills/system-skilled-doctor/references/overlays.md:51`: "The value is a path relative to the tree root. With no setting file the folder is `skilled-overlays/`". Must say the folder may sit beside the tree.
- `references/overlays.md:60`: "The setting lives outside `.skilled` because a re-copy overwrites that folder". Recheck the wording.
- `references/overlays.md:92`: the layout path is "the entry's destination path with the leading dot dropped". Old rule.
- `references/overlays.md:96`: relayout backup under `<overlayDir>/relayout-runs/<stamp>/`. The description of what moves where changes.
- `references/overlays.md:188`: adopt copies "at the same path without its leading dot". Old rule.
- `doctor-overlay-presentation.txt:115`: LAYOUT example, "moves it to the same path with the leading dot dropped". Old rule.
- `doctor-overlay-presentation.txt:228`: "Will copy: the path into [overlay folder]/[the same path without its leading dot]". Old rule.
- `doctor-overlay-presentation.txt:273`: "the copy keeps the same path with the leading dot dropped". Old rule.
- `doctor-overlay-presentation.txt:170, 278, 552`: neutral. An example could show a `../` value.
- `.skilled/commands/doctor/overlay.md:108`: relayout "moves each one onto its layout path with the leading dot dropped". Old rule. `overlay.md:105` is neutral.
- `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:34` and `.skilled/commands/doctor/_routes.yaml:699`: "moved inside the overlay folder to the same path with the leading dot dropped". Old rule.
- `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml:76`: the workflow itself reads `.skilled-overlays.json` and lists `<overlay folder>/repin-runs/<id>/` with find. It must resolve a `../` value against the tree root.
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml:187`: "overlay-manifest.json exists in the folder .skilled-overlays.json names". The workflow resolves this itself and must handle `../`.
- `doctor-overlay-apply.yaml:48`, `doctor-overlay-repin.yaml:47`, `doctor-overlay-status.yaml:35`: the setting stays at the tree root. No change.
- Manual testing playbook `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/`: sources written `skilled-overlays/skilled/...` for the old rule. Files:
  - `adopt-an-unowned-file.md:30,42,43,53,58`
  - `pre-commit-refuses-unowned-change.md:30,42,43,65`
  - `relayout-moves-sources.md:30,58`
  - `status-audit-lists-unowned-drift.md:42,53,68`
  - `strict-guard-refuses-unowned-write.md:30,41,42,56`
  - the SKD-006 and SKD-009 summaries in `manual-testing-playbook.md:145-175`

  They stay valid under the default `mirror` layout. A new scenario covers `framework-root`.
- `.skilled/skills/system-skilled-doctor/README.md:110,140`: neutral.
- `.skilled/commands/doctor/scripts/README.markdown`: does not document `overlay-engine.cjs` at all. That is a gap, not a statement of the rule, and is out of scope.
- No feature catalog exists.

## B. Hooks and gates
- `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs:61-64`, `couldHaveOverlays`: true when `.skilled-overlays.json` or `skilled-overlays/` exists at the tree root. A sibling folder always comes with the setting file, so this stays correct.
- `overlay-guard.cjs:71-74` calls `engine.createContext(treeRoot).manifestPath`, and `:81` spawns `--guard <abs> --root <tree>`. The engine owns the decision. `strictWriteRefusal` allows a path outside the tree root (`overlay-engine.cjs:5439`).
- `.opencode/plugins/overlay-guard.js:27,109`, `.vibe/plugins/repo-guards/overlay-guard.mjs:18`, `.pi/extensions/overlay-guard.ts:44`: thin adapters over the core. Not affected.
- `.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs:184`: "custom overlayDir is honoured" covers an in-tree folder only. Nothing tests a sibling folder.
- `.skilled/scripts/git-hooks/*`: nothing overlay-related.
- The engine `pre-commit` is called from a project's own hook. Its git-index read of the manifest is at `overlay-engine.cjs:5706-5708`.
- Engine tests stating the current rule:
  - `tests/overlay-engine-fixtures.cjs:7`
  - `overlay-engine-follow-up.test.cjs:903,1210`
  - `overlay-engine-strict-writes.test.cjs:173,189,279,356,554,573`

## C. Other references
- `.skilled/bin/**`: none.
- system-spec-kit trigger-index fixtures: regenerated data. Not edited by hand.
- `.vibe/plugins/repo-guards/fixtures/overlay-guard/tree/skilled-overlays/overlay-manifest.json` and the cli-mistral-vibe overlay-guard playbook: in-tree, explicit sources. No change.
- `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:216,239`: pins the flags only.
- Root `README.md:79`: "lives in an overlay folder next to the copy". Already fits.

## D. Mirrors
- `.codex/prompts/doctor-overlay.md` is generated by `.skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs` and only points at the canonical file.

## E. Versions
- `system-skilled-doctor` `SKILL.md:5` is `version: 1.1.8.0`. The latest changelog is `changelog/v1.1.8.0.md`.
- `overlay.md` has no version field.
