---
title: Deep Research Strategy — dq-automation-impl lineage
description: Build-ready implementation deep-dive of the keystone DQ automations A1/B1/B2/B3/C2.
importance_tier: important
contextType: planning
---

# Deep Research Strategy — dq-automation-impl

## 2. TOPIC
Concrete, build-ready implementation of the five keystone data-quality automations the prior lineages NAMED but did not design at the code-seam level. The unit is an implementation design (exact files, functions, hook points, env flags, timing, rollback, risks, rollout order), not a verdict. Inherits the truncation law and the tiering as settled; does NOT re-derive what-to-do.

- A1: extend the live default-ON `quality-loop.ts` to the authored spec-doc + metadata-JSON write surface (`generate-context.ts` and `validate.sh`) — exact hook points, scorer reuse, auto-fix safety, on-write integration.
- B1: standing scheduled DQ sweep (cron or post-merge hook) with a guarded auto-fix tier — scheduler, safe-vs-risky classification, corpus-wide runner, idempotency.
- B2: `/doctor` auto-remediation tier — which detectors get safe auto-fix vs report-only.
- B3: retrieval-learning feedback edge — never-retrieved signals → queued refinement actions.
- C2: prod-mode completeRecall@3 benchmark + regression loop for the spec corpus — harness design that unblocks the retrieval tier.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] KQ1 (A1): What are the exact seams to call `runQualityLoop`/`computeMemoryQualityScore` from `generate-context.ts` and `validate.sh`? Which scorers transfer to authored docs vs which must be replaced/disabled? How is destructive auto-fix neutralized on big docs?
- [ ] KQ2 (B1): What scheduler (cron vs post-merge vs GH Actions `schedule:`/`workflow_dispatch`) fits the repo? How is safe-vs-risky fix classification encoded, and how is the corpus runner made idempotent and re-runnable?
- [ ] KQ3 (B2): Where is `/doctor`'s detector contract, and how does a guarded auto-remediation tier bolt on? Which detectors are safe-auto-fix vs report-only, and how is the shared safe-fix engine factored with B1?
- [ ] KQ4 (B3): What are the exact `learned-feedback.ts` seams and the queue/store for refinement actions? How does a never-retrieved signal become a queued action without paying the floor falsely?
- [ ] KQ5 (C2): What is the existing eval harness shape (eval-v2 dual-mode, completeRecall, eval-db), and how is a spec-corpus prod-mode completeRecall@3 benchmark + regression gate built on it? What is the fixture/threshold/CI design?
- [ ] KQ6 (cross): What is the single shared safe-fix engine + detector registry that A1/B1/B2 all consume, and what is the end-to-end rollout order across all five with rollback per stage?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Re-deriving the truncation law, the candidate tiering, the automation asymmetry, the bifurcation, or the timing-tier topology. All inherited as settled.
- Re-listing WHAT detectors should exist (prior lineages did that). This lineage designs HOW to build the named keystones.
- Shipping or committing any code. Implementation design only; no writes outside the lineage artifact dir.
- Re-spec'ing already-built+CI-wired validators (e.g. skill wikilink validator) flagged as negative knowledge by siblings.

## 5. STOP CONDITIONS
- All five keystones (A1/B1/B2/B3/C2) plus the cross-cutting shared engine and rollout have a build-ready design grounded to file:line, with timing, rollback, and risks each.
- Adversarial pass complete (each design checked against the destructive-auto-fix rail, the floor doctrine, and existing-machinery reuse).
- newInfoRatio falls below threshold or maxIterations=15 reached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- KQ1 (A1): seams = pure scorer `computeMemoryQualityScore` + non-mutating `reviewPostSaveQuality`, hooked at `generate-context.ts:398` (JSON) + `workflow.ts:1854` (body) + a `CONTENT_QUALITY` rule in `validate.sh`. `attemptAutoFix` hard-excluded.
- KQ2 (B1): scheduler = CI `schedule:`+`workflow_dispatch` PRIMARY (the empty tier) + opt-in post-merge; runner = `dq-sweep.ts` over `validate.sh --recursive`; safe-vs-risky = deny-by-default `fixClass` allow-list; idempotency = backfill dry-run + content_hash + atomic + batched.
- KQ3 (B2): a `data-quality` route modeled on `code-graph`, inverted `mutation_boundaries`/`validate_targets`, DIAGNOSE/APPLY×fixClass; B2 is the interactive front door over the B1 engine.
- KQ4 (B3): capture impressions (absent today), split never-retrieved into edge-a (bypass, write-time) vs edge-b (pays, C2-gated) by `min_rank_seen`, queue report-only refinement actions on the learned-feedback governance template.
- KQ5 (C2): `run-eval-v2.mjs` already IS the prod-mode @3 dual-mode harness; build a multi-target `spec-corpus-golden.json` + a `run-spec-recall-gate.mjs` baseline gate (skill-bench pattern). The gate is real net-new code.
- KQ6 (cross): one `dq-engine.ts` + `detector-registry.ts`, three front doors (A1/B1/B2), B3 feeds a queue, C2 is the promotion gate; 12-stage rollout with per-stage rollback, retrieval half last and C2-gated.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[Populated after iteration 1]
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[Populated after iteration 1]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach is exhausted]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[Consolidated from iteration dead-ends]
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Populated after iteration 1]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
CONVERGED (run 7). All six KQs answered with build-ready seams; adversarial pass complete. Canonical synthesis at `research.md`. No further iteration — handoff to a build stage (start at rollout Stage 0 baseline census).
<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT (inherited, settled)
- **Truncation law** (parent): prod retrieval truncates to a 3-result floor (`confidence-truncation.ts:35` `DEFAULT_MIN_RESULTS=3`, wrapped `if(!evaluationMode)` `hybrid-search.ts:2049`). Retrieval candidates pay the floor + a re-index; adherence/logic/write-time bypass it. Only a prod-mode completeRecall@3 read can promote a retrieval candidate.
- **Live quality machinery** (`quality-loop.ts`): `runQualityLoop(content, metadata, {mode})` scores `{triggers .25, anchors .30, budget .20, coherence .25}`, auto-fixes (re-extract triggers, trim-to-budget via `substring` :463-468 [DESTRUCTIVE], normalize anchors). Flags `SPECKIT_QUALITY_LOOP` + `SPECKIT_QUALITY_AUTO_FIX` default TRUE (`search-flags.ts:180,182`). Live call site: `memory-save.ts:528` advisory mode, finalizes content only when passed+fixed, atomic write w/ backup (`memory-save.ts:600+`).
- **A1/B1/B2/B3/C2 named** by `dq-deep`; **DQI scorer** (sk-doc `extract_structure.py`) named by `dq-probe`; **timing-tier topology** (5 pre-commit gates, 8 PR-time CI workflows `on: pull_request`, ZERO scheduled) + per-surface detectors named by `dq-skilldoc-cmd-ctx`. The scheduled/cron tier is the empty multiplier slot.
- **validate.sh**: bash orchestrator, rules in `scripts/rules/`, registry `validator-registry.json`, `should_run_rule` gating, JSON_MODE/STRICT_MODE, invokes TS/JS validators (spec-doc-structure, continuity-freshness, evidence-marker-lint). `legacy_grandfathered` bypass dormant (0 packets).
- **Destructive-auto-fix caution** (net-negative, `dq-deep`): `quality-loop.ts:461-465` trims by `substring` — safe for a memory record, catastrophic for a 10KB spec.md. The hard rail: on the authored surface the loop is score+suggest; no content-removing fix auto-applies.

## 13. RESEARCH BOUNDARIES
- Max iterations: 15
- Convergence threshold: 0.05
- Per-iteration budget: 14 tool calls, 15 minutes
- Progressive synthesis: true
- Write only inside the lineage artifact dir.
- Source of truth: file:line in the live repo, not external sources.
