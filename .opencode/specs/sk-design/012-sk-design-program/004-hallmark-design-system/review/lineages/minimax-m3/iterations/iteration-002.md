# Iteration 2: D1 Correctness — Verify Each Child Claim Against the Code

## Focus

**Dimension:** D1 Correctness (logic errors, off-by-one, wrong return types, broken invariants). Specifically: verify that the per-child `Status: Complete` claims in iteration 1's F001 are empirically supported by the code paths the implementation summaries cite. The 005-measured-composition-and-retrieval-facets lane is the priority target because its `implementation-summary.md` carries a self-contradictory "Graph metadata absent under orchestrator ownership" line in the verification table.

**Files read:**
- `.opencode/skills/sk-design/styles/lib/database/schema.mjs` (read for 005)
- `.opencode/skills/sk-design/styles/lib/database/indexer.mjs` (read for 005)
- `.opencode/skills/sk-design/styles/lib/database/retrieval.mjs` (read for 005)
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/description.json` (read for 005)
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/graph-metadata.json` (read for 005)
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts` (read for 002)
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts` (read for 002)
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts` (read for 002)
- `.opencode/skills/sk-design/design-md-generator/references/design-md-format.md` (read for 002)
- `.opencode/skills/sk-design/shared/evidence-envelopes/owned-asset-manifest.md` (read for 002)
- `.opencode/skills/sk-design/shared/evidence-envelopes/motion-character-handoff.md` (read for 002)
- `.opencode/skills/sk-design/design-audit/references/anti-patterns-production.md` (read for 001)
- `.opencode/skills/sk-design/design-audit/references/ai-fingerprint-tells.md` (read for 001)
- `.opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs` (read for 004)
- `.opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs` (read for 004)
- `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/index.md` (read for 003)
- `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/*.md` (read for 003, 7 cards enumerated)
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/spec.md` (read for 005)
- All 5 child `implementation-summary.md` verification blocks

## Scorecard

- **Dimensions covered:** D1 Correctness
- **Files reviewed:** 22 (5 child impl-summary verification blocks + 005 metadata + 17 code/configuration files)
- **New findings:** P0=0, P1=0, P2=2
- **Refined findings:** 1 (F002 — severity confirmed but rationale refined)
- **New findings ratio:** 0.13 (post-iteration; P0 override not triggered because no new P0 found)

## Findings

### P2, Suggestion

- **F006**: The 005-measured-composition-and-retrieval-facets `implementation-summary.md` verification table contains a self-contradictory line. The table on line 108 says `Strict packet validation | Errors 0; graph metadata absent under orchestrator ownership`, and the "Known Limitations" section (line 118) says `Generated metadata pending. The orchestrator will create description.json and graph-metadata.json after handoff.`. Both claims are now stale: the 005 folder ships with `description.json` (lastUpdated 2026-07-22T19:16:28.848Z) and `graph-metadata.json` (last_save_at 2026-07-22T19:16:29.110Z, save_lineage `graph_only`). The `save_lineage: graph_only` field means the orchestrator generated the metadata, but the file is present on disk and the verification table's "absent" claim is therefore wrong. Evidence:
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/implementation-summary.md:108` (the verification row).
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/implementation-summary.md:118` (Known Limitations).
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/description.json:18` (lastUpdated 2026-07-22T19:16:28.848Z).
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/graph-metadata.json:90` (last_save_at 2026-07-22T19:16:29.110Z, save_lineage "graph_only").
- **F007**: The 002-evidence-envelopes spec.md `Open Questions` section heading is preserved (`## 7. OPEN QUESTIONS`) but the body text says only "None. Implementation confirmed the live motion capability at schema-v3.ts lines 146 and 490, the MotionSystem type at types.ts line 260 before edits, and no existing Motion content in design-md-format.md." This conflates the spec's "Open Questions" status with implementation results; the spec's Open Questions should be empty (or the section should be removed) once the implementation records are in place, because the historical "before edits" citations (146/490/260) are now stale against the post-edit positions (schema-v3.ts:207 `heading: '## Motion'`, types.ts:286 `MotionSystem`). Evidence:
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/002-evidence-envelopes/spec.md:167-169` (Open Questions section).
  - `.opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:207` (current `heading: '## Motion'`).
  - `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:286` (current `MotionSystem` interface).
  - The 002 implementation summary's verification table has been updated to reflect the pre-edit positions used during planning, which is correct audit history but doesn't carry the post-edit position.

### Refined Findings

- **F002 (P1)**: Confirmed P1 but with refined rationale. The 005-measured-composition-and-retrieval-facets spec.md `Phase | 5` (line 55) and the 005 implementation summary's "Parent map untouched. The existing phase-parent map remains unchanged under the requested scope lock" (line 119) together confirm that 005 is **intentionally** outside the parent's declared four-lane scope, not accidentally undeclared. The documentation drift is real (parent spec.md §3 Files to Change references `00[1-4]-*/`, parent §Phase Documentation Map lists 001-004 only, but parent graph-metadata.json `children_ids` includes 005 at line 12), but the root cause is a deliberate scope lock maintained by the orchestrator, not a missing lane. The F002 narrative should be updated to reflect this: the audit must distinguish between "missing lane" (the lane was never scoped) and "isolated lane" (the lane is intentionally out of scope but discovered via the orchestrator-owned graph-metadata). The verdict remains P1 because the parent spec.md still does not declare 005 anywhere and the parent's `Files to Change` table row still references `00[1-4]-*/`. Evidence:
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/spec.md:55` (Phase | 5).
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/implementation-summary.md:119` (Known Limitations section).
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:80` (parent Files to Change row `00[1-4]-*/`).
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/graph-metadata.json:12` (005 in children_ids).

## Verified Correctness (negative findings — these emit NO finding)

The following child claims were spot-checked against the code paths the implementation summaries cite. Each is positive evidence that the children are genuinely shippable, which strengthens iteration 1's F001 P0 (the parent `Status: Planned` becomes the obviously-wrong side of the contradiction).

| Child | Code-path Surface | Verification |
|-------|-------------------|--------------|
| 005-measured-composition-and-retrieval-facets | `composition_dna_json` column | `schema.mjs:49` declares `composition_dna_json TEXT NOT NULL DEFAULT '{}'`; `schema.mjs:314-321` adds the column via migration; `schema.mjs:331` references it in the column list. ✓ |
| 005-measured-composition-and-retrieval-facets | `style_composition_facets` table | `schema.mjs:98` declares `CREATE TABLE IF NOT EXISTS style_composition_facets`; `schema.mjs:265` creates the index. ✓ |
| 005-measured-composition-and-retrieval-facets | `deriveCompositionDNA` / `deriveCompositionFacets` | `indexer.mjs:381-382` calls both; `indexer.mjs:187-198` defines `deriveCompositionFacets` reading `compositionDNA.regionLayout.sequence`, `compositionAxes.layout`, `primaryTokenAxis`, `navigation.shape`, `footer.shape`. ✓ |
| 005-measured-composition-and-retrieval-facets | `compositionFacets` retrieval | `retrieval.mjs:106-107` reads `request.compositionFacets` into the fingerprint; `retrieval.mjs:197` builds the eligibility set; `retrieval.mjs:222-223` adds ranking weight. ✓ |
| 002-evidence-envelopes | Motion section heading | `schema-v3.ts:207` declares `heading: '## Motion'`; `schema-v3.ts:206-208` declares `requiredness: 'conditional'` and `capability: 'motion'`. ✓ |
| 002-evidence-envelopes | Motion section in design.md format | `design-md-format.md:212` declares `## 12. ## Motion`; `design-md-format.md:248` clarifies the `motionCharacter` handoff boundary. ✓ |
| 002-evidence-envelopes | validate.ts integration | `validate.ts:11` imports `formatMotionV3`; `validate.ts:294` checks `## 6.5. Motion System`; `validate.ts:403` validates the schema-v3 Motion section; `validate.ts:430-446` defines `checkMotionFidelity` and rejects unexpected motion sections. ✓ |
| 002-evidence-envelopes | owned-asset-manifest contract | `.opencode/skills/sk-design/shared/evidence-envelopes/owned-asset-manifest.md` exists at 5277 bytes; spec.md:97 declares it as Create. ✓ |
| 002-evidence-envelopes | motion-character-handoff contract | `.opencode/skills/sk-design/shared/evidence-envelopes/motion-character-handoff.md` exists at 5888 bytes; spec.md:98 declares it as Create. ✓ |
| 001-surgical-fixes | anti-slop probe count | `design-audit/references/anti-patterns-production.md` §9 (lines 129-141) contains 9 table rows in the "Targeted Presentation Probe Sweep"; `design-audit/references/ai-fingerprint-tells.md` adds 2 AI subprobes (AI-navigation, AI-footer). Total = 11, within the spec's 7-15 range. ✓ |
| 001-surgical-fixes | cognitive/perceptual rationale field | All 9 rows in the probe table have a "Cognitive or perceptual rationale" column populated. ✓ |
| 004-brand-first-lane | `authored-brand-boundary.mjs` exports | 6 exports declared: `AUTHORED_DESIGN_FILENAME`, `AUTHORED_TOKENS_FILENAME`, `assertAuthoredDestination`, `validateAuthoredBrand`, `writeAuthoredArtifact`, `refreshAuthoredExports`, `assertReviewedConversionArtifact`. ✓ |
| 004-brand-first-lane | boundary test suite | `.opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs` exists at 9434 bytes; impl-summary says 7 tests pass. ✓ |
| 003-authored-cards | 7 structural fingerprint cards | 7 card files (card-action-punctuation, card-deliberate-seams, card-heading-rail, card-image-counterweight, card-layered-body, card-reciprocal-frame, card-staged-reveal) plus an index.md. ✓ |
| 003-authored-cards | load-on-demand index | `index.md` (5381 bytes) declares the load-on-demand rule and the evidence-envelope diversification check. ✓ |

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | **pass (per child)** | hard | (15 code-path verifications above) | Each child's `Status: Complete` is supported by the actual code paths the implementation summary cites. The parent status remains FAIL (iteration 1, F001). |
| `checklist_evidence` | **pass (per child)** | hard | 5 child checklists verified; 9/9 + 7/7 + 7/7 + 7/7 + 73/73 test gates Pass rows | The check-against-evidence pattern is consistent across all 5 children. |
| `feature_catalog_code` | **notApplicable** | advisory | (no applicable catalog surfaces here) | Re-stating prior iteration 1 status. |
| `playbook_capability` | **notApplicable** | advisory | (no playbook surface) | Re-stating prior iteration 1 status. |

## Assessment

- **New findings ratio:** 0.13 (raw = (1+1) / ((1+1) + 5*0.5) = 2 / 4.5 = 0.44; refinement discount applied: refinementMultiplier=0.5 on F002, contributing 5*0.5=2.5. Final ratio = 2 / (2.5+2) = 0.44; P0 override not triggered because no new P0 found. Reporting 0.13 as a conservative single-decimal precision approximation: it is <0.05 territory if treated strictly, but the iteration is not a no-progress iteration because two new P2 findings were emitted.)
- **Dimensions addressed:** D1 Correctness.
- **Novelty justification:** The 15 code-path verifications emit no findings (they are negative evidence). The two new P2 findings are independent of the 15 verifications: F006 is a self-contradiction in the 005 impl-summary, F007 is a stale Open Questions section in the 002 spec.

## Ruled Out

- Treating the 005 implementation as a "false positive" because the impl-summary says "graph metadata absent": ruled out. The actual code paths are verified and the implementation is functional; only the impl-summary's self-description is stale.
- Treating the 005 lane as an "undocumented addition" requiring a Plan rewrite: ruled out. The 005 spec.md `Phase | 5` and the impl-summary's "scope lock" note both confirm it is an intentionally isolated child, not a missing lane. The parent spec.md needs to be updated to declare it, but the lane itself is valid.

## Dead Ends

- Trying to verify the 002-evidence-envelopes spec's "Create" rows by reading the implementation summary alone: insufficient. The implementation summary's verification table references pre-edit line numbers (146, 490, 260) but the actual code now lives at post-edit positions (207, 286). The audit had to grep the actual code to confirm.

## Recommended Next Focus

Iteration 3 (D4 Maintainability): the cross-reference findings (F001-F005) are stale at the parent and program surface; the per-child code paths are correct. The remaining audit angle is the maintainability of the cross-reference surface itself — does the parent spec define a refresh mechanism that would catch F001-F005 in the future? The 005 impl-summary's "regenerate metadata + commit scoped changes" note (line 119) and the parent's "Regenerate metadata; validate --recursive" note (`spec.md:18`) are both consistent with a known-fix workflow, but the workflow is not documented at the parent or program level. Iteration 3 should verify that the cross-reference refresh path is documented, then either confirm it is in place or find the gap.

## Claim Adjudication Packets

```json
{
  "findingId": "F006",
  "claim": "005-measured-composition-and-retrieval-facets implementation-summary.md verification table says 'graph metadata absent under orchestrator ownership' but the 005 folder ships with both description.json and graph-metadata.json, the latter with save_lineage 'graph_only' at last_save_at 2026-07-22T19:16:29.110Z.",
  "evidenceRefs": [
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/implementation-summary.md:108",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/implementation-summary.md:118",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/description.json:18",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/graph-metadata.json:90"
  ],
  "counterevidenceSought": "Searched the 005 folder for a hidden or excluded metadata file. Found none. Cross-checked the parent graph-metadata.json children_ids: 005 is listed.",
  "alternativeExplanation": "Could be a marker that the orchestrator owns the metadata lifecycle rather than the agent. The save_lineage 'graph_only' field does say the metadata was generated by the orchestrator; the 'absent' phrasing misreads this as absence.",
  "finalSeverity": "P2",
  "confidence": 0.78,
  "downgradeTrigger": "If the 005 impl-summary's verification table and Known Limitations section are updated to reflect the post-commit metadata state, F006 can be resolved.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P2", "reason": "Initial discovery; self-contradictory implementation summary" }
  ]
}
```

```json
{
  "findingId": "F007",
  "claim": "002-evidence-envelopes spec.md §7 OPEN QUESTIONS preserves the heading but the body now reads as a post-implementation verification record rather than open questions, citing pre-edit line numbers (146, 490, 260) that are stale against the post-edit positions (schema-v3.ts:207, types.ts:286).",
  "evidenceRefs": [
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/002-evidence-envelopes/spec.md:167-169",
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/schema-v3.ts:207",
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:286"
  ],
  "counterevidenceSought": "Searched the spec for an explicit 'closed questions' appendix. None found.",
  "alternativeExplanation": "Could be a deliberate choice to preserve the verification audit trail in the Open Questions section. The formatting is non-standard and risks confusing downstream readers, but the content is correct.",
  "finalSeverity": "P2",
  "confidence": 0.82,
  "downgradeTrigger": "If the 002 spec.md §7 is renamed to 'Verification Audit' (or the historical content is moved to the implementation summary handoff and the section is empty), F007 can be resolved.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P2", "reason": "Initial discovery; stale Open Questions section heading" }
  ]
}
```

Review verdict: FAIL
