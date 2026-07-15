# R2-20 Claim-Honesty (documentation angle)

**Angle summary:** Cross-cut every 005 doc for the four overstatement shapes (planned-reads-as-shipped, proposed-flag-reads-as-live, metric-reads-as-measured, the A4 GO overstated). The research-only contract holds almost everywhere and every load-bearing live-code premise verifies. The single soft spot is the word "measured" attached to A4, where a measured census input and an unrun GO outcome blur together in the narrative docs.

**Tally:** P0 = 0, P1 = 0, P2 = 3.

---

## Live-code premises checked and found HONEST (no finding)

The docs do not pass off planned work as shipped on the live-code axis. Each load-bearing premise resolves to real code:

- 3-result truncation floor: `confidence-truncation.ts:35` `const DEFAULT_MIN_RESULTS = 3` (default applied at `:106`). Matches research.md:8.
- Default-ON quality-loop keystone: `SPECKIT_QUALITY_LOOP` default `true` "Graduated ON" and `SPECKIT_QUALITY_AUTO_FIX` default `true` "Enabled by default" (`mcp_server/ENV_REFERENCE.md:391` and `:198`, resolved in `lib/search/search-flags.ts`). Matches research.md:8.
- A4 bypass and rule severities: `detect_legacy_grandfathered` and the `LEGACY_GRANDFATHERED` strict reads exist at `scripts/spec/validate.sh:175-183,912,927,935,1044,1062`. `DESCRIPTION_SHAPE` and `GRAPH_METADATA_SHAPE` both carry `"severity": "warn"` in `scripts/lib/validator-registry.json`. Both rule scripts exist. Matches 004/spec.md:66.
- The 28 phase flags (`SPECKIT_SCHEMA_ENUM_ENFORCE`, `SPECKIT_HVR_STYLE_AUTOFIX` and the rest) are presented as default-OFF flags a phase "declares", never as live. No proposed flag reads as live.
- No child phase claims completion. All 28 children read `completion_pct: 0` in both spec.md and implementation-summary.md, so the prior 100-vs-5 bookkeeping bug is fully cleared.

---

## FINDINGS

### F1 (P2) "measured GO" labels a measured input as a proven outcome
**Type:** SPEC-PREMISE.
**Evidence:** The A4 verdict is labeled `measured-GO` (004/spec.md:57), "the only measured unconditional GO" (implementation-summary.md:91), "One measured unconditional GO" (handover.md:55) and "A4 is the only measured unconditional GO in the whole program" (research/research.md:29,132). The real measurement behind A4 is the Stage-0 census, "11 invalid live-root graph files and 0 grandfathered packets" (research/research.md:21). That input is measured. The GO outcome it is named for, that the warn-to-error flip lands clean with zero false-block, is NOT measured. A4 is `completion_pct: 0` and Status Draft (004/spec.md:54,29), and its REQ-004 backfill-re-measure-to-zero plus SC-002 corrupted-scratch-exits-2 are future targets (004/spec.md:112,128). The only doc that draws this line is benchmark-and-test-status.md:5, which states A4 "is also still SPECIFIED here because no build run has happened." The label "measured GO" carries the proof of a clean flip that has not run.

### F2 (P2) Two narrative docs contradict on "measured" with no cross-reference
**Type:** SPEC-PREMISE.
**Evidence:** implementation-summary.md:91 says A4 "is the only measured unconditional GO". SUMMARY.md:60 says "Nothing is shipped, and nothing is measured." Both sentences are true under different senses of "measured" (measurable-evidence-class versus build-run-outcome), but neither doc carries the disambiguation. Only benchmark-and-test-status.md:5 reconciles them. A reader of either narrative doc alone cannot tell which sense is meant, and the plain-language SUMMARY is the most likely entry point for a non-author.

### F3 (P2) "one sure thing (zero risk)" understates A4's own risk register
**Type:** SPEC-PREMISE.
**Evidence:** SUMMARY.md frames A4 as "Do now, one sure thing (zero risk)" and "Free" (SUMMARY.md:26). A4's own spec rates the flip risk Med and gates it behind a four-beat backfill discipline because "an early flip would block validation on legacy packets" (004/spec.md:81,140, Risk row "Med"). "Zero risk" is true only after the backfill-to-zero beat runs, which it has not. The plain-language summary presents the post-mitigation safety as the current state.

---

## Most important finding

F1. The prompt's named target holds up under scrutiny. "Measured GO" is not fabrication, a census measurement does underpin A4, but the term carries the unrun clean-flip outcome it is named for, and only the benchmark-and-test doc draws that line. Tightening the narrative docs to say "measured-class GO, outcome still SPECIFIED" would close the gap without weakening the verdict.
