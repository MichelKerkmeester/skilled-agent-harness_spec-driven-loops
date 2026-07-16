# R2-30 Worth-Building (adversarial, fresh-eyes verdict)

**Angle summary:** Stepping back from the 28 phases, the buildable core is real and code-grounded, but the program's decision-facing premise overstates the K=3 cutoff and the defensible build is single-digit phases, not 28.

**Verdict in one line:** WORTH BUILDING, but only a minimal subset (004 A4, 026 engine, 001 A1, 003 A3). The retrieval tier and most novel items are correctly self-gated as unproven and should not be scaffolded as if ready.

---

## FINDINGS

### F1 — P1 — SUMMARY frames a confidence-gap FLOOR as a hard "top 3" CAP
- **Type:** SPEC-PREMISE issue
- **Evidence (premise):** `SUMMARY.md:9` states "Search only ever shows the top 3 results" and "it cuts the answer down to about three results", and explicitly says "This single rule decides whether every idea below is worth doing."
- **Evidence (live code):** `confidence-truncation.ts:35` sets `DEFAULT_MIN_RESULTS = 3` as a MINIMUM, not a cap. The function returns ALL results when count is at or below the floor (`confidence-truncation.ts:130`), when scores are uniform (`:148`), and when no gap exceeds `2 * medianGap` after index `minResults - 1` (`:166`, `:175`). Truncation fires ONLY on a relevance cliff past position 3, so the returned set is between 3 and N, frequently more than 3.
- **Why it matters for worth-building:** The plain-language SUMMARY is the doc a decision-maker reads to approve the program. Its load-bearing one-liner overstates a floor as a cap, which inflates the "retrieval work is wasted past top-3" conclusion used to deprioritize the entire Tier C slate. `research.md:8` is more careful ("3-result floor"), so the defect is in the decision-facing translation, not the synthesis.

### F2 — P1 — The headline ROI inversion rests on an unmeasured floor-fire frequency
- **Type:** SPEC-PREMISE issue
- **Evidence (premise):** `research.md:8` builds the whole tiering on "the truncation law" and cites "028 already measured a 5.9x eval-versus-prod fidelity gap on this exact corpus" to argue retrieval candidates are taxed while write-time candidates bypass the floor.
- **Evidence (live code):** Whether the floor actually cuts depends on cliff frequency, which is data-dependent (`confidence-truncation.ts:166-185`). This packet measures nothing. The instrument that would measure it (C2 prod-mode completeRecall@3, phase `015-prodmode-recall-gate`) is itself unbuilt, and `research.md:46` confirms the shipped harness "reports but performs no baseline comparison".
- **Why it matters for worth-building:** The program correctly gates retrieval BUILDS on measurement, then uses the same unmeasured premise one-directionally to justify CUTTING the retrieval tier now. The cut may well be right, but the asymmetry (measure before you build, assert before you cut) is the one place the otherwise-honest synthesis leans on an un-re-verified prior.

### F3 — P2 — Defensible buildable subset is single-digit phases, so 28 full-detail scaffolds over-invested
- **Type:** SPEC-PREMISE issue (worth-building synthesis)
- **Evidence:** Only one phase is a MEASURED unconditional GO (`spec.md:162` A4, and `research.md:29` "A4 is the only measured unconditional GO in the whole program"). Tier C (014-018) is "hypothesis-until-prod-measured" (`research.md:51`). The novel slate is mostly "GO-on-cost (thin)" or NO-GO (`research.md:79-85`). `SUMMARY.md:43` itself says the search-tuning tricks are "maybes (do not build until proven)".
- **Minimal high-value subset:** `004` A4 (free, measured), `026` shared engine (the reuse seam), `001` A1 keystone (wire live machinery to authored docs), `003` A3 enum-constrain. Defer behind a real prod@3 read: all of Tier C (014-018) and the thin novel items (`024`, `025`, plus `023` as navigation-only). Cut outright: the items the program already lists NO-GO.
- **Why it matters for worth-building:** Scaffolding all 28 to full Level-2 detail (spec+plan+tasks+checklist+summary each) front-loaded authoring cost on phases the program itself rates "do not build". The honest framing is "single-digit buildable phases plus a measurement gate", not "a 28-phase program".

### F4 — P2 (positive) — The minimal subset IS worth building: the keystone seams are real
- **Type:** LIVE-CODE confirmation
- **Evidence:** The "wiring shipped machinery" thesis holds against the tree. Quality loop is live and default-ON (`search-flags.ts:395` `isQualityLoopEnabled`, `:182` `isQualityAutoFixEnabled`, both "Default: TRUE (graduated)"). The A1 reuse targets exist: `scripts/memory/generate-context.ts` carries `atomicWriteJson`, and `scripts/core/post-save-review.ts` exports `reviewPostSaveQuality` wired through `scripts/core/workflow.ts`. The A4 gate is real and dormant: `validator-registry.json:192,200` register GRAPH_METADATA_SHAPE and DESCRIPTION_SHAPE, the zod schema exists (`graph-metadata-schema.ts`), and `validate.sh:175-180,1044` shows the `legacy_grandfathered` strict-mode bypass that A4 would retire.
- **Note on a path drift:** `research.md:18` cites the reviewer at `post-save-review.ts:573` and `workflow.ts:1854` without the `scripts/core/` prefix, and the A1 seam table reads as if these sit beside the mcp_server scorer. They live in `scripts/core/`, not `mcp_server/`. The seams are real, the directory attribution in the synthesis is loose.
- **Why it matters for worth-building:** This is the evidence that the verdict is "build the core", not "shelve it". The cheap wins are genuinely cheap because the machinery genuinely ships.

---

## What I checked and did NOT find a problem with
- The two keystone premises are CODE-CONFIRMED: the K=3 floor exists (`confidence-truncation.ts:35`) and the quality loop is default-ON (`search-flags.ts:395,182`). The program is not built on a fictional foundation.
- The A4 "free win" is real and low-risk: validation-only, schema shipped, bypass dormant. The worth-building floor is genuinely above zero.
