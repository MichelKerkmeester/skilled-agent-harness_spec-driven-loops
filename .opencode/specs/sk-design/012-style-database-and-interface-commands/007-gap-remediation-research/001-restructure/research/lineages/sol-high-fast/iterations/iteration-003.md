# Iteration 3: Concrete Target Tree and Artifact Ownership

## Focus

Derive and pressure-test one concrete kebab-case target tree from the topology and transfer rules established in iterations 1 and 2. This iteration fixes the exact ownership destination for every current artifact class while preserving the existing semantic contracts: flat bundles remain authoritative, `legacy` remains the default, and the persistent SQLite projection remains opt-in. Dependency ordering and the executable `git mv` sequence are bounded inputs to the next iteration rather than claimed complete here.

## Actions Taken

1. Reclassified every current artifact class by authority, lifecycle, and execution role.
2. Derived the smallest target tree that separates committed data, reusable source, executable entrypoints, mutable state, tests, and documentation.
3. Pressure-tested names for committed corpus metadata versus mutable database publication metadata.
4. Tested the tree against known production consumers, test fixtures, positional path derivations, and the engine/database cycle.

## Concrete Target Tree

```text
.opencode/skills/sk-design/styles/
|-- README.md
|-- library/
|   |-- bundles/
|   |   `-- <1,290-kebab-case-style-slugs>/
|   |       |-- DESIGN.md
|   |       |-- css-variables.css
|   |       |-- tailwind-v4.css
|   |       |-- design-tokens.json
|   |       |-- <style-slug>-canonical.json
|   |       `-- source.md
|   `-- manifests/
|       |-- crawl-manifest.json
|       `-- retrieval-manifest.json
|-- lib/
|   |-- paths.mjs
|   |-- engine/
|   |   |-- style-library.mjs
|   |   |-- manifest.mjs
|   |   |-- legacy-adapter.mjs
|   |   |-- shadow-adapter.mjs
|   |   `-- persistent-adapter.mjs
|   `-- database/
|       |-- generation-manifest.mjs
|       |-- indexer.mjs
|       |-- oracle.mjs
|       |-- retrieval.mjs
|       `-- schema.mjs
|-- scripts/
|   |-- extract-refero.mjs
|   |-- style-library.mjs
|   `-- style-database.mjs
|-- database/
|   |-- README.md
|   |-- style-library.current.json
|   |-- style-library.generation-<id>.json
|   `-- style-library.generation-<id>.sqlite
|-- tests/
|   |-- engine/
|   |-- database/
|   |-- integration/
|   |-- fixtures/
|   `-- oracle/
`-- docs/
    `-- manual-testing-playbook.md
```

Generated locks, SQLite sidecars, temporary build files, and superseded generations share the `database/` lifecycle boundary but are not implied to be committed by this tree. The tree shows ownership, not a requirement to check mutable artifacts into Git. [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:6-15,40-49] [SOURCE: .opencode/skills/system-deep-loop/runtime/database/README.md:10-30]

## Exact Current-to-Target Ownership Map

| Current artifact class | Exact destination | Ownership reason |
| --- | --- | --- |
| 1,290 root style directories | `library/bundles/<style-slug>/` | They are the authoritative, committed corpus and move as intact six-artifact units. [SOURCE: iterations/iteration-001.md:16-17] |
| `_manifest.json` | `library/manifests/crawl-manifest.json` | The acquisition process writes committed crawl/provenance state; the explicit name removes the opaque underscore convention. [SOURCE: iterations/iteration-002.md:20] |
| `_retrieval-manifest.json` | `library/manifests/retrieval-manifest.json` | It is a committed deterministic index used by the authoritative legacy path, not mutable database state. [SOURCE: iterations/iteration-002.md:20] |
| Reusable `_engine/*.mjs` modules | `lib/engine/*.mjs` | Importable query, hydration, card assembly, and mode-adapter behavior belongs under the shared library boundary. [SOURCE: iterations/iteration-002.md:16-17] |
| Reusable `_db/*.mjs` modules | `lib/database/*.mjs` | Schema, indexing, retrieval, generation-manifest logic, and production oracle logic are source, not runtime artifacts. [SOURCE: iterations/iteration-002.md:17-18,22] |
| `_engine/style-library.mjs` executable behavior | Thin `scripts/style-library.mjs`, delegating to `lib/engine/style-library.mjs` | The public import facade remains reusable while argument parsing/output/resource closure becomes an executable adapter. [SOURCE: iterations/iteration-002.md:16] |
| `_db` operator CLI | `scripts/style-database.mjs` | Database build/publish/rollback commands are executable entrypoints; implementation remains in `lib/database/`. [SOURCE: iterations/iteration-002.md:16] |
| `_harness/extract-refero.mjs` | `scripts/extract-refero.mjs` | Corpus acquisition is an executable producer of bundles and crawl metadata, not reusable corpus data. [SOURCE: iterations/iteration-002.md:20] |
| `_db/style-library.sqlite` and generation publication state | `database/` | Rebuildable SQLite generations, current pointer, rollback state, locks, and sidecars share one mutable lifecycle boundary. [SOURCE: iterations/iteration-001.md:22] [SOURCE: iterations/iteration-002.md:18] |
| Engine tests | `tests/engine/` | Test behavior follows the domain but is evidence rather than production source. [SOURCE: iterations/iteration-002.md:22] |
| Database tests | `tests/database/` | Schema/index/retrieval unit and lifecycle tests belong to the centralized test owner. [SOURCE: iterations/iteration-002.md:22] |
| Cross-mode and persistent-mode tests | `tests/integration/` | They verify contracts across engine, database, and consuming mode boundaries. [INFERENCE: based on the production/test consumer split in iterations/iteration-001.md:19-21 and centralized-test rule in iterations/iteration-002.md:22] |
| Shared generated test inputs | `tests/fixtures/` | Explicit fixture overrides must not depend on production parent-directory derivation. [SOURCE: iterations/iteration-001.md:20-21] [SOURCE: iterations/iteration-002.md:21] |
| Golden oracle files | `tests/oracle/` | Golden expected output is test evidence; only executable oracle comparison/normalization code belongs in `lib/database/oracle.mjs`. [INFERENCE: based on the production-code/test-evidence distinction in iterations/iteration-002.md:22] |
| `styles/manual-testing-playbook.md` | `styles/docs/manual-testing-playbook.md` | It documents operator verification and is neither the root ownership overview nor executable code. [SOURCE: iterations/iteration-001.md:16,23] |
| `styles/README.md` and `_db/README.md` | Root `README.md` plus `database/README.md` | Root documentation explains the whole subsystem; database documentation describes mutable publication state at its owner. [SOURCE: .opencode/skills/sk-design/styles/README.md:5-18] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:3-15] |
| Historical specs, feature catalog, changelog, and skill references | Remain at their current owners; update path text after executable migration | They are documentation consumers, not artifacts owned by the styles runtime tree. [SOURCE: iterations/iteration-001.md:23] |

## Findings

1. `library/` is the appropriate committed-data name because it describes the curated style library as a product asset, while `lib/` remains the conventional and already-proven reusable-code boundary. The names are intentionally similar but semantically distinct, and each has a single owner: data versus source. Renaming the data boundary to `corpus/` would also be defensible, but it would add vocabulary drift from the existing “style library” public concept without improving lifecycle separation. [SOURCE: .opencode/skills/sk-design/styles/README.md:3-12] [SOURCE: iterations/iteration-002.md:16,19]
2. `library/manifests/crawl-manifest.json` and `library/manifests/retrieval-manifest.json` are the exact committed metadata names. They preserve the two existing semantic roles while removing underscore-prefixed root globals. Database publication metadata keeps the `generation` and `current` vocabulary under `database/`, preventing “manifest” from implying one lifecycle across committed inputs and mutable projections. [SOURCE: iterations/iteration-002.md:18,20]
3. `lib/paths.mjs` is the one exported ownership seam. It should export the styles root, bundle root, crawl-manifest path, retrieval-manifest path, and database root; production modules consume those exports, while callable APIs retain explicit path overrides for fixtures and external callers. This is the only new cross-domain source module warranted by the restructure. [SOURCE: iterations/iteration-002.md:21]
4. Production oracle code and golden oracle evidence must split: executable comparison/normalization/query logic belongs under `lib/database/`, while static expected results belong under `tests/oracle/`. Putting both under `tests/` would hide production behavior; putting both under `lib/` would make golden evidence look runtime-authoritative. [INFERENCE: based on iterations/iteration-001.md:21 and iterations/iteration-002.md:22]
5. The target does not create separate `backend/`, `runtime/`, `src/`, or package layers. `styles/` is already the subsystem root; `lib/`, `scripts/`, `database/`, `tests/`, `library/`, and `docs/` each add an ownership distinction that current artifacts require, while another wrapper would only deepen paths. [SOURCE: iterations/iteration-002.md:16-19,23]
6. The tree preserves all semantic contracts. Legacy retrieval reads `library/bundles/` plus the committed retrieval manifest by default; shadow and persistent modes reuse the same authoritative inputs; persistent mode alone reads the rebuildable projection under `database/`. No target name implies a mode-default change. [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:134-147] [SOURCE: iterations/iteration-002.md:19-20]
7. The move cannot be executed as independent subtree renames. The implementation order must first introduce the exported path seam and explicit overrides, then move committed data/manifests and the coupled engine/database source boundary in one behavior-preserving migration window, then relocate entrypoints/tests/runtime state, and finally update documentation. [SOURCE: iterations/iteration-001.md:18-23] [SOURCE: iterations/iteration-002.md:21]
8. Compatibility should be source-level and explicit, not filesystem-level. Checked-in consumers should update imports and paths atomically; no `_engine`, `_db`, `_harness`, or root-manifest forwarding shims are justified by current evidence. Existing callable path overrides remain the compatibility mechanism for tests and external invocation, while an old rebuildable SQLite projection should be regenerated at the new database root rather than searched through fallback paths. [SOURCE: iterations/iteration-001.md:19-23] [SOURCE: iterations/iteration-002.md:18,21] [INFERENCE: no command or agent direct consumers were found in iteration 1]

## Migration Constraints for the Next Iteration

The command-level plan should preserve this dependency order:

```text
path ownership seam
  -> committed bundles and manifests
  -> coupled engine/database library modules and imports
  -> thin scripts and consuming mode adapters
  -> centralized tests, fixtures, and oracle evidence
  -> mutable database projection rebuild/publication
  -> documentation and stale-path sweep
```

The rollback boundary should be one reviewable migration commit for tracked moves and path updates, preceded by a clean baseline verification. Mutable database files need a separate backup-or-rebuild decision and must not determine source rollback. [INFERENCE: based on rebuildable projection semantics in iterations/iteration-001.md:22 and interdependent move constraints in iterations/iteration-001.md:18-21]

## Ruled Out

- Ruled out `corpus/` as the selected committed-data name: technically sound, but `library/` better preserves the subsystem's established product vocabulary while remaining distinct from code-only `lib/`.
- Ruled out keeping `_manifest.json` and `_retrieval-manifest.json` at the styles root: root globals preserve the ownership ambiguity the restructure is intended to remove.
- Ruled out a top-level `manifests/`: both committed files are metadata for `library/`, whereas generation metadata belongs to `database/`; a shared manifest root would merge lifecycles again.
- Ruled out `lib/oracle/` and `tests/oracle-code/` as separate domains: production oracle logic belongs to its database domain, and only golden evidence needs a test-owned oracle directory.
- Ruled out wrapper layers such as `backend/`, `runtime/`, or `src/`: none adds an ownership distinction beyond the six direct roots.

## Dead Ends

- A literal runtime-tree copy remains exhausted because it has no authoritative committed-corpus boundary.
- Independent `_engine`, `_db`, and `_harness` moves remain blocked until the shared path seam and coupled import update are designed together.

## Edge Cases

- Ambiguous input: “`library/` or equivalent” allowed either `library/` or `corpus/`; this iteration selected `library/` using existing product vocabulary and documented the rejected alternative.
- Contradictory evidence: none. The existing mixed paths conflict with the desired ownership model, but not with the semantic target.
- Missing dependencies: the retry reused repository evidence captured in iterations 1 and 2 after re-reading canonical state; no resource map exists, and no new external source was required.
- Partial success: the concrete tree and ownership question are answered. Exact shell-safe `git mv` commands, verification gates, and rollback commands remain intentionally open for iteration 4.

## Sources Consulted

- `.opencode/skills/sk-design/styles/README.md:3-18`
- `.opencode/skills/sk-design/styles/_db/README.md:3-15,40-49,134-147`
- `.opencode/skills/system-deep-loop/runtime/database/README.md:10-30`
- `iterations/iteration-001.md:16-24`
- `iterations/iteration-002.md:16-23`
- `deep-research-strategy.md:7-10,43-82,86-98`
- `findings-registry.json:2-32`

## Assessment

- New information ratio: 0.88
- Novelty justification: Six of eight findings establish fully new target names or ownership decisions, while two partially refine the prior path-seam and migration-coupling findings.
- Questions addressed: What target layout cleanly separates data, library code, runtime databases, manifests, tests, scripts, and documentation?
- Questions answered: What target layout cleanly separates data, library code, runtime databases, manifests, tests, scripts, and documentation?
- Confidence: High for ownership boundaries and semantic-contract preservation; medium-high for individual script/test filenames until iteration 4 converts the class map into an inventory-backed `git mv` sequence.
- Status: complete

## Reflection

- What worked and why: Authority/lifecycle classification yielded one shallow tree and resolved the three naming ambiguities without introducing compatibility directories.
- What did not work and why: A class-level tree cannot by itself guarantee a shell-safe move for all tracked files; exact inventory and command ordering belong in the migration-focused iteration.
- What I would do differently: Pressure-test the next iteration against tracked-file enumeration and baseline commands before presenting any wildcard-based move.

## Recommended Next Focus

Derive the dependency-ordered implementation and exact shell-safe `git mv` sequence from this target tree, including import/path cutover, baseline and post-move verification, mutable-database handling, one-commit rollback boundary, and the no-filesystem-shim compatibility policy.
