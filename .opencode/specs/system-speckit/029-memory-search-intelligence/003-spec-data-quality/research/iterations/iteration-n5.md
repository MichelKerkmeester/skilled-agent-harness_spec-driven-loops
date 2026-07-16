# Iteration N5 - LLM-as-Judge Doc-Quality Scorer plus Score-Backfill (opus, prove-first)

## TITLE

Cohort N5 metadata-artifact angle, candidate 5 (brief `stage-0-external-findings.md:41,94`). Model opus. Angle designs the 1-to-5 Likert doc-quality scorer and the Langfuse-style backfill (brief angle 6, `:65`), grounds the storage field in the real corpus, and judges its honest role under the truncation law: a write-time governance signal and a linter input, NOT a retrieval ranker unless a top-3-reordering consumer is wired.

## FINDINGS

The corpus already has TWO quality scorers and a `quality_score` column, but every one of them measures FORM, not semantic content. That is the whole gap candidate 5 fills, and it reframes X1's rank-7 "floor-mirage" verdict (`iteration-x1.md:27`).

A `quality_score REAL DEFAULT 0` column exists on `memory_index`, added by migration V15 (`vector-index-schema.ts:643,1899-1900`). When unpopulated (the corpus-wide default-0 case) the pipeline backfills it at read time with a four-term structural heuristic: +0.2 for content over 100 chars, +0.2 for any trigger phrase, +0.1 for a non-empty title, +0.1 for a non-`normal` tier (`save-quality-gate.ts:570-592`, called at `stage1-candidate-gen.ts:160`). The save-time gate's Layer-2 `scoreContentQuality` is the same family: title length, trigger count, content length, anchor count, metadata field count (`save-quality-gate.ts:603-626`, `:578-589`). The save workflow's `render_quality_score` and `input_completeness_score` are likewise lexical and noise/dedup based (`quality-scorer.ts:343,358`, `workflow.ts:1397,1902`). None of these can see whether a requirement is specific, whether a claim is grounded in a file:line, or whether the spec is complete. A 2000-char vague spec with three triggers scores HIGH on every existing scorer. That is the blind spot.

The score is NOT inert in retrieval, contra a naive reading of the truncation law. `applyValidationSignalScoring` turns `qualityScore` into `qualityFactor = 0.9 + (quality x 0.2)`, a bounded multiplier in [0.9, 1.1] over the composite score (`stage2-fusion.ts:272-276,288-289`). So a +-10 percent quality swing CAN reorder the truncated top-3 when two candidates sit within ~10 percent of each other, and it cannot when they do not. This is the honest, narrow retrieval claim the truncation law permits (`iteration-x1.md:11`): a real LLM-judge score replacing the structural backfill moves ranking only at the margin, and only after a re-score writes the column.

The "LLM-judge" already named in the repo is a decoy. `ground-truth-feedback.ts:12-20` ships a Phase-C LLM-judge that is a deterministic lexical-overlap fallback (no model call) scoring query-memory RELEVANCE for eval ground truth, not doc quality. A genuine semantic doc-quality judge is net-new.

The gate to tie into already exists. `validate.sh` runs `SPEC_DOC_SUFFICIENCY` (error severity, `validator-registry.json:88-93`) and `EVIDENCE_CITED` (`check-evidence.sh:9,35`, `validator-registry.json:43`). These are the natural hosts for a quality-floor signal: sufficiency already asserts a doc is "enough," and a Likert quality score is the semantic sharpening of exactly that assertion.

## CONCRETE CHANGE

Design (prove-first, no production edits):

1. **Rubric.** Three dimensions, each scored 1-5 Likert by one LLM pass over the doc text, plus a one-line justification per dimension (the Langfuse pattern, `stage-0-external-findings.md:65`):
   - **Specificity** (1 = vague prose like "system should handle errors"; 5 = concrete, testable, EARS-shaped clauses with named entities). This is the exact failure the template SELF-CHECK warns about but cannot enforce (`iteration-a1.md:9`).
   - **Groundedness** (1 = bare claims; 5 = load-bearing claims carry `file:line`, command, or artifact evidence, mirroring the constitutional confirmed-vs-inferred standard).
   - **Completeness** (1 = required sections empty or placeholdered; 5 = all level-required sections substantive). Reuses the level map `validate.sh` already knows.
   The doc score is `min(specificity, groundedness, completeness)` (a weakest-link floor, so one empty section caps the doc), exposed both as the raw 1-5 and as a normalized `(score-1)/4` in [0,1] to match the column's contract.

2. **Storage.** Write the normalized value into the EXISTING `memory_index.quality_score` column (`vector-index-schema.ts:643`) so it rides the already-built `validation-metadata.ts:183-188` -> `stage2-fusion.ts:272` consumer with zero new ranking plumbing. Store the three raw sub-scores plus justifications as a `quality_judge` object in `description.json` (passthrough-accepted, `description-schema.ts:69`) for the human/linter reader and for audit. Add `quality_judge.model_id`, `scored_at`, and `content_fingerprint` so a stale score is detectable.

3. **Linter / gate tie.** Surface the score in `validate.sh` as a NEW warn-tier rule alongside `SPEC_DOC_SUFFICIENCY` (`validator-registry.json:88`): warn when any dimension is <= 2, never block on score alone (warn-tier, default, graduating exactly like the save gate's 14-day warn-only window, `save-quality-gate.ts:14-18`). The score is governance and a triage signal, not a hard pass/fail.

## EVIDENCE

- Column + heuristic backfill: `vector-index-schema.ts:643,1899-1900`, `save-quality-gate.ts:570-592`, `stage1-candidate-gen.ts:160`. Structural-only save scorers: `save-quality-gate.ts:603-626`, `quality-scorer.ts:343,358`, `workflow.ts:1397,1902`.
- Score IS a ranking consumer (refines X1 rank-7): `stage2-fusion.ts:272-276,288-289` (qualityFactor [0.9,1.1]); fallback ladder `validation-metadata.ts:183-194`.
- Repo "LLM-judge" is a deterministic lexical decoy: `ground-truth-feedback.ts:12-20`.
- Gate hosts: `validator-registry.json:43,88-93`, `check-evidence.sh:9,35`.
- Storage slot: `description-schema.ts:69` (passthrough), `quality_score` row grain noted at `community-search.ts:286`; X2 row-grain claim `iteration-x2.md:17`.
- Brief: candidate 5 `stage-0-external-findings.md:41,94`; Langfuse backfill `:65`; specificity/groundedness/completeness as the LLM-as-judge axes (Databricks/RAGAS `:67`).

## READER

Primary reader is the AUTHOR and the linter at write time (adherence + logic, bypasses the floor): a 1-5 score with a per-dimension justification tells an author exactly which section is vague or ungrounded, which the current pass/fail sufficiency rule cannot. Secondary reader is the human triaging the corpus: the `quality_judge` block in `description.json` ranks remediation targets. Retrieval is a tertiary, MARGINAL reader: replacing the structural backfill in `quality_score` with a real semantic score only reorders the top-3 when candidates are within the [0.9,1.1] band, and only post-re-score. Honest role: write-time governance and linter input first; a top-3 nudge a distant second that is real but small.

## ON-WRITE OR RETROACTIVE

Both, in two arms. ON-WRITE: run the single LLM judge pass inside the save flow (next to `scoreContentQuality`, `save-quality-gate.ts:603`) so every new/updated doc gets scored and the column is written non-default at insert. RETROACTIVE: a one-time corpus backfill (the Langfuse score-backfill, `stage-0-external-findings.md:65`) iterating the ~2022 graph folders measured in X1 (`iteration-x1.md:17`), throttled and resumable, writing `quality_score` + the `description.json` block. The retroactive arm is bounded and cheap to schedule; the on-write arm is the durable governance win.

## RISK

Cost/latency is the headline caveat and it is real: one LLM pass per doc adds seconds and a token cost per save, and a full retroactive sweep is ~2022 model calls. Mitigations: (a) gate the judge behind a flag defaulting OFF for on-write and run the heuristic backfill until the judge is proven, exactly as `SPECKIT_SAVE_QUALITY_GATE` graduates (`save-quality-gate.ts:11-18`); (b) skip the LLM call when `content_fingerprint` is unchanged since the last `scored_at` (no re-judge on no-op saves); (c) batch the retroactive sweep off the hot path. Judge non-determinism: pin the model id, low temperature, force the per-dimension justification so the score is auditable not a black box. The retrieval claim stays a HYPOTHESIS until a re-score runs and an eval-v2 dual-mode read confirms the prod-mode top-3 actually moves (the same proof burden X1 sets for every retrieval candidate, `iteration-x1.md:57`); the governance and linter value, by contrast, lands the moment the first justification is written and needs no re-index to be true.
