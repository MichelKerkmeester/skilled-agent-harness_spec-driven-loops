# Iteration 001 - Residual baseline and failure-surface classification

Focus: establish the residual baseline after the two-tool pipeline and classify the active versus archived failure surface from the packet data.

## Findings

1. **F-001 Residual baseline (post two-tool pipeline).** v3.0.0.0: active 111 of 170 pass, 59 fail, 84 error instances across 10 rule classes. v3.6.0.0: active 686 of 1007 pass, 321 fail, 519 error instances across 16 rule classes. Zero unreadable rows in either file. Derived twice: `scratch/harness/agg.cjs` and an independent per-row tally agree exactly on every count. [SOURCE: scratch/harness/data/v3.0.0.0.final.jsonl, scratch/harness/data/v3.6.0.0.pipeline.jsonl]

2. **F-002 The data files are the post-pipeline residual set.** The measured pass counts 111 and 686 reproduce the spec.md section 2 row "backfill-frontmatter then repair-derived: 111 / 686" exactly, so both JSONL files record the world after the two existing repair tools, and every finding below is a residual neither tool clears. [SOURCE: spec.md section 2 table vs data tally]

3. **F-003 Archived surface fails wholesale.** v3.0 archived: 186 of 186 fail (720 errors). v3.6 archived: 911 of 911 fail (3,527 errors). Dominant classes: GENERATED_METADATA_INTEGRITY (186 / 867), GENERATED_METADATA_DRIFT (186 / 861), and at v3.6 METADATA_DISK_PATH_CONSISTENCY (753). This matches spec.md section 2's claim that both repair tools skip archives by default. [SOURCE: data tally, spec.md section 2]

4. **F-004 The section 10 rule enumeration is incomplete.** The data contains 20 distinct rule ids. Four never appear in the section 10 list of 16: GENERATED_METADATA_DRIFT (186 archived + 8 active at v3.6), FRONTMATTER_VALID (14 archived v3.6), PLACEHOLDER_FILLED (1 + 1), GRAPH_METADATA_CHILD_IDENTITY (1). GENERATED_METADATA_DRIFT is the second largest archived class, so any route keyed only to the 16 named rules misses it. [SOURCE: spec.md section 10 vs data tally]

5. **F-005 The packet's own mechanical-fix projection does not reach REQ-002.** `classify.cjs` (its MECH pattern list is an explicit hypothesis of what deterministic fixers can clear) projects v3.0: 111 pass + 13 mechanical-only = 124 of 170 (73%), and v3.6: 686 + 167 = 853 of 1007 (85%). That leaves 46 and 154 active packets held back as "still-authored", so "every active packet passes" is unreachable under the current MECH hypothesis plus the two existing tools. The gap to REQ-002 must come from a wider transform set, validator policy, or both. [SOURCE: scratch/harness/classify.cjs output]

6. **F-006 Held-back rules concentrate in four classes and their details suggest wider mechanical reach than the MECH list credits.** Held-back counts: STATUS_CROSS_DOC_CONSISTENCY (63 v3.6 + 9 v3.0), LEVEL_MATCH (37 + 6), FILE_EXISTS (36 + 6), GREP_CONVENTION (29 + 10), then long tail. Detail samples: "spec.md Status=Not Started classified=planned" (status mapping derivable from tasks.md state), "Required file missing for Level 1: plan.md" (stub provisionable from level requirements), "Document has no frontmatter block" (frontmatter synthesizable from folder metadata). These look transformable from existing artifacts, not authored prose, but each sample is one instance of three truncated details, so per-class verdicts wait for iteration 2. [SOURCE: data details, samples above]

7. **F-007 Corpus sizes confirm the harness population.** Active/archived splits 170/186 (v3.0) and 1007/911 (v3.6) match spec.md section 2 and the handoff criteria, so the data is the full population, not a sample. [SOURCE: data tally vs spec.md sections 2 and metadata handoff criteria]

## Dead Ends

- Counting residual volume from spec.md section 2 alone: it reports pass totals but no per-rule residual classes; the per-rule surface only exists in the data.
- Treating classify.cjs's MECH list as ground truth for "mechanical": it is a projection hypothesis written by the packet author, and F-006 already shows classes it scores as authored with derivable detail patterns.

## Assessment

- newInfoRatio: 1.0. Novelty justification: first iteration of this lineage; every finding is new to this packet's research state.
- Questions considered: Q1 (baseline portion), Q2 (class inventory portion), Q4 (archive surface magnitude).
- Questions answered: none fully; Q1's enumeration gap (F-004) and the REQ-002 gap (F-005) sharpen all five questions.
- Status: complete.
