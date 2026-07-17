# Iteration 3: Trace Mode-B gold, observations, scoring, and the 19-row loss distribution

## Focus

Complete Q3 by following one zero-recall path-root failure (`SD-009`) and the 65-resource over-bundle (`SD-015`) from authored playbook gold through `load-playbook-scenarios.cjs`, the Mode-B live observation parser, `scoreScenario`, and aggregate scoring. Classify every report row without conflating the scorer's binary funnel threshold with dimension-level point loss.

## Actions Taken

1. Read the canonical state log, reducer-owned strategy, and iteration 2 before investigation; confirmed iteration 3, no saturated directions, and the exact three-path write fence.
2. Traced the sk-doc YAML-frontmatter loader, including stage parsing, root-relative expected-resource extraction, and the normalized scenario object.
3. Traced the Mode-B live parser from response JSON extraction to `observedResources` / `observedAssets`, then followed exact-set recall, D1-intra, D2, D3, first-failing-stage, fitted/holdout partitioning, and aggregation.
4. Joined all 19 report rows to their current playbook gold and inspected each row's recall, routed/wasted counts, first-failing stage, and retained response head.

## Findings

### 1. Gold and live observations meet at an exact-string boundary; no path-root normalization occurs

For the sk-doc playbook shape, the loader walks per-scenario Markdown, reads `expected_intent`, `expected_resources`, and `stage` from YAML frontmatter, extracts the authored `references/...` and `assets/...` tokens unchanged, and emits those values as `expectedResources`. A fixture is fitted `routing` unless its frontmatter explicitly says `holdout` or `negative`. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:295] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:313] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:317] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:321] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:330]

The live parser takes the model's stated `resources` and `assets` arrays, deduplicates them, and passes the strings through unchanged. Observed file reads are diagnostic only; they do not replace the stated route. `setRecall` then uses direct `Set.has` equality. Therefore `create-feature-catalog/references/README.md` does not match gold `references/README.md`, and `shared/assets/changelog_template.md` does not match `assets/changelog_template.md`. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:303] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:315] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:320] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:65]

This establishes a contract mismatch rather than a parser corruption: gold is root-relative, while several live answers state packet-prefixed or shared-prefixed paths.

### 2. `SD-009` is a clean zero-recall path-root example

The loader's gold for `SD-009` is `references/README.md`. The live response instead declares `create-feature-catalog/references/README.md` plus two other packet-prefixed references. Exact equality yields resource recall 0, D1-intra 0, D2 0, D3 0 with three routed / three wasted resources, and the first failing stage is `routed-intra`. The expected leaf basename is present, so the first cause is wrong path-root normalization, not absence of the intended leaf. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:301] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:308] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:326] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:371] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:401]

### 3. `SD-015` fails twice: zero exact recall and maximal over-bundling

`SD-015` carries the broad `ON_DEMAND_ALL` gold set of 17 root-relative references/assets. The live answer emits 65 resources; the report records all 65 as wasted, resource recall 0, D1-intra 0, D2 0, D3 0, and `routed-intra` as the first funnel failure. Its retained response begins by enumerating packet-prefixed resources across unrelated create-* surfaces. This is the unique primary `over-bundled resource set` row: even a hypothetical prefix-strip would not make an indiscriminate 65-resource bundle efficient or reliably exact. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:499] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:506] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:524] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:569] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:597]

### 4. D1-intra, D2, and D3 are distinct but share the same exact resource contract

In live mode, `scoreScenario` folds stated assets into the observed set for D1-intra recall, while D3 remains references-only. D2 is then derived from resource recall, and D3 penalizes routed references absent from the exact expected set. The funnel only checks D1-intra below 0.5 and then D2 below 0.5; it does not check D3. As a result, a row may appear under `passed` while still losing substantial D3 efficiency points. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1113] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1118] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1122] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1131] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1135] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1047]

The stored report reflects that split: 13 rows first fail at `routed-intra`, while six cross the D1/D2 threshold. Yet four of those six still carry five wasted references and weak or zero D3. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1307] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:609] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:627] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:921] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:939]

### 5. All 19 rows classified by first causal loss

`Strict funnel` uses the scorer's own `firstFailingStage`: 13 failed rows split into six wrong-root, six missing-leaf, and one primary over-bundle; six rows are threshold passes. `Dimension loss` additionally marks four threshold-pass rows whose first material residual loss is over-bundling. This second view prevents `passed` from being read as full-credit.

| Scenario | Strict funnel | First causal loss | Evidence |
|---|---|---|---|
| SD-007 | routed-intra | wrong path-root normalization | Packet-prefixed quality/flowchart paths; 0 recall, 4/4 wasted. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:189] |
| SD-009 | routed-intra | wrong path-root normalization | Expected README leaf appears under `create-feature-catalog/`; 0 recall, 3/3 wasted. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:301] |
| SD-008 | passed | no material resource loss | No positive resource gold; D1/D2 1, D3 not applicable. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:406] |
| SD-015 | routed-intra | over-bundled resource set | 0 recall, 65 routed, 65 wasted. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:499] |
| SD-014 | passed | over-bundled resource set (residual) | D1/D2 .75, but five routed references are all wasted and D3 is 0. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:602] |
| SD-013 | routed-intra | missing expected leaf resource | Gold `hvr_rules.md` absent; 0 recall, 6/6 wasted. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:705] |
| SD-005 | routed-intra | missing expected leaf resource | Stated `assets/simple_workflow.md` omits gold `assets/flowcharts/` root and the second flowchart; 0 recall. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:813] |
| SD-006 | passed | over-bundled resource set (residual) | D1/D2 .5, five of six routed references wasted; D3 .167. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:914] |
| SD-004 | routed-intra | missing expected leaf resource | Quality-control packet chosen instead of `hvr_rules.md`; 0 recall, 6/6 wasted. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1020] |
| SD-003 | routed-intra | wrong path-root normalization | Expected README/agent/command leaves are present under `create-agent/` and `create-command/`; 0 exact recall. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1125] |
| SD-001 | routed-intra | missing expected leaf resource | Only generic README loaded; all four quality leaves absent. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1240] |
| SD-017 | passed | over-bundled resource set (residual) | D1/D2 .5, five of six routed references wasted; D3 .167. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1341] |
| SD-016 | routed-intra | wrong path-root normalization | Expected `optimization.md` appears under `create-quality-control/`; 0 recall, 6/6 wasted. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1440] |
| SD-002 | passed | over-bundled resource set (residual) | D1/D2 .75, five routed references wasted; D3 0. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1544] |
| SD-011 | routed-intra | wrong path-root normalization | Correct skill family stated under `create-skill/`; zero exact root-relative recall and 5/5 wasted references. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1648] |
| SD-012 | passed | no material resource loss | Exact recall 1, D1/D2/D3 all 1, zero waste. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1751] |
| SD-010 | routed-intra | missing expected leaf resource | Generic README replaces changelog asset; 0 recall, 1/1 wasted. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1862] |
| SD-018 | routed-intra | missing expected leaf resource | `create-changelog/references/README.md` does not contain the expected changelog asset. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:1963] |
| SD-020 | routed-intra | wrong path-root normalization | Expected changelog leaf appears as `shared/assets/changelog_template.md`; exact gold is `assets/changelog_template.md`. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:2065] |

Counts across all 19 by first causal point loss: wrong path-root normalization **6**, missing expected leaf resource **6**, over-bundled resource set **5** (one primary funnel failure plus four residual efficiency failures), and no material resource loss **2**. Under the strict funnel alone: wrong-root **6**, missing-leaf **6**, over-bundle **1**, threshold-pass **6**.

### 6. The score loses in three different senses

- **Largest first-stage attrition:** `routed-intra`, 13/19 rows, because exact root mismatch or missing leaves drives D1-intra below 0.5.
- **Lowest dimension percentage:** D3 at 8%, versus D1-intra 24% and D2 24%; over-routing is the deepest proportional weakness.
- **Largest nominal measured-weight shortfall:** D2 loses 15.2 of its 20 nominal points at 24%, narrowly more than D3's 13.8 of 15 at 8%. Because aggregation averages per-row normalized scores and some rows have non-applicable D3, these nominal shortfalls explain priority but do not arithmetically reconstruct the 20 headline score. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:12] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:44] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:48] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:52]

D5 is 100 and is a structural hard gate, so it contributes no diagnosis of live leaf selection. D1-inter and D4 are unscored in this report. [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:56] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:61]

### 7. All 19 rows are fitted; the report contains no generalization measurement

`scoreScenario` preserves only explicit `holdout` and `negative` stages; aggregate excludes holdouts from the headline fitted score and computes their score separately. This corpus has 19 fitted routing rows, zero holdouts, and zero negative rows. Consequently `fittedScore` equals the headline 20 and `generalizationGap` is null. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1106] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1281] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1287] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1338] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:17]

### 8. Report evidence is intentionally lossy after 300 response characters

`buildLiveEvidence` retains only the first 300 characters of the model response. Counts and scores are sufficient to classify zero recall and over-routing, but the report alone cannot reconstruct all 65 `SD-015` paths or every late-listed asset. Future provenance should persist the normalized stated route or a hash-addressed side artifact if exact post-hoc bundle attribution is required. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1074] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1082]

## Questions Answered

- **Q3:** Answered. Gold comes from YAML-frontmatter scenario rows, all 19 are fitted routing rows, Mode-B scores the model's stated arrays with exact path equality, D1-intra/D2/D3 are 24/24/8, D5 is 100, and the main failure is a combined root-contract + leaf-selection + bundle-control problem. The strict funnel attributes 13 rows to routed-intra; the complete point-loss view is 6 wrong-root, 6 missing-leaf, 5 over-bundle, and 2 clean.

## Questions Remaining

- **Q2:** Determine whether create-skill teaching/templates explicitly or implicitly cause packet-prefixed and shared-prefixed answers.
- **Q4:** Determine whether the drift guard checks root-path convention and second-layer resource coverage, not only registry/router projection equality.
- **Q5:** Prioritize fixes using the now-quantified failure distribution; preserve separate fixes for path canonicalization, expected-leaf discoverability, and bundle caps.

## Assessment

- New information ratio: **0.95**.
- Novelty justification: this pass closes the full scorer dataflow, quantifies every report row, and reveals that the scorer's six `passed` rows include four material D3 efficiency losses.
- Status: **complete** for Q3.
- Confidence: high for loader/scorer behavior and report counts; medium-high for detailed root-cause labels where the report truncates the response after 300 characters.

## Reflection

- What worked: joining loader gold to report rows exposed both exact-path mismatches and threshold-pass efficiency losses.
- Ruled out: alias visibility as the immediate cause of these Mode-B rows; this live path scores stated resources directly and carries zero hub-route telemetry denominators.
- Limitation: the report's truncated response heads prevent full reconstruction of every emitted path, especially `SD-015` and late-listed assets.

## SCOPE VIOLATIONS

- The workflow normally allows reducer refreshes of strategy, registry, dashboard, and progressive synthesis. This dispatch explicitly makes those files read-only and allows only the iteration narrative, state-log append, and iteration delta; no out-of-scope mutation was attempted.

## Next Focus

Answer Q2 by tracing the root-path contract in `create-skill/assets/skill/skill_smart_router.md`, emitted routing JSON/templates, and the sk-doc packet SKILL files that the live model read. Test whether those sources teach `references/...` relative to the hub root, packet root, or caller-visible path, and tie each ambiguous instruction to the six wrong-root rows.
