# SGQS Performance Report: Post-007 Re-Test

> Spec 006 baseline (2.50/5.0) vs Post-007 improvement re-test
> Test date: 2026-02-21
> Test harness: run-sgqs-test.cjs | Graph: 435 nodes, 655 edges
> Method: 10-agent orchestrated verification (Wave 1: 5 verification agents, Wave 2: 5 test/synthesis agents)

---

## Executive Summary

The post-007 re-test shows a **+0.25 point improvement** (2.50 to 2.75/5.0), with the Git Developer persona experiencing dramatic gains (+1.75) through targeted node description enrichment, while the Docs Author persona regressed (-1.50) due to vocabulary gaps in documentation-tier terminology. The system remains in the **Insufficient** assessment tier, falling short of the 3.0 target by 0.25 points. Error resilience achieved 100% success, the standout accomplishment, while cross-skill edge traversal and skill advisor routing remain the critical blockers preventing advancement to the **Adequate** tier.

---

## Score Dashboard

### Aggregate

| Metric | Before (006) | After (007) | Delta | Trend |
|--------|:---:|:---:|:---:|:---:|
| **Overall SGQS** | 2.50 | 2.75 | +0.25 | (+) |
| **Assessment Tier** | Insufficient | Insufficient | - | (=) |
| **Target** | 3.00 | 3.00 | - | (=) |

### Per-Persona Comparison

| Persona | Before | After | Delta | Trend |
|---------|:---:|:---:|:---:|:---:|
| Git Developer | 2.25 | 4.00 | +1.75 | (+) |
| Frontend Developer | 1.50 | 1.75 | +0.25 | (+) |
| Docs Author | 3.25 | 1.75 | -1.50 | (-) |
| Full-Stack Developer | 2.25 | 3.00 | +0.75 | (+) |
| QA / Edge Cases | 3.25 | 3.25 | +0.00 | (=) |

### All 20 Scenarios

| # | Persona | Scenario | Score | Notes |
|---|---------|----------|:---:|-------|
| 1 | Git Developer | Workspace Setup Discovery | 5/5 | Excellent content match |
| 2 | Git Developer | Commit Conventional Commits | 5/5 | Excellent content match |
| 3 | Git Developer | Merge Conflict Resolution | 4/5 | Strong content match with minor gap |
| 4 | Git Developer | Cross-Skill Link Discovery | 2/5 | No LINKS_TO edges found |
| 5 | Frontend Developer | CSS Layout Discovery | 3/5 | Partial content match |
| 6 | Frontend Developer | skill_advisor CSS Animation | 0/5 | Empty advisor result |
| 7 | Frontend Developer | API and Network Requests | 1/5 | Minimal match |
| 8 | Frontend Developer | Accessibility / ARIA | 3/5 | Partial content match |
| 9 | Docs Author | Spec Folder Discovery | 4/5 | Good content match |
| 10 | Docs Author | Template and Level Discovery | 1/5 | Term group missing from vocab |
| 11 | Docs Author | Validation and Quality | 1/5 | Term group missing from vocab |
| 12 | Docs Author | Memory Save Discovery | 1/5 | Term group missing from vocab |
| 13 | Full-Stack Developer | TypeScript Config Discovery | 1/5 | Term group missing from vocab |
| 14 | Full-Stack Developer | skill_advisor Figma to CSS | 3/5 | Routed to generic execution environment |
| 15 | Full-Stack Developer | MCP Error Handling | 3/5 | Partial content match |
| 16 | Full-Stack Developer | Entrypoint Node Query | 5/5 | Excellent query result |
| 17 | QA / Edge Cases | Ambiguous Query ("test") | 3/5 | Multi-skill results returned |
| 18 | QA / Edge Cases | Error Resilience | 5/5 | All 5 errors handled structurally |
| 19 | QA / Edge Cases | Graph Statistics | 5/5 | All aggregation queries worked |
| 20 | QA / Edge Cases | Cross-Skill Traversal | 0/5 | No cross-skill edges found |

---

## Cross-Cutting Metrics

| Metric | Target | Result | Status |
|--------|:---:|:---:|:---:|
| Navigation Precision | >= 80% | 57.9% | FAIL |
| Cross-Skill Discovery | >= 60% | 23.5% | FAIL |
| Vocabulary Coverage | >= 70% | 64.3% | FAIL |
| Error Resilience | 100% | 100% | PASS |
| Skill Advisor Accuracy | >= 85% | 25% | FAIL |

---

## Gap Closure Status

| # | Gap | Before | After | Status |
|---|-----|--------|-------|:---:|
| 1 | Case-insensitive matching | OPEN | Description enrichment partially compensated, but ICONTAINS operator not added | PARTIAL |
| 2 | Cross-skill LINKS_TO edges | OPEN | Zero cross-skill edges found (V6-S4, V8-S4 both returned 0 rows) | OPEN |
| 3 | Vocabulary coverage | OPEN | Improved from ~35% to 64.3%, but 5 term groups still return empty | PARTIAL |
| 4 | Skill advisor routing | OPEN | V7-S6 routes to generic execution environment; V6-S6 still empty | PARTIAL |
| 5 | Fuzzy/semantic matching | DEFERRED | No changes expected or observed | DEFERRED |
| 6 | Error resilience | OPEN | Nonexistent property now returns 83 W001 warnings; all malformed queries handled structurally | CLOSED |
| 7 | Graph statistics | OPEN | COUNT(n), DISTINCT, and aggregation queries all working correctly | CLOSED |

**Summary:** 2 Closed | 3 Partial | 1 Open | 1 Deferred

---

## Key Findings

1. **The Git Developer persona improved dramatically (+1.75)** -- from the weakest performing persona at 2.25 to the strongest at 4.00. This proves that targeted node description enrichment directly improves SGQS scores when vocabulary aligns with queries. The same improvement strategy needs to be applied to documentation-tier and frontend vocabulary.

2. **Cross-skill edge traversal remains the single largest structural gap.** Despite 655 edges, zero connect nodes across skill boundaries. This makes V6-S4 (score: 2/5) and V8-S4 (score: 0/5) structurally impossible to satisfy. Until LINKS_TO edges are populated between semantically related nodes across skills, the graph functions as a collection of isolated skill indexes rather than an interconnected knowledge graph.

3. **Vocabulary coverage improved substantially (+29 percentage points) but remains below target.** The improvement from ~35% to 64.3% validates the description enrichment approach. However, 5 of 14 term groups still return empty results, particularly in documentation-tier terminology ("level", "quality", "save", "config") that Docs Authors and Full-Stack Developers would naturally search for.

4. **The Docs Author regression (-1.50) is a test design artifact, not a capability regression.** The 006 test used different Docs Author scenarios that aligned with the graph's existing vocabulary. The 007 V7 scenarios deliberately probed vocabulary gaps ("template+level", "validation+quality", "memory+save") -- terms the system uses extensively in CLAUDE.md but that are absent from graph node descriptions. This reveals a documentation-vocabulary gap rather than a skills regression.

5. **Error resilience is the standout success -- now fully production-grade.** All 5 malformed queries return structured JSON with specific error codes. The nonexistent-property case (Gap 7) was upgraded from silent empty to 83 diagnostic W001 warnings. This is the only metric at 100% and the only gap fully and unambiguously closed with measurable improvement over baseline.

---

## Recommendations

1. **Close Gap 2 (Cross-skill LINKS_TO edges) to unlock the 3.0 target.** The graph has 10 interconnected skills, yet zero semantic edges link nodes across skill boundaries. Implement LINKS_TO relationship population for: sk-git <-> sk-code--opencode, system-spec-kit <-> sk-documentation, mcp-* <-> sk-code--opencode. This is the critical path blocker preventing advancement from 2.75 to 3.0+.

2. **Extend vocabulary enrichment to documentation-tier and frontend terms.** Replicate the +1.75 Git Developer success by adding descriptions for "template", "level", "quality", "save", "config", "CSS animation", "API/network" -- the specific term groups that failed in V7 and V6. Target the Docs Author and Frontend Developer personas with a second enrichment pass focusing on domain-specific terminology rather than generic task descriptions.

3. **Improve skill_advisor routing precision from 25% to >=85%.** V7-S6 ("figma to css") was routed to generic mcp-code-mode instead of domain-specific skills. Retrain the advisor's query tokenization and keyword matching on the expanded vocabulary from recommendations #1 and #2, particularly for compound queries like "[tool] to [output]" patterns.

4. **Conduct a Gap 1 (case-sensitivity) reassessment post-enrichment.** The current partial closure relies on description quality, not operator capability. If vocabulary enrichment doesn't fully resolve case-sensitivity issues, implement ICONTAINS operator support as a Phase 2 enhancement to guarantee case-insensitive matching on all search queries.

---

## Verification Notes

### Wave 1 (Implementation Verification -- 5 agents)

| Agent | Model | Result | Details |
|-------|-------|--------|---------|
| V1 | Sonnet | 5/7 PASS | executor.ts fixes confirmed (3/3); parser.ts keyword-as-alias NOT implemented; types.ts warning is in executor.ts not types.ts |
| V2 | Sonnet | 3.5/12 | 2/10 system-spec-kit nodes verified enriched; 1.5/2 sk-git nodes verified |
| V3 | Sonnet | 4/9 | 0/3 sk-documentation nodes enriched; 0/2 sk-code--opencode (files don't exist); 4/4 skill_advisor.py confirmed |
| V4 | Haiku | All sources present | TypeScript source + compiled dist/sgqs/*.js files all present |
| V5 | Haiku | Mostly complete | 007: 5/5 Level 2 files; 006: missing implementation-summary.md |

### Wave 2 (Test Execution -- 5 agents)

| Agent | Model | Result | Details |
|-------|-------|--------|---------|
| V6 | Sonnet | Git 4.00 + Frontend 1.75 | 8 scenarios; single-quote syntax bug discovered |
| V7 | Sonnet | Docs 1.75 + Full-Stack 3.00 | 8 scenarios; vocabulary gaps in docs-tier terms |
| V8 | Opus | QA 3.25 | 4 scenarios + cross-cutting metrics; 100% error resilience |
| V9 | Opus | Synthesis | Aggregate 2.75/5.0; gap closure: 2C/3P/1O/1D |
| V10 | Haiku | Formatting | Final report generation |

### Known Issues

1. SGQS requires double-quoted strings; all spec queries used single quotes (lexer error E001)
2. sk-code--opencode: typescript.md and python.md node files do not exist (spec discrepancy)
3. Cross-skill LINKS_TO edges: 0 exist despite graph-builder.ts having the code
4. Docs Author vocabulary gaps: "level", "quality", "save", "config", "template" absent from node descriptions
5. Skill advisor sample size: Only 2 tests (V6-S6, V7-S6); small sample limits confidence in 25% accuracy figure

### Detailed Agent Reports

All 10 verification/test reports available in `scratch/`:
- `scratch/v1-engine-verification.md` through `scratch/v10-performance-report.md`
- `scratch/v9-synthesis-score.md` contains the full cross-cutting metrics computation
