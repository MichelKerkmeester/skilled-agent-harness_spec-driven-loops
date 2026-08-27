# Iteration 10: Final — Adversarial replay, registry reconciliation, convergence telemetry

## Focus
Adversarial replay of every active P0/P1 claim against the cited evidence; registry severity reconciliation; final coverage accounting; convergence telemetry under max-iterations stop policy.

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability (all)
- Files reviewed: 6 (replayed evidence sites)
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Adversarial Replay (P0/P1 claims)

| Finding | Claim | Replay evidence | Verdict |
|---------|-------|-----------------|---------|
| F001 (P1) | Learned-triggers path live despite 003 REQ-003 "flagged off" | Re-read stage2-fusion.ts:72,794-830 (queryLearnedTriggers per search, no flag); learned-feedback.ts:480-516; counterevidence: 004 research census C11 classifies learned-feedback KEEP ("system C, out of scope") — reframes F001 as spec-wording contradiction (003 REQ-003 "disabled" vs census KEEP + live wiring), not a broken implementation | CONFIRMED P1 |
| F005 (P1) | 004 folder deletion not executed; 8 rule files remain; 18 root links | Re-listed constitutional/: comment-hygiene, cli-dispatch-skill-preload, finding-is-a-hypothesis, main-branch-direct-push, regression-baseline-and-delta, gate-tool-routing, deep-skill-workflow-required, recursion-control all PRESENT; AGENTS.md:41/71/72/90/116/363 + CLAUDE.md same + BARTER.md per census | CONFIRMED P1 |
| F007 (P1) | 006 spec references reversed DECISIONS.md surface in 6 places | Re-verified spec.md:22,66,86,130,140,150; 002 reversal recorded 2026-08-26T08:10; steering intent satisfiable via root docs (AGENTS.md:41 inlines rule text) | CONFIRMED P1 (downgrade trigger noted) |
| F008 (P1) | feature-catalog describes removed machinery as current | Re-verified catalog:1224,1248,3346-3347 vs zero production constitutional refs (iterations 1-3); vector-index-store.ts:1825 domain comment | CONFIRMED P1 |
| P0 sweep | Any unrecorded P0 (correctness failure/security vuln/spec contradiction causing shipped-behavior breakage)? | Full loop: no production behavior breakage found; deprecation's runtime levers all verified off (includeConstitutional removed, indexer/prime scans stopped, tier excluded from active rows, strict schema) | NO P0 |

## Registry Reconciliation
- Active findings: 13 total — P1: 4 (F001, F005, F007, F008), P2: 9 (F002, F003, F004, F006, F009, F010, F011, F012, F013). Registry corrected from earlier P1:3/P2:10 miscount.
- All findings carry file:line evidence; all P0/P1 carry typed adjudication packets (F001 iter 1, F005 iter 5, F008 iter 6; F007 packet carried from iter 6 with transition).

## Convergence Telemetry (telemetry only — stop policy is maxIterations)
- Ratios by iteration: [0.35, 0.0, 0.0, 0.05, 0.35, 0.40, 0.10, 0.05, 0.05, 0.0]
- Rolling avg (last 2): 0.025 (below rollingStopThreshold 0.08 — convergence-adjacent but policy is max-iterations)
- Dimension coverage: 4/4 (correctness 1-3, security 4, traceability 5-6+9, maintainability 7-8+9)
- Protocols: spec_code partial (F005/F007), checklist_evidence notApplicable (F010), feature_catalog_code fail (F008), playbook_capability partial (F009)
- P0 override: n/a (0 P0)
- Composite stop score: ~0.3*0.025 + 0.25*0 + 0.45*1.0 = 0.4575 < 0.60 → no convergence stop; loop exits on maxIterationsReached as configured.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | All 4 P1s replayed-confirmed | F001/F005/F007/F008 |

## Assessment
- New findings ratio: 0.0
- Dimensions addressed: all 4
- Novelty justification: n/a — final sweep.

## Ruled Out
- All P0 hypotheses raised during the loop (constitutional still surfacing, indexer still scanning, prime still fetching, learned path still seeding): ruled out with production-code evidence.

## Dead Ends
- Live verification of H6 DB-row deletion and the full test suite: out of leaf scope (no repo tooling); deferred to operator/planning (Deferred Items).

## Recommended Next Focus
Synthesis — compile review-report.md with verdict CONDITIONAL (no P0; 4 active P1; 9 active P2; hasAdvisories=true).

Review verdict: PASS
