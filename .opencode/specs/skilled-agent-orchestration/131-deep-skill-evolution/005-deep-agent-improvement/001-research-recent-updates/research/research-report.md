---
title: "Deep-Agent-Improvement Uplift - Research Report"
description: "10-iter mixed-executor deep-research. Verdict: PASS-WITH-UPLIFT. 26 actionable items across 5 themes."
verdict: "PASS-WITH-UPLIFT"
total_iters: 10
recommendation_packets: 5
---

# Research Report

## Executive Summary

The research should pass, but only with a scoped uplift program. Iterations 1-8 found a materially higher-signal queue for `deep-agent-improvement` than the 119 precedent: after deduplication and iter-7 adjudication, the remaining queue is 5 P0, 14 P1, and 7 P2 actionable items across 5 recommendation packets. The strongest evidence is that iter-7 confirmed 4/4 adjudicated P0s and 8/10 adjudicated P1s, while dropping only 2 outdated items and reclassifying 1 P1 to P2; iter-8 then added 1 unadjudicated P0 and 1 unadjudicated P1 from untouched docs/runtime-sync surfaces. [iteration-007.md; deltas/iter-007.jsonl; iteration-008.md; deltas/iter-008.jsonl]

The go-forward plan is a five-packet uplift: first fix functional P0/P1 breakage, then reconcile docs/version truth, then harden evaluator reproducibility, then add cross-runtime promotion checks, and finally add mixed-executor/adjudication methodology. This sequence preserves operator trust first and only then invests in robustness features. [iteration-005.md; iteration-006.md; iteration-007.md; iteration-008.md]

## Methodology

| Step | Evidence Read | Purpose | Result |
| --- | --- | --- | --- |
| Prior narrative review | `iterations/iteration-001.md` through `iterations/iteration-008.md` | Reconstruct source findings, severities, and iteration intent | 36 patterns plus DAI-001..022 reviewed. [iteration-001.md; iteration-008.md] |
| Delta review | `deltas/iter-001.jsonl` through `deltas/iter-008.jsonl` | Check machine-readable finding IDs, severities, and adjudication records | Iter-5 delta carried DAI-008..016, iter-6 carried DAI-017..020, iter-7 adjudicated DAI-001/004/005/006/008/009/010/012/013/014/016/017/018/019/020, and iter-8 added DAI-021/022. [deltas/iter-005.jsonl; deltas/iter-006.jsonl; deltas/iter-007.jsonl; deltas/iter-008.jsonl] |
| Adjudication application | Iter-7 narrative and delta | Keep confirmed items, drop outdated items, reclassify miscategorized items | DAI-009/013/017/018 stayed P0; DAI-010/012/014/016/001/004/005/006 stayed P1; DAI-008 moved to P2; DAI-019/020 dropped. [iteration-007.md; deltas/iter-007.jsonl] |
| Duplicate collapse | Iter-2 and iter-3 mapping | Merge repeated pattern IDs into unique recommendations | P-020/P-021/P-022 collapsed to mixed-executor benchmarking P1; P-018/P-026 collapsed to adjudication pass P1; P-024/P-030 collapsed to numeric sort P1. [iteration-002.md; iteration-003.md; deltas/iter-003.jsonl] |
| Iter-8 spot check | `scan-integration.cjs`, `integration_scanning.md`, `promote-candidate.cjs`, `score-candidate.cjs` | Test the two new unadjudicated claims before synthesis | DAI-021 and DAI-022 remain unadjudicated but locally spot-checked as source-consistent. [iteration-008.md; deltas/iter-008.jsonl; `scan-integration.cjs:15-19`; `integration_scanning.md:39,78`; `promote-candidate.cjs:156-161`; `score-candidate.cjs:430-434`] |

## Findings Summary (after adjudication)

| Bucket | P0 | P1 | P2 | Status Rule |
| --- | ---: | ---: | ---: | --- |
| DAI adjudicated confirmed/reclassified | 4 | 8 | 6 | Iter-7 confirmed P0/P1 findings, reclassified DAI-008 to P2, and left DAI-002/003/007/011/015 as unadjudicated lower-priority items from iters 4-5. [iteration-004.md; iteration-005.md; iteration-007.md; deltas/iter-007.jsonl] |
| DAI iter-8 unadjudicated | 1 | 1 | 0 | DAI-021 and DAI-022 are retained at original severity because iter-7 did not adjudicate them; this pass spot-checked their cited files but marks them unadjudicated. [iteration-008.md; deltas/iter-008.jsonl] |
| Pattern-derived unique actions | 0 | 5 | 1 | Iter-3 reclassified mixed-executor P0s to P1 and confirmed P-018/P-024/P-031 samples; P-002 remains a P2 ADR-pattern adaptation. [iteration-002.md; iteration-003.md; deltas/iter-003.jsonl] |
| Dropped | 0 | 0 | 0 | DAI-019 and DAI-020 are excluded because iter-7 marked them OUTDATED; ALREADY-DONE pattern IDs are not counted as actions. [iteration-003.md; iteration-007.md; deltas/iter-007.jsonl] |
| Final actionable queue | 5 | 14 | 7 | Total: 26 unique actionable items after duplicate collapse and adjudication. [iteration-002.md; iteration-003.md; iteration-007.md; iteration-008.md] |

### Final Status Ledger

| ID(s) | Final Status | Severity | Note |
| --- | --- | --- | --- |
| DAI-009 | ADJUDICATED-CONFIRMED | P0 | `runScript` masks file-not-found, timeout, parse, and crash failures behind `null`. [iteration-005.md; iteration-007.md; deltas/iter-007.jsonl] |
| DAI-013 | ADJUDICATED-CONFIRMED | P0 | README claims `plateau` is valid while SKILL.md and `improvement-journal.cjs` reject it. [iteration-005.md; iteration-007.md; deltas/iter-007.jsonl] |
| DAI-017 | ADJUDICATED-CONFIRMED | P0 | SKILL.md frontmatter version is behind the latest changelog. [iteration-006.md; iteration-007.md; deltas/iter-007.jsonl] |
| DAI-018 | ADJUDICATED-CONFIRMED | P0 | v1.4.0.0 changelog contains no-op placeholder rename content. [iteration-006.md; iteration-007.md; deltas/iter-007.jsonl] |
| DAI-021 | UNADJUDICATED-SPOT-CHECKED | P0 | Code uses `.gemini/agents/{name}.md`; docs/playbooks still describe `.agents/agents/{name}.md`. [iteration-008.md; deltas/iter-008.jsonl; `scan-integration.cjs:15-19`; `integration_scanning.md:39,78`] |
| DAI-001, DAI-004, DAI-005, DAI-006, DAI-010, DAI-012, DAI-014, DAI-016 | ADJUDICATED-CONFIRMED | P1 | Promotion sync, profile/rubric/data quality, scoring fallback, mutation validation, manifest path, and command-path defects were confirmed in iter-7. [iteration-004.md; iteration-005.md; iteration-007.md; deltas/iter-007.jsonl] |
| DAI-022 | UNADJUDICATED-SPOT-CHECKED | P1 | Promotion requires `candidate-better` plus delta, while scorer emits `candidate-acceptable` without a baseline. [iteration-008.md; deltas/iter-008.jsonl; `promote-candidate.cjs:156-161`; `score-candidate.cjs:430-434`] |
| P-018/P-026, P-020/P-021/P-022, P-023, P-024/P-030, P-031 | CONFIRMED-OR-RECLASSIFIED PATTERN ACTIONS | P1 | These collapse to adjudication pass, mixed-executor benchmarking, evaluator-gap tracking, numeric sort, and convergence/debug transparency. [iteration-002.md; iteration-003.md; deltas/iter-003.jsonl] |
| DAI-002, DAI-003, DAI-007, DAI-008, DAI-011, DAI-015, P-002 | UNADJUDICATED-OR-RECLASSIFIED LOWER PRIORITY | P2 | These remain useful but are not prerequisites for the P0/P1 repairs. [iteration-004.md; iteration-005.md; iteration-007.md; deltas/iter-007.jsonl] |
| DAI-019, DAI-020 | OUTDATED | Drop | Iter-7 marks both historical/subsumed and removes them from the actionable queue. [iteration-007.md; deltas/iter-007.jsonl] |
| P-006, P-012, P-032 | ALREADY-DONE-CONFIRMED | Drop | Script shims, sk-doc structure, and mutation signature dedup were confirmed already present. [iteration-003.md; deltas/iter-003.jsonl] |
| P-011 | PARTIAL-ALREADY-DONE | Drop from uplift queue | Test infrastructure exists, but iter-3 corrected the count from 7 to 5 files. [iteration-003.md; deltas/iter-003.jsonl] |

## Uplift Themes

### Theme A - Functional Correctness and Workflow Unblockers

- Findings: DAI-009, DAI-010, DAI-012, DAI-014, DAI-016, DAI-022, P-024/P-030. [iteration-003.md; iteration-005.md; iteration-007.md; iteration-008.md]
- Severity: P0=1, P1=6, P2=0. [deltas/iter-003.jsonl; deltas/iter-007.jsonl; deltas/iter-008.jsonl]
- Effort: M. Most changes are localized script fixes plus tests for affected paths. [iteration-005.md; iteration-007.md; iteration-008.md]
- Priority: P0 packet.
- Dependency: None; this should ship first because manifest/path mismatches, masked scoring failures, and promotion contract mismatch can block or mislead the core workflow. [iteration-005.md; iteration-007.md; iteration-008.md]
- Risk if not shipped: Operators cannot diagnose profile-generation failures, command scanning can silently miss surfaces, workflow initialization can fail on the manifest path, and baseline-less promotion remains contractually blocked. [iteration-005.md; iteration-007.md; iteration-008.md]
- Recommended packet: `124-deep-agent-improvement-correctness-fix-pack`.

### Theme B - Documentation Truth, Versioning, and Changelog Integrity

- Findings: DAI-013, DAI-017, DAI-018, DAI-021, DAI-008, P-002. [iteration-005.md; iteration-006.md; iteration-007.md; iteration-008.md]
- Severity: P0=4, P1=0, P2=2. [deltas/iter-006.jsonl; deltas/iter-007.jsonl; deltas/iter-008.jsonl]
- Effort: S/M. Most work is document reconciliation, but DAI-013 may require choosing whether docs or enum policy is canonical. [iteration-005.md; iteration-007.md]
- Priority: P0 packet.
- Dependency: Theme A can run in parallel except for any stop-reason enum decision that touches validator behavior. [iteration-005.md; iteration-007.md]
- Risk if not shipped: Operators receive contradictory stop-reason guidance, stale mirror paths, and false version/changelog signals. [iteration-006.md; iteration-008.md]
- Recommended packet: `125-deep-agent-improvement-doc-truth-sync`.

### Theme C - Evaluator Reproducibility and Data Quality

- Findings: DAI-004, DAI-005, DAI-006, DAI-002, DAI-003, P-023, P-031. [iteration-002.md; iteration-004.md; iteration-007.md]
- Severity: P0=0, P1=5, P2=2. [deltas/iter-002.jsonl; deltas/iter-004.jsonl; deltas/iter-007.jsonl]
- Effort: M/L. Rubric versioning, profile sanity checks, and registry validation require schema decisions and reducer/test updates. [iteration-004.md; iteration-007.md]
- Priority: P1 packet.
- Dependency: Ship after Theme A so validation work builds on corrected scoring and reducer behavior. [iteration-005.md; iteration-007.md]
- Risk if not shipped: Old scores can claim new-rubric semantics, empty dimension arrays can pass through state, and profile generation can look deterministic without being semantically validated. [iteration-004.md; iteration-007.md]
- Recommended packet: `126-deep-agent-improvement-evaluator-reproducibility`.

### Theme D - Runtime Mirror and Promotion Parity

- Findings: DAI-001, DAI-007, DAI-021. [iteration-004.md; iteration-007.md; iteration-008.md]
- Severity: P0=1, P1=1, P2=1. [deltas/iter-004.jsonl; deltas/iter-007.jsonl; deltas/iter-008.jsonl]
- Effort: M. Promotion sync policy, mirror docs, and optional cross-runtime validation need one clear runtime inventory. [iteration-004.md; iteration-008.md]
- Priority: P1 packet, with the DAI-021 doc correction pulled into Theme B if faster. [iteration-008.md]
- Dependency: Depends on Theme B for canonical mirror-path truth and Theme A if promotion behavior changes. [iteration-008.md]
- Risk if not shipped: Promotion updates only the canonical target, while mirrors can drift and the scanner/test docs can point operators at a non-existent `.agents/agents/` path. [iteration-004.md; iteration-007.md; iteration-008.md]
- Recommended packet: `127-deep-agent-improvement-runtime-parity`.

### Theme E - Research Methodology Hardening

- Findings: P-020/P-021/P-022, P-018/P-026, DAI-011, DAI-015. [iteration-002.md; iteration-003.md; iteration-005.md]
- Severity: P0=0, P1=2, P2=2. [deltas/iter-003.jsonl; deltas/iter-005.jsonl]
- Effort: L. Mixed-executor benchmarking and adjudication loops are methodology features, while timeout configurability and promotion-boundary tests are smaller support items. [iteration-002.md; iteration-003.md; iteration-005.md]
- Priority: P1 packet after functional and truth-sync fixes.
- Dependency: Depends on Themes A-C so benchmark/adjudication outputs operate on repaired scoring, docs, and profile semantics. [iteration-003.md; iteration-004.md; iteration-007.md]
- Risk if not shipped: The skill remains single-executor and lacks an explicit false-positive adjudication pass, which iter-3 classified as quality risk rather than blocker. [iteration-003.md]
- Recommended packet: `128-deep-agent-improvement-methodology-hardening`.

## Cross-References

- Arc 117 contributed AI Council/adjudication and ADR patterns P-001/P-002; only P-002 remains as a P2 adaptation because iter-2 skipped the external council pattern. [iteration-001.md; iteration-002.md]
- Arc 118 contributed runtime relocation, script-shim, doc compliance, canonical companion, and deep-review adjudication/fix-pack patterns; P-018 remains applicable as an adjudication-pass pattern, while script shims and sk-doc structure were already present. [iteration-001.md; iteration-002.md; iteration-003.md]
- Arc 119 contributed mixed-executor and deep-research mapping/adjudication precedent; P-020/P-021/P-022 were reclassified from P0 to P1 because single-executor DAI currently works, and P-026 supports the adjudication-pass recommendation. [iteration-001.md; iteration-002.md; iteration-003.md]
- Arcs 120-122 contributed numeric sort, convergence transparency, content-hash dedup, and YAML script verification patterns; P-024/P-030 and P-031 remain actionable, while P-032 was already implemented. [iteration-001.md; iteration-002.md; iteration-003.md]
- The post-118 canonical companion question does not need a separate packet: iter-4 found `deep-agent-improvement` already has feature catalog, manual testing playbook, references, assets, and scripts at peer depth, and iter-2 skipped P-013 as not requiring a new companion set. [iteration-002.md; iteration-004.md]

## Recommendation

Proceed with `PASS-WITH-UPLIFT`, not unconditional pass. The first two packets should be treated as release blockers for this uplift line because the confirmed P0s affect error visibility, stop-reason truth, version/changelog integrity, and mirror-path documentation. [iteration-005.md; iteration-006.md; iteration-007.md; iteration-008.md]

Packet sequence:

1. `124-deep-agent-improvement-correctness-fix-pack`: fix DAI-009/010/012/014/016/022 plus numeric sort P-024/P-030, and add regression tests for the corrected script paths and scoring fallbacks. [iteration-003.md; iteration-005.md; iteration-007.md; iteration-008.md]
2. `125-deep-agent-improvement-doc-truth-sync`: reconcile `plateau`, SKILL.md version, v1.4.0.0 changelog, mirror-path docs, and the DAI-008 CLI/YAML wording. [iteration-005.md; iteration-006.md; iteration-007.md; iteration-008.md]
3. `126-deep-agent-improvement-evaluator-reproducibility`: add rubric/profile/threshold versioning, profile sanity checks, dimension-array validation, cross-packet dedup warnings, and convergence/debug visibility. [iteration-002.md; iteration-004.md; iteration-007.md]
4. `127-deep-agent-improvement-runtime-parity`: add or document mirror sync after promotion and define optional cross-runtime validation gates. [iteration-004.md; iteration-007.md; iteration-008.md]
5. `128-deep-agent-improvement-methodology-hardening`: add mixed-executor benchmark support, explicit false-positive adjudication, configurable script timeout, and promotion-boundary coverage. [iteration-002.md; iteration-003.md; iteration-005.md]

Iteration 10 should not hunt broadly unless the operator wants another adversarial sweep. The highest-value iter-10 task is to validate this synthesis against the two unadjudicated iter-8 findings, then freeze the packet roadmap and emit the final convergence decision. [iteration-008.md; deltas/iter-008.jsonl]
