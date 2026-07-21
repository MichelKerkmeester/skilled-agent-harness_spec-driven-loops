# Iteration 1: Current Styles-Tree Topology and Path Consumers

## Focus

Map the exact current `styles/` ownership boundaries, internal dependencies, and path consumers before proposing any target names. This iteration treats executable imports and path constants as migration-critical, while documentation references are a separate update surface.

## Actions Taken

1. Inventoried the `styles/` root and its three internal subtrees.
2. Traced engine, database, harness, manifest, and default SQLite path ownership.
3. Searched executable consumers across sk-design modes, generator code, tests, commands, and agents.
4. Compared the observed mixed tree with the documented `system-deep-loop/runtime` separation pattern.

## Findings

1. The root has 1,297 entries: 1,290 downloaded bundle directories plus `_db/`, `_engine/`, `_harness/`, `_manifest.json`, `_retrieval-manifest.json`, `README.md`, and `manual-testing-playbook.md`. The data corpus and every backend/support category therefore share one namespace. [SOURCE: .opencode/skills/sk-design/styles:directory-listing] [SOURCE: .opencode/skills/sk-design/styles/README.md:5-12]
2. A downloaded bundle is a six-artifact unit: `DESIGN.md`, `css-variables.css`, `tailwind-v4.css`, `design-tokens.json`, `<slug>-canonical.json`, and `source.md`. This is the data ownership boundary, distinct from backend code and root documentation. [SOURCE: .opencode/skills/sk-design/styles/README.md:5-8]
3. Manifest ownership is split but root-bound: `_harness/extract-refero.mjs` writes `_manifest.json`; `_engine/manifest.mjs` names both root manifests; and `style-library.mjs` derives `CORPUS_ROOT` as the parent of `_engine` and locates `_retrieval-manifest.json` there. Moving only code without changing these constants would silently preserve the old mixed-tree assumption. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:44] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:29-34] [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:34-36,80-94]
4. The production facade is consumed directly by four mode adapters: foundations, interface, motion, and audit import `runQuery`/`runHydrate` from `../../styles/_engine/style-library.mjs`. The generator is a fifth production consumer, but it constructs both the CLI and retrieval-manifest paths positionally instead of importing the facade. [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:28] [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:28] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:24] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:28] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:54-67]
5. Tests form a broader old-path surface than production code: each mode suite imports engine modules and shared engine fixtures, constructs `_retrieval-manifest.json`, and constructs `_manifest.json`; the generator baseline test directly resolves the root retrieval manifest. These fixtures are coupled to both module location and corpus-root shape. [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/__tests__/relationship-blueprint.test.mjs:16-23,47,80] [SOURCE: .opencode/skills/sk-design/design-interface/corpus/__tests__/relational-exemplar.test.mjs:16-23,59,96] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/__tests__/motion-evidence.test.mjs:16-22,47,68] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/__tests__/comparison-lane.test.mjs:16-23,61,108] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/tests/corpus-baseline-v3.test.ts:19]
6. `_engine` and `_db` are not independent move units today. `persistent-adapter.mjs` imports database retrieval and schema, while `_db/retrieval.mjs` imports card assembly from `_engine`; database tests and oracle fixtures also import engine fixtures and facade functions. This bidirectional dependency means migration ordering must establish a stable library boundary before either subtree is moved independently. [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:9-18] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:5-7] [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/adapter.test.mjs:9-11] [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/fixtures.mjs:11-14]
7. The real persistent artifact defaults to `_db/style-library.sqlite`, alongside source modules and tests. The database is rebuildable, the flat bundles remain authoritative, and persistent selection remains opt-in behind `legacy|shadow|persistent`; therefore source relocation and runtime-database relocation are separate concerns that must preserve this mode contract. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:12-14] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:3-5,134-147]
8. Documentation is a large secondary consumer surface: the skill overview, README, feature catalog, manual-testing playbook, changelog, and multiple specs name `_engine`/`_db` paths. Scoped exact searches found no matching command or agent files, so commands/agents are not currently direct path blockers, but docs and spec metadata must be handled after executable paths. [SOURCE: .opencode/skills/sk-design/SKILL.md:215-226,261] [SOURCE: .opencode/skills/sk-design/feature-catalog/styles-library-utilization/retrieval-engine.md:42-54] [SOURCE: .opencode/skills/sk-design/feature-catalog/styles-library-utilization/style-database-backend.md:42-58] [INFERENCE: scoped exact searches under `.opencode/commands` and `.opencode/agents` returned no matches]
9. The reference runtime's transferable topology is structural, not domain-specific: importable code lives under `lib/`, executable adapters under `scripts/`, and the package has independent tests/configuration. Styles differs because it also owns a large authoritative data corpus and two committed manifests, so a direct runtime-tree copy would be incomplete. [SOURCE: .opencode/skills/system-deep-loop/runtime/README.md:23-30,42-44,97-103] [INFERENCE: styles corpus and manifest ownership from findings 1-3]

## Questions Answered

- Answered: What is the exact current ownership and dependency topology across style data, engine, database, harness, manifests, tests, docs, and consumers?
- The map identifies all executable production consumers found by exact path search, the principal test/fixture consumers, internal bidirectional dependencies, runtime data location, and documentation/spec update classes.

## Questions Remaining

- Which `system-deep-loop/runtime` boundaries transfer directly, and which must differ for corpus/manifests?
- What concrete kebab-case target layout should represent data, library code, runtime database files, manifests, tests, scripts, and docs?
- What dependency-ordered migration avoids breaking the facade, root derivation, fixtures, and positional generator paths?
- What exact `git mv` and verification/rollback sequence should implementation use?

## Ruled Out / Dead Ends

- Ruled out treating `_engine`, `_db`, and `_harness` as independent rename units: engine/database imports are bidirectional and manifests bind both to the corpus root.
- Ruled out treating documentation references as equivalent to runtime dependencies: executable imports/constants must move first; docs are a broad but non-executing follow-up surface.
- Ruled out commands and agents as current direct path consumers after scoped exact searches returned no matches.
- Deferred target names and `git mv` commands because this iteration's focus was evidence mapping only.

## Sources Consulted

- `.opencode/skills/sk-design/styles/` directory inventory
- `.opencode/skills/sk-design/styles/README.md:5-21`
- `.opencode/skills/sk-design/styles/_engine/style-library.mjs:14-36,80-94,123-207`
- `.opencode/skills/sk-design/styles/_engine/manifest.mjs:23-34`
- `.opencode/skills/sk-design/styles/_db/README.md:3-15,27-49,69-87,134-147`
- `.opencode/skills/sk-design/styles/_db/schema.mjs:12-14,334-359`
- `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs:44`
- Four mode corpus consumers and their test suites
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:54-67`
- `.opencode/skills/system-deep-loop/runtime/README.md:23-44,97-103`
- Scoped exact-path searches under `.opencode/skills/sk-design`, `.opencode/commands`, and `.opencode/agents`

## Assessment

- New information ratio: 0.89
- Novelty justification: Seven of nine topology findings were fully new to this lineage and two were partially new refinements of known context.
- Confidence: High for checked-in executable consumers and internal imports; medium-high for historical documentation breadth because repository-wide matches are numerous and later migration planning should regenerate a complete replacement checklist.
- Status: complete

## Reflection

- What worked and why: Exact path/import searches plus focused reads exposed both positional path consumers and the engine/database cycle without scanning bundle contents.
- What did not work and why: Broad repository searches were dominated by historical specs and generated research records, so they were useful for classifying documentation blast radius but not for an implementation checklist.
- What I would do differently: The next pass should compare only ownership boundaries and path-resolution conventions in the reference runtime, then derive explicit transfer/difference rules before naming the target tree.

## Next Focus

Compare the proven `system-deep-loop/runtime` ownership boundaries with the mapped styles topology, identifying what transfers directly and what must intentionally differ for authoritative corpus data, committed manifests, and opt-in runtime databases.
