# Iteration 2: Optimization and consolidation boundaries

## Focus
Dimension 2 only: identify redundant, unused, duplicated, and drift-prone skill/advisor JSON fields, trace each candidate to concrete consumers, and separate removable redundancy from generated or duplicated representations that remain load-bearing. The highest-leverage interpretation is schema and source-of-truth consolidation across root metadata, advisor projections, and compiled routes; automation, routing quality, and test-depth work remain deferred.

## Findings
1. **Highest leverage: two incompatible definitions currently claim `graph-metadata.json.derived` schema v2, and the TypeScript writer emits a field the active scorer does not consume.** `SkillDerivedV2Schema` requires `keywords`, provenance, `generated_at`, demotion, trust, sanitizer, and lifecycle fields, and `syncDerivedMetadata()` writes exactly that shape. The Python graph compiler instead requires `key_topics`, `entities`, `causal_summary`, `created_at`, and `last_updated_at`. The scorer builds derived keywords from `key_topics`, `entities`, `key_files`, and `source_docs`, not the TypeScript schema's `keywords`; a repository consumer search found no `derived.keywords` read. Consolidate these into one generated schema and one validator before trimming individual fields; otherwise a sync can replace a compiler-valid block with a differently valid block while dropping scorer vocabulary. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts:35-55] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:106-135] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:300-325] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:658-685]

2. **`routerPolicy.tieBreak` is a confirmed drift-prone duplicate for the sk-doc compiled route.** The authored router carries an explicit ordered list, but its compiler documents that legacy replay never reads that field, that the separately authored order has already drifted from `routerSignals` key order, and therefore derives compiled tie-breaking from the latter. Keeping two orders while silently honoring only one is avoidable redundancy; select one explicit order as authority and validate/derive the other representation rather than relying on JSON object key order. [SOURCE: .opencode/skills/sk-doc/hub-router.json:4-13] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:188-195]

3. **Per-mode `advisorRouting.packetSkillName` is an unverified duplicate of top-level `packetSkillName`.** Each mode already declares top-level packet identity and repeats it inside `advisorRouting`; the advisor executor consumes the top-level value, the parent gate validates top-level identity against folder/frontmatter, and the compiler consumes only nested `routingClass`. The only located nested `packetSkillName` read is a drift test, not production routing. The nested copy is therefore a strong consolidation candidate: derive it for compatibility or remove it after schema migration, while retaining top-level `packetSkillName` because executor delegation consumes it. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:19-40] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:160-174] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:413-445] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:357-392]

4. **Registry aliases and router vocabulary are overlapping but not wholly redundant; consolidation must preserve their distinct consumers.** Modes carry public/advisor aliases while `hub-router.json` repeats many of those phrases in vocabulary classes. The compiler explicitly unions `workflowMode`, command, aliases, and class keywords, then deduplicates them; separately, executor delegation reads registry aliases directly for per-executor routing. The optimization is to enforce disjoint ownership—public aliases in the registry and only incremental weighted detector terms in router classes—or generate one projection from the other, not delete either surface wholesale. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:19-40] [SOURCE: .opencode/skills/sk-doc/hub-router.json:22-49] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:173-185] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:130-174]

5. **Standalone `leaf-aliases.json` is a persisted identity copy of `leaf-manifest.json`, whereas hub aliases can contain real relocation data.** The fleet gate states that S rows carry no information absent from the manifest and deterministically emits `{workflowMode, leafResourceId, diskPath: leafResourceId}` for every leaf. Alias consumers do use `diskPath` to resolve shared/legacy paths, so H alias overlays remain load-bearing; for S, either derive identity aliases in memory or teach consumers to use the manifest directly before making the generated alias file optional. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:205-249] [SOURCE: .opencode/skills/system-skill-advisor/leaf-aliases.json:1-15] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:249-277]

6. **Hub `description.json` has five locally unverified fields beyond the four-field enforced identity, so field-by-field retention is safer than deleting the file.** The checked-in hub adds `importance_tier`, `trigger_examples`, `lastUpdated`, `supported_surfaces`, and `opencode_languages`, while the hub checker requires only `name`, `description`, `version`, and `keywords`; no in-repository skill consumer was found for `trigger_examples`, `supported_surfaces`, or `opencode_languages`. The root contract still assigns H identity projection to the file, so preserve the four-field core and verify external runtime/advisor consumers before removing extras. [SOURCE: .opencode/skills/sk-doc/description.json:2-51] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1022-1044] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs:22-34]

## Ruled Out
- **Deleting compiled activation manifests as duplicate route data.** They are generated from `SKILL.md`, registry, and router inputs, but retain the selected policy hash/generation plus mutable serving-authority state; refresh preserves that state and publishes atomically. This is a load-bearing activation/cache boundary, not avoidable authored duplication. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:400-430] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:650-735]
- **Collapsing `command-metadata.json` into `mode-registry.json` without a projection.** Registry `command` participates in compiled routing vocabulary, while command metadata validates command existence, owner-mode binding, intent ownership, and ordered resource choreography. Shared IDs can have one authoring source, but both consumer-specific projections are currently load-bearing. [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:173-183] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:7-34] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:254-302]
- **Removing `grandfatheredFolderMismatch` merely because current sk-doc values are all false.** The gate uses explicit true/false declarations to detect both real mismatches and stale exceptions, so the apparent repetition is a policy assertion with a verified validator consumer. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:19-40] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:409-425]

## Dead Ends
- Treating all repeated strings as equivalent duplication was eliminated: registry aliases, router vocabulary, graph-derived buckets, and compiled activation state have different trust, weighting, or serving consumers. Consolidation must be field/producer-specific.
- Immediate deletion of the extra H description fields is not justified until external runtime consumption is checked; the local repository proves absence of a verified local consumer, not universal non-use.

## Edge Cases
- Ambiguous input: none; optimization was bounded to the inventory established in iteration 1.
- Contradictory evidence: two incompatible schema-v2 contracts govern `derived`; both claims and their consumers are preserved above. Resolution remains a single-schema migration decision.
- Missing dependencies: external runtime consumption of H `description.json` extras is not locally inspectable; those fields are marked unverified rather than unused.
- Partial success: none; the optimization question is answered with consumer-traced candidates and explicit non-candidates.

## Sources Consulted
- `.opencode/skills/system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts:35-55`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:92-145`
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:280-330`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:200-221,640-689`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:130-179,254-274`
- `.opencode/skills/sk-doc/mode-registry.json:1-163`
- `.opencode/skills/sk-doc/hub-router.json:1-51`
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:124-195,270-399`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:205-302`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:249-288`
- `.opencode/bin/lib/compiled-route-manifest.cjs:391-440,606-745`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs:392-531,1022-1048`

## Assessment
- New information ratio: 0.92
- Questions addressed: Which fields or files are redundant, unused, duplicated, or drift-prone, and what consolidation has the highest leverage?
- Questions answered: The optimization question is answered with six consumer-traced findings; the dual derived-schema contract is the highest-leverage consolidation, followed by tie-break and nested packet-identity duplication.

## Reflection
- What worked and why: Starting from actual field shapes and then tracing readers separated persisted copies from deliberate projections; compiler comments exposed a concrete already-drifted duplicate rather than a hypothetical risk.
- What did not work and why: Broad field-name searches produced unrelated spec-memory metadata hits because names such as `importance_tier` and `description.json` are shared across separate schemas; searches had to be narrowed to skill-root and advisor runtime code.
- What I would do differently: Build a machine-readable producer/consumer matrix per governed field before the next cross-cutting pass, using exact property reads rather than filename-level references.

## Recommended Next Focus
Dimension 3 only: automation gaps—determine which authored JSON, schema synchronization, source-of-truth projections, scaffolds, and freshness checks can be generated or automatically reconciled, starting with the conflicting derived-v2 producers and the drift-prone tie-break/packet-identity copies.
