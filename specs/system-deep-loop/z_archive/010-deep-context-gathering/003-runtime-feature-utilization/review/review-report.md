---
title: "Deep Review Report — deep-context + deep-loop-runtime utilization (commits 1d54e45..55fd158)"
description: "10-round gpt-5.5-fast-xhigh deep review with adversarial verification; P0/P1/P2 rollup, refuted findings, and strongest-restriction verdict."
---

# Deep Review Report

<!-- ANCHOR:summary -->
## 1. Summary

**Target**: this session's deep-context (4th deep loop) + deep-loop-runtime utilization work — commits `1d54e45..55fd158`, ~28 changed code/contract files.
**Method**: 10 rounds. R1–R8 were read-only `cli-opencode openai/gpt-5.5-fast --variant xhigh` dispatches, one dimension/slice each (orchestrator-writes-state, Gate-3-safe). R9 was orchestrator-driven adversarial verification (direct code/contract inspection refuting or confirming each surviving P0/P1). R10 is this synthesis.

**Verdict (pre-remediation): FAIL.** Strongest-restriction rule — one confirmed P0 (`resolveArtifactRoot('context')`). The P0 is currently *latent* (the deep-context reducer is not wired into the loop) but becomes *live* the instant the reducer is wired, so it gates the headline parity fix.

**Headline finding (P1, architectural)**: the phase-002 reducer `deep-context/scripts/reduce-state.cjs` — which carries the atomic-state / jsonl-repair / post-dispatch-validate robustness that this whole effort added — is **never invoked by the loop YAML**. Both sibling loops wire their reducers (`deep-research` at lines 883/998, `deep-review` at 1077/1287); deep-context does not. The robustness features therefore run only in the standalone/benchmark path, not in the actual loop. The manual playbook's "25/25 PASS" verified the file's *contents* (`node --check` + `rg` for symbols), never its *invocation* — which is why this was missed and why the operator's "automatic utilization?" challenge was well-founded.

<!-- ANCHOR:tally -->
## 2. Finding tally (post-verification)

| Severity | Confirmed | Refuted/Downgraded | Notes |
|---|---|---|---|
| P0 | 1 | 4 (R7) | The 1 is latent-but-blocking; R7's 4 "P0" were host-binding false-positives |
| P1 | 13 | 3 (R7) | Includes the reducer-not-wired headline + 7 R8 doc/code mismatches |
| P2 | ~11 | — | Backlog (documented, not in the P0+hygiene+P1 fix scope) |

Severity counts are post-adversarial-verification (R9), not raw seat output.

<!-- ANCHOR:p0 -->
## 3. Confirmed P0

**P0-1 — `resolveArtifactRoot('context')` throws on child-phase packets.**
`system-spec-kit/shared/review-research-paths.cjs:14-22` — `MODE_CONFIG_FILE`/`MODE_STATE_FILE` have only `research`/`review` keys. `deep-context/scripts/reduce-state.cjs:661` calls `resolveArtifactRoot(resolvedSpecFolder, 'context')`. Root specs early-return before touching those tables (why the original smoke passed); **child-phase specs reach line 244 → `path.join(rootDir, undefined)` → `ERR_INVALID_ARG_TYPE`**. Reproduced in R1 against `134-deep-context-gathering/002-runtime-robustness-parity`.
- Live impact today: zero, because the reducer is not wired into the loop (see P1-1). Becomes loop-breaking the moment P1-1 is fixed.
- Fix: add `context: 'deep-context-config.json'` / `context: 'deep-context-state.jsonl'` to both mode tables (+ JSDoc `@param` union). Purely additive; zero risk to research/review.

<!-- ANCHOR:p1 -->
## 4. Confirmed P1

**P1-1 — phase-002 reducer not wired into the loop (headline).** `deep_start-context-loop_{auto,confirm}.yaml` never invoke `deep-context/scripts/reduce-state.cjs`. Sibling loops do. The loop instead host-writes the registry inline + `step_graph_upsert` (`upsert.cjs`). Result: atomic-state/jsonl-repair/post-dispatch-validate are not auto-utilized by the loop. Fix: add a deterministic `node …/deep-context/scripts/reduce-state.cjs {spec_folder}` refresh step before convergence in both YAMLs (mirror deep-research:883). Coupled with P0-1.

**P1-2 — `{spec_path}` unbound in lock acquire.** `deep_start-context-loop_auto.yaml:171` + `_confirm.yaml:162`: `loop-lock.cjs acquire … --packet {spec_path}`; only `spec_folder` exists in-file. Introduced this session. Fix: `{spec_folder}`.

**P1-3 — executor-audit guard env stamped but not enforced.** `deep-loop-runtime/scripts/fanout-run.cjs:452` builds the recursion-stack env via `buildExecutorDispatchEnv` but never calls `validateExecutorDispatchAllowed` (which exists at `executor-audit.ts:404` and is correctly used by the in-process dispatch paths at 587/664) before `spawn` (line 195). Introduced this session. Fix: call `validateExecutorDispatchAllowed` before spawn; reject/log blocked lineages.

**P1-4 — `dependencyCompleteness` collects the wrong edge endpoint.** `coverage-graph-signals.ts` (`computeContextSignalsFromData`) collects `edge.sourceId` for `DEPENDS_ON`/`IMPORTS`, but the authoritative contract (feature_catalog/06) documents `DEPENDS_ON: SYMBOL → DEPENDENCY` (DEPENDENCY is the **target**) and `IMPORTS: FILE → FILE` (never a DEPENDENCY endpoint). A DEPENDENCY node id is essentially never in the source set → `dependencyCompleteness` falsely low → depresses composite score / blocks STOP. `sliceCoverage`'s `sourceId` use is correct (COVERED_BY: SLICE→iteration, SLICE is source) — which is exactly why the bug is subtle. **This is on the LIVE convergence path** (the loop calls `convergence.cjs --loop-type context`). Fix: count `targetId` of `DEPENDS_ON` only; drop IMPORTS.

**P1-5 — `main()` unguarded in deep-improvement reducer.** `deep-improvement/scripts/shared/reduce-state.cjs:1326` is a bare `main();` (no `require.main === module` guard, no exports), unlike the deep-context reducer (guarded at 735, exports at 778). `require()` executes CLI logic + can `process.exit`. Fix: guard + export the API, mirroring deep-context.

**P1-6 — comment-hygiene HARD-BLOCK violations (7, introduced/committed this session).**
- `deep-improvement/scripts/shared/reduce-state.cjs`: `// M-3:` (416), `// P2 (DOCUMENT-ACCEPT, from F-P2-5):` (712), `// F-P1-5:` (900)
- `deep-improvement/scripts/shared/improvement-journal.cjs`: `Research finding (P0)` (18), `per research finding (P0)` (32), `NFR-R01` (159), `REQ-AI-003` (168)
Forbidden ID labels in code comments per the project HARD BLOCK. Fix: keep the durable WHY, strip the perishable IDs.

**P1-7 … P1-13 — R8 docs-vs-code mismatches (the docs over-claim what is wired):**
- `feature_catalog/07--runtime-robustness/loop-lock.md:22` — claims heartbeat refresh + cross-session prevention; the loop has acquire/release only, owner defaults to a short-lived pid, and `loop-lock.ts` treats dead pids as stale → advisory, not the mutual-exclusion the doc claims.
- `feature_catalog/07--runtime-robustness/executor-audit.md:3` — claims the dispatch stack is set "for each CLI seat"; the default council dispatcher (`multi-seat-dispatch.cjs`) does not stamp it, and only the `fanout-run.cjs` spawn path does (and even there the guard isn't enforced — P1-3).
- `feature_catalog/06--coverage-graph-schema/context-node-kinds-relations.md:52,53` — `COVERED_BY: SLICE → iteration` and `CONFIRMS: executor seat → …` reference node kinds (`iteration`, `executor/seat`) that don't exist in `VALID_KINDS.context`; edges require both endpoints to be coverage nodes → the documented edges can't be inserted as written.
- `feature_catalog/06--coverage-graph-schema/context-convergence-signals.md:46-49` — `reuseCatalogCoverage` (doc says ≥2 CONFIRMS; code counts ≥1 or `verified===true`), `agreementRate` (doc says relevance-gated denominator; code uses all finding nodes — see also P2), `relevanceFloor` (doc says MIN(relevance); code returns fraction ≥ gate), `dependencyCompleteness` (doc says resolved/expected-from-frontier; code does node-membership — see P1-4).
<!-- /ANCHOR: summary -->
<!-- /ANCHOR: tally -->
<!-- /ANCHOR: p0 -->
<!-- /ANCHOR: p1 -->