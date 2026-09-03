---
title: "Iteration 007: D3/D1 — 002 BLOCKER Divergence Deep-Dive (check-anchors vs compare)"
trigger_phrases: []
---
# Iteration 007: D3/D1 — 002 BLOCKER Divergence Deep-Dive (check-anchors vs compare)

## Focus
Code-level verification of the 002-tasks-checklist-merge BLOCKER: the check-anchors ANCHORS_VALID-vs-compare divergence, the second code path claim, is_phase_parent sourcing, and the L2:-prefixed-header approach viability.

## Scorecard
- Dimensions covered: traceability, correctness
- Files reviewed: 3 (scripts/rules/check-anchors.sh [re-read 181-208 + 92-168], scripts/utils/template-structure.js [69-91, 437-518, 744-812])
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.02

## Findings

### P2, Suggestion
- **F025**: ANCHORS_VALID silently skips required-anchor validation when compare reports unsupported, `.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:191-193`, [Description: `compare_required_anchors` returns silently unless the compare output's first line is `supported\ttrue` (line 191); compare emits `supported: false` when no template contract exists for that level/basename (template-structure.js:439-447, 746-754). A doc whose template is missing or unregistered at the folder's level bypasses the required-anchor half of ANCHORS_VALID with no warning — validation goes silently dark on exactly the surface the 002 phase's byte-identical gate must trust.] (dimension: correctness)

## BLOCKER Verification Verdict (002 spec.md:174)
| Claim (002 BLOCKER) | Code-level evidence | Verdict |
|---------------------|---------------------|---------|
| check-anchors.sh has a second code path beyond compare_required_anchors (pairing/order block, lines ~100-172) | check-anchors.sh:106-168 duplicate-ID/unclosed/orphaned-anchor loop, independent of compare_required_anchors (:181-208) | CONFIRMED |
| compare reports anchors via optional classification | template-structure.js:463-497 header-rule matching assigns required vs optional anchors; optionalHeaderRules (L2:/L3+:-style prefixes) drive optionality | CONFIRMED (classification basis differs from pairing block) |
| standalone check-anchors run needs is_phase_parent loaded | is_phase_parent defined only at scripts/lib/shell-common.sh:48; check-anchors.sh:34 references it without definition | CONFIRMED (F013) |
| A/B result: compare clean (15 optional, zero missing) yet ANCHORS_VALID fails with 9 | Mechanism consistent: classification bases differ — compare keys on template header rules; ANCHORS_VALID's independent paths (pairing/order at :106-168, missing-anchor at :92-104) evaluate the shipped doc's raw anchor pairs | PLAUSIBLE — exact 9-issue reproduction requires executing the tooling, which is outside this review lineage's write-safe constraints; recorded as a blocked check in the audit appendix |
| L2:-prefixed headers make verification sections optional-in-contract | isOptionalTemplateHeader path at template-structure.js:463-466 (optionalHeaderRules) | VIABLE at code level; renders `## L2: Verification Protocol` titles per the spec's own note |

## Claim Adjudication Packets (new P0/P1)
None — no new P0/P1 findings this iteration.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | 002 BLOCKER structural claims confirmed at code level; exact reproduction blocked (no tool execution) | F025 added |

## Assessment
- New findings ratio: 0.02
- Dimensions addressed: traceability (BLOCKER), correctness (F025)
- Novelty justification: F025 is a new validation-gap mechanism; BLOCKER verdict is the first code-level adjudication of the packet's central threat

## Ruled Out
- "compare and check-anchors share one classification path": disproven — header-rule matching (template-structure.js) vs pair-balance + silent-supported gate (check-anchors.sh) are independent.

## Dead Ends
- Reproducing the exact 9 ANCHORS_VALID issues: requires running check-anchors.sh/compare on a merged template + shipped packet — explicitly out of scope (no repo tooling execution). Recorded as blocked check for the 002 phase to re-verify.

## Recommended Next Focus
- Dimension: traceability (continuity + generate-context behavior)
- Focus area: generate-context.ts multi-doc _memory rewrite behavior (002/004 open question), SESSION_LINEAGE scope, and the 004 validator-first sequencing claim (FRONTMATTER_MEMORY_BLOCK relaxation feasibility).

## Review verdict: CONDITIONAL
