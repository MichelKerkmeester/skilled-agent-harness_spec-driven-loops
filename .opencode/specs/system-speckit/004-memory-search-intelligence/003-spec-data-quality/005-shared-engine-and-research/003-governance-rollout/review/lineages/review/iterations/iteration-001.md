# Iteration 1: Correctness

## Focus
Internal coherence of the planning scaffold for `028-governance-rollout`. Because the phase is PLANNED (no governance deliverable shipped), correctness here means: are the counts (17 stages, 7 phases, 5 edges, 18 NO-GO items), the topological-sort claims, the four-beat sequence, and the edge-case logic internally consistent and consistent with the cited parent research?

Files: `spec.md`, `plan.md`, `implementation-summary.md`, and `research/research.md` §3-§5 (parent).

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 4 (spec.md, plan.md, implementation-summary.md, research.md)
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0 (first iteration baseline)

## Findings

### P2, Suggestion
- **F001**: NO-GO count arithmetic ("ten Tier-D + eight novel = eighteen") reconciles only under a loose reading of "non-GO and conditional", `spec.md:83` / `spec.md:117` (REQ-005) / `spec.md:66`. The cited research novel table yields **3 strict NO-GO** (`research/research.md:83-85`) and **2 conditional** (`research/research.md:81-82`) = 5 "non-GO and conditional" novel entries, not 8. To reach the claimed 8 novel entries (and thus 18 total) the author must also fold in the 3 *qualified* GO-on-cost rows (`research/research.md:78` "as an L and navigation surface, not a ranking lane", `:79` and `:80` "GO-on-cost (thin)"). The arithmetic is therefore reachable but the spec labels those 3 as part of a "non-GO and conditional" set when the research verdict column marks them GO-on-cost. Net effect: the downstream `no-go-list.md` author has an ambiguous target — strict reading = 15 items, loose reading = 18 — and the file name "no-go-list" is broader than its actual contents (it is a "NO-GO + conditional + qualified-GO" list). Recommend the spec pin the exact 8 novel rows by research line number so the deliverable count is unambiguous. Not a blocker: the spec scope (`spec.md:83`) already declares the list includes "non-GO and conditional" entries, so the 18 is internally declared, just imprecise against the source verdicts.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| _(traceability protocols deferred to Iteration 3)_ | n/a | n/a | n/a | Correctness pass; spec_code/checklist_evidence run in the dedicated traceability iteration |

## Assessment
- New findings ratio: 1.0
- Dimensions addressed: correctness
- Novelty justification: First substantive pass. Verified the load-bearing counts and sequence claims. Confirmed consistent: five inviolable edges (census→gate, engine→front-doors, backfill→error, coverage-guard→retrieval-trust, C2→retrieval-promotion) match `research/research.md:106` verbatim; 17 stages / 7 phases with Phases I-V (reuse-first), VI (novel, parallel with III-V), VII (retrieval behind C2) match `spec.md:78` ↔ `research/research.md:106`; four-beat WARN→BACKFILL→RE-MEASURE-TO-ZERO→ERROR consistent across `spec.md:79`, `plan.md:88`, `research/research.md:108`; Stage-0 census "0 grandfathered packets → zero blast radius" edge case (`spec.md:173`) matches `research/research.md:108`. The single new finding is the NO-GO count imprecision (F001, P2).

## Ruled Out
- "Seventeen stages contradicts eighteen build phases": Ruled out. These are deliberately different counts — 18 build phases in the program, 17 rollout *stages* (the topological sort), 18 NO-GO *items*. `spec.md:66` and `research/research.md:106` keep them distinct. No contradiction.
- "Four-beat sequence is compressible per the docs": Ruled out. `spec.md:79` and REQ-002 (`spec.md:114`) both state the sequence is non-compressible and the ERROR beat blocks until backfill reads zero. Consistent.

## Dead Ends
- Verifying the actual topological sort of `rollout-sequence.md`: the file does not exist (PLANNED). Cannot audit the realized sort, only the spec's description of it, which is consistent. Deferred to a post-build review.

## Recommended Next Focus
Iteration 2: security — confirm NFR-S01 (no new write path / trust boundary) and the CI-never-auto-commits rationale are coherent and that the governance layer introduces no exposure. Expect a clean pass given the phase ships only read-time documents.

Review verdict: PASS
