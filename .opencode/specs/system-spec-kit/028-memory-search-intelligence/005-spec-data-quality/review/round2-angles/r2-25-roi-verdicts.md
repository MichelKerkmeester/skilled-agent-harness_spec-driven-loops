# r2-25 ROI verdicts

Angle summary: audited the GO / GO-on-cost / CONDITIONAL / NO-GO tiering for inflated GOs, missed NO-GOs and unrealistic GO-on-cost costs. The NO-GO list checks clean but two verdict labels are inflated and the one unconditional GO understates its real cost.

## Findings

### F1 (P1, LIVE-CODE) The one unconditional GO understates its cost by conflating two validators

A4 is named "the only measured unconditional GO" and is framed as ships-first, zero-new-code, mechanism-shipped (`research/research.md:21`, `research/research.md:29`, `spec.md:162`). Its grounding says promote `DESCRIPTION_SHAPE` and `GRAPH_METADATA_SHAPE` warn to error "with the real zod schemas". The live warn rules do not use the zod schemas. `validator-registry.json:192-205` points both rules at `rules/check-graph-metadata-shape.sh` and `rules/check-description-shape.sh`, and those scripts run hand-rolled `node -e` key-presence checks (`check-graph-metadata-shape.sh:33-90`, `check-description-shape.sh:33-39`) with no import of `graph-metadata-schema.ts` or `description-schema.ts`. So a warn-to-error flip enforces the weaker key-presence rule only. Delivering the claimed zod-schema enforcement is net-new wiring, not a flag flip. The unconditional GO is either cheap-but-weaker or net-new, not both as written.
- Type: LIVE-CODE.

### F2 (P1, SPEC-PREMISE) Phase-map inflates the novel slate from GO-on-cost to flat GO

`spec.md:188` heads the novel section "Novel out-of-the-box GO" and tags all of 019-025 as flat **GO** (`spec.md:192-198`). The canonical synthesis tags the same items **GO-on-cost**, three of them explicitly degraded: 023 typed-relation KG has a "weak" graph-boost (`research/research.md:78`), 024 freshness queue is "GO-on-cost (thin)" (`research/research.md:79`), 025 per-doc SLAs is "GO-on-cost (thin)" (`research/research.md:80`). `spec.md:153` asserts "The verdict tier comes straight from the canonical synthesis", but GO is not GO-on-cost and the thin qualifier is dropped. Seven phases a reader navigates by carry an inflated tier versus their own cited source.
- Type: SPEC-PREMISE.

### F3 (P2, SPEC-PREMISE) Research synthesis disagrees with itself on the novel GO count

The executive verdict says "four genuinely novel floor-bypassing capabilities the reuse-first work missed" (`research/research.md:8`). The convergence report says "the seven novel GO-on-cost capabilities" (`research/research.md:132`) and section 3 lists seven GO-on-cost rows (`research/research.md:74-80`). The two ROI headline counts of 4 and 7 are never reconciled in text, so the novel GO count a reviewer carries forward is ambiguous.
- Type: SPEC-PREMISE.

### F4 (P2, SPEC-PREMISE) B3 wears a GO-on-cost badge over a C2-gated retrieval half

B3 is tiered GO-on-cost in the phase-map (`spec.md:176`) and sits in Tier B, not the retrieval Tier C. Its own grounding splits its value into edge (a) a floor-bypassing recall gap and edge (b) "a below-floor truncation casualty that pays the floor and is C2-gated" (`research/research.md:37`). Tier C is defined as "gated on a re-index plus a prod-mode completeRecall@3 proof" (`research/research.md:41`). So half of B3's payoff inherits the exact prod-gate that defines CONDITIONAL, yet the tier label reads GO-on-cost with no CONDITIONAL marker. The net-new telemetry premise itself is sound: `learned-feedback.ts` exists but carries no impression or never-retrieved or min_rank_seen capture, so edge (b) cannot ship on cost alone.
- Type: SPEC-PREMISE.

## Checked clean
- NO-GO list grounding holds where spot-checked. The wikilink-validator NO-GO is genuine: `markdown-link-integrity.yml` exists and is CI-wired (`.github/workflows/markdown-link-integrity.yml`). The destructive-loop NO-GO is genuine: the 8000-char budget is real (`handlers/quality-loop.ts:229`, 2000 tokens x 4) and the live 005 spec.md is 16793 bytes, so it would be amputated. One stale figure: that NO-GO cites the spec at 10.6KB (`research/research.md:63`) versus the live 16.4KB, which strengthens the verdict rather than weakening it.
- Truncation law and keystone confirmed: `confidence-truncation.ts:35` `DEFAULT_MIN_RESULTS = 3`, and both `SPECKIT_QUALITY_LOOP` and `SPECKIT_QUALITY_AUTO_FIX` default TRUE (`search-flags.ts:180,393`). The ROI-inversion premise that write-time bypasses the floor is sound.
- GO-on-cost reuse groundings spot-checked and present: A2 derive helper (`handlers/quality-loop.ts` `ln`), A8 provenance (`handlers/pe-gating.ts`, `lib/storage/write-provenance.ts`).
