---
title: Deep Review Strategy - Tier-2 Luna Routing Findings & Recommendations
description: Runtime strategy tracking the deep-review of tier2-luna-routing-analysis.md findings/recommendations against the linked benchmark report JSONs.
trigger_phrases:
  - "tier2 luna routing review strategy"
  - "review dimension tracking"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking

## 1. REVIEW CHARTER
- Target: `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/tier2-luna-routing-analysis.md` (files)
- Object under review: analytical FINDINGS and RECOMMENDATIONS (not source code).
- Dimensions: correctness, traceability, maintainability
- Executor: cli-codex / gpt-5.6-sol (reasoningEffort=ultra, serviceTier=fast, timeout=1800s)
- Stop policy: max-iterations (convergence is telemetry-only until iteration 5)
- Max iterations: 5 | Convergence threshold: 0.10
- Success criteria: for each finding, verify it against the linked benchmark report data; flag overreach beyond evidence; surface report signal the findings omit; converge on adjusted final recommendations.

## 2. TOPIC
Audit the SOL-xhigh draft Tier-2 Luna routing findings and recommendations. Verify every load-bearing figure against the five benchmark report JSONs in `artifacts/`, flag any claim that overreaches its cited evidence, surface report signal the analysis omits, then converge on adjusted final recommendations.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — Headline figures, bucket membership, null semantics, activity averages, and path-prefix classification audited against complete report populations in iteration 1.
- [ ] D3 Traceability — Does every cited figure resolve to the linked report line/field? Do evidence anchors point at the data they claim? Are there claims with no citation, or citations that do not support the claim?
- [ ] D4 Maintainability — Are the recommendations actionable, non-overreaching, and scoped to the evidence? Is omitted report signal surfaced? Is the draft internally consistent and clear for a downstream reader?
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Not re-running the benchmark harness or re-scoring Luna.
- Not editing the reviewed file (READ-ONLY).
- Security dimension is out of scope (not requested).
- Not adjudicating whether Luna is a "good" model — only whether the findings/recommendations are faithful to the report data.

---

## 5. STOP CONDITIONS
- stop_policy=max-iterations: run all 5 iterations; convergence signals are telemetry only.
- Terminal stops: maxIterationsReached, manualStop, userPaused, unrecoverable error.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | CONDITIONAL | 1 | Nine requested load-bearing checks adjudicated; 1 mismatch/overreach finding(s). |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +1 P1, +0 P2
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Complete-population JSON aggregation reproduced recall buckets and activity averages without relying on sampled citations.
- Targeted field extraction preserved the report's enum/null semantics for surface, live-evidence, and D3 checks.

## 9. WHAT FAILED
- The code graph was unavailable/empty; strict graphless fallback supplied direct-read and exact-aggregation evidence instead.

## 10. EXHAUSTED APPROACHES (do not retry)
[None yet]

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Re-entering headline arithmetic and bucket-membership verification is unnecessary unless later traceability work finds a population-definition conflict.
- Treating observed reads or path prefixes as proven causes was ruled out; the draft already frames both as correlations/hypotheses.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Iteration 2 (traceability): Verify each evidence anchor against the precise report field/block, audit aggregate-denominator wording, and adjudicate the seven non-live browser rows plus DR-004 parse-false against the recommendations they support.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
No prior memory context loaded (memory MCP timed out; proceeded fresh per contract). The file itself states Claude already verified the load-bearing figures on 2026-07-15; this review independently re-checks them and additionally audits recommendation overreach and omitted signal.

### Bounded Context Snapshot
- Target pointers: `tier2-luna-routing-analysis.md`; report JSONs `tier2-{mcp-tooling,sk-doc,sk-code}-luna-opencode.report.json`, `tier1-deep-improvement-luna-{opencode,codex}.report.json` in `artifacts/`.
- Behavior claims: the file's Findings table, per-skill recall distributions, causal hypotheses (path-root confusion, observed-reads correlation), and 10 numbered recommendations.
- Reuse and conventions: benchmark report schema (scenarios[], intentRecall, resourceRecall, surfaceMatch, D1intra/D2/D3/D5, liveEvidence).
- Review risks and gaps: reports may not expose prompt/gold arrays (analysis itself flags this); correlation-vs-causation claims need calibrated severity; "final recommendations" synthesis is the target deliverable.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | | Findings claims vs report JSON data |
| `checklist_evidence` | core | pending | | Cited evidence anchors vs claims |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| tier2-luna-routing-analysis.md | correctness | 1 | 1 | reviewed |
| artifacts/tier2-mcp-tooling-luna-opencode.report.json | correctness | 1 | 0 | evidence reviewed |
| artifacts/tier2-sk-doc-luna-opencode.report.json | correctness | 1 | 0 | evidence reviewed |
| artifacts/tier2-sk-code-luna-opencode.report.json | correctness | 1 | 1 | evidence reviewed |
| artifacts/tier1-deep-improvement-luna-opencode.report.json | correctness | 1 | 0 | evidence reviewed |
| artifacts/tier1-deep-improvement-luna-codex.report.json | correctness | 1 | 0 | evidence reviewed |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-07-15T19:42:12.593Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-07-15T19:42:12.593Z
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] security

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 4
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Anchor convention: aggregate claim to summary block; scenario-derived claim to all relevant block starts or an explicitly documented inclusive range; absence claims describe omitted fields as absent. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Anchor convention: aggregate claim to summary block; scenario-derived claim to all relevant block starts or an explicitly documented inclusive range; absence claims describe omitted fields as absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Anchor convention: aggregate claim to summary block; scenario-derived claim to all relevant block starts or an explicitly documented inclusive range; absence claims describe omitted fields as absent.

### Core `checklist_evidence`: partial — eight provenance figures reproduce; claim (g) is semantically supported but not literally serialized as stated, and “verified by Claude” is not provable from the reports alone. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core `checklist_evidence`: partial — eight provenance figures reproduce; claim (g) is semantically supported but not literally serialized as stated, and “verified by Claude” is not provable from the reports alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: partial — eight provenance figures reproduce; claim (g) is semantically supported but not literally serialized as stated, and “verified by Claude” is not provable from the reports alone.

### Core `checklist_evidence`: partial. Headline values reproduce, but provenance wording and recommendation scope still overstate what the reports establish. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Core `checklist_evidence`: partial. Headline values reproduce, but provenance wording and recommendation scope still overstate what the reports establish.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: partial. Headline values reproduce, but provenance wording and recommendation scope still overstate what the reports establish.

### Core `checklist_evidence`: pending. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core `checklist_evidence`: pending.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: pending.

### Core `spec_code`: partial — 2/22 anchors fully support their linked claim, 8 are partial, and 12 point only to scenario identifiers. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core `spec_code`: partial — 2/22 anchors fully support their linked claim, 8 are partial, and 12 point only to scenario identifiers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: partial — 2/22 anchors fully support their linked claim, 8 are partial, and 12 point only to scenario identifiers.

### Core `spec_code`: partial. The prior 2/22 exact-anchor result remains open; this pass adds two evidence-calibration requirements. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Core `spec_code`: partial. The prior 2/22 exact-anchor result remains open; this pass adds two evidence-calibration requirements.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: partial. The prior 2/22 exact-anchor result remains open; this pass adds two evidence-calibration requirements.

### Core `spec_code`: pending; iteration 1 established the claim-to-report evidence map. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core `spec_code`: pending; iteration 1 established the claim-to-report evidence map.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: pending; iteration 1 established the claim-to-report evidence map.

### Core checklist_evidence: **partial**. Two P1s remain: incomplete claim citations/provenance, and fitted-only cross-skill generalization. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Core checklist_evidence: **partial**. Two P1s remain: incomplete claim citations/provenance, and fitted-only cross-skill generalization.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist_evidence: **partial**. Two P1s remain: incomplete claim citations/provenance, and fitted-only cross-skill generalization.

### Core checklist_evidence: partial. Report values remain reproduced; named author/verifier provenance still needs a non-report citation or narrower wording. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Core checklist_evidence: partial. Report values remain reproduced; named author/verifier provenance still needs a non-report citation or narrower wording.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist_evidence: partial. Report values remain reproduced; named author/verifier provenance still needs a non-report citation or narrower wording.

### Core spec_code: **partial**. Exact-line count remains 2/22 full, but all 12 scenarioId pointers are accepted as usable structured-block anchors. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Core spec_code: **partial**. Exact-line count remains 2/22 full, but all 12 scenarioId pointers are accepted as usable structured-block anchors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code: **partial**. Exact-line count remains 2/22 full, but all 12 scenarioId pointers are accepted as usable structured-block anchors.

### Core spec_code: partial. Adjusted wording and citations are complete in this narrative, but the read-only target still contains the original language. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Core spec_code: partial. Adjusted wording and citations are complete in this narrative, but the read-only target still contains the original language.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code: partial. Adjusted wording and citations are complete in this narrative, but the read-only target still contains the original language.

### Findings table: values verified — mcp-tooling PASS/100, sk-doc FAIL/20, sk-code CONDITIONAL/65, all per-dimension cells, and every unscored marker match the aggregates. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Findings table: values verified — mcp-tooling PASS/100, sk-doc FAIL/20, sk-code CONDITIONAL/65, all per-dimension cells, and every unscored marker match the aggregates.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Findings table: values verified — mcp-tooling PASS/100, sk-doc FAIL/20, sk-code CONDITIONAL/65, all per-dimension cells, and every unscored marker match the aggregates.

### Generalization blocks: **verified** across all five reports. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Generalization blocks: **verified** across all five reports.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Generalization blocks: **verified** across all five reports.

### Graph status: unavailable/empty. Complete-population JSON projections and exact target/report reads supplied graphless fallback coverage. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Graph status: unavailable/empty. Complete-population JSON projections and exact target/report reads supplied graphless fallback coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Graph status: unavailable/empty. Complete-population JSON projections and exact target/report reads supplied graphless fallback coverage.

### Measurement semantics: **verified** for D1/D2 equality, proxy presence, D5 hard-gate values, intentRecall null/absence behavior, and non-gate point allocation. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Measurement semantics: **verified** for D1/D2 equality, proxy presence, D5 hard-gate values, intentRecall null/absence behavior, and non-gate point allocation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measurement semantics: **verified** for D1/D2 equality, proxy presence, D5 hard-gate values, intentRecall null/absence behavior, and non-gate point allocation.

### Omission sweep: **complete**. Tier-1 D5=97, intentRecall semantics, and aggregate weighting are consolidated into R3-P1-002 at P2; no additional finding is needed. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Omission sweep: **complete**. Tier-1 D5=97, intentRecall semantics, and aggregate weighting are consolidated into R3-P1-002 at P2; no additional finding is needed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Omission sweep: **complete**. Tier-1 D5=97, intentRecall semantics, and aggregate weighting are consolidated into R3-P1-002 at P2; no additional finding is needed.

### Open Questions: Q1–Q3 and the report half of Q4 describe real gaps; Q4's “supplied context says” clause needs a non-report provenance source. None of the four questions currently cites evidence. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Open Questions: Q1–Q3 and the report half of Q4 describe real gaps; Q4's “supplied context says” clause needs a non-report provenance source. None of the four questions currently cites evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Open Questions: Q1–Q3 and the report half of Q4 describe real gaps; Q4's “supplied context says” clause needs a non-report provenance source. None of the four questions currently cites evidence.

### Overlay protocols: not applicable to this analytical file target. -- BLOCKED (iteration 5, 3 attempts)
- What was tried: Overlay protocols: not applicable to this analytical file target.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols: not applicable to this analytical file target.

### Overlay protocols: not applicable. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Overlay protocols: not applicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols: not applicable.

### Overlay protocols: pending and not evaluated in the correctness pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay protocols: pending and not evaluated in the correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols: pending and not evaluated in the correctness pass.

### Recommendation gaps: substantively verified — recs 5, 6, 7, and 10 describe real report gaps, but their anchors are absent or incomplete. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Recommendation gaps: substantively verified — recs 5, 6, 7, and 10 describe real report gaps, but their anchors are absent or incomplete.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommendation gaps: substantively verified — recs 5, 6, 7, and 10 describe real report gaps, but their anchors are absent or incomplete.

### Resource map: not present at initialization; coverage gate skipped. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Resource map: not present at initialization; coverage gate skipped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Resource map: not present at initialization; coverage gate skipped.

### Resource-map coverage gate: skipped because `resource-map.md` is absent. -- BLOCKED (iteration 3, 3 attempts)
- What was tried: Resource-map coverage gate: skipped because `resource-map.md` is absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Resource-map coverage gate: skipped because `resource-map.md` is absent.

### Resource-map coverage gate: skipped because resource-map.md is absent. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Resource-map coverage gate: skipped because resource-map.md is absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Resource-map coverage gate: skipped because resource-map.md is absent.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
security

<!-- /ANCHOR:next-focus -->
