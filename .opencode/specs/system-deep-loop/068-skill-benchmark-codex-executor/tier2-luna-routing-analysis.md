# Tier-2 Luna Routing — Findings & Recommendations

> **Report-verifiable scope.** This analysis evaluates five benchmark reports for **gpt-5.6-luna (xhigh, fast)** under the recorded executors (Tier-2 via cli-opencode; Tier-1 via cli-opencode and cli-codex). The report JSONs in `artifacts/` establish the subject, configuration, and benchmark values; they do not establish authorship or independent verification. The findings below were authored by **GPT-5.6-SOL (xhigh, fast, read-only)** and then adjusted by a **GPT-5.6-SOL-ULTRA 5-iteration `/deep:review`** (verdict CONDITIONAL; P0=0, P1=2, P2=4). That review independently reproduced every load-bearing figure exactly and confirmed the defects were evidence-scoping and citation, not numeric; the audit trail is the non-report artifact for that verification at `review/review-report.md`. All conclusions are scoped to the **fitted suites** for this subject and configuration — no suite carries holdouts, so nothing here is a generalization claim.

---

## How to read these scores

- **D1intra and D2 are the same `router-replay-recall` proxy** in all five reports — they are not two independent confirmations. Read them as one signal.
- **D5 is a hard conformance gate** (passed at 100 for Tier-2, 97 for Tier-1). It measures hub-route conformance, **not** leaf-resource accuracy.
- **`intentRecall` is 0 with `liveResourceOnly: true`** in the populated rows (or the field is absent in sk-code), so D1intra uses resource/surface fallback semantics rather than measuring generic intent routing.
- **D1inter (advisor probe) and D4 (skill-on/off ablation) did not run** — they are `null` / `unscored-mode-a` in every Tier-2 report, so each Tier-2 aggregate reflects only D1intra + D2 + D3 + D5.
- **"Gold"** is the per-scenario expected value luna's reply is scored against. Where a scenario has no gold, its dimension collapses to a deterministic skeleton and measures nothing about luna.

---

## Findings

All Tier-2 aggregates exclude D1inter and D4; neither the advisor probe nor skill-on/off ablation ran.

| Skill | Verdict / aggregate | D1intra | D2 | D3 | D5 | D1inter / D4 |
|---|---:|---:|---:|---:|---:|---|
| mcp-tooling | PASS / 100 | 100 | 100 | unscored | 100 | unscored |
| sk-doc | FAIL / 20 | 24 | 24 | 8 | 100 | unscored |
| sk-code | CONDITIONAL / 65 | 65 | 65 | 58 | 100 | unscored |

Evidence: [SOURCE: artifacts/tier2-mcp-tooling-luna-opencode.report.json:12] [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:12] [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:12].

### mcp-tooling: no-gold control

This is not a Luna score. None of MT-001 through MT-004 or MT-H01/MT-H02 has resource or surface gold, so there is no valid full/partial/zero recall distribution. All six rows have `intentRecall=0`, `resourceRecall=null`, and `surfaceMatch=null`, yet receive D1intra/D2 scenario scores of 1. D3 is unscored because there is no positive resource gold.

The 100/PASS is therefore the deterministic Mode-A skeleton plus D5, not measured routing capability. No mcp-tooling scenario can honestly be named a Luna success or failure from this report. Evidence: [SOURCE: artifacts/tier2-mcp-tooling-luna-opencode.report.json:181] [SOURCE: artifacts/tier2-mcp-tooling-luna-opencode.report.json:661].

### sk-doc: weak exact-resource routing

Resource-gold distribution across 18 scenarios:

- Full: 1 — `SD-012`.
- Partial: 4 — `SD-014` 0.75, `SD-002` 0.75, `SD-006` 0.50, `SD-017` 0.50.
- Zero: 13 — `SD-007`, `SD-009`, `SD-015`, `SD-013`, `SD-005`, `SD-004`, `SD-003`, `SD-001`, `SD-016`, `SD-011`, `SD-010`, `SD-018`, `SD-020`.

The gold-only mean resource recall is 19.4%. The reported D1intra score is 24 because the denominator also includes no-gold `SD-008`, which receives a scenario score of 1 despite `resourceRecall=null`. Evidence: [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:406] [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:1751].

There are zero surface-gold rows; every `surfaceMatch` is null. That zero coverage is structural, not a Luna miss.

The strongest report-backed hypothesis is path-root confusion. Nine of the 13 zero-recall responses begin their resource list with a `create-*`-prefixed path, including `SD-007`, `SD-009`, `SD-015`, `SD-004`, `SD-003`, `SD-016`, `SD-011`, `SD-018`, and `SD-020`. All four partial responses and full `SD-012` instead use root-relative `references/...` paths. This is correlation, but it directly distinguishes most failures from the non-zero rows. Evidence: [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:189] [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:1648] [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:1751].

Execution volume does not explain the misses: zero-recall rows average 23.8 events and 2.62 observed reads, while partial rows average 22 events and 2.25 reads. `SD-003` recorded 35 events but zero recall; full `SD-012` recorded 34. Unlike sk-code, more observed activity did not reliably produce correct sk-doc paths.

D3=8 shows the second problem: incorrect expansion. Full `SD-012` routed 3 resources with 0 wasted. Partial rows routed 5–6 resources, usually with 5 marked wasted; `SD-015` routed 65 and all 65 were wasted. Luna was not merely omitting resources — it frequently produced broad, wrong-path bundles.

### sk-code: strong surface selection, inconsistent leaf-resource recall

Resource-gold distribution across 15 scenarios:

- Full: 5 — `SD-001`, `LS-001`, `LS-003`, `CS-006`, `CS-007`.
- Partial: 4 — `CS-001` 0.70, `CS-002` 0.667, `CS-004` 0.60, `CS-005` 0.50.
- Zero: 6 — `SD-002`, `SD-003`, `LS-002`, `LS-004`, `CS-003`, `DR-001`.

The gold-only mean resource recall is 49.8%, lower than the report-wide D1intra score of 65 because only half the 30 scenarios carry resource gold.

Surface routing is materially stronger: all 18 surface-gold scenarios are full matches, with no partials or misses. Those are `SD-001/002/003`, `LS-001/002/003/004`, `RD-001`, `CS-001/002/003/004/005/006/007`, and `DR-001/002/003`. Several scenarios therefore select the correct surface while scoring zero on leaf resources — for example `SD-002`, `SD-003`, `LS-002`, `LS-004`, `CS-003`, and `DR-001`. Evidence: [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:309] [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:622] [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:1731].

Observed reads cleanly separate the resource outcomes:

- Every zero-recall row has 0 observed reads and averages 12.8 events.
- Every non-zero row has 2–8 observed reads.
- Full rows average 4.4 reads and 43.6 events; partial rows average 6.75 reads and 44.75 events.

This does not prove that reads cause recall, but it supports a concrete hypothesis: Luna's sk-code leaf routing becomes useful when it actually traverses the routing references; surface naming alone is insufficient.

Scenario family does not explain the variation. Within `LS`, `LS-001/003` are full while `LS-002/004` are zero. Within `CS`, `CS-006/007` are full, `CS-003` is zero, and four others are partial. The missing prompt and expected-resource arrays prevent a stronger phrasing or resource-count explanation.

The 65 aggregate is also mixed with non-live browser scoring: `MR-001`, `MR-002/003/004`, and `CB-001/002/003` **omit the `liveEvidence` field entirely** (the field is absent, not null), yet contribute Mode-A scores of 100 or 50. It should not be read as 65% leaf-resource recall.

### Cross-skill synthesis

Within the fitted suites for gpt-5.6-luna xhigh/fast under the tested executor configurations, routing behavior is skill-specific: sk-doc exact-resource routing is not suitable for unattended use, sk-code surface routing is strong but leaf-resource routing is conditional, and mcp-tooling is unmeasured because it lacks routing gold. Tier-1 fitted results show that the subject can route successfully on deep-improvement under both executors; they do not confirm cross-skill or cross-executor generalization because both Tier-1 suites have zero holdouts. Evidence: [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:13] [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:13] [SOURCE: artifacts/tier1-deep-improvement-luna-opencode.report.json:13] [SOURCE: artifacts/tier1-deep-improvement-luna-codex.report.json:13] [SOURCE: artifacts/tier2-mcp-tooling-luna-opencode.report.json:13].

## Recommendations

The twelve items below are the final, deep-review-adjusted recommendations (all scoped to the fitted suites for gpt-5.6-luna xhigh/fast under the tested executor configuration).

### Luna as a routing subject (this configuration)

1. For gpt-5.6-luna xhigh/fast via cli-opencode on the fitted sk-code suite, use the subject for surface classification only when leaf resources are deterministically validated before execution; require a gold-bearing holdout before extending that policy beyond this configuration. Evidence: the fitted report scores 65 overall, while the analysis reproduces 18/18 surface matches but only 5/15 full resource matches and 6/15 zero-resource matches. [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:12]

2. Do not use the tested configuration unattended for fitted sk-doc resource routing; require exact-path lookup or a deterministic router pending gold-bearing holdout and ablation evidence. This is an operating policy for this configuration, not a model-wide incapability claim. Evidence: the fitted sk-doc report scores 20 with D1intra/D2 24 and D3 8; the analysis reproduces one full, four partial, and thirteen zero resource-gold outcomes. [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:12] [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:44]

3. For sk-code, require the subject to read the surface skill and routing references before emitting leaf resources, then retest that requirement as a controlled intervention rather than treating the observed association as causal. Evidence: every zero-recall row had zero observed reads, while every non-zero row had two to eight; the draft already labels this as a hypothesis. [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:189]

4. Qualify routing conclusions by skill, executor/runtime, model settings, and evaluation stage. Under this tested configuration, fitted results differ materially across sk-doc, sk-code, and Tier-1 deep-improvement; they do not support a model-wide routing verdict. Evidence: fitted aggregates are 20 for sk-doc, 65 for sk-code, 86 for Tier-1 opencode, and 85 for Tier-1 codex. [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:12] [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:12] [SOURCE: artifacts/tier1-deep-improvement-luna-opencode.report.json:12] [SOURCE: artifacts/tier1-deep-improvement-luna-codex.report.json:12]

### Benchmark harness

5. Add resource and surface gold to all six mcp-tooling scenarios before using that suite for model comparison; preserve its current result as a no-gold control only. Evidence: mcp-tooling reports 100/PASS and a 4+2 fitted/holdout split, but the scenario blocks have resourceRecall and surfaceMatch unset because no corresponding gold exists. [SOURCE: artifacts/tier2-mcp-tooling-luna-opencode.report.json:12] [SOURCE: artifacts/tier2-mcp-tooling-luna-opencode.report.json:181]

6. Add surface gold to sk-doc and resource gold to SD-008 where those expectations are semantically meaningful; expand sk-code resource and surface gold only for scenarios with an unambiguous expected target. Evidence: the reviewed population has 0/19 sk-doc surface-gold rows, 18/19 sk-doc resource-gold rows, 15/30 sk-code resource-gold rows, and 18/30 sk-code surface-gold rows. [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:406] [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:309]

7. Run the advisor probe and skill-on/off ablation before treating future Tier-2 aggregates as comprehensive. Evidence: D1inter and D4 are null and marked unscored-mode-a in all three Tier-2 report summaries. [SOURCE: artifacts/tier2-mcp-tooling-luna-opencode.report.json:39] [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:39] [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:39]

8. Export each scenario prompt, expected resource and surface arrays, expected cardinalities, and scoring-population identifiers into the report. Evidence: current scenario blocks expose scores and responses but not the gold arrays needed to test prompt phrasing, expected bundle size, exact omissions, or the resourceRecall-versus-D3 population difference. [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:189] [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:189]

9. Separate the seven sk-code MR/CB rows whose liveEvidence field is absent from live-routing aggregates, or label their contribution explicitly. Do not call those fields null or infer that the rows are synthetic solely from the reports. Evidence: those rows contribute Mode-A scores despite omitting the liveEvidence field; MR-001 is one scenario-block anchor. [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:1231]

10. Add gold-bearing holdout scenarios to sk-doc, sk-code, Tier-1 deep-improvement via opencode, and Tier-1 deep-improvement via codex before making cross-skill or cross-executor generalization claims. Treat mcp-tooling's 4+2 holdout split as a harness control, not routing generalization evidence, until it has routing gold. Evidence: sk-doc, sk-code, and both Tier-1 reports have holdoutScore null and holdoutCount 0; only mcp-tooling reports four fitted plus two holdouts, and it lacks routing gold. [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:13] [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:13] [SOURCE: artifacts/tier1-deep-improvement-luna-opencode.report.json:13] [SOURCE: artifacts/tier1-deep-improvement-luna-codex.report.json:13] [SOURCE: artifacts/tier2-mcp-tooling-luna-opencode.report.json:13]

### Analysis presentation

11. Keep the "How to read these scores" section above: D1intra and D2 are the same router-replay-recall proxy and are not independent confirmations; D5 is a hard conformance gate (100 Tier-2 / 97 Tier-1), not a leaf-resource-accuracy measure; and intentRecall is zero with liveResourceOnly true (or absent in sk-code), so D1intra uses resource/surface fallback semantics. Evidence: the equality and serialization semantics were replayed across all five reports. [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:44] [SOURCE: artifacts/tier1-deep-improvement-luna-opencode.report.json:49]

12. Use claim-complete citations: cite report-summary blocks for aggregate claims; cite every relevant scenario block, or a documented inclusive range, for scenario-derived sets; describe omitted keys as absent; and attach a non-report audit citation for analysis authorship or verifier identity, otherwise narrow the provenance to report-verifiable subject and result metadata. Evidence: the original draft mixed aggregate, partial, and scenario-id-only anchors, while its author/verifier identity is not encoded in any report. [SOURCE: review/review-report.md:57]

## Open Questions

1. Which item populations produce resourceRecall=0.75 while D3 marks all five routed resources wasted for partial sk-doc rows such as SD-002 and SD-014? The exported report should identify both denominators before this is interpreted as a scorer defect or routing behavior. [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:44] [SOURCE: artifacts/tier2-sk-doc-luna-opencode.report.json:52]

2. Which prompt or expected-resource characteristic separates full and zero outcomes within the same sk-code families? Recommendation 8 makes this answerable; until prompts and gold arrays are exported, it remains unresolved. [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:309] [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:622]

3. Should the seven MR/CB rows whose liveEvidence field is absent contribute to the same aggregate as live-routing rows? Recommendation 9 settles the labeling requirement, but aggregate inclusion remains a benchmark-policy decision. [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:1231]

4. What non-report audit evidence supports the all-scenarios-parsed claim, given seven MR/CB rows omit liveEvidence and DR-004 records statedRoutingParsed=false? The reports can establish the discrepancy but cannot identify its provenance. [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:1231] [SOURCE: artifacts/tier2-sk-code-luna-opencode.report.json:2715]
