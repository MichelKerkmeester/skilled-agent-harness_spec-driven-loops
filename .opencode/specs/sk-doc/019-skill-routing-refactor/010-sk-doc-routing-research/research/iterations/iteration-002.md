# Iteration 2: Re-ground the alias premise and trace the scorer's hub inputs

## Focus

Resolve what produced the expected “~34” figure, then establish whether `router-replay.cjs` scores a hub from current live configuration or from a reduced or historical snapshot. The selected interpretation is the deterministic scorer path; the historical Mode-B live report is treated separately because it records observed model behavior rather than a reproducible snapshot of current router files.

## Actions Taken

1. Read the research config, state log, strategy, and findings registry before selecting the focus; confirmed iteration 2, no exhausted approaches, and the three allowed output paths.
2. Searched the current packet, sibling sk-doc packets, sk-doc sources, and benchmark sources for the literal `~34`, `20/100`, `19%`, and `65 resources` premises.
3. Located and read `router-replay.cjs`, following `projectHubRouter`, `buildRegistryIndex`, `buildHubRouteTelemetry`, router precedence, and the parent-hub resource replay branch.
4. Traced callers and scoring anchors for scenario execution, fitted/holdout partitioning, and D1intra/D2/D3/D5 aggregation; compared those paths with the stored sk-doc Mode-B report.
5. Read the current sk-doc `hub-router.json` and `mode-registry.json`, and checked for the optional surface-router and command-metadata files.

## Findings

1. **The “~34” figure is a stale create-skill canon assertion, not benchmark output.** The only direct source found says that sk-doc uses a compositional vocabulary strategy that “leaves ~34” registry aliases without a literal router-vocabulary home. That sentence defines the comparison: literal `mode-registry.json > modes[].aliases[]` values versus literal `hub-router.json > vocabularyClasses.*.keywords[]` values. Iteration 1's current-file comparison found 113/113 equality, so the sentence now describes an older configuration state. It is not a count of command aliases, gold resources, normalized tokens, or a scorer snapshot. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:208] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:209] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/iterations/iteration-001.md:1]

2. **Deterministic hub scoring projects the current on-disk `hub-router.json`; it has no snapshot input.** `parseRouter` first tries inline `INTENT_SIGNALS`/`RESOURCE_MAP`, then a referenced smart-routing document, and only then calls `projectHubRouter` on `<skillRoot>/hub-router.json`. `projectHubRouter` reads that file synchronously at call time and constructs scoring keywords exclusively from each `routerSignals[mode].classes` vocabulary and any signal-local keywords. No benchmark snapshot or report artifact enters this path. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:112] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:121] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:245] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:267]

3. **Registry aliases are invisible to deterministic intent scoring unless mirrored into hub-router vocabulary.** `buildRegistryIndex` reads only current `mode-registry.json` entries keyed by `workflowMode`. Its consumers use registry data to add `backendKind` and `packet` telemetry and to construct packet roots for existence checks; `scoreIntents` receives the `intentSignals` projected from `hub-router.json`, not `modes[].aliases`. Therefore an actual literal alias gap would be under-scored by Mode A, but the current sk-doc files have no such gap, so that mechanism cannot explain the stored ~19% recall. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:158] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:169] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:186] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:307] [SOURCE: .opencode/skills/sk-doc/hub-router.json:22] [SOURCE: .opencode/skills/sk-doc/mode-registry.json:16]

4. **For sk-doc, deterministic replay stops at hub packet resources because the optional second-layer surface router is absent.** The hub projection maps every mode to a packet `SKILL.md` resource such as `create-skill/SKILL.md`. The replay only substitutes leaf-resource routing when `shared/references/smart_routing.md` or `references/smart_routing.md` exists and contains parseable dictionaries. Neither candidate exists for sk-doc, so Mode A returns the hub's packet-level resources. This is a concrete scorer/config mismatch when scenario gold expects root-relative leaf references under a packet; expanding registry aliases would not repair it. [SOURCE: .opencode/skills/sk-doc/hub-router.json:22] [SOURCE: .opencode/skills/sk-doc/hub-router.json:34] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:389] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:396] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:501] [INFERENCE: both router-replay candidate paths were checked on disk and were absent]

5. **The cited 20/100 result is a historical Mode-B live artifact, not evidence of what a rerun against today's configs would do.** The report declares `scoringMethod: mode-b-live`, 19 fitted scenarios, zero holdouts, D1intra 24, D2 24, D3 8, and D5 100. All hub-route telemetry denominators are zero, while SD-015 records 65 routed and 65 wasted resources. The report contains the target root but no router/config fingerprint or embedded snapshot, so it supports the observed failure profile but cannot attribute that profile to today's alias projection. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:12] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:38] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:93] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:163] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:499]

6. **The scorer's fitted/holdout projection is scenario-stage driven.** Routing and negative rows form the fitted set; only rows explicitly staged `holdout` enter the holdout set. D1intra/D2/D3 are scored per scenario and aggregated separately from the D5 structural hard gate. This opens Q3 but does not yet explain the complete 19-row loss distribution, which requires reading the gold fields and live-observation parser for every sk-doc scenario. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1106] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1124] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1133] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1141] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1281] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1465]

## Ruled Out

- **Command aliases as the source of `~34`:** sk-doc has no `command-metadata.json`, and the only literal `~34` source explicitly describes registry aliases versus router vocabulary. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:209] [INFERENCE: `.opencode/skills/sk-doc/command-metadata.json` was checked and is absent]
- **Gold-resource or normalized-token count:** no source associates 34 with either; the canon sentence names literal vocabulary homes, while the report's resource metrics use a different 19-scenario population. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:209] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:163]
- **A hidden router-replay snapshot:** the implementation accepts only `skillRoot` and task text and reads router files beneath that live root. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:477] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:483]

## Questions Answered

- **Q1:** Answered for the current deterministic scorer. A real registry-to-vocabulary alias gap would be invisible to Mode-A scoring, but current sk-doc has no literal gap; the old `~34` premise cannot explain the historical ~19% live recall.
- **Carried-forward source question:** Answered. `~34` came from a stale create-skill canon statement about compositional literal vocabulary coverage.
- **Carried-forward scorer-input question:** Answered. `router-replay.cjs` reads current `hub-router.json` and current `mode-registry.json`; it does not consume a benchmark snapshot. Registry aliases are not part of its scoring projection.

## Questions Remaining

- **Q2:** Whether create-skill teaching and emitted templates cause the model's wrong path-root convention.
- **Q3:** Partially answered. Remaining work is to trace the Mode-B live observation parser and private/public gold join across all 19 rows, then quantify which stage loses points through path mismatch versus over-bundling.
- **Q4:** Whether the drift guard detects stale canon text and/or enforces the chosen mirrored-vocabulary strategy.
- **Q5:** Prioritized fixes after Q2–Q4 are evidenced.

## Assessment

- New information ratio: **0.90** — four findings are fully new and the premise-resolution finding partially extends iteration 1.
- Status: **complete** — the iteration answered Q1 and both carried-forward focus questions with local source evidence.
- Edge cases: the stored benchmark report lacks configuration fingerprint provenance, so claims about the exact router version used remain deliberately unresolved.

## Reflection

- What worked and why: tracing the literal `~34` phrase first separated a stale documentation premise from scorer behavior; following runtime file reads then established the live-versus-snapshot boundary directly.
- What did not work and why: the broad initial artifact search produced substantial unrelated benchmark data; narrow symbol and exact-phrase searches were more reliable.
- What I would do differently: start the next pass at the scenario loader and live executor, then follow one failing scenario end-to-end before aggregating all 19.

## SCOPE VIOLATIONS

- `progressiveSynthesis` is enabled, but this dispatch's allowed-write list excludes `research/research.md`. Updating it would violate the packet-specific scope lock, so no synthesis mutation was attempted; the workflow reducer/orchestrator must own that update.

## Next Focus

Complete Q3 by tracing one zero-recall and the 65-resource over-bundle scenario from playbook gold through `load-playbook-scenarios.cjs`, the Mode-B live executor/observation parser, `scoreScenario`, and aggregate scoring. Then classify all 19 sk-doc rows by first causal failure: wrong path-root normalization, missing expected leaf resource, or over-bundled resource set.
