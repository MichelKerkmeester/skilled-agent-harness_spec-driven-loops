# Review Iteration 009

## Dispatcher

- Mode: review, single iteration, LEAF executor (no nested dispatch)
- Run: `fanout-deepseek-flash-max-1795182837437-sws2tv`, generation 1, lineageMode `new`
- Frontier node: `F-1-005` at depth 1 of 3
- Dimension: maintainability
- Operator review focus: the whole overlay framework/root layout change end to end. This iteration addressed the focus through its docs-against-code clause at the Barter surface: whether `overlays/README.md` and the git-hooks README describe the hooks and the folder layout that actually ship.

## Files Reviewed

- `barter/ai-speckit/overlays/README.md:8,26-38,40-55,76-86,155,190,234,385-396,429-430,440-460`
- `barter/ai-speckit/overlays/framework/scripts/git-hooks/README.md:1-40`
- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:83-118`
- `barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:52-84`
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:73` (`DEFAULT_OVERLAY_FOLDER`)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5484-5488` (`adoptSource`)
- `barter/ai-speckit/overlays/` (folder listing against the README tree)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `overlays/README.md:8,55`; `overlay-engine.cjs:5484-5488`; `overlays/overlay-manifest.json` | The README's layout rule, its two adopt examples and its `root/skilled` refusal all match `adoptSource` and the manifest. |
| `checklist_evidence` | partial | `overlays/README.md:47,234`; `pre-commit:85-92` | The README states the commit hook runs `status` then `pre-commit` and that the overlay copy adds a refusal when either fails, without saying the refusal is skipped when the folder is missing. That is the documentation half of `R2-P1-001`, already recorded, so it is not re-raised here. |
| `skill_agent` | pass | `overlays/README.md:52`; `barter-overlay-guard-core.cjs:52-84` | The README names the guard core's overlay path and the plugin that calls it, and both resolve as described. |

## Integration Evidence

- `overlays/README.md:8` states the folder sits at `ai-speckit/overlays/` beside `ai-speckit/skilled/`, whose `.skilled-overlays.json` names it as `../overlays`. The setting file and the folder both exist at those paths.
- `overlays/README.md:55` gives two adopt examples, `.skilled/skills/sk-new` to `overlays/framework/skills/sk-new` and `.opencode/plugins/x.js` to `overlays/root/opencode/plugins/x.js`; both follow `adoptSource` exactly, including the leading-dot drop on the second.
- `overlays/README.md:440-460`'s folder tree matches the disk: `framework/` holds `bin`, `changelog`, `commands`, `hooks`, `repo-rules`, `scripts`, `skills`, and `root/` holds `AGENTS.md`, `opencode`, `opencode.json`, `pi`, `REPO RULES.md`, `utcp_config.json`, `vibe`.
- `overlays/README.md:52` names `framework/hooks/barter-overlay-guard/` as the core the OpenCode plugin calls, which is where `findBarterOverlays` resolves the overlay-source copy.
- `overlays/README.md:31` says the engine's `--root` defaults to the tree it is vendored in and that `.skilled-overlays.json` at that root names the folder; it does not state a default folder name, so it cannot disagree with `DEFAULT_OVERLAY_FOLDER = 'skilled-overlays'` (`overlay-engine.cjs:73`).
- `overlays/README.md:234` describes the `.opencode/scripts/` folder, its live `pre-commit`, the canonical overlay copy and the five hand-over entries, which matches the manifest's `file` entries for that folder.

## Edge Cases

- **The README's commit-hook paragraph is incomplete in the same way `R2-P1-001` records.** `:47` says the hook runs `status` then `pre-commit` and that both must pass; `:234` says the overlay copy adds a refusal when either fails. Neither says the refusal is skipped when the overlay folder is missing. Recorded as the documentation half of an existing finding rather than as a new one, so the registry does not carry two rows for one defect.
- **`framework/scripts/git-hooks/README.md` documents upstream's `.skilled/scripts/git-hooks/` hooks, not Barter's `.opencode/scripts/git-hooks/pre-commit`.** Recorded, not raised: it is an overlay copy of an upstream document, and decision D6 puts overlay content changes beyond paths out of scope.
- **The README's folder tree was compared against the disk, not against the manifest.** Recorded so the coverage claim is bounded: the tree is accurate, but this pass did not verify that every manifest entry lands in a folder the tree names.
- **Tests were not re-run** for the containment reason recorded in iteration 1.

## Confirmed-Clean Surfaces

- The README's opening paragraph states the exact layout decision D4 requires, naming both the folder and the setting file's value.
- Both adopt examples in the README follow the shipped rule, including the leading-dot drop that is easy to get wrong.
- The folder tree in the README matches the disk entry for entry, in both `framework/` and `root/`.
- The README names the guard core's overlay path correctly, which is the path `findBarterOverlays` resolves for the overlay-source copy.
- The README does not assert a default folder name, so it cannot drift from `DEFAULT_OVERLAY_FOLDER`.
- The README's `.opencode/scripts/` paragraph matches the manifest's hand-over entries and the reason they are written by hand rather than adopted.

## Ruled Out

- **The README's layout rule differs from the engine's.** Checked and ruled out: `:8` and `:55` match `adoptSource` and the setting file on disk.
- **The README's folder tree is stale after the move.** Checked and ruled out: both `framework/` and `root/` listings match entry for entry.
- **The README names a guard core path the plugin does not use.** Checked and ruled out: `:52` names `framework/hooks/barter-overlay-guard/`, which is the overlay-source anchor.
- **The README asserts a default folder name that differs from the engine's.** Checked and ruled out: it asserts none.
- **The README's adopt examples use the old dot-dropped rule.** Checked and ruled out: both use `framework/` and `root/`.

## Next Focus

- Dimension: maintainability
- Focus area: frontier node `F-1-007` -- whether the Barter re-pin's records are maintainable as records: the `v4.1.0.0` changelog's structure, the `sync-state.json` shape, and whether the pin block carries what a later re-pin needs
- Reason: the last uncovered node-and-dimension pair; covering it completes all four dimensions on all three frontier nodes
- Rotation status: third pass on F-1-007; F-1-003 and F-1-005 are complete on all four dimensions
- Blocked/productive carry-forward: productive -- reading the pin block beside the changelog in iteration 3 established the record shapes this pass judges
- Required evidence: `overlays/overlay-manifest.json` `pin` block, `overlays/sync-state.json` shape, `overlays/framework/changelog/skilled-coder/v4.1.0.0.md` structure, and the phase 004 runbook

Review verdict: CONDITIONAL
