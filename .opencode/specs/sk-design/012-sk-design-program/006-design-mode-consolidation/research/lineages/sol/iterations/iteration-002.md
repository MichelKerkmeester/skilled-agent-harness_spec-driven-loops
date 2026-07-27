# Iteration 2: Styles Corpus and Storage Facade

## Focus

Determine whether the 7,812-file styles package or its storage-neutral facade creates a current operational burden that can be reduced without a new abstraction.

## Actions Taken

1. Re-read config, JSONL state, strategy, and registry; selected the reducer’s `NEXT FOCUS`.
2. Counted tracked files, bundle directories, file types, and on-disk size.
3. Inspected the styles root, library, path facade, engine/database layout, and current consumer imports.
4. Ran the supported `build --check` and query commands, then ran the stale `_engine` command still documented by active hub material.
5. Compared root README links and size with the actual `library/bundles/` authority.

## Findings

1. **Fix the active path drift before touching storage architecture.** The hub SKILL, hub README, and current manual-testing material still point to `styles/_engine/` and `styles/_db/`, but the live implementation is `styles/lib/engine/` and `styles/database/` with database code under `styles/lib/database/`. The supported path passes `build --check` with 1,290 records and serves queries; the documented `_engine` command fails with `MODULE_NOT_FOUND`. The smallest fix is a bounded path correction across active docs/playbooks—no adapter change. Cost: low; search-replace, command verification, and any generated manifest refresh. [SOURCE: .opencode/skills/sk-design/SKILL.md:207] [SOURCE: .opencode/skills/sk-design/SKILL.md:218] [SOURCE: .opencode/skills/sk-design/SKILL.md:255] [SOURCE: .opencode/skills/sk-design/README.md:72] [SOURCE: .opencode/skills/sk-design/styles/README.md:12] [SOURCE: .opencode/skills/sk-design/styles/lib/paths.mjs:15] [SOURCE: command: node .opencode/skills/sk-design/styles/lib/engine/style-library.mjs build --check] [SOURCE: command: node .opencode/skills/sk-design/styles/_engine/style-library.mjs query ...]

2. **Delete the 1,290-row root README table instead of repairing it.** `styles/README.md` is 165,030 bytes and says bundles live directly under the styles root; its table links such as `099-supply/` are broken because bundles now live under `library/bundles/`. The short bundle README and machine manifests already carry the authoritative inventory. The smallest fix is to reduce the root README to overview, supported commands, architecture links, and a pointer to `library/bundles/`/the manifest. Cost: very low; one generated or hand-maintained document shrink. Value: removes broken navigation and repeated context load. [SOURCE: .opencode/skills/sk-design/styles/README.md:5] [SOURCE: .opencode/skills/sk-design/styles/README.md:23] [SOURCE: .opencode/skills/sk-design/styles/library/README.md:5] [SOURCE: .opencode/skills/sk-design/styles/library/bundles/README.md:1] [SOURCE: command: wc -c .opencode/skills/sk-design/styles/README.md] [SOURCE: command: test -e .opencode/skills/sk-design/styles/099-supply]

3. **The facade is useful and should stay.** Current interface and motion consumers import `runQuery`/`runHydrate` from one engine surface, while `paths.mjs` centralizes the physical layout. This directly limits the blast radius of the already-completed folder restructure. Deleting the facade would spread storage knowledge back into consumers, the reverse of the requested simplification. [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:28] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:24] [SOURCE: .opencode/skills/sk-design/styles/lib/paths.mjs:1] [SOURCE: .opencode/skills/sk-design/styles/lib/paths.mjs:17] [SOURCE: .opencode/skills/sk-design/styles/lib/README.md:12]

4. **The corpus size is real but not yet an evidenced defect.** The package has 7,812 tracked files, 1,290 bundle directories, and uses 135 MB, but freshness checks pass with zero added/changed/removed records and queries return bounded cards. A database-only migration, corpus pruning, Git LFS move, or remote fetch layer would add migration and operational complexity without a measured present failure. Keep the flat corpus authoritative until clone, status, packaging, or retrieval latency is measured as unacceptable. Cost of doing nothing: repository size remains; cost of redesign: high and unjustified. [SOURCE: .opencode/skills/sk-design/styles/library/README.md:15] [SOURCE: .opencode/skills/sk-design/styles/database/README.md:5] [SOURCE: command: git ls-files .opencode/skills/sk-design/styles | wc -l] [SOURCE: command: du -sh .opencode/skills/sk-design/styles] [SOURCE: command: node .opencode/skills/sk-design/styles/lib/engine/style-library.mjs build --check]

5. **The query’s `degraded: true` is not evidence to enable persistent storage by default.** The source-scan fallback still returned eligible cards from all 1,290 records, and the current contract intentionally keeps the flat corpus authoritative. Without a latency target or failing relevance oracle, changing the default backend would be speculative optimization. [SOURCE: .opencode/skills/sk-design/styles/README.md:12] [SOURCE: .opencode/skills/sk-design/styles/library/README.md:16] [SOURCE: command: node .opencode/skills/sk-design/styles/lib/engine/style-library.mjs query ...]

## Questions Answered

- Does the storage-neutral styles facade or 7,812-file package create a current operational burden that can be reduced without a new abstraction? Yes: stale live path documentation and a 165 KB broken inventory README are current burdens. The facade and corpus topology themselves do not yet justify redesign.

## Questions Remaining

- Whether folded audit/foundations coverage has a present proof gap.
- Final recommendation ranking and rejection list.

## Ruled Out

- **Remove the storage-neutral facade:** it is the smallest existing isolation seam and has live consumers.
- **Migrate to database-only storage:** no measured failure justifies removing the flat authority.
- **Prune or remotely fetch the corpus:** would add selection policy, availability, and migration ceremony.
- **Enable the persistent backend by default:** the fallback works and no performance target was supplied.

## Dead Ends

- Counting files proves scale, not harm; it cannot justify a migration by itself.
- The user-provided “7,812 files” count is accurate, so no further inventory reconciliation is needed.

## Edge Cases

- Ambiguous input: “removable ceremony” could target the adapter itself; evidence showed the adapter reduces coupling, so the focus shifted to stale docs and duplicate inventory.
- Contradictory evidence: the engine is healthy while hub documentation points to dead paths.
- Missing dependencies: no performance baseline for clone/status/package cost; major storage recommendations are therefore rejected.
- Partial success: none.

## Sources Consulted

- `.opencode/skills/sk-design/styles/README.md`
- `.opencode/skills/sk-design/styles/library/README.md`
- `.opencode/skills/sk-design/styles/library/bundles/README.md`
- `.opencode/skills/sk-design/styles/lib/README.md`
- `.opencode/skills/sk-design/styles/lib/paths.mjs`
- `.opencode/skills/sk-design/styles/database/README.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/README.md`
- Interface/motion corpus consumer imports
- File-count, disk-usage, build-check, and query commands

## Assessment

- New information ratio: 0.90
- Novelty justification: four findings were fully new and one was a new negative result that rejected a default-backend change.
- Confidence: high for path, size, and command behavior; medium for the decision not to migrate because no end-to-end repository performance baseline was requested.

## Reflection

- What worked and why: pairing file statistics with actual engine commands separated storage scale from operational failure.
- What did not work and why: reading the root README beyond its first table rows added no signal because it mechanically repeats the broken pattern.
- What I would do differently: inspect document byte size and first representative link before loading generated inventory tables.

## Recommended Next Focus

Audit the folded interface mode and seven binary mechanical preflight checks against current accessibility, responsive, performance, theming, and foundations proof responsibilities. Seek missing evidence behavior, not missing old commands.
