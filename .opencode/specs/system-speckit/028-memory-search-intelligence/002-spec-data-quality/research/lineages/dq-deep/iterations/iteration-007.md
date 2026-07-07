# Iteration 007 - KQ7: Context-engineering-layer automation (and a correction)

**Focus:** Context-engineering automation — assembly, retrieval, injection, prompt packs, memory write safety — and the missing quality levers.
**newInfoRatio:** 0.66
**Novelty:** Discovers a LIVE verify-fix-verify quality loop with auto-fix (default ON) on the memory-save path, correcting the earlier "no refinement layer" finding; reframes the central recommendation as extend-the-existing-loop, not build-new.
**Status:** insight

## What I examined
- `handlers/quality-loop.ts` (header + QualityScore shape) [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:1-45]
- `lib/search/search-flags.ts` flag defaults (`:180-183,393-396`) [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:180-396]
- `handlers/pe-gating.ts` (write-provenance, encoding-intent, FSRS, document-weight) [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/pe-gating.ts:1-40]
- Context-engineering surface: `memory-search.ts`, `learned-feedback.ts`, `result-explainability.ts`, `stage2-fusion.ts`, `deep-loop-runtime/lib/deep-loop/prompt-pack.ts` [SOURCE: file listing]

## Findings

### F1. CORRECTION: a live quality loop with auto-fix already exists (memory-save path)
`quality-loop.ts` is a "Verify-fix-verify memory quality loop" + "Pre-storage quality gate" (`:7-8`). It computes a `QualityScore` with breakdown `{triggers, anchors, budget, coherence}` and an `issues[]` list (`:25-36`), applies **auto-fix mutations**, and can **reject** a write with a reason (`:38-44`). Both gates default ON: `SPECKIT_QUALITY_LOOP` default TRUE and `SPECKIT_QUALITY_AUTO_FIX` default TRUE (`search-flags.ts:180,393`). This corrects iter-1 F3 / iter-4 F2: the *refinement tier is not absent* — it exists, is live, and auto-fixes. It is just **confined to the memory-save handler and to four structural dims**, never reaching the authored spec-doc / validate.sh surface or the semantic dims.

### F2. Provenance + cognitive scheduling already partly shipped
`pe-gating.ts` runs prediction-error save arbitration with `applyWriteProvenance` / `persistProvenanceMetadata` / `source_kind` (`:17-24`), an `encoding-intent` classifier (`:8-9`), an FSRS spaced-repetition scheduler, and `calculateDocumentWeight` (`:11`). So part of the parent's "provenance GO-on-cost" already exists on the memory side. The gap is exposing these as **first-class fields in the two spec metadata JSONs** (iter 3 F4), not re-implementing them.

### F3. The retrieval/injection layer learns but the corpus quality does not feed back
`learned-feedback.ts` + `result-explainability.ts` + `stage2-fusion.ts` give a learning ranker with a +/-10% quality_score fusion multiplier (parent finding). So retrieval *adapts* to usage, but there is no loop that turns "this doc ranked poorly / was never retrieved" back into a **content-quality action** on the doc. The signal exists; the corpus-improvement feedback edge is missing.

### F4. The decisive reframing
KQ7 converts the program from "build a refinement tier" to "**extend the live quality loop**":
1. Run `quality-loop.ts`'s score+auto-fix over the **authored spec-doc + metadata-JSON surface** at write time (it already scores triggers/anchors/budget/coherence — exactly the spec-doc dims), via the same default-ON flags.
2. Add the **semantic dims** the loop lacks: discriminative description, body-matches-triggers, EARS/constraint shape, enum-valid governance fields (iters 3-6).
3. Feed the retrieval learning signal (F3) back as a quality issue ("low-retrieval doc -> refine triggers/description").
This is the parent's reuse-first lesson at the program level: the highest-leverage automation is wiring the existing loop to the surface that lacks it.

### F5. Floor placement
The quality loop's triggers/description dims touch the retrieval surface (field hygiene, not floor-cut rows); its anchors/coherence/budget/enum dims are logic/adherence and bypass the floor. The retrieval-feedback edge (F3) only *recommends* refinement; the actual recall change still needs the parent's prod-mode @3 proof.

## Dead Ends / Ruled Out
- "No refinement layer exists" (earlier framing): ruled out and corrected — a live default-ON quality loop with auto-fix exists on the memory-save path.
- Re-implementing provenance/weight from scratch: ruled out — `pe-gating.ts` + `write-provenance.ts` already compute them; surface them in the JSONs instead.

## Answers
- **KQ7 answered:** Context-engineering automation is the richest tier — a live default-ON quality loop (score+auto-fix+reject), write-provenance, encoding-intent, FSRS scheduling, and a learning ranker. The gaps: the quality loop never reaches the authored spec-doc/metadata-JSON surface; it lacks semantic dims; and the retrieval-learning signal has no edge back into corpus content quality. Best move: extend the existing loop outward and add the semantic dims, rather than build new.

## Next focus
KQ8: assemble the best-possible automated DQ program, tiered by truncation-law-aware ROI.
