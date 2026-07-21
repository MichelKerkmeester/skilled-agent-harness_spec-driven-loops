# Iteration 1: Naming Authority, Rename Map, and Direct References

## Focus

Establish the governing filesystem-naming authority, derive the exact rename map for all five legacy names in the brief, and inventory every direct legacy-name reference under the live `sk-design` skill surface. Schema reconciliation was inspected only far enough to keep the naming cutover from prematurely choosing a canonical manifest.

## Actions Taken

1. Read the detached-lineage config, state log, strategy, and findings registry; confirmed iteration 1, `stopPolicy=max-iterations`, `progressiveSynthesis=false`, no exhausted approaches, and lineage-only writes. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-config.json:3] [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:82]
2. Read the kebab-case canon and parent gap analysis to resolve the exemption boundary and proposed target names. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:18] [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:44]
3. Inspected both manifest headers/records and the live `styles/` directory to confirm physical names and schema roles. [SOURCE: .opencode/skills/sk-design/styles/_manifest.json:1] [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:1]
4. Ran scoped exact-reference searches for `_db`, `_engine`, `_harness`, `_manifest.json`, and `_retrieval-manifest.json`, then counted matches by file across `.opencode/skills/sk-design`. [INFERENCE: exact Grep and `rg --count-matches` results over the live skill surface produced 140 matches in the 46 files enumerated below]
5. Ran a repository-wide exact-path search to identify consumers and frozen historical references outside the immediate backend tree. [SOURCE: .opencode/specs/sk-doc/020-hyphen-naming-convention/012-code-dir-naming-enforcement/implementation-summary.md:15] [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md:19]

## Findings

1. **Naming authority and exemption result.** The canon states that directory names and filenames use kebab-case; exemptions cover Python source/package names, generated/tool-mandated names, runner magic, vendored trees, and frozen history. The three JavaScript backend directories and two authored JSON manifests match none of those exemptions. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:18] [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:24] [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:34]

2. **Exact rename map.** The dependency-closure rename is:

   | Legacy path | Kebab-case path | Basis |
   |---|---|---|
   | `styles/_db/` | `styles/database/` | The parent gap analysis gives `database/` as the target; a leading underscore is non-canonical. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:52] |
   | `styles/_engine/` | `styles/engine/` | The parent gap analysis gives `engine/` as the target. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:54] |
   | `styles/_harness/` | `styles/harness/` | The parent gap analysis gives `harness/` as the target. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:54] |
   | `styles/_manifest.json` | `styles/manifest.json` | Filesystem names use kebab-case and no semantic word replacement is required. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:24] [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:54] |
   | `styles/_retrieval-manifest.json` | `styles/retrieval-manifest.json` | Compound authored filenames use hyphens, not underscores. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:26] [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:55] |

   This is the naming-only map. A later consolidation may remove or derive one manifest, but skipping either filename here would leave an intermediate non-conformant path and obscure whether failures come from naming or schema changes. [INFERENCE: separating an atomic name-only parity cutover from schema consolidation creates a reversible diagnostic boundary]

3. **Exhaustive live-surface direct-reference inventory: 140 occurrences in 46 files.** The files are grouped by migration responsibility; every listed mutable reference must be updated in the same dependency-closure cutover unless explicitly identified as frozen history. [INFERENCE: repository-scoped exact-token inventory, grouped from `rg --count-matches` output]

   **Runtime code and scripts (12 files):**

   - `design-md-generator/backend/scripts/study-prepare.ts` excludes legacy backend/manifest names and must use the renamed entries. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/study-prepare.ts:60]
   - `design-motion/corpus/motion-evidence.mjs`, `design-foundations/corpus/relationship-blueprint.mjs`, `design-interface/corpus/relational-exemplar.mjs`, and `design-audit/corpus/comparison-lane.mjs` import the engine facade. [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:24] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:28] [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:28] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:28]
   - `styles/_engine/style-library.mjs` and `styles/_engine/manifest.mjs` hard-code both manifest filenames. [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:36] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:30]
   - `styles/_engine/persistent-adapter.mjs` imports database modules across the directory boundary. [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:9]
   - `styles/_harness/extract-refero.mjs` writes the crawl manifest. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:44]
   - `styles/_db/retrieval.mjs` imports engine cards, while `styles/_db/indexer.mjs` reads the crawl manifest. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:5] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:649]
   - `styles/_db/oracle/replay-fixtures.mjs` imports engine fixtures across the directory boundary. [SOURCE: .opencode/skills/sk-design/styles/_db/oracle/replay-fixtures.mjs:19]

   **Tests and fixture helpers (22 files):**

   - Mode-corpus tests/fixtures: `design-motion/corpus/__tests__/motion-evidence.test.mjs`, `design-motion/corpus/__tests__/fixtures.mjs`, `design-foundations/corpus/__tests__/relationship-blueprint.test.mjs`, `design-foundations/corpus/__tests__/fixtures.mjs`, `design-interface/corpus/__tests__/relational-exemplar.test.mjs`, `design-interface/corpus/__tests__/fixtures.mjs`, `design-audit/corpus/__tests__/comparison-lane.test.mjs`, and `design-audit/corpus/__tests__/fixtures.mjs`. [SOURCE: .opencode/skills/sk-design/design-motion/corpus/__tests__/motion-evidence.test.mjs:16] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/__tests__/relationship-blueprint.test.mjs:16] [SOURCE: .opencode/skills/sk-design/design-interface/corpus/__tests__/relational-exemplar.test.mjs:16] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/__tests__/comparison-lane.test.mjs:16]
   - Generator baseline: `design-md-generator/backend/tests/corpus-baseline-v3.test.ts`. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/tests/corpus-baseline-v3.test.ts:19]
   - Engine tests/helpers: `styles/_engine/__tests__/invalidation.test.mjs`, `hydrate-guard.test.mjs`, `fixtures.mjs`, `check-stable.test.mjs`, and `eligibility-first.test.mjs`. [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/invalidation.test.mjs:65] [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/hydrate-guard.test.mjs:85] [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/fixtures.mjs:109] [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/check-stable.test.mjs:17] [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/eligibility-first.test.mjs:37]
   - Database tests/helpers: `styles/_db/__tests__/operator.test.mjs`, `oracle.test.mjs`, `fixtures.mjs`, `manifest.test.mjs`, `indexer.test.mjs`, `schema.test.mjs`, `telemetry.test.mjs`, and `adapter.test.mjs`. [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/operator.test.mjs:12] [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/manifest.test.mjs:12] [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/indexer.test.mjs:14] [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/adapter.test.mjs:9]

   **Mutable documentation and operator commands (11 files):**

   - Root contract docs: `README.md` and `SKILL.md`. [SOURCE: .opencode/skills/sk-design/README.md:74] [SOURCE: .opencode/skills/sk-design/SKILL.md:215]
   - Manual-testing docs: `manual-testing-playbook/manual-testing-playbook.md`, `manual-testing-playbook/styles-library-utilization/generation-guarded-hydration-mismatch.md`, `manual-testing-playbook/styles-library-utilization/retrieval-query-eligible-cards.md`, and `styles/manual-testing-playbook.md`. [SOURCE: .opencode/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md:290] [SOURCE: .opencode/skills/sk-design/manual-testing-playbook/styles-library-utilization/generation-guarded-hydration-mismatch.md:42] [SOURCE: .opencode/skills/sk-design/manual-testing-playbook/styles-library-utilization/retrieval-query-eligible-cards.md:46] [SOURCE: .opencode/skills/sk-design/styles/manual-testing-playbook.md:13]
   - Feature catalog: `feature-catalog/styles-library-utilization/style-database-backend.md` and `feature-catalog/styles-library-utilization/retrieval-engine.md`. [SOURCE: .opencode/skills/sk-design/feature-catalog/styles-library-utilization/style-database-backend.md:18] [SOURCE: .opencode/skills/sk-design/feature-catalog/styles-library-utilization/retrieval-engine.md:42]
   - Backend docs: `styles/_harness/README.md`, `styles/README.md`, and `styles/_db/README.md`, including copy-pasteable CLI paths. [SOURCE: .opencode/skills/sk-design/styles/_harness/README.md:58] [SOURCE: .opencode/skills/sk-design/styles/README.md:17] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:75]

   **Frozen history (1 file, intentionally not rewritten):**

   - `changelog/v1.6.0.0.md` records the paths as shipped and remains unchanged under the canon's frozen-history exception. [SOURCE: .opencode/skills/sk-design/changelog/v1.6.0.0.md:14] [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:56]

   No direct legacy-name match appeared in a live package manifest, YAML configuration, or TOML configuration under `sk-design`; generated references are represented by `study-prepare.ts` exclusions and the generated retrieval manifest consumers, not by a separate config file. [INFERENCE: the complete 46-file scoped match set contains no package/configuration file]

4. **Repository-wide references need scope classification, not blind replacement.** Active external consumers such as the styles Rust-opportunity packet point at `_db/retrieval.mjs`, but completed spec history is explicitly frozen; those paths should be recorded as historical rather than rewritten. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md:19] [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:56]

5. **Safe rename sequence.** Capture a baseline on all current engine/database/mode-corpus tests; perform all five moves and all mutable references as one dependency-closure change; update cross-directory imports and runtime path constants first, then fixtures/tests, scripts, and mutable docs; run the same complete gates; only after name-only parity should manifest consolidation change schema or remove a file. Do not leave compatibility symlinks or duplicate manifests after the atomic cutover, because coordinated consumers are fully inventoried. [INFERENCE: the direct-reference closure above makes a single atomic cutover smaller and safer than prolonged dual paths, while a separate schema phase isolates behavioral failures]

6. **The manifests overlap in membership but are not schema-equivalent.** The crawl file is a top-level array of capture lifecycle records (`uuid`, source URL/time, slug, capture status/time, error); the retrieval file is a versioned generation object with `generationHash`, `crawlManifestHash`, `recordCount`, and enriched searchable `styles` records. The retrieval schema already declares its derivation relationship through `crawlManifestHash`. [SOURCE: .opencode/skills/sk-design/styles/_manifest.json:1] [SOURCE: .opencode/skills/sk-design/styles/_manifest.json:3] [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:1] [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:3]

7. **This iteration does not choose the canonical manifest.** Renaming both files is mechanically resolved, but choosing one physical source of truth requires tracing generation code, hash construction, writer ownership, invalidation behavior, and deterministic regeneration. Treating the richer retrieval manifest as automatically canonical would invert its current declared dependency on the crawl hash. [INFERENCE: `_retrieval-manifest.json` includes `crawlManifestHash`, so canonicality cannot be inferred from schema richness alone]

## Questions Answered

- **Answered:** What exact directory and file rename map follows the naming canon, including every path named by the brief? The five-entry map is fixed above. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:24] [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:52]
- **Partially answered:** Which imports, path literals, scripts, tests, documentation, configuration, and generated references must change, and in what safe sequence? The live `sk-design` direct-reference closure and sequence are inventoried; indirect/generated consumers and executable validation commands still need confirmation. [INFERENCE: exact-token inventory closes direct references but cannot prove runtime-computed paths or generated output behavior]

## Questions Remaining

- Confirm indirect/runtime-computed path construction and the exact baseline/post-cutover validation command set.
- Map every field, invariant, and lifecycle role in both manifest schemas, including writer ownership and ordering guarantees.
- Decide which data is canonical versus derived, and specify hash/provenance/deterministic-regeneration semantics.
- Define rollback and cutover proof for both naming and later consolidation, including stale generated artifacts.

## Ruled Out

- Treating leading-underscore backend paths as exempt: they are authored JavaScript/JSON filesystem names, not Python packages, tool-mandated names, generated output names, or frozen history. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:34]
- Blindly rewriting changelogs and completed spec history: the canon requires those surfaces to retain historical names. [SOURCE: .opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:56]
- Combining naming moves and manifest-schema consolidation into one cutover: doing so would remove the name-only parity boundary and make regressions harder to attribute. [INFERENCE: two independent change dimensions require separate verification boundaries]
- Assuming the retrieval manifest is canonical because it is richer: its `crawlManifestHash` explicitly signals derivation from crawl state. [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:4]

## Dead Ends

- The initial repository-wide search for bare `_db`, `_engine`, and `_harness` produced unrelated identifiers outside `sk-design`; narrowing to filesystem-shaped tokens and the owning skill removed that noise. [INFERENCE: bare underscore identifiers are code identifiers outside the filesystem-naming scope]
- No exhausted approach should be promoted after this first pass; the narrowed exact-path search was productive.

## Sources Consulted

- `.opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md:18-88`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:22-105`
- `.opencode/skills/sk-design/styles/_manifest.json:1-10`
- `.opencode/skills/sk-design/styles/_retrieval-manifest.json:1-100`
- `.opencode/skills/sk-design/styles/_engine/manifest.mjs:30-32`
- `.opencode/skills/sk-design/styles/_engine/style-library.mjs:36-172`
- `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs:44`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:649`
- Exact-reference Grep/`rg --count-matches` inventory across `.opencode/skills/sk-design`

## Assessment

- New information ratio: **1.00** (7 of 7 findings are new to this empty lineage; no simplicity bonus needed).
- Questions addressed: exact rename map; direct-reference/update plan; preliminary manifest-role distinction.
- Questions answered: exact rename map (1 of 5 key questions).
- Status: **complete** for the selected iteration focus; the lineage must continue because `stopPolicy=max-iterations`.
- Edge cases: broad bare-token search noise was corrected by filesystem-shaped scoping; frozen-history references must not be treated as mutable consumers.

## Reflection

- What worked and why: exact-token searches anchored in the naming canon separated filesystem paths from unrelated underscore identifiers and exposed the dependency closure by responsibility.
- What did not work and why: the first repository-wide bare-token search was noisy because `_db` and `_engine` are valid code identifiers outside this naming scope.
- What I would do differently: begin with owner-scoped filesystem-shaped patterns, then expand repository-wide only for exact full paths and historical consumers.

## Recommended Next Focus

Trace both manifest lifecycles end to end: identify every writer and reader, enumerate the full schemas and invariants, reconstruct `generationHash` and `crawlManifestHash` computation, and test deterministic ordering/regeneration assumptions. This is materially broader than direct-reference inventory and is required before selecting a canonical manifest or derived projection.
