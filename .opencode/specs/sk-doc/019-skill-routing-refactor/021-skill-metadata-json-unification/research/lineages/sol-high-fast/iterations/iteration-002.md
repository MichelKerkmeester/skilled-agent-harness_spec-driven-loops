# Iteration 2: Hub Identity and Router Schemas and Consumers

## Focus
Trace the schemas and production consumers of root skill `description.json`, `graph-metadata.json`, `mode-registry.json`, and `hub-router.json`, while separating runtime consumers from generators, validators, tests, documentation, and the identically named spec-folder continuity files.

## Actions Taken
1. Searched exact filename references, then narrowed oversized repository results to the advisor, create-skill, doctor, compiled-routing, plugin, and benchmark surfaces.
2. Read the canonical create-skill templates and router schema reference.
3. Read the advisor graph parser/indexer and its direct mode-registry executor projection.
4. Read doctor enforcement, benchmark replay/vocabulary sync, compiled-manifest loading, and representative mutation tests.

## Findings
1. The two identity filenames do not imply one shared schema. Skill `description.json` has a small hub-facing contract: `name`, `description`, `version`, and array-valued `keywords` are enforced; `modes` and `backend_kinds` are forbidden duplicate sources of registry truth. The scaffold additionally recommends `importance_tier`, `trigger_examples`, `lastUpdated`, and hub-specific arrays, but doctor does not require them. Skill `graph-metadata.json` is identified by `skill_id`, `family`, or `edges`, then strictly requires schema version 1 or 2, folder-matching `skill_id`, an allowed family, category, domains, intent signals, derived data, and typed edges. This content discriminator is what excludes same-named spec continuity metadata from advisor ingestion. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1020-1045] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-description-template.json:1-32] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:753-828] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:960-979]
2. `graph-metadata.json` is the advisor's only direct root identity/scoring source among these four: the indexer parses every discovered skill-shaped file, enforces one non-nested identity, and stores node domains, intent signals, derived metadata, and graph edges in SQLite; scorer lanes consume that projection rather than `description.json`. Doctor independently enforces one root graph file, folder identity, family, and no nested graph/description identities; benchmark vocabulary sync also reads graph trigger phrases. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:946-1005] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:1037-1133] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:252-313] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:322-354]
3. `mode-registry.json` is the packet source of truth, not advisor identity metadata. Its canonical schema is one `modes[]` array whose entries carry `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, packet/name identity, aliases, and `advisorRouting`, with optional declared extensions. Production consumers are: create-skill's leaf-manifest generator; doctor packet/discriminator/alias/tool validation; advisor executor delegation for CLI mode aliases; generated deep-loop advisor projection; benchmark router replay and vocabulary sync; and compiled-routing manifest/compiler inputs. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-registry-template.json:1-20] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-registry-template.json:21-164] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:174-193] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:316-411] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:160-180] [SOURCE: .opencode/skills/system-skill-advisor/feature-catalog/scorer-fusion/projection.md:24-30]
4. `hub-router.json` is the declarative routing table. Its required top-level shape is `skill`, `version`, `routerPolicy`, `routerSignals`, and `vocabularyClasses`; signal keys must equal registry modes, classes and resources must resolve, tie-break must be an exact mode permutation, and outcomes/default mode must conform. Production consumers are benchmark `projectHubRouter`, vocabulary sync, doctor check 5, the compiled-route manifest and per-hub compilers, plus the hub's own SKILL router. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-hub-router-schema.md:21-57] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-hub-router-schema.md:160-178] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:803-934] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:127-163] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:400-434]
5. Tests and fixtures verify consumers but are not themselves production consumers: parent-check mutation tests red invalid graph family, duplicate registry aliases, router defaults, and description registry duplication; compiled-manifest tests require exactly `SKILL.md`, registry, and router inputs and fail closed on missing/malformed/mismatched files. No production advisor code in the targeted `mcp-server` search read skill `description.json`; current evidence therefore classifies it as scaffold/doctor/discovery prose rather than a scorer input. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/parent-skill-check-fixtures.vitest.ts:53-105] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:49-79] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:191-229] [INFERENCE: the targeted production search under `.opencode/skills/system-skill-advisor/mcp-server` found graph and mode-registry consumers but no skill-root `description.json` consumer]

## Ruled Out
- Treating every filename mention in specs, docs, fixtures, or generated records as a production call site; only executable reads and runtime/compiler inputs were classified as consumers. [INFERENCE: comparison of exact filename search results with the executable reads cited above]
- Treating the advisor as a runtime consumer of every hub JSON file; it directly ingests graph metadata, reads selected mode registries for projection/delegation, and has no located runtime read of skill description or generic hub-router files. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:952-970] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:160-180]

## Dead Ends
- Repository-wide filename searches exceeded output limits because spec continuity metadata and historical documentation dominate results. Narrowing to executable ownership surfaces recovered precise call sites; repeating the broad search is not useful.

## Sources Consulted
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs:252-411,803-1045`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:740-828,946-1133`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:147-336`
- `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-{description,graph-metadata,registry}-template.json`
- `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-hub-router-schema.md:21-337`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/{router-replay,parent-hub-vocab-sync}.cjs`
- `.opencode/bin/lib/compiled-route-manifest.cjs:400-434`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/parent-skill-check-fixtures.vitest.ts:53-105`
- `.opencode/bin/tests/compiled-route-manifest.test.cjs:49-79,191-229`

## Assessment
- New information ratio: 1.00
- Novelty calculation: 5 of 5 findings are fully new relative to the iteration-1 presence/producer census; `(5 + 0.5 × 0) / 5 = 1.00`.
- Questions addressed: schemas and production consumer classes for the four hub identity/router files.
- Questions answered: the four-file subquestion is answered; the fleet question covering all eight metadata types remains open.

## Reflection
- What worked and why: owner-scoped searches followed by implementation reads separated real file reads from thousands of continuity/docs mentions and exposed the direct-versus-indirect advisor boundary.
- What did not work and why: broad exact-filename searches overflowed because identical names occur throughout spec packets and archived evidence.
- What I would do differently: search by executable owner directories first and use broad results only as a completeness cross-check.

## Questions Answered
- What schemas and production consumers govern `description.json`, `graph-metadata.json`, `mode-registry.json`, and `hub-router.json` at skill roots? Answered by Findings 1-5.

## Questions Remaining
1. What schemas and complete consumer sets govern `leaf-manifest.json`, `leaf-manifest.config.json`, `leaf-aliases.json`, and `command-metadata.json`?
2. What consumer-derived class taxonomy explains all 12 roots?
3. Which exceptional presence cases are required, optional, or defective?
4. Where should the canonical contract and fleet-wide freshness gate live?

## Recommended Next Focus
Trace the remaining four file types through the leaf-resource contract, manifest generator/checker, router replay, `command-metadata.json` ownership/history, and their tests; only then resolve the complete eight-file consumer/schema question.
