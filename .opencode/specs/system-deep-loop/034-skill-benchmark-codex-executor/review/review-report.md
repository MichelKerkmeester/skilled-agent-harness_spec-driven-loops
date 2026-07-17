# Deep Review Report — Tier-2 Luna Routing Findings & Recommendations

> Session `2026-07-15T19:42:12.593Z` · generation 1 · 5/5 iterations (stop: maxIterationsReached, stop_policy=max-iterations) · executor: cli-codex / gpt-5.6-sol (ultra, fast) · dimensions: correctness, traceability, maintainability · target READ-ONLY: `.opencode/specs/system-deep-loop/034-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md`

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- hasAdvisories: false (hasAdvisories applies to PASS only; P2 advisories exist and are listed below)
- Active findings: **P0=0, P1=2, P2=4** (deduplicated, post-adversarial adjudication)
- Review scope: the SOL-xhigh draft analysis file plus the five benchmark report JSONs it cites (`tier2-{mcp-tooling,sk-doc,sk-code}-luna-opencode.report.json`, `tier1-deep-improvement-luna-{opencode,codex}.report.json`).
- Core result: **every load-bearing headline figure in the draft reproduced exactly** against the report JSONs — sk-doc 19.4% gold-only recall (1 full/4 partial/13 zero), sk-code 49.8% (5/4/6), surfaceMatch 18/18, D3 8/58, Tier-1 86/85 with D3=56 both, mcp-tooling all-null gold control, observed-reads separations, and the 9/13 create-* path-prefix correlation (iteration-001.md Claim Map). The draft's defects are **evidence-scoping and citation defects, not numeric errors**: uncited load-bearing claims and unprovable provenance (R2-P1-002), and cross-skill/Tier-1 generalization language that exceeds the fitted-only evidence (R3-P1-001).
- Deliverable: iteration-005.md contains the **12 adjusted final recommendations** (10 revised + 2 added), companion synthesis wording, and 4 adjusted Open Questions, ready for a follow-up edit pass.

## 2. Planning Trigger

`/speckit:plan` is **required** (CONDITIONAL verdict; two P1 findings need a remediation edit pass on the draft).

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R2-P1-002", "severity": "P1", "dimension": "traceability", "file": ".opencode/specs/system-deep-loop/034-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:99", "title": "Recommendations 6, 7, 8, 10 and all four Open Questions lack report citations; author/verifier provenance not provable from reports", "confidence": 0.99},
    {"id": "R3-P1-001", "severity": "P1", "dimension": "maintainability", "file": ".opencode/specs/system-deep-loop/034-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:69", "title": "Cross-skill synthesis and Tier-1 'confirms' language generalize beyond fitted-only evidence (holdoutScore=null/holdoutCount=0 everywhere except gold-less mcp-tooling 4+2)", "confidence": 0.93},
    {"id": "R2-P1-001", "severity": "P2", "dimension": "traceability", "file": ".opencode/specs/system-deep-loop/034-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:17", "title": "Evidence anchors are 2 full / 8 partial / 12 scenario-id-only; adopt claim-complete anchor conventions", "confidence": 0.99},
    {"id": "R3-P1-002", "severity": "P2", "dimension": "maintainability", "file": ".opencode/specs/system-deep-loop/034-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:11", "title": "D1intra=D2 router-replay-recall proxy, D5 hard-gate pass, and intentRecall semantics omitted; add a score-reading guide", "confidence": 0.97},
    {"id": "R1-P1-001", "severity": "P2", "dimension": "correctness", "file": ".opencode/specs/system-deep-loop/034-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:65", "title": "'liveEvidence=null' should read 'liveEvidence field is absent' for the seven MR/CB rows", "confidence": 0.98},
    {"id": "R3-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".opencode/specs/system-deep-loop/034-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md:119", "title": "Open Questions partially duplicate settled recommendation work", "confidence": 0.9}
  ],
  "remediationWorkstreams": [
    {"order": 1, "severity": "P1", "name": "Evidence-scope the generalization language", "findings": ["R3-P1-001"], "action": "Replace the cross-skill synthesis and provenance header with the companion wording in review/iterations/iteration-005.md §Required Companion Wording; extend rec 10's holdout requirement to both Tier-1 suites."},
    {"order": 2, "severity": "P1", "name": "Citation completion", "findings": ["R2-P1-002"], "action": "Add report citations to recommendations 6, 7, 8, 10 and each Open Question; cite a non-report audit artifact for author/verifier provenance or adopt the narrower report-verifiable wording."},
    {"order": 3, "severity": "P2", "name": "Advisories", "findings": ["R2-P1-001", "R3-P1-002", "R1-P1-001", "R3-P2-001"], "action": "Adopt the claim-complete anchor convention, insert the 'How to read these scores' guide, fix liveEvidence wording, and de-duplicate Open Questions per the adjusted set."}
  ],
  "specSeed": [
    "Promote review/iterations/iteration-005.md §Adjusted Final Recommendations (12 items) as the final Recommendations section of tier2-luna-routing-analysis.md",
    "Scope all Luna conclusions to: fitted suites + gpt-5.6-luna xhigh/fast + tested executor configuration",
    "Adopt claim-complete citation semantics (aggregate anchors for aggregate claims; block-start/multi-anchor for scenario-derived claims; 'absent' for omitted fields)"
  ],
  "planSeed": [
    "Edit pass on tier2-luna-routing-analysis.md applying the 12 adjusted recommendations, companion synthesis wording, and adjusted Open Questions",
    "Add 'How to read these scores' section before the findings table",
    "Replace provenance header with report-verifiable scope wording or attach a non-report audit citation",
    "Re-run /deep:review (1 confirmation iteration) after the edit pass to close R2-P1-002 and R3-P1-001"
  ],
  "findingClasses": ["matrix/evidence"],
  "affectedSurfacesSeed": ["analysis document (tier2-luna-routing-analysis.md)", "benchmark harness backlog (recs 5-10)", "packet documentation"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension(s) | File:line | Evidence | Impact | Fix recommendation | Disposition | Class | Scope proof | Surfaces |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R2-P1-002 | P1 | Recs 6, 7, 8, 10 + all 4 Open Questions uncited; provenance unprovable from reports | traceability | tier2-luna-routing-analysis.md:99 | No markdown report link on those claims; "Verified by Claude" not encoded in any report (iteration-002/004) | Reader cannot audit load-bearing claims | Add exact anchors per claim; cite non-report audit artifact for provenance or narrow wording | active (confirmed ×2, expanded to rec 8 in it-4) | matrix/evidence | Every recommendation Evidence paragraph + paragraph-level links checked over the whole 123-line draft | analysis doc |
| R3-P1-001 | P1 | Cross-skill synthesis + Tier-1 "confirms" exceed fitted-only evidence | maintainability | tier2-luna-routing-analysis.md:69 | holdoutScore=null/holdoutCount=0 in sk-doc (19+0), sk-code (30+0), both Tier-1 (9+0); only gold-less mcp-tooling has 4+2 (it-4 raw population check) | Downstream consumers may treat fitted results as generalization | Scope conclusions to fitted suites + configuration; extend holdout requirement to Tier-1 | active (confirmed, narrowed: recs 1-2 legitimate policy, rec 3 subclaim false-positive) | matrix/evidence | Generalization objects extracted from all five reports | analysis doc, harness backlog |
| R2-P1-001 | P2 | Anchors: 2 full / 8 partial / 12 scenario-id-only | traceability | tier2-luna-routing-analysis.md:17 | 10-anchor referee sample reproduced iteration-2 taxonomy exactly (it-4 table) | Anchor precision, not traceability failure — links resolve and blocks support claims | Multi-anchor or documented block-range citation semantics | active (downgraded P1→P2 in it-4: block-start anchors judged partially supporting) | matrix/evidence | All 22 `.report.json:<line>` links parsed and inspected | analysis doc |
| R3-P1-002 | P2 | D1/D2 proxy + D5 hard-gate + intentRecall semantics omitted | maintainability | tier2-luna-routing-analysis.md:11 | D1intra=D2 in all 5 reports (same router-replay-recall proxy); D5 hardGate 100 Tier-2 / 97 Tier-1; intentRecall=0 + liveResourceOnly=true or absent (it-3, verified it-4) | Draft can be read as two independent confirmations | Add "How to read these scores" section | active (downgraded P1→P2 in it-4: clarification, not required correction) | matrix/evidence | Every dimension block + scenario row compared across all five reports | analysis doc |
| R1-P1-001 | P2 | "liveEvidence=null" vs absent field | correctness | tier2-luna-routing-analysis.md:65 | MR-001..MR-004, CB-001..CB-003 omit the key entirely; DR-004 has statedRoutingParsed=false at sk-code report:2715 (it-2 has() checks) | Wording precision; semantic conclusion holds | Say "liveEvidence field is absent" | active (downgraded P1→P2 in it-2; false positive at required-fix severity) | matrix/evidence | Exact has() key checks on all 7 rows | analysis doc |
| R3-P2-001 | P2 | Open Questions duplicate settled recommendation work | maintainability | tier2-luna-routing-analysis.md:119 | Q2/Q3 restate what recs 8-9 already resolve (it-3) | Minor redundancy | Adopt adjusted Open Questions set (it-5) | active | matrix/evidence | Q-by-Q comparison with recommendations | analysis doc |

Resolved / false-positive lifecycle: R1-P1-001 downgraded it-2 (P1→P2); R2-P1-001 downgraded it-4 (P1→P2); R3-P1-002 downgraded it-4 (P1→P2); R3-P1-001's rec-1/2 overreach subclaim and rec-3 subclaim adjudicated false-positive it-4 (finding narrowed, retained P1 for the synthesis/holdout scope).

## 4. Remediation Workstreams

1. **P1 — Evidence scoping (R3-P1-001):** apply iteration-005 §Required Companion Wording: replace the cross-skill synthesis paragraph and the provenance header; extend rec 10 to require gold-bearing holdouts for sk-doc, sk-code, and both Tier-1 executor suites.
2. **P1 — Citation completion (R2-P1-002):** anchor recs 6, 7, 8, 10 and each Open Question; provenance either gets a non-report audit citation or the narrower report-verifiable wording.
3. **P2 advisories (separated):** claim-complete anchor conventions (R2-P1-001); "How to read these scores" section (R3-P1-002); liveEvidence wording (R1-P1-001); adjusted Open Questions (R3-P2-001).

## 5. Spec Seed

- The 12 adjusted final recommendations in `review/iterations/iteration-005.md` §Adjusted Final Recommendations are the final-form Recommendations content for this packet (draft's 10 → 8 kept/qualified/rewritten + rec 3/5/7/8 as-is + 2 additions).
- All Luna conclusions scoped to: fitted suites, gpt-5.6-luna xhigh/fast, tested executor configurations.
- Citation contract: aggregate claims → summary-block anchors; scenario-derived claims → all relevant block starts or documented ranges; omitted fields described as "absent"; provenance requires non-report citation.

## 6. Plan Seed

1. Apply the 12 adjusted recommendations + companion wording + adjusted Open Questions to `tier2-luna-routing-analysis.md` (single edit pass; the review packet already contains exact replacement text).
2. Insert the score-semantics reading guide before the findings table.
3. Fix liveEvidence wording (7 rows) and adopt the anchor convention across the 22 citations.
4. Confirmation review iteration to close R2-P1-002 / R3-P1-001, then mark the packet's Tier-2 recommendations FINAL.

## 7. Traceability Status

| Protocol | Level | Status | Evidence | Unresolved drift |
|---|---|---|---|---|
| spec_code (claims vs report data) | core | **partial** | All headline figures reproduced exactly (it-1 Claim Map); findings-table values verified (it-2) | Adjusted wording exists only in the review packet until the edit pass lands |
| checklist_evidence (anchors vs claims) | core | **partial** | 22/22 links resolve; 2 full / 8 partial / 12 scenario-id-only at exact-line semantics (it-2, referee-confirmed it-4) | Recs 6-8, 10 + Open Questions uncited; provenance unprovable from reports |
| skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability | overlay | notApplicable | Analytical file target; no skill/agent/catalog/playbook surface | — |
| AC_COVERAGE | advisory | **exempt** | Review target type is `files`, not a lifecycle-active spec-folder | — |

## 8. Deferred Items

- Benchmark-harness improvements (adjusted recs 5-10): gold coverage, advisor probe + ablation, prompt/gold-array export, live-vs-non-live aggregate separation, holdout scenarios — backlog for the harness, do not block this packet's verdict.
- Aggregate-inclusion policy for the seven non-live MR/CB rows (adjusted Open Question 3) — benchmark-policy decision.
- Non-report audit artifact for author/verifier provenance (adjusted Open Question 4).

## Dimension Expansion Map

- Saturated directions (reducer + strategy 10A): headline-figure verification (it-1), findings-table verification (it-2), anchor-taxonomy recount (it-4 referee), holdout-population extraction (it-4), D1/D2 equality extraction (it-3/4).
- Completed pivots: 0 · Failed pivots: 0 · Audited overrides: 0 · Council artifacts: none.
- Selected review directions: correctness (it-1) → traceability (it-2) → maintainability (it-3) → adversarial re-verification (it-4) → final synthesis (it-5).
- Remaining frontier: none within the configured dimensions; further depth requires new report data (holdouts, exported gold arrays), not more review passes.
- Breadth record only — does not alter the verdict, registry, or self-check results above.

## 9. Search Ledger

- `searchCoverage`: requiredBugClasses covered across iterations — gold_recall_arithmetic (doc+code), surface_match_coverage, null_gold_semantics, efficiency_accounting, cross_runtime_aggregate_parity, live_evidence_nullability, observed_activity_aggregation, path_prefix_classification (it-1); citation_anchor_precision, provenance_precision (it-2/4); generalization_scope, measurement_semantics (it-3/4). `graphCoverageMode: graphless_fallback` throughout (code graph empty for this analytical target); every iteration carried cited fallback ledger rows (direct_read, exact_grep, complete-population JSON projection).
- `candidateCoverage.covered` ⊇ required classes for the lineage; `ruledOutCandidates`: family/phrasing explanations for sk-code variation (blocked by missing prompt exports), event-volume explanation for sk-doc misses (it-1), independent-D2-confirmation reading (it-3).
- `cleanSearchProof`: iterations 4-5 produced zero new findings (ratios 0.0, 0.0) across re-verification and synthesis sweeps.
- **`searchDebt` (hasSearchDebt: true — verdict carried as CONDITIONAL):** SL-005-01 generalization_scope, SL-005-02 citation_anchor_precision, SL-005-03 measurement_semantics, SL-005-04 provenance_precision — all four are *deferred edit-pass obligations*: the replacement text exists in iteration-005.md but the review target is READ-ONLY for this loop, so they transfer to the remediation plan (§4) rather than blocking synthesis at the max-iterations terminal stop.

## 10. Audit Appendix

**Convergence summary:** ratios 1.0 → 0.833 → 1.0 → 0.0 → 0.0. Rolling-average signal reached STOP range at it-5 (avg 0.0 ≤ 0.08); stop_policy=max-iterations kept convergence telemetry-only until the ceiling. Stop reason: maxIterationsReached (terminal ceiling; failed-gate evidence recorded: graph coverage signal remained STOP_BLOCKED/uncovered_dimensions due to session-scoped graph seeding, searchDebt 4 deferred rows).

**Coverage summary:** 3/3 configured dimensions covered (correctness it-1, traceability it-2, maintainability it-3), coverage_age 2 at stop; adversarial re-verification pass (it-4) + synthesis pass (it-5). 6 files in scope, all reviewed every iteration.

**Ruled-out claims:** event-volume explains sk-doc misses (ruled out, it-1); more observed activity reliably produces correct sk-doc paths (ruled out, it-1); recs 1-2 constitute overreach (ruled out — legitimate conservative policy, it-4); rec 3 causal overreach (ruled out — already framed as intervention, it-4); scenario family explains sk-code variation (unresolvable without prompt exports, it-1/3).

**Sources reviewed:** the draft analysis + 5 report JSONs (complete-population extraction each iteration); prior iteration artifacts for adjudication lineage.

**Cross-reference appendix — Core Protocols:** spec_code partial (adjusted wording pending edit pass); checklist_evidence partial (uncited claims listed in R2-P1-002).
**Cross-reference appendix — Overlay Protocols:** skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability — all notApplicable (analytical file target).

<!-- MACHINE-OWNED: registry/dashboard/strategy anchors refresh on re-run; do not mutate prior synthesis above this line's section contract. -->
