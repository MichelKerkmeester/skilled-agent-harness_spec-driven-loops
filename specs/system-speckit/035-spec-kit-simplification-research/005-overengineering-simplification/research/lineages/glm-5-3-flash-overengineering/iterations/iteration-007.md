# Iteration 007 — Single-consumer abstractions: seams, registries, allowlists, telemetry, flags guarding nothing (KQ7)

Session: fanout-glm-5-3-flash-overengineering-1788746122749-wk19z4 | run 7 | focus: machinery whose only audience is itself — the optimizer/observability pipeline, the readerless flag, the governance-vs-machinery "retrieval" vocabulary
Evidence reads: orphan-flag greps (TS/cjs/sh, then unfiltered), observability LOC, optimizer/ tree + manifest, `optimizer/audit/` listing, `env-reference-drift.vitest.ts:295`, `golden-queries.json:27,189-191`, embeddings/rrf-fusion LOC + import census. Reads cost: 5 shell calls.

## What exists

`runtime/cli/observability/` = 2,465 LOC (smart-router-measurement 878, -telemetry 445, -analyze 357, live-session-wrapper 223) + `runtime/cli/optimizer/` (README, `optimizer-manifest.json`, `promote.cjs`, `replay-corpus.cjs`, `replay-runner.cjs`, `rubric.cjs`, `search.cjs`, `audit/`).

The retrieval-intelligence machinery lives in `shared/`: `embeddings.ts` (1,011 LOC + `providers/openai.ts`, `providers/voyage.ts`) and `algorithms/` (`rrf-fusion.ts` 842, `adaptive-fusion.ts`, `index.ts`) with `dist/` mirrors — reciprocal-rank fusion, i.e. exactly the "BM25+vector fusion" the governance clause declares "unsupported". Capability flags: `SPECKIT_EMBEDDING_CIRCUIT_BREAKER`, `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN`, `SPECKIT_CALIBRATED_OVERLAP_BONUS`, `SPECKIT_DB_DIR` — zero references in runtime TS sources; their home is `shared/` + `runtime/ENV-REFERENCE.md` + the compiled mirrors. `SPECKIT_BM25_ENGINE` — the skill's own drift test answers the question: `runtime/tests/env-reference-drift.vitest.ts:295` — "`SPECKIT_BM25_ENGINE` has no reader left in source". The governance clause (root doc, §5): "Retrieval is lexical over spec docs and skill docs… Semantic paraphrase, vector and BM25 fusion, decay, access tracking and session dedup are unsupported, and a miss is a clean no-hit."

## Findings

**F23 [P1 — clear waste, promotion tail] The optimizer/observability pipeline's output — 3 advisory-only tunable fields — has zero recorded promotions: `optimizer/audit/promotion-reports/` is an empty directory.**
- Where: `runtime/cli/observability/` (2,465 LOC) + `runtime/cli/optimizer/` (5+ scripts: `promote.cjs`, `replay-corpus.cjs`, `replay-runner.cjs`, `rubric.cjs`, `search.cjs`) + `optimizer-manifest.json` (tunable: `convergenceThreshold` 0.01–0.2, `stuckThreshold`, `maxIterations`; `promotionMode: "advisory-only"` per the config's `_optimizerManaged` block) + `optimizer/audit/promotion-reports/` = **0 files** (directory listing: `total 0`).
- Cost: 2,465+ LOC of telemetry/analysis plus a 5-script replay/promote apparatus, plus per-packet and per-lineage event ledgers (this packet: `research/observability-events.jsonl` = 52 lines; this lineage: `deep-research-audit-ledger/frames/`, `deep-research-effect-ledger/frames/`, `locks-and-fencing-v1/…/grant-journal.jsonl` — 5-6 ledger/lock files of scaffolding per lineage run) — in exchange for 3 config numbers that, by design ("advisory-only"), are never auto-applied, and which the promotion step has (on this evidence) never produced.
- Protects: future tuning of the loop parameters, "managed by the offline loop optimizer (042.000.004-042.004)" — a validated *design*; the *recorded adoption* is 0.
- Recommendation: **merge** — keep the telemetry emission + the manifest covenant (they also feed the drift guard and the performance baselines, see below), but freeze the replay/promote scripts until a second promotion actually happens; alternatively keep exactly one worked promotion-report as the documented example. (Restraint-ladder reading: the third rung — the minimum that works — is telemetry + manifest + one hand-run promotion, not a 5-script pipeline with an empty output dir.)
- Uncertainty, recorded: the replay machinery may have a non-promotion consumer — `runtime/tests/local-llm-features/performance/baselines/` exists, suggesting something produced performance baselines. I have not traced those baselines to `replay-runner.cjs` specifically; they are noted as a PLAUSIBLE consumer, not a confirmed one (UNKNOWN pending trace).

**F24 [P2 — candidate] A capability flag whose readerlessness is documented by the machinery guarding it: `SPECKIT_BM25_ENGINE` — documented nowhere in `ENV-REFERENCE.md`, exercised by 4+ golden-query fixtures, and pronounced dead by the drift test.**
- Where: `runtime/tests/env-reference-drift.vitest.ts:295` ("`SPECKIT_BM25_ENGINE` has no reader left in source, so the…"); `runtime/tests/fixtures/golden-queries.json:27,189-191` (a golden query, a fixture title, fixture content "selects auto sqlite packed-inmemory or legacy-inmemory lexical search", and a trigger, all for the readerless flag); absent from `runtime/ENV-REFERENCE.md` (the flag-reference; grep: 0 hits).
- Cost: 4+ fixture rows + 1 drift-test clause + a golden-query slot, maintained for a flag with no source reader; the doc-drift test's *comment* is the only artifact that tells a reader it is dead.
- Protects: nothing, today — it is the_F14 pattern (documentation outliving its mechanism) inside the flag reference itself, caught by their own drift machinery.
- Recommendation: **remove** the fixtures + the drift-test clause (or revive the flag) — one of the two; the drift test has already made the case.

**F25 [P2 — candidate] The word "retrieval" names two different machineries, and the governance clause documents only the cheap one: 1,853+ LOC of embeddings+RRF fusion sit behind a clause that says fusion is "unsupported".**
- Where: root governance clause (§5: "Retrieval is lexical… vector and BM25 fusion… are unsupported") vs `shared/embeddings.ts` (1,011) + `shared/algorithms/rrf-fusion.ts` (842) + `shared/embeddings/providers/{openai,voyage}.ts` + `algorithms/adaptive-fusion.ts` + 4 env flags + `runtime/ENV-REFERENCE.md`.
- Cost: one orientation expenditure per reader/auditor (this run: 3 greps to resolve which "retrieval" the clause meant); the clause is accurate for prompt-time retrieval (trigger index + ripgrep) and silent about the daemon-side machinery.
- Protects: prompt-time expectations (the miss-is-a-clean-no-hit contract) — correct and cheap.
- Recommendation: **keep** the clause; **merge** in one pointer line ("daemon-side scoring machinery: see `runtime/ENV-REFERENCE.md`") — 1 line, kills the orientation cost.

## Prose observations (not findings — census carried)

- Four quality/evaluation apparatuses now co-exist in the corpus: `runtime/tests/` (vitest), `benchmark/` (151 md / 3,461 lines), `feature-catalog/` + `manual-testing-playbook/` (85+47 files), and the optimizer's replay harness. Which of the four a skill-editor actually reruns, and whether their conventions duplicate, is the run-9 census question.
- The env-reference drift guard (`env-reference-drift.vitest.ts`) is the RIGHT machinery — a test keeping flag documentation honest, that caught the BM25 death. Its existence is the+ against F14's 5-site vocabulary debt.

## Not pursued here

- The baselines→replay-runner trace (F23 uncertainty); the advisor-side consumers (outside the evidenceBoundary — recorded as UNKNOWN, not 0).
