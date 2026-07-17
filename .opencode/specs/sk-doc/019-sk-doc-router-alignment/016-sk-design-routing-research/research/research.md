---
title: "Deep Research: sk-design Typed-Pair Routing"
description: "Eight-iteration diagnosis of sk-design routing measurement, leaf-manifest feasibility, typed-gold eligibility, benchmark attribution, and implementation-ready optimizations."
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research"
    last_updated_at: "2026-07-17T05:25:27Z"
    last_updated_by: "opencode"
    recent_action: "Completed eight-iteration routing research and synthesis"
    next_safe_action: "Open sibling implementation packet"
    blockers: []
    key_files:
      - "research.md"
      - "resource-map.md"
      - "deep-research-dashboard.md"
    completion_pct: 100
---
# sk-design Typed-Pair Routing Research

<!-- ANCHOR:findings -->
## 1. Executive Summary

`sk-design` has a coherent six-mode routing surface, but its committed benchmark does not measure canonical typed-pair routing. The five design workflows and the `design-mcp-open-design` transport each have an independent `workflowMode`; packet-root-relative leaves form the second axis of `(workflowMode, leafResourceId)` gold. The parent hub is the manifest owner, not a seventh mode. [SOURCE: research/iterations/iteration-001.md:7-20]

A single deterministic leaf manifest can represent all six namespaces. A non-mutating generator probe produced six mode entries and 114 leaves, and two builds were byte-identical at 7,098 bytes with SHA-256 `42514c152c74220464729d7de1c07ec1ef5a3bc686595b36cd73266461a817b2`. Shared `../shared/...` resources require explicit aliases when they must be independently typable. [SOURCE: research/iterations/iteration-002.md:7-11]

The historical aggregate of approximately 69 is not evidence of broad routing failure. It is `(D1-intra 13 + D2 20 + D3 0) / 48 = 68.75`, rounded to 69; D1-inter and D4 are unscored, and D5=100 is a separate gate. The frozen corpus has zero typed-gold rows, so D3 is a flat over-routing proxy rather than canonical pair precision. [SOURCE: research/iterations/iteration-004.md:9-13]

The current harness cannot yet produce a comparable fresh score: a non-mutating run returned `NO-SCENARIOS`, D5=100, and 27 unreadable feature-path warnings caused by hyphenated index paths versus underscored files. This is a benchmark-topology fault, not a measured router fault. [SOURCE: research/iterations/iteration-004.md:11-12]

The implementation sequence is measurement first: repair corpus paths, generate/check the manifest, independently author and validate typed gold, establish a same-corpus typed baseline, and modify routing maps only when that baseline proves a pair-level failure. [SOURCE: research/iterations/iteration-005.md:9-13]
<!-- /ANCHOR:findings -->

## 2. Research Scope

The loop answered five questions: six-mode typed-pair classification, manifest feasibility, scenario eligibility, baseline attribution, and an implementation-ready optimization order. It made no source, manifest, benchmark-fixture, or typed-gold changes. Eight iterations ran because convergence stopping was disabled; the reducer reports 5/5 questions resolved and zero corruption. [SOURCE: research/deep-research-dashboard.md:32-56]

## 3. Method

Each iteration loaded append-only packet state, investigated one focus, wrote a cited narrative plus canonical JSONL delta, and passed the mechanical route-proof validator. Evidence combined mode registries, per-mode smart routers, playbook intent, manifest/topology contracts, frozen benchmark reports, scorer implementation, and non-mutating generator/runner probes. Memory and code-graph accelerators were unavailable, so conclusions rely on direct checked-in evidence and command output. [SOURCE: research/deep-research-strategy.md:116-124]

## 4. Six-Mode Routing Surface

| Mode | Packet kind | Representative intent families |
|---|---|---|
| `interface` | workflow | design principles, transformations, variation, UX, real-system grounding, aesthetics |
| `foundations` | workflow | color, type, layout, adaptation, data visualization, tokens |
| `motion` | workflow | decision, strategy, micro-interactions, presence, performance, advanced craft |
| `audit` | workflow | audit contract, accessibility/performance, critique, anti-patterns, remediation, evidence |
| `md-generator` | workflow | extract/write, validate, report, wrapper, study |
| `design-mcp-open-design` | transport | WIRE, READ, RUN |

Typed identities use packet-root-relative leaves, for example `(motion, references/motion_strategy.md)`. Packet-qualified IDs such as `design-motion/references/...` are not canonical. [SOURCE: research/iterations/iteration-006.md:7-11]

## 5. Leaf-Manifest Feasibility

One root `leaf-manifest.json` is sufficient because uniqueness is composite on mode and leaf ID. The generator consumes each registry entry's `workflowMode` and `packet` and does not exclude the transport based on `packetKind`. Local leaves are sorted, deduplicated, serialized with stable key order and formatting, and contain no timestamp. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:88-108] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:281-338]

The official `--check` command requires a committed manifest and returns code 2 when it is absent. Research proved deterministic generation with the pure builder; implementation must write the manifest first and then run `--check` for committed-byte parity. [SOURCE: research/iterations/iteration-002.md:8-11]

## 6. Typed-Gold Scenario Partition

Of the current 37 playbook scenarios, 26 are independently typable as written, four require decomposition or an explicit alias/bundle decision, and seven should remain untyped on the positive sk-design leaf axis. In the frozen 21-scenario corpus, 16 are typable as-is, `AI-001` and `SR-002` require splitting, and `AI-002`, `AI-003`, and `SR-003` remain untyped. [SOURCE: research/iterations/iteration-003.md:7-11]

Gold must be authored from prompt intent and normative mode/resource contracts before predictions are observed. Structural validation can prove schema, manifest membership, and selected-mode joins, but cannot prove oracle independence. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:165-221]

## 7. Benchmark Diagnosis

| Dimension | Frozen result | Interpretation |
|---|---:|---|
| D1-intra | 100 | Existing flat-resource recall passes |
| D2 | 100 | Existing discovery proxy passes |
| D3 | 0 | Only scored loss; flat over-routing proxy, not typed pair precision |
| D1-inter | Unscored | Unavailable measurement, excluded from denominator |
| D4 | Unscored | Unavailable measurement, excluded from denominator |
| D5 | 100 | Connectivity gate, outside Mode-A aggregate |

The checked-in `after_d3_proxy` aggregate of 100 is not evidence of improvement because D3 became inapplicable and dropped from the denominator. The historical 69 and proxy 100 have different applicability shapes and are not valid before/after endpoints. [SOURCE: research/iterations/iteration-004.md:9-18]

## 8. Nested Transport Semantics

Transport WIRE and bare inventory remain transport-only. Design-bearing READ and RUN require an ordered design-judgment plus transport composition. One mode can legitimately carry multiple typed leaves, and a two-mode bundle can still lack a complete leaf oracle for one mode. [SOURCE: research/iterations/iteration-007.md:9-13]

Normative prose and `HM-004` require judgment-plus-transport composition, but `hub-router.json` currently declares only the `interface + foundations` bundle. This is the one concrete machine-contract gap found; it needs narrow implementation and live routing proof, not transport flattening. [SOURCE: .opencode/skills/sk-design/hub-router.json:4-25] [SOURCE: research/iterations/iteration-007.md:12-13]

## 9. Root-Cause Classification

1. **Measurement blocker:** playbook index paths do not resolve to the current underscored feature files, producing 27 unreadable references and `NO-SCENARIOS`.
2. **Measurement gap:** no committed sk-design leaf manifest exists.
3. **Measurement gap:** zero frozen scenarios carry independent typed gold.
4. **Applicability artifact:** the 69 score is driven by D3 proxy=0 while D1-inter/D4 are excluded.
5. **Potential routing contract gap:** machine-readable hub bundling does not encode required design-plus-transport composition.
6. **Not diagnosed as faults:** per-mode `INTENT_SIGNALS` and `RESOURCE_MAP` tables; existing evidence does not justify edits before a valid typed rerun.

## 10. Key Findings

- The six mode namespaces and packet-local leaves are structurally typable.
- The manifest generator already supports workflow and transport packets and is deterministic.
- Typed gold can improve measurement validity by activating pair recall/precision, but may raise or lower the score depending on actual predictions.
- The current fresh runner result is blocked by topology and must not be reported as routing quality.
- Router-map optimization is conditional on a post-enablement pair-level failure.
- The design-plus-transport bundle rule warrants a narrow machine-contract check during implementation.

## 11. Recommendations

1. **Repair benchmark topology only.** Reconcile playbook index declarations with on-disk scenario paths without changing prompts, expected behavior, or corpus membership. Accept when the runner resolves a nonzero corpus with zero unreadable-feature warnings.
2. **Generate and commit one six-mode manifest.** Run the generator with `--write`, then `--check`; require byte parity and D5=100.
3. **Author independent typed gold.** Start with the 16 frozen scenarios typable as-is, split the two batteries, and leave negative/ambiguous scenarios untyped until their contract is explicit.
4. **Run strict topology validation.** Require nonzero valid fixtures, `blocked=0`, manifest membership, and selected-map joins.
5. **Create a new same-corpus typed benchmark.** Do not overwrite the frozen baseline. Require nonzero typed rows, applicable pair recall/precision, zero topology exclusions, and scenario-level deltas.
6. **Make narrow routing changes only after failure attribution.** Wrong mode targets hub/registry selection; wrong local leaves target one packet map; a required shared leaf targets an explicit alias; design-plus-transport composition targets a narrow bundle rule.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Treat the hub as a seventh mode | Hub owns dispatch/defaults; registry defines six modes | `mode-registry.json`, `hub-router.json` | 1, 6 |
| Flatten transport into `interface` | Transport has an independent public mode and leaf namespace | transport router and registry | 1, 6 |
| Use packet-qualified leaf IDs | Public IDs are packet-root-relative | typed-pair contract | 1, 6 |
| Generate gold from predictions | Makes the measured router its own oracle | topology contract analysis | 3 |
| Treat 69 vs 100 as improvement | D3 applicability differs, so denominators differ | frozen and proxy reports | 4, 5, 8 |
| Edit router maps before typed rerun | No current pair-level fault has been measured | benchmark diagnosis | 5, 8 |
| Require one pair per selected mode | Mode cardinality and leaf cardinality are independent | topology validator | 7 |
| Treat every Open Design mention as a bundle | WIRE and inventory are explicit transport-only exemptions | transport contract | 7 |

## Divergence Map

No divergent pivots ran because convergence mode was `off`. The explored frontier covered mode identity, manifest generation, scenario oracle eligibility, score attribution, dependency ordering, state reconciliation, transport composition, and acceptance verification. Saturated directions are the eliminated alternatives above; the remaining frontier is implementation evidence, not more research.

## 12. Open Questions

No charter question remains open. Implementation must still prove:

- corpus path repair yields a readable, stable scenario set;
- the committed manifest passes `--check`;
- independently authored typed fixtures pass strict topology validation;
- WIRE, READ, RUN, and bundle scenarios route as specified;
- the same-corpus typed report identifies whether any pair-level routing defect exists.

## 13. Acceptance Matrix

| Case | Expected route | Typed-leaf acceptance | Negative control |
|---|---|---|---|
| WIRE | transport only | wiring + CLI reference leaves | no judgment mode |
| Exempt inventory | transport only | independently required inventory leaves | no inferred design axis |
| Design-bearing READ | dominant judgment + transport | transport plus independently authored judgment leaves | bare inventory stays transport-only |
| RUN | ordered judgment + transport | complete transport leaves plus explicit judgment oracle | transport-only RUN fails |
| Ambiguous candidates | clarify or state one narrow assumption | leaves only for selected mode | no hedge-all gold |
| Explicit two-axis bundle | at most two justified modes | any valid pairs within selected modes | no bundle from vague multi-intent wording |

The executable manifest, topology, and benchmark commands are recorded in iteration 8. [SOURCE: research/iterations/iteration-008.md:20-23]

## 14. Risks And Constraints

- Gold independence requires review discipline; schema-valid fixtures can still be circular.
- Shared-resource aliases must express a real route contract, not exist merely to satisfy a fixture.
- Baseline comparisons require the same trace mode, corpus, and applicability shape.
- A correct two-mode route is not automatically complete multi-pair leaf gold.
- Memory and coverage-graph services were unavailable during this run; direct source evidence mitigated discovery risk, but graph convergence telemetry is absent.

## 15. Resource Map

The workflow emitted `research/resource-map.md`, covering the cited sk-design routers, mode packets, playbook, benchmark artifacts, topology validator, and typed-pair decision record. All 14 mapped references exist on disk. [SOURCE: research/resource-map.md:11-50]

## 16. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 8
- Questions answered: 5 / 5
- Remaining questions: 0
- newInfoRatio trend: `1.00, 1.00, 1.00, 0.90, 0.70, 0.10, 0.70, 0.50`
- Convergence threshold: 0.05
- Convergence mode: `off`; convergence was telemetry only
- Route-proof validation: 8 / 8 iterations passed
- Reducer corruption count: 0
- Graph convergence: unavailable because the local coverage-graph runtime lacked `better-sqlite3`

## 17. References

- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/references/smart_router_pseudocode.md`
- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-audit/references/smart_router_pseudocode.md`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md`
- `.opencode/skills/sk-design/design-mcp-open-design/references/smart_router_pseudocode.md`
- `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/sk-design/benchmark/README.md`
- `.opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs`
- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/012-sk-doc-routing-fixes/decision-record.md`
- `research/resource-map.md`
