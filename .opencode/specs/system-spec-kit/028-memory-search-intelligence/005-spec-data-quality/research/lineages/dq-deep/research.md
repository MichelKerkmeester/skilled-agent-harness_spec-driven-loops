# Research Synthesis (lineage dq-deep): Automated and Perfected Data Quality Across the Spec-Kit Surface

<!-- ANCHOR:research-index -->
This is the canonical synthesis of the `dq-deep` fan-out lineage. Where the parent packet synthesis converged on the **truncation law** and tiered the parent's ten retrieval/adherence/logic candidates, this lineage drives the angle the topic asks for: the **automation surface** — out-of-the-box on-write hooks and retroactive sweeps that auto-perfect data quality across spec docs, the two metadata JSONs, skill docs, commands, and the context-engineering layer, going beyond code fixes to refining documents. It converges nine iterations into one program. The lineage inherits the truncation law as settled: prod retrieval truncates to a 3-result floor, so retrieval candidates need a prod-mode completeRecall@3 proof while adherence, logic, and write-time candidates bypass the floor.

## 1. Executive Verdict

The single organizing finding of this lineage is the **automation asymmetry**.

The spec-kit write path has a strong, mature **gate** layer (a 38-rule validator registry) and almost no **refinement** layer for authored content — while the memory/context-engineering layer has the opposite: a **live, default-ON, verify-fix-verify quality loop with auto-fix** (`quality-loop.ts`; `SPECKIT_QUALITY_LOOP` and `SPECKIT_QUALITY_AUTO_FIX` both default TRUE at `search-flags.ts:180,393`) that the authored spec-doc and metadata-JSON surface never reaches. The best-possible automated data quality is therefore **overwhelmingly a wiring problem, not a green-field build**: extend the refinement machinery that already exists onto the surface that lacks it, then make it run continuously.

Three facts make this precise:

1. **Every authored-surface rule gates; none refine.** All 38 validator-registry rules check shape, presence, or provenance (`validator-registry.json:1-313`). None validate the *content* that drives the three reader jobs (discriminative description, distinctive triggers, EARS-shaped requirements, present summary), and none auto-fix. (KQ1, KQ4)

2. **The refinement machinery already exists — on the wrong surface.** `quality-loop.ts` scores `{triggers, anchors, budget, coherence}`, auto-fixes (it already re-extracts trigger phrases from the body via `extractTriggersFromContent:450` and trims to budget), and can reject — but only on the memory-save path. `pe-gating.ts` already computes write-provenance, encoding-intent, FSRS scheduling, and document weight. The parent's "build provenance / build a quality scorer" candidates are largely **already shipped**, just not surfaced to the JSONs or the authored docs. (KQ7, KQ8)

3. **The retrieval ceiling stays gated by the truncation law.** The only authored-surface lever that touches the dense vector is the chunk prefix: `content-normalizer.ts` strips frontmatter (step 1) and flattens headings (step 7) before embedding (`:222,228`), so the corpus's best curated signal never enters the vector. Re-injecting it is retrieval-class — floor-taxed, re-index-bound, and promotable only by a prod-mode completeRecall@3 read, exactly as the parent's CONDITIONAL tier requires. (KQ3, KQ4)

The honest headline: the program has **two on-write keystones that ship on cost** (extend the live quality loop to the authored surface; enum + schema + propagation hygiene on the JSONs), **one retroactive keystone that delivers the "most automated" property** (a standing scheduled sweep with guarded auto-fix), and **one retrieval unblocker** (port the skill corpus's benchmark+regression loop to the spec corpus, wired to prod-mode @3). Nothing in the retrieval tier promotes until that benchmark runs.

## 2. The Automated DQ Program (floor-aware tiering)

Reader tags: R retrieval, A adherence, L logic. Timing: on-write or retroactive. Every item is grounded to a file:line or to an inherited parent finding.

### Tier A - On-write, floor-bypassing, reuse existing machinery (ship on cost)

| ID | Recommendation | Reader | Grounding | Verdict |
|----|----------------|--------|-----------|---------|
| A1 | **Keystone.** Extend the live default-ON quality loop to the authored spec-doc + metadata-JSON write surface (today memory-save only), in score+suggest mode for authored docs | A, L, R(triggers) | `quality-loop.ts:103-465` already scores triggers/anchors/budget/coherence and auto-fixes; flags default TRUE (`search-flags.ts:180,393`) | GO (with RISK-1 rail) |
| A2 | Propagate curated frontmatter `trigger_phrases` -> description.json; derive a real `description` (extractive) instead of copying the title | R, L | live description.json drops triggers/type the frontmatter carries; schema allows them and is `.passthrough()` (`description-schema.ts:25-31,64-69`) | GO (deterministic) / suggest-only for LLM rung |
| A3 | Enum-constrain `importance_tier`/`status`/`content_type` in both zod schemas, borrowing the command `mutation_class` enum | L, A | both are free `z.string().min(1)` (`graph-metadata-schema.ts:43-44`); command surface already enforces an enum (`route-validate.py:18`) | GO |
| A4 | Promote `DESCRIPTION_SHAPE` / `GRAPH_METADATA_SHAPE` warn->error with real zod schemas | A, L | warn-only today (`validator-registry.json:192-206`); parent's measured unconditional GO | GO |
| A5 | Cross-surface `trigger_phrases` coherence assertion (subset/superset, not equality) | R | three divergent surfaces, no gate; `migrate-trigger-phrase-residual.ts` is the band-aid | GO (with RISK-3 rail) |
| A6 | HVR/style auto-fix linter (em-dash, prose semicolon, Oxford comma), fence-aware | L | P1 requirement REQ-003 enforced by prompt discipline only; no linter in code (grep empty) | GO (with RISK-6 rail) |
| A7 | EARS + always/ask-first/never constraint linter + REQ_COVERAGE gate reusing AC_COVERAGE | A, L | templates carry prose requirement tables, no EARS; AC_COVERAGE is a shipped instance of the rule shape | GO-on-cost |
| A8 | Surface already-computed provenance/source_kind/weight + content_type + freshness into the JSONs; freshness-bind `causal_summary` to `source_docs` | R(content_type), L, gov | `pe-gating.ts:17-24` + `write-provenance.ts` already compute these; not in the JSON schemas | GO-on-cost |

### Tier B - Retroactive, continuous (the genuinely missing layer = "most automated")

| ID | Recommendation | Reader | Grounding | Verdict |
|----|----------------|--------|-----------|---------|
| B1 | **Keystone.** Standing scheduled DQ sweep (cron/post-merge hook) running the Tier-A detectors corpus-wide, dry-run-first, batched, git-tracked, safe-fix auto-applies / risky reports | A, L, R | no scheduled/hook invocation exists today; all retroactive tools are operator-run (`doctor_memory.yaml`, backfill scripts) | GO (with RISK-4 rail) |
| B2 | Add a guarded auto-remediation tier to `/doctor` (today detect-only): safe fixes auto-apply, risky report-only; share one safe-fix engine with B1 | A, L, gov | `/doctor memory` is read-only by contract, recommends only (`doctor_memory.yaml:21-27,188-198`) | GO-on-cost |
| B3 | Retrieval-learning feedback edge: turn low-retrieval / never-retrieved signals into queued content-quality refinement actions | R, A | `learned-feedback.ts` + the quality_score fusion multiplier exist; no edge back to content | GO-on-cost |

### Tier C - Retrieval class (gated on re-index + prod-mode completeRecall@3 proof)

| ID | Recommendation | Reader | Grounding | Verdict |
|----|----------------|--------|-----------|---------|
| C1 | Header-path + curated-signal chunk prefix (re-inject what `content-normalizer` strips), behind a coverage guard + dual-cache-key fix | R | `content-normalizer.ts:222,228` strips frontmatter + flattens headings; parent CONDITIONAL | CONDITIONAL |
| C2 | **Unblocker.** Port the skill-surface benchmark+regression loop to the spec corpus, wired to prod-mode completeRecall@3 | R | skills already have `skill_advisor_bench.py` + regression + `/deep:skill-benchmark`; specs have no retrieval QA loop | CONDITIONAL (this is what promotes the rest of Tier C) |

### Tier D - NO-GO

- **Inherited:** libSQL / sqlite-vec swap, quantization tiers, Ed25519 signing, new rollup node type, LightRAG incremental merge.
- **New (this lineage):** do NOT build a second quality scorer — extend the live default-ON `quality-loop.ts`. A parallel scorer duplicates shipped machinery and risks divergent verdicts.

## 3. Cross-Cutting Findings

**The automation asymmetry.** Gate-rich authored surface, refinement-rich memory surface, and the two never meet. The whole program is the bridge between them.

**Reuse-first, again.** Every keystone maps to existing machinery: the quality loop (A1), the auto-fix trigger extractor (A2), the command mutation-class enum (A3), the zod schemas (A4), pe-gating provenance (A8), learned-feedback (B3), the skill benchmark loop (C2). The parent's reuse-first lesson holds at the program scale.

**Coverage is per-builder, not systemic.** Quality automation is rich where someone built it (the `/doctor` router, the skill advisor) and absent elsewhere (memory/spec corpus, non-doctor command families). The fix is a **uniform** quality layer, not more point checks.

**The destructive-auto-fix caution (net-negative).** The live auto-fix trims content to budget by `substring` (`quality-loop.ts:461-465`). Safe for a memory record, catastrophic for a 10KB authored spec.md. The single most important rail: on the authored surface the loop is score+suggest, and no content-removing fix auto-applies.

**Measurement honesty.** Every Tier-A/B score is a proxy. A high quality-loop score is not a retrieval win. "Perfected" is honest for adherence/logic/governance (directly enforced) and aspirational-until-measured for retrieval, which only C2's prod-mode @3 read can confirm.

## 4. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Treat DESCRIPTION_SHAPE/GRAPH_METADATA_SHAPE as sufficient quality gates | Warn-only, key-presence-only | `validator-registry.json:192-206` | 1, 3 |
| Use `/doctor memory` as a content-quality tool | Read-only by contract, index-drift scope, forbids packet-doc writes | `doctor_memory.yaml:21-27,65-83` | 2 |
| Treat existing backfill scripts as continuous automation | One-shot manual migrations, not standing sweeps | file inventory | 2 |
| Add a new metadata file / rollup node type for enrichment | The rich graph-metadata.derived record already exists; a lane duplicates it | `graph-metadata-schema.ts:40-59` | 3 |
| Use description.json `keywords` as the retrieval trigger surface | They are title word-splits, not curated phrases | live description.json | 3 |
| Use existing extractors as a doc-refinement substrate | They target session/memory-save context, not spec-doc bodies | `scripts/extractors/` | 4 |
| `check-normalizer-lint.sh` as an HVR linter | It dedups runtime normalizer helpers in code, unrelated to prose | rule listing | 4 |
| Assume skills lack quality automation | Skills have MORE than specs (benchmark+regression+graph-validate) | `skill_advisor_bench.py`, `/deep:skill-benchmark` | 5 |
| Expect a corpus-wide command linter | Only the /doctor router has a manifest validator; coverage is per-builder | `route-validate.py` | 6 |
| "No refinement layer exists" (earlier framing) | A live default-ON quality loop with auto-fix exists on memory-save | `quality-loop.ts:1-45`, `search-flags.ts:180,393` | 7 (corrects 1,4) |
| Re-implement provenance/weight from scratch | `pe-gating.ts`/`write-provenance.ts` already compute them | `pe-gating.ts:11-24` | 7 |
| Build a new quality scorer | Extend the live `quality-loop.ts` instead | `quality-loop.ts` | 8 |
| Silent auto-apply of any content-removing fix on authored docs | Destructive — `substring` budget-trim amputates docs | `quality-loop.ts:461-465` | 9 |
| Strict-equality trigger consistency | False-positives by construction (derived set capped at 12) | `graph-metadata-schema.ts:41` | 9 |
| Promote any Tier-C retrieval item on external recall@K | The K=3 floor hides that band; needs prod-mode @3 | parent truncation law | 8, 9 |

## 5. Open Questions

- Whether extending `quality-loop.ts` to the authored surface in score+suggest mode introduces unacceptable write latency on large specs (needs a timing measurement). OPEN.
- The actual corpus-wide count of docs failing each Tier-A detector (generic description, missing triggers, off-enum tier, HVR violations) — a Stage-0 baseline measurement, deferred to a build. OPEN.
- Whether C2's prod-mode completeRecall@3 benchmark, once built, promotes any Tier-C retrieval candidate. OPEN (inherited from the parent; the same single open question, now with the benchmark named as its resolver).

## 6. Convergence Report

- **Stop reason:** all_questions_answered (8/8 key questions answered with file:line grounding; program assembled and tiered; adversarial pass complete).
- **Total iterations:** 9.
- **Questions answered ratio:** 8/8 key questions; 3 open questions deferred to a build stage.
- **newInfoRatio trend:** 0.90 -> 0.82 -> 0.78 -> 0.74 -> 0.70 -> 0.55 -> 0.66 -> 0.34 -> 0.30 (descending; two insight iterations at 5 and 7).
- **Quality guards:** source diversity PASS (validator registry, two zod schemas, quality-loop, pe-gating, content-normalizer, doctor YAML, route-validate, skill advisor — independent file:line sources), focus alignment PASS, no-single-weak-source PASS.
<!-- /ANCHOR:research-index -->
