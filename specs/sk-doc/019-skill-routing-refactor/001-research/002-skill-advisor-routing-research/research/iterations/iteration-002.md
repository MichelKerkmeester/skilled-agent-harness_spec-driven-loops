# Iteration 2: advisor vocabulary alignment with hub registries

## Focus

Determine whether `routing-registry-drift-guard` keeps advisor vocabulary aligned with sk-doc's `hub-router.json` and `mode-registry.json`, distinguish hub-internal vocabulary parity from advisor discovery parity, and identify the remaining enforceable gap.

## Actions Taken

1. Read the active config, append-only state log, strategy, and iteration 1 narrative before investigating Q4.
2. Traced `routing-registry-drift-guard.vitest.ts`, its Python projection generator, and the cross-language vocabulary agreement test to identify their exact source registries and equality claims.
3. Compared sk-doc's registry modes, mode aliases, router signal keys, alias vocabulary classes, graph metadata discovery phrases, and packet count with a read-only script.
4. Ran the advisor drift/vocabulary tests and the canonical parent-hub structural checker against sk-doc.

## Findings

### F1 — The named advisor drift guard does not inspect sk-doc

`routing-registry-drift-guard.vitest.ts` hard-codes `.opencode/skills/system-deep-loop/mode-registry.json`, hashes only its `lexical` and `alias-fold` projection entries, and compares those entries with the generated TypeScript and Python deep-routing maps. The Python generator is equally explicit: `MODE_REGISTRY_PATH` points only to `system-deep-loop`, and its projection hash names `system-deep-loop`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:26] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:57] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:320]

The companion `vocabulary-agreement.vitest.ts` broadens only the enum-level contract: it proves that routing classes are exactly `lexical`, `alias-fold`, `metadata`, and `command-bridge` across the CJS checker and drift-guard type. It does not compare any sk-doc mode names, aliases, router signals, or graph metadata. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/vocabulary-agreement.vitest.ts:61] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/vocabulary-agreement.vitest.ts:94] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/vocabulary-agreement.vitest.ts:123]

Both test files passed: 12 tests across the two files. That confirms the system-deep-loop projection and shared enum vocabulary are fresh; it is not evidence of sk-doc advisor-vocabulary parity.

### F2 — sk-doc's hub-internal vocabulary is aligned today

sk-doc declares 12 workflow modes backed by 11 unique packet directories because `create-skill` and `create-skill-parent` intentionally share the `create-skill` packet. The router has exactly the same 12 signal keys, and each mode's alias list exactly matches its mode-specific `*-aliases` vocabulary class. Across the registry there are 113 case-insensitively unique aliases. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:16] [SOURCE: .opencode/skills/sk-doc/hub-router.json:22] [SOURCE: .opencode/skills/sk-doc/hub-router.json:36]

This is enforced by the canonical checker, not by the advisor drift guard. `parent-skill-check.cjs` verifies alias uniqueness, valid `advisorRouting` classes, bidirectional equality between `routerSignals` and registry `workflowMode`, defined vocabulary classes, resolvable resources, and an exact tie-break permutation. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:409] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:441] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:691] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:712] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:749]

The live strict run passed every invariant with zero warnings, including 12 modes, 113 unique aliases, 12 matching router signals, 14 defined referenced vocabulary classes, all resource paths, and the full tie-break order.

### F3 — The architecture intentionally separates advisor discovery from hub mode selection

Every sk-doc mode uses `advisorRouting.routingClass: metadata`; the registry contract explicitly says the advisor resolves the single hub identity through metadata and the hub then selects a mode. There are no sk-doc lexical or alias-fold projection entries by design. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:10] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:27] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:159]

The advisor's lexical index consumes a skill projection's `name`, `keywords`, `domains`, `intentSignals`, `derivedTriggers`, and `description`, not a hub's `hub-router.json` vocabulary directly. sk-doc supplies those hub-discovery fields through its single root `graph-metadata.json`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts:47] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts:152] [SOURCE: .opencode/skills/sk-doc/graph-metadata.json:33] [SOURCE: .opencode/skills/sk-doc/graph-metadata.json:53] [SOURCE: .opencode/skills/sk-doc/graph-metadata.json:73]

The resulting contract is two-stage:

`user prompt -> advisor discovers sk-doc from graph metadata -> sk-doc hub-router selects workflowMode from its richer vocabulary`

Full alias equality between graph metadata and the router would therefore be the wrong invariant. It would duplicate registry-owned vocabulary, inflate lexical evidence, and erode the hub's single-source-of-truth design.

### F4 — The unguarded boundary is metadata-hub discoverability

`parent-skill-check.cjs` documents `system-deep-loop` as the only global projection-map owner. Other hubs receive projection coverage only when they declare lexical modes; metadata-only hubs have nothing cross-checked against the advisor. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:91] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:660]

The live sk-doc run made that boundary visible: it reported no lexical/alias-fold modes and therefore no advisor drift-guard requirement, then proceeded to prove only hub-internal structure. A read-only comparison found that the 113 registry aliases have 15 exact-string matches in the 32 combined graph-metadata intent/trigger phrases (13.3%). This is not a recall score: token matching, semantic similarity, descriptions, domains, and generated evidence can route aliases that are not exact metadata strings. It does prove there is no equality-based synchronization between the advisor's discovery fields and the hub's full routing vocabulary. [SOURCE: .opencode/skills/sk-doc/graph-metadata.json:53] [SOURCE: .opencode/skills/sk-doc/graph-metadata.json:73] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:26]

A mode alias can therefore be added or changed while all current structural and projection drift gates remain green, even if that phrase stops discovering `sk-doc` reliably at the advisor layer. The hub router would handle the phrase correctly only after the advisor has selected the hub.

### F5 — The fix should be behavioral coverage, not a 113-alias metadata mirror

Three implementable changes follow, in priority order:

1. Add a metadata-hub advisor-discovery battery under `system-skill-advisor/mcp_server/tests/` that enumerates registry-bearing hubs, reads curated public prompts per workflow mode, runs the real scorer, and requires the hub identity to meet the compatibility thresholds. For sk-doc, start with one uncontaminated representative prompt per 12 workflow modes plus hard negative neighbors. This closes the actual pre-hub failure boundary.
2. Extend the parent-hub contract with an explicit pointer to those discovery fixtures, then make `parent-skill-check.cjs` fail when a metadata-routed mode has no representative fixture. Keep mode aliases in `mode-registry.json`; do not copy the complete alias set into `graph-metadata.json`.
3. Rename or document `routing-registry-drift-guard.vitest.ts` as the system-deep-loop projection guard, or generalize it to iterate only hubs declaring an advisor-projection extension. This prevents a green test name from being read as repository-wide hub-vocabulary coverage.

The first change has the highest correctness payoff because it tests the real outcome: the advisor finds the hub at the right threshold before the hub router gets a chance to classify the mode.

## Sources Consulted

- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/vocabulary-agreement.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/bm25.ts`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
- `.opencode/skills/sk-doc/hub-router.json`
- `.opencode/skills/sk-doc/mode-registry.json`
- `.opencode/skills/sk-doc/graph-metadata.json`

## Questions Answered

- Q4: Answered. sk-doc's registry and hub-router vocabulary are internally aligned and strictly checked, but the named advisor drift guard does not cover sk-doc. The advisor/hub boundary is intentionally metadata-first, and metadata-hub discoverability currently lacks a behavioral parity gate.

## Questions Remaining

- Q1: Quantify RRF normalization, confidence-floor saturation, ambiguity clusters, and held-out correctness.
- Q2: Trace hook brief behavior and CLI fallback under unhealthy transport.
- Q3: Prove hook gating and MCP threshold synchronization across environment and call-specific overrides.
- Q5: Consolidate and rank improvements after the transport and threshold evidence is complete.

## Dead Ends

- Treating a green `routing-registry-drift-guard` result as sk-doc coverage was ruled out; its source path is hard-wired to system-deep-loop.
- Treating exact graph-metadata alias coverage as routing recall was ruled out; the advisor uses multiple weighted fields and semantic/derived lanes, while the hub uses the richer alias vocabulary only after discovery.
- The first parent checker invocation used a repo-relative path even though the checker resolves from `.opencode/`; it was an invocation error, not a product failure. Re-running with `skills/sk-doc` passed with zero warnings.

## Assessment

- `newInfoRatio`: 0.79
- Novelty justification: This iteration separated three previously conflated contracts—system-deep-loop projection freshness, sk-doc hub-internal parity, and metadata-hub advisor discoverability—and identified the specific unguarded boundary with passing executable evidence.
- Confidence: High for guard scope, current sk-doc structural parity, and the missing equality/behavior gate; medium for the proposed fixture shape until the held-out scorer corpus is inspected in a later iteration.

## Next Focus

Q3: Trace `shouldFireAdvisor`, compatibility-threshold resolution, environment overrides, and per-call MCP overrides to prove or falsify hook/MCP threshold parity.

