# Iteration 2: Styles query, hydration, and ownership boundary

## Focus

Determine how the five executable styles consumers query and hydrate the corpus, which bundle artifacts they request versus actually receive, how the adapter selects a backend, and which parts of the 7,812-file surface are authored code, committed generated data, or rebuildable runtime state.

## Actions Taken

1. Read the lineage strategy, state log, and prior iteration before following the reducer-selected focus.
2. Traced every live `runQuery` and `runHydrate` call site in interface, foundations, motion, audit, and md-generator, including call cardinality and byte limits.
3. Read the facade, backend adapter, hydration guard, path seam, and styles boundary documentation.
4. Ran the committed facade against the real corpus and hydrated one returned card through the four direct-import modes.

## Findings

1. The five consumers have bounded, conditional call cardinality rather than open-ended corpus loading. Interface performs one query, then hydrates one anchor and optionally one secondary card. Foundations performs one query, then hydrates the coherent anchor plus up to three axis owners. Motion performs no retrieval when the restraint gate says “do not move” or no attested candidate exists; otherwise it performs one query and one hydration. Audit performs one query and hydrates zero to two requested comparisons. Md-generator’s STUDY preparation performs one query and one hydration through a child-process wrapper. All four direct mode consumers cap query results at five cards. [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:126-128] [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:607-612] [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:642-678] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:216-218] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:838-867] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:759-795] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:820-822] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:101-103] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:487-533] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:75-113]

2. Artifact requests are mode-specific upper bounds, not guarantees that every named file is loaded. Interface and motion request `DESIGN.md` plus `source.md`; foundations and audit request those plus `design-tokens.json`; md-generator STUDY requests `DESIGN.md` plus `design-tokens.json`. Interface budgets 8 KiB for the anchor and 2 KiB for the secondary, foundations and motion budget 8 KiB per card, and audit budgets 4 KiB per comparison. The live facade probe returned a real `getburnt` card, but each 8 KiB hydration contained only a truncated `getburnt/DESIGN.md`; later requested artifacts did not fit. Therefore a migration must preserve include allowlists, artifact ordering, truncation flags, and byte-cap behavior, and callers must not equate `includes` with a complete payload. [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:126-128] [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:566-575] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:217-218] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:798-807] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:159-160] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:732-741] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:101-103] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:448-457] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/tests/study-exemplars.test.ts:228-233] [SOURCE: local execution of `runQuery` followed by four `runHydrate` calls against the committed corpus]

3. Backend selection is centralized and transparent to all consumers. The four direct importers call only `style-library.mjs`; none imports the database plane. They do not pass `styleDatabaseMode`, so the adapter resolves an explicit option first, then `SK_DESIGN_STYLE_DB_MODE`, then defaults to `legacy`. Md-generator spawns the same facade CLI and inherits that environment. One facade-preserving relocation can therefore keep all five consumers compatible, while moving database APIs into individual modes would duplicate a boundary that is currently singular. [SOURCE: .opencode/skills/sk-design/styles/lib/README.md:5-20] [SOURCE: .opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:97-111] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:54-89]

4. The ownership boundary is already explicit. `styles/lib/` is authored, importable source code and is neither generated nor mutable. `styles/library/` is the committed flat corpus and manifest surface generated by the extraction/build workflow; it remains the authority. `styles/database/` is mutable runtime state, and the SQLite database is a rebuildable projection whose normal query/hydrate paths never build it. Persistent mode selects from the published database but hydrates only selected, database-hash-verified authoritative artifacts. [SOURCE: .opencode/skills/sk-design/styles/lib/README.md:5-13] [SOURCE: .opencode/skills/sk-design/styles/README.md:10-18] [SOURCE: .opencode/skills/sk-design/styles/scripts/README.md:67-85] [SOURCE: .opencode/skills/sk-design/styles/lib/database/README.md:5-20] [SOURCE: .opencode/skills/sk-design/styles/lib/database/README.md:41-45] [SOURCE: .opencode/skills/sk-design/styles/lib/database/README.md:143-149] [SOURCE: .opencode/skills/sk-design/styles/lib/paths.mjs:24-32]

5. The safest ownership fate is a non-discoverable shared styles package inside the `sk-design` hub, not ownership by md-generator or interface and not a fifth workflow mode. Keep the facade plus adapter and path seam together; keep the generated corpus and rebuildable database lifecycle behind that facade; preserve the old facade import/CLI path temporarily or update all five consumers atomically. This follows the current dependency direction: five sibling consumers depend on one storage-neutral contract, while no consumer depends directly on the database implementation. [SOURCE: .opencode/skills/sk-design/styles/lib/README.md:10-20] [SOURCE: .opencode/skills/sk-design/styles/lib/engine/README.md:5-20] [SOURCE: .opencode/skills/sk-design/styles/lib/paths.mjs:1-8] [INFERENCE: shared internal ownership minimizes import rewrites and avoids making a data/service boundary advisor-discoverable]

6. Repository evidence can quantify calls per workflow invocation but cannot establish observed user frequency. There is no production invocation telemetry in the examined surfaces. Executable call sites, focused tests, and the successful live facade probe establish that the boundary is real and operable; they do not show how often users invoke interface, foundations, motion, audit, or STUDY. Any migration claim based on “rarely used” versus “frequently used” needs external telemetry or must retain this explicit confidence ceiling. [SOURCE: .opencode/skills/sk-design/design-interface/corpus/tests/relational-exemplar.test.mjs:17] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/tests/relationship-blueprint.test.mjs:17] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/tests/motion-evidence.test.mjs:17] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/tests/comparison-lane.test.mjs:17] [SOURCE: .opencode/skills/sk-design/styles/tests/database/adapter.test.mjs:9-10]

## Questions Answered

- The styles facade has five executable consumers: four direct-import corpus planners and md-generator STUDY through the facade CLI.
- Per workflow invocation, query/hydration counts are bounded as described above; observed production frequency remains unknown because no telemetry is present.
- Styles should remain a shared, non-mode hub resource. The authored facade/adapter is the compatibility boundary; the committed generated corpus is authoritative data; the persistent database is a rebuildable projection.

## Ruled-Out Directions

- Moving styles under md-generator or interface is ruled out because it would invert or cross-wire dependencies for the other consumers.
- Treating every requested `includes` entry as actually hydrated is ruled out by the real-corpus probe: byte caps can return only a truncated first artifact.
- Treating static call sites as production frequency evidence is ruled out; they prove executable utilization, not invocation volume.

## Questions Remaining

- Which foundations procedures are independently invoked, and which should fold into interface versus shared doctrine?
- Which audit procedures are independently invoked, and which should become interface completion gates?
- Should the four surviving workflow packets remain behind one advisor-visible hub identity?
- What compatibility window, rollback sequence, and verification matrix should the build packet use?
- Are the current small hydration caps intentional, or a latent behavior gap that migration tests must freeze before any move?

## Next Focus

Trace foundations procedures from interface commands, router leaves, tests, and shared doctrine to decide what folds into interface and what remains shared.
