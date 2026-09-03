---
title: "Iteration 006: D4 Maintainability — Bloat Measurements & Legibility (quantitative)"
trigger_phrases: []
---
# Iteration 006: D4 Maintainability — Bloat Measurements & Legibility (quantitative)

## Focus
Quantify the packet's bloat/duplication claims: continuity-block duplication (004), comment-byte leakage (005), byte-budget feasibility (005), decision-record residual dup (003).

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 13 (8 manifest .tmpl continuity blocks, 001 {spec,plan,tasks,implementation-summary}.md byte profiles, 002 spec.md byte profile, level-1/level-2 example sizes)
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.04

## Findings

### P2, Suggestion
- **F023**: 005 draft byte budgets are infeasible against the current corpus, `005-comment-extraction/spec.md:97`, [Description: measured sizes vs draft budgets (spec ≤3.5KB, plan ≤5KB, merged tasks ≤5KB, impl-summary ≤2.5KB): level-1 spec example 4280B (OVER by 19%), level-1 impl-summary example 3365B (OVER by 31%), level-2 spec example 6627B (OVER by 85%). Even filled examples break the budgets; scaffolds (with comments) are larger still. The spec's own open question (line 161) says budgets must be recomputed with the real renderer — confirmed necessary before planning.] (dimension: maintainability)
- **F024**: 004's "~227 near-identical lines" continuity-duplication estimate is ~2.8x the measured duplication, `004-continuity-single-source/spec.md:86`, [Description: measured continuity block = 16 lines per doc (001 plan.md:12-27); a 5-doc L2 packet carries ~80 duplicated lines, not ~227. checklist.md.tmpl and decision-record.md.tmpl emit the block once per level section (3x and 2x occurrences), so L3/L3+ packets duplicate more than L2. The duplication is real and material (8 manifest templates × 16 lines = ~128 lines of template surface), but the problem statement overstates magnitude.] (dimension: maintainability)

## Corroboration Evidence (phase-5 premise, recorded — no new finding)
Comment-block byte share (full `<!-- -->` blocks) on scaffolded 001 docs:
- spec.md: 1067B comments / 4415B total = 24.2%
- plan.md: 930B / 4790B = 19.4%
- implementation-summary.md: 2134B / 4108B = 51.9% (phase-5 claims 43.6% — same magnitude, sample higher)
- Authored 002 spec.md: 489B / 11988B = 4.1% (authoring drops comment share an order of magnitude)
- Packet-wide estimate for the 001 4-doc set: ~27.6% comment bytes (phase-5 claims 15.5% — directional agreement)
Phase 5's premise — instructional HTML comments leak into scaffolded bytes and dominate scaffold cost — is CONFIRMED with per-doc measured values; the exact percentages vary by doc and are all in the 19-52% band.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | (cumulative) | F023/F024 quantify claims in 005/004 problem statements |
| checklist_evidence | fail | hard | (cumulative) | F018 |

## Assessment
- New findings ratio: 0.04
- Dimensions addressed: maintainability (bloat measurements)
- Novelty justification: first quantitative measurements of the duplication/leakage claims; F023/F024 are new feasibility/accuracy findings

## Ruled Out
- "Comment leakage is under 15.5%": measured 19-52% per doc — the claim understates scaffolded docs, not overstates.
- "Handover [YOUR_VALUE_HERE] markers are leakage": intentional runtime placeholders replaced by create.sh substitutions — not a finding.

## Dead Ends
- Counting all 8 templates' continuity blocks precisely: per-template parse limited by frontmatter structure; scaffold-level measurement (16 lines/doc) is the reliable figure.

## Recommended Next Focus
- Dimension: maintainability/traceability (002 BLOCKER divergence deep-dive)
- Focus area: Verify the 002 BLOCKER's check-anchors vs compare divergence claims at code level: template-structure.js compare anchor-optionality logic vs check-anchors pairing/order block (lines 106-168), L2: prefixed-header approach feasibility, is_phase_parent loading in validate.sh context.

## Review verdict: CONDITIONAL
