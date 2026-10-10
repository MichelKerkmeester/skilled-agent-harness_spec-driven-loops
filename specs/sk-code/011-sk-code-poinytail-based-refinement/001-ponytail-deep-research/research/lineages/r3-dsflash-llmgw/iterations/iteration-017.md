# Iteration 17: benchmark, feature-catalog and the root playbook

## Focus

Part 3, sixth slice: the hub-root areas the earlier iterations never opened — `feature-catalog/`, `benchmark/` and the root `manual-testing-playbook/` — checked for stale claims and index-versus-file parity. This follows iteration 16's Recommended Next Focus.

## Actions Taken

1. Read the feature catalog and both catalog entries for their stated mode and surface vocabulary.
2. Diffed the root playbook's scenario IDs (index versus every scenario file) as a set operation.
3. Checked the benchmark README's successor and retirement claims against the file it names.
4. Compared the hub `SKILL.md`'s layout tree with the directories that exist at the hub root.

## Findings

1. **The feature catalog still describes a two-surface hub with pre-rename mode names.** The catalog says the hub "resolves a WORKFLOW mode (`quality`, `code-review`) and bundles zero-or-more read-only SURFACE evidence packets (`code-webflow`, `code-opencode`)" [SOURCE: .skilled/skills/sk-code/feature-catalog/feature-catalog.md:15] and repeats it in "Current Reality" [SOURCE: .skilled/skills/sk-code/feature-catalog/feature-catalog.md:35]; the two-axis entry repeats the same names and the same two-surface bundle example `[code-review, code-webflow]` [SOURCE: .skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md:28]. `mode-registry.json` carries five modes with canonical keys including `sk-code-obsidian` [SOURCE: .skilled/skills/sk-code/mode-registry.json:98], and the catalog's own `last_updated` is 2026-07-21 [SOURCE: .skilled/skills/sk-code/feature-catalog/feature-catalog.md:9], before the Obsidian packet's 0.x line. Reproducing case: `rg -n "code-webflow|code-opencode|code-review" .skilled/skills/sk-code/feature-catalog/` prints three rows; the registry's key list contains none of those spellings. NEW, P2 (fourth and fifth instances of the two-surface prose; this one is the hub's own capability inventory).
2. **The hub `SKILL.md` layout tree omits six artifacts that exist at the hub root.** The tree lists `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, the five packets and `shared/` [SOURCE: .skilled/skills/sk-code/SKILL.md:144], while the hub root also holds `README.md`, `leaf-manifest.json`, `changelog/`, `benchmark/`, `feature-catalog/` and `manual-testing-playbook/` [observed listing]. The tree is the section a new reader uses to orient; `leaf-manifest.json` and the playbook are load-bearing for the guards and the canary. Reproducing case: `ls -d .skilled/skills/sk-code/*/` plus the two files shows six artifacts absent from the tree. NEW, P2 (one layout block or one "not listed here" note fixes it; the omission of `leaf-manifest.json` is the meaningful one because the router guard validates it).
3. **The root playbook, the benchmark README and the successor chain all check out.** The root playbook declares 31 scenario IDs across nine families and its 33 scenario files reference exactly those 31 IDs with an empty set difference in both directions [computed over the index and every scenario file]; the benchmark README's named successor `.github/workflows/routing-registry-drift.yml` exists, and its retired-lane and four-restored-checks rows match the guard the run already executed [SOURCE: .skilled/skills/sk-code/benchmark/README.md:14] [SOURCE: .skilled/skills/sk-code/benchmark/README.md:16]. ALREADY-ADOPTED, P2, no action.

## Questions Answered

- None fully. The benchmark/playbook leg is clean; the feature catalog and layout tree carry the drift.

## Questions Remaining

- Catch-all iteration: anything not yet touched across the three parts, plus refutation checks where a finding's premise might have moved.

## Ruled Out

- **"File the catalog's `version: 1.0.0.0` against its entries' 1.0.0.x."** Catalog and entries version independently, like hub and packets; no authority statement ties them.
- **"File the benchmark reports' dates."** The tree is a frozen index by declaration; its dates are historical evidence.
- **"Re-run the router-sync leg 4."** Observed passing in iteration 14; the playbook parity check here covers the same ground at the file level.

## Dead Ends

- The root playbook's "internal design notes" rows in the automated cross-reference are the same labelled-note pattern as the review playbook; not defects.
- The two feature entries' source-anchor sections resolve to files that exist; no dead anchors found in the sampled sections.

## Edge Cases

- Ambiguous input: whether the layout tree is normative or illustrative. Chosen interpretation: the block is labelled "Layout" without a scope note, so its omissions mislead.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/feature-catalog/feature-catalog.md`
- `.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`
- `.skilled/skills/sk-code/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`
- `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` and its 33 scenario files (ID extraction)
- `.skilled/skills/sk-code/benchmark/README.md`
- `.github/workflows/routing-registry-drift.yml` (existence)
- `.skilled/skills/sk-code/SKILL.md`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.75 (two fully new findings, one ALREADY-ADOPTED verification block).
- Questions addressed: benchmark/playbook leg.
- Questions answered: none fully.

## Reflection

- What worked and why: the set-difference treatment of playbook IDs, reused from iteration 15. Two packets, two exact results; a third gap like CR-019 would have surfaced.
- What did not work and why: the feature catalog was only opened because the layout tree looked short; the stale prose there was not on any earlier plan, which argues for ending each part with a directory sweep rather than a topic sweep.
- What I would do differently: list every hub-root artifact first and assign one iteration each; the catalog would have been found in round two.

## Recommended Next Focus

The catch-all iteration: sweep for files never read in this round, refute any premise that moved, and collect the original-idea and rejection material for synthesis.
