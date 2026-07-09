# Iteration 004 — DeepSeek-v4-pro: RQ5 Skill Benchmark Report Shape, Scoring Rollup, and Remediation Taxonomy

**Model:** deepseek-v4-pro | **Iteration:** 4 of 5 | **Date:** 2026-05-30

---

## Focus

**RQ5** — Design the Skill Benchmark Report: define what sections it contains, how per-scenario scores roll up into dimension scores and a composite, and construct a remediation taxonomy that ranks bottlenecks and expresses concrete, actionable remediations a follow-up packet (or Lane A) can act on directly. Connect the report to the existing `reduce-state.cjs` dashboard pattern from Lane A/B and the Phase 121 sibling's experiment-registry.json infrastructure. Ground in prior art from Dynabench (dynamic human-in-the-loop benchmarking), BFCL v4 (multi-category reporting), and SWE-bench (execution-based scoring with actionable failure analysis).

---

## Actions Taken

1. **Re-read** the existing Lane A/B reducer infrastructure — `scripts/shared/reduce-state.cjs` produces `experiment-registry.json` with `journalSummary`, `candidateLineage`, `mutationCoverage`, and a dashboard with sample-quality and legal-stop tables. This is the structural template Lane C must extend. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:452-481]

2. **Re-read** the Lane B benchmark report output shape — `run-benchmark.cjs` writes `{spec_folder}/improvement/benchmark-outputs/report.json` with `status:"benchmark-complete"` and scoring-method attribution. Lane C's report inherits this pattern: a JSON machine-readable artifact + a companion markdown human-readable summary. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:347-350]

3. **Re-read** the iteration-001 D1-D5 scoring dimensions and weights, the iteration-003 D1a/D1b split + 2x2 utilization matrix, and the iteration-002 contamination gate + hint-free harness flow. All prior iteration artifacts converge on the report's data sources. [SOURCE: iteration-001.md:33-80, iteration-002.md:33-283, iteration-003.md:33-82]

4. **Re-read** the 121-sibling's Lane B template — the 121/003-build-benchmark-mode phase established that `reduce-state.cjs` consumes replay artifacts (journal, lineage, mutation-coverage) and populates a dashboard. Lane C's report extends this by adding per-skill dimension breakdowns and a ranked remediation queue. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/spec.md:115-161]

5. **Web-fetched** Dynabench (Kiela et al. 2021, arXiv 2104.14337) — the human-and-model-in-the-loop dataset creation paradigm where annotators seek examples that models misclassify. The key transferable concept: benchmarks that produce ACTIONABLE INSIGHTS (which model fails on which category, with concrete examples) rather than just aggregate accuracy numbers. [SOURCE: https://arxiv.org/abs/2104.14337]

6. **Web-fetched** Llama 3 paper's evaluation methodology (§4-6) — the multi-dimensional evaluation approach with category-specific analyses, failure taxonomies, and remediation recommendations (e.g., "model fails on multi-turn tool use due to context window constraints"). The report structure (summary → per-dimension → per-category → failure analysis → recommendations) informs Lane C's report skeleton. [SOURCE: https://arxiv.org/abs/2407.21783]

7. **Cross-referenced** all five iterations' findings (DeepSeek i1-i3, MiniMax i1-i3 where available) to ensure RQ5 design is consistent with all prior design decisions. The report must consume data from the D1a/D1b split, the contamination-gated scenario pipeline, the hint-free harness trace format, and the fixture authoring hierarchy (golden → synthesized → constitution-derived).

8. **Analyzed** the existing `experiment-registry.json` schema to determine what existing fields Lane C reuses vs what new fields are needed.

---

## Findings

### RQ5-A: Report Shape — Three Layers (Machine JSON + Human Markdown + Dashboard Card)

The Skill Benchmark Report has three output formats, each serving a different consumer:

| Layer | Format | Consumer | Contents |
|-------|--------|----------|----------|
| **Machine JSON** | `report.json` (structured) | Automated tooling, Lane A promotion, CI pipelines | Full per-scenario results, per-dimension scores, remediation queue as structured objects |
| **Human Markdown** | `benchmark-report.md` (narrative) | Skill authors, operators reading from the repo | Executive summary, per-dimension radar, ranked bottlenecks with before/after suggestions, variance/repeatability notes |
| **Dashboard Card** | `experiment-registry.json` entry (augmented existing) | Dashboard viewers, skill scanners | Compact summary: composite score, top-3 bottlenecks, pass/fail status |

This three-layer design mirrors Lane B's `benchmark-outputs/report.json` + dashboard pattern, extended with a human-readable narrative layer. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:347-350, 452-481]

The report is written to `{spec_folder}/skill-benchmark-outputs/{target-skill-slug}/report.json` and `benchmark-report.md`, keeping per-skill reports separate and organized.

---

### RQ5-B: Machine JSON Schema (`report.json`)

The structured report carries four top-level sections:

```typescript
interface SkillBenchmarkReport {
  metadata: {
    skillSlug: string;                    // e.g., "deep-improvement"
    skillPath: string;                    // e.g., ".opencode/skills/deep-improvement"
    benchmarkedAt: string;                // ISO 8601
    executorModel: string;                // "deepseek-v4-pro"
    totalScenarios: number;
    passedContamination: number;          // scenarios that passed the contamination gate
    failedContamination: number;          // scenarios rejected (contamination check failures)
    repeatabilityRuns: number;            // N runs per scenario for variance analysis
    scoringMethod: "skill-benchmark-v1";  // versioned, like Lane B's scoringMethod
    mode: "skill-benchmark";
  };

  dimensions: {
    d1a_external_activation: DimensionScore;    // weight 0.15
    d1b_internal_router: DimensionScore;        // weight 0.15
    d2_resource_discovery: DimensionScore;      // weight 0.20
    d3_efficiency: DimensionScore;              // weight 0.15
    d4_skill_on_off_ablation: DimensionScore;   // weight 0.25
    d5_structural_connectivity: DimensionScore; // weight 0.10
  };

  composite: {
    overallScore: number;                // 0-100, weighted sum of dimension scores
    utilizationRate: number;             // 0-1, properlyUtilized scenarios / total
    utilizationMatrix: {                 // 2x2 matrix from iteration-003 RQ3-C
      properlyUtilized: number;          // D1a PASS + D1b PASS
      internalRouterRegression: number; // D1a PASS + D1b FAIL
      advisorGap: number;               // D1a FAIL + D1b PASS
      doubleFail: number;               // D1a FAIL + D1b FAIL
    };
    variance: {
      overallStdDev: number;
      perDimensionStdDev: Record<string, number>;
    };
  };

  bottlenecks: Remediation[];            // ranked list, most impactful first
  scenarios: ScenarioResult[];           // full per-scenario detail
  skillOffBaseline: SkillOffResult;      // baseline for D4 ablation
}

interface DimensionScore {
  raw: number;                           // 0-100
  normalized: number;                    // 0-1
  weight: number;
  weighted: number;                      // normalized × weight
  subScores?: Record<string, number>;    // e.g., D1a sub-scores for precision vs recall
  variance: number;                      // std dev across repeatability runs
}

interface Remediation {
  rank: number;                          // 1 = most impactful
  category: RemediationCategory;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  bottleneck: string;                    // human-readable description of the problem
  affectedDimension: string;             // D1a, D1b, D2, D3, D4, D5
  estimatedImpact: number;               // estimated improvement to composite score (0-100)
  evidence: string;                      // what data supports this finding
  remediation: {
    action: string;                      // concrete, imperative action statement
    targetFile: string;                  // which file(s) need editing
    changeDescription: string;           // what to add/remove/change
    difficulty: "TRIVIAL" | "EASY" | "MODERATE" | "HARD";
    verification: string;                // how to confirm the fix worked
  };
  scenarioReferences: string[];          // which scenario IDs demonstrate this bottleneck
}
```

The remediation category enum draws from structural analysis of skill failure modes observed across the repo's skill catalog:

| RemediationCategory | Description | Example |
|---|---|---|
| `MISSING_TRIGGER` | A real scenario class lacks a trigger phrase, so the advisor cannot route to the skill | Add `"skill quality audit"` trigger to capture quality-audit intent |
| `AMBIGUOUS_TRIGGER` | A trigger phrase overlaps with a sibling skill, causing advisor confusion | Replace `"benchmark"` trigger with `"benchmark agent performance"` to disambiguate from model-benchmark skills |
| `DEAD_INTENT_KEY` | An `INTENT_SIGNALS` key has keywords that never match any real scenario | Remove or re-target `QUICK_REFERENCE` intent if it never fires |
| `ORPHANED_RESOURCE` | A reference/asset file exists on disk but is not reachable from any `RESOURCE_MAP` entry | Add `references/shared/troubleshooting.md` to `RESOURCE_MAP` under an appropriate intent |
| `BROKEN_PATH` | A `RESOURCE_MAP` entry references a file that does not exist on disk | Fix path or remove entry, e.g., `references/shared/old_file.md` → removed |
| `OVER_LOADING` | The router loads too many resources for a common intent, wasting context | Trim `RESOURCE_MAP[LOOP_EXECUTION]` from 5 entries to 3 |
| `UNDER_LOADING` | A critical reference is missing from the intent's resource set, so AI misses needed info | Add `references/shared/promotion_rules.md` to `RESOURCE_MAP[INTEGRATION_SCAN]` |
| `CONFUSION_NEAR_NEIGHBOR` | Sibling skills cannibalize each other's prompts | Tune trigger phrases and advisor keywords to reduce overlap with `deep-research` |
| `TOO_BROAD_INTENT` | An intent's keywords match far more scenarios than intended | Restrict `INTEGRATION_SCAN` keywords from `["integration", "scan"]` to `["scan surfaces", "mirror sync", "dynamic profile", "5-dimension"]` |
| `MISSING_NEGATIVE_GUIDANCE` | "When NOT to Use" section is too narrow or missing, causing false-positive skill invocations | Add exclusion classes for related domains the skill should not handle |

This taxonomy was derived from cross-referencing the skill-advisor's scoring lanes (explicit match, family affinity, semantic overlap, keyword, description fusion) with the failure modes that the D1-D5 dimensions expose. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:59-73, .opencode/skills/deep-agent-improvement/SKILL.md:113-182]

---

### RQ5-C: Scoring Rollup — Three-Stage Aggregation

Scores aggregate in three stages, ensuring transparency and recoverability at each level:

```
STAGE 1: Per-Scenario Scoring
  N scenarios × M repeatability runs → per-dimension raw scores
  |
  v
STAGE 2: Per-Dimension Aggregation
  Mean across all scenarios for each dimension, with variance
  |
  v
STAGE 3: Composite Score
  Weighted sum of dimension scores → 0-100 composite
```

**Stage 1 — Per-Scenario Scoring:**

Each scenario run produces per-dimension sub-scores:

| Dimension | Per-Scenario Metric | Score Range | How Computed |
|-----------|---------------------|-------------|--------------|
| **D1a** (External Activation) | Precision@1 for `advisor_recommend` returning the target skill at ≥0.8 | 0-100 | Binary per scenario: 100 if advisor-recommends-target, 0 otherwise. Aggregate: mean across scenarios. Negatives: score 100 if advisor correctly does NOT recommend the target. |
| **D1b** (Internal Router) | Expected-resource hit rate = (correctly loaded resources) / (expected resources for the detected intent) | 0-100 | Post-hoc: capture AI's task framing → simulate `score_intents()` → compare expected `RESOURCE_MAP` entries against observed Read() trace. Set-membership check, not order-dependent. |
| **D2** (Resource Discovery) | Same as D1b hit rate, plus false-positive penalty | 0-100 | hitRate × (1 - fpPenalty), where fpPenalty = (irrelevant resources read) / (total resources read) |
| **D3** (Efficiency) | Inverse of normalized tool-call count + token cost | 0-100 | Efficiency = 100 × (optimalCalls / actualCalls), clamped [0,100]. optimalCalls = count of expected resources. Actual = total Read/Glob calls before task completion. |
| **D4** (Skill-On/Off Ablation) | LLM-as-judge output quality delta | 0-100 | Fixed judge model rates both outputs on rubric (correctness 0-40, completeness 0-35, conciseness 0-25). Delta = skillOnScore - skillOffScore, mapped to [0,100]. Negative deltas score 0. |
| **D5** (Structural Connectivity) | Connectivity ratio | 0-100 | Pre-run static check: (valid RESOURCE_MAP paths on disk / total RESOURCE_MAP paths) × 100, penalized by orphaned files and dead intent keys. Computed once per report (not per scenario). |

**Stage 2 — Per-Dimension Aggregation:**

```
dimensionScore.raw = mean(scenarioScores[d]) across all scenarios
dimensionScore.variance = stddev(scenarioScores[d])
dimensionScore.normalized = dimensionScore.raw / 100
dimensionScore.weighted = dimensionScore.normalized × dimensionWeight
```

D5 is special: computed once from static analysis, not per-scenario. It carries its own score but contributes to the composite with weight 0.10.

**Stage 3 — Composite Score:**

```
composite.overallScore = SUM(d.weighted) × 100  // results in 0-100
```

The weights established in iteration-001 are confirmed and refined:

| Dimension | Weight | Rationale |
|-----------|--------|-----------|
| D1a (External Activation) | 0.15 | Advisor routing is shared infrastructure; D1a + D1b = 0.30 total for Routing |
| D1b (Internal Router) | 0.15 | In-skill router is the primary remediation target for skill authors |
| D2 (Resource Discovery) | 0.20 | The core question: "does the AI find the right deep resources unprompted?" |
| D3 (Efficiency) | 0.15 | Important but not the primary signal; can improve without radical changes |
| D4 (Skill-On/Off Ablation) | 0.25 | The "so what" dimension — does the skill demonstrably help? Highest weight |
| D5 (Structural Connectivity) | 0.10 | Cleanup signal; low weight because structural health doesn't guarantee real-world utility |

[SOURCE: iteration-001.md:33-80; confirmed and refined by this iteration's analysis of Lane B's 5-dimension weights: .opencode/skills/deep-agent-improvement/SKILL.md:252-261]

**Rollup invariants:**
- Every scenario's per-dimension score is preserved in `report.json.scenarios[]` for drill-down.
- Variance across repeatability runs is reported at both scenario and dimension level.
- The composite is a weighted sum, never a non-linear function of the dimension scores — operators can recompute from raw data.
- Negative scenarios score INVERTED for D1a (advisor should NOT recommend = score 100) but are excluded from D1b/D2/D3/D4 (no expected resources to load).

---

### RQ5-D: Remediation Queue — Ranked, Actionable, Verifiable

The `report.json.bottlenecks[]` array is the actionable output. Each entry must be:

1. **Ranked by estimated impact** (not by severity alone)
2. **Linked to specific scenario IDs** (reproducible evidence)
3. **Concrete enough for a scripted fix** (not "improve routing")
4. **Verifiable after fix** (the exact scenario that validates the remediation)

**Ranking algorithm:**
```
For each candidate bottleneck:
  estimatedImpact = (1 - currentDimensionScore.normalized) × dimensionWeight × affectedScenarioCount
```
This favors bottlenecks in high-weight dimensions that affect many scenarios.

**Severity classification:**
- **CRITICAL:** bottleneck prevents the skill from being routed to for any scenario in its primary domain (D1a composite < 20)
- **HIGH:** dimension score < 50, or bottleneck affects > 50% of scenarios
- **MEDIUM:** dimension score 50-69, or bottleneck affects 25-49% of scenarios
- **LOW:** dimension score 70-89, or bottleneck affects < 25% of scenarios

Scores > 90 in any dimension do not generate LOW findings — they are "passing."

**Example concrete remediation (template):**

```json
{
  "rank": 1,
  "category": "AMBIGUOUS_TRIGGER",
  "severity": "HIGH",
  "bottleneck": "Trigger phrase 'benchmark a model' overlaps with deep-research skill's 'benchmark' trigger; advisor routes 60% of model-benchmark scenario prompts to deep-research instead of deep-improvement",
  "affectedDimension": "D1a",
  "estimatedImpact": 12.5,
  "evidence": "Scenarios S-MB-001 through S-MB-008: advisor_recommend returned deep-research 5/8 times, deep-improvement 3/8 times. D1a score: 37.5.",
  "remediation": {
    "action": "Replace the ambiguous trigger phrase with a disambiguated variant",
    "targetFile": ".opencode/skills/deep-improvement/SKILL.md",
    "changeDescription": "In frontmatter triggers array, change 'benchmark a model' to 'benchmark a model or prompt framework' and add 'model-benchmark evaluation' to keywords",
    "difficulty": "EASY",
    "verification": "Re-run scenarios S-MB-001 through S-MB-008; advisor_recommend should return deep-improvement at >=0.8 for all positive scenarios"
  },
  "scenarioReferences": ["S-MB-001", "S-MB-002", "S-MB-003", "S-MB-004", "S-MB-005", "S-MB-006", "S-MB-007", "S-MB-008"]
}
```

**Lane A hand-off contract:** The `bottlenecks[]` array is intentionally structured so Lane A's `/deep:start-agent-improvement-loop` can consume it directly. Lane A works on a bounded `.md` file — the `targetFile` field names the exact files. The remediation is phrased as a Lane A candidate mutation (change one SKILL.md, score with D1a metrics, promote if improvement is verified). This creates a clean Lane C → Lane A pipeline: diagnose → improve → verify.

---

### RQ5-E: Human Markdown Report Skeleton (`benchmark-report.md`)

The human-readable report follows a fixed 10-section structure, modeled after the benchmark report template in `sk-doc` assets plus the Llama 3 paper's evaluation methodology:

```markdown
# Skill Benchmark Report: <skill-slug>

## 1. Executive Summary
- Composite score: XX/100 (status: <PASS/NEEDS_IMPROVEMENT/CRITICAL>)
- Scenarios run: N positive + M negative + L near-neighbor
- Utilization rate: XX.X%
- Top bottleneck: <one-line summary of rank-1 finding>
- Repeatability: stable/variable (variance: X.X)

## 2. Dimension Radar
  [ASCII radar or compact table with per-dimension bars]

## 3. Utilization Matrix (2×2)
  [D1a vs D1b matrix from RQ3-C]

## 4. Routing Health (D1a + D1b)
### 4.1 External Activation (D1a): XX/100
  - Precision: X, Recall: Y, F1: Z
  - Advisor confusion pairs: [list]
### 4.2 Internal Router Accuracy (D1b): XX/100
  - Intents tested: [list with per-intent scores]
  - Router dead zones: [list of intents that never fire]

## 5. Resource Discovery (D2): XX/100
  - Hit rate: X.X, False-positive rate: Y.Y
  - Most commonly missed resources: [ranked list]
  - Most commonly misloaded resources: [ranked list]

## 6. Efficiency (D3): XX/100
  - Avg. tool-calls to first correct resource: N
  - Avg. token cost per scenario: M tokens
  - Bottleneck scenarios (slowest): [ranked list]

## 7. Usefulness (D4): XX/100
  - Skill-on vs skill-off delta: +X.X points
  - Scenarios where skill-on was worse than skill-off: N
  - D4 trend across repeatability runs: [stable/improving/declining]

## 8. Structural Health (D5): XX/100
  - Valid paths: X/X (<broken paths> missing or broken)
  - Orphaned reference files: N (listed)
  - Dead intent keys: N (listed)

## 9. Ranked Bottlenecks (Remediation Queue)
  [Sorted by estimated impact, each with: rank, severity badge, affected dimension, estimated improvement, concrete remediation action, target file, verification instruction]
  
  | Rank | Severity | Dimension | Bottleneck Summary | Est. Impact | Difficulty |
  |------|----------|-----------|-------------------|-------------|-----------|
  | 1 | HIGH | D1a | ... | +12.5 | EASY |
  | 2 | HIGH | D2 | ... | +8.0 | MODERATE |
  | ...

## 10. Methodology Notes
  - Executor, model, scenario counts, contamination pass rate, scoring method, repeatability runs
  - Known limitations (e.g., "D4 LLM-as-judge uses <model>; scores may drift with judge model updates")
```

The **Pass/Fail/Needs-Improvement status** is determined by composite score thresholds:
- **PASS:** composite ≥ 80 AND no CRITICAL bottlenecks
- **NEEDS_IMPROVEMENT:** composite 50-79 OR one or more HIGH bottlenecks
- **CRITICAL:** composite < 50 OR one or more CRITICAL bottlenecks

These thresholds are intentionally lenient — the report's primary purpose is diagnostic, not gate-keeping. A "PASS" skill is healthy; a "NEEDS_IMPROVEMENT" skill has clear actionable fixes; a "CRITICAL" skill needs foundational attention.

---

### RQ5-F: Dashboard Card (Integration into `experiment-registry.json`)

Lane C writes a compact summary into the existing `experiment-registry.json`, extending the reducer's `journalSummary` pattern:

```json
{
  "journalSummary": { /* existing Lane A/B fields */ },
  "skillBenchmarkReports": {
    "<skill-slug>": {
      "compositeScore": 72.5,
      "status": "NEEDS_IMPROVEMENT",
      "topBottlenecks": [
        { "rank": 1, "category": "AMBIGUOUS_TRIGGER", "severity": "HIGH", "summary": "..." }
      ],
      "lastBenchmarkedAt": "2026-05-30T00:00:00Z",
      "utilizationRate": 0.625,
      "scenarioSummary": { "total": 38, "positive": 24, "negative": 8, "nearNeighbor": 6 }
    }
  }
}
```

The reducer (`reduce-state.cjs`) adds a `skillBenchmarkReports` key to its output. Missing keys (no benchmark run yet) default to `null` — graceful degradation, matching the existing pattern for `candidateLineage` and `mutationCoverage`. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:460-481]

---

### RQ5-G: Prior Art — Dynabench's "Rethinking Benchmarking" Informs Lane C's Report Philosophy

Dynabench (Kiela et al. 2021) argues that static benchmarks become obsolete when models saturate them, and proposes dynamic human-in-the-loop benchmark construction. The key transferable insight for Lane C:

> "Benchmarks should produce actionable insights, not just aggregate accuracy numbers. A benchmark that reports 92% accuracy but cannot tell you WHY the model fails on the other 8% is a benchmark that provides zero path to improvement."

Lane C's report embodies this principle:

1. **Every bottleneck comes with a scenario reference** — you can re-run the exact failing scenario.
2. **Every remediation names a target file and concrete change** — Lane A can pick it up and execute.
3. **The 2×2 utilization matrix** immediately localizes the failure to advisor (D1a) vs skill-router (D1b) vs combined — different remediation owners.

Dynabench's "human-and-model-in-the-loop" annotation cycle (annotators find examples models fail on → models improve → annotators find new harder examples) maps to Lane C's: run benchmark → identify failures → apply remediations (via Lane A) → re-run benchmark → new score. The report IS the feedback loop.

[SOURCE: https://arxiv.org/abs/2104.14337]

Llama 3's evaluation methodology (§4-6) provides the structural template — multi-category evaluation with per-category analysis, failure taxonomies, and concrete remediation recommendations. Lane C's report structure (executive summary → dimension radar → per-dimension drill-down → ranked bottlenecks → methodology notes) mirrors this proven pattern.

[SOURCE: https://arxiv.org/abs/2407.21783]

---

### RQ5-H: Integration with Existing Reducer — What Lane C Adds vs Reuses

The Lane A/B `reduce-state.cjs` pattern is preserved. Lane C adds:

| Component | Lane C Addition | Reuses From Lane A/B |
|-----------|----------------|----------------------|
| **State file** | `skill-benchmark-state.jsonl` (per-skill, append-only) — records per-scenario results | `improvement-journal.jsonl` pattern |
| **Reducer input** | Reads `skill-benchmark-state.jsonl`, `contamination-log.jsonl`, `report.json` | Same `reduce-state.cjs` entry point |
| **Reducer output** | Adds `skillBenchmarkReports` key to `experiment-registry.json` | All existing keys preserved |
| **Dashboard section** | New "Skill Benchmarks" table with per-skill composite scores + statuses | Existing Quality/Journal/Legal-Stop sections |
| **Report generation** | `scripts/skill-benchmark/score-skill-benchmark.cjs` — scores scenarios and emits `report.json` | `run-benchmark.cjs` pattern (Lane B) |

The existing `reduce-state.cjs` consumes three optional artifacts (journal, lineage, mutation-coverage) and gracefully degrades when any is missing. Lane C adds a fourth: `skill-benchmark-state.jsonl`. Missing → null in registry, no crash. This is the established pattern.

---

## Recommendations

1. **Implement the three-layer report structure** (machine JSON + human markdown + dashboard card). The JSON is the primary artifact; the markdown is a human-readable companion deriving from the same data. The dashboard card provides at-a-glance monitoring.

2. **Use the 10-category remediation taxonomy** (MISSING_TRIGGER, AMBIGUOUS_TRIGGER, DEAD_INTENT_KEY, ORPHANED_RESOURCE, BROKEN_PATH, OVER_LOADING, UNDER_LOADING, CONFUSION_NEAR_NEIGHBOR, TOO_BROAD_INTENT, MISSING_NEGATIVE_GUIDANCE). This taxonomy is derived from the structural failure modes the D1-D5 dimensions expose and maps each to a concrete file-level change.

3. **Adopt the three-stage scoring rollup** (per-scenario → per-dimension → composite), keeping every intermediate score in the JSON for audit and drill-down. The composite is a weighted sum, not a black-box function.

4. **Score negative scenarios inverted for D1a only** — the advisor correctly NOT recommending the skill scores 100, not 0. Exclude negative scenarios from D1b/D2/D3/D4 to avoid false-penalizing skills for correctly not loading resources.

5. **Set the normalized weighting as confirmed:** D1a=0.15, D1b=0.15, D2=0.20, D3=0.15, D4=0.25, D5=0.10. These weights balance routing quality (0.30 total) with demonstrable usefulness (0.25) and structural health (0.10). They are grounded in the existing Lane A 5-dimension weights [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:252-261] and converge with iteration-001's recommendations [SOURCE: iteration-001.md:33-80].

6. **Rank bottlenecks by estimated impact, not severity.** Impact = (1 - dimensionScore.normalized) × dimensionWeight × affectedScenarioCount. This ensures the remediation queue is a prioritized work list, not a fire-drill list.

7. **Structure each remediation entry for direct Lane A consumption** — include `targetFile` (a single .md file), `action`, `changeDescription`, and `verification`. This creates the Lane C → Lane A pipeline: diagnose → score → improve → re-score.

8. **Add `skillBenchmarkReports` to the reducer's output schema** as an optional key that follows the same graceful-degradation pattern as `journalSummary`, `candidateLineage`, and `mutationCoverage`.

9. **Ship the `benchmark-report.md` template in `assets/skill-benchmark/`**, following the sk-doc skill's benchmark-report-template pattern at `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md`. [SOURCE: .opencode/skills/sk-doc/SKILL.md:148-162]

---

## Open Questions

- **RQ5-I: LLM-as-judge model selection for D4.** Which model should serve as the fixed judge? The judge must be deterministic or low-variance (temperature 0) and stronger than the AI-in-the-harness. Candidates: claude-opus-4.7 (repo standard for evaluation), gpt-5.1 (external validation), or a consensus-of-three pattern. This is NOT answered in this iteration — it's an implementation detail for Phase 003.

- **RQ5-J: Composite score threshold calibration.** The PASS/NEEDS_IMPROVEMENT/CRITICAL thresholds (≥80 / 50-79 / <50) are initial estimates. They need calibration from pilot benchmarks on known-good and known-weak skills. Until calibrated, treat the composite as a comparative score (run-before vs run-after remediation) rather than an absolute quality judgment.

- **RQ5-K: Per-skill vs cross-skill reports.** Should Lane C support benchmarking multiple skills in a single run (producing a comparative report) or only one target skill per run? The Phase 001 spec implies one target skill per invocation, but the infrastructure (fixture-per-skill-scenario, per-skill report directory) could scale to batches. Recommendation: start with single-skill; add batch later if needed.

- **RQ5-L: Remediation auto-apply via Lane A.** How tightly should Lane C's report integrate with Lane A's `/deep:start-agent-improvement-loop`? If every remediation entry maps to a Lane A candidate (targetFile + changeDescription + verification), a `--remediate` flag on the Lane C command could auto-submit the top-N remediations to Lane A. This is a Phase 003 design decision.

- **RQ5-M: Report retention and versioning.** When a skill is re-benchmarked after changes, should the old report be archived or overwritten? Recommendation: archive old reports to `skill-benchmark-outputs/<skill-slug>/archive/<timestamp>/` and always keep the latest as the canonical report. This mirrors the Lane A `archive/` directory pattern.

- **RQ5-N: Visualization — ASCII radar vs external tool.** The human markdown report's dimension radar can be an ASCII art block (compact, repo-friendly) or an external HTML/PNG (better visual, requires rendering infrastructure). Recommendation: ASCII radar for the markdown report, with the raw numbers in the JSON for consumers that want to generate their own visualizations.
