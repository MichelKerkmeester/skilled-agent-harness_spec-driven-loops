# Iteration 003 - Frontier node F-1-006: correctness

## Dispatcher
- Lineage opus-medium, iteration 3 (2 prior iteration records). steer.md absent. Node F-1-006 marked active; dimension correctness.
- Review focus addressed: the Barter side of the change in the nested repo barter/ai-speckit, commits 64cfee51628..ad3246feba2: re-pin (c8cd005b173), relayout onto framework/ and root/ (51e218edf2e), hooks learning the beside-tree location (a954fc956ce), the move to overlays/ (2a8f454c8d1), and leftover references to the old barter-overlays path.

## Files Reviewed
- barter/ai-speckit/skilled/.skilled-overlays.json:1 (`{"overlayDir": "../overlays"}`)
- barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:52-82,143-162
- barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:10-47
- barter/ai-speckit/skilled/.opencode/scripts/git-hooks/pre-commit:83-112
- barter/ai-speckit/skilled/.claude/hooks/barter-git-write-gate.mjs:182-183
- barter/ai-speckit/.gitignore:65-72
- barter/ai-speckit/init-repository.sh, sync-skilled-specs.mjs, tests/init-repository.test.sh, tests/node-version-policy.test.sh (diff of 2a8f454c8d1)
- barter/ai-speckit/overlays/tests/compiled-routing-byte-parity.test.cjs:60-80
- rg "barter-overlays" across barter/ai-speckit (non-spec, non-index hits)

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **.gitignore ignores overlays/repin-runs/ but not overlays/relayout-runs/** -- barter/ai-speckit/.gitignore:68 -- The documented migration step after a re-pin is `apply --relayout`, and the engine writes its backup to `<overlay folder>/relayout-runs/<stamp>/` (Skilled overlay-engine.cjs:6370). With the overlay folder now at ai-speckit/overlays, that backup lands in the ai-speckit worktree as untracked files beside the sources, and nothing ignores it, while the parallel repin-runs/ backup is ignored. The gap predates the move (the old rule covered only skilled/barter-overlays/repin-runs/) but the change makes relayout the standard upgrade step.
   Finding class: repository hygiene
   Scope proof: .gitignore:65-72 lists only /overlays/repin-runs/ and the two framework build-output globs; no tracked or ignored relayout-runs path exists (git ls-files overlays shows none).
   Affected surface hints: barter/ai-speckit/.gitignore
   Case: an operator runs `/doctor:overlay apply --relayout` after the next re-pin and `git add -A`, which commits the backup copies under overlays/relayout-runs/<stamp>/.
2. **A test fixture still names the overlay folder barter-overlays** -- barter/ai-speckit/overlays/tests/compiled-routing-byte-parity.test.cjs:64 -- The workspace fixture builds `path.join(root, 'barter-overlays')`. The check under test takes the folder as an argument, so the test still passes, but this is the one live, non-spec, non-index reference to the old folder name left in the repository after 2a8f454c8d1, which says every script and test moved to overlays/.
   Finding class: leftover reference
   Scope proof: rg "barter-overlays" outside specs/ and .index/ returns this line plus the spec-track name `specs/skilled-barter-overlays/`, which is a different identifier (the agent's spec track).
   Affected surface hints: overlays/tests/compiled-routing-byte-parity.test.cjs
   Case: a later grep-based audit for the old folder name flags this fixture, or a maintainer copies the fixture shape into a test that does depend on the folder name.

## Traceability Checks
- spec_code (pass): the move commit's stated changes (setting file ../overlays, init-repository.sh OVERLAYS_DIR, sync-skilled-specs.mjs MANIFEST, both shell tests, hooks recognising only the beside-tree folder) are each present in the diff.
- checklist_evidence (notApplicable this iteration; the ai-speckit close-out record is reviewed under F-1-008).

## Integration Evidence
- Barter edit guard core (barter-overlay-guard-core.cjs:69-82) resolves both the applied copy (skilled/.skilled/hooks/...) and the source copy (overlays/framework/hooks/...) four levels up to the right anchor, and refuses to locate a layout unless the tree holds the engine and the overlays folder holds the manifest.
- OpenCode adapter (barter-overlay-guard.js:38-45) catches every core throw and allows the edit with a stderr line: fail-open, as its header says.
- Barter pre-commit (pre-commit:83-91) re-anchors TREE_ROOT to skilled/ when the hook resolved to the repo root, and skips the overlay checks when no beside-tree manifest exists.
- barter-git-write-gate.mjs:182-183 accepts only the beside-tree manifest.

## Edge Cases
- Pre-commit skips the overlay checks silently when overlays/overlay-manifest.json is absent (pre-commit:88-95). That is the same fail-open shape as before the move; recorded, not raised.
- Tracked symlinks under overlays/framework/skills/sk-code/*/references/workflow-*.md dangle inside the overlay folder (they target ../../shared/references/...), and resolve only once applied into the tree. They dangled the same way at the old in-tree place (rename R100 in 51e218edf2e and 2a8f454c8d1), so the move did not break them.

## Confirmed-Clean Surfaces
- init-repository.sh, sync-skilled-specs.mjs and both shell tests point at overlays/.
- Guard locate logic covers both realpaths of the core.

## Ruled Out
- `specs/skilled-barter-overlays/` hits: a spec track name, not the folder.
- .index/*.json hits: generated retrieval index content from spec paths.

## Next Focus
- Dimension: correctness
- Focus area: F-1-008 packet traceability
- Reason: frontier rotation

Review verdict: PASS
