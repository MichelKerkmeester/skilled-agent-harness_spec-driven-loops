# Iteration 009 - Adversarial / risk pass (gap-close before synthesis)

**Focus:** Stress the program — net-negative risks, destructive auto-fix, false signal, double-counting, blast radius — before synthesis.
**newInfoRatio:** 0.30
**Novelty:** Surfaces the destructive-auto-fix hazard (budget trim truncates authored docs), the false-summary retrieval hazard, the consistency-equality false-positive, and the corpus-wide sweep blast radius; sets the safety rails that make the program shippable.
**Status:** complete

## Risks found

### RISK-1 (net-negative, high): extending the quality loop's AUTO-FIX to authored docs is destructive
`quality-loop.ts` auto-fix trims content to budget by `fixedContent.substring(0, DEFAULT_CHAR_BUDGET)` (`:461-465`). That is safe for a small memory record but **catastrophic for an authored spec.md** (this packet's spec.md is ~10KB) — it would silently amputate the document mid-write. **Rail:** on the authored surface, A1 runs in **score + suggest** mode; only non-destructive fixes (frontmatter<->JSON propagation, enum normalization, HVR punctuation) auto-apply. Budget-trim and any content-removing fix are report-only for authored docs. The loop's `rejected` path must also be downgraded to warn for authored docs so it never blocks a human write.

### RISK-2 (false signal, medium): auto-derived description can be worse than the title-copy
A2 replaces a title-copy `description` with a derived summary. The `description` field is retrieval-weighted, so a **wrong** auto-summary actively mis-ranks (a false positive is worse than a neutral title-copy). **Rail:** deterministic extractive summary (first executive-summary sentence) may auto-apply; any LLM-rewrite rung is **suggest-then-confirm**, never silent. This keeps A2 floor-safe (field hygiene, no new rows) and avoids injecting confident-but-wrong signal.

### RISK-3 (false-positive gate, medium): trigger_phrase "consistency" is not equality
graph-metadata.derived.trigger_phrases is capped at 12 (`graph-metadata-schema.ts:41`) and frontmatter may carry fewer; description.json may be a curated subset. Strict equality (A5) would fire constantly. **Rail:** assert **subset/superset coherence** (every frontmatter phrase appears in the derived set; no orphan derived phrase absent from source), not byte equality.

### RISK-4 (blast radius, high): the corpus-wide sweep (B1) is a single-run corruption vector
A buggy auto-fix in a scheduled sweep mutates the entire corpus in one cron tick. **Rail:** B1 is **dry-run-first, batched, git-tracked** (every fix is a revertible commit), **safe-fix-only auto-apply**, risky-report-only — mirroring the parent's staged-rollout safety property (no gate reaches error before its backfill clears).

### RISK-5 (inherited, high): the chunk prefix (C1) confounds under partial coverage
Mixing prefixed and unprefixed vectors under the 3-result floor confounds the delta (parent Stage 5). **Rail:** coverage guard must reach 100% under the new embedding_context_version before any recall number is trusted; dual-cache-key fix folded into BOTH the persistent PK and the in-process LRU or the prefix silently no-ops.

### RISK-6 (HVR auto-fix corner, low): punctuation auto-fix must skip code/quotes
A6 must not rewrite em-dashes/semicolons inside code fences or quoted literals. **Rail:** reuse `content-normalizer.ts`'s fence-aware parsing; fix prose ranges only.

## Double-counting check (clean)
A2 (propagate/fill triggers), A5 (assert consistency), C1 (embed triggers into the vector) all touch trigger_phrases but are **complementary**: fill vs verify vs embed. No double count. A3 (enum) and A4 (schema warn->error) are paired, not duplicate (A3 defines the enum, A4 enforces shape). B2 (doctor auto-remediation) and B1 (scheduled sweep) overlap in auto-fix but differ in trigger (operator-run vs scheduled) — keep one shared safe-fix engine, two entry points.

## Measurement-honesty caution
Every Tier-A/B score is a **proxy**. A high quality-loop score is NOT a retrieval win. The only ground truth for retrieval is prod-mode completeRecall@3 (C2). A release reviewer must read the prod-mode column, or they repeat the 028 saturation mistake. "Perfected data quality" is honest for adherence/logic/governance (directly enforced) and **aspirational-until-measured** for retrieval.

## Dead Ends / Ruled Out
- Silent auto-apply of any content-removing fix on authored docs: ruled out — destructive (RISK-1).
- Strict-equality trigger consistency: ruled out — false-positives by construction (RISK-3).

## Answers
- **Gap-close complete.** The program is shippable with six safety rails; the keystones (A1, B1) carry the highest blast radius and get the strictest rails (score+suggest for authored docs; dry-run/batched/git-tracked for the sweep).

## Next focus
Converge: all 8 key questions answered + program assembled + adversarial pass done + newInfoRatio trend diminishing. Proceed to synthesis.
