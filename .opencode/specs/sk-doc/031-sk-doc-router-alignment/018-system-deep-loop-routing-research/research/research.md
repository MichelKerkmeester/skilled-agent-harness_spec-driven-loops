---
title: "Deep Research: system-deep-loop Typed-Pair Routing Alignment"
description: "Synthesized findings from a ten-iteration deep-research loop on system-deep-loop mode routing, child-packet leaf identity, skill-benchmark scoring, corpus eligibility, typed-gold authoring, and implementation gates."
trigger_phrases:
  - "system-deep-loop typed-pair routing findings"
  - "deep-loop leaf manifest research"
  - "system-deep-loop benchmark routing score"
  - "deep-loop typed gold corpus"
importance_tier: "important"
contextType: "research"
---
# Deep Research: system-deep-loop Typed-Pair Routing Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: deep-research-synthesis | v1 -->

## 1. Metadata

| Field | Value |
|-------|-------|
| Session | `rsr-2026-07-17T04-12-43Z` (generation 1, resumed after iteration 5) |
| Iterations | 10 of 10 |
| Stop | `maxIterationsReached`; convergence mode `off` |
| Executor | Native `deep-research` LEAF agent |
| Spec folder | `.opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research` |
| Starting evidence | Aggregate about 71; seven workflow modes over five child packets; zero typed-gold rows; about 319 playbook artifacts |
| Outcome | Five charter questions answered; implementation is separately gated |

## 2. Investigation Report

The loop mapped the seven public workflow modes to five child packets, exhaustively checked child-router leaf collisions, traced the skill-benchmark producer-to-consumer path, classified the playbook corpus under the production loader, and reduced the implementation work to an eight-gate dependency graph. Research remained read-only outside this packet. No hub router, manifest, scenario, loader, benchmark, or source configuration was changed.

## 3. Executive Overview

**The canonical routing identity is `{workflowMode, leafResourceId}`, with packet ownership stored separately in the registry and manifest.** Child-local leaf IDs must remain rooted at `references/` or `assets/`; embedding packet prefixes in `leafResourceId` would violate the existing contract. The fully expanded disk coordinate is `(workflowMode, packet, leaf)`. [SOURCE: research/iterations/iteration-002.md:27-29]

**A hub-level resource router is needed because flat child-relative IDs collide, but it must run after mode selection.** Five child routers expose 88 packet-local Markdown coordinates but only 79 flat IDs; eight IDs collide. The three improvement modes add a second ambiguity because all map to `deep-improvement`, so packet inference or registry order cannot recover the public mode. The hub must first resolve `workflowMode`, then select packet-qualified disk resources, and finally emit canonical pairs using the already-resolved mode plus child-local leaf IDs. [SOURCE: research/iterations/iteration-002.md:17-29] [SOURCE: research/iterations/iteration-005.md:23-27]

**The committed score of 71 did not exercise typed routing.** Typed pairs feed the existing D1-intra, D2, and D3 resource dimensions rather than adding another headline weight. The baseline reports D1-intra 100, D2 100, D3 6, and zero route-gold rows, so it measures the legacy flat path. [SOURCE: research/iterations/iteration-003.md:17-21]

**The claimed roughly 319 scenarios are 319 Markdown artifacts, not 319 benchmark rows.** The current loader recognizes 21 routing scenarios. Fourteen additional hub routing rows and four browser rows are blocked by hyphenated index paths pointing at underscore directories. After repair, the measurable family corpus should be 39 rows: 35 routing and 4 browser. The remaining 273 non-root files are loader-ineligible and must not receive inferred typed gold. [SOURCE: research/iterations/iteration-004.md:16-24]

**A seven-mode seed is statically defined but not executable today.** `MR-001..003` and `IL-001..003` cover six modes; proposed `DA-R01` closes alignment with two child-local leaves. The seven rows total 43 router-derived candidate pairs. They remain candidates until the indexed-corpus loader can preserve explicit mode/leaf metadata, the hub index is repaired, a seven-mode manifest exists, and fixture authors approve the gold. [SOURCE: research/iterations/iteration-008.md:16-39] [SOURCE: research/iterations/iteration-009.md:16-36] [SOURCE: research/iterations/iteration-010.md:31-37]

## 4. Diagnosed Architecture

1. **Hub mode route:** `mode-registry.json` maps `research`, `review`, `ai-council`, three improvement modes, and `alignment` onto five child packets. Explicit hints and dominant intent resolve the public mode before leaf selection. [SOURCE: research/iterations/iteration-001.md:17-20]
2. **Child leaf route:** each child `SKILL.md` discovers and returns paths relative to its own packet root. Those paths are locally valid but not globally unique at hub scope. [SOURCE: research/iterations/iteration-001.md:18-20]
3. **Manifest projection:** `generate-leaf-manifest.cjs` walks each declared mode's packet inventory, keeps packet ownership in the mode entry, and rejects duplicate `{workflowMode, leafResourceId}` composites. [SOURCE: research/iterations/iteration-003.md:17]
4. **Fixture/oracle route:** typed gold is opt-in. Schema, manifest membership, and selected-map validity are checked before scoring; invalid oracle rows are excluded rather than counted as router misses. [SOURCE: research/iterations/iteration-003.md:18-20]
5. **Router replay:** observed resources are canonicalized against the manifest. Unresolved resources or mode-cap excess become `routing_contract_error`; valid but incomplete pairs become `routing_miss`. [SOURCE: research/iterations/iteration-003.md:20]
6. **Score route:** typed recall replaces flat recall in D1-intra and D2, while typed precision replaces flat over-routing in D3. Aggregate scoring excludes holdouts and oracle-fault rows. [SOURCE: research/iterations/iteration-003.md:21]

## 5. Settled Findings

| Finding | Status | Evidence |
|---------|--------|----------|
| Seven public modes map to five child packets | Confirmed | Iteration 1 |
| Five routers expose 88 packet-local coordinates and 79 flat IDs | Confirmed | Iteration 2 |
| Exactly eight flat leaf IDs collide | Confirmed | Iteration 2 |
| Canonical identity is `{workflowMode, child-local leafResourceId}`; packet is separate | Confirmed contract | Iteration 2 |
| Packet identity alone cannot distinguish the three improvement modes | Confirmed | Iterations 1-2 |
| Typed routing feeds D1-intra/D2/D3 rather than a new headline dimension | Confirmed | Iteration 3 |
| Baseline 71 has zero typed rows and therefore does not validate typed routing | Confirmed | Iteration 3 |
| 319 is an artifact count; the current loader recognizes 21 rows | Confirmed census | Iteration 4 |
| Hub index paths make all 18 authored hub rows unreadable | Confirmed | Iteration 4 |
| Post-repair measurable corpus target is 39 total, 35 routing, 4 browser | Derived acceptance target | Iterations 4 and 6 |
| Six existing direct-route rows cover six modes | Confirmed authored intent | Iteration 7 |
| No loader-eligible alignment row exists | Confirmed corpus gap | Iteration 7 |
| Proposed `DA-R01` closes alignment with two deterministic child-local leaves | Proposed authored contract | Iteration 8 |
| Seven-row set is mode-complete but not executable-oracle-valid | Confirmed blocker | Iteration 9 |
| Eight ordered gates are sufficient for implementation without more routing research | Confirmed handoff | Iteration 10 |

## 6. Constraints and Limitations

- The existing hub index loader branch cannot currently preserve explicit typed metadata for the six indexed direct-route rows; choosing and testing a loader-compatible indexed-corpus representation is an implementation decision. [SOURCE: research/iterations/iteration-009.md:32-34]
- `DA-R01` is a proposed fixture contract, not a checked-in scenario. An off-index YAML fixture would be ignored by the current indexed hub loader. [SOURCE: research/iterations/iteration-009.md:34]
- The 43 candidate pairs come from deterministic router maps but are not author-approved gold. Fixture governance must approve or adjust them. [SOURCE: research/iterations/iteration-010.md:31-37]
- The 273 loader-ineligible files remain outside the critical path. Their promotion is optional governance, not a prerequisite.
- Graph convergence was unavailable because the local runtime lacks `better-sqlite3`. Convergence mode was off, so the 10-iteration cap remained authoritative.
- Spec Memory refresh was unavailable because `@spec-kit/shared` could not be resolved. Iterations used cited local evidence.
- The generated resource map reports ten `MISSING` entries because line-range suffixes and a wildcard were interpreted as file paths. Existing-file entries remain useful; the missing count is not a research-quality metric. [SOURCE: research/resource-map.md:11-17,26-52]

## 7. Integration Patterns

- Keep **mode resolution**, **disk-path selection**, and **typed-pair emission** as separate stages.
- Preserve `workflowMode` as the authoritative identity across all stages; never reconstruct it from packet name for `deep-improvement`.
- Use packet-qualified paths only for hub-level static reachability. Strip the packet prefix before constructing canonical `{workflowMode, leafResourceId}` output.
- Generate the manifest before final fixture-gold approval, then rerun `--check` after authoring to detect topology drift.
- Treat loader, topology, routing, safety, and scoring evidence as conjunctive gates. A score increase cannot compensate for an oracle fault or fallback regression.
- Preserve explicit-hint precedence, `UNKNOWN_FALLBACK`, missing-mode/path failure, and containment checks as acceptance invariants.

## 8. Implementation Guide

| Gate | Work | Required result |
|-----:|------|-----------------|
| 0 | Freeze a same-revision router-trace baseline | Preserve corpus count, D5, topology digest, oracle exclusions, D1-intra/D2/D3, and aggregate score |
| 1 | Add indexed-corpus typed-metadata support and loader regression tests | Explicit mode plus child-local leaf IDs survive normalization for indexed rows and `DA-R01` is discoverable |
| 2 | Repair hub index addresses and add the authored alignment row | Seven seed rows are loader-reachable; class boundaries remain 35 routing and 4 browser overall |
| 3 | Generate `leaf-manifest.json` | Seven mode identities, unique composites, packet-local leaf IDs, byte-stable `--check` |
| 4 | Author-review typed gold for `MR-001..003`, `IL-001..003`, and `DA-R01` | Exactly seven approved typed seed rows; no inferred gold for other files |
| 5 | Run topology and fixture gates | 39/35/4 corpus counts, seven valid typed rows, selected-map cap valid, zero oracle-fault exclusions |
| 6 | Add hub-level resource selection and canonical pair emission | Exact pairs for seven modes; no unresolved/cross-mode output; all fallback invariants pass |
| 7 | Rerun same-corpus benchmark | D5 passes; compare typed diagnostics and D1-intra/D2/D3/aggregate against gate 0 |

The validity claims progress in the same order: static mode-complete, loader-valid, manifest-checkable, executable-oracle-valid, observed-route-valid, then score-comparable. [SOURCE: research/iterations/iteration-010.md:16-35]

## 9. Verification Commands

```bash
# Same-revision before/after capture
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill .opencode/skills/system-deep-loop \
  --outputs-dir /tmp/dlw-bench-before \
  --trace-mode router \
  --output /tmp/dlw-bench-before/skill-benchmark-report.json

# Manifest generation and byte-stability check
node .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs \
  .opencode/skills/system-deep-loop
node .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs \
  .opencode/skills/system-deep-loop --check

# Deterministic Lane-C tests
(cd .opencode/skills/system-deep-loop/deep-improvement/scripts && \
  npx vitest run skill-benchmark/tests)

# Same-corpus after capture
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill .opencode/skills/system-deep-loop \
  --outputs-dir /tmp/dlw-bench-after \
  --trace-mode router \
  --output /tmp/dlw-bench-after/skill-benchmark-report.json
```

These commands are implementation-handoff evidence from iteration 6; the research loop did not execute the mutation-dependent gates. [SOURCE: research/iterations/iteration-006.md:16-34]

## 10. Acceptance Matrix

| Gate | Acceptance criterion |
|------|---------------------|
| Corpus | 39 normalized rows: 35 routing and 4 browser; no unreadable-index warnings |
| Seed | Seven typed rows covering exactly seven workflow modes |
| Candidate gold | 43 author-reviewed pairs: 6 research, 6 review, 7 AI Council, 10 agent improvement, 6 model benchmark, 6 skill benchmark, 2 alignment |
| Manifest | Byte-stable; unique composites; every pair exists under its declared mode; topology digest stable during runs |
| Oracle | Zero `fixture_schema_error`, `fixture_topology_error`, `fixture_selection_error`, or excluded typed rows |
| Routing | Exact pair recall/precision; zero unresolved resources, cross-mode outputs, or cap breaches |
| Safety | Explicit hint wins; ambiguous input returns `UNKNOWN_FALLBACK`; missing mode/path fails closed; containment rejects escapes |
| D5 | Connectivity and registry checks pass before score comparison |
| Score | Same corpus and trace mode; compare D1-intra, D2, D3, typed diagnostics, and aggregate; aggregate alone never passes |

## 11. Recommendations

1. Implement loader support and its regression tests before authoring typed fixtures. The current indexed-corpus shape is the earliest blocker.
2. Repair the hub index as addressing-only work; do not use it to broaden corpus scope.
3. Generate the seven-mode manifest before final typed-gold approval, preserving child-local leaf IDs.
4. Start with the explicit seven-row seed. Do not require all 35 routing candidates or infer gold for 273 loader-ineligible files.
5. Add the hub resource selector after mode resolution and preserve all fail-closed behavior.
6. Accept the work only through the full structural, oracle, routing, safety, and same-corpus scoring matrix.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Flat child-relative IDs as hub identity | Eight IDs collide across child packets | exhaustive router inventory | 1-2 |
| `<packet>/<leaf>` as complete identity | Three public modes share `deep-improvement` | mode registry + resolver behavior | 1-2 |
| Packet prefix inside canonical `leafResourceId` | Contract requires child-local `references/` or `assets/` IDs | leaf-resource contract | 2, 5, 8-10 |
| Typed-pair recall as an extra headline weight | It feeds existing D1-intra/D2/D3 lanes | scorer trace | 3 |
| Untyped scenarios as typed zeroes | Typed scoring is opt-in and manifest-gated | scorer trace | 3 |
| Malformed typed gold as router miss | Oracle faults are excluded before scoring | topology/scorer trace | 3 |
| Treat all 319 artifacts as scenarios | Production loader recognizes 21 current rows | deterministic census | 4 |
| Infer typed gold for loader-ineligible files | Authored metadata is absent; typed gold is opt-in | loader contract | 4-10 |
| Generate gold before index/manifest repair | Unreachable rows and absent membership would create oracle faults | dependency trace | 5-6 |
| Remove fallback branches to raise score | Fallback and containment behavior are acceptance invariants | hub router contract | 5-6 |
| Require all 35 routing rows in the first slice | Exact gold requires authored intent review | corpus/oracle analysis | 6 |
| Use one multi-probe row for several modes | Index derivation retains one dominant mode | loader contract | 7 |
| Treat existing `DAL-*` files as alignment gold | They are loader-ineligible and unapproved | corpus analysis | 7-9 |
| Add only off-index `DA-R01` YAML | Indexed hub loader ignores off-index YAML and typed frontmatter | loader branch trace | 9 |
| Treat seven-mode coverage as oracle validity | Loader reachability, manifest membership, and authored gold are separate gates | oracle matrix | 9-10 |
| Accept aggregate score movement alone | It can hide oracle, topology, corpus, and fallback regressions | verification matrix | 6, 10 |

## Divergence Map

No divergent pivots ran because `convergence_mode=off`. The loop used forced depth to move from topology, collision, scoring, and corpus evidence into fixture design, oracle validation, and implementation ordering. Saturated directions were retained as eliminated alternatives. The remaining frontier is implementation, not additional routing research.

## 12. Open Questions

- Which concrete indexed-corpus authoring representation should carry explicit `{workflowMode, leafResourceId}` metadata? This is an implementation choice constrained by iteration 9.
- Will fixture governance approve all 43 router-derived candidate pairs, or narrow any row after authored-intent review?
- Should any loader-ineligible file be promoted later? This is optional corpus governance and is not required for the seven-row critical path.

No research question remains open.

## 13. Sources and References

- Hub topology and routing: `.opencode/skills/system-deep-loop/SKILL.md`, `mode-registry.json`
- Child routers: `.opencode/skills/system-deep-loop/{deep-research,deep-review,deep-ai-council,deep-improvement,deep-alignment}/SKILL.md`
- Typed identity: `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`
- Manifest generation and topology: `generate-leaf-manifest.cjs`, `validate-playbook-topology.cjs`
- Benchmark pipeline: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/`
- Scenario authority: `.opencode/skills/system-deep-loop/**/manual_testing_playbook/`
- Baseline: `.opencode/skills/system-deep-loop/benchmark/baseline/skill-benchmark-report.json`
- Detailed evidence: `research/iterations/iteration-001.md` through `iteration-010.md`
- Deterministic inventory: `research/resource-map.md`

## 14. Iteration Trail

| Iter | Focus | Ratio | Status | Key outcome |
|-----:|-------|------:|--------|-------------|
| 1 | Seven-mode topology | 1.00 | complete | Mapped seven modes to five packets |
| 2 | Collision inventory | 1.00 | complete | Eight collisions; canonical identity corrected |
| 3 | Benchmark scoring | 1.00 | complete | Traced manifest, oracle, replay, and D1/D2/D3 |
| 4 | Scenario census | 1.00 | complete | Partitioned 319 artifacts under loader rules |
| 5 | Dependency plan | 0.90 | complete | Ordered index, manifest, gold, router, and rerun |
| 6 | Verification matrix | 0.90 | complete | Defined commands, counts, and safety assertions |
| 7 | First typed slice | 1.00 | complete | Six-mode maximal seed; alignment gap |
| 8 | Alignment contract | 0.80 | complete | Proposed `DA-R01` and two typed leaves |
| 9 | Oracle validation | 0.80 | complete | Found indexed-loader typed-metadata blocker |
| 10 | Final handoff | 0.80 | complete | Eight-gate resource DAG and acceptance bundle |

## 15. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 10 of 10
- Questions answered: 5/5
- Open research questions: 0
- Last three ratios: 0.80, 0.80, 0.80
- Average newInfoRatio: 0.92
- Convergence threshold: 0.05; convergence mode was `off`
- Route proof: all ten iteration records name `target_agent: deep-research`, `agent_definition_loaded: true`, and `mode: research`
- Reducer corruption count: 0
- Graph convergence: unavailable because `better-sqlite3` was missing; advisory blocker recorded
- Divergence: no pivots

## 16. Next Steps

1. Create a separate implementation packet from the eight-gate DAG in Section 8.
2. Freeze gate-0 baseline evidence and add loader regression support before fixture edits.
3. Repair the hub index, generate the manifest, and author-review the seven-row/43-pair seed.
4. Add hub-level packet-qualified disk selection with canonical pair emission and unchanged fallback behavior.
5. Run topology, Lane-C, D5, and same-corpus benchmark gates; report the full dimension delta, not aggregate alone.

## 17. References

This file is the canonical synthesis. Detailed cited evidence remains in `research/iterations/`; the deterministic resource inventory is `research/resource-map.md`; loop state is in `research/deep-research-state.jsonl`, `research/findings-registry.json`, `research/deep-research-strategy.md`, and `research/deep-research-dashboard.md`.
