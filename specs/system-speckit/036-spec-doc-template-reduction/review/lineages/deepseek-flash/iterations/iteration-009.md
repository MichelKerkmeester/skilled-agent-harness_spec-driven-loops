# Iteration 009: D3 — Overlay Protocols + Residual Scope Sweep (broadening)

## Focus
Complete the overlay protocols (feature_catalog_code, playbook_capability), verify the 002 "five reader surfaces" claim end-to-end, deepen F003 with the 001 research/ artifacts, and verify the 003 research.md.tmpl widget-taxonomy claim.

## Scorecard
- Dimensions covered: traceability (overlay protocols)
- Files reviewed: 7 (templates/manifest/spec-kit-docs.json, feature-catalog/tooling-and-scripts/template-composition-system.md, templates/manifest/research.md.tmpl [lines 397-821], 001-analysis/research/research.md [existence/size], 001-analysis/research/orchestration-summary.json, manual-testing-playbook/ dir listing)
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=1 (F003 evidence upgraded)
- New findings ratio: 0.00

## Findings
No new findings this iteration. Evidence upgrades:

- **F003 UPGRADED**: the phase-1 deliverable exists — `001-analysis/research/research.md` (17.6KB, authored 2026-08-26T08:37Z) with a completed ox-alpha-a lineage (orchestration-summary.json: succeeded=1) — yet the spec.md contract surface was never promoted from the research output. The work is done; the normative document is missing.

## Verified Claims
| Claim | Evidence | Verdict |
|-------|----------|---------|
| 002 REQ-003: all five checklist.md reader surfaces exist | manifest spec-kit-docs.json:7-9,70-83,145,173,240-244,276-292 (tasks/checklist rows + level gates); orchestrator.ts:150 detectLevel + :550-561 PRIORITY_TAGS; graph-metadata-parser.ts:1186-1198 deriveStatus; check-ac-coverage.sh:54,57,198-200 | PASS — 5/5 surfaces verified at code level |
| 003: research.md.tmpl is a front-end widget taxonomy (Markup/CSS/Spam/SPA) | research.md.tmpl:397 Markup Requirements, :439 CSS Specifications, :685 Spam Prevention, :743-821 SPA Support/Initialization/route-change | PASS — content confirms the claim |
| feature_catalog_code: catalog claims match template tooling | template-composition-system.md:19,32 — composition system writes the 4 baseline docs + level add-ons (checklist L2+, decision-record L3+), consistent with manifest rows and observed scaffolds | PASS (advisory) |
| playbook_capability | manual-testing-playbook/ exists with 12+ scenario dirs; scenario-level parity not executed this lineage | PARTIAL (advisory, non-gating) |

## Claim Adjudication Packets (new P0/P1)
None — no new P0/P1 findings this iteration.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | (cumulative: 9 pass / 2 fail + BLOCKER structural confirm) | — |
| checklist_evidence | fail | hard | F018 | — |
| feature_catalog_code | pass | advisory | template-composition-system.md vs manifest/observed scaffolds | — |
| playbook_capability | partial | advisory | playbook exists; parity audit not executed (advisory skip) | — |

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: traceability (overlay completion)
- Novelty justification: no new findings — overlay protocols pass/partial; evidence upgrades recorded

## Ruled Out
- "002's five-reader-surfaces claim is overstated": disproven — all five verified at code level.
- "research.md.tmpl taxonomy claim is stale": disproven — content confirms widget taxonomy at the claimed lines.
- Research-lineage timestamp anomalies (orchestration-summary.json: 13 entries 4.3-6.1M ms after window): out of scope — deep-research lineage internals, not 036 packet docs; recorded for the audit appendix only.

## Dead Ends
- Deep playbook scenario parity: advisory protocol, skipped with note (no scenario-level execution in this lineage).

## Recommended Next Focus
- Dimension: stabilization / adversarial pass (final iteration)
- Focus area: Re-read cited evidence for every P0/P1 candidate, adversarial replay of severity calls, residual surface sweep (003-006 child docs not yet individually read: 003-006 tasks.md/implementation-summary.md [scaffold pattern verified via 001/002], templates/examples/level-2 remaining docs, references/templates/level-specifications.md), and final severity reconciliation.

## Review verdict: CONDITIONAL
