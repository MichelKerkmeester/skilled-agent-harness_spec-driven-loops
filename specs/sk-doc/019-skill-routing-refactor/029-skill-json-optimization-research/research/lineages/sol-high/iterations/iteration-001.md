# Iteration 1: JSON inventory and current state

## Focus
Dimension 1 only: enumerate the skill-root and advisor-side JSON surfaces, classify authored versus generated state, measure H/S-root presence, and map current generation and validation coverage. The narrow interpretation is production skill-root identity/routing JSON plus the advisor projections and compiled activation manifest named by the packet; optimization, effectiveness, and test-depth judgments are deferred.

## Findings
1. **The governed root inventory is eight JSON filenames with a two-class contract.** `graph-metadata.json` is required for H and S; H requires authored `description.json`, `mode-registry.json`, `hub-router.json`, and `command-metadata.json`; S requires authored `leaf-manifest.config.json`; `leaf-manifest.json` is generated for both; and `leaf-aliases.json` is optional/authored for H but required/generated for S. The library encodes the same eight-name universe and exact required/generated sets. [SOURCE: .opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md:56-69] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs:44-54] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs:73-87] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs:139-152]

2. **Current H/S presence is contract-complete across 11 direct roots.** The seven H roots are `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-prompt`, and `system-deep-loop`; the four S roots are `mcp-code-mode`, `sk-git`, `system-skill-advisor`, and `system-spec-kit`. A live read-only fleet-gate run reported 11 checked, 11 passed, no unclassified roots, and no violations; its presence scan found the six required H files on every H root, the four required S files on every S root, and one legal H alias overlay (`sk-doc/leaf-aliases.json`). The documented fleet list and the gate's SKILL-marker discovery/reporting logic independently anchor that result. [SOURCE: .opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md:47-52] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:74-96] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:372-412] [INFERENCE: live read-only `ci-skill-root-metadata.cjs --format json` plus `readPresence()` output, interpreted against the cited contract]

   | Class | Root | Present governed JSON |
   |---|---|---|
   | H | cli-external-orchestration | description, graph-metadata, leaf-manifest, mode-registry, hub-router, command-metadata |
   | H | mcp-tooling | description, graph-metadata, leaf-manifest, mode-registry, hub-router, command-metadata |
   | H | sk-code | description, graph-metadata, leaf-manifest, mode-registry, hub-router, command-metadata |
   | H | sk-design | description, graph-metadata, leaf-manifest, mode-registry, hub-router, command-metadata |
   | H | sk-doc | description, graph-metadata, leaf-manifest, **leaf-aliases**, mode-registry, hub-router, command-metadata |
   | H | sk-prompt | description, graph-metadata, leaf-manifest, mode-registry, hub-router, command-metadata |
   | H | system-deep-loop | description, graph-metadata, leaf-manifest, mode-registry, hub-router, command-metadata |
   | S | mcp-code-mode | graph-metadata, leaf-manifest, leaf-aliases, leaf-manifest.config |
   | S | sk-git | graph-metadata, leaf-manifest, leaf-aliases, leaf-manifest.config |
   | S | system-skill-advisor | graph-metadata, leaf-manifest, leaf-aliases, leaf-manifest.config |
   | S | system-spec-kit | graph-metadata, leaf-manifest, leaf-aliases, leaf-manifest.config |

3. **Authorship is file-level except for the advisor-maintained `derived` block inside authored `graph-metadata.json`.** The contract permits unattended writes only for manifests and S aliases, while `syncDerivedMetadata()` reads the existing graph object, deterministically constructs and validates `derived`, preserves stable generated timestamps when content is unchanged, and atomically rewrites only when the derived content or schema changes. The advisor root illustrates authored `edges`, `domains`, and `intent_signals` beside a `derived` section and references `skill-graph.json` plus regression JSONL as advisor key files; those are advisor inputs/evidence, not additional H/S root-contract files. [SOURCE: .opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md:85-100] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:92-138] [SOURCE: .opencode/skills/system-skill-advisor/graph-metadata.json:6-71] [SOURCE: .opencode/skills/system-skill-advisor/graph-metadata.json:97-105]

4. **Scaffolding covers both authored class declarations but intentionally leaves generated artifacts to the fleet gate.** Standalone initialization emits `graph-metadata.json` and `leaf-manifest.config.json`; parent initialization emits registry, router, graph identity, description, and an initially empty command surface. The fleet gate then regenerates/byte-compares `leaf-manifest.json`, derives S aliases, checks nested identities, and validates H command metadata; its `--fix` path removes only generated-file absence findings. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:270-331] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/init_skill.py:515-603] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:305-357]

5. **Generated-manifest coverage is currently fresh, but two scanners have different discovery guarantees.** A live read-only freshness run reported 11/11 manifests byte-fresh. `ci-leaf-manifest-freshness.cjs` discovers only already-committed manifests, whereas `ci-skill-root-metadata.cjs` begins from direct-child `SKILL.md` roots and can therefore detect a missing manifest; the latter also checks S aliases and H command metadata. The generator supports H registry/router inputs and S `leaf-manifest.config.json`, canonicalizes output, and byte-compares committed bytes. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-84] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:14-19] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:173-208] [INFERENCE: live read-only freshness-gate output interpreted against the cited scanner implementations]

6. **Advisor-side state adds projections, not more root-contract JSON types.** The watcher discovers `SKILL.md`, `graph-metadata.json`, declared derived key files, and optionally reference/asset frontmatter, then routes reindexing into the SQLite skill graph; `intent_signals` reside in the graph metadata. Compiled routing is a separate generated runtime `manifest.json` per hub, sourced from `SKILL.md`, `hub-router.json`, and `mode-registry.json`; its JSON contract has `schemaVersion`, `selectedPolicy`, `servingAuthority`, and `shadowOnly`, with mint, freshness, and atomic refresh automation. `description.json` is not an advisor production input. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:228-252] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:5-10] [SOURCE: .opencode/skills/system-skill-advisor/graph-metadata.json:59-71] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:26-27] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:391-424] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:606-620] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:714-735] [SOURCE: .opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md:73-79]

## Ruled Out
- Treating `generate-description.js` or `backfill-graph-metadata.js` as skill-root producers: the skill contract explicitly separates `.opencode/specs/` continuity schemas from `.opencode/skills/<root>/` identity schemas, while the cited intake workflow invokes the former for spec folders. [SOURCE: .opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md:32-32] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/intake-contract.md:156-156]
- Treating the output-first leaf freshness scanner as complete fleet adoption coverage: it starts from committed `leaf-manifest.json`; only the root gate starts from `SKILL.md`. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-71] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:74-86]

## Dead Ends
None. The current-state inventory was obtainable from the class contract, live read-only gates, and source-level ingest/generation paths.

## Edge Cases
- Ambiguous input: `generate-description.js` and `backfill-graph-metadata.js` share filenames with skill-root metadata but operate on the separate spec-continuity schema; they were inventoried only to rule out that conflation.
- Contradictory evidence: none.
- Missing dependencies: none required; resource-map and code-graph context were already documented unavailable, so direct local evidence was used.
- Partial success: none affecting the inventory.

## Sources Consulted
- `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md:21-166`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs:44-152`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:74-412`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-240`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-132`
- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py:270-331,515-665`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/daemon/watcher.ts:228-252`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:92-138`
- `.opencode/skills/system-skill-advisor/graph-metadata.json:1-155`
- `.opencode/bin/lib/compiled-route-manifest.cjs:26-27,391-424,606-735`

## Assessment
- New information ratio: 1.0
- Questions addressed: What JSON types exist, which are authored versus generated, where are they present for H and S roots, and what automation covers them?
- Questions answered: The first key question is answered for the current 11-root fleet and named advisor-side projections.

## Reflection
- What worked and why: The contract supplied the finite type system, while live non-mutating gates supplied current fleet/presence/freshness state and source reads established producer/consumer boundaries.
- What did not work and why: Broad filename discovery mixed unrelated spec-fixture JSON into results; classification had to remain anchored to direct-child `SKILL.md` roots rather than filename counts.
- What I would do differently: Use the root gate's exported discovery/presence functions first, then inspect only the resulting 11 roots and named advisor consumers.

## Recommended Next Focus
Dimension 2 only: assess redundancy, unused fields, duplication, and drift surfaces across this now-bounded inventory, especially the authored/generated split inside `graph-metadata.json`, the non-production H `description.json`, overlapping manifest gates, and separate compiled activation manifests.
