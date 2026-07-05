# Deep-Review Dashboard: 017 Two-Lane Opus Second Opinion

## Status

- Provisional verdict: **CONDITIONAL**
- hasAdvisories: **true**
- Reviewer: Opus 4.8 (1M) | Prior: cli-codex gpt-5.5 (014) | Remediation under review: 015
- Did 015 hold: **YES** (no regression, 29/29 in-scope tests pass)

## Findings Summary (after adjudication)

| Severity | Active | Notes |
|----------|--------|-------|
| P0 | 0 | none survived adversarial self-check |
| P1 | 4 | F017-P1-01..04 |
| P2 | 13 | F017-P2-01..13 (P2-13 merges two raw findings) |

Raw findings recorded: 19. After dedup, cluster-merge, and two P1-to-P2 downgrades: 17 unique active (4 P1 + 13 P2).

## Per-Iteration Finding Counts

| Iter | Dimension | New P0 | New P1 | New P2 | newFindingsRatio (trend) | Notes |
|------|-----------|--------|--------|--------|--------------------------|-------|
| 1 | correctness | 0 | 1 | 0 | seed | materializer fixture-id traversal (first-writer gap) |
| 2 | security | 0 | 1 | 0 | ascending | bundle-gate execSync not covered by exec gate |
| 3 | traceability | 0 | 1 | 1 | flat | dead Mode-4 anchors (P1) plus explicit.ts stale comment (P2) |
| 4 | maintainability | 0 | 0 | 5 | descending | parseArgs dialects, integration-score drift, dead param, attribution tags, dup helpers |
| 5 | correctness | 0 | 1 | 0 | flat | Lane B promotion non-executable |
| 6 | security | 0 | 1 | 1 | flat | criteria-grep read (later down to P2) plus score-cache read-integrity P2 |
| 7 | traceability | 0 | 1 | 0 | flat | mode-aware promotion claim untraceable |
| 8 | maintainability | 0 | 0 | 1 | descending | finding-id-shaped source comment collision |
| 9 | correctness | 0 | 1 | 1 | flat | Lane B model-blind (later down to P2 accepted-deferral) plus unreachable resolver entry |
| 10 | security | 0 | 0 | 3 | descending | grader injection, grader cache scope, systemFitness ref oracle |

## Adjudication Deltas (vs raw iteration severities)

| Raw ID | Raw sev | Final sev | Reason |
|--------|---------|-----------|--------|
| correctness-9-1 | P1 | P2 | arbiter-upheld DOCUMENT-ACCEPT deferral (122/007 -> 014/015 F-P0-2), residual is doc over-claim only |
| security-6-1 | P1 | P2 | gate text is "shell execution" so a file read is outside its literal scope, trusted-author boundary, bounded impact, confidence 0.6 |
| correctness-5-1 + traceability-7-1 | P1 + P1 | merged F017-P1-04 | same root: promote-candidate is agent-only and Lane B promotion is unwired / docs over-claim mode-awareness |
| security-10-2 + security-10-3 | P2 + P2 | merged F017-P2-13 | two cache/path advisories grouped |
| correctness-9-2 | P2 | P2 | structural footprint of the accepted model-dispatch deferral |

## Coverage

- Dimensions: 4/4 covered (correctness, security, traceability, maintainability), each in >= 2 iterations.
- Lanes: both (Lane A agent-improvement, Lane B model-benchmark) plus the skill-advisor explicit lane.
- Traceability protocols: spec_code PARTIAL, checklist_evidence PASS (sampled), skill_agent PARTIAL, feature_catalog_code PARTIAL.

## Trend

Last 3 iterations new P0/P1: 1 (iter 8 = 0 P1, iter 9 = 1 P1 since downgraded, iter 10 = 0 P1). Direction: descending into convergence. No new P0 in any iteration. No regression against 015.

## Active Risks

- 4 open P1s gate the CONDITIONAL verdict (traversal first-writer gap, bundle-gate fail-open, dead doc anchor, non-executable Lane B promotion + over-claiming docs).
- 13 P2 advisories deferred to a follow-on cleanup pass.
- No guard violations, no stuck recovery, no budget warnings during this review.
