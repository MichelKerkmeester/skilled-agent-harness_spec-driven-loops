# Iteration 2: Reference-Architecture Transfer Rules and Styles-Specific Differences

## Focus

Compare the proven `system-deep-loop/runtime` ownership boundaries with the mapped styles topology. The selected interpretation is architectural transfer rules, not a final target-tree or migration sequence; those remain separate later-iteration questions.

## Actions Taken

1. Inspected the reference runtime's `lib/`, `scripts/`, `database/`, tests, and path-resolution seams.
2. Compared those boundaries with the current styles engine, database, extraction harness, and manifest path ownership.
3. Classified corpus metadata, committed retrieval metadata, and mutable database publication metadata by authority and lifecycle.
4. Tested whether the reference package boundary and test setup transfer literally or only structurally.

## Findings

1. The runtime's primary transferable rule is a two-surface code boundary: importable implementation belongs under `lib/`, while executable adapters under `scripts/` parse inputs, call library functions, emit machine-readable output, and close resources. Styles currently combines both roles in `_engine/style-library.mjs` and places the operator CLI inside `_db`, so the transfer should split thin query/build/operator entry points from reusable engine/database modules rather than merely renaming `_engine` and `_db`. [SOURCE: .opencode/skills/system-deep-loop/runtime/README.md:23-44] [SOURCE: .opencode/skills/system-deep-loop/runtime/README.md:117-121] [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:1-36] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:69-80]
2. Engine and database should become sibling domains inside one `lib/` boundary, not separate top-level backends. The existing persistent adapter imports database retrieval/schema while the database retrieval path depends back on engine card assembly, so one library boundary acknowledges the real coupling while domain subdirectories preserve ownership. This transfers the runtime's `lib/deep-loop`, `lib/coverage-graph`, and `lib/council` pattern without copying those domain names. [SOURCE: .opencode/skills/system-deep-loop/runtime/README.md:109-115] [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:9-18] [SOURCE: iterations/iteration-001.md:21]
3. A top-level `database/` boundary transfers directly only for mutable runtime publication state: the logical SQLite path, immutable generation files, `.current.json` pointer, rollback generation, locks, and transient sidecars belong together there. It must not absorb source modules or authoritative corpus inputs. The reference runtime creates SQLite state on demand and excludes transient sidecars, while styles already models its database as a rebuildable projection with atomic generation publication and rollback. [SOURCE: .opencode/skills/system-deep-loop/runtime/database/README.md:10-30] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:3-15] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:40-49] [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:5-10]
4. Styles intentionally needs a first-class authoritative corpus boundary that runtime does not have. The flat bundles remain the source of truth, persistent reads are a projection, and the indexer reads the crawl manifest from the same corpus ownership context before discovering bundle directories. Therefore the 1,290 bundle folders and corpus-authoritative metadata must move as one data domain, outside `lib/`, `scripts/`, and `database/`. [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:1-5] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:645-663] [SOURCE: iterations/iteration-001.md:16-18]
5. The three manifest classes divide by lifecycle rather than by file extension. The crawl manifest records authoritative extraction/provenance state and is written by the corpus acquisition script; the retrieval manifest is a committed, deterministic index derived from corpus data and used by the default legacy backend; database generation manifests are mutable publication pointers for opt-in persistent artifacts. The first two belong with corpus-owned committed metadata, while `.current.json` and generation manifests belong under `database/`. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:19-28,41-45] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:29-34] [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:73-109] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:6-15,134-147]
6. Path ownership should transfer as an explicit library seam, but styles should improve on the reference's remaining positional derivation. Runtime exposes a canonical artifact-root import seam and exports its database directory from the database owner; styles currently derives corpus, manifest, and database locations independently from each module's parent directory. A single styles path module should export the styles root, corpus root, committed manifest paths, and database root, while callable APIs retain explicit path overrides for fixtures and external callers. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/artifact-root.cjs:3-19] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:143-155] [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:31-36,80-94] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:11-32] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:41-45]
7. A centralized `tests/` boundary transfers structurally: runtime separates unit, integration, lifecycle, helpers, and fixtures and owns discovery through a root config. For styles, engine tests, database tests, oracle data, and mode-adapter integration tests should be classified under one test root, but golden oracle files remain test evidence rather than corpus data or runtime database artifacts. [SOURCE: .opencode/skills/system-deep-loop/runtime/vitest.config.ts:1-25] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/:scoped-inventory] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:89-124] [SOURCE: iterations/iteration-001.md:20-21]
8. The runtime should not be copied as a literal npm-package template. It has a scoped `vitest.config.ts`, `tsconfig.json`, and `package-lock.json`, but the expected `runtime/package.json` was absent during this pass; the styles tree likewise has no local package metadata. The safe transfer is therefore ownership and verification boundaries, not an unsupported claim that styles should immediately become an independently installable package. [SOURCE: .opencode/skills/system-deep-loop/runtime/vitest.config.ts:1-25] [INFERENCE: direct read of `.opencode/skills/system-deep-loop/runtime/package.json` returned file-not-found, and scoped glob found no package metadata under `styles/`]

## Ruled Out

- Ruled out a literal mirror of runtime directory names: styles requires an authoritative corpus and committed corpus manifests that runtime does not own.
- Ruled out placing `_manifest.json` and `_retrieval-manifest.json` under `database/`: their authority and default-backend lifecycle differ from mutable SQLite publication pointers.
- Ruled out separate top-level `engine/` and `database-code/` source domains: current bidirectional imports make one `lib/` boundary the more accurate ownership model.
- Ruled out treating the runtime as proof that styles needs a standalone npm package: the reference package metadata is incomplete in the checked-in tree.

## Dead Ends

- Copying `runtime/` mechanically is exhausted as a design direction; only its ownership rules are transferable.
- Parent-directory derivation should not be preserved as a compatibility strategy because the restructure intentionally breaks the positional relationship it assumes.

## Edge Cases

- Ambiguous input: "aligned to runtime" could mean literal topology or ownership semantics; this iteration selected ownership semantics because the prompt explicitly requires styles-specific differences.
- Contradictory evidence: the runtime config describes a standalone `npm test` path, but no `runtime/package.json` was present. This limits package-boundary transfer but does not invalidate the observed directory/test ownership pattern.
- Missing dependencies: `runtime/package.json` was absent; `package-lock.json`, `tsconfig.json`, `vitest.config.ts`, runtime documentation, and actual test layout were used as bounded fallback evidence.
- Partial success: none; the transfer/difference question is answered, while exact target names and migration ordering were intentionally deferred.

## Sources Consulted

- `.opencode/skills/system-deep-loop/runtime/README.md:23-44,107-146,191-229`
- `.opencode/skills/system-deep-loop/runtime/database/README.md:10-30`
- `.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:143-155`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/artifact-root.cjs:3-19`
- `.opencode/skills/system-deep-loop/runtime/vitest.config.ts:1-25`
- `.opencode/skills/system-deep-loop/runtime/tests/` scoped inventory
- `.opencode/skills/sk-design/styles/_engine/style-library.mjs:1-36,73-109`
- `.opencode/skills/sk-design/styles/_engine/manifest.mjs:29-34`
- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:9-18,52-56`
- `.opencode/skills/sk-design/styles/_db/README.md:1-147`
- `.opencode/skills/sk-design/styles/_db/schema.mjs:11-32`
- `.opencode/skills/sk-design/styles/_db/generation-manifest.mjs:5-32`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:645-663`
- `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs:19-28,41-45`

## Assessment

- New information ratio: 0.88
- Novelty justification: Six of eight transfer-rule findings are fully new and two refine iteration 1's preliminary runtime comparison and engine/database coupling.
- Questions addressed: Which runtime ownership boundaries transfer directly, and where should styles intentionally differ?
- Questions answered: Which runtime ownership boundaries transfer directly, and where should styles intentionally differ?
- Confidence: High for code/data/database/manifest ownership; medium-high for package-boundary conclusions because the expected runtime package manifest is absent.
- Status: complete

## Reflection

- What worked and why: Comparing lifecycle and authority for each artifact class produced clearer transfer rules than matching directory names.
- What did not work and why: Probing `runtime/package.json` failed because the file is absent, preventing a claim that the reference is a complete standalone npm package.
- What I would do differently: The next pass should convert these ownership rules into one concrete kebab-case target tree and test each proposed location against all known path consumers.

## Recommended Next Focus

Derive the concrete target tree from these rules, including exact homes for corpus bundles, committed corpus manifests, sibling `lib/engine` and `lib/database` domains, thin scripts, mutable database generations, centralized tests/fixtures/oracles, and documentation.
