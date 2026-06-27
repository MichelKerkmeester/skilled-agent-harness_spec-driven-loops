# R2-17 — Spec Seam Accuracy

**Angle:** documentation / spec-seam-accuracy. Spot-check the `file:line` seam citations in 005 phase specs against the live code tree to catch drift.

**Method:** Extracted every code `path:line` citation across the 28 phase `spec.md` files, then verified ~30 of them in 9 phases (001-a1, 002-a2, 003-a3, 007-a7, 009-a9, 014-c1, 017-c4, 022, 024) against the real tree under `.opencode/skills/system-spec-kit/` plus `.opencode/commands/doctor/scripts/`.

**Verdict:** The slice is overwhelmingly clean. Every cited file exists at its stated path and the cited line numbers are exact against live code. Only one off-by-one citation found, plus one loose range start. The tree has NOT drifted away from these research citations.

---

## FINDINGS

### FINDING 1 — P2 — 003-a3 cites the `type` field one line above its real location
- **Severity:** P2 advisory
- **Type:** SPEC-PREMISE issue (a doc citation points to the wrong line for the named field, the live field is one line below)
- **Evidence (spec):** `003-enum-constrain-schemas/spec.md:65` reads "The description schema carries `type` as a bare `z.string().optional()` (`description-schema.ts:64`)".
- **Evidence (live):** `mcp_server/lib/description/description-schema.ts:64` is `title: z.string().optional(),` and `description-schema.ts:65` is `type: z.string().optional(),`. The named `type` field is at line 65, line 64 holds `title`.
- **Note:** The substantive premise still holds, `type` IS a bare optional free string, so this is a one-line citation slip not a false claim. Low impact because 005 is research-only and nothing reads this line. A future implementer following the citation lands on `title` instead of `type`.

### FINDING 2 — P2 — 017-c4 seam range starts inside the doc comment, not at the function def
- **Severity:** P2 advisory (low confidence, arguably acceptable)
- **Type:** SPEC-PREMISE issue (range boundary precision)
- **Evidence (spec):** `017-metadata-fusion/spec.md:63` cites `stage2-fusion.ts:261-289` as the validation-signal scoring seam.
- **Evidence (live):** `mcp_server/lib/search/pipeline/stage2-fusion.ts:264` is `function applyValidationSignalScoring(results: PipelineRow[])`, lines 261-263 are the tail of the preceding doc comment. The cited range opens 3 lines early.
- **Note:** Including the doc comment in a seam range is common and the range still captures the real multiplier body (264-289). Flagged only for completeness, not a real defect.

### FINDING 3 — CLEAN — the remaining seam citations are exact, no tree drift
- **Severity:** none (clean-slice evidence)
- **Type:** LIVE-CODE verification (citations match the real tree)
- **Evidence, each confirmed exact against live code:**
  - `001-a1`: `quality-loop.ts:392` = `function computeMemoryQualityScore(`, `:582` = `function runQualityLoop(`, `:747` export; `post-save-review.ts:573` = `export function reviewPostSaveQuality(`; `generate-context.ts:398` = `function atomicWriteJson(`, `:587` = sole `atomicWriteJson(graphFile, updated)` call (grep confirms 2 total occurrences, def + 1 call), `:885` = `await runWorkflow({`; `workflow.ts:1683` and `:1720` = the two `savePFD(...)` (savePerFolderDescription) call sites, `:1854` = the `reviewPostSaveQuality` import+call block.
  - `002-a2`: `folder-discovery.ts:455-461` = the Pass 1 first-`# `-heading loop, `:872-902` = `generatePerFolderDescription` record build with no `trigger_phrases` key, `:54` = `trigger_phrases?: string[];`; `description-schema.ts:66` = `trigger_phrases: stringArraySchema.optional();` `quality-loop.ts:515` = `return triggers.slice(0, 8); // Cap at 8 triggers`.
  - `003-a3`: `graph-metadata-schema.ts:43-44` = `importance_tier`/`status` as `z.string().min(1)`, `:50` = `save_lineage: z.enum(SAVE_LINEAGE_VALUES).optional()`; `graph-metadata-parser.ts:170-181` = the status-normalization switch; `route-validate.py:48` = `VALID_MUTATING = {"read-only", "add-only", "mutates"}`, `:13` = assertion E text, both exact.
  - `007-a7`: `check-ac-coverage.sh:84-85` = awk fence-aware parsing, `:193-196` = the `total -eq 0` no-op gate, `:177-224` = the coverage computation block; `validate.sh:92` = registry-unavailable notice, `:636` = `type run_check ... || continue` in the registry loop, `:664-666` = rule-script validation before sourcing.
  - `009-a9`: `vector-index-queries.ts:1524` = `export function verify_integrity(`, `content-id.ts:14` = `export function hashContentBody(`, `lib/storage/checkpoints.ts:2145` = the `'content_hash'` column (distinct file from `handlers/checkpoints.ts`, both exist, the cited storage file is 3366 lines so :2145 is in range).
  - `014-c1`: `content-normalizer.ts:216-231` = `normalizeContentForEmbedding` body, `embedding-cache.ts:157` = `PRIMARY KEY (content_hash, profile_key, input_kind, model_id, dimensions)`, `shared/embeddings.ts:309-311` = `getCacheKey`.
  - `017-c4`: `stage2-fusion.ts:157` = `function clampMultiplier(`, `confidence-truncation.ts:35` = `const DEFAULT_MIN_RESULTS = 3;`.
  - `022`: `hybrid-search.ts:2051` = `truncateByConfidence(` call, `:2073` = close of the truncation block, `:2078` = `if (reranked.length > 0)` trace-metadata mapping, `:1757` = `collapseAndReassembleChunkResults(`, `:2069` = the truncation catch.
  - `024`: `tier-classifier.ts:325-328` = `calculateRetrievability` + `classifyState` + return, `:39-41` = `STATE_THRESHOLDS` HOT/WARM/COLD; `composite-scoring.ts:299` = `export function calculateRetrievabilityScore(`, `:357` = the FSRS retrievability formula.
- **Conclusion:** No stale citation found in this set. The seams the research recorded are still where the specs say they are.

---

## SLICE SUMMARY
- **P0:** 0
- **P1:** 0
- **P2:** 2 (one real off-by-one in 003-a3, one cosmetic range-start in 017-c4)
- **Most important finding:** 003-a3 cites the `type` field at `description-schema.ts:64` but `type` lives at line 65 (line 64 is `title`). A one-line slip in an otherwise exact citation set, SPEC-PREMISE only, no live-code defect.
